import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Person, Baby, PersonProps, Who, bodyK} from './People';
import {Laptop, Cup, PhotoWall, GiftPile, Handset} from './props';
import {LR, FL, streetPoint} from './sets';
import {Ctx, Entry, Z, path, mixCam, stand, sit, Pe, faceCam, F, SC, Split} from './kit';
import {SundayFlip, PhoneDark, Banking, LeoTransfer, CallScreen, Gallery, PhotoShadow, Viewfinder, Polaroid, EndCard} from './inserts';
import {KW, ramp} from './fx';

// ============================================================================================
// Two Fathers, part 2: the arguments, the years, the worst night, the return, the call, Friday (215 - 490 s)
// ============================================================================================
const W0 = Z(1600, 540, 0.95);
const adamAt = (c: Ctx, age: number, o: Partial<PersonProps> = {}) => Pe(c, sit('adam', age, LR.chairX, 0.66, {turn: 0.55, face: F.calm, ...o}));
const samAt = (c: Ctx, age: number, o: Partial<PersonProps> = {}) => Pe(c, sit('sam', age, LR.chairX, 0.66, {turn: 0.55, face: F.soft, ...o}));
// a person on the street pavement: floorY is where the feet are, sc is the perspective size
const at = (who: Who, age: number, x: number, floorY: number, sc: number, o: Partial<PersonProps> = {}) => ({who, age, x, y: floorY - 350 * sc * bodyK(who, age), scale: sc, ...o});
const walkers = (c: Ctx, f: number, ages: [number, number], x0: number, sp: number, sc = 0.78, sam = true) => (
  <>{Pe(c, stand(sam ? 'sam' : 'adam', ages[0], x0 + c.l * sp, sc, {turn: 0.85, walk: c.l * 0.7, face: F.smile, handL: [-96 + Math.sin(c.l * 4.4) * 34, 70], handR: [96 - Math.sin(c.l * 4.4) * 34, 70]}))}
  {Pe(c, stand('max', ages[1], x0 + 260 + c.l * sp, sc, {turn: 0.85, walk: c.l * 0.7 + 0.25, face: F.grin, handL: [-96 + Math.sin(c.l * 4.4) * 34, 70], handR: [96 - Math.sin(c.l * 4.4) * 34, 70]}))}</>
);
const benchPair = (c: Ctx, ages: [number, number], face = F.smile, flip = false) => (
  <>{Pe(c, sit('sam', ages[0], 1620, 0.62, {turn: 0.25, face}))}{Pe(c, sit('max', ages[1], 1900, 0.62, {turn: -0.25, face: F.smile}))}</>
);
const diorama = (c: Ctx, g: number, w: number) => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #242a40 0%, #10142a 100%)'}}>
    <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}><g transform={`scale(${1 + c.p * 0.05})`}><GiftPile x={480} y={930} n={g} dust={0.1 * g / 3} s={0.9} /><PhotoWall x={1360} y={520} n={w} s={0.85} glow={0.8} /></g></svg>
  </AbsoluteFill>
);
const tint = (c: Ctx, a: string, b: string, k: number) => <AbsoluteFill style={{background: `linear-gradient(90deg, ${a}, ${b})`, opacity: k, mixBlendMode: 'soft-light', pointerEvents: 'none'}} />;

export const KW2: KW[] = [
  {at: 223.5, dur: 1.4, text: 'FIGHTS END.', style: 'big'}, {at: 224.5, dur: 2.2, text: 'WALKS CONTINUE.', style: 'big', accent: 0},
  ...[16, 17, 18, 19, 20].map((a, k): KW => ({at: 225 + k * 8, dur: 2.4, text: 'AGE ' + a, style: 'tag'})),
  {at: 285.4, dur: 3.2, text: 'THE ONE WHO WAS THERE.', style: 'big', accent: 4},
  {at: 291.0, dur: 3.0, text: 'AGE 25', style: 'tag'}, {at: 306.0, dur: 3.4, text: 'SUNDAY · 8:00 AM', style: 'time'}, {at: 313.0, dur: 3.4, text: 'AGE 65', style: 'tag'},
  {at: 344.6, dur: 4.2, text: 'HE ISN’T IN ANY OF THEM.', style: 'big'}, {at: 369.5, dur: 2.8, text: '25 YEARS OF FRIDAYS', style: 'big', accent: 0},
  {at: 386.4, dur: 2.2, text: 'SUNDAYS', style: 'time'}, {at: 428.9, dur: 2.6, text: 'NOT TO SEND MONEY.', style: 'big'},
  {at: 450.2, dur: 3.0, text: 'FRIDAY', style: 'time'}, {at: 460.4, dur: 3.8, text: 'THEY’LL REMEMBER WHO SHOWED UP.', style: 'big'},
];

// M3: Sundays at 8:00, slow-fast-slow, Sam's phone rings every week, Adam's lights only with a transfer
export const SUNDAYS: {at: number; who: 'sam' | 'adam'; week: number}[] = (() => {
  const out: {at: number; who: 'sam' | 'adam'; week: number}[] = []; let t = 386, i = 0;
  while (t < 410) { const k = (t - 386) / 24, d = 0.4 + 1.4 * Math.pow(1 - Math.sin(Math.PI * k), 2); out.push({at: t, who: i % 2 ? 'adam' : 'sam', week: i}); t += d; i++; }
  while (t < 414) { out.push({at: t, who: i % 2 ? 'adam' : 'sam', week: i}); t += 0.5; i++; }
  return out;
})();
export const sundayCount = (t: number) => Math.round(1300 * Math.pow(Math.min(1, Math.max(0, (t - 386) / 28)), 1.7));

const split = (c: Ctx, left: React.ReactNode, right: React.ReactNode, wipe: number, div = 1) => <Split left={left} right={right} wipe={wipe} divider={div} />;
const leoNight = (c: Ctx, z = 1.3) => SC.room(c, [Z(1700, 520, z), Z(1660, 500, z + 0.2)], Pe(c, sit('leo', 16, 1360, 0.8, {pose: 'phone', face: {...F.worried, gaze: [0, 0.6], smile: 0}, turn: 0.2})));
const samDoor = (c: Ctx) => SC.door(c, [Z(930, 520, 1.3), Z(940, 520, 1.45)], {label: 'DAD', boxes: 0, glow: 0}, Pe(c, stand('max', 16, 1280, 0.9, {pose: 'knock', turn: 0.8, face: F.sad})));
const stairsSm = (c: Ctx) => SC.stairs(c, [Z(1700, 520, 1.2), Z(1700, 500, 1.4)], <>{Pe(c, sit('sam', 50, 1800, 0.62, {turn: -0.3, face: F.soft}, 840))}{Pe(c, sit('max', 16, 2060, 0.62, {turn: -0.3, face: F.sad}, 840))}</>);
const friday = (c: Ctx, side: 'adam' | 'sam') => {
  const d = side === 'adam' ? streetPoint('adam', 0.74, 0.72) : streetPoint('sam', 0.74, 0.72), step = ramp(c.l, 0.8, 3.4), px = d[0] + (side === 'adam' ? 40 : -40) * step;
  const who: Who = side, base = at(who, 65, d[0] + (side === 'adam' ? 40 : -40) * step, 735 + 8 * step, 0.3 + 0.01 * step, {turn: side === 'adam' ? 0.7 : -0.7, face: F.soft});
  return SC.str(c, Z(px + (side === 'adam' ? 209 : -209), 590, 2.3), {samLit: 1}, c.l > 0.8 ? <Person t={c.t} {...base} /> : null);
};
const four = (c: Ctx, cups = 4) => SC.tea(c, [Z(1760, 580, 1.25), Z(1760, 570, 1.35)], {season: 1, cups}, <>
  {Pe(c, sit('adam', 65, 1440, 0.6, {turn: 0.2, face: F.soft}))}{Pe(c, sit('sam', 65, 1660, 0.6, {turn: 0.1, face: F.smile}))}{Pe(c, sit('leo', 30, 1880, 0.6, {turn: -0.1, face: F.smile}))}{Pe(c, sit('max', 30, 2100, 0.6, {turn: -0.2, face: F.grin}))}</>);

export const LIST2: Entry[] = [
  // ---------------- Max and his father argue; Fridays continue ----------------
  [215.0, undefined, (c) => SC.kit(c, faceCam(stand('sam', 45, 1250, 0.8), 2.3, 30), {}, Pe(c, stand('sam', 45, 1250, 0.8, {turn: 0.5, face: {...F.angry, open: 0.3 + 0.3 * Math.abs(Math.sin(c.t * 10))}})))],
  [216.4, undefined, (c) => SC.kit(c, faceCam(stand('max', 16, 1950, 0.85), 2.3, 30), {}, Pe(c, stand('max', 16, 1950, 0.85, {turn: -0.5, face: {...F.angry, open: 0.3 + 0.3 * Math.abs(Math.sin(c.t * 11))}})))],
  [217.6, undefined, (c) => SC.kit(c, [Z(1600, 560, 1.05), Z(1600, 540, 1.2)], {}, <>{Pe(c, stand('sam', 45, 1250, 0.8, {turn: 0.5, face: F.angry, handR: [150, -220]}))}{Pe(c, stand('max', 16 + 0, 1980 + ramp(c.l, 0.3, 0.7) * 120, 0.85, {turn: -0.5, face: F.angry, lean: -ramp(c.l, 0.2, 0.6) * 12}))}</>)],
  [219.0, undefined, (c) => SC.kit(c, faceCam(sit('sam', 45, 1250, 0.7, {}, FL + 20), 2.0, 40), {}, Pe(c, sit('sam', 45, 1250, 0.7, {turn: 0.4, face: {...F.sad, lids: 0.45}}, FL + 20)))],
  [220.6, 'w', (c) => SC.tea(c, [Z(1100, 560, 1.0), Z(1700, 560, 1.15)], {season: 1, sunset: 0.1}, walkers(c, 0, [45, 16], 700, 120))],
  [223.5, undefined, (c) => SC.tea(c, [Z(1700, 600, 1.3), Z(1700, 590, 1.5)], {season: 1, sunset: 0.1}, benchPair(c, [45, 16]))],
  // ---------------- M2 years: age match cuts every 2 s ----------------
  ...[0, 1, 2, 3, 4].flatMap((k): Entry[] => {
    const b = 225 + k * 8, ageM = 16 + k, ageS = 45 + k, season = [0, 1, 2, 3, 0][k];
    const beats: ((c: Ctx) => React.ReactNode)[] = [
      (c) => SC.tea(c, faceCam(sit('max', ageM, 1900, 0.62), 2.2, 30), {season}, benchPair(c, [ageS, ageM], F.grin)),
      null as any,
      (c) => SC.kit(c, [Z(1500, 540, 1.3), Z(1500, 540, 1.5)], {}, <>{Pe(c, stand('max', ageM, 1500, 0.85, {turn: 0.3, face: F.smile, handR: [40, -330]}))}{Pe(c, stand('sam', ageS, 1900, 0.8, {turn: -0.4, face: {...F.grin, open: 0.7}}))}</>),
      (c) => SC.aud(c, [Z(1180, 780, 1.5), Z(1180, 780, 1.8)], {tag: 'PARENTS’ EVENING'}),
      (c) => SC.aud(c, [Z(1500, 520, 1.3), Z(1500, 520, 1.5)], {}, <>{Pe(c, stand('leo', ageM, 1500, 0.9, {turn: 0.2, face: F.smile, handR: [70, -330], handL: [-70, -330]}))}{Pe(c, stand('aunt', 45, 1900, 0.85, {pose: 'film', turn: -0.4, face: F.smile}))}</>),
    ];
    const beat = [beats[0], beats[2], beats[4], beats[3], beats[0]][k];
    return [
      [b, 'w', (c) => SC.tea(c, [Z(1500, 560, 1.15), Z(1520, 560, 1.3)], {season}, benchPair(c, [ageS, ageM]))],
      [b + 2, undefined, (c) => SC.door(c, [Z(1500, 600, 1.3), Z(1500, 560, 1.5)], {boxes: 3 + k, glow: k === 4 ? 1.3 * (1 - ramp(c.l, 1.8, 2.0)) : 1.3})],
      [b + 4, undefined, beat],
      [b + 6, undefined, (c) => diorama(c, 2 + k, 2 + 2 * k)],
    ];
  }),
  // ---------------- the worst night: split screen #1 ----------------
  [265.0, undefined, (c) => split(c, leoNight(c), samDoor(c), ramp(c.l, 0, 1.0))],
  [274.0, undefined, (c) => <AbsoluteFill>{split(c, leoNight(c), stairsSm(c), 1)}{tint(c, 'rgba(40,70,160,.9)', 'rgba(255,170,70,.9)', ramp(c.l, 0, 7))}</AbsoluteFill>],
  [282.0, undefined, (c) => split(c, leoNight(c), stairsSm(c), 1 + ramp(c.l, 0, 1.4), 1 - ramp(c.l, 0.6, 1.4))],
  [287.0, undefined, (c) => SC.room(c, [faceCam(sit('leo', 16, 1360, 0.8), 2.5, 20), Z(1600, 540, 0.95)], Pe(c, sit('leo', 16, 1360, 0.8, {pose: 'phone', face: {...F.sad, gaze: [0, 0.6]}, turn: 0.2})))],
  // ---------------- AGE 25 ----------------
  [291.0, 'f', (c) => SC.off(c, [Z(1600, 520, 1.0), Z(1700, 530, 1.3)], {clockMin: 480}, <>{Pe(c, sit('leo', 25, 1700, 0.7, {pose: 'desk', face: F.calm, turn: 0.1}, FL + 20))}<Laptop x={1700} y={690} s={0.9} open={1} /></>)],
  [294.0, undefined, (c) => <LeoTransfer t={c.l} />],
  [297.0, undefined, (c) => <PhoneDark t={c.l} light={ramp(c.l, 0.1, 0.4)} />],
  [299.7, undefined, (c) => <SundayFlip t={c.l} who="sam" week={0} />],
  [302.4, undefined, (c) => SC.liv(c, [Z(1800, 480, 1.4), Z(1850, 460, 1.7)], {warm: true}, samAt(c, 60, {pose: 'ear', face: {smile: 0.6, open: 0.15}, children: <Handset glow={0.4} />}), 0.5)],
  [306.0, undefined, (c) => SC.liv(c, faceCam(sit('sam', 60, LR.chairX, 0.66), 2.5, 20), {warm: true}, samAt(c, 60, {pose: 'ear', face: {smile: 1, open: 0.7 * Math.abs(Math.sin(c.t * 7)), brow: 0.3}, children: <Handset glow={0.4} />}), 0.4)],
  [309.0, undefined, (c) => SC.liv(c, [Z(1500, 650, 2.2), Z(1500, 650, 2.6)], {}, null, 0.3)],
  // ---------------- the bridge to 65: the room ages, the pile reaches the ceiling, it lands on the cold-open frame ----------------
  [312.0, 'w', (c) => SC.liv(c, W0, {giftN: 4 + 4 * ramp(c.l, 0, 8), dust: 0.15 + 0.7 * ramp(c.l, 0, 9), clockMin: c.l < 8.8 ? c.l * 150 : 59, night: c.l < 8.6 && (c.l * 1.15) % 1 > 0.62}, adamAt(c, 40 + 25 * ramp(c.l, 0, 9)))],
  [322.0, undefined, (c) => SC.liv(c, [W0, Z(1620, 540, 1.1)], {giftN: 8, dust: 0.8, clockMin: 60}, adamAt(c, 65))],
  [324.4, undefined, (c) => <Banking t={0.05} digits="" typeFrom={99} />],
  [326.5, undefined, (c) => <PhoneDark t={c.l} />],
  [327.3, undefined, (c) => SC.liv(c, [Z(1860, 520, 1.7), Z(1860, 500, 1.9)], {giftN: 8, dust: 0.8}, adamAt(c, 65, {pose: 'phone', face: {...F.calm, gaze: [0, 0.6]}}), 0.5)],
  [329.5, undefined, (c) => <Gallery t={c.l} marks={[0, 1.7, 3.2, 8.5]} items={[{kind: 'party', label: 'Leo’s party'}, {kind: 'play', label: 'School play'}, {kind: 'grad', label: 'Graduation'}, {kind: 'wedding', label: 'Wedding'}]} />],
  [344.0, undefined, (c) => <PhotoShadow t={c.l} />],
  [350.5, undefined, (c) => SC.liv(c, [faceCam(sit('adam', 65, LR.chairX, 0.66), 2.7, 20), faceCam(sit('adam', 65, LR.chairX, 0.66), 3.0, 20)], {giftN: 8, dust: 0.8}, adamAt(c, 65, {pose: 'phone', turn: 0.15, face: {lids: 0.4 + 0.2 * ramp(c.l, 0, 4), tilt: 10, brow: -0.2, gaze: [0, 0.5]}}), 0.3)],
  [355.0, undefined, (c) => SC.liv(c, [faceCam(sit('adam', 65, LR.chairX, 0.66), 2.6, 20), Z(1000, 520, 0.95)], {giftN: 8, dust: 0.9}, adamAt(c, 65, {turn: 0.15, face: {...F.sad, gaze: [0, 0.4]}}), 0.8)],
  // ---------------- Sam at 65: the same bench ----------------
  [362.0, 'w', (c) => SC.tea(c, [Z(1100, 560, 1.0), Z(1500, 560, 1.15)], {season: 2, sunset: 1}, walkers(c, 0, [65, 30], 700, 70))],
  [367.3, undefined, (c) => SC.tea(c, [Z(1700, 600, 1.3), Z(1700, 590, 1.55)], {season: 2, sunset: 1}, benchPair(c, [65, 30], F.smile))],
  [369.4, undefined, (c) => SC.tea(c, [Z(1700, 560, 1.5), Z(1600, 540, 0.95)], {season: 2, sunset: 1}, benchPair(c, [65, 30], F.smile))],
  [371.0, undefined, (c) => SC.liv(c, [Z(620, 330, 1.7), Z(1400, 330, 1.7)], {warm: true, photoN: 12}, null, 0.3)],
  [381.0, undefined, (c) => SC.tea(c, [Z(1700, 650, 2.4), Z(1700, 640, 2.9)], {season: 2, sunset: 1, cups: 2})],
  // ---------------- M3 Sundays ----------------
  ...SUNDAYS.map((s): Entry => [s.at, s.at === 386 ? 'w' : undefined, (c) => <SundayFlip t={c.l} who={s.who} week={s.week} notify={s.who === 'adam' && s.week % 4 === 1} />]),
  [414.0, undefined, (c) => SC.liv(c, [faceCam(sit('adam', 65, LR.chairX, 0.66), 2.4, 20), faceCam(sit('adam', 65, LR.chairX, 0.66), 2.7, 20)], {giftN: 8, dust: 0.9}, adamAt(c, 65, {pose: 'phone', turn: 0.15, face: {...F.sad, gaze: [0, 0.6]}}), 0.3)],
  // ---------------- the call ----------------
  [416.0, undefined, (c) => <Banking t={c.l} to="Leo" digits="2500" typeFrom={0.6} delFrom={3.6} press={7.0} />],
  [423.3, undefined, (c) => <CallScreen t={c.l} name="Leo" initial="L" color="#3f78c4" mode="ringing" shake={Math.max(0, 1 - c.l / 0.6) * 0.8} />],
  // ---------------- "Leo, do you have time this weekend?" ----------------
  [426.0, undefined, (c) => SC.liv(c, [faceCam(sit('adam', 65, LR.chairX, 0.66), 2.5, 20), faceCam(sit('adam', 65, LR.chairX, 0.66), 2.8, 20)], {giftN: 8, dust: 0.9}, adamAt(c, 65, {pose: 'ear', turn: 0.15, face: {...F.sad, gaze: [0, 0.2]}, children: <Handset />}), 0.3)],
  [429.7, undefined, (c) => SC.flat(c, [Z(1600, 520, 1.0), Z(1600, 520, 1.25)])],
  [431.2, undefined, (c) => SC.liv(c, faceCam(sit('adam', 65, LR.chairX, 0.66), 2.6, 20), {giftN: 8, dust: 0.9}, adamAt(c, 65, {pose: 'ear', turn: 0.15, face: {...F.talk(c.t), tilt: 8, brow: 0.3}, children: <Handset />}), 0.3)],
  [434.2, undefined, (c) => SC.flat(c, [Z(1600, 600, 1.4), Z(1600, 600, 1.6)])],
  [435.5, undefined, (c) => SC.liv(c, faceCam(sit('adam', 65, LR.chairX, 0.66), 2.6, 20), {giftN: 8, dust: 0.9}, adamAt(c, 65, {pose: 'ear', turn: 0.15, face: {...F.talk(c.t), tilt: 8}, children: <Handset />}), 0.3)],
  [437.0, undefined, (c) => SC.liv(c, faceCam(sit('adam', 65, LR.chairX, 0.66), 2.6, 20), {giftN: 8, dust: 0.9}, adamAt(c, 65, {pose: 'ear', turn: 0.15, idle: 0, face: {...F.worried, gaze: [0, 0.2]}, children: <Handset />}), 0.3)],
  [440.0, undefined, (c) => SC.liv(c, faceCam(sit('adam', 65, LR.chairX, 0.66), 2.6, 20), {giftN: 8, dust: 0.9}, adamAt(c, 65, {pose: 'ear', turn: 0.15, face: {smile: ramp(c.l, 0.6, 1.6), lids: 0.3 * ramp(c.l, 1.2, 2.0), brow: 0.3, tilt: 8}, children: <Handset />}), 0.3)],
  [442.0, undefined, (c) => SC.liv(c, [faceCam(sit('adam', 65, LR.chairX, 0.66), 2.6, 20), Z(1700, 540, 1.0)], {giftN: 8, dust: 0.9}, adamAt(c, 65, {pose: 'ear', turn: 0.3, lean: -10 * ramp(c.l, 1, 4), face: {smile: 0.7, lids: 0.35}, children: <Handset />}), 0.5)],
  // ---------------- Friday: split screen #2, then one street ----------------
  [450.0, undefined, (c) => split(c, friday(c, 'adam'), friday(c, 'sam'), ramp(c.l, 0, 0.8), 1 - ramp(c.l, 2.8, 3.6))],
  [454.0, undefined, (c) => {
    const k = ramp(c.l, 0, 4), a = streetPoint('adam', 0.74, 0.72), b = streetPoint('sam', 0.74, 0.72);
    const pa = at('adam', 65, a[0] + (1560 - a[0]) * k, 735 + (650 - 735) * k, 0.3 - 0.15 * k, {turn: 0.8, walk: c.l * 0.7, face: F.soft});
    const pb = at('sam', 65, b[0] + (1650 - b[0]) * k, 735 + (650 - 735) * k, 0.3 - 0.15 * k, {turn: -0.8, walk: c.l * 0.7 + 0.3, face: F.smile});
    return SC.str(c, [Z(1600, 600, 1.0), Z(1600, 570, 1.25)], {stall: true, samLit: 1}, <><Person t={c.t} {...pa} /><Person t={c.t} {...pb} /></>);
  }],
  [458.0, undefined, (c) => four(c)],
  [461.0, undefined, (c) => <Viewfinder t={c.l} rec={false} shutter={c.l > 5 ? 0 : 0}>{four(c)}</Viewfinder>],
  // ---------------- the photo ----------------
  [466.0, 'f', (c) => <Polaroid p={ramp(c.l, 0.3, 2.2)} caption="Friday. All four.">{four({...c, t: 460} as Ctx)}</Polaroid>],
  [468.8, undefined, (c) => (
    <AbsoluteFill>
      {SC.liv(c, [Z(1000, 340, 1.5), Z(1000, 330, 1.3)], {warm: true, photoN: 12}, null, 0.3)}
      <div style={{position: 'absolute', left: 960 + (1 - ramp(c.l, 0.2, 2.2)) * 0, top: 540, width: 330, height: 280, marginLeft: -165 + (1 - ramp(c.l, 0.2, 2.2)) * 0, marginTop: -140 - ramp(c.l, 0.2, 2.2) * 150, transform: `rotate(${-3 + (1 - ramp(c.l, 0.2, 2.2)) * 6}deg) scale(${1.5 - 0.5 * ramp(c.l, 0.2, 2.2)})`, background: '#fbf5e8', border: '3px solid #3a2a26', boxShadow: '0 14px 26px rgba(0,0,0,.45)', opacity: ramp(c.l, 0, 0.3)}} />
    </AbsoluteFill>
  )],
  [472.5, undefined, (c) => SC.str(c, [Z(1600, 700, 1.9), Z(1600, 440, 0.9)], {stall: true, samLit: 1, adamLit: 1})],
  [478.0, undefined, (c) => <EndCard t={c.l} />],
];
export {PhoneDark, Baby, Cup, path, mixCam};
