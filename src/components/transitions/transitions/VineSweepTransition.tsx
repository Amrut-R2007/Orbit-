'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MonsteraLeaf } from '@/components/leaves/MonsteraLeaf';
import { TransitionProps } from '../transitionTypes';

export const VineSweepTransition: React.FC<TransitionProps> = ({ isReverse, isMobile }) => {
  const directionMultiplier = isReverse ? -1 : 1;
  const leafCount = isMobile ? 3 : 6;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.95, 0.95, 0] }}
        transition={{ duration: 0.8, times: [0, 0.25, 0.7, 1] }}
        className="absolute inset-0 bg-[var(--background)]"
      />

      {/* Sweeping Botanical Vine with SVG Draw-on */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 600"
        preserveAspectRatio="none"
        fill="none"
      >
        <motion.path
          d={
            isReverse
              ? 'M 1050 500 Q 700 200 400 400 T -50 150'
              : 'M -50 150 Q 300 400 600 200 T 1050 500'
          }
          stroke="var(--leaf-stroke)"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
          transition={{ duration: 0.8, times: [0, 0.65, 1], ease: 'easeInOut' }}
        />
      </svg>

      {/* Sprouting Leaves appearing along vine path */}
      <div className="absolute inset-0 flex items-center justify-around px-8">
        {Array.from({ length: leafCount }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -30 * directionMultiplier, opacity: 0 }}
            animate={{
              scale: [0, 1.2, 1, 0],
              rotate: [-30 * directionMultiplier, 15 * (i % 2 === 0 ? 1 : -1), 0],
              opacity: [0, 1, 1, 0],
              y: [0, (i % 2 === 0 ? -40 : 40), 0],
            }}
            transition={{
              duration: 0.75,
              times: [0, 0.45, 0.75, 1],
              delay: (i * 0.08),
              ease: 'easeOut',
            }}
            className="w-16 h-20"
          >
            <MonsteraLeaf
              fillColor={i % 2 === 0 ? 'var(--leaf-primary)' : 'var(--leaf-secondary)'}
              className="w-full h-full drop-shadow-lg"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
