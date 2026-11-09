'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MonsteraLeaf } from '@/components/leaves/MonsteraLeaf';
import { TaroLeaf } from '@/components/leaves/TaroLeaf';
import { TransitionProps } from '../transitionTypes';

export const GrowthRingsTransition: React.FC<TransitionProps> = () => {
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.95, 0.95, 0] }}
        transition={{ duration: 0.8, times: [0, 0.25, 0.7, 1] }}
        className="absolute inset-0 bg-[var(--background)]"
      />

      {/* Tree-ring concentric circles expanding from center */}
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          initial={{ scale: 0.1, opacity: 0 }}
          animate={{ scale: [0.1, 1.2 * ring, 2 * ring], opacity: [0, 0.75, 0] }}
          transition={{ duration: 0.8, delay: ring * 0.07, ease: 'easeOut' }}
          className="absolute rounded-full border border-dashed border-[var(--primary)]"
          style={{ width: `${ring * 160}px`, height: `${ring * 160}px` }}
        />
      ))}

      {/* Upward growing stem with blooming foliage */}
      <div className="relative w-48 h-80 flex flex-col items-center justify-end">
        {/* Central stem */}
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: ['0px', '260px', '260px'], opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, times: [0, 0.6, 1], ease: 'easeOut' }}
          className="w-1.5 bg-[var(--leaf-stroke)] rounded-full origin-bottom"
        />

        {/* Left leaf sprouting */}
        <motion.div
          initial={{ scale: 0, rotate: -45, opacity: 0 }}
          animate={{
            scale: [0, 1.2, 0],
            rotate: [-45, -25, -25],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 0.75, delay: 0.2, ease: 'easeOut' }}
          className="absolute top-24 left-2 w-16 h-20 origin-bottom-right"
        >
          <TaroLeaf className="w-full h-full drop-shadow-lg" />
        </motion.div>

        {/* Right leaf sprouting */}
        <motion.div
          initial={{ scale: 0, rotate: 45, opacity: 0 }}
          animate={{
            scale: [0, 1.2, 0],
            rotate: [45, 25, 25],
            opacity: [0, 1, 0],
          }}
          transition={{ duration: 0.75, delay: 0.3, ease: 'easeOut' }}
          className="absolute top-12 right-2 w-18 h-22 origin-bottom-left"
        >
          <MonsteraLeaf className="w-full h-full drop-shadow-lg" />
        </motion.div>
      </div>
    </div>
  );
};
