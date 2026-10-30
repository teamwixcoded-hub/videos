const fs=require('fs');let L=fs.readFileSync('src/fathers/details.tsx','utf8').split('\n');
// lines are 1-based in grep: mid starts 125, mid closes 135, front 136..145
const start=124, midEnd=134, fs0=135, fe=144; // 0-based indices
if(!L[start].startsWith('  mid: (')||!L[fs0].startsWith('  front: ('))throw new Error('layout '+L[start]+'|'+L[fs0]);
const bowl=L.slice(fs0+1,fe);        // the <g>..</g> bowl lines
const midBody=L.slice(start+1,midEnd);  // existing mid <g>...</g>
const out=[...L.slice(0,start),'  mid: (',' <>',...midBody,...bowl,' </>','  ),',...L.slice(fe+1)];
fs.writeFileSync('src/fathers/details.tsx',out.join('\n'));
// phone seat in the hand
let h=fs.readFileSync('src/fathers/held.tsx','utf8');h=h.replace('<g transform="translate(0 86)">','<g transform="translate(0 60)">');
h=h.replace('<g transform="translate(0 -97)"><PhoneBack','<g transform="translate(0 -71)"><PhoneBack');
fs.writeFileSync('src/fathers/held.tsx',h);
