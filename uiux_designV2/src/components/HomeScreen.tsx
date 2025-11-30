import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Drama, Users, PlayCircle, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "./ui/dialog";
import { useState } from "react";

interface HomeScreenProps {
  onCreateGame: () => void;
  onJoinGame: () => void;
}

// Generate scattered dots like stars in a galaxy
const generateGalaxyDots = () => {
  const dots = [];
  const colors = [
    'rgba(255, 255, 255, 1)', // white
    'rgba(147, 197, 253, 1)', // cyan-ish
    'rgba(236, 72, 153, 0.8)', // pink-ish
    'rgba(167, 139, 250, 0.8)', // purple-ish
  ];
  
  for (let i = 0; i < 50; i++) {
    const shouldGlow = Math.random() > 0.7; // 30% chance to glow
    dots.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2, // 2-6px (bigger)
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2, // 2-5 seconds
      opacity: Math.random() * 0.5 + 0.3, // 0.3-0.8 (brighter)
      color: colors[Math.floor(Math.random() * colors.length)],
      glow: shouldGlow,
      moveX: Math.random() * 20 - 10, // slight drift -10 to 10
      moveY: Math.random() * 20 - 10,
    });
  }
  return dots;
};

const galaxyDots = generateGalaxyDots();

export function HomeScreen({ onCreateGame, onJoinGame }: HomeScreenProps) {
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-[var(--game-bg-gradient-start)] via-[var(--game-bg-gradient-end)] to-[var(--game-purple-dark)] flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Galaxy dots scattered across the screen */}
        {galaxyDots.map((dot) => (
          <motion.div
            key={dot.id}
            className="absolute rounded-full"
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              backgroundColor: dot.color,
              boxShadow: dot.glow ? '0 0 5px 2px rgba(255, 255, 255, 0.8)' : 'none',
            }}
            animate={{
              opacity: [dot.opacity * 0.3, dot.opacity, dot.opacity * 0.3],
              scale: [0.8, 1.2, 0.8],
              x: [0, dot.moveX, 0],
              y: [0, dot.moveY, 0],
            }}
            transition={{
              delay: dot.delay,
              duration: dot.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Animated gradient orbs - more subtle */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[var(--game-pink)]/15 blur-3xl"
          animate={{
            x: [0, 40, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-[var(--game-cyan)]/15 blur-3xl"
          animate={{
            x: [0, -30, 0],
            y: [0, -40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-[var(--game-orange)]/15 blur-2xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/3 w-28 h-28 rounded-full bg-[var(--game-purple)]/12 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 25, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6 sm:mb-8 relative"
        >
          {/* Floating decorative elements */}
          <motion.div 
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-8 -right-8 sm:-top-10 sm:-right-10 text-yellow-400 opacity-20 pointer-events-none"
          >
            <motion.div
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ✨
            </motion.div>
          </motion.div>
          
          <motion.div 
            animate={{ rotate: -360, y: [0, -10, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -top-4 -left-8 sm:-top-6 sm:-left-10 text-pink-400 opacity-20 pointer-events-none text-2xl sm:text-3xl"
          >
            🎭
          </motion.div>

          <motion.div
            className="inline-block mb-3 sm:mb-4"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--game-pink)] to-[var(--game-orange)] rounded-2xl sm:rounded-3xl blur-xl opacity-50" />
              <div className="relative bg-gradient-to-br from-[var(--game-pink)] via-[var(--game-purple)] to-[var(--game-cyan)] p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-[0_10px_30px_rgba(236,72,153,0.4)]">
                <Drama className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
              </div>
            </div>
          </motion.div>
          
          <div>
            <motion.h1
              className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)] mb-2"
            >
              PARTY<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--game-cyan)] via-[var(--game-pink)] to-[var(--game-orange)]" style={{ backgroundSize: "200% auto" }}>
                HEIST!
              </span>
            </motion.h1>
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-violet-200 font-medium text-base sm:text-lg md:text-xl"
          >
            Find the imposter. Save the vibe!
          </motion.p>
        </motion.div>

        {/* Game modes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-3 sm:space-y-4"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={onCreateGame}
              className="w-full h-12 sm:h-14 md:h-16 bg-gradient-to-r from-[var(--game-purple)] to-[var(--game-pink)] hover:from-[var(--game-purple-dark)] hover:to-[var(--game-pink)] text-white shadow-xl shadow-purple-500/30 border-0 relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-white/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
              <span className="relative flex items-center gap-2 sm:gap-3">
                <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-base sm:text-lg md:text-xl">Create Game</span>
              </span>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={onJoinGame}
              className="w-full h-12 sm:h-14 md:h-16 bg-white/10 backdrop-blur-lg hover:bg-white/20 text-white border-2 border-white/30 shadow-xl relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-[var(--game-cyan)]/20 to-[var(--game-purple)]/20"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
              <span className="relative flex items-center gap-2 sm:gap-3">
                <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-base sm:text-lg md:text-xl">Join Game</span>
              </span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Footer info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-6 sm:mt-8 md:mt-12 text-center"
        >
        </motion.div>

        {/* Rules Button */}
        <Dialog open={isRulesOpen} onOpenChange={setIsRulesOpen}>
          <DialogTrigger asChild>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="w-full mt-4 flex items-center justify-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">How to Play</span>
            </motion.button>
          </DialogTrigger>
          <DialogContent className="bg-gradient-to-br from-[var(--game-bg-gradient-start)] to-[var(--game-purple-dark)] text-white border-white/20 max-w-3xl max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <DialogHeader>
              <DialogTitle className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[var(--game-cyan)] via-[var(--game-pink)] to-[var(--game-orange)] bg-clip-text text-transparent mb-2">
                🎭 How to Play IMPOSTER!
              </DialogTitle>
              <DialogDescription className="text-base text-white/60">
                Learn the rules and strategies to become a master of the game.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-8 mt-6">
              {/* Game Overview */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-5 border border-white/10">
                <p className="text-base text-white/90 leading-relaxed">
                  <strong className="text-[var(--game-cyan)]">Imposter</strong> is a social deduction game where players must identify the hidden Imposter among them while the Imposter tries to blend in and survive.
                </p>
              </div>

              {/* Roles Section */}
              <div>
                <h3 className="text-2xl font-black text-[var(--game-pink)] mb-4 flex items-center gap-2">
                  🎭 Roles
                </h3>
                
                <div className="space-y-4">
                  {/* Civilian */}
                  <div className="bg-gradient-to-r from-[var(--game-cyan)]/10 to-[var(--game-green)]/10 rounded-xl p-4 border border-[var(--game-cyan)]/20">
                    <h4 className="text-lg font-black text-[var(--game-cyan)] mb-3 flex items-center gap-2">
                      <span className="text-xl">🛡️</span> Civilian (Majority)
                    </h4>
                    <ul className="space-y-2 text-white/80 ml-6 list-disc">
                      <li><strong className="text-white">Knowledge:</strong> Knows the Secret Word and Category Hint</li>
                      <li><strong className="text-white">Goal:</strong> Identify the Imposter and vote them out</li>
                      <li><strong className="text-white">Strategy:</strong> Give clues that prove you know the word without making it too obvious for the Imposter to guess</li>
                    </ul>
                  </div>

                  {/* Imposter */}
                  <div className="bg-gradient-to-r from-[var(--game-red)]/10 to-[var(--game-orange)]/10 rounded-xl p-4 border border-[var(--game-red)]/20">
                    <h4 className="text-lg font-black text-[var(--game-orange)] mb-3 flex items-center gap-2">
                      <span className="text-xl">🎭</span> Imposter (1 Player)
                    </h4>
                    <ul className="space-y-2 text-white/80 ml-6 list-disc">
                      <li><strong className="text-white">Knowledge:</strong> DOES NOT know the Secret Word. Only sees the Category Hint (e.g., "Fruit")</li>
                      <li><strong className="text-white">Goal:</strong> Blend in, avoid suspicion, and survive the vote</li>
                      <li><strong className="text-white">Strategy:</strong> Listen to other players' clues, deduce the word, and give vague but plausible clues</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Game Phases */}
              <div>
                <h3 className="text-2xl font-black text-[var(--game-purple)] mb-4 flex items-center gap-2">
                  🕹️ Game Phases
                </h3>
                
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-lg font-black text-white mb-2">1. Lobby</h4>
                    <p className="text-white/80">Players join the room using a room code. The host starts the game once everyone is ready.</p>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-lg font-black text-white mb-2">2. Setup & Role Reveal</h4>
                    <ul className="list-disc ml-6 space-y-1.5 text-white/80">
                      <li>Each player receives their role</li>
                      <li><strong className="text-white">Civilians</strong> see the Secret Word (e.g., "Apple")</li>
                      <li><strong className="text-white">Imposter</strong> sees "???" but gets the Category Hint (e.g., "Fruit")</li>
                      <li>Players mark themselves as "Ready" to proceed</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-lg font-black text-white mb-2">3. Clue Phase</h4>
                    <ul className="list-disc ml-6 space-y-1.5 text-white/80">
                      <li>Players take turns giving a <strong className="text-white">one-word clue</strong> related to the Secret Word</li>
                      <li><em>Example:</em> If the word is "Apple", clues might be "Red", "Pie", "Crunchy"</li>
                      <li>The Imposter must improvise a clue based on the category and previous clues</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-lg font-black text-white mb-2">4. Discussion Phase</h4>
                    <ul className="list-disc ml-6 space-y-1.5 text-white/80">
                      <li><strong className="text-white">Duration:</strong> 3 Minutes (or until Host forces a vote)</li>
                      <li>Players discuss the clues given</li>
                      <li>Civilians analyze who gave suspicious or off-topic clues</li>
                      <li>The Imposter tries to deflect suspicion</li>
                      <li><strong className="text-white">Emergency Meeting:</strong> The Host can end discussion early to start voting immediately</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-lg font-black text-white mb-2">5. Voting Phase</h4>
                    <ul className="list-disc ml-6 space-y-1.5 text-white/80">
                      <li>Players vote for the person they suspect is the Imposter</li>
                      <li>Players can choose to <strong className="text-white">Skip Vote</strong> if unsure</li>
                      <li>Voting ends when all players have cast their vote</li>
                    </ul>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h4 className="text-lg font-black text-white mb-2">6. Resolution</h4>
                    <ul className="list-disc ml-6 space-y-1.5 text-white/80">
                      <li>Votes are tallied</li>
                      <li>The player with the most votes is ejected</li>
                      <li><strong className="text-[var(--game-cyan)]">Civilians Win:</strong> If the ejected player is the Imposter</li>
                      <li><strong className="text-[var(--game-orange)]">Imposter Wins:</strong> If a Civilian is ejected, or if the vote ends in a tie/skip</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Example Gameplay */}
              <div className="bg-gradient-to-br from-[var(--game-purple)]/10 to-[var(--game-pink)]/10 rounded-xl p-5 border border-[var(--game-purple)]/20">
                <h3 className="text-2xl font-black text-[var(--game-yellow)] mb-3">
                  📝 Example Gameplay
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-white/60 text-sm mb-1">Secret Word</p>
                    <p className="text-xl font-black text-[var(--game-cyan)]">Sun</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-1">Hint</p>
                    <p className="text-lg text-white/80">Star</p>
                  </div>
                  <div className="space-y-2 mt-4 text-white/80">
                    <p>• <strong className="text-white">Player A (Civilian):</strong> "Hot"</p>
                    <p>• <strong className="text-white">Player B (Civilian):</strong> "Yellow"</p>
                    <p>• <strong className="text-white">Player C (Imposter):</strong> "Bright" <span className="text-[var(--game-orange)] text-sm">(Good bluff!)</span></p>
                    <p>• <strong className="text-white">Player D (Civilian):</strong> "Space"</p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                    <p className="text-white/70">
                      <strong className="text-white">Discussion:</strong> Player D might suspect Player C was too generic, but "Bright" fits. Player A is safe.
                    </p>
                    <p className="text-white/70">
                      <strong className="text-white">Voting:</strong> If they vote out Player C, Civilians win. If they vote out Player D, Imposter wins.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl p-5 border border-white/10">
                <h3 className="text-2xl font-black text-white mb-3">💡 Tips for Success</h3>
                <ul className="space-y-2.5 text-white/80 list-disc ml-6">
                  <li><strong className="text-white">For Civilians:</strong> Give specific clues, but don't be too obvious!</li>
                  <li><strong className="text-white">For Imposters:</strong> Listen carefully and blend in with related words</li>
                  <li><strong className="text-white">Communication is key:</strong> Discuss and analyze everyone's clues during the discussion phase</li>
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}