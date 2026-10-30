const fs=require('fs');let s=fs.readFileSync('src/fathers/shots.tsx','utf8');
const a="return <AbsoluteFill>{SC.liv(c, [Z(1450, 620, 1.25), Z(1500, 620, 1.4)], {warm: true}, <>";
if(!s.includes(a))throw new Error('a');
s=s.replace(a,"return <AbsoluteFill>{SC.room(c, [Z(1450, 620, 1.25), Z(1500, 620, 1.4)], <>");
s=s.replace("shadow={false} /></>, 0.4)}{tint('rgba(255,150,60,.9)'","shadow={false} /></>)}{tint('rgba(255,150,60,.9)'");
s=s.replace("<g transform=\"translate(0 -20)\"><BigGift s={0.62} /></g>","<g transform=\"translate(0 -34)\"><BigGift s={0.85} /></g>");
fs.writeFileSync('src/fathers/shots.tsx',s);
