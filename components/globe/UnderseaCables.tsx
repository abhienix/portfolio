'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { latLonToVector3 } from '@/lib/geoUtils';

const RADIUS = 5.012; // Hugs just above ocean floor

// Real global submarine fiber-optic route coordinates
const SUBSEA_ROUTES = [
  // 1. SEA-ME-WE / AAE-1: Mumbai -> Arabian Sea -> Red Sea -> Med -> Marseille -> London
  [
    { lat: 18.9, lon: 72.8 },  // Mumbai
    { lat: 23.6, lon: 58.5 },  // Muscat / Oman
    { lat: 12.5, lon: 44.0 },  // Gulf of Aden / Djibouti
    { lat: 27.5, lon: 34.0 },  // Red Sea / Suez
    { lat: 31.5, lon: 29.8 },  // Alexandria
    { lat: 37.0, lon: 15.0 },  // Sicily Channel
    { lat: 43.3, lon: 5.4 },   // Marseille
    { lat: 48.0, lon: -4.5 },  // Brest
    { lat: 51.5, lon: 0.1 },   // London
  ],
  // 2. Transatlantic High-Speed Fiber: London -> New York
  [
    { lat: 50.8, lon: -4.5 },   // Bude / UK
    { lat: 49.0, lon: -20.0 },  // Mid-Atlantic
    { lat: 44.6, lon: -63.5 },  // Halifax / Nova Scotia
    { lat: 40.7, lon: -74.0 },  // New York / New Jersey
  ],
  // 3. Asia-Pacific Subsea Highway: Mumbai -> Chennai -> Singapore -> HK -> Tokyo
  [
    { lat: 18.9, lon: 72.8 },   // Mumbai
    { lat: 8.0,  lon: 77.5 },   // Cape Comorin
    { lat: 13.0, lon: 80.2 },   // Chennai
    { lat: 5.5,  lon: 95.3 },   // Malacca Strait
    { lat: 1.3,  lon: 103.8 },  // Singapore
    { lat: 14.5, lon: 115.0 },  // South China Sea
    { lat: 22.3, lon: 114.2 },  // Hong Kong
    { lat: 35.6, lon: 139.8 },  // Tokyo
  ],
  // 4. Transpacific Cable: Tokyo -> Hawaii -> Los Angeles
  [
    { lat: 35.6, lon: 139.8 },  // Tokyo
    { lat: 28.0, lon: 170.0 },  // Northwest Pacific
    { lat: 21.3, lon: -157.8 }, // Honolulu / Hawaii
    { lat: 28.0, lon: -135.0 }, // Eastern Pacific
    { lat: 33.9, lon: -118.4 }, // Los Angeles
  ],
];

export default function UnderseaCables() {
  const lineMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const pulseRef = useRef(0);

  const { geometries } = useMemo(() => {
    const geos: THREE.BufferGeometry[] = [];

    SUBSEA_ROUTES.forEach(route => {
      const curvePoints: THREE.Vector3[] = [];

      for (let i = 0; i < route.length - 1; i++) {
        const p1 = latLonToVector3(route[i].lat, route[i].lon, RADIUS).normalize();
        const p2 = latLonToVector3(route[i + 1].lat, route[i + 1].lon, RADIUS).normalize();

        const steps = 14;
        for (let s = 0; s < steps; s++) {
          const t = s / steps;
          const pt = new THREE.Vector3().copy(p1).lerp(p2, t).normalize().multiplyScalar(RADIUS);
          curvePoints.push(pt);
        }
      }
      // Add last point
      const last = route[route.length - 1];
      curvePoints.push(latLonToVector3(last.lat, last.lon, RADIUS));

      const curve = new THREE.CatmullRomCurve3(curvePoints);
      // Tube of 0.008 radius hugging the ocean floor
      const tube = new THREE.TubeGeometry(curve, curvePoints.length * 2, 0.007, 4, false);
      geos.push(tube);
    });

    return { geometries: geos };
  }, []);

  const uniforms = useMemo(() => ({
    uPulse: { value: 0 },
    uColor: { value: new THREE.Color('#00E5FF') },
  }), []);

  const vertexShader = `
    varying vec3 vWorldPosition;
    void main() {
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uPulse;
    uniform vec3 uColor;
    varying vec3 vWorldPosition;

    void main() {
      // Subtle glowing fiber pulse traveling along cables
      float wave = sin(vWorldPosition.x * 2.0 + vWorldPosition.z * 2.0 - uPulse * 3.0);
      float intensity = smoothstep(-0.2, 0.9, wave) * 0.45 + 0.35;
      vec3 col = uColor * intensity;
      gl_FragColor = vec4(col, 0.42);
    }
  `;

  useFrame((_, delta) => {
    pulseRef.current += delta;
    uniforms.uPulse.value = pulseRef.current;
  });

  return (
    <group renderOrder={4}>
      {geometries.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          <shaderMaterial
            ref={lineMaterialRef}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
            transparent
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
