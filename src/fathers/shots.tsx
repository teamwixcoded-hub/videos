import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Baby, PersonProps, Who, bodyK, Person} from './People';
import {Laptop, Kite, GiftPile, Handset} from './props';
import {LR, FL, streetPoint} from './sets';
import {Ctx, Entry, Z, path, stand, sit, Pe, faceCam, F, SC, Split} from './kit';
import {ClockInsert, LaptopHand, Payslip, PromotionLetter, Chat, GiftsToClocks, PhoneDark, SundayFlip, Banking, LeoTransfer, CallScreen, Gallery, PhotoShadow, Viewfinder, Polaroid, EndCard} from './inserts';
import {KW, ramp} from './fx';

// ============================================================================================
// TWO FATHERS: the shot list, timed to the recording (video time = recording time, 0 - 216.5 s). Every shot starts on a phrase of the narration
// (see data/narration.srt) and each phrase has its own picture; nothing is stretched. [startSec, fx ('w' whip, 'f' photo flash, 'b' bridge), renderer].
// ============================================================================================
export const END = 219.5;
const W0 = Z(1600, 540, 0.95);
const adamAt = (c: Ctx, age: number, o: Partial<PersonProps> = {}) => Pe(c, sit('adam', age, LR.chairX, 0.66, {turn: 0.55, face: F.calm, ...o}));
const samAt = (c: Ctx, age: number, o: Partial<PersonProps> = {}) => Pe(c, sit('sam', age, LR.chairX, 0.66, {turn: 0.55, face: F.soft, ...o}));
const adamFace = (age = 65) => faceCam(sit('adam', age, LR.chairX, 0.66), 2.5, 20);
const doorA = streetPoint('adam', 0.74, 0.72), doorS = streetPoint('sam', 0.74, 0.72);
const at = (who: Who, age: number, x: number, floorY: number, sc: number, o: Partial<PersonProps> = {}) => ({who, age, x, y: floorY - 425 * sc * bodyK(who, age) * 0.85, scale: sc, ...o});

const hosp = (c: Ctx, cam: Parameters<typeof SC.hos>[1], track: number, who: 'adam' | 'sam', face = F.soft, grip = 0, sc = 0.85) => {
  const x = who === 'adam' ? 900 : 2300;
  return SC.hos(c, cam, {track}, Pe(c, stand(who, 35, x, sc, {pose: 'cradle', turn: who === 'adam' ? 0.3 : -0.3, face, children: <Baby grip={grip} />})));
};
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
  <>{Pe(c, sit('sam', ages[0], 1620, 0.62, {turn: 0.25, face, view: 'front', pose: 'fold'}))}{Pe(c, sit('max', ages[1], 1900, 0.62, {turn: -0.25, face: F.smile, view: 'front', pose: 'fold'}))}</>
);
const four = (c: Ctx, cups = 4) => SC.tea(c, [Z(1760, 580, 1.25), Z(1760, 570, 1.35)], {season: 1, cups}, <>
  {Pe(c, sit('adam', 65, 1440, 0.6, {turn: 0.2, face: F.soft, view: 'front', pose: 'fold'}))}{Pe(c, sit('sam', 65, 1660, 0.6, {turn: 0.1, face: F.smile, view: 'front', pose: 'fold'}))}
  {Pe(c, sit('leo', 30, 1880, 0.6, {turn: -0.1, face: F.smile, view: 'front', pose: 'fold'}))}{Pe(c, sit('max', 30, 2100, 0.6, {turn: -0.2, face: F.grin, view: 'front', pose: 'fold'}))}</>);
const tint = (a: string, b: string, k: number) => <AbsoluteFill style={{background: `linear-gradient(90deg, ${a}, ${b})`, opacity: k, mixBlendMode: 'soft-light', pointerEvents: 'none'}} />;
const leoNight = (c: Ctx, z = 1.3) => SC.room(c, [Z(1700, 520, z), Z(1660, 500, z + 0.2)], Pe(c, sit('leo', 16, 1360, 0.8, {pose: 'phone', face: {...F.worried, gaze: [0, 0.6], smile: 0}, turn: 0.2})));
const samDoor = (c: Ctx) => SC.door(c, [Z(930, 520, 1.3), Z(940, 520, 1.45)], {label: 'DAD', boxes: 0, glow: 0}, Pe(c, stand('max', 16, 1280, 0.9, {pose: 'knock', turn: 0.8, face: F.sad})));
const stairsSm = (c: Ctx) => SC.stairs(c, [Z(1700, 520, 1.2), Z(1700, 500, 1.4)], <>{Pe(c, sit('sam', 50, 1800, 0.62, {turn: -0.3, face: F.soft}, 840))}{Pe(c, sit('max', 16, 2060, 0.62, {turn: -0.3, face: F.sad}, 840))}</>);
const friday = (c: Ctx, side: 'adam' | 'sam') => {
  const d = side === 'adam' ? doorA : doorS, step = ramp(c.l, 0.5, 2.0), px = d[0] + (side === 'adam' ? 40 : -40) * step;
  const p = at(side, 65, px, 735 + 8 * step, 0.3 + 0.01 * step, {turn: side === 'adam' ? 0.7 : -0.7, face: F.soft});
  return SC.str(c, Z(px + (side === 'adam' ? 209 : -209), 590, 2.3), {samLit: 1}, c.l > 0.5 ? <Person t={c.t} {...p} /> : null);
};

export const KWORDS: KW[] = [
  {at: 0.12, dur: 1.5, text: 'TWO FATHERS', style: 'big', accent: 1}, {at: 1.66, dur: 1.2, text: 'SAME STREET', style: 'big'}, {at: 2.96, dur: 1.2, text: 'SAME SALARY', style: 'big'}, {at: 4.54, dur: 1.7, text: 'SAME LOVE.', style: 'big', accent: 1},
  {at: 8.1, dur: 1.5, text: 'MONEY.', style: 'big'}, {at: 12.9, dur: 1.6, text: 'TIME.', style: 'big', accent: 0},
  {at: 17.1, dur: 1.5, text: 'ONLY ONE RINGS.', style: 'big'},
  {at: 27.2, dur: 2.8, text: '“You’ll have a better life than I did.”', style: 'quote'},
  {at: 31.4, dur: 1.9, text: '6:00 PM', style: 'time'}, {at: 35.0, dur: 2.0, text: 'EXTRA SHIFTS · WEEKENDS', style: 'big'}, {at: 37.8, dur: 1.5, text: 'MONEY.', style: 'big'},
  {at: 51.7, dur: 1.7, text: 'TIME.', style: 'big', accent: 0}, {at: 53.7, dur: 1.9, text: '6:00 PM → 1 HOUR', style: 'time'},
  {at: 58.9, dur: 2.2, text: 'AGE 5', style: 'tag'}, {at: 71.2, dur: 1.8, text: 'FRIDAY', style: 'time'}, {at: 81.2, dur: 2.2, text: 'AGE 10', style: 'tag'}, {at: 88.5, dur: 1.4, text: 'NEXT TIME.', style: 'big'},
  {at: 104.6, dur: 1.8, text: 'IT’S RARELY THE GIFTS.', style: 'big'}, {at: 106.3, dur: 1.9, text: 'IT’S THE TIME.', style: 'big', accent: 2},
  {at: 107.7, dur: 2.2, text: 'AGE 15', style: 'tag'}, {at: 120.5, dur: 1.9, text: 'SAY SOMETHING.', style: 'big'},
  {at: 130.9, dur: 1.2, text: 'FIGHTS END.', style: 'big'}, {at: 131.9, dur: 1.9, text: 'WALKS CONTINUE.', style: 'big', accent: 0},
  {at: 146.4, dur: 2.4, text: 'THE ONE WHO WAS THERE.', style: 'big', accent: 4},
  {at: 149.8, dur: 2.2, text: 'AGE 25', style: 'tag'}, {at: 158.6, dur: 2.4, text: 'SUNDAY · 8:00 AM', style: 'time'}, {at: 165.9, dur: 2.2, text: 'AGE 65', style: 'tag'},
  {at: 180.0, dur: 2.6, text: 'HE ISN’T IN ANY OF THEM.', style: 'big'}, {at: 190.2, dur: 2.2, text: '25 YEARS OF FRIDAYS', style: 'big', accent: 0},
  {at: 195.1, dur: 1.8, text: 'NOT TO SEND MONEY.', style: 'big'}, {at: 208.5, dur: 1.9, text: 'FRIDAY', style: 'time'}, {at: 212.9, dur: 2.6, text: 'THEY’LL REMEMBER WHO SHOWED UP.', style: 'big'},
];

export const LIST: Entry[] = [
  // ---- "Two fathers, same street, same salary, same love for their sons." ----
  [0.0, undefined, (c) => SC.str(c, [Z(1600, 560, 0.95), Z(1600, 540, 1.14)], {})],
  [1.3, 'w', (c) => SC.str(c, [Z(doorA[0] + 80, 540, 1.3), Z(doorA[0], 580, 2.2)], {})],
  [2.0, undefined, (c) => SC.str(c, [Z(doorS[0] - 80, 540, 1.3), Z(doorS[0], 580, 2.2)], {})],
  [2.7, undefined, (c) => <Payslip t={c.l} who="adam" />],
  [3.5, undefined, (c) => <Payslip t={c.l} who="sam" />],
  [4.3, undefined, (c) => SC.liv(c, [Z(1950, 470, 1.5), Z(1980, 450, 1.7)], {}, adamAt(c, 65, {face: F.sad}), 0.5)],
  [5.3, undefined, (c) => SC.liv(c, [Z(1950, 470, 1.5), Z(1980, 450, 1.7)], {warm: true}, samAt(c, 65, {face: F.soft}), 0.5)],
  // ---- one gave everything money could buy / the other gave something cheaper and much harder to give ----
  [6.6, 'b', (c) => SC.liv(c, [Z(330, 800, 1.6), Z(330, 210, 1.6)], {giftN: 8, dust: 0.65}, null, 0.4)],
  [9.8, 'b', (c) => SC.liv(c, [Z(1000, 380, 1.25), Z(1000, 330, 1.05)], {warm: true, photoN: 12}, null, 0.4)],
  [12.4, undefined, (c) => SC.liv(c, [Z(1000, 330, 2.4), Z(1000, 330, 3.2)], {warm: true, photoN: 12}, null, 0.3)],
  // ---- Twenty years later, only one of them gets a phone call on Sunday ----
  [14.4, undefined, (c) => {
    const cam = path(c.l, [[0, Z(1500, 650, 2.4)], [1.1, Z(1500, 640, 2.1)], [2.0, Z(1750, 450, 1.5)], [3.1, Z(2430, 360, 1.85)], [4.1, Z(2430, 360, 1.95)]]);
    const blur = c.l < 1.8 ? 0.5 : c.l < 3.1 ? 0.5 - 0.35 * ramp(c.l, 1.8, 3.1) : 0.15;
    return SC.liv(c, cam, {clockMin: 60, samAnswer: c.l > 2.5 ? 1 : 0}, adamAt(c, 65, {face: {...F.calm, gaze: [0.7, 0]}}), blur);
  }],
  [18.5, undefined, () => null],   // the rewind card is drawn by the main comp (18.5 - 19.8)
  // ---- Both boys were born the same winter. Both fathers held them in the same hospital corridor ----
  [19.8, undefined, (c) => SC.hos(c, [Z(1600, 520, 0.95), Z(1600, 520, 1.45)], {track: c.p}, <>{Pe(c, stand('adam', 35, 640 + Math.sin(c.t * 0.9) * 60, 0.78, {turn: 0.45, pose: 'fold', face: F.worried}))}{Pe(c, stand('sam', 35, 2560, 0.78, {turn: -0.45, pose: 'fold', face: F.soft}))}</>)],
  [21.8, undefined, (c) => hosp(c, [Z(960, 560, 1.2), Z(920, 520, 1.5)], 0.6, 'adam')],
  [24.0, undefined, (c) => hosp(c, [Z(2260, 560, 1.2), Z(2300, 520, 1.5)], 0.6, 'sam')],
  [26.3, undefined, (c) => hosp(c, [Z(1100, 560, 0.95), faceCam(stand('adam', 35, 900, 0.85), 2.7, 100)], 0.6, 'adam', {...F.soft, gaze: [0, 0.4]})],
  [28.3, undefined, (c) => hosp(c, [Z(2100, 560, 0.95), faceCam(stand('sam', 35, 2300, 0.85), 2.7, 100)], 0.6, 'sam', {...F.soft, smile: 0.5, gaze: [0, 0.4]})],
  [30.2, undefined, (c) => hosp(c, [Z(900, 560, 2.2), Z(850, 540, 3.4)], 0.6, 'adam', F.soft, ramp(c.l, 0.2, 0.9))],
  // ---- Adam decided the best way to keep that promise was to work ----
  [31.3, 'f', (c) => <ClockInsert t={c.l} min={660} />],
  [32.5, undefined, (c) => <LaptopHand t={c.l} who="adam" />],
  [33.8, undefined, (c) => deskScene(c, [Z(1600, 520, 1.0), Z(1700, 540, 1.25)], 35)],
  [35.2, undefined, (c) => deskScene(c, [Z(1750, 500, 1.4), Z(1700, 480, 1.2)], 35, {face: {...F.tired, gaze: [0, 0.5]}, tilt: 3}, 120)],
  [36.8, 'w', (c) => <Payslip t={c.l} who="adam" />],
  [37.6, undefined, (c) => SC.liv(c, [Z(900, 620, 1.7), Z(900, 600, 2.0)], {}, <g transform="translate(900 640)"><Baby x={0} y={0} rot={-4} /></g>)],
  [38.9, undefined, (c) => deskScene(c, faceCam(sit('adam', 35, 1700, 0.7, {pose: 'desk'}, FL + 76), 2.1), 35, {face: {...F.tired, gaze: [0, 0.5]}}, 330)],
  [40.6, undefined, (c) => deskScene(c, [faceCam(sit('adam', 35, 1700, 0.7, {pose: 'desk'}, FL + 76), 2.3), faceCam(sit('adam', 35, 1700, 0.7, {pose: 'desk'}, FL + 76), 2.9)], 35, {face: {lids: 0.35, smile: 0.25, tilt: 8, gaze: [0, 0.3]}, turn: 0}, 600, false)],
  [43.4, undefined, (c) => deskScene(c, [Z(1500, 600, 1.3), Z(1620, 560, 1.7)], 40, {face: {...F.tired, gaze: [0, 0.6]}}, 660)],
  // ---- Sam worked too, but at six o'clock he closed the laptop ----
  [46.9, undefined, (c) => SC.kit(c, [Z(1500, 540, 1.0), Z(1450, 520, 1.25)], {}, <>{Pe(c, sit('sam', 35, 1280, 0.7, {pose: 'desk', turn: 0.5, face: F.calm}, FL + 76))}<Laptop x={1620} y={690} s={0.8} open={1} /></>)],
  [49.4, undefined, (c) => <LaptopHand t={c.l} who="sam" closeAt={0.95} />],
  [51.4, undefined, (c) => SC.liv(c, [Z(900, 520, 1.1), Z(900, 500, 1.35)], {warm: true}, Pe(c, sit('sam', 35, 900, 0.62, {pose: 'cradle', turn: 0.3, face: F.soft, children: <Baby grip={0.5} />})))],
  [53.6, undefined, (c) => <ClockInsert t={c.l} min={660 + c.l * 40} tone="warm" />],
  [54.7, undefined, (c) => <PromotionLetter t={c.l} />],
  // ---- AGE 5: the party ----
  [58.9, 'f', (c) => SC.pty(c, [Z(1700, 560, 1.0), Z(2000, 600, 1.4)], {}, <>{Pe(c, stand('leo', 5, 1500, 0.8, {face: F.grin, turn: 0.3}))}{Pe(c, stand('max', 5, 1250, 0.8, {face: F.smile, turn: 0.3}))}</>)],
  [61.0, undefined, (c) => SC.pty(c, [Z(1900, 560, 1.2), Z(2300, 600, 1.7)], {}, <>{Pe(c, stand('aunt', 40, 1700, 0.8, {pose: 'film', turn: -0.4, face: F.smile}))}{Pe(c, stand('leo', 5, 1450, 0.8, {face: F.grin, turn: 0.3}))}</>)],
  [63.2, 'w', (c) => SC.pty(c, [Z(1100, 560, 1.0), Z(1250, 560, 1.2)], {}, Pe(c, stand('adam', 40, 700 + ramp(c.l, 0, 1.6) * 500, 0.85, {pose: 'carry', face: F.smile, turn: 0.5, children: <GiftPile x={0} y={0} n={1} s={0.5} />})))],
  [65.0, undefined, (c) => SC.pty(c, faceCam(stand('leo', 5, 1500, 0.9), 2.4, 40), {}, Pe(c, stand('leo', 5, 1500, 0.9, {face: {smile: 1, open: 0.6, wide: 0.6, brow: 0.5}, turn: 0.1})))],
  [66.6, undefined, (c) => SC.pty(c, [Z(1500, 650, 2.2), Z(1500, 650, 2.6)], {}, <GiftPile x={1500} y={770} n={1} s={0.9} />)],
  [67.7, undefined, (c) => SC.pty(c, faceCam(stand('leo', 5, 1500, 0.9), 2.4, 40), {}, Pe(c, stand('leo', 5, 1500, 0.9, {face: F.grin, turn: -0.1})))],
  [68.8, undefined, (c) => SC.room(c, [Z(1300, 760, 2.0), Z(1250, 780, 2.4)], <g transform="translate(1180 800)"><rect x={-60} y={-24} width={120} height={36} rx={14} fill="#c0392b" stroke="#1d1a2e" strokeWidth={5} /><circle cx={-34} cy={14} r={14} fill="#2a2a32" stroke="#1d1a2e" strokeWidth={4} /><circle cx={34} cy={14} r={14} fill="#2a2a32" stroke="#1d1a2e" strokeWidth={4} /></g>)],
  // ---- the kite ----
  [69.8, undefined, (c) => SC.park(c, [Z(1600, 480, 2.0), Z(1600, 480, 2.6)], {season: 1}, null, <Kite x={1600} y={430} s={1.1} rot={-8} t={c.t} tail={1} />)],
  [71.6, 'w', kiteShot(0)], [72.45, undefined, kiteShot(1)], [73.3, undefined, kiteShot(2)], [74.15, undefined, kiteShot(3)],
  [75.0, undefined, (c) => SC.park(c, [Z(1550, 400, 1.3), Z(1550, 430, 1.8)], {season: 1}, null, <Kite x={1560} y={260 + c.l * 24} s={1} rot={-10 + c.l * 14} torn={ramp(c.l, 0.3, 1.5)} t={c.t * 0.35} />)],
  [77.0, undefined, (c) => SC.tea(c, faceCam(stand('max', 30, 1700, 0.85), 2.4, 40), {season: 1, sunset: 0.2}, Pe(c, stand('max', 30, 1700, 0.85, {face: {smile: 0.5, lids: 0.15, gaze: [0.3, -0.2]}, turn: 0.2})))],
  [78.7, undefined, (c) => SC.liv(c, [Z(1000, 340, 3.2), Z(1000, 330, 2.0)], {warm: true, photoN: 1}, null, 0.3)],
  // ---- AGE 10: the school play ----
  [81.2, 'f', (c) => SC.aud(c, [Z(1600, 480, 1.0), Z(1600, 460, 1.15)], {curtain: 1 - ramp(c.l, 0.2, 1.6)})],
  [83.0, undefined, (c) => SC.aud(c, [Z(1180, 900, 1.6), Z(1500, 420, 1.05)], {tag: 'BEST COSTUME'})],
  [85.8, undefined, (c) => SC.aud(c, [Z(1180, 880, 2.4), Z(1180, 860, 2.8)], {tag: 'BEST COSTUME'})],
  [88.2, undefined, (c) => <Chat t={c.l} title="Leo" lines={[{side: 'them', text: 'Are you coming?', at: 0.1}, {side: 'me', text: 'Next time. I promise.', at: 0.7}]} />],
  [90.0, undefined, (c) => deskScene(c, [Z(1700, 540, 1.3), Z(1700, 520, 1.5)], 45, {face: F.tired, pose: 'phone'}, 700)],
  [92.2, undefined, (c) => SC.aud(c, [Z(2180, 560, 1.7), Z(2180, 540, 2.0)], {}, Pe(c, sit('sam', 45, 2180, 0.62, {pose: 'film', turn: -0.2, face: F.grin}, 900)))],
  [94.4, undefined, (c) => SC.aud(c, [Z(2180, 560, 1.9), Z(2180, 540, 2.3)], {}, Pe(c, sit('sam', 45, 2180, 0.62, {pose: 'clap', turn: -0.2, face: {...F.grin, open: 0.6}}, 900)))],
  [96.8, undefined, (c) => SC.aud(c, faceCam(stand('max', 10, 1600, 0.95), 2.6, 40), {}, Pe(c, stand('max', 10, 1600, 0.95, {face: {smile: 0.7, lids: 0.3, gaze: [0.9, 0.3], brow: -0.1}, turn: 0.2})))],
  // ---- Ask grown-up children... It's rarely the gifts. It's the time. ----
  [100.5, 'b', (c) => <GiftsToClocks t={c.l} />],
  // ---- AGE 15 ----
  [107.6, 'f', (c) => SC.room(c, [Z(1400, 520, 1.2), Z(1350, 480, 1.5)], Pe(c, sit('leo', 15, 1360, 0.8, {pose: 'phone', face: {...F.calm, gaze: [0, 0.5]}, turn: 0.2})))],
  [110.0, undefined, (c) => SC.door(c, [Z(1300, 760, 1.6), Z(1250, 740, 1.9)], {boxes: 4})],
  [112.0, undefined, (c) => SC.door(c, [Z(1700, 520, 1.0), Z(1700, 520, 1.25)], {boxes: 4})],
  [114.2, undefined, (c) => SC.door(c, [Z(1500, 420, 1.4), Z(1560, 420, 1.5)], {boxes: 4}, Pe(c, stand('adam', 50, 1300, 0.9, {pose: 'knock', turn: 0.8, face: F.soft})))],
  [116.3, undefined, (c) => SC.door(c, faceCam(stand('adam', 50, 1300, 0.9), 2.6, 0), {boxes: 4}, Pe(c, stand('adam', 50, 1300, 0.9, {turn: 0.7, face: {...F.talk(c.t), tilt: 8, brow: 0.3}})))],
  [118.4, undefined, (c) => SC.door(c, [Z(1700, 640, 1.8), Z(1700, 640, 2.0)], {boxes: 4, glow: 1.3})],
  [120.3, undefined, (c) => SC.door(c, [Z(1500, 430, 1.3), Z(1560, 420, 1.55)], {boxes: 4}, Pe(c, stand('adam', 50, 1300, 0.9, {turn: 0.8, face: {...F.sad, gaze: [0.8, 0]}, pose: 'raise', raise: 1})))],
  // ---- Max and his father argued / every Friday they still walked to the tea stall ----
  [122.3, 'w', (c) => SC.kit(c, faceCam(stand('sam', 45, 1250, 0.8), 2.3, 30), {}, Pe(c, stand('sam', 45, 1250, 0.8, {turn: 0.5, face: {...F.angry, open: 0.3 + 0.3 * Math.abs(Math.sin(c.t * 10))}})))],
  [123.6, undefined, (c) => SC.kit(c, faceCam(stand('max', 16, 1950, 0.85), 2.3, 30), {}, Pe(c, stand('max', 16, 1950, 0.85, {turn: -0.5, face: {...F.angry, open: 0.3 + 0.3 * Math.abs(Math.sin(c.t * 11))}})))],
  [124.9, undefined, (c) => SC.kit(c, [Z(1600, 560, 1.05), Z(1600, 540, 1.2)], {}, <>{Pe(c, stand('sam', 45, 1250, 0.8, {turn: 0.5, face: F.angry, pose: 'point'}))}{Pe(c, stand('max', 16, 1980 + ramp(c.l, 0.3, 0.7) * 120, 0.85, {turn: -0.5, face: F.angry, lean: -ramp(c.l, 0.2, 0.6) * 12}))}</>)],
  [126.4, undefined, (c) => SC.kit(c, faceCam(sit('sam', 45, 1250, 0.7, {}, FL + 76), 2.0, 40), {}, Pe(c, sit('sam', 45, 1250, 0.7, {turn: 0.4, face: {...F.sad, lids: 0.45}}, FL + 76)))],
  [128.0, 'w', (c) => SC.tea(c, [Z(1100, 560, 1.0), Z(1700, 560, 1.15)], {season: 1, sunset: 0.1}, walkers(c, [45, 16], 700, 120))],
  [130.8, undefined, (c) => SC.tea(c, [Z(1700, 600, 1.3), Z(1700, 590, 1.5)], {season: 1, sunset: 0.1}, benchPair(c, [45, 16]))],
  // ---- the worst night: split screen #1 ----
  [133.9, undefined, (c) => <Split left={leoNight(c)} right={c.l < 5.4 ? samDoor(c) : stairsSm(c)} wipe={ramp(c.l, 0, 1.0)} />],
  [143.6, undefined, (c) => <Split left={leoNight(c)} right={stairsSm(c)} wipe={1 + ramp(c.l, 0, 1.2)} divider={1 - ramp(c.l, 0.5, 1.2)} />],
  // ---- AGE 25 ----
  [149.7, 'f', (c) => SC.off(c, [Z(1600, 520, 1.0), Z(1700, 530, 1.3)], {clockMin: 480}, <>{Pe(c, sit('leo', 25, 1700, 0.7, {pose: 'desk', face: F.calm, turn: 0.1}, FL + 76))}<Laptop x={1700} y={690} s={0.9} open={1} /></>)],
  [152.4, undefined, (c) => SC.off(c, faceCam(sit('leo', 25, 1700, 0.7, {pose: 'desk'}, FL + 76), 2.4), {clockMin: 520}, Pe(c, sit('leo', 25, 1700, 0.7, {pose: 'desk', face: {...F.calm, gaze: [0, 0.5]}, turn: 0.1}, FL + 76)))],
  [153.4, undefined, (c) => <LeoTransfer t={c.l} />],
  [156.6, undefined, (c) => <PhoneDark t={c.l} light={ramp(c.l, 0.1, 0.4)} />],
  [158.5, undefined, (c) => <SundayFlip t={c.l} who="sam" week={0} />],
  [161.2, undefined, (c) => SC.liv(c, [Z(1800, 480, 1.4), Z(1850, 460, 1.7)], {warm: true}, samAt(c, 60, {pose: 'ear', face: {smile: 0.6, open: 0.15}, children: <Handset glow={0.4} />}), 0.5)],
  [163.6, undefined, (c) => SC.liv(c, faceCam(sit('sam', 60, LR.chairX, 0.66), 2.5, 20), {warm: true}, samAt(c, 60, {pose: 'ear', face: {smile: 1, open: 0.7 * Math.abs(Math.sin(c.t * 7)), brow: 0.3}, children: <Handset glow={0.4} />}), 0.4)],
  // ---- Adam retires with a comfortable house, a full bank account and a quiet phone ----
  [165.8, 'w', (c) => SC.liv(c, [W0, Z(1620, 540, 1.1)], {giftN: 8, dust: 0.8, clockMin: 60}, adamAt(c, 65))],
  [168.2, undefined, (c) => <Banking t={0.05} digits="" typeFrom={99} />],
  [170.2, undefined, (c) => <PhoneDark t={c.l} />],
  [171.4, undefined, (c) => SC.liv(c, [Z(1860, 520, 1.7), Z(1860, 500, 1.9)], {giftN: 8, dust: 0.8}, adamAt(c, 65, {pose: 'phone', face: {...F.calm, gaze: [0, 0.6]}}), 0.5)],
  [173.4, undefined, (c) => <Gallery t={c.l} marks={[0, 1.7, 3.2]} items={[{kind: 'party', label: 'Leo’s party'}, {kind: 'play', label: 'School play'}, {kind: 'grad', label: 'Graduation'}]} />],
  [179.6, undefined, (c) => <PhotoShadow t={c.l} />],
  // ---- Sam's knees are weaker now ... 25 years of Fridays ----
  [182.8, 'w', (c) => SC.tea(c, [Z(1100, 560, 1.0), Z(1500, 560, 1.15)], {season: 2, sunset: 1}, walkers(c, [65, 30], 700, 70))],
  [185.9, undefined, (c) => SC.tea(c, [Z(1700, 600, 1.3), Z(1700, 590, 1.55)], {season: 2, sunset: 1}, benchPair(c, [65, 30], F.smile))],
  [189.9, undefined, (c) => SC.tea(c, [Z(1700, 560, 1.5), Z(1600, 540, 0.95)], {season: 2, sunset: 1}, benchPair(c, [65, 30], F.smile))],
  // ---- That Sunday, Adam picks up the phone, not to send money ----
  [192.9, 'f', (c) => <Banking t={c.l} to="Leo" digits="2500" typeFrom={0.2} delFrom={1.3} press={3.6} />],
  [196.9, undefined, (c) => <CallScreen t={c.l} name="Leo" initial="L" color="#3f78c4" mode="ringing" shake={Math.max(0, 1 - c.l / 0.5) * 0.8} />],
  [197.9, undefined, (c) => SC.liv(c, [faceCam(sit('adam', 65, LR.chairX, 0.66), 2.5, 20), faceCam(sit('adam', 65, LR.chairX, 0.66), 2.8, 20)], {giftN: 8, dust: 0.9}, adamAt(c, 65, {pose: 'ear', turn: 0.15, face: {...F.talk(c.t), tilt: 8, brow: 0.3}, children: <Handset />}), 0.3)],
  [199.6, undefined, (c) => SC.liv(c, faceCam(sit('adam', 65, LR.chairX, 0.66), 2.6, 20), {giftN: 8, dust: 0.9}, adamAt(c, 65, {pose: 'ear', turn: 0.15, face: {...F.talk(c.t), tilt: 8}, children: <Handset />}), 0.3)],
  [201.6, undefined, (c) => SC.flat(c, [Z(1600, 600, 1.2), Z(1600, 600, 1.5)])],
  [203.4, undefined, (c) => SC.liv(c, faceCam(sit('adam', 65, LR.chairX, 0.66), 2.6, 20), {giftN: 8, dust: 0.9}, adamAt(c, 65, {pose: 'ear', turn: 0.15, idle: 0.3, face: {...F.worried, gaze: [0, 0.2]}, children: <Handset />}), 0.3)],
  [205.0, undefined, (c) => SC.liv(c, [faceCam(sit('adam', 65, LR.chairX, 0.66), 2.6, 20), faceCam(sit('adam', 65, LR.chairX, 0.66), 2.3, 20)], {giftN: 8, dust: 0.9}, adamAt(c, 65, {pose: 'ear', turn: 0.15, face: {smile: ramp(c.l, 0.5, 1.3), lids: 0.3 * ramp(c.l, 1.5, 2.2), brow: 0.3, tilt: 8}, children: <Handset />}), 0.3)],
  // ---- Your children won't remember most of what you bought them. They'll remember who showed up ----
  [208.4, 'w', (c) => <Split left={friday(c, 'adam')} right={friday(c, 'sam')} wipe={ramp(c.l, 0, 0.6)} divider={1 - ramp(c.l, 1.5, 2.1)} />],
  [210.6, undefined, (c) => four(c)],
  [212.9, undefined, (c) => <Viewfinder t={c.l} rec={false}>{four(c)}</Viewfinder>],
  // ---- ... and it's never too late to start showing up ----
  [215.5, 'f', (c) => <Polaroid p={ramp(c.l, 0.3, 1.6)} caption="Friday. All four.">{four({...c, t: 460} as Ctx)}</Polaroid>],
  [217.0, undefined, (c) => <EndCard t={c.l} />],
];
export {Clock} from './sets';
