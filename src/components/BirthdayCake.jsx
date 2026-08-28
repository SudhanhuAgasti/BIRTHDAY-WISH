import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

function ResponsiveGroup({ children, baseWidth = 3.0 }) {
  const { width } = useThree().viewport;
  const scale = Math.min(width / baseWidth, 1.0);
  return <group scale={[scale, scale, scale]}>{children}</group>;
}

function SmokeEffect({ active }) {
  const particles = useMemo(() => {
    return Array.from({ length: 4 }).map((_, i) => ({
      ref: React.createRef(),
      speed: 0.12 + Math.random() * 0.08,
      drift: (Math.random() - 0.5) * 0.03,
      delay: i * 0.25,
    }));
  }, []);

  const startTimeRef = useRef(null);

  useFrame((state) => {
    if (!active) return;
    if (startTimeRef.current === null) {
      startTimeRef.current = state.clock.getElapsedTime();
    }

    const elapsedSinceBlown = state.clock.getElapsedTime() - startTimeRef.current;
    
    // Smoke lasts for 4 seconds
    if (elapsedSinceBlown > 4.0) {
      particles.forEach((p) => {
        if (p.ref.current) {
          p.ref.current.visible = false;
        }
      });
      return;
    }

    particles.forEach((p) => {
      if (p.ref.current) {
        const age = (state.clock.getElapsedTime() - startTimeRef.current + p.delay) % 1.2;
        
        p.ref.current.position.y = 0.55 + age * p.speed;
        p.ref.current.position.x = Math.sin(age * 4 + p.delay) * 0.015;
        p.ref.current.position.z = Math.cos(age * 4 + p.delay) * 0.015;

        const scale = 0.005 + age * 0.045;
        p.ref.current.scale.set(scale, scale, scale);

        // Combine overall smoke fade (over 4s) and individual particle fade
        const lifeFade = Math.max(0, 1 - elapsedSinceBlown / 4.0);
        const particleFade = Math.max(0, 1 - age / 1.2);
        
        if (p.ref.current.material) {
          p.ref.current.material.opacity = lifeFade * particleFade * 0.3;
        }
      }
    });
  });

  if (!active) return null;

  return (
    <group>
      {particles.map((p, i) => (
        <mesh key={i} ref={p.ref} position={[0, 0.55, 0]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#d1d5db" transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

function Candle({ position, blownOut }) {
  const flameRef = useRef();
  const lightRef = useRef();

  useFrame((state) => {
    if (!blownOut && flameRef.current) {
      // Flicker flame
      const scaleX = 1 + Math.sin(state.clock.getElapsedTime() * 20 + position[0]) * 0.15;
      const scaleY = 1 + Math.cos(state.clock.getElapsedTime() * 15 + position[2]) * 0.2;
      flameRef.current.scale.set(scaleX, scaleY, scaleX);
      if (lightRef.current) {
        lightRef.current.intensity = 1.0 + Math.sin(state.clock.getElapsedTime() * 30) * 0.2;
      }
    }
  });

  return (
    <group position={position}>
      {/* Candle Body */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshStandardMaterial color="#ff75b5" roughness={0.5} />
      </mesh>

      {/* Candle Wick */}
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.004, 0.004, 0.08, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Flame */}
      {!blownOut ? (
        <group position={[0, 0.6, 0]}>
          <mesh ref={flameRef}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#ffd700" />
          </mesh>
          <pointLight
            ref={lightRef}
            intensity={1.5}
            distance={2}
            color="#ffd700"
            decay={2}
          />
        </group>
      ) : (
        /* Smoke when blown out */
        <SmokeEffect active={blownOut} />
      )}
    </group>
  );
}

function Confetti({ count = 80, active }) {
  const pointsRef = useRef();

  const [positions, velocities, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const confettiColors = [
      new THREE.Color('#ff2e93'),
      new THREE.Color('#ff75b5'),
      new THREE.Color('#ffd700'),
      new THREE.Color('#00f0ff'),
      new THREE.Color('#b5179e')
    ];

    for (let i = 0; i < count; i++) {
      // Start in a circle on top of the cake
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.2 + Math.random() * 0.6;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = 0.8 + (Math.random() - 0.5) * 0.1;
      pos[i * 3 + 2] = Math.sin(angle) * radius;

      // Explode outward and upward
      const force = 1.5 + Math.random() * 2.5;
      vel[i * 3] = Math.cos(angle) * force * 0.8;
      vel[i * 3 + 1] = (1.5 + Math.random() * 2.5); // upward boost
      vel[i * 3 + 2] = Math.sin(angle) * force * 0.8;

      const randomColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
      col[i * 3] = randomColor.r;
      col[i * 3 + 1] = randomColor.g;
      col[i * 3 + 2] = randomColor.b;
    }
    return [pos, vel, col];
  }, [count, active]);

  useFrame((state, delta) => {
    if (active && pointsRef.current) {
      const posArr = pointsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        // Apply gravity & speed
        velocities[i * 3 + 1] -= 9.8 * delta * 0.5; // slow down fall

        posArr[i * 3] += velocities[i * 3] * delta;
        posArr[i * 3 + 1] += velocities[i * 3 + 1] * delta;
        posArr[i * 3 + 2] += velocities[i * 3 + 2] * delta;

        // Friction
        velocities[i * 3] *= 0.98;
        velocities[i * 3 + 1] *= 0.98;
        velocities[i * 3 + 2] *= 0.98;

        // Reset if too low
        if (posArr[i * 3 + 1] < -2) {
          posArr[i * 3 + 1] = -10; // hide it
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!active) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
      />
    </points>
  );
}

function CakeScene({ blownOut, isBlowing }) {
  const cakeGroup = useRef();

  useFrame((state) => {
    if (cakeGroup.current) {
      cakeGroup.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group ref={cakeGroup} position={[0, -0.6, 0]}>
      {/* Plate */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1.1, 1.15, 0.06, 32]} />
        <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Tier 1 (Bottom Cake) */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.9, 0.95, 0.54, 32]} />
        <meshStandardMaterial color="#2d0b25" roughness={0.7} />
      </mesh>
      {/* Cream Piping / Drips */}
      <mesh position={[0, 0.56, 0]}>
        <torusGeometry args={[0.91, 0.05, 12, 32]} />
        <meshStandardMaterial color="#ff2e93" roughness={0.4} />
      </mesh>

      {/* Tier 2 (Top Cake) */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.6, 0.65, 0.4, 32]} />
        <meshStandardMaterial color="#ff75b5" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.91, 0]}>
        <torusGeometry args={[0.61, 0.04, 12, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.3} />
      </mesh>

      {/* Candles */}
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2;
        const radius = 0.45;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <Candle
            key={i}
            position={[x, 0.9, z]}
            blownOut={blownOut}
          />
        );
      })}

      {/* Confetti Explosion */}
      <Confetti active={isBlowing} />
    </group>
  );
}

export default function BirthdayCake() {
  const [blownOut, setBlownOut] = useState(false);
  const [isBlowing, setIsBlowing] = useState(false);
  const [micPermission, setMicPermission] = useState('prompt'); // 'prompt', 'granted', 'denied'
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef(null);

  const handleBlow = () => {
    if (blownOut) return;
    setIsBlowing(true);
    setTimeout(() => {
      setBlownOut(true);
      setIsBlowing(false);
    }, 800);
  };

  const handleBlowRef = useRef(handleBlow);
  handleBlowRef.current = handleBlow;

  // Detect when the section is in the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 } // Activate when 15% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Set up microphone blow detection - only when in view
  useEffect(() => {
    if (blownOut || !isInView) return;

    let audioContext = null;
    let analyser = null;
    let microphone = null;
    let streamRef = null;
    let cooldownTimeout = null;
    let animationFrameId = null;

    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef = stream;
        setMicPermission('granted');

        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);

        analyser.smoothingTimeConstant = 0.4;
        analyser.fftSize = 1024;

        microphone.connect(analyser);

        // Prevent instant trigger due to initial connection spike or ambient noise
        let isReady = false;
        cooldownTimeout = setTimeout(() => {
          isReady = true;
        }, 1500);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkVolume = () => {
          if (blownOut) return;
          analyser.getByteFrequencyData(dataArray);

          // Calculate average of lower frequency bins (blowing creates low frequency rumble)
          let lowFreqSum = 0;
          const lowFreqBins = 15; // Focus on lowest frequencies (up to ~640Hz)
          for (let i = 0; i < lowFreqBins; i++) {
            lowFreqSum += dataArray[i];
          }
          const lowFreqAverage = lowFreqSum / lowFreqBins;

          // If low frequency energy is high, trigger the blow
          if (isReady && lowFreqAverage > 80) {
            handleBlowRef.current();
          } else {
            animationFrameId = requestAnimationFrame(checkVolume);
          }
        };

        checkVolume();
      } catch (err) {
        console.warn("Microphone access denied or not supported:", err);
        setMicPermission('denied');
      }
    };

    initAudio();

    return () => {
      if (cooldownTimeout) {
        clearTimeout(cooldownTimeout);
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (streamRef) {
        streamRef.getTracks().forEach(track => track.stop());
      }
      if (analyser) {
        analyser.disconnect();
      }
      if (microphone) {
        microphone.disconnect();
      }
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close().catch(() => {});
      }
    };
  }, [blownOut, isInView]);

  return (
    <section ref={sectionRef} className="relative h-screen w-full flex flex-col justify-center items-center px-4 bg-transparent border-t border-romantic-rose/10 overflow-hidden z-10">
      {/* Dynamic background glow based on candle status */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${blownOut ? 'bg-[radial-gradient(circle_at_center,rgba(255,46,147,0.15)_0%,transparent_70%)]' : 'bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.12)_0%,transparent_60%)]'} pointer-events-none`}></div>

      {/* Floating Sparkles around cake */}
      <div className="absolute inset-0 z-0" style={{ touchAction: 'pan-y' }}>
        {isInView && (
          <Canvas camera={{ position: [0, 1.2, 3.2], fov: 50 }} style={{ touchAction: 'pan-y' }}>
            <ambientLight intensity={blownOut ? 0.2 : 0.4} />
            {/* Spotlight for dramatic lighting */}
            <spotLight position={[0, 5, 2]} intensity={1.5} penumbra={0.5} color="#fff" castShadow />
            <pointLight position={[3, 3, 3]} intensity={0.5} color="#ff2e93" />
            
            {!blownOut && <Sparkles count={15} scale={2} size={1} speed={0.4} color="#ffd700" />}
            {blownOut && <Sparkles count={30} scale={4} size={1.8} speed={0.6} color="#ff2e93" />}

            <ResponsiveGroup baseWidth={2.8}>
              <CakeScene blownOut={blownOut} isBlowing={isBlowing} />
            </ResponsiveGroup>

            <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2 - 0.1} />
          </Canvas>
        )}
      </div>

      {/* Floating card panel */}
      <div className="z-10 mt-[42vh] max-w-sm w-full px-6 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!blownOut ? (
            <motion.div
              key="wish"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-premium p-6 rounded-2xl border border-[#ffd700]/30 shadow-xl text-center backdrop-blur-md"
            >
              <h2 className="text-3xl font-playfair font-bold text-white mb-2 text-glow-gold animate-pulse">
                Make a Wish...
              </h2>
              <p className="text-white/60 text-sm mb-4 font-light">
                Close your eyes, think of something beautiful, and blow into your mic! 🌬️
              </p>
              
              {micPermission === 'prompt' && (
                <div className="glass-premium py-3 px-4 rounded-xl text-yellow-400 text-xs font-medium animate-pulse border border-yellow-500/20">
                  🎙️ Please allow microphone access to blow out the candles!
                </div>
              )}

              {micPermission === 'granted' && (
                <div className="glass-premium py-4 px-6 rounded-xl border border-romantic-rose/30 shadow-md">
                  <div className="text-romantic-lightRose text-sm mb-2 font-semibold animate-pulse flex items-center justify-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                    Mic is Live! 🎙️
                  </div>
                  <div className="text-xs text-white/70 font-light leading-relaxed">
                    Blow gently directly into your device's microphone to extinguish the flames.
                  </div>
                  {isBlowing && (
                    <div className="text-romantic-lightRose text-xs mt-2 font-bold animate-bounce">
                      Blowing... 🌬️
                    </div>
                  )}
                </div>
              )}

              {micPermission === 'denied' && (
                <div className="glass-premium py-4 px-6 rounded-xl border border-red-500/30 text-center">
                  <div className="text-red-400 text-sm font-semibold mb-2">
                    Microphone Blocked ❌
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed mb-3">
                    Please enable microphone access in your browser settings and refresh the page to blow out the candles.
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-1.5 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-300 font-medium text-xs border border-red-500/30 transition-colors"
                  >
                    Refresh & Retry 🔄
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="wish-granted"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 12 }}
              className="glass-premium p-6 rounded-2xl border border-romantic-rose/30 shadow-xl text-center backdrop-blur-md"
            >
              <h3 className="text-2xl font-playfair font-semibold text-romantic-lightRose mb-2 text-glow">
                Wish Sent! ✨
              </h3>
              <p className="text-sm md:text-base text-white/80 font-light leading-relaxed">
                I hope every single wish you make today and every day comes true.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
