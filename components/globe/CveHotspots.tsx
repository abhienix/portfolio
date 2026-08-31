'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { latLonToVector3 } from '@/lib/geoUtils';
import type { CisaCve } from '@/app/api/threats/cisa/route';

const RADIUS = 5.0;

function CveMarker({ cve }: { cve: CisaCve }) {
  const [active, setActive] = useState(false);
  const ringRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const { position, quaternion } = useMemo(() => {
    const pos = latLonToVector3(cve.lat, cve.lon, RADIUS + 0.04);
    const normal = pos.clone().normalize();
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    return { position: pos, quaternion: q };
  }, [cve.lat, cve.lon]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 2 + (cve.lat * 0.1);
    const cycle = (t % 2.0) / 2.0;

    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + cycle * 1.5);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = Math.max(0, 1 - cycle) * 0.7;
    }
    if (coreRef.current) {
      const pulse = 1 + Math.sin(t * 3) * 0.18;
      coreRef.current.scale.setScalar(pulse);
    }
  });

  return (
    <group position={position} quaternion={quaternion}>
      {/* Invisible Hover Hitbox for effortless mouse targeting */}
      <mesh
        onClick={(e) => { e.stopPropagation(); setActive(a => !a); }}
        onPointerEnter={() => setActive(true)}
        onPointerLeave={() => setActive(false)}
      >
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Red Alert Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshBasicMaterial color="#FF3B3B" />
      </mesh>

      {/* Surface Expanding Threat Ping Ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.05, 0.08, 24]} />
        <meshBasicMaterial
          color="#FF3B3B"
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Floating Tactical CVE Dossier */}
      {active && (
        <Html center position={[0, 0.42, 0]} style={{ pointerEvents: 'none', zIndex: 100 }}>
          <div className="p-3 border border-red-500/80 bg-black/95 backdrop-blur-md text-white max-w-[290px] w-max rounded-sm shadow-[0_0_25px_rgba(255,59,59,0.35)] select-none animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-red-500/40">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="font-orbitron text-xs font-black text-red-400 tracking-wider">
                  {cve.cveID}
                </span>
              </div>
              <span className="font-orbitron text-[8px] bg-red-500/20 text-red-300 border border-red-500/60 px-1.5 py-0.5 rounded-xs font-bold">
                {cve.cvss}
              </span>
            </div>

            <div className="flex items-center justify-between text-[9px] font-mono text-cyber-cyan mb-1">
              <span className="font-semibold">{cve.vendorProject} &middot; {cve.product}</span>
              <span className="text-slate-400">{cve.region}</span>
            </div>

            <div className="font-inter text-[9.5px] text-slate-200 leading-snug mb-2 line-clamp-3">
              {cve.vulnerabilityName}
            </div>

            <div className="bg-red-950/40 p-1.5 rounded-xs border border-red-500/30 font-mono text-[8px] text-slate-300 mb-1.5">
              <span className="text-cyber-green font-bold">&gt; REMEDIATION:</span> {cve.mitigation}
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-red-500/30 font-mono text-[7px] text-slate-400">
              <span className="text-slate-500">SOURCE: DHS CISA KEV CATALOG</span>
              <span className="text-amber-400">DATE: {cve.dateAdded}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function CveHotspots() {
  const [cves, setCves] = useState<CisaCve[]>([]);

  useEffect(() => {
    fetch('/api/threats/cisa')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.cves) {
          setCves(res.cves);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <group>
      {cves.map(c => (
        <CveMarker key={c.cveID} cve={c} />
      ))}
    </group>
  );
}
