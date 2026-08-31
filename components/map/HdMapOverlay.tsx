'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [opacity, setOpacity] = useState(0);

  // Fade in when visible
  useEffect(() => {
    if (visible) {
      // Slight delay so the 3D globe zoom settles first
      const t = setTimeout(() => setOpacity(1), 100);
      return () => clearTimeout(t);
    } else {
      setOpacity(0);
    }
  }, [visible]);

  // Create / update Leaflet map
  useEffect(() => {
    if (!visible || !data || !containerRef.current) return;

    // Clean up previous map instance if it exists
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(containerRef.current, {
      center: [data.lat, data.lon],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    // Esri World Imagery — free, no API key, real Maxar satellite photos
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 19 }
    ).addTo(map);

    // Add semi-transparent road overlay for street names
    L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 19, opacity: 0.5 }
    ).addTo(map);

    // Target lock marker
    const markerIcon = L.divIcon({
      className: '',
      html: `
        <div style="position:relative;width:48px;height:48px;margin:-24px 0 0 -24px;">
          <div style="position:absolute;inset:0;border:2px solid #00FF88;border-radius:50%;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
          <div style="position:absolute;inset:4px;border:1.5px solid #00F5FF;border-radius:50%;opacity:0.7;"></div>
          <div style="position:absolute;inset:8px;border:1px dashed #00FF88;border-radius:50%;animation:spin 4s linear infinite;"></div>
          <div style="position:absolute;inset:18px;background:#00FF88;border-radius:50%;box-shadow:0 0 12px #00FF88,0 0 24px rgba(0,255,136,0.4);"></div>
        </div>
      `,
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });

    L.marker([data.lat, data.lon], { icon: markerIcon }).addTo(map);

    map.on('zoomend', () => setCurrentZoom(map.getZoom()));

    mapRef.current = map;

    // Force a resize after mount
    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [visible, data]);

  if (!visible || !data) return null;

  return (
    <div
      className="fixed inset-0 z-40"
      style={{
        opacity,
        transition: 'opacity 0.8s ease-in-out',
        pointerEvents: opacity > 0.5 ? 'auto' : 'none',
      }}
    >
      {/* Full-screen Leaflet satellite map */}
      <div ref={containerRef} className="absolute inset-0" style={{ zIndex: 1 }} />

      {/* Vignette edge overlay for cinematic feel */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* Top HUD Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 h-10 bg-black/80 backdrop-blur-md border-b border-cyber-cyan/40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyber-green animate-ping" />
          <span className="font-orbitron text-[10px] text-cyber-green font-bold tracking-wider">
            HD SATELLITE RECON // {data.city}, {data.country}
          </span>
          <span className="font-mono text-[9px] text-slate-400 hidden sm:inline">
            {data.lat.toFixed(5)}°N, {data.lon.toFixed(5)}°E
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/50 rounded-xs font-orbitron text-[9px] font-bold transition-all cursor-pointer"
        >
          ✕ RETURN TO 3D GLOBE
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="absolute right-4 top-14 z-10 flex flex-col gap-1">
        <button
          type="button"
          onClick={() => mapRef.current?.zoomIn()}
          className="w-8 h-8 bg-black/80 hover:bg-cyber-cyan hover:text-black text-white border border-cyber-cyan/60 rounded-xs font-mono font-bold text-lg flex items-center justify-center transition-colors cursor-pointer"
        >+</button>
        <button
          type="button"
          onClick={() => mapRef.current?.zoomOut()}
          className="w-8 h-8 bg-black/80 hover:bg-cyber-cyan hover:text-black text-white border border-cyber-cyan/60 rounded-xs font-mono font-bold text-lg flex items-center justify-center transition-colors cursor-pointer"
        >-</button>
      </div>

      {/* Bottom Telemetry */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-8 bg-black/80 backdrop-blur-md border-t border-cyber-border flex items-center justify-between px-4 font-mono text-[8px] text-slate-400">
        <div className="flex items-center gap-4">
          <span className="text-cyber-green font-bold">ZOOM: {currentZoom}x</span>
          <span className="hidden sm:inline">LAT: {data.lat.toFixed(6)}° | LON: {data.lon.toFixed(6)}°</span>
          {data.accuracyMeters && (
            <span className="text-amber-300">±{Math.round(data.accuracyMeters)}m</span>
          )}
        </div>
        <span className="text-slate-500">SATELLITE IMAGERY © ESRI / MAXAR</span>
      </div>
    </div>
  );
}
