import { useState, useEffect, useCallback } from 'react';

interface UseScrollSpyOptions {
  /**
   * Check position offset from the top of the viewport (after header).
   * 0 = right at the bottom of the header, positive = lower in viewport.
   * Default 0 checks exactly at the header bottom.
   */
  offset?: number;
  /** Minimum scrollY before activating any section (pixels) */
  threshold?: number;
  /** Header height in pixels to account for sticky header */
  headerOffset?: number;
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
  const { offset = 0, threshold = 180, headerOffset = 56 } = options;
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

      // Check position is at the bottom of the header + optional offset
      // This detects when a section reaches the top of the visible viewport
      const checkPos = scrollY + headerOffset + offset;

      for (const sectionId of sectionIds) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (checkPos >= top && checkPos < top + height) {
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
  }, [sectionIds, offset, threshold, headerOffset]);

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
