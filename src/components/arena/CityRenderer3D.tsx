'use client';

/**
 * City Renderer 3D – night city with real light bulbs
 * Uses the SAME Lucide Lightbulb icon as Simple Circuits lab (series/parallel).
 * Students see the exact bulbs from the circuit lab lighting their city.
 * Full display area, wide layout.
 */

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Lightbulb } from 'lucide-react';

const COLS = 6;
const ROWS = 5;
const TOTAL = COLS * ROWS;
const SPACING = 1.1;
const BUILDING_W = 0.5;
const BUILDING_D = 0.5;
const HEIGHT_MIN = 0.8;
const HEIGHT_MAX = 2.2;
const CITY_CENTER_OFFSET = 5.5;
const BULB_ROWS = 3;
const BULB_COLS = 2;
const BULB_ICON_SIZE = 28;

interface CityRenderer3DProps {
  powerLeft: number;
  powerRight: number;
  leftColor?: string;
  rightColor?: string;
  showPowerFlicker?: boolean;
  className?: string;
}

/** Lucide Lightbulb icon in 3D – same as Simple Circuits lab, billboard to camera */
function LightBulb({
  position,
  isLit,
  color,
}: {
  position: [number, number, number];
  isLit: boolean;
  color: string;
}) {
  return (
    <group position={position}>
      <Html
        center
        sprite
        distanceFactor={10}
        wrapperClass="pointer-events-none"
        style={{ width: BULB_ICON_SIZE, height: BULB_ICON_SIZE }}
      >
        <div className="relative flex items-center justify-center">
          {isLit ? (
            <>
              <Lightbulb
                className="drop-shadow-lg"
                style={{
                  width: BULB_ICON_SIZE,
                  height: BULB_ICON_SIZE,
                  color,
                  fill: color,
                  filter: 'brightness(1.2)',
                }}
              />
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  backgroundColor: color,
                  filter: 'blur(12px)',
                  opacity: 0.5,
                }}
              />
            </>
          ) : (
            <Lightbulb
              style={{
                width: BULB_ICON_SIZE,
                height: BULB_ICON_SIZE,
                color: '#9ca3af',
                fill: '#d1d5db',
              }}
            />
          )}
        </div>
      </Html>
    </group>
  );
}

/** Building – dark structure with Lightbulb icons on camera-facing face */
function Building({
  position,
  height,
  isLit,
  teamColor,
}: {
  position: [number, number, number];
  height: number;
  isLit: boolean;
  teamColor: string;
  flicker: boolean;
}) {
  const offset = 0.12;
  const faceZ = BUILDING_D / 2 + 0.08;

  const bulbs = [];
  for (let r = 0; r < BULB_ROWS; r++) {
    for (let c = 0; c < BULB_COLS; c++) {
      const bx = (c - (BULB_COLS - 1) / 2) * offset;
      const by = (r - (BULB_ROWS - 1) / 2) * offset;
      bulbs.push(
        <LightBulb
          key={`${r}-${c}`}
          position={[bx, by, faceZ]}
          isLit={isLit}
          color={teamColor}
        />
      );
    }
  }

  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[BUILDING_W, height, BUILDING_D]} />
        <meshStandardMaterial color="#1a1a20" roughness={0.9} metalness={0.05} />
      </mesh>
      <group>{bulbs}</group>
    </group>
  );
}

/** Colored glow – like circuit lab blur-xl glow around lit bulbs */
function CityGlow({
  litCount,
  teamColor,
  positions,
}: {
  litCount: number;
  teamColor: string;
  positions: Array<{ x: number; z: number }>;
}) {
  const lights = [];
  for (let i = 0; i < litCount && i < positions.length; i++) {
    const { x, z } = positions[i];
    lights.push(
      <pointLight
        key={i}
        position={[x, 1.5, z]}
        color={teamColor}
        intensity={0.55}
        distance={2.8}
        decay={2}
      />
    );
  }
  return <>{lights}</>;
}

function CityBlock({
  side,
  litCount,
  teamColor,
  flicker,
}: {
  side: 'left' | 'right';
  litCount: number;
  teamColor: string;
  flicker: boolean;
}) {
  const sign = side === 'left' ? -1 : 1;
  const baseX = sign * CITY_CENTER_OFFSET;

  const buildings = Array.from({ length: TOTAL }, (_, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const x = baseX + sign * (col * (BUILDING_W + SPACING));
    const z = (row - (ROWS - 1) / 2) * (BUILDING_D + SPACING);
    const height = HEIGHT_MIN + (Math.sin(i * 0.5) * 0.5 + 0.5) * (HEIGHT_MAX - HEIGHT_MIN);
    return { i, x, z, height };
  });

  const glowPositions = buildings.map(({ x, z }) => ({ x, z }));

  return (
    <group>
      {buildings.map(({ i, x, z, height }) => (
        <Building
          key={i}
          position={[x, height / 2, z]}
          height={height}
          isLit={i < litCount}
          teamColor={teamColor}
          flicker={flicker}
        />
      ))}
      <CityGlow litCount={litCount} teamColor={teamColor} positions={glowPositions} />
    </group>
  );
}

function CityScene({
  powerLeft,
  powerRight,
  leftColor,
  rightColor,
  flicker,
}: {
  powerLeft: number;
  powerRight: number;
  leftColor: string;
  rightColor: string;
  flicker: boolean;
}) {
  const litLeft = Math.round((powerLeft / 100) * TOTAL);
  const litRight = Math.round((powerRight / 100) * TOTAL);

  return (
    <>
      <fog attach="fog" args={['#080810', 14, 28]} />
      <ambientLight intensity={0.12} />
      <directionalLight position={[6, 18, 10]} intensity={0.35} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-far={50} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={8} shadow-camera-bottom={-8} shadow-bias={-0.0001} />
      <directionalLight position={[-6, 10, -8]} intensity={0.12} />
      <pointLight position={[0, 5, 8]} intensity={0.08} color="#ffffff" distance={35} />
      <CityBlock side="left" litCount={litLeft} teamColor={leftColor} flicker={flicker} />
      <CityBlock side="right" litCount={litRight} teamColor={rightColor} flicker={flicker} />
      <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[28, 16]} />
        <meshStandardMaterial color="#0a0a10" roughness={1} metalness={0} />
      </mesh>
    </>
  );
}

export function CityRenderer3D({
  powerLeft,
  powerRight,
  leftColor = '#fbbf24',
  rightColor = '#60a5fa',
  showPowerFlicker = false,
  className = '',
}: CityRenderer3DProps) {
  return (
    <div className={`relative h-[520px] w-full rounded-xl overflow-hidden bg-[#040408] shadow-2xl ring-1 ring-white/5 ${className}`}>
      <Canvas
        camera={{ position: [0, 6, 14], fov: 55 }}
        gl={{ antialias: true, alpha: false }}
        shadows
      >
        <CityScene
          powerLeft={powerLeft}
          powerRight={powerRight}
          leftColor={leftColor}
          rightColor={rightColor}
          flicker={showPowerFlicker}
        />
      </Canvas>
    </div>
  );
}
