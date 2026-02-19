'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';
import { EARTH_MOON_CONFIG } from '@/lib/science-simulations/earth-moon-system-data';

const LERP_SPEED = 0.04;

interface EarthMoonSystemSceneProps {
  /** Day in the lunar cycle (0 - lunarMonthDays) */
  day: number;
  onSelectBody: (id: 'sun' | 'earth' | 'moon') => void;
}

export function EarthMoonSystemScene({
  day,
  onSelectBody,
}: EarthMoonSystemSceneProps) {
  const { lunarMonthDays, earthTiltDegrees, earthOrbitRadius, moonOrbitRadius, moonOrbitTiltDegrees } =
    EARTH_MOON_CONFIG;

  const time = useRef(day);
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsType | null>(null);
  const targetPos = useRef(new THREE.Vector3(0, 0, 0));
  const desiredCamPos = useRef(new THREE.Vector3(0, 12, 26));
  const nodeHighlightColor = '#f97316';

  useFrame(() => {
    // Drive the scene purely from the current day in the lunar cycle.
    // Auto-play is handled in the parent lab component by updating `day`.
    time.current = day;

    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetPos.current, LERP_SPEED);
      camera.position.lerp(desiredCamPos.current, LERP_SPEED);
    }
  });

  const earthAngle = (time.current / lunarMonthDays) * Math.PI * 2 * 0.08;
  const earthX = Math.cos(earthAngle) * earthOrbitRadius;
  const earthZ = Math.sin(earthAngle) * earthOrbitRadius;

  const moonAngle = (time.current / lunarMonthDays) * Math.PI * 2;
  const moonOrbitTilt = THREE.MathUtils.degToRad(moonOrbitTiltDegrees ?? 5);
  const moonY = Math.sin(moonAngle) * moonOrbitRadius * Math.sin(moonOrbitTilt);
  const moonOrbitRadiusProjected = moonOrbitRadius * Math.cos(moonOrbitTilt);
  const moonX = earthX + Math.cos(moonAngle) * moonOrbitRadiusProjected;
  const moonZ = earthZ + Math.sin(moonAngle) * moonOrbitRadiusProjected;

  const earthOrbitPoints = Array.from({ length: 90 }, (_, i) => {
    const t = (i / 90) * Math.PI * 2;
    return [Math.cos(t) * earthOrbitRadius, 0, Math.sin(t) * earthOrbitRadius] as [
      number,
      number,
      number,
    ];
  });

  const moonOrbitPoints = Array.from({ length: 90 }, (_, i) => {
    const t = (i / 90) * Math.PI * 2;
    return [
      earthX + Math.cos(t) * moonOrbitRadiusProjected,
      Math.sin(t) * moonOrbitRadius * Math.sin(moonOrbitTilt),
      earthZ + Math.sin(t) * moonOrbitRadiusProjected,
    ] as [number, number, number];
  });

  // Nodes: where the tilted orbit crosses the Earth–Sun plane (y = 0)
  const nodePositions: [number, number, number][] = [
    [earthX + moonOrbitRadiusProjected, 0, earthZ], // ascending node (approx. between Earth and Moon orbit planes)
    [earthX - moonOrbitRadiusProjected, 0, earthZ], // descending node
  ];

  const earthTiltRad = THREE.MathUtils.degToRad(earthTiltDegrees);

  return (
    <>
      <color attach="background" args={['#020617']} />
      <fog attach="fog" args={['#020617', 20, 60]} />
      <ambientLight intensity={0.25} />
      <pointLight position={[0, 0, 0]} intensity={2.2} distance={100} />
      <Stars radius={80} depth={50} count={2000} factor={3} />

      {/* Sun */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelectBody('sun');
          targetPos.current.set(0, 0, 0);
          desiredCamPos.current.set(0, 10, 22);
        }}
      >
        <mesh>
          <sphereGeometry args={[3, 32, 32]} />
          <meshStandardMaterial
            color="#facc15"
            emissive="#facc15"
            emissiveIntensity={1}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[4.2, 32, 32]} />
          <meshBasicMaterial color="#facc15" transparent opacity={0.18} />
        </mesh>
      </group>

      {/* Earth orbit */}
      <Line points={earthOrbitPoints} color="#1d4ed8" />

      {/* Moon orbit (tilted around current Earth position) */}
      <Line points={moonOrbitPoints} color="#64748b" />

      {/* Line of nodes (subtle) */}
      <Line
        points={nodePositions}
        color={nodeHighlightColor}
      />

      {/* Earth */}
      <group
        position={[earthX, 0, earthZ]}
        rotation={[0, -earthAngle, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectBody('earth');
          targetPos.current.set(earthX, 0, earthZ);
          desiredCamPos.current.set(earthX + 0, 6, earthZ + 10);
        }}
      >
        <mesh rotation={[0, 0, earthTiltRad]}>
          <sphereGeometry args={[1.2, 48, 48]} />
          <meshStandardMaterial color="#3b82f6" emissive="#1e40af" emissiveIntensity={0.2} />
        </mesh>
      </group>

      {/* Moon */}
      <group
        position={[moonX, moonY, moonZ]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectBody('moon');
          targetPos.current.set(moonX, 0, moonZ);
          desiredCamPos.current.set(moonX + 0, 5, moonZ + 8);
        }}
      >
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#e5e7eb" emissive="#9ca3af" emissiveIntensity={0.15} />
        </mesh>
      </group>

      <OrbitControls
        ref={controlsRef}
        enablePan
        enableZoom
        minDistance={4}
        maxDistance={60}
        maxPolarAngle={Math.PI / 2 + 0.3}
      />
    </>
  );
}

