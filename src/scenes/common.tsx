import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

export type RoomName = 'BEDROOM' | 'KITCHEN' | 'BATHROOM' | 'LIVING' | 'OFFICE' | 'MANAGER';

export const Room: React.FC<{name: RoomName}> = ({name}) => (
  <AbsoluteFill>
    <Img src={staticFile(`images/${name}.png`)} style={{width: 1920, height: 1080, objectFit: 'cover'}} />
  </AbsoluteFill>
);

export type PropName =
  | 'phone' | 'phone-lit' | 'book-open' | 'book-closed' | 'teacup' | 'mug' | 'alarm' | 'cereal' | 'toothbrush' | 'lamp' | 'book-stack' | 'plant'
  | 'books-flat' | 'book-tower' | 'calendar' | 'bubble-speech' | 'bubble-thought' | 'water' | 'pillow' | 'blanket' | 'photo' | 'hoodie' | 'headphones' | 'glasses' | 'book-red';

// A prop image placed in world coordinates (x, y is its centre). Height follows the image's aspect ratio.
export const PropImg: React.FC<{name: PropName; x: number; y: number; w: number; rotate?: number; scale?: number; opacity?: number; shadow?: boolean}> = ({name, x, y, w, rotate = 0, scale = 1, opacity = 1, shadow = true}) => (
  <Img
    src={staticFile(`images/props/${name}.png`)}
    style={{position: 'absolute', left: x - w / 2, top: y, width: w, height: 'auto', transform: `translateY(-50%) rotate(${rotate}deg) scale(${scale})`, opacity, filter: shadow ? 'drop-shadow(0 8px 10px rgba(0,0,0,0.3))' : undefined}}
  />
);

// A prop drawn at a character's hand, inside the rig's SVG. `counter` cancels the body rotation (lying poses).
export const Held: React.FC<{name: PropName; hand: [number, number]; w: number; h: number; dx?: number; dy?: number; rotate?: number; counter?: number}> = ({name, hand, w, h, dx = 0, dy = 0, rotate = 0, counter = 0}) => (
  <g transform={`translate(${hand[0] + dx} ${hand[1] + dy}) rotate(${counter + rotate})`}>
    <foreignObject x={-w / 2} y={-h / 2} width={w} height={h} style={{overflow: 'visible'}}>
      <Img src={staticFile(`images/props/${name}.png`)} style={{width: w, height: h, objectFit: 'contain'}} />
    </foreignObject>
  </g>
);

// A phone in hand whose screen scrolls (content cards sliding up), so held phones are alive.
export const PhoneHeld: React.FC<{hand: [number, number]; w?: number; h?: number; dy?: number; counter?: number; frame: number; speed?: number}> = ({hand, w = 64, h = 110, dy = -18, counter = 0, frame, speed = 1.4}) => {
  const sw = w * 0.78, sh = h * 0.86;
  const off = (frame * speed) % 44;
  return (
    <g transform={`translate(${hand[0]} ${hand[1] + dy}) rotate(${counter})`}>
      <foreignObject x={-w / 2} y={-h / 2} width={w} height={h} style={{overflow: 'visible'}}>
        <Img src={staticFile('images/props/phone-lit.png')} style={{width: w, height: h, objectFit: 'contain'}} />
      </foreignObject>
      <clipPath id="phone-screen"><rect x={-sw / 2} y={-sh / 2 + 2} width={sw} height={sh - 4} rx={4} /></clipPath>
      <g clipPath="url(#phone-screen)">
        {Array.from({length: 4}).map((_, i) => (
          <g key={i} transform={`translate(0 ${-sh / 2 + i * 44 - off + 2})`}>
            <rect x={-sw / 2 + 4} y={0} width={sw - 8} height={24} rx={3} fill={['#ff7a7a', '#ffd23f', '#7ad7ff', '#b79bff', '#7affb0'][(i + Math.floor((frame * speed) / 44)) % 5]} opacity={0.85} />
            <rect x={-sw / 2 + 4} y={28} width={(sw - 8) * 0.6} height={5} rx={2} fill="#fff" opacity={0.7} />
          </g>
        ))}
      </g>
    </g>
  );
};

// Radial coloured glow, blended with "screen" so it reads as light.
export const Glow: React.FC<{x: number; y: number; r: number; color: string; opacity?: number}> = ({x, y, r, color, opacity = 1}) => (
  <AbsoluteFill style={{background: `radial-gradient(circle at ${x}px ${y}px, ${color} 0, transparent ${r}px)`, opacity, mixBlendMode: 'screen', pointerEvents: 'none'}} />
);

export const Dim: React.FC<{color?: string; opacity: number}> = ({color = '8,12,30', opacity}) => (
  <AbsoluteFill style={{background: `rgba(${color},${opacity})`, pointerEvents: 'none'}} />
);

// World positions in the 1920x1080 frame for the bedroom set (from BEDROOM.png).
export const BED = {
  armchairHip: [330, 705] as const,
  bedEdgeHip: [1300, 700] as const,
  nightstandPhone: [1778, 650] as const,
  lamp: [420, 480] as const,
  clock: [960, 300] as const,
};
