'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MonsteraLeaf } from './MonsteraLeaf';
import { PalmFrond } from './PalmFrond';
import { TaroLeaf } from './TaroLeaf';
import { HatchedLeaf } from './HatchedLeaf';

interface HeroProps {
  className?: string;
  interactive?: boolean;
}

export const TropicalPatternHero: React.FC<HeroProps> = ({
  className = '',
  interactive = true,
}) => {
  const [mounted, setMounted] = useState(false);

  // Parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Staggered parallax offsets for layer depth
  const xLayer1 = useTransform(smoothX, [-300, 300], [-15, 15]);
  const yLayer1 = useTransform(smoothY, [-300, 300], [-15, 15]);

  const xLayer2 = useTransform(smoothX, [-300, 300], [22, -22]);
  const yLayer2 = useTransform(smoothY, [-300, 300], [22, -22]);

  const xLayer3 = useTransform(smoothX, [-300, 300], [-30, 30]);
  const yLayer3 = useTransform(smoothY, [-300, 300], [-25, 25]);

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const { innerWidth, innerHeight } = window;
      mouseX.set(e.clientX - innerWidth / 2);
      mouseY.set(e.clientY - innerHeight / 2);
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (!interactive || e.gamma === null || e.beta === null) return;
      mouseX.set((e.gamma / 45) * 200);
      mouseY.set(((e.beta - 45) / 45) * 200);
    };

    window.addEventListener('mousemove', handleMouseMove);
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleDeviceOrientation);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleDeviceOrientation);
      }
    };
  }, [interactive, mouseX, mouseY]);

  return (
    <div
      className={`relative w-full max-w-[540px] aspect-[4/3.8] select-none pointer-events-none sm:pointer-events-auto overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-xl shadow-black/5 dark:shadow-purple-950/20 ${className}`}
      aria-hidden="true"
    >
      {/* Background Dark Contrast Patches (mimicking the deep dark cutouts from reference art) */}
      <div className="absolute inset-0 bg-[var(--leaf-bg-contrast)] opacity-95 rounded-3xl" />

      {/* Decorative Botanical Leaf Composition Layer 1: Hatched Leaves (Background) */}
      <motion.div
        style={{ x: xLayer1, y: yLayer1 }}
        animate={
          mounted
            ? {
                rotate: [-1, 2, -1],
                scale: [1, 1.02, 1],
              }
            : {}
        }
        transition={{
          repeat: Infinity,
          duration: 9,
          ease: 'easeInOut',
        }}
        className="absolute -top-10 -left-12 w-64 h-64 origin-bottom-right"
      >
        <HatchedLeaf className="w-full h-full drop-shadow-md" />
      </motion.div>

      <motion.div
        style={{ x: xLayer2, y: yLayer2 }}
        animate={
          mounted
            ? {
                rotate: [2, -2, 2],
              }
            : {}
        }
        transition={{
          repeat: Infinity,
          duration: 11,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-12 right-0 w-72 h-72 origin-top-left"
      >
        <HatchedLeaf className="w-full h-full rotate-180 drop-shadow-md" />
      </motion.div>

      {/* Layer 2: Palm Frond (Top Right to Center) */}
      <motion.div
        style={{ x: xLayer3, y: yLayer3 }}
        animate={
          mounted
            ? {
                rotate: [-2, 3, -2],
                y: [0, -6, 0],
              }
            : {}
        }
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: 'easeInOut',
        }}
        className="absolute -top-12 -right-8 w-80 h-80 origin-top-right"
      >
        <PalmFrond className="w-full h-full -rotate-12 drop-shadow-lg" />
      </motion.div>

      {/* Layer 3: Main Monstera Deliciosa (Right Foreground) */}
      <motion.div
        style={{ x: xLayer2, y: yLayer2 }}
        animate={
          mounted
            ? {
                rotate: [3, -2, 3],
                scale: [1, 1.03, 1],
              }
            : {}
        }
        transition={{
          repeat: Infinity,
          duration: 7,
          ease: 'easeInOut',
        }}
        className="absolute top-12 right-2 w-60 h-72 origin-center"
      >
        <MonsteraLeaf className="w-full h-full rotate-12 drop-shadow-xl" />
      </motion.div>

      {/* Layer 4: Taro / Caladium Shield Leaf (Bottom Left Foreground) */}
      <motion.div
        style={{ x: xLayer1, y: yLayer1 }}
        animate={
          mounted
            ? {
                rotate: [-3, 2, -3],
                scale: [1, 1.025, 1],
              }
            : {}
        }
        transition={{
          repeat: Infinity,
          duration: 8.5,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-14 -left-10 w-72 h-72 origin-bottom-left"
      >
        <TaroLeaf className="w-full h-full rotate-6 drop-shadow-2xl" />
      </motion.div>

      {/* Secondary Petite Monstera (Bottom Center Accent) */}
      <motion.div
        style={{ x: xLayer3, y: yLayer3 }}
        animate={
          mounted
            ? {
                rotate: [2, -3, 2],
              }
            : {}
        }
        transition={{
          repeat: Infinity,
          duration: 6.5,
          ease: 'easeInOut',
        }}
        className="absolute bottom-2 left-32 w-40 h-48 origin-bottom"
      >
        <MonsteraLeaf
          fillColor="var(--leaf-secondary)"
          className="w-full h-full -rotate-45 drop-shadow-lg"
        />
      </motion.div>
    </div>
  );
};
