import React from 'react';

// A depth stage: far (blurred, slow), mid (soft), characters (sharp, rim-lit), front (furniture over the hips), fg (dark, blurred, fast).
// Every set is drawn in "stage" coordinates, 3200 x 1080; the camera is a centre point and a zoom.
export type Cam = {cx: number; cy: number; z: number};
export const camAt = (a: Cam, b: Cam, p: number): Cam => ({cx: a.cx + (b.cx - a.cx) * p, cy: a.cy + (b.cy - a.cy) * p, z: a.z + (b.z - a.z) * p});
export const STAGE_W = 3200;

const Layer: React.FC<{cam: Cam; par: number; blur?: number; dark?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({cam, par, blur = 0, dark = 0, style, children}) => {
  const tx = 960 - 1600 * cam.z - (cam.cx - 1600) * par * cam.z;
  const ty = 540 - 540 * cam.z - (cam.cy - 540) * par * cam.z;
  const f = [blur ? `blur(${blur}px)` : '', dark ? `brightness(${1 - dark})` : ''].filter(Boolean).join(' ');
  return (
    <div style={{position: 'absolute', inset: 0, filter: f || undefined, ...style}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        <g transform={`translate(${tx} ${ty}) scale(${cam.z})`}>{children}</g>
      </svg>
    </div>
  );
};

export const Stage: React.FC<{cam: Cam; far: React.ReactNode; mid: React.ReactNode; chars: React.ReactNode; front?: React.ReactNode; fg?: React.ReactNode; rim?: string; blurK?: number}> = ({cam, far, mid, chars, front, fg, rim = 'rgba(255,200,130,.9)', blurK = 1}) => (
  <div style={{position: 'absolute', inset: 0, background: '#0b0d1a', overflow: 'hidden'}}>
    <Layer cam={cam} par={0.35} blur={9 * blurK}>{far}</Layer>
    <Layer cam={cam} par={0.7} blur={2.5 * blurK}>{mid}</Layer>
    <Layer cam={cam} par={1} style={{filter: `drop-shadow(-3px -1px 0 ${rim})`}}>{chars}</Layer>
    {front && <Layer cam={cam} par={1}>{front}</Layer>}
    {fg && <Layer cam={cam} par={1.35} blur={13 * blurK} dark={0.35}>{fg}</Layer>}
  </div>
);

// soft light pool, screen-blended
export const Glow: React.FC<{x: number; y: number; r: number; color: string; o?: number}> = ({x, y, r, color, o = 1}) => (
  <g style={{mixBlendMode: 'screen'}} opacity={o}>
    <defs>
      <radialGradient id={`gl${color.replace(/\W/g, '')}`}><stop offset="0" stopColor={color} stopOpacity="0.85" /><stop offset="1" stopColor={color} stopOpacity="0" /></radialGradient>
    </defs>
    <circle cx={x} cy={y} r={r} fill={`url(#gl${color.replace(/\W/g, '')})`} />
  </g>
);
