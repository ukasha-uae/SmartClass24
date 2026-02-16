'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const WIRE_LENGTH = 8;
const WIRE_RADIUS = 0.15;
const PARTICLE_COUNT = 14;
const SPEED_SCALE = 0.8;

interface OhmsLawConcept3DProps {
  voltage: number;
  resistance: number;
}

export function OhmsLawConcept3D({ voltage, resistance }: OhmsLawConcept3DProps) {
  const particlesRef = useRef<THREE.Group>(null);
  const positionsRef = useRef<number[]>(Array.from({ length: PARTICLE_COUNT }, (_, i) => -WIRE_LENGTH / 2 + (i / PARTICLE_COUNT) * WIRE_LENGTH));

  const current = resistance > 0 ? voltage / resistance : 0;
  const flowSpeed = current * SPEED_SCALE;
  const resistorRadius = Math.max(0.06, 0.2 - resistance / 400);

  useFrame((_, delta) => {
    if (!particlesRef.current) return;
    const positions = positionsRef.current;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i] += flowSpeed * delta;
      if (positions[i] > WIRE_LENGTH / 2) positions[i] -= WIRE_LENGTH;
      if (positions[i] < -WIRE_LENGTH / 2) positions[i] += WIRE_LENGTH;
      const mesh = particlesRef.current.children[i] as THREE.Mesh;
      if (mesh) mesh.position.x = positions[i];
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 5, 5]} intensity={1} />

      {/* Wire left segment */}
      <mesh position={[-WIRE_LENGTH / 4 - 0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[WIRE_RADIUS, WIRE_RADIUS, WIRE_LENGTH / 2 - 1, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Resistor (narrow middle) */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[resistorRadius, resistorRadius, 1, 16]} />
        <meshStandardMaterial color="#f97316" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Wire right segment */}
      <mesh position={[WIRE_LENGTH / 4 + 0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[WIRE_RADIUS, WIRE_RADIUS, WIRE_LENGTH / 2 - 1, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Moving particles (electrons) */}
      <group ref={particlesRef}>
        {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
          <mesh key={i} position={[-WIRE_LENGTH / 2 + (i / PARTICLE_COUNT) * WIRE_LENGTH, 0, 0]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.4} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
