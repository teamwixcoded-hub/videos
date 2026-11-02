const fs = require('fs');
let s = fs.readFileSync('src/winter/Hero.tsx', 'utf8');
const rep = (a, b) => { if (!s.includes(a)) throw new Error('missing: ' + String(a).slice(0, 60)); s = s.replace(a, b); };
rep('look?: [number, number]; blink?: number; id?: string};', 'look?: [number, number]; blink?: number; id?: string; turn?: number};');
rep("export const Head: React.FC<HeadProps> = ({mood = 'neutral', skin = SK, hair = '#6b3f1e', look = [0, 0], blink = 0, id = 'h'}) => {", "export const Head: React.FC<HeadProps> = ({mood = 'neutral', skin = SK, hair = '#6b3f1e', look = [0, 0], blink = 0, id = 'h', turn = 0}) => {");
// features move toward the facing side and narrow when the head turns (turn -1..1, +1 = facing right)
rep('      <Eye x={-86} mood={mood}', '      <clipPath id={`hc${id}`}><circle cx={0} cy={0} r={198} /></clipPath>\n      <g clipPath={`url(#hc${id})`}><g transform={`translate(${turn * 96} ${Math.abs(turn) * 6}) scale(${1 - 0.3 * Math.abs(turn)} 1)`}>\n      <Eye x={-86} mood={mood}');
rep("          : <path d={`M -52,${128 + smile * -8} Q 0,${128 + smile * 40} 52,${128 + smile * -8}`} stroke={INK} strokeWidth={12} strokeLinecap=\"round\" fill=\"none\" />}\n    </g>", "          : <path d={`M -52,${128 + smile * -8} Q 0,${128 + smile * 40} 52,${128 + smile * -8}`} stroke={INK} strokeWidth={12} strokeLinecap=\"round\" fill=\"none\" />}\n      </g></g>\n    </g>");
rep('const ik = (', 'export const ik = (');
rep('const Hand: React.FC', 'export const Hand: React.FC');
rep('const Seg: React.FC', 'export const Seg: React.FC');
rep('const shade = (', 'export const shade = (');
rep('type V = [number, number];', 'export type V = [number, number];');
rep("({x = 0, y = 0, scale = 1, flip, headScale = 0.8, slump = 0, mood, skin, hair, look, blink, id, ...b}) =>", "({x = 0, y = 0, scale = 1, flip, headScale = 0.8, slump = 0, mood, skin, hair, look, blink, id, turn, ...b}) =>");
rep('<Head mood={mood} skin={skin} hair={hair} look={look} blink={blink} id={id} /></g>\n  </g>', '<Head mood={mood} skin={skin} hair={hair} look={look} blink={blink} id={id} turn={turn} /></g>\n  </g>');
fs.writeFileSync('src/winter/Hero.tsx', s);
