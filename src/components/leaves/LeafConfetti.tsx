'use client';

import confetti from 'canvas-confetti';
import { useAppStore } from '@/lib/store';

export function fireLeafConfetti(isDark: boolean = false) {
  // Peach in light mode, Purple in dark mode!
  const colors = isDark
    ? ['#7C5CBF', '#A78BFA', '#4C3A8A', '#CFC2F5', '#8B5CF6']
    : ['#FFCBA4', '#FFE2CC', '#F4A261', '#E76F51', '#2F2F2F'];

  const count = 75;
  const defaults = {
    origin: { y: 0.7 },
    colors,
    shapes: ['circle', 'square'] as confetti.Shape[],
    scalar: 1.3,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.5,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}
