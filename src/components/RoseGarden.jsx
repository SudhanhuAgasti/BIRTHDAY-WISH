import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

function ResponsiveGroup({ children, baseWidth = 5.0 }) {
  const { width } = useThree().viewport;
  const scale = Math.min(width / baseWidth, 1.0);
  return <group scale={[scale, scale, scale]}>{children}</group>;
}

// Stylized 3D Rose component
function StylizedRose({ position, message, onClick, selectedMessage }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [opened, setOpened] = useState(false);
  
  // Custom spring scaling for blooming effect
  const [scale, setScale] = useState(1);

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() * 1.5 + position[0]) * 0.08;
      // Rotation on hover
      if (hovered) {
        groupRef.current.rotation.y += 0.015;
      } else {
        groupRef.current.rotation.y = position[0] * 0.5 + Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
      }
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    setOpened(true);
    setScale(1.4);
    onClick(message);
    setTimeout(() => {
      setScale(1.2);
    }, 300);
  };

  return (
    <group
      ref={groupRef}
      position={position}
      scale={[scale, scale, scale]}
      onClick={handleClick}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
    >
      {/* Green Stem (Richer, more vibrant green color) */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1.2, 8]} />
        <meshStandardMaterial color="#27ae60" roughness={0.8} />
      </mesh>

      {/* Stem Leaves (Flat leaf-like shape instead of spheres, vibrant green) */}
      <mesh position={[-0.12, -0.4, 0]} rotation={[0.4, 0.2, 0.6]} scale={[1.4, 0.6, 0.15]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#2ecc71" roughness={0.6} />
      </mesh>
      <mesh position={[0.12, -0.2, 0]} rotation={[-0.4, -0.2, -0.6]} scale={[1.4, 0.6, 0.15]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#2ecc71" roughness={0.6} />
      </mesh>

      {/* Receptacle (green base) */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.09, 0.15, 8]} />
        <meshStandardMaterial color="#27ae60" />
      </mesh>

      {/* Layered Rose Petals */}
      <group position={[0, 0.1, 0]}>
        {/* Inner core */}
        <mesh position={[0, 0.04, 0]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color={opened ? "#ff4081" : "#d81b60"}
            roughness={0.6}
            emissive="#5c001e"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Petal layer 1 (spiral inner petals) */}
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i / 5) * Math.PI * 2;
          const radius = 0.07;
          const petalScale = opened ? 1.3 : 1.0;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * radius, 0.05, Math.sin(angle) * radius]}
              rotation={[0.2, -angle + Math.PI / 2, 0.3]}
              scale={[petalScale, petalScale, petalScale]}
            >
              <sphereGeometry args={[0.1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial
                color={hovered ? "#ff5eaf" : "#ff2e93"}
                roughness={0.5}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}

        {/* Petal layer 2 (middle petals) */}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const angle = (i / 7) * Math.PI * 2 + 0.3;
          const radius = 0.12;
          const petalScale = opened ? 1.5 : 1.0;
          const openRotation = opened ? 0.6 : 0.3;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * radius, 0.03, Math.sin(angle) * radius]}
              rotation={[openRotation, -angle + Math.PI / 2, 0.2]}
              scale={[petalScale, petalScale, petalScale]}
            >
              <sphereGeometry args={[0.12, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial
                color={opened ? "#ff75b5" : "#e91e63"}
                roughness={0.4}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}

        {/* Petal layer 3 (outermost wide petals for realistic volume) */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
          const angle = (i / 9) * Math.PI * 2 + 0.6;
          const radius = 0.16;
          const petalScale = opened ? 1.7 : 1.0;
          const openRotation = opened ? 0.8 : 0.4;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * radius, -0.01, Math.sin(angle) * radius]}
              rotation={[openRotation, -angle + Math.PI / 2, 0.15]}
              scale={[petalScale * 1.25, petalScale * 0.9, petalScale * 1.25]}
            >
              <sphereGeometry args={[0.14, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial
                color={opened ? "#ffa3d1" : "#c2185b"}
                roughness={0.35}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

// Falling petals scene component
function FallingPetals({ count = 30 }) {
  const petalsRef = useRef();

  const [positions, rotations, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const rot = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = Math.random() * 5 + 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;

      rot[i * 3] = Math.random() * Math.PI;
      rot[i * 3 + 1] = Math.random() * Math.PI;
      rot[i * 3 + 2] = Math.random() * Math.PI;

      spd[i] = 0.5 + Math.random() * 1.0;
    }
    return [pos, rot, spd];
  }, [count]);

  useFrame((state, delta) => {
    if (petalsRef.current) {
      const children = petalsRef.current.children;
      for (let i = 0; i < count; i++) {
        const petal = children[i];
        if (petal) {
          petal.position.y -= speeds[i] * delta;
          petal.position.x += Math.sin(state.clock.getElapsedTime() + i) * 0.005;
          petal.rotation.x += 0.01;
          petal.rotation.y += 0.005;

          // Recycle petals that fell past the ground
          if (petal.position.y < -2) {
            petal.position.y = 5;
            petal.position.x = (Math.random() - 0.5) * 8;
            petal.position.z = (Math.random() - 0.5) * 8;
          }
        }
      }
    }
  });

  return (
    <group ref={petalsRef}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh
          key={i}
          position={[positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]]}
          rotation={[rotations[i * 3], rotations[i * 3 + 1], rotations[i * 3 + 2]]}
          scale={[0.1, 0.05, 0.1]}
        >
          <sphereGeometry args={[0.8, 8, 8]} />
          <meshBasicMaterial color="#ff2e93" side={THREE.DoubleSide} transparent opacity={0.65} />
        </mesh>
      ))}
    </group>
  );
}

export default function RoseGarden() {
  const [activeMessage, setActiveMessage] = useState("");

  const rosesData = useMemo(() => [
    { position: [-2.2, -0.4, -1], message: "For the girl who makes everything beautiful. 🌹" },
    { position: [-0.8, -0.5, 1.2], message: "To the one who holds the key to my heart. ❤️" },
    { position: [0.7, -0.45, -0.8], message: "You are the sweetest part of my every day. 🍰" },
    { position: [2.1, -0.5, 0.8], message: "With you, my life is in full bloom. 🌸" },
    { position: [0, -0.3, 0], message: "My favorite place in the universe is next to you. ✨" }
  ], []);

  const handleRoseClick = (msg) => {
    setActiveMessage(msg);
  };

  return (
    <section className="relative h-screen w-full flex flex-col justify-center items-center px-4 bg-[#030105] border-t border-romantic-rose/10 overflow-hidden z-10">
      {/* Subtle background fog gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#120516]/40 to-[#030105] pointer-events-none"></div>

      {/* Title */}
      <div className="absolute top-16 text-center select-none z-20">
        <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white tracking-wide text-glow">
          Interactive Rose Garden
        </h2>
        <div className="w-16 h-[1px] bg-romantic-rose mx-auto mt-3"></div>
      </div>

      {/* R3F Rose Garden Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 1.2, 4.5], fov: 55 }}>
          {/* Fog */}
          <fog attach="fog" args={["#030105", 2, 10]} />
          
          <ambientLight intensity={0.2} />
          {/* Moonlight */}
          <directionalLight position={[-5, 8, -2]} intensity={1.8} color="#b2c6e6" castShadow />
          {/* Warm Rose lighting */}
          <pointLight position={[0, 1, 2]} intensity={1.5} color="#ff2e93" />

          <ResponsiveGroup baseWidth={5.0}>
            {rosesData.map((rose, idx) => (
              <StylizedRose
                key={idx}
                position={rose.position}
                message={rose.message}
                onClick={handleRoseClick}
                selectedMessage={activeMessage}
              />
            ))}

            <FallingPetals count={25} />

            <Sparkles count={40} scale={6} size={1.5} speed={0.3} color="#ff75b5" />

            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
              <planeGeometry args={[20, 20]} />
              <meshStandardMaterial color="#0d2112" roughness={0.9} />
            </mesh>
          </ResponsiveGroup>

          <OrbitControls
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2 - 0.05} // don't go under ground
            minPolarAngle={Math.PI / 3}
          />
        </Canvas>
      </div>

      {/* Popup message box */}
      <div className="z-10 mt-[40vh] max-w-sm w-full px-6 pointer-events-none select-none">
        <AnimatePresence mode="wait">
          {!activeMessage ? (
            <motion.div
              key="tip"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              className="glass px-6 py-2 rounded-full border border-romantic-rose/15 text-center text-xs font-semibold uppercase tracking-widest text-romantic-lightRose/80 backdrop-blur-md"
            >
              Click a Rose to Reveal its Message 🌹
            </motion.div>
          ) : (
            <motion.div
              key={activeMessage}
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -15 }}
              transition={{ type: "spring", stiffness: 100, damping: 12 }}
              className="glass-premium p-6 rounded-2xl border border-romantic-rose/30 shadow-xl text-center backdrop-blur-md pointer-events-auto"
            >
              <p className="text-base md:text-lg font-playfair font-semibold text-white tracking-wide text-glow">
                {activeMessage}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
