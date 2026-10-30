const fs=require('fs');let s=fs.readFileSync('src/fathers/shots.tsx','utf8');
const a="translate(${hn[0] + mixN(18, 40, hold)} ${hn[1] + mixN(10, -34, hold)})";
if(!s.includes(a))console.log('MISSING');
s=s.replace(a,"translate(${hn[0] + mixN(18, 40, hold) - 190} ${hn[1] + mixN(10, -34, hold) + 20})");
fs.writeFileSync('src/fathers/shots.tsx',s);
