import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useMotionValueEvent } from 'framer-motion';

// Component Imports
import LoadingScreen from './components/LoadingScreen';
import MusicToggle from './components/MusicToggle';
import Hero from './components/Hero';
import Heart3D from './components/Heart3D';
import Memories from './components/Memories';
import Reasons from './components/Reasons';
import RoseGarden from './components/RoseGarden';
import BirthdayCake from './components/BirthdayCake';
import LoveLetter from './components/LoveLetter';
import FinalScene from './components/FinalScene';
import ScrollUniverse from './scenes/ScrollUniverse';

// Memoized Components to prevent scrolling performance lag
const MemoizedHero = React.memo(Hero);
const MemoizedHeart3D = React.memo(Heart3D);
const MemoizedMemories = React.memo(Memories);
const MemoizedReasons = React.memo(Reasons);
const MemoizedRoseGarden = React.memo(RoseGarden);
const MemoizedBirthdayCake = React.memo(BirthdayCake);
const MemoizedLoveLetter = React.memo(LoveLetter);
const MemoizedFinalScene = React.memo(FinalScene);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(true);
  
  const heroRef = useRef(null);
  const heartRef = useRef(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isCakeInView, setIsCakeInView] = useState(false);
  const [isCakeBlown, setIsCakeBlown] = useState(false);

  // Framer Motion scroll indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollProgress(latest);
  });

  useEffect(() => {
    // Check if device supports touch
    const checkDevice = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);

    // Track cursor movement on desktop
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleEnterWorld = () => {
    setIsLoading(false);
    setIsPlaying(true);
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-[#050206] text-white">
      {/* Custom Cursor for Desktops */}
      {!isMobile && !isLoading && (
        <>
          <div
            className="custom-cursor hidden md:block"
            style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
          />
          <div
            className="custom-cursor-dot hidden md:block"
            style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
          />
        </>
      )}

      {/* Global Scroll Progress Bar */}
      {!isLoading && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-romantic-rose via-pink-400 to-romantic-lightRose z-50 origin-left shadow-[0_0_8px_rgba(255,46,147,0.8)]"
          style={{ scaleX }}
        />
      )}

      {/* Music Toggle (Hides controls but manages audio loop state) */}
      {!isLoading && (
        <MusicToggle isPlaying={isPlaying && !(isCakeInView && !isCakeBlown)} setIsPlaying={setIsPlaying} />
      )}

      {/* Mobile Scroll Helper */}
      {isMobile && !isLoading && (
        <div 
          className="fixed right-3 top-1/2 -translate-y-1/2 w-10 h-48 rounded-3xl bg-black/50 border border-romantic-rose/30 flex flex-col items-center justify-between py-4 z-[999] backdrop-blur-lg shadow-[0_0_20px_rgba(255,46,147,0.25)] pointer-events-auto active:scale-95 active:border-pink-500 transition-all duration-200"
          style={{ touchAction: 'pan-y' }}
        >
          {/* Top arrow */}
          <motion.div 
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="text-romantic-lightRose text-xs font-bold"
          >
            ▲
          </motion.div>
          
          {/* Vertical scroll text */}
          <span 
            className="text-[8px] text-romantic-lightRose/80 font-bold uppercase tracking-widest select-none pointer-events-none"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            Drag to Scroll
          </span>

          {/* Bottom arrow */}
          <motion.div 
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="text-romantic-lightRose text-xs font-bold"
          >
            ▼
          </motion.div>
        </div>
      )}

      {/* Main Pages Flow */}
      {isLoading ? (
        <LoadingScreen onEnter={handleEnterWorld} />
      ) : (
        <div className="w-full flex flex-col relative">
          {/* Persistent Scroll Universe 3D Particle Layer */}
          <ScrollUniverse scrollProgress={scrollProgress} mousePos={mousePos} />
          
          <div className="w-full flex flex-col relative z-10">
          {/* Hero Section */}
          <div ref={heroRef} className="h-screen w-full relative">
            <MemoizedHero onNext={() => scrollToSection(heartRef)} />
          </div>

          {/* Interactive Heart Section */}
          <div ref={heartRef}>
            <MemoizedHeart3D />
          </div>

          {/* Memories Polaroid gallery */}
          <MemoizedMemories />

          {/* Connected Constellations Reasons */}
          <MemoizedReasons />

          {/* Rose Garden scene */}
          <MemoizedRoseGarden />

          {/* Birthday Cake Blowout */}
          <MemoizedBirthdayCake 
            onViewStateChange={(inView) => setIsCakeInView(inView)}
            onBlownOut={() => setIsCakeBlown(true)}
          />

          {/* Handwritten Love Letter scroll */}
          <MemoizedLoveLetter />

          {/* Cinematic Night Finale Scene */}
          <MemoizedFinalScene />
          </div>
        </div>
      )}
    </div>
  );
}
