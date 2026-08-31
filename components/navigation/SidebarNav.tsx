'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { SECTION_ORDER, type SectionId } from '@/lib/cameraPresets';

const LABELS: Record<SectionId, { short: string; num: string }> = {
  hero:       { short: 'HOME',       num: '01' },
  about:      { short: 'ABOUT',      num: '02' },
  skills:     { short: 'ARSENAL',    num: '03' },
  projects:   { short: 'PROJECTS',   num: '04' },
  experience: { short: 'EXPERIENCE', num: '05' },
  contact:    { short: 'CONTACT',    num: '06' },
};

interface SidebarNavProps {
  activeSection: SectionId;
  onNavigate: (section: SectionId) => void;
  visible: boolean;
}

export default function SidebarNav({ activeSection, onNavigate, visible }: SidebarNavProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          aria-label="Tactical section navigation"
          className="fixed right-5 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center select-none pointer-events-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {/* Vertical track line */}
          <div className="absolute top-2 bottom-2 w-px bg-cyber-border/40 pointer-events-none" />

          {/* Navigation nodes */}
          <div className="flex flex-col gap-3.5 py-2">
            {SECTION_ORDER.map((section, i) => {
              const isActive = activeSection === section;
              const { short, num } = LABELS[section];
              return (
                <motion.button
                  key={section}
                  onClick={() => onNavigate(section)}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                  aria-label={`Navigate to ${short}`}
                  aria-current={isActive ? 'page' : undefined}
                  className="group relative flex items-center justify-end py-1 px-1 focus:outline-none"
                >
                  {/* Floating label to the left */}
                  <span
                    className={`absolute right-6 font-orbitron text-[8.5px] font-bold tracking-wider px-2 py-0.5 rounded-xs border backdrop-blur-md whitespace-nowrap transition-all duration-200 pointer-events-none flex items-center gap-1.5 ${
                      isActive
                        ? 'opacity-100 text-cyber-cyan bg-cyber-bg/95 border-cyber-cyan/40 shadow-[0_0_10px_rgba(0,245,255,0.25)] translate-x-0'
                        : 'opacity-0 group-hover:opacity-100 text-slate-300 bg-cyber-bg/90 border-cyber-border translate-x-1 group-hover:translate-x-0'
                    }`}
                  >
                    <span className="text-[7.5px] text-cyber-dim/70 font-mono">{num}</span>
                    <span>{short}</span>
                  </span>

                  {/* Tactical Indicator Dot */}
                  <div
                    className={`relative z-10 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'w-2.5 h-2.5 bg-cyber-cyan shadow-[0_0_10px_rgba(0,245,255,0.9)] ring-2 ring-cyber-cyan/30'
                        : 'w-1.5 h-1.5 bg-cyber-dim/40 group-hover:bg-cyber-cyan group-hover:scale-125'
                    }`}
                  />
                </motion.button>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
