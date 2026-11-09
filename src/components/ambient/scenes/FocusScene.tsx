'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TaroLeaf } from '@/components/leaves/TaroLeaf';

export const FocusScene: React.FC<{ cursorOffset: { x: number; y: number } }> = ({
  cursorOffset,
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
      {/* Soft breathing ambient glow */}
      <motion.div
        animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.08, 0.18, 0.08] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        className="w-96 h-96 rounded-full bg-[var(--leaf-primary)] blur-3xl"
      />

      {/* Very slowly drifting tranquil leaves */}
      <motion.div
        animate={{ y: [-8, 8, -8], rotate: [-2, 2, -2] }}
        transition={{ repeat: Infinity, duration: 16, ease: 'easeInOut' }}
        style={{
          transform: `translate3d(${cursorOffset.x * -0.02}px, ${cursorOffset.y * -0.02}px, 0)`,
        }}
        className="absolute top-20 left-16 w-28 h-36 opacity-12"
      >
        <TaroLeaf className="w-full h-full" />
      </motion.div>
    </div>
  );
};
