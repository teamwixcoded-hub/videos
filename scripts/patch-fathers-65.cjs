const fs=require('fs');let s=fs.readFileSync('src/same2d/Char.tsx','utf8');
const lines=s.split('\n');const i=lines.findIndex(l=>l.includes("{look === 'sam' && <g transform={`translate(${turn * 58} 0)`} fill={hairC}"));
if(i<0)throw new Error('beard line');
lines[i]=`      {look === 'sam' && (
        /* a beard that belongs to the skin: a soft tint plus a stubble texture, clipped to the face, no outline, a clear patch round the mouth */
        <g transform={\`translate(\${turn * 58} 0)\`}>
          <defs>
            <clipPath id={'bc' + mid}><circle r={146} /></clipPath>
            <filter id={'bb' + mid} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={6} /></filter>
            <filter id={'bn' + mid}><feGaussianBlur stdDeviation={9} /></filter>
            <pattern id={'bp' + mid} width={9} height={9} patternUnits="userSpaceOnUse"><circle cx={1.6} cy={2.2} r={1.25} fill={hairC} /><circle cx={6.2} cy={4.8} r={1.1} fill={hairC} /><circle cx={3.4} cy={7.6} r={1.2} fill={hairC} /><circle cx={8} cy={0.8} r={0.9} fill={hairC} /></pattern>
            <mask id={'bm' + mid}><rect x={-200} y={-200} width={400} height={400} fill="#fff" /><ellipse cx={0} cy={72} rx={46} ry={19} fill="#000" filter={\`url(#bn\${mid})\`} /></mask>
          </defs>
          <g clipPath={\`url(#bc\${mid})\`} mask={\`url(#bm\${mid})\`}>
            <path d="M -124,2 Q -132,112 0,150 Q 132,112 124,2 Q 92,44 0,40 Q -92,44 -124,2 Z" fill={hairC} opacity={0.4} filter={\`url(#bb\${mid})\`} />
            <path d="M -122,8 Q -128,108 0,146 Q 128,108 122,8 Q 90,48 0,44 Q -90,48 -122,8 Z" fill={\`url(#bp\${mid})\`} opacity={0.85} />
            <path d="M -50,48 Q -24,36 0,46 Q 24,36 50,48 Q 26,62 0,54 Q -26,62 -50,48 Z" fill={hairC} opacity={0.55} filter={\`url(#bb\${mid})\`} />
          </g>
        </g>
      )}`;
fs.writeFileSync('src/same2d/Char.tsx',lines.join('\n'));
