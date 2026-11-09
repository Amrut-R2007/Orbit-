'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MonsteraLeaf } from '@/components/leaves/MonsteraLeaf';
import { Sparkles } from 'lucide-react';

export const StreaksScene: React.FC<{ cursorOffset: { x: number; y: number } }> = ({
  cursorOffset,
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Sparkles floating subtly */}
      {[
        { top: '15%', left: '20%', delay: 0 },
        { top: '45%', left: '80%', delay: 2 },
        { top: '75%', left: '30%', delay: 4 },
      ].map((pos, idx) => (
        <motion.div
          key={idx}
          animate={{ scale: [0.6, 1.3, 0.6], opacity: [0.1, 0.25, 0.1] }}
          transition={{ repeat: Infinity, duration: 4, delay: pos.delay, ease: 'easeInOut' }}
          style={{
            top: pos.top,
            left: pos.left,
            transform: `translate3d(${cursorOffset.x * -0.04}px, ${cursorOffset.y * -0.04}px, 0)`,
          }}
          className="absolute text-[var(--primary)]"
        >
          <Sparkles className="w-8 h-8" />
        </motion.div>
      ))}

      {/* Gentle leaf glints in corner */}
      <motion.div
        animate={{ rotate: [-2, 3, -2], opacity: [0.12, 0.18, 0.12] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        style={{
          transform: `translate3d(${cursorOffset.x * -0.03}px, ${cursorOffset.y * -0.03}px, 0)`,
        }}
        className="absolute bottom-10 left-10 w-32 h-40 origin-bottom-left"
      >
        <MonsteraLeaf className="w-full h-full" />
      </motion.div>
    </div>
  );
};
