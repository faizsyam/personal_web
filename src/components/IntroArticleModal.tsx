import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { INTRO_SLIDES } from '../data/content';
import { localize } from '../lib/localize';

const ALLOWED_TAGS = ['em', 'strong', 'p', 'br', 'span', 'div'];

function sanitizeHtml(html: string): string {
  const tagRegex = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  return html.replace(tagRegex, (match, tagName) => {
    if (ALLOWED_TAGS.includes(tagName.toLowerCase())) {
      return match;
    }
    return '';
  });
}

interface SlideData {
  id: string;
  num: string;
  titleEn: string;
  titleId: string;
  image: string;
  paragraphsEn: string[];
  paragraphsId: string[];
}

interface IntroArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'id';
}

export default function IntroArticleModal({ isOpen, onClose, lang }: IntroArticleModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = INTRO_SLIDES.slides as SlideData[];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(p => p + 1);
  };

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide(p => p - 1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentSlide]);

  if (!isOpen) return null;

  const activeSlide = slides[currentSlide];
  const progress = ((currentSlide + 1) / slides.length) * 100;
  const paragraphs = lang === 'en' ? activeSlide.paragraphsEn : activeSlide.paragraphsId;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-modal-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#161614]/60 backdrop-blur-xl cursor-pointer"
        />

        {/* Modal */}
        <motion.div
          ref={modalRef}
          tabIndex={-1}
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26, mass: 0.8 }}
          className="relative bg-bg w-full max-w-2xl h-auto max-h-[92vh] rounded-2xl shadow-2xl border border-surface/60 overflow-hidden z-10 flex flex-col font-sans text-primary scrollbar"
        >
          {/* Header */}
          <div className="relative flex-shrink-0">
            {/* Full-width Image */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden bg-surface/30">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeSlide.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  src={activeSlide.image}
                  alt={lang === 'en' ? activeSlide.titleEn : activeSlide.titleId}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover select-none"
                />
              </AnimatePresence>

              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-bg/30 via-transparent to-bg/30" />

              {/* Slide progress bar */}
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-surface/40">
                <motion.div
                  className="h-full bg-highlight/70 rounded-r-full"
                  initial={{ width: `${(currentSlide / slides.length) * 100}%` }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                aria-label={localize({ en: 'Close', id: 'Tutup' }, lang)}
                className="absolute top-3 right-3 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 border border-white/20 backdrop-blur-sm transition-all duration-200 focus:outline-none z-10"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Slide counter */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#111110]/60 backdrop-blur-sm border border-white/10 z-10">
                <span className="text-[10px] font-mono text-white/90 tracking-widest font-bold uppercase">
                  {activeSlide.num}
                </span>
              </div>
            </div>

            {/* Title + Slide nav (below image) */}
            <div className="px-6 sm:px-8 pt-5 pb-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col gap-2"
                >
                  <h2 className="font-serif text-xl sm:text-[22px] font-medium text-primary tracking-tight leading-snug">
                    {lang === 'en' ? activeSlide.titleEn : activeSlide.titleId}
                  </h2>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Content body */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
                className="text-[14px] sm:text-[15px] leading-relaxed"
              >
                <div className="flex flex-col gap-3.5 text-secondary">
                  {paragraphs.map((p, i) => (
                    <p
                      key={i}
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(p),
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Navigation Bar */}
          <div className="flex-shrink-0 border-t border-surface/40 px-6 sm:px-8 py-4 bg-bg/50 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              {/* Prev */}
              <button
                onClick={handlePrev}
                disabled={currentSlide === 0}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-all duration-200 border ${
                  currentSlide === 0
                    ? 'opacity-30 cursor-not-allowed text-secondary border-transparent'
                    : 'text-primary border-surface hover:border-highlight/40 hover:text-highlight hover:bg-white/60 cursor-pointer'
                }`}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                {currentSlide > 0 ? slides[currentSlide - 1].num : '—'}
              </button>

              {/* Dots */}
              <div className="flex items-center gap-1.5">
                {slides.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setCurrentSlide(idx)}
                    className="group relative p-1 focus:outline-none"
                    aria-label={`Go to slide ${idx + 1}`}
                  >
                    <div className={`h-2 rounded-full transition-all duration-500 ease-out ${
                      idx === currentSlide ? 'w-8 bg-highlight' : 'w-2 bg-surface group-hover:bg-secondary/40'
                    }`} />
                  </button>
                ))}
              </div>

              {/* Next */}
              <button
                onClick={handleNext}
                disabled={currentSlide === slides.length - 1}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-all duration-200 border ${
                  currentSlide === slides.length - 1
                    ? 'opacity-30 cursor-not-allowed text-secondary border-transparent'
                    : 'text-primary border-surface hover:border-highlight/40 hover:text-highlight hover:bg-white/60 cursor-pointer'
                }`}
              >
                {currentSlide < slides.length - 1 ? slides[currentSlide + 1].num : '—'}
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
