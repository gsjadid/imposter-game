import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowLeft, LogIn } from "lucide-react";
import { useState } from "react";

interface JoinGameScreenProps {
  onJoin: (roomCode: string, playerName: string) => void;
  onBack: () => void;
}

export function JoinGameScreen({ onJoin, onBack }: JoinGameScreenProps) {
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomCode.trim() && playerName.trim()) {
      onJoin(roomCode.toUpperCase(), playerName);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[var(--game-bg-gradient-start)] via-[var(--game-bg-gradient-end)] to-[var(--game-purple-dark)] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-[var(--game-pink)]/20 blur-3xl"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-md w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl"
        >
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block mb-4"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--game-cyan)] to-[var(--game-purple)] flex items-center justify-center shadow-xl">
                <LogIn className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h2 className="text-3xl font-black text-white mb-2">Join Game</h2>
            <p className="text-white/60">Enter the room code to play</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-white/80 text-sm mb-2 block">Your Name</label>
              <Input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="h-14 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[var(--game-cyan)] focus:ring-[var(--game-cyan)]/20 rounded-xl"
                maxLength={20}
              />
            </div>

            <div>
              <label className="text-white/80 text-sm mb-2 block">Room Code</label>
              <Input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="XXXX"
                className="h-14 bg-white/5 border-white/20 text-white placeholder:text-white/40 text-center text-2xl font-black tracking-widest focus:border-[var(--game-cyan)] focus:ring-[var(--game-cyan)]/20 rounded-xl uppercase"
                maxLength={6}
              />
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={!roomCode.trim() || !playerName.trim()}
                className="w-full h-14 bg-gradient-to-r from-[var(--game-cyan)] to-[var(--game-purple)] hover:from-[var(--game-cyan)]/90 hover:to-[var(--game-purple)]/90 text-white shadow-xl shadow-cyan-500/30 border-0 disabled:opacity-50 text-lg"
              >
                Join Lobby
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
