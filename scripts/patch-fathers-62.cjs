const fs=require('fs');let s=fs.readFileSync('scripts/cut-grid.mjs','utf8');
const a=s.indexOf("    const hh = y1 - y0; let hi0");const b=s.indexOf("    meta[",a);
s=s.slice(0,a)+`    // the chin row is supplied by eye in scripts/chins.json (silhouette tricks fail on suits); the width is measured from the pixels above it
    const key = \`\${who}/\${name.slice(0, -'neutral'.length)}\`, chins = JSON.parse(fs.readFileSync('scripts/chins.json', 'utf8')), chin = chins[key] ?? y0 + Math.round((y1 - y0) * 0.6), neck = chin - y0;
    const hx0 = Math.min(...ext.slice(0, neck).map((e) => e[0])), hx1 = Math.max(...ext.slice(0, neck).map((e) => e[1]));
`+s.slice(b);
fs.writeFileSync('scripts/cut-grid.mjs',s);
