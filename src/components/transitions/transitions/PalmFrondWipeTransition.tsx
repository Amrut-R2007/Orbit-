'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PalmFrond } from '@/components/leaves/PalmFrond';
import { TransitionProps } from '../transitionTypes';

export const PalmFrondWipeTransition: React.FC<TransitionProps> = () => {
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.95, 0.95, 0] }}
        transition={{ duration: 0.8, times: [0, 0.25, 0.7, 1] }}
        className="absolute inset-0 bg-[var(--background)]"
      />

      {/* Left Palm Frond sweeps in to center, then parts */}
      <motion.div
        initial={{ x: '-100vw', rotate: -35 }}
        animate={{
          x: ['-100vw', '-10vw', '-100vw'],
          rotate: [-35, 10, -35],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 0.8,
          times: [0, 0.48, 1],
          ease: [0.65, 0, 0.35, 1],
        }}
        className="absolute left-0 w-[80vw] max-w-[500px] aspect-square"
      >
        <PalmFrond
          fillColor="var(--leaf-primary)"
          className="w-full h-full drop-shadow-2xl scale-125"
        />
      </motion.div>

      {/* Right Palm Frond sweeps in to center, then parts */}
      <motion.div
        initial={{ x: '100vw', rotate: 35 }}
        animate={{
          x: ['100vw', '10vw', '100vw'],
          rotate: [35, -10, 35],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 0.8,
          times: [0, 0.48, 1],
          ease: [0.65, 0, 0.35, 1],
        }}
        className="absolute right-0 w-[80vw] max-w-[500px] aspect-square"
      >
        <PalmFrond
          fillColor="var(--leaf-deep)"
          className="w-full h-full -scale-x-125 scale-y-125 drop-shadow-2xl"
        />
      </motion.div>
    </div>
  );
};
