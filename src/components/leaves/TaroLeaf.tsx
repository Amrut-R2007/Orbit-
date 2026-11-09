'use client';

import React from 'react';

interface LeafProps extends React.SVGProps<SVGSVGElement> {
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
}

export const TaroLeaf: React.FC<LeafProps> = ({
  fillColor = 'var(--leaf-deep)',
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
      {/* Broad Cordate / Peltate Taro (Elephant Ear) Leaf Blade */}
      <path
        d="M 100 35 
           C 135 15, 180 30, 185 75 
           C 190 120, 155 175, 100 190 
           C 45 175, 10 120, 15 75 
           C 20 30, 65 15, 100 35 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />

      {/* Central Insertion Point (Petiole node) */}
      <circle cx="100" cy="85" r="4" fill={strokeColor} />

      {/* Primary Radial Veins radiating outwards */}
      {/* Top lobes */}
      <path
        d="M 100 85 Q 115 55 100 35"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M 100 85 Q 135 50 165 48"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.9}
        strokeLinecap="round"
      />
      <path
        d="M 100 85 Q 65 50 35 48"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.9}
        strokeLinecap="round"
      />

      {/* Lateral veins */}
      <path
        d="M 100 85 Q 145 80 182 82"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.9}
        strokeLinecap="round"
      />
      <path
        d="M 100 85 Q 55 80 18 82"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.9}
        strokeLinecap="round"
      />

      {/* Lower veins */}
      <path
        d="M 100 85 Q 140 125 160 145"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.9}
        strokeLinecap="round"
      />
      <path
        d="M 100 85 Q 60 125 40 145"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.9}
        strokeLinecap="round"
      />

      {/* Basal midrib down to apex */}
      <path
        d="M 100 85 Q 100 140 100 190"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 1.1}
        strokeLinecap="round"
      />
    </svg>
  );
};
