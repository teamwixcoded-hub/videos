const fs = require('fs');
const edit = (file, fn) => { let s = fs.readFileSync(file, 'utf8'); s = fn(s); fs.writeFileSync(file, s); };
const rep = (s, a, b) => { if (!s.includes(a)) throw new Error('missing: ' + String(a).slice(0, 80)); return s.replace(a, b); };
const between = (s, a, b, text) => { const i = s.indexOf(a), j = s.indexOf(b, i); if (i < 0 || j < 0) throw new Error('between: ' + a.slice(0, 40)); return s.slice(0, i) + text + s.slice(j); };

edit('src/winter/limb.tsx', (s) => s + `
// a closed smooth outline through the points (Catmull-Rom as cubic segments)
export const smoothClosed = (pts: V[]): string => {
  const n = pts.length;
  let d = \`M \${pts[0][0]},\${pts[0][1]}\`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += \` C \${p1[0] + (p2[0] - p0[0]) / 6},\${p1[1] + (p2[1] - p0[1]) / 6} \${p2[0] - (p3[0] - p1[0]) / 6},\${p2[1] - (p3[1] - p1[1]) / 6} \${p2[0]},\${p2[1]}\`;
  }
  return d + ' Z';
};
`);

edit('src/winter/Hero.tsx', (s) => {
  s = rep(s, "import {Limb, limbAt} from './limb';", "import {Limb, limbAt, smoothClosed} from './limb';");
  // one set of torso measurements: shoulder, chest, waist, belly, hip (half widths). bw = the belly width, belly = 0 keeps the decorations below working
  s = rep(s, 'const sw = 112 + muscle * 44 - fat * 8, bw = 92 + fat * 78 - muscle * 8, hw = 96 + fat * 34, belly = fat * 44;',
    'const sw = 114 + muscle * 38 - fat * 4, chestW = sw * 0.92 + muscle * 6 + fat * 14, waistW = 90 + fat * 24 - muscle * 12, bw = waistW + fat * 62 + muscle * 4, hw = Math.max(98 + fat * 16, bw * 0.9), belly = 0;');
  s = between(s, '  const torso = `', '  const leg = (s', `  const torso = smoothClosed([
    [-sw * 0.46, NECK_Y + 4], [0, NECK_Y - 8], [sw * 0.46, NECK_Y + 4], [sw * 0.9, NECK_Y + 22], [sw, NECK_Y + 54],
    [chestW, NECK_Y + 112], [(chestW + waistW) / 2 + 4, NECK_Y + 160], [waistW + 4, NECK_Y + 200], [bw, NECK_Y + 248], [(bw + hw) / 2 + 2, NECK_Y + 276], [hw, NECK_Y + TORSO_H - 14], [hw - 14, NECK_Y + TORSO_H + 3],
    [0, NECK_Y + TORSO_H + 6],
    [-hw + 14, NECK_Y + TORSO_H + 3], [-hw, NECK_Y + TORSO_H - 14], [-(bw + hw) / 2 - 2, NECK_Y + 276], [-bw, NECK_Y + 248], [-waistW - 4, NECK_Y + 200], [-(chestW + waistW) / 2 - 4, NECK_Y + 160], [-chestW, NECK_Y + 112], [-sw, NECK_Y + 54], [-sw * 0.9, NECK_Y + 22],
  ]);
`);
  return s;
});

edit('src/winter/SideHero.tsx', (s) => {
  s = rep(s, 'const front = [[0, 82 + fat * 22], [60, 86 + fat * 62], [120, 86 + fat * 118], [180, 88 + muscle * 10 + fat * 54], [240, 92 + muscle * 22 + fat * 18], [284, 46]];',
    'const front = [[0, 82 + fat * 14], [60, 86 + fat * 46], [120, 88 + fat * 84], [180, 88 + muscle * 12 + fat * 50], [240, 92 + muscle * 24 + fat * 16], [284, 46]];');
  return s;
});
