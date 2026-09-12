import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [hoverType, setHoverType] = useState<'link' | 'detail' | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Direct position refs - no motion values
  const cursorX = useRef(-100);
  const cursorY = useRef(-100);
  const ringX = useRef(-100);
  const ringY = useRef(-100);
  const dotX = useRef(-100);
  const dotY = useRef(-100);

  // DOM refs for direct style manipulation
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const viewTextRef = useRef<HTMLSpanElement>(null);

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
      cursorX.current = e.clientX;
      cursorY.current = e.clientY;
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

    // Single rAF loop for all cursor movement - replaces 4 spring simulations
    let animationId: number;
    let prevHoverType: 'link' | 'detail' | null = null;
    let prevIsHovered = false;

    const animate = () => {
      // Smooth lerp for ring (outer) - slower, more lag
      ringX.current += (cursorX.current - ringX.current) * 0.18;
      ringY.current += (cursorY.current - ringY.current) * 0.18;

      // Smooth lerp for dot (inner) - faster, snappier
      dotX.current += (cursorX.current - dotX.current) * 0.35;
      dotY.current += (cursorY.current - dotY.current) * 0.35;

      // Apply transforms directly to DOM - no React state updates
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX.current - ringRef.current.offsetWidth / 2}px, ${ringY.current - ringRef.current.offsetHeight / 2}px)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX.current - 3}px, ${dotY.current - 3}px)`;
      }

      // Handle hover type changes with CSS transitions
      const isHovered = hoverType !== null;
      if (hoverType !== prevHoverType || isHovered !== prevIsHovered) {
        if (ringRef.current) {
          const ringSize = hoverType === 'detail' ? 48 : hoverType === 'link' ? 32 : 18;
          const ringColor = hoverType === 'detail' ? '#2B4C7E' : hoverType === 'link' ? '#6A6A62' : 'rgba(24, 24, 21, 0.4)';
          const ringBg = hoverType === 'detail' ? 'rgba(43, 76, 126, 0.08)' : hoverType === 'link' ? 'rgba(106, 106, 98, 0.06)' : 'transparent';

          ringRef.current.style.width = `${ringSize}px`;
          ringRef.current.style.height = `${ringSize}px`;
          ringRef.current.style.borderColor = ringColor;
          ringRef.current.style.backgroundColor = ringBg;
          ringRef.current.style.transition = 'width 0.15s ease, height 0.15s ease, border-color 0.15s ease, background-color 0.15s ease, transform 0s';
          ringRef.current.style.transformOrigin = 'center center';
          ringRef.current.style.transform = `translate(${ringX.current - ringSize / 2}px, ${ringY.current - ringSize / 2}px) scale(${isHovered ? 1.05 : 1})`;
        }

        if (dotRef.current) {
          const dotColor = hoverType === 'detail' ? '#2B4C7E' : hoverType === 'link' ? '#181815' : '#181815';
          dotRef.current.style.backgroundColor = dotColor;
          dotRef.current.style.transition = 'background-color 0.15s ease, opacity 0.12s ease, transform 0.12s ease';
          if (hoverType === 'detail') {
            dotRef.current.style.opacity = '0';
            dotRef.current.style.transform = `translate(${dotX.current - 3}px, ${dotY.current - 3}px) scale(0)`;
          } else {
            dotRef.current.style.opacity = '1';
            dotRef.current.style.transform = `translate(${dotX.current - 3}px, ${dotY.current - 3}px) scale(1)`;
          }
        }

        if (viewTextRef.current) {
          viewTextRef.current.style.transition = 'opacity 0.15s ease, transform 0.15s ease';
          if (hoverType === 'detail') {
            viewTextRef.current.style.opacity = '1';
            viewTextRef.current.style.transform = 'scale(1)';
          } else {
            viewTextRef.current.style.opacity = '0';
            viewTextRef.current.style.transform = 'scale(0.8)';
          }
        }

        prevHoverType = hoverType;
        prevIsHovered = isHovered;
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      document.documentElement.classList.remove('custom-cursor-active');
      motionQuery.removeEventListener('change', handleMotionChange);
      cancelAnimationFrame(animationId);
    };
  }, [cursorX, cursorY, isVisible, isTouchDevice, prefersReducedMotion, hoverType]);

  // Respect prefers-reduced-motion: skip custom cursor entirely
  if (isTouchDevice || prefersReducedMotion || !isVisible) {
    return null;
  }

  const isHovered = hoverType !== null;
  const ringSize = hoverType === 'detail' ? 48 : hoverType === 'link' ? 32 : 18;
  const ringColor = hoverType === 'detail' ? '#2B4C7E' : hoverType === 'link' ? '#6A6A62' : 'rgba(24, 24, 21, 0.4)';
  const ringBg = hoverType === 'detail' ? 'rgba(43, 76, 126, 0.08)' : hoverType === 'link' ? 'rgba(106, 106, 98, 0.06)' : 'transparent';
  const dotColor = hoverType === 'detail' ? '#2B4C7E' : hoverType === 'link' ? '#181815' : '#181815';

  return (
    <>
      {/* Outer follow-ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 border rounded-full pointer-events-none z-[9999] flex items-center justify-center overflow-hidden transition-transform duration-0"
        style={{
          width: ringSize,
          height: ringSize,
          borderColor: ringColor,
          backgroundColor: ringBg,
          transform: `translate(${ringX.current - ringSize / 2}px, ${ringY.current - ringSize / 2}px) scale(${isHovered ? 1.05 : 1})`,
          willChange: 'transform, width, height, border-color, background-color',
        }}
      >
        {hoverType === 'detail' && (
          <span
            ref={viewTextRef}
            className="text-[8px] font-mono font-bold text-accent tracking-widest uppercase select-none pointer-events-none"
            style={{
              opacity: 1,
              transform: 'scale(1)',
              transition: 'opacity 0.15s ease, transform 0.15s ease',
            }}
          >
            VIEW
          </span>
        )}
      </div>

      {/* Center tiny dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] transition-all duration-100"
        style={{
          width: 6,
          height: 6,
          backgroundColor: dotColor,
          transform: `translate(${dotX.current - 3}px, ${dotY.current - 3}px) ${hoverType === 'detail' ? 'scale(0)' : 'scale(1)'}`,
          opacity: hoverType === 'detail' ? 0 : 1,
          willChange: 'transform, opacity, background-color',
        }}
      />
    </>
  );
}
