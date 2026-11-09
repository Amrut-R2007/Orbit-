'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MonsteraLeaf } from '@/components/leaves/MonsteraLeaf';
import { TaroLeaf } from '@/components/leaves/TaroLeaf';
import { TransitionProps } from '../transitionTypes';

export const SunriseBloomTransition: React.FC<TransitionProps> = ({ isMobile }) => {
  const petals = isMobile ? [0, 90, 180, 270] : [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden">
      {/* Background veil */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.95, 0.95, 0] }}
        transition={{ duration: 0.8, times: [0, 0.25, 0.65, 1], ease: 'easeInOut' }}
        className="absolute inset-0 bg-[var(--background)]"
      />

      {/* Radial soft sunrise glow */}
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: [0.3, 1.4, 2], opacity: [0, 0.85, 0] }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute w-72 h-72 rounded-full bg-[var(--leaf-primary)] blur-3xl opacity-50"
      />

      {/* Unfurling Petals / Leaves radiating outward like blooming flower */}
      <div className="relative w-40 h-40 flex items-center justify-center">
        {petals.map((angle, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 0, rotate: angle, opacity: 0 }}
            animate={{
              scale: [0, 1.25, 1.1, 0],
              rotate: [angle, angle + 15, angle + 25],
              opacity: [0, 1, 0.9, 0],
              y: [0, -60, -110],
            }}
            transition={{
              duration: 0.8,
              times: [0, 0.35, 0.7, 1],
              ease: [0.34, 1.56, 0.64, 1],
              delay: idx * 0.02,
            }}
            className="absolute origin-bottom w-20 h-28"
          >
            {idx % 2 === 0 ? (
              <MonsteraLeaf className="w-full h-full drop-shadow-lg" />
            ) : (
              <TaroLeaf className="w-full h-full drop-shadow-md" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
