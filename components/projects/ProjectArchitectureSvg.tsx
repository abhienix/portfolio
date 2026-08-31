'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  projectId: string;
}

export default function ProjectArchitectureSvg({ projectId }: Props) {
  const [activeStage, setActiveStage] = useState<string | null>(null);

  if (projectId === 'secureflow') {
    const STAGES = [
      { id: 'commit', x: 20, y: 35, label: 'GIT COMMIT', tool: 'Developer Push', icon: '💻', color: '#00F5FF' },
      { id: 'secrets', x: 105, y: 35, label: 'GITLEAKS', tool: 'Secret Gate', icon: '🔑', color: '#00FF88' },
      { id: 'sast', x: 190, y: 35, label: 'SEMGREP', tool: 'SAST Audit', icon: '🔍', color: '#00F5FF' },
      { id: 'docker', x: 275, y: 35, label: 'DOCKER', tool: 'OCI Build', icon: '🐳', color: '#38BDF8' },
      { id: 'trivy', x: 275, y: 110, label: 'TRIVY', tool: 'Container Scan', icon: '🛡️', color: '#00FF88' },
      { id: 'cloud', x: 190, y: 110, label: 'CLOUD RUN', tool: 'GCP Serverless', icon: '☁️', color: '#38BDF8' },
      { id: 'dast', x: 105, y: 110, label: 'OWASP ZAP', tool: 'DAST Testing', icon: '⚡', color: '#FFB700' },
      { id: 'ai', x: 20, y: 110, label: 'AI REMEDIATION', tool: 'LLM Triage', icon: '🤖', color: '#A855F7' },
    ];

    return (
      <div className="bg-black/80 p-3 rounded-sm border border-cyber-cyan/30 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="font-orbitron text-[9px] text-cyber-cyan font-bold tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-green beacon-dot" />
            AUTOMATED CI/CD DEFENSE PIPELINE
          </span>
          <span className="font-mono text-[8.5px] text-slate-400">150+ VERIFIED RUNS</span>
        </div>

        <svg viewBox="0 0 355 160" className="w-full h-auto select-none">
          <defs>
            <linearGradient id="cyanLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#00FF88" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Top Row Connecting Flow (Left to Right) */}
          <path
            d="M 55 45 L 105 45 M 140 45 L 190 45 M 225 45 L 275 45"
            stroke="url(#cyanLine)"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            className="animate-pulse"
          />

          {/* Downward Turn */}
          <path
            d="M 292 60 L 292 95"
            stroke="#00FF88"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />

          {/* Bottom Row Connecting Flow (Right to Left) */}
          <path
            d="M 275 120 L 225 120 M 190 120 L 140 120 M 105 120 L 55 120"
            stroke="#00F5FF"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            className="animate-pulse"
          />

          {/* Nodes */}
          {STAGES.map(s => {
            const isHover = activeStage === s.id;
            return (
              <g
                key={s.id}
                transform={`translate(${s.x}, ${s.y})`}
                onMouseEnter={() => setActiveStage(s.id)}
                onMouseLeave={() => setActiveStage(null)}
                className="cursor-pointer transition-transform duration-150"
              >
                {/* Node Box */}
                <rect
                  x="-5"
                  y="-12"
                  width="70"
                  height="34"
                  rx="3"
                  fill="#051329"
                  stroke={isHover ? '#FFFFFF' : s.color}
                  strokeWidth={isHover ? '1.5' : '1'}
                  filter={isHover ? 'url(#glow)' : undefined}
                />
                {/* Corner Accents */}
                <path d="M -5 -6 L -5 -12 L 1 -12" stroke={s.color} strokeWidth="1" fill="none" />
                <path d="M 59 22 L 65 22 L 65 16" stroke={s.color} strokeWidth="1" fill="none" />

                {/* Text Label */}
                <text x="30" y="2" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontFamily="var(--font-orbitron)" fontWeight="bold">
                  {s.label}
                </text>
                <text x="30" y="13" textAnchor="middle" fill="#94BBD9" fontSize="5.5" fontFamily="var(--font-inter)">
                  {s.tool}
                </text>
              </g>
            );
          })}
        </svg>

        <div className="mt-1 flex items-center justify-between text-[8.5px] font-mono text-slate-300 bg-cyber-ocean/40 px-2 py-1 rounded-xs border border-cyber-border/60">
          <span>{activeStage ? `INSPECTING STAGE: ${activeStage.toUpperCase()}` : 'HOVER NODES TO INSPECT PIPELINE GATES'}</span>
          <span className="text-cyber-green font-bold">ALL GATES PASSING [0 CRIT]</span>
        </div>
      </div>
    );
  }

  if (projectId === 'sentryvault') {
    return (
      <div className="bg-black/80 p-3 rounded-sm border border-cyber-cyan/30 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="font-orbitron text-[9px] text-cyber-cyan font-bold tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-green beacon-dot" />
            ENTERPRISE BANKING SOC LAB ARCHITECTURE
          </span>
          <span className="font-mono text-[8.5px] text-cyber-green">AUTO-CONTAIN &lt; 2s</span>
        </div>

        <svg viewBox="0 0 355 155" className="w-full h-auto select-none">
          <defs>
            <filter id="glow2" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* DMZ Zone Boundary */}
          <rect x="75" y="10" width="185" height="65" rx="3" fill="none" stroke="#FF8C00" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
          <text x="80" y="22" fill="#FF8C00" fontSize="5.5" fontFamily="var(--font-orbitron)" fontWeight="bold">DMZ PERIMETER</text>

          {/* Internal Secure Zone Boundary */}
          <rect x="75" y="85" width="265" height="60" rx="3" fill="none" stroke="#00FF88" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
          <text x="80" y="97" fill="#00FF88" fontSize="5.5" fontFamily="var(--font-orbitron)" fontWeight="bold">INTERNAL SOC &amp; SOAR</text>

          {/* Packet Flows */}
          <path d="M 45 42 L 85 42" stroke="#FF3B3B" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M 140 42 L 175 42" stroke="#00F5FF" strokeWidth="1.5" />
          <path d="M 230 42 L 270 42" stroke="#00FF88" strokeWidth="1.5" />
          <path d="M 205 60 L 205 105" stroke="#FFB700" strokeWidth="1.2" strokeDasharray="3 2" />
          <path d="M 235 118 L 265 118" stroke="#00FF88" strokeWidth="1.5" />

          {/* 1. Public Internet / Attacker */}
          <g transform="translate(10, 28)">
            <rect width="45" height="28" rx="2" fill="#1A0A0A" stroke="#FF3B3B" strokeWidth="1" />
            <text x="22" y="13" textAnchor="middle" fill="#FF8C8C" fontSize="5.5" fontFamily="var(--font-orbitron)" fontWeight="bold">EXTERNAL</text>
            <text x="22" y="22" textAnchor="middle" fill="#94BBD9" fontSize="5" fontFamily="var(--font-inter)">Web Traffic</text>
          </g>

          {/* 2. Caddy TLS */}
          <g transform="translate(85, 28)">
            <rect width="55" height="28" rx="2" fill="#051329" stroke="#00F5FF" strokeWidth="1" />
            <text x="27" y="13" textAnchor="middle" fill="#FFFFFF" fontSize="5.5" fontFamily="var(--font-orbitron)" fontWeight="bold">CADDY TLS</text>
            <text x="27" y="22" textAnchor="middle" fill="#94BBD9" fontSize="5" fontFamily="var(--font-inter)">Reverse Proxy</text>
          </g>

          {/* 3. Coraza WAF */}
          <g transform="translate(175, 28)">
            <rect width="55" height="28" rx="2" fill="#051329" stroke="#FF8C00" strokeWidth="1" />
            <text x="27" y="13" textAnchor="middle" fill="#FFFFFF" fontSize="5.5" fontFamily="var(--font-orbitron)" fontWeight="bold">CORAZA WAF</text>
            <text x="27" y="22" textAnchor="middle" fill="#FF8C00" fontSize="5" fontFamily="var(--font-inter)">CRS3 Filtering</text>
          </g>

          {/* 4. Core App */}
          <g transform="translate(270, 28)">
            <rect width="55" height="28" rx="2" fill="#051329" stroke="#00FF88" strokeWidth="1" />
            <text x="27" y="13" textAnchor="middle" fill="#FFFFFF" fontSize="5.5" fontFamily="var(--font-orbitron)" fontWeight="bold">BANK APP</text>
            <text x="27" y="22" textAnchor="middle" fill="#00FF88" fontSize="5" fontFamily="var(--font-inter)">Hardened Node</text>
          </g>

          {/* 5. Suricata NIDS (Tap) */}
          <g transform="translate(85, 105)">
            <rect width="60" height="28" rx="2" fill="#051329" stroke="#00F5FF" strokeWidth="1" />
            <text x="30" y="13" textAnchor="middle" fill="#FFFFFF" fontSize="5.5" fontFamily="var(--font-orbitron)" fontWeight="bold">SURICATA NIDS</text>
            <text x="30" y="22" textAnchor="middle" fill="#94BBD9" fontSize="5" fontFamily="var(--font-inter)">DMZ Packet Tap</text>
          </g>

          {/* 6. Wazuh SIEM */}
          <g transform="translate(175, 105)">
            <rect width="60" height="28" rx="2" fill="#051329" stroke="#00FF88" strokeWidth="1" />
            <text x="30" y="13" textAnchor="middle" fill="#FFFFFF" fontSize="5.5" fontFamily="var(--font-orbitron)" fontWeight="bold">WAZUH SIEM</text>
            <text x="30" y="22" textAnchor="middle" fill="#00FF88" fontSize="5" fontFamily="var(--font-inter)">Log Correlation</text>
          </g>

          {/* 7. Python SOAR & iptables */}
          <g transform="translate(265, 105)">
            <rect width="65" height="28" rx="2" fill="#140826" stroke="#A855F7" strokeWidth="1" />
            <text x="32" y="13" textAnchor="middle" fill="#E9D5FF" fontSize="5.5" fontFamily="var(--font-orbitron)" fontWeight="bold">PYTHON SOAR</text>
            <text x="32" y="22" textAnchor="middle" fill="#00FF88" fontSize="5" fontFamily="var(--font-inter)">iptables Ban &lt;2s</text>
          </g>
        </svg>

        <div className="mt-1 flex items-center justify-between text-[8.5px] font-mono text-slate-300 bg-cyber-ocean/40 px-2 py-1 rounded-xs border border-cyber-border/60">
          <span>SURICATA + WAZUH CENTRALIZED TELEMETRY</span>
          <span className="text-cyber-cyan font-bold">ZERO UNCONTAINED INTRUSIONS</span>
        </div>
      </div>
    );
  }

  // Red Flag Detector
  return (
    <div className="bg-black/80 p-3 rounded-sm border border-cyber-cyan/30 relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <span className="font-orbitron text-[9px] text-cyber-cyan font-bold tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-green beacon-dot" />
          AI &amp; HEURISTIC DUAL-LAYER THREAT ANALYZER
        </span>
        <span className="font-mono text-[8.5px] text-amber-400">GROQ LPU INFERENCE</span>
      </div>

      <svg viewBox="0 0 355 130" className="w-full h-auto select-none">
        {/* Ingest Arrow */}
        <path d="M 70 60 L 110 38" stroke="#00F5FF" strokeWidth="1.5" strokeDasharray="3 2" />
        <path d="M 70 60 L 110 82" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="3 2" />
        <path d="M 190 38 L 230 60" stroke="#00F5FF" strokeWidth="1.5" />
        <path d="M 190 82 L 230 60" stroke="#A855F7" strokeWidth="1.5" />
        <path d="M 285 60 L 305 60" stroke="#00FF88" strokeWidth="1.5" />

        {/* 1. Raw Input */}
        <g transform="translate(10, 42)">
          <rect width="60" height="36" rx="3" fill="#051329" stroke="#00F5FF" strokeWidth="1" />
          <text x="30" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontFamily="var(--font-orbitron)" fontWeight="bold">INPUT PAYLOAD</text>
          <text x="30" y="26" textAnchor="middle" fill="#94BBD9" fontSize="5" fontFamily="var(--font-inter)">Email / URL / Code</text>
        </g>

        {/* 2. Deterministic Rule Engine */}
        <g transform="translate(110, 20)">
          <rect width="80" height="36" rx="3" fill="#051329" stroke="#00F5FF" strokeWidth="1" />
          <text x="40" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontFamily="var(--font-orbitron)" fontWeight="bold">RULE ENGINE</text>
          <text x="40" y="26" textAnchor="middle" fill="#00FF88" fontSize="5" fontFamily="var(--font-inter)">SQLi, XSS &amp; Phish Regex</text>
        </g>

        {/* 3. Groq AI Inference Layer */}
        <g transform="translate(110, 64)">
          <rect width="80" height="36" rx="3" fill="#140826" stroke="#A855F7" strokeWidth="1" />
          <text x="40" y="15" textAnchor="middle" fill="#E9D5FF" fontSize="6" fontFamily="var(--font-orbitron)" fontWeight="bold">GROQ LPU LAYER</text>
          <text x="40" y="26" textAnchor="middle" fill="#C084FC" fontSize="5" fontFamily="var(--font-inter)">Cognitive Context Reasoner</text>
        </g>

        {/* 4. Risk Evaluator & Scorer */}
        <g transform="translate(230, 42)">
          <rect width="55" height="36" rx="3" fill="#051329" stroke="#FFB700" strokeWidth="1" />
          <text x="27" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontFamily="var(--font-orbitron)" fontWeight="bold">RISK SCORER</text>
          <text x="27" y="26" textAnchor="middle" fill="#FFB700" fontSize="5" fontFamily="var(--font-inter)">0 - 100 Index</text>
        </g>

        {/* 5. Analyst Advisory Output */}
        <g transform="translate(305, 42)">
          <rect width="40" height="36" rx="3" fill="#052E16" stroke="#00FF88" strokeWidth="1" />
          <text x="20" y="15" textAnchor="middle" fill="#86EFAC" fontSize="5.5" fontFamily="var(--font-orbitron)" fontWeight="bold">ADVISORY</text>
          <text x="20" y="26" textAnchor="middle" fill="#FFFFFF" fontSize="5" fontFamily="var(--font-inter)">SOC Steps</text>
        </g>
      </svg>

      <div className="mt-1 flex items-center justify-between text-[8.5px] font-mono text-slate-300 bg-cyber-ocean/40 px-2 py-1 rounded-xs border border-cyber-border/60">
        <span>DUAL EVALUATION: DETERMINISTIC + GENERATIVE</span>
        <span className="text-cyber-green font-bold">LATENCY &lt; 850MS</span>
      </div>
    </div>
  );
}
