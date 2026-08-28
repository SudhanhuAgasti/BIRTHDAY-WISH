import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { birthdayData } from '../data/birthdayData';

export default function Hero({ onNext }) {
  return (
    <section
      className="relative h-screen w-full flex flex-col justify-start md:justify-end items-center px-4 pt-24 pb-16 md:pt-0 md:pb-24 overflow-hidden z-10 select-none bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-hero.jpg')" }}
    >
      {/* Dark overlay to make text highly readable */}
      <div className="absolute inset-0 bg-black/50 z-0 pointer-events-none"></div>

      <div className="text-center max-w-4xl flex flex-col items-center gap-6 mt-[-10vh] relative z-10">
        {/* Animated Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-romantic-rose/80 font-inter text-glow">
            For YOU🌙 ❤️
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          className="text-4xl sm:text-6xl md:text-8xl font-playfair font-bold text-white tracking-wide text-glow leading-tight"
        >
          Happy Birthday,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-romantic-rose via-pink-400 to-romantic-lightRose">
            BINI !!
          </span>
        </motion.h1>

        {/* Cinematic Quote */}
        <div className="flex flex-col gap-2 mt-4 max-w-lg">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-white/60 text-lg font-light italic font-playfair"
          >
            "Today isn't just your birthday..."
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 2 }}
            className="text-romantic-lightRose text-base md:text-lg font-medium font-inter max-w-md mx-auto"
          >
            Today is the day my favorite person came into this world.
          </motion.p>
        </div>

        {/* Call to action button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2.8 }}
          className="mt-12"
        >
          <motion.button
            onClick={onNext}
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255, 46, 147, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-full border border-romantic-rose/40 hover:border-romantic-rose/80 text-white bg-romantic-dark/50 backdrop-blur-md transition-all duration-300 flex items-center gap-2 group shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          >
            <span className="text-sm font-semibold tracking-widest uppercase">Begin The  Story</span>
            <ChevronDown className="w-4 h-4 text-romantic-rose group-hover:translate-y-1 transition-transform duration-300" />
          </motion.button>
        </motion.div>
      </div>

      {/* Floating scroll indicator helper */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-40 animate-bounce">
        <span className="text-[10px] uppercase tracking-[0.2em] mb-1 font-semibold text-white/50">Scroll</span>
        <div className="w-[1px] h-6 bg-white/40"></div>
      </div>
    </section>
  );
}
