const fs=require('fs');let s=fs.readFileSync('src/fathers/shots.tsx','utf8');
const r=(a,b)=>{if(!s.includes(a)){console.log('MISSING',a.slice(0,60));return;}s=s.replace(a,b)};
r("SC.str(c, [Z(1050, 560, 1.15), Z(1000, 520, 1.5)], {},","SC.str(c, [Z(1050, 470, 1.0), Z(1010, 420, 1.35)], {},");
r("SC.flat(c, [Z(1600, 520, 1.3), Z(1600, 500, 1.7)],","SC.flat(c, [bodyCam(stand('leo', 25, 1600, 0.9), 1.1), faceCam(stand('leo', 25, 1600, 0.9), 1.9, 120)],");
fs.writeFileSync('src/fathers/shots.tsx',s);
