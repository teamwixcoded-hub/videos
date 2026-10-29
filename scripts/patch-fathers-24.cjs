const fs=require('fs');let p=fs.readFileSync('src/fathers/People.tsx','utf8');
const r=(a,b)=>{if(!p.includes(a)){console.log('MISSING',a.slice(0,70));return;}p=p.replace(a,b)};
// sip cycle helper
r("const SIDE: Record<PoseName, (t: number, r: number) => H> = {",
`// a sip every few seconds: 0 at rest, 1 with the cup at the lips
const sip = (t: number) => { const p = (t * 0.2) % 1; return p < 0.3 ? Math.sin((p / 0.3) * Math.PI) : 0; };
const SIDE: Record<PoseName, (t: number, r: number) => H> = {`);
r("  cup: (t) => ({N: [196 + Math.sin(t * 0.7) * 4, -168 + Math.sin(t * 0.9) * 3], F: [84, -92], pitch: 12}),",
  "  cup: (t) => { const k = sip(t); return {N: [196 + (176 - 196) * k + Math.sin(t * 0.7) * 4, -168 + (-396 + 168) * k + Math.sin(t * 0.9) * 3], F: [84, -92], pitch: 12 - 10 * k, torso: -2 * k}; },");
r("  cup: () => ({L: [-70, -80], R: [100, -150]}),","  cup: (t) => { const k = sip(t); return {L: [-70, -80], R: [100 - 60 * k, -150 - 230 * k]}; },");
// typing: head and shoulders nod with the keys
r("type: (t) => ({N: [250 + Math.sin(t * 9) * 8, -125 + Math.sin(t * 13) * 6], F: [214 + Math.sin(t * 11) * 8, -112], torso: 6, pitch: 16}),","type: (t) => ({N: [250 + Math.sin(t * 9) * 14, -125 + Math.max(0, Math.sin(t * 13)) * -16], F: [214 + Math.sin(t * 11) * 14, -112 + Math.max(0, Math.sin(t * 12 + 1)) * -14], torso: 6 + Math.sin(t * 1.3) * 1.5, pitch: 16 + Math.sin(t * 0.8) * 4}),");
r("desk: (t) => ({N: [250 + Math.sin(t * 9) * 8, -125 + Math.sin(t * 13) * 6], F: [214 + Math.sin(t * 11) * 8, -112], torso: 6, pitch: 16}),","desk: (t) => ({N: [250 + Math.sin(t * 9) * 14, -125 + Math.max(0, Math.sin(t * 13)) * -16], F: [214 + Math.sin(t * 11) * 14, -112 + Math.max(0, Math.sin(t * 12 + 1)) * -14], torso: 6 + Math.sin(t * 1.3) * 1.5, pitch: 16 + Math.sin(t * 0.8) * 4}),");
// scrolling thumb
r("phone: () => ({N: [150, -250], F: [96, -122], pitch: 28}),","phone: (t) => ({N: [150 + Math.sin(t * 2.2) * 4, -250 + Math.max(0, Math.sin(t * 4.4)) * -8], F: [96, -122], pitch: 28 + Math.sin(t * 0.7) * 2}),");
// pointing jabs, carrying bounce, hold breathing
r("point: () => ({N: [330, -272], F: [20, 66]}),","point: (t) => ({N: [330 + Math.max(0, Math.sin(t * 3)) * 26, -272 + Math.sin(t * 3) * 8], F: [20, 66]}),");
r("carry: () => ({N: [205, -84], F: [155, -72], torso: -6}),","carry: (t) => ({N: [205, -84 + Math.sin(t * 5) * 4], F: [155, -72 + Math.sin(t * 5) * 4], torso: -6}),");
r("hold: () => ({N: [200, -100], F: [168, -92]}),","hold: (t) => ({N: [200 + Math.sin(t * 0.8) * 4, -100 + Math.sin(t * 1.1) * 4], F: [168, -92 + Math.sin(t * 1.1 + 1) * 3]}),");
fs.writeFileSync('src/fathers/People.tsx',p);
