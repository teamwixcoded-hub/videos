const fs=require('fs');let s=fs.readFileSync('src/fathers/FlatHead.tsx','utf8');
const a="{[-1, 1].map((s) => { const far = s * turn < 0 ? Math.min(1, Math.abs(turn)) : 0; return far > 0.85 ? null :";
if(!s.includes(a))console.log('MISSING');
s=s.replace(a,"{[-1, 1].map((s) => { const far = s * turn > 0 ? Math.min(1, Math.abs(turn) * 1.6) : 0; return far > 0.5 ? null :");
fs.writeFileSync('src/fathers/FlatHead.tsx',s);
