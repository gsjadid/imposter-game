import { db } from '../firebase.js';
import { doc, setDoc, getDoc, updateDoc, deleteDoc, onSnapshot, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { generateRoomCode, generatePlayerId } from '../utils/helpers.js';

const ROOM_COLLECTION = 'rooms';

export const createRoom = async (hostName, targetPlayers) => {
    const roomId = generateRoomCode();
    const playerId = generatePlayerId();

    const roomData = {
        roomId,
        status: 'LOBBY',
        players: [{
            id: playerId,
            name: hostName,
            role: null,
            isReady: false,
            isHost: true
        }],
        gameConfig: {
            targetPlayers: targetPlayers ? parseInt(targetPlayers) : 10,
            word: null,
            hint: null,
            imposterId: null,
            round: 1
        },
        createdAt: serverTimestamp()
    };

    await setDoc(doc(db, ROOM_COLLECTION, roomId), roomData);
    return { roomId, playerId };
};

export const joinRoom = async (roomId, playerName) => {
    const roomRef = doc(db, ROOM_COLLECTION, roomId);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) {
        throw new Error('Room not found');
    }

    const roomData = roomSnap.data();

    if (roomData.status !== 'LOBBY') {
        throw new Error('Game already started');
    }

    if (roomData.players.length >= roomData.gameConfig.targetPlayers) {
        throw new Error('Room is full');
    }

    const playerId = generatePlayerId();
    const newPlayer = {
        id: playerId,
        name: playerName,
        role: null,
        isReady: false,
        isHost: false
    };

    await updateDoc(roomRef, {
        players: arrayUnion(newPlayer)
    });

    return { roomId, playerId };
};

export const subscribeToRoom = (roomId, callback) => {
    const roomRef = doc(db, ROOM_COLLECTION, roomId);
    return onSnapshot(roomRef, (doc) => {
        if (doc.exists()) {
            callback(doc.data());
        } else {
            callback(null);
        }
    }, (error) => {
        console.error("Error subscribing to room:", error);
        callback(null, error);
    });
};

export const updateRoomStatus = async (roomId, status, updates = {}) => {
    const roomRef = doc(db, ROOM_COLLECTION, roomId);
    await updateDoc(roomRef, {
        status,
        ...updates
    });
};

export const updatePlayerStatus = async (roomId, players) => {
    const roomRef = doc(db, ROOM_COLLECTION, roomId);
    await updateDoc(roomRef, { players });
};

export const removePlayer = async (roomId, playerId) => {
    const roomRef = doc(db, ROOM_COLLECTION, roomId);
    const roomSnap = await getDoc(roomRef);
    if (!roomSnap.exists()) return;

    const players = roomSnap.data().players.filter(p => p.id !== playerId);
    await updateDoc(roomRef, { players });
};

export const deleteRoom = async (roomId) => {
    const roomRef = doc(db, ROOM_COLLECTION, roomId);
    await deleteDoc(roomRef);
};
