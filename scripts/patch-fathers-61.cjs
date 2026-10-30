const fs=require('fs');let s=fs.readFileSync('scripts/cut-grid.mjs','utf8');
const a=s.indexOf("    const hh = y1 - y0; let neck");const b=s.indexOf("    meta[",a);
s=s.slice(0,a)+`    const hh = y1 - y0; let hi0 = 0, hw = 0;
    for (let i = 0; i < Math.round(hh * 0.5); i++) { const w = ext[i][1] - ext[i][0]; if (w > hw) { hw = w; hi0 = i; } }
    let neck = hi0; while (neck < ext.length - 1 && ext[neck][1] - ext[neck][0] > 0.62 * hw) neck++;
    const chin = y0 + neck - Math.round(hh * 0.03), hx0 = Math.min(...ext.slice(0, neck).map((e) => e[0])), hx1 = Math.max(...ext.slice(0, neck).map((e) => e[1]));
`+s.slice(b);
fs.writeFileSync('scripts/cut-grid.mjs',s);
