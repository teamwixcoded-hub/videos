const fs=require('fs');let s=fs.readFileSync('src/fathers/held.tsx','utf8');
const a='    <g transform="rotate(90) translate(0 -28)">\n      <g transform="translate(0 -28)"><PhoneBack lit={0.2} /></g>\n    </g>';
if(!s.includes(a))console.log('MISSING');
s=s.replace(a,'    <g transform="rotate(90)"><g transform="translate(0 -97)"><PhoneBack lit={0.2} /></g></g>');
fs.writeFileSync('src/fathers/held.tsx',s);
