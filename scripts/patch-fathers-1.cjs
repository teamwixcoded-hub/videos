// proportions, neck, brows, seats for the Two Fathers cast
const fs = require('fs');
const P = (f) => 'src/fathers/' + f;
const edit = (file, pairs) => {
  let s = fs.readFileSync(P(file), 'utf8');
  for (const [a, b, all] of pairs) {
    if (!s.includes(a)) { console.log('MISSING in', file, ':', a.slice(0, 70)); continue; }
    s = all ? s.split(a).join(b) : s.replace(a, b);
  }
  fs.writeFileSync(P(file), s);
};
edit('People.tsx', [
  // brow: + tilt = worried (inner ends up), - = angry
  ['transform={`rotate(${-s * tilt} ${cx} ${by})`}', 'transform={`rotate(${s * tilt} ${cx} ${by})`}'],
  // torso wider
  ['M -102,${-212 + sy} Q -106,${-262 + sy} -62,${-272 + sy} L 62,${-272 + sy} Q 106,${-262 + sy} 102,${-212 + sy} L 94,6 Q 0,22 -94,6 Z', 'M -124,${-208 + sy} Q -128,${-262 + sy} -70,${-274 + sy} L 70,${-274 + sy} Q 128,${-262 + sy} 124,${-208 + sy} L 108,8 Q 0,26 -108,8 Z'],
  ['const SL: V = [-100 * turnW + turn * 12, -228 + sy], SR: V = [100 * turnW + turn * 12, -228 + sy];', 'const SL: V = [-112 * turnW + turn * 12, -226 + sy], SR: V = [112 * turnW + turn * 12, -226 + sy];'],
  // thicker limbs
  ['<line x1={S[0]} y1={S[1]} x2={E[0]} y2={E[1]} strokeWidth={52} /><line x1={E[0]} y1={E[1]} x2={wr[0]} y2={wr[1]} strokeWidth={46} />', '<line x1={S[0]} y1={S[1]} x2={E[0]} y2={E[1]} strokeWidth={62} /><line x1={E[0]} y1={E[1]} x2={wr[0]} y2={wr[1]} strokeWidth={54} />'],
  ['<line x1={S[0]} y1={S[1]} x2={E[0]} y2={E[1]} strokeWidth={43} /><line x1={E[0]} y1={E[1]} x2={wr[0]} y2={wr[1]} strokeWidth={37} />', '<line x1={S[0]} y1={S[1]} x2={E[0]} y2={E[1]} strokeWidth={53} /><line x1={E[0]} y1={E[1]} x2={wr[0]} y2={wr[1]} strokeWidth={45} />'],
  ['strokeWidth={39} strokeLinecap="butt"', 'strokeWidth={47} strokeLinecap="butt"'],
  // neck and a bigger head that sits on it
  ['<rect x={-24} y={-310 + sy} width={48} height={46} rx={14}', '<rect x={-30} y={-318 + sy} width={60} height={56} rx={16}'],
  ['translate(0 ${-70 + (hk - 1) * -22}) scale(${hk})', 'translate(0 ${-40 - (hk - 1) * 90}) scale(${hk * 1.16})'],
  // shorter legs
  ["const sw = Math.sin(walk * Math.PI * 2), side = Math.abs(turn) > 0.5;", "const sw = Math.sin(walk * Math.PI * 2), side = Math.abs(turn) > 0.5, LEG = 330;"],
  ['fy = 430 - (side', 'fy = LEG - (side'],
  ['x1={s * 44} y1={12} x2={fx} y2={fy - 14} stroke={INK} strokeWidth={76}', 'x1={s * 50} y1={12} x2={fx} y2={fy - 14} stroke={INK} strokeWidth={86}'],
  ['x1={s * 44} y1={12} x2={fx} y2={fy - 14} stroke={look.pants} strokeWidth={67}', 'x1={s * 50} y1={12} x2={fx} y2={fy - 14} stroke={look.pants} strokeWidth={77}'],
  ["sitDrop = 330, walk = 0", "sitDrop = 250, walk = 0"],
  ['x2={s * 70} y2={118} stroke={INK} strokeWidth={80}', 'x2={s * 70} y2={104} stroke={INK} strokeWidth={90}'],
  ['x2={s * 70} y2={118} stroke={look.pants} strokeWidth={71}', 'x2={s * 70} y2={104} stroke={look.pants} strokeWidth={81}'],
  ['x1={s * 70} y1={118} x2={s * 66} y2={drop} stroke={INK} strokeWidth={62}', 'x1={s * 70} y1={104} x2={s * 66} y2={drop} stroke={INK} strokeWidth={70}'],
  ['x1={s * 70} y1={118} x2={s * 66} y2={drop} stroke={look.pants} strokeWidth={53}', 'x1={s * 70} y1={104} x2={s * 66} y2={drop} stroke={look.pants} strokeWidth={61}'],
]);
edit('kit.tsx', [
  ['y: FLOOR - 450 * sc * bodyK(who, age), scale: sc, ...o})', 'y: FLOOR - 350 * sc * bodyK(who, age), scale: sc, ...o})'],
  ['y: floor - 364 * sc * bodyK(who, age), scale: sc, legs: \'sit\', sitDrop: 330, ...o})', 'y: floor - 284 * sc * bodyK(who, age), scale: sc, legs: \'sit\', sitDrop: 250, ...o})'],
  ['p.y - 410 * p.scale * bodyK(p.who, p.age) + dy', 'p.y - 390 * p.scale * bodyK(p.who, p.age) + dy'],
]);
for (const f of ['shots1.tsx', 'shots2.tsx']) edit(f, [['FL + 70', 'FL + 20', true]]);
edit('shots2.tsx', [['const at = (who: Who, age: number, x: number, floorY: number, sc: number, o: Partial<PersonProps> = {}) => ({who, age, x, y: floorY - 450 * sc * bodyK(who, age)', 'const at = (who: Who, age: number, x: number, floorY: number, sc: number, o: Partial<PersonProps> = {}) => ({who, age, x, y: floorY - 350 * sc * bodyK(who, age)']]);
// seats in front of seated people, so legs read as sitting
edit('sets.tsx', [
  ["    fg: <g><Plant x={150} y={1100} s={2.2} c={w ? '#4f8a4b' : '#52695a'} /></g>,\n    rim: w ? 'rgba(255,200,120,.9)' : 'rgba(170,200,235,.8)',",
   "    front: (<g>\n      <rect x={LR.chairX - 178} y={654} width={356} height={74} rx={28} fill={shade(sofa, -0.02)} stroke={INK} strokeWidth={5} /><path d={`M ${LR.chairX - 150},686 Q ${LR.chairX},706 ${LR.chairX + 150},686`} fill=\"none\" stroke={INK} strokeWidth={3} opacity={0.4} />\n      <rect x={LR.sofaX - 300} y={664} width={600} height={64} rx={26} fill={shade(sofa, -0.02)} stroke={INK} strokeWidth={5} />\n    </g>),\n    fg: <g><Plant x={150} y={1100} s={2.2} c={w ? '#4f8a4b' : '#52695a'} /></g>,\n    rim: w ? 'rgba(255,200,120,.9)' : 'rgba(170,200,235,.8)',"],
]);
edit('fx.tsx', [
  ["fontSize: 118, letterSpacing: 6, color: '#3a2a26',", "fontSize: 118, letterSpacing: 6, fontVariantNumeric: 'lining-nums', color: '#3a2a26',"],
  ["fontWeight: st === 'sub' ? 700 : 800, fontStyle", "fontVariantNumeric: 'lining-nums', fontWeight: st === 'sub' ? 700 : 800, fontStyle"],
]);
console.log('patched');
