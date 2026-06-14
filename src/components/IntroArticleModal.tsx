import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface IntroArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'id';
}

interface Slide {
  id: string;
  num: string;
  titleEn: string;
  titleId: string;
  image: string;
  contentEn: React.ReactNode;
  contentId: React.ReactNode;
}

const SLIDES: Slide[] = [
  {
    id: "ai-ml",
    num: "01",
    titleEn: "The Foundation: AI & ML Engineering",
    titleId: "Pondasi Utama: Rekayasa AI & ML",
    image: "/images/mira.png",
    contentEn: (
      <div className="flex flex-col gap-3.5 text-secondary">
        <p>
          Think of artificial intelligence as a powerful engine. Building it requires writing clean code, setting up neural networks, testing machine learning models, and building automatic pipelines to keep everything running in the background.
        </p>
        <p>
          But code alone is only half the story. A brilliant model tucked away inside a lonely server endpoint can't help anyone. To make it truly valuable, we have to bring it out of the lab and into the hands of real people.
        </p>
      </div>
    ),
    contentId: (
      <div className="flex flex-col gap-3.5 text-secondary">
        <p>
          Bayangkan kecerdasan buatan seperti mesin mobil yang kuat. Membangunnya memerlukan kode pemrograman yang bersih, merancang jaringan saraf tiruan (neural networks), menguji model pintar, serta menjaga agar sistem tetap berjalan stabil di latar belakang.
        </p>
        <p>
          Namun, baris kode barulah setengah jalan. Model yang luar biasa pintar sekalipun tidak akan membawa makna jika hanya tersimpan di dalam server yang sunyi. Agar berguna secara nyata, kita harus meluncurkannya ke dunia luar untuk bisa digunakan banyak orang.
        </p>
      </div>
    )
  },
  {
    id: "hci",
    num: "02",
    titleEn: "The Connection: Human-Computer Interaction (HCI)",
    titleId: "Hubungan Manusia-Komputer: HCI",
    image: "/images/hci_layer_blueprint_1781203023489.jpg",
    contentEn: (
      <div className="flex flex-col gap-3.5 text-secondary">
        <p>
          This is where we focus on the human side of the screen. Before we write any code, we look at the big picture. We ask: <em>How do people actually work? What are their daily habits, and what are they trying to achieve?</em>
        </p>
        <p>
          We run usability research and study workflows to design systems that feel natural, predictable, and friendly. It is not about making a system that is just technically smart; it is about building software you can easily understand and trust.
        </p>
      </div>
    ),
    contentId: (
      <div className="flex flex-col gap-3.5 text-secondary">
        <p>
          Di sinilah kita mulai berfokus pada manusia di depan layar. Sebelum menulis kode, kita melihat gambaran besarnya dahulu. Kita mempelajari kebiasaan harian pengguna, apa tujuan mereka, dan bagaimana teknologi bisa membantu mempermudah hidup mereka.
        </p>
        <p>
          Lewat riset kemudahan penggunaan (usability) dan pemetaan alur kerja, kita menciptakan sistem yang terasa akrab, ramah, dan mudah ditebak. Ini bukan sekadar membuat program yang canggih secara teknis, melainkan tentang membangun perangkat lunak yang bersahabat dan tepercaya.
        </p>
      </div>
    )
  },
  {
    id: "visual-creative",
    num: "03",
    titleEn: "The Feeling: Visual & Creative Design",
    titleId: "Sentuhan Rasa: Desain Visual & Kreatif",
    image: "/images/visual_layer_blueprint_1781203039742.jpg",
    contentEn: (
      <div className="flex flex-col gap-3.5 text-secondary">
        <p>
          Visual design is the comfort that makes the digital journey enjoyable. It is about crafting clear brand identities, original illustrations, and digital layouts that make a screen feel warm and approachable.
        </p>
        <p>
          Great design is never just decoration. When we align typography perfectly and space buttons out carefully, we are making complex systems instantly easier to read. A clean, beautiful layout lowers your stress and welcomes you into the digital space.
        </p>
      </div>
    ),
    contentId: (
      <div className="flex flex-col gap-3.5 text-secondary">
        <p>
          Desain visual adalah kenyamanan utama ketika kita menjelajahi dunia digital. Ini meliputi penyusunan identitas merek, pembuatan ilustrasi, serta tata letak artistik yang membuat tampilan layar terasa hangat dan menyambut.
        </p>
        <p>
          Desain yang cerdas bukan sekadar hiasan. Saat kita merapikan tipografi dan mengatur jarak tombol dengan cermat, kita sedang membuat sistem rumit menjadi sangat mudah dibaca. Tampilan yang bersih meredakan stres dan menyambut Anda ke dalam ruang digital.
        </p>
      </div>
    )
  },
  {
    id: "overlaps",
    num: "04",
    titleEn: "Where They Meet: The Overlaps",
    titleId: "Titik Temu: Di mana Mereka Melebur",
    image: "/images/workspace_layer_blueprint_1781203056668.jpg",
    contentEn: (
      <div className="flex flex-col gap-3.5 text-secondary text-[13.5px]">
        <p className="text-[14px]">
          The real magic happens when these different worlds cross and support each other:
        </p>
        <ul className="flex flex-col gap-2.5 pl-1">
          <li className="flex gap-2 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
            <div>
              <strong className="text-primary font-medium">AI & Interaction (AI × HCI):</strong> Writing clear prompts, designing natural chatbot dialogues, and creating environments where humans and AI collaborate seamlessly.
            </div>
          </li>
          <li className="flex gap-2 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
            <div>
              <strong className="text-primary font-medium">AI & Design (AI × Design):</strong> Using smart generative imagery to tell visual stories, and transforming complex neural network math into readable, artistic charts.
            </div>
          </li>
          <li className="flex gap-2 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
            <div>
              <strong className="text-primary font-medium">Interaction & Design (HCI × Design):</strong> Building quick mockups, interactive prototypes, and ensuring layouts are visually inclusive and accessible to everyone.
            </div>
          </li>
        </ul>
      </div>
    ),
    contentId: (
      <div className="flex flex-col gap-3.5 text-secondary text-[13.5px]">
        <p className="text-[14px]">
          Keseruan sesungguhnya terjadi ketika tiga dunia berbeda ini saling beririsan dan bekerja sama secara harmonis:
        </p>
        <ul className="flex flex-col gap-2.5 pl-1">
          <li className="flex gap-2 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
            <div>
              <strong className="text-primary font-medium font-sans">AI & Interaksi (AI × HCI):</strong> Merumuskan instruksi cerdas, merancang percakapan chatbot yang mengalir, dan membangun ruang kolaborasi yang alami antara manusia dengan AI.
            </div>
          </li>
          <li className="flex gap-2 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
            <div>
              <strong className="text-primary font-medium font-sans">AI & Desain (AI × Desain):</strong> Memanfaatkan sistem gambar generatif untuk merajut cerita visual, serta mengubah kalkulasi rumit jaringan saraf menjadi visualisasi artistik yang mudah dipahami.
            </div>
          </li>
          <li className="flex gap-2 items-start">
            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
            <div>
              <strong className="text-primary font-medium font-sans">Interaksi & Desain (HCI × Design):</strong> Merancang konsep awal, menyusun prototipe interaktif, dan memastikan seluruh halaman bersifat inklusif serta mudah diakses semua orang (aksesibilitas).
            </div>
          </li>
        </ul>
      </div>
    )
  },
  {
    id: "center",
    num: "05",
    titleEn: "At the Center: AI Product Development",
    titleId: "Di Pusat Utama: Pengembangan Produk AI",
    image: "/images/workspace_layer_blueprint_1781203056668.jpg",
    contentEn: (
      <div className="flex flex-col gap-3.5 text-secondary">
        <p>
          Right in the middle of this diagram is my absolute playground: <strong>AI Product Development</strong>. It requires bringing all these horizons together to build cohesive, user-friendly solutions.
        </p>
        <p>
          My goal is not just to build a predictive backend model or design a static screen mockup. It is to craft living software products—like beautiful analytic dashboards, data visualizations, and interactive apps—that respect your time, clarify heavy numbers, and make complex technology feel like second nature.
        </p>
      </div>
    ),
    contentId: (
      <div className="flex flex-col gap-3.5 text-secondary">
        <p>
          Tepat di titik temu terdalam dari diagram ini adalah dunia bermain utama saya: <strong>Pengembangan Produk AI (AI Product Development)</strong>. Ranah ini memadukan seluruh pilar untuk melahirkan solusi digital yang nyaman digunakan manusia.
        </p>
        <p>
          Misi utama saya bukan sekadar meluncurkan sistem backend pintar secara terpisah atau menggambar sketsa layar yang diam. Melainkan merajut produk perangkat lunak utuh—seperti dashboard analitis yang indah, visualisasi data interaktif, dan aplikasi siap pakai—yang menghargai waktu Anda, menyederhanakan rumitnya data, dan membuat teknologi bekerja secara alami demi kehidupan harian Anda.
        </p>
      </div>
    )
  }
];

export default function IntroArticleModal({ isOpen, onClose, lang }: IntroArticleModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) setCurrentSlide(p => p + 1);
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

  const activeSlide = SLIDES[currentSlide];
  const progress = ((currentSlide + 1) / SLIDES.length) * 100;

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
                  initial={{ width: `${(currentSlide / SLIDES.length) * 100}%` }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>

              {/* Close button */}
              <button
                onClick={onClose}
                aria-label="Close modal"
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
                {lang === 'en' ? activeSlide.contentEn : activeSlide.contentId}
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
                {currentSlide > 0 ? SLIDES[currentSlide - 1].num : '—'}
              </button>

              {/* Dots */}
              <div className="flex items-center gap-1.5">
                {SLIDES.map((slide, idx) => (
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
                disabled={currentSlide === SLIDES.length - 1}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium transition-all duration-200 border ${
                  currentSlide === SLIDES.length - 1
                    ? 'opacity-30 cursor-not-allowed text-secondary border-transparent'
                    : 'text-primary border-surface hover:border-highlight/40 hover:text-highlight hover:bg-white/60 cursor-pointer'
                }`}
              >
                {currentSlide < SLIDES.length - 1 ? SLIDES[currentSlide + 1].num : '—'}
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
