'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { latLonToVector3 } from '@/lib/geoUtils';
import type { VisitorData } from '@/app/api/threats/recon/route';

const PUNE_LAT = 18.5204;
const PUNE_LON = 73.8567;
const RADIUS = 5.0;

export default function VisitorLink() {
  const [visitor, setVisitor] = useState<VisitorData | null>(null);
  const [hovered, setHovered] = useState(false);
  const pulseRef = useRef(0);
  const ringRef = useRef<THREE.Mesh>(null);
  const laserMaterialRef = useRef<THREE.ShaderMaterial>(null);

  useEffect(() => {
    fetch('/api/threats/recon')
      .then(res => res.json())
      .then(res => {
        if (res.success && res.data) {
          setVisitor(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Compute 3D positions
  const { visitorPos, punePos, arcGeometry, groupQuaternion } = useMemo(() => {
    if (!visitor) return { visitorPos: null, punePos: null, arcGeometry: null, groupQuaternion: null };

    const vPos = latLonToVector3(visitor.lat, visitor.lon, RADIUS + 0.05);
    const pPos = latLonToVector3(PUNE_LAT, PUNE_LON, RADIUS + 0.05);

    // Orientation quaternion for visitor ring
    const normal = vPos.clone().normalize();
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);

    // Slerp geodesic arc
    const p1 = vPos.clone().normalize();
    const p2 = pPos.clone().normalize();
    const angle = Math.max(p1.angleTo(p2), 0.05);
    const maxHeight = Math.min(Math.max(angle * 0.52, 0.4), 1.6);

    const points: THREE.Vector3[] = [];
    const steps = 36;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const pt = new THREE.Vector3().copy(p1).lerp(p2, t).normalize();
      const alt = maxHeight * Math.sin(t * Math.PI);
      pt.multiplyScalar(RADIUS + alt);
      points.push(pt);
    }

    const curve = new THREE.CatmullRomCurve3(points);
    const geometry = new THREE.TubeGeometry(curve, 48, 0.018, 6, false);

    // Attribute progress
    const posCount = geometry.attributes.position.count;
    const progressArr = new Float32Array(posCount);
    const ringCount = 7;
    for (let seg = 0; seg <= 48; seg++) {
      const t = seg / 48;
      for (let r = 0; r < ringCount; r++) {
        const idx = seg * ringCount + r;
        if (idx < posCount) progressArr[idx] = t;
      }
    }
    geometry.setAttribute('aProgress', new THREE.BufferAttribute(progressArr, 1));

    return { visitorPos: vPos, punePos: pPos, arcGeometry: geometry, groupQuaternion: q };
  }, [visitor]);

  // Shader for the traveling visitor laser packet
  const uniforms = useMemo(() => ({
    uPulse: { value: 0 },
    uColor: { value: new THREE.Color('#FFB700') }, // Amber/gold recon laser
  }), []);

  const vertexShader = `
    attribute float aProgress;
    varying float vProgress;
    void main() {
      vProgress = aProgress;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uPulse;
    uniform vec3 uColor;
    varying float vProgress;
    void main() {
      float dist = abs(vProgress - uPulse);
      float pulseGlow = smoothstep(0.18, 0.0, dist) * 2.8;
      vec3 col = mix(uColor, vec3(1.0, 1.0, 1.0), pulseGlow * 0.45);
      float alpha = clamp(0.35 + pulseGlow * 1.5, 0.0, 1.0);
      gl_FragColor = vec4(col, alpha);
    }
  `;

  useFrame((_, delta) => {
    pulseRef.current = (pulseRef.current + delta * 0.5) % 1.0;
    uniforms.uPulse.value = pulseRef.current;

    if (ringRef.current) {
      const scale = 1 + (pulseRef.current % 1) * 1.2;
      const opacity = Math.max(0, 1 - (pulseRef.current % 1));
      ringRef.current.scale.setScalar(scale);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.8;
    }
  });

  if (!visitor || !visitorPos || !arcGeometry || !groupQuaternion) return null;

  return (
    <group>
      {/* ── Encrypted Laser Beam connecting Visitor -> Pune Hub ── */}
      <mesh geometry={arcGeometry} renderOrder={10}>
        <shaderMaterial
          ref={laserMaterialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ── Visitor Geolocation Beacon ── */}
      <group position={visitorPos} quaternion={groupQuaternion}>
        {/* Invisible Hitbox for easy hover */}
        <mesh
          onClick={() => setHovered(h => !h)}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => setHovered(false)}
        >
          <sphereGeometry args={[0.18, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>

        {/* Core Amber Pinpoint */}
        <mesh>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshBasicMaterial color="#FFB700" />
        </mesh>

        {/* Pulsing Radar Ring on surface */}
        <mesh ref={ringRef}>
          <ringGeometry args={[0.09, 0.13, 32]} />
          <meshBasicMaterial
            color="#FFB700"
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>

        {/* Prominent Always-Visible Tag for Visitor */}
        {!hovered && (
          <Html center position={[0, 0.38, 0]} style={{ pointerEvents: 'none' }}>
            <div className="font-orbitron text-[8px] tracking-wider px-2 py-0.5 rounded-xs border bg-black/90 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(255,183,0,0.5)] flex items-center gap-1.5 whitespace-nowrap select-none animate-pulse-slow">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>YOU ARE HERE // {visitor.city}, {visitor.country}</span>
            </div>
          </Html>
        )}

        {/* Tactical Visitor HUD Card on Hover / Click */}
        {hovered && (
          <Html center position={[0, 0.48, 0]} style={{ pointerEvents: 'none', zIndex: 120 }}>
            <div className="font-orbitron text-[9px] p-3 rounded-xs border bg-black/95 border-amber-400 text-amber-300 select-none whitespace-nowrap shadow-[0_0_25px_rgba(255,183,0,0.4)] animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between gap-3 font-bold mb-1.5 pb-1 border-b border-amber-400/40">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>YOUR NODE CONNECTED</span>
                </div>
                <span className="font-mono text-[8px] text-cyber-green bg-cyber-green/10 border border-cyber-green/40 px-1.5 py-0.5 rounded-xs">
                  TLS 1.3 ACTIVE
                </span>
              </div>
              <div className="font-mono text-[8.5px] text-slate-200 mb-0.5">
                Location: <span className="text-white font-bold">{visitor.city}, {visitor.country}</span>
              </div>
              <div className="font-mono text-[8px] text-slate-300 mb-0.5">
                Network: <span className="text-slate-200">{visitor.isp}</span>
              </div>
              <div className="font-mono text-[8.5px] text-amber-400 font-bold mb-1.5">
                Distance to Pune Hub: {visitor.puneDistanceKm.toLocaleString()} KM → Station Pune
              </div>
              <div className="font-inter text-[7px] text-slate-400 border-t border-amber-400/20 pt-1">
                Real-time GeoIP · Encrypted link to Abhimanyu's command hub
              </div>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
