// @ts-nocheck
// Ported from character-lab/character.js (vector glass character).
// Shared character library: palette, expressions, rig, and figure() that returns drawable SVG.
const INK = '#1c1a1d', WHITE = '#fbfaf7', RIM = '#eaf6ff', OPACITY = 0.8;
const rad = (d) => d * Math.PI / 180;

const SKIN = ['#46567a', '#1b2437'];
const PAL = {
  indigo: {hood:['#8b83ff','#4338ca'], pants:['#52627a','#27324a'], shoe:['#f8fafc','#cbd5e1'], sole:'#14b8a6'},
  teal:   {hood:['#4fe3cf','#0f766e'], pants:['#52627a','#27324a'], shoe:['#f8fafc','#cbd5e1'], sole:'#6366f1'},
  coral:  {hood:['#ff8da1','#be123c'], pants:['#52627a','#27324a'], shoe:['#f8fafc','#cbd5e1'], sole:'#fbbf24'},
  gold:   {hood:['#ffd25a','#b45309'], pants:['#52627a','#27324a'], shoe:['#f8fafc','#cbd5e1'], sole:'#4338ca'},
};
const defs = (u, P, dark) => `<defs>
  <linearGradient id="${u}h" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${P.hood[0]}"/><stop offset="1" stop-color="${P.hood[1]}"/></linearGradient>
  <linearGradient id="${u}p" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${P.pants[0]}"/><stop offset="1" stop-color="${P.pants[1]}"/></linearGradient>
  <linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.shoe[0]}"/><stop offset="1" stop-color="${P.shoe[1]}"/></linearGradient>
  <linearGradient id="${u}kh" gradientUnits="userSpaceOnUse" x1="36" y1="17" x2="164" y2="153"><stop offset="0" stop-color="${SKIN[0]}"/><stop offset="1" stop-color="${SKIN[1]}"/></linearGradient>
  <linearGradient id="${u}k" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${SKIN[0]}"/><stop offset="1" stop-color="${SKIN[1]}"/></linearGradient>
  <filter id="${u}f" x="-30%" y="-20%" width="160%" height="150%"><feDropShadow dx="0" dy="7" stdDeviation="6" flood-color="${dark ? '#000' : '#1b2540'}" flood-opacity="${dark ? .5 : .28}"/></filter>
  <pattern id="${u}bg" width="26" height="26" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="26" height="26" fill="${dark ? '#141824' : '#e4ddd0'}"/><rect width="13" height="26" fill="${dark ? '#1d2536' : '#d3c9b8'}"/></pattern>
</defs>`;

const EMO = {
  neutral:    {bl:[0,0],   br:[0,0],   lid:[0.0,0,0],   pupil:[7,0,0],   mouth:'flat'},
  happy:      {bl:[-5,5],  br:[-5,-5], lid:[0.0,0.28,0],pupil:[8,0,-1],  mouth:'smile'},
  laughing:   {bl:[-9,6],  br:[-9,-6], lid:[0,0,0],     pupil:[6,0,0],   mouth:'laugh', arch:true},
  sad:        {bl:[-2,-20],br:[-2,20], lid:[0.30,0,-8], pupil:[8,0,5],   mouth:'frown'},
  crying:     {bl:[-2,-24],br:[-2,24], lid:[0.34,0,-10],pupil:[9,0,6],   mouth:'wail', tears:true},
  angry:      {bl:[8,24],  br:[8,-24], lid:[0.34,0,22], pupil:[6,0,2],   mouth:'grit'},
  determined: {bl:[5,14],  br:[5,-14], lid:[0.22,0,12], pupil:[7,0,0],   mouth:'grit2'},
  tired:      {bl:[8,-6],  br:[8,6],   lid:[0.58,0.08,0],pupil:[7,0,6],  mouth:'tiny', bags:true},
  surprised:  {bl:[-9,0],  br:[-9,0],  lid:[0,0,0],     pupil:[4,0,0],   mouth:'oh', big:1.12},
  scared:     {bl:[-10,-12],br:[-10,12],lid:[0,0,0],    pupil:[3.5,0,0], mouth:'wavy', big:1.1},
  smug:       {bl:[-7,-6], br:[3,10],  lid:[0.40,0,0],  pupil:[7,8,0],   mouth:'smirk'},
  worried:    {bl:[-8,-22],br:[-8,22], lid:[0,0,0],     pupil:[6,-4,1],  mouth:'wobble'},
};
const MOUTH = {
  flat:  '<path d="M86 132 L114 132" />',
  smile: '<path d="M76 120 Q100 150 124 120" />',
  laugh: '<path d="M74 116 Q100 168 126 116 Z" fill="'+WHITE+'" />',
  frown: '<path d="M80 140 Q100 120 120 140" />',
  wail:  '<path d="M80 144 Q100 114 120 144 Z" fill="'+WHITE+'" />',
  grit:  '<rect x="78" y="124" width="44" height="18" rx="5" fill="'+WHITE+'" stroke="none" /><path d="M89 124 V142 M100 124 V142 M111 124 V142" stroke="'+INK+'" stroke-width="2.5" />',
  grit2: '<path d="M78 133 L122 133" stroke-width="7" />',
  tiny:  '<path d="M92 136 L108 136" />',
  oh:    '<ellipse cx="100" cy="134" rx="10" ry="15" fill="'+WHITE+'" stroke="none" />',
  wavy:  '<path d="M78 136 Q86 126 94 136 T110 136 T124 136" />',
  smirk: '<path d="M82 132 Q106 140 124 118" />',
  wobble:'<path d="M86 138 Q94 130 100 136 T114 134" />',
  // talking shapes, driven by scripts/lipsync.mjs codes: s small, m medium, w wide, o round, e sibilant
  ts: '<ellipse cx="100" cy="133" rx="9" ry="5" fill="'+WHITE+'" stroke="none" />',
  tm: '<ellipse cx="100" cy="134" rx="13" ry="9" fill="'+WHITE+'" stroke="none" />',
  tw: '<ellipse cx="100" cy="136" rx="18" ry="13" fill="'+WHITE+'" stroke="none" />',
  to: '<ellipse cx="100" cy="136" rx="9" ry="14" fill="'+WHITE+'" stroke="none" />',
  te: '<rect x="80" y="127" width="40" height="11" rx="5.5" fill="'+WHITE+'" stroke="none" /><path d="M84 132.5 H116" stroke="#46567a" stroke-width="2" />',
};
function face(e, uid) {
  const s = e.big || 1, ex = [70,130], ey = 88, rx = 17*s, ry = 22*s;
  let g = '';
  ex.forEach((cx, i) => {
    const id = `clip${uid}_${i}`, side = i === 0 ? 1 : -1;
    if (e.arch) { g += `<path d="M${cx-16} ${ey+8} Q${cx} ${ey-22} ${cx+16} ${ey+8}" stroke="${WHITE}" stroke-width="7" stroke-linecap="round" fill="none"/>`; return; }
    g += `<clipPath id="${id}"><ellipse cx="${cx}" cy="${ey}" rx="${rx}" ry="${ry}"/></clipPath>`;
    g += `<clipPath id="${id}L"><ellipse cx="${cx}" cy="${ey}" rx="${rx+2.5}" ry="${ry+2.5}"/></clipPath>`;
    g += `<ellipse cx="${cx}" cy="${ey}" rx="${rx}" ry="${ry}" fill="${WHITE}"/>`;
    const [pr, pdx, pdy] = e.pupil;
    g += `<circle cx="${cx + pdx}" cy="${ey + pdy}" r="${pr}" fill="${INK}" clip-path="url(#${id})"/>`;
    const [top, bot, tilt] = e.lid, t = tilt * side;
    if (top > 0) g += `<rect x="${cx-60}" y="${ey-ry-70}" width="120" height="${70 + 2*ry*top}" fill="url(#${uid}kh)" transform="rotate(${t} ${cx} ${ey})" clip-path="url(#${id}L)"/>`;
    if (bot > 0) g += `<rect x="${cx-40}" y="${ey+ry-2*ry*bot}" width="80" height="40" fill="url(#${uid}kh)" clip-path="url(#${id}L)"/>`;
    if (e.bags) g += `<path d="M${cx-14} ${ey+ry+5} Q${cx} ${ey+ry+11} ${cx+14} ${ey+ry+5}" stroke="${WHITE}" stroke-opacity=".55" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    if (e.tears) g += `<path d="M${cx} ${ey+ry} q-5 20 0 34 q5 -14 0 -34" fill="#bfe3ff"/>`;
  });
  const br = (cx, [dy, a]) => `<g transform="rotate(${a} ${cx} ${58+dy})"><path d="M${cx-17} ${58+dy} L${cx+17} ${58+dy}" stroke="${WHITE}" stroke-width="7" stroke-linecap="round"/></g>`;
  g += br(70, e.bl) + br(130, e.br);
  g += `<g stroke="${WHITE}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none">${MOUTH[e.mouth]}</g>`;
  return g;
}
const headGlass = (u) => `<ellipse cx="100" cy="85" rx="64" ry="68" fill="${RIM}" stroke="${RIM}" stroke-width="4"/>
  <ellipse cx="100" cy="85" rx="64" ry="68" fill="url(#${u}kh)"/>
  <ellipse cx="72" cy="42" rx="30" ry="14" fill="#fff" opacity=".20" transform="rotate(-28 72 42)"/>`;

const dir = (a) => [Math.sin(rad(a)), Math.cos(rad(a))];
const add = (p, v, l) => [p[0] + v[0]*l, p[1] + v[1]*l];
const unit = (fn, fill) => fn(RIM, `stroke="${RIM}" stroke-width="3.4" stroke-linejoin="round"`) + fn(fill, '');
const limb = (p, q, w1, w2) => (f, s) => {
  const dx = q[0]-p[0], dy = q[1]-p[1], L = Math.hypot(dx, dy) || 1, nx = -dy/L, ny = dx/L;
  const pts = [[p[0]+nx*w1/2,p[1]+ny*w1/2],[q[0]+nx*w2/2,q[1]+ny*w2/2],[q[0]-nx*w2/2,q[1]-ny*w2/2],[p[0]-nx*w1/2,p[1]-ny*w1/2]];
  return `<polygon points="${pts.map(x=>x.join(',')).join(' ')}" fill="${f}" ${s}/><circle cx="${p[0]}" cy="${p[1]}" r="${w1/2}" fill="${f}" ${s}/><circle cx="${q[0]}" cy="${q[1]}" r="${w2/2}" fill="${f}" ${s}/>`;
};
const ell = (cx, cy, rx, ry, rot = 0) => (f, s) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${f}" ${s} transform="rotate(${rot} ${cx} ${cy})"/>`;

function body(pose, emo, u, P) {
  const H = [150, 250], L = pose.lean, up = [Math.sin(rad(L)), -Math.cos(rad(L))];
  const N = add(H, up, 105), tilt = L + pose.tilt, hv = [Math.sin(rad(tilt)), -Math.cos(rad(tilt))], hc = add(N, hv, 70);
  const sh = add(N, up, -10), perp = [Math.cos(rad(L)), Math.sin(rad(L))];
  const hands = {};
  let g = '';
  g += unit(ell(N[0], N[1] - 2, 30, 16, L), `url(#${u}h)`);
  const leg = (a, side) => {
    const k = add(H, dir(a[0]), 78), ft = add(k, dir(a[1]), 78);
    return unit(limb(H, k, 17, 12), `url(#${u}p)`) + unit(limb(k, ft, 12, 9), `url(#${u}p)`)
      + unit(ell(ft[0] + side*9, ft[1] + 2, 19, 9), `url(#${u}s)`)
      + `<ellipse cx="${ft[0] + side*9}" cy="${ft[1] + 8}" rx="18" ry="3" fill="${P.sole}"/>`;
  };
  g += leg(pose.legL, -1) + leg(pose.legR, 1);
  g += unit(limb(H, N, 36, 46), `url(#${u}h)`);
  const pc = add(H, up, 38);
  g += `<rect x="-15" y="-9" width="30" height="18" rx="7" fill="#000" opacity=".16" transform="translate(${pc[0]} ${pc[1]}) rotate(${L})"/>`;
  const ds = add(N, up, -8);
  g += `<path d="M${ds[0]-6} ${ds[1]} l-2 26 M${ds[0]+6} ${ds[1]} l2 26" stroke="#fff" stroke-opacity=".75" stroke-width="2.4" stroke-linecap="round" fill="none"/>`;
  const arm = (a, side) => {
    const sp = add(sh, perp, side*16), e = add(sp, dir(a[0]), 58), w = add(e, dir(a[1]), 52), hd = add(w, dir(a[1]), 7);
    hands[side < 0 ? 'L' : 'R'] = hd;
    return unit(limb(sp, e, 14, 11), `url(#${u}h)`) + unit(limb(e, w, 11, 9), `url(#${u}h)`)
      + `<ellipse cx="${w[0]}" cy="${w[1]}" rx="6.5" ry="3.5" fill="#fff" opacity=".4" transform="rotate(${-a[1]} ${w[0]} ${w[1]})"/>`
      + unit(ell(hd[0], hd[1], 8, 10, -a[1]), `url(#${u}k)`);
  };
  g += arm(pose.armL, -1) + arm(pose.armR, 1);
  g += unit(limb(N, hc, 13, 13), `url(#${u}k)`);
  const tf = `translate(${hc[0]} ${hc[1]}) rotate(${tilt}) scale(.9) translate(-100 -85)`;
  return { hands, glass: g, face: `<g transform="${tf}">${headGlass(u)}${face(emo, u)}</g>` };
}
const POSES = {
  idle:       {lean:0,  tilt:0,   armL:[-10,-5],   armR:[10,5],    legL:[-5,-2],   legR:[5,2],   emo:'neutral'},
  slumped:    {lean:16, tilt:22,  armL:[-3,0],     armR:[8,12],    legL:[-2,0],    legR:[10,6],  emo:'sad'},
  triumphant: {lean:-4, tilt:-10, armL:[-120,-150],armR:[120,150], legL:[-14,-10], legR:[14,10], emo:'laughing'},
  pointing:   {lean:5,  tilt:4,   armL:[-8,-4],    armR:[96,92],   legL:[-6,-3],   legR:[8,4],   emo:'determined'},
};
// figure(): drawable character in a 300x430 box (feet near y=416). No background.
function figure(pose, pal, u, dark) {
  const P = PAL[pal], b = body(pose, EMO[pose.emo], u, P);
  return `${defs(u, P, dark)}<g opacity="${OPACITY}" filter="url(#${u}f)">${b.glass}</g>${b.face}`;
}
function scene(pose, pal, u, dark) {
  return `<svg viewBox="-10 0 320 430" xmlns="http://www.w3.org/2000/svg"><rect x="-10" width="320" height="430" fill="url(#${u}bg)"/>
    <ellipse cx="150" cy="418" rx="78" ry="8" fill="#000" opacity="${dark ? .5 : .14}"/>${figure(pose, pal, u, dark)}</svg>`;
}
function headOnly(e, u) {
  return `<svg viewBox="20 0 160 175" xmlns="http://www.w3.org/2000/svg">${defs(u, PAL.indigo)}<rect x="0" y="0" width="200" height="175" fill="#ddd7cc"/>${headGlass(u)}${face(e, u)}</svg>`;
}

export { PAL, EMO, POSES, body, figure, defs, headGlass, face };


// figureEx(): like figure() but takes a ready-made face object and also returns the hand positions (figure space),
// so props can be held. Used by the new-style video (src/new).
function figureEx(pose, emo, pal, u, dark) {
  const P = PAL[pal], b = body(pose, emo, u, P);
  return { svg: `${defs(u, P, dark)}<g opacity="${OPACITY}" filter="url(#${u}f)">${b.glass}</g>${b.face}`, hands: b.hands };
}
export { figureEx };
