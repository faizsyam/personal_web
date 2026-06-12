import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingNavProps {
  activeSection: string;
  lang: 'en' | 'id';
}

export default function FloatingNav({ activeSection, lang }: FloatingNavProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show navigation after scrolling 200px (100px on mobile for faster navigation access)
      const threshold = window.innerWidth < 640 ? 100 : 200;
      if (window.scrollY > threshold) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: lang === 'en' ? 'Brief' : 'Profil', id: 'about' },
    { label: lang === 'en' ? 'Work' : 'Karir', id: 'work' },
    { label: lang === 'en' ? 'Projects' : 'Proyek', id: 'projects' },
    { label: lang === 'en' ? 'Writing' : 'Tulisan', id: 'writing' },
    { label: lang === 'en' ? 'Contact' : 'Kontak', id: 'contact' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset slightly to account for the header
      const yOffset = -48;
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ opacity: 0, y: 15, x: '-50%', scale: 0.95 }}
          animate={{ opacity: 1, y: 0, x: '-50%', scale: 1 }}
          exit={{ opacity: 0, y: 10, x: '-50%', scale: 0.95 }}
          transition={{
            type: 'spring',
            stiffness: 450,
            damping: 18,
            mass: 0.8
          }}
          className="fixed bottom-6 sm:bottom-auto sm:top-6 left-1/2 z-50 py-1.5 px-2 rounded-full backdrop-blur-xl bg-bg/20 border border-surface/50 shadow-[0_16px_36px_rgba(24,24,21,0.08),0_1px_4px_rgba(24,24,21,0.03),inset_0_1px_0_rgba(255,255,255,0.3)] select-none" style={{ background: 'rgba(245, 243, 238, 0.35)' }}
          id="floating-navigation"
        >
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <motion.button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => scrollToSection(item.id)}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.93 }}
                  transition={{
                    type: 'spring',
                    stiffness: 480,
                    damping: 12,
                    mass: 0.7
                  }}
                  className="relative uppercase tracking-widest font-sans font-semibold text-[10px] sm:text-xs py-2 px-3.5 transition-colors duration-150 interactive-item flex items-center justify-center focus:outline-none rounded-full z-10"
                  style={{
                    color: isActive ? 'var(--color-bg)' : 'var(--color-secondary)',
                  }}
                >
                  {/* Sliding capsule block */}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-capsule"
                      className="absolute inset-0 bg-accent rounded-full -z-10"
                      transition={{
                        type: 'spring',
                        stiffness: 450,
                        damping: 18,
                        mass: 0.6
                      }}
                    />
                  )}
                  <span>{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
