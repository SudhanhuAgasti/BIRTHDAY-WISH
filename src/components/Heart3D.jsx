import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

function HeartModel({ onClick, scale = 1 }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const { width } = useThree().viewport;
  const responsiveScale = Math.min(width / 3.0, 1.0);

  // Generate Heart Shape in 2D and extrude to 3D
  const heartGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0, y = 0;
    // Mathematically define the perfect heart curve
    shape.moveTo(x, y + 0.3);
    shape.bezierCurveTo(x, y + 0.3, x - 0.2, y + 0.8, x - 0.8, y + 0.8);
    shape.bezierCurveTo(x - 1.4, y + 0.8, x - 1.4, y + 0.2, x - 1.4, y + 0.2);
    shape.bezierCurveTo(x - 1.4, y - 0.4, x - 1.0, y - 0.9, x, y - 1.6);
    shape.bezierCurveTo(x + 1.0, y - 0.9, x + 1.4, y - 0.4, x + 1.4, y + 0.2);
    shape.bezierCurveTo(x + 1.4, y + 0.2, x + 1.4, y + 0.8, x + 0.8, y + 0.8);
    shape.bezierCurveTo(x + 0.35, y + 0.8, x, y + 0.3, x, y + 0.3);

    const extrudeSettings = {
      depth: 0.4,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 2,
      bevelSize: 0.15,
      bevelThickness: 0.15,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center(); // Center the geometry around (0,0,0)
    return geom;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      // Slow rotation
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
      
      // Gentle floating animation
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.15;

      // Heartbeat pulse effect
      const pulse = 1 + Math.sin(state.clock.getElapsedTime() * 4) * 0.05;
      const hoverScale = hovered ? 1.25 : 1.1;
      meshRef.current.scale.setScalar(pulse * hoverScale * scale * responsiveScale);
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={heartGeometry}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
    >
      <meshPhysicalMaterial
        color={hovered ? "#ff5eaf" : "#ff2e93"}
        roughness={0.15}
        metalness={0.1}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        emissive={hovered ? "#ff2e93" : "#44001c"}
        emissiveIntensity={1.5}
      />
    </mesh>
  );
}

// Particle explosion component triggered on heart click
function ParticleExplosion({ active, count = 120 }) {
  const pointsRef = useRef();

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Start in a tight sphere around center
      pos[i * 3] = (Math.random() - 0.5) * 0.2;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2;

      // Random explosion velocity vectors
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 1.5 + Math.random() * 2.5;

      vel[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      vel[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      vel[i * 3 + 2] = Math.cos(phi) * speed;
    }
    return [pos, vel];
  }, [active, count]);

  useFrame((state, delta) => {
    if (active && pointsRef.current) {
      const posArr = pointsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        // Move points outward by velocity
        posArr[i * 3] += velocities[i * 3] * delta;
        posArr[i * 3 + 1] += velocities[i * 3 + 1] * delta;
        posArr[i * 3 + 2] += velocities[i * 3 + 2] * delta;

        // Apply friction
        velocities[i * 3] *= 0.98;
        velocities[i * 3 + 1] *= 0.98;
        velocities[i * 3 + 2] *= 0.98;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!active) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ff75b5"
        size={0.12}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function Heart3D() {
  const [exploded, setExploded] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleHeartClick = () => {
    if (exploded) return;
    setExploded(true);
    setTimeout(() => {
      setShowMessage(true);
    }, 500);
  };

  return (
    <section className="relative h-screen w-full flex flex-col justify-center items-center px-4 bg-transparent overflow-hidden border-t border-romantic-rose/10">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,11,37,0.4)_0%,transparent_70%)] pointer-events-none"></div>

      <div className="absolute inset-0 z-0 cursor-pointer">
        <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#ff75b5" />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#2d0b25" />
          <directionalLight position={[0, 5, 2]} intensity={1.2} color="#ffffff" />
          
          <Sparkles count={50} scale={5} size={2} speed={0.4} color="#ff2e93" />
          
          {!exploded && <HeartModel onClick={handleHeartClick} />}
          
          <ParticleExplosion active={exploded} />
          
          <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
        </Canvas>
      </div>

      {/* Floating Instructions or Explosion Message */}
      <div className="z-10 text-center pointer-events-none select-none max-w-lg px-6">
        <AnimatePresence mode="wait">
          {!exploded ? (
            <motion.div
              key="prompt"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              className="glass px-6 py-2 rounded-full border border-romantic-rose/20 text-xs font-semibold uppercase tracking-widest text-romantic-lightRose/90 backdrop-blur-md"
            >
              Touch the Heart to Feel the Pulse ❤️
            </motion.div>
          ) : (
            showMessage && (
              <motion.div
                key="message"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 12 }}
                className="glass-premium p-8 rounded-3xl border border-romantic-rose/30 max-w-md shadow-2xl"
              >
                <h3 className="text-2xl md:text-3xl font-playfair font-semibold text-white mb-3 text-glow">
                  You make my world brighter. ❤️
                </h3>
                <p className="text-sm text-white/70 font-light leading-relaxed">
                  Like a star lighting up the night sky, you bring endless warmth, joy, and beauty into every single day of my life.
                </p>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
