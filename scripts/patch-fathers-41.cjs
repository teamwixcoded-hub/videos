const fs=require('fs');
let k=fs.readFileSync('src/fathers/kit.tsx','utf8');
const r=(f,a,b,tag)=>{if(!f.s.includes(a)){console.log('MISSING',tag||a.slice(0,60));return;}f.s=f.s.replace(a,b)};
const K={s:k};
r(K,"type Pos = {who: Who; age: number; x: number; y: number; scale: number} &","type Pos = {who: Who; age: number; x: number; y: number; scale: number; chair?: boolean} &",'pos');
r(K,"export const Pe = (c: Ctx, p: Pos, key?: string | number) => (\n  <g key={key}><ShadowE x={p.x} floor={(p as {floor?: number}).floor} rx={190 * p.scale * bodyK(p.who, p.age) * CHAR_K} /><Person t={c.t} enter={c.l / 0.55} {...p} /></g>\n);",
`// a plain wooden chair under a sitter (side view: seat, back post, legs; front view: seat and legs) so nobody sits in the air
const ChairUnder: React.FC<{p: Pos; k: number; front: boolean}> = ({p, k, front}) => {
  const dir = (p.turn ?? 0.2) < 0 ? -1 : 1, seatY = p.y + (front ? 96 : 80) * k, floor = p.y + (front ? 300 : 218) * k, wood = '#7a5232', woodD = '#5a3a22';
  if (front) return (
    <g>
      <rect x={p.x - 120 * k} y={seatY - 260 * k} width={22 * k} height={260 * k} fill={woodD} stroke="#1d1a2e" strokeWidth={3} /><rect x={p.x + 98 * k} y={seatY - 260 * k} width={22 * k} height={260 * k} fill={woodD} stroke="#1d1a2e" strokeWidth={3} />
      <rect x={p.x - 120 * k} y={seatY - 250 * k} width={240 * k} height={36 * k} rx={6} fill={wood} stroke="#1d1a2e" strokeWidth={3} />
      <rect x={p.x - 126 * k} y={seatY} width={252 * k} height={26 * k} rx={8} fill={wood} stroke="#1d1a2e" strokeWidth={3.4} />
      {[-100, 80].map((dx) => <rect key={dx} x={p.x + dx * k} y={seatY + 26 * k} width={20 * k} height={floor - seatY - 26 * k} fill={woodD} stroke="#1d1a2e" strokeWidth={3} />)}
    </g>
  );
  const bx = p.x - dir * 96 * k, fx = p.x + dir * 200 * k;
  return (
    <g>
      <rect x={Math.min(bx, bx + dir * 0) - 10 * k} y={seatY - 340 * k} width={22 * k} height={340 * k + 20 * k} fill={woodD} stroke="#1d1a2e" strokeWidth={3} />
      <rect x={bx - 14 * k} y={seatY - 330 * k} width={30 * k} height={120 * k} rx={6} fill={wood} stroke="#1d1a2e" strokeWidth={3} />
      <rect x={Math.min(bx, fx) - 4} y={seatY} width={Math.abs(fx - bx) + 8} height={24 * k} rx={8} fill={wood} stroke="#1d1a2e" strokeWidth={3.4} />
      {[bx + dir * 10 * k, fx - dir * 20 * k].map((lx, i) => <rect key={i} x={lx - 10 * k} y={seatY + 24 * k} width={20 * k} height={floor - seatY - 24 * k} fill={woodD} stroke="#1d1a2e" strokeWidth={3} />)}
    </g>
  );
};
export const Pe = (c: Ctx, p: Pos, key?: string | number) => {
  const {chair, ...rest} = p, front = rest.view === 'front' || (!!rest.pose && FRONTP.includes(rest.pose)), k = p.scale * bodyK(p.who, p.age) * CHAR_K;
  return (
    <g key={key}>{chair && <ChairUnder p={p} k={k} front={front} />}<ShadowE x={p.x} floor={(p as {floor?: number}).floor} rx={190 * p.scale * bodyK(p.who, p.age) * CHAR_K} /><Person t={c.t} enter={c.l / 0.55} {...rest} /></g>
  );
};`,'Pe');
fs.writeFileSync('src/fathers/kit.tsx',K.s);

let s=fs.readFileSync('src/fathers/shots.tsx','utf8');
const S={s};
// the birthday: a cake with candles, bunting, balloons and a party hat, Adam on a chair beside the table
const bday = `const birthday = (c: Ctx) => {
  const sc = 0.62, k = sc * bodyK('adam', 12) * 0.85, p = stand('adam', 12, 1500, sc, {}), hx = 1500 + 26 * k, hy = p.y - 450 * k, fl = 1 + 0.12 * Math.sin(c.t * 14);
  return SC.kit(c, [Z(1560, 520, 1.15), Z(1560, 540, 1.45)], {night: true}, <>
    <g transform="translate(0 0)">
      <path d="M 1000,250 Q 1560,400 2120,250" fill="none" stroke="#1d1a2e" strokeWidth={4} />
      {'HAPPY BIRTHDAY'.split('').map((ch, i) => { const q = (i + 0.5) / 14, x = 1000 + q * 1120, y = 250 + 4 * 75 * q * (1 - q) * 1.3 + 10; return ch === ' ' ? null : <g key={i} transform={\`translate(\${x} \${y}) rotate(\${(q - 0.5) * 40})\`}><path d="M -22,0 L 22,0 L 0,56 Z" fill={['#e0455a', '#f5c542', '#3f9a52', '#2c7ab8'][i % 4]} stroke="#1d1a2e" strokeWidth={3} /><text x={0} y={28} textAnchor="middle" fontFamily="Montserrat, sans-serif" fontWeight={800} fontSize={26} fill="#fff" stroke="#1d1a2e" strokeWidth={0.8}>{ch}</text></g>; })}
      {[[1090, 560, '#e0455a'], [1140, 520, '#f5c542'], [1190, 570, '#3f9a52'], [2040, 540, '#2c7ab8'], [2090, 590, '#e0455a']].map(([x, y, col], i) => <g key={i} transform={\`translate(\${x} \${y})\`}><path d={\`M 0,44 Q \${i % 2 ? 16 : -16},120 0,\${200 - i * 8}\`} fill="none" stroke="#1d1a2e" strokeWidth={2.4} /><ellipse cx={0} cy={0} rx={36} ry={46} fill={col as string} stroke="#1d1a2e" strokeWidth={3.4} /><ellipse cx={-12} cy={-14} rx={8} ry={14} fill="#fff" opacity={0.4} /><path d="M -5,46 L 5,46 L 0,56 Z" fill={col as string} stroke="#1d1a2e" strokeWidth={2.4} /></g>)}
    </g>
    <g transform="translate(1800 700)">
      <ellipse cx={0} cy={4} rx={150} ry={26} fill="#ffffff" stroke="#1d1a2e" strokeWidth={3.6} /><rect x={-110} y={-52} width={220} height={54} rx={10} fill="#f4d9a8" stroke="#1d1a2e" strokeWidth={3.6} /><rect x={-80} y={-96} width={160} height={46} rx={10} fill="#f08aa6" stroke="#1d1a2e" strokeWidth={3.6} /><path d="M -80,-96 q 20,18 40,0 q 20,18 40,0 q 20,18 40,0 q 20,18 40,0" fill="#fff" stroke="#1d1a2e" strokeWidth={3} />
      {[-40, -14, 12, 38].map((x, i) => <g key={i} transform={\`translate(\${x} -98)\`}><rect x={-4} y={-34} width={8} height={34} fill={['#e0455a', '#3f9a52', '#2c7ab8', '#f5c542'][i]} stroke="#1d1a2e" strokeWidth={2} /><ellipse cx={0} cy={-42 * 1} rx={5 * fl} ry={9 * fl} fill="#ffcf5a" /><ellipse cx={0} cy={-40} rx={9} ry={14} fill="#ffcf5a" opacity={0.25} /></g>)}
    </g>
    {Pe(c, {...sit('adam', 12, 1500, sc, {outfit: 'kid', turn: 0.7, face: {...F.sad, gaze: [0.9, 0.2]}}, FL), chair: true})}
    <g transform={\`translate(\${hx - 4 * k} \${hy - 205 * k}) rotate(8)\`}><path d={\`M -34,0 L 34,0 L 0,-92 Z\`} fill="#f5c542" stroke="#1d1a2e" strokeWidth={3.4} transform={\`scale(\${k * 1.9})\`} /><circle cx={0} cy={-92 * k * 1.9} r={9 * k * 1.9} fill="#e0455a" stroke="#1d1a2e" strokeWidth={2.4} /></g>
  </>);
};

export const KWORDS: KW[] = [`;
r(S,"export const KWORDS: KW[] = [",bday,'bday');
S.s=S.s.replace(/  \[T\('but on his 12th birthday'\), 'w', \(c\) => SC\.kit\(.*\n/,"  [T('but on his 12th birthday'), 'w', (c) => birthday(c)],\n");
// chairs for the other free-floating sitters
S.s=S.s.replace("sit('aunt', 40, 1960, 0.6, {face: F.smile, turn: -0.3, top: '#d9a030'})","{...sit('aunt', 40, 1960, 0.6, {face: F.smile, turn: -0.3, top: '#d9a030'}), chair: true}");
S.s=S.s.replace("sit('sam', 35, 1280, 0.7, {pose: 'desk', turn: 0.5, face: F.calm}, FL + 76)","{...sit('sam', 35, 1280, 0.7, {pose: 'desk', turn: 0.5, face: F.calm}, FL + 76), chair: true}");
S.s=S.s.replace("sit('sam', 35, 1300, 0.7, {pose: 'desk', turn: 0.5, face: F.calm}, FL + 76)","{...sit('sam', 35, 1300, 0.7, {pose: 'desk', turn: 0.5, face: F.calm}, FL + 76), chair: true}");
fs.writeFileSync('src/fathers/shots.tsx',S.s);
console.log(S.s.includes('birthday(c)'));
