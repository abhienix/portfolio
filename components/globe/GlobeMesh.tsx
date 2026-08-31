'use client';

import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

// ─── Realistic Earth Core with Local 2K NASA Textures (Clean, No Grid Lines) ──
function PhotorealisticEarth({ opacityRef }: { opacityRef: React.RefObject<number> }) {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // Load high-res local textures directly from public/textures
  const [dayMap, nightMap, normalMap, specularMap, cloudsMap] = useLoader(TextureLoader, [
    '/textures/earth_day.jpg',
    '/textures/earth_night.jpg',
    '/textures/earth_normal.jpg',
    '/textures/earth_specular.jpg',
    '/textures/earth_clouds.png',
  ]);

  dayMap.colorSpace = THREE.SRGBColorSpace;
  nightMap.colorSpace = THREE.SRGBColorSpace;
  cloudsMap.colorSpace = THREE.SRGBColorSpace;

  dayMap.anisotropy = 8;
  nightMap.anisotropy = 8;
  normalMap.anisotropy = 8;

  useFrame((_, delta) => {
    // Earth opacity from panel hover
    if (earthRef.current) {
      const mat = earthRef.current.material as THREE.MeshStandardMaterial;
      const op = opacityRef.current;
      if (typeof op === 'number') {
        mat.opacity = op;
      }
    }
    // Clouds drift slowly for realistic atmospheric motion
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.012;
    }
  });

  return (
    <group>
      {/* ── Surface Earth Sphere ── */}
      <mesh ref={earthRef} receiveShadow castShadow>
        <sphereGeometry args={[5, 64, 64]} />
        <meshStandardMaterial
          map={dayMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.85, 0.85)}
          roughnessMap={specularMap}
          roughness={0.72}
          metalness={0.08}
          emissiveMap={nightMap}
          emissive={new THREE.Color('#ffcc88')}
          emissiveIntensity={1.8}
          transparent
          opacity={1}
        />
      </mesh>

      {/* ── Realistic Cloud Layer ── */}
      <mesh ref={cloudsRef} scale={[1.012, 1.012, 1.012]}>
        <sphereGeometry args={[5, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.30}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

interface GlobeMeshProps {
  groupRef: React.RefObject<THREE.Group>;
  isInteracting: boolean;
  opacityRef: React.RefObject<number>;
}

export default function GlobeMesh({ groupRef, isInteracting, opacityRef }: GlobeMeshProps) {
  useFrame(() => {
    if (!groupRef.current) return;
    if (!isInteracting) {
      // Smooth majestic Earth rotation (0.0008 radians/frame)
      groupRef.current.rotation.y += 0.0008;
    }
  });

  return (
    // Clean photorealistic Earth with zero cartoon grid lines
    <PhotorealisticEarth opacityRef={opacityRef} />
  );
}
