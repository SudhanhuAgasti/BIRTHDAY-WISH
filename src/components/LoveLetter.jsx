import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MailOpen, X } from 'lucide-react';
import { birthdayData } from '../data/birthdayData';

export default function LoveLetter() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="relative h-screen w-full flex flex-col justify-center items-center px-4 bg-transparent border-t border-romantic-rose/10 overflow-hidden z-10">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-romantic-rose/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-romantic-burgundy/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="text-center z-10 mb-8 select-none">
        <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white tracking-wide text-glow">
          A Message for You
        </h2>
        <div className="w-16 h-[1px] bg-romantic-rose mx-auto mt-3"></div>
        <p className="text-white/60 text-sm mt-3 font-light">
          There is something I want to tell you...
        </p>
      </div>

      {/* Floating Envelope Box */}
      <div className="relative flex justify-center items-center z-10 w-full max-w-sm">
        <motion.div
          animate={isOpen ? { y: -20, scale: 0.95 } : { y: [0, -10, 0] }}
          transition={isOpen ? { duration: 0.5 } : { repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="w-72 h-48 rounded-2xl glass-premium border border-romantic-rose/30 shadow-2xl flex flex-col justify-center items-center cursor-pointer relative group overflow-hidden"
          onClick={() => setIsOpen(true)}
        >
          {/* Subtle inside glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-romantic-rose/5 to-transparent pointer-events-none group-hover:from-romantic-rose/10 transition-all duration-500"></div>

          {/* Glowing letter wax seal */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-romantic-rose to-pink-600 border border-white/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10">
            <span className="text-white text-2xl">💌</span>
            <span className="absolute inset-0 rounded-full border border-romantic-lightRose/40 animate-ping"></span>
          </div>

          <h3 className="text-white text-sm font-semibold tracking-wider uppercase mt-4 z-10">
            Open My Letter
          </h3>
          <p className="text-white/40 text-[10px] uppercase tracking-widest mt-1 z-10">
            Click to unlock
          </p>
        </motion.div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            {/* Fixed Close Button on viewport top-right to prevent scrolling away */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 p-2.5 rounded-full bg-black/40 hover:bg-romantic-rose text-white transition-colors duration-300 z-50 pointer-events-auto shadow-lg"
              aria-label="Close Letter"
            >
              <X className="w-6 h-6" />
            </button>

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 100 }}
              className="relative w-full max-w-xl bg-[#faf6ee] text-neutral-800 p-8 md:p-12 rounded-2xl shadow-2xl border border-yellow-800/10 flex flex-col max-h-[85vh] overflow-y-auto"
              style={{
                backgroundImage: "radial-gradient(ellipse at center, rgba(255,255,255,0.7), transparent), url('https://www.transparenttextures.com/patterns/cream-paper.png')",
                boxShadow: "0 25px 50px -12px rgba(255, 46, 147, 0.25)"
              }}
            >
              {/* Handwritten content */}
              <div className="font-dancing text-xl sm:text-2xl text-neutral-800 leading-relaxed font-semibold text-left select-text whitespace-pre-line pr-2">
                {birthdayData.loveLetter}
              </div>

              {/* Decorative signature mark */}
              <div className="mt-8 pt-4 border-t border-yellow-800/10 flex justify-between items-center font-dancing italic text-neutral-500 text-sm">
                <span>With all my love, forever.</span>
                <span className="text-romantic-rose text-lg">❤️</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
