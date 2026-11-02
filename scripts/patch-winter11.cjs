const fs = require('fs');
const edit = (file, fn) => { let s = fs.readFileSync(file, 'utf8'); s = fn(s); fs.writeFileSync(file, s); };
const rep = (s, a, b) => { if (!s.includes(a)) throw new Error('missing: ' + String(a).slice(0, 80)); return s.replace(a, b); };

edit('src/winter/Hero.tsx', (s) => {
  s = rep(s, "import {Head as SameHead} from '../same2d/Char';", "import {Head as SameHead, Look} from '../same2d/Char';");
  s = rep(s, "kind?: 'same' | 'bubble' | 'adult'; t?: number};", "kind?: 'same' | 'bubble' | 'adult'; t?: number; cast?: Look};   // cast = which person of the Same Man family (hair): 'man' is Sam, 'colleague' is Jake");
  s = rep(s, 'idle={p.t ? 1 : 0} />;', "idle={p.t ? 1 : 0} look={p.cast ?? 'man'} />;");
  s = rep(s, 'turn, kind, t, ...b}) =>', 'turn, kind, t, cast, ...b}) =>');
  s = rep(s, 'kind={kind} t={t} /></g>', 'kind={kind} t={t} cast={cast} /></g>');
  return s;
});
edit('src/winter/SideHero.tsx', (s) => {
  s = rep(s, "id = 'sd', turn, t}) =>", "id = 'sd', turn, t, cast}) =>");
  s = rep(s, 'kind={kind} t={t} />', 'kind={kind} t={t} cast={cast} />');
  return s;
});
edit('src/winter/scenes.tsx', (s) => {
  s = rep(s, "export const JAKE = {top: 'hoodie' as const, topColor: '#6b4fc4'};", "export const JAKE = {top: 'hoodie' as const, topColor: '#6b4fc4', cast: 'colleague' as const};");
  s = rep(s, '<Hero t={t} x={jake.x ?? 1360}', '<Hero t={t} cast="colleague" x={jake.x ?? 1360}');
  return s;
});
