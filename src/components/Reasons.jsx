import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { birthdayData } from '../data/birthdayData';

function ResponsiveGroup({ children, baseWidth = 4.5 }) {
  const { width } = useThree().viewport;
  const scale = Math.min(width / baseWidth, 1.0);
  return <group scale={[scale, scale, scale]}>{children}</group>;
}

function ConstellationNode({ position, reasonText, isSelected, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Glow pulse
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 5 + position[0]) * 0.15;
      meshRef.current.scale.setScalar(pulse * (hovered || isSelected ? 1.5 : 1));
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      >
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial
          color={isSelected ? "#ffd700" : hovered ? "#ff75b5" : "#ff2e93"}
        />
      </mesh>
      
      {/* Halo Glow */}
      <mesh scale={[1.8, 1.8, 1.8]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial
          color={isSelected ? "#ffd700" : "#ff2e93"}
          transparent
          opacity={hovered || isSelected ? 0.4 : 0.15}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

function Constellation({ selectedIndex, onSelect }) {
  const groupRef = useRef();

  // Positions on a sphere or 3D cluster
  const nodes = useMemo(() => {
    return birthdayData.reasons.map((reason, index) => {
      // Position nodes in a nice ring/spherical shape
      const angle = (index / birthdayData.reasons.length) * Math.PI * 2;
      const x = Math.cos(angle) * 2;
      const z = Math.sin(angle) * 2;
      const y = (index % 2 === 0 ? 0.5 : -0.5) + (Math.random() - 0.5) * 0.3;
      return { position: [x, y, z], ...reason };
    });
  }, []);

  // Compute line segments connecting the constellation points
  const linePoints = useMemo(() => {
    const points = [];
    for (let i = 0; i < nodes.length; i++) {
      // Connect each point to the next, and also to the center or previous
      const p1 = new THREE.Vector3(...nodes[i].position);
      const p2 = new THREE.Vector3(...nodes[(i + 1) % nodes.length].position);
      points.push(p1, p2);

      // Connect opposite nodes to make it look like a star constellation
      const oppIndex = (i + Math.floor(nodes.length / 2)) % nodes.length;
      const p3 = new THREE.Vector3(...nodes[oppIndex].position);
      points.push(p1, p3);
    }
    return points;
  }, [nodes]);

  useFrame((state) => {
    if (groupRef.current) {
      // Slow rotation of the entire constellation
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Render line connections */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array(linePoints.flatMap(p => [p.x, p.y, p.z])), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#ff2e93"
          transparent
          opacity={0.25}
          linewidth={1}
        />
      </lineSegments>

      {/* Render Constellation nodes */}
      {nodes.map((node, index) => (
        <ConstellationNode
          key={index}
          position={node.position}
          reasonText={node.text}
          isSelected={selectedIndex === index}
          onClick={() => onSelect(index)}
        />
      ))}
    </group>
  );
}

export default function Reasons() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSelectedIndex((prev) => (prev + 1) % birthdayData.reasons.length);
    }, 2000);
  };

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSelect = (index) => {
    setSelectedIndex(index);
    resetTimer(); // Reset auto-swap timer on manual interaction
  };

  return (
    <section className="relative h-screen w-full flex flex-col justify-center items-center px-4 bg-transparent border-t border-romantic-rose/10 z-10 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,11,37,0.35)_0%,transparent_75%)] pointer-events-none"></div>

      {/* Header Overlay */}
      <div className="absolute top-16 text-center select-none z-20">
        <h2 className="text-3xl md:text-5xl font-playfair font-bold text-white tracking-wide text-glow">
          Reasons I Love You
        </h2>
        <div className="w-16 h-[1px] bg-romantic-rose mx-auto mt-3"></div>
      </div>

      {/* Interactive 3D Constellation Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffd700" />
          
          <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
          
          <ResponsiveGroup baseWidth={4.5}>
            <Constellation
              selectedIndex={selectedIndex}
              onSelect={handleSelect}
            />
          </ResponsiveGroup>
          
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
        </Canvas>
      </div>

      {/* Interactive Panel overlay in the center */}
      <div className="z-10 mt-[25vh] max-w-md w-full px-6 pointer-events-none select-none">
        <AnimatePresence mode="wait">
          {selectedIndex !== null && (
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -15 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="glass-premium p-8 rounded-3xl border border-romantic-rose/30 shadow-2xl text-center backdrop-blur-md pointer-events-auto"
            >
              <div className="w-10 h-10 bg-romantic-rose/10 border border-romantic-rose/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-romantic-rose text-lg font-bold">✨</span>
              </div>
              <h3 className="text-xl md:text-2xl font-playfair font-semibold text-romantic-lightRose mb-3 tracking-wide text-glow">
                {birthdayData.reasons[selectedIndex].text}
              </h3>
              <p className="text-sm md:text-base text-white/80 font-light leading-relaxed">
                {birthdayData.reasons[selectedIndex].detail}
              </p>
              
              {/* Quick Navigation Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {birthdayData.reasons.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 pointer-events-auto ${selectedIndex === i ? 'bg-romantic-rose w-4' : 'bg-white/20 hover:bg-white/40'}`}
                    aria-label={`Show reason ${i + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
