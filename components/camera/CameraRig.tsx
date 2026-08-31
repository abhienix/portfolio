'use client';

import { useRef, useEffect, useImperativeHandle, forwardRef, useCallback } from 'react';
import * as THREE from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { gsap } from '@/lib/gsap';
import { CAMERA_PRESETS, type SectionId } from '@/lib/cameraPresets';

export interface CameraRigHandle {
  flyTo: (section: SectionId, globeGroup: THREE.Group, onComplete?: () => void) => void;
  zoomToCoordinates: (lat: number, lon: number, globeGroup: THREE.Group, onComplete?: () => void) => void;
  resetZoom: (globeGroup: THREE.Group, onComplete?: () => void) => void;
  onChromAberrationSpike: (cb: (v: number) => void) => void;
}

interface CameraRigProps {
  initialSection: SectionId;
}

const CameraRig = forwardRef<CameraRigHandle, CameraRigProps>(
  ({ initialSection }, ref) => {
    const { camera } = useThree();
    const chromCbRef = useRef<((v: number) => void) | null>(null);
    const lookAtTarget = useRef(new THREE.Vector3(2.5, 0, 0));

    // Position camera & lookAt target at initial preset
    useEffect(() => {
      const preset = CAMERA_PRESETS[initialSection];
      camera.position.set(...preset.position);
      lookAtTarget.current.set(...preset.lookAt);
      camera.lookAt(lookAtTarget.current);
    }, [camera, initialSection]);

    useFrame(() => {
      camera.lookAt(lookAtTarget.current);
    });

    const flyTo = useCallback(
      (section: SectionId, globeGroup: THREE.Group, onComplete?: () => void) => {
        const preset = CAMERA_PRESETS[section];
        const [tx, ty, tz] = preset.position;
        const [lx, ly, lz] = preset.lookAt;

        // Chromatic aberration spike
        if (chromCbRef.current) {
          const chromObj1 = { v: 0.0004 };
          gsap.to(chromObj1, {
            v: 0.004,
            duration: 0.3,
            ease: 'power2.in',
            onUpdate() { chromCbRef.current?.(chromObj1.v); },
            onComplete() {
              const chromObj2 = { v: 0.004 };
              gsap.to(chromObj2, {
                v: 0.0004,
                duration: 0.8,
                ease: 'power2.out',
                onUpdate() { chromCbRef.current?.(chromObj2.v); },
              });
            },
          });
        }

        // Camera position fly
        gsap.to(camera.position, {
          x: tx, y: ty, z: tz,
          duration: 1.4,
          ease: 'power3.inOut',
          onComplete,
        });

        // Camera optical lookAt direction interpolation
        gsap.to(lookAtTarget.current, {
          x: lx, y: ly, z: lz,
          duration: 1.4,
          ease: 'power3.inOut',
        });

        // Globe rotation
        gsap.to(globeGroup.rotation, {
          y: globeGroup.rotation.y + preset.globeRotationY - (globeGroup.rotation.y % (Math.PI * 2)),
          duration: 1.4,
          ease: 'power3.inOut',
        });

        // Globe scale dip
        gsap.to(globeGroup.scale, {
          x: 0.97, y: 0.97, z: 0.97,
          duration: 0.4,
          ease: 'power2.in',
          onComplete() {
            gsap.to(globeGroup.scale, { x: 1, y: 1, z: 1, duration: 0.6, ease: 'elastic.out(1, 0.6)' });
          },
        });
      },
      [camera]
    );

    const zoomToCoordinates = useCallback(
      (lat: number, lon: number, globeGroup: THREE.Group, onComplete?: () => void) => {
        // Calculate target rotations to center lat/lon facing the camera
        const radLon = (lon * Math.PI) / 180;
        const targetRotY = Math.PI / 2 - radLon;
        const targetRotX = (lat * Math.PI / 180) * 0.65;

        // Cinematic chromatic aberration spike on satellite lock
        if (chromCbRef.current) {
          const chromObj = { v: 0.0004 };
          gsap.to(chromObj, {
            v: 0.005,
            duration: 0.4,
            ease: 'power2.in',
            onUpdate() { chromCbRef.current?.(chromObj.v); },
            onComplete() {
              gsap.to(chromObj, {
                v: 0.0004,
                duration: 1.0,
                ease: 'power2.out',
                onUpdate() { chromCbRef.current?.(chromObj.v); },
              });
            },
          });
        }

        // Camera flies close to the Earth (z: 8.0)
        gsap.to(camera.position, {
          x: 0.0,
          y: 0.0,
          z: 8.0,
          duration: 2.2,
          ease: 'power3.inOut',
          onComplete,
        });

        // LookAt centers on Earth (0, 0, 0)
        gsap.to(lookAtTarget.current, {
          x: 0.0,
          y: 0.0,
          z: 0.0,
          duration: 2.2,
          ease: 'power3.inOut',
        });

        // Globe rotates to the exact GPS coordinates
        gsap.to(globeGroup.rotation, {
          x: targetRotX,
          y: targetRotY,
          duration: 2.2,
          ease: 'power3.inOut',
        });
      },
      [camera]
    );

    const resetZoom = useCallback(
      (globeGroup: THREE.Group, onComplete?: () => void) => {
        const preset = CAMERA_PRESETS.hero;

        gsap.to(camera.position, {
          x: preset.position[0],
          y: preset.position[1],
          z: preset.position[2],
          duration: 1.6,
          ease: 'power3.inOut',
          onComplete,
        });

        gsap.to(lookAtTarget.current, {
          x: preset.lookAt[0],
          y: preset.lookAt[1],
          z: preset.lookAt[2],
          duration: 1.6,
          ease: 'power3.inOut',
        });

        gsap.to(globeGroup.rotation, {
          x: 0,
          y: preset.globeRotationY,
          duration: 1.6,
          ease: 'power3.inOut',
        });
      },
      [camera]
    );

    useImperativeHandle(ref, () => ({
      flyTo,
      zoomToCoordinates,
      resetZoom,
      onChromAberrationSpike: (cb) => { chromCbRef.current = cb; },
    }));

    return null;
  }
);

CameraRig.displayName = 'CameraRig';
export default CameraRig;
