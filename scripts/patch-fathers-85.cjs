const fs=require('fs');let s=fs.readFileSync('src/fathers/sets.tsx','utf8');
const m=/    front: \(\r?\n      <g>\r?\n(        \{o\.milk[^\n]*\n)(        \{Array\.from\(\{length: o\.cups \?\? 2\}[^\n]*\n)      <\/g>\r?\n    \),\r?\n/;
const x=m.exec(s);if(!x)throw new Error('front');
s=s.replace(m,'');
// cups and milk live in the same layer as the bench so they move with it
const anchor="          <rect x={1300} y={674} width={22} height={160} fill=\"#493625\" stroke={INK} strokeWidth={2.4} /><rect x={2200} y={674} width={22} height={160} fill=\"#493625\" stroke={INK} strokeWidth={2.4} />\r\n        </g>";
let at=s.indexOf(anchor);let a2=anchor;if(at<0){a2=anchor.replace(/\r\n/g,'\n');at=s.indexOf(a2);}
if(at<0)throw new Error('anchor');
s=s.slice(0,at+a2.length)+"\n"+x[1]+x[2]+s.slice(at+a2.length);
fs.writeFileSync('src/fathers/sets.tsx',s);
