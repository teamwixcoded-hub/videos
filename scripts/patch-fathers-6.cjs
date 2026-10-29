// Two Fathers main comp in the Same Man look: digital text (AnimText modes), Cinema light, shafts, speed lines on flashes, particle bridges, gloved hands in inserts
const fs = require('fs');
let s = fs.readFileSync('src/fathers/Fathers.tsx', 'utf8');
s = s.replace("import {KineticWords, KW, ramp, bell, Dust, GRAIN, BigCount, PhotoFlash} from './fx';", "import {KW, ramp, bell, GRAIN, AgeTag, Counter, RewindCard} from './fx';\nimport {KineticWord, IconTag, Cinema, Shafts, SpeedLines, Bridge, Dust, kwCues, KW as KWS, TextMode} from '../same2d/fx';");
s = s.replace(/const kwCue = [^\n]*\n/, `// key words: the quiet ones whisper (typing), the hard truths slam, titles get the HUD
const MODE: Record<string, TextMode> = {
  'TWO FATHERS': 'title', 'SAME STREET': 'pop', 'SAME SALARY': 'pop', 'SAME LOVE.': 'slam', 'MONEY.': 'slam', 'TIME.': 'slam', 'ONLY ONE RINGS.': 'slam', 'EXTRA SHIFTS \\u00B7 WEEKENDS': 'pop', 'NEXT TIME.': 'slam',
  'IT\\u2019S RARELY THE GIFTS.': 'pop', 'IT\\u2019S THE TIME.': 'slam', 'SAY SOMETHING.': 'whisper', 'FIGHTS END.': 'pop', 'WALKS CONTINUE.': 'slam', 'THE ONE WHO WAS THERE.': 'title',
  'HE ISN\\u2019T IN ANY OF THEM.': 'slam', '25 YEARS OF FRIDAYS': 'title', 'NOT TO SEND MONEY.': 'slam', 'THEY\\u2019LL REMEMBER WHO SHOWED UP.': 'title',
};
const WORDS: KWS[] = KWORDS.filter((w) => w.style === 'big' || w.style === 'quote').map((w) => { const mode = w.style === 'quote' ? 'whisper' : MODE[w.text] ?? 'pop'; return {at: w.at, dur: w.dur, text: w.text, accent: w.accent, mode, big: mode === 'slam' || mode === 'title'}; });
const TAGS = KWORDS.filter((w) => w.style === 'tag'), TIMES = KWORDS.filter((w) => w.style === 'time');
const pillsOf = (text: string): ('adam' | 'sam' | 'leo' | 'max')[] => (text === 'AGE 65' ? ['adam', 'sam'] : text === 'AGE 5' || text === 'AGE 15' ? ['leo'] : ['leo', 'max']);
const kwCue = (w: KW): Cue3 | null => null;
const WORD_CUES: Cue3[] = WORDS.flatMap((w) => kwCues(w));
const TAG_CUES: Cue3[] = [...TAGS.map((w): Cue3 => ({file: 'tag_whoosh', at: w.at, vol: 0.25})), ...TIMES.map((w): Cue3 => ({file: 'tag_whoosh', at: w.at, vol: 0.2}))];
`);
s = s.replace("  ...KWORDS.map(kwCue).filter((c): c is Cue3 => !!c),\n", "  ...WORD_CUES, ...TAG_CUES,\n");
const i = s.indexOf('const TwoFathersMain');
s = s.slice(0, i) + `const TwoFathersMain: React.FC = () => {
  const frame = useCurrentFrame(), t = frame / FPS;
  const si = SHOTS.findIndex((s, i) => t >= s.from && (t < s.to || i === SHOTS.length - 1)), shot = SHOTS[Math.max(0, si)], c = ctxOf(shot, t);
  const prev = SHOTS[si - 1], dissolve = prev && shot.from < 32 && !shot.fx && t - shot.from < 0.35 ? ramp(t - shot.from, 0, 0.35) : 1;
  let whip = 0, whipDir = 0;
  for (const b of WHIP_AT) { const w = bell(t - b, 0.14); if (w > whip) { whip = w; whipDir = Math.sign(t - b) || 1; } }
  const HITS = [...FLASH_AT, 198.3, 217.8, 441.7, 466.0];
  const shk = 9 * HITS.reduce((m, h) => (t >= h && t < h + 0.45 ? Math.max(m, Math.exp(-(t - h) * 9)) : m), 0);
  const fl = (() => { const f = FLASH_AT.find((b) => t >= b - 0.04 && t < b + 0.4); return f === undefined ? 0 : Math.max(0, 1 - (t - f) / 0.4); })();
  const g = gradeAt(t), paperCard = t >= 32 && t < 35, warm = g.c[0] > 200;
  const burst = bell(t - 441.75, 0.4);
  const fadeIn = 1 - ramp(t, 0.5, 1.4), fadeOut = ramp(t, 488.4, 490);
  const friday = t >= 120 && t < 142, sundays = t >= 386 && t < 416;
  const fridayN = Math.min(12, Math.floor((t - 120) / 1.7) + 1);
  return (
    <AbsoluteFill style={{background: '#05060b'}}>
      <AbsoluteFill style={{transform: \`translate(\${whipDir * whip * whip * 90 + Math.sin(t * 83) * shk}px, \${Math.cos(t * 67) * shk}px) scale(\${1 + whip * 0.04 + shk * 0.002})\`, filter: \`contrast(1.06) saturate(\${paperCard ? 1 : 1.05 * g.sat})\${whip > 0.02 ? \` blur(\${whip * 16}px)\` : ''}\`}}>
        {dissolve < 1 && prev.C(ctxOf(prev, Math.min(t, prev.to - 0.001)))}
        <AbsoluteFill style={{opacity: dissolve}}>{shot.C(c)}</AbsoluteFill>
      </AbsoluteFill>
      {!paperCard && <AbsoluteFill style={{background: \`rgb(\${g.c[0]},\${g.c[1]},\${g.c[2]})\`, opacity: g.a, mixBlendMode: 'soft-light'}} />}
      {!paperCard && <Shafts t={t} warm={warm} />}
      {!paperCard && <Cinema t={t} />}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(0,0,0,.55) 100%)'}} />
      <AbsoluteFill style={{backgroundImage: GRAIN, backgroundPosition: \`\${(frame * 37) % 220}px \${(frame * 91) % 220}px\`, mixBlendMode: 'overlay', opacity: 0.12, pointerEvents: 'none'}} />
      {BRIDGE_AT.map((b) => <Bridge key={b} t={t} at={b} />)}
      {fl > 0 && <><AbsoluteFill style={{background: '#fff', opacity: fl * 0.9}} /><SpeedLines o={Math.min(1, fl * 1.6)} /></>}
      {burst > 0.01 && <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 46%, rgba(255,244,210,.98) 0%, rgba(255,214,140,.6) 30%, rgba(255,214,140,0) 62%)', opacity: burst}} />}
      <AbsoluteFill style={{background: '#000', opacity: fadeIn}} />
      {!paperCard && <Dust t={t} dense={!warm} />}
      {paperCard && <RewindCard p={(t - 32) / 3} f={(t - 32) * FPS} />}

      <KineticWord t={t} words={WORDS} />
      {TAGS.map((w) => <AgeTag key={w.at} t={t} from={w.at} to={w.at + w.dur} text={w.text} pills={pillsOf(w.text)} />)}
      {TIMES.map((w) => <IconTag key={w.at} t={t} from={w.at} to={w.at + w.dur} text={w.text} icon={w.text.startsWith('SUNDAY') ? 'sun' : 'clock'} color="#fff" />)}
      {friday && <Counter label="FRIDAY" n={fridayN} o={ramp(t, 120.1, 120.6) * (1 - ramp(t, 141.2, 141.8))} />}
      {sundays && <Counter label="SUNDAYS" n={sundayCount(t)} o={ramp(t, 386.2, 386.8) * (1 - ramp(t, 415, 415.8))} />}
      <AbsoluteFill style={{background: '#000', opacity: fadeOut}} />

      {PIECES.map((p, i) => (
        <Sequence key={i} from={Math.round(p.at * FPS)} durationInFrames={Math.round(p.dur * FPS)}>
          <Audio src={staticFile(AUDIO_FILE)} startFrom={Math.round(p.a * FPS)} endAt={Math.round(p.b * FPS)} />
        </Sequence>
      ))}
      <Sfx3 cues={[...CUES, ...CUES4]} gain={1} minVol={0.3} duck={speechDuck} />
      {MUSIC.map((m, i) => <Sequence key={'m' + i} from={Math.round(m.from * FPS)} durationInFrames={Math.round((m.to - m.from) * FPS)}><Music track={m.track} startAt={m.startAt ?? 0} frames={Math.round((m.to - m.from) * FPS)} vol={m.vol} fadeIn={60} fadeOut={90} /></Sequence>)}
    </AbsoluteFill>
  );
};
export const TwoFathers: React.FC = () => <TwoFathersMain />;
export {S};
`;
fs.writeFileSync('src/fathers/Fathers.tsx', s);

// fx: AgeTag and Counter in the Same Man digital style; the rewind card in the same display face
let f = fs.readFileSync('src/fathers/fx.tsx', 'utf8');
f = f.replace("import {SERIF, SERIF_I, UI, PAPER, INK, GOLD} from './theme';", "import {SERIF, SERIF_I, UI, PAPER, INK, GOLD} from './theme';\nimport {AnimText} from '../same2d/fx';\nimport {MONT, DIGI, FPS as FPS_} from '../same2d/theme';");
f = f.replace("fontFamily: SERIF, fontWeight: 800, fontSize: 118, letterSpacing: 6, fontVariantNumeric: 'lining-nums', color: '#3a2a26',", "fontFamily: MONT, fontWeight: 800, fontSize: 112, letterSpacing: 4, color: '#2a2a35',");
f = f.replace("<span style={{color: '#b4592f'}}>EARLIER</span>", "<span style={{color: '#d98f1f'}}>EARLIER</span>");
f += `
// ---------------- whose age is it? (same pills as the Same Man day tags, one per person) ----------------
const WHO4 = {
  adam: {label: 'ADAM', c1: '#6a97ff', c2: '#2f55c7', glow: 'rgba(100,150,255,.65)'}, sam: {label: 'SAM', c1: '#ffa24f', c2: '#d0561d', glow: 'rgba(255,160,80,.65)'},
  leo: {label: 'LEO', c1: '#45c2ff', c2: '#1f7fd0', glow: 'rgba(70,190,255,.65)'}, max: {label: 'MAX', c1: '#3ddc84', c2: '#1f9a58', glow: 'rgba(61,220,132,.65)'},
};
export const AgeTag: React.FC<{t: number; from: number; to: number; text: string; pills: ('adam' | 'sam' | 'leo' | 'max')[]}> = ({t, from, to, text, pills}) => {
  const o = Math.min(ramp(t, from, from + 0.25), 1 - ramp(t, to - 0.3, to));
  if (o <= 0) return null;
  const fr = (t - from) * FPS_;
  return (
    <div style={{position: 'absolute', top: 54 - (1 - o) * 14, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, opacity: Math.min(1, o * 1.4)}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 20}}>
        <svg width="60" height="60" viewBox="0 0 48 48" style={{filter: 'drop-shadow(0 0 14px #fff)', transform: \`scale(\${0.6 + 0.4 * o}) rotate(\${(1 - o) * -40}deg)\`}}><g fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round"><rect x="6" y="9" width="36" height="32" rx="5" /><path d="M6 19h36M15 5v8M33 5v8" /></g></svg>
        <AnimText text={text} f={fr} size={82} mode="pop" tint="#fff" />
      </div>
      <div style={{display: 'flex', gap: 22}}>
        {pills.map((w, i) => { const q = WHO4[w], p = Math.min(1, Math.max(0, (fr - 6 - i * 3) / 10)), e = 1 - Math.pow(1 - p, 3); return (
          <div key={w} style={{padding: '10px 28px', borderRadius: 999, background: \`linear-gradient(180deg, \${q.c1}, \${q.c2})\`, border: '4px solid #fff', boxShadow: \`0 0 34px \${q.glow}, 0 8px 22px rgba(0,0,0,.5)\`, transform: \`translateX(\${(i % 2 ? 1 : -1) * (1 - e) * 140}px) scale(\${0.6 + 0.4 * e})\`, opacity: p, fontFamily: DIGI, fontWeight: 700, fontSize: 34, letterSpacing: 4, color: '#fff'}}>{q.label}</div>
        ); })}
      </div>
    </div>
  );
};
export const Counter: React.FC<{n: number; o: number; label: string}> = ({n, o, label}) => (
  <div style={{position: 'absolute', right: 170, top: 110, opacity: o, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: MONT, fontWeight: 800, color: '#ffc94d', textShadow: '0 0 28px rgba(255,201,77,.45), 0 6px 18px rgba(0,0,0,.6)'}}>
    <svg width="64" height="64" viewBox="0 0 48 48"><g fill="none" stroke="#ffc94d" strokeWidth="3.5" strokeLinecap="round"><rect x="6" y="9" width="36" height="32" rx="5" /><path d="M6 19h36M15 5v8M33 5v8" /></g></svg>
    <div style={{fontSize: 170, lineHeight: 1}}>{n.toLocaleString('en-US')}</div>
    <div style={{fontSize: 44, letterSpacing: 8}}>{label}</div>
  </div>
);
`;
fs.writeFileSync('src/fathers/fx.tsx', f);

// inserts: Same Man dark bokeh background, white gloved hands
let a = fs.readFileSync('src/fathers/inserts.tsx', 'utf8');
a = a.replace(/export const InsertBG[\s\S]*?\n\};\n/, `export const InsertBG: React.FC<{tone?: 'cold' | 'warm' | 'dark' | 'paper'; children: React.ReactNode}> = ({tone = 'warm', children}) => {
  const glow = {cold: '#4aa8ff', warm: '#ffb25a', dark: '#4aa8ff', paper: '#ffb25a'}[tone];
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 45%, #1b2150 0%, #0a0d20 75%)', overflow: 'hidden'}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        {Array.from({length: 16}, (_, i) => <circle key={i} cx={(i * 263) % 1920} cy={(i * 191) % 1080} r={30 + (i % 4) * 22} fill={glow} opacity={0.06 + (i % 3) * 0.03} style={{filter: 'blur(14px)'}} />)}
        {children}
      </svg>
    </AbsoluteFill>
  );
};
`);
a = a.split('#e3ad84').join('#ffffff').split('#f1c9a6').join('#e8e4f6');
a = a.replace("const skin = warm ? '#d79a70' : '#e3ad84'", "const skin = '#ffffff'");
a = a.replace("const skin = warm ? '#d79a70' : '#ffffff'", "const skin = '#ffffff'");
fs.writeFileSync('src/fathers/inserts.tsx', a);
console.log('patched 6');
