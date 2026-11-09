'use client';

import React from 'react';

interface LeafProps extends React.SVGProps<SVGSVGElement> {
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
}

export const HatchedLeaf: React.FC<LeafProps> = ({
  fillColor = 'var(--leaf-hatched)',
  strokeColor = 'var(--leaf-stroke)',
  strokeWidth = 2.5,
  className = '',
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`theme-transition transition-colors duration-300 ${className}`}
      {...props}
    >
      <defs>
        <pattern
          id="leaf-hatch-pattern"
          width="12"
          height="12"
          patternTransform="rotate(45 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="12"
            stroke={strokeColor}
            strokeWidth="1.8"
          />
        </pattern>
      </defs>

      {/* Main leaf outline */}
      <path
        d="M 20 180 C 40 100 80 40 180 20 C 170 100 120 160 20 180 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Overlay fine line hatching like in botanical reference */}
      <path
        d="M 20 180 C 40 100 80 40 180 20 C 170 100 120 160 20 180 Z"
        fill="url(#leaf-hatch-pattern)"
        opacity="0.85"
      />

      {/* Central Curved Midrib */}
      <path
        d="M 20 180 Q 90 110 180 20"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 1.3}
        strokeLinecap="round"
      />
    </svg>
  );
};
