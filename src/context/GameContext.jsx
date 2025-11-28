import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscribeToRoom, removePlayer, deleteRoom } from '../services/roomService';
import { startGame, markPlayerReady, submitOutcome, nextRound, castVote } from '../services/gameService';

import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const GameContext = createContext();

export const useGame = () => {
  return useContext(GameContext);
};

export const GameProvider = ({ children }) => {
  const [roomId, setRoomId] = useState(localStorage.getItem('roomId'));
  const [playerId, setPlayerId] = useState(localStorage.getItem('playerId'));
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        console.log("Waiting for anonymous auth...");
      } else {
        console.log("Authenticated as:", currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Only subscribe if we have a roomId AND we are authenticated
    if (roomId && user) {
      setLoading(true);
      const unsubscribe = subscribeToRoom(roomId, (data, err) => {


        if (err) {
          setError(err.message);
          setLoading(false);
          return;
        }

        if (data) {
          setRoomData(data);
        } else {
          console.warn('GameContext: Room data is null');
          setRoomData(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [roomId, user]);

  const joinGame = (newRoomId, newPlayerId) => {
    setRoomData(null); // Clear old data immediately
    setLoading(true); // Start loading immediately
    setRoomId(newRoomId);
    setPlayerId(newPlayerId);
    localStorage.setItem('roomId', newRoomId);
    localStorage.setItem('playerId', newPlayerId);
  };

  const leaveGame = async () => {
    if (roomId && playerId) {
      try {
        // If host, delete room? Or just leave?
        // User asked for "terminate session", so Host deletes.
        const isHost = roomData?.players.find(p => p.id === playerId)?.isHost;
        if (isHost) {
          await deleteRoom(roomId);
        } else {
          await removePlayer(roomId, playerId);
        }
      } catch (e) {
        console.error("Error leaving game:", e);
      }
    }
    setRoomId(null);
    setPlayerId(null);
    setRoomData(null);
    localStorage.removeItem('roomId');
    localStorage.removeItem('playerId');
    window.location.reload();
  };

  const currentPlayer = roomData?.players.find(p => p.id === playerId);

  const gameActions = {
    startGame: (targetPlayers) => startGame(roomId, roomData.players, { targetPlayers }),
    markReady: () => markPlayerReady(roomId, roomData.players, playerId),
    submitOutcome: (outcome) => submitOutcome(roomId, outcome),
    nextRound: () => nextRound(roomId, roomData.gameConfig.round, roomData.players),
    castVote: (accusedId) => castVote(roomId, playerId, accusedId)
  };

  const value = {
    roomId,
    playerId,
    roomData,
    currentPlayer,
    loading,
    error,
    joinGame,
    leaveGame,
    ...gameActions
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
