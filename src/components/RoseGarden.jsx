import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

function ResponsiveGroup({ children }) {
  const { width, height } = useThree().viewport;
  const isMobile = width < height;
  
  let scale;
  if (isMobile) {
    // Mobile: Scale it larger so petals are easier to tap
    scale = Math.min(width / 3.0, 1.3);
  } else {
    // Desktop: Constrain by height and width to prevent vertical cutoff
    const scaleByHeight = height / 3.3; 
    const scaleByWidth = width / 5.5;
    scale = Math.min(scaleByWidth, scaleByHeight, 0.65);
  }

  return <group scale={[scale, scale, scale]}>{children}</group>;
}

// Highly detailed central magical rose
function CentralRose() {
  const roseLightRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (roseLightRef.current) {
      // Gentle pulsing of the inner light
      roseLightRef.current.intensity = 2.5 + Math.sin(time * 2.0) * 0.8;
    }
  });

  return (
    <group position={[0, -0.4, 0]}>
      {/* Inner Glowing Light */}
      <pointLight
        ref={roseLightRef}
        position={[0, 0.4, 0]}
        intensity={2.5}
        color="#ff2e93"
        distance={2.5}
        decay={1.5}
      />

      {/* Stem */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.025, 0.03, 0.8, 16]} />
        <meshStandardMaterial color="#194d2e" roughness={0.7} />
      </mesh>

      {/* Stem Leaves */}
      <mesh position={[-0.15, 0.15, 0]} rotation={[0.4, 0.2, 0.7]} scale={[1.5, 0.6, 0.2]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#226e3f" roughness={0.6} />
      </mesh>
      <mesh position={[0.15, 0.25, 0]} rotation={[-0.4, -0.2, -0.7]} scale={[1.5, 0.6, 0.2]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#226e3f" roughness={0.6} />
      </mesh>

      {/* Receptacle */}
      <mesh position={[0, 0.4, 0]}>
        <coneGeometry args={[0.08, 0.12, 16]} />
        <meshStandardMaterial color="#194d2e" />
      </mesh>

      {/* Rose Petals layers */}
      <group position={[0, 0.45, 0]}>
        {/* Core petals */}
        <mesh position={[0, 0.05, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color="#ff1a75"
            roughness={0.4}
            emissive="#b30047"
            emissiveIntensity={1.5}
          />
        </mesh>

        {/* Inner layers */}
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i / 5) * Math.PI * 2;
          const radius = 0.06;
          return (
            <mesh
              key={`inner-${i}`}
              position={[Math.cos(angle) * radius, 0.06, Math.sin(angle) * radius]}
              rotation={[0.3, -angle + Math.PI / 2, 0.25]}
            >
              <sphereGeometry args={[0.09, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial
                color="#ff2e93"
                emissive="#99003d"
                emissiveIntensity={1.0}
                roughness={0.4}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}

        {/* Middle layers */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const angle = (i / 7) * Math.PI * 2 + 0.3;
          const radius = 0.11;
          return (
            <mesh
              key={`mid-${i}`}
              position={[Math.cos(angle) * radius, 0.04, Math.sin(angle) * radius]}
              rotation={[0.5, -angle + Math.PI / 2, 0.2]}
            >
              <sphereGeometry args={[0.11, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial
                color="#ff4d94"
                emissive="#800033"
                emissiveIntensity={0.6}
                roughness={0.35}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}

        {/* Outer layers */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
          const angle = (i / 9) * Math.PI * 2 + 0.6;
          const radius = 0.16;
          return (
            <mesh
              key={`outer-${i}`}
              position={[Math.cos(angle) * radius, 0.01, Math.sin(angle) * radius]}
              rotation={[0.7, -angle + Math.PI / 2, 0.15]}
              scale={[1.2, 0.9, 1.2]}
            >
              <sphereGeometry args={[0.13, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial
                color="#ff75b5"
                emissive="#660024"
                emissiveIntensity={0.3}
                roughness={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

// Glass Dome Component using premium MeshPhysicalMaterial
function GlassDome({ domeHovered, setDomeHovered }) {
  const reflectionRef = useRef();

  useFrame((state) => {
    if (reflectionRef.current) {
      reflectionRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group
      onPointerOver={(e) => { e.stopPropagation(); setDomeHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setDomeHovered(false); }}
    >
      {/* Main Glass Dome Cylinder */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 1.8, 64, 1, true]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          roughness={0.05}
          metalness={0.1}
          transmission={0.98}
          ior={1.5}
          thickness={1.5}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Glass Dome Top Hemisphere */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.9, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          roughness={0.05}
          metalness={0.1}
          transmission={0.98}
          ior={1.5}
          thickness={1.5}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Hover reflection flash overlays */}
      {domeHovered && (
        <group ref={reflectionRef}>
          <mesh position={[0, 0, 0]} scale={[1.01, 1.01, 1.01]}>
            <cylinderGeometry args={[0.9, 0.9, 1.8, 32, 1, true]} />
            <meshBasicMaterial
              color="#ffd700"
              transparent
              opacity={0.12}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 0.9, 0]} scale={[1.01, 1.01, 1.01]}>
            <sphereGeometry args={[0.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshBasicMaterial
              color="#ffd700"
              transparent
              opacity={0.12}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

// Golden/Wooden Pedestal Base
function Pedestal() {
  return (
    <group position={[0, -0.95, 0]}>
      {/* Lower dark wooden tier */}
      <mesh position={[0, -0.06, 0]}>
        <cylinderGeometry args={[1.15, 1.2, 0.12, 64]} />
        <meshStandardMaterial color="#2b1a09" roughness={0.85} metalness={0.1} />
      </mesh>

      {/* Upper polished gold tier */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[1.05, 1.1, 0.06, 64]} />
        <meshStandardMaterial color="#ffd700" roughness={0.18} metalness={0.9} />
      </mesh>

      {/* Inner groove where dome rests */}
      <mesh position={[0, 0.065, 0]}>
        <torusGeometry args={[0.9, 0.02, 16, 64]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#b39200" roughness={0.3} metalness={0.8} />
      </mesh>
    </group>
  );
}

// Interactive floating petals inside the dome
function FloatingPetal({ position, message, onClick, onActive, index }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      // Gentle bobbing and floating motion inside the dome space
      meshRef.current.position.y = position[1] + Math.sin(time * 1.5 + index) * 0.15;
      meshRef.current.position.x = position[0] + Math.cos(time * 1.0 + index) * 0.08;
      meshRef.current.rotation.x = time * 0.4 + index;
      meshRef.current.rotation.y = time * 0.2 + index;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    setClicked(true);
    onClick(message);
    onActive(meshRef.current ? meshRef.current.position : new THREE.Vector3(...position));
    setTimeout(() => setClicked(false), 500);
  };

  return (
    <group
      ref={meshRef}
      position={position}
      scale={clicked ? [0.20, 0.10, 0.20] : hovered ? [0.16, 0.08, 0.16] : [0.12, 0.06, 0.12]}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
    >
      {/* Visual Petal mesh */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 16, 0, Math.PI * 1.5, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={hovered ? "#ff6bb3" : "#ff2e93"}
          emissive={hovered ? "#ff2e93" : "#660024"}
          emissiveIntensity={hovered ? 2.0 : 0.6}
          side={THREE.DoubleSide}
          roughness={0.2}
        />
      </mesh>
      {/* Invisible larger tap target sphere for easy interaction */}
      <mesh visible={false}>
        <sphereGeometry args={[1.5, 8, 8]} />
      </mesh>
    </group>
  );
}

export default function RoseGarden() {
  const [activeMessage, setActiveMessage] = useState("");
  const [domeHovered, setDomeHovered] = useState(false);
  const [flashLight, setFlashLight] = useState(null);
  const sectionRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, { threshold: 0.05 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // 5 Interactive floating petals placement around the central rose inside the dome bounds
  const petalsData = useMemo(() => [
    { position: [-0.4, 0.3, 0.3], message: "For the girl who makes everything beautiful. 🌹" },
    { position: [0.4, 0.1, -0.4], message: "To the one who holds the key to my heart. ❤️" },
    { position: [-0.3, -0.2, -0.3], message: "You are the sweetest part of my every day. 🍰" },
    { position: [0.35, -0.15, 0.35], message: "With you, my life is in full bloom. 🌸" },
    { position: [-0.1, 0.5, -0.2], message: "My favorite place in the universe is next to you. ✨" }
  ], []);

  const handlePetalClick = (msg) => {
    setActiveMessage(msg);
  };

  const triggerFlash = (pos) => {
    setFlashLight(pos.clone ? pos.clone() : new THREE.Vector3(pos[0], pos[1], pos[2]));
    setTimeout(() => {
      setFlashLight(null);
    }, 400);
  };

  return (
    <section ref={sectionRef} className="relative h-screen w-full flex flex-col justify-center items-center px-4 bg-[#030105] border-t border-romantic-rose/10 overflow-hidden z-10">
      {/* Subtle background fog gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#120516]/40 to-[#030105] pointer-events-none"></div>

      {/* Title */}
      <div className="absolute top-16 text-center select-none z-20">
        <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white tracking-wide text-glow">
          Magical Rose Dome
        </h2>
        <div className="w-16 h-[1px] bg-romantic-rose mx-auto mt-3"></div>
      </div>

      {/* R3F Canvas */}
      <div className="absolute inset-0 z-0" style={{ touchAction: 'pan-y' }}>
        {inView && (
          <Canvas camera={{ position: [0, 0.3, 3.8], fov: 45 }} style={{ touchAction: 'pan-y' }}>
          {/* Fog */}
          <fog attach="fog" args={["#030105", 2, 8]} />
          
          <ambientLight intensity={0.3} />
          {/* Ambient environment light */}
          <directionalLight position={[-4, 6, -3]} intensity={1.5} color="#b2c6e6" />
          
          {/* Main key light */}
          <directionalLight position={[3, 5, 4]} intensity={2.0} color="#ffd700" />

          {/* Dynamic Flash Light upon clicking a petal */}
          {flashLight && (
            <pointLight
              position={[flashLight.x, flashLight.y, flashLight.z]}
              intensity={10}
              distance={2}
              color="#ffffff"
            />
          )}

          {/* Interactive Dome Reflection Highlight Light */}
          <spotLight
            position={[0, 4, 3]}
            angle={0.4}
            penumbra={1}
            intensity={domeHovered ? 4.5 : 1.2}
            color={domeHovered ? "#ffd700" : "#ffffff"}
          />

          <ResponsiveGroup baseWidth={5.0}>
            {/* Pedestal base */}
            <Pedestal />

            {/* Central magical rose */}
            <CentralRose />

            {/* 5 floating interactive petals */}
            {petalsData.map((petal, idx) => (
              <FloatingPetal
                key={idx}
                index={idx}
                position={petal.position}
                message={petal.message}
                onClick={handlePetalClick}
                onActive={triggerFlash}
              />
            ))}

            {/* Glass Dome */}
            <GlassDome domeHovered={domeHovered} setDomeHovered={setDomeHovered} />

            {/* Golden & Rose Sparkles rising inside and around the dome */}
            <Sparkles count={50} scale={[1.5, 2.0, 1.5]} size={2.5} speed={0.5} color="#ffd700" position={[0, 0, 0]} />
            <Sparkles count={40} scale={[1.3, 1.8, 1.3]} size={2.0} speed={0.4} color="#ff75b5" position={[0, -0.2, 0]} />

          </ResponsiveGroup>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2 - 0.05} // Keep camera above the pedestal
            minPolarAngle={Math.PI / 4}
          />
        </Canvas>
      )}
      </div>

      {/* Premium Glass Message Card / Help UI */}
      <div className="z-10 mt-[45vh] max-w-sm w-full px-6 pointer-events-none select-none">
        <AnimatePresence mode="wait">
          {!activeMessage ? (
            <motion.div
              key="tip"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.85, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass px-6 py-3 rounded-full border border-romantic-rose/25 text-center text-xs font-semibold uppercase tracking-widest text-romantic-lightRose/95 backdrop-blur-md"
            >
              Touch a Floating Petal to Bloom 🌹
            </motion.div>
          ) : (
            <motion.div
              key={activeMessage}
              initial={{ opacity: 0, scale: 0.93, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: -15 }}
              transition={{ type: "spring", stiffness: 120, damping: 14 }}
              className="glass-premium p-6 rounded-2xl border border-romantic-rose/30 shadow-2xl text-center backdrop-blur-lg pointer-events-auto"
            >
              <p className="text-base md:text-lg font-playfair font-semibold text-white tracking-wide text-glow">
                {activeMessage}
              </p>
              <button
                onClick={() => setActiveMessage("")}
                className="mt-4 px-4 py-1 text-xs uppercase tracking-widest text-romantic-lightRose hover:text-white border border-romantic-rose/20 rounded-full hover:bg-romantic-rose/10 transition-all pointer-events-auto cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
