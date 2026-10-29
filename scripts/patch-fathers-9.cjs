// Clearer story: a real audience (so Adam's empty seat means something), party guests, phones that ring on camera, both ends of every call, speakers on camera,
// bigger sharper wall photos, money and time motifs
const fs = require('fs');
const rd = (f) => fs.readFileSync(f, 'utf8'), wr = (f, s) => fs.writeFileSync(f, s);
const sub = (s, a, b, tag) => { if (!s.includes(a)) { console.log('MISSING', tag || String(a).slice(0, 70)); return s; } return s.replace(a, b); };

// ---------------- sets ----------------
let st = rd('src/fathers/sets.tsx');
// auditorium: a full house of spectators, one empty seat
const a0 = st.indexOf('export const AUD'), a1 = st.indexOf("// Adam's night office");
const a1b = st.lastIndexOf('// ----', a1);
const AUD_NEW = `export const AUD = {seatX: 1260, samX: 2160};
const SPEC_C = ['#e0455a', '#4a8bd8', '#47b57a', '#d2733c', '#8a56b8', '#2fa39a', '#e8b030', '#c94a7e'];
const ROW_Y = [600, 740, 880], ROW_S = [0.8, 0.92, 1.04];
const Spectator: React.FC<{x: number; y: number; i: number; t: number; sc: number; applause?: boolean}> = ({x, y, i, t, sc, applause}) => {
  const bob = Math.sin(t * 1.3 + i * 1.7) * 3, col = SPEC_C[i % SPEC_C.length], hair = ['#2b2634', '#4a2d1d', '#9a9aa8', '#8a5a36'][i % 4], up = applause ? Math.abs(Math.sin(t * 9 + i)) * 46 : 0;
  return (
    <g transform={\`translate(\${x} \${y + bob}) scale(\${sc})\`}>
      <rect x={-52} y={-90} width={104} height={100} rx={38} fill={col} stroke={INK} strokeWidth={3.4} />
      <path d="M -36,-72 q -9,24 -2,50" stroke="#fff" strokeWidth={6} opacity={0.25} strokeLinecap="round" fill="none" />
      <circle cx={0} cy={-136} r={48} fill="#f4f2fb" stroke={INK} strokeWidth={4} />
      <ellipse cx={-6} cy={-176} rx={34} ry={13} fill="#fff" stroke={hair} strokeWidth={4} />
      <ellipse cx={-17} cy={-136} rx={6} ry={9} fill={INK} /><ellipse cx={17} cy={-136} rx={6} ry={9} fill={INK} />
      <path d="M -14,-112 q 14,12 28,0" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
      {applause && [-1, 1].map((s) => <circle key={s} cx={s * 22} cy={-70 - up} r={15} fill="#fff" stroke={INK} strokeWidth={3} />)}
    </g>
  );
};
export const auditorium = (o: {t: number; curtain?: number; spot?: number; leoOn?: boolean; tag?: string; applause?: boolean}): SetOut => {
  const c = o.curtain ?? 1;
  return {
    far: (
      <g>
        <rect x={-400} y={-200} width={4000} height={1500} fill="#0d0f18" />
        <rect x={700} y={80} width={1800} height={460} fill="#232940" stroke={INK} strokeWidth={3.6} />
        <rect x={700} y={430} width={1800} height={110} fill="#5c432b" stroke={INK} strokeWidth={3} />
        <rect x={780} y={110} width={1640} height={320} fill="#22273c" />
        <path d="M 1600,80 L 1250,440 L 1950,440 Z" fill="#ffc610" opacity={0.28 * (o.spot ?? 1)} />
        <path d={\`M 700,60 L \${700 + 880 * (1 - c)},60 Q \${700 + 840 * (1 - c)},300 \${700 + 800 * (1 - c)},560 L 700,560 Z\`} fill="#651e1c" stroke={INK} strokeWidth={3} />
        <path d={\`M 2500,60 L \${2500 - 880 * (1 - c)},60 Q \${2500 - 840 * (1 - c)},300 \${2500 - 800 * (1 - c)},560 L 2500,560 Z\`} fill="#651e1c" stroke={INK} strokeWidth={3} />
        <rect x={700} y={50} width={1800} height={46} fill="#4c1413" stroke={INK} strokeWidth={3} />
      </g>
    ),
    mid: (
      <g>
        {[0, 1, 2].map((r) => (
          <g key={r}>
            {Array.from({length: 9}, (_, i) => {
              const x = 360 + i * 300, sc = ROW_S[r], y = ROW_Y[r], empty = r === 2 && (Math.abs(x - AUD.seatX) < 5 || Math.abs(x - AUD.samX) < 5);
              return (
                <g key={i}>
                  <rect x={x - 112 * sc} y={y - 190 * sc} width={224 * sc} height={200 * sc} rx={24} fill={['#4c1a22', '#531f26', '#5a2430'][r]} stroke={INK} strokeWidth={3} />
                  {!empty && <Spectator x={x} y={y} i={i + r * 3} t={o.t} sc={sc} applause={o.applause} />}
                  <rect x={x - 104 * sc} y={y - 28 * sc} width={208 * sc} height={44 * sc} rx={16} fill={['#6a2a34', '#732f3a', '#7e3642'][r]} stroke={INK} strokeWidth={3} />
                </g>
              );
            })}
          </g>
        ))}
      </g>
    ),
    front: (
      <g>
        {/* Adam's seat in the front row: the only empty one, with the costume tag taped on */}
        <g transform={\`translate(\${AUD.seatX} 0)\`}>
          <g transform="translate(-20 760) rotate(-6)"><path d="M 0,-24 L 0,0" stroke={INK} strokeWidth={2.4} /><rect x={-120} y={0} width={240} height={78} rx={8} fill="#f0dcae" stroke={INK} strokeWidth={3} /><circle cx={-100} cy={14} r={6} fill="#cfc4aa" stroke={INK} strokeWidth={2} /><text x={0} y={50} textAnchor="middle" fontFamily={HAND} fontWeight={600} fontSize={36} fill="#7a3a2a">{o.tag ?? 'BEST COSTUME'}</text></g>
        </g>
      </g>
    ),
    rim: 'rgba(255,230,170,.75)',
  };
};

`;
st = st.slice(0, a0) + AUD_NEW + st.slice(a1b);
// photo wall: bigger and in the mid layer (sharper)
st = sub(st, "        <PhotoWall x={1000} y={330} n={w ? o.photoN ?? 12 : 0} kite s={0.72} glow={w ? 1 : 0} />\n", '', 'wall far');
st = sub(st, "        {/* sofa */}", "        <PhotoWall x={1000} y={340} n={w ? o.photoN ?? 12 : 0} kite s={0.95} glow={w ? 1 : 0} />\n        {/* sofa */}", 'wall mid');
// the phone on the side table: bigger, with a vibrating ring when it rings
st = st.replace(/          <rect x=\{-70\} y=\{626\} width=\{86\} height=\{14\}[^\n]*\n          \{\(o\.phoneLit \?\? 0\) > 0 && <ellipse[^\n]*\n/, `          <g transform={\`translate(\${-26 + ((o.phoneLit ?? 0) > 0 ? Math.sin(o.t * 60) * 3 : 0)} 626)\`}><rect x={-62} y={-8} width={124} height={22} rx={7} fill={(o.phoneLit ?? 0) > 0 ? '#2a9bff' : '#0e1019'} stroke={INK} strokeWidth={2.2} /><rect x={-54} y={-4} width={108} height={12} rx={4} fill={(o.phoneLit ?? 0) > 0 ? '#bfe0ff' : '#1b1f33'} />
            {(o.phoneLit ?? 0) > 0 && [0, 1, 2].map((k) => <path key={k} d={\`M \${-86 - k * 22},\${-10 - k * 10} q -14,16 0,32 M \${86 + k * 22},\${-10 - k * 10} q 14,16 0,32\`} fill="none" stroke="#bfe0ff" strokeWidth={4} strokeLinecap="round" opacity={0.7 - k * 0.2} />)}
          </g>
`);
wr('src/fathers/sets.tsx', st);

// ---------------- photos: glass-head people, bolder ----------------
let pr = rd('src/fathers/props.tsx');
pr = pr.replace(/  const person = \(cx: number, by: number, sc: number, col: string, skin = '#[0-9a-f]{6}'\) => \(\n[^\n]*\n  \);/, `  const person = (cx: number, by: number, sc: number, col: string) => (
    <g transform={\`translate(\${cx} \${by}) scale(\${sc * 1.15})\`}><rect x={-15} y={-48} width={30} height={48} rx={11} fill={col} stroke={INK} strokeWidth={2.4} /><circle cx={0} cy={-68} r={20} fill="#f4f2fb" stroke={INK} strokeWidth={2.4} /><circle cx={-6.5} cy={-70} r={2.8} fill={INK} /><circle cx={6.5} cy={-70} r={2.8} fill={INK} /><path d="M -6,-61 q 6,5 12,0" fill="none" stroke={INK} strokeWidth={2.2} strokeLinecap="round" /></g>
  );`);
wr('src/fathers/props.tsx', pr);

// ---------------- kit: less blur everywhere ----------------
let kt = rd('src/fathers/kit.tsx');
kt = sub(kt, "const mk = (set: SetOut, cam: Cam, chars: React.ReactNode, blurK = 1, extra?: React.ReactNode) => (", "const mk = (set: SetOut, cam: Cam, chars: React.ReactNode, blurK = 0.5, extra?: React.ReactNode) => (", 'mk');
kt = kt.replace(/chars: React\.ReactNode, blurK = 1\) => mk\(livingRoom/, 'chars: React.ReactNode, blurK = 0.5) => mk(livingRoom');
wr('src/fathers/kit.tsx', kt);

// ---------------- fx: money and time rain ----------------
let fx = rd('src/fathers/fx.tsx');
fx += `
// ---------------- MONEY. / TIME.: banknotes and coins fall, or clocks and hearts rise, behind the key word ----------------
export const Rain: React.FC<{t: number; from: number; to: number; kind: 'money' | 'time'}> = ({t, from, to, kind}) => {
  const o = Math.min(ramp(t, from, from + 0.3), 1 - ramp(t, to - 0.4, to));
  if (o <= 0) return null;
  const l = t - from;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity: o}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080">
        {Array.from({length: 26}, (_, i) => {
          const x = rnd(i, 1) * 1920, sp = 160 + rnd(i, 2) * 220, y0 = rnd(i, 3) * 1300, rot = rnd(i, 4) * 360 + l * (60 + rnd(i, 5) * 120) * (i % 2 ? 1 : -1), sc = 0.7 + rnd(i, 6) * 0.9;
          const y = kind === 'money' ? ((y0 + l * sp) % 1300) - 120 : 1200 - ((y0 + l * sp) % 1300);
          return (
            <g key={i} transform={\`translate(\${x} \${y}) rotate(\${rot}) scale(\${sc})\`} opacity={0.9}>
              {kind === 'money'
                ? (i % 3 === 0
                  ? <g><circle r={26} fill="#f5c542" stroke="#1d1a2e" strokeWidth={4} /><circle r={17} fill="none" stroke="#c99a1d" strokeWidth={3} /><text y={9} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={26} fill="#a87a10">$</text></g>
                  : <g><rect x={-44} y={-24} width={88} height={48} rx={6} fill="#4fb36e" stroke="#1d1a2e" strokeWidth={4} /><circle r={14} fill="#d9f2e0" stroke="#1d1a2e" strokeWidth={2.4} /><text y={7} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={20} fill="#1d1a2e">$</text></g>)
                : (i % 3 === 0
                  ? <g><path d="M 0,18 C -40,-6 -30,-34 0,-16 C 30,-34 40,-6 0,18 Z" fill="#ff6a8a" stroke="#1d1a2e" strokeWidth={4} strokeLinejoin="round" /></g>
                  : <g><circle r={28} fill="#fbf1d2" stroke="#1d1a2e" strokeWidth={4} /><path d="M 0,-16 L 0,0 L 12,8" fill="none" stroke="#1d1a2e" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" /></g>)}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
`;
wr('src/fathers/fx.tsx', fx);

// ---------------- main: rain windows, ring sounds ----------------
let fa = rd('src/fathers/Fathers.tsx');
fa = sub(fa, "import {ramp, bell, GRAIN, AgeTag, Counter, RewindCard} from './fx';", "import {ramp, bell, GRAIN, AgeTag, Counter, RewindCard, Rain} from './fx';");
fa = sub(fa, "      <KineticWord t={t} words={WORDS} />", "      <Rain t={t} from={7.9} to={9.8} kind=\"money\" /><Rain t={t} from={12.7} to={14.5} kind=\"time\" /><Rain t={t} from={37.6} to={39.3} kind=\"money\" /><Rain t={t} from={51.5} to={53.4} kind=\"time\" />\n      <KineticWord t={t} words={WORDS} />");
fa = sub(fa, "n4('phone_ring_far', 17.0, 0.5)", "n4('phone_ring_close', 16.9, 0.6, {dur: 1.0})");
fa = sub(fa, "n4('phone_ring_close', 158.5, 0.5, {dur: 2.7}), n4('phone_ring_far', 161.0, 0.3, {dur: 0.6}),", "n4('phone_ring_far', 158.5, 0.35, {dur: 1.4}), n4('phone_ring_close', 160.0, 0.55, {dur: 1.4}),");
wr('src/fathers/Fathers.tsx', fa);

// ---------------- shots ----------------
let sh = rd('src/fathers/shots.tsx');
// 1. cold open: the silent phone, the window, Sam's phone ringing, Sam answering on camera
const c0 = sh.indexOf('  [14.4, undefined, (c) => {'), c1 = sh.indexOf('  [18.5, undefined, () => null]');
sh = sh.slice(0, c0) + `  [14.4, undefined, (c) => <PhoneDark t={c.l} light={0} />],
  [15.5, undefined, (c) => SC.liv(c, [Z(1750, 450, 1.5), Z(2430, 360, 1.85)], {clockMin: 60, samAnswer: c.l > 0.9 ? 1 : 0}, adamAt(c, 65, {face: {...F.sad, gaze: [0.8, 0]}}), 0.3)],
  [16.9, undefined, (c) => <CallScreen t={c.l} name="Max" initial="M" color="#4c9a63" mode="incoming" shake={0.4 + 0.35 * Math.abs(Math.sin(c.l * 28))} />],
  [17.8, undefined, (c) => SC.liv(c, faceCam(sit('sam', 65, LR.chairX, 0.66), 2.4, 20), {warm: true}, samAt(c, 65, {pose: 'ear', face: {smile: ramp(c.l, 0.2, 0.6), open: 0.2}, children: <Handset glow={0.4} />}), 0.3)],
` + sh.slice(c1);
// 2. Leo says "No." on camera
sh = sub(sh, "  [118.4, undefined, (c) => SC.door(c, [Z(1700, 640, 1.8), Z(1700, 640, 2.0)], {boxes: 4, glow: 1.3})],", "  [118.4, undefined, (c) => SC.room(c, faceCam(sit('leo', 15, 1360, 0.8, {pose: 'phone'}), 2.3, 20), Pe(c, sit('leo', 15, 1360, 0.8, {pose: 'phone', turn: 0.2, face: {...F.talk(c.t), tilt: 6, gaze: [0, 0.3]}})))],");
// 3. Max calls Sam, both on camera
const s0 = sh.indexOf('  [158.5, undefined, (c) => <SundayFlip'), s1 = sh.indexOf('  // ---- Adam retires');
sh = sh.slice(0, s0) + `  [158.5, undefined, (c) => SC.flat(c, faceCam(stand('max', 30, 1500, 0.85), 2.2, 20), Pe(c, stand('max', 30, 1500, 0.85, {pose: 'ear', turn: 0.3, face: {smile: 0.5, brow: 0.2, gaze: [0.3, 0]}, children: <Handset glow={0.3} />})))],
  [160.0, undefined, (c) => <SundayFlip t={c.l} who="sam" week={0} />],
  [161.4, undefined, (c) => SC.liv(c, [Z(1800, 480, 1.4), Z(1850, 460, 1.7)], {warm: true}, samAt(c, 60, {pose: 'ear', face: {smile: 0.6, open: 0.15}, children: <Handset glow={0.4} />}), 0.3)],
  [163.4, undefined, (c) => SC.liv(c, faceCam(sit('sam', 60, LR.chairX, 0.66), 2.5, 20), {warm: true}, samAt(c, 60, {pose: 'ear', face: {smile: 1, open: 0.7 * Math.abs(Math.sin(c.t * 7)), brow: 0.3}, children: <Handset glow={0.4} />}), 0.3)],
` + sh.slice(s1);
// 4. Leo on camera for the call
sh = sub(sh, "  [201.6, undefined, (c) => SC.flat(c, [Z(1600, 600, 1.2), Z(1600, 600, 1.5)])],", "  [201.6, undefined, (c) => SC.flat(c, faceCam(stand('leo', 30, 1500, 0.85), 2.2, 20), Pe(c, stand('leo', 30, 1500, 0.85, {pose: 'ear', turn: 0.3, face: {...F.soft, lids: 0.25, gaze: [0.2, 0.3]}, children: <Handset glow={0.3} />})))],");
const d0 = sh.indexOf('  [205.0, undefined,'), d1 = sh.indexOf('  // ---- Your children');
sh = sh.slice(0, d0) + `  [205.0, undefined, (c) => SC.flat(c, [faceCam(stand('leo', 30, 1500, 0.85), 2.2, 20), faceCam(stand('leo', 30, 1500, 0.85), 2.6, 20)], Pe(c, stand('leo', 30, 1500, 0.85, {pose: 'ear', turn: 0.3, face: {...F.talk(c.t), smile: 0.5, brow: 0.3}, children: <Handset glow={0.3} />})))],
  [207.0, undefined, (c) => SC.liv(c, [faceCam(sit('adam', 65, LR.chairX, 0.66), 2.6, 20), faceCam(sit('adam', 65, LR.chairX, 0.66), 2.3, 20)], {giftN: 8, dust: 0.9}, adamAt(c, 65, {pose: 'ear', turn: 0.15, face: {smile: ramp(c.l, 0.1, 0.8), lids: 0.3 * ramp(c.l, 0.8, 1.4), brow: 0.3, tilt: 8}, children: <Handset />}), 0.3)],
` + sh.slice(d1);
// 5. party guests so the reserved chair is the only empty one
sh = sub(sh, "const tint = ", "const partyGuests = (c: Ctx) => (\n  <>{Pe(c, sit('aunt', 40, 2000, 0.7, {face: F.smile, turn: -0.3, top: '#d9a030'}))}{Pe(c, sit('max', 38, 2200, 0.7, {face: F.grin, turn: -0.3, top: '#e0455a'}))}{Pe(c, stand('max', 5, 1100, 0.7, {face: F.grin, turn: 0.3, top: '#e0455a'}))}{Pe(c, stand('leo', 5, 1300, 0.7, {face: F.smile, turn: 0.3, top: '#e8b030'}))}</>\n);\nconst tint = ", 'tint');
sh = sub(sh, "{}, <>{Pe(c, stand('leo', 5, 1500, 0.8, {face: F.grin, turn: 0.3}))}{Pe(c, stand('max', 5, 1250, 0.8, {face: F.smile, turn: 0.3}))}</>)],", "{}, <>{partyGuests(c)}{Pe(c, stand('leo', 5, 1500, 0.8, {face: F.grin, turn: 0.3}))}{Pe(c, stand('max', 5, 1250, 0.8, {face: F.smile, turn: 0.3}))}</>)],", 'party1');
sh = sub(sh, "{}, <>{Pe(c, stand('aunt', 40, 1700, 0.8, {pose: 'film', turn: -0.4, face: F.smile}))}{Pe(c, stand('leo', 5, 1450, 0.8, {face: F.grin, turn: 0.3}))}</>)],", "{}, <>{partyGuests(c)}{Pe(c, stand('aunt', 40, 1700, 0.8, {pose: 'film', turn: -0.4, face: F.smile, top: '#2fa39a'}))}{Pe(c, stand('leo', 5, 1450, 0.8, {face: F.grin, turn: 0.3}))}</>)],", 'party2');
// 6. auditorium: Sam sits in the grid seat, applause, seat cams
sh = sh.split("sit('sam', 45, 2180,").join("sit('sam', 45, 2160,");
sh = sub(sh, "SC.aud(c, [Z(2180, 560, 1.7), Z(2180, 540, 2.0)], {}", "SC.aud(c, [Z(2160, 600, 1.5), Z(2160, 580, 1.8)], {}", 'aud film');
sh = sub(sh, "SC.aud(c, [Z(2180, 560, 1.9), Z(2180, 540, 2.3)], {}", "SC.aud(c, [Z(2160, 600, 1.7), Z(2160, 580, 2.0)], {applause: true}", 'aud clap');
sh = sub(sh, "SC.aud(c, [Z(1180, 900, 1.6), Z(1500, 420, 1.05)], {tag: 'BEST COSTUME'})", "SC.aud(c, [Z(1260, 800, 1.5), Z(1500, 520, 1.0)], {tag: 'BEST COSTUME'})", 'aud crane');
sh = sub(sh, "SC.aud(c, [Z(1180, 880, 2.4), Z(1180, 860, 2.8)], {tag: 'BEST COSTUME'})", "SC.aud(c, [Z(1260, 780, 2.0), Z(1260, 760, 2.4)], {tag: 'BEST COSTUME'})", 'aud seat');
sh = sub(sh, "faceCam(stand('max', 10, 1600, 0.95), 2.6, 40), {}, Pe(c, stand('max', 10, 1600, 0.95,", "faceCam(stand('max', 10, 1600, 0.95), 2.6, 40), {applause: true}, Pe(c, stand('max', 10, 1600, 0.95,", 'aud max');
// 7. wall photo cams for the bigger wall
sh = sub(sh, "[Z(1000, 380, 1.25), Z(1000, 330, 1.05)], {warm: true, photoN: 12}, null, 0.4)", "[Z(1000, 400, 1.2), Z(1000, 350, 1.0)], {warm: true, photoN: 12}, null, 0.1)", 'wall1');
sh = sub(sh, "[Z(1000, 330, 2.4), Z(1000, 330, 3.2)], {warm: true, photoN: 12}, null, 0.3)", "[Z(1000, 340, 1.7), Z(1000, 340, 2.6)], {warm: true, photoN: 12}, null, 0.1)", 'wall2');
sh = sub(sh, "[Z(1000, 340, 3.2), Z(1000, 330, 2.0)], {warm: true, photoN: 1}, null, 0.3)", "[Z(1000, 340, 2.8), Z(1000, 340, 1.7)], {warm: true, photoN: 1}, null, 0.1)", 'wall3');
wr('src/fathers/shots.tsx', sh);
console.log('patched 9');
