import type { SectionId } from './cameraPresets';

export interface GlobeNode {
  id: string;
  label: string;
  code: string;
  sub: string;
  section: SectionId;
  lat: number;
  lon: number;
  color: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// REAL OPERATIONAL NODES
// Rooted in the candidate's actual geographical and infrastructure footprint:
// • Pune (C-DAC IACSD & Current Operations Hub)
// • Ranchi (Enterprise Tenure: Sonsolite Infra & HDFC Life)
// • Mumbai (GCP Region asia-south1 Production Containers)
// • GitHub Cloud (Automated DevSecOps CI/CD Pipeline Gates)
// ─────────────────────────────────────────────────────────────────────────────
export const GLOBE_NODES: GlobeNode[] = [
  {
    id: 'about',
    label: 'STATION PUNE',
    code: 'IND-OPS',
    sub: 'C-DAC IACSD & Candidate Command Base',
    section: 'about',
    lat: 18.52,
    lon: 73.85,
    color: '#00F5FF',
  },
  {
    id: 'experience',
    label: 'RANCHI ENTERPRISE',
    code: 'OPS-TENURE',
    sub: 'Sonsolite Infra & HDFC Life Operations',
    section: 'experience',
    lat: 23.34,
    lon: 85.31,
    color: '#FFB700',
  },
  {
    id: 'projects',
    label: 'GCP ASIA-SOUTH1',
    code: 'PRD-CONTAINER',
    sub: 'SecureFlow FastAPI & PostgreSQL Production',
    section: 'projects',
    lat: 19.07,
    lon: 72.87,
    color: '#00FF88',
  },
  {
    id: 'skills',
    label: 'GITHUB ACTIONS GATE',
    code: 'CI-SECURITY',
    sub: 'Gitleaks, Semgrep SAST & Trivy Runner',
    section: 'skills',
    lat: 37.77,
    lon: -122.41,
    color: '#00F5FF',
  },
  {
    id: 'contact',
    label: 'SECURE DISPATCH',
    code: 'COMMS-NODE',
    sub: 'Direct Encrypted Candidate Comms Hub',
    section: 'contact',
    lat: 28.61,
    lon: 77.20, // New Delhi Gateway
    color: '#00F5FF',
  },
];
