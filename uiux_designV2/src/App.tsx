import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { HomeScreen } from "./components/HomeScreen";
import { JoinGameScreen } from "./components/JoinGameScreen";
import { LobbyScreen } from "./components/LobbyScreen";
import { RoleRevealScreen } from "./components/RoleRevealScreen";
import { GameplayScreen } from "./components/GameplayScreen";
import { VotingScreen } from "./components/VotingScreen";
import { ResultsScreen } from "./components/ResultsScreen";

type GameState = 
  | "home"
  | "join"
  | "lobby"
  | "roleReveal"
  | "gameplay"
  | "voting"
  | "results";

interface Player {
  id: string;
  name: string;
  role?: "civilian" | "imposter";
  isHost: boolean;
  isAlive: boolean;
  votedOut?: boolean;
}

// Mock data for demo
const WORDS = ["PIZZA", "GUITAR", "SUNSET", "COFFEE", "OCEAN", "ROCKET", "DRAGON", "PENCIL"];
const HINTS = ["Food", "Musical Instrument", "Sky Phenomenon", "Beverage", "Body of Water", "Space Vehicle", "Mythical Creature", "Writing Tool"];

function App() {
  const [gameState, setGameState] = useState<GameState>("home");
  const [roomCode, setRoomCode] = useState("");
  const [currentPlayerId] = useState("player1");
  const [currentPlayerRole, setCurrentPlayerRole] = useState<"civilian" | "imposter">("civilian");
  const [currentWord, setCurrentWord] = useState("");
  const [currentHint, setCurrentHint] = useState("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(180); // 3 minutes
  const [gameWinner, setGameWinner] = useState<"civilians" | "imposter">("civilians");
  const [votedOutPlayer, setVotedOutPlayer] = useState<Player | undefined>();

  // Initialize demo players
  const initializePlayers = (isHost: boolean, playerName: string) => {
    const demoPlayers: Player[] = [
      { id: "player1", name: playerName, isHost, isAlive: true },
      { id: "player2", name: "Alex", isHost: false, isAlive: true },
      { id: "player3", name: "Jordan", isHost: false, isAlive: true },
      { id: "player4", name: "Casey", isHost: false, isAlive: true },
      { id: "player5", name: "Morgan", isHost: false, isAlive: true },
    ];
    setPlayers(demoPlayers);
  };

  const assignRoles = () => {
    // Randomly select imposter
    const imposterIndex = Math.floor(Math.random() * players.length);
    const updatedPlayers = players.map((player, index) => ({
      ...player,
      role: index === imposterIndex ? "imposter" as const : "civilian" as const,
    }));
    setPlayers(updatedPlayers);
    
    // Set current player role
    const currentPlayer = updatedPlayers.find(p => p.id === currentPlayerId);
    if (currentPlayer?.role) {
      setCurrentPlayerRole(currentPlayer.role);
    }

    // Select random word and hint
    const wordIndex = Math.floor(Math.random() * WORDS.length);
    const word = WORDS[wordIndex];
    const hint = HINTS[wordIndex];
    setCurrentWord(word);
    setCurrentHint(hint);
  };

  const handleCreateGame = () => {
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    setRoomCode(code);
    initializePlayers(true, "You");
    setGameState("lobby");
  };

  const handleJoinGame = (code: string, playerName: string) => {
    setRoomCode(code);
    initializePlayers(false, playerName);
    setGameState("lobby");
  };

  const handleStartGame = () => {
    assignRoles();
    setGameState("roleReveal");
  };

  const handleContinueFromReveal = () => {
    setGameState("gameplay");
  };

  const handleStartVoting = () => {
    setGameState("voting");
  };

  const handleVote = (playerId: string) => {
    // Simulate voting results
    setTimeout(() => {
      const votedPlayer = players.find(p => p.id === playerId);
      if (votedPlayer) {
        setVotedOutPlayer(votedPlayer);
        
        // Determine winner
        if (votedPlayer.role === "imposter") {
          setGameWinner("civilians");
        } else {
          setGameWinner("imposter");
        }
      }
      setGameState("results");
    }, 2000);
  };

  const handlePlayAgain = () => {
    setGameState("lobby");
    setPlayers(players.map(p => ({ ...p, isAlive: true, votedOut: false, role: undefined })));
    setTimeRemaining(180);
  };

  const handleBackToHome = () => {
    setGameState("home");
    setPlayers([]);
    setRoomCode("");
    setCurrentWord("");
    setCurrentHint("");
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {gameState === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HomeScreen
              onCreateGame={handleCreateGame}
              onJoinGame={() => setGameState("join")}
            />
          </motion.div>
        )}

        {gameState === "join" && (
          <motion.div
            key="join"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <JoinGameScreen
              onJoin={handleJoinGame}
              onBack={() => setGameState("home")}
            />
          </motion.div>
        )}

        {gameState === "lobby" && (
          <motion.div
            key="lobby"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <LobbyScreen
              roomCode={roomCode}
              players={players}
              isHost={players.find(p => p.id === currentPlayerId)?.isHost || false}
              onStartGame={handleStartGame}
              onLeave={handleBackToHome}
            />
          </motion.div>
        )}

        {gameState === "roleReveal" && (
          <motion.div
            key="roleReveal"
            initial={{ opacity: 0, rotateY: -90 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 90 }}
            transition={{ duration: 0.5 }}
          >
            <RoleRevealScreen
              role={currentPlayerRole}
              word={currentPlayerRole === "civilian" ? currentWord : undefined}
              hint={currentPlayerRole === "imposter" ? currentHint : undefined}
              onContinue={handleContinueFromReveal}
            />
          </motion.div>
        )}

        {gameState === "gameplay" && (
          <motion.div
            key="gameplay"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
          >
            <GameplayScreen
              players={players}
              currentPlayerId={currentPlayerId}
              word={currentPlayerRole === "civilian" ? currentWord : undefined}
              hint={currentPlayerRole === "imposter" ? currentHint : undefined}
              role={currentPlayerRole}
              timeRemaining={timeRemaining}
              onVote={handleStartVoting}
            />
          </motion.div>
        )}

        {gameState === "voting" && (
          <motion.div
            key="voting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <VotingScreen
              players={players}
              currentPlayerId={currentPlayerId}
              onVote={handleVote}
              timeRemaining={30}
            />
          </motion.div>
        )}

        {gameState === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            <ResultsScreen
              winner={gameWinner}
              players={players}
              votedOutPlayer={votedOutPlayer}
              word={currentWord}
              onPlayAgain={handlePlayAgain}
              onHome={handleBackToHome}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;