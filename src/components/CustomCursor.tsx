import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  // All cursor state as refs — zero React re-renders during mouse movement
  const hoverTypeRef = useRef<'link' | 'detail' | null>(null);
  const isVisibleRef = useRef(false);

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
    // Detect touch device — no state, just a local variable
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReduced = motionQuery.matches;

    if (isTouch || prefersReduced) return;

    // Apply custom cursor active to html tag to trigger CSS cursor hide
    document.documentElement.classList.add('custom-cursor-active');

    const moveCursor = (e: MouseEvent) => {
      cursorX.current = e.clientX;
      cursorY.current = e.clientY;
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        if (ringRef.current) ringRef.current.style.opacity = '1';
        if (dotRef.current) dotRef.current.style.opacity = '1';
      }
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
        hoverTypeRef.current = 'detail';
      } else if (isInteractive) {
        hoverTypeRef.current = 'link';
      } else {
        hoverTypeRef.current = null;
      }
    };

    const handleMouseLeaveWindow = () => {
      isVisibleRef.current = false;
      if (ringRef.current) ringRef.current.style.opacity = '0';
      if (dotRef.current) dotRef.current.style.opacity = '0';
    };

    const handleMouseEnterWindow = () => {
      isVisibleRef.current = true;
      if (ringRef.current) ringRef.current.style.opacity = '1';
      if (dotRef.current) dotRef.current.style.opacity = '1';
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);

    // Single rAF loop for all cursor movement
    let animationId: number;
    let prevHoverType: 'link' | 'detail' | null = null;

    const animate = () => {
      const hoverType = hoverTypeRef.current;

      // Smooth lerp for ring (outer) - slower, more lag
      ringX.current += (cursorX.current - ringX.current) * 0.18;
      ringY.current += (cursorY.current - ringY.current) * 0.18;

      // Smooth lerp for dot (inner) - faster, snappier
      dotX.current += (cursorX.current - dotX.current) * 0.35;
      dotY.current += (cursorY.current - dotY.current) * 0.35;

      // Apply transforms directly to DOM - no React state updates
      if (ringRef.current) {
        const ringSize = hoverType === 'detail' ? 48 : hoverType === 'link' ? 32 : 18;
        ringRef.current.style.transform = `translate(${ringX.current - ringSize / 2}px, ${ringY.current - ringSize / 2}px)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX.current - 3}px, ${dotY.current - 3}px)`;
      }

      // Handle hover type changes with CSS transitions — only when type actually changed
      if (hoverType !== prevHoverType) {
        const ringSize = hoverType === 'detail' ? 48 : hoverType === 'link' ? 32 : 18;
        const ringColor = hoverType === 'detail' ? '#2B4C7E' : hoverType === 'link' ? '#6A6A62' : 'rgba(24, 24, 21, 0.4)';
        const ringBg = hoverType === 'detail' ? 'rgba(43, 76, 126, 0.08)' : hoverType === 'link' ? 'rgba(106, 106, 98, 0.06)' : 'transparent';

        if (ringRef.current) {
          ringRef.current.style.width = `${ringSize}px`;
          ringRef.current.style.height = `${ringSize}px`;
          ringRef.current.style.borderColor = ringColor;
          ringRef.current.style.backgroundColor = ringBg;
          ringRef.current.style.transition = 'width 0.15s ease, height 0.15s ease, border-color 0.15s ease, background-color 0.15s ease, opacity 0.15s ease';
        }

        if (dotRef.current) {
          const dotColor = hoverType === 'detail' ? '#2B4C7E' : '#181815';
          dotRef.current.style.backgroundColor = dotColor;
          dotRef.current.style.transition = 'background-color 0.15s ease, opacity 0.12s ease, transform 0.12s ease';
          if (hoverType === 'detail') {
            dotRef.current.style.opacity = '0';
            dotRef.current.style.transform = `translate(${dotX.current - 3}px, ${dotY.current - 3}px) scale(0)`;
          } else {
            dotRef.current.style.opacity = isVisibleRef.current ? '1' : '0';
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
      cancelAnimationFrame(animationId);
    };
    // Empty deps: runs once on mount, reads all state via refs
  }, []);

  return (
    <>
      {/* Outer follow-ring — starts hidden, shown via JS */}
      <div
        ref={ringRef}
        data-cursor="ring"
        className="fixed top-0 left-0 border rounded-full pointer-events-none z-[9999] flex items-center justify-center overflow-hidden"
        style={{
          width: 18,
          height: 18,
          borderColor: 'rgba(24, 24, 21, 0.4)',
          backgroundColor: 'transparent',
          opacity: 0,
          willChange: 'transform, width, height, border-color, background-color',
        }}
      >
        <span
          ref={viewTextRef}
          className="text-[8px] font-mono font-bold text-accent tracking-widest uppercase select-none pointer-events-none"
          style={{
            opacity: 0,
            transform: 'scale(0.8)',
          }}
        >
          VIEW
        </span>
      </div>

      {/* Center tiny dot */}
      <div
        ref={dotRef}
        data-cursor="dot"
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
        style={{
          width: 6,
          height: 6,
          backgroundColor: '#181815',
          opacity: 0,
          willChange: 'transform, opacity, background-color',
        }}
      />
    </>
  );
}
