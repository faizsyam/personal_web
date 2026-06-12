import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Sets up GSAP ScrollTrigger-driven entrance animations.
 * Targets existing markup patterns to minimize class pollution.
 */
export function useGsapScroll(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    // ─── Section headings ──────────────────────
    // Target the first motion.div inside each major section heading area
    const sectionHeadings = document.querySelectorAll('section > div:first-of-type');
    sectionHeadings.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 24, filter: 'blur(3px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // ─── Cards (project + writing) ─────────────
    // Target card grid containers — their children get staggered entry
    const cardGrids = document.querySelectorAll('.grid.grid-cols-1.lg\\:grid-cols-2');
    cardGrids.forEach((grid) => {
      gsap.fromTo(
        grid.children,
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: grid,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // ─── Timeline items ────────────────────────
    const timelineContainers = document.querySelectorAll('.relative.flex.flex-col.gap-5.pl-6');
    timelineContainers.forEach((container) => {
      const items = container.querySelectorAll('[id^="timeline-item-"]');
      gsap.fromTo(
        items,
        { opacity: 0, x: -18 },
        {
          opacity: 1,
          x: 0,
          duration: 0.55,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // ─── Contact cards ─────────────────────────
    const contactGrid = document.querySelector('#contact .grid.grid-cols-1');
    if (contactGrid) {
      gsap.fromTo(
        contactGrid.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.06,
          scrollTrigger: {
            trigger: contactGrid,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // ─── Refresh on next frame ─────────────────
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [enabled]);
}
