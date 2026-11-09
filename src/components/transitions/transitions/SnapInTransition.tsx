'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MonsteraLeaf } from '@/components/leaves/MonsteraLeaf';
import { PalmFrond } from '@/components/leaves/PalmFrond';
import { TransitionProps } from '../transitionTypes';

export const SnapInTransition: React.FC<TransitionProps> = () => {
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.95, 0.95, 0] }}
        transition={{ duration: 0.65, times: [0, 0.2, 0.65, 1] }}
        className="absolute inset-0 bg-[var(--background)]"
      />

      {/* Brisk rush from bottom-right with spring overshoot */}
      <motion.div
        initial={{ x: '80vw', y: '80vh', scale: 0.5, opacity: 0 }}
        animate={{
          x: ['80vw', '0vw', '-20vw'],
          y: ['80vh', '0vh', '-20vh'],
          scale: [0.5, 1.25, 0.9],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 0.65,
          times: [0, 0.45, 1],
          ease: [0.34, 1.56, 0.64, 1], // Crisp overshoot spring
        }}
        className="relative w-80 h-80 flex items-center justify-center"
      >
        <PalmFrond className="w-full h-full rotate-45 drop-shadow-2xl" />
        <div className="absolute w-44 h-52 -rotate-12">
          <MonsteraLeaf
            fillColor="var(--leaf-deep)"
            className="w-full h-full drop-shadow-xl"
          />
        </div>
      </motion.div>
    </div>
  );
};
