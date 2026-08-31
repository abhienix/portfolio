'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

// ─── Solar-Aligned Atmospheric Rayleigh Scatter (FrontSide) ──────────────────
// Only illuminates where sunlight strikes! On the night side it fades to 0
// so city lights and deep space stay pitch black with zero milky blue haze.
const innerVertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const innerFragmentShader = `
  uniform vec3 uCameraPosition;
  uniform vec3 uSunPosition;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 viewDir = normalize(uCameraPosition - vWorldPosition);
    vec3 normal = normalize(vNormal);
    vec3 sunDir = normalize(uSunPosition);

    // Fresnel rim effect (only at the extreme edge/limb of the planet)
    float rim = 1.0 - max(dot(normal, viewDir), 0.0);
    float fresnel = pow(rim, 4.2);

    // Solar alignment: atmosphere is ONLY lit on the sunlit hemisphere!
    // Fades smoothly across the dawn/dusk terminator line to pure 0 on the night side.
    float sunScatter = smoothstep(-0.15, 0.45, dot(normal, sunDir));

    vec3 skyColor = vec3(0.20, 0.62, 1.0);
    float alpha = fresnel * sunScatter * 0.85;

    gl_FragColor = vec4(skyColor, alpha);
  }
`;

// ─── Solar-Aligned Outer Halo (BackSide) ──────────────────────────────────────
const outerVertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const outerFragmentShader = `
  uniform vec3 uCameraPosition;
  uniform vec3 uSunPosition;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec3 viewDir = normalize(uCameraPosition - vWorldPosition);
    vec3 normal = normalize(vNormal);
    vec3 sunDir = normalize(uSunPosition);

    // Halo falloff
    float d = max(dot(normal, viewDir), 0.0);
    float haloFalloff = pow(d, 4.5);

    // Only exists on the sun-facing side!
    float sunScatter = smoothstep(-0.2, 0.5, dot(normal, sunDir));
    float intensity = haloFalloff * sunScatter * 0.45;

    vec3 haloColor = vec3(0.15, 0.58, 1.0);
    gl_FragColor = vec4(haloColor, intensity);
  }
`;

interface Props {
  cameraPosition: THREE.Vector3;
}

export default function AtmosphereShader({ cameraPosition }: Props) {
  const innerUniforms = useMemo(() => ({
    uCameraPosition: { value: cameraPosition.clone() },
    uSunPosition: { value: new THREE.Vector3(15, 6, 10) },
  }), []); // eslint-disable-line react-hooks/exhaustive-deps

  const outerUniforms = useMemo(() => ({
    uCameraPosition: { value: cameraPosition.clone() },
    uSunPosition: { value: new THREE.Vector3(15, 6, 10) },
  }), []); // eslint-disable-line react-hooks/exhaustive-deps

  useFrame(({ camera }) => {
    innerUniforms.uCameraPosition.value.copy(camera.position);
    outerUniforms.uCameraPosition.value.copy(camera.position);
  });

  return (
    <>
      {/* ── Surface Atmospheric Limb (Only on daylit side) ── */}
      <mesh scale={[1.015, 1.015, 1.015]} renderOrder={6}>
        <sphereGeometry args={[5, 64, 64]} />
        <shaderMaterial
          vertexShader={innerVertexShader}
          fragmentShader={innerFragmentShader}
          uniforms={innerUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* ── Outer Atmospheric Space Halo (Only on daylit side) ── */}
      <mesh scale={[1.10, 1.10, 1.10]} renderOrder={7}>
        <sphereGeometry args={[5, 64, 64]} />
        <shaderMaterial
          vertexShader={outerVertexShader}
          fragmentShader={outerFragmentShader}
          uniforms={outerUniforms}
          transparent
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
