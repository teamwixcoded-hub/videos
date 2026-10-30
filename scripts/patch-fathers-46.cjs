const fs=require('fs');
const r=(f,a,b,tag)=>{if(!f.s.includes(a)){console.log('MISSING',tag||a.slice(0,60));return;}f.s=f.s.split(a).join(b)};
// ---------- held.tsx
const He={s:fs.readFileSync('src/fathers/held.tsx','utf8')};
r(He,'<g transform="translate(0 28)">\n    <defs>','<g transform="translate(0 86)">\n    <defs>','phone offset');
const ci=He.s.indexOf("// a tea cup with a handle");const cj=He.s.indexOf("\n};\n",ci)+4;
He.s=He.s.slice(0,ci)+`// a tea cup held upright in a fist that stays upright too (thumb up, four fingers wrapped round the front), centred on the hand. k = how far into a sip: the cup tips toward the lips.
export const CupHeld: React.FC<{t?: number; k?: number}> = ({t = 0, k = 0}) => (
  <g transform={\`rotate(\${-k * 24})\`}>
    {[-10, 4, 16].map((dx, i) => <path key={i} d={\`M \${dx},-46 q \${10 + 3 * Math.sin(t * 2 + i)},-16 0,-30 q -10,-14 3,-28\`} fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={(0.3 + 0.15 * Math.sin(t * 3 + i * 2)) * (1 - k)} />)}
    <path d="M -30,-34 L 30,-34 L 24,18 Q 0,28 -24,18 Z" fill="#f4f2fb" stroke={INK} strokeWidth={3.6} strokeLinejoin="round" />
    <ellipse cx={0} cy={-34} rx={30} ry={8} fill="#b8743c" stroke={INK} strokeWidth={3} /><ellipse cx={-8} cy={-36} rx={11} ry={2.6} fill="#e8b078" opacity={0.7} />
    <path d="M -18,-24 q -3,20 2,36" fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" opacity={0.75} />
    <path d="M 30,-24 q 24,2 18,18 q -5,10 -22,8" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
    {/* the fist: palm behind the cup, four finger bumps across the front, the thumb standing up on the near side */}
    <path d="M -34,-6 Q -40,22 -22,28 L 22,28 Q 40,22 34,-6 Z" fill="#f3f0fb" stroke={INK} strokeWidth={3.4} strokeLinejoin="round" />
    {[-20, -7, 6, 19].map((x) => <path key={x} d={\`M \${x - 6},-10 Q \${x},-18 \${x + 6},-10 L \${x + 6},12 Q \${x},18 \${x - 6},12 Z\`} fill="#f3f0fb" stroke={INK} strokeWidth={2.6} strokeLinejoin="round" />)}
    <path d="M -34,2 Q -50,-6 -44,-30 Q -40,-42 -32,-34 Q -30,-18 -26,-4" fill="#f3f0fb" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
  </g>
);
`+He.s.slice(cj);
// film phone: both hands are behind the phone, only finger tips curl round its two ends
r(He,"    <circle cx={96} cy={-58} r={9} fill=\"#ff3b3b\" opacity={0.5 + 0.5 * rec} />","    <circle cx={96} cy={-58} r={9} fill=\"#ff3b3b\" opacity={0.5 + 0.5 * rec} />\n    {[-1, 1].map((s) => <g key={s}>{[-26, -4, 18].map((y, i) => <path key={i} d={`M ${s * 88},${y} Q ${s * 112},${y + 2} ${s * 106},${y + 15} L ${s * 88},${y + 15} Z`} fill=\"#f3f0fb\" stroke={INK} strokeWidth={3} strokeLinejoin=\"round\" />)}<path d={`M ${s * 60},-70 Q ${s * 78},-96 ${s * 92},-72 Q ${s * 84},-58 ${s * 66},-60 Z`} fill=\"#f3f0fb\" stroke={INK} strokeWidth={3} strokeLinejoin=\"round\" /></g>)}",'film tips');
fs.writeFileSync('src/fathers/held.tsx',He.s);
// ---------- Human.tsx: upright held objects bring their own fist; film hides the mittens
const H={s:fs.readFileSync('src/fathers/Human.tsx','utf8')};
r(H,"<g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}><g transform=\"translate(0 -6)\"><Mitten curl={curl} s={s * 1.25} /></g></g>","{!(held && upright) && !noHand && <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}><g transform=\"translate(0 -6)\"><Mitten curl={curl} s={s * 1.25} /></g></g>}",'mitten both');
r(H,"{held && <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}><g transform={`translate(0 -6) ${upright ? `rotate(${-(fa - 90)})` : ''}`}>{held}</g></g>}","{held && (upright ? <g transform={`translate(${H[0]} ${H[1]})`}>{held}</g> : <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}><g transform=\"translate(0 -6)\">{held}</g></g>)}",'held both');
r(H,"held?: React.ReactNode; upright?: boolean}> = ({S, T, o, dim, curl = 0.35, s, held, upright}) => {","held?: React.ReactNode; upright?: boolean; noHand?: boolean}> = ({S, T, o, dim, curl = 0.35, s, held, upright, noHand}) => {",'arm sig');
r(H,"held?: React.ReactNode; upright?: boolean}> = ({S, T, o, s, curl, held, upright}) => {","held?: React.ReactNode; upright?: boolean; noHand?: boolean}> = ({S, T, o, s, curl, held, upright, noHand}) => {",'front arm sig');
r(H,"<FrontArm S={SL} T={hl} o={o} s={-1} curl={curl} />","<FrontArm S={SL} T={hl} o={o} s={-1} curl={curl} noHand={noHands} />",'FL');
r(H,"<FrontArm S={SR} T={hr} o={o} s={1} curl={curl} held={heldR} upright={heldUp} />","<FrontArm S={SR} T={hr} o={o} s={1} curl={curl} held={heldR} upright={heldUp} noHand={noHands} />",'FR');
r(H,"heldR?: React.ReactNode; heldUp?: boolean; children?: React.ReactNode;\n};","heldR?: React.ReactNode; heldUp?: boolean; noHands?: boolean; children?: React.ReactNode;\n};",'front props');
r(H,"curl = 0.35, heldR, heldUp, children}) => {","curl = 0.35, heldR, heldUp, noHands, children}) => {",'front destr');
fs.writeFileSync('src/fathers/Human.tsx',H.s);
// ---------- People
const P={s:fs.readFileSync('src/fathers/People.tsx','utf8')};
r(P,"holds === 'cup' ? <CupHeld t={t} /> : undefined;","holds === 'cup' ? <CupHeld t={t} k={sip(t)} /> : undefined;",'cup k');
r(P,"heldR={heldNode} heldUp={holds === 'cup'}","heldR={heldNode} heldUp={holds === 'cup'} noHands={pose === 'film'}",'film nohands');
fs.writeFileSync('src/fathers/People.tsx',P.s);
// ---------- shots: no extra table cups where people hold cups
const S={s:fs.readFileSync('src/fathers/shots.tsx','utf8')};
r(S,"const four = (c: Ctx, cups = 4) =>","const four = (c: Ctx, cups = 0) =>",'four');
S.s=S.s.replace(/(SC\.tea\(c, \[Z\(1700, [0-9]+, [0-9.]+\), Z\(1700, [0-9]+, [0-9.]+\)\], \{season: [12], sunset: [0-9.]+)(\}, benchPair)/g,"$1, cups: 0$2");
S.s=S.s.replace(/(SC\.tea\(c, \[Z\(1700, 560, 1\.5\), Z\(1600, 540, 0\.95\)\], \{season: 2, sunset: 1)(\}, benchPair)/,"$1, cups: 0$2");
fs.writeFileSync('src/fathers/shots.tsx',S.s);
console.log((S.s.match(/cups: 0\}, benchPair/g)||[]).length);
// ---------- a fruit bowl that makes sense
const D={s:fs.readFileSync('src/fathers/details.tsx','utf8')};
const fi=D.s.indexOf("    <g transform=\"translate(1600 706)\">");
const fj=D.s.indexOf("</g>),",fi);
console.log(fi,fj);
