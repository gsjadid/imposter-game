import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Target, CheckCircle2, Clock, LogOut } from "lucide-react";
import { useState } from "react";

interface Player {
  id: string;
  name: string;
  isAlive: boolean;
  hasVoted?: boolean; // Track if player has voted
}

interface VotingScreenProps {
  players: Player[];
  currentPlayerId: string;
  onVote: (playerId: string) => void;
  timeRemaining: number;
  onLeaveGame?: () => void;
}

export function VotingScreen({
  players,
  currentPlayerId,
  onVote,
  timeRemaining,
  onLeaveGame,
}: VotingScreenProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  const alivePlayers = players.filter(p => p.isAlive && p.id !== currentPlayerId);

  // Calculate vote statistics
  const votedPlayers = players.filter(p => p.hasVoted);
  const totalPlayers = players.filter(p => p.isAlive).length;
  const voteCount = votedPlayers.length;

  const handleConfirmVote = () => {
    if (selectedPlayer) {
      setHasVoted(true);
      onVote(selectedPlayer);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-dynamic-screen w-full bg-gradient-to-br from-[var(--game-bg-gradient-start)] via-[var(--game-bg-gradient-end)] to-[var(--game-purple-dark)] flex flex-col p-3 sm:p-4 overflow-hidden relative">
      {/* Leave Game Button */}
      {onLeaveGame && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20"
        >
          <Button
            onClick={onLeaveGame}
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10 h-8 sm:h-9"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            Leave
          </Button>
        </motion.div>
      )}

      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-40 h-40 rounded-full bg-[var(--game-orange)]/20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-2xl w-full mx-auto relative z-10 flex-1 flex flex-col justify-center min-h-0">
        <AnimatePresence mode="wait">
          {!hasVoted ? (
            <motion.div
              key="voting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full"
            >
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-3 sm:mb-4 flex-shrink-0"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="inline-block mb-2 sm:mb-3"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[var(--game-orange)] to-[var(--game-red)] flex items-center justify-center shadow-xl">
                    <Target className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                  </div>
                </motion.div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1 sm:mb-2">Voting Time!</h2>
                <p className="text-white/70 text-sm sm:text-base">Who's the imposter?</p>

                {/* Vote Counter */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-3 sm:mt-4"
                >
                  <div className="inline-flex flex-col items-center gap-2">
                    {/* Vote count badge */}
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="px-3 py-1 bg-gradient-to-r from-[var(--game-cyan)] to-[var(--game-purple)] rounded-full"
                        animate={{
                          scale: voteCount > 0 ? [1, 1.1, 1] : 1,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-white text-xs sm:text-sm">
                          {voteCount}/{totalPlayers} Voted
                        </span>
                      </motion.div>
                    </div>

                    {/* Who voted badges */}
                    {votedPlayers.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {votedPlayers.map((player, idx) => (
                          <motion.div
                            key={player.id}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <Badge
                              variant="secondary"
                              className="bg-white/10 text-white border-white/20 text-xs px-2 py-0.5"
                            >
                              ✓ {player.name}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>

              {/* Players to vote for */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-1.5 sm:space-y-2 mb-2 sm:mb-3 flex-1 min-h-0"
              >
                {alivePlayers.map((player, index) => {
                  const isSelected = selectedPlayer === player.id;
                  return (
                    <motion.button
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      onClick={() => setSelectedPlayer(player.id)}
                      className={`w-full p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all ${isSelected
                        ? "bg-white/20 border-white/50 shadow-xl scale-[1.02]"
                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                        }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl flex-shrink-0"
                          style={{
                            background: `linear-gradient(135deg, ${['#EC4899', '#8B5CF6', '#06B6D4', '#F59E0B', '#10B981', '#EF4444'][index % 6]
                              }, ${['#F97316', '#7C3AED', '#0EA5E9', '#FBBF24', '#059669', '#DC2626'][index % 6]
                              })`,
                          }}
                        >
                          👤
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-white text-sm sm:text-base md:text-lg">{player.name}</p>
                        </div>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--game-green)]" />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* Confirm Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex-shrink-0"
              >
                <Button
                  onClick={handleConfirmVote}
                  disabled={!selectedPlayer}
                  className="w-full h-11 sm:h-12 md:h-14 bg-gradient-to-r from-[var(--game-orange)] to-[var(--game-red)] hover:from-[var(--game-orange)]/90 hover:to-[var(--game-red)]/90 text-white shadow-xl shadow-orange-500/30 border-0 disabled:opacity-50 text-sm sm:text-base md:text-lg"
                >
                  {selectedPlayer ? "Confirm Vote" : "Select a Player"}
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="voted"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                className="inline-block mb-4 sm:mb-6"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[var(--game-green)] to-[var(--game-cyan)] flex items-center justify-center shadow-2xl">
                  <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white" />
                </div>
              </motion.div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 sm:mb-3">Vote Submitted!</h2>
              <p className="text-white/70 text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
                Waiting for others...
              </p>

              {/* Loading animation */}
              <div className="flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white/50"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}