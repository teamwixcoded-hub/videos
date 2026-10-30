const fs=require('fs');let f=fs.readFileSync('src/fathers/Fathers.tsx','utf8');
const a="{fl > 0 && <><AbsoluteFill style={{background: '#fff', opacity: fl * 0.9}} /><SpeedLines o={Math.min(1, fl * 1.6)} /></>}";
if(!f.includes(a))console.log('MISSING');
f=f.replace(a,"{fl > 0 && <><AbsoluteFill style={{background: '#fff', opacity: fl * 0.9}} /><SpeedLines o={Math.min(1, fl * 1.6)} /><div style={{position: 'absolute', left: 0, right: 0, top: '50%', height: 8 + fl * 26, transform: 'translateY(-50%)', background: 'linear-gradient(90deg, transparent, rgba(150,200,255,.95) 30%, #fff 50%, rgba(150,200,255,.95) 70%, transparent)', opacity: Math.min(1, fl * 1.4), filter: 'blur(7px)'}} /></>}");
fs.writeFileSync('src/fathers/Fathers.tsx',f);
