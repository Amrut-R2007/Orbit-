'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MonsteraLeaf } from '@/components/leaves/MonsteraLeaf';
import { TaroLeaf } from '@/components/leaves/TaroLeaf';
import { TransitionProps } from '../transitionTypes';

export const ConfettiBurstTransition: React.FC<TransitionProps> = ({ isMobile }) => {
  const count = isMobile ? 8 : 14;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.95, 0.95, 0] }}
        transition={{ duration: 0.75, times: [0, 0.25, 0.7, 1] }}
        className="absolute inset-0 bg-[var(--background)]"
      />

      {/* Center celebratory emblem popping out */}
      <motion.div
        initial={{ scale: 0, rotate: -45, opacity: 0 }}
        animate={{ scale: [0, 1.4, 0], rotate: [-45, 0, 45], opacity: [0, 1, 0] }}
        transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative w-36 h-44 z-10"
      >
        <MonsteraLeaf
          fillColor="var(--primary)"
          className="w-full h-full drop-shadow-2xl"
        />
      </motion.div>

      {/* Confetti bursting radially outwards */}
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * 360;
        const radius = isMobile ? 120 : 220;
        const targetX = Math.cos((angle * Math.PI) / 180) * radius;
        const targetY = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 0 }}
            animate={{
              x: [0, targetX, targetX * 1.5],
              y: [0, targetY, targetY * 1.5],
              scale: [0, 1.1, 0],
              rotate: [0, angle * 2, angle * 3],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.75,
              times: [0, 0.5, 1],
              ease: 'easeOut',
            }}
            className="absolute w-8 h-10"
          >
            {i % 2 === 0 ? (
              <MonsteraLeaf
                fillColor={i % 4 === 0 ? 'var(--leaf-primary)' : 'var(--leaf-deep)'}
                className="w-full h-full drop-shadow-md"
              />
            ) : (
              <TaroLeaf
                fillColor="var(--leaf-secondary)"
                className="w-full h-full drop-shadow-md"
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
