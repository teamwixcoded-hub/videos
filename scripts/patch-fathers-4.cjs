// wire in public/sfx4 (new sounds) and the six tf_* music beds
const fs = require('fs');
const edit = (file, pairs) => {
  let s = fs.readFileSync(file, 'utf8');
  for (const [a, b] of pairs) { if (!s.includes(a)) { console.log('MISSING in', file, ':', a.slice(0, 80)); continue; } s = s.replace(a, b); }
  fs.writeFileSync(file, s);
};
edit('src/same2d/sound.tsx', [
  ['old?: boolean};', 'old?: boolean; dir?: string};'],
  ["src={staticFile(`${c.old ? 'sfx' : 'sfx3'}/${c.file}.mp3`)}", "src={staticFile(`${c.dir ?? (c.old ? 'sfx' : 'sfx3')}/${c.file}.mp3`)}"],
]);
edit('src/fathers/Fathers.tsx', [
  ["const HAVE_SFX4 = false;", "const HAVE_SFX4 = true;"],
  ["{file: 'lamp_click', at: 56.95, vol: 0.5}, {file: 'lamp_click', at: 82.75, vol: 0.5}, ", ""],
  ["{file: 'thud', old: true, at: 198.5, vol: 0.55}, {file: 'thud', old: true, at: 198.95, vol: 0.55}, ", ""],
  [", {file: 'thud', old: true, at: 217.9, vol: 0.5},", ","],
  ["{file: 'phone_tap', at: 295.8, vol: 0.3}, {file: 'phone_notif', at: 297.3, vol: 0.5},", "{file: 'phone_tap', at: 295.8, vol: 0.3},"],
  ["{file: 'lamp_click', at: 466.0, vol: 0.6}, {file: 'shimmer', at: 466.0, vol: 0.3},", "{file: 'shimmer', at: 466.0, vol: 0.3},"],
  ["const CUES4: Cue3[] = HAVE_SFX4 ? [] : [];", `const n4 = (file: string, at: number, vol: number, extra: Partial<Cue3> = {}): Cue3 => ({file, at, vol, dir: 'sfx4', ...extra});
const CUES4: Cue3[] = !HAVE_SFX4 ? [] : [
  n4('phone_ring_far', 26.3, 0.5), n4('hospital_amb', 35, 0.2, {dur: 18, loop: true}), n4('baby_coo', 48.0, 0.35), n4('laptop_lid', 56.95, 0.6), n4('laptop_lid', 82.75, 0.6),
  n4('party_noise', 95, 0.18, {dur: 10, loop: true}), n4('kite_wind', 109, 0.2, {dur: 39, loop: true}), n4('kite_tear', 140.9, 0.5),
  n4('applause_hall', 168.0, 0.45), n4('applause_hall', 172.2, 0.45), n4('door_knock', 198.3, 0.7), n4('door_knock', 204.8, 0.4), n4('chair_slam', 217.8, 0.55),
  n4('footsteps_walk', 220.6, 0.2, {dur: 2.9, loop: true}), n4('crowd_cafe_street', 223.5, 0.16, {dur: 8, loop: true}), n4('footsteps_walk', 362, 0.2, {dur: 5.3, loop: true}), n4('crowd_cafe_street', 367.3, 0.16, {dur: 5, loop: true}),
  n4('transfer_chime', 297.3, 0.55), n4('phone_ring_close', 299.7, 0.5, {dur: 2.7}), n4('phone_ring_far', 302.0, 0.3, {dur: 0.6}),
  ...SHOTS.filter((s) => s.from >= 386 && s.from < 414).map((s, i): Cue3 => n4(i % 2 ? 'transfer_chime' : 'phone_ring_close', s.from, 0.3, {dur: 0.5})),
  n4('footsteps_walk', 454, 0.18, {dur: 4, loop: true}), n4('crowd_cafe_street', 458, 0.16, {dur: 8, loop: true}), n4('shutter_click', 466.0, 0.7),
];`],
  [/const MUSIC: [\s\S]*?\n\];/.exec(fs.readFileSync('src/fathers/Fathers.tsx', 'utf8'))[0], `const MUSIC: {from: number; to: number; track: string; vol: number; startAt?: number}[] = [
  {from: 0, to: 32, track: 'tf_cold', vol: 0.14}, {from: 35, to: 109, track: 'tf_guitar', vol: 0.15}, {from: 109, to: 185, track: 'tf_guitar', vol: 0.13, startAt: 0},
  {from: 185, to: 262, track: 'tf_thin', vol: 0.13}, {from: 262, to: 277, track: 'tf_thin', vol: 0.09, startAt: 50}, {from: 282, to: 312, track: 'tf_guitar', vol: 0.12, startAt: 40},
  {from: 312, to: 362, track: 'tf_return', vol: 0.14}, {from: 362, to: 416, track: 'tf_guitar', vol: 0.15, startAt: 0}, {from: 416, to: 437, track: 'tf_build', vol: 0.15},
  {from: 440, to: 490, track: 'tf_end', vol: 0.2},
];`],
]);
console.log('patched 4');
