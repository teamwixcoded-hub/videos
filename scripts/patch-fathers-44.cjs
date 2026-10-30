const fs=require('fs');
const r=(f,a,b,tag)=>{if(!f.s.includes(a)){console.log('MISSING',tag||a.slice(0,60));return;}f.s=f.s.replace(a,b)};
const H={s:fs.readFileSync('src/fathers/Human.tsx','utf8')};
r(H,"const {J: E, H} = ik2(S, T, 198, 182, (c) => (c[0][1] > c[1][1] ? c[0] : c[1]));","const {J: E, H} = ik2(S, T, 176, 164, (c) => (c[0][1] > c[1][1] ? c[0] : c[1]));",'front ik');
fs.writeFileSync('src/fathers/Human.tsx',H.s);
const He={s:fs.readFileSync('src/fathers/held.tsx','utf8')};
He.s+=`
// a phone held landscape in front of the face with both hands, filming: seen from the audience side we see its back with the camera lens
export const PhoneLandscape: React.FC<{rec?: number}> = ({rec = 1}) => (
  <g transform="translate(0 -418)">
    <g transform="rotate(90) translate(0 -28)">
      <g transform="translate(0 -28)"><PhoneBack lit={0.2} /></g>
    </g>
    <circle cx={96} cy={-58} r={9} fill="#ff3b3b" opacity={0.5 + 0.5 * rec} />
  </g>
);
`;
fs.writeFileSync('src/fathers/held.tsx',He.s);
const P={s:fs.readFileSync('src/fathers/People.tsx','utf8')};
r(P,"import {PhoneBack, CupHeld} from './held';","import {PhoneBack, CupHeld, PhoneLandscape} from './held';",'imp');
r(P,"  cup: (t) => { const k = sip(t); return {L: [-96, -70], R: [112 - 78 * k, -150 - 290 * k]}; },","  cup: (t) => { const k = sip(t); return {L: [-84, -30], R: [86 - 64 * k, -170 - 275 * k]}; },",'cup');
r(P,"  clap: (t) => { const k = (Math.sin(t * 16) + 1) / 2; return {L: [-98 + 34 * k, -240], R: [98 - 34 * k, -240]}; },","  clap: (t) => { const k = (Math.sin(t * 15) + 1) / 2; return {L: [-112 + 104 * k, -250 - 20 * k], R: [112 - 104 * k, -250 - 20 * k]}; },",'clap');
r(P,"  film: (t) => ({L: [-56, -420], R: [56, -420 + Math.sin(t * 2) * 3]}),","  film: (t) => ({L: [-96, -392 + Math.sin(t * 2) * 3], R: [96, -392 + Math.sin(t * 2.3) * 3]}),",'film');
r(P,"{kids}</HumanFront>","{kids}{view === 'front' && pose === 'film' ? <PhoneLandscape /> : null}</HumanFront>",'film phone');
fs.writeFileSync('src/fathers/People.tsx',P.s);
