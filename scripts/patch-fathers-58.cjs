const fs=require('fs');let h=fs.readFileSync('src/fathers/Human.tsx','utf8');
h=h.replace("import {Head, Face, V, Look, shade, INK} from '../same2d/Char';","import {Face, V, Look, shade, INK} from '../same2d/Char';\nimport {HeadFor} from './ImgHead';");
h=h.split("<Head face={face}").join("<HeadFor face={face}");
fs.writeFileSync('src/fathers/Human.tsx',h);
let s=fs.readFileSync('scripts/still-fathers.cjs','utf8');
if(!s.includes("images/ft"))s=s.replace("  fs.mkdirSync(path.join(pub, 'audio'), {recursive: true});","  { const src = path.resolve('public/images/ft'); const cp = (a, b) => { fs.mkdirSync(b, {recursive: true}); for (const e of fs.readdirSync(a, {withFileTypes: true})) e.isDirectory() ? cp(path.join(a, e.name), path.join(b, e.name)) : fs.copyFileSync(path.join(a, e.name), path.join(b, e.name)); }; if (fs.existsSync(src)) cp(src, path.join(pub, 'images/ft')); }\n  fs.mkdirSync(path.join(pub, 'audio'), {recursive: true});");
fs.writeFileSync('scripts/still-fathers.cjs',s);
