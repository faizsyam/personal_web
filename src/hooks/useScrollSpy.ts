import { useState, useEffect, useCallback } from 'react';

interface UseScrollSpyOptions {
  /**
   * Minimum scrollY before activating any section (pixels).
   * Below this value the hook returns 'home'.
   */
  threshold?: number;
  /** Header height in pixels to account for sticky header */
  headerOffset?: number;
}

/**
 * Hook to track which section is currently in view for scroll spy navigation.
 * Uses IntersectionObserver so it works reliably regardless of section height
 * or gaps between sections.
 *
 * @param sectionIds - Array of section element IDs to track, in document order
 * @param options - Configuration options
 * @returns The ID of the currently active section, or 'home' if at top
 */
export function useScrollSpy(
  sectionIds: string[],
  options: UseScrollSpyOptions = {}
): string {
  const { threshold = 180, headerOffset = 56 } = options;
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    // Intersection ratios keyed by section id
    const ratios: Record<string, number> = {};

    // Margin string: clip the top by headerOffset so the "entry" point is
    // below the sticky header, and use a generous bottom margin so sections
    // near the viewport bottom still register.
    const rootMargin = `-${headerOffset}px 0px -20% 0px`;

    const observer = new IntersectionObserver(
      (entries) => {
        // Skip when user is near the very top of the page
        if (window.scrollY < threshold) {
          setActiveSection('home');
          return;
        }

        entries.forEach((entry) => {
          ratios[entry.target.id] = entry.intersectionRatio;
        });

        // Pick the section with the highest intersection ratio
        let bestId = '';
        let bestRatio = 0;
        for (const id of sectionIds) {
          const r = ratios[id] ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            bestId = id;
          }
        }

        if (bestId) {
          setActiveSection(bestId);
        }
      },
      {
        rootMargin,
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      }
    );

    // Also watch scrollY to snap back to 'home' when near the top
    const handleScroll = () => {
      if (window.scrollY < threshold) {
        setActiveSection('home');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionIds, threshold, headerOffset]);

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
