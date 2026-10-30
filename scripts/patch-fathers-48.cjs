const fs=require('fs');
let s=fs.readFileSync('scripts/_held_head.txt','utf8');
const mid=fs.readFileSync('src/fathers/held.tsx','utf8').split('\n').slice(27,41).join('\n')+'\n';   // the new CupHeld block (lines 28-41 of the mangled file)
const ci=s.indexOf("// a tea cup with a handle");const cj=s.indexOf("\n);\n",ci)+4;
if(ci<0||cj<4)throw new Error('markers');
s=s.slice(0,ci)+mid+s.slice(cj);
s=s.replace('<g transform="translate(0 70)">\n    <defs>','<g transform="translate(0 86)">\n    <defs>');
const a="    <circle cx={96} cy={-58} r={9} fill=\"#ff3b3b\" opacity={0.5 + 0.5 * rec} />";
if(!s.includes(a))console.log('MISSING rec');
s=s.replace(a,a+"\n    {[-1, 1].map((s) => <g key={s}>{[-26, -4, 18].map((y, i) => <path key={i} d={`M ${s * 88},${y} Q ${s * 112},${y + 2} ${s * 106},${y + 15} L ${s * 88},${y + 15} Z`} fill=\"#f3f0fb\" stroke={INK} strokeWidth={3} strokeLinejoin=\"round\" />)}<path d={`M ${s * 60},-70 Q ${s * 78},-96 ${s * 92},-72 Q ${s * 84},-58 ${s * 66},-60 Z`} fill=\"#f3f0fb\" stroke={INK} strokeWidth={3} strokeLinejoin=\"round\" /></g>)}");
fs.writeFileSync('src/fathers/held.tsx',s);
