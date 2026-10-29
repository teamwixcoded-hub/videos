const fs=require('fs');let p=fs.readFileSync('src/fathers/People.tsx','utf8');
const r=(a,b)=>{if(!p.includes(a)){console.log('MISSING',a.slice(0,60));return;}p=p.replace(a,b)};
r("export const Person: React.FC<PersonProps> = (p) => {",
`// living hands: a slow sway, and, for relaxed poses, a talking gesture that lifts a hand now and then (never a frozen hanging arm)
const FREE = new Set<PoseName>(['stand', 'rest']);
const lively = (t: number, sd: number, pose: PoseName, e: number): [V, V, number] => {
  const a = FREE.has(pose) ? 1 : 0.3, g = Math.pow(Math.max(0, Math.sin(t * 0.85 + sd * 7)), 3) * (FREE.has(pose) ? 1 : 0), g2 = Math.pow(Math.max(0, Math.sin(t * 0.6 + sd * 3 + 2)), 4) * (FREE.has(pose) ? 1 : 0);
  const dN: V = [(Math.sin(t * 1.3 + sd) * 9 + g * 70) * a * e, (Math.sin(t * 1.9 + sd * 2) * 7 - g * 150) * a * e];
  const dF: V = [(Math.sin(t * 1.1 + sd * 3) * 8 + g2 * 40) * a * e, (Math.sin(t * 1.7 + sd) * 6 - g2 * 90) * a * e];
  return [dN, dF, Math.sin(t * 0.55 + sd * 2) * 1.6 + g * 1.5];
};
export const Person: React.FC<PersonProps> = (p) => {`);
r("    const s0 = FRONT.stand(t, 1), L: V = mixV(s0.L, p.handL ? [p.handL[0], p.handL[1] - 92] : q.L, e), R: V = mixV(s0.R, p.handR ? [p.handR[0], p.handR[1] - 92] : q.R, e);",
"    const [lvN, lvF, lvT] = lively(t, sd, pose, e);\n    const s0 = FRONT.stand(t, 1), L0: V = mixV(s0.L, p.handL ? [p.handL[0], p.handL[1] - 92] : q.L, e), R0: V = mixV(s0.R, p.handR ? [p.handR[0], p.handR[1] - 92] : q.R, e);\n    const L: V = [L0[0] + lvF[0], L0[1] + lvF[1]], R: V = [R0[0] + lvN[0], R0[1] + lvN[1]];");
r("lean={(p.lean ?? q.lean ?? 0) + stoop}","lean={(p.lean ?? q.lean ?? 0) + stoop + lvT}");
r("handN: V = mixV(s1.N, [q.N[0] + arms, q.N[1]], e), handF: V = mixV(s1.F, [q.F[0] - arms, q.F[1]], e);",
"handN0: V = mixV(s1.N, [q.N[0] + arms, q.N[1]], e), handF0: V = mixV(s1.F, [q.F[0] - arms, q.F[1]], e);\n  const [lvN, lvF, lvT] = walking ? [[0, 0], [0, 0], 0] as [V, V, number] : lively(t, sd, pose, e);\n  const handN: V = [handN0[0] + lvN[0], handN0[1] + lvN[1]], handF: V = [handF0[0] + lvF[0], handF0[1] + lvF[1]];");
r("torso={(p.lean ?? 0) + (q.torso ?? 0) * e","torso={(p.lean ?? 0) + lvT + (q.torso ?? 0) * e");
r("headPitch={(q.pitch ?? 8) + slump * 6}","headPitch={(q.pitch ?? 8) + slump * 6 + Math.sin(t * 0.7 + sd) * 2}");
fs.writeFileSync('src/fathers/People.tsx',p);
