'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MonsteraLeaf } from '@/components/leaves/MonsteraLeaf';
import { TaroLeaf } from '@/components/leaves/TaroLeaf';

export const GpaScene: React.FC<{ cursorOffset: { x: number; y: number } }> = ({
  cursorOffset,
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Rising botanical stem from bottom right */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [-1, 1.5, -1] }}
        transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
        style={{
          transform: `translate3d(${cursorOffset.x * -0.05}px, ${cursorOffset.y * -0.05}px, 0)`,
        }}
        className="absolute -bottom-10 right-8 w-60 h-72 opacity-15 origin-bottom"
      >
        <MonsteraLeaf className="w-full h-full" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -10, 0], rotate: [1.5, -1, 1.5] }}
        transition={{ repeat: Infinity, duration: 11, ease: 'easeInOut' }}
        style={{
          transform: `translate3d(${cursorOffset.x * -0.03}px, ${cursorOffset.y * -0.03}px, 0)`,
        }}
        className="absolute -bottom-12 right-40 w-44 h-56 opacity-12 origin-bottom"
      >
        <TaroLeaf className="w-full h-full" />
      </motion.div>
    </div>
  );
};
