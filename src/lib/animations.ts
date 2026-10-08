/**
 * Shared animation configurations for consistent, premium motion
 * across the portfolio. Designed for snappy, tactile, GPU-safe interaction.
 */

import { Variants } from 'motion/react';

// ─── Easing curves ──────────────────────────────────

/** Primary entrance ease — smooth deceleration with elegant landing */
export const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Snappy hover ease — quick response, settles fast */
export const easeSnappy: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Bouncy spring — playful but controlled */
export const easeBounce: [number, number, number, number] = [0.34, 1.56, 0.64, 1];

// ─── Spring configs ─────────────────────────────────

/** Smooth hover — snappy lift, sub-100ms response */
export const springHover = {
  type: 'spring' as const,
  stiffness: 500,
  damping: 35,
  mass: 0.6,
};

/** Snappy hover — instant feel, crisp settle */
export const springSnappy = {
  type: 'spring' as const,
  stiffness: 600,
  damping: 38,
  mass: 0.5,
};

/** Tactile press — crisp, physical feel on tap */
export const springTap = {
  type: 'spring' as const,
  stiffness: 700,
  damping: 42,
  mass: 0.5,
};

/** Scroll reveal — slightly snappier entrance */
export const springReveal = {
  type: 'spring' as const,
  stiffness: 280,
  damping: 28,
  mass: 0.8,
};

/** Staggered list — for cascading item reveals */
export const springStagger = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 24,
  mass: 0.8,
};

// ─── Transition presets ──────────────────────────────

export const hoverTransition = {
  ...springHover,
};

export const tapTransition = {
  ...springTap,
};

// ─── Variants ────────────────────────────────────────

/** Timeline item — slides in from left with stagger */
export const timelineVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.65,
      ease: easeOutExpo,
      delay: i * 0.07,
    },
  }),
};

/** Card — fades up with stagger */
export const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: easeOutExpo,
      delay: i * 0.07,
    },
  }),
};

/** Stagger children wrapper */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

/** Fade up item for staggered lists */
export const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOutExpo,
    },
  },
};
