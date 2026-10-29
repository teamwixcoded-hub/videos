const fs=require('fs');let s=fs.readFileSync('src/fathers/shots.tsx','utf8');
const a="  [T('one night'), undefined, (c) => <Split left={leoNight(c)} right={samDoor(c)} wipe={ramp(c.l, 0, 1.0)} />],";
if(!s.includes(a))console.log('MISSING');
s=s.replace(a,
"  [T('one night'), undefined, (c) => SC.str(c, [Z(1600, 560, 0.95), Z(1600, 540, 1.25)], {night: true, adamLit: 1, samLit: 1})],\n"+
"  [T('leo locked his door'), 'w', (c) => leoNight(c)],\n"+
"  [T('max knocked on'), 'w', (c) => <Split left={leoNight(c)} right={samDoor(c)} wipe={ramp(c.l, 0, 0.8)} />],");
fs.writeFileSync('src/fathers/shots.tsx',s);
