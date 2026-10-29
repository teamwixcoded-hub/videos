import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Person, Baby, PersonProps} from './People';
import {Laptop, Kite, Cup, PhotoWall, GiftPile, giftTop, Handset} from './props';
import {LR, FL, streetPoint, Clock} from './sets';
import {Ctx, Entry, Z, path, mixCam, stand, sit, Pe, faceCam, bodyCam, F, SC, Split} from './kit';
import {ClockInsert, LaptopHand, Payslip, PromotionLetter, Chat, GiftsToClocks, NoteCard} from './inserts';
import {PhoneDark} from './inserts';
import {RewindCard, KW, ramp} from './fx';
import {S} from './timeline';

// ============================================================================================
// Two Fathers, part 1: cold open, rewind, the choice and the first ages (0 - 215 s). Times are VIDEO seconds from the plan's voiceover timeline.
// Cold open = no hard cuts: one continuous camera in Adam's living room, then a whip to the street.
// ============================================================================================
const W0 = Z(1600, 540, 0.95);
const adam65 = (c: Ctx, o: Partial<PersonProps> = {}) => Pe(c, sit('adam', 65, LR.chairX, 0.66, {turn: 0.55, face: F.calm, ...o}));
const sam65 = (c: Ctx, o: Partial<PersonProps> = {}) => Pe(c, sit('sam', 65, LR.chairX, 0.66, {turn: 0.55, face: F.soft, ...o}));
const bk = (c: Ctx, a: number, b: number) => a + (b - a) * c.p;
const doorA = streetPoint('adam', 0.74, 0.72), doorS = streetPoint('sam', 0.74, 0.72);
const hosp = (c: Ctx, cam: Parameters<typeof SC.hos>[1], track: number, who: 'adam' | 'sam', baby = true, face = F.soft, grip = 0, sc = 0.85) => {
  const x = who === 'adam' ? 900 : 2300;
  return SC.hos(c, cam, {track}, Pe(c, stand(who, 35, x, sc, {pose: 'cradle', turn: who === 'adam' ? 0.3 : -0.3, face, children: baby ? <Baby grip={grip} skin={who === 'adam' ? '#e8b793' : '#d9a07a'} /> : null})));
};
const deskScene = (c: Ctx, cam: Parameters<typeof SC.off>[1], age: number, o: Partial<PersonProps> = {}, clockMin = 0, laptop = true) =>
  SC.off(c, cam, {clockMin}, <>{Pe(c, sit('adam', age, 1700, 0.7, {pose: 'desk', face: F.tired, turn: 0.1, ...o}, FL + 76))}{laptop && <Laptop x={1700} y={690} s={0.9} open={1} />}</>);

export const KW1: KW[] = [
  {at: 0.8, dur: 3.8, text: 'SUNDAY · 8:00 AM', style: 'time'},
  {at: 8.05, dur: 1.4, text: 'TWO FATHERS', style: 'big', accent: 1}, {at: 9.56, dur: 1.2, text: 'SAME STREET', style: 'big'}, {at: 10.9, dur: 1.2, text: 'SAME SALARY', style: 'big'}, {at: 12.45, dur: 1.5, text: 'SAME LOVE.', style: 'big', accent: 1},
  {at: 15.2, dur: 1.8, text: 'MONEY.', style: 'big'}, {at: 18.9, dur: 2.0, text: 'TIME.', style: 'big', accent: 0},
  {at: 27.0, dur: 3.8, text: 'ONLY ONE RINGS.', style: 'big'},
  {at: 46.6, dur: 3.4, text: '“You’ll have a better life than I did.”', style: 'quote'},
  {at: 53.2, dur: 2.6, text: '6:00 PM', style: 'time'},
  {at: 62.7, dur: 2.4, text: 'EXTRA SHIFTS · WEEKENDS', style: 'big'}, {at: 74.6, dur: 2.6, text: 'MONEY.', style: 'big'},
  {at: 84.0, dur: 3.0, text: '6:00 PM → 1 HOUR', style: 'time'}, {at: 90.6, dur: 2.6, text: 'TIME.', style: 'big', accent: 0},
  {at: 95.0, dur: 3.2, text: 'AGE 5', style: 'tag'}, {at: 111.4, dur: 2.6, text: 'FRIDAY', style: 'time'},
  {at: 150.0, dur: 3.2, text: 'AGE 10', style: 'tag'}, {at: 160.8, dur: 2.0, text: 'NEXT TIME.', style: 'big'},
  {at: 180.7, dur: 1.9, text: 'IT’S RARELY THE GIFTS.', style: 'big'}, {at: 182.6, dur: 3.2, text: 'IT’S THE TIME.', style: 'big', accent: 2},
  {at: 192.0, dur: 3.2, text: 'AGE 15', style: 'tag'}, {at: 205.5, dur: 3.4, text: 'SAY SOMETHING.', style: 'big'},
];

// the Friday kite shots: 12 Fridays, summer, the kite flies higher each week
const kiteShot = (n: number): ((c: Ctx) => React.ReactNode) => (c) => {
  const wob = Math.sin(c.t * 2.2 + n), ky = 250 - n * 6 + wob * 20, kx = 1500 + (n % 3) * 130;
  const sx = 1100 + (n % 4) * 60;
  return SC.park(c, [Z(1500 + (n % 3 - 1) * 120, 500, 1.1), Z(1550 + (n % 3 - 1) * 120, 470, 1.25)], {season: 1},
    <>{Pe(c, stand('sam', 40, sx, 0.62, {turn: 0.7, pose: 'point', face: F.grin}))}{Pe(c, stand('max', 5 + n * 0.05, sx + 220, 0.62, {turn: 0.7, face: F.grin, pose: 'wave'}))}</>,
    <g><path d={`M ${sx + 130},${520} Q ${(sx + kx) / 2},${ky + 280} ${kx},${ky + 96}`} fill="none" stroke="#3a2a26" strokeWidth={2.4} /><Kite x={kx} y={ky} s={0.8} rot={-14 + wob * 6} t={c.t} /></g>);
};

export const LIST1: Entry[] = [
  // ---------------- COLD OPEN (no hard cuts) ----------------
  [0, undefined, (c) => SC.liv(c, path(c.l, [[0, W0], [2.4, Z(1200, 330, 1.35)], [3.6, Z(1010, 250, 2.3)], [5.4, Z(1010, 250, 2.3)], [6.4, Z(1480, 650, 2.1)], [8, Z(1500, 650, 2.7)]]), {clockMin: c.l > 3.3 ? 60 : 59}, adam65(c), c.l > 2.6 && c.l < 5.5 ? 0.25 : 0.5)],
  // the street: two doors, two payslips, two men at 65 at their windows (one beat per phrase)
  [8.0, 'w', (c) => SC.str(c, [Z(doorA[0] + 80, 540, 1.3), Z(doorA[0], 580, 2.4)], {})],
  [8.7, undefined, (c) => SC.str(c, [Z(doorS[0] - 80, 540, 1.3), Z(doorS[0], 580, 2.4)], {})],
  [9.5, 'w', (c) => SC.str(c, [Z(1600, 560, 0.95), Z(1600, 540, 1.2)], {})],
  [10.8, undefined, (c) => <Payslip t={c.l} who="adam" />],
  [11.65, undefined, (c) => <Payslip t={c.l} who="sam" />],
  [12.4, undefined, (c) => SC.liv(c, [Z(1950, 470, 1.5), Z(1980, 450, 1.7)], {}, adam65(c, {face: F.sad, tilt: 3}), 0.5)],
  [13.2, undefined, (c) => SC.liv(c, [Z(1950, 470, 1.5), Z(1980, 450, 1.7)], {warm: true}, sam65(c, {face: F.soft}), 0.5)],
  // one gave everything money could buy / the other gave something cheaper
  [14.0, 'b', (c) => SC.liv(c, [Z(330, 800, 1.6), Z(330, 210, 1.6)], {giftN: 8, dust: 0.65}, null, 0.4)],
  [17.0, 'b', (c) => SC.liv(c, [Z(1000, 380, 1.25), Z(1000, 330, 1.05)], {warm: true, photoN: 12}, null, 0.4)],
  [19.2, undefined, (c) => SC.liv(c, [Z(1000, 330, 2.4), Z(1000, 330, 3.2)], {warm: true, photoN: 12}, null, 0.3)],
  // Twenty years later, only one of them gets a phone call on Sunday: push to the window, rack focus to Sam across the street
  [21.0, undefined, (c) => {
    const cam = path(c.l, [[0, Z(1500, 650, 2.4)], [2.0, Z(1500, 640, 2.2)], [3.2, Z(1750, 450, 1.5)], [5.6, Z(2430, 360, 1.85)], [8.6, Z(2430, 360, 1.95)], [10.4, Z(1880, 440, 2.8)]]);
    const blur = c.l < 3 ? 0.5 : c.l < 5.6 ? 0.5 - 0.35 * ramp(c.l, 3, 5.6) : c.l < 9 ? 0.15 : 0.15 + 0.7 * ramp(c.l, 9, 10);
    const face = c.l > 9.2 ? {...F.sad, gaze: [0.9, 0] as [number, number], lids: 0.28} : {...F.calm, gaze: [0.7, 0] as [number, number]};
    return (
      <AbsoluteFill>
        {SC.liv(c, cam, {clockMin: 60, samAnswer: c.l > 5.4 ? 1 : 0}, adam65(c, {face}), blur)}
        {c.l > 9.2 && <AbsoluteFill style={{background: 'linear-gradient(115deg, rgba(220,235,250,.22), rgba(220,235,250,0) 45%, rgba(220,235,250,.14))', opacity: ramp(c.l, 9.2, 10.2)}} />}
      </AbsoluteFill>
    );
  }],
  // ---------------- REWIND ----------------
  [32.0, undefined, (c) => <RewindCard p={c.p} f={c.l * 30} />],
  // ---------------- 30 YEARS EARLIER: the hospital corridor ----------------
  [35.0, undefined, (c) => SC.hos(c, [Z(1600, 520, 0.95), Z(1600, 520, 1.45)], {track: c.p}, <>{Pe(c, stand('adam', 35, 640 + Math.sin(c.t * 0.9) * 60, 0.78, {turn: 0.45, pose: 'fold', face: F.worried}))}{Pe(c, stand('sam', 35, 2560, 0.78, {turn: -0.45, pose: 'fold', face: F.soft}))}</>)],
  [37.0, undefined, (c) => SC.hos(c, [Z(760, 470, 1.35), Z(700, 450, 1.7)], {track: 0.5}, Pe(c, stand('adam', 35, 680 + Math.sin(c.t * 0.9) * 50, 0.78, {turn: 0.45, pose: 'fold', face: F.worried})))],
  [38.0, undefined, (c) => SC.hos(c, [Z(2480, 470, 1.35), Z(2540, 450, 1.7)], {track: 0.5}, Pe(c, stand('sam', 35, 2560, 0.78, {turn: -0.45, pose: 'fold', face: F.soft})))],
  [39.0, undefined, (c) => hosp(c, [Z(960, 560, 1.2), Z(920, 520, 1.5)], 0.6, 'adam')],
  [40.4, undefined, (c) => hosp(c, [Z(2260, 560, 1.2), Z(2300, 520, 1.5)], 0.6, 'sam')],
  [41.6, undefined, (c) => hosp(c, [Z(1100, 560, 0.95), faceCam(stand('adam', 35, 900, 0.85), 2.7, 100)], 0.6, 'adam', true, {...F.soft, gaze: [0, 0.4]})],
  [44.3, undefined, (c) => hosp(c, [Z(2100, 560, 0.95), faceCam(stand('sam', 35, 2300, 0.85), 2.7, 100)], 0.6, 'sam', true, {...F.soft, smile: 0.5, gaze: [0, 0.4]})],
  [47.0, undefined, (c) => hosp(c, [Z(900, 560, 2.2), Z(850, 540, 3.4)], 0.6, 'adam', true, F.soft, ramp(c.l, 0.3, 1.4))],
  [49.0, undefined, (c) => hosp(c, [Z(2300, 560, 2.2), Z(2250, 540, 3.4)], 0.6, 'sam', true, F.soft, ramp(c.l, 0.3, 1.4))],
  // ---------------- 6:00 PM: the choice ----------------
  [53.0, 'f', (c) => <ClockInsert t={c.l} min={660} />],
  [54.6, undefined, (c) => <LaptopHand t={c.l} who="adam" />],
  [56.0, undefined, (c) => <LaptopHand t={c.l} who="sam" closeAt={0.95} />],
  [57.6, undefined, (c) => <LaptopHand t={c.l + 1.4} who="adam" />],
  // ---------------- Adam's montage ----------------
  [59.0, undefined, (c) => deskScene(c, [Z(1600, 520, 1.0), Z(1700, 540, 1.25)], 35)],
  [61.0, undefined, (c) => deskScene(c, [Z(1750, 500, 1.4), Z(1700, 480, 1.2)], 35, {face: F.tired, tilt: 3}, 0)],
  [62.9, 'w', (c) => <Payslip t={c.l} who="adam" />],
  [64.8, undefined, (c) => SC.liv(c, [Z(900, 620, 1.7), Z(900, 600, 2.0)], {}, <g transform="translate(900 640)"><Baby x={0} y={0} rot={-4} /></g>)],
  [66.8, undefined, (c) => deskScene(c, faceCam(sit('adam', 35, 1700, 0.7, {}, FL + 76), 2.1), 35, {face: {...F.tired, gaze: [0, 0.5]}}, 330)],
  [68.5, undefined, (c) => deskScene(c, [Z(1600, 520, 1.1), Z(1700, 520, 1.5)], 35, {face: F.tired}, 540)],
  [70.2, undefined, (c) => deskScene(c, [faceCam(sit('adam', 35, 1700, 0.7, {}, FL + 76), 2.3), faceCam(sit('adam', 35, 1700, 0.7, {}, FL + 76), 2.8)], 35, {face: {lids: 0.35, smile: 0.25, tilt: 8, gaze: [0, 0.3]}, turn: 0}, 600, false)],
  [74.0, undefined, (c) => deskScene(c, [Z(1500, 600, 1.5), Z(1620, 560, 1.9)], 40, {face: {...F.tired, gaze: [0, 0.6]}}, 660)],
  // ---------------- Sam: closes the laptop at six ----------------
  [80.0, undefined, (c) => SC.kit(c, [Z(1500, 540, 1.0), Z(1450, 520, 1.25)], {}, <>{Pe(c, sit('sam', 35, 1280, 0.7, {pose: 'desk', turn: 0.5, face: F.calm}, FL + 76))}<Laptop x={1620} y={690} s={0.8} open={1} /></>)],
  [82.3, undefined, (c) => <LaptopHand t={c.l} who="sam" closeAt={0.45} />],
  [83.6, undefined, (c) => SC.liv(c, [Z(900, 520, 1.1), Z(900, 500, 1.35)], {warm: true}, Pe(c, sit('sam', 35, 900, 0.62, {pose: 'cradle', turn: 0.3, face: F.soft, children: <Baby grip={0.5} />})))],
  [85.4, undefined, (c) => <ClockInsert t={c.l} min={660 + c.l * 20} tone="warm" />],
  [87.3, undefined, (c) => <PromotionLetter t={c.l} />],
  [90.2, undefined, (c) => SC.liv(c, [Z(900, 560, 1.35), Z(900, 540, 1.6)], {warm: true}, Pe(c, sit('sam', 35, 900, 0.62, {pose: 'cradle', turn: 0.3, face: {lids: 0.7, smile: 0.4}, children: <Baby grip={0.7} />})))],
  // ---------------- AGE 5: the party ----------------
  [95.0, undefined, (c) => SC.pty(c, [Z(1700, 560, 1.0), Z(2300, 640, 1.8)], {}, <>{Pe(c, stand('leo', 5, 1500, 0.8, {face: F.grin, turn: 0.3}))}{Pe(c, stand('max', 5, 1250, 0.8, {face: F.smile, turn: 0.3}))}</>)],
  [97.0, undefined, (c) => SC.pty(c, [Z(1700, 560, 1.2), Z(1800, 540, 1.5)], {}, <>{Pe(c, stand('aunt', 40, 1700, 0.8, {pose: 'film', turn: -0.4, face: F.smile}))}{Pe(c, stand('leo', 5, 1450, 0.8, {face: F.grin, turn: 0.3}))}</>)],
  [98.6, 'w', (c) => SC.pty(c, [Z(1100, 560, 1.0), Z(1200, 560, 1.2)], {}, Pe(c, stand('adam', 40, 700 + ramp(c.l, 0, 1.6) * 500, 0.85, {pose: 'carry', face: F.smile, turn: 0.5, children: <g transform="translate(0 -60)"><GiftPile x={0} y={0} n={1} s={0.5} /></g>})))],
  [100.4, undefined, (c) => SC.pty(c, faceCam(stand('leo', 5, 1500, 0.9), 2.4, 40), {}, Pe(c, stand('leo', 5, 1500, 0.9, {face: {smile: 1, open: 0.6, wide: 0.6, brow: 0.5}, turn: 0.1})))],
  [101.6, undefined, (c) => SC.pty(c, [Z(1500, 650, 2.2), Z(1500, 650, 2.6)], {}, <GiftPile x={1500} y={770} n={1} s={0.9} />)],
  [102.7, undefined, (c) => SC.pty(c, faceCam(stand('leo', 5, 1500, 0.9), 2.4, 40), {}, Pe(c, stand('leo', 5, 1500, 0.9, {face: F.grin, turn: -0.1})))],
  [104.1, undefined, (c) => SC.pty(c, [Z(1500, 640, 1.3), Z(1500, 640, 1.1)], {}, Pe(c, stand('leo', 5, 1500, 0.8, {face: F.smile})))],
  // Day 3: the toy car under the bed, Adam's pile gets its first box
  [105.0, undefined, (c) => SC.room(c, [Z(1300, 760, 2.0), Z(1250, 780, 2.4)], <g transform="translate(1180 800)"><rect x={-60} y={-24} width={120} height={36} rx={14} fill="#c0392b" stroke="#3a2a26" strokeWidth={5} /><circle cx={-34} cy={14} r={14} fill="#2a2a32" stroke="#3a2a26" strokeWidth={4} /><circle cx={34} cy={14} r={14} fill="#2a2a32" stroke="#3a2a26" strokeWidth={4} /></g>)],
  [107.0, undefined, (c) => SC.liv(c, [Z(330, 700, 1.6), Z(330, 640, 1.8)], {giftN: 1}, null, 0.4)],
  // ---------------- the kite ----------------
  [109.0, undefined, (c) => SC.park(c, [Z(1600, 480, 2.0), Z(1600, 480, 2.6)], {season: 1}, null, <Kite x={1600} y={430} s={1.1} rot={-8} t={c.t} tail={1} />)],
  [110.8, 'w', kiteShot(0)], [112.2, undefined, kiteShot(1)],
  [113.7, undefined, (c) => SC.park(c, [Z(1550, 520, 1.5), Z(1550, 470, 1.8)], {season: 1}, null, <Kite x={1560} y={300 + c.l * 60} s={0.9} rot={-18 + c.l * 24} torn={ramp(c.l, 0.2, 1.4)} t={c.t} />)],
  [115.4, undefined, (c) => SC.liv(c, [Z(1000, 340, 2.0), Z(1000, 330, 2.4)], {warm: true, photoN: 1}, null, 0.3)],
  [117.0, undefined, (c) => SC.tea(c, faceCam(stand('max', 30, 1700, 0.85), 2.4, 40), {season: 1, sunset: 0.2}, Pe(c, stand('max', 30, 1700, 0.85, {face: {smile: 0.5, lids: 0.15, gaze: [0.3, -0.2]}, turn: 0.2})))],
  [118.6, undefined, (c) => SC.liv(c, [Z(1000, 330, 3.2), Z(1000, 330, 2.0)], {warm: true, photoN: 1}, null, 0.3)],
  // ---------------- M1 Fridays: 12 Fridays at the beat, then August ----------------
  ...Array.from({length: 12}, (_, i): Entry => [120 + i * 1.7, i === 0 ? 'w' : undefined, kiteShot(i)]),
  [140.4, undefined, (c) => SC.park(c, [Z(1550, 400, 1.3), Z(1550, 420, 1.7)], {season: 1}, null, <Kite x={1560} y={260 + c.l * 18} s={1} rot={-10 + c.l * 14} torn={ramp(c.l, 0.3, 1.5)} t={c.t * 0.35} />)],
  [142.4, undefined, (c) => SC.park(c, [Z(1500, 560, 1.5), Z(1500, 540, 1.8)], {season: 1}, <>{Pe(c, stand('max', 5, 1600, 0.85, {face: F.sad, turn: -0.3}))}{Pe(c, stand('sam', 40, 1330, 0.85, {face: {...F.grin, open: 0.7}, turn: 0.3}))}</>)],
  [144.4, undefined, (c) => SC.liv(c, [Z(1000, 340, 1.8), Z(1000, 330, 2.2)], {warm: true, photoN: 2}, null, 0.3)],
  [146.4, 'w', (c) => SC.room(c, [Z(1300, 760, 2.0), Z(1250, 780, 2.4)], <g transform={`translate(${1180 + ramp(c.l, 0.2, 1.2) * 60} 800)`}><rect x={-60} y={-24} width={120} height={36} rx={14} fill="#c0392b" stroke="#3a2a26" strokeWidth={5} /><circle cx={-34} cy={14} r={14} fill="#2a2a32" stroke="#3a2a26" strokeWidth={4} /><circle cx={34} cy={14} r={14} fill="#2a2a32" stroke="#3a2a26" strokeWidth={4} /></g>)],
  [148.2, undefined, (c) => SC.liv(c, [Z(330, 700, 1.6), Z(330, 600, 1.8)], {giftN: 2}, null, 0.4)],
  // ---------------- AGE 10: the school play ----------------
  [150.0, 'f', (c) => SC.aud(c, [Z(1600, 480, 1.0), Z(1600, 460, 1.15)], {curtain: 1 - ramp(c.l, 0.3, 3.4)})],
  [154.0, undefined, (c) => SC.aud(c, [Z(1180, 900, 1.6), Z(1500, 420, 1.05)], {tag: 'BEST COSTUME'})],
  [157.3, undefined, (c) => SC.aud(c, [Z(1180, 880, 2.4), Z(1180, 860, 2.8)], {tag: 'BEST COSTUME'})],
  [158.7, undefined, (c) => SC.liv(c, [Z(1860, 600, 1.4), Z(1860, 600, 1.6)], {}, adam65(c, {pose: 'phone', face: F.tired}))],
  [160.6, undefined, (c) => <Chat t={c.l} title="Leo" lines={[{side: 'them', text: 'Are you coming?', at: 0.2}, {side: 'me', text: 'Next time. I promise.', at: 0.9}]} />],
  [162.6, undefined, (c) => deskScene(c, [Z(1700, 540, 1.3), Z(1700, 520, 1.5)], 45, {face: F.tired, pose: 'phone'}, 700)],
  [165.0, undefined, (c) => SC.aud(c, [Z(2180, 760, 1.6), Z(2180, 720, 1.9)], {}, Pe(c, sit('sam', 45, 2180, 0.62, {pose: 'film', turn: -0.2, face: F.grin}, 900)))],
  [167.0, undefined, (c) => SC.aud(c, [Z(2180, 760, 1.8), Z(2180, 740, 2.2)], {}, Pe(c, sit('sam', 45, 2180, 0.62, {pose: 'clap', turn: -0.2, face: {...F.grin, open: 0.6}}, 900)))],
  [169.4, undefined, (c) => SC.aud(c, faceCam(stand('max', 10, 1600, 0.95), 2.6, 40), {}, Pe(c, stand('max', 10, 1600, 0.95, {face: {smile: 0.7, lids: 0.3, gaze: [0.9, 0.3], brow: -0.1}, turn: 0.2})))],
  [172.0, undefined, (c) => SC.aud(c, [Z(1600, 500, 1.5), Z(1600, 500, 1.9)], {}, Pe(c, stand('leo', 10, 1600, 0.95, {face: {...F.calm, gaze: [Math.sin(c.t * 1.6), 0.3]}, turn: 0.1})))],
  [174.6, undefined, (c) => SC.aud(c, [Z(1180, 700, 1.2), Z(1180, 840, 2.4)], {tag: 'BEST COSTUME'})],
  // ---------------- It's rarely the gifts, it's the time ----------------
  [177.0, undefined, (c) => SC.liv(c, [Z(330, 520, 1.1), Z(330, 460, 1.0)], {giftN: 4, dust: 0.2}, null, 0.5)],
  [178.4, 'b', (c) => <GiftsToClocks t={c.l} />],
  [184.0, undefined, (c) => (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #242a40 0%, #10142a 100%)'}}>
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}><g transform={`scale(${1 + c.p * 0.06}) translate(${-c.p * 30} 0)`}><GiftPile x={500} y={900} n={4} dust={0.15} s={0.9} /><PhotoWall x={1380} y={500} n={6} s={0.85} glow={0.8} /></g></svg>
    </AbsoluteFill>
  )],
  // ---------------- AGE 15 ----------------
  [192.0, 'f', (c) => SC.room(c, [Z(1400, 520, 1.2), Z(1350, 480, 1.5)], Pe(c, sit('leo', 15, 1360, 0.8, {pose: 'phone', face: {...F.calm, gaze: [0, 0.5]}, turn: 0.2, top: '#3f78c4'})))],
  [194.0, undefined, (c) => SC.door(c, [Z(1300, 760, 1.6), Z(1250, 740, 1.9)], {boxes: 3})],
  [195.4, undefined, (c) => SC.door(c, [Z(1300, 740, 1.5), Z(1500, 650, 1.3)], {boxes: 4})],
  [197.0, undefined, (c) => SC.door(c, [Z(1700, 520, 1.0), Z(1700, 520, 1.25)], {boxes: 4})],
  [198.3, undefined, (c) => SC.door(c, [Z(1500, 500, 1.4), Z(1560, 500, 1.5)], {boxes: 4}, Pe(c, stand('adam', 50, 1300, 0.9, {pose: 'knock', turn: 0.8, face: F.soft})))],
  [200.3, undefined, (c) => SC.door(c, faceCam(stand('adam', 50, 1300, 0.9), 2.6, 0), {boxes: 4}, Pe(c, stand('adam', 50, 1300, 0.9, {turn: 0.7, face: {...F.talk(c.t), tilt: 8, brow: 0.3}})))],
  [202.4, undefined, (c) => SC.door(c, [Z(1700, 640, 1.8), Z(1700, 640, 2.0)], {boxes: 4, glow: 1.3})],
  [204.3, undefined, (c) => SC.door(c, [Z(1500, 520, 1.1), Z(1500, 520, 1.25)], {boxes: 4}, Pe(c, stand('adam', 50, 1300, 0.9, {turn: 0.8, face: F.sad})))],
  // ---------------- midpoint: Adam almost says more ----------------
  [205.0, undefined, (c) => SC.door(c, [Z(1500, 540, 1.3), Z(1560, 520, 1.55)], {boxes: 4}, Pe(c, stand('adam', 50, 1300, 0.9, {turn: 0.8, face: {...F.sad, gaze: [0.8, 0]}, pose: 'raise', raise: c.l > 6 ? 1 - ramp(c.l, 6, 6.4) : 1})))],
  [211.2, undefined, (c) => deskScene(c, [Z(1700, 540, 1.3), Z(1700, 520, 1.4)], 50, {face: F.sad, pose: 'rest'}, 660)],
];
export const S1_END = 215;
export {Clock, bodyCam, mixCam, Split, Cup, giftTop, Handset, NoteCard, PhoneDark, S};
