'use client';

import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import GlobeMesh from './GlobeMesh';
import AtmosphereShader from './AtmosphereShader';
import VisitorTargetLock, { type VisitorLockData } from './VisitorTargetLock';
import CoordinateTracker from './CoordinateTracker';
import CameraRig, { type CameraRigHandle } from '../camera/CameraRig';
import type { SectionId } from '@/lib/cameraPresets';

interface GlobeSceneProps {
  activeSection: SectionId;
  onNodeClick: (section: SectionId) => void;
  onCoordinateChange: (coords: { lat: number; lon: number } | null) => void;
  cameraRigRef: React.RefObject<CameraRigHandle>;
  globeGroupRef: React.RefObject<THREE.Group>;
  visitorLockData: VisitorLockData | null;
  isZoomed: boolean;
  onResetZoom: () => void;
}

function SceneContent({
  activeSection,
  onNodeClick,
  onCoordinateChange,
  cameraRigRef,
  globeGroupRef,
  visitorLockData,
  isZoomed,
  onResetZoom,
}: GlobeSceneProps) {
  const [chromOffset, setChromOffset] = useState(0.0004);
  const [isInteracting, setIsInteracting] = useState(false);
  const glassOpacityRef = useRef(0.28);
  const cameraPos = useRef(new THREE.Vector3(0, 0, 13.2));

  useEffect(() => {
    if (cameraRigRef.current) {
      cameraRigRef.current.onChromAberrationSpike(v => setChromOffset(v));
    }
  }, [cameraRigRef]);

  return (
    <>
      <CameraRig
        ref={cameraRigRef}
        initialSection={activeSection}
      />

      <Stars
        radius={90}
        depth={50}
        count={2800}
        factor={3.5}
        saturation={0.1}
        fade
        speed={0.4}
      />

      {/* ── Direct Sunlight ── */}
      <directionalLight
        position={[14, 7, 10]}
        intensity={2.2}
        color="#FFFFFF"
        castShadow
      />

      {/* ── Space Ambient ── */}
      <ambientLight intensity={0.06} color="#FFFFFF" />

      {/* ── Earth Globe & Surface Entities Group ── */}
      <group ref={globeGroupRef} rotation={[0, 1.35, 0]}>
        <GlobeMesh
          groupRef={globeGroupRef}
          isInteracting={isInteracting}
          opacityRef={glassOpacityRef}
        />
        <AtmosphereShader cameraPosition={cameraPos.current} />

        {/* Clean, Cinematic Visitor GPS Satellite Target Lock */}
        <VisitorTargetLock
          data={visitorLockData}
          isZoomed={isZoomed}
          onResetZoom={onResetZoom}
        />
      </group>

      <CoordinateTracker
        onCoordinateChange={onCoordinateChange}
        globeGroupRef={globeGroupRef}
      />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.72}
          luminanceSmoothing={0.8}
          intensity={0.85}
        />
        <Vignette offset={0.22} darkness={0.72} />
        <ChromaticAberration
          offset={new THREE.Vector2(chromOffset, chromOffset)}
          radialModulation={false}
          modulationOffset={0}
        />
        <Noise opacity={0.018} />
      </EffectComposer>
    </>
  );
}

export default function GlobeScene(props: GlobeSceneProps) {
  return (
    <div className="fixed inset-0 z-0 bg-cyber-bg pointer-events-auto">
      <Canvas
        camera={{
          position: [0, 0, 13.2],
          fov: 45,
          near: 0.1,
          far: 200,
        }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
      >
        <Suspense fallback={null}>
          <SceneContent {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
