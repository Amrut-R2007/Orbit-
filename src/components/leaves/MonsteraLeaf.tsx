'use client';

import React from 'react';

interface LeafProps extends React.SVGProps<SVGSVGElement> {
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
}

export const MonsteraLeaf: React.FC<LeafProps> = ({
  fillColor = 'var(--leaf-primary)',
  strokeColor = 'var(--leaf-stroke)',
  strokeWidth = 2.5,
  className = '',
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`theme-transition transition-colors duration-300 ${className}`}
      {...props}
    >
      {/* Main Monstera Leaf Blade with Deep Lobes */}
      <path
        d="M 100 15 
           C 125 15, 155 35, 170 65 
           C 155 70, 142 80, 148 92 
           C 153 102, 172 95, 185 105 
           C 188 120, 180 145, 165 160 
           C 150 155, 140 165, 145 178 
           C 150 188, 168 185, 162 205 
           C 145 225, 115 230, 95 230 
           C 75 230, 45 225, 30 205 
           C 25 188, 42 188, 48 178 
           C 52 165, 42 155, 28 160 
           C 15 145, 8 120, 10 105 
           C 24 95, 42 102, 48 92 
           C 52 80, 40 70, 25 65 
           C 40 35, 70 15, 100 15 Z"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Primary Central Stem */}
      <path
        d="M 100 20 Q 98 120 95 235"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 1.2}
        strokeLinecap="round"
      />

      {/* Internal Fenestrations (Slits / Holes typical of Monstera Deliciosa) */}
      <ellipse
        cx="72"
        cy="75"
        rx="7"
        ry="18"
        transform="rotate(-25 72 75)"
        fill="var(--background)"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.9}
      />
      <ellipse
        cx="125"
        cy="85"
        rx="8"
        ry="20"
        transform="rotate(28 125 85)"
        fill="var(--background)"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.9}
      />
      <ellipse
        cx="68"
        cy="130"
        rx="7"
        ry="22"
        transform="rotate(-35 68 130)"
        fill="var(--background)"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.9}
      />
      <ellipse
        cx="132"
        cy="140"
        rx="7"
        ry="20"
        transform="rotate(32 132 140)"
        fill="var(--background)"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.9}
      />

      {/* Side Veins */}
      <path
        d="M 98 70 Q 120 62 145 75"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.8}
        strokeLinecap="round"
      />
      <path
        d="M 98 105 Q 65 100 48 115"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.8}
        strokeLinecap="round"
      />
      <path
        d="M 97 145 Q 125 140 148 155"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 0.8}
        strokeLinecap="round"
      />
    </svg>
  );
};
