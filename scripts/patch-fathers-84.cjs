const fs=require('fs');let h=fs.readFileSync('src/fathers/Human.tsx','utf8');
const re=/\{held && !upright && !noHand && <g transform=\{`translate\(\$\{H\[0\]\} \$\{H\[1\]\}\) rotate\(\$\{fa - 90\}\)`\}><g transform="translate\(0 -6\)" fill=\{SKIN\}[^\n]*\n/g;
let n=0;
// the screen is pressed to the ear, so the hand grips the BACK: the palm sits on the left edge and four fingers wrap across the back of the phone, the thumb shows on the far edge
const rep=(m)=>{n++;const ind=m.match(/^/)[0];return "{held && !upright && !noHand && <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}><g transform={`translate(0 -6) scale(${s} 1)`} fill={SKIN} stroke={INK} strokeWidth={3.4} strokeLinecap=\"round\" strokeLinejoin=\"round\"><rect x={-60} y={44} width={26} height={78} rx={13} />{[52, 72, 92, 112].map((y, i) => <path key={y} d={`M -50,${y} Q -20,${y - 6 - i} ${-6 - (i % 2) * 4},${y + 4}`} fill=\"none\" stroke={INK} strokeWidth={19} />)}{[52, 72, 92, 112].map((y, i) => <path key={'s' + y} d={`M -50,${y} Q -20,${y - 6 - i} ${-6 - (i % 2) * 4},${y + 4}`} fill=\"none\" stroke={SKIN} strokeWidth={13} />)}<rect x={42} y={50} width={18} height={30} rx={9} /></g></g>}\n";};
h=h.replace(re,rep);
if(n!==2)throw new Error('replaced '+n);
fs.writeFileSync('src/fathers/Human.tsx',h);
