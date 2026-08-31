'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';

const RESUME_URL = '/Abhimanyu_Kumar_Resume.pdf';

const SPEC_TAGS = [
  'SOC OPERATIONS', 'DEVSECOPS', 'NETWORK SECURITY', 'SECURITY AUTOMATION', 'LINUX',
];

import type { VisitorLockData } from '@/components/globe/VisitorTargetLock';
import type { SectionId } from '@/lib/cameraPresets';

interface HeroOverlayProps {
  onEnter: () => void;
  onNavigate?: (section: SectionId) => void;
  onOpenScanner?: () => void;
  visitorLockData?: VisitorLockData | null;
  isZoomed?: boolean;
  onAcquireGps?: () => void;
  onAcquireGeoIp?: () => void;
  onResetZoom?: () => void;
  visible: boolean;
}

export default function HeroOverlay({
  onEnter,
  onNavigate,
  onOpenScanner,
  visitorLockData,
  isZoomed,
  onAcquireGps,
  onAcquireGeoIp,
  onResetZoom,
  visible,
}: HeroOverlayProps) {
  const [visitor, setVisitor] = useState<{ city: string; country: string; puneDistanceKm: number; isp: string } | null>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const subRef  = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/threats/recon')
      .then(r => r.json())
      .then(d => { if (d.success && d.data) setVisitor(d.data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!visible || !nameRef.current) return;

    const tl = gsap.timeline({ delay: 1.6 });

    tl.fromTo(heroRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' })
      .to(nameRef.current, {
        duration: 1.1,
        text: { value: 'ABHIMANYU KUMAR', delimiter: '' },
        ease: 'none',
      }, '-=0.1')
      .fromTo(subRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
        '-=0.15');
  }, [visible]);

  return (
    <div className="fixed inset-0 pointer-events-none z-10" aria-hidden="false">

      {/* ── Brand mark ── */}
      <div className="absolute top-7 left-8 flex items-center gap-2.5 select-none pointer-events-none" aria-hidden="true">
        <div className="w-7 h-7 border border-cyber-cyan/60 flex items-center justify-center">
          <span className="font-orbitron text-xs font-black text-cyber-cyan">AK</span>
        </div>
        <div className="hidden sm:block h-px w-16 bg-gradient-to-r from-cyber-cyan/50 to-transparent" />
      </div>

      {/* ── Mission Profile card — left side, above Earth ── */}
      {visible && (
        <div
          className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block"
          style={{ maxWidth: '240px' }}
          aria-hidden="true"
        >
          <div className="bg-cyber-bg/85 border border-cyber-cyan/40 backdrop-blur-md p-4 rounded-sm shadow-[0_0_20px_rgba(0,245,255,0.08)]">
            <div className="font-orbitron text-[9px] text-cyber-cyan font-bold tracking-[0.2em] uppercase mb-2.5 flex items-center gap-1.5 border-b border-cyber-border/60 pb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan animate-pulse" />
              MISSION PROFILE
            </div>
            <div className="space-y-2">
              {[
                { k: 'ROLE',        v: 'Cybersecurity Engineer' },
                { k: 'FOCUS',       v: 'SOC · DevSecOps · Infra' },
                { k: 'EXPERIENCE',  v: 'IT Executive · Sonsolite (1 Year)' },
                { k: 'EDUCATION',   v: 'PGCP-ITISS (80%) · C-DAC IACSD' },
                { k: 'DEGREES',     v: 'MCA (73.2%) · BCA (78.9%)' },
                { k: 'PROJECTS',    v: 'SecureFlow · SentryVault' },
                { k: 'LOCATION',    v: 'Pune, Maharashtra, India' },
              ].map(({ k, v }) => (
                <div key={k}>
                  <div className="font-orbitron text-[7.5px] text-cyber-dim tracking-widest">{k}</div>
                  <div className="font-inter text-[10px] text-slate-200 font-medium leading-tight">{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2 border-t border-cyber-border/50 flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyber-green beacon-dot flex-shrink-0" />
                <span className="font-orbitron text-[8px] text-cyber-green tracking-widest font-bold">AVAILABLE FOR HIRE</span>
              </div>
              <div className="font-mono text-[7px] text-slate-400 pl-3.5">
                OPERATIONAL BASE: PUNE, MH
              </div>
            </div>

            {/* Real-time Satellite GPS Recon Controller */}
            <div className="mt-2.5 pt-2 border-t border-cyber-border/40 font-mono">
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`w-1.5 h-1.5 rounded-full ${visitorLockData ? 'bg-cyber-green' : 'bg-amber-400'} animate-ping flex-shrink-0`} />
                  <span className="font-orbitron text-[7.5px] text-cyber-cyan font-bold tracking-wider truncate">
                    {visitorLockData ? 'SATELLITE LOCKED' : 'SATELLITE RECON'}
                  </span>
                </div>
                {visitorLockData && (
                  <span className="text-[6.5px] text-cyber-green bg-cyber-green/10 border border-cyber-green/30 px-1 py-0.2 rounded-xs">
                    {visitorLockData.source.toUpperCase()} FIX
                  </span>
                )}
              </div>

              {visitorLockData ? (
                <div className="space-y-1">
                  <div className="text-[8.5px] text-white font-bold truncate">
                    {visitorLockData.city}, {visitorLockData.country}
                  </div>
                  <div className="text-[7.5px] text-slate-300">
                    {visitorLockData.lat.toFixed(4)}°N, {visitorLockData.lon.toFixed(4)}°E
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    {isZoomed ? (
                      <button
                        type="button"
                        onClick={onResetZoom}
                        className="w-full py-1 text-[7.5px] font-orbitron font-bold text-slate-300 hover:text-white border border-slate-700 bg-black/60 rounded-xs transition-colors cursor-pointer pointer-events-auto"
                      >
                        ↺ RESET ORBIT VIEW
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={onAcquireGps}
                        className="w-full py-1 text-[7.5px] font-orbitron font-bold text-black bg-cyber-green hover:bg-white rounded-xs transition-colors cursor-pointer pointer-events-auto shadow-[0_0_10px_rgba(0,255,136,0.3)]"
                      >
                        ◉ ZOOM TO LOCATION
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="text-[7.5px] text-slate-300 leading-tight">
                    Acquire satellite fix on your location and zoom in to your coordinates:
                  </div>
                  <div className="flex flex-col gap-1 pt-0.5 pointer-events-auto">
                    <button
                      type="button"
                      onClick={onAcquireGps}
                      className="w-full py-1.5 text-[8px] font-orbitron font-bold text-black bg-cyber-cyan hover:bg-white rounded-xs transition-all shadow-[0_0_12px_rgba(0,245,255,0.3)] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>◉</span>
                      <span>ACQUIRE PRECISE GPS FIX</span>
                    </button>
                    <button
                      type="button"
                      onClick={onAcquireGeoIp}
                      className="w-full py-1 text-[7.5px] font-orbitron text-amber-300 hover:text-white border border-amber-400/50 bg-amber-400/10 rounded-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>⚡</span>
                      <span>USE NETWORK GEOIP</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Hero block — right side ── */}
      <div
        ref={heroRef}
        className="absolute top-1/2 -translate-y-1/2 opacity-0 pointer-events-auto z-20 select-none"
        style={{ right: 'clamp(40px, 6vw, 110px)', maxWidth: 'clamp(300px, 38vw, 490px)' }}
      >
        {/* Eyebrow */}
        <div className="font-inter text-[10px] tracking-[0.3em] text-cyber-cyan/75 mb-3 uppercase font-medium">
          CYBERSECURITY OPERATIONS // CANDIDATE DOSSIER
        </div>

        {/* Name */}
        <h1
          className="font-orbitron font-black text-white leading-none mb-3 tracking-wide drop-shadow-md"
          style={{ fontSize: 'clamp(24px, 2.7vw, 44px)', minHeight: '1.2em' }}
        >
          <span ref={nameRef} className="inline-block whitespace-nowrap">&nbsp;</span>
        </h1>

        {/* Subtitle + tags + CTAs */}
        <div ref={subRef} className="opacity-0">
          {/* Title row */}
          <p
            className="font-inter text-slate-300 font-normal mb-3 leading-relaxed"
            style={{ fontSize: 'clamp(13px, 1.1vw, 16px)' }}
          >
            Cybersecurity Engineer &nbsp;·&nbsp; SOC Analyst &nbsp;·&nbsp; DevSecOps
          </p>

          {/* Value proposition */}
          <p
            className="font-inter text-slate-400 leading-relaxed mb-4"
            style={{ fontSize: 'clamp(11px, 0.85vw, 13px)', maxWidth: '440px' }}
          >
            Building secure infrastructure, security monitoring systems, and DevSecOps pipelines with practical hands-on engineering.
          </p>

          {/* Specialization tags */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {SPEC_TAGS.map(tag => (
              <span
                key={tag}
                className="font-orbitron text-[8px] text-cyber-cyan bg-cyber-cyan/8 border border-cyber-cyan/25 px-2 py-0.5 rounded-xs tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Available status */}
          <div className="flex items-center gap-2 mb-5">
            <div className="w-2 h-2 rounded-full bg-cyber-green beacon-dot flex-shrink-0" />
            <span className="font-orbitron text-[10px] text-cyber-green tracking-widest font-semibold">AVAILABLE FOR HIRE</span>
          </div>

          {/* Primary CTAs */}
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() => (onNavigate ? onNavigate('projects') : onEnter())}
              className="font-orbitron text-[10px] font-bold text-cyber-bg bg-cyber-cyan px-5 py-2.5 rounded-xs hover:brightness-110 transition-all duration-200 tracking-wider shadow-[0_0_16px_rgba(0,245,255,0.3)] focus:outline-none focus:ring-2 focus:ring-cyber-cyan focus:ring-offset-2 focus:ring-offset-cyber-bg"
              aria-label="View projects"
            >
              VIEW PROJECTS ▶
            </button>

            <a
              href={RESUME_URL}
              download="Abhimanyu_Kumar_Resume.pdf"
              className="font-orbitron text-[10px] font-semibold text-cyber-cyan border border-cyber-cyan/60 px-5 py-2.5 rounded-xs hover:bg-cyber-cyan/10 hover:border-cyber-cyan transition-all duration-200 tracking-wider focus:outline-none focus:ring-2 focus:ring-cyber-cyan focus:ring-offset-2 focus:ring-offset-cyber-bg flex items-center gap-1.5"
              aria-label="Download resume PDF"
            >
              <span>DOWNLOAD RESUME</span>
              <span className="text-[8px]">↓</span>
            </a>

            {onOpenScanner && (
              <button
                type="button"
                onClick={onOpenScanner}
                className="font-orbitron text-[10px] font-semibold text-amber-300 border border-amber-400/60 bg-amber-400/10 px-4 py-2.5 rounded-xs hover:bg-amber-400/20 hover:border-amber-400 transition-all duration-200 tracking-wider flex items-center gap-1.5 focus:outline-none shadow-[0_0_14px_rgba(255,183,0,0.18)]"
                aria-label="Launch Shodan-style live asset recon tool"
              >
                <span className="text-amber-400">⌕</span>
                <span>ASSET RECON</span>
              </button>
            )}
          </div>

          {/* Secondary links */}
          <div className="flex items-center gap-3.5 flex-wrap">
            <button
              onClick={() => (onNavigate ? onNavigate('about') : onEnter())}
              className="font-orbitron text-[9px] text-slate-400 hover:text-cyber-cyan transition-colors tracking-wider focus:outline-none focus:text-cyber-cyan"
              aria-label="Go to about section"
            >
              ABOUT →
            </button>
            <span className="w-px h-3 bg-cyber-border" />
            <a
              href="https://github.com/abhienix"
              target="_blank"
              rel="noopener noreferrer"
              className="font-orbitron text-[9px] text-slate-400 hover:text-cyber-cyan transition-colors tracking-wider focus:outline-none focus:text-cyber-cyan"
              aria-label="GitHub profile"
            >
              GITHUB ↗
            </a>
            <span className="w-px h-3 bg-cyber-border" />
            <a
              href="https://linkedin.com/in/abhimanyu-sec"
              target="_blank"
              rel="noopener noreferrer"
              className="font-orbitron text-[9px] text-slate-400 hover:text-cyber-cyan transition-colors tracking-wider focus:outline-none focus:text-cyber-cyan"
              aria-label="LinkedIn profile"
            >
              LINKEDIN ↗
            </a>
            <span className="w-px h-3 bg-cyber-border" />
            <button
              onClick={() => (onNavigate ? onNavigate('contact') : onEnter())}
              className="font-orbitron text-[9px] text-slate-400 hover:text-cyber-cyan transition-colors tracking-wider focus:outline-none focus:text-cyber-cyan"
              aria-label="Go to contact section"
            >
              CONTACT →
            </button>
          </div>
        </div>
      </div>

      {/* ── Coordinate readout — bottom center ── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-inter text-[9px] text-slate-600 tracking-wider animate-pulse-slow pointer-events-none select-none"
        aria-hidden="true"
      >
        DRAG GLOBE TO EXPLORE · CLICK STATIONS TO NAVIGATE
      </div>
    </div>
  );
}
