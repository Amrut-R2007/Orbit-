'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SunriseBloomTransition } from './transitions/SunriseBloomTransition';
import { BookLeafFlipTransition } from './transitions/BookLeafFlipTransition';
import { VineSweepTransition } from './transitions/VineSweepTransition';
import { LeafFallCurtainTransition } from './transitions/LeafFallCurtainTransition';
import { PalmFrondWipeTransition } from './transitions/PalmFrondWipeTransition';
import { RippleOrbitTransition } from './transitions/RippleOrbitTransition';
import { GrowthRingsTransition } from './transitions/GrowthRingsTransition';
import { BreezeFadeTransition } from './transitions/BreezeFadeTransition';
import { SnapInTransition } from './transitions/SnapInTransition';
import { ConfettiBurstTransition } from './transitions/ConfettiBurstTransition';
import { SimpleSlideTransition } from './transitions/SimpleSlideTransition';

interface RegistryProps {
  currentPath: string;
  isWiping: boolean;
  isReverse: boolean;
  isMobile: boolean;
  reducedMotion: boolean;
}

export const TransitionDispatcher: React.FC<RegistryProps> = ({
  currentPath,
  isWiping,
  isReverse,
  isMobile,
  reducedMotion,
}) => {
  if (!isWiping) return null;

  // Reduced motion: Clean, instant 200ms fade
  if (reducedMotion) {
    return (
      <AnimatePresence>
        <motion.div
          key={`reduced-fade-${currentPath}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.95, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] pointer-events-none bg-[var(--background)]"
        />
      </AnimatePresence>
    );
  }

  // Keyed signature transition by destination path
  const renderSignature = () => {
    switch (currentPath) {
      case '/dashboard':
        return <SunriseBloomTransition isMobile={isMobile} isReverse={isReverse} />;
      case '/subjects':
        return <BookLeafFlipTransition isMobile={isMobile} isReverse={isReverse} />;
      case '/timetable':
        return <VineSweepTransition isMobile={isMobile} isReverse={isReverse} />;
      case '/calendar':
        return <LeafFallCurtainTransition isMobile={isMobile} isReverse={isReverse} />;
      case '/exams':
        return <PalmFrondWipeTransition isMobile={isMobile} isReverse={isReverse} />;
      case '/predictor':
        return <RippleOrbitTransition isMobile={isMobile} isReverse={isReverse} />;
      case '/gpa':
        return <GrowthRingsTransition isMobile={isMobile} isReverse={isReverse} />;
      case '/focus':
        return <BreezeFadeTransition isMobile={isMobile} isReverse={isReverse} />;
      case '/deadlines':
        return <SnapInTransition isMobile={isMobile} isReverse={isReverse} />;
      case '/streaks':
        return <ConfettiBurstTransition isMobile={isMobile} isReverse={isReverse} />;
      case '/settings':
      default:
        return <SimpleSlideTransition isMobile={isMobile} isReverse={isReverse} />;
    }
  };

  return <AnimatePresence mode="wait">{renderSignature()}</AnimatePresence>;
};
