'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { type VisitorLockData } from '@/components/globe/VisitorTargetLock';

interface HdSatelliteViewProps {
  data: VisitorLockData | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function HdSatelliteView({ data, isOpen, onClose }: HdSatelliteViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [mapType, setMapType] = useState<'satellite' | 'tactical'>('satellite');
  const [currentZoom, setCurrentZoom] = useState(14);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize or update Leaflet map when opened with data
  useEffect(() => {
    if (!isOpen || !data || !mapContainerRef.current) return;

    const lat = data.lat;
    const lon = data.lon;

    // If map does not exist, create it
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [lat, lon],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      // High-resolution Esri World Imagery (Satellite)
      const tileUrl =
        mapType === 'satellite'
          ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

      const tiles = L.tileLayer(tileUrl, {
        maxZoom: 18,
        subdomains: 'abcd',
      }).addTo(map);

      tileLayerRef.current = tiles;

      // Custom pulsing cyber reticle marker
      const radarIcon = L.divIcon({
        className: 'cyber-radar-marker',
        html: `
          <div style="position: relative; width: 44px; height: 44px; margin-left: -22px; margin-top: -22px; pointer-events: none;">
            <div style="position: absolute; inset: 0; border: 2px solid #00FF88; border-radius: 50%; opacity: 0.8; animation: ping 1.8s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="position: absolute; inset: 6px; border: 1.5px dashed #00F5FF; border-radius: 50%;"></div>
            <div style="position: absolute; inset: 16px; background: #00FF88; border-radius: 50%; box-shadow: 0 0 10px #00FF88;"></div>
            <div style="position: absolute; top: -18px; left: 50%; transform: translateX(-50%); font-family: monospace; font-size: 8px; font-weight: bold; color: #00FF88; background: rgba(0,0,0,0.85); padding: 1px 4px; border: 1px solid #00FF88; border-radius: 2px; white-space: nowrap;">TARGET LOCK</div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      L.marker([lat, lon], { icon: radarIcon }).addTo(map);

      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([lat, lon], 14);
    }

    return () => {
      // Don't immediately destroy map on every rerender
    };
  }, [isOpen, data, mapType]);

  // Handle tile type switch
  const switchMapType = (type: 'satellite' | 'tactical') => {
    setMapType(type);
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    tileLayerRef.current.remove();
    const tileUrl =
      type === 'satellite'
        ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

    const tiles = L.tileLayer(tileUrl, {
      maxZoom: 18,
      subdomains: 'abcd',
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = tiles;
  };

  // Zoom controls
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md animate-in fade-in duration-300 select-none">
      {/* Tactical Map Container */}
      <div className="relative w-full max-w-5xl h-[82vh] bg-cyber-bg border-2 border-cyber-cyan/70 rounded-xs overflow-hidden shadow-[0_0_50px_rgba(0,245,255,0.3)] flex flex-col">
        {/* ── Top Header Bar ── */}
        <div className="h-12 bg-black/90 border-b border-cyber-cyan/40 px-4 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-orbitron text-[10px] sm:text-xs font-bold text-cyber-green">
              <span className="w-2.5 h-2.5 rounded-full bg-cyber-green animate-ping" />
              <span>HIGH-DEFINITION SATELLITE RECON // OPTICAL TARGET LOCK</span>
            </div>
            <span className="hidden md:inline font-mono text-[9px] text-slate-400 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-xs">
              {data.city}, {data.country} · {data.lat.toFixed(4)}°N, {data.lon.toFixed(4)}°E
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center border border-cyber-border rounded-xs overflow-hidden font-orbitron text-[8px]">
              <button
                type="button"
                onClick={() => switchMapType('satellite')}
                className={`px-2.5 py-1 transition-colors ${mapType === 'satellite' ? 'bg-cyber-cyan text-black font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                🛰️ SATELLITE
              </button>
              <button
                type="button"
                onClick={() => switchMapType('tactical')}
                className={`px-2.5 py-1 transition-colors ${mapType === 'tactical' ? 'bg-cyber-cyan text-black font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                🗺️ TACTICAL
              </button>
            </div>

            {/* Close / Return to Globe */}
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white border border-red-500/50 rounded-xs font-orbitron text-[9px] font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <span>✕</span>
              <span className="hidden sm:inline">RETURN TO 3D GLOBE</span>
            </button>
          </div>
        </div>

        {/* ── Leaflet Interactive Map Viewport ── */}
        <div className="relative flex-1 w-full h-full bg-slate-950 overflow-hidden">
          <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 1 }} />

          {/* Tactical Crosshair Overlay */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyber-cyan/60" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyber-cyan/60" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyber-cyan/60" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyber-cyan/60" />

            {/* Target Reticle Crosshair */}
            <div className="w-24 h-24 border border-cyber-cyan/30 rounded-full flex items-center justify-center animate-pulse-slow">
              <div className="w-1.5 h-1.5 bg-cyber-green rounded-full" />
            </div>
          </div>

          {/* Floating Zoom & Controls (Right side) */}
          <div className="absolute right-4 top-4 z-20 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={handleZoomIn}
              className="w-8 h-8 bg-black/85 hover:bg-cyber-cyan hover:text-black text-white border border-cyber-cyan/60 rounded-xs font-mono font-bold text-base flex items-center justify-center transition-colors shadow-lg cursor-pointer"
              title="Zoom In"
            >
              +
            </button>
            <button
              type="button"
              onClick={handleZoomOut}
              className="w-8 h-8 bg-black/85 hover:bg-cyber-cyan hover:text-black text-white border border-cyber-cyan/60 rounded-xs font-mono font-bold text-base flex items-center justify-center transition-colors shadow-lg cursor-pointer"
              title="Zoom Out"
            >
              -
            </button>
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="absolute bottom-3 left-4 right-4 z-20 bg-black/85 border border-cyber-border backdrop-blur-md px-3 py-1.5 rounded-xs flex flex-wrap items-center justify-between text-[8px] font-mono text-slate-300 shadow-xl">
            <div className="flex items-center gap-3">
              <span className="text-cyber-green font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-ping" />
                OPTICAL MAGNIFICATION: {currentZoom}x
              </span>
              <span className="hidden sm:inline text-slate-400">
                LAT: {data.lat.toFixed(6)}°N &nbsp;|&nbsp; LON: {data.lon.toFixed(6)}°E
              </span>
              {data.accuracyMeters && (
                <span className="hidden md:inline text-amber-300">
                  ACCURACY: &plusmn;{Math.round(data.accuracyMeters)}m
                </span>
              )}
            </div>

            <div className="text-slate-400">
              HIGH-RESOLUTION SATELLITE IMAGERY &copy; ESRI / MAXAR
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
