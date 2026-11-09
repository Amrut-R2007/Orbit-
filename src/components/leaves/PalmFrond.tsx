'use client';

import React from 'react';

interface LeafProps extends React.SVGProps<SVGSVGElement> {
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  className?: string;
}

export const PalmFrond: React.FC<LeafProps> = ({
  fillColor = 'var(--leaf-secondary)',
  strokeColor = 'var(--leaf-stroke)',
  strokeWidth = 2.5,
  className = '',
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`theme-transition transition-colors duration-300 ${className}`}
      {...props}
    >
      {/* Central curving rachis/stem */}
      <path
        d="M 25 195 Q 90 130 195 25"
        stroke={strokeColor}
        strokeWidth={strokeWidth * 1.3}
        strokeLinecap="round"
      />

      {/* Feathered leaflets - Right side */}
      <path
        d="M 80 145 C 115 130 165 140 185 170 C 150 155 110 152 82 147"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d="M 105 120 C 145 105 190 115 210 135 C 175 125 135 122 107 122"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d="M 130 95 C 165 75 200 80 215 95 C 185 88 155 90 132 97"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d="M 155 70 C 180 52 205 52 215 62 C 192 60 172 65 157 72"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />

      {/* Feathered leaflets - Left side */}
      <path
        d="M 60 165 C 40 130 35 85 55 60 C 58 95 65 135 62 167"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d="M 85 140 C 65 105 65 60 90 40 C 88 75 92 110 87 142"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d="M 115 110 C 100 80 105 40 130 25 C 122 55 124 85 117 112"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <path
        d="M 148 78 C 135 55 142 30 165 18 C 155 40 156 62 150 80"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />

      {/* Terminal tip leaflet */}
      <path
        d="M 195 25 C 205 15 212 12 218 8 C 210 18 202 24 195 25"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};
