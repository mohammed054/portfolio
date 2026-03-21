'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSceneStore } from '@/store/scene';

export default function Loader() {
  const { isLoaded, setLoaded, setLoadProgress } = useSceneStore();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate asset loading progression
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 18 + 4;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => {
          setLoaded(true);
        }, 500);
      }
      setProgress(Math.min(p, 100));
      setLoadProgress(Math.min(p, 100) / 100);
    }, 120);

    return () => clearInterval(interval);
  }, [setLoaded, setLoadProgress]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          className="loader-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-8"
          >
            {/* MH monogram */}
            <div className="relative">
              <span
                className="font-display text-6xl font-bold gradient-text"
                style={{ letterSpacing: '0.2em' }}
              >
                MH
              </span>
              {/* Glow ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(122,60,255,0.2) 0%, transparent 70%)',
                }}
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            {/* Progress bar */}
            <div className="w-48 h-px bg-border-subtle relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0"
                style={{
                  background: 'linear-gradient(90deg, #7A3CFF, #00D0FF)',
                  width: `${progress}%`,
                }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Progress number */}
            <span className="font-mono text-xs text-text-muted tracking-widest">
              {Math.round(progress).toString().padStart(3, '0')}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
