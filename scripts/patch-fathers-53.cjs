const fs=require('fs');
// module-level skin used by hands, necks and bare arms of whoever is being drawn (React renders a parent before its children, so each Person sets it first)
let fh=fs.readFileSync('src/fathers/FlatHead.tsx','utf8');
fh=fh.replace("export const SkinCtx = createContext('#f1c9a5');\nexport const useSkin = () => useContext(SkinCtx);","let CUR = '#f1c9a5';\nexport const setSkin = (look: string) => { CUR = skinOf(look); };\nexport const SK = () => CUR;\nexport const SKD = () => shade(CUR, -0.16);");
fh=fh.replace("import React, {createContext, useContext, useId} from 'react';","import React, {useId} from 'react';");
fs.writeFileSync('src/fathers/FlatHead.tsx',fh);
let h=fs.readFileSync('src/fathers/Human.tsx','utf8');
h=h.replace("import {Head, Face, V, Look, shade, INK} from '../same2d/Char';","import {Face, V, Look, shade, INK} from '../same2d/Char';\nimport {FlatHead, setSkin, SK, SKD} from './FlatHead';");
h=h.replace("const SKIN = '#f3f0fb', SKIN_D = '#d9d3ec';\n","");
h=h.replace(/\bSKIN_D\b/g,'SKD()').replace(/\bSKIN\b/g,'SK()');
h=h.split("<Head face={face}").join("<FlatHead face={face}");
// set the skin at the top of both rigs
h=h.replace("  const id = useId().replace(/:/g, '');\n  const inh = Math.sin(t * 1.9 + seed);","  setSkin(look);\n  const id = useId().replace(/:/g, '');\n  const inh = Math.sin(t * 1.9 + seed);");
h=h.replace("  const id = useId().replace(/:/g, '');\n  const inh = Math.sin(t * 1.9 + seed), sway","  setSkin(look);\n  const id = useId().replace(/:/g, '');\n  const inh = Math.sin(t * 1.9 + seed), sway");
fs.writeFileSync('src/fathers/Human.tsx',h);
let he=fs.readFileSync('src/fathers/held.tsx','utf8');
he=he.replace("import {INK} from './theme';","import {INK} from './theme';\nimport {SK, SKD} from './FlatHead';");
he=he.split('fill="#f3f0fb"').join('fill={SK()}').split('fill="#d9d3ec"').join('fill={SKD()}');
fs.writeFileSync('src/fathers/held.tsx',he);
console.log((h.match(/setSkin\(look\)/g)||[]).length);
