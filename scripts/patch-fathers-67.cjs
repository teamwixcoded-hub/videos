const fs=require('fs');let s=fs.readFileSync('src/same2d/Char.tsx','utf8');
const r=(a,b)=>{if(!s.includes(a)){console.log('MISSING',a.slice(0,60));return;}s=s.replace(a,b)};
r("        <g transform={`translate(${turn * 58} 0)`}>\n          <defs>\n            <clipPath id={'bc' + mid}><circle r={147} /></clipPath>","        <g clipPath={`url(#bc${mid})`}><g transform={`translate(${turn * 58} 0)`}>\n          <defs>\n            <clipPath id={'bc' + mid}><circle r={147} /></clipPath>");
r("          <g clipPath={`url(#bc${mid})`} mask={`url(#bm${mid})`}>","          <g mask={`url(#bm${mid})`}>");
r("L 160,160 L -160,160 Z\" fill={`url(#bp${mid})`} opacity={0.55} />\n          </g>\n        </g>","L 160,160 L -160,160 Z\" fill={`url(#bp${mid})`} opacity={0.55} />\n          </g>\n        </g></g>");
fs.writeFileSync('src/same2d/Char.tsx',s);
