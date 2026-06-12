import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { BackgroundItem } from '../types';
import { X, Briefcase, GraduationCap } from 'lucide-react';

interface BackgroundModalProps {
  item: BackgroundItem | null;
  onClose: () => void;
  lang: 'en' | 'id';
}

export default function BackgroundModal({ item, onClose, lang }: BackgroundModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (item) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none md:select-text"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-background-title"
    >
      {/* Dimmed glass overlay backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#181815]/65 backdrop-blur-md cursor-pointer"
        id="modal-backdrop-background"
      />
 
      {/* Content Panel with deep layered shadows */}
      <motion.div
        ref={modalRef}
        tabIndex={-1}
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{
          type: 'spring',
          stiffness: 450,
          damping: 20,
          mass: 0.8
        }}
        className="relative bg-bg w-full max-w-2xl h-auto max-h-[88vh] rounded-2xl shadow-[0_32px_80px_rgba(24,24,21,0.22),0_1px_3px_rgba(24,24,21,0.04),inset_0_1px_0_rgba(255,255,255,0.7)] border border-surface/80 overflow-y-auto z-10 p-5 sm:p-8 md:p-10 flex flex-col gap-6 font-sans text-primary focus:outline-none scrollbar"
        id="modal-background-panel"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-6 right-6 text-secondary hover:text-accent p-2.5 rounded-full hover:bg-surface/60 border border-transparent hover:border-surface/40 transition-colors duration-150 interactive-item focus:outline-none"
          id="modal-background-close-trigger"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content Header Section */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-highlight">
            {item.type === 'work' ? (
              <Briefcase className="h-4 w-4" />
            ) : (
              <GraduationCap className="h-4.5 w-4.5" />
            )}
            <span className="text-[10px] font-mono tracking-widest uppercase font-semibold">
              {item.type === 'work' 
                ? (lang === 'en' ? 'Professional Track' : 'Jalur Profesional') 
                : (lang === 'en' ? 'Academic & Research' : 'Akademis & Riset')}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
            <h2
              id="modal-background-title"
              className="text-xl sm:text-2xl font-serif tracking-tight text-primary font-semibold"
            >
              {item.role}
            </h2>
            <span
              className="inline-flex self-start sm:self-auto px-2.5 py-0.5 rounded-full text-[9px] font-mono tracking-widest uppercase border border-surface bg-surface/30 text-secondary"
              id="modal-background-range"
            >
              {item.dateRange}
            </span>
          </div>
          
          <p className="font-sans text-sm sm:text-base text-secondary/90 font-normal">
            {item.organization}
          </p>
        </div>

        {/* Divider line */}
        <div className="h-[1px] w-full bg-surface" />

        {/* Core Content */}
        <div className="flex flex-col gap-6 text-[15px] sm:text-base leading-relaxed text-primary">
          
          {/* Narrative description */}
          {item.details && (
            <div className="flex flex-col gap-1.5 animate-fadeIn">
              <span className="text-[10px] font-mono text-secondary tracking-widest uppercase">
                {lang === 'en' ? 'Summary & Directives' : 'Ringkasan & Arahan Pekerjaan'}
              </span>
              <p className="font-sans text-[14.5px] sm:text-[15px] text-primary/95 leading-relaxed font-light">
                {item.details}
              </p>
            </div>
          )}

          {/* Highlights, Achievements, and Joined Organizations */}
          {item.highlights && item.highlights.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-mono text-secondary tracking-widest uppercase">
                {item.type === 'education' 
                  ? (lang === 'en' ? 'Organizations Joined & Highlights' : 'Organisasi & Pencapaian Utama') 
                  : (lang === 'en' ? 'Key Engagements & Impact' : 'Keterlibatan Utama & Dampak')}
              </span>
              <ul className="flex flex-col gap-3 text-[13.5px] sm:text-[14px] leading-relaxed font-sans font-light text-primary/90">
                {item.highlights.map((highlight, index) => {
                  // Determine parts to bold (e.g. organization names in university like HIMTI BINUS before colons)
                  const parts = highlight.split(':');
                  const hasLabel = parts.length > 1;

                  return (
                    <li key={index} className="flex gap-2.5 items-start pl-1">
                      {/* Custom geometric point indicator */}
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-highlight mt-2" />
                      <div>
                        {hasLabel ? (
                          <>
                            <strong className="font-semibold text-primary/100">{parts[0]}:</strong>
                            <span>{parts.slice(1).join(':')}</span>
                          </>
                        ) : (
                          <span>{highlight}</span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Short snapshot quote */}
          <div className="font-sans text-[13.5px] text-secondary italic font-light border-l border-surface/90 pl-3.5 bg-surface/10 py-1.5 rounded-r">
            &ldquo;{item.popoutCopy}&rdquo;
          </div>
        </div>

        {/* Competencies / Tech stack used */}
        {item.skills && item.skills.length > 0 && (
          <div className="flex flex-col gap-2 pt-4 border-t border-surface/50 mt-auto">
            <span className="text-[10px] font-mono text-secondary tracking-widest uppercase">
              {item.type === 'work' 
                ? (lang === 'en' ? 'Applied Competencies' : 'Kompetensi Terapan') 
                : (lang === 'en' ? 'Core Focus Areas' : 'Fokus Utama Studi')}
            </span>
            <div className="flex flex-wrap gap-1.5" id="modal-background-skills">
              {item.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-surface/50 border border-surface/20 text-secondary text-xs font-sans font-light px-2.5 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
