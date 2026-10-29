// Two Fathers at recording length: new act grades, banking/end-card timing, remove the old stretched shot lists
const fs = require('fs');
const edit = (file, pairs) => {
  let s = fs.readFileSync(file, 'utf8');
  for (const [a, b] of pairs) { if (!s.includes(a)) { console.log('MISSING in', file, ':', String(a).slice(0, 90)); continue; } s = s.replace(a, b); }
  fs.writeFileSync(file, s);
};
// grades by act, in recording time
let th = fs.readFileSync('src/fathers/theme.ts', 'utf8');
const a = th.indexOf('export const GRADES'), b = th.indexOf('export const gradeAt');
th = th.slice(0, a) + `export const GRADES: GradeKey[] = [
  {t: 0, c: COLD, a: 0.30, sat: 0.8, br: 0.97},        // the street and the Sunday cold open: pale grey-blue morning
  {t: 18.4, c: COLD, a: 0.30, sat: 0.8, br: 0.97},
  {t: 20, c: SOFT, a: 0.18, sat: 0.92, br: 1.03},      // hospital: soft white
  {t: 30.5, c: SOFT, a: 0.18, sat: 0.92, br: 1.03},
  {t: 31.8, c: AMBER, a: 0.26, sat: 1.05, br: 1.0},    // 6:00 PM amber
  {t: 58, c: DAY, a: 0.20, sat: 1.08, br: 1.02},       // warm daylight, ages 5 and 10
  {t: 106, c: DAY, a: 0.20, sat: 1.08, br: 1.02},
  {t: 112, c: [210, 140, 110], a: 0.26, sat: 0.98, br: 0.94},   // dusk, age 15
  {t: 134, c: NAVYG, a: 0.34, sat: 0.9, br: 0.86},     // the worst night
  {t: 148, c: NAVYG, a: 0.34, sat: 0.9, br: 0.86},
  {t: 150, c: CITY, a: 0.12, sat: 1.0, br: 1.02},      // age 25: neutral city daylight
  {t: 165, c: CITY, a: 0.12, sat: 1.0, br: 1.02},
  {t: 166.5, c: COLD, a: 0.30, sat: 0.8, br: 0.97},    // back to the cold Sunday
  {t: 181.5, c: COLD, a: 0.30, sat: 0.8, br: 0.97},
  {t: 183.5, c: GOLDG, a: 0.30, sat: 1.12, br: 1.0},   // golden sunset at the stall
  {t: 192, c: GOLDG, a: 0.30, sat: 1.12, br: 1.0},
  {t: 193.5, c: GREY, a: 0.30, sat: 0.74, br: 0.95},   // the call: cold grey
  {t: 204.5, c: GREY, a: 0.30, sat: 0.74, br: 0.95},
  {t: 207.5, c: [255, 175, 80], a: 0.30, sat: 1.12, br: 1.03},  // warms to gold after "Dad"
  {t: 210, c: MORN, a: 0.18, sat: 1.08, br: 1.04},     // Friday morning
  {t: 220, c: MORN, a: 0.18, sat: 1.08, br: 1.04},
];
` + th.slice(b);
fs.writeFileSync('src/fathers/theme.ts', th);
edit('src/fathers/inserts.tsx', [
  ["const typed = clamp(Math.floor((t - typeFrom) / 0.3) + 1, 0, digits.length), gone = t > delFrom ? clamp(Math.floor((t - delFrom) / 0.45) + 1, 0, digits.length) : 0, n = Math.max(0, typed - gone);", "const typed = clamp(Math.floor((t - typeFrom) / 0.3) + 1, 0, digits.length), gone = t > delFrom ? clamp(Math.floor((t - delFrom) / 0.3) + 1, 0, digits.length) : 0, n = Math.max(0, typed - gone);"],
  ["thumbK = ramp(t, delFrom + digits.length * 0.45 + 0.4, press - 0.3)", "thumbK = ramp(t, delFrom + 0.6, press - 0.3)"],
  ["opacity: ramp(t, 2.4, 3.6), transform: `translateY(${(1 - ramp(t, 2.4, 3.6)) * 20}px)`", "opacity: ramp(t, 0.3, 1.1), transform: `translateY(${(1 - ramp(t, 0.3, 1.1)) * 20}px)`"],
]);
for (const f of ['shots1.tsx', 'shots2.tsx']) { try { fs.unlinkSync('src/fathers/' + f); } catch (e) {} }
console.log('patched 7');
