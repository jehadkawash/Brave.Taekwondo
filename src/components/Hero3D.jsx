// src/components/Hero3D.jsx
// Self-contained 3D hero scene — pure @react-three/fiber + three, no extra
// helper libraries (avoids dragging in heavy transitive deps like drei does).
import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

// Glowing rotating ring — stands in for a "champion belt" motif
function GlowRing() {
  const ref = useRef(null);
  useFrame(({ clock }, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.15;
    ref.current.rotation.y += delta * 0.25;
    ref.current.position.y = Math.sin(clock.getElapsedTime() * 0.6) * 0.15;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[1.4, 0.08, 32, 128]} />
      <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={1.4} roughness={0.2} metalness={0.8} />
    </mesh>
  );
}

// Small orbiting shard for depth
function OrbitShard() {
  const ref = useRef(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.position.x = Math.cos(t * 0.6) * 2.1;
    ref.current.position.z = Math.sin(t * 0.6) * 2.1;
    ref.current.rotation.x += 0.01;
    ref.current.rotation.y += 0.015;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[0.18, 0]} />
      <meshStandardMaterial color="#fde047" emissive="#fde047" emissiveIntensity={0.8} />
    </mesh>
  );
}

// Lightweight ambient particle field (hand-rolled, no extra package)
function Sparkles({ count = 60 }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 5;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return arr;
  }, [count]);

  const ref = useRef(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#fde047" size={0.035} transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={60} color="#fde047" />
      <pointLight position={[-5, -3, -5]} intensity={20} color="#3b82f6" />
      <GlowRing />
      <OrbitShard />
      <Sparkles count={60} />
    </>
  );
}

/**
 * Hero3D — lazy, ambient 3D scene meant to sit behind/over the hero text.
 * Decorative only (pointer-events disabled by the parent wrapper).
 */
export default function Hero3D({ className = '' }) {
  return (
    <div className={className} style={{ pointerEvents: 'none' }}>
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
