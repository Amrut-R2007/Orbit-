'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const SubjectsScene: React.FC<{ cursorOffset: { x: number; y: number } }> = ({
  cursorOffset,
}) => {
  return (
    <div className="absolute inset-x-0 bottom-0 h-48 overflow-hidden pointer-events-none">
      {/* Background grass layer */}
      <motion.svg
        viewBox="0 0 1200 180"
        fill="none"
        animate={{ rotate: [-1.5, 1.5, -1.5] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        style={{
          transform: `translate3d(${cursorOffset.x * -0.04}px, 0, 0)`,
        }}
        className="absolute bottom-0 w-full h-full opacity-10 text-[var(--leaf-primary)] origin-bottom"
      >
        <path
          d="M0 180 C50 80 80 40 120 180 C180 60 220 20 270 180 C320 90 380 30 420 180 C480 70 540 20 580 180 C640 100 700 40 760 180 C820 60 880 10 930 180 C1000 80 1080 30 1150 180"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
        />
      </motion.svg>

      {/* Foreground grass layer with slight phase offset for parallax */}
      <motion.svg
        viewBox="0 0 1200 180"
        fill="none"
        animate={{ rotate: [1.8, -1.8, 1.8] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        style={{
          transform: `translate3d(${cursorOffset.x * -0.08}px, 0, 0)`,
        }}
        className="absolute bottom-0 w-full h-full opacity-15 text-[var(--leaf-deep)] origin-bottom"
      >
        <path
          d="M40 180 C90 100 120 60 160 180 C210 80 250 40 300 180 C360 110 410 50 460 180 C520 80 570 30 620 180 C680 110 730 60 790 180 C860 90 910 40 970 180 C1040 100 1110 50 1180 180"
          stroke="currentColor"
          strokeWidth="16"
          strokeLinecap="round"
        />
      </motion.svg>
    </div>
  );
};
