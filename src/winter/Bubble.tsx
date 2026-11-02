import React from 'react';
import type {HeadProps, Mood} from './Hero';

// ============================================================================================
// BUBBLE HEAD (the Same Man look, from the thumbnail reference): a glossy pale-white ball, a thin dark-navy outline, big almond eyes with heavy skin-colour lids,
// lavender eye bags, thin worried brows, no nose, no ears, no hair, a tiny mouth. Same props as the adult head, so both can be swapped with `kind`.
// ============================================================================================
const NAVY = '#1b1a3a';
const BAG = '#8f86c4';

const BEye: React.FC<{x: number; mood: Mood; look: [number, number]; blink: number; skin: string; id: string; side: 1 | -1}> = ({x, mood, look, blink, skin, id, side}) => {
  const lid = {happy: 0.0, neutral: 0.14, determined: 0.26, shock: -0.1, tired: 0.52, sad: 0.4}[mood] + blink * 0.5;
  const rx = 66, ry = 58, cy = 12, dy = mood === 'tired' || mood === 'sad' ? 0.45 : 0;
  const ix = x + look[0] * 14, iy = cy + (look[1] + dy) * 14;
  const lidY = cy - ry + ry * 2 * Math.min(0.95, Math.max(0, lid));
  const slope = mood === 'sad' ? 9 : mood === 'determined' ? -8 : mood === 'tired' ? 3 : 0;   // outer corner of the lid lower (sad / tired) or higher (determined)
  const outer = side === -1 ? -1 : 1;
  return (
    <g>
      <defs>
        <clipPath id={`be${id}${side}`}><ellipse cx={x} cy={cy} rx={rx} ry={ry} /></clipPath>
        <radialGradient id={`bi${id}${side}`} cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#3b3f86" /><stop offset="0.6" stopColor="#1d1d48" /><stop offset="1" stopColor="#0f0f26" /></radialGradient>
      </defs>
      {(mood === 'tired' || mood === 'sad') && <ellipse cx={x} cy={cy + ry - 4} rx={rx - 4} ry={16} fill={BAG} opacity={0.5} />}
      <ellipse cx={x} cy={cy} rx={rx} ry={ry} fill="#f6f7ff" />
      <g clipPath={`url(#be${id}${side})`}>
        <ellipse cx={x} cy={cy - ry + 6} rx={rx} ry={16} fill="#c9cdee" opacity={0.55} />
        <circle cx={ix} cy={iy} r={28} fill={`url(#bi${id}${side})`} /><circle cx={ix - 8} cy={iy - 9} r={7} fill="#fff" opacity={0.95} /><circle cx={ix + 9} cy={iy + 9} r={3.2} fill="#9fb4ff" opacity={0.8} />
        {lid > 0 && <path d={`M ${x - rx - 8},${cy - ry - 10} L ${x + rx + 8},${cy - ry - 10} L ${x + rx + 8},${lidY + outer * slope} Q ${x},${lidY + 10 - Math.abs(slope) * 0.2} ${x - rx - 8},${lidY - outer * slope} Z`} fill={skin} stroke={NAVY} strokeWidth={6} strokeLinejoin="round" />}
      </g>
      <ellipse cx={x} cy={cy} rx={rx} ry={ry} fill="none" stroke={NAVY} strokeWidth={7} />
      {(mood === 'tired' || mood === 'sad') && <path d={`M ${x - 46},${cy + ry - 2} Q ${x},${cy + ry + 24} ${x + 46},${cy + ry - 2}`} stroke={BAG} strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.85} />}
    </g>
  );
};

export const BubbleHead: React.FC<HeadProps> = ({mood = 'neutral', skin = '#e8eafb', look = [0, 0], blink = 0, id = 'b', turn = 0}) => {
  const browY = {happy: -78, neutral: -66, determined: -56, shock: -92, tired: -64, sad: -70}[mood];
  // inner end of each brow: raised (worried / sad), lowered (determined)
  const inner = {happy: -6, neutral: 0, determined: 14, shock: -10, tired: -4, sad: -22}[mood];
  const smile = {happy: 1, neutral: 0, determined: 0, shock: 0, tired: -0.2, sad: -0.7}[mood];
  return (
    <g>
      <defs>
        <radialGradient id={`bg${id}`} cx="36%" cy="26%" r="85%"><stop offset="0" stopColor="#ffffff" /><stop offset="0.5" stopColor={skin} /><stop offset="1" stopColor="#a9b1de" /></radialGradient>
        <clipPath id={`bc${id}`}><circle cx={0} cy={0} r={199} /></clipPath>
      </defs>
      <circle cx={0} cy={0} r={200} fill={`url(#bg${id})`} stroke={NAVY} strokeWidth={9} />
      <g clipPath={`url(#bc${id})`}>
        <circle cx={90} cy={110} r={170} fill="none" stroke="#7fb6ff" strokeWidth={26} opacity={0.14} />
      </g>
      <path d="M -140,-104 C -118,-146 -72,-172 -22,-176" stroke="#fff" strokeWidth={17} fill="none" strokeLinecap="round" opacity={0.9} />
      <ellipse cx={-150} cy={-62} rx={11} ry={20} fill="#fff" opacity={0.7} transform="rotate(22 -150 -62)" />
      <g clipPath={`url(#bc${id})`}><g transform={`translate(${turn * 90} ${Math.abs(turn) * 6}) scale(${1 - 0.3 * Math.abs(turn)} 1)`}>
        <BEye x={-84} mood={mood} look={look} blink={blink} skin={skin} id={id} side={-1} /><BEye x={84} mood={mood} look={look} blink={blink} skin={skin} id={id} side={1} />
        <path d={`M -138,${browY + 14} Q -92,${browY - 10} -34,${browY + inner}`} stroke={NAVY} strokeWidth={10} strokeLinecap="round" fill="none" />
        <path d={`M 34,${browY + inner} Q 92,${browY - 10} 138,${browY + 14}`} stroke={NAVY} strokeWidth={10} strokeLinecap="round" fill="none" />
        {mood === 'happy' && <><ellipse cx={-122} cy={96} rx={24} ry={13} fill="#ff9aa8" opacity={0.4} /><ellipse cx={122} cy={96} rx={24} ry={13} fill="#ff9aa8" opacity={0.4} /></>}
        {mood === 'happy'
          ? <g><path d="M -58,112 Q 0,180 58,112 Q 0,128 -58,112 Z" fill="#4a1630" stroke={NAVY} strokeWidth={8} strokeLinejoin="round" /><path d="M -50,115 Q 0,132 50,115 Q 0,142 -50,115 Z" fill="#fff" /><path d="M -26,150 Q 0,138 26,150 Q 0,166 -26,150 Z" fill="#ff8294" /></g>
          : mood === 'shock'
            ? <ellipse cx={0} cy={136} rx={22} ry={28} fill="#4a1630" stroke={NAVY} strokeWidth={8} />
            : <path d={`M -30,${136 - smile * 6} Q 0,${136 + smile * 18} 30,${136 - smile * 6}`} stroke={NAVY} strokeWidth={9} strokeLinecap="round" fill="none" />}
      </g></g>
    </g>
  );
};
