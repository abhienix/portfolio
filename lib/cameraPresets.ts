export type SectionId = 'hero' | 'about' | 'skills' | 'projects' | 'experience' | 'contact';

export interface CameraPreset {
  position: [number, number, number];
  lookAt: [number, number, number];
  globeRotationY: number;
  label: string;
}

// Camera presets with dynamic lookAt targeting.
// By aiming the camera optical axis at [2.6, 0, 0], the Earth at (0,0,0) is
// placed comfortably on the LEFT half of the viewport.
// The entire RIGHT half of the viewport is pure deep space starfield with ZERO overlap.
export const CAMERA_PRESETS: Record<SectionId, CameraPreset> = {
  hero: {
    position: [0.0, 0.0, 13.2],
    lookAt: [2.5, 0.0, 0.0],
    globeRotationY: 1.35, // Faces India (Pune Base: 18.52°N, 73.85°E) front-and-center
    label: 'COMMAND CENTER',
  },
  about: {
    position: [0.0, 0.4, 12.0],
    lookAt: [2.5, 0.0, 0.0],
    globeRotationY: -1.36,
    label: 'STATION INDIA',
  },
  skills: {
    position: [0.0, 3.2, 11.5],
    lookAt: [0.0, -1.2, 0.0],
    globeRotationY: -0.17,
    label: 'CAPABILITY MATRIX',
  },
  projects: {
    position: [0.0, 0.0, 12.0],
    lookAt: [-2.5, 0.0, 0.0],
    globeRotationY: 1.31,
    label: 'ACTIVE OPERATIONS',
  },
  experience: {
    position: [0.0, -0.8, 12.0],
    lookAt: [2.5, 0.0, 0.0],
    globeRotationY: -1.75,
    label: 'DEPLOYMENT HISTORY',
  },
  contact: {
    position: [0.0, -2.4, 12.2],
    lookAt: [0.0, 1.2, 0.0],
    globeRotationY: -0.79,
    label: 'SECURE COMMS',
  },
};

export const SECTION_ORDER: SectionId[] = [
  'hero', 'about', 'skills', 'projects', 'experience', 'contact',
];
