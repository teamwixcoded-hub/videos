import React from 'react';
import {interpolate, random, useCurrentFrame} from 'remotion';

// Code-drawn phone screen: a search bar that types `query`, then thumbnails that scroll.
export const PhoneUI: React.FC<{query: string; typeStart?: number; charsPerSec?: number; width?: number}> = ({
  query,
  typeStart = 15,
  charsPerSec = 10,
  width = 420,
}) => {
  const frame = useCurrentFrame();
  const chars = Math.max(0, Math.min(query.length, Math.floor(((frame - typeStart) / 30) * charsPerSec)));
  const typed = query.slice(0, chars);
  const cursor = Math.floor(frame / 15) % 2 === 0 ? '|' : ' ';
  const scroll = interpolate(frame, [typeStart + 60, typeStart + 600], [0, 900], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'extend',
  });
  return (
    <div
      style={{
        width,
        height: width * 2,
        borderRadius: 48,
        background: '#0b0d12',
        border: '8px solid #222',
        overflow: 'hidden',
        fontFamily: 'Inter, Arial, sans-serif',
        boxShadow: '0 0 120px rgba(90,150,255,0.45)',
      }}
    >
      <div style={{margin: 24, padding: '16px 20px', borderRadius: 40, background: '#1c2030', color: '#e8ecf5', fontSize: 26, minHeight: 34}}>
        {typed}
        {cursor}
      </div>
      <div style={{transform: `translateY(${-scroll}px)`}}>
        {Array.from({length: 20}).map((_, i) => (
          <div key={i} style={{margin: '0 24px 22px'}}>
            <div style={{height: 170, borderRadius: 18, background: `hsl(${Math.floor(random(`th-${i}`) * 360)} 35% 32%)`}} />
            <div style={{height: 16, width: '80%', borderRadius: 8, background: '#2a3045', marginTop: 10}} />
            <div style={{height: 12, width: '50%', borderRadius: 6, background: '#222839', marginTop: 8}} />
          </div>
        ))}
      </div>
    </div>
  );
};
