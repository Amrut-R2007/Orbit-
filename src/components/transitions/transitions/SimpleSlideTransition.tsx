'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MonsteraLeaf } from '@/components/leaves/MonsteraLeaf';
import { TransitionProps } from '../transitionTypes';

export const SimpleSlideTransition: React.FC<TransitionProps> = ({ isReverse }) => {
  const directionMultiplier = isReverse ? -1 : 1;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-between overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.9, 0.9, 0] }}
        transition={{ duration: 0.6, times: [0, 0.25, 0.7, 1] }}
        className="absolute inset-0 bg-[var(--background)]"
      />

      {/* Elegant minimalist outline leaf tracing across edge */}
      <motion.div
        initial={{ x: `${directionMultiplier * 100}vw`, opacity: 0 }}
        animate={{
          x: [`${directionMultiplier * 100}vw`, '0vw', `${-directionMultiplier * 100}vw`],
          opacity: [0, 1, 0],
        }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        className="relative w-48 h-60 mx-auto"
      >
        <MonsteraLeaf
          fillColor="transparent"
          strokeColor="var(--leaf-stroke)"
          strokeWidth={2}
          className="w-full h-full opacity-80"
        />
      </motion.div>
    </div>
  );
};
