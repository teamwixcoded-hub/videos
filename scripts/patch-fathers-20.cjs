const fs=require('fs');
let h=fs.readFileSync('src/fathers/Human.tsx','utf8'),p=fs.readFileSync('src/fathers/People.tsx','utf8'),pr=fs.readFileSync('src/fathers/props2.tsx','utf8');
const r=(f,a,b,tag)=>{if(!f.s.includes(a)){console.log('MISSING',tag||a.slice(0,60));return;}f.s=f.s.replace(a,b)};
const H={s:h},P={s:p},R={s:pr};
r(H,"const ang = clamp(((A[1] - K[1]) / 40) * 0, -1, 1);","const ang = A[1] > 300 ? clamp((393 - A[1]) * 0.8, 0, 38) : 0;");
r(H,"<g style={dim ? {filter: 'brightness(0.78)'} : undefined}>\n      <Taper A={S} B={E}","<g style={dim ? {filter: 'brightness(0.9)'} : undefined}>\n      <Taper A={S} B={E}");
r(P,"const footN: V = sitting ? [230, 170] : walking ? [sw * 100, 392 - Math.max(0, -cw) * 46] : [44, 394];","const rest = Math.sin(t * 0.3 + sd * 4) * 9;\n  const footN: V = sitting ? [230, 170] : walking ? [sw * 112, 392 - Math.max(0, -cw) * 52] : [60 + rest, 390];");
r(P,"const footF: V = sitting ? [300, 172] : walking ? [-sw * 100, 392 - Math.max(0, cw) * 46] : [-36, 398];","const footF: V = sitting ? [300, 172] : walking ? [-sw * 112, 392 - Math.max(0, cw) * 52] : [-54 - rest * 0.5, 395];");
r(P,"const arms = walking && pose === 'stand' ? sw * 70 : 0;","const arms = walking && pose === 'stand' ? -sw * 64 : 0;");
r(P,"const bob = walking ? Math.abs(Math.sin(walk * Math.PI * 2)) * 9 * sc : 0;","const bob = walking ? Math.abs(Math.sin(walk * Math.PI * 2)) * 12 * sc : 0;");
r(P,"(walking ? 3 : 0)} headPitch","(walking ? 2 + Math.abs(cw) * 1.5 : 0)} headPitch");
// laptop: brand mark on the lid, thicker rim
r(R,"<circle cx={0} cy={-lid / 2} r={11} fill=\"#e9eeff\" opacity={0.65} stroke={INK} strokeWidth={1.6} /><circle cx={0} cy={-lid / 2} r={20} fill=\"#bcd0ff\" opacity={0.14} />","<path d={`M -120,${-lid} L 120,${-lid}`} stroke=\"#fff\" strokeWidth={3} opacity={0.35} /><circle cx={0} cy={-lid / 2} r={10} fill=\"#f4f7ff\" opacity={0.8} stroke={INK} strokeWidth={1.6} /><path d={`M 3,${-lid / 2 - 12} q 7,-3 8,-9`} stroke=\"#f4f7ff\" strokeWidth={2.4} fill=\"none\" strokeLinecap=\"round\" />");
fs.writeFileSync('src/fathers/Human.tsx',H.s);fs.writeFileSync('src/fathers/People.tsx',P.s);fs.writeFileSync('src/fathers/props2.tsx',R.s);
