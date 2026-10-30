const fs=require('fs');let d=fs.readFileSync('src/fathers/details.tsx','utf8');
const a=d.indexOf("      {/* ceiling light panels in perspective");const b=d.indexOf("      {/* sconces on the walls */}");
if(a<0||b<0)console.log('MISSING ceiling');else d=d.slice(0,a)+d.slice(b);
const c=d.indexOf('      <g transform="translate(980 830)"><rect x={-26} y={-300}');const e=d.indexOf("\n",c);
if(c<0)console.log('MISSING cab');else d=d.slice(0,c)+d.slice(e+1);
fs.writeFileSync('src/fathers/details.tsx',d);
