'use client';

import { useState, useEffect } from 'react';

// Clearly labelled: LIVE = real API data, LAB = simulated/project-based
const FEED_EVENTS = [
  // LIVE — from SANS ISC DShield API
  { tag: 'SANS-DSHIELD', tagColor: 'text-amber-400', source: 'LIVE', sourceColor: 'text-cyber-green', desc: 'SANS ISC honeypots: 300K+ daily packets logged across Port 22 (SSH), 445 (SMB), 23 (Telnet)' },
  // LIVE — from DHS CISA KEV API
  { tag: 'CISA-KEV', tagColor: 'text-cyber-cyan', source: 'LIVE', sourceColor: 'text-cyber-green', desc: 'DHS CISA Known Exploited Vulnerabilities feed active — 1,685+ CVE entries tracked' },
  // LIVE — from GeoIP API
  { tag: 'GEO-RECON', tagColor: 'text-amber-400', source: 'LIVE', sourceColor: 'text-cyber-green', desc: 'Visitor approximate region resolved via public GeoIP — no personal data stored' },
  // LAB — SecureFlow project
  { tag: 'DEVSECOPS', tagColor: 'text-cyber-cyan', source: 'LAB', sourceColor: 'text-amber-400', desc: '[SecureFlow] Gitleaks + Semgrep SAST gate: 0 secrets, 0 critical CWEs — pipeline verified' },
  // LAB — SentryVault project
  { tag: 'SOC-SIM',   tagColor: 'text-cyber-cyan', source: 'LAB', sourceColor: 'text-amber-400', desc: '[SentryVault] Suricata NIDS alert → Wazuh SIEM correlation → SOAR auto-quarantine < 2s' },
  // LAB — Red Flag Detector
  { tag: 'AI-DETECT', tagColor: 'text-cyber-cyan', source: 'LAB', sourceColor: 'text-amber-400', desc: '[Red Flag Detector] Dual-layer phishing analysis: 24 regex heuristics + LLM context scan' },
  // LIVE — subsea cable visualization
  { tag: 'SUBSEA-IXP', tagColor: 'text-slate-400', source: 'VIZ', sourceColor: 'text-slate-400', desc: 'Subsea cable visualization: AAE-1 / SEA-ME-WE / Transatlantic corridors rendered' },
];

export default function LiveThreatFeedHUD() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx(i => (i + 1) % FEED_EVENTS.length);
    }, 3400);
    return () => clearInterval(timer);
  }, []);

  const ev = FEED_EVENTS[idx];

  return (
    <aside
      aria-label="Portfolio activity feed"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none select-none max-w-3xl w-[94vw]"
    >
      <div className="glass-panel px-3.5 py-2 border border-cyber-cyan/20 bg-cyber-bg/85 backdrop-blur-md rounded-sm shadow-xl flex items-center justify-between gap-3">

        {/* Left — source badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`font-orbitron text-[8px] font-black tracking-widest px-1.5 py-0.5 border rounded-xs ${
            ev.source === 'LIVE'
              ? 'text-cyber-green border-cyber-green/40 bg-cyber-green/10'
              : ev.source === 'LAB'
              ? 'text-amber-400 border-amber-400/30 bg-amber-400/8'
              : 'text-slate-400 border-slate-600/30 bg-white/3'
          }`}>
            {ev.source}
          </span>
          <span className={`font-orbitron text-[8.5px] font-bold tracking-widest hidden sm:inline ${ev.tagColor}`}>
            {ev.tag}
          </span>
        </div>

        {/* Center — event text */}
        <div className="flex-1 truncate font-mono text-[9px] text-slate-300">
          {ev.desc}
        </div>

        {/* Right — status indicators */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0 font-orbitron text-[8px]">
          <span className="text-cyber-green font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-green beacon-dot" />
            CISA: LIVE
          </span>
          <span className="text-amber-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            GEO: LIVE
          </span>
          <span className="text-amber-400/70 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400/50" />
            SOC: LAB SIM
          </span>
        </div>
      </div>
    </aside>
  );
}
