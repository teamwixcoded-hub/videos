const fs=require('fs');
const r=(f,a,b,tag)=>{if(!f.s.includes(a)){console.log('MISSING',tag||a.slice(0,60));return;}f.s=f.s.replace(a,b)};
const P={s:fs.readFileSync('src/fathers/People.tsx','utf8')};
r(P,"children?: React.ReactNode;\n};\n\n// ---- side view","hN?: V; hF?: V; children?: React.ReactNode;\n};\n\n// ---- side view",'props');
r(P,"handN0: V = mixV(s1.N, [q.N[0] + arms, q.N[1]], e), handF0: V = mixV(s1.F, [q.F[0] - arms, q.F[1]], e);","handN0: V = p.hN ?? mixV(s1.N, [q.N[0] + arms, q.N[1]], e), handF0: V = p.hF ?? mixV(s1.F, [q.F[0] - arms, q.F[1]], e);",'hands');
fs.writeFileSync('src/fathers/People.tsx',P.s);

const S={s:fs.readFileSync('src/fathers/shots.tsx','utf8')};
r(S,"export const KWORDS: KW[] = [",`// ---------------- Adam's father at the factory: take a crate off table A, turn, walk to table B, set it down, walk back (a 6 s cycle) ----------------
const sm = (x: number) => { const k = Math.min(1, Math.max(0, x)); return k * k * (3 - 2 * k); };
const mixN = (a: number, b: number, k: number) => a + (b - a) * k;
const CRATE = (w: number, h: number) => <g><rect x={-w / 2} y={-h / 2} width={w} height={h} rx={5} fill="#c9954a" stroke="#1d1a2e" strokeWidth={4} /><rect x={-w / 2} y={-h / 2} width={w} height={h * 0.26} fill="#e0b068" stroke="#1d1a2e" strokeWidth={3} /><rect x={-10} y={-h / 2} width={20} height={h} fill="#d9c9a0" opacity={0.6} /><path d={\`M \${-w / 2 + 12},\${h / 2 - 16} h 26 M \${-w / 2 + 12},\${h / 2 - 8} h 16\`} stroke="#6a4a24" strokeWidth={3} strokeLinecap="round" /></g>;
const BENCH = (x: number, crate: boolean, k = 1) => (
  <g>
    <rect x={x - 100} y={650} width={200} height={16} rx={4} fill="#5a4a3a" stroke="#1d1a2e" strokeWidth={4} /><rect x={x - 90} y={666} width={12} height={164} fill="#3a2f26" /><rect x={x + 78} y={666} width={12} height={164} fill="#3a2f26" />
    {crate && <g transform={\`translate(\${x} \${611 - 40 * (1 - k)})\`} opacity={k}><g transform="scale(0.7225)">{CRATE(150, 106)}</g></g>}
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
  const crate = carrying ? <g transform={\`translate(\${hn[0] + mixN(18, 40, hold)} \${hn[1] + mixN(10, -34, hold)})\`}>{CRATE(150, 106)}</g> : null;
  const p0 = stand('adam', 60, x, 0.85, {outfit: 'work', pose: carrying ? 'carry' : 'stand', turn: face, face: F.tired, walk, hN: hn, hF: hf, lean, children: crate});
  const aOn = u < 0.7 || u >= 4.8, aK = u < 0.7 ? 1 : sm((u - 4.8) / 0.4), bOn = u >= 3.7 && u < 5.6, bK = u < 5.2 ? 1 : 1 - sm((u - 5.2) / 0.4);
  return SC.fac(c, [camA, camB], <>{BENCH(1475, aOn, aK)}{BENCH(794, bOn, bK)}{Pe(c, p0)}</>);
};

export const KWORDS: KW[] = [`,'factory');
S.s=S.s.replace(/  \[T\("adam's father worked double shifts"\), 'f', \(c\) => SC\.fac\(.*\n/,"  [T(\"adam's father worked double shifts\"), 'f', (c) => factoryWork(c, 0, Z(1250, 540, 1.1), Z(1250, 540, 1.3))],\n");
S.s=S.s.replace(/  \[T\('for 30 years'\), undefined, \(c\) => SC\.fac\(.*\n/,"  [T('for 30 years'), undefined, (c) => factoryWork(c, 2.5, Z(1150, 540, 1.25), Z(1250, 540, 1.1))],\n");
fs.writeFileSync('src/fathers/shots.tsx',S.s);
console.log(S.s.includes('factoryWork(c, 2.5'));
