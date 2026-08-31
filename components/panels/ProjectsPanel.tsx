'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cyber3DCard from '@/components/shared/Cyber3DCard';
import CyberScrambleText from '@/components/shared/CyberScrambleText';
import ProjectArchitectureSvg from '@/components/projects/ProjectArchitectureSvg';

const RESUME_URL = '/Abhimanyu_Kumar_Resume.pdf';

export interface ProjectData {
  id: string;
  opCode: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  duration: string;
  status: string;
  tools: string[];
  outcome: string;
  problem: string;
  fullDetails: string;
  githubUrl: string;
  hasSvg: boolean;
}

const PROJECTS: ProjectData[] = [
  {
    id: 'secureflow',
    opCode: 'OPERATION #001',
    tabLabel: 'SECUREFLOW',
    title: 'SecureFlow — Automated DevSecOps Pipeline with AI Security Analysis',
    subtitle: 'End-to-End CI/CD Security Gatekeeping + Privacy-First Local LLM Analysis',
    duration: '1 Month',
    status: 'DEPLOYED',
    problem: 'How can security controls be embedded directly into CI/CD without manual checks, while keeping vulnerability analysis private (no cloud LLM data leakage)?',
    tools: ['GitHub Actions', 'Docker', 'Gitleaks', 'Semgrep SAST', 'Trivy', 'OWASP ZAP', 'Redis & Celery', 'Ubuntu Worker VM', 'FastAPI', 'PostgreSQL', 'GCP Cloud Run', 'Ollama LLM', 'ChromaDB RAG', 'Guardrails AI', 'Model Context Protocol'],
    outcome: '150+ automated pipeline executions. Zero vulnerability escapes to production. Privacy-first AI triage with zero data leaving the infrastructure.',
    fullDetails: 'SecureFlow automates end-to-end security across the CI/CD pipeline. GitHub Actions orchestrates Gitleaks (secret detection), Semgrep (SAST), and Trivy (container scanning) as hard-blocking gates. OWASP ZAP runs asynchronously via Redis and Celery on a dedicated Ubuntu Worker VM. A FastAPI backend on GCP Cloud Run stores findings in PostgreSQL, surfaced through a real-time React dashboard. A locally-hosted Ollama LLM (ChromaDB RAG + Guardrails AI + Model Context Protocol) triages findings in plain language without data leaving the infrastructure.',
    githubUrl: 'https://github.com/abhienix/SecureFlow',
    hasSvg: true,
  },
  {
    id: 'redflag',
    opCode: 'OPERATION #002',
    tabLabel: 'RED FLAG DETECTOR',
    title: 'Red Flag Detector — AI-Powered Phishing and Threat Analysis Tool',
    subtitle: 'Dual-Layer Threat Detection: 24 Client Regex Heuristics + LLM Context Analysis',
    duration: '3 Months',
    status: 'DEPLOYED',
    problem: 'Simple regex can miss novel attacks. Pure LLM is too slow for real-time use. How do we get both instant detection and contextual intelligence?',
    tools: ['Python', 'FastAPI', 'LLM Integration', '24 Client-Side Regex Engines', 'TailwindCSS'],
    outcome: 'Sub-second detection with red-lined text highlighting, 0–100 risk scoring, and plain-language SOC analyst advisory output.',
    fullDetails: 'Red Flag Detector uses a two-layer approach: a client-side engine with 24 regex rules provides instant explainable detection of SQLi, XSS, phishing, and social engineering patterns. A FastAPI backend integrates an LLM for novel attacks that evade signature matching. Each finding includes red-lined text, a severity risk score (0–100), and a plain-language explanation for analyst review.',
    githubUrl: 'https://github.com/abhienix/AI-red-flag-detector',
    hasSvg: true,
  },
  {
    id: 'sentryvault',
    opCode: 'OPERATION #003',
    tabLabel: 'SENTRYVAULT',
    title: 'SentryVault — Enterprise Banking SOC Operations Lab',
    subtitle: 'Multi-VM Fortified DMZ Architecture with Automated SOAR Containment',
    duration: '2 Months',
    status: 'OPERATIONAL',
    problem: 'Build a realistic enterprise security monitoring lab that simulates a banking environment with a hardened perimeter and automated incident response.',
    tools: ['Wazuh SIEM', 'Coraza WAF (CRS3)', 'Suricata NIDS', 'Caddy TLS Reverse Proxy', 'Linux iptables', 'Python SOAR Engine'],
    outcome: 'Automated attacker IP isolation and iptables quarantine executed in under 2 seconds on High/Critical SIEM alert correlation. Zero uncontained intrusions.',
    fullDetails: 'SentryVault is a multi-VM enterprise lab simulating a banking environment. Caddy handles TLS termination; Coraza WAF filters OWASP Top-10 web attacks; Suricata NIDS monitors DMZ traffic. Wazuh SIEM ingests telemetry from all VMs for real-time correlation, FIM, and system auditing. A Python SOAR script automatically quarantines attacker IPs via iptables within 2 seconds of high-confidence alerts.',
    githubUrl: 'https://github.com/abhienix',
    hasSvg: true,
  },
  {
    id: 'medhelp',
    opCode: 'OPERATION #004',
    tabLabel: 'MEDHELP',
    title: 'MedHelp — Smart Healthcare Portal for Rural Communities',
    subtitle: 'Accessible Healthcare Triage & First-Aid Guidance for Low-Digital-Literacy Users',
    duration: '3 Months',
    status: 'OPEN SOURCE',
    problem: 'Rural patients in India often cannot identify the correct medical specialist for their symptoms, leading to delayed treatment.',
    tools: ['HTML5', 'CSS3', 'Bootstrap', 'JavaScript', 'Responsive Design'],
    outcome: 'Single-page portal enabling rural patients to select symptoms, get specialist recommendations, and receive first-aid guidance instantly.',
    fullDetails: 'MedHelp is a single-page web portal designed to help rural patients identify the right specialist based on symptoms. The app displays relevant first-aid guidance and nearby clinic information. Built with HTML, CSS, Bootstrap, and JavaScript with focus on simplicity for low-digital-literacy users.',
    githubUrl: 'https://github.com/abhienix/MedHelp-Smart-Healthcare-Portal.git',
    hasSvg: false,
  },
];

interface CaseStudyModalProps {
  project: ProjectData;
  onClose: () => void;
}

function CaseStudyModal({ project, onClose }: CaseStudyModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} case study`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-cyber-bg/90 backdrop-blur-md" />

      {/* Modal */}
      <motion.div
        className="relative z-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-cyber-ocean/95 border border-cyber-cyan/40 rounded-sm shadow-2xl p-6"
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-mono text-[9px] text-cyber-cyan font-bold border border-cyber-cyan/30 px-2 py-0.5 rounded-xs">{project.opCode}</span>
              <span className="font-orbitron text-[9px] text-cyber-green font-bold">✓ {project.status}</span>
            </div>
            <h2 className="font-orbitron text-base font-black text-white leading-tight">{project.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-4 font-orbitron text-[9px] text-slate-400 hover:text-white border border-cyber-border hover:border-cyber-cyan/50 px-2.5 py-1.5 rounded-xs transition-colors focus:outline-none focus:ring-1 focus:ring-cyber-cyan"
            aria-label="Close case study"
          >
            ESC ✕
          </button>
        </div>
        <div className="h-px bg-cyber-border mb-5" />

        <div className="space-y-5">
          {/* Problem */}
          <div>
            <h3 className="font-orbitron text-[10px] text-cyber-cyan font-bold tracking-wider mb-1.5">PROBLEM STATEMENT</h3>
            <p className="font-inter text-sm text-slate-200 leading-relaxed">{project.problem}</p>
          </div>

          {/* Architecture SVG */}
          {project.hasSvg && (
            <div>
              <h3 className="font-orbitron text-[10px] text-cyber-cyan font-bold tracking-wider mb-2">ARCHITECTURE</h3>
              <ProjectArchitectureSvg projectId={project.id} />
            </div>
          )}

          {/* Full technical overview */}
          <div>
            <h3 className="font-orbitron text-[10px] text-cyber-cyan font-bold tracking-wider mb-1.5">IMPLEMENTATION OVERVIEW</h3>
            <p className="font-inter text-sm text-slate-200 leading-relaxed">{project.fullDetails}</p>
          </div>

          {/* Security controls */}
          <div>
            <h3 className="font-orbitron text-[10px] text-cyber-cyan font-bold tracking-wider mb-2">TECHNOLOGY STACK</h3>
            <div className="flex flex-wrap gap-1.5">
              {project.tools.map(t => (
                <span key={t} className="font-mono text-[9.5px] text-slate-200 bg-cyber-bg/80 border border-cyber-border px-2 py-0.5 rounded-xs">{t}</span>
              ))}
            </div>
          </div>

          {/* Outcome */}
          <div className="p-3.5 bg-cyber-green/10 border border-cyber-green/30 rounded-sm">
            <h3 className="font-orbitron text-[10px] text-cyber-green font-bold tracking-wider mb-1.5">VERIFIED OUTCOME</h3>
            <p className="font-inter text-sm text-white font-semibold leading-relaxed">{project.outcome}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-cyber-border/60">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 text-center font-orbitron text-[10px] font-bold text-cyber-bg bg-cyber-cyan hover:brightness-110 rounded-xs transition-all focus:outline-none"
              aria-label={`View ${project.title} on GitHub`}
            >
              VIEW ON GITHUB ↗
            </a>
            <a
              href={RESUME_URL}
              download="Abhimanyu_Kumar_Resume.pdf"
              className="py-2.5 px-4 text-center font-orbitron text-[10px] font-semibold text-cyber-cyan border border-cyber-cyan/50 hover:bg-cyber-cyan/10 rounded-xs transition-all focus:outline-none"
            >
              RESUME ↓
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectsPanel() {
  const [selectedId, setSelectedId]   = useState<string>('secureflow');
  const [caseStudyId, setCaseStudyId] = useState<string | null>(null);

  const project   = PROJECTS.find(p => p.id === selectedId) || PROJECTS[0];
  const caseStudy = PROJECTS.find(p => p.id === caseStudyId) || null;

  return (
    <>
      <motion.div
        className="max-w-xl w-full max-h-[88vh] overflow-y-auto"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <Cyber3DCard className="p-6 md:p-7 shadow-2xl border border-cyber-cyan/30 bg-cyber-bg/95" maxTilt={6}>

          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-inter text-[10px] text-cyber-cyan tracking-[0.25em] uppercase font-semibold">
                <CyberScrambleText text="PORTFOLIO // ENGINEERING PROJECTS" speed={20} />
              </span>
              <span className="font-orbitron text-[9px] text-cyber-green border border-cyber-green/50 bg-cyber-green/10 px-2 py-0.5 rounded-sm font-semibold">
                4 VERIFIED
              </span>
            </div>
            <h2 className="font-orbitron text-xl font-black text-white tracking-wider flex items-center gap-2">
              <span className="text-cyber-cyan">◉</span> FEATURED OPERATIONS
            </h2>
            <div className="h-px bg-gradient-to-r from-cyber-cyan/80 via-cyber-border to-transparent mt-2.5" />
          </div>

          {/* Project selector tabs */}
          <div className="flex gap-1 p-1 bg-cyber-ocean/50 border border-cyber-border/80 rounded-sm mb-5 overflow-x-auto">
            {PROJECTS.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                aria-pressed={selectedId === p.id}
                className={`flex-shrink-0 flex-1 py-2 px-1.5 rounded-xs font-orbitron text-[8px] font-bold tracking-wider uppercase transition-all duration-200 min-w-fit ${
                  selectedId === p.id
                    ? 'text-cyber-bg bg-cyber-cyan'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {p.tabLabel}
              </button>
            ))}
          </div>

          {/* Project dossier */}
          <AnimatePresence mode="wait">
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="space-y-4"
            >
              {/* Title card */}
              <div className="p-3.5 bg-cyber-ocean/30 border border-cyber-border rounded-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] text-cyber-cyan font-bold border border-cyber-cyan/30 px-1.5 py-0.5 rounded-xs">{project.opCode}</span>
                    <span className="font-mono text-[9px] text-slate-400">{project.duration}</span>
                  </div>
                  <span className="font-orbitron text-[8.5px] text-cyber-green font-bold border border-cyber-green/40 bg-cyber-green/10 px-2 py-0.5 rounded-sm">
                    ✓ {project.status}
                  </span>
                </div>
                <h3 className="font-orbitron text-sm font-black text-white mb-1 leading-tight">{project.title}</h3>
                <div className="font-inter text-xs text-cyber-cyan font-semibold">{project.subtitle}</div>
              </div>

              {/* SVG Architecture (if available) */}
              {project.hasSvg && <ProjectArchitectureSvg projectId={project.id} />}

              {/* Problem statement */}
              <div className="p-3.5 bg-amber-400/8 border-l-2 border-amber-400/50 rounded-sm">
                <div className="font-orbitron text-[9px] text-amber-400 font-bold tracking-wider mb-1">PROBLEM</div>
                <p className="font-inter text-xs text-slate-200 leading-relaxed">{project.problem}</p>
              </div>

              {/* Outcome */}
              <div className="p-3 bg-cyber-green/10 border border-cyber-green/30 rounded-sm">
                <div className="font-orbitron text-[9px] text-cyber-green font-bold tracking-wider mb-1">VERIFIED OUTCOME</div>
                <div className="font-inter text-xs text-white font-semibold leading-relaxed">{project.outcome}</div>
              </div>

              {/* Tech stack */}
              <div>
                <div className="font-orbitron text-[9px] text-slate-400 font-bold tracking-wider uppercase mb-2">TECHNOLOGY STACK</div>
                <div className="flex flex-wrap gap-1.5">
                  {project.tools.map(t => (
                    <span key={t} className="px-2 py-0.5 font-mono text-[9.5px] text-slate-200 bg-cyber-ocean/70 border border-cyber-border rounded-xs">{t}</span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2.5 pt-1 border-t border-cyber-border/60">
                <button
                  onClick={() => setCaseStudyId(project.id)}
                  className="flex-1 py-2.5 font-orbitron text-[9.5px] font-bold text-white border border-cyber-cyan/40 hover:bg-cyber-cyan/10 hover:border-cyber-cyan rounded-xs transition-all focus:outline-none focus:ring-1 focus:ring-cyber-cyan"
                >
                  CASE STUDY ▶
                </button>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 text-center font-orbitron text-[9.5px] font-bold text-cyber-bg bg-cyber-cyan hover:brightness-110 rounded-xs transition-all focus:outline-none"
                  aria-label={`View ${project.title} on GitHub`}
                >
                  GITHUB ↗
                </a>
              </div>
            </motion.div>
          </AnimatePresence>

        </Cyber3DCard>
      </motion.div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {caseStudy && (
          <CaseStudyModal project={caseStudy} onClose={() => setCaseStudyId(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
