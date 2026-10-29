const fs=require('fs');let s=fs.readFileSync('src/fathers/props.tsx','utf8');
const i=s.indexOf("  const person = (cx: number, by: number, sc: number, col: string, _hair?: string) => (");
const j=s.indexOf("  );\n",i)+5;
if(i<0)throw new Error('no person');
const repl=`  // the people in the photos are the real cast: Sam (orange cardigan, beard), Max (green, curls), Adam (suit), Leo (blue hoodie), drawn with the same rig
  const cast = (col: string, sc: number): {who: 'adam' | 'sam' | 'leo' | 'max' | 'aunt'; age: number} => {
    const kid = sc < 0.75;
    if (col === '#6c351c' || col === '#6f7d93' || col === '#b7bdd6') return {who: 'sam', age: kid ? 8 : 38};
    if (col === '#2e5c3b') return {who: 'max', age: kid ? 7 : 22};
    if (col === '#171e2f' || col === '#254877' || col === '#1b1f30') return {who: 'adam', age: 38};
    return {who: 'leo', age: kid ? 7 : 25};
  };
  const person = (cx: number, by: number, sc: number, col: string, _hair?: string) => {
    const c = cast(col, sc), k = sc * 0.1;
    return <g key={cx + '-' + by}><Person who={c.who} age={c.age} view="front" x={cx} y={by - 90 * sc} scale={k} t={0} idle={0} face={{smile: 0.7}} /></g>;
  };
`;
s=s.slice(0,i)+repl+s.slice(j);
if(!s.includes("from './People'"))s=s.replace(/(import .*\n)/,"$1import {Person} from './People';\n");
fs.writeFileSync('src/fathers/props.tsx',s);
// standing arms: hang straight down, never behind the body
let p=fs.readFileSync('src/fathers/People.tsx','utf8');
p=p.replace("stand: () => ({N: [26, 66], F: [-26, 76]}),","stand: () => ({N: [30, 64], F: [14, 74]}),");
fs.writeFileSync('src/fathers/People.tsx',p);
