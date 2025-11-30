import { motion } from "motion/react";
import { useMemo } from "react";
import { Button } from "./ui/button";

import { Home, RotateCcw, Drama } from "lucide-react";

interface Player {
  id: string;
  name: string;
  role: "civilian" | "imposter";
  votedOut?: boolean;
}

interface ResultsScreenProps {
  winner: "civilians" | "imposter";
  players: Player[];
  votedOutPlayer?: Player;
  word: string;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function ResultsScreen({
  winner,
  players,
  word,
  onPlayAgain,
  onHome,
}: ResultsScreenProps) {
  const civilianWon = winner === "civilians";
  const imposterPlayer = players.find(p => p.role === "imposter");

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[var(--game-bg-gradient-start)] via-[var(--game-bg-gradient-end)] to-[var(--game-purple-dark)] flex flex-col p-3 sm:p-4 overflow-hidden relative">
      {/* Animated celebratory background - reduced count */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {useMemo(() => {
          return [...Array(10)].map((_, i) => {
            const style = {
              background: ['#EC4899', '#8B5CF6', '#06B6D4', '#F59E0B', '#10B981'][i % 5],
              left: `${Math.random() * 100}%`,
              top: `-10%`,
            };
            const transition = {
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "linear" as const,
            };
            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full"
                style={style}
                animate={{
                  y: ["0vh", "110vh"],
                  rotate: [0, 360],
                  opacity: [1, 0],
                }}
                transition={transition}
              />
            );
          });
        }, [])}
      </div>

      <div className="max-w-2xl w-full mx-auto relative z-10 flex-1 flex flex-col justify-center min-h-0">
        {/* Winner Announcement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="text-center mb-3 sm:mb-4 flex-shrink-0"
        >
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="inline-block mb-2 sm:mb-3"
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full blur-3xl"
                style={{
                  background: civilianWon
                    ? `linear-gradient(135deg, var(--game-cyan), var(--game-green))`
                    : `linear-gradient(135deg, var(--game-red), var(--game-orange))`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div
                className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full flex items-center justify-center shadow-2xl"
                style={{
                  background: civilianWon
                    ? `linear-gradient(135deg, var(--game-cyan), var(--game-green))`
                    : `linear-gradient(135deg, var(--game-red), var(--game-orange))`,
                }}
              >
                <Drama className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black mb-1 sm:mb-2 bg-clip-text text-transparent"
            style={{
              backgroundImage: civilianWon
                ? `linear-gradient(135deg, var(--game-cyan), var(--game-green))`
                : `linear-gradient(135deg, var(--game-red), var(--game-orange))`,
            }}
          >
            {civilianWon ? "CIVILIANS WIN!" : "IMPOSTER WINS!"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/70 text-xs sm:text-sm md:text-base"
          >
            {civilianWon
              ? "The imposter has been caught!"
              : "The imposter deceived everyone!"}
          </motion.p>
        </motion.div>

        {/* Game Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-white/20 shadow-2xl mb-2 sm:mb-3 flex-shrink-0"
        >
          <div className="space-y-2 sm:space-y-3">
            {/* The Word */}
            <div className="bg-white/5 rounded-xl sm:rounded-2xl p-2 sm:p-3 text-center">
              <p className="text-white/60 text-xs mb-1">The Word Was:</p>
              <p className="text-xl sm:text-2xl md:text-3xl font-black text-white">{word}</p>
            </div>

            {/* The Imposter */}
            {imposterPlayer && (
              <div className="bg-gradient-to-r from-[var(--game-red)]/20 to-[var(--game-orange)]/20 rounded-xl sm:rounded-2xl p-2 sm:p-3 border border-[var(--game-red)]/30">
                <div className="flex items-center justify-center gap-2">
                  <Drama className="w-4 h-4 text-[var(--game-orange)]" />
                  <p className="text-white text-xs sm:text-sm">
                    <span className="text-white/60">Imposter: </span>
                    <span className="font-black">{imposterPlayer.name}</span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex gap-2 sm:gap-3 flex-shrink-0"
        >
          <Button
            onClick={onPlayAgain}
            className="flex-1 h-11 sm:h-12 md:h-14 bg-gradient-to-r from-[var(--game-purple)] to-[var(--game-pink)] hover:from-[var(--game-purple-dark)] hover:to-[var(--game-pink)] text-white shadow-xl shadow-purple-500/30 border-0 text-sm sm:text-base"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
            Again
          </Button>
          <Button
            onClick={onHome}
            variant="outline"
            className="flex-1 h-11 sm:h-12 md:h-14 bg-white/10 border-white/30 text-white hover:bg-white/20 text-sm sm:text-base"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
            Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
}