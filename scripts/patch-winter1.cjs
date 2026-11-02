const fs = require('fs');
let s = fs.readFileSync('src/winter/Hero.tsx', 'utf8');
const rep = (a, b) => { if (!s.includes(a)) throw new Error('missing: ' + a.slice(0, 50)); s = s.replace(a, b); };
rep('const LEG_H = 330, TORSO_H = 330', 'const LEG_H = 260, TORSO_H = 300');
// seamless arm: one outline pass, then fills without outlines
rep(/const arm = \(s: 1 \| -1\) => \{[\s\S]*?\n  \};\n  const torso/.exec(s)[0], `const arm = (s: 1 | -1) => {
    const sh: [number, number] = [s * (sw - 10), NECK_Y + 46], el: [number, number] = [s * (sw + 8), NECK_Y + 160], hd: [number, number] = [s * (sw + 14), NECK_Y + 268];
    const mid = (a: [number, number], b: [number, number], t: number): [number, number] => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    const P = (pts: [number, number][]) => pts.map((p, i) => (i ? 'L' : 'M') + ' ' + p[0] + ',' + p[1]).join(' ');
    return (
      <g>
        <path d={P([sh, el, hd])} stroke={INK} strokeWidth={armW + 14} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d={P([el, hd])} stroke={longSleeve ? fabric : skin} strokeWidth={armW * 0.84} strokeLinecap="round" fill="none" />
        <path d={P([sh, el])} stroke={top === 'tee' || longSleeve ? fabric : skin} strokeWidth={armW} strokeLinecap="round" fill="none" />
        {top === 'tee' && <path d={P([sh, mid(sh, el, 0.35)])} stroke={fabric} strokeWidth={armW + 8} strokeLinecap="round" fill="none" />}
        <circle cx={hd[0]} cy={hd[1] + 14} r={armW * 0.64} fill={skin} stroke={INK} strokeWidth={8} />
      </g>
    );
  };
  const torso`);
rep('${-bw - belly + 20},${NECK_Y + 236} Q 0,${NECK_Y + 214} ${bw + belly - 20},${NECK_Y + 236} L ${bw + belly - 30},${NECK_Y + 286} Q 0,${NECK_Y + 270} ${-bw - belly + 30},${NECK_Y + 286} Z', '${-bw * 0.8},${NECK_Y + 210} Q 0,${NECK_Y + 196} ${bw * 0.8},${NECK_Y + 210} L ${bw * 0.74},${NECK_Y + 262} Q 0,${NECK_Y + 276} ${-bw * 0.74},${NECK_Y + 262} Z');
rep('<rect x={-34} y={NECK_Y - 40} width={68} height={70}', '<rect x={-30} y={NECK_Y - 26} width={60} height={60}');
rep('headScale = 0.62', 'headScale = 0.8');
rep('NECK_Y - 112 * headScale + slump * 26', 'NECK_Y - (200 * headScale - 34) + slump * 22');
fs.writeFileSync('src/winter/Hero.tsx', s);
