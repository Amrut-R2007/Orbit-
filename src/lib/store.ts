import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';
export type MotionMode = 'full' | 'reduced' | 'off';

interface AppState {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemeMode) => void;
  setResolvedTheme: (resolved: 'light' | 'dark') => void;

  // Ambient Motion preference
  motionPreference: MotionMode;
  setMotionPreference: (mode: MotionMode) => void;

  // Active Semester (1 to 8)
  activeSemester: number;
  setActiveSemester: (sem: number) => void;

  // Demo / Offline Mode Toggle (allows full instantaneous interaction even without immediate Firebase keys)
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;

  // Active Focus Session status
  isFocusRunning: boolean;
  focusRemainingSeconds: number;
  activeFocusSubjectId?: string;
  setFocusState: (running: boolean, remaining: number, subjectId?: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'light',
  resolvedTheme: 'light',
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('orbit_theme', theme);
    }
    set({ theme });
  },
  setResolvedTheme: (resolvedTheme) => set({ resolvedTheme }),

  motionPreference: 'full',
  setMotionPreference: (motionPreference) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('orbit_motion', motionPreference);
    }
    set({ motionPreference });
  },

  activeSemester: 4,
  setActiveSemester: (activeSemester) => set({ activeSemester }),

  isDemoMode: true, // Default to demo-ready state so app functions immediately with rich sample data!
  setIsDemoMode: (isDemoMode) => set({ isDemoMode }),

  isFocusRunning: false,
  focusRemainingSeconds: 25 * 60,
  activeFocusSubjectId: undefined,
  setFocusState: (isFocusRunning, focusRemainingSeconds, activeFocusSubjectId) =>
    set({ isFocusRunning, focusRemainingSeconds, activeFocusSubjectId }),
}));
