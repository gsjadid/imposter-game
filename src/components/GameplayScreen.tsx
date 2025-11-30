import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Eye, Clock, Users, Shield, Sparkles, MessageCircle, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

interface Player {
  id: string;
  name: string;
  isAlive: boolean;
  votedOut?: boolean;
}

interface GameplayScreenProps {
  players: Player[];
  currentPlayerId: string;
  word?: string;
  role: "civilian" | "imposter";
  timeRemaining: number;
  onVote: () => void;
  hint?: string; // Hint for imposters
  onLeaveGame?: () => void;
}

export function GameplayScreen({
  players,
  currentPlayerId,
  word,
  role,
  timeRemaining,
  onVote,
  hint,
  onLeaveGame,
}: GameplayScreenProps) {
  const [showWord, setShowWord] = useState(true);
  const [showHint, setShowHint] = useState(true);
  const isImposter = role === "imposter";
  const alivePlayers = players.filter(p => p.isAlive);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[var(--game-bg-gradient-start)] via-[var(--game-bg-gradient-end)] to-[var(--game-purple-dark)] flex flex-col p-2 sm:p-3 md:p-4 overflow-hidden relative">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[var(--game-cyan)]/20 blur-3xl"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-4xl w-full mx-auto relative z-10 flex-1 flex flex-col min-h-0">
        {/* Leave Game Button */}
        {onLeaveGame && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-2 sm:mb-3 flex-shrink-0"
          >
            <Button
              onClick={onLeaveGame}
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/10 h-8 sm:h-10 text-xs sm:text-sm px-2 sm:px-3"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              Leave
            </Button>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-2 sm:mb-3 flex-shrink-0"
        >
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {/* Timer */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-xl px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-white/20">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--game-cyan)]" />
              <span className="text-xs sm:text-sm text-white font-medium">{formatTime(timeRemaining)}</span>
            </div>

            {/* Players alive */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-xl px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-white/20">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--game-green)]" />
              <span className="text-white text-xs sm:text-sm font-medium">{alivePlayers.length} Players</span>
            </div>

            {/* Role Badge */}
            <div
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-white/20"
              style={{
                background: isImposter
                  ? `linear-gradient(135deg, var(--game-red), var(--game-orange))`
                  : `linear-gradient(135deg, var(--game-cyan), var(--game-green))`,
              }}
            >
              {isImposter ? (
                <>
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  <span className="text-white text-xs sm:text-sm font-medium">Imposter</span>
                </>
              ) : (
                <>
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  <span className="text-white text-xs sm:text-sm font-medium">Civilian</span>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* Word Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-2 sm:mb-3 flex-shrink-0"
        >
          <div
            className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3 sm:p-4 md:p-6 border border-white/20 shadow-2xl text-center relative overflow-hidden"
            style={{
              borderColor: isImposter ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255, 255, 255, 0.2)',
            }}
          >
            {!isImposter && (
              <motion.div
                className="absolute top-0 left-0 w-full h-1"
                style={{
                  background: `linear-gradient(90deg, var(--game-cyan), var(--game-green))`,
                }}
              />
            )}
            {isImposter && (
              <motion.div
                className="absolute top-0 left-0 w-full h-1"
                style={{
                  background: `linear-gradient(90deg, var(--game-red), var(--game-orange))`,
                }}
              />
            )}

            <div className="mb-2">
              <p className="text-white/60 text-xs sm:text-sm">
                {isImposter ? "You are the Imposter" : "Your word"}
              </p>
            </div>

            {isImposter ? (
              <div className="space-y-2">
                {hint ? (
                  <motion.div
                    animate={showHint ? {
                      scale: [1, 1.02, 1],
                    } : {}}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="mb-2">
                      <p className="text-white/60 text-xs sm:text-sm mb-2">Your Hint</p>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 sm:mb-3">
                        {showHint ? hint : "••••"}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowHint(!showHint)}
                      className="text-white/60 hover:text-white hover:bg-white/10 h-7 sm:h-8 text-xs sm:text-sm"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      {showHint ? "Hide" : "Show"}
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="inline-block"
                    >
                      <div className="text-4xl sm:text-5xl md:text-6xl">🎭</div>
                    </motion.div>
                    <p className="text-white/70 text-xs sm:text-sm">
                      Figure out the word!
                    </p>
                  </>
                )}
              </div>
            ) : (
              <motion.div
                animate={showWord ? {
                  scale: [1, 1.02, 1],
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-2 sm:mb-3">
                  {showWord ? word : "••••"}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowWord(!showWord)}
                  className="text-white/60 hover:text-white hover:bg-white/10 h-7 sm:h-8 text-xs sm:text-sm"
                >
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  {showWord ? "Hide" : "Show"}
                </Button>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Discussion Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-2 sm:mb-3 flex-shrink-0"
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-white/10">
            <h3 className="text-white text-xs sm:text-sm mb-1.5 flex items-center gap-1.5">
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--game-cyan)]" />
              Discussion Phase
            </h3>
            <p className="text-white/70 text-xs leading-relaxed">
              {isImposter
                ? "🎭 Use your hint to blend in! Say words related to it while trying to guess the exact word from others."
                : "💬 Say synonyms or related words to your word. Listen carefully to spot who seems unsure!"}
            </p>
          </div>
        </motion.div>

        {/* Players Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-2 sm:mb-3 flex-1 min-h-0"
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-white/10 h-full flex flex-col">
            <h3 className="text-white text-xs sm:text-sm mb-2 flex items-center gap-1.5 flex-shrink-0">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              Players
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 sm:gap-2">
              {players.map((player, index) => {
                const isCurrentPlayer = player.id === currentPlayerId;
                return (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className={`p-2 rounded-lg border ${isCurrentPlayer
                        ? "bg-white/10 border-white/30"
                        : "bg-white/5 border-white/10"
                      } ${!player.isAlive && "opacity-40"}`}
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div
                        className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm sm:text-base flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${['#EC4899', '#8B5CF6', '#06B6D4', '#F59E0B', '#10B981', '#EF4444'][index % 6]
                            }, ${['#F97316', '#7C3AED', '#0EA5E9', '#FBBF24', '#059669', '#DC2626'][index % 6]
                            })`,
                        }}
                      >
                        👤
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs truncate">
                          {player.name}
                          {isCurrentPlayer && " (You)"}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Vote Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex-shrink-0"
        >
          <Button
            onClick={onVote}
            className="w-full h-10 sm:h-11 md:h-12 bg-gradient-to-r from-[var(--game-orange)] to-[var(--game-red)] hover:from-[var(--game-orange)]/90 hover:to-[var(--game-red)]/90 text-white shadow-xl shadow-orange-500/30 border-0 text-sm sm:text-base"
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
            Start Voting
          </Button>
        </motion.div>


      </div>
    </div>
  );
}