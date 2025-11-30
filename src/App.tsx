import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HomeScreen } from "./components/HomeScreen";
import { JoinGameScreen } from "./components/JoinGameScreen";
import { CreateGameScreen } from "./components/CreateGameScreen";
import { LobbyScreen } from "./components/LobbyScreen";
import { RoleRevealScreen } from "./components/RoleRevealScreen";
import { GameplayScreen } from "./components/GameplayScreen";
import { VotingScreen } from "./components/VotingScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { useGame } from "./context/GameContext";
import { updateRoomStatus } from "./services/roomService";

function App() {
    const {
        roomData,
        loading,
        joinGame,
        leaveGame,
        startGame,
        markReady,
        castVote,
        currentPlayer,
        roomId
    } = useGame();

    // Local state for screens
    const [showJoinScreen, setShowJoinScreen] = useState(false);
    const [showCreateScreen, setShowCreateScreen] = useState(false);

    // Derived state
    const gameState = roomData?.status || "HOME";

    // Map roomData players to UI players
    const players = roomData?.players?.map((p: any) => ({
        id: p.id,
        name: p.name,
        isHost: p.isHost,
        isAlive: true, // TODO: Implement elimination logic if needed
        votedOut: false, // TODO: Implement voted out logic
        role: p.role === 'IMPOSTER' ? 'imposter' : 'civilian',
        hasVoted: roomData.votes && roomData.votes[p.id] ? true : false
    })) || [];

    const handleCreateGame = async (playerName: string) => {
        const { createRoom } = await import("./services/gameService");
        try {
            const { roomId, playerId } = await createRoom(playerName);
            joinGame(roomId, playerId);
            setShowCreateScreen(false);
        } catch (error) {
            console.error("Failed to create room:", error);
        }
    };

    const handleJoinGame = async (code: string, playerName: string) => {
        const { joinRoom } = await import("./services/gameService");
        // Error handling is done in JoinGameScreen
        const { roomId, playerId } = await joinRoom(code, playerName);
        joinGame(roomId, playerId);
        setShowJoinScreen(false);
    };

    // Timer logic
    const [timeRemaining, setTimeRemaining] = useState(0);

    useEffect(() => {
        if (roomData?.discussionEndTime) {
            const updateTimer = () => {
                const remaining = Math.max(0, Math.ceil((roomData.discussionEndTime - Date.now()) / 1000));
                setTimeRemaining(remaining);
            };

            updateTimer(); // Initial call
            const interval = setInterval(updateTimer, 1000);
            return () => clearInterval(interval);
        }
    }, [roomData?.discussionEndTime]);

    const handleStartGame = () => {
        // startGame expects targetPlayers (optional)
        startGame();
    };

    const handleStartVoting = async () => {
        if (roomId) {
            await updateRoomStatus(roomId, 'VOTING');
        }
    };

    const handlePlayAgain = () => {
        // Re-start game with same players
        if (roomId && roomData) {
            startGame();
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="h-dynamic-screen flex items-center justify-center bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    // Determine current screen
    // If no roomData, we are at Home, Join, or Create
    // If roomData, we are in a game state

    return (
        <div className="h-dynamic-screen w-full relative overflow-hidden bg-gradient-to-br from-[var(--game-bg-gradient-start)] via-[var(--game-bg-gradient-end)] to-[var(--game-purple-dark)]">
            <AnimatePresence mode="sync">
                {!roomData && !showJoinScreen && !showCreateScreen && (
                    <motion.div
                        key="home"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0"
                    >
                        <HomeScreen
                            onCreateGame={() => setShowCreateScreen(true)}
                            onJoinGame={() => setShowJoinScreen(true)}
                        />
                    </motion.div>
                )}

                {!roomData && showCreateScreen && (
                    <motion.div
                        key="create"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0"
                    >
                        <CreateGameScreen
                            onCreate={handleCreateGame}
                            onBack={() => setShowCreateScreen(false)}
                        />
                    </motion.div>
                )}

                {!roomData && showJoinScreen && (
                    <motion.div
                        key="join"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0"
                    >
                        <JoinGameScreen
                            onJoin={handleJoinGame}
                            onBack={() => setShowJoinScreen(false)}
                        />
                    </motion.div>
                )}

                {roomData && gameState === 'LOBBY' && (
                    <motion.div
                        key="lobby"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0"
                    >
                        <LobbyScreen
                            roomCode={roomId || ""}
                            players={players}
                            isHost={currentPlayer?.isHost || false}
                            onStartGame={handleStartGame}
                            onLeave={leaveGame}
                        />
                    </motion.div>
                )}

                {roomData && gameState === 'SETUP' && (
                    <motion.div
                        key="setup"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0"
                    >
                        <RoleRevealScreen
                            role={currentPlayer?.role === 'IMPOSTER' ? 'imposter' : 'civilian'}
                            word={roomData.gameConfig?.word}
                            hint={roomData.gameConfig?.hint}
                            onContinue={() => markReady()}
                        />
                    </motion.div>
                )}

                {roomData && (gameState === 'DISCUSSION' || gameState === 'CLUE') && (
                    <motion.div
                        key="gameplay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0"
                    >
                        <GameplayScreen
                            players={players}
                            currentPlayerId={currentPlayer?.id || ""}
                            word={roomData.gameConfig?.word}
                            hint={roomData.gameConfig?.hint}
                            role={currentPlayer?.role === 'IMPOSTER' ? 'imposter' : 'civilian'}
                            timeRemaining={timeRemaining}
                            onVote={handleStartVoting}
                            onLeaveGame={leaveGame}
                        />
                    </motion.div>
                )}

                {roomData && gameState === 'VOTING' && (
                    <motion.div
                        key="voting"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0"
                    >
                        <VotingScreen
                            players={players}
                            currentPlayerId={currentPlayer?.id || ""}
                            onVote={(targetId) => castVote(targetId)}
                            timeRemaining={30} // TODO: Sync timer
                            onLeaveGame={leaveGame}
                        />
                    </motion.div>
                )}

                {roomData && gameState === 'RESOLUTION' && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0"
                    >
                        <ResultsScreen
                            winner={roomData.winner === 'CIVILIAN' ? 'civilians' : 'imposter'}
                            players={players}
                            votedOutPlayer={players.find((p: any) => p.id === roomData.votedOutId)}
                            word={roomData.gameConfig?.word}
                            onPlayAgain={handlePlayAgain}
                            onHome={leaveGame}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
