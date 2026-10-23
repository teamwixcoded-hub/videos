import React from 'react';

// Analog clock drawn in code. `minutes` is minutes since 12:00 (can exceed 720).
export const Clock: React.FC<{minutes: number; size?: number; accent?: string}> = ({
  minutes,
  size = 160,
  accent = '#d9453b',
}) => {
  const m = minutes % 60;
  const h = (minutes / 60) % 12;
  const c = size / 2;
  const hand = (deg: number, len: number, w: number, color: string) => (
    <line
      x1={c}
      y1={c}
      x2={c + Math.sin((deg * Math.PI) / 180) * len}
      y2={c - Math.cos((deg * Math.PI) / 180) * len}
      stroke={color}
      strokeWidth={w}
      strokeLinecap="round"
    />
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={c} cy={c} r={c - 4} fill="#f4efe6" stroke="#111" strokeWidth={6} />
      {hand(h * 30, c * 0.5, 7, '#111')}
      {hand(m * 6, c * 0.75, 5, '#111')}
      <circle cx={c} cy={c} r={6} fill={accent} />
    </svg>
  );
};
