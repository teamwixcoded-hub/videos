import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {loadFont as loadBaloo} from '@remotion/google-fonts/Baloo2';

// ============================================================================================
// THUMBNAILS (1280 x 720). The artwork is made with NanoBanana (public/images/thumb_*.png, prompts in scripts/prompts/thumb_*.txt, no text in the image);
// the title is set here in code: one huge rounded word, white with a hard black outline and a soft shadow, one word in gold.
// Render:  node scripts/thumbs.cjs [ThumbSame7A ThumbFathersA ...]   ->  out/thumbs/*.png   (copy public/images/thumb_*.png into out/pub-fathers/images first; the script does it)
// ============================================================================================
const BAL = loadBaloo('normal', {weights: ['800']}).fontFamily;

const Word: React.FC<{lines: {t: string; c?: string; size: number}[]; x: number; y: number; align?: 'middle' | 'start'}> = ({lines, x, y, align = 'middle'}) => {
  let yy = y;
  return (
    <svg width={1280} height={720} viewBox="0 0 1280 720" style={{position: 'absolute', inset: 0}}>
      <g fontFamily={BAL} fontWeight={800} textAnchor={align} style={{filter: 'drop-shadow(0 10px 18px rgba(0,0,0,.7))'}}>
        {lines.map((l, i) => { const out = <text key={i} x={x} y={yy} fontSize={l.size} letterSpacing={l.size * 0.012} fill={l.c ?? '#fff'} stroke="#05060b" strokeWidth={l.size * 0.13} paintOrder="stroke" strokeLinejoin="round">{l.t}</text>; yy += l.size * 0.86; return out; })}
      </g>
    </svg>
  );
};
const Art: React.FC<{src: string; zoom?: number; fx?: number; fy?: number; dy?: number}> = ({src, zoom = 1, fx = 0.5, fy = 0.5, dy = 0}) => (
  <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <Img src={staticFile(`images/${src}`)} style={{position: 'absolute', width: `${zoom * 100}%`, height: `${zoom * 100}%`, left: `${-(zoom - 1) * fx * 100}%`, top: `calc(${-(zoom - 1) * fy * 100}% + ${dy}px)`, objectFit: 'cover', filter: 'contrast(1.1) saturate(1.15) brightness(1.02)'}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 55%, rgba(0,0,0,.6) 100%)'}} />
  </AbsoluteFill>
);

// Two Fathers: the lonely father and the silent phone
export const ThumbFathersA: React.FC = () => (
  <AbsoluteFill>
    <Art src="thumb_fathers_a2.png" zoom={1.02} fx={0.5} fy={0.5} dy={150} />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #050507 0%, rgba(5,5,7,.92) 12%, rgba(5,5,7,0) 38%)'}} />
    <Word x={640} y={140} lines={[{t: 'IT NEVER', size: 118}, {t: 'RINGS.', size: 138, c: '#ffd23f'}]} />
  </AbsoluteFill>
);
// Same Man: the tired man and his phone, the book far away in the dark
export const ThumbSame7A: React.FC = () => (
  <AbsoluteFill>
    <Art src="thumb_same_a.png" zoom={1} />
    <Word x={70} y={190} align="start" lines={[{t: '10', size: 230, c: '#ffd23f'}, {t: 'SECONDS.', size: 150}]} />
  </AbsoluteFill>
);


// Two Fathers, idea 2 (a son's question): two frames from the video side by side. One father gave money (the gift tower, the bills), the other gave time (on the floor with his son).
const Panel: React.FC<{src: string; x: number; shift: number; tint: string}> = ({src, x, shift, tint}) => (
  <div style={{position: 'absolute', left: x, top: 0, width: 640, height: 720, overflow: 'hidden'}}>
    <Img src={staticFile(`images/${src}`)} style={{position: 'absolute', left: -shift, top: 0, width: 1280, height: 720, filter: 'contrast(1.12) saturate(1.2)'}} />
    <div style={{position: 'absolute', inset: 0, background: tint}} />
  </div>
);
export const ThumbFathersB: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <Panel src="thumb_frame_money.png" x={0} shift={0} tint="linear-gradient(180deg, rgba(8,12,40,.12), rgba(8,12,40,0))" />
    <Panel src="thumb_frame_time.png" x={640} shift={320} tint="linear-gradient(180deg, rgba(60,25,0,.15), rgba(60,25,0,0))" />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,5,10,.88) 0%, rgba(5,5,10,.55) 28%, rgba(5,5,10,0) 46%, rgba(5,5,10,0) 72%, rgba(5,5,10,.8) 100%)'}} />
    <div style={{position: 'absolute', left: 636, top: 0, width: 8, height: 720, background: '#fff', opacity: 0.85, boxShadow: '0 0 24px rgba(255,255,255,.8)'}} />
    <Word x={640} y={118} lines={[{t: 'WHICH ONE', size: 112}, {t: 'WAS YOURS?', size: 128, c: '#ffd23f'}]} />
    <Word x={320} y={676} lines={[{t: 'MONEY', size: 100, c: '#7dffb0'}]} />
    <Word x={960} y={676} lines={[{t: 'TIME', size: 100, c: '#ffffff'}]} />
  </AbsoluteFill>
);
