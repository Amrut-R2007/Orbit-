'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MonsteraLeaf } from '@/components/leaves/MonsteraLeaf';

export const PredictorScene: React.FC<{ cursorOffset: { x: number; y: number } }> = ({
  cursorOffset,
}) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
      {/* Concentric rotating faint orbit rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
        style={{
          transform: `translate3d(${cursorOffset.x * -0.04}px, ${cursorOffset.y * -0.04}px, 0)`,
        }}
        className="relative w-[500px] h-[500px] rounded-full border border-dashed border-[var(--primary)] opacity-15 flex items-center justify-center"
      >
        {/* Inner ring */}
        <div className="w-[320px] h-[320px] rounded-full border border-dotted border-[var(--primary)] opacity-60" />

        {/* Orbiting tiny leaf */}
        <div className="absolute top-0 -translate-y-1/2 w-10 h-12 opacity-80">
          <MonsteraLeaf className="w-full h-full" />
        </div>
      </motion.div>
    </div>
  );
};
