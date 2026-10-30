const fs=require('fs');
let s=fs.readFileSync('src/fathers/FlatHead.tsx','utf8');
s=s.replace('<path d="M -142,-44 Q -158,-156 -20,-162 Q 134,-164 144,-40 Q 112,-98 52,-102 Q 0,-110 -44,-96 Q -102,-96 -142,-44 Z" fill={hair} stroke={INK} strokeWidth={7} strokeLinejoin="round" /><path d="M -132,-30 q -12,26 -2,50 M 138,-30 q 10,26 0,50" fill="none" stroke={hair} strokeWidth={14} strokeLinecap="round" />','<path d="M -132,-52 Q -146,-152 -20,-158 Q 122,-160 134,-50 Q 100,-92 48,-98 Q 0,-106 -44,-94 Q -96,-92 -132,-52 Z" fill={hair} stroke={INK} strokeWidth={7} strokeLinejoin="round" />');
fs.writeFileSync('src/fathers/FlatHead.tsx',s);
let a=fs.readFileSync('src/fathers/inserts.tsx','utf8');
const i=a.indexOf("export const InsertBG");const j=a.indexOf("\n};\n",i)+4;
const bg=`export const InsertBG: React.FC<{tone?: 'cold' | 'warm' | 'dark' | 'paper'; children: React.ReactNode}> = ({tone = 'warm', children}) => {
  // flat 2D backdrop: one solid colour, a few big flat shapes and a dotted pattern (no blur, no bokeh)
  const base = {cold: '#1d2a5c', warm: '#3d2a3a', dark: '#1a2150', paper: '#3a2f3a'}[tone], shape = {cold: '#27387a', warm: '#553a4a', dark: '#232d6a', paper: '#4a3d4a'}[tone], dot = {cold: '#4aa8ff', warm: '#ffb25a', dark: '#4aa8ff', paper: '#ffb25a'}[tone];
  return (
    <AbsoluteFill style={{background: base, overflow: 'hidden'}}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
        <circle cx={260} cy={220} r={420} fill={shape} /><circle cx={1700} cy={900} r={520} fill={shape} /><circle cx={1500} cy={120} r={180} fill={shape} opacity={0.7} />
        {Array.from({length: 9}, (_, r) => Array.from({length: 16}, (_, c) => <circle key={r + '-' + c} cx={60 + c * 120 + (r % 2) * 60} cy={60 + r * 120} r={3.2} fill={dot} opacity={0.2} />))}
        {children}
      </svg>
    </AbsoluteFill>
  );
};
`;
a=a.slice(0,i)+bg+a.slice(j);
fs.writeFileSync('src/fathers/inserts.tsx',a);
