import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

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
    image: "/images/ai_core_blueprint_1781203003745.jpg",
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
          Desain visual adalah kenyamanan utama ketika kita menjelajahi dunia digital. Ini meliputi penyusunan identitas merek, pembuatan ilustrasi, serta tata letak artistik yang membuat tampilan layar terasa hangat dan hidup.
        </p>
        <p>
          Desain yang cerdas bukan sekadar hiasan. Saat kita merapikan tipografi dan mengatur jarak tombol dengan cermat, kita sedang membuat sistem rumit menjadi sangat mudah dibaca. Tampilan yang bersih meredakan rasa bingung pengguna dan menyapa mereka dengan ramah.
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
              <strong className="text-primary font-medium font-sans">AI & Desain (AI × Desain):</strong> Memanfaatkan sistem gambar generatif untuk merajut cerita visual, serta mengubah kalkulasi rumit jaringan komputer menjadi data seni yang komunikatif.
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
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    if (isOpen) {
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
  }, [isOpen, onClose, currentSlide]);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setDirection(1);
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleGoToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  if (!isOpen) return null;

  const activeSlide = SLIDES[currentSlide];

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-modal-title"
      >
        {/* Semi-transparent blur overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#161614]/70 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Container */}
        <motion.div
          ref={modalRef}
          tabIndex={-1}
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.96 }}
          transition={{
            type: 'spring',
            stiffness: 420,
            damping: 24,
            mass: 0.85
          }}
          className="relative bg-bg w-full max-w-4xl h-auto max-h-[90vh] rounded-2xl shadow-[0_32px_80px_rgba(24,24,21,0.22),0_1px_3px_rgba(24,24,21,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] border border-surface/80 overflow-y-auto z-10 p-6 sm:p-9 flex flex-col gap-6 font-sans text-primary focus:outline-none scrollbar"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-6 right-6 text-secondary hover:text-accent p-2 rounded-full hover:bg-surface/50 border border-transparent hover:border-surface/40 transition-colors duration-150 focus:outline-none z-35"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Modal Header */}
          <div className="flex flex-col gap-1.5 pr-8">
            <span className="text-[10px] font-mono text-highlight tracking-widest uppercase font-bold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-highlight animate-pulse" />
              {lang === 'en' ? 'Core Ideology Presentation' : 'Presentasi Ideologi Dasar'}
            </span>
            <h1
              id="story-modal-title"
              className="font-serif text-xl sm:text-2xl font-medium tracking-tight text-primary leading-tight"
            >
              {lang === 'en' ? (
                <>Building Things That <span className="text-highlight">Actually Matter</span></>
              ) : (
                <>Membangun Sesuatu Yang <span className="text-highlight">Benar-Benar Bermanfaat</span></>
              )}
            </h1>
          </div>

          <div className="h-[1px] w-full bg-surface" />

          {/* Slider Content - Side-by-Side Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start min-h-[300px]">
            {/* Left side: Customized Blueprint Illustration with Zoom Out sequence */}
            <div className="col-span-1 md:col-span-5 flex flex-col gap-2.5">
              <div className="relative w-full aspect-video md:aspect-[4/3] rounded-xl overflow-hidden bg-surface/20 border border-surface/50 shadow-sm flex-shrink-0 group">
                {/* Vintage spectrum draft lining overlay */}
                <div className="absolute inset-0 bg-grid-fine opacity-[0.14] pointer-events-none z-10" />
                
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.img
                    key={activeSlide.id}
                    custom={direction}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.03 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    src={activeSlide.image}
                    alt={lang === 'en' ? activeSlide.titleEn : activeSlide.titleId}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover select-none"
                  />
                </AnimatePresence>

                {/* Glass neon overlay strip */}
                <div className="absolute bottom-3 left-3 bg-[#111110]/80 backdrop-blur-sm border border-white/10 px-2.5 py-1 rounded-md text-[9px] font-mono font-bold tracking-wider text-highlight uppercase pointer-events-none z-20">
                  {lang === 'en' ? `Blueprint Sequence — Slide ${activeSlide.num}` : `Urutan Blueprint — Slide ${activeSlide.num}`}
                </div>
              </div>
              <p className="font-mono text-[9.5px] text-secondary/60 text-center leading-normal">
                {lang === 'en' 
                  ? "A stylized technical zoom-out illustrating each layer of our product philosophy."
                  : "Urutan zoom-out teknis yang mengilustrasikan tiap lapisan filosofi produk kami."}
              </p>
            </div>

            {/* Right side: Interactive story information */}
            <div className="col-span-1 md:col-span-7 flex flex-col justify-between h-full min-h-[220px] md:min-h-[280px]">
              <div className="flex flex-col gap-4">
                {/* Active Slide Heading badge & title */}
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-highlight bg-highlight/10 px-2 py-0.5 rounded border border-highlight/25 flex-shrink-0">
                    {activeSlide.num}
                  </span>
                  <h2 className="font-serif text-lg font-medium text-primary tracking-tight">
                    {lang === 'en' ? activeSlide.titleEn : activeSlide.titleId}
                  </h2>
                </div>

                {/* Animated Body text container */}
                <div className="relative min-h-[140px] text-[13.5px] sm:text-[14px]">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={activeSlide.id}
                      custom={direction}
                      variants={{
                        enter: (dir: number) => ({ x: dir > 0 ? 15 : -15, opacity: 0 }),
                        center: { x: 0, opacity: 1 },
                        exit: (dir: number) => ({ x: dir < 0 ? 15 : -15, opacity: 0 })
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {lang === 'en' ? activeSlide.contentEn : activeSlide.contentId}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Slider Controls Navigation */}
              <div className="flex items-center justify-between border-t border-surface/40 pt-4 mt-6">
                {/* Left/Right controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    disabled={currentSlide === 0}
                    className={`p-2 rounded-xl border border-surface transition-all duration-150 flex items-center justify-center focus:outline-none ${
                      currentSlide === 0 
                        ? 'opacity-30 cursor-not-allowed text-secondary bg-transparent' 
                        : 'text-primary hover:text-highlight hover:border-highlight/40 hover:bg-white/60 bg-white/20 cursor-pointer shadow-sm'
                    }`}
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={currentSlide === SLIDES.length - 1}
                    className={`p-2 rounded-xl border border-surface transition-all duration-150 flex items-center justify-center focus:outline-none ${
                      currentSlide === SLIDES.length - 1 
                        ? 'opacity-30 cursor-not-allowed text-secondary bg-transparent' 
                        : 'text-primary hover:text-highlight hover:border-highlight/40 hover:bg-white/60 bg-white/20 cursor-pointer shadow-sm'
                    }`}
                    aria-label="Next slide"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Clickable bullet indicators */}
                <div className="flex items-center gap-1.5">
                  {SLIDES.map((slide, idx) => (
                    <button
                      key={slide.id}
                      onClick={() => handleGoToSlide(idx)}
                      className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                        idx === currentSlide 
                          ? 'w-6 bg-highlight' 
                          : 'w-2.5 bg-surface hover:bg-secondary/40'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Progress fraction text */}
                <span className="font-mono text-[10px] text-secondary font-bold tracking-wider">
                  {activeSlide.num} / {SLIDES.length.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
