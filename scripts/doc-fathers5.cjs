const fs=require('fs');let s=fs.readFileSync('CLAUDE.md','utf8');
const add="**STYLE CHANGE (latest, user's decision): Two Fathers is now PROFESSIONAL FLAT 2D CARTOON, not glass/3D.** Characters use src/fathers/FlatHead.tsx (flat skin tones per character, ink outline, one cel-shadow crescent, big expressive eyes/brows/mouths, no gradients or glass highlights) on the smooth noodle-limb body (Human.tsx, gradients and highlights removed). No depth blur, bloom, haze or light shafts; inserts use a flat backdrop (InsertBG). Work is being done FIRST on the first minute (0-60 s), then the rest. Props/sets still need flattening and cleaning. This supersedes the older 'exactly like Same Man' rule for this video only.\n";
if(!s.includes('STYLE CHANGE (latest'))s=s.replace("# VIDEO 2:","# VIDEO 2:");
const i=s.indexOf("Status: full build, type-checks");
if(i>0)s=s.slice(0,i)+add+s.slice(i);
fs.writeFileSync('CLAUDE.md',s);
