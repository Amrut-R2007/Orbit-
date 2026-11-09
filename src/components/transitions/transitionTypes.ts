import React from 'react';

export interface TransitionProps {
  isReverse?: boolean;
  isMobile?: boolean;
  onComplete?: () => void;
}
