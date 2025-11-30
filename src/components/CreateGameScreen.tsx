import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowLeft, Plus } from "lucide-react";
import { useState } from "react";

interface CreateGameScreenProps {
    onCreate: (playerName: string) => void;
    onBack: () => void;
}

export function CreateGameScreen({ onCreate, onBack }: CreateGameScreenProps) {
    const [playerName, setPlayerName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (playerName.trim()) {
            onCreate(playerName);
        }
    };

    return (
        <div className="h-dynamic-screen w-full bg-gradient-to-br from-[var(--game-bg-gradient-start)] via-[var(--game-bg-gradient-end)] to-[var(--game-purple-dark)] flex items-center justify-center p-4 overflow-hidden relative">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute top-1/4 right-1/4 w-32 h-32 rounded-full bg-[var(--game-orange)]/20 blur-3xl"
                    animate={{
                        x: [0, -30, 0],
                        y: [0, 30, 0],
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
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--game-orange)] to-[var(--game-red)] flex items-center justify-center shadow-xl">
                                <Plus className="w-10 h-10 text-white" />
                            </div>
                        </motion.div>
                        <h2 className="text-3xl font-black text-white mb-2">Create Game</h2>
                        <p className="text-white/60">Start a new game as host</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-white/80 text-sm mb-2 block">Your Name</label>
                            <Input
                                type="text"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                placeholder="Enter your name"
                                className="h-14 bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-[var(--game-orange)] focus:ring-[var(--game-orange)]/20 rounded-xl"
                                maxLength={20}
                                autoFocus
                            />
                        </div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                type="submit"
                                disabled={!playerName.trim()}
                                className="w-full h-14 bg-gradient-to-r from-[var(--game-orange)] to-[var(--game-red)] hover:from-[var(--game-orange)]/90 hover:to-[var(--game-red)]/90 text-white shadow-xl shadow-orange-500/30 border-0 disabled:opacity-50 text-lg"
                            >
                                Create Lobby
                            </Button>
                        </motion.div>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
