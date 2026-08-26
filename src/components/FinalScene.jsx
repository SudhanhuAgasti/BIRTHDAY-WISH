import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { birthdayData } from '../data/birthdayData';

function ResponsiveGroup({ children, baseWidth = 4.0 }) {
  const { width } = useThree().viewport;
  const scale = Math.min(width / baseWidth, 1.0);
  return <group scale={[scale, scale, scale]}>{children}</group>;
}

// Custom 3D Moon component
function Moon() {
  const moonRef = useRef();

  useFrame((state) => {
    if (moonRef.current) {
      moonRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <mesh ref={moonRef} position={[-2, 1.8, -3]}>
      <sphereGeometry args={[0.6, 32, 32]} />
      <meshBasicMaterial color="#f6f1eb" />
      <pointLight intensity={2.0} color="#b2c6e6" distance={10} />
    </mesh>
  );
}

// Finale Heart-forming Particle system
function HeartFormingParticles({ count = 350, active, triggerExplosion }) {
  const pointsRef = useRef();
  const [phase, setPhase] = useState('idle'); // idle, explosion, forming

  // Target positions on a mathematical heart curve
  const [positions, targets, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const tar = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // 1. Initial random points
      pos[i * 3] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;

      // 2. Heart curve formula coordinates (scaled down)
      const t = (i / count) * Math.PI * 2;
      const x = 16 * Math.sin(t) ** 3;
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      
      // Scale coordinates to fit nicely
      tar[i * 3] = x * 0.12;
      tar[i * 3 + 1] = y * 0.12 + 0.2; // center offset
      tar[i * 3 + 2] = (Math.random() - 0.5) * 0.4; // thickness

      // 3. Velocities for initial state
      vel[i * 3] = 0;
      vel[i * 3 + 1] = 0;
      vel[i * 3 + 2] = 0;
    }
    return [pos, tar, vel];
  }, [count]);

  useEffect(() => {
    if (active) {
      setPhase('explosion');
      // Set high velocities for outward blast
      const posArr = pointsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        const speed = 4 + Math.random() * 4;

        velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
        velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
        velocities[i * 3 + 2] = Math.cos(phi) * speed;
      }

      // After 0.8s, pull them together into the heart shape
      const timer = setTimeout(() => {
        setPhase('forming');
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [active, velocities, count]);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      const posArr = pointsRef.current.geometry.attributes.position.array;
      
      if (phase === 'explosion') {
        for (let i = 0; i < count; i++) {
          // Push particles outward
          posArr[i * 3] += velocities[i * 3] * delta;
          posArr[i * 3 + 1] += velocities[i * 3 + 1] * delta;
          posArr[i * 3 + 2] += velocities[i * 3 + 2] * delta;

          // Friction
          velocities[i * 3] *= 0.95;
          velocities[i * 3 + 1] *= 0.95;
          velocities[i * 3 + 2] *= 0.95;
        }
      } else if (phase === 'forming') {
        for (let i = 0; i < count; i++) {
          // Interpolate positions toward target heart coordinate
          posArr[i * 3] += (targets[i * 3] - posArr[i * 3]) * 0.08;
          posArr[i * 3 + 1] += (targets[i * 3 + 1] - posArr[i * 3 + 1]) * 0.08;
          posArr[i * 3 + 2] += (targets[i * 3 + 2] - posArr[i * 3 + 2]) * 0.08;
        }
      } else {
        // Idle gentle float before trigger
        for (let i = 0; i < count; i++) {
          posArr[i * 3 + 1] += Math.sin(state.clock.getElapsedTime() + i) * 0.001;
        }
      }

      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={phase === 'forming' ? "#ff2e93" : "#ff75b5"}
        size={0.15}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function FinalScene() {
  const [step, setStep] = useState(0); // 0: initial text sequence, 1: wait... one more thing, 2: clicked, final result
  const [activeParticles, setActiveParticles] = useState(false);

  useEffect(() => {
    // Cinematic narrative message steps
    const timers = [
      setTimeout(() => setStep(1), 3500),  // Thank you for being part of my story
      setTimeout(() => setStep(2), 7000),  // I hope we create many more memories together
      setTimeout(() => setStep(3), 10500), // With all my heart ❤️
      setTimeout(() => setStep(4), 14000)  // Reveal: Wait... one more thing 👀
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleFinalClick = () => {
    setActiveParticles(true);
    setStep(5); // Show "I LOVE YOU"
  };

  return (
    <section className="relative h-screen w-full flex flex-col justify-center items-center px-4 bg-[#030105] border-t border-romantic-rose/10 overflow-hidden z-10">
      {/* Background vignette gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-romantic-bg via-transparent to-transparent pointer-events-none"></div>

      {/* 3D Canvas environment with Moon and Stars */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 4.5], fov: 60 }}>
          <fog attach="fog" args={["#030105", 2, 8]} />
          <ambientLight intensity={0.25} />
          
          <ResponsiveGroup baseWidth={4.0}>
            <Moon />
            
            <Stars radius={80} depth={40} count={600} factor={3} saturation={0.5} fade speed={1.2} />
            <Sparkles count={40} scale={5} size={1.2} speed={0.4} color="#ff75b5" />

            {/* Heart forming particle system */}
            <HeartFormingParticles active={activeParticles} />
          </ResponsiveGroup>

          <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} />
        </Canvas>
      </div>

      {/* Cinematic Text Sequences overlays */}
      <div className="z-10 text-center select-none max-w-xl px-6 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="narrative-1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 1.2 }}
              className="flex flex-col gap-2"
            >
              <h2 className="text-4xl md:text-6xl font-playfair font-bold text-white tracking-wide text-glow">
                Happy Birthday, {birthdayData.girlfriendName} ❤️
              </h2>
            </motion.div>
          )}

          {step === 1 && (
            <motion.h2
              key="narrative-2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 1.2 }}
              className="text-3xl md:text-5xl font-playfair font-bold text-romantic-lightRose tracking-wide text-glow"
            >
              Thank you for being part of my story.
            </motion.h2>
          )}

          {step === 2 && (
            <motion.h2
              key="narrative-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 1.2 }}
              className="text-2xl md:text-4xl font-playfair font-medium text-white/80 tracking-wide text-glow"
            >
              I hope we create many more memories together.
            </motion.h2>
          )}

          {step === 3 && (
            <motion.div
              key="narrative-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 1.5 }}
              className="flex flex-col items-center"
            >
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-romantic-rose mb-3">
                Forever Yours
              </span>
              <h2 className="text-4xl md:text-6xl font-dancing font-bold text-white text-glow">
                With all my heart ❤️
              </h2>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="narrative-5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center"
            >
              <h3 className="text-xl md:text-2xl font-playfair text-white/60 mb-6 tracking-wide">
                Wait... one more thing 👀
              </h3>
              <motion.button
                onClick={handleFinalClick}
                whileHover={{ scale: 1.08, boxShadow: "0 0 25px rgba(255, 46, 147, 0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-romantic-rose to-pink-500 text-white font-semibold text-lg tracking-wider border border-white/20 shadow-lg cursor-pointer"
              >
                Click Me ❤️
              </motion.button>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="narrative-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 80, damping: 10, delay: 0.6 }}
              className="flex flex-col items-center mt-[10vh]"
            >
              <h1 className="text-6xl md:text-8xl font-playfair font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-400 to-romantic-rose text-glow">
                I LOVE YOU
              </h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
