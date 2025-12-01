import { updateRoomStatus, updatePlayerStatus, createRoom, joinRoom } from './roomService.js';
import { WORD_PACKS } from '../data/wordPacks.js';
import { doc, updateDoc, serverTimestamp, getDoc, runTransaction } from 'firebase/firestore';
import { db } from '../firebase.js';

export { createRoom, joinRoom };



export const startGame = async (roomId, players, config) => {
    // 1. Assign Roles
    const shuffledPlayers = [...players].sort(() => 0.5 - Math.random());
    const imposterIndex = Math.floor(Math.random() * shuffledPlayers.length);

    const updatedPlayers = shuffledPlayers.map((p, index) => ({
        ...p,
        role: index === imposterIndex ? 'IMPOSTER' : 'CIVILIAN',
        isReady: false
    }));

    // 2. Pick Word
    const pack = WORD_PACKS.General; // TODO: Use config to select pack
    const wordData = pack[Math.floor(Math.random() * pack.length)];

    // 3. Update Room
    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, {
        status: 'SETUP',
        players: updatedPlayers,
        'gameConfig.word': wordData.word,
        'gameConfig.hint': wordData.hint,
        'gameConfig.imposterId': updatedPlayers[imposterIndex].id,
        'gameConfig.round': 1,
        votes: {}, // Reset votes
        votingRequests: [], // Reset voting requests
        winner: null, // Reset winner
        votedOutId: null, // Reset voted out player
        updatedAt: serverTimestamp()
    });
};

export const markPlayerReady = async (roomId, players, playerId) => {
    const roomRef = doc(db, 'rooms', roomId);

    try {
        await runTransaction(db, async (transaction) => {
            const roomDoc = await transaction.get(roomRef);
            if (!roomDoc.exists()) throw "Document does not exist!";

            const data = roomDoc.data();
            const currentPlayers = data.players;

            // Update player status
            const updatedPlayers = currentPlayers.map(p =>
                p.id === playerId ? { ...p, isReady: true } : p
            );

            const updates = { players: updatedPlayers };

            // Check if all players are ready
            if (updatedPlayers.every(p => p.isReady)) {
                updates.status = 'DISCUSSION';
                updates.discussionEndTime = Date.now() + 180000; // 3 minutes
            }

            transaction.update(roomRef, updates);
        });
    } catch (e) {
        console.error("Transaction failed: ", e);
        throw e;
    }
};

export const submitOutcome = async (roomId, outcome) => {
    await updateRoomStatus(roomId, 'RESOLUTION', {
        outcome: outcome
    });
};

export const nextRound = async (roomId, currentRound, players) => {
    // Logic for next round (keep roles or shuffle? usually keep roles for same word, but new word needs new roles? 
    // User said: "Next round (if no decision yet)." -> implied same word, same roles.
    // User also said: "If outcome = No decision... If rounds left: Start another Clue Phase"

    await updateRoomStatus(roomId, 'CLUE', {
        'gameConfig.round': currentRound + 1,
        players: players.map(p => ({ ...p, isReady: false })), // Reset ready status
        votes: {}, // Clear votes for next round
        votingRequests: [] // Clear voting requests
    });
};

export const castVote = async (roomId, playerId, accusedId) => {
    const roomRef = doc(db, 'rooms', roomId);

    try {
        const result = await runTransaction(db, async (transaction) => {
            const roomDoc = await transaction.get(roomRef);
            if (!roomDoc.exists()) throw "Document does not exist!";

            const data = roomDoc.data();
            const currentVotes = data.votes || {};

            // Update vote
            currentVotes[playerId] = accusedId;

            transaction.update(roomRef, { votes: currentVotes });

            return {
                voteCount: Object.keys(currentVotes).length,
                playerCount: data.players.length,
                status: data.status,
                imposterId: data.gameConfig.imposterId,
                players: data.players,
                currentVotes: currentVotes
            };
        });



        // Only resolve if we are still in VOTING phase and everyone has voted
        if (result.status === 'VOTING' && result.voteCount === result.playerCount) {

            await resolveGame(roomId, result.players, result.currentVotes, result.imposterId);
        }
    } catch (e) {
        console.error("Transaction failed: ", e);
    }
};

export const skipVote = async (roomId, playerId) => {
    await castVote(roomId, playerId, 'SKIP');
};

const resolveGame = async (roomId, players, votes, imposterId) => {
    // Count votes
    const voteCounts = {};
    Object.values(votes).forEach(vote => {
        if (vote !== 'SKIP') {
            voteCounts[vote] = (voteCounts[vote] || 0) + 1;
        }
    });

    // Find player with most votes
    let maxVotes = 0;
    let votedOutId = null;
    Object.entries(voteCounts).forEach(([pid, count]) => {
        if (count > maxVotes) {
            maxVotes = count;
            votedOutId = pid;
        }
    });

    // Determine winner
    let winner = 'IMPOSTER'; // Default if no one voted out or wrong person
    if (votedOutId === imposterId) {
        winner = 'CIVILIAN';
    }

    await updateRoomStatus(roomId, 'RESOLUTION', {
        winner: winner,
        votedOutId: votedOutId
    });
};

export const voteToStartVoting = async (roomId, playerId) => {
    const roomRef = doc(db, 'rooms', roomId);

    try {
        await runTransaction(db, async (transaction) => {
            const roomDoc = await transaction.get(roomRef);
            if (!roomDoc.exists()) throw "Document does not exist!";

            const data = roomDoc.data();
            const votingRequests = data.votingRequests || [];

            if (!votingRequests.includes(playerId)) {
                const newVotingRequests = [...votingRequests, playerId];

                const updates = { votingRequests: newVotingRequests };

                // Check if all players have requested voting
                // We compare against total players in the room
                if (newVotingRequests.length >= data.players.length) {
                    updates.status = 'VOTING';
                }

                transaction.update(roomRef, updates);
            }
        });
    } catch (e) {
        console.error("Transaction failed: ", e);
        throw e;
    }
};
