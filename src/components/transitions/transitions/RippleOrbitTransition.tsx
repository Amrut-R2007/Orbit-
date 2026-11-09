'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MonsteraLeaf } from '@/components/leaves/MonsteraLeaf';
import { TransitionProps } from '../transitionTypes';

export const RippleOrbitTransition: React.FC<TransitionProps> = ({ isMobile }) => {
  const ringCounts = isMobile ? [1, 2] : [1, 2, 3];

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.95, 0.95, 0] }}
        transition={{ duration: 0.75, times: [0, 0.25, 0.7, 1] }}
        className="absolute inset-0 bg-[var(--background)]"
      />

      {/* Concentric expanding orbit rings with orbiting leaves */}
      {ringCounts.map((ring) => (
        <motion.div
          key={ring}
          initial={{ scale: 0.2, rotate: 0, opacity: 0 }}
          animate={{
            scale: [0.2, 1 + ring * 0.45, 1.8 + ring * 0.6],
            rotate: [0, 90 * ring, 180 * ring],
            opacity: [0, 0.9, 0],
          }}
          transition={{
            duration: 0.75,
            delay: ring * 0.08,
            ease: 'easeOut',
          }}
          className="absolute rounded-full border-2 border-[var(--primary)] flex items-center justify-center"
          style={{ width: `${ring * 220}px`, height: `${ring * 220}px` }}
        >
          {/* Leaves riding along the orbital perimeter */}
          <div className="absolute top-0 -translate-y-1/2 w-12 h-14">
            <MonsteraLeaf className="w-full h-full drop-shadow-md" />
          </div>
          <div className="absolute bottom-0 translate-y-1/2 w-12 h-14">
            <MonsteraLeaf
              fillColor="var(--leaf-secondary)"
              className="w-full h-full rotate-180 drop-shadow-md"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
