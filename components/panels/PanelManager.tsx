'use client';

import { AnimatePresence } from 'framer-motion';
import type { SectionId } from '@/lib/cameraPresets';
import HeroOverlay from './HeroOverlay';
import AboutPanel from './AboutPanel';
import SkillsPanel from './SkillsPanel';
import ProjectsPanel from './ProjectsPanel';
import ExperiencePanel from './ExperiencePanel';
import ContactPanel from './ContactPanel';

import type { VisitorLockData } from '@/components/globe/VisitorTargetLock';

interface PanelManagerProps {
  activeSection: SectionId;
  onEnterPlatform: () => void;
  onNavigate?: (section: SectionId) => void;
  onOpenScanner?: () => void;
  visitorLockData?: VisitorLockData | null;
  isZoomed?: boolean;
  onAcquireGps?: () => void;
  onAcquireGeoIp?: () => void;
  onResetZoom?: () => void;
  introComplete: boolean;
}

const PANEL_POSITIONS: Record<SectionId, string> = {
  hero:       '',
  about:      'fixed right-12 lg:right-20 top-1/2 -translate-y-1/2 z-20',
  skills:     'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20',
  projects:   'fixed left-8 lg:left-14 top-1/2 -translate-y-1/2 z-20',
  experience: 'fixed right-12 lg:right-20 top-1/2 -translate-y-1/2 z-20',
  contact:    'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20',
};

export default function PanelManager({
  activeSection,
  onEnterPlatform,
  onNavigate,
  onOpenScanner,
  visitorLockData,
  isZoomed,
  onAcquireGps,
  onAcquireGeoIp,
  onResetZoom,
  introComplete,
}: PanelManagerProps) {
  return (
    <>
      {/* Hero overlay always present when on hero */}
      <AnimatePresence>
        {activeSection === 'hero' && introComplete && (
          <HeroOverlay
            onEnter={onEnterPlatform}
            onNavigate={onNavigate}
            onOpenScanner={onOpenScanner}
            visitorLockData={visitorLockData}
            isZoomed={isZoomed}
            onAcquireGps={onAcquireGps}
            onAcquireGeoIp={onAcquireGeoIp}
            onResetZoom={onResetZoom}
            visible
          />
        )}
      </AnimatePresence>

      {/* Positioned content panels */}
      <AnimatePresence>
        {activeSection !== 'hero' && (
          <div className={PANEL_POSITIONS[activeSection]}>
            {activeSection === 'about'      && <AboutPanel />}
            {activeSection === 'skills'     && <SkillsPanel />}
            {activeSection === 'projects'   && <ProjectsPanel />}
            {activeSection === 'experience' && <ExperiencePanel />}
            {activeSection === 'contact'    && <ContactPanel />}
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
