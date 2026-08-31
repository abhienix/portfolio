'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Cyber3DCard from '@/components/shared/Cyber3DCard';
import CyberScrambleText from '@/components/shared/CyberScrambleText';

type SkillCat = 'siem' | 'devsecops' | 'infra' | 'mitre' | 'methodology';

const SKILL_CATEGORIES: { id: SkillCat; label: string; icon: string }[] = [
  { id: 'siem',        label: 'SOC / SIEM',       icon: '🛡️' },
  { id: 'devsecops',   label: 'DEVSECOPS',         icon: '⚡' },
  { id: 'infra',       label: 'INFRA & CLOUD',     icon: '🌐' },
  { id: 'mitre',       label: 'MITRE ATT&CK',      icon: '🎯' },
  { id: 'methodology', label: 'METHODOLOGY',        icon: '◈' },
];

interface SkillItem {
  name: string;
  badge: 'HANDS-ON' | 'PROJECT' | 'LAB' | 'CERTIFIED' | 'PRODUCTION';
  where: string;
  color: string;
}

const SKILLS_DATA: Record<'siem' | 'devsecops' | 'infra', SkillItem[]> = {
  siem: [
    { name: 'Wazuh SIEM',            badge: 'HANDS-ON', where: 'SentryVault — agent log ingestion, FIM, custom rules', color: 'text-cyber-cyan' },
    { name: 'Suricata NIDS/IPS',      badge: 'HANDS-ON', where: 'SentryVault — DMZ packet inspection, signature detection', color: 'text-cyber-cyan' },
    { name: 'Coraza WAF (CRS3)',      badge: 'HANDS-ON', where: 'SentryVault — OWASP Core Rule Set, SQLi/XSS filtering', color: 'text-cyber-cyan' },
    { name: 'OWASP ZAP DAST',        badge: 'PROJECT',  where: 'SecureFlow — async DAST via Redis/Celery Worker VM', color: 'text-cyber-cyan' },
    { name: 'Sysmon & FIM Analysis',  badge: 'HANDS-ON', where: 'SentryVault — process creation tracking, file integrity', color: 'text-cyber-cyan' },
    { name: 'Incident Triage Tier 1/2', badge: 'PRODUCTION', where: 'Sonsolite Infra — 30+ users, sub-15 min containment', color: 'text-cyber-green' },
  ],
  devsecops: [
    { name: 'Gitleaks Secret Detection', badge: 'HANDS-ON', where: 'SecureFlow — pre-commit & CI gate blocking API keys', color: 'text-cyber-cyan' },
    { name: 'Semgrep SAST',              badge: 'HANDS-ON', where: 'SecureFlow — custom rulesets, injection risk flagging', color: 'text-cyber-cyan' },
    { name: 'Trivy Container Scanner',   badge: 'HANDS-ON', where: 'SecureFlow — base image CVE & misconfiguration gate', color: 'text-cyber-cyan' },
    { name: 'GitHub Actions',            badge: 'HANDS-ON', where: 'SecureFlow — parallel security + test pipeline', color: 'text-cyber-cyan' },
    { name: 'Jenkins CI/CD',             badge: 'HANDS-ON', where: 'SecureFlow — multi-branch declarative pipelines', color: 'text-cyber-cyan' },
    { name: 'Python SOAR Automation',    badge: 'HANDS-ON', where: 'SentryVault — iptables auto-quarantine scripts', color: 'text-cyber-cyan' },
  ],
  infra: [
    { name: 'Linux System Hardening',   badge: 'PRODUCTION', where: 'Sonsolite Infra — iptables, sudoers least-privilege, SSH', color: 'text-cyber-green' },
    { name: 'Wi-Fi & Network Segmentation', badge: 'PRODUCTION', where: 'Sonsolite Infra — VLANs, MAC whitelisting, guest isolation', color: 'text-cyber-green' },
    { name: 'Docker & Container Security', badge: 'HANDS-ON', where: 'SecureFlow / SentryVault — isolated networks, hardened images', color: 'text-cyber-cyan' },
    { name: 'GCP Cloud Run',             badge: 'PROJECT',  where: 'SecureFlow — serverless container deployment, HTTPS', color: 'text-cyber-cyan' },
    { name: 'DSC / PKI Key Management', badge: 'PRODUCTION', where: 'Sonsolite Infra — govt. portal e-tendering DSC tokens', color: 'text-cyber-green' },
    { name: 'FastAPI & PostgreSQL',      badge: 'HANDS-ON', where: 'SecureFlow — security findings API & secure data storage', color: 'text-cyber-cyan' },
  ],
};

const BADGE_STYLES: Record<string, string> = {
  'PRODUCTION': 'text-cyber-green bg-cyber-green/10 border-cyber-green/40',
  'HANDS-ON':   'text-cyber-cyan  bg-cyber-cyan/10  border-cyber-cyan/35',
  'PROJECT':    'text-amber-400  bg-amber-400/10  border-amber-400/30',
  'LAB':        'text-slate-300  bg-white/5        border-slate-600/40',
  'CERTIFIED':  'text-purple-400 bg-purple-400/10 border-purple-400/30',
};

const MITRE_DATA = [
  {
    tactic: 'INITIAL ACCESS & RECON', tacticId: 'TA0001/TA0043',
    tools: 'Coraza WAF CRS3 · OWASP ZAP · Wi-Fi VLAN Isolation',
    coverage: '98%', status: 'ACTIVE',
  },
  {
    tactic: 'EXECUTION & PERSISTENCE', tacticId: 'TA0002/TA0003',
    tools: 'Suricata NIDS Packet Inspection · Sysmon Process Tree',
    coverage: '94%', status: 'ACTIVE',
  },
  {
    tactic: 'DEFENSE EVASION & PRIV-ESC', tacticId: 'TA0005/TA0004',
    tools: 'Wazuh FIM · Sudoers Least-Privilege · RBAC Auditing',
    coverage: '96%', status: 'ENFORCED',
  },
  {
    tactic: 'CREDENTIAL ACCESS & DISCOVERY', tacticId: 'TA0006/TA0007',
    tools: 'Gitleaks Pre-Commit Gates · Fail2Ban · iptables Auto-Ban',
    coverage: '100%', status: 'ENFORCED',
  },
  {
    tactic: 'C2 & EXFILTRATION', tacticId: 'TA0011/TA0010',
    tools: 'Suricata DNS Tunnel Detection · Outbound Egress ACLs',
    coverage: '92%', status: 'ACTIVE',
  },
];

const METHODOLOGY_STEPS = [
  {
    num: '01', phase: 'DISCOVER',  color: 'text-cyber-cyan',  border: 'border-cyber-cyan/30',
    tagline: 'Map the attack surface.',
    detail: 'Enumerate assets, network topology, open ports, running services, and third-party dependencies before any assessment begins.',
    applied: 'SecureFlow: mapped GitHub repo → CI/CD → cloud endpoints before gating policy design.',
  },
  {
    num: '02', phase: 'DETECT',    color: 'text-amber-400',   border: 'border-amber-400/30',
    tagline: 'Collect and correlate telemetry.',
    detail: 'Deploy SIEM agents, NIDS sensors, and FIM monitors. Define alert thresholds against known TTPs.',
    applied: 'SentryVault: Wazuh agents on all VMs + Suricata NIDS tap on the DMZ network.',
  },
  {
    num: '03', phase: 'ANALYZE',   color: 'text-purple-400',  border: 'border-purple-400/30',
    tagline: 'Determine root cause.',
    detail: 'Correlate multi-source events to identify the kill chain stage. Use behavioral baselines to reduce false positives.',
    applied: 'SentryVault: Wazuh correlation rule identifying lateral movement across DMZ + internal VMs.',
  },
  {
    num: '04', phase: 'RESPOND',   color: 'text-red-400',     border: 'border-red-400/30',
    tagline: 'Contain and reduce blast radius.',
    detail: 'Isolate affected hosts, revoke compromised credentials, block C2 channels. Prioritize containment over eradication.',
    applied: 'SentryVault: Python SOAR script auto-quarantining attacker IPs via iptables < 2 seconds.',
  },
  {
    num: '05', phase: 'HARDEN',    color: 'text-cyber-green', border: 'border-cyber-green/30',
    tagline: 'Apply least privilege and defense-in-depth.',
    detail: 'Patch vulnerabilities, enforce RBAC, segment networks, disable unnecessary services, implement MFA.',
    applied: 'Sonsolite Infra: enforced least-privilege sudoers, Wi-Fi VLAN isolation, OS patch cycles.',
  },
  {
    num: '06', phase: 'AUTOMATE',  color: 'text-cyber-cyan',  border: 'border-cyber-cyan/30',
    tagline: 'Shift security left into pipelines.',
    detail: 'Embed security controls into CI/CD so every code push is automatically scanned for secrets, vulnerabilities, and misconfigurations.',
    applied: 'SecureFlow: Gitleaks + Semgrep + Trivy + OWASP ZAP running as mandatory CI/CD gates.',
  },
];

function SkillRow({ skill, isLast }: { skill: SkillItem; isLast: boolean }) {
  const [showDetail, setShowDetail] = useState(false);
  return (
    <div
      className={`py-2.5 ${!isLast ? 'border-b border-cyber-border/40' : ''}`}
      onMouseEnter={() => setShowDetail(true)}
      onMouseLeave={() => setShowDetail(false)}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-inter text-xs font-semibold text-white">{skill.name}</span>
        <span className={`flex-shrink-0 font-orbitron text-[8px] font-bold px-1.5 py-0.5 border rounded-xs ${BADGE_STYLES[skill.badge]}`}>
          {skill.badge}
        </span>
      </div>
      <AnimatePresence>
        {showDetail && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <p className="font-inter text-[10px] text-slate-400 mt-1 leading-relaxed">
              {skill.where}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SkillsPanel() {
  const [activeTab, setActiveTab] = useState<SkillCat>('siem');

  return (
    <motion.div
      className="max-w-xl w-full max-h-[88vh] overflow-y-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <Cyber3DCard className="p-6 md:p-7 shadow-2xl border border-cyber-cyan/30 bg-cyber-bg/95" maxTilt={6}>
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-inter text-[10px] text-cyber-cyan tracking-[0.25em] uppercase font-semibold">
              <CyberScrambleText text="CAPABILITY MATRIX // SECURITY ARSENAL" speed={20} />
            </span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-green beacon-dot" />
              <span className="font-orbitron text-[8.5px] text-cyber-green font-bold">VERIFIED</span>
            </div>
          </div>
          <h2 className="font-orbitron text-xl font-black text-white tracking-wider flex items-center gap-2">
            <span className="text-cyber-cyan">⚡</span> SECURITY ARSENAL
          </h2>
          <div className="h-px bg-gradient-to-r from-cyber-cyan/80 via-cyber-border to-transparent mt-2.5" />
        </div>

        {/* Badge legend */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(BADGE_STYLES).map(([badge, cls]) => (
            <span key={badge} className={`font-orbitron text-[7.5px] font-bold px-1.5 py-0.5 border rounded-xs ${cls}`}>
              {badge}
            </span>
          ))}
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 p-1 bg-cyber-ocean/50 border border-cyber-border/80 rounded-sm mb-5 overflow-x-auto">
          {SKILL_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex-shrink-0 flex-1 py-2 px-2 rounded-xs font-orbitron text-[8.5px] font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-1 min-w-fit ${
                activeTab === cat.id
                  ? 'text-cyber-bg bg-cyber-cyan shadow-cyan-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              aria-pressed={activeTab === cat.id}
            >
              <span className="hidden sm:inline">{cat.icon}</span>
              <span className="truncate">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="min-h-[280px]">
          <AnimatePresence mode="wait">

            {/* SOC / SIEM */}
            {activeTab === 'siem' && (
              <motion.div key="siem" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <p className="font-inter text-[10.5px] text-slate-400 mb-3 leading-relaxed">
                  Hover any tool to see where it was deployed. Badges: <strong className="text-cyber-green">PRODUCTION</strong> = enterprise use, <strong className="text-cyber-cyan">HANDS-ON</strong> = project-level.
                </p>
                <div className="bg-cyber-ocean/20 border border-cyber-border rounded-sm px-3">
                  {SKILLS_DATA.siem.map((s, i) => (
                    <SkillRow key={s.name} skill={s} isLast={i === SKILLS_DATA.siem.length - 1} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* DevSecOps */}
            {activeTab === 'devsecops' && (
              <motion.div key="devsecops" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <p className="font-inter text-[10.5px] text-slate-400 mb-3 leading-relaxed">
                  All tools used in <strong className="text-white">SecureFlow</strong> and <strong className="text-white">SentryVault</strong>. Hover for deployment context.
                </p>
                <div className="bg-cyber-ocean/20 border border-cyber-border rounded-sm px-3">
                  {SKILLS_DATA.devsecops.map((s, i) => (
                    <SkillRow key={s.name} skill={s} isLast={i === SKILLS_DATA.devsecops.length - 1} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Infra & Cloud */}
            {activeTab === 'infra' && (
              <motion.div key="infra" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                <p className="font-inter text-[10.5px] text-slate-400 mb-3 leading-relaxed">
                  <strong className="text-cyber-green">PRODUCTION</strong> = used in the Sonsolite enterprise environment (30+ users). Others from lab projects.
                </p>
                <div className="bg-cyber-ocean/20 border border-cyber-border rounded-sm px-3">
                  {SKILLS_DATA.infra.map((s, i) => (
                    <SkillRow key={s.name} skill={s} isLast={i === SKILLS_DATA.infra.length - 1} />
                  ))}
                </div>
              </motion.div>
            )}

            {/* MITRE ATT&CK */}
            {activeTab === 'mitre' && (
              <motion.div key="mitre" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-2.5">
                <p className="font-inter text-[10.5px] text-slate-400 mb-2 leading-relaxed">
                  MITRE ATT&CK Enterprise framework — defense coverage by tactic using tools deployed in lab projects.
                </p>
                {MITRE_DATA.map(m => (
                  <div key={m.tacticId} className="p-3 bg-cyber-ocean/30 border border-cyber-border hover:border-cyber-cyan/40 rounded-sm transition-colors">
                    <div className="flex items-center justify-between mb-1.5 gap-2 flex-wrap">
                      <div>
                        <span className="font-orbitron text-[9px] text-white font-bold tracking-wide">{m.tactic}</span>
                        <span className="ml-2 font-mono text-[8px] text-slate-500">{m.tacticId}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className={`font-orbitron text-[8px] font-bold px-1.5 py-0.5 rounded-xs border ${
                          m.status === 'ENFORCED' ? 'text-cyber-green border-cyber-green/40 bg-cyber-green/10' : 'text-cyber-cyan border-cyber-cyan/35 bg-cyber-cyan/8'
                        }`}>{m.status}</span>
                        <span className="font-orbitron text-xs font-black text-cyber-cyan">{m.coverage}</span>
                      </div>
                    </div>
                    <div className="font-mono text-[9.5px] text-slate-300 leading-relaxed">{m.tools}</div>
                    <div className="mt-1.5 w-full h-1.5 bg-cyber-bg rounded-full overflow-hidden border border-cyber-border/40">
                      <div
                        className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-green rounded-full"
                        style={{ width: m.coverage }}
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Methodology */}
            {activeTab === 'methodology' && (
              <motion.div key="methodology" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-2.5">
                <p className="font-inter text-[10.5px] text-slate-400 mb-3 leading-relaxed">
                  My systematic approach to security engineering — from discovery to automation.
                </p>
                {METHODOLOGY_STEPS.map(step => (
                  <div key={step.num} className={`p-3 bg-cyber-ocean/25 border ${step.border} rounded-sm hover:bg-cyber-ocean/40 transition-colors`}>
                    <div className="flex items-start gap-3">
                      <span className={`font-orbitron text-lg font-black ${step.color} leading-none flex-shrink-0 w-8`}>{step.num}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`font-orbitron text-xs font-black ${step.color} tracking-wider`}>{step.phase}</span>
                          <span className="font-inter text-[10px] text-slate-300 italic">{step.tagline}</span>
                        </div>
                        <p className="font-inter text-[10.5px] text-slate-300 leading-relaxed mb-1.5">{step.detail}</p>
                        <div className="flex items-start gap-1.5">
                          <span className="font-orbitron text-[8px] text-slate-500 flex-shrink-0 mt-0.5">APPLIED:</span>
                          <span className="font-inter text-[10px] text-slate-400 leading-relaxed">{step.applied}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </Cyber3DCard>
    </motion.div>
  );
}
