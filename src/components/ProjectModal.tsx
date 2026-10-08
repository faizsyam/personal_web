import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { X, ExternalLink } from 'lucide-react';
import { localize } from '../lib/localize';
import { UI } from '../data/content';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  lang: 'en' | 'id';
}

const getTypeStyle = (type: string) => {
  if (type === 'Academic') return 'text-[#3B3F8C] bg-[#EEEFFE] border border-[#C5C8F0]';
  if (type === 'Professional') return 'text-[#1A5C52] bg-[#E8F5F3] border border-[#B3D9D4]';
  return 'text-[#7A4F1E] bg-[#FDF3E7] border border-[#EDD5B0]';
};

export default function ProjectModal({ project, onClose, lang }: ProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      if (modalRef.current) modalRef.current.focus();
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [project, onClose]);

  if (!project) return null;

  const title = localize(project.subtitle, lang);
  const context = localize(project.context, lang);
  const challenge = localize(project.challenge, lang);
  const description = localize(project.description, lang);
  const depthTradeoff = localize(project.depthTradeoff, lang);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none md:select-text"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#181815]/65 backdrop-blur-md cursor-pointer"
      />

      {/* Panel */}
      <motion.div
        ref={modalRef}
        tabIndex={-1}
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 14, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 450, damping: 20, mass: 0.8 }}
        className="relative bg-bg w-full max-w-3xl max-h-[92vh] rounded-2xl shadow-[0_32px_80px_rgba(24,24,21,0.22),0_1px_3px_rgba(24,24,21,0.04),inset_0_1px_0_rgba(255,255,255,0.7)] border border-surface/80 overflow-y-auto z-10 flex flex-col font-sans text-primary focus:outline-none scrollbar"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label={localize({ en: UI.modalLabels.project.closeEn, id: UI.modalLabels.project.closeId }, lang)}
          className="absolute top-4 right-4 z-20 text-white/80 hover:text-white p-2 rounded-full bg-black/30 hover:bg-black/50 border border-white/10 transition-colors duration-150 interactive-item focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Hero image — full bleed at top */}
        {project.imagePath && (
          <div className="relative w-full h-56 sm:h-64 flex-shrink-0 overflow-hidden rounded-t-2xl">
            <div className="absolute inset-0 bg-grid-fine opacity-10 pointer-events-none z-10" />
            <img
              src={project.imagePath}
              alt={`${project.name} technical blueprint`}
              className="w-full h-full object-cover"
            />
            {/* Gradient fade into content */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent pointer-events-none z-10" />
            {/* Type + status badges over image */}
            <div className="absolute bottom-4 left-5 z-20 flex items-center gap-2">
              <span className={`text-[9px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full font-bold shadow-sm ${getTypeStyle(project.type)}`}>
                {project.type}
              </span>
              <span className="text-[9px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full font-bold shadow-sm text-secondary bg-bg/80 border border-surface/60 backdrop-blur-sm">
                {project.status}
              </span>
            </div>
          </div>
        )}

        {/* If no image, show badges in header area */}
        {!project.imagePath && (
          <div className="flex items-center gap-2 pt-6 px-6 sm:px-8">
            <span className={`text-[9px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full font-bold ${getTypeStyle(project.type)}`}>
              {project.type}
            </span>
            <span className="text-[9px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full font-bold text-secondary bg-surface/30 border border-surface">
              {project.status}
            </span>
          </div>
        )}

        {/* Content area */}
        <div className="flex flex-col gap-7 px-6 sm:px-8 pb-8 pt-2">

          {/* Title + subtitle */}
          <div className="flex flex-col gap-2">
            <h2
              id="modal-project-title"
              className="text-2xl sm:text-3xl font-serif tracking-tight text-primary font-semibold leading-tight pr-10"
            >
              {project.name}
            </h2>
            <p className="text-sm sm:text-[15px] text-secondary italic font-light leading-relaxed">
              {title}
            </p>
          </div>

          <div className="h-px w-full bg-surface" />

          {/* Content sections */}
          <div className="flex flex-col gap-7 text-[14.5px] sm:text-[15px] leading-relaxed text-primary">

            {/* Context */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-secondary tracking-widest uppercase">
                {localize({ en: UI.modalLabels.project.contextEn, id: UI.modalLabels.project.contextId }, lang)}
              </span>
              <p className="font-light text-primary/90">{context}</p>
            </div>

            {/* Challenge */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-secondary tracking-widest uppercase">
                {localize({ en: UI.modalLabels.project.challengeEn, id: UI.modalLabels.project.challengeId }, lang)}
              </span>
              <p className="font-light text-primary/90">{challenge}</p>
            </div>

            {/* Solution */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-secondary tracking-widest uppercase">
                {localize({ en: UI.modalLabels.project.solutionEn, id: UI.modalLabels.project.solutionId }, lang)}
              </span>
              <p className="font-light text-primary/90">{description}</p>
            </div>

            {/* Tradeoff callout */}
            <div className="flex flex-col gap-2 bg-highlight/[0.04] border-l-2 border-highlight px-5 py-4 rounded-r-lg">
              <span className="text-[10px] font-mono text-highlight tracking-widest uppercase font-medium">
                {localize({ en: UI.modalLabels.project.tradeoffsEn, id: UI.modalLabels.project.tradeoffsId }, lang)}
              </span>
              <p className="text-[13.5px] sm:text-[14.5px] text-primary italic leading-relaxed font-light">
                &ldquo;{depthTradeoff}&rdquo;
              </p>
            </div>
          </div>

          {/* Footer: stack + link */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 pt-5 border-t border-surface/50">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-secondary tracking-widest uppercase">
                {localize({ en: UI.modalLabels.project.stackEn, id: UI.modalLabels.project.stackId }, lang)}
              </span>
              <div className="flex flex-wrap gap-1.5">
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

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-mono tracking-wider interactive-item shrink-0 py-1"
              >
                <span>{localize({ en: UI.modalLabels.project.linkEn, id: UI.modalLabels.project.linkId }, lang)}</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
