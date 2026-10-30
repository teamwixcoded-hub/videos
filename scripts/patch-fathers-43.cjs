const fs=require('fs');
let h=fs.readFileSync('src/fathers/held.tsx','utf8');
h=h.replace('<g transform="translate(0 70)">\n    <defs>','<g transform="translate(0 28)">\n    <defs>');
fs.writeFileSync('src/fathers/held.tsx',h);
let m=fs.readFileSync('src/fathers/Human.tsx','utf8');
// bigger mitten with knuckle creases so it reads as a hand wrapped round the phone
m=m.replace("<path d=\"M -6,38 Q 0,42 8,38\" fill=\"none\" stroke={SKIN_D} strokeWidth={3} strokeLinecap=\"round\" />\n  </g>\n);","<path d=\"M -6,38 Q 0,42 8,38\" fill=\"none\" stroke={SKIN_D} strokeWidth={3} strokeLinecap=\"round\" />\n    {[0, 1, 2].map((i) => <path key={i} d={`M -14,${10 + i * 11} Q 0,${13 + i * 11} 14,${10 + i * 11}`} fill=\"none\" stroke={SKIN_D} strokeWidth={2.4} strokeLinecap=\"round\" />)}\n  </g>\n);");
fs.writeFileSync('src/fathers/Human.tsx',m);
console.log(m.includes("10 + i * 11"));
