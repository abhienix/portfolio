'use client';

import { useState } from 'react';

const RESUME_URL = '/Abhimanyu_Kumar_Resume.pdf';

const PROJECTS = [
  {
    code: '#001', title: 'SecureFlow',
    sub: 'DevSecOps CI/CD Pipeline + AI Security Analysis',
    stack: 'GitHub Actions · Gitleaks · Semgrep · Trivy · OWASP ZAP · Ollama LLM',
    outcome: '150+ pipeline runs · Zero vulnerability escapes to production',
    github: 'https://github.com/abhienix/SecureFlow',
    accent: '#00F5FF',
  },
  {
    code: '#002', title: 'Red Flag Detector',
    sub: 'AI Phishing & Threat Analysis — Dual Layer Detection',
    stack: 'Python · FastAPI · LLM · 24 Regex Heuristics',
    outcome: 'Sub-second detection · 0–100 risk score · SOC advisory output',
    github: 'https://github.com/abhienix/AI-red-flag-detector',
    accent: '#FF8C00',
  },
  {
    code: '#003', title: 'SentryVault',
    sub: 'Enterprise Banking SOC Lab — Multi-VM DMZ Architecture',
    stack: 'Wazuh SIEM · Suricata NIDS · Coraza WAF · Python SOAR',
    outcome: 'Automated IP quarantine < 2s · Zero uncontained intrusions',
    github: 'https://github.com/abhienix',
    accent: '#00FF88',
  },
  {
    code: '#004', title: 'MedHelp',
    sub: 'Smart Healthcare Portal for Rural Communities',
    stack: 'HTML5 · CSS3 · Bootstrap · JavaScript',
    outcome: 'Symptom-based specialist triage · First-aid guidance · Open source',
    github: 'https://github.com/abhienix/MedHelp-Smart-Healthcare-Portal.git',
    accent: '#94BBD9',
  },
];

const SKILLS = [
  { cat: 'SOC / SIEM',      items: 'Wazuh · Suricata · Coraza WAF · OWASP ZAP · Sysmon · FIM' },
  { cat: 'DEVSECOPS',       items: 'Gitleaks · Semgrep · Trivy · Jenkins · GitHub Actions · Python SOAR' },
  { cat: 'INFRASTRUCTURE',  items: 'Linux Hardening · Docker · iptables · GCP Cloud Run · Wi-Fi Segmentation · DSC/PKI' },
  { cat: 'CERTIFICATIONS',  items: 'Cisco Ethical Hacker · Cisco Intro to CyberSec · IBM Cybersecurity · IBM AI · Mastercard Sim' },
];

const EXPERIENCE = [
  {
    period: '10 Feb 2025 – 20 Feb 2026 (1 Year)',
    role: 'IT Executive',
    org: 'Sonsolite Infra & Power Solutions Pvt. Ltd.',
    isPrior: false,
    points: [
      'Administered and hardened office IT infrastructure for 30+ users',
      'Enforced RBAC, least-privilege access controls, and patch management',
      'Wi-Fi network segmentation and hardware lifecycle management',
      'Tier-1/2 incident triage — sub-15 minute containment',
    ],
  },
  {
    period: '05 Aug 2024 – 31 Jan 2025 (6 Months)',
    role: 'Financial Planning Manager',
    org: 'HDFC Life Insurance Company Limited · Ranchi',
    isPrior: true,
    points: [
      'Client portfolio advisory, loyalty servicing, and direct customer relations',
      'Professional corporate tenure prior to full-time specialization in cybersecurity',
    ],
  },
];

const EDUCATION = [
  { year: 'Feb 2026', deg: 'PGCP-ITISS (C-DAC IACSD, Pune)', score: '80.0% Aggregate' },
  { year: '2024',     deg: 'MCA — Marwari College, Ranchi University', score: '73.25% · Division I' },
  { year: '2022',     deg: 'BCA — Doranda College, Ranchi University', score: '78.90% · Division I' },
  { year: '2019',     deg: 'Class XII Science — St. Xavier\'s, JAC', score: '63.20% · Division I' },
  { year: '2017',     deg: 'Class X — DAV Public School, CBSE', score: '87.40% · Division I' },
];

const METHODOLOGY = [
  { num: '01', phase: 'DISCOVER',  desc: 'Map assets, network topology, and attack surface before any assessment.' },
  { num: '02', phase: 'DETECT',    desc: 'Deploy SIEM, NIDS, and FIM sensors. Define alert thresholds against known TTPs.' },
  { num: '03', phase: 'ANALYZE',   desc: 'Correlate multi-source events. Identify kill chain stage. Reduce false positives.' },
  { num: '04', phase: 'RESPOND',   desc: 'Isolate hosts, revoke credentials, block C2. Contain before eradication.' },
  { num: '05', phase: 'HARDEN',    desc: 'Enforce least privilege, patch vulnerabilities, segment networks.' },
  { num: '06', phase: 'AUTOMATE',  desc: 'Embed security controls into CI/CD pipelines as mandatory gates.' },
];

export default function MobileFallback() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cyber-bg text-cyber-text overflow-y-auto">

      {/* ── Top Nav ── */}
      <header className="sticky top-0 z-50 bg-cyber-bg/95 border-b border-cyber-border backdrop-blur-md flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 border border-cyber-cyan/60 flex items-center justify-center">
            <span className="font-orbitron text-xs font-black text-cyber-cyan">AK</span>
          </div>
          <span className="font-orbitron text-xs font-bold text-white tracking-wider">ABHIMANYU KUMAR</span>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={RESUME_URL}
            download="Abhimanyu_Kumar_Resume.pdf"
            className="font-orbitron text-[9px] font-bold text-cyber-bg bg-cyber-cyan px-3 py-1.5 rounded-xs tracking-wider hover:brightness-110"
            aria-label="Download resume"
          >
            RESUME ↓
          </a>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="w-8 h-8 flex flex-col items-center justify-center gap-1.5 focus:outline-none"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span className={`w-5 h-0.5 bg-cyber-cyan transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-5 h-0.5 bg-cyber-cyan transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-0.5 bg-cyber-cyan transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </header>

      {/* ── Drawer Menu ── */}
      {menuOpen && (
        <nav className="fixed inset-0 z-40 bg-cyber-bg/97 backdrop-blur-md flex flex-col items-center justify-center gap-5" aria-label="Mobile navigation">
          {[
            { href: '#about',       label: 'ABOUT' },
            { href: '#projects',    label: 'PROJECTS' },
            { href: '#skills',      label: 'ARSENAL' },
            { href: '#experience',  label: 'EXPERIENCE' },
            { href: '#contact',     label: 'CONTACT' },
          ].map(item => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="font-orbitron text-2xl font-black text-white hover:text-cyber-cyan transition-colors tracking-wider focus:outline-none"
            >
              {item.label}
            </a>
          ))}
          <a
            href={RESUME_URL}
            download="Abhimanyu_Kumar_Resume.pdf"
            className="mt-4 font-orbitron text-sm font-bold text-cyber-bg bg-cyber-cyan px-8 py-3 rounded-xs tracking-wider"
          >
            DOWNLOAD RESUME ↓
          </a>
        </nav>
      )}

      {/* ── HERO ── */}
      <section id="about" className="px-5 pt-12 pb-10 border-b border-cyber-border">
        {/* 3D platform notice */}
        <div className="text-center mb-7">
          <span className="font-inter text-[10px] text-cyber-dim/70 bg-cyber-ocean/50 border border-cyber-border px-3 py-1 rounded-sm">
            Full 3D interactive experience available on desktop
          </span>
        </div>

        {/* Photo + identity */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-shrink-0 w-16 h-16 overflow-hidden border-2 border-cyber-cyan/60 rounded-sm shadow-[0_0_12px_rgba(0,245,255,0.25)]">
            <img
              src="/images/abhimanyu.jpg"
              alt="Abhimanyu Kumar"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div>
            <div className="font-inter text-[9px] text-cyber-cyan tracking-widest uppercase mb-1">Candidate Dossier</div>
            <h1 className="font-orbitron text-xl font-black text-white leading-tight">ABHIMANYU KUMAR</h1>
          </div>
        </div>

        {/* Role */}
        <p className="font-inter text-sm text-slate-300 mb-2 leading-relaxed">
          Cybersecurity Engineer · SOC Analyst · DevSecOps
        </p>
        <p className="font-inter text-xs text-slate-400 mb-5 leading-relaxed">
          Building secure infrastructure, security monitoring systems, and DevSecOps pipelines with practical hands-on engineering.
        </p>

        {/* Status */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-cyber-green" style={{ boxShadow: '0 0 8px rgba(0,255,136,0.7)' }} />
          <span className="font-orbitron text-[10px] text-cyber-green tracking-widest font-bold">OPEN TO OPPORTUNITIES</span>
        </div>

        {/* CTA row */}
        <div className="flex flex-col gap-2.5">
          <a
            href={RESUME_URL}
            download="Abhimanyu_Kumar_Resume.pdf"
            className="block text-center font-orbitron text-xs font-bold text-cyber-bg bg-cyber-cyan py-3 rounded-xs tracking-wider focus:outline-none focus:ring-2 focus:ring-cyber-cyan"
            aria-label="Download resume PDF"
          >
            DOWNLOAD RESUME ↓
          </a>
          <div className="flex gap-2.5">
            <a href="https://github.com/abhienix" target="_blank" rel="noopener noreferrer"
               className="flex-1 text-center font-orbitron text-[9.5px] font-bold text-cyber-cyan border border-cyber-cyan/50 py-2.5 rounded-xs hover:bg-cyber-cyan/10 focus:outline-none">
              GITHUB ↗
            </a>
            <a href="https://linkedin.com/in/abhimanyu-sec" target="_blank" rel="noopener noreferrer"
               className="flex-1 text-center font-orbitron text-[9.5px] font-bold text-cyber-dim border border-cyber-border py-2.5 rounded-xs hover:text-cyber-cyan hover:border-cyber-cyan/50 focus:outline-none">
              LINKEDIN ↗
            </a>
          </div>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-4 gap-2 mt-6">
          {[
            { v: '80%',  l: 'C-DAC', s: 'Aggregate' },
            { v: '12+',  l: 'Months', s: '10 Feb 25 – 20 Feb 26' },
            { v: '5',    l: 'Certs',  s: 'Industry' },
            { v: '4',    l: 'Projects', s: 'Verified' },
          ].map(s => (
            <div key={s.l} className="border border-cyber-border/60 p-2 text-center rounded-sm bg-cyber-ocean/20">
              <div className="font-orbitron text-base text-cyber-cyan font-black">{s.v}</div>
              <div className="font-orbitron text-[8px] text-white font-bold">{s.l}</div>
              <div className="font-inter text-[7.5px] text-slate-500">{s.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="px-5 py-10 border-b border-cyber-border">
        <div className="font-orbitron text-[10px] text-cyber-cyan tracking-wider mb-5 flex items-center gap-2">
          <span className="w-4 h-px bg-cyber-cyan/50" />
          FEATURED OPERATIONS
          <span className="w-4 h-px bg-cyber-cyan/50" />
        </div>
        <div className="space-y-4">
          {PROJECTS.map(p => (
            <div
              key={p.code}
              className="p-4 border border-cyber-border rounded-sm bg-cyber-ocean/20"
              style={{ borderLeft: `3px solid ${p.accent}` }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-[9px] text-slate-400">OPERATION {p.code}</span>
                <a
                  href={p.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-orbitron text-[8.5px] font-bold px-2 py-0.5 border border-cyber-cyan/40 text-cyber-cyan rounded-xs hover:bg-cyber-cyan/10 focus:outline-none"
                  aria-label={`View ${p.title} on GitHub`}
                >
                  GITHUB ↗
                </a>
              </div>
              <h3 className="font-orbitron text-sm font-black text-white mb-1">{p.title}</h3>
              <p className="font-inter text-[10.5px] text-slate-400 mb-2">{p.sub}</p>
              <p className="font-mono text-[9.5px] text-slate-500 mb-2">{p.stack}</p>
              <div className="font-inter text-[10px] text-cyber-green border-t border-cyber-border/40 pt-2">{p.outcome}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ARSENAL ── */}
      <section id="skills" className="px-5 py-10 border-b border-cyber-border">
        <div className="font-orbitron text-[10px] text-cyber-cyan tracking-wider mb-5 flex items-center gap-2">
          <span className="w-4 h-px bg-cyber-cyan/50" />
          SECURITY ARSENAL
          <span className="w-4 h-px bg-cyber-cyan/50" />
        </div>
        <div className="space-y-3">
          {SKILLS.map(s => (
            <div key={s.cat} className="p-3.5 border border-cyber-border rounded-sm bg-cyber-ocean/20">
              <div className="font-orbitron text-[9px] text-cyber-cyan font-bold tracking-wider mb-1.5">{s.cat}</div>
              <p className="font-inter text-xs text-slate-300 leading-relaxed">{s.items}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECURITY METHODOLOGY ── */}
      <section className="px-5 py-10 border-b border-cyber-border">
        <div className="font-orbitron text-[10px] text-cyber-cyan tracking-wider mb-5 flex items-center gap-2">
          <span className="w-4 h-px bg-cyber-cyan/50" />
          SECURITY METHODOLOGY
          <span className="w-4 h-px bg-cyber-cyan/50" />
        </div>
        <div className="space-y-2.5">
          {METHODOLOGY.map(m => (
            <div key={m.num} className="flex items-start gap-3 p-3 border border-cyber-border/60 rounded-sm bg-cyber-ocean/20">
              <span className="font-orbitron text-base font-black text-cyber-cyan/60 flex-shrink-0 w-7 leading-none">{m.num}</span>
              <div>
                <div className="font-orbitron text-[10px] font-bold text-white tracking-wider mb-0.5">{m.phase}</div>
                <p className="font-inter text-[10.5px] text-slate-400 leading-relaxed">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="px-5 py-10 border-b border-cyber-border">
        <div className="font-orbitron text-[10px] text-cyber-cyan tracking-wider mb-5 flex items-center gap-2">
          <span className="w-4 h-px bg-cyber-cyan/50" />
          EXPERIENCE & EDUCATION
          <span className="w-4 h-px bg-cyber-cyan/50" />
        </div>

        {/* Work */}
        {EXPERIENCE.map(e => (
          <div
            key={e.role}
            className={`mb-4 p-3.5 border rounded-sm ${
              e.isPrior
                ? 'border-cyber-border/50 bg-cyber-ocean/10 opacity-75'
                : 'border-cyber-border bg-cyber-ocean/20 border-l-2 border-l-cyber-cyan'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className={`font-mono text-[9px] ${e.isPrior ? 'text-slate-400' : 'text-cyber-cyan'}`}>{e.period}</span>
              {e.isPrior && (
                <span className="font-orbitron text-[7.5px] text-slate-500 border border-slate-600/30 px-1.5 py-0.2 rounded-xs">PRIOR CAREER</span>
              )}
            </div>
            <div className={`font-orbitron font-bold mb-0.5 ${e.isPrior ? 'text-xs text-slate-300' : 'text-sm text-white'}`}>{e.role}</div>
            <div className="font-inter text-[10px] text-slate-400 mb-2">{e.org}</div>
            <div className="space-y-1">
              {e.points.map((pt, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className={`${e.isPrior ? 'text-slate-500' : 'text-cyber-cyan'} text-xs flex-shrink-0`}>›</span>
                  <span className="font-inter text-[10px] text-slate-400 leading-relaxed">{pt}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Education */}
        <div className="space-y-2">
          {EDUCATION.map(e => (
            <div key={e.year} className="flex items-start gap-3 p-3 border border-cyber-border/60 rounded-sm bg-cyber-ocean/20">
              <span className="font-orbitron text-[9px] text-slate-500 flex-shrink-0 w-10">{e.year}</span>
              <div>
                <div className="font-inter text-[10.5px] font-semibold text-white">{e.deg}</div>
                <div className="font-mono text-[9.5px] text-cyber-green">{e.score}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="px-5 py-10">
        <div className="font-orbitron text-[10px] text-cyber-cyan tracking-wider mb-5 flex items-center gap-2">
          <span className="w-4 h-px bg-cyber-cyan/50" />
          CONTACT
          <span className="w-4 h-px bg-cyber-cyan/50" />
        </div>
        <div className="space-y-3 mb-6">
          <a
            href={RESUME_URL}
            download="Abhimanyu_Kumar_Resume.pdf"
            className="block text-center font-orbitron text-xs font-bold text-cyber-bg bg-cyber-cyan py-3 rounded-xs tracking-wider focus:outline-none"
          >
            DOWNLOAD RESUME ↓
          </a>
          <a
            href="mailto:abhimanyu9272@gmail.com"
            className="block text-center font-orbitron text-xs font-semibold text-cyber-cyan border border-cyber-cyan/50 py-3 rounded-xs tracking-wider hover:bg-cyber-cyan/10 focus:outline-none"
          >
            ✉ abhimanyu9272@gmail.com
          </a>
          <div className="flex gap-2.5">
            <a href="https://linkedin.com/in/abhimanyu-sec" target="_blank" rel="noopener noreferrer"
               className="flex-1 text-center font-orbitron text-[9.5px] font-bold text-cyber-dim border border-cyber-border py-2.5 rounded-xs hover:text-cyber-cyan hover:border-cyber-cyan/50 focus:outline-none">
              LINKEDIN ↗
            </a>
            <a href="https://github.com/abhienix" target="_blank" rel="noopener noreferrer"
               className="flex-1 text-center font-orbitron text-[9.5px] font-bold text-cyber-dim border border-cyber-border py-2.5 rounded-xs hover:text-cyber-cyan hover:border-cyber-cyan/50 focus:outline-none">
              GITHUB ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-5 py-6 border-t border-cyber-border text-center space-y-2">
        <div className="font-orbitron text-xs font-bold text-white">ABHIMANYU KUMAR</div>
        <div className="font-inter text-[10px] text-slate-400">Cybersecurity Engineer · SOC · DevSecOps · Network Security</div>
        <div className="h-px bg-cyber-border/50 my-3" />
        <div className="font-inter text-[9px] text-slate-600">
          Built with Next.js · Three.js · React Three Fiber
        </div>
        <div className="font-inter text-[9px] text-slate-600">© 2026 Abhimanyu Kumar</div>
      </footer>

    </div>
  );
}
