import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Baby, PersonProps, Who, bodyK, Person} from './People';
import {Laptop, Kite, GiftPile, Handset} from './props';
import {LR, FL, streetPoint} from './sets';
import {Ctx, Entry, Z, stand, sit, Pe, faceCam, bodyCam, F, SC, Split} from './kit';
import {ClockInsert, LaptopHand, Payslip, PromotionLetter, Chat, GiftsToClocks, PhoneDark, SundayFlip, Banking, LeoTransfer, CallScreen, Gallery, PhotoShadow, Viewfinder, Polaroid, EndCard} from './inserts';
import {WatchInsert, Fork, SeatsCount, Blocks, OldCar, Newspaper} from './inserts3';
import {KW, ramp} from './fx';
import {T, TE, speaking} from './timeline';

// ============================================================================================
// TWO FATHERS (version 2): the shot list, timed to the words of the new recording (video time = recording time, 0 - 416.4 s). Every anchor is T('a phrase of the
// narration'), so a shot starts exactly on its words. [startSec, fx ('w' whip, 'f' photo flash, 'b' bridge), renderer]. Nothing is stretched.
// ============================================================================================
export const END = 419.4;
const W0 = Z(1600, 540, 0.95);
const ADAM_SAYS = 373.62, LEO_SAYS = 381.4;      // the two spoken lines near the end ("Adam:" and "Leo:" in the recording)
const adamAt = (c: Ctx, age: number, o: Partial<PersonProps> = {}) => Pe(c, sit('adam', age, LR.chairX, 0.66, {turn: 0.55, face: F.calm, ...o}));
const samAt = (c: Ctx, age: number, o: Partial<PersonProps> = {}) => Pe(c, sit('sam', age, LR.chairX, 0.66, {turn: 0.55, face: F.soft, ...o}));
const doorA = streetPoint('adam', 0.74, 0.72), doorS = streetPoint('sam', 0.74, 0.72);
const at = (who: Who, age: number, x: number, floorY: number, sc: number, o: Partial<PersonProps> = {}) => ({who, age, x, y: floorY - 425 * sc * bodyK(who, age) * 0.85, scale: sc, floor: floorY, ...o});
// a mouth that moves only while the narrator is saying that character's line
const say = (c: Ctx, from: number, to: number, base: Partial<{smile: number; brow: number; tilt: number; lids: number}> = {}) => ({...base, open: speaking(c.t, from, to) ? 0.22 + 0.25 * Math.abs(Math.sin(c.t * 9)) : 0});
const hosp = (c: Ctx, cam: Parameters<typeof SC.hos>[1], track: number, who: 'adam' | 'sam', face = F.soft, grip = 0, sc = 0.85) => {
  const x = who === 'adam' ? 900 : 2300;
  return SC.hos(c, cam, {track}, Pe(c, stand(who, 35, x, sc, {pose: 'cradle', turn: who === 'adam' ? 0.3 : -0.3, face, children: <Baby grip={grip} />})));
};
const crib = (x: number, who: 'a' | 's') => (
  <g transform={`translate(${x} 830)`}><ellipse cx={0} cy={8} rx={190} ry={16} fill="rgba(5,6,15,.4)" style={{filter: 'blur(8px)'}} />
    <rect x={-150} y={-120} width={300} height={70} rx={20} fill="#e9ecf8" stroke="#1d1a2e" strokeWidth={4} /><rect x={-170} y={-60} width={340} height={20} rx={8} fill="#8a96c8" stroke="#1d1a2e" strokeWidth={4} />
    {[-120, 120].map((wx) => <g key={wx}><rect x={wx - 5} y={-40} width={10} height={44} fill="#5a6488" /><circle cx={wx} cy={10} r={14} fill="#1d1d24" stroke="#1d1a2e" strokeWidth={3} /></g>)}
    <g transform="translate(0 -128) scale(0.8)"><Baby x={0} y={0} rot={-4} skin={who === 'a' ? '#e8b793' : '#d9a07a'} /></g></g>
);
const deskScene = (c: Ctx, cam: Parameters<typeof SC.off>[1], age: number, o: Partial<PersonProps> = {}, clockMin = 0, laptop = true) =>
  SC.off(c, cam, {clockMin}, <>{Pe(c, sit('adam', age, 1700, 0.7, {pose: 'desk', face: F.tired, turn: 0.1, ...o}, FL + 76))}{laptop && <Laptop x={1700} y={690} s={0.9} open={1} />}</>);
const kiteShot = (n: number): ((c: Ctx) => React.ReactNode) => (c) => {
  const wob = Math.sin(c.t * 2.2 + n), ky = 250 - n * 6 + wob * 20, kx = 1500 + (n % 3) * 130, sx = 1100 + (n % 4) * 60;
  return SC.park(c, [Z(1500 + (n % 3 - 1) * 120, 500, 1.1), Z(1550 + (n % 3 - 1) * 120, 470, 1.25)], {season: 1},
    <>{Pe(c, stand('sam', 40, sx, 0.62, {turn: 0.7, pose: 'point', face: F.grin}))}{Pe(c, stand('max', 5 + n * 0.05, sx + 220, 0.62, {turn: 0.7, face: F.grin, pose: 'wave'}))}</>,
    <g><path d={`M ${sx + 130},${520} Q ${(sx + kx) / 2},${ky + 280} ${kx},${ky + 96}`} fill="none" stroke="#1d1a2e" strokeWidth={2.4} /><Kite x={kx} y={ky} s={0.8} rot={-14 + wob * 6} t={c.t} /></g>);
};
const walkers = (c: Ctx, ages: [number, number], x0: number, sp: number, sc = 0.78) => (
  <>{Pe(c, stand('sam', ages[0], x0 + c.l * sp, sc, {turn: 0.85, walk: c.l * 0.7, face: F.smile}))}{Pe(c, stand('max', ages[1], x0 + 260 + c.l * sp, sc, {turn: 0.85, walk: c.l * 0.7 + 0.25, face: F.grin}))}</>
);
const benchPair = (c: Ctx, ages: [number, number], face = F.smile) => (
  <>{Pe(c, sit('sam', ages[0], 1620, 0.62, {turn: 0.25, face, view: 'front', pose: 'cup'}))}{Pe(c, sit('max', ages[1], 1900, 0.62, {turn: -0.25, face: F.smile, view: 'front', pose: 'cup'}))}</>
);
const four = (c: Ctx, cups = 4) => SC.tea(c, [Z(1760, 580, 1.25), Z(1760, 570, 1.35)], {season: 1, cups}, <>
  {Pe(c, sit('adam', 65, 1440, 0.6, {turn: 0.2, face: F.soft, view: 'front', pose: 'cup'}))}{Pe(c, sit('sam', 65, 1660, 0.6, {turn: 0.1, face: F.smile, view: 'front', pose: 'cup'}))}
  {Pe(c, sit('leo', 30, 1880, 0.6, {turn: -0.1, face: F.smile, view: 'front', pose: 'cup'}))}{Pe(c, sit('max', 30, 2100, 0.6, {turn: -0.2, face: F.grin, view: 'front', pose: 'cup'}))}</>);
const tint = (a: string, b: string, k: number) => <AbsoluteFill style={{background: `linear-gradient(90deg, ${a}, ${b})`, opacity: k, mixBlendMode: 'soft-light', pointerEvents: 'none'}} />;
const leoNight = (c: Ctx, z = 1.3) => SC.room(c, [Z(1700, 520, z), Z(1660, 500, z + 0.2)], Pe(c, sit('leo', 16, 1360, 0.8, {pose: 'phone', face: {...F.worried, gaze: [0, 0.6], smile: 0}, turn: 0.2})));
const samDoor = (c: Ctx) => SC.door(c, [Z(930, 520, 1.3), Z(940, 520, 1.45)], {label: 'DAD', boxes: 0, glow: 0}, Pe(c, stand('max', 16, 1280, 0.9, {pose: 'knock', turn: 0.8, face: F.sad})));
const stairsSm = (c: Ctx) => SC.stairs(c, [Z(1700, 520, 1.2), Z(1700, 500, 1.4)], <>{Pe(c, sit('sam', 50, 1800, 0.62, {turn: -0.3, face: F.soft}, 840))}{Pe(c, sit('max', 16, 2060, 0.62, {turn: -0.3, face: F.sad}, 840))}</>);
const friday = (c: Ctx, side: 'adam' | 'sam') => {
  const d = side === 'adam' ? doorA : doorS, step = ramp(c.l, 0.5, 2.0), px = d[0] + (side === 'adam' ? 40 : -40) * step;
  const p = at(side, 65, px, 735 + 8 * step, 0.3 + 0.01 * step, {turn: side === 'adam' ? 0.7 : -0.7, face: F.soft});
  return SC.str(c, Z(px + (side === 'adam' ? 209 : -209), 590, 2.3), {samLit: 1}, c.l > 0.5 ? <Person t={c.t} {...p} /> : null);
};
const partyGuests = (c: Ctx) => (
  <>{Pe(c, {...sit('aunt', 40, 1960, 0.6, {face: F.smile, turn: -0.3, top: '#d9a030'}), chair: true})}{Pe(c, sit('max', 38, 2200, 0.6, {face: F.grin, turn: -0.3, top: '#e0455a'}))}{Pe(c, stand('max', 5, 1100, 0.7, {face: F.grin, turn: 0.3, top: '#e0455a'}))}{Pe(c, stand('leo', 5, 1300, 0.7, {face: F.smile, turn: 0.3, top: '#e8b030'}))}</>
);
// Leo in the school play: he is a TREE (brown tunic, a crown of leaves). Drawn in stage coordinates on the stage floor
const leoTree = (c: Ctx, sc = 0.62, extra: Partial<PersonProps> = {}, x = 1600) => {
  const p = at('leo', 10, x, 540, sc, {turn: 0.15, top: '#7a5230', ...extra}), k = sc * bodyK('leo', 10) * 0.85, hx = p.x + 26 * k, hy = p.y - 450 * k;
  return (
    <g>
      {Pe(c, p)}
      <g transform={`translate(${hx} ${hy - 215 * k})`}>
        {[[-60, 10, 60], [0, -40, 74], [62, 8, 58], [-20, 30, 50], [30, 26, 52]].map(([lx, ly, r], i) => <circle key={i} cx={lx * k * 1.2} cy={ly * k * 1.2} r={r * k * 1.2} fill={i % 2 ? '#3f9a52' : '#2f7d44'} stroke="#1d1a2e" strokeWidth={3} />)}
      </g>
    </g>
  );
};
// the twelfth birthday: Adam's father, home late in his work clothes, holds out a parcel wrapped in newspaper
const giftScene = (c: Ctx) => SC.door(c, [Z(1600, 520, 1.3), Z(1600, 520, 1.5)], {label: 'HOME', boxes: 0, glow: 0.4}, <>
  {Pe(c, stand('adam', 60, 1250, 0.9, {outfit: 'work', turn: 0.7, pose: 'hold', face: F.soft, children: <g transform="translate(40 -20)"><rect x={160} y={-120} width={120} height={80} rx={10} fill="#e4dfd0" stroke="#1d1a2e" strokeWidth={4} /><path d="M 170,-100 L 270,-100 M 170,-80 L 250,-80 M 170,-62 L 262,-62" stroke="#9a9482" strokeWidth={4} /></g>}))}
  {Pe(c, stand('adam', 12, 1760, 0.55, {outfit: 'kid', turn: -0.7, face: {...F.soft, wide: 0.4}}))}</>);

// ---------------- Adam's father at the factory: take a crate off table A, turn, walk to table B, set it down, walk back (a 6 s cycle) ----------------
const sm = (x: number) => { const k = Math.min(1, Math.max(0, x)); return k * k * (3 - 2 * k); };
const mixN = (a: number, b: number, k: number) => a + (b - a) * k;
const CRATE = (w: number, h: number) => <g><rect x={-w / 2} y={-h / 2} width={w} height={h} rx={5} fill="#c9954a" stroke="#1d1a2e" strokeWidth={4} /><rect x={-w / 2} y={-h / 2} width={w} height={h * 0.26} fill="#e0b068" stroke="#1d1a2e" strokeWidth={3} /><rect x={-10} y={-h / 2} width={20} height={h} fill="#d9c9a0" opacity={0.6} /><path d={`M ${-w / 2 + 12},${h / 2 - 16} h 26 M ${-w / 2 + 12},${h / 2 - 8} h 16`} stroke="#6a4a24" strokeWidth={3} strokeLinecap="round" /></g>;
const BENCH = (x: number, crate: boolean, k = 1) => (
  <g>
    <rect x={x - 100} y={650} width={200} height={16} rx={4} fill="#5a4a3a" stroke="#1d1a2e" strokeWidth={4} /><rect x={x - 90} y={666} width={12} height={164} fill="#3a2f26" /><rect x={x + 78} y={666} width={12} height={164} fill="#3a2f26" />
    {crate && <g transform={`translate(${x} ${611 - 40 * (1 - k)})`} opacity={k}><g transform="scale(0.7225)">{CRATE(150, 106)}</g></g>}
  </g>
);
const factoryWork = (c: Ctx, off: number, camA: ReturnType<typeof Z>, camB: ReturnType<typeof Z>) => {
  const P = 6, u = (c.l + off) % P, XA = 1300, XB = 970;
  const reach = sm(u / 0.7), lift = sm((u - 0.7) / 0.5), walkL = sm((u - 1.5) / 1.5), place = sm((u - 3.0) / 0.6), rel = sm((u - 3.7) / 0.3), walkR = sm((u - 4.2) / 1.4);
  const x = u < 1.5 ? XA : u < 3.0 ? mixN(XA, XB, walkL) : u < 4.2 ? XB : mixN(XB, XA, walkR);
  const face = u >= 1.2 && u < 4.0 ? -0.5 : 0.5;
  const walking = (u >= 1.5 && u < 3.0) || (u >= 4.2 && u < 5.6);
  const walk = walking ? (u < 3.0 ? u - 1.5 : u - 4.2) * 1.8 + 0.01 : 0;
  const REST: [number, number] = [26, 92], PICK: [number, number] = [225, 110], CARRY: [number, number] = [212, -70], SET: [number, number] = [232, 110];
  let hn: [number, number], hf: [number, number], lean: number;
  if (u < 0.7) { hn = [mixN(REST[0], PICK[0], reach), mixN(REST[1], PICK[1], reach)]; hf = [hn[0] - 26, hn[1] + 8]; lean = 28 * reach; }
  else if (u < 1.2) { hn = [mixN(PICK[0], CARRY[0], lift), mixN(PICK[1], CARRY[1], lift)]; hf = [hn[0] - 40, hn[1] + 6]; lean = mixN(28, 5, lift); }
  else if (u < 3.0) { hn = CARRY; hf = [CARRY[0] - 44, CARRY[1] + 8]; lean = 5; }
  else if (u < 3.7) { hn = [mixN(CARRY[0], SET[0], place), mixN(CARRY[1], SET[1], place)]; hf = [hn[0] - 40, hn[1] + 6]; lean = mixN(5, 28, place); }
  else if (u < 4.2) { hn = [mixN(SET[0], REST[0], rel), mixN(SET[1], REST[1], rel)]; hf = [hn[0] - 26, hn[1] + 8]; lean = mixN(28, 3, rel); }
  else { hn = REST; hf = [10, 98]; lean = 3; }
  const hold = u < 0.7 ? 0 : u < 1.2 ? lift : u < 3.0 ? 1 : u < 3.7 ? 1 - place : 0;
  const carrying = u >= 0.7 && u < 3.7;
  const crate = carrying ? <g transform={`translate(${hn[0] + mixN(18, 40, hold) - 190} ${hn[1] + mixN(10, -34, hold) + 20})`}>{CRATE(150, 106)}</g> : null;
  const p0 = stand('adam', 60, x, 0.85, {outfit: 'work', pose: carrying ? 'carry' : 'stand', turn: face, face: F.tired, walk, hN: hn, hF: hf, lean, children: crate});
  const aOn = u < 0.7 || u >= 4.8, aK = u < 0.7 ? 1 : sm((u - 4.8) / 0.4), bOn = u >= 3.7 && u < 5.6, bK = u < 5.2 ? 1 : 1 - sm((u - 5.2) / 0.4);
  return SC.fac(c, [camA, camB], <>{BENCH(1475, aOn, aK)}{BENCH(794, bOn, bK)}{Pe(c, p0)}</>);
};

const birthday = (c: Ctx) => {
  const sc = 0.62, k = sc * bodyK('adam', 12) * 0.85, p = stand('adam', 12, 1500, sc, {}), hx = 1500 + 26 * k, hy = p.y - 450 * k, fl = 1 + 0.12 * Math.sin(c.t * 14);
  return SC.kit(c, [Z(1560, 520, 1.15), Z(1560, 540, 1.45)], {night: true}, <>
    <g transform="translate(0 0)">
      <path d="M 1000,250 Q 1560,400 2120,250" fill="none" stroke="#1d1a2e" strokeWidth={4} />
      {'HAPPY BIRTHDAY'.split('').map((ch, i) => { const q = (i + 0.5) / 14, x = 1000 + q * 1120, y = 250 + 4 * 75 * q * (1 - q) * 1.3 + 10; return ch === ' ' ? null : <g key={i} transform={`translate(${x} ${y}) rotate(${(q - 0.5) * 40})`}><path d="M -22,0 L 22,0 L 0,56 Z" fill={['#e0455a', '#f5c542', '#3f9a52', '#2c7ab8'][i % 4]} stroke="#1d1a2e" strokeWidth={3} /><text x={0} y={28} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={800} fontSize={26} fill="#fff" stroke="#1d1a2e" strokeWidth={0.8}>{ch}</text></g>; })}
      {[[1090, 560, '#e0455a'], [1140, 520, '#f5c542'], [1190, 570, '#3f9a52'], [2040, 540, '#2c7ab8'], [2090, 590, '#e0455a']].map(([x, y, col], i) => <g key={i} transform={`translate(${x} ${y})`}><path d={`M 0,44 Q ${i % 2 ? 16 : -16},120 0,${200 - i * 8}`} fill="none" stroke="#1d1a2e" strokeWidth={2.4} /><ellipse cx={0} cy={0} rx={36} ry={46} fill={col as string} stroke="#1d1a2e" strokeWidth={3.4} /><ellipse cx={-12} cy={-14} rx={8} ry={14} fill="#fff" opacity={0.4} /><path d="M -5,46 L 5,46 L 0,56 Z" fill={col as string} stroke="#1d1a2e" strokeWidth={2.4} /></g>)}
    </g>
    <g transform="translate(1800 700)">
      <ellipse cx={0} cy={4} rx={150} ry={26} fill="#ffffff" stroke="#1d1a2e" strokeWidth={3.6} /><rect x={-110} y={-52} width={220} height={54} rx={10} fill="#f4d9a8" stroke="#1d1a2e" strokeWidth={3.6} /><rect x={-80} y={-96} width={160} height={46} rx={10} fill="#f08aa6" stroke="#1d1a2e" strokeWidth={3.6} /><path d="M -80,-96 q 20,18 40,0 q 20,18 40,0 q 20,18 40,0 q 20,18 40,0" fill="#fff" stroke="#1d1a2e" strokeWidth={3} />
      {[-40, -14, 12, 38].map((x, i) => <g key={i} transform={`translate(${x} -98)`}><rect x={-4} y={-34} width={8} height={34} fill={['#e0455a', '#3f9a52', '#2c7ab8', '#f5c542'][i]} stroke="#1d1a2e" strokeWidth={2} /><ellipse cx={0} cy={-42 * 1} rx={5 * fl} ry={9 * fl} fill="#ffcf5a" /><ellipse cx={0} cy={-40} rx={9} ry={14} fill="#ffcf5a" opacity={0.25} /></g>)}
    </g>
    {Pe(c, {...sit('adam', 12, 1500, sc, {outfit: 'kid', turn: 0.7, face: {...F.sad, gaze: [0.9, 0.2]}}, FL), chair: true})}
    <g transform={`translate(${hx - 4 * k} ${hy - 205 * k + 104}) rotate(8)`}><path d={`M -34,0 L 34,0 L 0,-92 Z`} fill="#f5c542" stroke="#1d1a2e" strokeWidth={3.4} transform={`scale(${k * 1.9})`} /><circle cx={0} cy={-92 * k * 1.9} r={9 * k * 1.9} fill="#e0455a" stroke="#1d1a2e" strokeWidth={2.4} /></g>
  </>);
};

export const KWORDS: KW[] = [
  {at: T('paid-off'), dur: 1.3, text: 'PAID OFF.', style: 'big'}, {at: T('a full bank account'), dur: 1.4, text: 'FULL BANK ACCOUNT.', style: 'big'}, {at: T('and a son who loves him'), dur: 1.5, text: 'A SON WHO LOVES HIM.', style: 'big', accent: 3},
  {at: T('every sunday at eight'), dur: 2.0, text: 'SUNDAY · 8:00 AM', style: 'time'}, {at: T("that doesn't ring"), dur: 1.6, text: 'IT DOESN’T RING.', style: 'big'},
  {at: T('for 25 years'), dur: 1.5, text: '25 YEARS.', style: 'big', accent: 0},
  {at: T('same street'), dur: 1.0, text: 'SAME STREET', style: 'big'}, {at: T('same salary'), dur: 1.1, text: 'SAME SALARY', style: 'big'}, {at: T('same love for their sons'), dur: 1.4, text: 'SAME LOVE.', style: 'big', accent: 1},
  {at: T('the exact same promise'), dur: 2.0, text: 'THE SAME PROMISE.', style: 'big'},
  {at: T('the way he thought love was supposed to look'), dur: 2.2, text: 'MONEY.', style: 'big'}, {at: T('the way his son actually needed'), dur: 2.2, text: 'TIME.', style: 'big', accent: 0},
  {at: T('which one you are'), dur: 2.0, text: 'WHICH ONE ARE YOU?', style: 'big'},
  {at: T('three days apart'), dur: 1.6, text: '3 DAYS APART', style: 'big'},
  {at: T("you'll have a better life than i did"), dur: 3.0, text: '“You’ll have a better life than I did.”', style: 'quote'},
  {at: T('kept two ways'), dur: 1.8, text: 'TWO WAYS.', style: 'big'},
  {at: T('on his 12th birthday'), dur: 2.4, text: 'AGE 12', style: 'tag'}, {at: T('double shifts'), dur: 2.6, text: 'DOUBLE SHIFTS · 30 YEARS', style: 'big'},
  {at: T('a watch wrapped in newspaper'), dur: 2.2, text: 'A WATCH IN NEWSPAPER.', style: 'big'},
  {at: T('and every evening at six'), dur: 2.0, text: '6:00 PM', style: 'time'}, {at: T('extra shifts'), dur: 2.0, text: 'EXTRA SHIFTS · WEEKENDS', style: 'big'}, {at: T('more money'), dur: 1.5, text: 'MONEY.', style: 'big'},
  {at: T('one hour belonged'), dur: 2.4, text: '6:00 PM → 1 HOUR', style: 'time'}, {at: T('belonged to his son'), dur: 1.5, text: 'TIME.', style: 'big', accent: 0},
  {at: T('a promotion'), dur: 1.6, text: 'IT COST HIM.', style: 'big'},
  {at: T('when leo turned five'), dur: 2.2, text: 'AGE 5', style: 'tag'}, {at: T('every friday that summer'), dur: 2.0, text: 'FRIDAY', style: 'time'}, {at: T('it was perfect'), dur: 1.4, text: 'PERFECT.', style: 'big', accent: 0},
  {at: T('in august'), dur: 1.4, text: 'AUGUST', style: 'time'}, {at: T('the school play'), dur: 2.2, text: 'AGE 10', style: 'tag'}, {at: T('next time'), dur: 1.4, text: 'NEXT TIME.', style: 'big'},
  {at: T('count the seats'), dur: 2.4, text: 'THEY COUNT THE SEATS.', style: 'big', accent: 3},
  {at: T("it's rarely the gifts"), dur: 1.6, text: 'IT’S RARELY THE GIFTS.', style: 'big'}, {at: T("it's the time"), dur: 1.9, text: 'IT’S THE TIME.', style: 'big', accent: 2},
  {at: T('at 15'), dur: 2.2, text: 'AGE 15', style: 'tag'}, {at: T('wanted to say something else'), dur: 1.9, text: 'SAY SOMETHING.', style: 'big'}, {at: T('how are you really'), dur: 2.3, text: 'How are you, really?', style: 'quote'},
  {at: T('fights end'), dur: 1.3, text: 'FIGHTS END.', style: 'big'}, {at: T('walks continue'), dur: 1.9, text: 'WALKS CONTINUE.', style: 'big', accent: 0},
  {at: T('the one who was there'), dur: 2.4, text: 'THE ONE WHO WAS THERE.', style: 'big', accent: 4},
  {at: T('leo grew up successful'), dur: 2.2, text: 'AGE 25', style: 'tag'}, {at: T('every sunday at eight', 1), dur: 2.2, text: 'SUNDAY · 8:00 AM', style: 'time'},
  {at: T('adam is 65'), dur: 2.2, text: 'AGE 65', style: 'tag'}, {at: T("isn't in a single one"), dur: 2.4, text: 'HE ISN’T IN ANY OF THEM.', style: 'big'},
  {at: T('it was never the watch'), dur: 1.8, text: 'NEVER THE WATCH.', style: 'big'}, {at: T('the time he never had'), dur: 2.6, text: 'THE TIME HE NEVER HAD.', style: 'big', accent: 3},
  {at: T('25 years of fridays'), dur: 2.4, text: '25 YEARS OF FRIDAYS', style: 'big', accent: 0},
  {at: T('not because he has to'), dur: 3.0, text: 'NOT BECAUSE HE HAS TO.', style: 'big'},
  {at: T('that friday'), dur: 2.0, text: 'FRIDAY', style: 'time'}, {at: T("they'll remember who showed up"), dur: 2.4, text: 'THEY’LL REMEMBER WHO SHOWED UP.', style: 'big'},
  {at: T("it's never too late"), dur: 2.6, text: 'IT’S NEVER TOO LATE.', style: 'big', accent: 3},
];
export const REWIND: [number, number] = [T('thirty years ago') - 0.6, T('these two men')];
export const FRIDAY_N: [number, number] = [T('every friday that summer'), T('every friday that summer') + 3.4];
export const HITS_AT = [T('adam knocked once'), LEO_SAYS + 1.9, T("it's never too late")];

export const LIST: Entry[] = [
  // ================= THE HOOK =================
  [0.0, undefined, (c) => SC.str(c, [Z(1050, 470, 1.0), Z(1010, 420, 1.35)], {}, Pe(c, stand('adam', 65, 1000 + c.l * 40, 0.95, {turn: 0.4, pose: 'stand', face: F.sad})))],
  [T('a full bank account'), 'w', () => <Banking t={0.05} digits="" typeFrom={99} />],
  [T('and a son who loves him'), undefined, (c) => SC.flat(c, [faceCam(stand('leo', 25, 1600, 0.9), 1.6, 160), faceCam(stand('leo', 25, 1600, 0.9), 2.1, 130)], Pe(c, stand('leo', 25, 1600, 0.9, {view: 'front', pose: 'stand', face: F.grin})))],
  [T('and every sunday at eight'), undefined, (c) => <ClockInsert t={c.l} min={60} label="8:00 AM" tone="cold" />],
  [T('he sits beside a phone'), undefined, (c) => SC.liv(c, [W0, Z(1500, 560, 1.5)], {clockMin: 60}, adamAt(c, 65, {face: {...F.sad, gaze: [0.6, 0.5]}}), 0.4)],
  [T("doesn't ring"), undefined, (c) => <PhoneDark t={c.l} light={0} />],
  [T('across the street'), 'w', (c) => SC.liv(c, [Z(1750, 450, 1.5), Z(2430, 360, 1.85)], {clockMin: 60, samAnswer: c.l > 0.9 ? 1 : 0}, adamAt(c, 65, {face: {...F.sad, gaze: [0.8, 0]}}), 0.3)],
  [T("his neighbor's phone rings"), undefined, (c) => <CallScreen t={c.l} name="Max" initial="M" color="#4c9a63" mode="incoming" shake={0.4 + 0.35 * Math.abs(Math.sin(c.l * 28))} />],
  [T('rings every sunday') + 1.0, undefined, (c) => SC.liv(c, faceCam(sit('sam', 65, LR.chairX, 0.66), 2.4, 20), {warm: true}, samAt(c, 65, {pose: 'ear', face: {smile: ramp(c.l, 0.2, 0.6), open: 0.2}}), 0.3)],
  [T('for 25 years'), undefined, (c) => <SundayFlip t={c.l * 3} who="sam" week={Math.floor(c.l * 6)} />],
  [T('same street'), 'w', (c) => SC.str(c, [Z(1600, 560, 0.95), Z(1600, 540, 1.2)], {})],
  [T('same salary'), undefined, (c) => <Payslip t={c.l} who="adam" />],
  [T('same salary') + 0.55, undefined, (c) => <Payslip t={c.l} who="sam" />],
  [T('same love for their sons'), undefined, (c) => SC.liv(c, [Z(1950, 470, 1.5), Z(1980, 450, 1.7)], {}, adamAt(c, 65, {face: F.sad, tilt: 3}), 0.4)],
  [T('their sons') - 0.35, undefined, (c) => SC.liv(c, [Z(1950, 470, 1.5), Z(1980, 450, 1.7)], {warm: true}, samAt(c, 65, {face: F.soft}), 0.4)],
  // ================= THIRTY YEARS AGO =================
  [REWIND[0], undefined, () => null],
  [T('these two men'), undefined, (c) => SC.hos(c, [Z(1600, 520, 0.95), Z(1600, 520, 1.45)], {track: c.p}, <>{Pe(c, stand('adam', 35, 640 + Math.sin(c.t * 0.9) * 60, 0.78, {turn: 0.45, pose: 'fold', face: F.worried}))}{Pe(c, stand('sam', 35, 2560, 0.78, {turn: -0.45, pose: 'fold', face: F.soft}))}</>)],
  [T('one of them kept it'), undefined, (c) => SC.liv(c, [Z(330, 800, 1.5), Z(330, 220, 1.5)], {giftN: 8, dust: 0.4}, null, 0.4)],
  [T('the other kept it'), 'b', (c) => SC.liv(c, [Z(1000, 400, 1.2), Z(1000, 350, 1.0)], {warm: true, photoN: 12}, null, 0.1)],
  [T('his son actually needed') + 0.4, undefined, (c) => SC.liv(c, [Z(1000, 340, 1.7), Z(1000, 340, 2.6)], {warm: true, photoN: 12}, null, 0.1)],
  [T('by the end of this video'), 'w', (c) => SC.liv(c, faceCam(sit('adam', 65, LR.chairX, 0.66), 2.4, 20), {}, adamAt(c, 65, {face: {...F.calm, gaze: [0, 0.2]}}), 0.4)],
  [T('you might find out'), undefined, (c) => SC.liv(c, faceCam(sit('sam', 65, LR.chairX, 0.66), 2.4, 20), {warm: true}, samAt(c, 65, {face: {...F.smile, gaze: [0, 0.2]}}), 0.4)],
  [T('which one you are') - 0.1, undefined, (c) => SC.liv(c, faceCam(sit('adam', 65, LR.chairX, 0.66), 2.9, 20), {}, adamAt(c, 65, {face: {...F.worried}}), 0.4)],
  // ================= THE HOSPITAL =================
  [T('both boys were born'), 'f', (c) => SC.hos(c, [Z(1600, 520, 0.95), Z(1600, 520, 1.3)], {track: 0.3}, <>{crib(900, 'a')}{crib(2300, 's')}</>)],
  [T('adam and sam stood'), undefined, (c) => hosp(c, [Z(960, 560, 1.2), Z(920, 520, 1.5)], 0.6, 'adam')],
  [T('each holding') - 0.1, undefined, (c) => hosp(c, [Z(2260, 560, 1.2), Z(2300, 520, 1.5)], 0.6, 'sam')],
  [T('and they made the same quiet promise'), undefined, (c) => hosp(c, [Z(1100, 560, 0.95), faceCam(stand('adam', 35, 900, 0.85), 2.7, 100)], 0.6, 'adam', {...F.soft, gaze: [0, 0.4]})],
  [T("you'll have a better life") + 0.4, undefined, (c) => hosp(c, [Z(2100, 560, 0.95), faceCam(stand('sam', 35, 2300, 0.85), 2.7, 100)], 0.6, 'sam', {...F.soft, smile: 0.5, gaze: [0, 0.4]})],
  [T('neither of them knew yet'), undefined, (c) => <Fork t={c.l} />],
  // ================= ADAM'S FATHER =================
  [T('to understand adam'), 'w', (c) => SC.liv(c, [Z(1800, 480, 1.4), Z(1900, 450, 1.7)], {}, adamAt(c, 65, {face: {...F.soft, gaze: [-0.8, 0.1]}}), 0.4)],
  [T('you have to know about his father'), undefined, (c) => SC.liv(c, [Z(640, 330, 2.0), Z(640, 320, 2.6)], {}, null, 0.1)],
  [T("adam's father worked double shifts"), 'f', (c) => factoryWork(c, 0, Z(1250, 540, 1.1), Z(1250, 540, 1.3))],
  [T('for 30 years'), undefined, (c) => factoryWork(c, 2.5, Z(1150, 540, 1.25), Z(1250, 540, 1.1))],
  [T('adam barely saw him'), undefined, (c) => SC.liv(c, [Z(1950, 520, 1.4), Z(1980, 500, 1.6)], {night: true, seats: false}, Pe(c, stand('adam', 8, 1960, 0.7, {outfit: 'kid', turn: 0.7, face: {...F.sad, gaze: [0.9, 0.1]}})), 0.4)],
  [T('but on his 12th birthday'), 'w', (c) => birthday(c)],
  [T('his father came home late'), undefined, (c) => SC.door(c, [Z(1500, 500, 1.2), Z(1560, 500, 1.4)], {label: 'HOME', boxes: 0, glow: 0.4}, Pe(c, stand('adam', 60, 1250 + ramp(c.l, 0, 1.4) * 80, 0.9, {outfit: 'work', turn: 0.7, face: F.tired})))],
  [T('and handed him a watch'), undefined, (c) => giftScene(c)],
  [T('wrapped in newspaper'), undefined, (c) => <WatchInsert t={c.l} unwrapAt={1.0} zoom={1.3} />],
  [T('it was the only gift'), undefined, (c) => SC.kit(c, faceCam(stand('adam', 12, 1600, 0.7), 2.4, 30), {night: true}, Pe(c, stand('adam', 12, 1600, 0.7, {outfit: 'kid', pose: 'hold', turn: 0.2, face: {smile: 0.6, lids: 0.3, gaze: [0, 0.6], brow: 0.3}})))],
  [T('he still wears it'), undefined, (c) => <WatchInsert t={c.l + 3} zoom={0.75} />],
  // ================= ADAM BECOMES A FATHER =================
  [T('so when adam became a father'), 'f', (c) => hosp(c, [Z(960, 560, 1.2), Z(920, 520, 1.6)], 0.6, 'adam')],
  [T('he already knew'), undefined, (c) => hosp(c, [Z(1100, 560, 0.95), faceCam(stand('adam', 35, 900, 0.85), 2.6, 100)], 0.6, 'adam', {...F.soft, brow: 0.2, gaze: [0.2, 0.2]})],
  [T('it looked like working hard'), undefined, (c) => deskScene(c, [Z(1600, 520, 1.0), Z(1700, 540, 1.3)], 35, {face: {...F.tired, gaze: [0, 0.5]}}, 330)],
  [T('and bringing something home'), undefined, (c) => SC.door(c, [Z(1500, 500, 1.2), Z(1560, 500, 1.4)], {label: 'HOME', boxes: 0, glow: 0.4}, Pe(c, stand('adam', 35, 1250 + ramp(c.l, 0, 1.2) * 80, 0.9, {turn: 0.7, pose: 'carry', face: F.smile, children: <GiftPile x={0} y={0} n={1} s={0.45} />})))],
  // ================= THE SIX O'CLOCK CHOICE =================
  [T('and every evening at six'), 'f', (c) => <ClockInsert t={c.l} min={660} />],
  [T('both men faced'), undefined, (c) => <LaptopHand t={c.l} who="adam" />],
  [T('same small choice'), undefined, (c) => <LaptopHand t={c.l + 1} who="sam" closeAt={9} />],
  [T('adam kept working'), 'w', (c) => deskScene(c, [Z(1600, 520, 1.0), Z(1700, 540, 1.25)], 35)],
  [T('extra shifts'), undefined, (c) => deskScene(c, [Z(1750, 500, 1.4), Z(1700, 480, 1.2)], 35, {face: {...F.tired, gaze: [0, 0.5]}, tilt: 3}, 120)],
  [T('weekend contracts'), 'w', (c) => <Payslip t={c.l} who="adam" />],
  [T('more money meant'), undefined, (c) => SC.liv(c, [Z(900, 620, 1.7), Z(900, 600, 2.0)], {}, <g transform="translate(900 640)"><Baby x={0} y={0} rot={-4} /></g>, 0.4)],
  [T('not because he loved less'), undefined, (c) => deskScene(c, [faceCam(sit('adam', 35, 1700, 0.7, {pose: 'desk'}, FL + 76), 2.3), faceCam(sit('adam', 35, 1700, 0.7, {pose: 'desk'}, FL + 76), 2.9)], 35, {face: {lids: 0.35, smile: 0.25, tilt: 8, gaze: [0, 0.3]}, turn: 0}, 600, false)],
  [T('because this was the only kind of love'), undefined, (c) => deskScene(c, [Z(1500, 600, 1.3), Z(1620, 560, 1.7)], 40, {face: {...F.tired, gaze: [0, 0.6]}}, 660)],
  // ================= SAM'S HOUR =================
  [T('sam worked too'), 'w', (c) => SC.kit(c, [Z(1500, 540, 1.0), Z(1450, 520, 1.25)], {}, <>{Pe(c, {...sit('sam', 35, 1280, 0.7, {pose: 'desk', turn: 0.5, face: F.calm}, FL + 76), chair: true})}<Laptop x={1620} y={690} s={0.8} open={1} /></>)],
  [T('he closed the laptop') - 0.8, undefined, (c) => <LaptopHand t={c.l} who="sam" closeAt={0.95} />],
  [T('every evening', 1), undefined, (c) => SC.liv(c, [Z(1250, 620, 1.1), Z(1250, 600, 1.35)], {warm: true}, <>{Pe(c, sit('sam', 35, 1100, 0.62, {turn: 0.4, face: F.grin}, FL + 90))}{Pe(c, sit('max', 5, 1430, 0.62, {turn: -0.4, face: F.grin}, FL + 90))}<Blocks x={1270} y={FL + 6} n={Math.min(10, 3 + Math.floor(c.l * 1.5))} s={0.6} /></>, 0.4)],
  [T('no phone'), undefined, (c) => <PhoneDark t={c.l} light={0} />],
  [T('just the two of them'), undefined, (c) => SC.liv(c, [Z(1250, 620, 1.2), Z(1250, 600, 1.5)], {warm: true}, <>{Pe(c, sit('sam', 35, 1100, 0.62, {turn: 0.4, face: F.grin}, FL + 90))}{Pe(c, sit('max', 5, 1430, 0.62, {turn: -0.4, face: {...F.grin, wide: 0.4}}, FL + 90))}<Blocks x={1270} y={FL + 6} n={Math.min(10, 6 + Math.floor(c.l * 1.6))} s={0.6} /></>, 0.4)],
  [T('it cost him a promotion'), 'w', (c) => <PromotionLetter t={c.l} />],
  [T('his house stayed small'), undefined, (c) => SC.str(c, [Z(2150, 560, 1.4), Z(2285, 560, 2.0)], {})],
  [T('his car got old'), undefined, (c) => SC.str(c, [Z(1700, 700, 1.1), Z(1700, 700, 1.2)], {}, <OldCar x={2250} y={800} s={0.5} />)],
  [T('some months were tight'), undefined, () => <Banking t={0.05} digits="" typeFrom={99} balance="$212" />],
  [T('he never told anyone'), undefined, (c) => SC.liv(c, [Z(1250, 560, 1.3), Z(1250, 560, 1.5)], {warm: true}, <>{Pe(c, sit('sam', 35, 1100, 0.62, {turn: 0.4, face: {...F.soft, lids: 0.3}}, FL + 20))}{Pe(c, sit('max', 5, 1430, 0.62, {turn: -0.4, face: F.grin}, FL + 20))}</>, 0.4)],
  // ================= LEO TURNS FIVE =================
  [T('when leo turned five'), 'f', (c) => SC.pty(c, [Z(1700, 560, 1.0), Z(2000, 600, 1.4)], {}, <>{partyGuests(c)}{Pe(c, stand('leo', 5, 1500, 0.8, {face: F.grin, turn: 0.3}))}{Pe(c, stand('max', 5, 1250, 0.8, {face: F.smile, turn: 0.3}))}</>)],
  [T('adam missed the party'), undefined, (c) => SC.pty(c, [Z(1900, 560, 1.2), Z(2300, 600, 1.7)], {}, <>{partyGuests(c)}{Pe(c, stand('aunt', 40, 1700, 0.8, {pose: 'film', turn: -0.4, face: F.smile, top: '#2fa39a'}))}{Pe(c, stand('leo', 5, 1450, 0.8, {face: F.grin, turn: 0.3}))}</>)],
  [T('a client meeting'), undefined, (c) => deskScene(c, [Z(1700, 540, 1.3), Z(1700, 520, 1.5)], 40, {face: F.tired, pose: 'phone'}, 700)],
  [T('but he came home'), 'w', (c) => SC.pty(c, [Z(1100, 560, 1.0), Z(1250, 560, 1.2)], {}, Pe(c, stand('adam', 40, 700 + ramp(c.l, 0, 2.2) * 500, 0.85, {pose: 'carry', face: F.smile, turn: 0.5, children: <g><rect x={-55} y={-60} width={110} height={80} rx={8} fill="#c9954a" stroke="#1d1a2e" strokeWidth={4} /><rect x={-55} y={-60} width={110} height={20} fill="#e0b068" stroke="#1d1a2e" strokeWidth={3} /></g>})))],
  [T('still wrapped with a bow'), undefined, (c) => SC.pty(c, [Z(1500, 650, 2.2), Z(1500, 650, 2.6)], {}, <GiftPile x={1500} y={770} n={1} s={0.9} />)],
  [T('leo played with it'), undefined, (c) => SC.pty(c, faceCam(stand('leo', 5, 1500, 0.9), 2.4, 40), {}, Pe(c, stand('leo', 5, 1500, 0.9, {face: {smile: 1, open: 0.6, wide: 0.6, brow: 0.5}, turn: 0.1})))],
  [T('for two days'), undefined, (c) => SC.room(c, [Z(1300, 760, 2.0), Z(1250, 780, 2.4)], <g transform="translate(1180 800)"><rect x={-60} y={-24} width={120} height={36} rx={14} fill="#c0392b" stroke="#1d1a2e" strokeWidth={5} /><circle cx={-34} cy={14} r={14} fill="#2a2a32" stroke="#1d1a2e" strokeWidth={4} /><circle cx={34} cy={14} r={14} fill="#2a2a32" stroke="#1d1a2e" strokeWidth={4} /></g>)],
  // ================= THE KITE =================
  [T('max got a small paper kite'), undefined, (c) => SC.park(c, [Z(1600, 480, 2.0), Z(1600, 480, 2.6)], {season: 1}, null, <Kite x={1600} y={430} s={1.1} rot={-8} t={c.t} tail={1} />)],
  [T('sam made it himself'), 'w', (c) => SC.kit(c, [Z(1500, 560, 1.1), Z(1500, 540, 1.4)], {}, <>{Pe(c, {...sit('sam', 35, 1300, 0.7, {pose: 'desk', turn: 0.5, face: F.calm}, FL + 76), chair: true})}<Newspaper x={1620} y={700} s={1.2} fold={ramp(c.l, 1, 2)} /></>)],
  [T('out of newspaper and two sticks'), undefined, (c) => SC.kit(c, [Z(1620, 640, 2.2), Z(1620, 650, 2.6)], {}, <Newspaper x={1620} y={700} s={1.3} fold={1} />)],
  [T('it wobbled'), undefined, (c) => SC.park(c, [Z(1550, 400, 1.3), Z(1550, 430, 1.5)], {season: 1}, null, <Kite x={1560 + Math.sin(c.t * 5) * 30} y={300 + c.l * 20} s={1} rot={Math.sin(c.t * 5) * 20} t={c.t} />)],
  [T('it crashed'), undefined, (c) => SC.park(c, [Z(1550, 500, 1.4), Z(1550, 640, 1.6)], {season: 1}, null, <Kite x={1560 + c.l * 80} y={300 + c.l * 360} s={1} rot={-40 + c.l * 150} t={c.t} />)],
  [T('it was perfect'), undefined, (c) => SC.park(c, [Z(1500, 560, 1.5), Z(1500, 540, 1.8)], {season: 1}, <>{Pe(c, stand('max', 5, 1600, 0.85, {face: F.grin, turn: -0.3, pose: 'wave'}))}{Pe(c, stand('sam', 35, 1330, 0.85, {face: {...F.grin, open: 0.7}, turn: 0.3}))}</>)],
  [T('every friday that summer'), 'w', kiteShot(0)], [T('every friday that summer') + 0.9, undefined, kiteShot(1)],
  [T('they ran it down the hill'), undefined, (c) => SC.park(c, [Z(1300, 520, 1.1), Z(1800, 520, 1.2)], {season: 1}, <>{Pe(c, stand('sam', 35, 900 + c.l * 280, 0.7, {turn: 0.85, walk: c.l * 1.4, face: F.grin}))}{Pe(c, stand('max', 5, 1150 + c.l * 280, 0.7, {turn: 0.85, walk: c.l * 1.4 + 0.3, face: F.grin}))}</>, <Kite x={1500 + c.l * 280} y={280} s={0.8} rot={-10} t={c.t} />)],
  [T('it tore in august'), undefined, (c) => SC.park(c, [Z(1550, 400, 1.3), Z(1550, 430, 1.8)], {season: 1}, null, <Kite x={1560} y={260 + c.l * 24} s={1} rot={-10 + c.l * 14} torn={ramp(c.l, 0.3, 1.0)} t={c.t * 0.35} />)],
  [T('max is 30 now'), undefined, (c) => SC.tea(c, faceCam(stand('max', 30, 1700, 0.85), 2.4, 40), {season: 1, sunset: 0.2}, Pe(c, stand('max', 30, 1700, 0.85, {face: {smile: 0.5, lids: 0.15, gaze: [0.3, -0.2]}, turn: 0.2})))],
  [T('he still remembers that kite'), undefined, (c) => SC.liv(c, [Z(1000, 340, 2.8), Z(1000, 340, 1.7)], {warm: true, photoN: 1}, null, 0.1)],
  [T("he can't name a single toy"), undefined, (c) => SC.tea(c, faceCam(stand('max', 30, 1700, 0.85), 2.4, 40), {season: 1, sunset: 0.2}, <>{Pe(c, stand('max', 30, 1700, 0.85, {face: {...F.worried, gaze: [0.6, -0.5], brow: 0.5}, turn: 0.2}))}<text x={1850} y={330} fontFamily="Montserrat, sans-serif" fontWeight={800} fontSize={120} fill="#fff6e6" opacity={0.85 * ramp(c.l, 0.3, 0.8)}>?</text></>)],
  // ================= THE SCHOOL PLAY =================
  [T('the school play'), 'f', (c) => SC.aud(c, [Z(1600, 480, 1.0), Z(1600, 460, 1.15)], {curtain: 1 - ramp(c.l, 0.2, 1.1)})],
  [T('leo was a tree'), undefined, (c) => SC.aud(c, [Z(1600, 400, 1.6), Z(1600, 380, 2.0)], {}, leoTree(c, 0.62, {face: {smile: 0.5, brow: 0.3}}))],
  [T('not a big part'), undefined, (c) => SC.aud(c, [Z(1600, 360, 1.15), Z(1600, 360, 1.3)], {}, <>{leoTree(c, 0.5, {face: F.smile}, 1400)}{Pe(c, at('max', 10, 1750, 540, 0.5, {face: F.calm, turn: 0.2, top: '#e0455a'}))}</>)],
  [T('but he practiced his one line'), undefined, (c) => SC.room(c, faceCam(sit('leo', 10, 1360, 0.8, {pose: 'hold'}), 2.2, 20), Pe(c, sit('leo', 10, 1360, 0.8, {pose: 'hold', turn: 0.2, face: say(c, T('but he practiced his one line'), TE('for three weeks'), {smile: 0.2, brow: 0.3}), top: '#7a5230'})))],
  [T("adam's seat stayed empty"), undefined, (c) => SC.aud(c, [Z(1260, 800, 1.5), Z(1560, 440, 1.2)], {}, leoTree(c))],
  [T("he'd paid for the best costume"), undefined, (c) => SC.aud(c, [Z(1600, 360, 2.2), Z(1600, 350, 2.7)], {}, leoTree(c, 0.62, {face: {smile: 0.6, brow: 0.3, gaze: [Math.sin(c.t * 1.6) * 0.9, 0.3]}}))],
  [T('next time'), undefined, (c) => <Chat t={c.l} title="Leo" lines={[{side: 'them', text: 'Are you coming?', at: 0.1}, {side: 'me', text: 'Next time. I promise.', at: 0.7}]} />],
  [T('there was always a next time'), undefined, (c) => deskScene(c, [Z(1700, 540, 1.3), Z(1700, 520, 1.5)], 45, {face: F.tired, pose: 'phone'}, 700)],
  [T('sam sat in the front row'), 'w', (c) => SC.aud(c, [Z(2160, 720, 1.5), Z(2160, 700, 1.8)], {}, Pe(c, sit('sam', 45, 2160, 0.62, {pose: 'film', turn: -0.2, face: F.grin}, 1018)))],
  [T('and clapping too loud') - 0.4, undefined, (c) => SC.aud(c, [Z(2160, 720, 1.7), Z(2160, 700, 2.0)], {applause: true}, Pe(c, sit('sam', 45, 2160, 0.62, {pose: 'clap', turn: -0.2, face: {...F.grin, open: 0.6}}, 1018)))],
  [T('max pretended to be embarrassed'), undefined, (c) => SC.aud(c, [Z(1600, 380, 2.2), Z(1600, 370, 2.7)], {applause: true}, Pe(c, at('max', 10, 1600, 540, 0.62, {face: {smile: 0.7, lids: 0.3, gaze: [0.9, 0.3], brow: -0.1}, turn: 0.2})))],
  [T("and here's the thing about kids"), undefined, (c) => SC.aud(c, [Z(1600, 600, 0.95), Z(1600, 600, 1.1)], {applause: true})],
  [T("they don't count the money"), 'b', (c) => <SeatsCount t={c.l} />],
  // ================= IT'S THE TIME =================
  [T('ask any grown-up'), 'b', (c) => <GiftsToClocks t={c.l} />],
  [T('the car rides'), undefined, (c) => SC.drv(c, [Z(1600, 540, 1.0), Z(1600, 540, 1.12)], <>{Pe(c, sit('sam', 40, 1900, 0.66, {turn: 0.7, face: F.smile}, 815))}{Pe(c, sit('max', 12, 1330, 0.7, {turn: 0.7, face: F.grin}, 815))}</>)],
  [T('the walks'), undefined, (c) => SC.tea(c, [Z(1100, 560, 1.0), Z(1700, 560, 1.15)], {season: 1, sunset: 0.1}, walkers(c, [40, 10], 700, 120))],
  [T('the boring tuesday nights'), undefined, (c) => SC.liv(c, [Z(1250, 560, 1.2), Z(1250, 560, 1.35)], {warm: true}, <>{Pe(c, sit('sam', 40, 1100, 0.62, {turn: 0.4, face: F.soft}, FL + 20))}{Pe(c, sit('max', 10, 1400, 0.62, {turn: 0.4, face: F.smile}, FL + 20))}<rect x={1620} y={440} width={300} height={190} rx={14} fill="#2a3a66" stroke="#1d1a2e" strokeWidth={4} /><rect x={1636} y={456} width={268} height={158} rx={8} fill="#8fb8ff" opacity={0.65} /></>, 0.4)],
  [T('those were the moments'), 'f', (c) => SC.liv(c, [Z(1000, 380, 1.2), Z(1000, 340, 1.0)], {warm: true, photoN: 12}, null, 0.1)],
  [T("they just didn't look like it"), undefined, (c) => SC.tea(c, [Z(1700, 600, 1.3), Z(1700, 590, 1.5)], {season: 1, sunset: 0.1}, benchPair(c, [45, 14]))],
  // ================= AGE 15 =================
  [T('at 15'), 'f', (c) => SC.room(c, [Z(1400, 520, 1.2), Z(1350, 480, 1.5)], Pe(c, sit('leo', 15, 1360, 0.8, {pose: 'phone', face: {...F.calm, gaze: [0, 0.5]}, turn: 0.2})))],
  [T('the best shoes'), undefined, (c) => SC.door(c, [Z(1300, 760, 1.6), Z(1250, 740, 1.9)], {boxes: 4})],
  [T('a closed bedroom door'), undefined, (c) => SC.door(c, [Z(1700, 520, 1.0), Z(1700, 520, 1.25)], {boxes: 4})],
  [T('adam knocked once'), undefined, (c) => SC.door(c, [Z(1500, 420, 1.4), Z(1560, 420, 1.5)], {boxes: 4}, Pe(c, stand('adam', 50, 1300, 0.9, {pose: 'knock', turn: 0.8, face: F.soft})))],
  [T('need anything'), undefined, (c) => SC.door(c, faceCam(stand('adam', 50, 1300, 0.9), 2.6, 0), {boxes: 4}, Pe(c, stand('adam', 50, 1300, 0.9, {turn: 0.7, face: {...say(c, T('need anything'), TE('need anything'), {tilt: 8, brow: 0.3})}})))],
  [TE('need anything') + 0.3, undefined, (c) => SC.room(c, faceCam(sit('leo', 15, 1360, 0.8, {pose: 'phone'}), 2.3, 20), Pe(c, sit('leo', 15, 1360, 0.8, {pose: 'phone', turn: 0.2, face: {...say(c, 216.95, 217.3, {tilt: 6}), gaze: [0, 0.3]}})))],
  [T('conversation over'), undefined, (c) => SC.door(c, [Z(1500, 430, 1.3), Z(1560, 420, 1.55)], {boxes: 4}, Pe(c, stand('adam', 50, 1300, 0.9, {turn: 0.8, face: {...F.sad, gaze: [0.8, 0]}, pose: 'raise', raise: 1})))],
  [T('adam stood outside that door'), undefined, (c) => SC.door(c, [Z(1500, 430, 1.3), Z(1520, 420, 1.45)], {boxes: 4}, Pe(c, stand('adam', 50, 1300, 0.9, {turn: 0.8, face: {...F.sad, gaze: [0.8, 0]}, pose: 'raise', raise: 1})))],
  [T('he wanted to say something else'), undefined, (c) => SC.door(c, faceCam(stand('adam', 50, 1300, 0.9), 2.4, 0), {boxes: 4}, Pe(c, stand('adam', 50, 1300, 0.9, {turn: 0.7, face: {...F.worried, gaze: [0.3, -0.1]}})))],
  [T('but he had never heard'), undefined, (c) => SC.fac(c, [Z(1600, 520, 1.1), Z(1650, 520, 1.3)], Pe(c, stand('adam', 60, 1550, 0.85, {outfit: 'work', turn: 0.4, pose: 'stand', face: {...F.tired, lids: 0.4}, dim: 0.25})))],
  [T("he didn't know how it was supposed"), undefined, (c) => SC.door(c, [Z(1500, 540, 1.1), Z(1500, 540, 1.25)], {boxes: 4}, Pe(c, stand('adam', 50, 1300, 0.9, {turn: 0.8, face: F.sad})))],
  [T('so he went back to work'), 'w', (c) => deskScene(c, [Z(1700, 540, 1.3), Z(1700, 520, 1.4)], 50, {face: F.sad, pose: 'rest'}, 660)],
  // ================= MAX AND HIS FATHER =================
  [T('max and his father argued'), 'w', (c) => SC.kit(c, faceCam(stand('sam', 45, 1250, 0.8), 2.3, 30), {}, Pe(c, stand('sam', 45, 1250, 0.8, {turn: 0.5, face: {...F.angry, open: 0.3 + 0.3 * Math.abs(Math.sin(c.t * 10))}})))],
  [T('grades'), undefined, (c) => SC.kit(c, faceCam(stand('max', 16, 1950, 0.85), 2.3, 30), {}, Pe(c, stand('max', 16, 1950, 0.85, {turn: -0.5, face: {...F.angry, open: 0.3 + 0.3 * Math.abs(Math.sin(c.t * 11))}})))],
  [T('curfews'), undefined, (c) => SC.kit(c, [Z(1600, 560, 1.05), Z(1600, 540, 1.2)], {}, <>{Pe(c, stand('sam', 45, 1250, 0.8, {turn: 0.5, face: F.angry, pose: 'point'}))}{Pe(c, stand('max', 16, 1980 + ramp(c.l, 0.3, 0.7) * 120, 0.85, {turn: -0.5, face: F.angry, lean: -ramp(c.l, 0.2, 0.6) * 12}))}</>)],
  [T('but every friday'), 'w', (c) => SC.tea(c, [Z(1100, 560, 1.0), Z(1700, 560, 1.15)], {season: 1, sunset: 0.1}, walkers(c, [45, 16], 700, 120))],
  [T('they still walked to the tea stall'), undefined, (c) => SC.tea(c, [Z(1700, 600, 1.3), Z(1700, 590, 1.5)], {season: 1, sunset: 0.1}, benchPair(c, [45, 16]))],
  // ================= THE WORST NIGHT =================
  [T('one night'), undefined, (c) => SC.str(c, [Z(1600, 560, 0.95), Z(1600, 540, 1.25)], {night: true, adamLit: 1, samLit: 1})],
  [T('leo locked his door'), 'w', (c) => leoNight(c)],
  [T('max knocked on'), 'w', (c) => <Split left={leoNight(c)} right={samDoor(c)} wipe={ramp(c.l, 0, 0.8)} />],
  [T("sam didn't fix anything"), undefined, (c) => <Split left={leoNight(c)} right={stairsSm(c)} wipe={1 + ramp(c.l, 0, 1.2)} divider={1 - ramp(c.l, 0.5, 1.2)} />],
  [T('he just sat on the stairs') + 1.2, undefined, (c) => SC.stairs(c, [Z(1700, 520, 1.3), Z(1700, 500, 1.6)], <>{Pe(c, sit('sam', 50, 1800, 0.62, {turn: -0.3, face: F.soft}, 840))}{Pe(c, sit('max', 16, 2060, 0.62, {turn: -0.3, face: F.sad}, 840))}</>)],
  [T('until it was late'), undefined, (c) => <AbsoluteFill>{SC.stairs(c, [Z(1700, 500, 1.6), Z(1700, 500, 1.8)], <>{Pe(c, sit('sam', 50, 1800, 0.62, {turn: -0.3, face: F.soft}, 840))}{Pe(c, sit('max', 16, 2060, 0.62, {turn: -0.3, face: {...F.sad, lids: 0.45}}, 840))}</>)}{tint('rgba(30,50,130,.9)', 'rgba(30,50,130,.9)', ramp(c.l, 0, 2.6))}</AbsoluteFill>],
  // ================= GROWN UP =================
  [T('leo grew up successful'), 'f', (c) => SC.off(c, [Z(1600, 520, 1.0), Z(1700, 530, 1.3)], {clockMin: 480}, <>{Pe(c, sit('leo', 25, 1700, 0.7, {pose: 'desk', face: F.calm, turn: 0.1}, FL + 76))}<Laptop x={1700} y={690} s={0.9} open={1} /></>)],
  [T('he sends money home'), undefined, (c) => <LeoTransfer t={c.l} />],
  [T("that's what his father taught him"), undefined, (c) => <PhoneDark t={c.l} light={ramp(c.l, 0.1, 0.4)} />],
  [T('max grew up busy too'), 'w', (c) => SC.flat(c, faceCam(stand('max', 30, 1500, 0.85), 2.2, 20), Pe(c, stand('max', 30, 1500, 0.85, {pose: 'ear', turn: 0.3, face: {smile: 0.5, brow: 0.2, gaze: [0.3, 0]}})))],
  [T('every sunday at eight', 1), undefined, (c) => <SundayFlip t={c.l} who="sam" week={0} />],
  [T('he always picks up') - 0.2, undefined, (c) => SC.liv(c, faceCam(sit('sam', 60, LR.chairX, 0.66), 2.5, 20), {warm: true}, samAt(c, 60, {pose: 'ear', face: {smile: 1, open: 0.7 * Math.abs(Math.sin(c.t * 7)), brow: 0.3}}), 0.3)],
  [T('then last spring'), 'w', (c) => SC.hos(c, [Z(1100, 560, 1.0), faceCam(stand('leo', 30, 900, 0.85), 2.4, 100)], {track: 0.6}, Pe(c, stand('leo', 30, 900, 0.85, {pose: 'cradle', turn: 0.3, face: F.soft, children: <Baby />})))],
  [T('last month leo missed'), undefined, (c) => deskScene(c, [Z(1700, 540, 1.3), Z(1700, 520, 1.5)], 30, {face: F.tired, pose: 'phone'}, 700)],
  [T("his little boy's first birthday"), undefined, (c) => SC.pty(c, [Z(1500, 640, 1.5), Z(1500, 640, 1.7)], {}, <>{Pe(c, stand('leo', 3, 1450, 0.7, {face: F.smile, turn: 0.2, top: '#e0455a'}))}<g transform="translate(1700 700)"><rect x={-60} y={-20} width={120} height={28} rx={8} fill="#f6efe2" stroke="#1d1a2e" strokeWidth={3} /><rect x={-5} y={-50} width={10} height={32} fill="#e0455a" /></g></>)],
  [T('but he sent the biggest toy car'), undefined, (c) => SC.door(c, [Z(1500, 560, 1.1), Z(1500, 560, 1.25)], {label: 'LEO JR', boxes: 1, glow: 0.6}, <GiftPile x={1300} y={FL + 6} n={1} s={0.9} />)],
  [T('which brings us back'), 'w', (c) => SC.liv(c, [W0, Z(1620, 540, 1.1)], {giftN: 8, dust: 0.8, clockMin: 60}, adamAt(c, 65))],
  // ================= ADAM AT 65 =================
  [T('a comfortable house'), undefined, () => <Banking t={0.05} digits="" typeFrom={99} />],
  [T('and a quiet phone'), undefined, (c) => <PhoneDark t={c.l} />],
  [T('he scrolls through old photos'), undefined, (c) => SC.liv(c, [Z(1860, 520, 1.7), Z(1860, 500, 1.9)], {giftN: 8, dust: 0.8}, adamAt(c, 65, {pose: 'phone', face: {...F.calm, gaze: [0, 0.6]}}), 0.4)],
  [T("leo's birthday party"), undefined, (c) => <Gallery t={c.l} marks={[0, 1.58, 3.12]} items={[{kind: 'party', label: 'Leo’s party'}, {kind: 'play', label: 'School play'}, {kind: 'grad', label: 'Graduation'}]} />],
  [T("and adam isn't in a single one") - 0.4, undefined, (c) => <PhotoShadow t={c.l} />],
  [T('he looks down at his wrist'), undefined, (c) => SC.liv(c, faceCam(sit('adam', 65, LR.chairX, 0.66), 2.4, 20), {giftN: 8, dust: 0.9}, adamAt(c, 65, {turn: 0.15, face: {...F.sad, gaze: [0.1, 0.9]}}), 0.3)],
  [T("his father's watch"), undefined, (c) => <WatchInsert t={c.l + 2} zoom={0.85} />],
  [T('and for the first time'), undefined, (c) => SC.liv(c, faceCam(sit('adam', 65, LR.chairX, 0.66), 2.6, 20), {giftN: 8, dust: 0.9}, adamAt(c, 65, {turn: 0.15, face: {...F.sad, gaze: [0, 0.3], lids: 0.35}}), 0.3)],
  [T('what his father was really trying'), 'f', (c) => <Polaroid p={ramp(c.l, 0.2, 1.0)} caption="His twelfth birthday">{giftScene(c)}</Polaroid>],
  [T('it was never the watch'), undefined, (c) => <WatchInsert t={c.l + 4} zoom={0.8} />],
  [T('it was the time he never had'), undefined, (c) => SC.liv(c, [faceCam(sit('adam', 65, LR.chairX, 0.66), 2.6, 20), faceCam(sit('adam', 65, LR.chairX, 0.66), 3.0, 20)], {giftN: 8, dust: 0.9}, adamAt(c, 65, {turn: 0.15, face: {...F.sad, gaze: [0, 0.4]}}), 0.3)],
  // ================= SAM AT 65 =================
  [T('across the street', 1), 'w', (c) => SC.tea(c, [Z(1100, 560, 1.0), Z(1500, 560, 1.15)], {season: 2, sunset: 1}, walkers(c, [65, 30], 700, 70))],
  [T('they still go to the same tea stall'), undefined, (c) => SC.tea(c, [Z(1700, 600, 1.3), Z(1700, 590, 1.55)], {season: 2, sunset: 1}, benchPair(c, [65, 30], F.smile))],
  [T('same two cups'), undefined, (c) => SC.tea(c, [Z(1700, 650, 2.4), Z(1700, 640, 2.9)], {season: 2, sunset: 1, cups: 2})],
  [T('25 years of fridays') - 0.2, undefined, (c) => SC.tea(c, [Z(1700, 560, 1.5), Z(1600, 540, 0.95)], {season: 2, sunset: 1}, benchPair(c, [65, 30], F.smile))],
  [T('sam never got the bigger house'), undefined, (c) => SC.str(c, [Z(2150, 560, 1.4), Z(2285, 560, 1.8)], {})],
  [T('he never got the promotion'), undefined, (c) => <PromotionLetter t={c.l + 1} />],
  [T('but he has the one thing'), 'w', (c) => SC.liv(c, [Z(1800, 480, 1.4), Z(1850, 460, 1.7)], {warm: true}, samAt(c, 65, {pose: 'ear', face: {smile: 0.7, open: 0.15}}), 0.3)],
  [T('a son who calls'), undefined, (c) => <CallScreen t={c.l} name="Max" initial="M" color="#4c9a63" mode="connected" />],
  [T('not because he has to'), undefined, (c) => SC.flat(c, faceCam(stand('max', 30, 1500, 0.85), 2.2, 20), Pe(c, stand('max', 30, 1500, 0.85, {pose: 'ear', turn: 0.3, face: {smile: 0.8, brow: 0.3, gaze: [0.3, 0]}})))],
  // ================= THE CALL =================
  [T('that sunday adam picks up'), 'w', (c) => SC.liv(c, [faceCam(sit('adam', 65, LR.chairX, 0.66), 2.5, 20), faceCam(sit('adam', 65, LR.chairX, 0.66), 2.8, 20)], {giftN: 8, dust: 0.9}, adamAt(c, 65, {pose: 'phone', turn: 0.15, face: {...F.sad, gaze: [0, 0.6]}}), 0.3)],
  [T('his thumb goes'), 'f', (c) => <Banking t={c.l} to="Leo" digits="2500" typeFrom={3.5} delFrom={5.0} press={6.6} />],
  [T('and presses call') + 0.5, undefined, (c) => <CallScreen t={c.l} name="Leo" initial="L" color="#3f78c4" mode="ringing" shake={Math.max(0, 1 - c.l / 0.5) * 0.8} />],
  [ADAM_SAYS, undefined, (c) => SC.liv(c, [faceCam(sit('adam', 65, LR.chairX, 0.66), 2.5, 20), faceCam(sit('adam', 65, LR.chairX, 0.66), 2.8, 20)], {giftN: 8, dust: 0.9}, adamAt(c, 65, {pose: 'ear', turn: 0.15, face: {...say(c, ADAM_SAYS, TE("it's dad"), {tilt: 8, brow: 0.3})}}), 0.3)],
  [T('do you have time this weekend'), undefined, (c) => SC.liv(c, faceCam(sit('adam', 65, LR.chairX, 0.66), 2.6, 20), {giftN: 8, dust: 0.9}, adamAt(c, 65, {pose: 'ear', turn: 0.15, face: {...say(c, T('do you have time this weekend'), TE('this weekend'), {tilt: 8})}}), 0.3)],
  [T('not for anything'), undefined, (c) => SC.flat(c, faceCam(stand('leo', 30, 1500, 0.85), 2.2, 20), Pe(c, stand('leo', 30, 1500, 0.85, {pose: 'ear', turn: 0.3, face: {...F.soft, lids: 0.25, gaze: [0.2, 0.3]}})))],
  [T('just time') - 0.15, undefined, (c) => SC.liv(c, faceCam(sit('adam', 65, LR.chairX, 0.66), 2.6, 20), {giftN: 8, dust: 0.9}, adamAt(c, 65, {pose: 'ear', turn: 0.15, idle: 0.4, face: {...F.worried, gaze: [0, 0.2], ...say(c, T('just time'), TE('just time'))}}), 0.3)],
  [LEO_SAYS, undefined, (c) => SC.flat(c, [faceCam(stand('leo', 30, 1500, 0.85), 2.2, 20), faceCam(stand('leo', 30, 1500, 0.85), 2.6, 20)], Pe(c, stand('leo', 30, 1500, 0.85, {pose: 'ear', turn: 0.3, face: {...say(c, LEO_SAYS, 384.9, {smile: 0.5, brow: 0.3})}})))],
  [384.9, undefined, (c) => SC.liv(c, [faceCam(sit('adam', 65, LR.chairX, 0.66), 2.6, 20), faceCam(sit('adam', 65, LR.chairX, 0.66), 2.3, 20)], {giftN: 8, dust: 0.9}, adamAt(c, 65, {pose: 'ear', turn: 0.15, face: {smile: ramp(c.l, 0.1, 0.7), lids: 0.3 * ramp(c.l, 0.7, 1.0), brow: 0.3, tilt: 8}}), 0.3)],
  // ================= THAT FRIDAY =================
  [T('that friday'), 'w', (c) => SC.tea(c, [Z(1760, 560, 1.2), Z(1760, 560, 1.3)], {season: 1, cups: 5, milk: true})],
  [T('five cups on the table'), undefined, (c) => SC.tea(c, [Z(1700, 650, 2.0), Z(1760, 640, 2.4)], {season: 1, cups: 5, milk: true})],
  [T('and on the hill behind it'), 'w', (c) => SC.park(c, [Z(1500, 560, 0.95), Z(1500, 540, 1.1)], {season: 1}, <>{Pe(c, stand('adam', 65, 1250, 0.72, {turn: 0.7, face: F.smile, pose: 'point'}))}{Pe(c, stand('leo', 4, 1500, 0.6, {turn: 0.7, face: F.grin, pose: 'wave', top: '#e0455a'}))}</>)],
  [T('an old man wearing'), undefined, (c) => SC.park(c, [Z(1250, 450, 1.8), Z(1260, 430, 2.2)], {season: 1}, Pe(c, stand('adam', 65, 1250, 0.72, {turn: 0.7, face: F.smile, pose: 'point'})))],
  [T('was teaching his grandson'), undefined, (c) => SC.park(c, [Z(1450, 520, 1.3), Z(1450, 500, 1.5)], {season: 1}, <>{Pe(c, stand('adam', 65, 1250, 0.72, {turn: 0.7, face: F.smile, pose: 'point'}))}{Pe(c, stand('leo', 4, 1500, 0.6, {turn: 0.7, face: F.grin, pose: 'wave', top: '#e0455a'}))}</>, <g><path d="M 1560,470 Q 1700,380 1800,260" fill="none" stroke="#1d1a2e" strokeWidth={2.4} /><Kite x={1800} y={230} s={0.8} rot={-12 + Math.sin(c.t * 2) * 8} t={c.t} /></g>)],
  [T('how to fly a paper kite'), undefined, (c) => SC.park(c, [Z(1600, 400, 1.2), Z(1650, 360, 1.5)], {season: 1}, null, <Kite x={1760} y={260 + Math.sin(c.t * 2) * 14} s={1.1} rot={-12 + Math.sin(c.t * 2) * 8} t={c.t} />)],
  // ================= THE CLOSING WORDS =================
  [T("your children won't remember"), 'w', (c) => four(c)],
  [T("they'll remember who showed up"), undefined, (c) => <Viewfinder t={c.l} rec={false}>{four(c)}</Viewfinder>],
  [T('and one day'), undefined, (c) => SC.tea(c, [Z(1760, 580, 1.2), Z(1760, 570, 1.3)], {season: 1, cups: 5}, <>{Pe(c, sit('adam', 65, 1500, 0.6, {turn: 0.2, face: F.soft, view: 'front', pose: 'fold'}))}{Pe(c, sit('leo', 30, 1800, 0.6, {turn: -0.1, face: F.smile, view: 'front', pose: 'fold'}))}{Pe(c, stand('leo', 4, 2150, 0.5, {turn: -0.5, face: F.grin, top: '#e0455a'}))}</>)],
  [T('so whatever'), undefined, (c) => SC.tea(c, faceCam(sit('leo', 30, 1800, 0.6, {view: 'front', pose: 'fold'}), 2.0, 40), {season: 1, cups: 5}, Pe(c, sit('leo', 30, 1800, 0.6, {turn: -0.1, face: {...F.soft, gaze: [0.6, 0.3]}, view: 'front', pose: 'fold'})))],
  [T('make sure'), undefined, (c) => <WatchInsert t={c.l + 6} zoom={0.7} />],
  [T("it's never too late"), 'f', (c) => <Polaroid p={ramp(c.l, 0.3, 1.4)} caption="Friday. All of us.">{four({...c, t: 460} as Ctx)}</Polaroid>],
  [415.5, undefined, (c) => <EndCard t={c.l} />],
];
export {Clock} from './sets';
