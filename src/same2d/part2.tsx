import React from 'react';
import {AbsoluteFill} from 'remotion';
import {INK, V, Face, Look} from './Char';
import {SideChar, BookSide} from './SideChar';
import {Stage, Cam} from './Stage';
import {kitchen} from './sets';
import {office, restaurant, mgrRoom} from './sets2';
import {PhoneFeed, PageInsert, PhoneBook, CalendarBlur, BookOpenInsert, ClockInsert, TeaPour, LockScreen} from './inserts';
import {BillInsert, RewardInsert, SearchPhone, ChatPhone, FeedPhoto, PhoneFaceDown, NodeNetwork, PhotoStrip, IconGrid, EndCard} from './inserts2';
import {KW, ramp, IconTag, WhoTag, BigCounter, Bubble} from './fx';
import {MONT} from './theme';
import type {Cue3} from './sound';
import type {Ctx, C3, R, Bed, SP, RP} from './Same2D';
import {srcToVideo} from '../same/lib/timeline';

// ============================================================================================
// PART 2 of the cut: 1:55 to the end (M1 days blur, S05 Day 21, S06 It spreads, S07 Day 90, S07b Month six, M2 seasons, S08 Low point, S09 The result,
// S10 Day 365, M3 one night at a time, S11 The turn, S12 End, end card). Same rules as part 1: a shot on every phrase, a cutaway in every pause,
// each place its own set, no split screen (the two lives cross-cut on their own full screens).
// ============================================================================================
const S = (src: number) => srcToVideo(src) ?? 0;
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const mixHex = (a: string, b: string, k: number) => {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16), f = (s: number) => Math.round(lerp((pa >> s) & 255, (pb >> s) & 255, k));
  return '#' + [16, 8, 0].map((s) => f(s).toString(16).padStart(2, '0')).join('');
};
type Fx = 'w' | 'f' | 'b';
type Item = [number, Fx?, R?];
type SetL = {far: React.ReactNode; mid: React.ReactNode; front: React.ReactNode; fg: React.ReactNode};

export type Api = {
  B: (a: C3, b: C3, f?: (c: Ctx) => Omit<Bed, 'cam'>, pull?: boolean) => R;
  bedScene: (c: Ctx, o: Bed) => React.ReactNode;
  sP: (o?: SP) => SP; rB: (o?: RP) => RP;
  WIDE: [C3, C3]; camS: (a: number, b: number, cy?: number) => [C3, C3]; camR: (a: number, b: number, cy?: number) => [C3, C3];
  sFace: (a: number, b: number) => [C3, C3]; rFace: (a: number, b: number) => [C3, C3]; K: Record<string, [C3, C3]>;
  camOf: (c: Ctx, a: C3, b: C3) => Cam; kit: () => R; bath: () => R;
};

// ---------------- the cast ----------------
const LOOK: Partial<Record<Look, {tee: string; tie?: boolean}>> = {man: {tee: '#9a7be4'}, mom: {tee: '#e58a8a'}, manager: {tee: '#f2f2f7', tie: true}, colleague: {tee: '#5fa8a0'}, friend: {tee: '#e6b34a'}};
type PersonP = {k: Look; x: number; y: number; flip?: boolean; pose?: 'sit' | 'stand'; hn?: V; hf?: V; face?: Face; torso?: number; pitch?: number; talk?: number; t: number; seed?: number; tee?: string; turn?: number; children?: React.ReactNode; dim?: number};
const Person: React.FC<PersonP> = (p) => {
  const sit = (p.pose ?? 'sit') === 'sit', talk = p.talk ?? 0, sd = p.seed ?? 0;
  const g = Math.sin(p.t * 3.1 + sd) * 30 * talk, g2 = Math.sin(p.t * 2.3 + 1) * 24 * talk;
  const baseN: V = sit ? [150, -44] : [34, 30], baseF: V = sit ? [200, -44] : [70, 42];
  const hn: V = p.hn ?? (talk ? [baseN[0] + g, baseN[1] - 120 * talk + g2] : baseN);
  const face: Face = {smile: 0.1, lids: 0.1, ...p.face, open: (p.face?.open ?? 0) + talk * 0.32 * Math.abs(Math.sin(p.t * 13 + sd))};
  return (
    <SideChar x={p.x} y={p.y} flip={p.flip} dim={p.dim} torso={p.torso ?? (sit ? -4 : -2)} headPitch={p.pitch ?? 6} turn={p.turn ?? 0.85} face={face}
      handN={hn} handF={p.hf ?? baseF} footN={sit ? [230, 170] : [40, 385]} footF={sit ? [300, 172] : [100, 385]} look={p.k} tie={LOOK[p.k]!.tie} tee={p.tee ?? LOOK[p.k]!.tee} t={p.t} seed={sd}>
      {p.children}
    </SideChar>
  );
};
// the scroller reading a book, propped on the pillows (the turn, S11)
const ScBook: React.FC<{t: number; smile?: number}> = ({t, smile = 0.2}) => (
  <SideChar x={2560} y={630} flip torso={-38} headPitch={48} turn={0.9} face={{gaze: [0.2 + Math.sin(t * 1.5) * 0.3, 0.85], lids: 0.1, smile, brow: 0.1}} handN={[50, -250]} handF={[-34, -118]} footN={[380, -30]} footF={[392, -40]} legUp t={t} seed={0.3}>
    <BookSide x={52} y={-296} deg={-24} />
  </SideChar>
);

export const buildPart2 = (api: Api): Item[] => {
  const {B, bedScene, sP, rB, WIDE, camS, camR, sFace, rFace, K, camOf, kit, bath} = api;
  const mk = (setFn: (t: number) => SetL, rim: string, filter?: string, extraFront?: React.ReactNode) =>
    (a: C3, b: C3, actors: (c: Ctx) => React.ReactNode, pull = false): R => (c) => {
      const set = setFn(c.t);
      return (
        <div style={{position: 'absolute', inset: 0, filter}}>
          <Stage cam={camOf(c, a, b)} far={set.far} mid={set.mid} chars={actors(c)} front={<g>{set.front}{extraFront}</g>} fg={set.fg} rim={rim} blurK={1 + (pull ? 1.4 * (1 - ramp(c.l, 0, 0.45)) : 0)} />
        </div>
      );
    };

  // ---- kitchen in the evening (S05) ----
  const kTable = (
    <g>
      <rect x={1330} y={700} width={330} height={44} rx={16} fill="#8b6f4a" stroke={INK} strokeWidth={6} /><rect x={1330} y={430} width={70} height={300} rx={22} fill="#8b6f4a" stroke={INK} strokeWidth={6} />
      <rect x={1560} y={640} width={1100} height={30} rx={10} fill="#b98a58" stroke={INK} strokeWidth={6} /><rect x={2560} y={670} width={40} height={170} fill="#8b6f4a" stroke={INK} strokeWidth={6} /><rect x={1600} y={670} width={40} height={170} fill="#8b6f4a" stroke={INK} strokeWidth={6} />
      <ellipse cx={1880} cy={634} rx={100} ry={22} fill="#fff" stroke={INK} strokeWidth={6} /><ellipse cx={1880} cy={630} rx={80} ry={12} fill="#b8864a" />
      <ellipse cx={2300} cy={634} rx={90} ry={20} fill="#fff" stroke={INK} strokeWidth={6} /><ellipse cx={2300} cy={630} rx={70} ry={11} fill="#b8864a" />
    </g>
  );
  const KE = mk(() => kitchen(), 'rgba(255,200,130,.9)', 'brightness(.66) saturate(.85)', kTable);
  const kitE = (a: C3, b: C3, o: {mom?: number; momTalk?: number; sc?: SP; momFace?: Face; scTalk?: number; scFace?: Face; phone?: boolean; snap?: boolean} = {}) =>
    KE(a, b, (c) => (
      <g>
        <Person k="mom" x={o.mom ?? 960} y={425} pose="stand" talk={o.momTalk ?? 0} face={o.momFace ?? {smile: 0.15, lids: 0.1}} t={c.t} seed={5} />
        <Person k="man" x={1500} y={690} torso={o.snap ? 8 : 12} pitch={22} talk={o.scTalk ?? 0} hn={o.phone === false ? undefined : [190, -170]} hf={[250, -48]} face={{lids: 0.55, smile: 0, brow: -0.3, browTilt: 8, ...o.scFace}} tee="#7d6f99" t={c.t} seed={3}>
          {o.phone !== false && <g transform="translate(212 -214) rotate(-18)"><rect x={-17} y={-62} width={34} height={124} rx={12} fill="#15161f" stroke={INK} strokeWidth={6.5} /><rect x={-14} y={-54} width={6} height={108} rx={3} fill="#4aa8ff" /><path d="M 0,-20 L -190,-80 L -190,70 Z" fill="#6bb8ff" opacity={0.16} style={{mixBlendMode: 'screen'}} /></g>}
        </Person>
      </g>
    ));
  const kitWide: [C3, C3] = [[1550, 430, 0.78], [1570, 430, 0.86]];

  // ---- office (S06) ----
  const OF = mk(() => office(), 'rgba(255,240,210,.9)');
  const offW: [C3, C3] = [[1700, 470, 0.62], [1700, 470, 0.7]];
  const meet = (a: C3, b: C3, o: {rd?: Face; co?: Face; rdTalk?: number; coTalk?: number; rdT?: number} = {}) =>
    OF(a, b, (c) => (
      <g>
        <Person k="colleague" x={2230} y={690} flip talk={o.coTalk ?? 0} face={{smile: 0, brow: 0.3, ...o.co}} hn={[190, -44]} hf={[240, -44]} t={c.t} seed={8} />
        <Person k="man" x={1250} y={690} talk={o.rdTalk ?? 0} pitch={4} face={{smile: 0.2, lids: 0.1, ...o.rd}} hn={[190, -44]} hf={[240, -44]} t={c.t} seed={0.7} />
      </g>
    ));

  // ---- restaurant (S07b) ----
  const RS = mk((t) => restaurant(t), 'rgba(255,190,120,.9)');
  const resW: [C3, C3] = [[1700, 470, 0.62], [1700, 470, 0.7]];
  const dine = (a: C3, b: C3, o: {rd?: Face; fr?: Face; rdTalk?: number; frTalk?: number; glass?: boolean} = {}) =>
    RS(a, b, (c) => (
      <g>
        <Person k="friend" x={2150} y={690} flip talk={o.frTalk ?? 0} face={{smile: 0.55, ...o.fr}} hn={o.glass ? [250 + Math.sin(c.t * 4) * 6, -250] : [150, -44]} hf={[200, -44]} t={c.t} seed={9} />
        <Person k="man" x={1230} y={690} talk={o.rdTalk ?? 0} pitch={4} face={{smile: 0.5, lids: 0.08, ...o.rd}} hn={[150, -44]} hf={[200, -44]} t={c.t} seed={0.7} />
      </g>
    ));

  // ---- the manager's glass room (S09) ----
  const MG = mk(() => mgrRoom(), 'rgba(255,245,220,.9)');
  const mgW: [C3, C3] = [[1700, 330, 0.7], [1700, 330, 0.78]];
  const mgr = (a: C3, b: C3, o: {shake?: number; mf?: Face; rf?: Face; mTalk?: number; wave?: boolean; rdX?: number; seat?: boolean} = {}) =>
    MG(a, b, (c) => {
      const sh = o.shake ?? 0, hp: V = [lerp(120, 205, sh), lerp(-70, 30, sh)];
      return (
        <g>
          {o.seat
            ? <Person k="manager" x={2700} y={690} flip pitch={8} hn={o.wave ? [150, -330 + Math.sin(c.t * 9) * 40] : [150, -48]} hf={[200, -44]} face={{smile: 0.3, ...o.mf}} t={c.t} seed={11} />
            : <Person k="manager" x={1950} y={425} pose="stand" flip talk={o.mTalk ?? 0} hn={sh > 0 ? hp : undefined} face={{smile: 0.4, ...o.mf}} t={c.t} seed={11} />}
          {!o.seat && <Person k="man" x={o.rdX ?? 1450} y={425} pose="stand" hn={sh > 0 ? hp : undefined} face={{smile: 0.2, lids: 0.1, ...o.rf}} t={c.t} seed={0.7} />}
        </g>
      );
    });

  // ---- the memory bubble: the other life, shown inside a rounded window ----
  const pip = (c: Ctx, o: Bed) => (
    <div style={{position: 'absolute', right: 150, top: 120, width: 700, height: 394, borderRadius: 40, overflow: 'hidden', border: '8px solid #fff', boxShadow: '0 20px 60px rgba(0,0,0,.5)', opacity: ramp(c.l, 0.1, 0.5)}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080, transform: 'scale(0.3646)', transformOrigin: '0 0'}}>{bedScene(c, o)}</div>
    </div>
  );

  // ---- montage makers ----
  const montage = (from: number, to: number, curve: (u: number) => number, make: (i: number, u: number) => R, whipEvery = 0): Item[] => {
    const out: Item[] = []; let t = from, i = 0;
    while (t < to - 0.05) {
      const u = (t - from) / (to - from);
      out.push([t, whipEvery && i > 0 && i % whipEvery === 0 ? 'w' : undefined, make(i, u)]);
      t += Math.max(0.09, curve(u)); i++;
    }
    return out;
  };

  const L: Item[] = [];
  // ======================= M1: THE DAYS BLUR (1:55 - 2:40), the same days cut faster and faster =======================
  L.push(...montage(115.3, 160.3, (u) => lerp(1.15, 0.3, Math.pow(u, 0.8)), (i, u) => {
    const pages = 50 + 150 * u;
    if (i % 2 === 0) {
      const v = (i / 2) % 5;
      if (v === 1) return kit();
      if (v === 3) return bath();
      if (v === 0) return B(...camS(1.2, 1.3), () => ({s: sP({lids: 0.4 + 0.2 * u, glow: 1.3}), r: null, clutter: u * 0.6}));
      if (v === 2) return B(K.HANDS_S[0], K.HANDS_S[1], () => ({s: sP({glow: 1.3}), r: null, clutter: u * 0.6}), true);
      return B(...sFace(2.2, 2.4), () => ({s: sP({lids: 0.5, glow: 1.3, smile: 0}), r: null}));
    }
    const v = ((i - 1) / 2) % 5;
    const bk = Math.round(pages / 25);
    if (v === 0) return B(...camR(1.2, 1.3), () => ({r: rB({smile: 0.3}), s: null, books: bk, notes: Math.round(u * 4)}));
    if (v === 1) return (c: Ctx) => <TeaPour t={c.l + 0.5} />;
    if (v === 2) return (c: Ctx) => <BookOpenInsert t={c.l + 2} openAt={0} flips={[2.1]} />;
    if (v === 3) return B(...rFace(1.9, 2.1), () => ({r: rB({smile: 0.4, lids: 0.1}), s: null, books: bk}));
    return B(K.LAMP[0], K.LAMP[1], () => ({s: sP(), r: rB(), books: bk}), true);
  }, 5));

  // ======================= S05 DAY 21 (2:40 - 3:20) =======================
  L.push(
    [160.3, , kitE(kitWide[0], kitWide[1], {mom: 900, phone: true})],
    [162.3, , kitE([1530, 270, 1.5], [1530, 266, 1.7], {scFace: {lids: 0.7, smile: 0}})],
    [164.5, , B(...sFace(2.2, 2.4), () => ({s: sP({lids: 0.65, smile: 0, brow: -0.4, browTilt: 10, glow: 1}), r: null}))],
    [166.2, , kitE([1560, 400, 1.2], [1560, 396, 1.3], {scFace: {lids: 0.8, smile: 0}, momFace: {smile: 0}})],
    [168.9, 'w', kitE([1530, 270, 1.8], [1530, 266, 1.95], {scFace: {lids: 0.3, brow: -0.6, browTilt: -14, smile: 0}})],
    [170.2, , kitE([1030, 100, 1.5], [1050, 96, 1.65], {mom: 960, momTalk: 1, momFace: {smile: 0, brow: 0.3, browTilt: 8}})],
    [172.2, , kitE([1530, 270, 1.7], [1530, 266, 1.85], {snap: true, scTalk: 1, scFace: {lids: 0.1, brow: -0.7, browTilt: -16, smile: 0}})],
    [174.2, , kitE(kitWide[0], kitWide[1], {mom: 700, momFace: {smile: 0, lids: 0.3}, scFace: {lids: 0.5}})],
    [175.9, , kitE([760, 120, 1.7], [740, 116, 1.8], {mom: 700, momFace: {smile: 0, lids: 0.4, browTilt: 14, brow: 0.4}})],
    [177.1, , B(...sFace(2.0, 2.2), () => ({s: sP({lids: 0.55, smile: 0, glow: 1}), r: null}))],
    [178.9, , B(K.HANDS_S[0], K.HANDS_S[1], () => ({s: sP({raise: 1, glow: 1.2}), r: null}), true)],
    [180.7, , (c: Ctx) => <PhoneFeed t={c.l} speed={1.3} />],
    [182.4, , B(...sFace(2.4, 2.6), () => ({s: sP({lids: 0.7, smile: 0, glow: 1.2}), r: null}))],
    [184.2, 'w', (c: Ctx) => <BillInsert t={c.l} from={1} to={4} printAt={0.1} per={0.3} />],
    [185.2, , B(...camR(1.2, 1.3), () => ({r: rB({smile: 0.2}), s: null}))],
    [186.3, , B(...camR(1.5, 1.65), () => ({r: rB({smile: 0.3}), s: null, books: 2}))],
    [188.3, , B(...rFace(2.0, 2.2), (c) => ({r: rB({brow: 0.9, lids: 0, smile: 0.2, gaze: [0.4, 0 + c.l * 0.1]}), s: null}))],
    [190.3, , (c: Ctx) => <BookOpenInsert t={c.l + 2} openAt={0} flips={[2.15, 2.75, 3.35, 3.95]} />],
    [193.1, , (c: Ctx) => <RewardInsert t={c.l} from={1} to={3} printAt={0.3} per={1.0} />],
    [195.4, , B(...rFace(1.9, 2.1), (c) => ({r: rB({lids: 0.25 + c.l * 0.3, smile: 0.3}), s: null}))],
    [197.3, , B(K.LAMP[0], K.LAMP[1], (c) => ({s: null, r: rB(), glowR: Math.max(0.2, 1 - c.l)}), true)],
    [198.5, , B(...camR(1.3, 1.4), () => ({r: rB({mode: 'rest', lids: 0.9, smile: 0.2}), s: null, glowR: 0.2}))],
  );

  // ======================= S06 IT SPREADS (3:20 - 3:41) =======================
  L.push(
    [199.7, , meet(offW[0], offW[1])],
    [201.7, , meet([1330, 430, 1.4], [1330, 424, 1.5], {rd: {smile: 0.25}})],
    [203.7, , meet([1330, 430, 1.55], [1330, 424, 1.65], {rdTalk: 1, rd: {smile: 0.2}})],
    [205.8, 'w', meet([2150, 430, 1.4], [2150, 424, 1.5], {co: {brow: 0.2, smile: 0}})],
    [207.0, , meet([1330, 430, 1.7], [1330, 424, 1.8], {rd: {lids: 0.3, smile: 0.1, gaze: [0.2, 0.3]}})],
    [209.9, , meet([2150, 430, 1.6], [2150, 424, 1.7], {coTalk: 1, co: {brow: 0.8, browTilt: 6, smile: 0.1}})],
    [211.9, , meet([1330, 430, 1.6], [1330, 424, 1.7], {rdTalk: 1, rd: {smile: 0.45}})],
    [213.9, 'w', B(...camS(1.0, 1.1), () => ({day: true, s: null, r: rB({mode: 'rest', lids: 0.3, smile: 0.4}), bloom: 0.3, books: 3}))],
    [215.4, , (c: Ctx) => <RewardInsert t={c.l} from={3} to={6} printAt={0.1} per={0.45} />],
    [217.0, , B(K.MOON[0], K.MOON[1], () => ({day: true, s: null, r: null, bloom: 0.45}), true)],
    [218.4, 'b', (c: Ctx) => <NodeNetwork t={c.l} />],
  );

  // ======================= S07 DAY 90 (3:41 - 4:11) =======================
  L.push(
    [221.3, , B(...WIDE, () => ({s: sP({glow: 1}), r: rB(), bloom: 0.4, thorn: 0.3, books: 6, notes: 6, clutter: 0.5}))],
    [223.3, , B(...camS(1.0, 1.1), () => ({s: sP({glow: 1.1}), r: null, clutter: 0.6, thorn: 0.3}))],
    [225.2, , B(...camS(1.5, 1.65), () => ({s: sP({lids: 0.4, glow: 1.2}), r: null, clutter: 0.6}))],
    [227.0, , (c: Ctx) => <BillInsert t={c.l} from={4} to={5} printAt={0.15} />],
    [228.3, , B(...sFace(2.1, 2.3), () => ({s: sP({lids: 0.5, glow: 1.3, smile: 0}), r: null}))],
    [229.7, , B(...camS(1.5, 1.55), () => ({s: sP({lids: 0.5, glow: 1.3}), r: null, clutter: 0.6}))],
    [230.4, , B(...camS(1.5, 1.55), () => ({s: sP({lids: 0.5, glow: 1.3}), r: null, clutter: 0.6}))],
    [231.1, , B(...camS(1.5, 1.55), () => ({s: sP({lids: 0.5, glow: 1.3}), r: null, clutter: 0.6}))],
    [232.7, 'w', B(...camR(1.4, 1.55), () => ({r: rB({smile: 0.45}), s: null, books: 6, notes: 6, bloom: 0.4}))],
    [234.5, , B([120, 700, 2.0], [140, 696, 2.2], () => ({r: null, s: null, books: 6}), true)],
    [236.0, , B([760, 230, 2.0], [780, 226, 2.2], () => ({r: null, s: null, notes: 8}), true)],
    [237.4, , B(...rFace(1.9, 2.1), () => ({r: rB({smile: 0.55, lids: 0.1}), s: null, books: 6}))],
    [238.3, , B([1850, 760, 1.3], [2450, 430, 1.0], () => ({s: sP({glow: 1.1}), r: null, thorn: 0.5, clutter: 0.6}))],
    [241.4, , B(...sFace(2.0, 2.2), () => ({s: sP({smile: 0.6, lids: 0.1, glow: 1.3}), r: null}))],
    [243.4, , B(...rFace(1.9, 2.1), () => ({r: rB({brow: -0.5, browTilt: -10, smile: 0, lids: 0.25}), s: null}))],
    [245.9, , B(...rFace(2.0, 2.2), () => ({r: rB({smile: 0.7, lids: 0.05}), s: null, books: 6}))],
    [247.1, , B(...sFace(2.0, 2.1), () => ({s: sP({smile: 0, lids: 0.6, glow: 1}), r: null}))],
    [248.4, , B(...WIDE, (c) => ({s: sP({glow: Math.max(0.3, 1.3 - c.l * 0.4)}), r: rB(), glowS: Math.max(0.2, 1.4 - c.l * 0.5), glowR: 0.4 + c.l * 0.45, books: 6, notes: 6, clutter: 0.6, bloom: 0.4, thorn: 0.3}))],
  );

  // ======================= S07b MONTH SIX (4:11 - 5:27) =======================
  L.push(
    [250.9, , dine(resW[0], resW[1])],
    [252.9, 'w', dine([1700, 450, 0.85], [1700, 450, 0.95])],
    [253.9, , (c: Ctx) => <ChatPhone t={c.l} mode="invite" />],
    [256.3, 'w', B(...sFace(2.1, 2.3), () => ({s: sP({smile: 0.5, glow: 1.2}), r: null}))],
    [257.7, , (c: Ctx) => <ClockInsert text="1 HOUR" />],
    [258.7, , (c: Ctx) => <ChatPhone t={c.l} mode="cancel" />],
    [261.2, 'w', B(...camS(1.1, 1.2), () => ({s: sP({slump: 0.9, lids: 0.4, glow: 1, smile: 0.2, lean: -10}), r: null, clutter: 0.7}))],
    [262.6, , dine([1380, 440, 1.3], [1400, 436, 1.4], {rdTalk: 0.6, fr: {smile: 0.6}})],
    [264.8, , dine([1380, 440, 1.5], [1390, 436, 1.6], {rd: {smile: 0.5, lids: 0.05, gaze: [0.6, 0.1]}, frTalk: 1})],
    [266.6, , dine(resW[0], resW[1], {rd: {smile: 0.6}, fr: {smile: 0.7}})],
    [268.6, , (c: Ctx) => <RewardInsert t={c.l} from={7} to={8} printAt={0.2} />],
    [270.1, , dine([2070, 440, 1.5], [2060, 436, 1.6], {frTalk: 1, glass: true, fr: {smile: 0.9}})],
    [272.1, , dine([1380, 440, 1.5], [1390, 436, 1.6], {rdTalk: 1, rd: {smile: 0.8}})],
    [274.1, 'w', B(...camS(1.2, 1.3), () => ({s: sP({glow: 1.3, lids: 0.35}), r: null, clutter: 0.7}))],
    [275.0, , (c: Ctx) => <PhotoStrip t={c.l} />],
    [277.8, , (c: Ctx) => <FeedPhoto t={c.l} />],
    [280.6, , (c: Ctx) => <PhoneFeed t={c.l} speed={1.2} />],
    [281.6, , (c: Ctx) => <BillInsert t={c.l} from={5} to={6} printAt={0.1} />],
  );

  // ======================= M2: SEASONS (4:42 - 5:27), day 180 -> 300, books 9 -> 20, screen time 270 -> 900 h =======================
  L.push(...montage(282.4, 327.4, (u) => lerp(1.5, 0.55, u), (i, u) => {
    const season = (Math.floor(u * 5) % 4) + 1, night = i % 3 === 0, bk = Math.round(lerp(9, 20, u));
    const day = !night;
    const v = i % 4;
    if (v === 0) return B(K.MOON[0], K.MOON[1], () => ({day, season, s: sP({glow: 1}), r: rB(), books: bk, notes: 10, clutter: u, thorn: u * 0.8, bloom: u * 0.8, vines: u * 0.8}), true);
    if (v === 1) return B(...camS(1.1, 1.2), () => ({day, season, s: sP({glow: 1.3, lids: 0.4 + u * 0.3}), r: null, clutter: u, thorn: u * 0.8, vines: u * 0.8}));
    if (v === 2) return B(...camR(1.1, 1.2), () => ({day, season, r: rB({smile: 0.5}), s: null, books: bk, notes: 12, bloom: u * 0.9}));
    return B(...WIDE, () => ({day, season, s: sP({glow: 1.1}), r: rB(), books: bk, notes: 12, clutter: u, thorn: u * 0.8, bloom: u * 0.9, vines: u * 0.8}));
  }, 4));

  // ======================= S08 LOW POINT (5:27 - 5:53) =======================
  const tType = S(206.2) - 331.0;
  L.push(
    [327.4, , B(...camS(1.3, 1.4), () => ({s: sP({lean: -14, lids: 0.55, glow: 1.3, smile: 0}), r: null, clutter: 0.9, thorn: 0.8, vines: 0.8, bloom: 0.6}))],
    [329.4, , B(...sFace(2.1, 2.3), () => ({s: sP({lids: 0.5, glow: 1.2, smile: 0, brow: -0.2, browTilt: 12}), r: null}))],
    [331.0, 'w', (c: Ctx) => <SearchPhone t={c.l - tType + 0.2} />],
    [336.4, , (c: Ctx) => <div style={{position: 'absolute', inset: 0, transform: 'scale(1.12)'}}><SearchPhone t={c.l + 5.4 - tType + 0.2} /></div>],
    [342.0, , (c: Ctx) => <ClockInsert text="40 MIN" />],
    [343.2, , B(...camS(1.2, 1.3), () => ({s: sP({lean: -14, lids: 0.6, glow: 1.3, smile: 0}), r: null, clutter: 0.9, thorn: 0.8, vines: 0.8}))],
    [345.1, , B([2690, 265, 2.0], [2690, 260, 3.3], () => ({s: sP({lids: 0.7, glow: 1.2, smile: 0, gaze: [0, 0.4]}), r: null, dim: 0.25}))],
    [348.3, , (c: Ctx) => <BillInsert t={c.l} from={6} to={7} printAt={0.15} />],
    [350.3, , B(...sFace(2.8, 3.0), (c) => ({s: sP({lids: 0.7, glow: 0.7 + 0.6 * Math.abs(Math.sin(c.l * 9) * Math.sin(c.l * 4.1)), smile: 0}), r: null, dim: 0.35}))],
  );

  // ======================= S09 THE RESULT (5:53 - 6:18) =======================
  L.push(
    [352.8, , mgr(mgW[0], mgW[1], {seat: true})],
    [354.8, 'w', mgr([2700, 300, 1.2], [2660, 296, 1.3], {seat: true, wave: true, mf: {smile: 0.7}})],
    [356.6, , OF(offW[0], offW[1], (c) => <Person k="man" x={1250} y={690} pitch={4} face={{brow: 0.9, lids: 0, smile: 0.2}} hn={[190, -44]} hf={[240, -44]} t={c.t} seed={0.7} />)],
    [358.3, 'w', mgr(mgW[0], mgW[1], {rdX: 1450, mTalk: 0.6})],
    [360.3, , mgr([1950, 40, 1.5], [1970, 36, 1.6], {mTalk: 1, mf: {smile: 0.4}})],
    [362.3, , mgr([1470, 40, 1.5], [1480, 36, 1.6], {rf: {smile: 0.15, lids: 0.1}})],
    [363.8, , mgr([1950, 40, 1.6], [1960, 36, 1.7], {mTalk: 1})],
    [365.1, , mgr([1950, 40, 1.7], [1960, 36, 1.8], {mTalk: 1, mf: {smile: 0.5}})],
    [367.5, , mgr([1470, 40, 1.7], [1480, 36, 1.8], {rf: {brow: 0.9, lids: 0, smile: 0, open: 0.25}})],
    [368.9, , mgr([1950, 40, 1.7], [1960, 36, 1.8], {mTalk: 1, mf: {smile: 0.7}})],
    [370.1, , mgr(mgW[0], mgW[1], {shake: 1, mf: {smile: 0.8}, rf: {smile: 0.7}})],
    [371.0, 'w', B(...camR(1.2, 1.3), () => ({r: rB({smile: 0.3}), s: null, books: 12}))],
    [371.9, , B(K.LAMP[0], K.LAMP[1], () => ({s: null, r: rB(), books: 12}), true)],
    [372.8, , (c: Ctx) => <TeaPour t={c.l + 0.6} />],
    [373.8, , B([120, 700, 2.0], [140, 696, 2.2], () => ({r: null, s: null, books: 12}), true)],
    [374.7, , B(...rFace(1.8, 2.0), () => ({r: rB({smile: 0.55, lids: 0.12}), s: null, books: 12, bloom: 0.8}))],
    [375.7, , (c: Ctx) => <RewardInsert t={c.l} from={8} to={9} printAt={0.2} />],
  );

  // ======================= S10 DAY 365 (6:18 - 6:43) =======================
  const D = {bloom: 1, thorn: 1, vines: 1, books: 20, notes: 14, clutter: 1};
  const gaunt: SP = {mode: 'phone', tee: '#7d6f99', lids: 0.62, smile: 0, brow: -0.4, browTilt: 14, glow: 1.2};
  const tHours = S(252.0), tBooks = S(245.2), tSnap = S(255.5);
  L.push(
    [377.9, , B(...WIDE, () => ({s: gaunt, r: rB({smile: 0.6}), ...D}))],
    [379.9, , B(...sFace(2.0, 2.2), () => ({s: gaunt, r: null, ...D, sat: 0.7}))],
    [381.5, , B(...rFace(2.0, 2.2), () => ({r: rB({smile: 0.7, lids: 0.08}), s: null, ...D, glowR: 1.2}))],
    [383.2, 'w', B(...camR(1.1, 1.2), () => ({r: rB({smile: 0.6}), s: null, ...D}))],
    [385.0, , (c: Ctx) => <IconGrid t={c.l + 0.1} />],
    [388.6, 'w', (c: Ctx) => <BillInsert t={c.l} from={8} to={8} total totalAt={tHours - 388.6} />],
    [392.3, , B(...sFace(2.2, 2.4), () => ({s: gaunt, r: null, ...D, sat: 0.7}))],
    [393.3, 'f', (c: Ctx) => <BillInsert t={c.l + 3} from={8} to={8} total totalAt={0} tearAt={tSnap - 393.3 + 3} />],

    [395.1, , (c: Ctx) => <RewardInsert t={c.l} from={9} to={10} printAt={0.2} />],
    [396.6, , B(...rFace(2.2, 2.4), () => ({r: rB({smile: 0.6}), s: null, ...D}))],
    [398.1, , B([2690, 265, 2.0], [2690, 260, 2.8], () => ({s: gaunt, r: null, ...D, sat: 0.7}))],
    [400.6, , B([660, 172, 2.0], [660, 168, 2.7], () => ({r: rB({smile: 0.5, lids: 0.1}), s: null, ...D}))],
  );

  // ======================= M3: ONE NIGHT AT A TIME (6:43 - 7:18), NIGHT 1 -> 365, slow, fast, slow =======================
  L.push(...montage(403.0, 438.0, (u) => lerp(0.75, 0.085, Math.sin(Math.PI * u)), (i, u) => {
    const g = u, tee = mixHex('#9a7be4', '#7d6f99', g);
    if (i % 2 === 0) return B(...camS(1.2, 1.3), () => ({s: sP({tee, lids: 0.2 + 0.45 * g, glow: 1.2, smile: 0.1 * (1 - g)}), r: null, clutter: g, thorn: g, vines: g, bloom: g * 0.9, books: Math.round(20 * g)}));
    return B(...camR(1.2, 1.3), () => ({r: rB({smile: 0.2 + 0.4 * g}), s: null, books: Math.round(20 * g), notes: Math.round(14 * g), bloom: g, thorn: g * 0.7, vines: g * 0.7}));
  }, 0));

  // ======================= S11 THE TURN (7:18 - 7:44) =======================
  const tDown = S(272.8) - 450.8;
  L.push(
    [438.0, , B([1600, 500, 0.62], [1600, 505, 0.68], () => ({s: sP({glow: 1}), r: rB(), dim: 0.3, ...D}))],
    [440.0, , B([1900, 500, 0.8], [1750, 500, 0.85], (c) => ({s: sP({glow: 1.1, turn: ramp(c.l, 0.8, 1.6), gaze: [lerp(0.2, 1, ramp(c.l, 0.6, 1.2)), 0.1]}), r: rB({smile: 0.7}), ...D}))],
    [441.8, , B(...sFace(2.2, 2.4), () => ({s: sP({mode: 'rest', lids: 0.1, brow: 0.8, smile: 0, gaze: [0.9, 0]}), r: null, ...D}))],
    [443.8, , (c: Ctx) => <div style={{position: 'absolute', inset: 0}}>{bedScene(c, {cam: sFace(2.0, 2.1), s: sP({mode: 'rest', lids: 0.1, brow: 0.5, gaze: [0.9, 0]}), r: null, ...D})}{pip(c, {cam: [[760, 400, 0.72], [760, 392, 0.78]], r: rB({smile: 0.8}), s: null, ...D})}</div>],
    [445.6, , (c: Ctx) => <div style={{position: 'absolute', inset: 0}}>{bedScene(c, {cam: sFace(2.0, 2.1), s: sP({mode: 'rest', lids: 0.15, brow: 0.3, gaze: [0.9, 0.1]}), r: null, ...D})}{pip(c, {cam: [[660, 172, 2.0], [660, 168, 2.1]], r: rB({smile: 0.9}), s: null, ...D})}</div>],
    [447.5, 'w', B(...sFace(2.2, 2.4), () => ({s: sP({lids: 0.4, glow: 1.2, smile: 0, brow: -0.2}), r: null, ...D}))],
    [449.0, , B(K.HANDS_S[0], K.HANDS_S[1], () => ({s: sP({glow: 1.3}), r: null, ...D}), true)],
    [450.8, , (c: Ctx) => <PhoneFaceDown t={c.l} at={tDown} />],
    [453.6, 'f', B(...sFace(2.1, 2.3), () => ({s: sP({mode: 'rest', lids: 0.05, smile: 0.2, brow: 0.2}), r: null, glowS: 0.5, ...D}))],
    [456.1, , (c: Ctx) => <BookOpenInsert t={c.l} openAt={0.2} flips={[]} />],
    [457.9, , B(...camS(1.2, 1.3), () => ({s: null, r: null, ...D}))],
    [458.4, , (c: Ctx) => <PageInsert t={c.l} loops={3} per={0.95} />],
    [461.3, , B(...sFace(2.1, 2.3), () => ({s: sP({mode: 'rest', lids: 0.1, smile: 0.4}), r: null, glowS: 1, ...D}))],
  );

  // ======================= S12 END (7:44 - 7:53) and the END CARD =======================
  L.push(
    [463.7, , B(...WIDE, () => ({s: sP({glow: 0.6}), r: rB({smile: 0.5}), bloom: 0.2, thorn: 0.2, books: 20, notes: 14}))],
    [465.7, , (c: Ctx) => <div style={{position: 'absolute', inset: 0, filter: 'brightness(.85)'}}><PhoneBook t={c.l + 3} hover={1} /></div>],
    [469.4, , (c: Ctx) => <div style={{position: 'absolute', inset: 0, filter: 'brightness(.7)'}}><PhoneBook t={c.l + 6} hover={1} /></div>],
    [472.8, , (c: Ctx) => <EndCard t={c.l} />],
  );
  void LockScreen; void IconTag; void ramp;
  return L;
};

// ---------------- kinetic words, bubbles, counters, tags that belong to part 2 ----------------
export const KWORDS2: KW[] = [
  {at: 164.6, dur: 1.4, text: 'SOMETHING FEELS OFF.', accent: 2}, {at: 168.9, dur: 1.1, text: 'SMALL THINGS.', accent: 1}, {at: 186.4, dur: 1.5, text: 'SOMETHING CHANGES.', accent: 1},
  {at: 190.5, dur: 1.5, text: '20 PAGES.', accent: 0}, {at: 197.4, dur: 1.6, text: 'GETTING EASIER.', accent: 1}, {at: 207.1, dur: 1.4, text: 'THINK FIRST.', accent: 1},
  {at: 229.5, dur: 1.5, text: 'SAME RESULTS.', accent: 1}, {at: 237.5, dur: 1.4, text: 'A CALMER FACE.', accent: 2}, {at: 245.9, dur: 1.8, text: 'NOW, THE OTHER WAY.', accent: 3},
  {at: 261.3, dur: 1.4, text: 'BED FEELS EASIER.', accent: 2}, {at: 267.2, dur: 1.2, text: '20 MINUTES.', accent: 0}, {at: 347.5, dur: 1.4, text: 'CHANGED NOTHING.', accent: 1},
  {at: 359.9, dur: 1.5, text: 'THINKS CLEARLY.', accent: 1}, {at: 373.0, dur: 1.5, text: 'THE RESULT.', accent: 1}, {at: 383.6, dur: 1.5, text: 'SAME MAN.', accent: 1},
  {at: S(255.5), dur: 2.0, text: 'THE FINAL BILL.', accent: 1, big: true}, {at: 395.3, dur: 2.6, text: 'ONE NIGHT AT A TIME.', accent: 3},
  {at: 441.2, dur: 1.6, text: 'THE OTHER LIFE.', accent: 1}, {at: 451.0, dur: 1.8, text: 'FACE DOWN.', accent: 1}, {at: 453.7, dur: 1.6, text: 'OKAY. TEN PAGES.', accent: 2},
  {at: 468.8, dur: 1.4, text: 'WHICH ONE?', accent: 1}, {at: 470.4, dur: 2.4, text: 'TONIGHT?', accent: 0, big: true},
];
export const BUBBLES2: {from: number; to: number; text: string; x: number; y: number}[] = [
  {from: 170.3, to: 172.2, text: "Your food's getting cold…", x: 420, y: 150}, {from: 172.3, to: 174.2, text: "I said I'm coming!", x: 1000, y: 170},
  {from: 210.0, to: 211.9, text: 'Since when do you talk like that?', x: 700, y: 140}, {from: 212.0, to: 213.9, text: 'Since chapter twelve.', x: 300, y: 160},
  {from: 270.2, to: 272.1, text: 'When did you get so interesting?', x: 640, y: 140}, {from: 272.2, to: 274.1, text: 'Somewhere around book nine.', x: 280, y: 160},
  {from: 365.2, to: 367.4, text: 'We want you to lead it.', x: 640, y: 140}, {from: 367.6, to: 368.8, text: '…Me?', x: 380, y: 160}, {from: 369.0, to: 370.4, text: "You've changed this year.", x: 640, y: 140},
  {from: 453.7, to: 456.0, text: 'Okay. Ten pages.', x: 560, y: 160},
];

const ev = (t: number) => ramp(t, 0, 1);
export const overlays2 = (t: number): React.ReactNode => {
  const m1 = t >= 115.3 && t < 160.3, m2 = t >= 282.4 && t < 327.4, m3 = t >= 403 && t < 438;
  const day = m1 ? Math.round(6 + 14 * ((t - 115.3) / 45)) : m2 ? Math.round(180 + 120 * ((t - 282.4) / 45)) : 0;
  const pages = m1 ? Math.round(50 + 150 * ((t - 115.3) / 45)) : 0;
  const night = m3 ? Math.max(1, Math.round(1 + 364 * ((t - 403) / 35))) : 0;
  const books = m2 ? Math.round(9 + 11 * ((t - 282.4) / 45)) : 0, hrs = m2 ? Math.round(270 + 630 * ((t - 282.4) / 45)) : 0;
  const hours = Math.min(ramp(t, S(252.0), S(252.0) + 0.5), 1 - ramp(t, S(255.5) + 0.8, S(255.5) + 1.2));
  const snap = t >= S(255.5) && t < S(255.5) + 0.12;
  const gold = ramp(t, 456, 460) * (1 - ramp(t, 472, 472.8)) * (t < 472.8 ? 1 : 0);
  const black = ramp(t, 470.6, 472.8) * (t < 472.8 ? 1 : 0);
  return (
    <>
      {gold > 0 && <AbsoluteFill style={{background: `rgba(255,200,110,${0.3 * gold})`, mixBlendMode: 'soft-light', pointerEvents: 'none'}} />}
      {snap && <AbsoluteFill style={{background: '#fff', mixBlendMode: 'difference'}} />}
      {black > 0 && <AbsoluteFill style={{background: '#000', opacity: black}} />}
      {BUBBLES2.map((b, i) => <Bubble key={i} t={t} from={b.from} to={b.to} text={b.text} x={b.x} y={b.y} />)}
      <WhoTag t={t} from={162.8} to={166.0} text="DAY 21" who="scroller" icon="sun" color="#ffd9a0" />
      <WhoTag t={t} from={186.3} to={189.5} text="DAY 21" who="reader" icon="moon" />
      <IconTag t={t} from={199.9} to={202.5} text="MORNING" icon="sun" color="#ffd9a0" />
      <WhoTag t={t} from={223.8} to={226.8} text="DAY 90" who="scroller" icon="moon" />

      <WhoTag t={t} from={253.4} to={256.4} text="MONTH 6" who="both" icon="moon" />
      <IconTag t={t} from={257.7} to={258.7} text="1 HOUR LATER" icon="clock" color="#ff8a7a" top={90} />
      <IconTag t={t} from={266.6} to={269.6} text="2 HOURS" icon="clock" color="#fff" />
      <IconTag t={t} from={342.0} to={345.0} text="40 MIN LATER" icon="clock" color="#ff8a7a" />
      <WhoTag t={t} from={355.8} to={358.8} text="MONTH 11" who="reader" icon="sun" color="#ffd9a0" />
      <WhoTag t={t} from={380.8} to={383.8} text="DAY 365" who="both" icon="moon" />
      {(m1 || m2) && <IconTag t={t} from={m1 ? 115.3 : 282.4} to={m1 ? 160.3 : 327.4} text={`DAY ${day}`} icon={m1 ? 'sun' : 'moon'} color="#ffd9a0" />}
      {m1 && <BigCounter n={pages} o={ev(t - 115.3)} label="PAGES" />}
      {m2 && <div style={{position: 'absolute', left: 150, top: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: MONT, fontWeight: 800, color: '#7be0a0', textShadow: '0 6px 18px rgba(0,0,0,.6)'}}><div style={{fontSize: 130, lineHeight: 1}}>{books}</div><div style={{fontSize: 36, letterSpacing: 6}}>BOOKS</div></div>}
      {m2 && <div style={{position: 'absolute', right: 150, top: 110, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: MONT, fontWeight: 800, color: '#ff6b7a', textShadow: '0 6px 18px rgba(0,0,0,.6)'}}><div style={{fontSize: 130, lineHeight: 1}}>{hrs}</div><div style={{fontSize: 36, letterSpacing: 6}}>HOURS ON SCREEN</div></div>}
      {m3 && <div style={{position: 'absolute', top: 64, left: 0, right: 0, textAlign: 'center', fontFamily: MONT, fontWeight: 800, fontSize: 84, letterSpacing: 6, color: '#fff', textShadow: '0 0 26px rgba(255,255,255,.35), 0 6px 18px rgba(0,0,0,.6)'}}>NIGHT <span style={{color: '#ffc94d'}}>{night}</span></div>}
    </>
  );
};

// ---------------- sound for part 2 ----------------
const every = (from: number, to: number, step: number, make: (t: number) => Cue3): Cue3[] => { const out: Cue3[] = []; for (let t = from; t < to; t += step) out.push(make(t)); return out; };
export const CUES2: Cue3[] = [
  // places
  {file: 'amb_kitchen', at: 160.3, dur: 15, loop: true, vol: 0.22, fadeIn: 0.5, fadeOut: 0.8},
  {file: 'amb_night_room', at: 175.0, dur: 25, loop: true, vol: 0.2, fadeIn: 0.8, fadeOut: 0.8},
  {file: 'amb_office', at: 199.7, dur: 14.2, loop: true, vol: 0.25, fadeIn: 0.5, fadeOut: 0.6},
  {file: 'amb_morning', at: 213.9, dur: 7.4, loop: true, vol: 0.2, fadeIn: 0.5, fadeOut: 0.6},
  {file: 'amb_night_room', at: 221.3, dur: 29.6, loop: true, vol: 0.2, fadeIn: 0.6, fadeOut: 0.6},
  {file: 'amb_restaurant', at: 250.9, dur: 24.5, loop: true, vol: 0.3, fadeIn: 0.6, fadeOut: 0.6},
  {file: 'amb_rain', at: 290, dur: 8, loop: true, vol: 0.16, fadeIn: 1, fadeOut: 1},
  {file: 'amb_night_room', at: 327.4, dur: 23, loop: true, vol: 0.18, fadeIn: 0.8, fadeOut: 1},
  {file: 'amb_office', at: 352.8, dur: 25, loop: true, vol: 0.18, fadeIn: 0.6, fadeOut: 0.8},
  {file: 'amb_night_room', at: 438, dur: 34.8, loop: true, vol: 0.18, fadeIn: 1.5, fadeOut: 1},
  // montages: swipes and page turns on the cuts, a tick per flip, a riser through M3
  ...every(115.3, 160.3, 0.9, (t) => ({file: 'phone_swipe', at: t, vol: 0.12})), ...every(116.0, 160.3, 1.1, (t) => ({file: 'page_turn', at: t, vol: 0.12})),
  ...every(403.5, 437.5, 0.4, (t) => ({file: 'counter_tick', at: t, vol: 0.09})), {file: 'riser', at: 403.2, dur: 3.2, vol: 0.4, fadeOut: 0.1}, {file: 'riser', at: 427.0, dur: 3.2, vol: 0.45, fadeOut: 0.1},
  {file: 'riser', at: 434.8, dur: 3.2, vol: 0.5, fadeOut: 0.05}, {file: 'impact_bloom', at: 438.0, vol: 0.5},
  // S05
  {file: 'phone_notif', at: 168.7, vol: 0.2}, {file: 'phone_swipe', at: 181.0, vol: 0.14}, {file: 'phone_swipe', at: 182.0, vol: 0.14}, {file: 'lamp_click', at: 198.3, vol: 0.35},
  {file: 'book_open', at: 190.3, vol: 0.3}, ...[192.2, 192.8, 193.4, 194.0].map((at) => ({file: 'page_turn', at, vol: 0.2})), {file: 'sigh', at: 175.6, vol: 0.25, old: true},
  // S06
  {file: 'typing_keys', at: 201.8, dur: 2.2, vol: 0.18}, {file: 'whoosh_soft', at: 213.8, vol: 0.2}, {file: 'shimmer', at: 218.2, vol: 0.25},
  // S07b
  {file: 'phone_notif', at: 253.9, vol: 0.3}, {file: 'phone_tap', at: 256.6, vol: 0.2}, {file: 'phone_notif', at: 258.8, vol: 0.25}, {file: 'phone_tap', at: 260.0, vol: 0.2},
  {file: 'glass_clink', at: 271.2, vol: 0.4}, {file: 'chuckle', at: 270.4, vol: 0.2, old: true}, {file: 'reward_pop', at: 278.8, vol: 0.35}, {file: 'phone_swipe', at: 280.8, vol: 0.14}, {file: 'phone_swipe', at: 281.8, vol: 0.14},
  // S08
  ...every(332.4, 335.2, 0.17, (t) => ({file: 'phone_tap', at: t, vol: 0.12})), ...every(336.5, 341.6, 0.95, (t) => ({file: 'phone_swipe', at: t, vol: 0.14})),
  // S09
  {file: 'door_open', at: 358.1, vol: 0.3}, {file: 'cloth_shift', at: 370.3, vol: 0.3}, {file: 'whoosh_soft', at: 371.0, vol: 0.2},
  {file: 'tea_pour', at: 372.9, dur: 1.0, vol: 0.25}, {file: 'lamp_click', at: 371.95, vol: 0.3},
  // S10
  ...every(385.2, 388.5, 0.32, (t) => ({file: 'counter_tick', at: t, vol: 0.14})), {file: 'riser', at: S(252.0) - 0.2, dur: 3.4, vol: 0.4, fadeOut: 0.05},
  {file: 'receipt_tear', at: S(255.5), vol: 0.6}, {file: 'flash_boom', at: S(255.5), vol: 0.35}, {file: 'heartbeat', at: 398.1, dur: 4.5, vol: 0.2},
  {file: 'receipt_print', at: 184.3, dur: 1.2, vol: 0.4}, {file: 'receipt_print', at: 227.1, dur: 0.8, vol: 0.4}, {file: 'receipt_print', at: 281.7, dur: 0.8, vol: 0.4}, {file: 'receipt_print', at: 348.4, dur: 0.8, vol: 0.4}, {file: 'receipt_print', at: 388.7, dur: 2.2, vol: 0.4, fadeOut: 0.3},
  ...[193.4, 194.4, 215.5, 215.95, 216.4, 268.8, 375.9, 395.3].map((at) => ({file: 'stamp_hit', at, vol: 0.28})),
  // S11
  {file: 'whoosh_soft', at: 440.0, vol: 0.2}, {file: 'phone_tap', at: 448.2, vol: 0.2}, {file: 'phone_unlock', at: 447.9, vol: 0.2},
  {file: 'riser', at: 444.7, dur: 6.0, vol: 0.35, fadeOut: 0.05}, {file: 'phone_tap', at: S(272.8), vol: 0.5}, {file: 'impact_bloom', at: S(272.8) + 0.15, vol: 0.55},
  {file: 'book_open', at: 456.2, vol: 0.35}, {file: 'page_flutter', at: 458.4, vol: 0.2}, ...[458.4, 459.35, 460.3].map((at) => ({file: 'phone_swipe', at, vol: 0.1})),
  // S12 + end
  {file: 'phone_buzz', at: 466.0, vol: 0.2}, {file: 'heartbeat', at: 467.0, dur: 5.0, vol: 0.28}, {file: 'title_hit', at: 472.8, vol: 0.4},
];

// ---------------- music by act: the plan's score, one bed per act, crossfaded ----------------
export const MUSIC2: {from: number; to: number; track: string; vol: number}[] = [
  {from: 115.3, to: 160.3, track: 'routine', vol: 0.16}, {from: 160.3, to: 250.9, track: 'low', vol: 0.15}, {from: 250.9, to: 327.4, track: 'routine', vol: 0.16},
  {from: 327.4, to: 350.3, track: 'low', vol: 0.13}, {from: 352.8, to: 403.0, track: 'hope', vol: 0.17}, {from: 403.0, to: 438.0, track: 'wonder', vol: 0.2},
  {from: 438.0, to: 472.8, track: 'resolve', vol: 0.2}, {from: 472.8, to: 482.8, track: 'hope', vol: 0.2},
];
