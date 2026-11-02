const fs = require('fs');
const edit = (file, fn) => { if (process.env.ONLY && !file.includes(process.env.ONLY)) return; let s = fs.readFileSync(file, 'utf8'); s = fn(s); fs.writeFileSync(file, s); };
const rep = (s, a, b) => { if (!s.includes(a)) throw new Error('missing: ' + String(a).slice(0, 80)); return s.replace(a, b); };
const between = (s, a, b, text) => { const i = s.indexOf(a), j = s.indexOf(b, i); if (i < 0 || j < 0) throw new Error('between: ' + a.slice(0, 40)); return s.slice(0, i) + text + s.slice(j); };

// ---- limb.tsx cleanup
edit('src/winter/limb.tsx', (s) => {
  s = between(s, '  const loop: V[]', '  const n = pts.length;', "  const start = cap(t0, -1);   // from the -normal side round the back to the +normal side\n  const pts: V[] = [...L, ...cap(t1, 1), ...[...R].reverse(), ...start];\n");
  return s;
});

// ---- Hero.tsx (front view)
edit('src/winter/Hero.tsx', (s) => {
  s = rep(s, "import {BubbleHead} from './Bubble';", "import {BubbleHead} from './Bubble';\nimport {Limb, limbAt} from './limb';");
  // smoother hands: ovals instead of rounded boxes
  s = rep(s, '<rect x={-27} y={-4} width={54} height={50} rx={22} fill={skin} stroke={INK} strokeWidth={8} />', '<ellipse cx={0} cy={22} rx={28} ry={27} fill={skin} stroke={INK} strokeWidth={8} />');
  s = rep(s, '<rect x={-30} y={-6} width={60} height={46} rx={20} fill={skin} stroke={INK} strokeWidth={8} />', '<ellipse cx={0} cy={17} rx={30} ry={25} fill={skin} stroke={INK} strokeWidth={8} />');
  s = rep(s, '<rect x={-26} y={-2} width={52} height={20} rx={10} fill={skin} />', '<ellipse cx={0} cy={8} rx={25} ry={14} fill={skin} />');
  // arms
  s = between(s, '  const side = (s: 1 | -1) => {', '  const torso =', `  const side = (s: 1 | -1) => {
    const t = (s === -1 ? P.armL : P.armR) ?? P.arm ?? [5, 233];
    const sh: V = [s * (sw - 8), NECK_Y + 50];
    const tgt: V = [sh[0] + s * t[0], sh[1] + t[1]];
    const {el, wr} = ik(sh, tgt, 122, 116, P.elbowIn ? (-s as 1 | -1) : s);
    const kind = (s === -1 ? P.handL : P.handR) ?? P.hand ?? 'relaxed';
    const ang = Math.atan2(wr[1] - el[1], wr[0] - el[0]) * 180 / Math.PI;
    const bare = top === 'bare' || top === 'tank';
    const geom = {pts: [sh, el, wr] as [V, V, V], w: [armW * 1.04, armW * 0.8, foreW * 0.7] as [number, number, number], bump: [{t: 0.26, amt: armW * (0.08 + muscle * 0.5 + fat * 0.14), sigma: 0.14}, {t: 0.72, amt: armW * (0.04 + muscle * 0.16), sigma: 0.16}]};
    const bi = limbAt(geom.pts, 0.26);
    return (
      <g key={s}>
        <Limb {...geom} fill={skin} />
        {top === 'tee' && <Limb {...geom} t1={0.4} extra={8} flat fill={fabric} stroke={8} />}
        {longSleeve && <g><Limb {...geom} t1={0.92} extra={5} flat fill={fabric} stroke={8} /><Limb {...geom} t0={0.84} t1={0.92} extra={8} flat fill={shade(fabric, 0.8)} stroke={7} /></g>}
        {muscle > 0.2 && bare && <ellipse cx={bi[0] - s * 4} cy={bi[1] - 8} rx={armW * 0.26} ry={armW * 0.17} fill="#fff" opacity={0.3} />}
        <circle cx={sh[0]} cy={sh[1]} r={armW * 0.52 + 2} fill={bare ? skin : fabric} />
        <Hand p={wr} ang={ang} kind={kind} r={armW * 0.66 + 4} skin={skin} />
      </g>
    );
  };
`);
  // smoother torso: rounded shoulders and hem
  s = between(s, '  const torso = `', '  const leg = (s', "  const torso = `M ${-sw * 0.46},${NECK_Y + 4} Q 0,${NECK_Y - 16} ${sw * 0.46},${NECK_Y + 4} Q ${sw * 0.92},${NECK_Y + 8} ${sw},${NECK_Y + 48} C ${sw + 6},${NECK_Y + 112} ${sw * 0.9},${NECK_Y + 170} ${bw + belly},${NECK_Y + 246} C ${bw + belly + 16},${NECK_Y + 292} ${hw},${NECK_Y + 306} ${hw},${NECK_Y + TORSO_H - 12} Q ${hw},${NECK_Y + TORSO_H + 4} ${hw - 22},${NECK_Y + TORSO_H + 4} L ${-hw + 22},${NECK_Y + TORSO_H + 4} Q ${-hw},${NECK_Y + TORSO_H + 4} ${-hw},${NECK_Y + TORSO_H - 12} C ${-hw},${NECK_Y + 306} ${-bw - belly - 16},${NECK_Y + 292} ${-bw - belly},${NECK_Y + 246} C ${-sw * 0.9},${NECK_Y + 170} ${-sw - 6},${NECK_Y + 112} ${-sw},${NECK_Y + 48} Q ${-sw * 0.92},${NECK_Y + 8} ${-sw * 0.46},${NECK_Y + 4} Z`;\n");
  // legs
  s = between(s, '  const leg = (s: 1 | -1) => {', '  return (\n    <g transform={lean', `  const leg = (s: 1 | -1) => {
    const t = (s === -1 ? P.footL : P.footR) ?? P.foot ?? [10, 0];
    const hip: V = [s * (hw * 0.5), NECK_Y + TORSO_H - 10], ank: V = [s * (hw * 0.5 + 12 + t[0]), -30 + t[1]];
    const {el: kn} = ik(hip, ank, 124, 124, s);
    const geom = {pts: [hip, kn, ank] as [V, V, V], w: [legW * 1.04, calfW * 1.02, calfW * 0.6] as [number, number, number], bump: [{t: 0.3, amt: legW * (0.04 + muscle * 0.18 + fat * 0.1), sigma: 0.16}, {t: 0.72, amt: calfW * (0.08 + muscle * 0.28), sigma: 0.14}]};
    return (
      <g key={s}>
        <Limb {...geom} fill={pants} />
        {shorts && <Limb {...geom} t1={0.5} extra={6} flat fill={shade(pants, 1.18)} stroke={8} />}
        <g transform={\`translate(\${ank[0]} \${ank[1]}) rotate(\${s * 8})\`}>
          <path d="M -36,30 Q -44,-8 -6,-16 Q 34,-22 48,14 Q 56,34 36,36 L -30,36 Q -38,36 -36,30 Z" fill={shoe} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
          <path d="M -34,26 L 40,26" stroke="#c9ced8" strokeWidth={10} strokeLinecap="round" /><path d="M -2,-6 Q 12,-2 20,8" stroke={INK} strokeWidth={4} fill="none" opacity={0.5} strokeLinecap="round" />
          <path d="M -36,36 L 40,36" stroke={INK} strokeWidth={9} strokeLinecap="round" />
        </g>
      </g>
    );
  };
`);
  s = rep(s, '<rect x={-34} y={NECK_Y - 40} width={68} height={80} fill={skin} stroke={INK} strokeWidth={9} />', '<rect x={-34} y={NECK_Y - 40} width={68} height={80} rx={26} fill={skin} stroke={INK} strokeWidth={9} />');
  return s;
});

// ---- SideHero.tsx
edit('src/winter/SideHero.tsx', (s) => {
  s = rep(s, "import {Head, HeadProps, Hand, Seg, ik,", "import {Limb, limbAt} from './limb';\nimport {Head, HeadProps, Hand, ik,");
  s = between(s, '  const arm = (hand: V', '  const leg = (foot: V', `  const arm = (hand: V, kind: HandKind, held: Prop | undefined, dir: 1 | -1, far: boolean) => {
    const k = far ? 0.8 : 1, sk = shade(skin, k), fb = shade(fabric, k);
    const {el, wr} = ik(sh, hand, 122, 116, dir);
    const ang = Math.atan2(wr[1] - el[1], wr[0] - el[0]) * 180 / Math.PI;
    const bare = top === 'bare' || top === 'tank';
    const geom = {pts: [sh, el, wr] as [V, V, V], w: [armW * 1.04, armW * 0.8, foreW * 0.7] as [number, number, number], bump: [{t: 0.26, amt: armW * (0.08 + muscle * 0.5 + fat * 0.14), sigma: 0.14}, {t: 0.72, amt: armW * (0.04 + muscle * 0.16), sigma: 0.16}]};
    const bi = limbAt(geom.pts, 0.26);
    return (
      <g>
        <Limb {...geom} fill={sk} />
        {top === 'tee' && <Limb {...geom} t1={0.4} extra={8} flat fill={fb} stroke={8} />}
        {longSleeve && <g><Limb {...geom} t1={0.92} extra={5} flat fill={fb} stroke={8} /><Limb {...geom} t0={0.84} t1={0.92} extra={8} flat fill={shade(fabric, 0.8 * k)} stroke={7} /></g>}
        {muscle > 0.2 && bare && <ellipse cx={bi[0] + 2} cy={bi[1] - 8} rx={armW * 0.26} ry={armW * 0.17} fill="#fff" opacity={0.3} />}
        <circle cx={sh[0]} cy={sh[1]} r={armW * 0.52 + 2} fill={bare ? sk : fb} />
        <Hand p={wr} ang={ang} kind={kind} r={armW * 0.66 + 4} skin={sk} />
        {held && <PropArt k={held} p={wr} ang={ang} />}
      </g>
    );
  };
`);
  s = between(s, '  const leg = (foot: V', '  const headScale = hs', `  const leg = (foot: V, far: boolean) => {
    const k = far ? 0.8 : 1, pc = shade(pants, k);
    const {el: kn} = ik(hip, foot, 124, 124, P.kneeDir ?? 1);
    const geom = {pts: [hip, kn, foot] as [V, V, V], w: [legW * 1.04, calfW * 1.02, calfW * 0.6] as [number, number, number], bump: [{t: 0.3, amt: legW * (0.04 + muscle * 0.18 + fat * 0.1), sigma: 0.16}, {t: 0.72, amt: calfW * (0.08 + muscle * 0.28), sigma: 0.14}]};
    return (
      <g>
        <Limb {...geom} fill={pc} />
        {shorts && <Limb {...geom} t1={0.5} extra={6} flat fill={shade(pants, 1.18 * k)} stroke={8} />}
        <g transform={\`translate(\${foot[0]} \${foot[1]})\`}>
          <path d="M -36,30 Q -44,-8 -8,-16 L 20,-14 Q 58,-8 68,20 Q 72,38 54,38 L -30,38 Q -38,38 -36,30 Z" fill={shade(shoe, k)} stroke={INK} strokeWidth={9} strokeLinejoin="round" />
          <path d="M -34,28 L 62,28" stroke="#c9ced8" strokeWidth={10} strokeLinecap="round" opacity={k} /><path d="M 4,-8 Q 22,-4 32,10" stroke={INK} strokeWidth={4} fill="none" opacity={0.5} strokeLinecap="round" />
          <path d="M -34,38 L 62,38" stroke={INK} strokeWidth={9} strokeLinecap="round" />
        </g>
      </g>
    );
  };
`);
  s = rep(s, '<rect x={neck[0] - 28} y={neck[1] - 30} width={56} height={60} fill={skin}', '<rect x={neck[0] - 28} y={neck[1] - 30} width={56} height={60} rx={22} fill={skin}');
  return s;
});
