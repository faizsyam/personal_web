import { useEffect, useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import imageList from 'virtual:image-list';

interface LoadingScreenProps {
  onComplete: () => void;
}

const STATUS_MESSAGES = [
  'Scanning blueprints…',
  'Calibrating grids…',
  'Assembling components…',
  'Rendering layouts…',
  'Loading schematics…',
  'Finalizing draft…',
];

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing…');
  const completedRef = useRef(0);

  const images = useMemo(() => {
    return (imageList as string[]) || [];
  }, []);

  useEffect(() => {
    const total = Math.max(images.length, 1);
    const promises: Promise<void>[] = [];

    const updateProgress = () => {
      completedRef.current += 1;
      const pct = (completedRef.current / total) * 100;
      setProgress(pct);

      const msgIdx = Math.min(
        Math.floor((completedRef.current / total) * STATUS_MESSAGES.length),
        STATUS_MESSAGES.length - 1
      );
      setStatus(STATUS_MESSAGES[msgIdx] || 'Finalizing');
    };

    for (const src of images) {
      promises.push(preloadImage(src).then(updateProgress));
    }

    const minTime = new Promise<void>((r) => setTimeout(r, 900));

    Promise.all([...promises, minTime]).then(() => {
      setProgress(100);
      setStatus('Complete');
      setTimeout(onComplete, 500);
    });
  }, [images, onComplete]);

  const clampedProgress = Math.min(progress, 100);
  const ticks = useMemo(() => Array.from({ length: 30 }, (_, i) => i), []);

  return (
    <div className="fixed inset-0 z-[100] bg-bg flex items-center justify-center overflow-hidden">
      {/* Subtle background grid */}
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
        {/* Loading text */}
        <div className="font-mono text-[11px] tracking-[0.35em] uppercase text-secondary/70">
          Loading
        </div>

        {/* Small progress bar */}
        <div className="w-48 relative">
          <div className="w-full h-1.5 bg-surface/60 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-highlight/80 rounded-full"
              animate={{ width: `${clampedProgress}%` }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />
          </div>

          {/* Tick marks */}
          <div className="relative w-full h-2.5 flex justify-between items-end mt-1 px-[1px]">
            {ticks.map((t) => {
              const tickPos = (t / (ticks.length - 1)) * 100;
              const isMajor = t % 10 === 0;
              const isActive = tickPos <= clampedProgress;
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

        {/* Percentage */}
        <div className="font-mono text-3xl font-light tabular-nums tracking-tight text-primary leading-none">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={Math.round(clampedProgress)}
              initial={{ y: 6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 28 }}
              className="inline-block"
            >
              {Math.round(clampedProgress).toString().padStart(3, '0')}
            </motion.span>
          </AnimatePresence>
          <span className="text-secondary/30 text-xl ml-0.5 align-top">%</span>
        </div>

        {/* Status */}
        <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-secondary/50 h-4">
          {status}
        </div>

      </motion.div>
    </div>
  );
}
