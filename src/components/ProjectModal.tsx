import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { X, ExternalLink } from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  lang: 'en' | 'id';
}

export default function ProjectModal({ project, onClose, lang }: ProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (project) {
      window.addEventListener('keydown', handleKeyDown);
      // Suppress body scroll
      document.body.style.overflow = 'hidden';
      
      // Trap focus
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none md:select-text"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      {/* Dimmed glass overlay backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#181815]/65 backdrop-blur-md cursor-pointer"
        id="modal-backdrop"
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
        id="modal-content-panel"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-6 right-6 text-secondary hover:text-accent p-2.5 rounded-full hover:bg-surface/60 border border-transparent hover:border-surface/40 transition-colors duration-150 interactive-item focus:outline-none"
          id="modal-close-trigger"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4 mt-2">
            <h2
              id="modal-project-title"
              className="text-2xl sm:text-3xl font-serif tracking-tight text-primary font-semibold"
            >
              {project.name}
            </h2>
            <span
              className="inline-flex self-start sm:self-auto px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase border border-surface bg-surface/30 text-secondary"
              id="modal-project-status"
            >
              {project.status}
            </span>
          </div>
          <p className="font-sans text-sm sm:text-base text-secondary italic font-light">
            {project.subtitle}
          </p>
        </div>

        {/* Divider line */}
        <div className="h-[1px] w-full bg-surface" />

        {/* Core content */}
        <div className="flex flex-col gap-6 text-[15px] sm:text-base leading-relaxed text-primary">
          {/* Problem / Context */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-secondary tracking-widest uppercase">
              {lang === 'en' ? 'Context' : 'Konteks'}
            </span>
            <p className="font-light">{project.context}</p>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-mono text-secondary tracking-widest uppercase">
              {lang === 'en' ? 'The Solution' : 'Solusi'}
            </span>
            <p className="font-light">{project.description}</p>
          </div>

          {/* Project blueprint image */}
          {project.imagePath && (
            <div className="flex flex-col gap-2 border border-surface/50 rounded overflow-hidden bg-bg p-2 sm:p-4 my-2" id="modal-image-wrapper">
              <span className="text-[9px] font-mono text-secondary/60 tracking-wider uppercase">
                {lang === 'en' ? 'ARCHITECTURAL SCHEMATIC OUTLINE (SYSTEM MODEL)' : 'OUTLINE SKEMATIS ARSITEKTUR (MODEL SISTEM)'}
              </span>
              <img
                src={project.imagePath}
                alt={`${project.name} technical blueprint`}
                referrerPolicy="no-referrer"
                className="w-full h-auto aspect-video object-cover rounded opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          )}

          {/* Tradeoff - Narrative */}
          <div className="flex flex-col gap-1.5 bg-highlight/[0.04] border-l-2 border-highlight p-4 rounded-r-md">
            <span className="text-[10px] font-mono text-highlight tracking-widest uppercase font-medium">
              {lang === 'en' ? 'Tradeoffs & Decision Design' : 'Kompromi & Desain Keputusan'}
            </span>
            <p className="font-sans text-[14px] sm:text-[15px] text-primary italic leading-relaxed font-light mt-1">
              &ldquo;{project.depthTradeoff}&rdquo;
            </p>
          </div>
        </div>

        {/* Footer info: stack & external link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-4 border-t border-surface/50 mt-auto">
          {/* Stack list */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono text-secondary tracking-widest uppercase">
              {lang === 'en' ? 'Architecture Stack' : 'Kumpulan Teknologi'}
            </span>
            <div className="flex flex-wrap gap-1.5" id="modal-stack-tags">
              {project.stack.map((item, idx) => (
                <span
                  key={idx}
                  className="bg-surface/60 border border-surface/20 text-secondary text-xs font-sans font-light px-2.5 py-1 rounded"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Link action */}
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-mono tracking-wider interactive-item mt-2 sm:mt-0 py-2"
              id="modal-external-link"
            >
              <span>{lang === 'en' ? 'SOURCE PATH' : 'SUMBER KODE'}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}
