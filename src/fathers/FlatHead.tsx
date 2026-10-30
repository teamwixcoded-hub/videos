import React, {useId} from 'react';
import {Face, Look, INK, shade} from '../same2d/Char';

// ============================================================================================
// Flat 2D cartoon head for Two Fathers: solid skin colour, one cel-shadow crescent, thick ink outline, big readable eyes, strong brows and mouth shapes.
// No gradients, no glass, no highlights. Same props as the old Head, so the rig does not change.
// ============================================================================================
const clamp = (x: number, a: number, b: number) => Math.min(b, Math.max(a, x));
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const sstep = (x: number) => { const k = clamp(x, 0, 1); return k * k * (3 - 2 * k); };

const SKINS: Record<string, string> = {adam: '#f1c9a5', sam: '#e0a678', leo: '#f3cfae', max: '#e6b48a', aunt: '#d79a73', man: '#f1c9a5'};
export const skinOf = (look: string) => SKINS[look] ?? '#f1c9a5';
// hands, necks and bare arms read the skin colour of whoever is drawn
let CUR = '#f1c9a5';
export const setSkin = (look: string) => { CUR = skinOf(look); };
export const SK = () => CUR;
export const SKD = () => shade(CUR, -0.16);

const mixHex = (a: string, b: string, k: number) => {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16), f = (s: number) => Math.round(((pa >> s) & 255) * (1 - k) + ((pb >> s) & 255) * k);
  return '#' + [16, 8, 0].map((s) => f(s).toString(16).padStart(2, '0')).join('');
};
const HAIR: Record<string, string> = {adam: '#2b2634', sam: '#5a3a26', leo: '#3a2a20', max: '#1d1a2e', aunt: '#6a3a2a', man: '#2b2634'};
export const hairOf = (look: string, grey: number) => mixHex(HAIR[look] ?? '#2b2634', '#cfd1dc', clamp(grey, 0, 1));

export const FlatHead: React.FC<{face: Face; turn: number; t: number; seed: number; idle: number; look?: Look; grey?: number}> = ({face, turn, t, seed, idle, look = 'man', grey = 0}) => {
  const skin = skinOf(look), skinD = shade(skin, -0.16), hair = hairOf(look, grey), id = useId().replace(/:/g, '');
  const {gaze = [0, 0], lids = 0.05, smile = 0, open = 0, brow = 0, browTilt = 0, wide = 0} = face;
  // blinks, eye saccades, brow flicks (kept alive, kept small)
  const P = 3.5 + 0.9 * Math.sin(seed * 7.3), ph = (t + seed * 2.1) % P, cyc = Math.floor((t + seed * 2.1) / P);
  const b1 = ph < 0.16 ? Math.sin((ph / 0.16) * Math.PI) : 0, b2 = cyc % 3 === 0 && ph > 0.3 && ph < 0.46 ? Math.sin(((ph - 0.3) / 0.16) * Math.PI) : 0;
  const cover = Math.max(lids, b1, b2);
  const k = Math.floor(t / 0.8 + seed * 5), fr = (t / 0.8 + seed * 5) % 1;
  const jx = (rnd(k) - 0.5) * 0.3 * idle, jy = (rnd(k + 91) - 0.5) * 0.2 * idle, px = (rnd(k - 1) - 0.5) * 0.3 * idle, py = (rnd(k + 90) - 0.5) * 0.2 * idle;
  const gz: [number, number] = [gaze[0] + px + (jx - px) * sstep(fr / 0.14), gaze[1] + py + (jy - py) * sstep(fr / 0.14)];
  const kb = Math.floor(t / 1.7 + seed * 3), fb = (t / 1.7 + seed * 3) % 1;
  const flick = rnd(kb + 7) > 0.72 ? Math.sin(Math.min(1, fb / 0.35) * Math.PI) * 0.3 * idle : 0;
  const sm = clamp(smile, 0, 1), squint = clamp(face.squint ?? sm * 0.7, 0, 1);
  const skew = face.skew ?? (sm > 0.05 ? (rnd(Math.floor(seed * 10) + 3) - 0.5) * 0.5 : 0), asym = face.asym ?? 0.12 * (rnd(Math.floor(seed * 10) + 11) - 0.5);
  // talking jaw: the whole lower face bobs a touch with the mouth
  const talk = open > 0.05 ? Math.sin(t * 22) * open * 2 : 0;
  const my = 66 + talk, mw = 36 + sm * 12 - open * 6;
  const yL = my - skew * 8 - sm * 6, yR = my + skew * 8 - sm * 6;
  const mouthShape = `M ${-mw},${yL} Q 0,${my + 14 + 80 * open + 20 * sm} ${mw},${yR} Q 0,${my - 4 - 6 * open} ${-mw},${yL} Z`;
  const smilePath = `M ${-mw},${yL - 2} Q 0,${my + 8 + 36 * sm - 14 * (lids > 0.35 && sm < 0.2 ? 1 : 0)} ${mw},${yR - 2}`;
  const near = turn >= 0 ? 1 : -1;
  return (
    <g>
      <defs><clipPath id={'hc' + id}><circle r={148} /></clipPath></defs>
      {/* ears sit behind the head; the far one disappears when the head turns */}
      {[-1, 1].map((s) => { const far = s * turn > 0 ? Math.min(1, Math.abs(turn) * 1.6) : 0; return far > 0.5 ? null : <g key={s} transform={`translate(${s * 146 + turn * 30} 10)`}><circle r={27} fill={skin} stroke={INK} strokeWidth={7} /><path d={`M ${-s * 4},-10 Q ${s * 8},0 ${-s * 4},12`} fill="none" stroke={skinD} strokeWidth={6} strokeLinecap="round" /></g>; })}
      {look === 'aunt' && <circle cx={34 + turn * 30} cy={-176} r={46} fill={hair} stroke={INK} strokeWidth={7} />}
      <circle r={148} fill={skin} stroke={INK} strokeWidth={8} />
      <g clipPath={`url(#hc${id})`}><circle r={150} fill={skinD} /><circle cx={-26} cy={-22} r={146} fill={skin} /></g>
      <circle r={148} fill="none" stroke={INK} strokeWidth={8} />
      {/* hair, flat */}
      {(look === 'man' || look === 'adam' || look === 'sam' || look === 'aunt') && <g transform={`translate(${turn * 34} 0)`}><path d="M -132,-52 Q -146,-152 -20,-158 Q 122,-160 134,-50 Q 100,-92 48,-98 Q 0,-106 -44,-94 Q -96,-92 -132,-52 Z" fill={hair} stroke={INK} strokeWidth={7} strokeLinejoin="round" /></g>}
      {look === 'leo' && <g transform={`translate(${turn * 34} 0)`}><path d="M -142,-40 Q -150,-120 -96,-140 L -88,-182 L -58,-146 L -34,-196 L -8,-150 L 22,-192 L 42,-148 L 80,-176 L 88,-138 Q 148,-120 144,-40 Q 110,-92 50,-98 Q 0,-106 -44,-94 Q -102,-92 -142,-40 Z" fill={hair} stroke={INK} strokeWidth={7} strokeLinejoin="round" /></g>}
      {look === 'max' && <g transform={`translate(${turn * 34} 0)`} fill={hair} stroke={INK} strokeWidth={6}>{[[-100, -100, 34], [-64, -140, 38], [-16, -160, 40], [34, -156, 38], [80, -128, 36], [112, -84, 30], [-124, -52, 24], [126, -44, 22]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}</g>}
      {/* the face slides and narrows as the head turns */}
      <g transform={`translate(${turn * 58} 0) scale(${1 - Math.abs(turn) * 0.16} 1)`}>
        <ellipse cx={-100} cy={36} rx={26} ry={16} fill="#ee7f7f" opacity={0.16 + sm * 0.3} />
        <ellipse cx={100} cy={36} rx={26} ry={16} fill="#ee7f7f" opacity={0.16 + sm * 0.3} />
        {[-1, 1].map((s) => {
          const far0 = s * turn < 0 ? Math.min(1, Math.abs(turn)) : 0;
          const cx = s * 58 - s * 12 * far0, cy = -10, ry = 33 * (1 + 0.3 * wide), rx = 28 * (1 + 0.12 * wide) * (1 - 0.3 * far0);
          const by = -76 - (brow + flick) * 20 - (s > 0 ? asym : -asym) * 12;
          const lidH = Math.max(0, 76 * cover), tilt = browTilt * (s > 0 ? -1 : 1);
          return (
            <g key={s}>
              <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" stroke={INK} strokeWidth={5.5} />
              <ellipse cx={cx + gz[0] * 11} cy={cy + gz[1] * 9} rx={rx * 0.52} ry={ry * 0.58} fill={INK} />
              <circle cx={cx + gz[0] * 11 + 6} cy={cy + gz[1] * 9 - 9} r={5.5} fill="#fff" />
              {/* upper lid (tiredness / blink), flat skin, with the lid line */}
              <clipPath id={`ec${id}${s}`}><ellipse cx={cx} cy={cy} rx={rx - 1} ry={ry - 1} /></clipPath>
              <g clipPath={`url(#ec${id}${s})`}>
                <rect x={cx - rx - 4} y={cy - ry - 4} width={2 * rx + 8} height={Math.max(0, lidH * 0.9 + (cover > 0 ? 4 : 0))} fill={skin} />
                <ellipse cx={cx} cy={cy + ry + 4 - squint * 22} rx={rx + 6} ry={ry * 0.7} fill={skin} />
              </g>
              {cover > 0.1 && <path d={`M ${cx - rx},${cy - ry + lidH * 0.9} Q ${cx},${cy - ry + lidH * 0.9 + 8} ${cx + rx},${cy - ry + lidH * 0.9}`} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />}
              {squint > 0.2 && <path d={`M ${cx - rx + 2},${cy + ry - squint * 22 + 4} Q ${cx},${cy + ry - squint * 22 - 6} ${cx + rx - 2},${cy + ry - squint * 22 + 4}`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />}
              {/* brow: a thick rounded stroke, tilting with worry / anger */}
              <path d={`M ${cx - 32 * s * -1 * 0 - 30},${by + (s > 0 ? tilt * 0.9 : -tilt * 0.9) * 0.9} Q ${cx},${by - 14 - brow * 6} ${cx + 30},${by + (s > 0 ? -tilt * 0.9 : tilt * 0.9) * 0.9}`} fill="none" stroke={shade(hair, -0.05)} strokeWidth={15} strokeLinecap="round" transform={`rotate(${tilt * 0.35} ${cx} ${by})`} />
            </g>
          );
        })}
        {/* nose: a small flat comma, bigger in profile */}
        <path d={`M ${near * 6},12 Q ${near * (16 + Math.abs(turn) * 22)},34 ${near * 2},42`} fill="none" stroke={skinD} strokeWidth={7} strokeLinecap="round" />
        {look === 'sam' && <g>
          <path d="M -140,10 Q -146,100 -70,138 Q 0,160 70,138 Q 146,100 140,10 Q 112,112 0,118 Q -112,112 -140,10 Z" fill={hair} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          <path d="M -50,56 Q -24,40 0,52 Q 24,40 50,56 Q 26,68 0,60 Q -26,68 -50,56 Z" fill={hair} stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
        </g>}
        {/* mouth: closed smile line, or a filled open mouth with tongue (and teeth when it is a big grin) */}
        {open < 0.08 ? <path d={smilePath} fill="none" stroke={INK} strokeWidth={8} strokeLinecap="round" /> : (
          <g>
            <path d={mouthShape} fill="#7a1e2c" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
            <clipPath id={'mc' + id}><path d={mouthShape} /></clipPath>
            <g clipPath={`url(#mc${id})`}>
              {open > 0.3 && sm > 0.3 && <rect x={-mw} y={my - 8} width={2 * mw} height={14 + open * 6} fill="#fff" />}
              <ellipse cx={0} cy={my + 30 + 60 * open} rx={mw * 0.55} ry={16 + 12 * open} fill="#e96a7a" />
            </g>
          </g>
        )}
      </g>
    </g>
  );
};
