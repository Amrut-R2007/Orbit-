'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { TransitionDispatcher } from './TransitionRegistry';
import { useAppStore } from '@/lib/store';

const ROUTE_ORDER = [
  '/',
  '/dashboard',
  '/subjects',
  '/timetable',
  '/calendar',
  '/predictor',
  '/exams',
  '/gpa',
  '/focus',
  '/deadlines',
  '/streaks',
  '/settings',
];

interface TransitionContextType {
  isTransitioning: boolean;
  triggerWipe: (targetPath: string) => void;
}

const TransitionContext = createContext<TransitionContextType>({
  isTransitioning: false,
  triggerWipe: () => {},
});

export const useLeafTransition = () => useContext(TransitionContext);

export const LeafWipeTransitionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const [prevPath, setPrevPath] = useState(pathname);
  const [isReverse, setIsReverse] = useState(false);
  const [isWiping, setIsWiping] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const { motionPreference } = useAppStore();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches || motionPreference === 'off');

    const handler = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches || motionPreference === 'off');
    };
    mediaQuery.addEventListener('change', handler);

    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', handler);
    };
  }, [motionPreference]);

  useEffect(() => {
    if (pathname !== prevPath) {
      const oldIdx = ROUTE_ORDER.indexOf(prevPath);
      const newIdx = ROUTE_ORDER.indexOf(pathname);

      if (newIdx !== -1 && oldIdx !== -1) {
        setIsReverse(newIdx < oldIdx);
      } else {
        setIsReverse(false);
      }

      setIsWiping(true);
      const duration = reducedMotion ? 250 : 780;
      const timer = setTimeout(() => {
        setIsWiping(false);
        setPrevPath(pathname);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [pathname, prevPath, reducedMotion]);

  const triggerWipe = (targetPath: string) => {
    const oldIdx = ROUTE_ORDER.indexOf(pathname);
    const newIdx = ROUTE_ORDER.indexOf(targetPath);
    setIsReverse(newIdx < oldIdx);
    setIsWiping(true);
  };

  return (
    <TransitionContext.Provider value={{ isTransitioning: isWiping, triggerWipe }}>
      {children}
      <TransitionDispatcher
        currentPath={pathname}
        isWiping={isWiping}
        isReverse={isReverse}
        isMobile={isMobile}
        reducedMotion={reducedMotion}
      />
    </TransitionContext.Provider>
  );
};
