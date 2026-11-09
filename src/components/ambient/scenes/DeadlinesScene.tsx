'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MonsteraLeaf } from '@/components/leaves/MonsteraLeaf';

export const DeadlinesScene: React.FC<{ cursorOffset: { x: number; y: number } }> = ({
  cursorOffset,
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ x: '-10vw', y: `${i * 28}vh`, opacity: 0 }}
          animate={{
            x: '110vw',
            y: `${i * 28 + (i % 2 === 0 ? 10 : -10)}vh`,
            rotate: [0, 90],
            opacity: [0, 0.16, 0.16, 0],
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            delay: i * 4,
            ease: 'linear',
          }}
          style={{
            transform: `translate3d(${cursorOffset.x * -0.05}px, ${cursorOffset.y * -0.05}px, 0)`,
          }}
          className="absolute w-16 h-20"
        >
          <MonsteraLeaf className="w-full h-full" />
        </motion.div>
      ))}
    </div>
  );
};
