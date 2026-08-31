'use client';

import { useRef, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { GLOBE_NODES, type GlobeNode } from '@/lib/globeNodes';
import { latLonToVector3 } from '@/lib/geoUtils';
import type { SectionId } from '@/lib/cameraPresets';

interface GlobeNodesProps {
  onNodeClick: (section: SectionId) => void;
  onHoverChange: (hovering: boolean) => void;
  activeSection: SectionId;
}

interface NodeState {
  node: GlobeNode;
  position: THREE.Vector3;
  pingScale: number;
  pingAlpha: number;
  pingTime: number;
}

function NodeMarker({
  nodeState,
  onNodeClick,
  onHoverChange,
  isActive,
}: {
  nodeState: NodeState;
  onNodeClick: (section: SectionId) => void;
  onHoverChange: (hovering: boolean) => void;
  isActive: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const nodeRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const outerReticleRef = useRef<THREE.Mesh>(null);
  const pingRef = useRef({ scale: 1, alpha: 1, t: 0 });

  const color = useMemo(() => new THREE.Color(nodeState.node.color), [nodeState.node.color]);
  const activeColor = useMemo(() => new THREE.Color('#FFFFFF'), []);
  const isPune = nodeState.node.id === 'about';

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const ping = pingRef.current;

    // Radar ping: every 2.2s
    const cycle = (t + nodeState.pingTime) % 2.2;
    ping.scale = 1 + cycle * 0.9;
    ping.alpha = Math.max(0, 1 - cycle / 2.2);

    if (ringRef.current) {
      ringRef.current.scale.setScalar(ping.scale);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = ping.alpha * (isActive || isPune ? 0.9 : 0.6);
    }
    if (nodeRef.current) {
      const pulseScale = 1 + (hovered || isActive || isPune ? 0.25 : 0) * Math.sin(t * 3.5 + nodeState.pingTime);
      nodeRef.current.scale.setScalar(pulseScale);
    }
    if (outerReticleRef.current) {
      outerReticleRef.current.rotation.z += delta * 0.5;
    }
  });

  const groupQuaternion = useMemo(() => {
    const normal = nodeState.position.clone().normalize();
    const q = new THREE.Quaternion();
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    return q;
  }, [nodeState.position]);

  return (
    <group position={nodeState.position} quaternion={groupQuaternion}>
      {/* Invisible Hover Hitbox */}
      <mesh
        onClick={() => onNodeClick(nodeState.node.section)}
        onPointerEnter={() => { setHovered(true); onHoverChange(true); }}
        onPointerLeave={() => { setHovered(false); onHoverChange(false); }}
      >
        <sphereGeometry args={[0.16, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Core Command Sphere */}
      <mesh ref={nodeRef}>
        <sphereGeometry args={[isPune ? 0.08 : 0.065, 16, 16]} />
        <meshBasicMaterial
          color={hovered || isActive ? activeColor : color}
          transparent
          opacity={hovered || isActive || isPune ? 1.0 : 0.85}
        />
      </mesh>

      {/* Inner Ping Ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.08, 0.11, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.65}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Outer Tactical Reticle for Pune Command Hub */}
      {isPune && (
        <mesh ref={outerReticleRef}>
          <ringGeometry args={[0.14, 0.165, 32]} />
          <meshBasicMaterial
            color="#00F5FF"
            transparent
            opacity={0.45}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Always-visible Command Hub Beacon tag for Station Pune */}
      {isPune && !hovered && (
        <Html center position={[0, 0.38, 0]} style={{ pointerEvents: 'none' }}>
          <div className="font-orbitron text-[8px] tracking-widest text-cyber-cyan bg-black/85 border border-cyber-cyan/50 px-2 py-0.5 rounded-xs shadow-[0_0_14px_rgba(0,245,255,0.4)] whitespace-nowrap flex items-center gap-1.5 select-none animate-pulse-slow">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-green beacon-dot flex-shrink-0" />
            <span>STATION PUNE // COMMAND HUB</span>
          </div>
        </Html>
      )}

      {/* Interactive Tooltip Card on Hover or Active Section */}
      {(hovered || isActive) && (
        <Html
          center
          position={[0, 0.44, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            fontFamily: 'var(--font-orbitron), sans-serif',
            fontSize: '9px',
            letterSpacing: '0.1em',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            padding: '6px 9px',
            background: 'rgba(2,11,24,0.92)',
            borderRadius: '3px',
            border: `1px solid ${nodeState.node.color}77`,
            backdropFilter: 'blur(10px)',
            boxShadow: `0 0 16px ${nodeState.node.color}33`,
          }}>
            <div style={{ color: nodeState.node.color, fontWeight: 'bold', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: nodeState.node.color, display: 'inline-block' }} />
              {nodeState.node.label}
            </div>
            <div style={{ color: '#94BBD9', fontSize: '7px', letterSpacing: '0.05em', marginBottom: hovered ? '3px' : '0' }}>
              <span className="text-cyber-cyan font-mono">{nodeState.node.code}</span> · {nodeState.node.sub}
            </div>
            {hovered && (
              <div style={{ color: '#00F5FF', fontSize: '7px', letterSpacing: '0.15em', borderTop: '1px solid #0E3A6E', paddingTop: '3px', marginTop: '2px' }}>
                CLICK TO OPEN SECTION →
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

export default function GlobeNodes({ onNodeClick, onHoverChange, activeSection }: GlobeNodesProps) {
  const nodeStates = useMemo<NodeState[]>(() =>
    GLOBE_NODES.map((node, i) => ({
      node,
      position: latLonToVector3(node.lat, node.lon, 5.05),
      pingScale: 1,
      pingAlpha: 1,
      pingTime: i * 0.7,
    })),
    []
  );

  return (
    <group>
      {nodeStates.map(state => (
        <NodeMarker
          key={state.node.id}
          nodeState={state}
          onNodeClick={onNodeClick}
          onHoverChange={onHoverChange}
          isActive={activeSection === state.node.section}
        />
      ))}
    </group>
  );
}
