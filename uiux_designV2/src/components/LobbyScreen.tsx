import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Copy, Check, ArrowLeft, Crown, Users } from "lucide-react";
import { useState } from "react";

interface Player {
  id: string;
  name: string;
  isHost: boolean;
}

interface LobbyScreenProps {
  roomCode: string;
  players: Player[];
  isHost: boolean;
  onStartGame: () => void;
  onLeave: () => void;
}

export function LobbyScreen({ roomCode, players, isHost, onStartGame, onLeave }: LobbyScreenProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[var(--game-bg-gradient-start)] via-[var(--game-bg-gradient-end)] to-[var(--game-purple-dark)] flex flex-col p-3 sm:p-4 overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 right-10 w-32 h-32 rounded-full bg-[var(--game-cyan)]/20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-2xl w-full mx-auto relative z-10 flex-1 flex flex-col min-h-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 sm:mb-3 flex-shrink-0"
        >
          <Button
            onClick={onLeave}
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/10 h-8 sm:h-10 text-sm"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Leave
          </Button>
        </motion.div>

        {/* Room Code Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 shadow-2xl mb-2 sm:mb-3 flex-shrink-0"
        >
          <div className="text-center">
            <p className="text-white/60 text-xs sm:text-sm mb-1 sm:mb-2">Room Code</p>
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <motion.div
                className="text-3xl sm:text-4xl md:text-5xl font-black text-white"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ backgroundSize: "200% auto" }}
              >
                {roomCode}
              </motion.div>
            </div>
            <Button
              onClick={handleCopy}
              variant="outline"
              className="bg-white/5 border-white/30 text-white hover:bg-white/20 h-8 sm:h-10 text-xs sm:text-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Copy Code
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Players List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-white/20 shadow-2xl mb-2 sm:mb-3 flex-1 min-h-0 flex flex-col"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3 flex-shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--game-cyan)]" />
              <h3 className="text-white text-sm sm:text-base md:text-lg">Players ({players.length}/8)</h3>
            </div>
            <Badge className="bg-[var(--game-green)] text-white border-0 text-xs sm:text-sm px-2 py-0.5">
              Waiting
            </Badge>
          </div>

          <div className="space-y-1.5 sm:space-y-2 flex-1 min-h-0">
            {players.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div 
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-lg sm:text-xl flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${
                      ['#EC4899', '#8B5CF6', '#06B6D4', '#F59E0B', '#10B981', '#EF4444'][index % 6]
                    }, ${
                      ['#F97316', '#7C3AED', '#0EA5E9', '#FBBF24', '#059669', '#DC2626'][index % 6]
                    })`
                  }}
                >
                  👤
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-white font-medium text-sm sm:text-base truncate">{player.name}</span>
                    {player.isHost && (
                      <Badge className="bg-[var(--game-yellow)] text-black border-0 flex items-center gap-0.5 sm:gap-1 text-xs px-1.5 py-0">
                        <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span className="hidden sm:inline">Host</span>
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[var(--game-green)] animate-pulse flex-shrink-0" />
              </motion.div>
            ))}

            {/* Empty slots - reduced count for mobile */}
            {Array.from({ length: Math.max(0, Math.min(2, 4 - players.length)) }).map((_, index) => (
              <motion.div
                key={`empty-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-white/5 rounded-xl sm:rounded-2xl border border-dashed border-white/20"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white/30" />
                </div>
                <span className="text-white/40 text-xs sm:text-sm">Waiting...</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Start Button */}
        {isHost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex-shrink-0"
          >
            <Button
              onClick={onStartGame}
              disabled={players.length < 3}
              className="w-full h-11 sm:h-12 md:h-14 bg-gradient-to-r from-[var(--game-green)] to-[var(--game-cyan)] hover:from-[var(--game-green)]/90 hover:to-[var(--game-cyan)]/90 text-white shadow-xl shadow-green-500/30 border-0 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base md:text-lg"
            >
              {players.length < 3 ? "Need 3+ players" : "Start Game!"}
            </Button>
          </motion.div>
        )}

        {!isHost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center text-white/60 text-xs sm:text-sm py-2 sm:py-3 flex-shrink-0"
          >
            Waiting for host to start...
          </motion.div>
        )}
      </div>
    </div>
  );
}