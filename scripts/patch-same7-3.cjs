const fs = require('fs');
// 1) type.tsx: a headline never runs long on one line: it is broken into balanced rows of at most about 18 characters, centred, each word still revealed in order
let t = fs.readFileSync('src/fathers/type.tsx', 'utf8');
const a = t.indexOf("        <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: size * 0.28, rowGap: size * 0.04}}>");
const b = t.indexOf("        {mode === 'title' && sweep > 0");
if (a < 0 || b < 0) throw new Error('block');
const block = `        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', rowGap: size * 0.06}}>
          {(() => { let gi = 0; return rows.map((row, ri) => (
            <div key={ri} style={{display: 'flex', justifyContent: 'center', columnGap: size * 0.28}}>
              {row.map((wd) => {
                const i = gi++, d0 = mode === 'slam' ? 0 : i * stag, k = mode === 'slam' ? 1 : clamp((l - d0) / 0.62), gold = w.accent === i;
                return <MaskWord key={i} text={wd} k={k} size={size} gold={gold} track={mode === 'slam' ? [0.05, 0.05] : [0.22, 0.045]} underline={gold ? (l - d0 - 0.45) / 0.5 : 0} font={DIGI} />;
              })}
            </div>
          )); })()}
        </div>
`;
t = t.slice(0, a) + block + t.slice(b);
const c = "  const words = w.text.split(' '), n = words.length, mode = w.mode;";
if (!t.includes(c)) throw new Error('words');
t = t.replace(c, c + "\n  // balanced rows: as few rows as needed so that no row is longer than about 18 characters\n  const rows: string[][] = (() => { const nr = Math.max(1, Math.ceil(w.text.length / 18)); if (nr === 1) return [words]; const target = w.text.length / nr, out: string[][] = []; let cur: string[] = [], cl = 0; for (const wd of words) { if (cur.length && cl + wd.length / 2 > target && out.length < nr - 1) { out.push(cur); cur = []; cl = 0; } cur.push(wd); cl += wd.length + 1; } out.push(cur); return out; })();");
fs.writeFileSync('src/fathers/type.tsx', t);

// 2) Same7: one short idea per text, sequential (never two texts competing for the lower third), centred phrases only in the lower third
let s = fs.readFileSync('src/same7/Same7.tsx', 'utf8');
const x0 = s.indexOf('const TYPEW: TW[] = [');
const x1 = s.indexOf('// ---------------- sound');
if (x0 < 0 || x1 < 0) throw new Error('typew');
const text = `// TEXT RULES (one voice for the whole film): one short idea per text, at most 2 lines of about 18 characters each, never two texts at the same time in the lower third.
//  - key phrases (pop) sit centred in the lower third; stamps (kicker + label) sit lower-left; day / time tags and the IN BED / IN THE CHAIR pills sit at the top.
//  - titles are not centred over faces any more: everything is lower third, except words that sit on a plain insert.
const pop = (phrase: string, dur: number, text: string, accent?: number, off = 0): TW => ({at: T(phrase) + off, dur, text, accent, mode: 'pop'});
const TYPE_RAW: TW[] = [
  pop('same man', 1.2, 'SAME MAN.', 0), pop('same night', 1.2, 'SAME NIGHT.', 0), pop('same room', 1.3, 'SAME ROOM.', 0),
  pop('in one year', 1.5, 'IN ONE YEAR', 2),
  pop('the other will be', 2.0, 'AWAKE AT 2:00 AM.', 2),
  pop('the only difference', 2.2, 'THE ONLY DIFFERENCE', 3),
  pop('you make this exact', 2.4, 'YOU MAKE THIS CHOICE', 3), pop('every single night', 1.6, 'EVERY NIGHT.', 0),
  pop('anyone would', 1.3, 'ANYONE WOULD.', 0),
  pop('split this night', 2.4, 'ONE NIGHT. TWO WAYS.', 2),
];
const st = (phrase: string, dur: number, kicker: string, label: string, off = 0): StampT => ({at: T(phrase) + off, dur, kicker, label});
const STAMPS_RAW: StampT[] = [
  st('the biggest project', 2.2, 'THE PROMOTION', 'BIGGEST PROJECT'), st('his name is', 2.9, 'HIS NAME IS', 'DANIEL · 28'), st('a friend gave', 2.6, 'A GIFT FROM A FRIEND', '3 MONTHS AGO'),
  st('the bookmark', 2.3, 'THE BOOKMARK', 'STILL ON PAGE ONE'),
];
// the lower third is one lane: pops and stamps are sorted by start time and each one ends before the next begins
const LANE = [...TYPE_RAW.map((w) => ({k: 'p' as const, at: w.at, i: TYPE_RAW.indexOf(w)})), ...STAMPS_RAW.map((s, i) => ({k: 's' as const, at: s.at, i}))].sort((a, b) => a.at - b.at);
const TYPEW: TW[] = TYPE_RAW.map((w) => ({...w})), STAMPS: StampT[] = STAMPS_RAW.map((s) => ({...s}));
LANE.forEach((it, n) => { const nx = LANE[n + 1]; if (!nx) return; const item = it.k === 'p' ? TYPEW[it.i] : STAMPS[it.i]; item.dur = Math.max(0.8, Math.min(item.dur, nx.at - it.at - 0.12)); });

`;
s = s.slice(0, x0) + text + s.slice(x1);
fs.writeFileSync('src/same7/Same7.tsx', s);
