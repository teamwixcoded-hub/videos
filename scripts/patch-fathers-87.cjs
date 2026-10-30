const fs=require('fs');let h=fs.readFileSync('src/fathers/Human.tsx','utf8');
const w="want = d > 331 ? Math.min(d, 356) : 331;";
if(!h.includes(w))throw new Error('want');
h=h.replace(w,"want = d > 338 ? Math.min(d, 356) : 338;");
const a=h.indexOf("const FrontArm");
const old="{!held && !noHand && <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}><g transform=\"translate(0 -6)\"><Mitten curl={curl} s={s * 1.25} /></g></g>}";
const i=h.indexOf(old,a);if(i<0)throw new Error('hand');
// a hanging hand is seen from its edge (palm toward the thigh, thumb on the inside), not as a flat palm facing the camera
h=h.slice(0,i)+"{!held && !noHand && <g transform={`translate(${H[0]} ${H[1]}) rotate(${fa - 90})`}><g transform=\"translate(0 -6)\"><g transform={hangF ? 'scale(0.72 1)' : undefined}><Mitten curl={curl} s={(hangF ? -s : s) * 1.25} /></g></g></g>}"+h.slice(i+old.length);
fs.writeFileSync('src/fathers/Human.tsx',h);
