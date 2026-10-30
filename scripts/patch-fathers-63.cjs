const fs=require('fs');let s=fs.readFileSync('scripts/cut-grid.mjs','utf8');
const a="  let x0 = cw, x1 = 0, y0 = ch, y1 = 0;";
if(!s.includes(a))throw new Error('anchor');
s=s.replace(a,`  // keep only the largest connected figure in the cell (a neighbour's hair or shoulders can poke in at the edge)
  { const lab = new Int32Array(cw * ch), sizes = [0]; let n = 0;
    for (let k0 = 0; k0 < cw * ch; k0++) { if (bg[k0] || lab[k0]) continue; n++; sizes[n] = 0; const st = [k0]; lab[k0] = n;
      while (st.length) { const k = st.pop(); sizes[n]++; const x = k % cw, y = (k / cw) | 0; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= cw || ny >= ch) continue; const kk = ny * cw + nx; if (!bg[kk] && !lab[kk]) { lab[kk] = n; st.push(kk); } } } }
    let big = 1; for (let i = 1; i <= n; i++) if (sizes[i] > sizes[big]) big = i;
    for (let k = 0; k < cw * ch; k++) if (!bg[k] && lab[k] !== big) bg[k] = 1; }
`+a);
fs.writeFileSync('scripts/cut-grid.mjs',s);
