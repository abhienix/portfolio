'use client';

import { useState, useCallback } from 'react';
import type { ReconResult } from '@/app/api/recon/route';

interface LiveReconModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTargetFound?: (lat: number, lon: number, label: string) => void;
}

const PRESETS = ['cdac.in', 'github.com', 'cisa.gov', 'cloudflare.com'];

export default function LiveReconModal({ isOpen, onClose, onTargetFound }: LiveReconModalProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('');
  const [result, setResult] = useState<ReconResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runScan = useCallback(async (targetDomain: string) => {
    const t = targetDomain.trim();
    if (!t) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      setStep('Resolving DNS records via Google DoH...');
      await new Promise(r => setTimeout(r, 400));

      setStep('Inspecting BGP ASN & GeoIP data center...');
      const res = await fetch(`/api/recon?target=${encodeURIComponent(t)}`);
      
      setStep('Analyzing HTTP security headers & SSL grade...');
      const data = await res.json();

      if (data.success && data.result) {
        setResult(data.result);
        if (onTargetFound && data.result.lat && data.result.lon) {
          onTargetFound(data.result.lat, data.result.lon, data.result.target);
        }
      } else {
        setError(data.error || 'Failed to inspect target');
      }
    } catch {
      setError('Network scan request timed out');
    } finally {
      setLoading(false);
      setStep('');
    }
  }, [onTargetFound]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-xl bg-cyber-bg/95 border border-cyber-cyan/60 rounded-sm shadow-[0_0_40px_rgba(0,245,255,0.25)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyber-cyan/30 bg-cyber-cyan/5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-pulse" />
            <span className="font-orbitron text-xs font-bold text-cyber-cyan tracking-wider">
              SHODAN-STYLE ASSET RECON & SECURITY AUDIT
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white font-orbitron text-sm px-2 py-0.5 rounded-xs transition-colors focus:outline-none"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Target Input */}
          <div>
            <label className="block font-orbitron text-[9px] text-slate-400 uppercase tracking-wider mb-1.5">
              TARGET DOMAIN OR PUBLIC IP ADDRESS
            </label>
            <form
              onSubmit={e => {
                e.preventDefault();
                runScan(query);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="e.g. cdac.in, google.com, or your company domain..."
                className="flex-1 bg-black/70 border border-cyber-cyan/40 px-3.5 py-2 font-mono text-xs text-white placeholder-slate-500 rounded-xs focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="font-orbitron text-xs font-bold text-cyber-bg bg-cyber-cyan px-5 py-2 rounded-xs hover:brightness-110 disabled:opacity-50 transition-all tracking-wider shadow-[0_0_12px_rgba(0,245,255,0.3)]"
              >
                {loading ? 'AUDITING...' : 'AUDIT ▶'}
              </button>
            </form>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="font-mono text-[8.5px] text-slate-400">QUICK PRESETS:</span>
              {PRESETS.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    setQuery(p);
                    runScan(p);
                  }}
                  className="font-mono text-[8.5px] text-cyber-cyan/90 border border-cyber-cyan/30 px-2 py-0.5 rounded-xs hover:bg-cyber-cyan/15 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Loading Animation */}
          {loading && (
            <div className="p-4 bg-cyber-cyan/5 border border-cyber-cyan/30 rounded-xs flex items-center gap-3">
              <div className="w-4 h-4 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <span className="font-mono text-xs text-cyber-cyan animate-pulse">
                {step}
              </span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-xs font-mono text-xs text-red-300">
              Error: {error}
            </div>
          )}

          {/* Results Dossier */}
          {result && (
            <div className="space-y-3 animate-in fade-in duration-200">
              {/* Primary Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-2.5 bg-black/60 border border-cyber-border rounded-xs">
                  <div className="font-orbitron text-[7.5px] text-slate-400 tracking-wider">RESOLVED IP</div>
                  <div className="font-mono text-[11px] text-cyber-cyan font-bold truncate">{result.ip}</div>
                </div>
                <div className="p-2.5 bg-black/60 border border-cyber-border rounded-xs">
                  <div className="font-orbitron text-[7.5px] text-slate-400 tracking-wider">SECURITY GRADE</div>
                  <div className="font-orbitron text-[11px] font-black text-cyber-green">{result.grade} ({result.securityScore})</div>
                </div>
                <div className="p-2.5 bg-black/60 border border-cyber-border rounded-xs">
                  <div className="font-orbitron text-[7.5px] text-slate-400 tracking-wider">DATACENTER LOCATION</div>
                  <div className="font-mono text-[10.5px] text-slate-200 truncate">{result.city}, {result.countryCode}</div>
                </div>
                <div className="p-2.5 bg-black/60 border border-cyber-border rounded-xs">
                  <div className="font-orbitron text-[7.5px] text-slate-400 tracking-wider">BGP / ASN</div>
                  <div className="font-mono text-[10px] text-amber-300 truncate">{result.asn}</div>
                </div>
              </div>

              {/* Security Headers Checklist */}
              <div className="p-3 bg-black/60 border border-cyber-border rounded-xs">
                <div className="font-orbitron text-[8.5px] text-cyber-cyan font-bold tracking-wider mb-2">
                  OWASP HTTP SECURITY HEADERS AUDIT
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono text-[9px]">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-300">Strict-Transport-Security (HSTS):</span>
                    <span className={result.headers.hsts ? 'text-cyber-green font-bold' : 'text-red-400'}>
                      {result.headers.hsts ? '✓ ENFORCED' : '✗ MISSING'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-300">Content-Security-Policy (CSP):</span>
                    <span className={result.headers.csp ? 'text-cyber-green font-bold' : 'text-amber-400'}>
                      {result.headers.csp ? '✓ CONFIGURED' : '✗ MISSING'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-300">X-Frame-Options (Clickjack):</span>
                    <span className={result.headers.xFrame ? 'text-cyber-green font-bold' : 'text-red-400'}>
                      {result.headers.xFrame ? '✓ PROTECTED' : '✗ MISSING'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-300">X-Content-Type-Options:</span>
                    <span className={result.headers.xContentType ? 'text-cyber-green font-bold' : 'text-red-400'}>
                      {result.headers.xContentType ? '✓ NOSNIFF' : '✗ MISSING'}
                    </span>
                  </div>
                </div>
              </div>

              {/* DNS & Host Routing */}
              <div className="p-3 bg-black/60 border border-cyber-border rounded-xs font-mono text-[8.5px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">ORGANIZATION / ISP:</span>
                  <span className="text-slate-200">{result.isp}</span>
                </div>
                {result.dns.mxRecords.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">MAIL EXCHANGERS (MX):</span>
                    <span className="text-slate-200 truncate max-w-[280px]">{result.dns.mxRecords.join(', ')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-400">STANDARD OPEN SERVICES:</span>
                  <span className="text-cyber-green">Port 80/TCP (HTTP), Port 443/TCP (HTTPS)</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-cyber-border bg-black/40 flex items-center justify-between">
          <span className="font-mono text-[8px] text-slate-500">
            REAL-TIME DNS & HTTP HEADERS AUDITOR · ABHIMANYU KUMAR
          </span>
          <button
            onClick={onClose}
            className="font-orbitron text-[9px] text-slate-300 hover:text-white border border-slate-700 px-3 py-1 rounded-xs transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
