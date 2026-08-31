'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const crossRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cross = crossRef.current;
    const trail = trailRef.current;
    if (!cross || !trail) return;

    let trailX = 0, trailY = 0;
    let mouseX = 0, mouseY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cross.style.left = `${mouseX}px`;
      cross.style.top  = `${mouseY}px`;
    };

    let animId: number;
    const animate = () => {
      trailX += (mouseX - trailX) * 0.12;
      trailY += (mouseY - trailY) * 0.12;
      trail.style.left = `${trailX}px`;
      trail.style.top  = `${trailY}px`;
      animId = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMove);
    animId = requestAnimationFrame(animate);
    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <div ref={crossRef} className="cursor-crosshair hidden md:block" />
      <div ref={trailRef} className="cursor-trail hidden md:block" />
    </>
  );
}
