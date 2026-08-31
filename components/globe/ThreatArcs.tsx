'use client';

import { useRef, useMemo, useEffect, useCallback, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { THREAT_ARCS, LEVEL_COLOR, type ThreatArc, type ThreatLevel } from '@/lib/threatArcs';
import { latLonToVector3 } from '@/lib/geoUtils';

// ── Arc pulse vertex shader ──────────────────────────────────────────
const arcVertexShader = `
  attribute float aProgress;
  uniform float uDrawProgress;
  uniform float uPulse;
  varying float vProgress;
  varying float vPulse;

  void main() {
    vProgress = aProgress;
    vPulse = uPulse;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const arcFragmentShader = `
  uniform vec3 uColor;
  uniform float uDrawProgress;
  uniform float uPulse;
  varying float vProgress;

  void main() {
    if (vProgress > uDrawProgress) discard;

    // Pulse: traveling light along arc
    float pulse = smoothstep(0.0, 0.06, vProgress - uPulse) *
                  smoothstep(0.14, 0.08, vProgress - uPulse);
    float brightness = 0.4 + pulse * 1.6;

    // Fade near endpoints
    float fadeIn  = smoothstep(0.0, 0.1, vProgress);
    float fadeOut = smoothstep(1.0, 0.9, vProgress);

    gl_FragColor = vec4(uColor * brightness * fadeIn * fadeOut, (fadeIn * fadeOut) * 0.9);
  }
`;

// ── Endpoint marker pulse vertex shader ─────────────────────────────
const markerVertexShader = `
  uniform float uScale;
  void main() {
    vec3 pos = position * uScale;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const markerFragmentShader = `
  uniform vec3 uColor;
  uniform float uAlpha;
  void main() {
    gl_FragColor = vec4(uColor, uAlpha);
  }
`;

// ── Build a true spherical great-circle arc geometry with progress attribute ──
function buildArcGeometry(
  originLat: number, originLon: number,
  destLat: number, destLon: number,
  segments = 64
): { geometry: THREE.TubeGeometry; curve: THREE.CatmullRomCurve3 } {
  const RADIUS = 5.0;
  const start = latLonToVector3(originLat, originLon, RADIUS);
  const end   = latLonToVector3(destLat, destLon, RADIUS);

  const p1 = start.clone().normalize();
  const p2 = end.clone().normalize();
  const angle = Math.max(p1.angleTo(p2), 0.05);

  // Orbital arc elevation: longer global trajectories arch gracefully into space
  const maxHeight = Math.min(Math.max(angle * 0.48, 0.35), 1.55);

  // Sample points along the authentic spherical great-circle trajectory
  const points: THREE.Vector3[] = [];
  const steps = 36;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Slerp on unit sphere
    const pt = new THREE.Vector3().copy(p1).lerp(p2, t).normalize();
    // Parabolic altitude above surface: peaks smoothly at mid-flight
    const alt = maxHeight * Math.sin(t * Math.PI);
    pt.multiplyScalar(RADIUS + alt);
    points.push(pt);
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve, segments, 0.013, 6, false);

  // Add per-vertex aProgress attribute (0 → 1 along arc)
  const posCount = geometry.attributes.position.count;
  const progressArr = new Float32Array(posCount);
  const ringCount = 7; // radialSegments (6) + 1
  for (let seg = 0; seg <= segments; seg++) {
    const t = seg / segments;
    for (let r = 0; r < ringCount; r++) {
      const idx = seg * ringCount + r;
      if (idx < posCount) progressArr[idx] = t;
    }
  }
  geometry.setAttribute('aProgress', new THREE.BufferAttribute(progressArr, 1));

  return { geometry, curve };
}

interface ArcInstance {
  mesh: THREE.Mesh;
  originSphere: THREE.Mesh;
  destSphere: THREE.Mesh;
  uniforms: {
    uDrawProgress: { value: number };
    uPulse: { value: number };
    uColor: { value: THREE.Color };
    uAlpha?: { value: number };
  };
  markerUniforms: {
    uScale: { value: number };
    uColor: { value: THREE.Color };
    uAlpha: { value: number };
  };
  level: ThreatLevel;
  phase: 'drawing' | 'pulsing' | 'fading';
  startTime: number;
  drawDuration: number;
  fadeDuration: number;
  pulseOffset: number;
}

export default function ThreatArcs() {
  const groupRef = useRef<THREE.Group>(null);
  const instancesRef = useRef<ArcInstance[]>([]);
  const [hoveredData, setHoveredData] = useState<{ arc: ThreatArc; pos: THREE.Vector3 } | null>(null);

  // Shared marker geometry
  const markerGeo = useMemo(() => new THREE.SphereGeometry(0.042, 12, 12), []);

  const createArcInstance = useCallback((arcData: ThreatArc, delay: number): ArcInstance => {
    const color = new THREE.Color(LEVEL_COLOR[arcData.level]);
    const { geometry } = buildArcGeometry(arcData.originLat, arcData.originLon, arcData.destLat, arcData.destLon);

    const uniforms = {
      uDrawProgress: { value: 0 },
      uPulse:        { value: -0.1 },
      uColor:        { value: color.clone() },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: arcVertexShader,
      fragmentShader: arcFragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const mesh = new THREE.Mesh(geometry, material);

    // Endpoint spheres
    const markerUniforms = {
      uScale: { value: 1.0 },
      uColor: { value: color.clone() },
      uAlpha: { value: 0.95 },
    };

    const markerMat = new THREE.ShaderMaterial({
      vertexShader: markerVertexShader,
      fragmentShader: markerFragmentShader,
      uniforms: markerUniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    const origin3D = latLonToVector3(arcData.originLat, arcData.originLon, 5.05);
    const dest3D   = latLonToVector3(arcData.destLat, arcData.destLon, 5.05);

    const originSphere = new THREE.Mesh(markerGeo, markerMat.clone());
    const destSphere   = new THREE.Mesh(markerGeo, markerMat.clone());
    originSphere.position.copy(origin3D);
    destSphere.position.copy(dest3D);

    return {
      mesh,
      originSphere,
      destSphere,
      uniforms,
      markerUniforms,
      level: arcData.level,
      phase: 'drawing',
      startTime: delay,
      drawDuration: 1.5,
      fadeDuration: 1.0,
      pulseOffset: 0,
    };
  }, [markerGeo]);

  useEffect(() => {
    if (!groupRef.current) return;
    const group = groupRef.current;

    const visible = THREAT_ARCS;
    const stagger = 1.2;

    const instances = visible.map((arc, i) => {
      const inst = createArcInstance(arc, i * stagger * 0.45);
      group.add(inst.mesh);
      group.add(inst.originSphere);
      group.add(inst.destSphere);
      return inst;
    });

    instancesRef.current = instances;

    return () => {
      instances.forEach(inst => {
        group.remove(inst.mesh);
        group.remove(inst.originSphere);
        group.remove(inst.destSphere);
        inst.mesh.geometry.dispose();
        (inst.mesh.material as THREE.Material).dispose();
      });
    };
  }, [createArcInstance]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const cycleLen = 8;

    for (const inst of instancesRef.current) {
      const localT = (t - inst.startTime) % cycleLen;

      if (localT < 0) {
        inst.uniforms.uDrawProgress.value = 0;
        continue;
      }

      if (localT < inst.drawDuration) {
        inst.phase = 'drawing';
        inst.uniforms.uDrawProgress.value = localT / inst.drawDuration;
        inst.uniforms.uPulse.value = -0.1;
      } else if (localT < cycleLen - inst.fadeDuration) {
        inst.phase = 'pulsing';
        inst.uniforms.uDrawProgress.value = 1;
        const pulseT = (localT - inst.drawDuration) / (cycleLen - inst.fadeDuration - inst.drawDuration);
        inst.uniforms.uPulse.value = (pulseT % 1.0);
      } else {
        inst.phase = 'fading';
        inst.uniforms.uDrawProgress.value = 1;
      }

      // Marker pulse: scale 1 → 1.35 → 1
      const markerScale = 1 + 0.35 * Math.abs(Math.sin(t * 1.5 + inst.startTime));
      const markerMat0 = inst.originSphere.material as THREE.ShaderMaterial;
      const markerMat1 = inst.destSphere.material as THREE.ShaderMaterial;
      if (markerMat0.uniforms?.uScale) markerMat0.uniforms.uScale.value = markerScale;
      if (markerMat1.uniforms?.uScale) markerMat1.uniforms.uScale.value = markerScale;
    }
  });

  // Calculate interactive hit points for each endpoint
  const hitNodes = useMemo(() => {
    return THREAT_ARCS.map(arc => ({
      arc,
      originPos: latLonToVector3(arc.originLat, arc.originLon, 5.08),
      destPos:   latLonToVector3(arc.destLat, arc.destLon, 5.08),
    }));
  }, []);

  return (
    <group>
      {/* Dynamic WebGL lines and pulsed nodes */}
      <group ref={groupRef} />

      {/* Interactive Raycast Hitboxes for Threat Intel Nodes */}
      {hitNodes.map(({ arc, originPos }) => (
        <mesh
          key={arc.id}
          position={originPos}
          onPointerEnter={(e) => {
            e.stopPropagation();
            setHoveredData({ arc, pos: originPos });
          }}
          onPointerLeave={() => setHoveredData(null)}
        >
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      ))}

      {/* Hover Telemetry HUD Card */}
      {hoveredData && (
        <Html
          position={hoveredData.pos}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div className="bg-cyber-bg/95 border border-cyber-cyan/50 backdrop-blur-md p-3 rounded-xs shadow-[0_0_20px_rgba(0,245,255,0.3)] font-orbitron text-[9px] min-w-[240px] max-w-[280px] select-none">
            <div className="flex items-center justify-between border-b border-cyber-border/60 pb-1 mb-1.5">
              <span className="text-cyber-green font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-green beacon-dot" />
                {hoveredData.arc.type}
              </span>
              <span className="font-mono text-[8px] text-slate-400">{hoveredData.arc.protocol}</span>
            </div>

            <div className="font-bold text-white text-[10px] mb-0.5">{hoveredData.arc.name}</div>
            <div className="font-mono text-[8px] text-cyber-cyan mb-1.5">
              {hoveredData.arc.originName} ➔ {hoveredData.arc.destName}
            </div>

            <div className="font-inter text-[8.5px] text-slate-300 mb-2 leading-relaxed">
              {hoveredData.arc.vector}
            </div>

            <div className="pt-1.5 border-t border-cyber-border/50 flex items-center justify-between text-[8px] font-mono">
              <span className="text-amber-400 font-semibold">{hoveredData.arc.toolLabel}</span>
              <span className="text-cyber-green font-bold">{hoveredData.arc.status}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
