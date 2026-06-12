import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

interface PortraitRevealProps {
  baseSrc: string;
  revealSrc: string;
  alt: string;
  className?: string;
  aspectRatioClass?: string;
}

export default function PortraitReveal({
  baseSrc,
  revealSrc,
  alt,
  className = "",
  aspectRatioClass = "aspect-[4/5]"
}: PortraitRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [current, setCurrent] = useState({ x: 0, y: 0 });
  const idRef = useRef(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrent({ x, y });
    setTrail((prev) => {
      const next = [...prev, { x, y, id: ++idRef.current }];
      if (next.length > 12) next.shift();
      return next;
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Touch support
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      setCurrent({ x, y });
      setTrail((prev) => {
        const next = [...prev, { x, y, id: ++idRef.current }];
        if (next.length > 12) next.shift();
        return next;
      });
      setIsHovered(true);
    } else {
      setIsHovered(false);
    }
  };

  // Reduce trail on mouse leave
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setTrail((prev) => (prev.length > 0 ? prev.slice(1) : prev));
    }, 35);

    return () => clearInterval(interval);
  }, [isHovered]);

  const circleRadius = 55;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => {
        setIsHovered(false);
      }}
      className={`relative w-full ${aspectRatioClass} rounded-xl overflow-hidden bg-surface/25 border border-surface/50 select-none cursor-crosshair group ${className}`}
    >
      {/* Decorative Blueprint Background Grid underneath everything */}
      <div className="absolute inset-0 bg-grid-fine opacity-[0.14] pointer-events-none z-0" />

      {/* Layer 1: Base Image (Slight grayscale/contrasty vintage view) */}
      <img
        src={baseSrc}
        alt={alt}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-top filter contrast-[1.02] grayscale-[15%] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />

      {/* Subtle paper vignette layer */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 pointer-events-none mix-blend-overlay" />

      {/* Layer 2: Trail-Revealed Schematic Blueprint Images */}
      <AnimatePresence>
        {trail.map((point, index) => {
          // Older points are smaller and more transparent
          const age = trail.length - 1 - index;
          const opacity = Math.max(0, 1 - age * 0.08);
          const radius = circleRadius - age * 0.5;

          if (radius <= 0 || opacity <= 0) return null;

          return (
            <div
              key={point.id}
              className="absolute inset-0 pointer-events-none select-none z-10"
              style={{
                clipPath: `circle(${radius}px at ${point.x}px ${point.y}px)`,
                WebkitClipPath: `circle(${radius}px at ${point.x}px ${point.y}px)`,
                opacity,
                transition: 'opacity 0.15s ease-out',
              }}
            >
              <img
                src={revealSrc}
                alt={`${alt} schematic reveal trail`}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-grid-fine opacity-[0.35] bg-cyan-500/10 mix-blend-screen pointer-events-none" />
            </div>
          );
        })}
      </AnimatePresence>

    </div>
  );
}
