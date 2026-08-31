'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { VisitorLockData } from '@/components/globe/VisitorTargetLock';

interface HdMapOverlayProps {
  data: VisitorLockData | null;
  visible: boolean;
  onClose: () => void;
}

export default function HdMapOverlay({ data, visible, onClose }: HdMapOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [currentZoom, setCurrentZoom] = useState(15);
  const [phase, setPhase] = useState<'hidden' | 'entering' | 'visible' | 'exiting'>('hidden');

  // Phase management for smooth transitions
  useEffect(() => {
    if (visible && phase === 'hidden') {
      setPhase('entering');
      const t = setTimeout(() => setPhase('visible'), 50);
      return () => clearTimeout(t);
    }
    if (!visible && (phase === 'visible' || phase === 'entering')) {
      setPhase('exiting');
      const t = setTimeout(() => setPhase('hidden'), 800);
      return () => clearTimeout(t);
    }
  }, [visible, phase]);

  // Create / update Leaflet map
  useEffect(() => {
    if (phase === 'hidden' || !data || !containerRef.current) return;

    // Avoid re-creating if map already exists
    if (mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [data.lat, data.lon],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    // Esri World Imagery — free, no API key, real Maxar satellite imagery
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 19 }
    ).addTo(map);

    // Semi-transparent road labels overlay
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 19, opacity: 0.45 }
    ).addTo(map);

    // Pulsing target lock marker
    const markerIcon = L.divIcon({
      className: '',
      html: `
        <div style="position:relative;width:52px;height:52px;">
          <div style="position:absolute;inset:0;border:2px solid #00FF88;border-radius:50%;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="position:absolute;inset:6px;border:1.5px solid #00F5FF;border-radius:50%;opacity:0.6;"></div>
          <div style="position:absolute;inset:12px;border:1px dashed #00FF88;border-radius:50%;animation:spin 4s linear infinite;"></div>
          <div style="position:absolute;inset:20px;background:#00FF88;border-radius:50%;box-shadow:0 0 14px #00FF88,0 0 28px rgba(0,255,136,0.4);"></div>
        </div>
      `,
      iconSize: [52, 52],
      iconAnchor: [26, 26],
    });

    L.marker([data.lat, data.lon], { icon: markerIcon }).addTo(map);
    map.on('zoomend', () => setCurrentZoom(map.getZoom()));
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 300);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [phase, data]);

  const handleClose = useCallback(() => {
    setPhase('exiting');
    setTimeout(() => {
      setPhase('hidden');
      onClose();
    }, 700);
  }, [onClose]);

  if (phase === 'hidden') return null;

  const isShowing = phase === 'visible' || phase === 'entering';

  return (
    <>
      {/* Inline keyframes for marker animations */}
      <style jsx global>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Semi-transparent backdrop so globe is slightly visible behind */}
      <div
        className="fixed inset-0 z-40"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          opacity: isShowing ? 1 : 0,
          transition: 'opacity 0.7s ease-in-out',
          pointerEvents: isShowing ? 'auto' : 'none',
        }}
      />

      {/* Contained map window — NOT fullscreen, 85% of viewport with border */}
      <div
        className="fixed z-50 flex flex-col"
        style={{
          top: '4%',
          left: '5%',
          right: '5%',
          bottom: '6%',
          opacity: isShowing ? 1 : 0,
          transform: isShowing ? 'scale(1)' : 'scale(0.92)',
          transition: 'opacity 0.7s ease-in-out, transform 0.7s ease-in-out',
          pointerEvents: isShowing ? 'auto' : 'none',
        }}
      >
        {/* Top HUD Bar */}
        <div className="h-10 bg-black/95 backdrop-blur-md border border-b-0 border-cyber-cyan/50 rounded-t-md flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cyber-green animate-pulse" />
            <span className="font-orbitron text-[10px] text-cyber-green font-bold tracking-wider">
              HD SATELLITE RECON // OPTICAL TARGET LOCK
            </span>
            <span className="font-mono text-[9px] text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/30 px-2 py-0.5 rounded hidden sm:inline">
              {data?.city}, {data?.country} — {data?.lat.toFixed(4)}°N, {data?.lon.toFixed(4)}°E
            </span>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="px-3 py-1 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/50 rounded font-orbitron text-[9px] font-bold transition-all cursor-pointer"
          >
            ✕ RETURN TO 3D GLOBE
          </button>
        </div>

        {/* Map container */}
        <div className="relative flex-1 border-x border-cyber-cyan/50 overflow-hidden">
          <div ref={containerRef} className="absolute inset-0" />

          {/* Vignette edge */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5) 100%)',
            }}
          />

          {/* Zoom Controls */}
          <div className="absolute right-3 top-3 z-10 flex flex-col gap-1">
            <button
              type="button"
              onClick={() => mapRef.current?.zoomIn()}
              className="w-8 h-8 bg-black/80 hover:bg-cyber-cyan hover:text-black text-white border border-cyber-cyan/60 rounded font-mono font-bold text-lg flex items-center justify-center transition-colors cursor-pointer"
            >+</button>
            <button
              type="button"
              onClick={() => mapRef.current?.zoomOut()}
              className="w-8 h-8 bg-black/80 hover:bg-cyber-cyan hover:text-black text-white border border-cyber-cyan/60 rounded font-mono font-bold text-lg flex items-center justify-center transition-colors cursor-pointer"
            >−</button>
          </div>
        </div>

        {/* Bottom Telemetry Bar */}
        <div className="h-7 bg-black/95 backdrop-blur-md border border-t-0 border-cyber-cyan/50 rounded-b-md flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-4 font-mono text-[8px] text-slate-400">
            <span className="text-cyber-green font-bold">OPTICAL MAGNIFICATION: {currentZoom}x</span>
            <span className="hidden sm:inline">LAT: {data?.lat.toFixed(6)}° | LON: {data?.lon.toFixed(6)}°</span>
            {data?.accuracyMeters && (
              <span className="text-amber-300 font-bold">ACCURACY: ±{Math.round(data.accuracyMeters)}m</span>
            )}
          </div>
          <span className="font-mono text-[7px] text-slate-600">HIGH-RESOLUTION SATELLITE IMAGERY © ESRI / MAXAR</span>
        </div>
      </div>
    </>
  );
}
