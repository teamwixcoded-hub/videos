const fs=require('fs');let h=fs.readFileSync('src/fathers/Human.tsx','utf8');
const a="HumanHand curl={curl} s={s * 1.3} dim={dim} /></g></g>\n    </g>\n  );\n};";
if(!h.includes(a))console.log('MISSING close');
h=h.replace(a,"HumanHand curl={curl} s={s * 1.3} dim={dim} /></g></g>\n    </g>\n    )\n  );\n};");
// simple leg
const b="  return (\n    <g style={dim ? {filter: 'brightness(0.8)'} : undefined}>\n      <Taper A={HJ} B={K} r1={44} r2={31} fill={o.pants} />";
if(!h.includes(b))console.log('MISSING leg');
h=h.replace(b,"  if (o.simple) return (\n    <g style={dim ? {filter: 'brightness(0.8)'} : undefined}>\n      <Noodle A={HJ} J={K} B={A} w={60} fill={o.pants} />\n      <g transform={`translate(${A[0]} ${A[1]}) rotate(${ang})`}><path d=\"M -26,-16 Q -30,26 -22,30 L 70,30 Q 96,26 94,6 Q 90,-8 66,-12 Q 40,-16 24,-26 Z\" fill={o.shoe} stroke={INK} strokeWidth={4.4} strokeLinejoin=\"round\" /><path d=\"M 40,-6 q 16,8 34,2\" fill=\"none\" stroke=\"#fff\" strokeWidth={3} opacity={0.3} strokeLinecap=\"round\" /></g>\n    </g>\n  );\n"+b);
fs.writeFileSync('src/fathers/Human.tsx',h);
// test flag: Adam simple
let p=fs.readFileSync('src/fathers/People.tsx','utf8');
p=p.replace("sleeve: 'long', sole: '#2a2a33', watch: true},","sleeve: 'long', sole: '#2a2a33', watch: true, simple: true},");
fs.writeFileSync('src/fathers/People.tsx',p);
