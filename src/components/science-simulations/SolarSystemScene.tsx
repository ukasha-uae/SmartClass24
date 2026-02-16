'use client';

import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';
import { SOLAR_SYSTEM_PLANETS, getPlanetById } from '@/lib/science-simulations/solar-system-data';

/** Glow sphere behind the sun for a soft halo */
function SunGlow() {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[3.2, 32, 32]} />
      <meshBasicMaterial
        color="#fbbf24"
        transparent
        opacity={0.15}
        depthWrite={false}
      />
    </mesh>
  );
}

/** Ring around a planet when selected */
function SelectionRing({ radius }: { radius: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius * 1.15, radius * 1.35, 32]} />
      <meshBasicMaterial
        color="#38bdf8"
        transparent
        opacity={0.8}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/** Saturn's rings (flat disc) */
function SaturnRings({ radius }: { radius: number }) {
  const inner = radius * 1.4;
  const outer = radius * 2.2;
  return (
    <mesh rotation={[-Math.PI / 2 + 0.1, 0, 0]}>
      <ringGeometry args={[inner, outer, 64]} />
      <meshBasicMaterial
        color="#e2e8f0"
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/** Single planet (sphere + orbit line); click reports id to parent */
function Planet({
  data,
  time,
  onSelect,
  selectedPlanetId,
  isPaused,
}: {
  data: (typeof SOLAR_SYSTEM_PLANETS)[0];
  time: React.MutableRefObject<number>;
  onSelect: (id: string) => void;
  selectedPlanetId: string | null;
  isPaused: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const isSun = data.id === 'sun';
  const isSaturn = data.id === 'saturn';
  const isSelected = selectedPlanetId === data.id;

  useFrame(() => {
    if (isSun || !groupRef.current) return;
    if (!isPaused) {
      const angle = (time.current / data.orbitPeriod) * Math.PI * 2;
      const x = Math.cos(angle) * data.orbitRadius;
      const z = Math.sin(angle) * data.orbitRadius;
      groupRef.current.position.set(x, 0, z);
    }
  });

  const orbitPoints = !isSun
    ? Array.from({ length: 65 }, (_, i) => {
        const t = (i / 64) * Math.PI * 2;
        return [Math.cos(t) * data.orbitRadius, 0, Math.sin(t) * data.orbitRadius] as [number, number, number];
      })
    : [];

  const scale = hovered || isSelected ? 1.15 : 1;
  const emissiveIntensity = isSun ? 0.9 : (hovered ? 0.25 : isSelected ? 0.2 : 0);

  const planetContent = (
    <group ref={groupRef} position={isSun ? [0, 0, 0] : [data.orbitRadius, 0, 0]} scale={scale}>
      {isSelected && !isSun && <SelectionRing radius={data.radius} />}
      {isSaturn && <SaturnRings radius={data.radius} />}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect(data.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[data.radius, 48, 48]} />
        <meshStandardMaterial
          color={data.color}
          emissive={data.color}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
    </group>
  );

  return (
    <group>
      {!isSun && orbitPoints.length > 0 && (
        <Line points={orbitPoints} color="#334155" />
      )}
      {planetContent}
    </group>
  );
}

interface SolarSystemSceneProps {
  onSelectPlanet: (planetId: string) => void;
  timeScale: number;
  selectedPlanetId: string | null;
  isPaused: boolean;
}

const LERP_SPEED = 0.03;
const CAMERA_OFFSET = new THREE.Vector3(0, 6, 12);

export function SolarSystemScene({
  onSelectPlanet,
  timeScale,
  selectedPlanetId,
  isPaused,
}: SolarSystemSceneProps) {
  const time = useRef(0);
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsType | null>(null);
  const targetPos = useRef(new THREE.Vector3());
  const desiredCamPos = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (!isPaused) time.current += delta * timeScale;

    if (selectedPlanetId && controlsRef.current) {
      const planet = getPlanetById(selectedPlanetId);
      if (planet) {
        if (planet.id === 'sun') {
          targetPos.current.set(0, 0, 0);
        } else {
          const angle = (time.current / planet.orbitPeriod) * Math.PI * 2;
          targetPos.current.set(
            Math.cos(angle) * planet.orbitRadius,
            0,
            Math.sin(angle) * planet.orbitRadius
          );
        }
        desiredCamPos.current.copy(targetPos.current).add(CAMERA_OFFSET);
        controlsRef.current.target.lerp(targetPos.current, LERP_SPEED);
        camera.position.lerp(desiredCamPos.current, LERP_SPEED);
      }
    }
  });

  return (
    <>
      <color attach="background" args={['#0c1222']} />
      <fog attach="fog" args={['#0c1222', 25, 55]} />
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 0, 0]} intensity={2.2} distance={100} />
      <Stars radius={100} depth={60} count={3000} factor={4} />
      <SunGlow />
      {SOLAR_SYSTEM_PLANETS.map((planet) => (
        <Planet
          key={planet.id}
          data={planet}
          time={time}
          onSelect={onSelectPlanet}
          selectedPlanetId={selectedPlanetId}
          isPaused={isPaused}
        />
      ))}
      <OrbitControls
        ref={controlsRef}
        enablePan
        enableZoom
        minDistance={3}
        maxDistance={60}
        maxPolarAngle={Math.PI / 2 + 0.2}
      />
    </>
  );
}
