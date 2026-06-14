import React, { useState } from 'react';
import { motion } from 'motion/react';

export default function HelloSticker() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative inline-block w-full max-w-[240px] sm:max-w-[270px] mb-6 mt-2 select-none">
      {/* Decorative physical drop shadow behind the sticker */}
      <div
        className="absolute inset-[3px] bg-black/10 blur-[4px] rounded-xl transform rotate-[-2.5deg] pointer-events-none transition-opacity duration-300"
        style={{
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 90%, 90% 100%, 0% 100%)',
          opacity: isHovered ? 0.85 : 0.25,
        }}
      />

      {/* Main motion wrapper — drag + hover on this */}
      <motion.div
        drag
        dragConstraints={{ left: -12, right: 12, top: -12, bottom: 12 }}
        dragElastic={0.15}
        dragMomentum={false}
        initial={{ opacity: 0, y: 55, scale: 0.92, rotate: -4.5 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotate: -2 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{
          y: -6,
          rotate: -0.5,
          scale: 1.035,
          boxShadow: 'rgba(24, 24, 21, 0.12) 0px 12px 28px, rgba(24, 24, 21, 0.06) 0px 4px 12px, inset rgba(255, 255, 255, 0.5) 0px 1px 0px 0px, inset rgba(0,0,0,0.06) 0px -3px 0px 0px'
        }}
        whileTap={{ rotate: 1, scale: 0.985 }}
        transition={{
          type: 'spring',
          stiffness: 220,
          damping: 18
        }}
        className="relative w-full aspect-[16/10] select-none cursor-grab active:cursor-grabbing"
      >
        {/* Cute faiz sticker — stuck on the label, peeks out top-left */}
        <motion.img
          src="/images/sticker_faiz_1.png"
          alt=""
          className="absolute top-[24px] left-[-24px] w-[104px] h-auto pointer-events-none z-30 select-none"
          style={{ rotate: -6 }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.7, type: 'spring', stiffness: 250, damping: 16 }}
        />

        {/* Inner card body — rounded, clipped, styled */}
        <div
          className="w-full h-full rounded-xl overflow-hidden bg-[#FCFBF8] border-[1.2px] border-primary/10 flex flex-col items-stretch"
          style={{
            boxShadow: '0 2px 8px rgba(24, 24, 21, 0.04), 0 1px 3px rgba(24, 24, 21, 0.02), inset rgba(255, 255, 255, 0.45) 0px 1.2px 0px 0px, inset rgba(0,0,0,0.05) 0px -2.8px 0px 0px',
          }}
        >
          {/* Matte Paper Overlay & Noise Pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.045] mix-blend-multiply"
            style={{
              backgroundImage: `radial-gradient(rgba(24, 24, 21, 1) 1px, transparent 1px)`,
              backgroundSize: '14px 14px',
            }}
          />

          {/* Vintage Paper Crease lines */}
          <div className="absolute top-0 bottom-0 left-[8%] w-[1px] bg-black/[0.02] pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-[12%] w-[1px] bg-black/[0.015] pointer-events-none" />

          {/* Classic Red Header Bar */}
          <div className="bg-[#E22E2E] text-white flex flex-col items-center justify-center pt-3 pb-2.5 px-3 relative z-10 border-b-[0.5px] border-red-700/10">
            {/* Subtle glossy sheen reflection line on the red part */}
            <div className="absolute inset-x-0 top-0 h-[1.2px] bg-white/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/[0.03] via-transparent to-black/[0.03]" />

            <h2 className="text-[19px] sm:text-[22px] font-extrabold tracking-[0.14em] leading-none uppercase select-none font-sans drop-shadow-[0_1px_0.5px_rgba(0,0,0,0.18)]">
              HELLO
            </h2>
            <p className="text-[11px] sm:text-[10.5px] font-mono tracking-[0.18em] uppercase text-white/95 mt-1 font-semibold select-none">
              my name is
            </p>
          </div>

          {/* Name Whiteboard Field */}
          <div className="relative flex-1 flex flex-col items-center justify-center px-3 py-1 bg-[#FAF8F5] overflow-hidden select-none">
            {/* Slight smudge of blue ink on the tag for visual authenticity */}
            <div className="absolute bottom-1 right-4 w-6 h-1 bg-[#1C3BD6]/[0.015] blur-sm rounded-full transform -rotate-12 pointer-events-none" />
            {/* Internal shadow block representing sticker inset layer */}
            <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-black/[0.035] to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/[0.015] to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-2.5 bg-gradient-to-l from-black/[0.015] to-transparent pointer-events-none" />

            {/* Core Handwritten Name */}
            <motion.div
              initial={{ scale: 0.82, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: -2.5 }}
              transition={{ delay: 0.35, type: 'spring', stiffness: 140 }}
              className="flex flex-col items-center select-none mt-[-5px]"
            >
              {/* Ink bleed shadows */}
              <span
                className="font-marker text-[42px] sm:text-[48px] text-[#1C3BD6] tracking-wide leading-none select-none relative"
                style={{
                  filter: 'drop-shadow(0.5px 1.2px 1px rgba(28, 59, 214, 0.22)) drop-shadow(0px 1px 0px rgba(0, 0, 0, 0.08))',
                }}
              >
                Faiz
              </span>

              {/* Redrawn physical felt tip marker underline stroke */}
              <svg
                viewBox="0 0 160 12"
                className="w-[115px] sm:w-[130px] h-auto text-[#1C3BD6] mt-[-3px] select-none pointer-events-none opacity-95"
                fill="currentColor"
              >
                <path d="M4 8 Q45 2 92 6 T156 7 C140 10 95 10 4 8 Z" />
              </svg>
            </motion.div>
          </div>

          {/* Die-cut physical edge sheen glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.05] to-white/[0.08] pointer-events-none z-20" />
        </div>
      </motion.div>
    </div>
  );
}
