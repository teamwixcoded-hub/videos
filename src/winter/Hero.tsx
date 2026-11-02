import React from 'react';

// ============================================================================================
// WINTER ARC cast (new character, from the happy/sad reference): one round head with a hair cap, big white eyes with a detailed iris,
// thick brows, a wide grin or a flat tired mouth. The BODY is a parameter: fat 0..1 (soft belly, rounder hips), muscle 0..1 (broad shoulders, thick arms).
// <Hero> origin (0,0) = the floor between the feet; everything is drawn upward. Vector only, no images.
// ============================================================================================
export const INK = '#16121c';
export type Mood = 'happy' | 'sad' | 'neutral' | 'tired' | 'determined' | 'shock';
export type HeadProps = {mood?: Mood; skin?: string; hair?: string; look?: [number, number]; blink?: number; id?: string};
const SK = '#fbe3a6', SK_D = '#e8c77d';

const Eye: React.FC<{x: number; mood: Mood; look: [number, number]; blink: number; skin: string; id: string; side: 1 | -1}> = ({x, mood, look, blink, skin, id, side}) => {
  const lid = {happy: 0.0, neutral: 0.12, determined: 0.2, shock: -0.1, tired: 0.5, sad: 0.46}[mood] + blink * 0.5;
  const ry = 66, rx = 60, cy = 8, ix = x + look[0] * 14, iy = cy + look[1] * 14;
  const lidY = cy - ry + ry * 2 * Math.min(0.95, Math.max(0, lid));
  const tiltY = mood === 'sad' ? side * 8 : 0;
  return (
    <g>
      <defs>
        <radialGradient id={`ir${id}${side}`} cx="50%" cy="50%" r="50%"><stop offset="0" stopColor="#2a1608" /><stop offset="0.38" stopColor="#6b4420" /><stop offset="0.8" stopColor="#a67a3e" /><stop offset="1" stopColor="#4a2e12" /></radialGradient>
        <clipPath id={`ec${id}${side}`}><ellipse cx={x} cy={cy} rx={rx} ry={ry} /></clipPath>
      </defs>
      <ellipse cx={x} cy={cy} rx={rx} ry={ry} fill="#fff" stroke={INK} strokeWidth={9} />
      <g clipPath={`url(#ec${id}${side})`}>
        <circle cx={ix} cy={iy} r={38} fill={`url(#ir${id}${side})`} /><circle cx={ix} cy={iy} r={38} fill="none" stroke={INK} strokeWidth={4} />
        <circle cx={ix} cy={iy} r={17} fill="#0a0610" />
        <circle cx={ix - 13} cy={iy - 14} r={9} fill="#fff" opacity={0.95} /><circle cx={ix + 14} cy={iy + 13} r={4.5} fill="#fff" opacity={0.85} />
        {lid > 0 && <path d={`M ${x - rx - 6},${cy - ry - 8} L ${x + rx + 6},${cy - ry - 8} L ${x + rx + 6},${lidY - tiltY} Q ${x},${lidY + 10} ${x - rx - 6},${lidY + tiltY} Z`} fill={skin} stroke={INK} strokeWidth={6} />}
      </g>
      <ellipse cx={x} cy={cy} rx={rx} ry={ry} fill="none" stroke={INK} strokeWidth={9} />
      {(mood === 'tired' || mood === 'sad') && <path d={`M ${x - 52},${cy + ry - 4} Q ${x},${cy + ry + 26} ${x + 52},${cy + ry - 4}`} stroke="#8a6a9c" strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.75} />}
    </g>
  );
};

export const Head: React.FC<HeadProps> = ({mood = 'neutral', skin = SK, hair = '#6b3f1e', look = [0, 0], blink = 0, id = 'h'}) => {
  const smile = {happy: 1, neutral: 0.15, determined: 0.05, shock: 0, tired: -0.1, sad: -0.4}[mood];
  const browY = {happy: -92, neutral: -86, determined: -80, shock: -112, tired: -84, sad: -88}[mood];
  const tilt = {happy: -4, neutral: 0, determined: 10, shock: -6, tired: -8, sad: -14}[mood];
  return (
    <g>
      <circle cx={0} cy={0} r={200} fill={skin} stroke={INK} strokeWidth={11} />
      <path d="M -150,120 Q 0,230 150,120 Q 0,196 -150,120 Z" fill={SK_D} opacity={0.35} />
      <path d="M -196,-40 C -200,-140 -120,-205 -10,-200 C 90,-196 190,-150 198,-30 C 150,-98 70,-120 -20,-112 C -100,-104 -170,-80 -196,-40 Z" fill={hair} stroke={INK} strokeWidth={10} strokeLinejoin="round" />
      <path d="M -150,-130 C -100,-168 -20,-176 50,-166" stroke="#a5683a" strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.8} />
      <Eye x={-86} mood={mood} look={look} blink={blink} skin={skin} id={id} side={-1} /><Eye x={86} mood={mood} look={look} blink={blink} skin={skin} id={id} side={1} />
      <path d={`M -140,${browY + 4 + tilt} Q -86,${browY - 22} -34,${browY + 2 - tilt}`} stroke={hair} strokeWidth={17} strokeLinecap="round" fill="none" />
      <path d={`M 34,${browY + 2 - tilt} Q 86,${browY - 22} 140,${browY + 4 + tilt}`} stroke={hair} strokeWidth={17} strokeLinecap="round" fill="none" />
      {mood === 'happy' && <><ellipse cx={-128} cy={92} rx={26} ry={15} fill="#f08a6a" opacity={0.4} /><ellipse cx={128} cy={92} rx={26} ry={15} fill="#f08a6a" opacity={0.4} /></>}
      {mood === 'happy'
        ? <g><path d="M -88,96 Q 0,200 88,96 Q 0,118 -88,96 Z" fill="#5a1620" stroke={INK} strokeWidth={9} strokeLinejoin="round" /><path d="M -80,99 Q 0,122 80,99 Q 0,134 -80,99 Z" fill="#fff" /><path d="M -46,152 Q 0,128 46,152 Q 0,184 -46,152 Z" fill="#e9707a" /></g>
        : mood === 'shock'
          ? <ellipse cx={0} cy={128} rx={30} ry={38} fill="#5a1620" stroke={INK} strokeWidth={9} />
          : <path d={`M -52,${128 + smile * -8} Q 0,${128 + smile * 40} 52,${128 + smile * -8}`} stroke={INK} strokeWidth={12} strokeLinecap="round" fill="none" />}
    </g>
  );
};

export type BodyProps = {fat?: number; muscle?: number; top?: 'tee' | 'hoodie' | 'tank' | 'bare'; topColor?: string; pants?: string; shoe?: string; skin?: string};
const limb = (pts: [number, number][], w: number, fill: string) => {
  const d = pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0]},${p[1]}`).join(' ');
  return <g><path d={d} stroke={INK} strokeWidth={w + 12} strokeLinecap="round" strokeLinejoin="round" fill="none" /><path d={d} stroke={fill} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" fill="none" /></g>;
};
const LEG_H = 260, TORSO_H = 300, NECK_Y = -(LEG_H + TORSO_H);
// the body: floor at y=0, neck base at y=NECK_Y
export const Body: React.FC<BodyProps> = ({fat = 0, muscle = 0, top = 'tee', topColor = '#e9962c', pants = '#2b3350', shoe = '#f2f2f2', skin = SK}) => {
  const sw = 112 + muscle * 46 - fat * 8, bw = 92 + fat * 78 - muscle * 6, hw = 96 + fat * 34, belly = fat * 44;
  const armW = 40 + muscle * 24 + fat * 8, legW = 64 + fat * 26 + muscle * 10;
  const fabric = top === 'bare' ? skin : topColor;
  const longSleeve = top === 'hoodie';
  const arm = (s: 1 | -1) => {
    const sh: [number, number] = [s * (sw - 10), NECK_Y + 46], el: [number, number] = [s * (sw + 8), NECK_Y + 160], hd: [number, number] = [s * (sw + 14), NECK_Y + 268];
    const mid = (a: [number, number], b: [number, number], t: number): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    const P = (pts: [number, number][]) => pts.map((p, i) => (i ? 'L' : 'M') + ' ' + p[0] + ',' + p[1]).join(' ');
    return (
      <g>
        <path d={P([sh, el, hd])} stroke={INK} strokeWidth={armW + 14} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={P([el, hd])} stroke={longSleeve ? fabric : skin} strokeWidth={armW * 0.84} strokeLinecap="round" fill="none" />
        <path d={P([sh, el])} stroke={top === 'tee' || longSleeve ? fabric : skin} strokeWidth={armW} strokeLinecap="round" fill="none" />
        {top === 'tee' && <path d={P([sh, mid(sh, el, 0.35)])} stroke={fabric} strokeWidth={armW + 8} strokeLinecap="round" fill="none" />}
        <circle cx={hd[0]} cy={hd[1] + 14} r={armW * 0.64} fill={skin} stroke={INK} strokeWidth={8} />
      </g>
    );
  };
  const torso = `M ${-sw * 0.5},${NECK_Y + 6} Q 0,${NECK_Y - 14} ${sw * 0.5},${NECK_Y + 6} L ${sw},${NECK_Y + 36} C ${sw + 6},${NECK_Y + 110} ${sw * 0.92},${NECK_Y + 170} ${bw + belly},${NECK_Y + 250} C ${bw + belly + 14},${NECK_Y + 300} ${hw},${NECK_Y + 318} ${hw},${NECK_Y + TORSO_H} L ${-hw},${NECK_Y + TORSO_H} C ${-hw},${NECK_Y + 318} ${-bw - belly - 14},${NECK_Y + 300} ${-bw - belly},${NECK_Y + 250} C ${-sw * 0.92},${NECK_Y + 170} ${-sw - 6},${NECK_Y + 110} ${-sw},${NECK_Y + 36} Z`;
  return (
    <g>
      {[-1, 1].map((s) => (
        <g key={s}>
          {limb([[s * 46, -LEG_H - 10], [s * 52, -150], [s * 56, -34]], legW, pants)}
          <path d={`M ${s * 56 - 52},-8 Q ${s * 56 - 52},-48 ${s * 56},-52 Q ${s * 56 + 60},-52 ${s * 56 + 66},-8 Q ${s * 56},6 ${s * 56 - 52},-8 Z`} fill={shoe} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
        </g>
      ))}
      <rect x={-30} y={NECK_Y - 26} width={60} height={60} fill={skin} stroke={INK} strokeWidth={9} />
      {arm(-1)}
      <path d={torso} fill={fabric} stroke={INK} strokeWidth={11} strokeLinejoin="round" />
      {top === 'bare' && muscle > 0.3 && (
        <g stroke={INK} strokeWidth={5} fill="none" opacity={0.5} strokeLinecap="round">
          <path d={`M 0,${NECK_Y + 60} L 0,${NECK_Y + 250}`} />
          <path d={`M ${-sw * 0.7},${NECK_Y + 100} Q ${-sw * 0.3},${NECK_Y + 130} 0,${NECK_Y + 100}`} /><path d={`M ${sw * 0.7},${NECK_Y + 100} Q ${sw * 0.3},${NECK_Y + 130} 0,${NECK_Y + 100}`} />
          {[150, 190, 230].map((y) => <path key={y} d={`M ${-sw * 0.32},${NECK_Y + y} L ${sw * 0.32},${NECK_Y + y}`} />)}
        </g>
      )}
      {longSleeve && (
        <g>
          <path d={`M ${-sw * 0.62},${NECK_Y + 4} Q 0,${NECK_Y + 70} ${sw * 0.62},${NECK_Y + 4}`} stroke={INK} strokeWidth={8} fill="none" />
          <path d={`M -24,${NECK_Y + 56} L -24,${NECK_Y + 130} M 24,${NECK_Y + 56} L 24,${NECK_Y + 130}`} stroke="#f4f4f4" strokeWidth={7} strokeLinecap="round" />
          <path d={`M ${-bw * 0.8},${NECK_Y + 210} Q 0,${NECK_Y + 196} ${bw * 0.8},${NECK_Y + 210} L ${bw * 0.74},${NECK_Y + 262} Q 0,${NECK_Y + 276} ${-bw * 0.74},${NECK_Y + 262} Z`} fill="rgba(0,0,0,.14)" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        </g>
      )}
      {top === 'tee' && <path d={`M ${-sw * 0.38},${NECK_Y + 8} Q 0,${NECK_Y + 50} ${sw * 0.38},${NECK_Y + 8}`} stroke={INK} strokeWidth={8} fill="none" />}
      {arm(1)}
    </g>
  );
};

export type HeroProps = BodyProps & HeadProps & {x?: number; y?: number; scale?: number; flip?: boolean; headScale?: number; slump?: number};
export const Hero: React.FC<HeroProps> = ({x = 0, y = 0, scale = 1, flip, headScale = 0.8, slump = 0, mood, skin, hair, look, blink, id, ...b}) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
    <Body skin={skin} {...b} />
    <g transform={`translate(${slump * 24} ${NECK_Y - (200 * headScale - 34) + slump * 22}) scale(${headScale}) rotate(${slump * 7})`}><Head mood={mood} skin={skin} hair={hair} look={look} blink={blink} id={id} /></g>
  </g>
);
