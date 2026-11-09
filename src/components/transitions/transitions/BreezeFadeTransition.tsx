'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MonsteraLeaf } from '@/components/leaves/MonsteraLeaf';
import { TaroLeaf } from '@/components/leaves/TaroLeaf';
import { TransitionProps } from '../transitionTypes';

export const BreezeFadeTransition: React.FC<TransitionProps> = () => {
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Calm, soothing veil */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.92, 0.92, 0] }}
        transition={{ duration: 0.8, times: [0, 0.3, 0.7, 1], ease: 'easeInOut' }}
        className="absolute inset-0 bg-[var(--background)] backdrop-blur-sm"
      />

      {/* Gentle diagonal wind drift with subtle blur */}
      <motion.div
        initial={{ x: '-40vw', y: '20vh', opacity: 0, filter: 'blur(4px)' }}
        animate={{
          x: ['-40vw', '0vw', '40vw'],
          y: ['20vh', '0vh', '-20vh'],
          opacity: [0, 0.85, 0],
          filter: ['blur(4px)', 'blur(0px)', 'blur(6px)'],
        }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        className="relative flex items-center gap-6"
      >
        <div className="w-24 h-32 -rotate-12">
          <MonsteraLeaf className="w-full h-full drop-shadow-md" />
        </div>
        <div className="w-20 h-28 rotate-12 -mt-12">
          <TaroLeaf className="w-full h-full drop-shadow-md" />
        </div>
        <div className="w-16 h-20 -rotate-45 mt-8">
          <MonsteraLeaf
            fillColor="var(--leaf-secondary)"
            className="w-full h-full drop-shadow-md"
          />
        </div>
      </motion.div>
    </div>
  );
};
