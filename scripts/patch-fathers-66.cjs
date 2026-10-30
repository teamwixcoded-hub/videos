const fs=require('fs');let s=fs.readFileSync('src/same2d/Char.tsx','utf8');
const a=s.indexOf("      {look === 'sam' && (\n        /* a beard that belongs to the skin");
const b=s.indexOf("      )}\n",a)+"      )}\n".length;
if(a<0)throw new Error('block');
s=s.slice(0,a)+`      {look === 'sam' && (
        /* the beard IS the lower face: the skin itself is coloured from the sideburns round the jaw (a soft edge, a stubble texture, no outline, no separate shape), with a lighter patch round the lips */
        <g transform={\`translate(\${turn * 58} 0)\`}>
          <defs>
            <clipPath id={'bc' + mid}><circle r={147} /></clipPath>
            <filter id={'bb' + mid} x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation={2.6} /></filter>
            <filter id={'bn' + mid}><feGaussianBlur stdDeviation={7} /></filter>
            <pattern id={'bp' + mid} width={6} height={6} patternUnits="userSpaceOnUse"><circle cx={1.2} cy={1.6} r={1.2} fill={shade(bC, -0.35)} /><circle cx={4.4} cy={3.2} r={1.1} fill={shade(bC, -0.35)} /><circle cx={2.4} cy={5} r={1.1} fill={shade(bC, 0.2)} /></pattern>
            <mask id={'bm' + mid}><rect x={-200} y={-200} width={400} height={400} fill="#fff" /><ellipse cx={0} cy={76} rx={44} ry={17} fill="#000" filter={\`url(#bn\${mid})\`} /></mask>
          </defs>
          <g clipPath={\`url(#bc\${mid})\`} mask={\`url(#bm\${mid})\`}>
            <path d="M -152,-14 C -122,34 -84,56 -48,52 Q -24,38 0,48 Q 24,38 48,52 C 84,56 122,34 152,-14 L 160,160 L -160,160 Z" fill={bC} opacity={0.94} filter={\`url(#bb\${mid})\`} />
            <path d="M -152,-14 C -122,34 -84,56 -48,52 Q -24,38 0,48 Q 24,38 48,52 C 84,56 122,34 152,-14 L 160,160 L -160,160 Z" fill={\`url(#bp\${mid})\`} opacity={0.55} />
          </g>
        </g>
      )}
`+s.slice(b);
s=s.replace("  const hairC = greyOf(grey);","  const hairC = greyOf(grey), bC = grey > 0.45 ? '#9b97ad' : '#3b2a24';");
fs.writeFileSync('src/same2d/Char.tsx',s);
