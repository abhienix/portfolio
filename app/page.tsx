'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import type { CameraRigHandle } from '@/components/camera/CameraRig';
import PanelManager from '@/components/panels/PanelManager';
import SidebarNav from '@/components/navigation/SidebarNav';
import KeyboardNav from '@/components/navigation/KeyboardNav';
import gsap from 'gsap';
import CustomCursor from '@/components/shared/CustomCursor';
import MobileFallback from '@/components/shared/MobileFallback';
import LiveThreatFeedHUD from '@/components/panels/LiveThreatFeedHUD';
import PortfolioFooter from '@/components/panels/PortfolioFooter';
import LiveReconModal from '@/components/panels/LiveReconModal';
import type { VisitorLockData } from '@/components/globe/VisitorTargetLock';
import { SECTION_ORDER, type SectionId } from '@/lib/cameraPresets';

// Dynamic import to disable SSR for Three.js canvas
const GlobeScene = dynamic(() => import('@/components/globe/GlobeScene'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-cyber-bg flex items-center justify-center">
      <div className="font-orbitron text-xs text-cyber-dim tracking-widest animate-pulse">
        INITIALIZING THREAT MAP...
      </div>
    </div>
  ),
});

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [introComplete, setIntroComplete] = useState(false);
  const [navVisible, setNavVisible] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [scanlineActive, setScanlineActive] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [visitorLockData, setVisitorLockData] = useState<VisitorLockData | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const cameraRigRef = useRef<CameraRigHandle>(null);
  const globeGroupRef = useRef<THREE.Group>(null!);

  // Mobile detection
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Intro sequence timing
  useEffect(() => {
    if (isMobile) return;
    const t1 = setTimeout(() => setIntroComplete(true), 1800);
    const t2 = setTimeout(() => setNavVisible(true), 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [isMobile]);

  const navigateTo = useCallback((section: SectionId) => {
    if (section === activeSection) return;
    setActiveSection(section);
    setScanlineActive(true);
    setTimeout(() => setScanlineActive(false), 500);
    if (cameraRigRef.current && globeGroupRef.current) {
      cameraRigRef.current.flyTo(section, globeGroupRef.current);
    }
  }, [activeSection]);

  const handleEnterPlatform = useCallback(() => {
    navigateTo('about');
  }, [navigateTo]);

  // Acquire location via Network GeoIP
  const handleAcquireGeoIp = useCallback(async () => {
    try {
      const res = await fetch('/api/threats/recon');
      const data = await res.json();
      if (data.success && data.data) {
        const v = data.data;
        const lock: VisitorLockData = {
          lat: v.lat,
          lon: v.lon,
          city: v.city,
          country: v.country,
          source: 'geoip',
        };
        setVisitorLockData(lock);
        setIsZoomed(true);
        if (cameraRigRef.current && globeGroupRef.current) {
          cameraRigRef.current.zoomToCoordinates(v.lat, v.lon, globeGroupRef.current);
        }
      }
    } catch {}
  }, []);

  // Acquire location via Precise Device GPS
  const handleAcquireGps = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      handleAcquireGeoIp();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;

        let city = 'Precise GPS Fix';
        let country = 'Device Satellite Lock';

        try {
          const revRes = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
          );
          if (revRes.ok) {
            const revData = await revRes.json();
            city = revData.city || revData.locality || city;
            country = revData.countryName || country;
          }
        } catch {}

        const lock: VisitorLockData = {
          lat,
          lon,
          city,
          country,
          source: 'gps',
          accuracyMeters: accuracy,
        };

        setVisitorLockData(lock);
        setIsZoomed(true);

        if (cameraRigRef.current && globeGroupRef.current) {
          cameraRigRef.current.zoomToCoordinates(lat, lon, globeGroupRef.current);
        }
      },
      () => {
        // Fallback to GeoIP if permission denied or timeout
        handleAcquireGeoIp();
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, [handleAcquireGeoIp]);

  // Reset orbit zoom
  const handleResetZoom = useCallback(() => {
    setIsZoomed(false);
    if (cameraRigRef.current && globeGroupRef.current) {
      cameraRigRef.current.resetZoom(globeGroupRef.current);
    }
  }, []);

  const handleTargetFound = useCallback((lat: number, lon: number) => {
    if (globeGroupRef.current) {
      // Smoothly orient globe to face the target's longitude
      const targetRotY = -(lon * Math.PI) / 180 + 1.57;
      gsap.to(globeGroupRef.current.rotation, {
        y: targetRotY,
        duration: 1.6,
        ease: 'power2.inOut',
      });
    }
  }, []);

  if (isMobile) {
    return <MobileFallback />;
  }

  return (
    <main className="fixed inset-0 bg-cyber-bg overflow-hidden" role="main">
      {/* Custom cursor */}
      <CustomCursor />

      {/* 3D Globe Canvas */}
      <GlobeScene
        activeSection={activeSection}
        onNodeClick={navigateTo}
        onCoordinateChange={setCoords}
        cameraRigRef={cameraRigRef}
        globeGroupRef={globeGroupRef}
        visitorLockData={visitorLockData}
        isZoomed={isZoomed}
        onResetZoom={handleResetZoom}
      />

      {/* Scanline sweep effect during transitions */}
      {scanlineActive && <div className="scanline-sweep" aria-hidden="true" />}

      {/* Coordinate readout */}
      {coords && activeSection === 'hero' && (
        <div className="fixed bottom-24 left-8 font-orbitron text-[10px] text-cyber-cyan opacity-60 z-10 pointer-events-none">
          LAT: {coords.lat.toFixed(1)}°{coords.lat >= 0 ? 'N' : 'S'} &nbsp;
          LON: {Math.abs(coords.lon).toFixed(1)}°{coords.lon >= 0 ? 'E' : 'W'}
        </div>
      )}

      {/* Tactical HUD section badge (top center) */}
      {activeSection !== 'hero' && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3.5 px-4 py-1.5 glass-panel bg-cyber-bg/90 border border-cyber-cyan/40 backdrop-blur-md shadow-cyan-sm rounded-sm">
          <span className="font-orbitron text-[10px] text-white tracking-[0.25em] uppercase font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-green beacon-dot" />
            {activeSection.replace('-', ' ')}
          </span>
          <div className="h-3.5 w-px bg-cyber-border" />
          <button
            onClick={() => navigateTo('hero')}
            className="font-orbitron text-[9px] text-cyber-cyan hover:text-white transition-colors tracking-wider font-semibold focus:outline-none"
            aria-label="Return to command center"
          >
            ← HOME
          </button>
          <div className="h-3.5 w-px bg-cyber-border hidden sm:block" />
          <a
            href="/Abhimanyu_Kumar_Resume.pdf"
            download="Abhimanyu_Kumar_Resume.pdf"
            className="hidden sm:inline font-orbitron text-[9px] text-cyber-green border border-cyber-green/40 bg-cyber-green/8 px-2.5 py-0.5 rounded-xs hover:bg-cyber-green/15 transition-colors tracking-wider font-bold focus:outline-none focus:ring-1 focus:ring-cyber-green"
            aria-label="Download resume PDF"
          >
            RESUME ↓
          </a>
        </div>
      )}

      {/* Content panels */}
      <PanelManager
        activeSection={activeSection}
        onEnterPlatform={handleEnterPlatform}
        onNavigate={navigateTo}
        onOpenScanner={() => setScannerOpen(true)}
        visitorLockData={visitorLockData}
        isZoomed={isZoomed}
        onAcquireGps={handleAcquireGps}
        onAcquireGeoIp={handleAcquireGeoIp}
        onResetZoom={handleResetZoom}
        introComplete={introComplete}
      />

      {/* Sidebar navigation */}
      <SidebarNav
        activeSection={activeSection}
        onNavigate={navigateTo}
        visible={navVisible}
      />

      {/* Keyboard navigation */}
      <KeyboardNav
        activeSection={activeSection}
        onNavigate={navigateTo}
      />

      {/* Live Shodan-Style Asset Recon & Security Audit Modal */}
      <LiveReconModal
        isOpen={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onTargetFound={handleTargetFound}
      />

      {/* Portfolio Footer (contact section only) */}
      <PortfolioFooter activeSection={activeSection} />

      {/* Live Global Threat Intelligence Telemetry Strip */}
      <LiveThreatFeedHUD />

      {/* Accessibility skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only fixed top-2 left-2 z-50 bg-cyber-cyan text-cyber-bg px-3 py-1 font-orbitron text-xs rounded-xs"
      >
        Skip to content
      </a>
    </main>
  );
}

