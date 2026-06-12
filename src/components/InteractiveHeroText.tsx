import React, { useState } from 'react';
import { motion } from 'motion/react';

interface InteractiveTitleProps {
  text: string;
  className?: string;
  isSecondary?: boolean;
}

// Parent container variant for staggering the initial entry sequence
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.035, // sleek rapid stagger
      delayChildren: 0.1,
    },
  },
};

// Initial entry transition for each individual letter
const letterVariants = {
  hidden: { 
    opacity: 0, 
    y: 12,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 280,
      damping: 24,
      mass: 0.8,
    }
  }
};

/**
 * InteractiveTitle maps single characters to individual motion elements.
 * Hovering a character triggers a sensory, premium tactical wave ripple
 * (subtle height lift + cohesive weight/color emphasis + subtle glowing shadow) 
 * with professional stiffness and heavy damping, avoiding goofy visual noise.
 */
export function InteractiveTitle({ text, className = '', isSecondary = false }: InteractiveTitleProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  
  // Split into letters, preserving whitespace spaces
  const letters = Array.from(text);

  return (
    <motion.span 
      className={`inline-block select-all ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {letters.map((char, i) => {
        if (char === ' ') {
          return <span key={i}>&nbsp;</span>;
        }

        // Calculate dynamic properties based on neighbor distance to hover target
        let colorTarget: string | undefined = undefined;
        let displacementY = 0;
        let scale = 1;

        if (hoveredIdx !== null) {
          const distance = Math.abs(hoveredIdx - i);
          
          if (distance === 0) {
            colorTarget = 'var(--color-highlight)';
            displacementY = -4; // Sleek vertical raise
            scale = 1.08;       // Beautiful gentle magnification
          } else if (distance === 1) {
            colorTarget = 'var(--color-accent)';
            displacementY = -1.8; // Gradual neighborhood falloff
            scale = 1.03;
          } else if (distance === 2) {
            colorTarget = isSecondary ? 'var(--color-secondary)' : 'var(--color-accent)';
            displacementY = -0.5;
            scale = 1.01;
          }
        }

        // If hoveredIdx is active, we animate dynamically to hovered states.
        // Otherwise, it relaxes back to the initial state gracefully.
        const currentAnimation = hoveredIdx !== null 
          ? {
              color: colorTarget || (isSecondary ? 'var(--color-secondary)' : 'var(--color-primary)'),
              y: displacementY,
              scale: scale,
            }
          : {
              color: isSecondary ? 'var(--color-secondary)' : 'var(--color-primary)',
              y: 0,
              scale: 1,
            };

        return (
          <motion.span
            key={i}
            variants={letterVariants}
            className="inline-block origin-bottom cursor-pointer select-none sm:select-text"
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            animate={currentAnimation}
            transition={{
              type: 'spring',
              stiffness: 400, // snappy, playful response
              damping: 22,   // quick settling motion to avoid overly repetitive bounce
            }}
          >
            {char}
          </motion.span>
        );
      })}
    </motion.span>
  );
}

interface InteractivePhraseProps {
  children: React.ReactNode;
}

/**
 * Highlight and bounce specific key industry terms in subtitles.
 * Moves up slightly, flashes a custom colored layout accent backplane,
 * and rolls an elastic tracking underline from centerwards.
 */
export function InteractivePhrase({ children }: InteractivePhraseProps) {
  return (
    <motion.span
      className="inline-block relative cursor-pointer px-[5px] mx-[-2px] rounded-lg text-primary font-medium transition-colors duration-300"
      whileHover="hover"
      initial="initial"
      animate="animate"
    >
      {/* Elastic organic border card backdrop */}
      <motion.span
        className="absolute inset-[1px] bg-highlight/[0.04] dark:bg-highlight/[0.06] border border-highlight/15 rounded-md -z-10 pointer-events-none"
        variants={{
          initial: { opacity: 0, scale: 0.94, y: 1 },
          hover: { opacity: 1, scale: 1.05, y: -2 }
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 15 }}
      />
      
      {/* Subtle letter spacing and slide motion on content */}
      <motion.span
        className="inline-block"
        variants={{
          initial: { y: 0 },
          hover: { y: -2 }
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 14 }}
      >
        {children}
      </motion.span>

      {/* Spring expanding slide-underline */}
      <motion.span
        className="absolute bottom-[3px] left-[5px] right-[5px] h-[1.8px] bg-highlight rounded-full origin-center scale-x-0"
        variants={{
          initial: { scaleX: 0 },
          hover: { scaleX: 1 }
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 18 }}
      />
    </motion.span>
  );
}

interface InteractiveSubtitleProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Unified interactive wrapper for the hero subtitle block.
 * Responds cohesively as a single entity without distracting keyword highlights.
 */
export function InteractiveSubtitle({ children, className = '' }: InteractiveSubtitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
      whileHover="hover"
      className={`relative cursor-pointer select-none sm:select-text ${className}`}
    >
      {/* High-end subtle ambient highlights */}
      <motion.div
        className="absolute -inset-x-4 -inset-y-3 bg-highlight/[0.02] border border-highlight/5 rounded-2xl -z-10 pointer-events-none"
        variants={{
          initial: { opacity: 0, scale: 0.98 },
          hover: { opacity: 1, scale: 1 }
        }}
        initial="initial"
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      />
      <motion.div
        variants={{
          initial: { y: 0, color: 'var(--color-secondary)' },
          hover: { y: -1.5, color: 'var(--color-primary)' }
        }}
        initial="initial"
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
