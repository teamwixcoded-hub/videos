const fs = require('fs');
const map = {Act1: ['KP_ACT1', 'TypoAct1'], S04Day5: ['KP_S04', 'TypoS04'], S05Day21: ['KP_S05', 'TypoS05'], S06Spreads: ['KP_S06', 'TypoS06'], S07Day90: ['KP_S07', 'TypoS07'], S08Low: ['KP_S08', 'TypoS08'], S09Result: ['KP_S09', 'TypoS09'], S10Day365: ['KP_S10', 'TypoS10'], S11Turn: ['KP_S11', 'TypoS11'], S12End: ['KP_S12', 'TypoS12']};
for (const [f, [kp, ty]] of Object.entries(map)) {
  const p = `src/scenes/${f}.tsx`;
  let s = fs.readFileSync(p, 'utf8');
  if (!s.includes(`<KeyPhrases lines={${kp}} />`)) { console.log('no KeyPhrases in', f); continue; }
  s = s.replace(`<KeyPhrases lines={${kp}} />`, `<${ty} />`);
  s = s.replace(`import {KeyPhrases} from '../components/KeyPhrases';`, `import {${ty}} from '../typography';`);
  s = s.replace(`import {${kp}} from '../keyphrases';\n`, '');
  // chapter cards replace the old day stamps
  s = s.replace(/^\s*<TimeStamp text="(DAY|MONTH)[^\n]*\n/gm, '');
  fs.writeFileSync(p, s);
}
console.log('done');
