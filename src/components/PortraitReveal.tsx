import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

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
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Add responsive touch-drag support for mobile devices
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    setCoords({ x, y });
    setIsHovered(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    // Smoothly track touch within container boundaries
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      setCoords({ x, y });
      setIsHovered(true);
    } else {
      setIsHovered(false);
    }
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
  };

  const circleRadius = 55; // 110px diameter

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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

      {/* Layer 2: Mask-Revealed Schematic Blueprint Image */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-10"
        style={{
          clipPath: isHovered 
            ? `circle(${circleRadius}px at ${coords.x}px ${coords.y}px)` 
            : `circle(0px at ${coords.x}px ${coords.y}px)`,
          WebkitClipPath: isHovered 
            ? `circle(${circleRadius}px at ${coords.x}px ${coords.y}px)` 
            : `circle(0px at ${coords.x}px ${coords.y}px)`,
          transition: isHovered ? 'none' : 'clip-path 0.35s cubic-bezier(0.16, 1, 0.3, 1), -webkit-clip-path 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <img
          src={revealSrc}
          alt={`${alt} schematic reveal`}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        
        {/* Soft cyan electronic scanning grid layer on top of reveal */}
        <div className="absolute inset-0 bg-grid-fine opacity-[0.35] bg-cyan-500/10 mix-blend-screen pointer-events-none" />
      </div>

      {/* Layer 3: Interactive Lens Glowing Ring tracking cursor */}
      <div
        className="absolute pointer-events-none rounded-full border border-cyan-400/40 shadow-[0_0_15px_rgba(34,211,238,0.3)] mix-blend-screen z-20"
        style={{
          width: `${circleRadius * 2}px`,
          height: `${circleRadius * 2}px`,
          left: `${coords.x}px`,
          top: `${coords.y}px`,
          transform: 'translate(-50%, -50%)',
          opacity: isHovered ? 1 : 0,
          transition: isHovered 
            ? 'opacity 0.25s ease' 
            : 'opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      />
    </div>
  );
}
