import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export default function CustomCursor() {
  const [hoverType, setHoverType] = useState<'link' | 'detail' | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Position coordinates of primary cursor pointer
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Springs for smooth movement
  // Inner dot: very fast response
  const dotSpringX = useSpring(cursorX, { stiffness: 900, damping: 45 });
  const dotSpringY = useSpring(cursorY, { stiffness: 900, damping: 45 });

  // Outer ring: fast response with subtle lag
  const ringSpringX = useSpring(cursorX, { stiffness: 480, damping: 34 });
  const ringSpringY = useSpring(cursorY, { stiffness: 480, damping: 34 });

  useEffect(() => {
    // Detect touch dev
    const checkTouch = () => {
      const match = window.matchMedia('(pointer: coarse)');
      setIsTouchDevice(match.matches || 'ontouchstart' in window);
    };
    checkTouch();

    // Respect prefers-reduced-motion for accessibility
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener('change', handleMotionChange);

    if (isTouchDevice || motionQuery.matches) {
      return () => {
        motionQuery.removeEventListener('change', handleMotionChange);
      };
    }

    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Identify detail elements (cards, writings, list items)
      const isDetailItem = target.closest(
        '[id^="project-card-"], [id^="writing-item-"], [id^="timeline-item-"], #sandbox-simulator button, [id^="nav-link-"]'
      );

      // Identify standard interactive items
      const isInteractive = target.closest(
        'a, button, [role="button"], input, textarea, .interactive-item, select, details, summary'
      );

      if (isDetailItem) {
        setHoverType('detail');
      } else if (isInteractive) {
        setHoverType('link');
      } else {
        setHoverType(null);
      }
    };

    const handleMouseLeaveWindow = () => {
      setIsVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    // Apply custom cursor active to html tag to trigger CSS cursor hide
    document.documentElement.classList.add('custom-cursor-active');

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      document.documentElement.classList.remove('custom-cursor-active');
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, [cursorX, cursorY, isVisible, isTouchDevice, prefersReducedMotion]);

  // Respect prefers-reduced-motion: skip custom cursor entirely
  if (isTouchDevice || prefersReducedMotion || !isVisible) {
    return null;
  }

  const isHovered = hoverType !== null;

  // Custom design values relative to hover type
  const ringSize = hoverType === 'detail' ? 48 : hoverType === 'link' ? 32 : 18;
  const ringColor = hoverType === 'detail' ? '#2B4C7E' : hoverType === 'link' ? '#6A6A62' : 'rgba(24, 24, 21, 0.4)';
  const ringBg = hoverType === 'detail' ? 'rgba(43, 76, 126, 0.08)' : hoverType === 'link' ? 'rgba(106, 106, 98, 0.06)' : 'transparent';
  const dotColor = hoverType === 'detail' ? '#2B4C7E' : hoverType === 'link' ? '#181815' : '#181815';

  return (
    <>
      {/* Outer follow-ring */}
      <motion.div
        className="fixed top-0 left-0 border rounded-full pointer-events-none z-[9999] flex items-center justify-center overflow-hidden"
        style={{
          x: ringSpringX,
          y: ringSpringY,
          translateX: '-50%',
          translateY: '-50%',
          width: ringSize,
          height: ringSize,
          borderColor: ringColor,
          backgroundColor: ringBg,
        }}
        animate={{
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 450,
          damping: 15,
        }}
      >
        {hoverType === 'detail' && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[8px] font-mono font-bold text-accent tracking-widest uppercase select-none pointer-events-none"
          >
            VIEW
          </motion.span>
        )}
      </motion.div>

      {/* Center tiny dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
        style={{
          x: dotSpringX,
          y: dotSpringY,
          translateX: '-50%',
          translateY: '-50%',
          width: 6,
          height: 6,
          backgroundColor: dotColor,
        }}
        animate={{
          opacity: hoverType === 'detail' ? 0 : 1,
          scale: hoverType === 'detail' ? 0 : 1,
        }}
        transition={{ duration: 0.12 }}
      />
    </>
  );
}
