'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { latLonToVector3 } from '@/lib/geoUtils';

const PUNE_LAT = 18.5204;
const PUNE_LON = 73.8567;
const RADIUS = 5.0;

export interface VisitorLockData {
  lat: number;
  lon: number;
  city: string;
  country: string;
  source: 'gps' | 'geoip';
  accuracyMeters?: number;
}

interface VisitorTargetLockProps {
  data: VisitorLockData | null;
  isZoomed: boolean;
  onResetZoom?: () => void;
}

export default function VisitorTargetLock({ data, isZoomed, onResetZoom }: VisitorTargetLockProps) {
  const reticleRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef(0);
  const laserMaterialRef = useRef<THREE.ShaderMaterial>(null);

  // 1. Calculate positions & quaternion for visitor GPS node
  const { visitorPos, groupQuaternion, arcGeometry } = useMemo(() => {
    if (!data) return { visitorPos: null, groupQuaternion: null, arcGeometry: null };

    const vPos = latLonToVector3(data.lat, data.lon, RADIUS + 0.04);
    const pPos = latLonToVector3(PUNE_LAT, PUNE_LON, RADIUS + 0.04);

    const normal = vPos.clone().normalize();
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);

    // Geodesic curve from visitor to Pune if not identical
    const p1 = vPos.clone().normalize();
    const p2 = pPos.clone().normalize();
    const angle = p1.angleTo(p2);

    let geom: THREE.TubeGeometry | null = null;
    if (angle > 0.08) {
      const maxHeight = Math.min(Math.max(angle * 0.45, 0.3), 1.5);
      const points: THREE.Vector3[] = [];
      const steps = 32;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const pt = new THREE.Vector3().copy(p1).lerp(p2, t).normalize();
        const alt = maxHeight * Math.sin(t * Math.PI);
        pt.multiplyScalar(RADIUS + alt);
        points.push(pt);
      }
      const curve = new THREE.CatmullRomCurve3(points);
      geom = new THREE.TubeGeometry(curve, 40, 0.016, 6, false);

      const posCount = geom.attributes.position.count;
      const progressArr = new Float32Array(posCount);
      const ringCount = 7;
      for (let seg = 0; seg <= 40; seg++) {
        const t = seg / 40;
        for (let r = 0; r < ringCount; r++) {
          const idx = seg * ringCount + r;
          if (idx < posCount) progressArr[idx] = t;
        }
      }
      geom.setAttribute('aProgress', new THREE.BufferAttribute(progressArr, 1));
    }

    return { visitorPos: vPos, groupQuaternion: q, arcGeometry: geom };
  }, [data]);

  // Laser beam shader
  const uniforms = useMemo(() => ({
    uPulse: { value: 0 },
    uColor: { value: new THREE.Color('#00F5FF') },
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
      float pulseGlow = smoothstep(0.18, 0.0, dist) * 2.5;
      vec3 col = mix(uColor, vec3(1.0, 1.0, 1.0), pulseGlow * 0.4);
      float alpha = clamp(0.35 + pulseGlow * 1.5, 0.0, 1.0);
      gl_FragColor = vec4(col, alpha);
    }
  `;

  useFrame((_, delta) => {
    pulseRef.current = (pulseRef.current + delta * 0.6) % 1.0;
    uniforms.uPulse.value = pulseRef.current;

    if (reticleRef.current) {
      reticleRef.current.rotation.z += delta * 0.6;
    }
    if (ringRef.current) {
      const scale = 1 + (pulseRef.current % 1) * 1.3;
      const opacity = Math.max(0, 1 - (pulseRef.current % 1));
      ringRef.current.scale.setScalar(scale);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.75;
    }
  });

  // Pune Position
  const punePos = useMemo(() => latLonToVector3(PUNE_LAT, PUNE_LON, RADIUS + 0.04), []);
  const puneQuat = useMemo(() => {
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), punePos.clone().normalize());
    return q;
  }, [punePos]);

  return (
    <group>
      {/* ── STATION PUNE COMMAND BASE ANCHOR ── */}
      <group position={punePos} quaternion={puneQuat}>
        <mesh>
          <sphereGeometry args={[0.065, 16, 16]} />
          <meshBasicMaterial color="#00F5FF" />
        </mesh>
        <mesh>
          <ringGeometry args={[0.08, 0.11, 32]} />
          <meshBasicMaterial color="#00F5FF" transparent opacity={0.6} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
        {/* Only show Station Pune text label when not zoomed in close, preventing text overlap */}
        {!isZoomed && (
          <Html center position={[0, 0.36, 0]} style={{ pointerEvents: 'none' }}>
            <div className="font-orbitron text-[7.5px] tracking-widest text-cyber-cyan bg-black/85 border border-cyber-cyan/50 px-2 py-0.5 rounded-xs shadow-[0_0_12px_rgba(0,245,255,0.4)] whitespace-nowrap select-none flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-green beacon-dot" />
              <span>STATION PUNE // COMMAND HUB</span>
            </div>
          </Html>
        )}
      </group>

      {/* ── LASER LINK TO VISITOR IF DIFFERENT FROM PUNE ── */}
      {arcGeometry && (
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
      )}

      {/* ── VISITOR SATELLITE TARGET LOCK RETICLE ── */}
      {data && visitorPos && groupQuaternion && (
        <group position={visitorPos} quaternion={groupQuaternion}>
          {/* Target Center Dot */}
          <mesh>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshBasicMaterial color="#00FF88" />
          </mesh>

          {/* Concentric Rotating Reticle */}
          <mesh ref={reticleRef}>
            <ringGeometry args={[0.13, 0.165, 32]} />
            <meshBasicMaterial
              color="#00FF88"
              transparent
              opacity={0.8}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          {/* Expanding Radar Ping */}
          <mesh ref={ringRef}>
            <ringGeometry args={[0.16, 0.22, 32]} />
            <meshBasicMaterial
              color="#00FF88"
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          {/* 3D Satellite Dossier HUD */}
          <Html center position={[0, 0.58, 0]} style={{ pointerEvents: 'auto', zIndex: 120 }}>
            <div className="font-orbitron text-[8.5px] p-2.5 rounded-xs border border-cyber-green/70 bg-black/90 backdrop-blur-md text-cyber-green select-none whitespace-nowrap shadow-[0_0_25px_rgba(0,255,136,0.35)] animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between gap-3 font-bold mb-1 pb-1 border-b border-cyber-green/30">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-ping" />
                  <span className="tracking-wider text-white">SATELLITE FIX: TARGET LOCKED</span>
                </div>
                <span className="font-mono text-[7.5px] bg-cyber-green/20 text-cyber-green border border-cyber-green/50 px-1 py-0.2 rounded-xs font-bold">
                  {data.source === 'gps' ? 'DEVICE GPS' : 'NETWORK GEOIP'}
                </span>
              </div>

              <div className="font-mono text-[9px] text-cyber-cyan font-bold mb-0.5">
                {data.city}, {data.country}
              </div>

              <div className="font-mono text-[7.5px] text-slate-300 mb-0.5">
                {data.lat.toFixed(4)}°N, {data.lon.toFixed(4)}°E {data.accuracyMeters ? `(±${Math.round(data.accuracyMeters)}m)` : ''}
              </div>

              {isZoomed && onResetZoom && (
                <button
                  type="button"
                  onClick={onResetZoom}
                  className="mt-1.5 w-full py-1 text-[7.5px] font-orbitron font-bold text-black bg-cyber-green hover:bg-white transition-colors rounded-xs tracking-wider cursor-pointer pointer-events-auto"
                >
                  ↺ RESET ORBIT VIEW
                </button>
              )}
            </div>
          </Html>
        </group>
      )}
    </group>
  );
}
