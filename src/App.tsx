import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Linkedin,
  Github,
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Globe,
  Instagram,
  Briefcase,
  Brain,
  Gamepad2,
  Terminal,
  GraduationCap,
  Trophy,
  Award
} from 'lucide-react';

import {
  HERO_DATA,
  INTRO_PARAGRAPHS,
  INTRO_EXPANDED,
  PROJECTS,
  WORK_ITEMS,
  EDUCATION_ITEMS,
  WRITINGS,
} from './data';
import { Project, BackgroundItem, Writing } from './types';

import { useLanguage } from './hooks/useLanguage';
import { useScrollSpy, useScrollTo } from './hooks/useScrollSpy';

import CustomCursor from './components/CustomCursor';
import FloatingNav from './components/FloatingNav';
import ProjectModal from './components/ProjectModal';
import BackgroundModal from './components/BackgroundModal';
import VennDiagram from './components/VennDiagram';
import InteractiveGridBackground from './components/InteractiveGridBackground';
import { InteractiveSubtitle } from './components/InteractiveHeroText';
import HelloSticker from './components/HelloSticker';
import PortraitReveal from './components/PortraitReveal';
import IntroArticleModal from './components/IntroArticleModal';
const FloatingGlyph = lazy(() => import('./components/FloatingGlyph'));

import { useGsapScroll } from './hooks/useGsapScroll';

function renderTimelineLogo(id: string, isLatest?: boolean) {
  const logoClass = isLatest
    ? "w-4 h-4 text-highlight transition-colors duration-200 group-hover:text-[#F5F3EE]"
    : "w-4 h-4 text-highlight opacity-70 dark:opacity-80 group-hover:opacity-100 transition-all duration-200";

  switch (id) {
    case 'work-1':
      return <Briefcase className={logoClass} strokeWidth={1.5} />;
    case 'work-2':
      return <Brain className={logoClass} strokeWidth={1.5} />;
    case 'work-3':
      return <Gamepad2 className={logoClass} strokeWidth={1.5} />;
    case 'work-4':
      return <Terminal className={logoClass} strokeWidth={1.5} />;
    case 'edu-1':
      return <GraduationCap className={logoClass} strokeWidth={1.5} />;
    case 'edu-2':
      return <BookOpen className={logoClass} strokeWidth={1.5} />;
    case 'cred-0':
      return <Trophy className={logoClass} strokeWidth={1.5} />;
    case 'cred-1':
      return <Award className={logoClass} strokeWidth={1.5} />;
    case 'cred-2':
      return <Globe className={logoClass} strokeWidth={1.5} />;
    default:
      return null;
  }
}

interface ContactLink {
  id: string;
  icon: React.ReactNode;
  label: string;
  display: string;
  href: string;
  onClick?: (e: React.MouseEvent) => void;
  brandClass: string;
  iconBgClass: string;
  accentTextClass: string;
}

const TRANSLATIONS = {
  en: {
    brief: "Brief",
    work: "Work",
    projects: "Projects",
    writing: "Writing",
    contact: "Contact",
    briefIntro: "Brief intro",
    background: "Background",
    letConnect: "Let’s connect.",
    contactLead: "I'm currently fully engaged in my current role and not actively seeking new opportunities. However, I'm always energized by conversations with people executing at the boundary of smart engineering and cognitive discovery.",
    contactSecondary: "If you are building something novel, thinking through a hard systems bottleneck, or just want to talk through ideas from my writing, feel free to connect.",
    copiedDetails: "Copied address!",
  },
  id: {
    brief: "Profil",
    work: "Karir",
    projects: "Proyek",
    writing: "Tulisan",
    contact: "Kontak",
    briefIntro: "Profil Ringkas",
    background: "Latar Belakang",
    letConnect: "Mari terhubung.",
    contactLead: "Saat ini saya sepenuhnya sibuk dengan peran saya dan tidak sedang aktif mencari peluang baru. Namun, saya selalu bersemangat untuk berdiskusi dengan orang-orang yang beroperasi di batas antara rekayasa cerdas dan eksplorasi kognitif.",
    contactSecondary: "Jika Anda sedang membangun sesuatu yang baru, memikirkan hambatan sistem yang sulit, atau hanya ingin membahas ide-ide dari tulisan saya, silakan hubungi.",
    copiedDetails: "Alamat tersalin!",
  }
};

export default function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<BackgroundItem | null>(null);
  const [hoveredTimelineId, setHoveredTimelineId] = useState<string | null>(null);
  const [hoveredWritingId, setHoveredWritingId] = useState<string | null>(null);
  const [expandedWritingId, setExpandedWritingId] = useState<string | null>(null);
  const [isWorkExpanded, setIsWorkExpanded] = useState(false);
  const [isEduExpanded, setIsEduExpanded] = useState(false);
  const [isIntroArticleOpen, setIsIntroArticleOpen] = useState(false);
  const [obfuscatedEmail, setObfuscatedEmail] = useState('Retrieve email');
  const [copied, setCopied] = useState(false);

  // Language with localStorage persistence
  const { lang, toggleLang } = useLanguage();

  // Scroll spy with RAF debouncing
  const activeSection = useScrollSpy(['about', 'work', 'projects', 'writing', 'contact'], {
    offset: 0.4,
    threshold: 180,
  });

  // GSAP ScrollTrigger scroll-driven animations
  useGsapScroll();

  useEffect(() => {
    // Standardizing on light mode as requested
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('theme');
  }, []);

  const t = useCallback(
    (key: string) => {
      return TRANSLATIONS[lang]?.[key as keyof typeof TRANSLATIONS['en']] || TRANSLATIONS['en']?.[key as keyof typeof TRANSLATIONS['en']] || key;
    },
    [lang]
  );

  useEffect(() => {
    const user = 'faizsyam06';
    const domain = 'gmail.com';
    setObfuscatedEmail(`${user}@${domain}`);
  }, []);

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('faizsyam06@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
    window.location.href = `mailto:faizsyam06@gmail.com`;
  };

  const scrollTo = useScrollTo(56);

  const handleTimelineClick = (item: BackgroundItem) => setSelectedBackground(item);

  const handleWritingClick = (id: string, e: React.MouseEvent) => {
    if (window.innerWidth < 1024) {
      e.preventDefault();
      setExpandedWritingId(expandedWritingId === id ? null : id);
    }
  };

  // ─── Shared animation constants ──────────────────
  const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

  const springHover = {
    type: 'spring' as const,
    stiffness: 520,
    damping: 26,
    mass: 0.5,
  };

  const springTap = {
    type: 'spring' as const,
    stiffness: 680,
    damping: 22,
    mass: 0.45,
  };

  const springReveal = {
    type: 'spring' as const,
    stiffness: 300,
    damping: 28,
    mass: 0.7,
  };

  // Animation variants — snappy spring-mass with elegant deceleration
  const timelineVariants = {
    hidden: { opacity: 0, x: -24 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.65,
        ease: easeOutExpo,
        delay: i * 0.07,
      },
    }),
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: easeOutExpo,
        delay: i * 0.07,
      },
    }),
  };

  return (
    <div className="relative min-h-screen bg-bg isolate selection:bg-highlight/10 selection:text-highlight select-none md:select-text flex flex-col text-primary overflow-x-hidden">
      {/* Dynamic interactive background drawing grids and micro-sparks on cursor hover */}
      <InteractiveGridBackground />

      {/* Ambient lights */}
      <div className="fixed top-0 left-1/4 w-[700px] h-[700px] rounded-full bg-highlight/[0.04] blur-[160px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-accent/[0.03] blur-[140px] pointer-events-none -z-10" />

      <CustomCursor />
      <FloatingNav activeSection={activeSection} lang={lang} />

      {/* NAV */}
      <header className={`sticky top-0 z-30 w-full transition-all duration-300 ${
        activeSection === 'home'
          ? 'h-16 sm:h-20 border-b border-transparent bg-transparent'
          : 'h-14 border-b border-surface/40 bg-bg/85 backdrop-blur-md'
      }`}>
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 h-full flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-[14px] font-serif font-medium tracking-tight text-primary hover:text-accent transition-all duration-300 cursor-pointer focus:outline-none"
          >
            <span className="w-6 h-6 border border-surface/80 rounded flex items-center justify-center text-[11px] font-mono text-secondary">F</span>
            Faiz
          </button>

          <nav className="hidden sm:flex items-center gap-8 sm:gap-10">
            {[
              { id: 'about', label: t('brief') },
              { id: 'work', label: t('work') },
              { id: 'projects', label: t('projects') },
              { id: 'writing', label: t('writing') },
              { id: 'contact', label: t('contact') },
            ].map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                whileHover={{ y: -3, transition: { type: 'spring', stiffness: 500, damping: 28, mass: 0.5 } }}
                whileTap={{ scale: 0.95, transition: { type: 'spring', stiffness: 680, damping: 22, mass: 0.45 } }}
                transition={{
                  type: 'spring',
                  stiffness: 480,
                  damping: 12,
                  mass: 0.7
                }}
                className={`text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-widest transition-colors duration-150 cursor-pointer focus:outline-none relative py-1 ${
                  activeSection === item.id ? 'text-primary' : 'text-secondary hover:text-primary'
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-highlight"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </nav>

          {/* Controls: Language Switch */}
          <div className="flex items-center">
            {/* Language Switch */}
            <div className="relative flex items-center p-[3px] rounded-full border border-surface bg-bg/50 hover:border-accent/20 hover:bg-bg/80 transition-all duration-300 shadow-[0_1px_2px_rgba(24,24,21,0.02)] select-none">
              <button
                onClick={toggleLang}
                className={`relative w-9 h-6 sm:w-10 sm:h-6.5 rounded-full text-[10px] font-mono tracking-wider font-extrabold transition-colors duration-200 cursor-pointer focus:outline-none flex items-center justify-center ${
                  lang === 'en' ? 'text-bg font-black' : 'text-secondary/80 hover:text-primary'
                }`}
              >
                <span className="relative z-10">EN</span>
                {lang === 'en' && (
                  <motion.div
                    layoutId="activeLang"
                    className="absolute inset-0 bg-accent rounded-full shadow-sm"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30
                    }}
                  />
                )}
              </button>
              <button
                onClick={toggleLang}
                className={`relative w-9 h-6 sm:w-10 sm:h-6.5 rounded-full text-[10px] font-mono tracking-wider font-extrabold transition-colors duration-200 cursor-pointer focus:outline-none flex items-center justify-center ${
                  lang === 'id' ? 'text-bg font-black' : 'text-secondary/80 hover:text-primary'
                }`}
              >
                <span className="relative z-10">ID</span>
                {lang === 'id' && (
                  <motion.div
                    layoutId="activeLang"
                    className="absolute inset-0 bg-accent rounded-full shadow-sm"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 30
                    }}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col gap-32 sm:gap-40 pb-24 relative z-10">

        {/* ── HERO ── */}
        <section id="home" className="relative pt-10 sm:pt-14 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 lg:gap-16 items-start min-h-[60vh]">
          <Suspense fallback={null}>
            <FloatingGlyph />
          </Suspense>

          {/* Left */}
          <div className="flex flex-col">
            {/* Name Sticker */}
            <HelloSticker />

            {/* Description */}
            <InteractiveSubtitle className="max-w-[500px] mb-10 text-[15.5px] sm:text-[16.5px] leading-relaxed font-light">
              {lang === 'en' ? (
                <span className="flex flex-col gap-3.5 text-left">
                  <div
                    className="relative inline-block text-[20px] sm:text-[24px] font-serif font-semibold text-highlight leading-snug tracking-tight cursor-default px-2 py-0.5 -mx-2 rounded-lg select-all whitespace-normal"
                  >
                    {("I build intelligent systems with a focus on both technical depth and user experience.").split(' ').map((word, i, arr) => {
                      const isHighlight = ["technical","depth","user","experience."].includes(word);
                      return (
                        <motion.span
                          key={`${word}-${i}`}
                          className="relative inline-block"
                          initial={{ y: 0 }}
                          whileHover={{ y: -2.5 }}
                          transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                        >
                          {isHighlight && (
                            <motion.span
                              className="absolute -top-[3px] -bottom-[3px] -left-[2px] -right-[2px] bg-[#fde047]/50 skew-x-[-1.5deg] rotate-[-1.5deg] rounded-sm -z-10 pointer-events-none"
                              initial={{ scaleX: 0, opacity: 0 }}
                              animate={{ scaleX: 1, opacity: 1 }}
                              transition={{
                                duration: 0.35,
                                delay: word === "technical" ? 0.55 : word === "depth" ? 0.67 : word === "user" ? 0.95 : 1.05,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              style={{ transformOrigin: "left center" }}
                              aria-hidden
                            />
                          )}
                          <span className="relative">{word}</span>
                          {i < arr.length - 1 && <span>&nbsp;</span>}
                        </motion.span>
                      );
                    })}
                  </div>
                  <span>
                    From AI agents to production applications, I care as much about how things work as how they feel to use.
                  </span>
                </span>
              ) : (
                <span className="flex flex-col gap-3.5 text-left">
                  <div
                    className="relative inline-block text-[20px] sm:text-[24px] font-serif font-semibold text-highlight leading-snug tracking-tight cursor-default px-2 py-0.5 -mx-2 rounded-lg select-all whitespace-normal"
                  >
                    {("Saya membangun sistem cerdas dengan fokus pada kedalaman teknis dan pengalaman pengguna.").split(' ').map((word, i, arr) => {
                      const isHighlight = ["kedalaman","teknis","pengalaman","pengguna."].includes(word);
                      return (
                        <motion.span
                          key={`${word}-${i}`}
                          className="relative inline-block"
                          initial={{ y: 0 }}
                          whileHover={{ y: -2.5 }}
                          transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                        >
                          {isHighlight && (
                            <motion.span
                              className="absolute -top-[3px] -bottom-[3px] -left-[2px] -right-[2px] bg-[#fde047]/50 skew-x-[-1.5deg] rotate-[-1.5deg] rounded-sm -z-10 pointer-events-none"
                              initial={{ scaleX: 0, opacity: 0 }}
                              animate={{ scaleX: 1, opacity: 1 }}
                              transition={{
                                duration: 0.35,
                                delay: word === "kedalaman" ? 0.55 : word === "teknis" ? 0.67 : word === "pengalaman" ? 0.95 : 1.05,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              style={{ transformOrigin: "left center" }}
                              aria-hidden
                            />
                          )}
                          <span className="relative">{word}</span>
                          {i < arr.length - 1 && <span>&nbsp;</span>}
                        </motion.span>
                      );
                    })}
                  </div>
                  <span>
                    Mulai dari AI agent hingga aplikasi yang digunakan di dunia nyata, saya peduli tidak hanya pada bagaimana teknologi bekerja, tetapi juga bagaimana rasanya saat digunakan.
                  </span>
                </span>
              )}
            </InteractiveSubtitle>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 mb-10"
            >
              <motion.button
                onClick={() => scrollTo('projects')}
                whileHover={{ y: -3, scale: 1.035, transition: { type: 'spring', stiffness: 480, damping: 24, mass: 0.5 } }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 520, damping: 26, mass: 0.5 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent text-bg text-[13.5px] font-medium hover:bg-accent/90 hover:shadow-[0_8px_20px_rgba(43,76,126,0.15)] transition-[background-color,box-shadow] duration-200 cursor-pointer focus:outline-none"
              >
                {lang === 'en' ? 'View projects' : 'Lihat proyek'} <span>→</span>
              </motion.button>
              <motion.button
                onClick={() => scrollTo('writing')}
                whileHover={{ y: -3, scale: 1.035, transition: { type: 'spring', stiffness: 480, damping: 24, mass: 0.5 } }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 520, damping: 26, mass: 0.5 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-surface/80 hover:border-highlight/30 bg-surface/10 hover:bg-surface/30 text-primary text-[13.5px] transition-[background-color,border-color] duration-200 cursor-pointer focus:outline-none"
              >
                {lang === 'en' ? 'Read writing' : 'Baca tulisan'}
              </motion.button>
            </motion.div>

            {/* Socials */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 flex-wrap"
            >
              {[
                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/faizuddarains/', icon: <Linkedin className="w-3 h-3" /> },
                { label: 'GitHub', href: 'https://github.com/faizsyam', icon: <Github className="w-3 h-3" /> },
                { label: 'Instagram', href: 'https://www.instagram.com/faizuddarains/', icon: <Instagram className="w-3 h-3" /> },
                { label: 'Email', href: 'mailto:faizsyam06@gmail.com', icon: <Mail className="w-3 h-3" /> },
              ].map(({ label, href, icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, transition: { type: 'spring', stiffness: 480, damping: 24, mass: 0.5 } }}
                  whileTap={{ scale: 0.95, transition: { type: 'spring', stiffness: 680, damping: 22, mass: 0.45 } }}
                  transition={{ type: 'spring', stiffness: 450, damping: 14 }}
                  className="inline-flex items-center gap-1.5 text-[12px] text-secondary hover:text-primary px-3 py-1.5 rounded-full border border-surface/50 hover:border-primary hover:shadow-[0_4px_12px_rgba(24,24,21,0.06)] bg-white/20 hover:bg-white/60 transition-[border-color,background-color,box-shadow,color] duration-150"
                >
                  {icon} {label}
                </motion.a>
              ))}
            </motion.div>

            {/* Mobile portrait panel -- visible only on screens smaller than lg */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 520, damping: 26, mass: 0.5 } }}
              whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 680, damping: 22, mass: 0.45 } }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex lg:hidden flex-col sm:flex-row gap-5 items-center sm:items-start p-5 mt-10 rounded-2xl border border-surface/60 bg-white hover:border-highlight/30 hover:shadow-md transition-all duration-300 shadow-sm cursor-pointer group"
            >
              <PortraitReveal
                baseSrc="/images/profile_1.webp"
                revealSrc="/images/profile_2.webp"
                alt="Faiz portrait"
                className="w-28 h-28 sm:w-32 sm:h-36 rounded-xl flex-shrink-0 relative"
                aspectRatioClass=""
              />
              <div className="flex-1 text-center sm:text-left flex flex-col gap-1.5">
                <p className="text-[14px] font-semibold text-primary tracking-tight">Faizuddarain Syam</p>
                <p className="text-[10px] text-highlight font-mono uppercase tracking-widest font-bold">
                  {lang === 'en' ? 'ML Engineer · Remote Available' : 'ML Engineer · Tersedia Remote'}
                </p>
                <p className="text-[12px] text-secondary leading-relaxed font-light">
                  MSc in Data Science in Engineering.
                </p>
                <div className="flex flex-wrap gap-1 items-center justify-center sm:justify-start mt-1">
                  {['Agentic AI', 'Deep Learning', 'Product Design', 'Data Analytics'].map((tag) => (
                    <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface/50 border border-surface text-secondary/80">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right — profile panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex flex-col gap-4 w-full"
          >
            {/* Photo card styled as a vintage physical specimen/draft slide */}
            <motion.div
              whileHover={{ y: -6, transition: { type: 'spring', stiffness: 520, damping: 26, mass: 0.5 } }}
              whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 680, damping: 22, mass: 0.45 } }}
              className="rounded-2xl border border-surface/60 bg-white p-3 hover:border-highlight/30 hover:shadow-lg transition-all duration-300 group cursor-pointer shadow-sm"
            >
              <PortraitReveal
                baseSrc="/images/profile_1.webp"
                revealSrc="/images/profile_2.webp"
                alt="Faiz portrait"
                aspectRatioClass="aspect-[4/5]"
              />
              <div className="mt-3 px-1">
                <p className="text-[14px] font-semibold text-primary tracking-tight">Faizuddarain Syam</p>
                <p className="text-[10px] text-highlight mt-0.5 font-mono uppercase tracking-widest font-bold">
                  {lang === 'en' ? 'Jakarta · Remote Available' : 'Jakarta · Tersedia Remote'}
                </p>
                <p className="text-[11.5px] text-secondary mt-1.5 leading-relaxed font-light">
                  MSc in Data Science in Engineering.
                </p>
                
                {/* Core focus tags inside the card */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {['Agentic AI', 'Deep Learning', 'Product Design', 'Data Analytics'].map((tag) => (
                    <span key={tag} className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-surface/50 border border-surface text-secondary/90">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ── ABOUT ── */}
        <section className="scroll-mt-14" id="about">
          {/* Section Title above the columns */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3, margin: '-40px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3 mb-10"
          >
            <div className="flex items-center justify-between border-b border-surface/60 pb-3">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary/70 font-medium">{t('briefIntro')}</span>
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary/70 font-medium">{t('background')}</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-primary leading-snug mt-1">
              {lang === 'en' ? (
                <>At the intersection of<br className="hidden sm:block" /> <span className="text-highlight">AI, human, and creativity</span></>
              ) : (
                <>Di persimpangan antara<br className="hidden sm:block" /> <span className="text-highlight">AI, manusia, dan kreativitas</span></>
              )}
            </h2>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-16">
            {/* Left Column: Paragraphs only */}
            <div className="flex flex-col gap-5 text-[14.5px] sm:text-[15.5px] leading-relaxed text-primary/90 font-light lg:max-w-[440px] lg:flex-shrink-0 w-full">
              {(lang === 'en' ? [
                "I am an AI/ML Engineer. I build and deploy intelligent systems, and I care deeply about the engineering behind them, from system architecture and low latency to reliable outputs. Building systems that work, scale, and deliver value is non-negotiable.",
                "But in a time when AI capability is widely available. As the technical barrier gets lower, technology alone becomes less of a differentiator. What separates great products from average ones is not just capability, but the implementation and taste.",
                "That's why beyond AI and engineering, my skills covers human-centered design and creativity. A product succeeds not only because it works, but because people understand it, trust it, and enjoy using it."
              ] : [
                "Saya adalah seorang AI/ML Engineer. Saya membangun dan menerapkan sistem cerdas, dan saya sangat peduli dengan rekayasa di baliknya—mulai dari arsitektur sistem dan latensi rendah hingga keluaran yang andal. Membangun sistem yang berfungsi, berskala, dan memberikan nilai adalah hal yang mutlak.",
                "Namun di masa ketika kapabilitas AI telah tersedia secara luas. Seiring dengan semakin rendahnya hambatan teknis, teknologi saja tidak lagi menjadi pembeda utama. Apa yang membedakan produk hebat dari yang biasa bukanlah sekadar kapabilitas, melainkan implementasi dan selera desain.",
                "Itulah mengapa di luar AI dan rekayasa, keahlian saya mencakup desain yang berpusat pada manusia dan kreativitas. Sebuah produk berhasil bukan hanya karena berfungsi dengan baik, tetapi karena orang-orang memahaminya, memercayainya, dan senang menggunakannya."
              ]).map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.3, margin: '-40px' }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
                >
                  {p}
                </motion.p>
              ))}

              {/* Inquiry Read More Button */}
              <motion.button
                onClick={() => setIsIntroArticleOpen(true)}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3, margin: '-40px' }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.36 }}
                className="mt-3.5 group flex items-center gap-1.5 text-xs font-mono font-bold text-[#153d82] hover:text-[#081d45] transition-all duration-150 self-start cursor-pointer focus:outline-none"
              >
                <span>{lang === 'en' ? 'Read More' : 'Baca Selengkapnya'}</span>
                <span className="transition-transform duration-150 group-hover:translate-x-0.5 text-[#153d82]/60 group-hover:text-[#081d45]">→</span>
              </motion.button>
            </div>

            {/* Right Column: Venn Diagram */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3, margin: '-40px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              className="flex-1 min-w-0 w-full lg:max-w-[720px] xl:max-w-[820px]"
            >
              <VennDiagram lang={lang} />
            </motion.div>
          </div>
        </section>

        {/* ── WORK & EDUCATION ── */}
        <section id="work" className="flex flex-col gap-10 scroll-mt-14">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3, margin: '-40px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 border-b border-surface/60 pb-3"
          >
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary/70 font-medium">Professional & Educational Arc</span>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary/70 font-medium ml-auto">Background</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Work column */}
            {[
              { 
                title: lang === 'en' ? 'Work Experience' : 'Pengalaman Kerja', 
                items: WORK_ITEMS, 
                latestId: 'work-1', 
                badge: lang === 'en' ? 'Current Role' : 'Peran Sekarang' 
              },
              { 
                title: lang === 'en' ? 'Academy' : 'Pendidikan',
                items: EDUCATION_ITEMS, 
                latestId: 'edu-1', 
                badge: lang === 'en' ? 'Latest' : 'Terbaru' 
              },
            ].map(({ title, items, latestId, badge }) => {
              const isWorkCol = title === 'Work Experience' || title === 'Pengalaman Kerja';
              const visibleItems = isWorkCol ? items.slice(0, 2) : items;
              const hiddenItems = isWorkCol ? items.slice(2) : [];

              return (
                <div key={title} className="flex flex-col gap-5">
                  <h4 className="text-[10.5px] font-mono tracking-widest uppercase text-highlight">{title}</h4>
                  <div className="relative flex flex-col gap-5 pl-6 border-l border-dashed border-highlight/30 ml-3.5 py-3">
                    <div className="absolute -left-[3px] top-0 w-1.5 h-1.5 rounded-full bg-highlight/60" />
                    <div className="absolute -left-[3px] bottom-0 w-1.5 h-1.5 rounded-full bg-highlight/60" />

                    {visibleItems.map((item: BackgroundItem, idx: number) => {
                      const isLatest = item.id === latestId;
                      return (
                        <motion.div
                          key={item.id}
                          id={`timeline-item-${item.id}`}
                          custom={idx}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: false, margin: '-85px' }}
                          variants={timelineVariants}
                          whileHover={{ y: -4, transition: { type: 'spring', stiffness: 520, damping: 26, mass: 0.5 } }}
                          whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 680, damping: 22, mass: 0.45 } }}
                          transition={{ type: 'spring', stiffness: 520, damping: 26, mass: 0.5 }}
                          onMouseEnter={() => setHoveredTimelineId(item.id)}
                          onMouseLeave={() => setHoveredTimelineId(null)}
                          onClick={() => handleTimelineClick(item)}
                          className={`relative flex flex-col gap-1 -mx-4 rounded-xl border cursor-pointer group transition-[border-color,background-color,box-shadow] duration-150 shadow-sm ${
                            isLatest
                              ? 'p-0 border-highlight/30 bg-white shadow-sm hover:border-highlight/45 hover:shadow-md'
                              : 'p-4 border-surface/60 bg-white hover:border-highlight/30'
                          }`}
                        >
                          {/* Emblem — uses real logo when available */}
                          <div className={`absolute -left-[35px] top-[14px] w-11 h-11 rounded-full border flex items-center justify-center overflow-hidden transition-[border-color,background-color,box-shadow] duration-300 z-10 ${
                            isLatest
                              ? 'border-highlight/60 bg-white group-hover:bg-highlight group-hover:border-highlight group-hover:shadow-[0_2px_8px_rgba(43,76,126,0.3)]'
                              : 'border-highlight/25 dark:border-highlight/45 bg-white group-hover:border-highlight/60 group-hover:bg-bg'
                          }`}>
                            {item.logoPath ? (
                              <img src={item.logoPath} alt="" className="w-7 h-7 object-contain" />
                            ) : (
                              renderTimelineLogo(item.id, isLatest)
                            )}
                          </div>

                          {isLatest && (
                            <div className="w-full h-24 sm:h-28 overflow-hidden rounded-t-[10px] relative border-b border-surface/40">
                              <img
                                src={item.id === 'work-1' ? '/images/insignia.webp' : '/images/tue.webp'}
                                alt={`${item.role} Banner`}
                                className="w-full h-full object-cover select-none pointer-events-none group-hover:scale-106 transition-transform duration-700 ease-out"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent mix-blend-multiply opacity-25" />
                            </div>
                          )}

                          <div className={`flex-1 flex flex-col gap-0.5 ${isLatest ? 'p-5' : 'pl-2'}`}>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[10px] font-mono tracking-widest uppercase ${isLatest ? 'text-highlight font-semibold' : 'text-secondary/70'}`}>
                                {item.dateRange}
                              </span>
                              {isLatest && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-mono text-highlight bg-highlight/[0.07] border border-highlight/20 px-2 py-0.5 rounded-full">
                                  <span className="relative flex h-1.5 w-1.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-highlight/40 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-highlight" />
                                  </span>
                                  {badge}
                                </span>
                              )}
                            </div>
                            <h5 className={`text-[14.5px] font-sans font-medium transition-colors duration-150 ${isLatest ? 'text-primary group-hover:text-highlight' : 'text-primary group-hover:text-accent'}`}>
                              {item.role}
                            </h5>
                            <span className="text-[12.5px] text-secondary font-light group-hover:text-primary/80 transition-colors duration-150">
                              {item.organization}
                            </span>

                            {/* Rich secondary layer: first-level summary outline right in the card */}
                            <p className="text-[12px] text-secondary/75 font-light leading-relaxed mt-2 line-clamp-2 border-l border-surface/80 pl-2.5 group-hover:border-highlight/30 group-hover:text-secondary transition-all">
                              {item.popoutCopy}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}

                    {hiddenItems.length > 0 && (
                      <div className="flex flex-col gap-4 mt-2">
                        {/* Dropdown Toggle Button */}
                        <button
                          onClick={() => setIsWorkExpanded(!isWorkExpanded)}
                          className="group/btn flex items-center gap-1.5 self-start py-1.5 px-3 -ml-3 rounded-lg text-left transition-all duration-150 cursor-pointer text-secondary/70 hover:text-highlight"
                        >
                          <span className="text-[11px] font-mono tracking-wider uppercase font-semibold">
                            {isWorkExpanded 
                              ? (lang === 'en' ? "Hide previous roles" : "Sembunyikan peran sebelumnya") 
                              : (lang === 'en' ? "Previous roles" : "Peran sebelumnya")}
                          </span>
                          <motion.div
                            animate={{ rotate: isWorkExpanded ? 180 : 0 }}
                            transition={{ type: 'spring', stiffness: 520, damping: 26, mass: 0.5 }}
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </motion.div>
                        </button>

                        {/* Collapsible Content */}
                        <AnimatePresence initial={false}>
                          {isWorkExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
                              animate={{ 
                                height: "auto", 
                                opacity: 1,
                                transitionEnd: { overflow: 'visible' }
                              }}
                              exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
                              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                              className="relative z-10 flex flex-col gap-5 mt-1 pl-11 -ml-11 pr-6 -mr-6"
                            >
                              {hiddenItems.map((item: BackgroundItem, hIdx: number) => {
                                const isLatest = false;
                                const idx = visibleItems.length + hIdx;
                                return (
                                  <motion.div
                                    key={item.id}
                                    id={`timeline-item-${item.id}`}
                                    custom={idx}
                                    initial="hidden"
                                    animate="visible"
                                    variants={timelineVariants}
                                    whileHover={{ y: -4, transition: { type: 'spring', stiffness: 520, damping: 26, mass: 0.5 } }}
                                    whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 680, damping: 22, mass: 0.45 } }}
                                    onMouseEnter={() => setHoveredTimelineId(item.id)}
                                    onMouseLeave={() => setHoveredTimelineId(null)}
                                    onClick={() => handleTimelineClick(item)}
                                    className="relative flex flex-col gap-1 p-4 -mx-4 rounded-xl border cursor-pointer border-surface/60 bg-white shadow-sm hover:border-highlight/30 group transition-all duration-300"
                                  >
                                    {/* Emblem */}
                                    <div className="absolute -left-[35px] top-[14px] w-11 h-11 rounded-full border flex items-center justify-center overflow-hidden transition-[border-color,background-color,box-shadow] duration-300 z-10 border-highlight/25 dark:border-highlight/45 bg-white group-hover:border-highlight/60 group-hover:bg-bg">
                                      {item.logoPath ? (
                                        <img src={item.logoPath} alt="" className="w-7 h-7 object-contain" />
                                      ) : (
                                        renderTimelineLogo(item.id, isLatest)
                                      )}
                                    </div>

                                    <div className="flex-1 flex flex-col gap-0.5 pl-2">
                                      <span className="text-[10px] font-mono tracking-widest uppercase text-secondary/70">
                                        {item.dateRange}
                                      </span>
                                      <h5 className="text-[14.5px] font-sans font-medium transition-colors duration-150 text-primary group-hover:text-accent">
                                        {item.role}
                                      </h5>
                                      <span className="text-[12.5px] text-secondary font-light group-hover:text-primary/80 transition-colors duration-150">
                                        {item.organization}
                                      </span>

                                      <p className="text-[12px] text-secondary/75 font-light leading-relaxed mt-2 line-clamp-2 border-l border-surface/80 pl-2.5 group-hover:border-highlight/30 group-hover:text-secondary transition-all">
                                        {item.popoutCopy}
                                      </p>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {!isWorkCol && (
                      <div className="flex flex-col gap-4 mt-2">
                        {/* Dropdown Toggle Button */}
                        <button
                          onClick={() => setIsEduExpanded(!isEduExpanded)}
                          className="group/btn flex items-center gap-1.5 self-start py-1.5 px-3 -ml-3 rounded-lg text-left transition-all duration-150 cursor-pointer text-secondary/70 hover:text-highlight"
                        >
                          <span className="text-[11px] font-mono tracking-wider uppercase font-semibold">
                            {isEduExpanded 
                              ? (lang === 'en' ? "Hide credentials" : "Sembunyikan kredensial") 
                              : (lang === 'en' ? "Other Credentials" : "Kredensial Lainnya")}
                          </span>
                          <motion.div
                            animate={{ rotate: isEduExpanded ? 180 : 0 }}
                            transition={{ type: 'spring', stiffness: 520, damping: 26, mass: 0.5 }}
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </motion.div>
                        </button>

                        {/* Collapsible Content */}
                        <AnimatePresence initial={false}>
                          {isEduExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
                              animate={{ 
                                height: "auto", 
                                opacity: 1,
                                transitionEnd: { overflow: 'visible' }
                              }}
                              exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
                              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                              className="relative z-10 flex flex-col gap-5 mt-1 pl-11 -ml-11 pr-6 -mr-6"
                            >
                              {[
                                {
                                  id: 'cred-0',
                                  type: 'education' as 'education',
                                  role: 'ALSP & Holland Scholarship',
                                  organization: 'Eindhoven University of Technology (TU/e)',
                                  dateRange: '2020 - 2022',
                                  popoutCopy: lang === 'en'
                                    ? 'Highly prestigious, fully-funded double scholarship awarded for exceptional academic records to pursue a Master of Science degree at TU/e.'
                                    : 'Beasiswa ganda legendaris dan didanai penuh yang diberikan atas prestasi akademis luar biasa untuk menempuh gelar Master of Science di TU/e.',
                                  details: lang === 'en'
                                    ? 'The Amandus H. Lundqvist Scholarship Program (ALSP) combined with the Holland Scholarship fully covered tuition fees and generated living stipends for the 2-year MSc curriculum.'
                                    : 'Program Beasiswa Amandus H. Lundqvist (ALSP) yang digabungkan dengan Beasiswa Holland mencakup biaya kuliah penuh dan biaya hidup untuk kurikulum MSc selama 2 tahun.',
                                  highlights: lang === 'en' ? [
                                    'Full Sponsor: 100% tuition coverage and monthly allowance funding for the full Master program.',
                                    'Academic Excellence: Selective competitive merit-based entry granted to top-percentile international applications.',
                                    'Industrial Integration: Connected with regional brainport technology leaders and corporate sponsors.'
                                  ] : [
                                    'Sponsor Penuh: Cakupan biaya kuliah 100% dan pendanaan saku bulanan untuk seluruh program Master.',
                                    'Keunggulan Akademis: Penerimaan berbasis prestasi kompetitif yang selektif diberikan kepada pemohon internasional persentil teratas.',
                                    'Integrasi Industri: Terhubung dengan para pemimpin teknologi regional Brainport dan sponsor perusahaan.'
                                  ],
                                  logoPath: '/logos/tue.png',
                                  skills: ['Academic Excellence', 'Research Funding', 'Technical Engineering', 'Data Science & Engineering']
                                },
                                {
                                  id: 'cred-1',
                                  type: 'education' as 'education',
                                  role: lang === 'en' ? 'Data Science & Machine Learning Course' : 'Kursus Ilmu Data & Pembelajaran Mesin',
                                  organization: 'Purwadhika Digital Technology School',
                                  dateRange: 'Feb - Mar 2020',
                                  popoutCopy: lang === 'en' 
                                    ? 'Intensive professional program focusing on end-to-end data analysis, database querying, and regression/classification modeling.'
                                    : 'Program profesional intensif dengan fokus pada analisis data ujung-ke-ujung, kueri basis data, dan pemodelan regresi/klasifikasi.',
                                  details: lang === 'en'
                                    ? 'Completed high-intensity professional certificate program covering predictive analytics, supervised learning, data validation, exploratory stats, and optimal SQL joining pipelines.'
                                    : 'Menyelesaikan program sertifikat profesional intensitas tinggi yang mencakup analitik prediktif, pembelajaran terarah, validasi data, statistik eksploratif, dan pipeline penggabungan SQL yang optimal.',
                                  highlights: lang === 'en' ? [
                                    'Predictive Modeling: Formulated regression and classification solutions with clean optimization loops.',
                                    'Database Querying: Integrated structured multi-table SQL querying systems to format analytics databases.',
                                    'Exploratory Analytics: Formulated deep EDA pipelines to discover user engagement patterns.'
                                  ] : [
                                    'Pemodelan Prediktif: Memformulasikan solusi regresi dan klasifikasi dengan loop optimasi yang bersih.',
                                    'Kueri Basis Data: Mengintegrasikan sistem kueri SQL multi-tabel terstruktur untuk memformat basis data analitik.',
                                    'Analisis Eksploratif: Memformulasikan pipeline EDA mendalam untuk menemukan pola keterlibatan pengguna.'
                                  ],
                                  skills: ['Data Science', 'Machine Learning', 'Python', 'SQL', 'Data Analytics']
                                },
                                {
                                  id: 'cred-2',
                                  type: 'education' as 'education',
                                  role: 'IELTS Academic',
                                  organization: 'British Council / IDP IELTS',
                                  dateRange: 'Jan 2020',
                                  popoutCopy: lang === 'en'
                                    ? 'Attained an overall Band Score of 7.0, validating professional and academic command of the English language.'
                                    : 'Meraih Skor Band keseluruhan 7.0, memvalidasi penguasaan bahasa Inggris tingkat profesional dan akademis.',
                                  details: lang === 'en'
                                    ? 'Validated certified academic level fluency, supporting research reporting and collaborative software development.'
                                    : 'Kemampuan berbahasa Inggris bersertifikat tingkat akademis yang terverifikasi, mendukung pelaporan penelitian dan pengembangan perangkat lunak kolaboratif.',
                                  highlights: lang === 'en' ? [
                                    'Academic Level Competencies: Efficient technical translation and literature summarization under time limits.',
                                    'International Collaborations: Fluid conversation capability supporting worldwide engineering sprints.',
                                    'Score: Listening 7.5, Reading 7.5, Writing 6.0, Speaking 6.5 — Overall Band: 7.0'
                                  ] : [
                                    'Kompetensi Tingkat Akademis: Penerjemahan teknis dan ringkasan literatur yang efisien di bawah batas waktu.',
                                    'Kolaborasi Internasional: Kemampuan percakapan yang lancar mendukung sprint teknik di seluruh dunia.',
                                    'Skor: Mendengarkan 7.5, Membaca 7.5, Menulis 6.0, Berbicara 6.5 — Band Keseluruhan: 7.0'
                                  ],
                                  skills: ['English Proficiency', 'Academic Reading', 'Technical Writing', 'International Communication']
                                }
                              ].map((item: BackgroundItem, cIdx: number) => {
                                const isLatest = false;
                                const idx = visibleItems.length + cIdx;
                                return (
                                  <motion.div
                                    key={item.id}
                                    id={`timeline-item-${item.id}`}
                                    custom={idx}
                                    initial="hidden"
                                    animate="visible"
                                    variants={timelineVariants}
                                    whileHover={{ y: -4, transition: { type: 'spring', stiffness: 520, damping: 26, mass: 0.5 } }}
                                    whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 680, damping: 22, mass: 0.45 } }}
                                    onMouseEnter={() => setHoveredTimelineId(item.id)}
                                    onMouseLeave={() => setHoveredTimelineId(null)}
                                    onClick={() => handleTimelineClick(item)}
                                    className="relative flex flex-col gap-1 p-4 -mx-4 rounded-xl border cursor-pointer border-surface/60 bg-white shadow-sm hover:border-highlight/30 group transition-all duration-300"
                                  >
                                    {/* Emblem */}
                                    <div className="absolute -left-[35px] top-[14px] w-11 h-11 rounded-full border flex items-center justify-center overflow-hidden transition-[border-color,background-color,box-shadow] duration-300 z-10 border-highlight/25 dark:border-highlight/45 bg-white group-hover:border-highlight/60 group-hover:bg-bg">
                                      {item.logoPath ? (
                                        <img src={item.logoPath} alt="" className="w-7 h-7 object-contain" />
                                      ) : (
                                        renderTimelineLogo(item.id, isLatest)
                                      )}
                                    </div>

                                    <div className="flex-1 flex flex-col gap-0.5 pl-2">
                                      <span className="text-[10px] font-mono tracking-widest uppercase text-secondary/70">
                                        {item.dateRange}
                                      </span>
                                      <h5 className="text-[14.5px] font-sans font-medium transition-colors duration-150 text-primary group-hover:text-accent">
                                        {item.role}
                                      </h5>
                                      <span className="text-[12.5px] text-secondary font-light group-hover:text-primary/80 transition-colors duration-150">
                                        {item.organization}
                                      </span>

                                      <p className="text-[12px] text-secondary/75 font-light leading-relaxed mt-2 line-clamp-2 border-l border-surface/80 pl-2.5 group-hover:border-highlight/30 group-hover:text-secondary transition-all">
                                        {item.popoutCopy}
                                      </p>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section id="projects" className="flex flex-col gap-10 scroll-mt-14">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 border-b border-surface/60 pb-3"
          >
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary/70 font-medium">Selected Works</span>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary/70 font-medium ml-auto">Built & Research</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {PROJECTS.map((project, idx) => {
              // High contrast status styling
              const getStatusStyle = (status: string) => {
                if (status === 'Completed') return 'text-[#2B4C7E] bg-[#EBF1FA] border border-[#BFCEE2]';
                if (status === 'Research') return 'text-[#9A6200] bg-[#FFF8EB] border border-[#F5DFBF]';
                return 'text-[#16785A] bg-[#EDF7F4] border border-[#C2E3D8]'; // Active
              };

              return (
                <motion.div
                  key={project.id}
                  id={`project-card-${project.id}`}
                  onClick={() => setSelectedProject(project)}
                  custom={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: '-85px' }}
                  variants={cardVariants}
                  whileHover={{ y: -6, transition: { type: 'spring', stiffness: 520, damping: 26, mass: 0.5 } }}
                  whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 680, damping: 22, mass: 0.45 } }}
                  className="group relative flex flex-col gap-5 p-5 sm:p-6 rounded-2xl border border-surface/60 bg-white cursor-pointer hover:border-highlight/40 hover:shadow-lg transition-all duration-300 interactive-item shadow-sm"
                >
                  <div className="flex flex-col gap-2.5 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-[16.5px] font-sans text-primary group-hover:text-highlight transition-colors duration-150 font-semibold flex items-center gap-1.5 leading-tight">
                        {project.name}
                        <ArrowUpRight className="w-4 h-4 opacity-0 scale-50 -translate-x-1.5 translate-y-1.5 group-hover:opacity-90 group-hover:scale-100 group-hover:translate-x-0 group-hover:translate-y-0 text-highlight flex-shrink-0 group-hover:rotate-12 transition-all duration-300" />
                      </h4>
                      <span className={`text-[9.5px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full flex-shrink-0 font-bold group-hover:scale-105 transition-all duration-300 ${getStatusStyle(project.status)}`}>
                        {project.status}
                      </span>
                    </div>

                    <p className="text-[13.5px] sm:text-[14px] leading-relaxed text-[#2C3E50] font-light">
                      {project.subtitle}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.domainTags.map((tag: string, i: number) => (
                        <span key={i} className="text-[9.5px] font-mono tracking-wider uppercase text-[#33465C] px-2.5 py-0.5 bg-[#F2F4F7] border border-[#DEE2E6] rounded-md font-semibold group-hover:bg-white group-hover:text-highlight group-hover:border-[#CCD5E4] transition-all duration-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {project.imagePath && (
                    <div className="w-full h-44 rounded-xl border border-[#DEE2E6] overflow-hidden relative bg-surface/20">
                      {/* Add a subtle technical grid inside the image container to accent ML focus */}
                      <div className="absolute inset-0 bg-grid-fine opacity-20 pointer-events-none z-10" />
                      <img
                        src={project.imagePath}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 opacity-[0.88] group-hover:opacity-100 mix-blend-multiply"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#181815]/5 via-transparent to-transparent opacity-80 group-hover:from-transparent transition-all duration-500" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── WRITING ── */}
        <section id="writing" className="flex flex-col gap-10 scroll-mt-14">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 border-b border-surface/60 pb-3"
          >
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary/70 font-medium">Curated Writing</span>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary/70 font-medium ml-auto">Rigorous Frames</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {WRITINGS.map((write: Writing, idx: number) => {
              const isHovered = hoveredWritingId === write.id;
              const isExpanded = expandedWritingId === write.id;

              // Topic tag category color coding for high visual hierarchy separation
              const getTopicTagStyle = (tag: string) => {
                if (tag === 'Reinforcement Learning') return 'text-[#2B4C7E] bg-[#EBF1FA] border border-[#BFCEE2]';
                if (tag === 'RAG Pipelines') return 'text-[#16785A] bg-[#EDF7F4] border border-[#C2E3D8]';
                if (tag === 'LLM Agents') return 'text-[#5A3A6A] bg-[#F7F2F9] border border-[#DFCEE6]';
                return 'text-[#B45028] bg-[#FAF3F0] border border-[#F3DEC2]'; // Explainable AI / default
              };

              return (
                <motion.div
                  key={write.id}
                  id={`writing-item-${write.id}`}
                  custom={idx}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false, margin: '-85px' }}
                  variants={cardVariants}
                  whileHover={{ y: -6, transition: { type: 'spring', stiffness: 520, damping: 26, mass: 0.5 } }}
                  whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 680, damping: 22, mass: 0.45 } }}
                  onMouseEnter={() => setHoveredWritingId(write.id)}
                  onMouseLeave={() => setHoveredWritingId(null)}
                  onClick={(e) => handleWritingClick(write.id, e)}
                  className="group flex flex-col gap-4 p-5 rounded-2xl border border-surface/60 bg-white cursor-pointer transition-[border-color,background-color,box-shadow] duration-150 hover:bg-[#fafdfb] hover:border-highlight/50 hover:shadow-lg shadow-sm"
                >
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 border rounded-md font-bold transition-transform duration-300 group-hover:scale-102 ${getTopicTagStyle(write.topicTag)}`}>
                          {write.topicTag}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#4A607A] font-semibold group-hover:text-highlight transition-colors duration-250">{write.date}</span>
                    </div>

                    <h4 className="text-[15.5px] sm:text-[16.5px] font-serif tracking-tight text-primary group-hover:text-highlight transition-colors duration-150 font-semibold leading-snug">
                      <a href={write.link} target="_blank" rel="noopener noreferrer" className="flex items-start justify-between gap-2 focus:outline-none">
                        <span>{write.title}</span>
                        <ArrowUpRight className="h-4 w-4 opacity-0 scale-50 group-hover:opacity-90 group-hover:scale-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:rotate-12 transition-all duration-300 text-highlight hidden lg:block flex-shrink-0 mt-0.5" />
                      </a>
                    </h4>

                    <p className="text-[13.5px] text-[#2C3E50] leading-relaxed font-light">
                      {write.framing}
                    </p>

                    {/* Desktop hover extract */}
                    <AnimatePresence initial={false}>
                      {isHovered && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="hidden lg:block overflow-hidden"
                        >
                          <p className="text-[12.5px] leading-relaxed text-secondary border-l-2 border-highlight pl-3 mt-2 font-normal">
                            {write.excerpt}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {write.imagePath && (
                    <div className="w-full h-36 rounded-xl border border-[#DEE2E6] overflow-hidden relative bg-surface/20">
                      {/* Subtle blueprint drafts grid */}
                      <div className="absolute inset-0 bg-grid-fine opacity-20 pointer-events-none z-10" />
                      <img
                        src={write.imagePath}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 opacity-[0.88] group-hover:opacity-100 mix-blend-multiply"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#181815]/5 via-transparent to-transparent opacity-80 group-hover:from-transparent transition-all duration-500" />
                    </div>
                  )}

                  {/* Mobile expand */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22 }}
                        className="block lg:hidden overflow-hidden bg-surface/30 p-3 rounded-lg"
                      >
                        <p className="text-[13px] leading-relaxed text-secondary font-light mb-3">{write.excerpt}</p>
                        <a href={write.link} target="_blank" rel="noopener noreferrer" className="text-[11px] text-highlight font-mono inline-flex items-center gap-1 uppercase tracking-wider font-semibold">
                          {lang === 'en' ? 'Read on Medium' : 'Baca di Medium'} <ArrowUpRight className="h-3 w-3" />
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          <a
            href="https://faizsyam.medium.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start text-[12px] font-mono text-secondary hover:text-accent transition-colors duration-150 inline-flex items-center gap-1.5 uppercase tracking-wider hover:underline underline-offset-4 focus:outline-none"
          >
            {lang === 'en' ? '→ All writing on Medium' : '→ Semua tulisan di Medium'}
          </a>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="flex flex-col gap-10 scroll-mt-14">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-80px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 border-b border-surface/60 pb-3"
          >
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary/70 font-medium">
              {lang === 'en' ? 'Get In Touch' : 'Hubungi Saya'}
            </span>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary/70 font-medium ml-auto">
              {lang === 'en' ? 'Collab & Conversation' : 'Kolaborasi & Diskusi'}
            </span>
          </motion.div>

          <h3 className="text-2xl sm:text-3xl font-sans font-semibold tracking-tight text-primary leading-tight -mb-2">
            {t('letConnect')}
          </h3>

          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="flex flex-col gap-4 text-[14.5px] sm:text-[15px] leading-relaxed text-secondary/85 font-light lg:col-span-12 xl:col-span-5">
              <p>
                {t('contactLead')}
              </p>
              <p>
                {t('contactSecondary')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-span-7 w-full">
              {[
                {
                  id: 'email',
                  icon: <Mail className="w-4 h-4" />,
                  label: 'Email',
                  display: copied ? t('copiedDetails') : obfuscatedEmail,
                  href: `mailto:${obfuscatedEmail}`,
                  onClick: handleEmailClick,
                  brandClass: 'hover:border-highlight/35 hover:bg-[#f1f4f8]',
                  iconBgClass: 'bg-highlight/[0.06] text-highlight group-hover:bg-highlight group-hover:text-bg',
                  accentTextClass: 'group-hover:text-highlight',
                },
                {
                  id: 'linkedin',
                  icon: <Linkedin className="w-4 h-4" />,
                  label: 'LinkedIn',
                  display: 'faizuddarains',
                  href: 'https://www.linkedin.com/in/faizuddarains/',
                  brandClass: 'hover:border-[#0077B5]/35 hover:bg-[#f0f7fa]',
                  iconBgClass: 'bg-[#0077B5]/[0.06] text-[#0077B5] group-hover:bg-[#0077B5] group-hover:text-white',
                  accentTextClass: 'group-hover:text-[#0077B5]',
                },
                {
                  id: 'instagram',
                  icon: <Instagram className="w-4 h-4" />,
                  label: 'Instagram',
                  display: '@faizuddarains',
                  href: 'https://www.instagram.com/faizuddarains/',
                  brandClass: 'hover:border-[#E1306C]/35 hover:bg-[#fdf2f5]',
                  iconBgClass: 'bg-[#E1306C]/[0.06] text-[#E1306C] group-hover:bg-[#E1306C] group-hover:text-white',
                  accentTextClass: 'group-hover:text-[#E1306C]',
                },
                {
                  id: 'github',
                  icon: <Github className="w-4 h-4" />,
                  label: 'GitHub',
                  display: 'faizsyam',
                  href: 'https://github.com/faizsyam',
                  brandClass: 'hover:border-gray-900/30 hover:bg-[#f6f6f6] dark:hover:border-primary/30',
                  iconBgClass: 'bg-gray-900/[0.05] text-[#181815] dark:text-[#FFAF33] group-hover:bg-[#181815] dark:group-hover:bg-[#FFAF33] group-hover:text-white dark:group-hover:text-bg',
                  accentTextClass: 'group-hover:text-gray-950 dark:group-hover:text-primary',
                },
              ].map(({ id, icon, label, display, href, onClick, brandClass, iconBgClass, accentTextClass }: ContactLink, gridIdx: number) => (
                <motion.a
                  key={label}
                  href={href}
                  target={id !== 'email' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  onClick={onClick}
                  whileHover={{ y: -4, transition: { type: 'spring', stiffness: 520, damping: 26, mass: 0.5 } }}
                  whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 680, damping: 22, mass: 0.45 } }}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, margin: '-60px' }}
                  transition={{
                    type: 'spring',
                    stiffness: 180,
                    damping: 18,
                    delay: gridIdx * 0.08
                  }}
                  className={`group flex items-center justify-between p-4.5 rounded-xl border border-surface/60 bg-white hover:border-surface transition-all duration-300 shadow-sm hover:shadow-md ${brandClass}`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 flex-shrink-0 ${iconBgClass}`}>
                      {icon}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] font-mono tracking-wider uppercase text-secondary/50 font-medium">
                        {label}
                      </span>
                      <span className={`text-[13px] font-mono font-medium text-primary mt-0.5 truncate transition-colors duration-200 ${accentTextClass}`}>
                        {display}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight className={`h-4 w-4 text-secondary/35 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0 ${accentTextClass}`} />
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-10 pb-4 border-t border-surface/30 flex items-center justify-between select-none">
          <p className="text-[11.5px] text-secondary/50 font-mono">© Faizuddarain Syam · 2026</p>
          <span className="text-[10px] font-mono text-secondary/30 uppercase tracking-widest">AI · Human · Creativity</span>
        </footer>
      </main>

      <AnimatePresence>
        {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} lang={lang} />}
      </AnimatePresence>
      <AnimatePresence>
        {selectedBackground && <BackgroundModal item={selectedBackground} onClose={() => setSelectedBackground(null)} lang={lang} />}
      </AnimatePresence>
      <AnimatePresence>
        {isIntroArticleOpen && <IntroArticleModal isOpen={isIntroArticleOpen} onClose={() => setIsIntroArticleOpen(false)} lang={lang} />}
      </AnimatePresence>
    </div>
  );
}