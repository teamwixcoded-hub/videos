const fs=require('fs');let d=fs.readFileSync('src/fathers/details.tsx','utf8');
const a=d.indexOf("export const livingDetail");
if(a<0)throw new Error('no livingDetail');
// add wall and floor dressing at the start of the far layer
const marker="    far: (\n      <g>\n        <rect x={-400} y={796} width={4000} height={36}";
if(!d.includes(marker))throw new Error('marker');
d=d.replace(marker,`    far: (
      <g>
        {/* wallpaper stripes, crown moulding, wainscot panels under a picture rail, skirting and floorboards in perspective */}
        {Array.from({length: 40}, (_, i) => <rect key={'wp' + i} x={-200 + i * 100} y={40} width={44} height={540} fill={w ? '#fff2cf' : '#aab6f0'} opacity={0.05} />)}
        <rect x={-400} y={0} width={4000} height={46} fill={w ? '#8a5a38' : '#3a4270'} stroke={INK} strokeWidth={3} /><rect x={-400} y={40} width={4000} height={12} fill={w ? '#b07a4c' : '#4c5690'} opacity={0.8} />
        <rect x={-400} y={560} width={4000} height={14} fill={w ? '#c9a064' : '#6a76b0'} stroke={INK} strokeWidth={3} />
        <rect x={-400} y={574} width={4000} height={222} fill={w ? '#8a5a38' : '#3a4474'} stroke={INK} strokeWidth={2.4} />
        {Array.from({length: 22}, (_, i) => <g key={'wc' + i}><rect x={-100 + i * 170} y={600} width={134} height={170} rx={4} fill="none" stroke={INK} strokeWidth={2.4} opacity={0.7} /><rect x={-92 + i * 170} y={608} width={118} height={154} rx={3} fill={w ? '#a06c42' : '#46508a'} opacity={0.6} /></g>)}
        <rect x={-400} y={780} width={4000} height={18} fill={w ? '#d9b27a' : '#7a86bc'} stroke={INK} strokeWidth={3} />
        {Array.from({length: 24}, (_, i) => <line key={'fb' + i} x1={-400 + i * 240} y1={832} x2={1600 + (-400 + i * 240 - 1600) * 1.9} y2={1080} stroke={w ? 'rgba(40,20,8,.3)' : 'rgba(10,14,40,.4)'} strokeWidth={2.4} />)}
        {[0.06, 0.16, 0.3, 0.5, 0.78].map((k, i) => <line key={'fh' + i} x1={-400} y1={832 + 248 * k} x2={3600} y2={832 + 248 * k} stroke={w ? 'rgba(40,20,8,.25)' : 'rgba(10,14,40,.35)'} strokeWidth={2.4} />)}
        <rect x={-400} y={796} width={4000} height={36}`);
fs.writeFileSync('src/fathers/details.tsx',d);
