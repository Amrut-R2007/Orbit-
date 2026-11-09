'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MonsteraLeaf } from '@/components/leaves/MonsteraLeaf';
import { TaroLeaf } from '@/components/leaves/TaroLeaf';

export const DashboardScene: React.FC<{ cursorOffset: { x: number; y: number } }> = ({
  cursorOffset,
}) => {
  const leaves = [
    { id: 1, duration: 14, delay: 0, startX: '85vw', driftX: -140 },
    { id: 2, duration: 18, delay: 5, startX: '75vw', driftX: -200 },
    { id: 3, duration: 16, delay: 10, startX: '92vw', driftX: -120 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {leaves.map((leaf, idx) => (
        <motion.div
          key={leaf.id}
          initial={{ y: -80, x: leaf.startX, rotate: 15, opacity: 0 }}
          animate={{
            y: ['0vh', '85vh'],
            x: [leaf.startX, `calc(${leaf.startX} + ${leaf.driftX}px)`],
            rotate: [15, 160],
            opacity: [0, 0.18, 0.18, 0],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            transform: `translate3d(${cursorOffset.x * -0.05}px, ${cursorOffset.y * -0.05}px, 0)`,
          }}
          className="absolute w-20 h-24"
        >
          {idx % 2 === 0 ? (
            <MonsteraLeaf className="w-full h-full" />
          ) : (
            <TaroLeaf className="w-full h-full" />
          )}
        </motion.div>
      ))}
    </div>
  );
};
