const fs=require('fs');let h=fs.readFileSync('src/fathers/Human.tsx','utf8');
const r=(a,b,t)=>{if(!h.includes(a)){console.log('MISSING',t||a.slice(0,60));return;}h=h.split(a).join(b)};
// a tapered limb: thick at the shoulder/hip, thinner at the wrist/ankle, one smooth curve through the joint, round at both ends
const i=h.indexOf("const Noodle: React.FC");const mm=/\r?\n};\r?\n/.exec(h.slice(i));const j=i+mm.index+mm[0].length;
if(i<0)throw new Error('Noodle');
h=h.slice(0,i)+`const Noodle: React.FC<{A: V; J: V; B: V; w: number; w2?: number; fill: string}> = ({A, J, B, w, w2, fill}) => {
  const e = w2 ?? w, c: V = [2 * J[0] - (A[0] + B[0]) / 2, 2 * J[1] - (A[1] + B[1]) / 2], N = 16;
  const pts: V[] = [], nor: V[] = [], ws: number[] = [];
  for (let k = 0; k <= N; k++) {
    const t = k / N, u = 1 - t, x = u * u * A[0] + 2 * u * t * c[0] + t * t * B[0], y = u * u * A[1] + 2 * u * t * c[1] + t * t * B[1];
    const dx = 2 * u * (c[0] - A[0]) + 2 * t * (B[0] - c[0]), dy = 2 * u * (c[1] - A[1]) + 2 * t * (B[1] - c[1]), L = Math.hypot(dx, dy) || 1;
    // the muscle bulge: a little fuller a third of the way down
    pts.push([x, y]); nor.push([-dy / L, dx / L]); ws.push((w + (e - w) * t + Math.sin(t * Math.PI) * w * 0.06) / 2);
  }
  const side = (s: number) => pts.map((p, k) => [p[0] + nor[k][0] * ws[k] * s, p[1] + nor[k][1] * ws[k] * s] as V);
  const L1 = side(1), R1 = side(-1).reverse(), d = 'M ' + [...L1, ...R1].map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L ') + ' Z';
  return (
    <g>
      <g stroke={INK} strokeWidth={4.6} strokeLinejoin="round" fill={INK}><path d={d} /><circle cx={A[0]} cy={A[1]} r={ws[0]} /><circle cx={B[0]} cy={B[1]} r={ws[N]} /></g>
      <g fill={fill}><path d={d} /><circle cx={A[0]} cy={A[1]} r={ws[0] - 0.4} /><circle cx={B[0]} cy={B[1]} r={ws[N] - 0.4} /></g>
    </g>
  );
};
`+h.slice(j);
r("<Noodle A={S} J={E} B={wr} w={44} fill={o.top} />","<Noodle A={S} J={E} B={wr} w={50} w2={37} fill={o.top} />",'arm');
r("<Noodle A={HJ} J={K} B={A} w={60} fill={o.pants} />","<Noodle A={HJ} J={K} B={A} w={76} w2={48} fill={o.pants} />",'leg');
// seated front view: the thighs point at the camera (short), the shins drop straight down, knees apart
r("<Noodle A={[s * 56, 40]} J={[s * 84, 150]} B={[s * 76, 268]} w={64} fill={o.pants} />","<Noodle A={[s * 52, 34]} J={[s * 92, 86]} B={[s * 80, 268]} w={80} w2={50} fill={o.pants} />",'front leg');
fs.writeFileSync('src/fathers/Human.tsx',h);
