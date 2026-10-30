const fs=require('fs');
let h=fs.readFileSync('src/fathers/Human.tsx','utf8');
const n0=h.length;
h=h.replace(/fill=\{`url\(#tg\$\{id\}\)`\}/g,'fill={o.top}').replace(/fill=\{`url\(#fg\$\{id\}\)`\}/g,'fill={o.top}');
// glossy highlights off
h=h.replace(/\n\s*<path d="M 74,-250 C 92,-190 92,-110 76,-50" fill="none" stroke="#fff" strokeWidth=\{8\}[^>]*\/>/,'');
h=h.replace(/\n\s*<path d=\{`M -96,\$\{-270 \+ sy\} Q -116,-150 -92,-20`\} fill="none" stroke="#fff" strokeWidth=\{8\}[^>]*\/>/,'');
h=h.replace(/\n\s*<path d=\{`M \$\{S\[0\] - 8\},\$\{S\[1\] - 6\} L \$\{E\[0\] - 8\},\$\{E\[1\] - 5\}`\} stroke="#fff" strokeWidth=\{6\}[^>]*\/>/,'');
h=h.replace(/\n\s*<path d=\{`M \$\{HJ\[0\] \+ 6\},\$\{HJ\[1\] \+ 6\} L \$\{K\[0\] \+ 5\},\$\{K\[1\] \+ 2\}`\} stroke="#fff" strokeWidth=\{5\}[^>]*\/>/,'');
console.log(n0-h.length);
fs.writeFileSync('src/fathers/Human.tsx',h);
// flat look: no depth blur, no bloom, no bars; keep a light vignette and fine grain
let k=fs.readFileSync('src/fathers/kit.tsx','utf8');
k=k.replace("blurK={blurK} />","blurK={0} />");
fs.writeFileSync('src/fathers/kit.tsx',k);
let f=fs.readFileSync('src/fathers/Fathers.tsx','utf8');
f=f.replace(/\n\s*\{!paperCard && <AbsoluteFill style=\{\{mixBlendMode: 'screen', opacity: 0\.26[^\n]*\n/,'\n');
f=f.replace(/\n\s*\{!paperCard && <><div style=\{\{position: 'absolute', left: 0, right: 0, top: 0, height: 54[^\n]*\n/,'\n');
f=f.replace("rgba(0,0,0,0) 44%, rgba(0,0,0,.66) 100%)","rgba(0,0,0,0) 58%, rgba(0,0,0,.34) 100%)");
fs.writeFileSync('src/fathers/Fathers.tsx',f);
console.log(f.includes('0.26'), f.includes('height: 54'));
