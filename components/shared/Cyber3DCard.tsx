'use client';

import { useRef, useState, ReactNode, MouseEvent } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  glareOpacity?: number;
}

export default function Cyber3DCard({
  children,
  className = '',
  maxTilt = 12,
  glareOpacity = 0.15,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransform(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: glareOpacity,
    });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transform || 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
        transition: 'transform 0.18s cubic-bezier(0.2, 0, 0.2, 1)',
        transformStyle: 'preserve-3d',
      }}
      className={`relative glass-panel rounded-sm overflow-hidden ${className}`}
    >
      {/* Dynamic Specular Holographic Glare */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-30"
        style={{
          background: `radial-gradient(circle 350px at ${glarePos.x}% ${glarePos.y}%, rgba(0, 245, 255, ${glarePos.opacity}), transparent 70%)`,
        }}
      />

      {/* Cyber Corner Brackets */}
      <div className="pointer-events-none absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 border-cyber-cyan z-20 opacity-80" />
      <div className="pointer-events-none absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 border-cyber-cyan z-20 opacity-80" />
      <div className="pointer-events-none absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 border-cyber-cyan z-20 opacity-80" />
      <div className="pointer-events-none absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 border-cyber-cyan z-20 opacity-80" />

      {/* Inner Content with 3D Depth */}
      <div style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </div>
  );
}
