'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MonsteraLeaf } from '@/components/leaves/MonsteraLeaf';
import { TransitionProps } from '../transitionTypes';

export const BookLeafFlipTransition: React.FC<TransitionProps> = ({ isReverse }) => {
  const origin = isReverse ? 'origin-left' : 'origin-right';
  const startRotateY = isReverse ? -90 : 90;
  const endRotateY = isReverse ? 90 : -90;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden"
      style={{ perspective: 1200 }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.95, 0.95, 0] }}
        transition={{ duration: 0.75, times: [0, 0.25, 0.7, 1] }}
        className="absolute inset-0 bg-[var(--background)]"
      />

      {/* Book-leaf flipping across viewport */}
      <motion.div
        initial={{ rotateY: startRotateY, scale: 0.85, opacity: 0 }}
        animate={{
          rotateY: [startRotateY, 0, endRotateY],
          scale: [0.85, 1.25, 0.85],
          opacity: [0, 1, 0],
        }}
        transition={{ duration: 0.75, times: [0, 0.45, 1], ease: 'easeInOut' }}
        className={`relative w-[90vw] max-w-[550px] aspect-square flex items-center justify-center ${origin}`}
      >
        <MonsteraLeaf
          fillColor="var(--leaf-primary)"
          strokeColor="var(--leaf-stroke)"
          strokeWidth={3}
          className="w-full h-full drop-shadow-2xl"
        />
      </motion.div>
    </div>
  );
};
