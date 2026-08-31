'use client';

import { useEffect, useState } from 'react';
import { SECTION_ORDER, type SectionId } from '@/lib/cameraPresets';

interface KeyboardNavProps {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
}

export default function KeyboardNav({ activeSection, onNavigate }: KeyboardNavProps) {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Show hint after 5s idle
    const hintTimer = setTimeout(() => setShowHint(true), 5000);

    const handler = (e: KeyboardEvent) => {
      setShowHint(false);

      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (isInput) return;

      // Escape returns to hero overview
      if (e.key === 'Escape' && activeSection !== 'hero') {
        e.preventDefault();
        onNavigate('hero');
        return;
      }

      const idx = SECTION_ORDER.indexOf(activeSection);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        const next = SECTION_ORDER[(idx + 1) % SECTION_ORDER.length];
        onNavigate(next);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        const prev = SECTION_ORDER[(idx - 1 + SECTION_ORDER.length) % SECTION_ORDER.length];
        onNavigate(prev);
      }
    };

    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      clearTimeout(hintTimer);
    };
  }, [activeSection, onNavigate]);

  if (!showHint) return null;

  return (
    <div className="fixed bottom-4 right-16 z-20 font-inter text-[10px] text-cyber-dim opacity-60 pointer-events-none">
      PRESS <kbd className="border border-cyber-border px-1 py-0.5 rounded-xs font-mono text-[9px]">←</kbd> <kbd className="border border-cyber-border px-1 py-0.5 rounded-xs font-mono text-[9px]">→</kbd> TO NAVIGATE
    </div>
  );
}
