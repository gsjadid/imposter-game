import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/button";
import { Sparkles, Eye, Shield, LogOut } from "lucide-react";
import { useState, useEffect } from "react";

interface RoleRevealScreenProps {
  role: "civilian" | "imposter";
  word?: string;
  hint?: string;
  onContinue: () => void;
  onLeaveGame?: () => void;
}

export function RoleRevealScreen({ role, word, hint, onContinue, onLeaveGame }: RoleRevealScreenProps) {
  const [revealed, setRevealed] = useState(false);
  const [canContinue, setCanContinue] = useState(false);

  const isImposter = role === "imposter";

  useEffect(() => {
    const timer = setTimeout(() => {
      setRevealed(true);
    }, 500);

    const continueTimer = setTimeout(() => {
      setCanContinue(true);
    }, 2500);

    return () => {
      clearTimeout(timer);
      clearTimeout(continueTimer);
    };
  }, []);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[var(--game-bg-gradient-start)] via-[var(--game-bg-gradient-end)] to-[var(--game-purple-dark)] flex items-center justify-center p-3 sm:p-4 overflow-hidden relative">
      {/* Leave Game Button */}
      {onLeaveGame && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
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

      {/* Animated background - more intense for imposter */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {isImposter ? (
          <>
            <motion.div
              className="absolute top-0 left-0 w-full h-full bg-[var(--game-red)]/10"
              animate={{
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute top-20 left-10 w-40 h-40 rounded-full bg-[var(--game-red)]/30 blur-3xl"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-[var(--game-orange)]/30 blur-3xl"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
            />
          </>
        ) : (
          <>
            <motion.div
              className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[var(--game-cyan)]/20 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-20 right-10 w-32 h-32 rounded-full bg-[var(--game-green)]/20 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
          </>
        )}
      </div>

      <div className="max-w-md w-full relative z-10">
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="inline-block mb-4 sm:mb-6"
              >
                <Eye className="w-12 h-12 sm:w-16 sm:h-16 text-white/50" />
              </motion.div>
              <h2 className="text-lg sm:text-xl md:text-2xl text-white/80">Revealing your role...</h2>
            </motion.div>
          ) : (
            <motion.div
              key="revealed"
              initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ 
                duration: 0.6,
                type: "spring",
                stiffness: 100,
              }}
              className="text-center"
            >
              {/* Role Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                }}
                className="mb-3 sm:mb-4 md:mb-6 inline-block"
              >
                <div className="relative">
                  <motion.div
                    className="absolute inset-0 rounded-full blur-2xl"
                    style={{
                      background: isImposter
                        ? `linear-gradient(135deg, var(--game-red), var(--game-orange))`
                        : `linear-gradient(135deg, var(--game-cyan), var(--game-green))`,
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
                    className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center"
                    style={{
                      background: isImposter
                        ? `linear-gradient(135deg, var(--game-red), var(--game-orange))`
                        : `linear-gradient(135deg, var(--game-cyan), var(--game-green))`,
                    }}
                  >
                    {isImposter ? (
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white" />
                      </motion.div>
                    ) : (
                      <Shield className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 text-white" />
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Role Title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-2 sm:mb-3 md:mb-4"
              >
                <h1
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-1 sm:mb-2 bg-clip-text text-transparent"
                  style={{
                    backgroundImage: isImposter
                      ? `linear-gradient(135deg, var(--game-red), var(--game-orange))`
                      : `linear-gradient(135deg, var(--game-cyan), var(--game-green))`,
                  }}
                >
                  {isImposter ? "IMPOSTER" : "CIVILIAN"}
                </h1>
                <p className="text-white/70 text-sm sm:text-base md:text-lg">
                  {isImposter 
                    ? "You don't have the word. Blend in!"
                    : "You have the secret word!"}
                </p>
              </motion.div>

              {/* Word Card for Civilians */}
              {!isImposter && word && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-2xl mb-3 sm:mb-4 md:mb-6"
                >
                  <p className="text-white/60 text-xs sm:text-sm mb-2 sm:mb-3">Your word is:</p>
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wide">
                      {word}
                    </div>
                  </motion.div>
                  <p className="text-white/40 text-xs sm:text-sm mt-2 sm:mt-3 md:mt-4">
                    Remember it! Don't let the imposter know.
                  </p>
                </motion.div>
              )}

              {/* Imposter Instructions with Hint */}
              {isImposter && hint && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mb-3 sm:mb-4 md:mb-6"
                >
                  {/* Hint Card */}
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-2xl mb-3">
                    <p className="text-white/60 text-xs sm:text-sm mb-2 sm:mb-3">Your hint is:</p>
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wide">
                        {hint}
                      </div>
                    </motion.div>
                    <p className="text-white/40 text-xs sm:text-sm mt-2 sm:mt-3 md:mt-4">
                      Use this to blend in!
                    </p>
                  </div>

                  {/* Instructions */}
                  <div className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-[var(--game-red)]/30">
                    <p className="text-white/80 text-xs sm:text-sm md:text-base">
                      🎭 Listen carefully to others and try to figure out the word. 
                      Blend in without revealing you don't know it!
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Imposter Instructions without hint (fallback) */}
              {isImposter && !hint && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 border border-[var(--game-red)]/30 mb-3 sm:mb-4 md:mb-6"
                >
                  <p className="text-white/80 text-xs sm:text-sm md:text-base">
                    🎭 Listen carefully to others and try to figure out the word. 
                    Blend in without revealing you don't know it!
                  </p>
                </motion.div>
              )}

              {/* Continue Button */}
              <AnimatePresence>
                {canContinue && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Button
                      onClick={onContinue}
                      className="w-full h-11 sm:h-12 md:h-14 bg-white text-black hover:bg-white/90 shadow-xl text-sm sm:text-base md:text-lg"
                    >
                      I'm Ready!
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}