import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onEnter }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState("preparing"); // preparing, ready
  const [isBlown, setIsBlown] = useState(false);
  const [showSmoke, setShowSmoke] = useState(false);

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
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    return () => clearInterval(timer);
  }, []);

  // Mic blow detection
  useEffect(() => {
    if (phase !== "ready" || isBlown) return;

    let audioContext;
    let analyser;
    let microphone;
    let javascriptNode;
    let streamRef;

    const startMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef = stream;
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.8;
        analyser.fftSize = 512;

        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        javascriptNode.onaudioprocess = () => {
          const array = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(array);
          let values = 0;

          const length = array.length;
          for (let i = 0; i < length; i++) {
            values += array[i];
          }

          const average = values / length;
          // Threshold for blowing (air puff makes high frequency noise/volume)
          if (average > 50) {
            triggerBlowOut();
            cleanupMic();
          }
        };
      } catch (err) {
        console.log("Mic permission denied or not supported. Tap to blow enabled.", err);
      }
    };

    const cleanupMic = () => {
      if (javascriptNode) javascriptNode.disconnect();
      if (analyser) analyser.disconnect();
      if (microphone) microphone.disconnect();
      if (audioContext) audioContext.close();
      if (streamRef) {
        streamRef.getTracks().forEach(track => track.stop());
      }
    };

    startMic();

    return () => {
      cleanupMic();
    };
  }, [phase, isBlown]);

  const triggerBlowOut = () => {
    if (isBlown) return;
    setIsBlown(true);
    setShowSmoke(true);

    // Smooth transition to enter after 2.5s smoke effect
    setTimeout(() => {
      onEnter();
    }, 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#050206] flex flex-col items-center justify-center overflow-hidden">
        {/* Glowing background spotlights */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-romantic-rose/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-romantic-burgundy/20 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Falling star grid overlay */}
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
              {/* Spinner */}
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 60, damping: 14 }}
              className="flex flex-col items-center select-none"
            >
              {/* Ready Header */}
              <h1 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-2 tracking-wider text-glow">
                Happy Birthday! 🎂
              </h1>
              <p className="text-white/60 text-xs md:text-sm font-inter mb-10 max-w-xs font-light">
                Turn your sound on & blow the candles to enter The Magic World.
              </p>

              {/* Candles Container */}
              <motion.div 
                className="relative flex gap-4 md:gap-6 items-center justify-center cursor-default mb-12 px-10 pt-20 pb-10 rounded-3xl border-2 border-romantic-rose/40 bg-black/70 backdrop-blur-md shadow-[0_0_40px_rgba(255,46,147,0.3)]"
              >
                {/* Decorative Sparkles inside card */}
                <div className="absolute top-3 left-4 text-romantic-rose text-lg animate-pulse">✨</div>
                <div className="absolute bottom-3 right-4 text-romantic-rose text-lg animate-pulse">✨</div>
                <div className="absolute top-4 right-6 text-pink-400/50 text-sm">❤️</div>
                <div className="absolute bottom-4 left-6 text-pink-400/50 text-sm">❤️</div>

                {/* Candle '1' */}
                <div className="relative flex flex-col items-center -translate-y-4">
                  {/* Flame and smoke */}
                  <div className="absolute -top-9 h-10 flex flex-col items-center justify-end z-20">
                    <AnimatePresence>
                      {!isBlown && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ 
                            scale: [1, 1.15, 0.95, 1.1, 1],
                            y: [0, -2, 1, -1, 0],
                            rotate: [-1, 2, -2, 1, 0]
                          }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
                          className="w-6 h-9 bg-gradient-to-t from-yellow-300 via-orange-500 to-red-600 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.9),0_0_35px_rgba(239,68,68,0.8)] origin-bottom filter blur-[0.3px]"
                        />
                      )}
                    </AnimatePresence>
                    
                    {showSmoke && (
                      <motion.div 
                        initial={{ opacity: 0.8, y: 0, scale: 0.5, filter: "blur(2px)" }}
                        animate={{ opacity: 0, y: -80, scale: [1, 2.5, 3.5], x: [0, -15, 20, -10] }}
                        transition={{ duration: 2.2, ease: "easeOut" }}
                        className="absolute bottom-2 w-4 h-8 bg-white/45 rounded-full"
                      />
                    )}
                    {/* Wick */}
                    <div className="w-1 h-3 bg-gray-400 rounded-full" />
                  </div>
                  
                  {/* Candle Body '1' */}
                  <motion.h1 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                    className="text-8xl md:text-9xl font-playfair font-black text-[#fff2f6] select-none leading-none relative z-10"
                    style={{ textShadow: '0 0 15px #ff2e93, 0 0 30px #ff75b5, 0 0 50px rgba(255, 46, 147, 0.6)' }}
                  >
                    1
                  </motion.h1>
                  {/* Candle stand base */}
                  <div className="w-12 h-2 bg-gradient-to-r from-pink-400 to-romantic-rose rounded-full mt-2 shadow-[0_0_10px_#ff2e93] opacity-80" />
                </div>

                {/* Candle '9' */}
                <div className="relative flex flex-col items-center -translate-y-4">
                  {/* Flame and smoke */}
                  <div className="absolute -top-9 h-10 flex flex-col items-center justify-end z-20">
                    <AnimatePresence>
                      {!isBlown && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ 
                            scale: [1, 0.95, 1.1, 1.05, 1],
                            y: [0, 1, -2, -1, 0],
                            rotate: [1, -2, 2, -1, 0]
                          }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 0.7, ease: "easeInOut", delay: 0.05 }}
                          className="w-6 h-9 bg-gradient-to-t from-yellow-300 via-orange-500 to-red-600 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.9),0_0_35px_rgba(239,68,68,0.8)] origin-bottom filter blur-[0.3px]"
                        />
                      )}
                    </AnimatePresence>
                    
                    {showSmoke && (
                      <motion.div 
                        initial={{ opacity: 0.8, y: 0, scale: 0.5, filter: "blur(2px)" }}
                        animate={{ opacity: 0, y: -80, scale: [1, 2.5, 3.5], x: [0, 15, -10, 6] }}
                        transition={{ duration: 2.2, ease: "easeOut", delay: 0.1 }}
                        className="absolute bottom-2 w-4 h-8 bg-white/45 rounded-full"
                      />
                    )}
                    {/* Wick */}
                    <div className="w-1 h-3 bg-gray-400 rounded-full" />
                  </div>
                  
                  {/* Candle Body '9' */}
                  <motion.h1 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                    className="text-8xl md:text-9xl font-playfair font-black text-[#fff2f6] select-none leading-none relative z-10"
                    style={{ textShadow: '0 0 15px #ff2e93, 0 0 30px #ff75b5, 0 0 50px rgba(255, 46, 147, 0.6)' }}
                  >
                    9
                  </motion.h1>
                  {/* Candle stand base */}
                  <div className="w-12 h-2 bg-gradient-to-r from-pink-400 to-romantic-rose rounded-full mt-2 shadow-[0_0_10px_#ff2e93] opacity-80" />
                </div>
              </motion.div>

              {/* Interaction text */}
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="text-xs md:text-sm font-semibold tracking-widest text-romantic-lightRose uppercase border border-romantic-rose/25 bg-romantic-rose/5 px-6 py-2 rounded-full backdrop-blur-sm"
              >
                {!isBlown ? "💨 Blow into Mic to Extinguish" : "✨ Making a wish..."}
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
}
