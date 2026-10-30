import React from 'react';
import {INK} from './theme';

// ============================================================================================
// Things people HOLD. They are drawn in the hand's own frame (wrist at the origin, fingers along +y), under the fingers, so the hand really wraps around them.
// ============================================================================================

// a smartphone seen from behind: dark glass back with a sheen, a camera island, a lit edge toward the face. Long axis along the hand, so held to the ear it runs up the cheek
export const PhoneBack: React.FC<{lit?: number}> = ({lit = 1}) => (
  <g transform="translate(0 60)">
    <defs>
      <linearGradient id="phb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3a3f5c" /><stop offset="0.5" stopColor="#20233a" /><stop offset="1" stopColor="#12142a" /></linearGradient>
    </defs>
    <rect x={-46} y={-84} width={92} height={190} rx={18} fill="#0b0c18" stroke={INK} strokeWidth={4} transform="translate(5 6)" opacity={0.45} />
    <rect x={-46} y={-84} width={92} height={190} rx={18} fill="url(#phb)" stroke={INK} strokeWidth={4.6} />
    <rect x={-40} y={-78} width={80} height={178} rx={14} fill="none" stroke="#6b7298" strokeWidth={2} opacity={0.5} />
    <path d="M -34,-70 L 10,-70 L -34,40 Z" fill="#fff" opacity={0.07} />
    {/* camera island */}
    <rect x={-36} y={64} width={46} height={36} rx={10} fill="#0e1020" stroke="#8a90b8" strokeWidth={2.2} />
    <circle cx={-22} cy={76} r={8.5} fill="#1c2a55" stroke="#9db6ff" strokeWidth={1.8} /><circle cx={-22} cy={76} r={3.4} fill="#6fa0ff" />
    <circle cx={-2} cy={88} r={6.5} fill="#1c2a55" stroke="#9db6ff" strokeWidth={1.6} /><circle cx={0} cy={72} r={2.4} fill="#ffd77a" />
    <circle cx={10} cy={-8} r={11} fill="none" stroke="#7a82ad" strokeWidth={2} opacity={0.55} />
    {/* the screen's light spills round the edge facing the face */}
    <rect x={-48} y={-80} width={5} height={182} rx={2.5} fill="#9bd0ff" opacity={0.55 * lit} />
  </g>
);

// a tea cup held upright in a fist that stays upright too (thumb up, four fingers wrapped round the front), centred on the hand. k = how far into a sip: the cup tips toward the lips.
export const CupHeld: React.FC<{t?: number; k?: number}> = ({t = 0, k = 0}) => (
  <g transform={`rotate(${-k * 24})`}>
    {[-10, 4, 16].map((dx, i) => <path key={i} d={`M ${dx},-46 q ${10 + 3 * Math.sin(t * 2 + i)},-16 0,-30 q -10,-14 3,-28`} fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={(0.3 + 0.15 * Math.sin(t * 3 + i * 2)) * (1 - k)} />)}
    <path d="M -30,-34 L 30,-34 L 24,18 Q 0,28 -24,18 Z" fill="#f4f2fb" stroke={INK} strokeWidth={3.6} strokeLinejoin="round" />
    <ellipse cx={0} cy={-34} rx={30} ry={8} fill="#b8743c" stroke={INK} strokeWidth={3} /><ellipse cx={-8} cy={-36} rx={11} ry={2.6} fill="#e8b078" opacity={0.7} />
    <path d="M -18,-24 q -3,20 2,36" fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" opacity={0.75} />
    <path d="M 30,-24 q 24,2 18,18 q -5,10 -22,8" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
    {/* the fist: palm behind the cup, four finger bumps across the front, the thumb standing up on the near side */}
    <path d="M -34,-6 Q -40,22 -22,28 L 22,28 Q 40,22 34,-6 Z" fill="#f3f0fb" stroke={INK} strokeWidth={3.4} strokeLinejoin="round" />
    {[-20, -7, 6, 19].map((x) => <path key={x} d={`M ${x - 6},-10 Q ${x},-18 ${x + 6},-10 L ${x + 6},12 Q ${x},18 ${x - 6},12 Z`} fill="#f3f0fb" stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />)}
    <path d="M -34,2 Q -50,-6 -44,-30 Q -40,-42 -32,-34 Q -30,-18 -26,-4" fill="#f3f0fb" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
  </g>
);

// a phone held landscape in front of the face with both hands, filming: seen from the audience side we see its back with the camera lens
export const PhoneLandscape: React.FC<{rec?: number}> = ({rec = 1}) => (
  <g transform="translate(0 -418)">
    <g transform="rotate(90)"><g transform="translate(0 -71)"><PhoneBack lit={0.2} /></g></g>
    <circle cx={96} cy={-58} r={9} fill="#ff3b3b" opacity={0.5 + 0.5 * rec} />
    {[-1, 1].map((s) => <g key={s}>{[-26, -4, 18].map((y, i) => <path key={i} d={`M ${s * 88},${y} Q ${s * 112},${y + 2} ${s * 106},${y + 15} L ${s * 88},${y + 15} Z`} fill="#f3f0fb" stroke={INK} strokeWidth={3} strokeLinejoin="round" />)}<path d={`M ${s * 60},-70 Q ${s * 78},-96 ${s * 92},-72 Q ${s * 84},-58 ${s * 66},-60 Z`} fill="#f3f0fb" stroke={INK} strokeWidth={3} strokeLinejoin="round" /></g>)}
  </g>
);
