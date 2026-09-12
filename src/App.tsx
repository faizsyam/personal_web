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
  HERO,
  INTRO,
  SECTION_LABELS,
  PROJECTS,
  BACKGROUND,
  WRITINGS,
  VENN,
  INTRO_SLIDES,
  CONTACT,
  UI,
} from './data/content';
import { Project, BackgroundItem, Writing } from './types';
import { localize } from './lib/localize';
import { getStatusStyle, getTopicTagStyle } from './lib/styles';
import { lookupIcon } from './lib/sectionIcons';

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

import { useGsapScroll } from './hooks/useGsapScroll';

// Animation constants at module level
const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];
const easeSnappy: [number, number, number, number] = [0.0, 0, 0.2, 1];

const timelineVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: easeSnappy,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easeSnappy,
    },
  },
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
  const [showMoreProjects, setShowMoreProjects] = useState(false);
  const [copied, setCopied] = useState(false);

  // Language with localStorage persistence
  const { lang, toggleLang } = useLanguage();

  // Scroll spy with RAF debouncing
  const activeSection = useScrollSpy(['about', 'work', 'projects', 'writing', 'contact'], {
    threshold: 180,
    headerOffset: 56,
  });

  // GSAP ScrollTrigger scroll-driven animations
  useGsapScroll();

  useEffect(() => {
    // Standardizing on light mode as requested
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('theme');
  }, []);

  const scrollTo = useScrollTo(56);

  // Handlers
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('faizsyam06@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
    window.location.href = `mailto:faizsyam06@gmail.com`;
  };

  const handleTimelineClick = (item: BackgroundItem) => setSelectedBackground(item);

  const handleWritingClick = (id: string, e: React.MouseEvent) => {
    if (window.innerWidth < 1024) {
      e.preventDefault();
      setExpandedWritingId(expandedWritingId === id ? null : id);
    }
  };

  return (
    <div className="relative min-h-screen bg-bg isolate selection:bg-highlight/10 selection:text-highlight select-none md:select-text flex flex-col text-primary overflow-x-hidden">
      {/* Dynamic interactive background drawing grids and micro-sparks on cursor hover */}
      <InteractiveGridBackground />

      {/* Ambient lights - reduced size and blur for perf */}
      <div className="fixed top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-highlight/[0.03] blur-[80px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-[300px] h-[300px] rounded-full bg-accent/[0.02] blur-[70px] pointer-events-none -z-10" />

      <CustomCursor />
      <FloatingNav activeSection={activeSection} lang={lang} />

      {/* NAV — fixed height so scrollY never jumps when activeSection flips */}
      <header
        className={`sticky top-0 z-30 w-full h-14 transition-[background-color,border-color] duration-200 ${
          activeSection === 'home'
            ? 'border-b border-transparent bg-transparent'
            : 'border-b border-surface/40 bg-bg/85 backdrop-blur-md'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 h-full flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-[14px] font-serif font-medium tracking-tight text-primary hover:text-accent transition-all duration-300 cursor-pointer focus:outline-none"
          >
            <span className="w-6 h-6 border border-surface/80 rounded flex items-center justify-center text-[11px] font-mono text-secondary">F</span>
            Faiz
          </button>

          <nav className="hidden sm:flex items-center gap-8 sm:gap-10">
            {SECTION_LABELS.navItems.map((navItem) => (
              <motion.button
                key={navItem.id}
                onClick={() => scrollTo(navItem.id)}
                whileHover={{ y: -3, transition: { type: 'spring', stiffness: 500, damping: 22, mass: 0.3 } }}
                whileTap={{ scale: 0.95, transition: { type: 'spring', stiffness: 600, damping: 20, mass: 0.3 } }}
                transition={{
                  type: 'spring',
                  stiffness: 480,
                  damping: 12,
                  mass: 0.7
                }}
                className={`text-[10px] sm:text-[11px] font-sans font-semibold uppercase tracking-widest transition-colors duration-150 cursor-pointer focus:outline-none relative py-1 ${
                  activeSection === navItem.id ? 'text-primary' : 'text-secondary hover:text-primary'
                }`}
              >
                {localize({ en: navItem.labelEn, id: navItem.labelId }, lang)}
                {activeSection === navItem.id && (
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

      <main className="w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col gap-32 sm:gap-40 relative z-10">

        {/* ── HERO ── */}
        <section id="home" className="relative grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 lg:gap-16 min-h-screen min-h-[calc(100vh-56px)] pt-14 sm:pt-18 lg:pt-20">

          {/* Left */}
          <div className="flex flex-col justify-between lg:justify-start min-h-0">
            <div className="flex flex-col gap-8 lg:gap-10 pt-4 lg:pt-0">
              {/* Name Sticker */}
              <HelloSticker />

              {/* Description */}
              <InteractiveSubtitle className="max-w-[550px] leading-relaxed font-light">
                {(() => {
                const headline = localize({ en: HERO.tagline.headlineEn, id: HERO.tagline.headlineId }, lang);
                const tail = localize({ en: HERO.tagline.tailEn, id: HERO.tagline.tailId }, lang);
                const highlightWords = localize({ en: HERO.tagline.highlightWordsEn, id: HERO.tagline.highlightWordsId }, lang);
                const words = headline.split(' ');
                return (
                  <span className="flex flex-col gap-3.5 text-left">
                    <div
                      className="relative inline-block text-[22px] sm:text-[26px] font-serif font-semibold text-highlight leading-snug tracking-tight cursor-default px-2 py-0.5 -mx-2 rounded-lg select-all whitespace-normal"
                    >
                      {words.map((word, i, arr) => {
                        const isHighlight = highlightWords.includes(word);
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
                                  delay: i * 0.12 + 0.55,
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
                    <span className="text-[16px] sm:text-[18px]">{tail}</span>
                  </span>
                );
              })()}
            </InteractiveSubtitle>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 mb-10"
            >
              {HERO.ctas.map((cta, idx) => (
                <motion.button
                  key={cta.target}
                  onClick={() => scrollTo(cta.target)}
                  whileHover={{ y: -3, scale: 1.035, transition: { type: 'spring', stiffness: 500, damping: 22, mass: 0.3 } }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 22, mass: 0.3 }}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13.5px] font-medium transition-all duration-200 cursor-pointer focus:outline-none ${idx === 0 ? 'bg-accent text-bg hover:bg-accent/90 hover:shadow-[0_8px_20px_rgba(43,76,126,0.15)]' : 'border border-surface/80 hover:border-highlight/30 bg-surface/10 hover:bg-surface/30 text-primary'}`}
                >
                  {localize({ en: cta.labelEn, id: cta.labelId }, lang)} <span>→</span>
                </motion.button>
              ))}
            </motion.div>

            {/* Socials */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2 flex-wrap"
            >
              {HERO.socials.map((social, idx) => {
                const Icon = social.label === 'LinkedIn' ? Linkedin : social.label === 'GitHub' ? Github : social.label === 'Instagram' ? Instagram : Mail;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, transition: { type: 'spring', stiffness: 500, damping: 22, mass: 0.3 } }}
                    whileTap={{ scale: 0.95, transition: { type: 'spring', stiffness: 600, damping: 20, mass: 0.3 } }}
                    transition={{ type: 'spring', stiffness: 450, damping: 14 }}
                    className="inline-flex items-center gap-1.5 text-[12px] text-secondary hover:text-primary px-3 py-1.5 rounded-full border border-surface/50 hover:border-primary hover:shadow-[0_4px_12px_rgba(24,24,21,0.06)] bg-white/20 hover:bg-white/60 transition-[border-color,background-color,box-shadow,color] duration-150"
                  >
                    <Icon className="w-3 h-3" /> {social.label}
                  </motion.a>
                );
              })}
            </motion.div>

            {/* Mobile portrait panel -- visible only on screens smaller than lg */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4, transition: { type: 'spring', stiffness: 500, damping: 22, mass: 0.3 } }}
              whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 600, damping: 20, mass: 0.3 } }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex lg:hidden flex-col sm:flex-row gap-5 items-center sm:items-start p-5 mt-auto rounded-2xl border border-surface/60 bg-white hover:border-highlight/30 hover:shadow-md transition-all duration-300 shadow-sm cursor-pointer group"
            >
              <PortraitReveal
                baseSrc="/images/profile_1.webp"
                revealSrc="/images/profile_2.webp"
                alt="Faiz portrait"
                className="w-28 h-28 sm:w-32 sm:h-36 rounded-xl flex-shrink-0 relative"
                aspectRatioClass=""
              />
              <div className="flex-1 text-center sm:text-left flex flex-col gap-1.5">
                <p className="text-[14px] font-semibold text-primary tracking-tight">{HERO.profile.name}</p>
                <p className="text-[10px] text-highlight font-mono uppercase tracking-widest font-bold">{localize({ en: HERO.profile.subtitleEn, id: HERO.profile.subtitleId }, lang)}</p>
                <p className="text-[12px] text-secondary leading-relaxed font-light">{HERO.profile.bio}</p>
                <div className="flex flex-wrap gap-1 items-center justify-center sm:justify-start mt-1">
                  {HERO.profile.tags.map((tag) => (
                    <span key={tag} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-surface/50 border border-surface text-secondary/80">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

          {/* Right — profile panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex flex-col gap-4 w-full min-h-0"
          >
            {/* Photo card styled as a vintage physical specimen/draft slide */}
            <motion.div
              whileHover={{ y: -6, transition: { type: 'spring', stiffness: 500, damping: 22, mass: 0.3 } }}
              whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 600, damping: 20, mass: 0.3 } }}
              className="rounded-2xl border border-surface/60 bg-white p-3 hover:border-highlight/30 hover:shadow-lg transition-all duration-300 group cursor-pointer shadow-sm"
            >
              <PortraitReveal
                baseSrc="/images/profile_1.webp"
                revealSrc="/images/profile_2.webp"
                alt="Faiz portrait"
                aspectRatioClass="aspect-[4/5]"
              />
              <div className="mt-3 px-1">
                <p className="text-[14px] font-semibold text-primary tracking-tight">{HERO.profile.name}</p>
                <p className="text-[10px] text-highlight mt-0.5 font-mono uppercase tracking-widest font-bold">{localize({ en: HERO.profile.subtitleEn, id: HERO.profile.subtitleId }, lang)}</p>
                <p className="text-[11.5px] text-secondary mt-1.5 leading-relaxed font-light">{HERO.profile.bio}</p>

                {/* Core focus tags inside the card */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {HERO.profile.tags.map((tag) => (
                    <span key={tag} className="text-[9.5px] font-mono px-2 py-0.5 rounded bg-surface/50 border border-surface text-secondary/90">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>

      {/* ── COLLABORATORS ── */}
        <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '120px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full bg-white border-y border-surface/80 relative z-10 mb-12"
      >
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] uppercase text-secondary/70 font-medium whitespace-nowrap">
              {localize({ en: UI.collaboratorsLabelEn, id: UI.collaboratorsLabelId }, lang)}
            </span>
            <div className="hidden sm:block w-px h-5 bg-surface/30" />
            <div className="flex items-center gap-7 sm:gap-9 flex-wrap justify-center">
              {UI.collaborators.map((logo) => (
                <motion.img
                  key={logo.alt}
                  whileHover={{ scale: 1.1, transition: { type: 'spring', stiffness: 400, damping: 18 } }}
                  src={logo.src}
                  alt={logo.alt}
                  className="h-6 sm:h-8 w-auto opacity-85 hover:opacity-100 transition-all duration-300"
                />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      <div className="w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col gap-32 sm:gap-40 pb-24 relative z-10">

        {/* ── ABOUT ── */}
        <section className="scroll-mt-14" id="about">
          {/* Section Title above the columns */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3, margin: '120px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-3 mb-10"
          >
            <div className="flex items-center justify-between border-b border-surface/60 pb-3">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary/70 font-medium">{localize({ en: SECTION_LABELS.eyebrows.about.eyebrowLeftEn, id: SECTION_LABELS.eyebrows.about.eyebrowLeftId }, lang)}</span>
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary/70 font-medium">{localize({ en: SECTION_LABELS.eyebrows.about.eyebrowRightEn, id: SECTION_LABELS.eyebrows.about.eyebrowRightId }, lang)}</span>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8">
              <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-primary leading-snug mt-1 flex-1">
                {localize({ en: SECTION_LABELS.titleHeadlines.about.line1En, id: SECTION_LABELS.titleHeadlines.about.line1Id }, lang)}<br className="hidden sm:block" />
                <span className="text-highlight">{localize({ en: SECTION_LABELS.titleHeadlines.about.line2En, id: SECTION_LABELS.titleHeadlines.about.line2Id }, lang)}</span>
              </h2>
              <img
                src={INTRO.bannerImage}
                alt=""
                className="w-full sm:w-auto sm:max-w-[480px] lg:max-w-[560px] object-contain rounded-lg flex-shrink-0"
              />
            </div>
          </motion.div>

          <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-16">
            {/* Left Column: Paragraphs only */}
            <div className="flex flex-col gap-5 text-[14.5px] sm:text-[15.5px] leading-relaxed text-primary/90 font-light lg:max-w-[440px] lg:flex-shrink-0 w-full">
              {INTRO.intro[lang].map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3, margin: '120px' }}
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
                viewport={{ once: true, amount: 0.3, margin: '120px' }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.36 }}
                className="mt-4 group flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-accent/20 hover:bg-accent/[0.06] hover:border-accent/35 transition-all duration-200 self-start cursor-pointer focus:outline-none shadow-sm"
              >
                <span className="flex flex-col items-start leading-tight">
                  <span className="text-[10px] font-mono font-bold text-accent/70 tracking-wider uppercase">{localize({ en: UI.aboutReadMore.labelEn, id: UI.aboutReadMore.labelId }, lang)}</span>
                  <span className="text-[13px] font-medium text-accent">{localize({ en: UI.aboutReadMore.titleEn, id: UI.aboutReadMore.titleId }, lang)}</span>
                </span>
                <span className="transition-transform duration-200 group-hover:translate-x-0.5 text-accent/60 group-hover:text-accent">→</span>
              </motion.button>
            </div>

            {/* Right Column: Venn Diagram */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3, margin: '120px' }}
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
            viewport={{ once: true, amount: 0.3, margin: '120px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 border-b border-surface/60 pb-3"
          >
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary/70 font-medium">{localize({ en: SECTION_LABELS.eyebrows.work.eyebrowLeftEn, id: SECTION_LABELS.eyebrows.work.eyebrowLeftId }, lang)}</span>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary/70 font-medium ml-auto">{localize({ en: SECTION_LABELS.eyebrows.work.eyebrowRightEn, id: SECTION_LABELS.eyebrows.work.eyebrowRightId }, lang)}</span>
          </motion.div>

          {/* Title + Image */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-primary leading-snug flex-1">
              {localize({ en: SECTION_LABELS.titleHeadlines.work.line1En, id: SECTION_LABELS.titleHeadlines.work.line1Id }, lang)}<br className="hidden sm:block" />
              <span className="text-highlight">{localize({ en: SECTION_LABELS.titleHeadlines.work.line2En, id: SECTION_LABELS.titleHeadlines.work.line2Id }, lang)}</span>
            </h2>
            <img
              src={SECTION_LABELS.banners.work}
              alt=""
              className="w-full sm:w-auto sm:max-w-[360px] lg:max-w-[400px] h-auto object-contain rounded-lg flex-shrink-0"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {BACKGROUND.columns.map((col) => {
              const visibleCount = col.visibleAfterLatest ?? 2;
              const latestId = col.latestId;
              const isWorkCol = col.id === 'work';
              const expandLabel = localize({ en: col.expandLabelEn, id: col.expandLabelId }, lang);
              const collapseLabel = localize({ en: col.collapseLabelEn, id: col.collapseLabelId }, lang);
              const badge = localize({ en: col.currentBadgeEn, id: col.currentBadgeId }, lang);

              const visibleItems = col.items.slice(0, visibleCount);
              const hiddenItems = col.items.slice(visibleCount);

              return (
                <div key={col.id} className="flex flex-col gap-8">
                  {/* Visible items */}
                  <div className="flex flex-col gap-8">
                    {visibleItems.map((item: BackgroundItem, itemIdx: number) => {
                      const isLatest = item.id === latestId;
                      return (
                        <motion.div
                          key={item.id}
                          id={`timeline-item-${item.id}`}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, margin: '120px' }}
                          variants={timelineVariants}
                          whileHover={{ y: -4, transition: { type: 'spring', stiffness: 500, damping: 22, mass: 0.3 } }}
                          whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 600, damping: 20, mass: 0.3 } }}
                          transition={{ type: 'spring', stiffness: 500, damping: 22, mass: 0.3 }}
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
                              ? 'border-highlight/60 bg-white'
                              : 'border-highlight/25 dark:border-highlight/45 bg-white group-hover:border-highlight/60 group-hover:bg-bg'
                          }`}>
                            {item.logoPath ? (
                              <img src={item.logoPath} alt="" className="w-7 h-7 object-contain" />
                            ) : (
                              lookupIcon(item.id as any, isLatest)
                            )}
                          </div>

                          {isLatest && item.bannerImage && (
                            <div className="w-full h-24 sm:h-28 overflow-hidden rounded-t-[10px] relative border-b border-surface/40">
                              <img
                                src={item.bannerImage}
                                alt=""
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
                              {localize(item.role, lang)}
                            </h5>
                            <span className="text-[12.5px] text-secondary font-light group-hover:text-primary/80 transition-colors duration-150">
                              {localize(item.organization, lang)}
                            </span>

                            {/* Rich secondary layer: first-level summary outline right in the card */}
                            <p className="text-[12px] text-secondary/75 font-light leading-relaxed mt-2 line-clamp-2 border-l border-surface/80 pl-2.5 group-hover:border-highlight/30 group-hover:text-secondary transition-all">
                              {localize(item.popoutCopy, lang)}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Hidden items expand/collapse */}
                  {hiddenItems.length > 0 && (
                    <div className="flex flex-col gap-4 mt-2">
                      {/* Dropdown Toggle Button */}
                      <button
                        onClick={() => isWorkCol ? setIsWorkExpanded(!isWorkExpanded) : setIsEduExpanded(!isEduExpanded)}
                        className="group/btn flex items-center gap-1.5 self-start py-1.5 px-3 -ml-3 rounded-lg text-left transition-all duration-150 cursor-pointer text-secondary/70 hover:text-highlight"
                      >
                        <span className="text-[11px] font-mono tracking-wider uppercase font-semibold">
                          {(isWorkCol ? isWorkExpanded : isEduExpanded)
                            ? collapseLabel
                            : expandLabel}
                        </span>
                        <motion.div
                          animate={{ rotate: (isWorkCol ? isWorkExpanded : isEduExpanded) ? 180 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 22, mass: 0.3 }}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </motion.div>
                      </button>

                      {/* Collapsible Content */}
                      <AnimatePresence initial={false}>
                        {(isWorkCol ? isWorkExpanded : isEduExpanded) && (
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
                              return (
                                <motion.div
                                  key={item.id}
                                  id={`timeline-item-${item.id}`}
                                  initial="hidden"
                                  animate="visible"
                                  variants={timelineVariants}
                                  whileHover={{ y: -4, transition: { type: 'spring', stiffness: 500, damping: 22, mass: 0.3 } }}
                                  whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 600, damping: 20, mass: 0.3 } }}
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
                                      lookupIcon(item.id as any, isLatest)
                                    )}
                                  </div>

                                  <div className="flex-1 flex flex-col gap-0.5 pl-2">
                                    <span className="text-[10px] font-mono tracking-widest uppercase text-secondary/70">
                                      {item.dateRange}
                                    </span>
                                    <h5 className="text-[14.5px] font-sans font-medium transition-colors duration-150 text-primary group-hover:text-accent">
                                      {localize(item.role, lang)}
                                    </h5>
                                    <span className="text-[12.5px] text-secondary font-light group-hover:text-primary/80 transition-colors duration-150">
                                      {localize(item.organization, lang)}
                                    </span>

                                    <p className="text-[12px] text-secondary/75 font-light leading-relaxed mt-2 line-clamp-2 border-l border-surface/80 pl-2.5 group-hover:border-highlight/30 group-hover:text-secondary transition-all">
                                      {localize(item.popoutCopy, lang)}
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

                  {/* Credentials at bottom of education column */}
                  {!isWorkCol && BACKGROUND.credentials.length > 0 && (
                    <div className="flex flex-col gap-4 mt-2">
                      {/* Dropdown Toggle Button - Credentials */}
                      <button
                        onClick={() => setIsEduExpanded(!isEduExpanded)}
                        className="group/btn flex items-center gap-1.5 self-start py-1.5 px-3 -ml-3 rounded-lg text-left transition-all duration-150 cursor-pointer text-secondary/70 hover:text-highlight"
                      >
                        <span className="text-[11px] font-mono tracking-wider uppercase font-semibold">
                          {isEduExpanded
                            ? collapseLabel
                            : expandLabel}
                        </span>
                        <motion.div
                          animate={{ rotate: isEduExpanded ? 180 : 0 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 22, mass: 0.3 }}
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </motion.div>
                      </button>

                      {/* Collapsible Content - Credentials */}
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
                            {BACKGROUND.credentials.map((item: BackgroundItem, cIdx: number) => {
                              const isLatest = false;
                              return (
                                <motion.div
                                  key={item.id}
                                  id={`timeline-item-${item.id}`}
                                  initial="hidden"
                                  animate="visible"
                                  variants={timelineVariants}
                                  whileHover={{ y: -4, transition: { type: 'spring', stiffness: 500, damping: 22, mass: 0.3 } }}
                                  whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 600, damping: 20, mass: 0.3 } }}
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
                                      lookupIcon(item.id as any, isLatest)
                                    )}
                                  </div>

                                  <div className="flex-1 flex flex-col gap-0.5 pl-2">
                                    <span className="text-[10px] font-mono tracking-widest uppercase text-secondary/70">
                                      {item.dateRange}
                                    </span>
                                    <h5 className="text-[14.5px] font-sans font-medium transition-colors duration-150 text-primary group-hover:text-accent">
                                      {localize(item.role, lang)}
                                    </h5>
                                    <span className="text-[12.5px] text-secondary font-light group-hover:text-primary/80 transition-colors duration-150">
                                      {localize(item.organization, lang)}
                                    </span>

                                    <p className="text-[12px] text-secondary/75 font-light leading-relaxed mt-2 line-clamp-2 border-l border-surface/80 pl-2.5 group-hover:border-highlight/30 group-hover:text-secondary transition-all">
                                      {localize(item.popoutCopy, lang)}
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
              );
            })}
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section id="projects" className="flex flex-col gap-10 scroll-mt-14">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '120px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 border-b border-surface/60 pb-3"
          >
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary/70 font-medium">{localize({ en: SECTION_LABELS.eyebrows.projects.eyebrowLeftEn, id: SECTION_LABELS.eyebrows.projects.eyebrowLeftId }, lang)}</span>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary/70 font-medium ml-auto">{localize({ en: SECTION_LABELS.eyebrows.projects.eyebrowRightEn, id: SECTION_LABELS.eyebrows.projects.eyebrowRightId }, lang)}</span>
          </motion.div>

          {/* Title + Image */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-primary leading-snug flex-1">
              {localize({ en: SECTION_LABELS.titleHeadlines.projects.line1En, id: SECTION_LABELS.titleHeadlines.projects.line1Id }, lang)}<br className="hidden sm:block" />
              <span className="text-highlight">{localize({ en: SECTION_LABELS.titleHeadlines.projects.line2En, id: SECTION_LABELS.titleHeadlines.projects.line2Id }, lang)}</span>
            </h2>
            <img
              src={SECTION_LABELS.banners.projects}
              alt=""
              className="w-full sm:w-auto sm:max-w-[640px] lg:max-w-[720px] h-auto object-contain rounded-lg flex-shrink-0"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {(() => {
              const getStatusStyle = (status: string) => {
                if (status === 'Completed') return 'text-[#2B4C7E] bg-[#EBF1FA] border border-[#BFCEE2]';
                if (status === 'Research') return 'text-[#9A6200] bg-[#FFF8EB] border border-[#F5DFBF]';
                return 'text-[#16785A] bg-[#EDF7F4] border border-[#C2E3D8]'; // Active
              };
              return PROJECTS.slice(0, 4).map((project, idx) => (
                <motion.div
                  key={project.id}
                  id={`project-card-${project.id}`}
                  onClick={() => setSelectedProject(project)}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '120px' }}
                  variants={cardVariants}
                  whileHover={{ y: -6, transition: { type: 'spring', stiffness: 500, damping: 22, mass: 0.3 } }}
                  whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 600, damping: 20, mass: 0.3 } }}
                  className="group relative flex flex-col rounded-2xl border border-surface/60 bg-white cursor-pointer hover:border-highlight/40 hover:shadow-lg transition-all duration-300 interactive-item shadow-sm overflow-hidden"
                >
                  {/* Image at top — flush with card edges, no padding */}
                  {project.imagePath && (
                    <div className="w-full h-48 relative overflow-hidden">
                      <div className="absolute inset-0 bg-grid-fine opacity-10 pointer-events-none z-10" />
                      <img
                        src={project.imagePath}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      />
                      {/* Subtle bottom fade for seamless transition to content */}
                      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />
                      {/* Status badge — overlaid on image */}
                      <span className={`absolute top-3 right-3 text-[9px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full flex-shrink-0 font-bold shadow-sm ${getStatusStyle(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  )}

                  {/* Content below — with padding */}
                  <div className="flex flex-col gap-2.5 p-5 sm:p-6 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="text-[16.5px] font-sans text-primary group-hover:text-highlight transition-colors duration-150 font-semibold flex items-center gap-1.5 leading-tight">
                        {project.name}
                        <ArrowUpRight className="w-4 h-4 opacity-0 scale-50 -translate-x-1.5 translate-y-1.5 group-hover:opacity-90 group-hover:scale-100 group-hover:translate-x-0 group-hover:translate-y-0 text-highlight flex-shrink-0 group-hover:rotate-12 transition-all duration-300" />
                      </h4>
                    </div>
                    <p className="text-[13.5px] sm:text-[14px] leading-relaxed text-[#2C3E50] font-light">
                      {localize(project.subtitle, lang)}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {project.domainTags.map((tag: string, i: number) => (
                        <span key={i} className="text-[9.5px] font-mono tracking-wider uppercase text-[#33465C] px-2.5 py-0.5 bg-[#F2F4F7] border border-[#DEE2E6] rounded-md font-semibold group-hover:bg-white group-hover:text-highlight group-hover:border-[#CCD5E4] transition-all duration-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ));
            })()}
          </div>

          {/* Hidden extra projects with expand/collapse */}
          <AnimatePresence initial={false}>
            {showMoreProjects && (
              <motion.div
                initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
                animate={{ height: 'auto', opacity: 1, transitionEnd: { overflow: 'visible' } }}
                exit={{ height: 0, opacity: 0, overflow: 'hidden' }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-5 -mt-5"
              >
                {(() => {
                  return PROJECTS.slice(4).map((project, idx) => (
                    <motion.div
                      key={project.id}
                      id={`project-card-${project.id}`}
                      onClick={() => setSelectedProject(project)}
                      initial="hidden"
                      animate="visible"
                      variants={cardVariants}
                      whileHover={{ y: -6, transition: { type: 'spring', stiffness: 500, damping: 22, mass: 0.3 } }}
                      whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 600, damping: 20, mass: 0.3 } }}
                      className="group relative flex flex-col rounded-2xl border border-surface/60 bg-white cursor-pointer hover:border-highlight/40 hover:shadow-lg transition-all duration-300 interactive-item shadow-sm overflow-hidden"
                    >
                      {/* Image at top — flush with card edges, no padding */}
                      {project.imagePath && (
                        <div className="w-full h-48 relative overflow-hidden">
                          <div className="absolute inset-0 bg-grid-fine opacity-10 pointer-events-none z-10" />
                          <img
                            src={project.imagePath}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
                          />
                          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />
                          <span className={`absolute top-3 right-3 text-[9px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full flex-shrink-0 font-bold shadow-sm ${getStatusStyle(project.status)}`}>
                            {project.status}
                          </span>
                        </div>
                      )}

                      {/* Content below — with padding */}
                      <div className="flex flex-col gap-2.5 p-5 sm:p-6 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="text-[16.5px] font-sans text-primary group-hover:text-highlight transition-colors duration-150 font-semibold flex items-center gap-1.5 leading-tight">
                            {project.name}
                            <ArrowUpRight className="w-4 h-4 opacity-0 scale-50 -translate-x-1.5 translate-y-1.5 group-hover:opacity-90 group-hover:scale-100 group-hover:translate-x-0 group-hover:translate-y-0 text-highlight flex-shrink-0 group-hover:rotate-12 transition-all duration-300" />
                          </h4>
                        </div>
                        <p className="text-[13.5px] sm:text-[14px] leading-relaxed text-[#2C3E50] font-light">
                          {localize(project.subtitle, lang)}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {project.domainTags.map((tag: string, i: number) => (
                            <span key={i} className="text-[9.5px] font-mono tracking-wider uppercase text-[#33465C] px-2.5 py-0.5 bg-[#F2F4F7] border border-[#DEE2E6] rounded-md font-semibold group-hover:bg-white group-hover:text-highlight group-hover:border-[#CCD5E4] transition-all duration-300">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ));
                })()}
              </motion.div>
            )}
          </AnimatePresence>

          {/* More Projects Toggle */}
          {PROJECTS.length > 4 && (
            <motion.button
              onClick={() => setShowMoreProjects(!showMoreProjects)}
              whileHover={{ y: -3, scale: 1.035, transition: { type: 'spring', stiffness: 500, damping: 22, mass: 0.3 } }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22, mass: 0.3 }}
              className="self-center inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-surface/80 hover:border-highlight/30 bg-surface/10 hover:bg-surface/30 text-primary text-[13.5px] transition-[background-color,border-color] duration-200 cursor-pointer focus:outline-none mt-2"
            >
              <span className="font-mono text-[11px] tracking-wider uppercase font-semibold">
                {showMoreProjects
                  ? localize({ en: UI.projectToggle.showLessEn, id: UI.projectToggle.showLessId }, lang)
                  : localize({ en: UI.projectToggle.showMoreEn.replace('{count}', String(PROJECTS.length - 4)), id: UI.projectToggle.showMoreId.replace('{count}', String(PROJECTS.length - 4)) }, lang)}
              </span>
              <motion.div
                animate={{ rotate: showMoreProjects ? 180 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 22, mass: 0.3 }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </motion.button>
          )}
        </section>

        {/* ── WRITING ── */}
        <section id="writing" className="flex flex-col gap-10 scroll-mt-14">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '120px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 border-b border-surface/60 pb-3"
          >
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary/70 font-medium">{localize({ en: SECTION_LABELS.eyebrows.writing.eyebrowLeftEn, id: SECTION_LABELS.eyebrows.writing.eyebrowLeftId }, lang)}</span>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary/70 font-medium ml-auto">{localize({ en: SECTION_LABELS.eyebrows.writing.eyebrowRightEn, id: SECTION_LABELS.eyebrows.writing.eyebrowRightId }, lang)}</span>
          </motion.div>

          {/* Title */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-primary leading-snug flex-1">
              {localize({ en: SECTION_LABELS.titleHeadlines.writing.line1En, id: SECTION_LABELS.titleHeadlines.writing.line1Id }, lang)}<br className="hidden sm:block" />
              <span className="text-highlight">{localize({ en: SECTION_LABELS.titleHeadlines.writing.line2En, id: SECTION_LABELS.titleHeadlines.writing.line2Id }, lang)}</span>
            </h2>
            <img
              src={SECTION_LABELS.banners.writing}
              alt=""
              className="w-full sm:w-auto sm:max-w-[300px] lg:max-w-[360px] h-auto object-contain rounded-lg flex-shrink-0"
            />
          </div>

          {/* Medium-style list layout */}
          <div className="flex flex-col gap-4">
            {WRITINGS.map((write: Writing, idx: number) => {
              const isHovered = hoveredWritingId === write.id;
              const isExpanded = expandedWritingId === write.id;

              const framing = localize(write.framing, lang);
              const excerpt = localize(write.excerpt, lang);
              const topicTag = localize(write.topicTag, lang);

              return (
                <motion.a
                  key={write.id}
                  id={`writing-item-${write.id}`}
                  href={write.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '120px' }}
                  variants={cardVariants}
                  whileHover={{ y: -2, transition: { type: 'spring', stiffness: 500, damping: 22, mass: 0.3 } }}
                  whileTap={{ scale: 0.98, transition: { type: 'spring', stiffness: 600, damping: 20, mass: 0.3 } }}
                  onMouseEnter={() => setHoveredWritingId(write.id)}
                  onMouseLeave={() => setHoveredWritingId(null)}
                  onClick={(e) => handleWritingClick(write.id, e)}
                  className="group flex flex-wrap items-start gap-4 sm:gap-5 p-4 sm:p-5 cursor-pointer rounded-2xl border border-surface/60 bg-white shadow-sm hover:border-highlight/40 hover:shadow-lg transition-all duration-300"
                >
                  {/* Left: Text content */}
                  <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 border rounded-md font-bold ${getTopicTagStyle(topicTag)}`}>
                        {topicTag}
                      </span>
                      <span className="text-[10px] font-mono text-secondary/60 font-semibold">{write.date}</span>
                    </div>

                    <h4 className="text-[15.5px] sm:text-[17px] font-serif tracking-tight text-primary group-hover:text-highlight transition-colors duration-150 font-semibold leading-snug">
                      {write.title}
                    </h4>

                    <p className="text-[13px] text-secondary leading-relaxed font-light line-clamp-2">
                      {framing}
                    </p>

                    {/* Desktop: excerpt on hover */}
                    <AnimatePresence initial={false}>
                      {isHovered && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                          className="hidden lg:block overflow-hidden"
                        >
                          <p className="text-[12px] leading-relaxed text-secondary/80 border-l-2 border-highlight pl-3 font-normal">
                            {excerpt}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono text-highlight font-semibold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {localize({ en: UI.writingActions.readArticleEn, id: UI.writingActions.readArticleId }, lang)}
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Right: Thumbnail */}
                  {write.imagePath && (
                    <div className="flex-shrink-0 h-20 sm:h-24 aspect-[4/3] rounded-lg overflow-hidden bg-surface/30 border border-surface/50 group-hover:border-highlight/20 transition-all duration-300">
                      <img
                        src={write.imagePath}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
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
                        className="block lg:hidden overflow-hidden bg-surface/30 p-3 rounded-lg col-span-full w-full"
                      >
                        <p className="text-[13px] leading-relaxed text-secondary font-light mb-3">{excerpt}</p>
                        <a href={write.link} target="_blank" rel="noopener noreferrer" className="text-[11px] text-highlight font-mono inline-flex items-center gap-1 uppercase tracking-wider font-semibold">
                          {localize({ en: UI.writingActions.readOnMediumEn, id: UI.writingActions.readOnMediumId }, lang)} <ArrowUpRight className="h-3 w-3" />
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.a>
              );
            })}
          </div>

          <a
            href="https://faizsyam.medium.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="self-start text-[12px] font-mono text-secondary hover:text-accent transition-colors duration-150 inline-flex items-center gap-1.5 uppercase tracking-wider hover:underline underline-offset-4 focus:outline-none"
          >
            {localize({ en: UI.writingFooterCtaEn, id: UI.writingFooterCtaId }, lang)}
          </a>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="flex flex-col gap-10 scroll-mt-14">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '120px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-3 border-b border-surface/60 pb-3"
          >
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary/70 font-medium">{localize({ en: SECTION_LABELS.eyebrows.contact.eyebrowLeftEn, id: SECTION_LABELS.eyebrows.contact.eyebrowLeftId }, lang)}</span>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-secondary/70 font-medium ml-auto">{localize({ en: SECTION_LABELS.eyebrows.contact.eyebrowRightEn, id: SECTION_LABELS.eyebrows.contact.eyebrowRightId }, lang)}</span>
          </motion.div>

          <h3 className="text-2xl sm:text-3xl font-sans font-semibold tracking-tight text-primary leading-tight -mb-2">
            {localize({ en: CONTACT.headingEn, id: CONTACT.headingId }, lang)}
          </h3>

          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="flex flex-col gap-4 text-[14.5px] sm:text-[15px] leading-relaxed text-secondary/85 font-light lg:col-span-12 xl:col-span-5">
              <p>
                {localize({ en: CONTACT.leadEn, id: CONTACT.leadId }, lang)}
              </p>
              <p>
                {localize({ en: CONTACT.secondaryEn, id: CONTACT.secondaryId }, lang)}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-span-7 w-full">
              {CONTACT.links.map((link, gridIdx: number) => {
                const Icon = link.icon === 'Mail' ? Mail : link.icon === 'Linkedin' ? Linkedin : link.icon === 'Instagram' ? Instagram : Github;
                const isEmail = link.id === 'email';
                const displayText = isEmail && copied ? localize({ en: CONTACT.copiedToastEn, id: CONTACT.copiedToastId }, lang) : link.display;
                return (
                  <motion.a
                    key={link.id}
                    href={link.href}
                    target={isEmail ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    onClick={isEmail ? handleEmailClick : undefined}
                    whileHover={{ y: -4, transition: { type: 'spring', stiffness: 500, damping: 22, mass: 0.3 } }}
                    whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 600, damping: 20, mass: 0.3 } }}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{
                      type: 'spring',
                      stiffness: 180,
                      damping: 18,
                      delay: gridIdx * 0.08
                    }}
                    className={`group flex items-center justify-between p-4.5 rounded-xl border border-surface/60 bg-white hover:border-surface transition-all duration-300 shadow-sm hover:shadow-md ${link.brandClass}`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 flex-shrink-0 ${link.iconBgClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-mono tracking-wider uppercase text-secondary/50 font-medium">
                          {link.label}
                        </span>
                        <span className={`text-[13px] font-mono font-medium text-primary mt-0.5 truncate transition-colors duration-200 ${link.accentTextClass}`}>
                          {displayText}
                        </span>
                      </div>
                    </div>
                    <ArrowUpRight className={`h-4 w-4 text-secondary/35 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0 ${link.accentTextClass}`} />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="pt-10 pb-4 border-t border-surface/30 flex items-center justify-between select-none">
          <p className="text-[11.5px] text-secondary/50 font-mono">{localize({ en: UI.footer.copyrightEn, id: UI.footer.copyrightId }, lang)}</p>
          <span className="text-[10px] font-mono text-secondary/30 uppercase tracking-widest">{localize({ en: UI.footer.taglineEn, id: UI.footer.taglineId }, lang)}</span>
        </footer>
      </div>

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