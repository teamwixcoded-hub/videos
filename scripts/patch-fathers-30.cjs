const fs=require('fs');let h=fs.readFileSync('src/fathers/Human.tsx','utf8');
const a="const SH = rot([6, -276 + slump * 18 - inh * 2.4 * idle], th), SHF = rot([-12, -278 + slump * 18 - inh * 2.4 * idle], th);";
if(!h.includes(a))console.log('MISSING');
h=h.replace(a,"// shoulders roll forward when the hands work in front of the body, so the upper arm points forward and the elbow does not trail behind\n  const pro = (hx: number) => clamp((hx - 110) / 160, 0, 1) * 46;\n  const SH = rot([6 + pro(handN[0]), -276 + slump * 18 - inh * 2.4 * idle], th), SHF = rot([-12 + pro(handF[0]), -278 + slump * 18 - inh * 2.4 * idle], th);");
fs.writeFileSync('src/fathers/Human.tsx',h);
