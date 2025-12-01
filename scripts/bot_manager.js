/* eslint-env node */
/* global process */
import { db, auth } from '../src/firebase.js';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { joinRoom } from '../src/services/roomService.js';
import { markPlayerReady, castVote, voteToStartVoting } from '../src/services/gameService.js';

const args = process.argv.slice(2);
const roomId = args[0];
const botCount = parseInt(args[1]) || 1;

if (!roomId) {
    console.error("Usage: node scripts/bot_manager.js <ROOM_ID> [BOT_COUNT]");
    process.exit(1);
}

const bots = [];

class Bot {
    constructor(index) {
        this.name = `Bot-${index + 1}`;
        this.id = null;
        this.unsubscribe = null;
        this.hasVoted = false;
        this.hasRequestedVote = false;
    }

    async join() {
        try {
            console.log(`${this.name} joining...`);
            const result = await joinRoom(roomId, this.name);
            this.id = result.playerId;
            console.log(`${this.name} joined with ID: ${this.id}`);
            this.listen();
        } catch (error) {
            console.error(`${this.name} failed to join:`, error.message);
        }
    }

    listen() {
        const roomRef = doc(db, 'rooms', roomId);
        this.unsubscribe = onSnapshot(roomRef, async (snapshot) => {
            if (!snapshot.exists()) {
                console.log(`${this.name}: Room deleted.`);
                process.exit(0);
            }

            const data = snapshot.data();
            await this.handleUpdate(data);
        });
    }

    async handleUpdate(data) {
        const myPlayer = data.players.find(p => p.id === this.id);
        if (!myPlayer) return;

        // 1. Auto Ready in SETUP or CLUE phase
        if ((data.status === 'SETUP' || data.status === 'CLUE') && !myPlayer.isReady) {
            console.log(`${this.name} marking ready...`);
            try {
                await markPlayerReady(roomId, data.players, this.id);
            } catch (e) {
                console.error(`${this.name} error marking ready:`, e.message);
            }
        }

        // 2. Auto Request Vote in DISCUSSION phase
        if (data.status === 'DISCUSSION') {
            const votingRequests = data.votingRequests || [];
            if (!this.hasRequestedVote && !votingRequests.includes(this.id)) {
                this.hasRequestedVote = true;
                const delay = Math.random() * 10000 + 5000; // 5-15 seconds
                console.log(`${this.name} will request to vote in ${Math.round(delay / 1000)}s`);

                setTimeout(async () => {
                    try {
                        console.log(`${this.name} requesting to vote...`);
                        await voteToStartVoting(roomId, this.id);
                    } catch (e) {
                        console.error(`${this.name} error requesting vote:`, e.message);
                    }
                }, delay);
            }
        } else {
            this.hasRequestedVote = false;
        }

        // 3. Auto Vote in VOTING phase
        if (data.status === 'VOTING') {
            if (!this.hasVoted) {
                this.hasVoted = true; // Prevent spamming
                const delay = Math.random() * 5000 + 2000; // 2-7 seconds delay
                console.log(`${this.name} will vote in ${Math.round(delay / 1000)}s`);

                setTimeout(async () => {
                    try {
                        // Pick random player to vote (excluding self, maybe?)
                        // For simplicity, pick random player
                        const otherPlayers = data.players.filter(p => p.id !== this.id);
                        const target = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];

                        console.log(`${this.name} voting for ${target.name}`);
                        await castVote(roomId, this.id, target.id);
                    } catch (e) {
                        console.error(`${this.name} error voting:`, e.message);
                    }
                }, delay);
            }
        } else {
            this.hasVoted = false; // Reset for next round/phase
        }
    }
}

let botsStarted = false;

console.log("Waiting for authentication...");
onAuthStateChanged(auth, (user) => {
    if (user && !botsStarted) {
        botsStarted = true;
        console.log(`Authenticated as ${user.uid}. Starting ${botCount} bots for room ${roomId}...`);

        // Start bots
        for (let i = 0; i < botCount; i++) {
            const bot = new Bot(i);
            bots.push(bot);
            // Stagger joins slightly
            setTimeout(() => bot.join(), i * 500);
        }
    }
});

// Keep process alive
setInterval(() => { }, 1000);
