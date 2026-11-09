'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MonsteraLeaf } from '@/components/leaves/MonsteraLeaf';

export const TimetableScene: React.FC<{ cursorOffset: { x: number; y: number } }> = ({
  cursorOffset,
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Left side climbing vine */}
      <svg className="absolute top-0 left-0 h-full w-24 opacity-15" viewBox="0 0 100 800" fill="none">
        <path
          d="M 10 0 Q 60 200 20 400 T 50 800"
          stroke="var(--leaf-stroke)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>

      {/* Tiny unfurling leaves along edge */}
      {[140, 320, 520, 700].map((top, i) => (
        <motion.div
          key={i}
          animate={{ rotate: [-8, 8, -8] }}
          transition={{ repeat: Infinity, duration: 7 + i, ease: 'easeInOut' }}
          style={{
            top: `${top}px`,
            left: `${i % 2 === 0 ? '18px' : '36px'}`,
            transform: `translate3d(${cursorOffset.x * -0.03}px, 0, 0)`,
          }}
          className="absolute w-8 h-10 opacity-20"
        >
          <MonsteraLeaf className="w-full h-full" />
        </motion.div>
      ))}
    </div>
  );
};
