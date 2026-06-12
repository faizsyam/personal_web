import { useState, useEffect, useCallback } from 'react';

interface UseScrollSpyOptions {
  /** Offset in pixels to adjust the active section calculation */
  offset?: number;
  /** Threshold before switching to a section (as fraction of viewport height) */
  threshold?: number;
}

/**
 * Hook to track which section is currently in view for scroll spy navigation.
 *
 * @param sectionIds - Array of section element IDs to track
 * @param options - Configuration options
 * @returns The ID of the currently active section, or 'home' if at top
 */
export function useScrollSpy(
  sectionIds: string[],
  options: UseScrollSpyOptions = {}
): string {
  const { offset = 0.4, threshold = 180 } = options;
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    let rafId: number;
    let lastScrollY = -1;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY === lastScrollY) return;
      lastScrollY = scrollY;

      if (scrollY < threshold) {
        setActiveSection('home');
        return;
      }

      const scrollPos = scrollY + window.innerHeight * offset;
      for (const sectionId of sectionIds) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    const debouncedScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', debouncedScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', debouncedScroll);
      cancelAnimationFrame(rafId);
    };
  }, [sectionIds, offset, threshold]);

  return activeSection;
}

/**
 * Hook to provide a smooth scrollTo function.
 * Accounts for a sticky header offset.
 */
export function useScrollTo(headerOffset = 56): (id: string) => void {
  return useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    },
    [headerOffset]
  );
}
