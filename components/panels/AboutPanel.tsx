'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from '@/lib/gsap';
import Cyber3DCard from '@/components/shared/Cyber3DCard';
import CyberScrambleText from '@/components/shared/CyberScrambleText';

type TabId = 'profile' | 'cdac' | 'arsenal' | 'telemetry';

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'profile',   label: 'PROFILE',      icon: '◈' },
  { id: 'cdac',      label: 'C-DAC GRADES', icon: '📜' },
  { id: 'arsenal',   label: 'ARSENAL',      icon: '⚡' },
  { id: 'telemetry', label: 'TELEMETRY',    icon: '📊' },
];

const CDAC_DOMAINS = [
  { domain: 'Concepts of OS & Linux Administration',  focus: 'Kernel, Permissions, System Hardening, Bash Automation' },
  { domain: 'Network Defense & Countermeasures',       focus: 'Firewalls, Suricata NIDS, Wi-Fi Security, Segmentation' },
  { domain: 'IT Infrastructure & DevSecOps',           focus: 'Docker, CI/CD, Gitleaks, Semgrep, Policy-as-Code' },
  { domain: 'Threat Detection & SOC Operations',       focus: 'Wazuh SIEM, Log Ingestion, Alert Correlation, SOAR' },
  { domain: 'Cyber Forensics & PKI Infrastructure',    focus: 'Digital Certificates (DSC), Evidence Triage, FIM' },
  { domain: 'Fundamentals of Computer Networks',       focus: 'TCP/IP, Routing, DNS, TLS 1.3, Packet Inspection' },
  { domain: 'Security Scripting & Automation',         focus: 'Python, FastAPI, iptables Automation, WebSockets' },
];

const METRICS = [
  { value: 80, suffix: '%', label: 'C-DAC PGCP-ITISS', sub: 'C-DAC IACSD, Pune' },
  { value: 12, suffix: ' Mo', label: 'ENTERPRISE OPS', sub: 'Sonsolite Infra (Ranchi)' },
  { value: 5,  suffix: '',  label: 'INDUSTRY CERTS', sub: 'Cisco, IBM, Mastercard' },
];

const LIVE_LOGS = [
  'SENTRYVAULT: Suricata NIDS alert → Wazuh SIEM rule correlation → automated iptables quarantine',
  'SECUREFLOW: Gitleaks secret detection & Semgrep SAST ruleset gating CI/CD pipeline commits',
  'SONSOLITE_INFRA: 30+ endpoint network segmentation, Wi-Fi hardening & least-privilege RBAC active',
  'CONTAINER_GATE: Trivy container vulnerability scanner checking base image CVEs on push',
  'PKI_OPERATIONS: Digital Signature Certificates (DSC) lifecycle & e-tendering token management',
];

function MetricCard({ value, suffix, label, sub }: { value: number; suffix: string; label: string; sub: string }) {
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const obj = { v: 0 };
    gsap.to(obj, {
      v: value,
      duration: 1.4,
      ease: 'power2.out',
      onUpdate() {
        if (numRef.current) numRef.current.textContent = Math.round(obj.v).toString();
      },
    });
  }, [value]);

  return (
    <div className="p-3 border border-cyber-cyan/30 bg-cyber-ocean/40 rounded-sm flex flex-col items-center justify-center text-center group hover:border-cyber-cyan transition-all duration-300 shadow-sm">
      <span className="font-orbitron text-xl font-black text-cyber-cyan drop-shadow-md tracking-wider mb-0.5">
        <span ref={numRef}>0</span>{suffix}
      </span>
      <span className="font-orbitron text-[9px] text-white font-bold tracking-wider mb-0.5">{label}</span>
      <span className="font-inter text-[8.5px] text-slate-400 font-normal">{sub}</span>
    </div>
  );
}

export default function AboutPanel() {
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLogIndex(i => (i + 1) % LIVE_LOGS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="max-w-xl w-full max-h-[88vh] overflow-y-auto"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Cyber3DCard className="p-6 md:p-7 shadow-2xl border border-cyber-cyan/30 bg-cyber-bg/95" maxTilt={6}>
        {/* Top Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-inter text-[10px] text-cyber-cyan tracking-[0.25em] uppercase font-semibold">
              <CyberScrambleText text="CYBERSECURITY DOSSIER // CANDIDATE PROFILE" speed={20} />
            </span>
            <span className="font-orbitron text-[9px] text-cyber-green border border-cyber-green/50 bg-cyber-green/10 px-2 py-0.5 rounded-sm font-semibold animate-pulse-slow">
              C-DAC IACSD PUNE
            </span>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="font-orbitron text-xl font-black text-white tracking-wider flex items-center gap-2">
              <span className="text-cyber-cyan">◈</span>
              <CyberScrambleText text="ABHIMANYU KUMAR" speed={28} />
            </h2>
            <span className="font-mono text-[9px] text-slate-400">CALLSIGN: AEGIS-01</span>
          </div>
          <div className="h-px bg-gradient-to-r from-cyber-cyan/80 via-cyber-border to-transparent mt-2.5" />
        </div>

        {/* ── Slick Interactive Tab Switcher ── */}
        <div className="flex gap-1.5 p-1 bg-cyber-ocean/50 border border-cyber-border/80 rounded-sm mb-5">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 py-2 px-1 rounded-xs font-orbitron text-[9px] font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-1 truncate ${
                activeTab === tab.id
                  ? 'text-cyber-bg bg-cyber-cyan shadow-cyan-sm font-black'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="hidden sm:inline">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ── Tab Content Panels ── */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            {/* ══ TAB 1: EXECUTIVE PROFILE ══ */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Identity Card with Real Photograph */}
                <div className="flex gap-4 items-center p-3.5 bg-cyber-ocean/30 border border-cyber-border rounded-sm">
                  <div className="relative flex-shrink-0">
                    <div
                      className="hex-clip w-20 h-20 bg-gradient-to-br from-cyber-ocean via-cyber-land to-cyber-bg flex items-center justify-center border-2 border-cyber-cyan relative overflow-hidden shadow-cyan-sm"
                      style={{ width: '76px', height: '76px' }}
                    >
                      <img
                        src="/images/abhimanyu.jpg"
                        alt="Abhimanyu Kumar"
                        className="w-full h-full object-cover object-top scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyber-cyan/15 to-transparent animate-scanline pointer-events-none" />
                    </div>
                    <div className="absolute -inset-1 border border-cyber-cyan/40 rounded-full animate-ping opacity-25 pointer-events-none" />
                  </div>

                  <div className="flex-1">
                    <div className="font-orbitron text-base font-black text-white tracking-wide mb-0.5">
                      ABHIMANYU KUMAR
                    </div>
                    <div className="font-inter text-xs text-cyber-cyan font-semibold mb-0.5">
                      SOC Analyst &middot; DevSecOps Engineer
                    </div>
                    <div className="font-inter text-xs text-slate-300 font-medium mb-1">
                      PGCP-ITISS (C-DAC Pune, Feb 2026 &middot; 80.0%)
                    </div>
                    <div className="flex flex-wrap gap-x-2 text-[10.5px] text-slate-400">
                      <span><strong className="text-cyber-green">●</strong> Bokaro Steel City, Jharkhand</span>
                      <span>&middot;</span>
                      <span>Station: Pune, MH</span>
                    </div>
                  </div>
                </div>

                {/* Mission Statement */}
                <div className="p-3.5 bg-cyber-ocean/20 border-l-2 border-cyber-cyan rounded-sm text-xs font-inter text-slate-200 leading-relaxed">
                  <span className="text-white font-bold">OPERATIONAL DIRECTIVE:</span> Security analyst with 12 months enterprise IT &amp; network operations tenure (10 Feb 2025 – 20 Feb 2026). Specializing in shifting security left across CI/CD pipelines (Gitleaks, Semgrep, Trivy), automating SIEM threat detection (Wazuh, Suricata), and hardening perimeter access with least-privilege controls.
                </div>

                {/* 3 Metric Cards */}
                <div className="grid grid-cols-3 gap-2.5">
                  {METRICS.map(m => (
                    <MetricCard key={m.label} {...m} />
                  ))}
                </div>

                {/* Verified Degrees Grid */}
                <div className="space-y-2">
                  <div className="font-orbitron text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">
                    ACADEMIC ACCREDITATIONS
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-inter">
                    <div className="p-2.5 bg-cyber-ocean/30 border border-cyber-border rounded-sm">
                      <div className="font-orbitron text-[10px] font-bold text-white">MCA (73.25% &middot; DIV I)</div>
                      <div className="text-[9.5px] text-slate-300">Marwari College, Ranchi Univ (2024)</div>
                    </div>
                    <div className="p-2.5 bg-cyber-ocean/30 border border-cyber-border rounded-sm">
                      <div className="font-orbitron text-[10px] font-bold text-white">BCA (78.90% &middot; DIV I)</div>
                      <div className="text-[9.5px] text-slate-300">Doranda College, Ranchi Univ (2022)</div>
                    </div>
                    <div className="p-2.5 bg-cyber-ocean/30 border border-cyber-border rounded-sm">
                      <div className="font-orbitron text-[10px] font-bold text-white">XII SCIENCE (63.2%)</div>
                      <div className="text-[9.5px] text-slate-300">St. Xavier&apos;s College Ranchi (2019)</div>
                    </div>
                    <div className="p-2.5 bg-cyber-ocean/30 border border-cyber-border rounded-sm">
                      <div className="font-orbitron text-[10px] font-bold text-white">X GENERAL (87.4%)</div>
                      <div className="text-[9.5px] text-slate-300">DAV Public School Dugda, Bokaro (2017)</div>
                    </div>
                  </div>
                </div>

                {/* Leadership & Public Service */}
                <div className="p-3 bg-cyber-ocean/30 border border-cyber-border rounded-sm space-y-1 text-xs font-inter text-slate-300">
                  <div className="flex items-center gap-1.5 text-cyber-green font-bold text-[10px] font-orbitron">
                    <span>★</span> EXTRA-CURRICULAR LEADERSHIP
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    &bull; <strong>NSS Team Leader:</strong> Coordinated environmental afforestation drive planting over 500 trees with &apos;Team Green&apos;.
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    &bull; <strong>Bal Siksha Camp:</strong> Initiated and organized educational camp at Madhukam Basti slum area providing mentoring and basic education to underprivileged children.
                  </p>
                </div>

                {/* Direct Action Row */}
                <div className="flex gap-2 pt-1">
                  <a
                    href="/Abhimanyu_Kumar_Resume.pdf"
                    download="Abhimanyu_Kumar_Resume.pdf"
                    className="flex-1 py-2 text-center font-orbitron text-[9.5px] font-bold text-cyber-bg bg-cyber-cyan hover:brightness-110 rounded-xs transition-all tracking-wider shadow-cyan-sm"
                    aria-label="Download resume PDF"
                  >
                    DOWNLOAD RESUME ↓
                  </a>
                  <a
                    href="https://linkedin.com/in/abhimanyu-sec"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 text-center font-orbitron text-[9.5px] font-bold text-cyber-cyan border border-cyber-cyan/50 hover:bg-cyber-cyan/10 rounded-xs transition-all tracking-wider"
                  >
                    LINKEDIN ↗
                  </a>
                </div>
              </motion.div>
            )}

            {/* ══ TAB 2: C-DAC SCORECARD ══ */}
            {activeTab === 'cdac' && (
              <motion.div
                key="cdac"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                {/* Aggregate Summary */}
                <div className="p-3.5 bg-cyber-ocean/40 border border-cyber-green/40 rounded-sm flex items-center justify-between">
                  <div>
                    <div className="font-orbitron text-xs font-bold text-white">
                      C-DAC IACSD, PUNE &middot; PGCP-ITISS
                    </div>
                    <div className="font-inter text-xs text-slate-300">
                      IT Infrastructure, Systems &amp; Security &middot; Completed Feb 2026
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-orbitron text-xl font-black text-cyber-green">80.0%</span>
                    <div className="font-mono text-[9px] text-slate-400">FIRST CLASS AGGREGATE</div>
                  </div>
                </div>

                {/* Core Curriculum Domains */}
                <div className="space-y-2">
                  {CDAC_DOMAINS.map(d => (
                    <div
                      key={d.domain}
                      className="p-2.5 bg-cyber-ocean/30 border border-cyber-border rounded-sm hover:border-cyber-cyan/50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-inter text-xs font-semibold text-white">
                          {d.domain}
                        </span>
                        <span className="font-orbitron text-[8px] font-bold text-cyber-green px-1.5 py-0.2 bg-cyber-green/10 border border-cyber-green/40 rounded-xs">
                          CURRICULUM
                        </span>
                      </div>
                      <div className="font-inter text-[10px] text-slate-400">
                        {d.focus}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ══ TAB 3: DEFENSE ARSENAL ══ */}
            {activeTab === 'arsenal' && (
              <motion.div
                key="arsenal"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-3"
              >
                {/* 01 // SIEM & Detection */}
                <div className="p-3.5 bg-cyber-ocean/30 border border-cyber-border rounded-sm hover:border-cyber-cyan/50 transition-colors">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-orbitron text-xs font-bold text-cyber-cyan flex items-center gap-1.5">
                      <span>01 //</span> SIEM &amp; INCIDENT RESPONSE
                    </span>
                    <span className="text-[9px] font-orbitron text-cyber-green bg-cyber-green/10 border border-cyber-green/40 px-2 py-0.5 rounded-sm font-semibold">
                      ACTIVE DEFENSE
                    </span>
                  </div>
                  <p className="font-inter text-xs text-slate-200 leading-relaxed mb-2">
                    Real-time log ingestion, alert correlation, and behavioral anomaly detection across 30+ endpoints and network perimeter firewalls.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Wazuh SIEM', 'Suricata NIDS', 'Sysmon', 'FIM Log Analysis', 'Tier-1/2 Triage'].map(t => (
                      <span key={t} className="px-2 py-0.5 font-mono text-[10px] text-cyber-text bg-cyber-ocean/80 border border-cyber-border rounded-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 02 // DevSecOps Shift-Left */}
                <div className="p-3.5 bg-cyber-ocean/30 border border-cyber-border rounded-sm hover:border-cyber-cyan/50 transition-colors">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-orbitron text-xs font-bold text-cyber-cyan flex items-center gap-1.5">
                      <span>02 //</span> DEVSECOPS SHIFT-LEFT GATEKEEPING
                    </span>
                    <span className="text-[9px] font-orbitron text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/40 px-2 py-0.5 rounded-sm font-semibold">
                      CI/CD GATES
                    </span>
                  </div>
                  <p className="font-inter text-xs text-slate-200 leading-relaxed mb-2">
                    Automated pre-commit and post-merge security scanning embedded into CI/CD pipelines, blocking secrets and CVEs before production.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Jenkins CI/CD', 'GitHub Actions', 'Gitleaks', 'Semgrep SAST', 'Trivy Scans'].map(t => (
                      <span key={t} className="px-2 py-0.5 font-mono text-[10px] text-cyber-text bg-cyber-ocean/80 border border-cyber-border rounded-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 03 // Runtime & Infrastructure */}
                <div className="p-3.5 bg-cyber-ocean/30 border border-cyber-border rounded-sm hover:border-cyber-cyan/50 transition-colors">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-orbitron text-xs font-bold text-cyber-cyan flex items-center gap-1.5">
                      <span>03 //</span> PERIMETER &amp; CLOUD RUNTIME
                    </span>
                    <span className="text-[9px] font-orbitron text-white/80 bg-white/5 border border-white/20 px-2 py-0.5 rounded-sm font-semibold">
                      HARDENED
                    </span>
                  </div>
                  <p className="font-inter text-xs text-slate-200 leading-relaxed mb-2">
                    Container sandboxing, edge Web Application Firewall tuning, Linux iptables defense, and least-privilege network segmentation.
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Coraza WAF', 'Docker Hardening', 'GCP Cloud Run', 'Linux iptables', 'DSC Key Auth'].map(t => (
                      <span key={t} className="px-2 py-0.5 font-mono text-[10px] text-cyber-text bg-cyber-ocean/80 border border-cyber-border rounded-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══ TAB 4: LAB TELEMETRY ══ */}
            {activeTab === 'telemetry' && (
              <motion.div
                key="telemetry"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Honest label */}
                <div className="flex items-center gap-2 p-2.5 bg-amber-400/8 border border-amber-400/30 rounded-sm">
                  <span className="text-amber-400 text-xs flex-shrink-0">⚠</span>
                  <p className="font-inter text-[10px] text-amber-300 leading-relaxed">
                    <strong>LAB & PROJECT METRICS.</strong> All values below are from home-lab or student projects — not production environments.
                  </p>
                </div>

                {/* Project metrics */}
                <div className="p-4 bg-cyber-ocean/30 border border-cyber-border rounded-sm space-y-3.5">
                  <div>
                    <div className="flex justify-between items-center text-xs font-orbitron mb-1.5">
                      <span className="text-white font-bold tracking-wider">SENTRYVAULT · AUTO-QUARANTINE LATENCY</span>
                      <span className="font-orbitron text-[8px] text-cyber-green border border-cyber-green/40 bg-cyber-green/10 px-1.5 py-0.3 rounded-xs font-bold">PROJECT</span>
                    </div>
                    <div className="font-mono text-[11px] text-cyber-cyan font-bold mb-1.5">&lt; 2s MTTQ · Python SOAR → iptables quarantine</div>
                    <div className="w-full h-2 bg-cyber-bg rounded-full overflow-hidden border border-cyber-border">
                      <div className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-green rounded-full w-[96%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-orbitron mb-1.5">
                      <span className="text-white font-bold tracking-wider">SECUREFLOW · SECRET LEAK DETECTION</span>
                      <span className="font-orbitron text-[8px] text-cyber-green border border-cyber-green/40 bg-cyber-green/10 px-1.5 py-0.3 rounded-xs font-bold">PROJECT</span>
                    </div>
                    <div className="font-mono text-[11px] text-cyber-green font-bold mb-1.5">0 secrets escaped · Gitleaks gate on 150+ CI runs</div>
                    <div className="w-full h-2 bg-cyber-bg rounded-full overflow-hidden border border-cyber-border">
                      <div className="h-full bg-cyber-green rounded-full w-full" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center text-xs font-orbitron mb-1.5">
                      <span className="text-white font-bold tracking-wider">C-DAC PGCP-ITISS · ACADEMIC PERFORMANCE</span>
                      <span className="font-orbitron text-[8px] text-cyber-cyan border border-cyber-cyan/35 bg-cyber-cyan/8 px-1.5 py-0.3 rounded-xs font-bold">VERIFIED</span>
                    </div>
                    <div className="font-mono text-[11px] text-cyber-cyan font-bold mb-1.5">80.0% Aggregate · C-DAC IACSD, Pune</div>
                    <div className="w-full h-2 bg-cyber-bg rounded-full overflow-hidden border border-cyber-border">
                      <div className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-green rounded-full w-[80%]" />
                    </div>
                  </div>
                </div>

                {/* Lab activity log */}
                <div className="p-3.5 bg-black/80 border border-cyber-cyan/30 rounded-sm space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-orbitron text-cyber-cyan pb-1.5 border-b border-cyber-border">
                    <span className="flex items-center gap-1.5 font-bold">
                      <span className="w-2 h-2 rounded-full bg-amber-400 beacon-dot" />
                      LAB ACTIVITY FEED // PROJECT CONTEXT
                    </span>
                    <span className="text-amber-400/70 font-mono text-[8px]">SIMULATION</span>
                  </div>
                  <div className="font-mono text-xs text-slate-200 py-1 flex items-start gap-2">
                    <span className="text-amber-400 font-bold select-none">&gt;</span>
                    <span className="leading-relaxed">{LIVE_LOGS[logIndex]}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Cyber3DCard>
    </motion.div>
  );
}
