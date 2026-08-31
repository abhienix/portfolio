'use client';

import { useRef, useCallback } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { vector3ToLatLon } from '@/lib/geoUtils';

interface CoordinateTrackerProps {
  onCoordinateChange: (coords: { lat: number; lon: number } | null) => void;
  globeGroupRef: React.RefObject<THREE.Group>;
}

const _raycaster = new THREE.Raycaster();
const _mouse = new THREE.Vector2();

export default function CoordinateTracker({
  onCoordinateChange,
  globeGroupRef,
}: CoordinateTrackerProps) {
  const { camera, gl } = useThree();
  const hitRef = useRef<THREE.Mesh>(null);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      _raycaster.setFromCamera(_mouse, camera);
      if (!hitRef.current) return;

      const hits = _raycaster.intersectObject(hitRef.current);
      if (hits.length > 0 && globeGroupRef.current) {
        const localPoint = globeGroupRef.current.worldToLocal(hits[0].point.clone());
        const coords = vector3ToLatLon(localPoint);
        onCoordinateChange(coords);
      } else {
        onCoordinateChange(null);
      }
    },
    [camera, gl, onCoordinateChange, globeGroupRef]
  );

  useFrame(() => {
    gl.domElement.onpointermove = handlePointerMove;
  });

  return (
    <mesh ref={hitRef}>
      <sphereGeometry args={[5, 32, 32]} />
      <meshBasicMaterial visible={false} />
    </mesh>
  );
}
