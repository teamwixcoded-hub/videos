const fs = require('fs');
const edit = (file, fn) => { let s = fs.readFileSync(file, 'utf8'); s = fn(s); fs.writeFileSync(file, s); };
const rep = (s, a, b) => { if (!s.includes(a)) throw new Error('missing: ' + String(a).slice(0, 80)); return s.replace(a, b); };

edit('src/winter/timeline.ts', (s) => {
  s = rep(s, 'export const FIRST_END = 68.0;                    // the first minute and a half ends on "The alarm rings."', 'export const END = 165.1;                         // how much of the video is built so far (the cut ends on "...becomes a habit.")');
  s += `
// A character's own spoken line: the mouth opens and closes with each word between from and to (0 = closed). The narrator's words are not lip-synced, only what the men say.
export const speakOpen = (t: number, from: number, to: number): number => {
  for (const w of WORDS) {
    if (w.a < from - 0.02 || w.b > to + 0.05) continue;
    if (t >= w.a - 0.03 && t <= w.b + 0.04) { const k = (t - w.a + 0.03) / (w.b - w.a + 0.07); return 0.22 + 0.5 * Math.abs(Math.sin(k * Math.PI * (1 + Math.min(2, (w.b - w.a) * 2.5)))); }
  }
  return 0;
};
`;
  return s;
});

edit('src/winter/Hero.tsx', (s) => {
  s = rep(s, "t?: number; cast?: Look};", "t?: number; cast?: Look; open?: number};");
  s = rep(s, "face={{...f, lids: Math.max(f.lids, p.blink ?? 0), gaze: p.look ?? [0, 0]}}", "face={{...f, open: p.open ?? f.open, lids: Math.max(f.lids, p.blink ?? 0), gaze: p.look ?? [0, 0]}}");
  s = rep(s, 'turn, kind, t, cast, ...b}) =>', 'turn, kind, t, cast, open, ...b}) =>');
  s = rep(s, 'kind={kind} t={t} cast={cast} /></g>', 'kind={kind} t={t} cast={cast} open={open} /></g>');
  return s;
});
edit('src/winter/SideHero.tsx', (s) => {
  s = rep(s, "id = 'sd', turn, t, cast}) =>", "id = 'sd', turn, t, cast, open}) =>");
  s = rep(s, 'kind={kind} t={t} cast={cast} />', 'kind={kind} t={t} cast={cast} open={open} />');
  return s;
});

edit('src/winter/scenes.tsx', (s) => {
  s = rep(s, "const BedMan: React.FC<{t: number; who: 'sam' | 'jake'; eyes: 'closed' | 'open'; phone?: boolean; jolt?: number; id: string; mood?: any; z?: boolean}> = ({t, who, eyes, phone, jolt = 0, id, mood = 'tired', z}) => {",
    "export const BedMan: React.FC<{t: number; who: 'sam' | 'jake'; eyes: 'closed' | 'open'; phone?: boolean; jolt?: number; id: string; mood?: any; z?: boolean; open?: number}> = ({t, who, eyes, phone, jolt = 0, id, mood = 'tired', z, open}) => {");
  s = rep(s, "t={t} id={id} mood={eyes === 'open' ? mood : 'tired'}", "t={t} open={open} cast={who === 'jake' ? 'colleague' : undefined} id={id} mood={eyes === 'open' ? mood : 'tired'}");
  s = rep(s, 'const Clock: React.FC', 'export const Clock: React.FC');
  s = rep(s, "zzz?: boolean; mood?: any}> = ({t, dawn = 0, sam = 'closed', jake = 'closed', ring = 0, phones, jolt = 0, zzz, mood}) => (", "zzz?: boolean; mood?: any; samOpen?: number; jakeOpen?: number}> = ({t, dawn = 0, sam = 'closed', jake = 'closed', ring = 0, phones, jolt = 0, zzz, mood, samOpen, jakeOpen}) => (");
  s = rep(s, '<BedMan t={t} who="sam" eyes={sam} phone={phones} jolt={jolt} id="bs" mood={mood} z={zzz} />', '<BedMan t={t} who="sam" eyes={sam} phone={phones} jolt={jolt} id="bs" mood={mood} z={zzz} open={samOpen} />');
  s = rep(s, '<BedMan t={t} who="jake" eyes={jake} phone={phones} jolt={jolt} id="bj" mood={mood} z={zzz} />', '<BedMan t={t} who="jake" eyes={jake} phone={phones} jolt={jolt} id="bj" mood={mood} z={zzz} open={jakeOpen} />');
  s = rep(s, "mood?: any; pose?: any; y?: number; x?: number; scale?: number};", "mood?: any; pose?: any; y?: number; x?: number; scale?: number; open?: number};");
  s = rep(s, '<Hero t={t} x={sam.x ?? 560}', '<Hero t={t} open={sam.open} x={sam.x ?? 560}');
  s = rep(s, '<Hero t={t} cast="colleague" x={jake.x ?? 1360}', '<Hero t={t} cast="colleague" open={jake.open} x={jake.x ?? 1360}');
  return s;
});

edit('src/winter/scenes.tsx', (s) => {
  s = rep(s, 'const Txt: React.FC', 'export const Txt: React.FC');
  s = rep(s, 'const lieHead =', 'export const lieHead =');
  s = rep(s, "export const DayCard: React.FC<{t: number}> = ({t}) => {", "export const DayCard: React.FC<{t: number; month?: string; day?: string; clock?: boolean}> = ({t, month = 'DECEMBER', day = '1', clock = true}) => {");
  s = rep(s, '>DECEMBER</Txt>', '>{month}</Txt>');
  s = rep(s, 'fill="#1b1a3a">1</text>', 'fill="#1b1a3a">{day}</text>');
  s = rep(s, 'opacity={ramp(t, 0.8, 1.4)}>', 'opacity={clock ? ramp(t, 0.8, 1.4) : 0}>');
  return s;
});
edit('src/winter/scenes2.tsx', (s) => {
  s = rep(s, '      <g transform="translate(960 640) scale(2.3) translate(-960 -702)"><g><rect x={0} y={0} width={0} height={0} /></g></g>\n', '');
  s = rep(s, '      {a0 > t && null}\n', '');
  s = rep(s, "a0 = T('jake hits'), ", '');
  s = rep(s, "b={TE('minutes') > 0 ? T('he does 20') + 1.0 : 0}", "b={T('he does 20') + 1.0}");
  s = rep(s, '      {n < 0 && null}\n', '');
  s = rep(s, "  const n = Math.round(10 * ramp(t, T('reads'), T('pages') + 0.3));\n", '');
  return s;
});
