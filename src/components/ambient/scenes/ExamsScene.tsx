'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PalmFrond } from '@/components/leaves/PalmFrond';

export const ExamsScene: React.FC<{ cursorOffset: { x: number; y: number } }> = ({
  cursorOffset,
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top-right corner swaying palm frond */}
      <motion.div
        animate={{ rotate: [-3, 4, -3] }}
        transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
        style={{
          transform: `translate3d(${cursorOffset.x * -0.05}px, ${cursorOffset.y * -0.05}px, 0)`,
        }}
        className="absolute -top-16 -right-16 w-80 h-80 opacity-15 origin-top-right"
      >
        <PalmFrond className="w-full h-full" />
      </motion.div>

      {/* Bottom-left corner swaying palm frond */}
      <motion.div
        animate={{ rotate: [4, -3, 4] }}
        transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut' }}
        style={{
          transform: `translate3d(${cursorOffset.x * -0.05}px, ${cursorOffset.y * -0.05}px, 0)`,
        }}
        className="absolute -bottom-16 -left-16 w-80 h-80 opacity-15 origin-bottom-left"
      >
        <PalmFrond className="w-full h-full rotate-180" />
      </motion.div>
    </div>
  );
};
