import React from 'react';
import {useCurrentFrame} from 'remotion';

// ============================================================================================
// THE BEDROOM SET. One real room, fixed in place; the camera moves through it (like the original).
// World is 2880 x 1080. Furniture is added by the scene (armchair, bed, nightstand) at the anchors below.
// ============================================================================================
export const ROOM = {
  W: 2880, H: 1080, FLOOR: 1010, WALL_BASE: 830,
  CHAIR_X: 760, LAMP_X: 470, BED_X: 2150, NIGHT_X: 2610,
  CLOCK: [1190, 200] as [number, number], CAL: [640, 270] as [number, number], WIN: {x: 1400, y: 150, w: 360, h: 430},
};

const deg = (m: number) => m * 6;
const hand = (cx: number, cy: number, angle: number, len: number, w: number, color: string) => (
  <line x1={cx} y1={cy} x2={cx + Math.sin((angle * Math.PI) / 180) * len} y2={cy - Math.cos((angle * Math.PI) / 180) * len} stroke={color} strokeWidth={w} strokeLinecap="round" />
);

// minutes: minutes after 12:00 (clock hands). calPage: number shown on the wall calendar.
export const Room: React.FC<{minutes?: number; calPage?: number | null; warm?: number; cool?: number}> = ({minutes = 23 * 60 + 20, calPage = null, warm = 1, cool = 1}) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 38) * 4;                    // curtains breathe a little
  const [cx, cy] = ROOM.CLOCK, [kx, ky] = ROOM.CAL, w = ROOM.WIN;
  return (
    <svg viewBox={`0 0 ${ROOM.W} ${ROOM.H}`} width={ROOM.W} height={ROOM.H} style={{position: 'absolute', left: 0, top: 0}}>
      <defs>
        <linearGradient id="rWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6e6577" /><stop offset="1" stop-color="#8a7c74" /></linearGradient>
        <pattern id="rPaper" width="70" height="70" patternUnits="userSpaceOnUse"><rect width="70" height="70" fill="none" /><path d="M35 0 V70" stroke="#fff" stroke-opacity=".05" stroke-width="2" /><circle cx="35" cy="35" r="3" fill="#fff" fill-opacity=".05" /></pattern>
        <linearGradient id="rFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6a4b3a" /><stop offset="1" stop-color="#2e2019" /></linearGradient>
        <linearGradient id="rWin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1534" /><stop offset=".7" stop-color="#1c3868" /><stop offset="1" stop-color="#2a4a80" /></linearGradient>
        <linearGradient id="rCurt" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5a4f6e" /><stop offset=".25" stop-color="#7a6f90" /><stop offset=".5" stop-color="#4a405e" /><stop offset=".75" stop-color="#7a6f90" /><stop offset="1" stop-color="#4a405e" /></linearGradient>
        <radialGradient id="rWarm" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffc766" stop-opacity=".75" /><stop offset="1" stop-color="#ffc766" stop-opacity="0" /></radialGradient>
        <radialGradient id="rCool" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#6cc8ff" stop-opacity=".55" /><stop offset="1" stop-color="#6cc8ff" stop-opacity="0" /></radialGradient>
        <linearGradient id="rCone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd890" stop-opacity=".5" /><stop offset="1" stop-color="#ffd890" stop-opacity="0" /></linearGradient>
        <linearGradient id="rEdge" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".45" /><stop offset=".22" stop-color="#000" stop-opacity="0" /><stop offset=".78" stop-color="#000" stop-opacity="0" /><stop offset="1" stop-color="#000" stop-opacity=".5" /></linearGradient>
        <filter id="rBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14" /></filter>
        <filter id="rSoft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3" /></filter>
        <filter id="rShadow" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000" flood-opacity=".4" /></filter>
      </defs>

      {/* wall + paper + baseboard + floor */}
      <rect width={ROOM.W} height={ROOM.WALL_BASE} fill="url(#rWall)" />
      <rect width={ROOM.W} height={ROOM.WALL_BASE} fill="url(#rPaper)" />
      <rect y={ROOM.WALL_BASE - 4} width={ROOM.W} height={32} fill="#d8cbb6" opacity=".55" />
      <rect y={ROOM.WALL_BASE + 28} width={ROOM.W} height={ROOM.H - ROOM.WALL_BASE - 28} fill="url(#rFloor)" />
      <g stroke="#000" strokeOpacity=".22" strokeWidth="2">
        {[0, 1, 2, 3, 4, 5].map((i) => <line key={i} x1={0} x2={ROOM.W} y1={880 + i * i * 6 + i * 14} y2={880 + i * i * 6 + i * 14} />)}
        {Array.from({length: 40}).map((_, i) => <line key={'v' + i} x1={i * 76 + ((i % 2) * 30)} x2={i * 76 - 90 + ((i % 2) * 30)} y1={858} y2={ROOM.H} />)}
      </g>
      <rect y={ROOM.WALL_BASE + 28} width={ROOM.W} height={14} fill="#000" opacity=".25" />

      {/* window with night sky, moon, city lights, curtains and sill */}
      <rect x={w.x - 14} y={w.y - 14} width={w.w + 28} height={w.h + 28} rx={8} fill="#d9cdb9" opacity=".8" />
      <rect x={w.x} y={w.y} width={w.w} height={w.h} fill="url(#rWin)" />
      <circle cx={w.x + 90} cy={w.y + 100} r={34} fill="#e6efff" opacity=".95" />
      <circle cx={w.x + 90} cy={w.y + 100} r={60} fill="#cfe0ff" opacity=".18" filter="url(#rSoft)" />
      {Array.from({length: 26}).map((_, i) => <circle key={i} cx={w.x + 20 + ((i * 53) % (w.w - 40))} cy={w.y + 250 + ((i * 37) % 160)} r={2 + (i % 3)} fill={['#ffd27a', '#fff4d0', '#7ee8ff'][i % 3]} opacity={0.55} />)}
      <path d={`M${w.x} ${w.y + w.h * 0.62} L${w.x + 70} ${w.y + w.h * 0.55} L${w.x + 120} ${w.y + w.h * 0.64} L${w.x + 200} ${w.y + w.h * 0.5} L${w.x + 290} ${w.y + w.h * 0.62} L${w.x + w.w} ${w.y + w.h * 0.56} V${w.y + w.h} H${w.x} Z`} fill="#0b1630" opacity=".85" />
      <g stroke="#d9cdb9" strokeWidth="9"><line x1={w.x + w.w / 2} x2={w.x + w.w / 2} y1={w.y} y2={w.y + w.h} /><line x1={w.x} x2={w.x + w.w} y1={w.y + w.h * 0.46} y2={w.y + w.h * 0.46} /></g>
      <rect x={w.x - 30} y={w.y + w.h + 8} width={w.w + 60} height={20} rx={6} fill="#cbbea8" />
      <rect x={w.x - 70} y={w.y - 44} width={w.w + 140} height={10} rx={5} fill="#3a3040" />
      <path d={`M${w.x - 60} ${w.y - 36} h96 q${sway} 260 ${-4 + sway} 520 h-92 Z`} fill="url(#rCurt)" />
      <path d={`M${w.x + w.w + 60} ${w.y - 36} h-96 q${-sway} 260 ${4 - sway} 520 h92 Z`} fill="url(#rCurt)" />

      {/* wall clock */}
      <g filter="url(#rShadow)">
        <circle cx={cx} cy={cy} r={68} fill="#2d2630" />
        <circle cx={cx} cy={cy} r={60} fill="#f4efe6" />
        {Array.from({length: 12}).map((_, i) => <line key={i} x1={cx + Math.sin((i * 30 * Math.PI) / 180) * 50} y1={cy - Math.cos((i * 30 * Math.PI) / 180) * 50} x2={cx + Math.sin((i * 30 * Math.PI) / 180) * (i % 3 ? 55 : 46)} y2={cy - Math.cos((i * 30 * Math.PI) / 180) * (i % 3 ? 55 : 46)} stroke="#2d2630" strokeWidth={i % 3 ? 3 : 5} strokeLinecap="round" />)}
        {hand(cx, cy, ((minutes / 60) % 12) * 30, 30, 7, '#2d2630')}
        {hand(cx, cy, deg(minutes % 60), 46, 4.5, '#2d2630')}
        <circle cx={cx} cy={cy} r={6} fill="#c8392b" />
      </g>

      {/* wall calendar (grid like the original) */}
      <g filter="url(#rShadow)">
        <rect x={kx - 78} y={ky - 92} width={156} height={184} rx={8} fill="#f4efe6" />
        <rect x={kx - 78} y={ky - 92} width={156} height={34} rx={8} fill="#c8392b" />
        <rect x={kx - 78} y={ky - 70} width={156} height={12} fill="#c8392b" />
        {[0, 1, 2, 3, 4].map((r) => [0, 1, 2, 3, 4, 5, 6].map((c) => <rect key={r + '-' + c} x={kx - 70 + c * 20.5} y={ky - 48 + r * 28} width={17} height={22} rx={3} fill="#2d2630" opacity=".12" />))}
        {calPage !== null && <text x={kx} y={ky + 28} textAnchor="middle" fontSize="70" fontWeight="900" fontFamily="'Segoe UI Black', Arial Black, sans-serif" fill="#c8392b">{calPage}</text>}
      </g>

      {/* standing lamp (left) and mug on the floor */}
      <g filter="url(#rShadow)">
        <ellipse cx={ROOM.LAMP_X} cy={ROOM.FLOOR - 2} rx={44} ry={10} fill="#2d2630" />
        <rect x={ROOM.LAMP_X - 5} y={440} width={10} height={560} rx={4} fill="#4a3f52" />
        <path d={`M${ROOM.LAMP_X - 84} 470 L${ROOM.LAMP_X - 46} 380 H${ROOM.LAMP_X + 46} L${ROOM.LAMP_X + 84} 470 Z`} fill="#f2c36a" />
        <path d={`M${ROOM.LAMP_X - 84} 470 L${ROOM.LAMP_X - 46} 380 H${ROOM.LAMP_X - 8} L${ROOM.LAMP_X - 40} 470 Z`} fill="#fff" opacity=".28" />
      </g>
      <g filter="url(#rShadow)"><rect x={300} y={955} width={42} height={46} rx={8} fill="#2f8f4e" /><ellipse cx={321} cy={957} rx={21} ry={6} fill="#5a3a22" /></g>

      {/* light: lamp cone + warm wall glow on the left, cool phone glow on the right */}
      <polygon points={`${ROOM.LAMP_X - 60},470 ${ROOM.LAMP_X + 60},470 ${ROOM.LAMP_X + 330},1000 ${ROOM.LAMP_X - 330},1000`} fill="url(#rCone)" opacity={warm} filter="url(#rSoft)" />
      <rect width={ROOM.W} height={ROOM.H} fill="#050a2a" opacity="0.38" />
      <ellipse cx={ROOM.LAMP_X + 150} cy={560} rx={820} ry={640} fill="url(#rWarm)" opacity={0.95 * warm} filter="url(#rBlur)" />
      <ellipse cx={ROOM.BED_X + 120} cy={780} rx={880} ry={560} fill="url(#rCool)" opacity={0.7 * cool} filter="url(#rBlur)" />
      <rect width={ROOM.W} height={ROOM.H} fill="url(#rEdge)" />
    </svg>
  );
};
