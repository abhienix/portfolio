'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { latLonToVector3 } from '@/lib/geoUtils';
import type { HoneypotAttack } from '@/app/api/threats/honeypot/route';

const RADIUS = 5.0;

function HoneypotNode({ attack, index }: { attack: HoneypotAttack; index: number }) {
  const [active, setActive] = useState(false);
  const ringRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const { position, quaternion } = useMemo(() => {
    const pos = latLonToVector3(attack.lat, attack.lon, RADIUS + 0.038);
    const normal = pos.clone().normalize();
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    return { position: pos, quaternion: q };
  }, [attack.lat, attack.lon]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 1.8 + index * 0.4;
    const cycle = (t % 2.0) / 2.0;

    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + cycle * 1.6);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 1 - cycle) * 0.8;
    }
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 3.2) * 0.2;
      coreRef.current.scale.setScalar(pulse);
    }
  });

  // Severity color based on report volume
  const color = attack.reports > 100000 ? '#FF2D55' : '#FF9500';

  return (
    <group position={position} quaternion={quaternion}>
      {/* Invisible Hover Hitbox for easy targeting */}
      <mesh
        onClick={(e) => { e.stopPropagation(); setActive(a => !a); }}
        onPointerEnter={() => setActive(true)}
        onPointerLeave={() => setActive(false)}
      >
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Pulsing Attack Sensor Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.046, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Surface Radar Ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.052, 0.082, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Tactical SANS ISC Honeypot Card on Hover */}
      {active && (
        <Html center position={[0, 0.45, 0]} style={{ pointerEvents: 'none', zIndex: 110 }}>
          <div className="p-3 border border-amber-500/80 bg-black/95 backdrop-blur-md text-white max-w-[310px] w-max rounded-sm shadow-[0_0_25px_rgba(255,149,0,0.35)] select-none animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-amber-500/40">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span className="font-orbitron text-xs font-black text-amber-400 tracking-wider">
                  {attack.ip}
                </span>
              </div>
              <span className="font-orbitron text-[8px] bg-red-500/20 text-red-300 border border-red-500/60 px-1.5 py-0.5 rounded-xs font-bold">
                PORT {attack.primaryPort}
              </span>
            </div>

            {/* Sub details */}
            <div className="flex items-center justify-between text-[9px] font-mono text-cyber-cyan mb-1">
              <span className="truncate">{attack.city}, {attack.country} ({attack.countryCode})</span>
              <span className="text-slate-400 font-mono flex-shrink-0">{attack.asn}</span>
            </div>

            <div className="font-inter text-[9.5px] text-slate-300 font-semibold mb-1">
              {attack.threatType}
            </div>

            {/* Honeypot Hit Stats */}
            <div className="bg-amber-950/40 p-1.5 rounded-xs border border-amber-500/30 font-mono text-[8px] text-slate-200 mb-1.5 space-y-0.5">
              <div className="flex justify-between">
                <span className="text-slate-400">PACKETS LOGGED:</span>
                <span className="text-amber-300 font-bold">{attack.reports.toLocaleString()} hits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">TARGETED SENSORS:</span>
                <span className="text-slate-300">{attack.targets} global honeypots</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ORGANIZATION:</span>
                <span className="text-slate-300 truncate max-w-[150px]">{attack.org}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-1 border-t border-amber-500/30 font-mono text-[7px] text-slate-400">
              <span className="text-amber-400/90 font-bold">SANS DSHIELD HONEYPOT SENSOR</span>
              <span className="text-slate-500">24H TELEMETRY</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function HoneypotThreats() {
  const [attacks, setAttacks] = useState<HoneypotAttack[]>([]);

  useEffect(() => {
    fetch('/api/threats/honeypot')
      .then(res => res.json())
      .then(res => {
        if (res.attacks && Array.isArray(res.attacks)) {
          setAttacks(res.attacks);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <group>
      {attacks.map((att, i) => (
        <HoneypotNode key={att.ip + att.primaryPort} attack={att} index={i} />
      ))}
    </group>
  );
}
