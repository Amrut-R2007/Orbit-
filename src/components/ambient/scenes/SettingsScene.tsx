'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MonsteraLeaf } from '@/components/leaves/MonsteraLeaf';

export const SettingsScene: React.FC<{ cursorOffset: { x: number; y: number } }> = ({
  cursorOffset,
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{ rotate: [-0.5, 0.5, -0.5] }}
        transition={{ repeat: Infinity, duration: 18, ease: 'easeInOut' }}
        style={{
          transform: `translate3d(${cursorOffset.x * -0.015}px, ${cursorOffset.y * -0.015}px, 0)`,
        }}
        className="absolute top-12 right-12 w-36 h-44 opacity-10"
      >
        <MonsteraLeaf className="w-full h-full" />
      </motion.div>
    </div>
  );
};
