// the empty seat is just empty; Leo is on stage in the costume; Sam sits IN his front-row chair
const fs = require('fs');
const rd = (f) => fs.readFileSync(f, 'utf8'), wr = (f, s) => fs.writeFileSync(f, s);
const sub = (s, a, b, tag) => { if (!s.includes(a)) { console.log('MISSING', tag || String(a).slice(0, 70)); return s; } return s.replace(a, b); };
let st = rd('src/fathers/sets.tsx');
// no tag on Adam's seat; Sam's seat gets a cushion in front so he is IN the chair
st = st.replace(/        \{\/\* Adam's seat in the front row[\s\S]*?\n        <\/g>\n      <\/g>\n    \),\n    rim: 'rgba\(255,230,170,\.75\)',/, `        {/* Sam's seat: the cushion in front of his lap, so he sits IN the chair; Adam's seat beside it stays plainly empty */}
        <rect x={AUD.samX - 104 * ROW_S[2]} y={ROW_Y[2] - 28 * ROW_S[2]} width={208 * ROW_S[2]} height={44 * ROW_S[2]} rx={16} fill="#7e3642" stroke={INK} strokeWidth={3} />
      </g>
    ),
    rim: 'rgba(255,230,170,.75)',`);
wr('src/fathers/sets.tsx', st);

let sh = rd('src/fathers/shots.tsx');
const stageLeo = (extra) => `Pe(c, {...at('leo', 10, 1600, 540, 0.62, {turn: 0.15, ${extra}}), top: '#8a56b8'})`;
// costume: a cape behind and a crown on Leo (drawn in stage coordinates near his head)
sh = sub(sh, "const tint = ", `// Leo's costume for the school play: a purple tunic, a red cape and a gold crown
const leoCostume = (c: Ctx, sc = 0.62, extra: Partial<PersonProps> = {}) => {
  const p = at('leo', 10, 1600, 540, sc, {turn: 0.15, ...extra}), k = sc * 0.5 * 0.85, hx = p.x + 20 * k, hy = p.y - 440 * k;
  return (
    <g>
      <path d={\`M \${p.x - 40 * k * 2},\${hy + 150 * k} L \${p.x - 150 * k * 2},\${p.y + 330 * k} L \${p.x + 40 * k},\${p.y + 330 * k} Z\`} fill="#c0392b" stroke="#1d1a2e" strokeWidth={3} />
      {Pe(c, {...p, top: '#8a56b8'})}
      <g transform={\`translate(\${hx} \${hy - 150 * k})\`}><path d={\`M \${-70 * k},0 L \${-70 * k},\${-60 * k} L \${-35 * k},\${-30 * k} L 0,\${-80 * k} L \${35 * k},\${-30 * k} L \${70 * k},\${-60 * k} L \${70 * k},0 Z\`} fill="#f5c542" stroke="#1d1a2e" strokeWidth={3} strokeLinejoin="round" /><circle cx={0} cy={-80 * k} r={7 * k} fill="#e0455a" stroke="#1d1a2e" strokeWidth={2} /></g>
    </g>
  );
};
const tint = `, 'tint');
sh = sub(sh, "  [83.0, undefined, (c) => SC.aud(c, [Z(1260, 800, 1.5), Z(1500, 520, 1.0)], {tag: 'BEST COSTUME'})],", "  [83.0, undefined, (c) => SC.aud(c, [Z(1260, 800, 1.5), Z(1560, 440, 1.2)], {}, leoCostume(c))],", 'crane');
sh = sub(sh, "  [85.8, undefined, (c) => SC.aud(c, [Z(1260, 780, 2.0), Z(1260, 760, 2.4)], {tag: 'BEST COSTUME'})],", "  [85.8, undefined, (c) => SC.aud(c, [Z(1600, 360, 2.2), Z(1600, 350, 2.7)], {}, leoCostume(c, 0.62, {face: {smile: 0.7, brow: 0.3, gaze: [Math.sin(c.t * 1.6) * 0.9, 0.3]}}))],", 'seat close');
// Sam sits in his chair: hips on the seat, camera on him
sh = sh.split("sit('sam', 45, 2160, 0.62, {pose: 'film', turn: -0.2, face: F.grin}, 900)").join("sit('sam', 45, 2160, 0.62, {pose: 'film', turn: -0.2, face: F.grin}, 1018)");
sh = sh.split("sit('sam', 45, 2160, 0.62, {pose: 'clap', turn: -0.2, face: {...F.grin, open: 0.6}}, 900)").join("sit('sam', 45, 2160, 0.62, {pose: 'clap', turn: -0.2, face: {...F.grin, open: 0.6}}, 1018)");
sh = sub(sh, "SC.aud(c, [Z(2160, 600, 1.5), Z(2160, 580, 1.8)], {}", "SC.aud(c, [Z(2160, 720, 1.5), Z(2160, 700, 1.8)], {}", 'sam film cam');
sh = sub(sh, "SC.aud(c, [Z(2160, 600, 1.7), Z(2160, 580, 2.0)], {applause: true}", "SC.aud(c, [Z(2160, 720, 1.7), Z(2160, 700, 2.0)], {applause: true}", 'sam clap cam');
// Max on stage in the play (he pretended to be embarrassed): stand on the stage floor, not the room floor
sh = sub(sh, "faceCam(stand('max', 10, 1600, 0.95), 2.6, 40), {applause: true}, Pe(c, stand('max', 10, 1600, 0.95, {face: {smile: 0.7, lids: 0.3, gaze: [0.9, 0.3], brow: -0.1}, turn: 0.2})))", "[Z(1600, 380, 2.2), Z(1600, 370, 2.7)], {applause: true}, Pe(c, at('max', 10, 1600, 540, 0.62, {face: {smile: 0.7, lids: 0.3, gaze: [0.9, 0.3], brow: -0.1}, turn: 0.2})))", 'max stage');
wr('src/fathers/shots.tsx', sh);
console.log('patched 10');
