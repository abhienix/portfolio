'use client';

const RESUME_URL = '/Abhimanyu_Kumar_Resume.pdf';

interface PortfolioFooterProps {
  activeSection: string;
}

export default function PortfolioFooter({ activeSection }: PortfolioFooterProps) {
  // Only show footer when on the contact section
  if (activeSection !== 'contact') return null;

  return (
    <footer
      className="fixed bottom-14 left-1/2 -translate-x-1/2 z-15 pointer-events-none select-none"
      aria-label="Portfolio legal and links"
    >
      <div className="flex items-center gap-4 font-orbitron text-[8px] text-slate-600 tracking-wider">
        <span>ABHIMANYU KUMAR</span>
        <span className="text-cyber-border">·</span>
        <span>CYBERSECURITY ENGINEER</span>
        <span className="text-cyber-border">·</span>
        <a
          href={RESUME_URL}
          download="Abhimanyu_Kumar_Resume.pdf"
          className="pointer-events-auto text-cyber-dim/50 hover:text-cyber-cyan transition-colors"
          aria-label="Download resume"
        >
          RESUME ↓
        </a>
        <span className="text-cyber-border">·</span>
        <a
          href="https://github.com/abhienix"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto text-cyber-dim/50 hover:text-cyber-cyan transition-colors"
          aria-label="GitHub"
        >
          GITHUB ↗
        </a>
        <span className="text-cyber-border">·</span>
        <a
          href="https://linkedin.com/in/abhimanyu-sec"
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto text-cyber-dim/50 hover:text-cyber-cyan transition-colors"
          aria-label="LinkedIn"
        >
          LINKEDIN ↗
        </a>
        <span className="text-cyber-border">·</span>
        <span>© 2026</span>
      </div>
    </footer>
  );
}
