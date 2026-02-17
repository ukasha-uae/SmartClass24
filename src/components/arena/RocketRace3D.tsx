'use client';

/**
 * Rocket Race 3D – Two rockets racing through the sky
 * Fuel 0–100% drives altitude; smooth motion, stars, exhaust. Dubai-grade.
 */

import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import type { Group } from 'three';

const RACE_HEIGHT = 45;
const ROCKET_SPACING = 4;
const LERP = 0.08;

interface RocketMeshProps {
  teamColor: string;
  fuel: number;
  side: 'left' | 'right';
  flicker: boolean;
  isLeader?: boolean;
  reduceMotion?: boolean;
}

const LERP_REDUCED = 0.18; // Snappier when reduce motion (less smooth float)

function RocketMesh({ teamColor, fuel, side, flicker, isLeader, reduceMotion }: RocketMeshProps) {
  const groupRef = useRef<Group>(null);
  const targetY = (fuel / 100) * RACE_HEIGHT;
  const currentY = useRef(0);
  const lerp = reduceMotion ? LERP_REDUCED : LERP;

  useFrame(() => {
    if (!groupRef.current) return;
    currentY.current += (targetY - currentY.current) * lerp;
    groupRef.current.position.y = currentY.current;
  });

  const x = side === 'left' ? -ROCKET_SPACING : ROCKET_SPACING;
  const exhaustScale = 0.8 + (fuel / 100) * 0.6 + (!reduceMotion && flicker ? 0.2 : 0);

  // Metallic paint: team color with high metalness for realistic sheen
  const metallicPaint = {
    color: teamColor,
    metalness: 0.78,
    roughness: 0.28,
    emissive: teamColor,
    emissiveIntensity: isLeader ? 0.12 : 0.06,
  };
  // Lighter metallic gray so fins/nose tip stay visible against dark sky
  const gunmetal = {
    color: '#6b7280',
    metalness: 0.88,
    roughness: 0.25,
    emissive: '#4b5563',
    emissiveIntensity: 0.02,
  };

  return (
    <group ref={groupRef} position={[x, 0, 0]}>
      {/* Nose cone – metallic, pointed */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <coneGeometry args={[0.34, 0.88, 24]} />
        <meshStandardMaterial {...metallicPaint} />
      </mesh>
      {/* Nose tip – small cap for detail */}
      <mesh position={[0, 1.64, 0]} castShadow>
        <sphereGeometry args={[0.06, 12, 8]} />
        <meshStandardMaterial {...gunmetal} />
      </mesh>
      {/* Body – main cylinder */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.31, 0.34, 0.88, 24]} />
        <meshStandardMaterial {...metallicPaint} />
      </mesh>
      {/* Body stripe (accent ring) */}
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.315, 0.318, 0.06, 24]} />
        <meshStandardMaterial
          color={teamColor}
          metalness={0.6}
          roughness={0.35}
          emissive={teamColor}
          emissiveIntensity={0.08}
        />
      </mesh>
      {/* Fins (3) – team-color metallic so wings are clearly visible */}
      {[0, 1, 2].map((i) => {
        const angle = (i / 3) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.37, -0.22, Math.sin(angle) * 0.37]}
            rotation={[0, -angle, Math.PI / 2]}
            castShadow
          >
            <boxGeometry args={[0.14, 0.42, 0.035]} />
            <meshStandardMaterial
              color={teamColor}
              metalness={0.75}
              roughness={0.3}
              emissive={teamColor}
              emissiveIntensity={isLeader ? 0.15 : 0.1}
            />
          </mesh>
        );
      })}
      {/* Exhaust nozzle – visible dark metal (lighter so it reads against sky) */}
      <mesh position={[0, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.22, 0.2, 16]} />
        <meshStandardMaterial
          color="#57534e"
          metalness={0.88}
          roughness={0.25}
          emissive="#44403c"
          emissiveIntensity={0.03}
        />
      </mesh>
      {/* Exhaust flame */}
      <group position={[0, -0.68, 0]} scale={[1, exhaustScale, 1]}>
        <mesh>
          <coneGeometry args={[0.18, 0.65, 12]} />
          <meshBasicMaterial
            color="#ff9500"
            transparent
            opacity={0.88}
          />
        </mesh>
        <mesh position={[0, -0.32, 0]}>
          <coneGeometry args={[0.1, 0.38, 12]} />
          <meshBasicMaterial
            color="#fff5e6"
            transparent
            opacity={0.92}
          />
        </mesh>
      </group>
    </group>
  );
}

/** Camera follows the race; when reduceMotion, camera stays fixed for accessibility */
function RaceCamera({
  fuelLeft,
  fuelRight,
  reduceMotion,
}: {
  fuelLeft: number;
  fuelRight: number;
  reduceMotion: boolean;
}) {
  const { camera } = useThree();
  const targetY = useRef(8);
  const targetZ = useRef(22);
  const initialized = useRef(false);

  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const avgY = ((fuelLeft + fuelRight) / 200) * RACE_HEIGHT;
    if (reduceMotion) {
      if (!initialized.current) {
        cam.position.set(0, 18, 24);
        cam.lookAt(0, RACE_HEIGHT * 0.4, 0);
        cam.updateProjectionMatrix();
        initialized.current = true;
      }
      return;
    }
    targetY.current = Math.max(10, avgY * 0.4 + 8);
    targetZ.current = 18 + (avgY / RACE_HEIGHT) * 6;
    cam.position.y += (targetY.current - cam.position.y) * 0.03;
    cam.position.z += (targetZ.current - cam.position.z) * 0.03;
    cam.lookAt(0, avgY * 0.6, 0);
    cam.updateProjectionMatrix();
  });
  return null;
}

function Scene({
  fuelLeft,
  fuelRight,
  leftColor,
  rightColor,
  flicker,
  reduceMotion,
}: {
  fuelLeft: number;
  fuelRight: number;
  leftColor: string;
  rightColor: string;
  flicker: boolean;
  reduceMotion: boolean;
}) {
  return (
    <>
      <RaceCamera fuelLeft={fuelLeft} fuelRight={fuelRight} reduceMotion={reduceMotion} />
      <fog attach="fog" args={['#0a0e1a', 25, 80]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[20, 30, 15]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={100}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />
      <directionalLight position={[-10, 20, -10]} intensity={0.3} />
      <pointLight position={[0, 20, 10]} intensity={0.4} color="#aaccff" distance={60} />

      <Stars radius={80} depth={60} count={2500} factor={4} saturation={0.6} fade speed={reduceMotion ? 0 : 0.5} />
      <Sparkles
        count={reduceMotion ? 40 : 120}
        scale={[60, 50, 40]}
        position={[0, RACE_HEIGHT * 0.5, 0]}
        size={1.2}
        speed={reduceMotion ? 0 : 0.2}
        color="#ffffff"
        opacity={0.6}
      />

      {/* Horizon / gradient feel – large plane far below */}
      <mesh position={[0, -8, -30]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#0c1220" roughness={1} metalness={0} />
      </mesh>

      {/* Finish line at 100% */}
      <group position={[0, RACE_HEIGHT + 1, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2, 8, 32]} />
          <meshBasicMaterial color="#fbbf24" transparent opacity={0.9} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 2, 32]} />
          <meshBasicMaterial color="#fef3c7" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Altitude markers */}
      {[0, 25, 50, 75, 100].map((pct) => {
        const y = (pct / 100) * RACE_HEIGHT;
        return (
          <group key={pct} position={[-ROCKET_SPACING - 1.2, y, 0]}>
            <mesh>
              <boxGeometry args={[0.03, 0.02, 0.02]} />
              <meshBasicMaterial color="#334155" />
            </mesh>
          </group>
        );
      })}
      {[0, 25, 50, 75, 100].map((pct) => {
        const y = (pct / 100) * RACE_HEIGHT;
        return (
          <group key={`r-${pct}`} position={[ROCKET_SPACING + 1.2, y, 0]}>
            <mesh>
              <boxGeometry args={[0.03, 0.02, 0.02]} />
              <meshBasicMaterial color="#334155" />
            </mesh>
          </group>
        );
      })}

      <RocketMesh teamColor={leftColor} fuel={fuelLeft} side="left" flicker={flicker} isLeader={fuelLeft > fuelRight} reduceMotion={reduceMotion} />
      <RocketMesh teamColor={rightColor} fuel={fuelRight} side="right" flicker={flicker} isLeader={fuelRight > fuelLeft} reduceMotion={reduceMotion} />
    </>
  );
}

export interface RocketRace3DProps {
  fuelLeft: number;
  fuelRight: number;
  leftColor?: string;
  rightColor?: string;
  showPowerFlicker?: boolean;
  reduceMotion?: boolean;
  className?: string;
}

export function RocketRace3D({
  fuelLeft,
  fuelRight,
  leftColor = '#f59e0b',
  rightColor = '#3b82f6',
  showPowerFlicker = false,
  reduceMotion = false,
  className,
}: RocketRace3DProps) {
  return (
    <div
      className={className ?? 'relative w-full h-[520px] rounded-xl overflow-hidden bg-[#050810] shadow-2xl ring-1 ring-white/10'}
      style={{ minHeight: 520 }}
    >
      <Canvas
        camera={{
          position: [0, 12, 22],
          fov: 50,
          near: 0.5,
          far: 200,
        }}
        gl={{ antialias: true, alpha: false }}
        shadows
      >
        <Scene
          fuelLeft={fuelLeft}
          fuelRight={fuelRight}
          leftColor={leftColor}
          rightColor={rightColor}
          flicker={showPowerFlicker}
          reduceMotion={reduceMotion}
        />
      </Canvas>
      {/* Overlay labels */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-between pointer-events-none px-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10">
          <span className="text-xs font-bold" style={{ color: leftColor }}>TEAM LEFT</span>
          <span className="text-sm font-black text-white">{Math.round(fuelLeft)}%</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 backdrop-blur-sm border border-white/10">
          <span className="text-xs font-bold" style={{ color: rightColor }}>TEAM RIGHT</span>
          <span className="text-sm font-black text-white">{Math.round(fuelRight)}%</span>
        </div>
      </div>
    </div>
  );
}
