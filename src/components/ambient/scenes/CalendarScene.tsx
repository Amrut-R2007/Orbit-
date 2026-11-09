'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TaroLeaf } from '@/components/leaves/TaroLeaf';

export const CalendarScene: React.FC<{ cursorOffset: { x: number; y: number } }> = ({
  cursorOffset,
}) => {
  const petals = [
    { id: 1, duration: 22, delay: 0, startX: '15vw', startY: '-40px' },
    { id: 2, duration: 26, delay: 7, startX: '55vw', startY: '-40px' },
    { id: 3, duration: 20, delay: 14, startX: '80vw', startY: '-40px' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: p.startX, y: p.startY, rotate: 0, opacity: 0 }}
          animate={{
            x: `calc(${p.startX} + 22vw)`,
            y: '100vh',
            rotate: 240,
            opacity: [0, 0.16, 0.16, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            transform: `translate3d(${cursorOffset.x * -0.04}px, ${cursorOffset.y * -0.04}px, 0)`,
          }}
          className="absolute w-12 h-16"
        >
          <TaroLeaf className="w-full h-full" />
        </motion.div>
      ))}
    </div>
  );
};
