const fs=require('fs');let s=fs.readFileSync('scripts/cut-grid.mjs','utf8');
const a=s.indexOf("  if (name.endsWith('neutral')) {");const b=s.indexOf("\n  }\n}",a)+4;
const blk=`  if (name.endsWith('neutral')) {
    // the head runs from the hair top (y0) to the chin; the neck is the narrowest row between the head and the shoulders
    const ext = []; for (let y = y0; y <= y1; y++) { let lo = cw, hi = 0; for (let x = 0; x < cw; x++) if (!bg[y * cw + x]) { if (x < lo) lo = x; if (x > hi) hi = x; } ext.push(hi >= lo ? [lo, hi] : [0, 0]); }
    const hh = y1 - y0; let neck = Math.round(hh * 0.5), best = 1e9;
    for (let i = Math.round(hh * 0.45); i < Math.round(hh * 0.92); i++) { const w = ext[i][1] - ext[i][0]; if (w < best) { best = w; neck = i; } }
    const chin = y0 + Math.round(neck - 0.1 * neck), hx0 = Math.min(...ext.slice(0, Math.round(neck * 0.9)).map((e) => e[0])), hx1 = Math.max(...ext.slice(0, Math.round(neck * 0.9)).map((e) => e[1]));
    meta[\`\${who}/\${name.slice(0, -'neutral'.length)}\`] = {cx: Math.round((hx0 + hx1) / 2), cy: Math.round((y0 + chin) / 2), w: hx1 - hx0, chin, cw, ch};
  }
}`;
s=s.slice(0,a)+blk+s.slice(b);
fs.writeFileSync('scripts/cut-grid.mjs',s);
