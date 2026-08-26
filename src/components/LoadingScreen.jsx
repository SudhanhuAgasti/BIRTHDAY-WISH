import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onEnter }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("preparing"); // preparing, ready

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setPhase("ready");
          }, 600);
          return 100;
        }
        // Increment progress pseudo-randomly
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#050206] flex flex-col items-center justify-center overflow-hidden">
        {/* Subtle glowing ambient spots */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-romantic-rose/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-romantic-burgundy/20 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Cinematic falling stars background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent)] pointer-events-none"></div>

        <div className="relative flex flex-col items-center max-w-md px-6 text-center">
          {phase === "preparing" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              {/* Glowing animated heart spinner */}
              <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
                <div className="absolute inset-0 border-2 border-dashed border-romantic-rose/25 rounded-full animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute inset-2 border-2 border-dotted border-romantic-lightRose/20 rounded-full animate-[spin_6s_linear_infinite_reverse]"></div>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    filter: ["drop-shadow(0 0 5px rgba(255,46,147,0.3))", "drop-shadow(0 0 15px rgba(255,46,147,0.7))", "drop-shadow(0 0 5px rgba(255,46,147,0.3))"]
                  }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                  className="text-4xl text-romantic-rose drop-shadow-[0_0_10px_rgba(255,46,147,0.6)]"
                >
                  ❤️
                </motion.div>
              </div>

              <h2 className="text-xl md:text-2xl font-playfair tracking-wide text-romantic-lightRose mb-3 font-semibold">
                Preparing something special for you...
              </h2>
              
              {/* Progress Bar Container */}
              <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden relative border border-white/5 mt-4">
                <motion.div
                  className="h-full bg-gradient-to-r from-romantic-burgundy via-romantic-rose to-romantic-lightRose shadow-[0_0_8px_rgba(255,46,147,0.8)]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>
              <span className="text-xs text-white/40 font-mono mt-2 tracking-widest">{Math.min(progress, 100)}%</span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
              className="flex flex-col items-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  filter: ["drop-shadow(0 0 8px rgba(255,46,147,0.4))", "drop-shadow(0 0 25px rgba(255,46,147,0.9))", "drop-shadow(0 0 8px rgba(255,46,147,0.4))"]
                }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="text-6xl text-romantic-rose mb-6"
              >
                ❤️
              </motion.div>

              <h1 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-2 tracking-wider text-glow">
                Ready?
              </h1>
              
              <p className="text-white/60 text-sm md:text-base font-inter mb-8 max-w-xs font-light">
                Turn your sound on for the best cinematic experience.
              </p>

              <motion.button
                onClick={onEnter}
                whileHover={{ scale: 1.06, boxShadow: "0 0 25px rgba(255, 46, 147, 0.6)" }}
                whileTap={{ scale: 0.96 }}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-romantic-rose to-pink-500 text-white font-semibold text-lg tracking-wider shadow-[0_0_15px_rgba(255,46,147,0.3)] transition-all duration-300 border border-white/20"
              >
                Enter My World ❤️
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
}
