'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cyber3DCard from '@/components/shared/Cyber3DCard';
import CyberScrambleText from '@/components/shared/CyberScrambleText';

type ExpTab = 'work' | 'academics' | 'certs';

const CERTS = [
  {
    issuer: 'CISCO SYSTEMS',
    name: 'Ethical Hacker',
    skills: 'Penetration Testing · Vulnerability Assessment · Reconnaissance',
    detail: 'Official Cisco technical certification covering penetration testing methodologies, vulnerability discovery, and ethical exploitation frameworks.',
    status: 'COMPLETED',
  },
  {
    issuer: 'CISCO SYSTEMS',
    name: 'Introduction to Cybersecurity',
    skills: 'Network Defense · Threat Landscape · Confidentiality & Integrity',
    detail: 'Cisco Networking Academy credential covering foundational cybersecurity concepts, defense-in-depth, and attack vector mitigations.',
    status: 'COMPLETED',
  },
  {
    issuer: 'IBM SKILLBUILD',
    name: 'Cybersecurity Fundamentals',
    skills: 'Enterprise Security · Cryptography · Incident Response',
    detail: 'Official IBM accreditation validating core enterprise defensive architectures, encryption, IAM, and SOC triage workflows.',
    status: 'COMPLETED',
  },
  {
    issuer: 'IBM SKILLBUILD',
    name: 'AI Fundamentals',
    skills: 'Machine Learning · Cognitive Security · Heuristic Detection',
    detail: 'IBM accreditation covering neural networks, predictive heuristics, and AI applications in automated security operations.',
    status: 'COMPLETED',
  },
  {
    issuer: 'MASTERCARD',
    name: 'Cybersecurity Job Simulation',
    skills: 'SOC Triage · Phishing Analysis · Threat Advisory',
    detail: 'Real-world enterprise simulation triaging phishing campaigns, analyzing security alerts, and engineering containment protocols.',
    status: 'COMPLETED',
  },
];

const CDAC_CURRICULUM = [
  'Concepts of OS & Linux Administration',
  'Security Concepts & Network Defense',
  'IT Infrastructure Management & DevSecOps',
  'Wazuh SIEM & SOC Incident Triage',
  'Cyber Forensics & Public Key Infrastructure (PKI)',
  'Network Protocols, Firewalls & Perimeter Security',
  'Security Scripting & Automation (Python)',
];

export default function ExperiencePanel() {
  const [tab, setTab]     = useState<ExpTab>('work');
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});

  const toggleFlip = (name: string) =>
    setFlipped(prev => ({ ...prev, [name]: !prev[name] }));

  return (
    <motion.div
      className="max-w-xl w-full max-h-[88vh] overflow-y-auto"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Cyber3DCard className="p-6 md:p-7 shadow-2xl border border-cyber-cyan/30 bg-cyber-bg/95" maxTilt={6}>

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-inter text-[10px] text-cyber-cyan tracking-[0.25em] uppercase font-semibold">
              <CyberScrambleText text="FIELD DOSSIER // EXPERIENCE & TRAINING" speed={20} />
            </span>
            <span className="font-orbitron text-[9px] text-cyber-green border border-cyber-green/50 bg-cyber-green/10 px-2 py-0.5 rounded-sm font-semibold">
              VERIFIED RECORD
            </span>
          </div>
          <h2 className="font-orbitron text-xl font-black text-white tracking-wider flex items-center gap-2">
            <span className="text-cyber-cyan">◇</span> EXPERIENCE & CREDENTIALS
          </h2>
          <div className="h-px bg-gradient-to-r from-cyber-cyan/80 via-cyber-border to-transparent mt-2.5" />
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1.5 p-1 bg-cyber-ocean/50 border border-cyber-border/80 rounded-sm mb-5">
          {[
            { id: 'work' as ExpTab,      label: 'WORK EXPERIENCE',  icon: '💼' },
            { id: 'academics' as ExpTab, label: 'ACADEMICS',         icon: '📜' },
            { id: 'certs' as ExpTab,     label: 'CERTIFICATIONS',    icon: '★' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              aria-pressed={tab === t.id}
              className={`flex-1 py-2 px-1.5 rounded-xs font-orbitron text-[9px] font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-1 ${
                tab === t.id
                  ? 'text-cyber-bg bg-cyber-cyan'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="hidden sm:inline">{t.icon}</span>
              <span className="truncate">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">

          {/* WORK */}
          {tab === 'work' && (
            <motion.div key="work" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>

              {/* Timeline entry */}
              <div className="relative pl-4 border-l-2 border-cyber-cyan/40">
                {/* Year marker */}
                <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-cyber-cyan shadow-[0_0_8px_rgba(0,245,255,0.5)]" />

                <div className="p-4 bg-cyber-ocean/30 border border-cyber-border rounded-sm hover:border-cyber-cyan/40 transition-colors">
                  {/* Date + status */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-[10px] text-cyber-cyan font-bold">10 FEB 2025 → 20 FEB 2026 (1 YEAR)</span>
                    <span className="font-orbitron text-[8.5px] font-bold text-cyber-green border border-cyber-green/40 bg-cyber-green/10 px-2 py-0.5 rounded-sm">COMPLETED</span>
                  </div>

                  {/* Role */}
                  <h3 className="font-orbitron text-sm font-black text-white mb-0.5">IT Executive</h3>
                  <div className="font-inter text-xs text-cyber-cyan font-semibold mb-2.5">
                    Sonsolite Infra and Power Solutions Pvt. Ltd. · Ranchi, Jharkhand
                  </div>

                  {/* What I did */}
                  <div className="space-y-1.5">
                    {[
                      'Administered and hardened office IT infrastructure including network segmentation, Wi-Fi security configuration, and hardware lifecycle management for 30+ users.',
                      'Enforced OS patch management, user access controls, and role-based permissions (RBAC) following strict least-privilege principles.',
                      'Implemented data backup strategies and quarterly access provisioning audits aligned with security best practices.',
                      'Provided Tier-1/2 technical support — resolved software and security incidents under 15 minutes average.',
                    ].map((point, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-cyber-cyan text-xs flex-shrink-0 mt-0.5">›</span>
                        <span className="font-inter text-[11px] text-slate-200 leading-relaxed">{point}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {['Network Segmentation', 'RBAC', 'Patch Management', 'Wi-Fi Security', 'PKI / DSC', 'Tier-1/2 SOC'].map(t => (
                      <span key={t} className="font-mono text-[8.5px] text-slate-300 bg-cyber-ocean border border-cyber-border rounded-xs px-1.5 py-0.5">{t}</span>
                    ))}
                  </div>
                </div>

                {/* Prior Corporate Tenure — Muted, non-highlighted presentation */}
                <div className="relative mt-3.5">
                  {/* Subtle muted marker */}
                  <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-slate-600 border border-slate-500/40" />

                  <div className="p-3 bg-cyber-ocean/15 border border-cyber-border/50 rounded-sm opacity-80 hover:opacity-100 transition-opacity">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-[9px] text-slate-400 font-semibold">
                        05 AUG 2024 → 31 JAN 2025 (6 MONTHS)
                      </span>
                      <span className="font-orbitron text-[7.5px] text-slate-400 border border-slate-600/40 bg-white/3 px-1.5 py-0.2 rounded-xs">
                        PRIOR CAREER
                      </span>
                    </div>

                    <h3 className="font-orbitron text-xs font-semibold text-slate-300 mb-0.5">Financial Planning Manager</h3>
                    <div className="font-inter text-[10px] text-slate-400 mb-1.5">
                      HDFC Life Insurance Company Limited · Ranchi (Direct Sales - Loyalty)
                    </div>

                    <p className="font-inter text-[10px] text-slate-400 leading-relaxed">
                      Client portfolio relationship management, policyholder loyalty servicing, and direct customer advisory prior to full specialization in IT infrastructure and cybersecurity operations.
                    </p>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {['Client Relations', 'Account Advisory', 'Corporate Operations'].map(t => (
                        <span key={t} className="font-mono text-[8px] text-slate-400 bg-cyber-bg/40 border border-cyber-border/30 rounded-xs px-1.5 py-0.2">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>
          )}

          {/* ACADEMICS */}
          {tab === 'academics' && (
            <motion.div key="academics" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-3">

              {/* C-DAC highlight */}
              <div className="p-4 bg-cyber-ocean/40 border border-cyber-green/40 rounded-sm">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="font-orbitron text-xs font-bold text-white">PGCP-ITISS</div>
                    <div className="font-inter text-[10.5px] text-slate-300">C-DAC IACSD, Pune · Completed Feb 2026</div>
                  </div>
                  <div className="text-right">
                    <div className="font-orbitron text-xl font-black text-cyber-green">80.0%</div>
                    <div className="font-mono text-[8.5px] text-slate-400">FIRST CLASS AGGREGATE</div>
                  </div>
                </div>
                {/* Module breakdown */}
                <div className="space-y-1.5 pt-2 border-t border-cyber-border/50">
                  <div className="font-mono text-[9px] text-cyber-cyan font-bold mb-1">CORE MODULE COMPETENCIES:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {CDAC_CURRICULUM.map(module => (
                      <span key={module} className="font-inter text-[9.5px] text-slate-200 bg-cyber-ocean/50 border border-cyber-border/80 px-2 py-0.5 rounded-xs">
                        {module}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Degree timeline */}
              {[
                { year: '2024', degree: 'MCA — Master of Computer Applications', inst: 'Marwari College · Ranchi University', score: '73.25% · Division I' },
                { year: '2022', degree: 'BCA — Bachelor of Computer Applications', inst: 'Doranda College · Ranchi University', score: '78.90% · Division I' },
                { year: '2019', degree: 'Class XII — Science Stream', inst: "St. Xavier's College, Ranchi · JAC", score: '63.20% · Division I' },
                { year: '2017', degree: 'Class X — General', inst: 'DAV Public School, Bokaro · CBSE', score: '87.40% · Division I' },
              ].map(row => (
                <div key={row.year} className="flex items-start gap-3 p-3 bg-cyber-ocean/25 border border-cyber-border rounded-sm hover:border-cyber-cyan/40 transition-colors">
                  <span className="font-orbitron text-xs font-black text-cyber-dim/60 flex-shrink-0 w-8">{row.year}</span>
                  <div>
                    <div className="font-orbitron text-[10.5px] font-bold text-white">{row.degree}</div>
                    <div className="font-inter text-[10px] text-slate-400">{row.inst}</div>
                    <div className="font-mono text-[9.5px] text-cyber-green mt-0.5">{row.score}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* CERTIFICATIONS */}
          {tab === 'certs' && (
            <motion.div key="certs" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              <p className="font-inter text-[10.5px] text-slate-400 mb-3 leading-relaxed">
                5 industry certifications — click a card to see details.
              </p>
              <div className="space-y-2.5">
                {CERTS.map(c => (
                  <div
                    key={c.name}
                    onClick={() => toggleFlip(c.name)}
                    className="p-3.5 bg-cyber-ocean/30 border border-cyber-border rounded-sm hover:border-cyber-cyan/50 transition-all cursor-pointer"
                    role="button"
                    aria-expanded={flipped[c.name] ? 'true' : 'false'}
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && toggleFlip(c.name)}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-orbitron text-[8px] text-slate-500 font-bold tracking-widest">{c.issuer}</span>
                        <span className="font-orbitron text-[8px] text-cyber-green border border-cyber-green/40 bg-cyber-green/10 px-1.5 py-0.2 rounded-xs font-bold">✓ {c.status}</span>
                      </div>
                      <span className="font-orbitron text-[8px] text-slate-500">{flipped[c.name] ? '↑ COLLAPSE' : '↓ DETAILS'}</span>
                    </div>
                    <div className="font-orbitron text-xs font-bold text-white mb-1">{c.name}</div>
                    <AnimatePresence mode="wait">
                      {!flipped[c.name] ? (
                        <motion.div key="skills" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <p className="font-inter text-[10px] text-slate-400 leading-relaxed">{c.skills}</p>
                        </motion.div>
                      ) : (
                        <motion.div key="detail" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                          <p className="font-inter text-[10.5px] text-slate-200 leading-relaxed">{c.detail}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </Cyber3DCard>
    </motion.div>
  );
}
