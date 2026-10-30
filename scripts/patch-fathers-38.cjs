const fs=require('fs');
let a=fs.readFileSync('src/fathers/inserts.tsx','utf8');
const i=a.indexOf("export const LaptopHand");const j=a.indexOf("// ----",i);
const code=`export const LaptopHand: React.FC<{t: number; who: 'adam' | 'sam'; closeAt?: number}> = ({t, who, closeAt = 1.6}) => {
  // side view, the way everyone knows it: a wedge of a base, a lid on a hinge, an arm coming in from the person off-screen. Typing, then the hand pushes the lid down until it clicks shut.
  const warm = who === 'sam', sleeve = warm ? '#b4592f' : '#26324f', closes = who === 'sam';
  const H: [number, number] = [560, 764], L = 540;
  const dur = 0.55, q = closes ? clamp((t - closeAt) / dur, 0, 1) : 0, e = Math.pow(q, 1.7), bounce = q >= 1 ? Math.max(0, Math.sin((t - closeAt - dur) * 26)) * Math.exp(-(t - closeAt - dur) * 14) * 3 : 0;
  const phi = ((105 * (1 - e) + bounce) * Math.PI) / 180, d: [number, number] = [Math.cos(phi), -Math.sin(phi)], n: [number, number] = [Math.sin(phi), Math.cos(phi)];
  const P1: [number, number] = [H[0] + L * d[0], H[1] + L * d[1]];
  const glow = closes ? 1 - ramp(t, closeAt + 0.3, closeAt + dur) : 1;
  // the hand: typing, reaching for the top edge, pushing it down with the lid, lifting away
  const tap = Math.abs(Math.sin(t * 13)) * -9, reach = closes ? ramp(t, closeAt - 0.45, closeAt - 0.02) : 0, away = closes ? ramp(t, closeAt + dur + 0.15, closeAt + dur + 0.6) : 0;
  const typeT: [number, number] = [1010, 742 + tap], topT: [number, number] = [P1[0] - 22 * n[0] + 40 * d[0] * 0 - 14 * n[0] * 0 + 4, P1[1] - 30];
  const push: [number, number] = [typeT[0] + (topT[0] - typeT[0]) * reach, typeT[1] + (topT[1] - typeT[1]) * reach];
  const T: [number, number] = [push[0] + away * 380, push[1] - away * 330];
  const S: [number, number] = [2200, 330];
  const {J: E, H: W} = ik2(S, T, 700, 640, (c) => (c[0][1] > c[1][1] ? c[0] : c[1]));
  const fa = (Math.atan2(W[1] - E[1], W[0] - E[0]) * 180) / Math.PI;
  const arm = \`M \${S[0]},\${S[1]} Q \${2 * E[0] - (S[0] + W[0]) / 2},\${2 * E[1] - (S[1] + W[1]) / 2} \${W[0]},\${W[1]}\`;
  const slab = [H, P1, [P1[0] - 26 * n[0], P1[1] - 26 * n[1]], [H[0] - 26 * n[0], H[1] - 26 * n[1]]].map((p) => p.join(',')).join(' ');
  return (
    <InsertBG tone={warm ? 'warm' : 'cold'}>
      <rect x={0} y={800} width={1920} height={280} fill={warm ? '#8a5a38' : '#4a4658'} stroke={INK} strokeWidth={5} />
      <ellipse cx={900} cy={806} rx={560} ry={22} fill="#000" opacity={0.3} style={{filter: 'blur(8px)'}} />
      {/* the screen's light falls over the keys while the lid is open */}
      {glow > 0.02 && <path d={\`M \${H[0]},\${H[1]} L \${P1[0]},\${P1[1]} L \${P1[0] + 380 * n[0] + 160},\${790} L \${H[0] + 260},\${790} Z\`} fill={warm ? '#fff2cf' : '#cfe2ff'} opacity={0.2 * glow} />}
      {/* base */}
      <rect x={520} y={764} width={720} height={36} rx={11} fill="#b9bfc9" stroke={INK} strokeWidth={6} /><rect x={520} y={764} width={720} height={10} rx={5} fill="#e4e8ef" opacity={0.7} />
      {Array.from({length: 18}, (_, k) => <rect key={k} x={610 + k * 30} y={756} width={22} height={8} rx={2} fill="#4a5060" stroke={INK} strokeWidth={1.6} />)}
      <rect x={535} y={770} width={44} height={26} rx={8} fill="#7a8190" stroke={INK} strokeWidth={3} />
      {/* lid on its hinge: the slab, the lit screen face, the logo on the back */}
      <polygon points={slab} fill="#aab1bd" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      {phi > 0.18 && <line x1={H[0] + 12 * n[0]} y1={H[1] + 12 * n[1]} x2={P1[0] + 12 * n[0]} y2={P1[1] + 12 * n[1]} stroke={warm ? '#fff6dc' : '#e3efff'} strokeWidth={8} strokeLinecap="round" opacity={glow} />}
      <circle cx={H[0] + L * 0.5 * d[0] - 13 * n[0] * -1 * 0 - 13 * n[0] * 0 + 26 * n[0] * -0.5} cy={H[1] + L * 0.5 * d[1] - 13 * n[1]} r={14} fill="#f4f7ff" opacity={0.75} stroke={INK} strokeWidth={2} />
      <circle cx={H[0]} cy={H[1] - 12} r={13} fill="#7a8190" stroke={INK} strokeWidth={4} />
      {/* the arm comes in from the person off-screen (a sleeve, an elbow, a wrist) and ends in a mitten hand with the thumb up */}
      <path d={arm} fill="none" stroke={INK} strokeWidth={104} strokeLinecap="round" /><path d={arm} fill="none" stroke={sleeve} strokeWidth={92} strokeLinecap="round" />
      <path d={\`M \${E[0] + (W[0] - E[0]) * 0.74},\${E[1] + (W[1] - E[1]) * 0.74} L \${W[0]},\${W[1]}\`} stroke="#f3efe6" strokeWidth={70} strokeLinecap="butt" opacity={0.95} />
      <g transform={\`translate(\${W[0]} \${W[1]}) rotate(\${fa - 90 + (closes && reach > 0.6 && away < 0.5 ? 6 : 0)}) scale(-2.1 2.1) translate(0 -8)\`}>
        <path d="M -18,-4 Q -24,26 -16,44 Q 0,50 16,44 Q 24,26 18,-4 Z" fill="#f3f0fb" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <path d="M 14,6 Q 34,10 34,-14 Q 30,-26 20,-16" fill="#f3f0fb" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        <path d="M -6,38 Q 0,42 8,38" fill="none" stroke="#d9d3ec" strokeWidth={3} strokeLinecap="round" />
      </g>
      {closes && q >= 1 && <text x={H[0] + 280} y={640} textAnchor="middle" fontFamily={HAND} fontWeight={600} fontSize={84} fill="#fff6e6" opacity={ramp(t, closeAt + dur, closeAt + dur + 0.2) * (1 - away)}>click.</text>}
    </InsertBG>
  );
};

`;
a=a.slice(0,i)+code+a.slice(j);
a=a.replace("import {shade} from './People';","import {shade} from './People';\nimport {ik2} from '../same2d/SideChar';");
fs.writeFileSync('src/fathers/inserts.tsx',a);
