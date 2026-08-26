import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Generate coordinate sets for different shapes
function generateShapePositions(count) {
  const shapes = {
    heart: new Float32Array(count * 3), // Will assemble to form a particle butterfly shape
    cloud: new Float32Array(count * 3),
    constellation: new Float32Array(count * 3),
    garden: new Float32Array(count * 3),
    cake: new Float32Array(count * 3),
    finalHeart: new Float32Array(count * 3)
  };

  for (let i = 0; i < count; i++) {
    const idx = i * 3;

    // 1. Particle Butterfly Shape (Fay's Butterfly Curve for initial assembly)
    const t1 = (i / count) * Math.PI * 12;
    const factor1 = Math.exp(Math.cos(t1)) - 2 * Math.cos(4 * t1) - Math.sin(t1 / 12) ** 5;
    const scaleFactor1 = 0.28;
    shapes.heart[idx] = Math.sin(t1) * factor1 * scaleFactor1;
    shapes.heart[idx + 1] = (Math.cos(t1) * factor1 - 0.5) * scaleFactor1;
    shapes.heart[idx + 2] = (Math.random() - 0.5) * 0.2;

    // 2. Cloud (Dispersed falling fragments)
    shapes.cloud[idx] = (Math.random() - 0.5) * 8;
    shapes.cloud[idx + 1] = (Math.random() - 0.5) * 6 - 2;
    shapes.cloud[idx + 2] = (Math.random() - 0.5) * 4;

    // 3. Constellation (Nodes connected to a ring)
    const angle3 = (i / count) * Math.PI * 2;
    const isNode = i % 50 === 0; // Cluster points at node hubs
    const nodeIndex = Math.floor(i / 50) % 6;
    const nodeAngle = (nodeIndex / 6) * Math.PI * 2;

    if (isNode || i % 3 === 0) {
      // Clustered around 6 constellation nodes
      const noise = (Math.random() - 0.5) * 0.25;
      shapes.constellation[idx] = Math.cos(nodeAngle) * 2 + noise;
      shapes.constellation[idx + 1] = (nodeIndex % 2 === 0 ? 0.5 : -0.5) + noise;
      shapes.constellation[idx + 2] = Math.sin(nodeAngle) * 2 + noise;
    } else {
      // Lines connecting nodes
      const nextAngle = ((nodeIndex + 1) % 6 / 6) * Math.PI * 2;
      const t = Math.random();
      const xStart = Math.cos(nodeAngle) * 2;
      const zStart = Math.sin(nodeAngle) * 2;
      const xEnd = Math.cos(nextAngle) * 2;
      const zEnd = Math.sin(nextAngle) * 2;

      shapes.constellation[idx] = THREE.MathUtils.lerp(xStart, xEnd, t);
      shapes.constellation[idx + 1] = THREE.MathUtils.lerp(nodeIndex % 2 === 0 ? 0.5 : -0.5, (nodeIndex + 1) % 2 === 0 ? 0.5 : -0.5, t);
      shapes.constellation[idx + 2] = THREE.MathUtils.lerp(zStart, zEnd, t);
    }

    // 4. Garden (Multiple rose columns)
    const roseIndex = i % 5;
    const rosePositions = [
      [-2.2, -1, -1],
      [-0.8, -1.2, 1.2],
      [0.7, -1.1, -0.8],
      [2.1, -1.2, 0.8],
      [0, -0.8, 0]
    ];
    const rPos = rosePositions[roseIndex];
    if (i % 4 === 0) {
      // Stem (Cylinder representation)
      shapes.garden[idx] = rPos[0];
      shapes.garden[idx + 1] = rPos[1] + (Math.random() * 1.2);
      shapes.garden[idx + 2] = rPos[2];
    } else {
      // Bloom petals (Spherical spiral cluster at top)
      const phi = Math.random() * Math.PI * 2;
      const theta = Math.random() * Math.PI;
      const rad = 0.1 + Math.random() * 0.25;
      shapes.garden[idx] = rPos[0] + rad * Math.sin(theta) * Math.cos(phi);
      shapes.garden[idx + 1] = rPos[1] + 1.2 + rad * Math.sin(theta) * Math.sin(phi);
      shapes.garden[idx + 2] = rPos[2] + rad * Math.cos(theta);
    }

    // 5. Cake (Double Cylinder)
    const isBottomTier = i % 2 === 0;
    const rad5 = isBottomTier ? 0.9 : 0.6;
    const hMin = isBottomTier ? -0.6 : -0.1;
    const hMax = isBottomTier ? -0.1 : 0.3;
    const angle5 = Math.random() * Math.PI * 2;
    shapes.cake[idx] = Math.cos(angle5) * rad5;
    shapes.cake[idx + 1] = hMin + Math.random() * (hMax - hMin);
    shapes.cake[idx + 2] = Math.sin(angle5) * rad5;

    // 6. Giant Heart
    const t6 = (i / count) * Math.PI * 2;
    const x6 = 16 * Math.sin(t6) ** 3;
    const y6 = 13 * Math.cos(t6) - 5 * Math.cos(2 * t6) - 2 * Math.cos(3 * t6) - Math.cos(4 * t6);
    shapes.finalHeart[idx] = x6 * 0.16;
    shapes.finalHeart[idx + 1] = y6 * 0.16 + 0.3;
    shapes.finalHeart[idx + 2] = (Math.random() - 0.5) * 0.6;
  }

  return shapes;
}

function UniversalParticles({ count = 1000, scrollProgress }) {
  const pointsRef = useRef();
  const { width } = useThree().viewport;
  const responsiveScale = Math.min(width / 3.8, 1.0);

  // Pre-generate target shapes
  const shapes = useMemo(() => generateShapePositions(count), [count]);

  // Current active positions
  const currentPositions = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    // Map scroll progress (0.0 to 1.0) into shape stages
    let fromShape, toShape, weight;

    if (scrollProgress < 0.15) {
      fromShape = shapes.heart;
      toShape = shapes.heart;
      weight = 0;
    } else if (scrollProgress < 0.35) {
      fromShape = shapes.heart;
      toShape = shapes.cloud;
      weight = (scrollProgress - 0.15) / 0.20;
    } else if (scrollProgress < 0.55) {
      fromShape = shapes.cloud;
      toShape = shapes.constellation;
      weight = (scrollProgress - 0.35) / 0.20;
    } else if (scrollProgress < 0.70) {
      fromShape = shapes.constellation;
      toShape = shapes.garden;
      weight = (scrollProgress - 0.55) / 0.15;
    } else if (scrollProgress < 0.85) {
      fromShape = shapes.garden;
      toShape = shapes.cake;
      weight = (scrollProgress - 0.70) / 0.15;
    } else {
      fromShape = shapes.cake;
      toShape = shapes.finalHeart;
      weight = (scrollProgress - 0.85) / 0.15;
    }

    const posAttr = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;

      let targetX = THREE.MathUtils.lerp(fromShape[idx], toShape[idx], weight);
      let targetY = THREE.MathUtils.lerp(fromShape[idx + 1], toShape[idx + 1], weight);
      let targetZ = THREE.MathUtils.lerp(fromShape[idx + 2], toShape[idx + 2], weight);

      if (weight > 0.05 && weight < 0.95 && fromShape !== toShape) {
        const fallDist = Math.sin(weight * Math.PI) * (2.0 + (i % 10) * 0.2);
        targetY -= fallDist;
        targetX += Math.sin(state.clock.getElapsedTime() * 1.5 + i) * 0.15;
      }

      posAttr[idx] += (targetX - posAttr[idx]) * 0.1;
      posAttr[idx + 1] += (targetY - posAttr[idx + 1]) * 0.1;
      posAttr[idx + 2] += (targetZ - posAttr[idx + 2]) * 0.1;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
  });

  return (
    <points ref={pointsRef} scale={[responsiveScale, responsiveScale, responsiveScale]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[currentPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ff2e93"
        size={0.13}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function Butterfly({ id = 1, scrollProgress, mousePos }) {
  const groupRef = useRef();
  const leftWingRef = useRef();
  const rightWingRef = useRef();
  const tailMaterialRef = useRef();
  
  const { width } = useThree().viewport;
  const responsiveScale = Math.min(width / 3.8, 1.0);

  // Position references for the 5 parts
  const bodyPosRef = useRef([0, 0, 0]);
  const leftTopPosRef = useRef([0, 0, 0]);
  const leftBottomPosRef = useRef([0, 0, 0]);
  const rightTopPosRef = useRef([0, 0, 0]);
  const rightBottomPosRef = useRef([0, 0, 0]);

  // Keep track of normalized mouse position
  const normMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (mousePos) {
      const xNorm = (mousePos.x / window.innerWidth) * 2 - 1;
      const yNorm = -(mousePos.y / window.innerHeight) * 2 + 1;
      normMouseRef.current = { x: xNorm, y: yNorm };
    }
  }, [mousePos]);

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();
    const isMoving = scrollProgress > 0.01;

    // 1. Assembly Animation (duration 2.2 seconds)
    const assemblyDuration = 2.2;
    const progress = Math.min(time / assemblyDuration, 1.0);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out

    // Initial offsets for the 5 parts (scattered state) - offset slightly for butterfly 2
    const initialOffsets = id === 2 ? {
      body: [0.5, 2.8, 0.2],
      leftTop: [-1.5, 1.5, -0.8],
      leftBottom: [-1.0, -1.0, -0.8],
      rightTop: [2.5, 1.5, -0.8],
      rightBottom: [2.0, -1.0, -0.8],
    } : {
      body: [0, 2.5, 0],
      leftTop: [-2.0, 1.2, -1.0],
      leftBottom: [-1.5, -1.5, -1.0],
      rightTop: [2.0, 1.2, -1.0],
      rightBottom: [1.5, -1.5, -1.0],
    };

    // Calculate current positions of the parts
    const t = 1 - easeProgress;
    bodyPosRef.current = [initialOffsets.body[0] * t, initialOffsets.body[1] * t, initialOffsets.body[2] * t];
    leftTopPosRef.current = [initialOffsets.leftTop[0] * t, initialOffsets.leftTop[1] * t, initialOffsets.leftTop[2] * t];
    leftBottomPosRef.current = [initialOffsets.leftBottom[0] * t, initialOffsets.leftBottom[1] * t, initialOffsets.leftBottom[2] * t];
    rightTopPosRef.current = [initialOffsets.rightTop[0] * t, initialOffsets.rightTop[1] * t, initialOffsets.rightTop[2] * t];
    rightBottomPosRef.current = [initialOffsets.rightBottom[0] * t, initialOffsets.rightBottom[1] * t, initialOffsets.rightBottom[2] * t];

    // Update parts positions in their respective groups
    if (groupRef.current.children[0]) {
      // Body group
      groupRef.current.children[0].position.set(...bodyPosRef.current);
    }
    if (leftWingRef.current && rightWingRef.current) {
      leftWingRef.current.children[0].position.set(...leftTopPosRef.current);
      leftWingRef.current.children[1].position.set(...leftBottomPosRef.current);
      
      rightWingRef.current.children[0].position.set(...rightTopPosRef.current);
      rightWingRef.current.children[1].position.set(...rightBottomPosRef.current);
    }

    // 2. Wing flapping animation
    // Don't flap or flap very slowly until assembled - add phase shift for butterfly 2
    const phaseShift = id === 2 ? Math.PI : 0;
    const flapFreq = progress < 1.0 ? 2 : (isMoving ? 16 : 4.5);
    const flapAmp = progress < 1.0 ? 0.1 : (isMoving ? 0.7 : 0.25);
    const angle = Math.sin(time * flapFreq + phaseShift) * flapAmp;

    if (leftWingRef.current) {
      leftWingRef.current.rotation.y = angle;
    }
    if (rightWingRef.current) {
      rightWingRef.current.rotation.y = -angle;
    }

    // 3. Dynamic Scaling: Much smaller on Hero page so it doesn't block text, and even smaller on other pages
    const targetScale = scrollProgress < 0.15
      ? 1.35
      : THREE.MathUtils.lerp(1.35, 0.65, Math.min((scrollProgress - 0.15) / 0.3, 1.0));

    // Apply scale dynamically
    groupRef.current.scale.set(
      responsiveScale * targetScale,
      responsiveScale * targetScale,
      responsiveScale * targetScale
    );

    // 4. Zig-Zag Criss-Cross Flight Path (guided by viewport bounds)
    const { width: viewportWidth, height: viewportHeight } = state.viewport;
    
    // Half width/height limits for corners
    const edgeX = (viewportWidth / 2) * 0.85;
    const edgeY = (viewportHeight / 2) * 0.85;

    let targetX = 0;
    let targetY = -0.75;
    let targetZ = 1.6;

    // Base path calculation for Butterfly 1
    if (scrollProgress < 0.15) {
      // Hero: starts next to/behind the main title text (higher on screen)
      targetX = -edgeX * 0.45;
      targetY = 0.4;
    } else if (scrollProgress < 0.45) {
      // Fly from Left side to Top-Right corner
      const t = (scrollProgress - 0.15) / 0.30;
      targetX = THREE.MathUtils.lerp(-edgeX * 0.45, edgeX, t);
      targetY = THREE.MathUtils.lerp(0.4, edgeY, t);
    } else if (scrollProgress < 0.75) {
      // Fly from Top-Right corner to Middle-Left side (crossing)
      const t = (scrollProgress - 0.45) / 0.30;
      targetX = THREE.MathUtils.lerp(edgeX, -edgeX, t);
      targetY = THREE.MathUtils.lerp(edgeY, -edgeY * 0.2, t);
    } else {
      // Fly from Middle-Left side to Bottom-Right side (crossing again)
      const t = (scrollProgress - 0.75) / 0.25;
      targetX = THREE.MathUtils.lerp(-edgeX, edgeX * 0.5, t);
      targetY = THREE.MathUtils.lerp(-edgeY * 0.2, -edgeY, t);
    }

    // Mirror X position for the second butterfly to create the criss-cross effect
    if (id === 2) {
      targetX = -targetX;
      // Adjust assembly offsets to start from opposite side
      initialOffsets.body[0] = -initialOffsets.body[0];
      initialOffsets.leftTop[0] = -initialOffsets.leftTop[0];
      initialOffsets.leftBottom[0] = -initialOffsets.leftBottom[0];
      initialOffsets.rightTop[0] = -initialOffsets.rightTop[0];
      initialOffsets.rightBottom[0] = -initialOffsets.rightBottom[0];
    }

    // Flight oscillation when moving
    if (isMoving || progress < 1.0) {
      targetX += Math.sin(time * 3 + phaseShift) * 0.12;
      targetY += Math.cos(time * 2.5 + phaseShift) * 0.08;
    }

    // Smoothly lerp towards target positions
    groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.1;
    groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.1;
    groupRef.current.position.z += (targetZ - groupRef.current.position.z) * 0.1;

    // Rotation angles matching flight heading - head rotated 180 deg (Math.PI) to face downwards and slanted inwards towards each other
    const dx = targetX - groupRef.current.position.x;
    groupRef.current.rotation.y = dx * 0.7;
    groupRef.current.rotation.x = 0.15;
    const tiltOffset = id === 2 ? -0.32 : 0.32; // slant slightly towards center (inward)
    groupRef.current.rotation.z = Math.PI + tiltOffset - dx * 0.4;

    // Animate tail twinkling/blinking glow
    if (tailMaterialRef.current) {
      tailMaterialRef.current.emissiveIntensity = 0.6 + Math.sin(time * 12) * 0.45;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 3D Butterfly Mesh Model with 5 assembling parts */}
      <group scale={[1.0, 1.0, 1.0]}>
        
        {/* Part 1: Central Body Group (Longer body/tail and white/blue glowing head and antennae) */}
        <group>
          {/* Body / Tail (Larger and longer capsule aligned vertically - now glowing white/blue) */}
          <mesh position={[0, -0.05, 0]} rotation={[0, 0, 0]}>
            <capsuleGeometry args={[0.024, 0.35, 8, 8]} />
            <meshStandardMaterial 
              ref={tailMaterialRef}
              color="#ffffff" 
              emissive="#00f0ff" 
              emissiveIntensity={0.8}
              roughness={0.2}
            />
          </mesh>
          {/* Head (White and blue glowing) */}
          <mesh position={[0, 0.17, 0]}>
            <sphereGeometry args={[0.038, 8, 8]} />
            <meshStandardMaterial 
              color="#ffffff" 
              emissive="#00f0ff" 
              emissiveIntensity={1.2} 
            />
          </mesh>
          {/* Antennae (glowing white and blue) */}
          <group position={[0, 0.18, 0]}>
            <mesh position={[-0.025, 0.08, 0]} rotation={[0, 0, 0.3]}>
              <cylinderGeometry args={[0.0025, 0.001, 0.15, 8]} />
              <meshStandardMaterial 
                color="#ffffff" 
                emissive="#00a2ff" 
                emissiveIntensity={1.0} 
              />
            </mesh>
            <mesh position={[0.025, 0.08, 0]} rotation={[0, 0, -0.3]}>
              <cylinderGeometry args={[0.0025, 0.001, 0.15, 8]} />
              <meshStandardMaterial 
                color="#ffffff" 
                emissive="#00a2ff" 
                emissiveIntensity={1.0} 
              />
            </mesh>
          </group>
        </group>

        {/* Parts 2 & 3: Left Wing Group (Smaller wings) */}
        <group ref={leftWingRef} position={[-0.012, 0, 0]}>
          {/* Part 2: Top Left Wing */}
          <group>
            <mesh position={[-0.11, 0.06, 0]} rotation={[0, 0, -0.15]} scale={[0.11, 0.18, 0.01]}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial 
                color="#00f0ff" 
                roughness={0.1} 
                transparent 
                opacity={0.85} 
                depthWrite={false} 
                emissive="#00f0ff" 
                emissiveIntensity={0.8} 
              />
            </mesh>
            {/* Round dot highlights matching reference image */}
            <mesh position={[-0.15, 0.11, 0.01]} scale={[0.012, 0.012, 0.012]}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
            </mesh>
          </group>

          {/* Part 3: Bottom Left Wing */}
          <group>
            <mesh position={[-0.08, -0.05, 0]} rotation={[0, 0, 0.2]} scale={[0.08, 0.12, 0.01]}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial 
                color="#00a2ff" 
                roughness={0.1} 
                transparent 
                opacity={0.8} 
                depthWrite={false} 
                emissive="#00a2ff" 
                emissiveIntensity={0.7} 
              />
            </mesh>
            <mesh position={[-0.09, -0.08, 0.01]} scale={[0.01, 0.01, 0.01]}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
            </mesh>
          </group>
        </group>

        {/* Parts 4 & 5: Right Wing Group (Smaller wings) */}
        <group ref={rightWingRef} position={[0.012, 0, 0]}>
          {/* Part 4: Top Right Wing */}
          <group>
            <mesh position={[0.11, 0.06, 0]} rotation={[0, 0, 0.15]} scale={[0.11, 0.18, 0.01]}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial 
                color="#00f0ff" 
                roughness={0.1} 
                transparent 
                opacity={0.85} 
                depthWrite={false} 
                emissive="#00f0ff" 
                emissiveIntensity={0.8} 
              />
            </mesh>
            <mesh position={[0.15, 0.11, 0.01]} scale={[0.012, 0.012, 0.012]}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
            </mesh>
          </group>

          {/* Part 5: Bottom Right Wing */}
          <group>
            <mesh position={[0.08, -0.05, 0]} rotation={[0, 0, -0.2]} scale={[0.08, 0.12, 0.01]}>
              <sphereGeometry args={[1, 16, 16]} />
              <meshStandardMaterial 
                color="#00a2ff" 
                roughness={0.1} 
                transparent 
                opacity={0.8} 
                depthWrite={false} 
                emissive="#00a2ff" 
                emissiveIntensity={0.7} 
              />
            </mesh>
            <mesh position={[0.09, -0.08, 0.01]} scale={[0.01, 0.01, 0.01]}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
            </mesh>
          </group>
        </group>

        {/* Soft PointLight inside the butterfly for glowing aura */}
        <pointLight distance={1.5} intensity={4} color="#00f0ff" />
      </group>
    </group>
  );
}

export default function ScrollUniverse({ scrollProgress, mousePos }) {
  const currentZIndex = scrollProgress < 0.15 ? 1 : 40;
  
  return (
    <div
      className="fixed inset-0 pointer-events-none select-none w-full h-full"
      style={{ pointerEvents: 'none', zIndex: currentZIndex }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 55 }}
        style={{ pointerEvents: 'none' }}
      >
        <fog attach="fog" args={["#050206", 2, 8]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#ff75b5" />

        <Stars radius={100} depth={50} count={800} factor={4} saturation={0.5} fade speed={1.0} />
        <Butterfly id={1} scrollProgress={scrollProgress} mousePos={mousePos} />
        <Butterfly id={2} scrollProgress={scrollProgress} mousePos={mousePos} />
      </Canvas>
    </div>
  );
}
