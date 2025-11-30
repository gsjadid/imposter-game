import { ReactNode } from 'react';

export interface GameContextType {
    roomId: string | null;
    playerId: string | null;
    roomData: any; // Replace with proper type if available
    currentPlayer: any; // Replace with proper type
    loading: boolean;
    error: any;
    joinGame: (roomId: string, playerName: string) => void;
    leaveGame: () => void;
    startGame: (targetPlayers?: any) => void;
    markReady: () => void;
    submitOutcome: (outcome: any) => void;
    nextRound: () => void;
    castVote: (accusedId: string) => void;
}

export const GameProvider: React.FC<{ children: ReactNode }>;
export const useGame: () => GameContextType;
