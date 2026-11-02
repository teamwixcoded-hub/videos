const fs = require('fs');
const edit = (file, fn) => { let s = fs.readFileSync(file, 'utf8'); s = fn(s); fs.writeFileSync(file, s); };
const rep = (s, a, b) => { if (!s.includes(a)) throw new Error('missing: ' + String(a).slice(0, 80)); return s.replace(a, b); };

edit('src/winter/Hero.tsx', (s) => {
  s = rep(s, "import {BubbleHead} from './Bubble';", "import {BubbleHead} from './Bubble';\nimport {Head as SameHead} from '../same2d/Char';");
  s = rep(s, "kind?: 'bubble' | 'adult'};", "kind?: 'same' | 'bubble' | 'adult'; t?: number};");
  s = rep(s, "const SK = '#e8eafb', SK_D = '#b9bfe0';", "const SK = '#f1eefb', SK_D = '#c9bfe3';");
  const a = s.indexOf('export const chinOf'), b = s.indexOf('// ---------------------------------------------------------------------------------------------\n// BODY v2');
  if (a < 0 || b < 0) throw new Error('markers');
  s = s.slice(0, a) + `export const chinOf = (kind?: 'same' | 'bubble' | 'adult') => (kind === 'adult' ? 236 : kind === 'bubble' ? 200 : 150);
export const defaultHeadScale = (kind?: 'same' | 'bubble' | 'adult') => (kind === 'adult' ? 0.46 : kind === 'bubble' ? 0.6 : 0.8);
// the Same Man / Two Fathers head (src/same2d/Char.tsx) is the default face: the moods are mapped onto its own face controls (lids, smile, brows, open mouth)
const FACE: Record<Mood, {lids: number; smile: number; brow: number; browTilt: number; open: number; wide: number}> = {
  happy: {lids: 0.04, smile: 0.8, brow: 0.25, browTilt: -2, open: 0, wide: 0},
  determined: {lids: 0.16, smile: 0.1, brow: -0.2, browTilt: -6, open: 0, wide: 0},
  neutral: {lids: 0.18, smile: 0, brow: 0, browTilt: 0, open: 0, wide: 0},
  tired: {lids: 0.66, smile: 0, brow: -0.3, browTilt: 8, open: 0, wide: 0},
  sad: {lids: 0.5, smile: 0, brow: -0.25, browTilt: 13, open: 0, wide: 0},
  shock: {lids: 0, smile: 0, brow: 0.5, browTilt: 0, open: 0.55, wide: 0.8},
};
const seedOf = (id = 'h') => { let n = 0; for (const c of id) n = (n * 31 + c.charCodeAt(0)) % 997; return n / 100; };
export const Head: React.FC<HeadProps> = ({kind = 'same', ...p}) => {
  if (kind === 'adult') return <AdultHead {...p} />;
  if (kind === 'bubble') return <BubbleHead {...p} />;
  const f = FACE[p.mood ?? 'neutral'];
  return <SameHead face={{...f, lids: Math.max(f.lids, p.blink ?? 0), gaze: p.look ?? [0, 0]}} turn={p.turn ?? 0} t={p.t ?? 0} seed={seedOf(p.id)} idle={p.t ? 1 : 0} />;
};

` + s.slice(b);
  s = rep(s, 'turn, kind, ...b}) =>', 'turn, kind, t, ...b}) =>');
  s = rep(s, 'turn={turn} kind={kind} /></g>', 'turn={turn} kind={kind} t={t} /></g>');
  return s;
});

edit('src/winter/SideHero.tsx', (s) => {
  s = rep(s, "id = 'sd', turn}) =>", "id = 'sd', turn, t}) =>");
  s = rep(s, 'turn={turn ?? P.turn ?? 0.9} kind={kind} />', 'turn={turn ?? P.turn ?? 0.9} kind={kind} t={t} />');
  return s;
});

edit('src/winter/scenes.tsx', (s) => {
  s = rep(s, 'id={id} mood={eyes === \'open\' ? mood : \'tired\'}', 't={t} id={id} mood={eyes === \'open\' ? mood : \'tired\'}');
  s = rep(s, '<Hero x={sam.x ?? 560}', '<Hero t={t} x={sam.x ?? 560}');
  s = rep(s, '<Hero x={jake.x ?? 1360}', '<Hero t={t} x={jake.x ?? 1360}');
  return s;
});

edit('src/winter/Sheet.tsx', (s) => s.replace('scale(0.55)', 'scale(0.74)'));
