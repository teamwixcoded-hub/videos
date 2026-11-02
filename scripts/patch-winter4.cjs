const fs = require('fs');
let s = fs.readFileSync('src/winter/SideHero.tsx', 'utf8');
const rep = (a, b) => { if (!s.includes(a)) throw new Error('missing: ' + String(a).slice(0, 60)); s = s.replace(a, b); };
rep('const front = [[0, 66 + fat * 20], [60, 66 + fat * 52], [120, 64 + fat * 86], [180, 66 + muscle * 8 + fat * 40], [240, 72 + muscle * 18 + fat * 14], [284, 40]];',
    'const front = [[0, 82 + fat * 22], [60, 86 + fat * 62], [120, 86 + fat * 118], [180, 88 + muscle * 10 + fat * 54], [240, 92 + muscle * 22 + fat * 18], [284, 46]];');
rep('const back = [[284, -42], [230, -66 - muscle * 6], [160, -64 - fat * 6], [90, -62 - fat * 12], [0, -64 - fat * 12]];',
    'const back = [[284, -48], [230, -86 - muscle * 8], [160, -86 - fat * 8], [90, -82 - fat * 14], [0, -82 - fat * 14]];');
rep("stand: {hip: [0, -250], torso: 0, handN: [16, -270], handF: [-8, -270], footN: [18, -28], footF: [-16, -28]}", "stand: {hip: [0, -270], torso: 0, handN: [20, -292], handF: [-8, -292], footN: [16, -28], footF: [-14, -28]}");
rep("curl: {hip: [0, -250], torso: -3, head: 4, handN: [86, -438], handF: [-4, -270]", "curl: {hip: [0, -270], torso: -3, head: 4, handN: [96, -462], handF: [-4, -292]");
rep("run: {hip: [0, -236]", "run: {hip: [0, -256]");
rep("sit: {hip: [-10, -96], torso: 22, head: 26, handN: [190, -352], handF: [176, -344]", "sit: {hip: [-10, -96], torso: 12, head: 18, handN: [168, -318], handF: [152, -310]");
fs.writeFileSync('src/winter/SideHero.tsx', s);
let t = fs.readFileSync('src/winter/SideSheet.tsx', 'utf8');
t = t.replace('x={1470} y={480} scale={0.52} id="a5"', 'x={1660} y={480} scale={0.52} id="a5"').replace('<T x={1470} y={510} t="RUN" />', '<T x={1660} y={510} t="RUN" />').replace('x={1200} y={480} scale={0.52} id="a4"', 'x={1230} y={480} scale={0.52} id="a4"');
fs.writeFileSync('src/winter/SideSheet.tsx', t);
