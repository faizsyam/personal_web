import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Writing } from '../types';
import { X, ExternalLink } from 'lucide-react';
import { localize } from '../lib/localize';

interface WritingModalProps {
  writing: Writing | null;
  onClose: () => void;
  lang: 'en' | 'id';
}

const getTopicTagStyle = (tag: string) => {
  const t = tag.toLowerCase();
  if (t.includes('ai agent') || t.includes('agen ai')) return 'text-[#2B4C7E] bg-[#EBF1FA] border-[#BFCEE2]';
  if (t.includes('education') || t.includes('pendidikan')) return 'text-[#16785A] bg-[#EDF7F4] border-[#C2E3D8]';
  if (t.includes('design') || t.includes('desain')) return 'text-[#7A3F8C] bg-[#F5EFFE] border-[#D9C5F0]';
  if (t.includes('engineer') || t.includes('rekayasa')) return 'text-[#9A6200] bg-[#FFF8EB] border-[#F5DFBF]';
  if (t.includes('strategy') || t.includes('strategi')) return 'text-[#1A5C52] bg-[#E8F5F3] border-[#B3D9D4]';
  return 'text-[#33465C] bg-[#F2F4F7] border-[#DEE2E6]';
};

export default function WritingModal({ writing, onClose, lang }: WritingModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (writing) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      if (modalRef.current) modalRef.current.focus();
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [writing, onClose]);

  if (!writing) return null;

  const framing = localize(writing.framing, lang);
  const excerpt = localize(writing.excerpt, lang);
  const topicTag = localize(writing.topicTag, lang);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none md:select-text"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-writing-title"
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
          aria-label="Close"
          className="absolute top-4 right-4 z-20 text-white/80 hover:text-white p-2 rounded-full bg-black/30 hover:bg-black/50 border border-white/10 transition-colors duration-150 interactive-item focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Hero image — full bleed */}
        {writing.imagePath && (
          <div className="relative w-full h-56 sm:h-64 flex-shrink-0 overflow-hidden rounded-t-2xl">
            <div className="absolute inset-0 bg-grid-fine opacity-10 pointer-events-none z-10" />
            <img
              src={writing.imagePath}
              alt={writing.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent pointer-events-none z-10" />
            {/* Topic tag + date overlay */}
            <div className="absolute bottom-4 left-5 z-20 flex items-center gap-2">
              <span className={`text-[9px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full font-bold shadow-sm border ${getTopicTagStyle(topicTag)}`}>
                {topicTag}
              </span>
              <span className="text-[9px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full font-bold shadow-sm text-secondary bg-bg/80 border border-surface/60 backdrop-blur-sm">
                {writing.date}
              </span>
            </div>
          </div>
        )}

        {/* If no image, show badges in header */}
        {!writing.imagePath && (
          <div className="flex items-center gap-2 pt-6 px-6 sm:px-8">
            <span className={`text-[9px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full font-bold border ${getTopicTagStyle(topicTag)}`}>
              {topicTag}
            </span>
            <span className="text-[9px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full font-bold text-secondary bg-surface/30 border border-surface">
              {writing.date}
            </span>
          </div>
        )}

        {/* Content area */}
        <div className="flex flex-col gap-7 px-6 sm:px-8 pb-8 pt-2">

          {/* Title + framing */}
          <div className="flex flex-col gap-2">
            <h2
              id="modal-writing-title"
              className="text-2xl sm:text-3xl font-serif tracking-tight text-primary font-semibold leading-tight pr-10"
            >
              {writing.title}
            </h2>
            <p className="text-sm sm:text-[15px] text-secondary italic font-light leading-relaxed">
              {framing}
            </p>
          </div>

          <div className="h-px w-full bg-surface" />

          {/* Excerpt */}
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono text-secondary tracking-widest uppercase">
              {lang === 'en' ? 'About this piece' : 'Tentang tulisan ini'}
            </span>
            <p className="font-light text-primary/90 text-[14.5px] sm:text-[15px] leading-relaxed">
              {excerpt}
            </p>
          </div>

          {/* Footer: read link */}
          <div className="flex justify-end pt-5 border-t border-surface/50">
            <a
              href={writing.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-highlight/[0.07] hover:bg-highlight/[0.12] border border-highlight/20 hover:border-highlight/40 text-highlight text-[12px] font-mono tracking-wider uppercase font-semibold transition-all duration-150 interactive-item"
            >
              <span>{lang === 'en' ? 'Read on Medium' : 'Baca di Medium'}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
