'use client';

export function CyberCornerBrackets({ className = '' }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 select-none ${className}`}>
      {/* Top Left */}
      <svg className="absolute top-1 left-1 w-3 h-3 text-cyber-cyan opacity-85" viewBox="0 0 16 16" fill="none">
        <path d="M 0 16 L 0 0 L 16 0" stroke="currentColor" strokeWidth="2" />
        <circle cx="2" cy="2" r="1.5" fill="currentColor" />
      </svg>
      {/* Top Right */}
      <svg className="absolute top-1 right-1 w-3 h-3 text-cyber-cyan opacity-85" viewBox="0 0 16 16" fill="none">
        <path d="M 0 0 L 16 0 L 16 16" stroke="currentColor" strokeWidth="2" />
        <circle cx="14" cy="2" r="1.5" fill="currentColor" />
      </svg>
      {/* Bottom Left */}
      <svg className="absolute bottom-1 left-1 w-3 h-3 text-cyber-cyan opacity-85" viewBox="0 0 16 16" fill="none">
        <path d="M 0 0 L 0 16 L 16 16" stroke="currentColor" strokeWidth="2" />
        <circle cx="2" cy="14" r="1.5" fill="currentColor" />
      </svg>
      {/* Bottom Right */}
      <svg className="absolute bottom-1 right-1 w-3 h-3 text-cyber-cyan opacity-85" viewBox="0 0 16 16" fill="none">
        <path d="M 0 16 L 16 16 L 16 0" stroke="currentColor" strokeWidth="2" />
        <circle cx="14" cy="14" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
}

export function CyberRadarIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className="inline-block" fill="none">
      <circle cx="16" cy="16" r="14" stroke="#00F5FF" strokeWidth="1.5" opacity="0.3" />
      <circle cx="16" cy="16" r="8" stroke="#00F5FF" strokeWidth="1" opacity="0.5" strokeDasharray="3 3" />
      <line x1="16" y1="2" x2="16" y2="30" stroke="#00F5FF" strokeWidth="1" opacity="0.3" />
      <line x1="2" y1="16" x2="30" y2="16" stroke="#00F5FF" strokeWidth="1" opacity="0.3" />
      <circle cx="16" cy="16" r="2.5" fill="#00FF88" className="animate-ping" opacity="0.75" />
      <circle cx="16" cy="16" r="2" fill="#00FF88" />
    </svg>
  );
}

export function CyberShieldSvg({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="inline-block">
      <path
        d="M 12 2 L 20 6 V 12 C 20 17 16 21 12 22 C 8 21 4 17 4 12 V 6 Z"
        stroke="#00F5FF"
        strokeWidth="1.5"
        fill="rgba(0, 245, 255, 0.1)"
      />
      <path d="M 8 12 L 11 15 L 16 9" stroke="#00FF88" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
