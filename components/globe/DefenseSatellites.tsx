'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';

interface SatelliteDef {
  id: string;
  name: string;
  altitude: number;
  inclination: number; // in radians
  speed: number;
  phaseOffset: number;
  color: string;
}

const SATELLITES: SatelliteDef[] = [
  {
    id: 'sat-1',
    name: 'DEFENSE-LEO-01',
    altitude: 5.9,
    inclination: (58 * Math.PI) / 180,
    speed: 0.18,
    phaseOffset: 0,
    color: '#00F5FF',
  },
  {
    id: 'sat-2',
    name: 'SURVEILLANCE-02',
    altitude: 6.3,
    inclination: (28 * Math.PI) / 180,
    speed: 0.22,
    phaseOffset: 2.2,
    color: '#FF8C00',
  },
  {
    id: 'sat-3',
    name: 'RECON-GEO-03',
    altitude: 6.6,
    inclination: (-45 * Math.PI) / 180,
    speed: 0.15,
    phaseOffset: 4.1,
    color: '#00FF88',
  },
];

function SingleSatellite({ def }: { def: SatelliteDef }) {
  const satGroupRef = useRef<THREE.Group>(null);
  const coneRef = useRef<THREE.Mesh>(null);

  // Orbit path circle geometry
  const orbitRingGeo = useMemo(() => {
    return new THREE.RingGeometry(def.altitude - 0.005, def.altitude + 0.005, 64);
  }, [def.altitude]);

  // Downward radar scan cone geometry
  // Cone height reaches from satellite down to Earth surface (approx 1.2 units)
  const coneHeight = def.altitude - 4.95;
  const coneGeo = useMemo(() => {
    const geo = new THREE.ConeGeometry(0.55, coneHeight, 16, 1, true);
    // Shift geometry origin so tip is at satellite (0,0,0) and base expands toward ground
    geo.translate(0, -coneHeight / 2, 0);
    return geo;
  }, [coneHeight]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * def.speed + def.phaseOffset;

    if (satGroupRef.current) {
      // Calculate orbital position on inclined plane
      const theta = t;
      const x = def.altitude * Math.cos(theta);
      const y = def.altitude * Math.sin(theta) * Math.sin(def.inclination);
      const z = def.altitude * Math.sin(theta) * Math.cos(def.inclination);

      satGroupRef.current.position.set(x, y, z);

      // Orient satellite & cone so cone points toward Earth center (0,0,0)
      satGroupRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      {/* ── Orbital Trail Ring ── */}
      <mesh rotation={[def.inclination, 0, 0]}>
        <primitive object={orbitRingGeo} attach="geometry" />
        <meshBasicMaterial
          color={def.color}
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* ── Satellite Body & Downward Scanner Beam ── */}
      <group ref={satGroupRef}>
        {/* Central Satellite Body */}
        <mesh>
          <boxGeometry args={[0.06, 0.06, 0.09]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>

        {/* Solar Panels (Left & Right Wings) */}
        <mesh position={[0.09, 0, 0]}>
          <boxGeometry args={[0.11, 0.004, 0.05]} />
          <meshBasicMaterial color={def.color} />
        </mesh>
        <mesh position={[-0.09, 0, 0]}>
          <boxGeometry args={[0.11, 0.004, 0.05]} />
          <meshBasicMaterial color={def.color} />
        </mesh>

        {/* Downward Conical Radar Scanning Beam */}
        {/* In group coordinate system, lookAt(0,0,0) points +Z toward center */}
        <mesh ref={coneRef} rotation={[Math.PI / 2, 0, 0]}>
          <primitive object={coneGeo} attach="geometry" />
          <meshBasicMaterial
            color={def.color}
            transparent
            opacity={0.08}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Tactical Satellite Label */}
        <Html distanceFactor={15} style={{ pointerEvents: 'none' }}>
          <div className="font-orbitron text-[8px] text-slate-300 bg-black/70 border border-slate-700 px-1.5 py-0.5 rounded-xs select-none whitespace-nowrap opacity-60">
            {def.name}
          </div>
        </Html>
      </group>
    </>
  );
}

export default function DefenseSatellites() {
  return (
    <group>
      {SATELLITES.map(s => (
        <SingleSatellite key={s.id} def={s} />
      ))}
    </group>
  );
}
