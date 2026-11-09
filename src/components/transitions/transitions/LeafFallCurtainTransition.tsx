'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MonsteraLeaf } from '@/components/leaves/MonsteraLeaf';
import { TaroLeaf } from '@/components/leaves/TaroLeaf';
import { PalmFrond } from '@/components/leaves/PalmFrond';
import { TransitionProps } from '../transitionTypes';

export const LeafFallCurtainTransition: React.FC<TransitionProps> = ({ isMobile, isReverse }) => {
  const count = isMobile ? 8 : 16;
  const blowDirection = isReverse ? -120 : 120;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.95, 0.95, 0] }}
        transition={{ duration: 0.8, times: [0, 0.3, 0.7, 1] }}
        className="absolute inset-0 bg-[var(--background)]"
      />

      {/* Grid of cascading tumbling leaves creating a curtain */}
      <div className="absolute inset-0 grid grid-cols-4 sm:grid-cols-8 gap-4 p-4 items-center">
        {Array.from({ length: count }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: '-100vh', rotate: i * 35, opacity: 0 }}
            animate={{
              y: ['-100vh', '0vh', '20vh'],
              x: [0, 0, blowDirection],
              rotate: [i * 35, i * 45 + 180, i * 45 + 360],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.8,
              times: [0, 0.5, 1],
              delay: (i % 4) * 0.05,
              ease: 'easeInOut',
            }}
            className="w-14 h-16 flex items-center justify-center mx-auto"
          >
            {i % 3 === 0 ? (
              <MonsteraLeaf className="w-full h-full drop-shadow-md" />
            ) : i % 3 === 1 ? (
              <TaroLeaf className="w-full h-full drop-shadow-md" />
            ) : (
              <PalmFrond className="w-full h-full drop-shadow-md" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
