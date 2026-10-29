const fs=require('fs');let h=fs.readFileSync('src/fathers/Human.tsx','utf8');
h=h.replace(/<path d=\{d\} fill="none" stroke="#fff" strokeWidth=\{w \* 0\.22\}[^>]*\/>/,'');
fs.writeFileSync('src/fathers/Human.tsx',h);console.log(h.includes('w * 0.22'));
