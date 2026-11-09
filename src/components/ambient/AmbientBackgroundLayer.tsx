'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { DashboardScene } from './scenes/DashboardScene';
import { SubjectsScene } from './scenes/SubjectsScene';
import { TimetableScene } from './scenes/TimetableScene';
import { CalendarScene } from './scenes/CalendarScene';
import { ExamsScene } from './scenes/ExamsScene';
import { PredictorScene } from './scenes/PredictorScene';
import { GpaScene } from './scenes/GpaScene';
import { FocusScene } from './scenes/FocusScene';
import { DeadlinesScene } from './scenes/DeadlinesScene';
import { StreaksScene } from './scenes/StreaksScene';
import { SettingsScene } from './scenes/SettingsScene';

export const AmbientBackgroundLayer: React.FC = () => {
  const pathname = usePathname();
  const { motionPreference } = useAppStore();
  const [cursorOffset, setCursorOffset] = useState({ x: 0, y: 0 });
  const [isPaused, setIsPaused] = useState(false);

  // Check visibility and reduced-motion
  useEffect(() => {
    const handleVisibility = () => setIsPaused(document.hidden);
    document.addEventListener('visibilitychange', handleVisibility);

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      setCursorOffset({
        x: e.clientX - innerWidth / 2,
        y: e.clientY - innerHeight / 2,
      });
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        setCursorOffset({
          x: (e.gamma / 45) * 80,
          y: ((e.beta - 45) / 45) * 80,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('mousemove', handleMouseMove);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, []);

  // Do not render on landing page (hero has its own separate animation) or if motion is OFF
  if (pathname === '/' || pathname === '/onboarding' || motionPreference === 'off' || isPaused) {
    return null;
  }

  const renderScene = () => {
    switch (pathname) {
      case '/dashboard':
        return <DashboardScene cursorOffset={cursorOffset} />;
      case '/subjects':
        return <SubjectsScene cursorOffset={cursorOffset} />;
      case '/timetable':
        return <TimetableScene cursorOffset={cursorOffset} />;
      case '/calendar':
        return <CalendarScene cursorOffset={cursorOffset} />;
      case '/exams':
        return <ExamsScene cursorOffset={cursorOffset} />;
      case '/predictor':
        return <PredictorScene cursorOffset={cursorOffset} />;
      case '/gpa':
        return <GpaScene cursorOffset={cursorOffset} />;
      case '/focus':
        return <FocusScene cursorOffset={cursorOffset} />;
      case '/deadlines':
        return <DeadlinesScene cursorOffset={cursorOffset} />;
      case '/streaks':
        return <StreaksScene cursorOffset={cursorOffset} />;
      case '/settings':
      default:
        return <SettingsScene cursorOffset={cursorOffset} />;
    }
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
      aria-hidden="true"
    >
      {renderScene()}
    </div>
  );
};
