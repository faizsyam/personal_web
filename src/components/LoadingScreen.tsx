import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import imageList from 'virtual:image-list';

interface LoadingScreenProps {
  onComplete: () => void;
}

const STATUS_MESSAGES = [
  'Initializing…',
  'Scanning blueprints…',
  'Calibrating grids…',
  'Assembling components…',
  'Rendering layouts…',
  'Loading schematics…',
];

const LOADING_CAP = 95;

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

function FinalizingAnimation() {
  return (
    <motion.div
      key="finalizing"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-3"
    >
      <div className="relative w-32 h-px bg-primary/15 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full w-10 bg-gradient-to-r from-transparent via-primary/80 to-transparent"
          initial={{ x: '-40px', opacity: 0 }}
          animate={{ x: 168, opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
     </div>
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1 h-1 rounded-full bg-primary/40"
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
     </div>
      <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-secondary/60">
        finalizing draft
     </div>
   </motion.div>
  );
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(STATUS_MESSAGES[0]);
  const [phase, setPhase] = useState<'loading' | 'finalizing'>('loading');
  const completedRef = useRef(0);
  const hasCompletedRef = useRef(false);
  const finalizingStartedRef = useRef(false);

  const images = useMemo(() => {
    return (imageList as string[]) || [];
  }, []);

  const switchToFinalizing = () => {
    if (finalizingStartedRef.current) return;
    finalizingStartedRef.current = true;
    setPhase('finalizing');
    setStatus('');

    // Defer to allow final tile of RAFs to mount the new tree before unmounting the screen.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (hasCompletedRef.current) return;
          hasCompletedRef.current = true;
          onComplete();
        }, 100);
      });
    });
  };

  useEffect(() => {
    const total = images.length;
    const promises: Promise<void>[] = [];

    // No images case — still respect minTime so the screen doesn't flash.
    const minTime = new Promise<void>((r) => setTimeout(r, 400));

    // Bail-out safety net if anything hangs.
    const safetyTimeout = new Promise<void>((resolve) => {
      setTimeout(() => {
        console.warn('[LoadingScreen] Safety timeout triggered, forcing completion');
        resolve();
      }, 10000);
    });

    if (total === 0) {
      Promise.all([minTime, safetyTimeout]).then(switchToFinalizing);
      return;
    }

    const onImageLoaded = () => {
      completedRef.current += 1;
      const loaded = completedRef.current;
      const pct = Math.min((loaded / total) * LOADING_CAP, LOADING_CAP);
      setProgress(pct);

      const msgIdx = Math.min(
        Math.floor((loaded / total) * STATUS_MESSAGES.length),
        STATUS_MESSAGES.length - 1
      );
      setStatus(STATUS_MESSAGES[msgIdx]);
    };

    for (const src of images) {
      promises.push(preloadImage(src).then(onImageLoaded));
    }

    Promise.all([...promises, minTime]).then(switchToFinalizing);

    // Safety timeout resolves independently — if images somehow stall it's the only path forward.
    safetyTimeout.then(() => {
      if (!finalizingStartedRef.current) {
        console.warn('[LoadingScreen] Forcing finalizing phase via safety timeout');
        switchToFinalizing();
      }
    });
  }, [images, onComplete]);

  const ticks = useMemo(() => Array.from({ length: 30 }, (_, i) => i), []);
  const displayProgress = phase === 'loading' ? progress : LOADING_CAP;

  return (
    <div className="fixed inset-0 z-[100] bg-bg flex items-center justify-center overflow-hidden">
      {/* Subtle drafting grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #181815 1px, transparent 1px), linear-gradient(to bottom, #181815 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <motion.div
        className="relative flex flex-col items-center gap-6 px-6 w-full max-w-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Phase label */}
        <div className="font-mono text-[11px] tracking-[0.35em] uppercase text-secondary/70 h-4">
          <AnimatePresence mode="wait">
            <motion.span
              key={phase}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="inline-block"
            >
              {phase === 'loading' ? 'Loading' : 'Loading'}
           </motion.span>
         </AnimatePresence>
       </div>

        {/* Progress bar with tick marks */}
        <div className="w-48 relative">
          <div className="w-full h-1.5 bg-surface/60 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-highlight/80 rounded-full"
              animate={{ width: `${displayProgress}%` }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />
         </div>

          <div className="relative w-full h-2.5 flex justify-between items-end mt-1 px-[1px]">
            {ticks.map((t) => {
              const tickPos = (t / (ticks.length - 1)) * 100;
              const isActive = tickPos <= displayProgress;
              const isMajor = t % 5 === 0;
              return (
                <div
                  key={t}
                  className={`w-[1px] transition-opacity duration-200 ${
                    isActive ? 'opacity-100' : 'opacity-15'
                  } ${isMajor ? 'h-2 bg-primary/30' : 'h-1 bg-primary/15'}`}
                />
              );
            })}
         </div>
       </div>

        {/* Percentage ↔ Finalizing swap */}
        <div
          className="h-16 flex items-center justify-center"
          aria-live="polite"
          aria-atomic="true"
        >
          <AnimatePresence mode="wait">
            {phase === 'loading' ? (
              <motion.div
                key="percentage"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="font-mono text-3xl font-light tabular-nums tracking-tight text-primary leading-none"
              >
                <motion.span
                  key={Math.round(progress)}
                  initial={{ y: 6, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -6, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                  className="inline-block"
                >
                  {Math.round(progress).toString().padStart(3, '0')}
               </motion.span>
                <span className="text-secondary/30 text-xl ml-0.5 align-top">%</span>
             </motion.div>
            ) : (
              <FinalizingAnimation />
            )}
         </AnimatePresence>
       </div>

        {/* Status — only shown while actively loading */}
        <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-secondary/50 h-4">
          <AnimatePresence mode="wait">
            {phase === 'loading' && status && (
              <motion.span
                key={status}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.2 }}
                className="inline-block"
              >
                {status}
             </motion.span>
            )}
         </AnimatePresence>
       </div>
     </motion.div>
   </div>
  );
}
