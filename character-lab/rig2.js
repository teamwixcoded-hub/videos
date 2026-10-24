// Rig 2.2: a believable figure that can TURN, in two looks:
//   style 'flat'  = the original video's look: thick dark outline, beige skin, plain hoodie, jeans, sneakers, outlined eyes
//   style 'glass' = the glassy dark-head look
// 3/4 and profile views (head turns with the body: face slides, nose + ear appear, far limbs tuck behind the torso),
// 2-bone IK for arms and legs, hands that wrap behind a held object (thumbs in front), look-at eyes, one-piece garments.
// Output is an SVG string in figure space (300 x 430, standing feet near y = 416). Depends on character.js globals: PAL, face, headGlass.
const Rig2 = (() => {
  const L = {thigh: 76, shin: 76, upper: 56, fore: 52, torso: 104, neck: 14};
  const d2r = (d) => d * Math.PI / 180;
  const v = (a, b) => [a[0] + b[0], a[1] + b[1]];
  const sc = (a, k) => [a[0] * k, a[1] * k];
  const len = (a) => Math.hypot(a[0], a[1]);
  const unitv = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l]; };
  const up = (deg) => [Math.sin(d2r(deg)), -Math.cos(d2r(deg))];
  const perp = (deg) => [Math.cos(d2r(deg)), Math.sin(d2r(deg))];
  const f1 = (x) => x.toFixed(1);
  const OUT = '#33190f';

  // active look (set at the start of figure())
  const S = {ln: '#eaf6ff', lw: 3.6, hw: 2.2, skin: ['#46567a', '#1b2437']};

  const FLAT = {   // palettes for the flat look, keyed like PAL
    coral:  {hood: ['#8d909a', '#6f737e'], pants: ['#4a6a9d', '#355483'], shoe: ['#f2eadb', '#d9cfba'], skin: ['#f5d5a9', '#e8bd89'], accent: '#c0503f'},
    teal:   {hood: ['#93a878', '#74895b'], pants: ['#5a6e8e', '#41546f'], shoe: ['#f2eadb', '#d9cfba'], skin: ['#f5d5a9', '#e8bd89'], accent: '#5a7f52'},
    indigo: {hood: ['#8c93b8', '#6a7298'], pants: ['#4a6a9d', '#355483'], shoe: ['#f2eadb', '#d9cfba'], skin: ['#f5d5a9', '#e8bd89'], accent: '#4a5a9a'},
    gold:   {hood: ['#d1aa5e', '#b08a3e'], pants: ['#4a6a9d', '#355483'], shoe: ['#f2eadb', '#d9cfba'], skin: ['#f5d5a9', '#e8bd89'], accent: '#a8742a'},
  };

  function ik(o, t, a, b, s) {
    const dv = [t[0] - o[0], t[1] - o[1]], d = len(dv);
    const dmax = a + b - 0.5, dmin = Math.abs(a - b) + 0.5, dd = Math.min(dmax, Math.max(dmin, d)), base = Math.atan2(dv[1], dv[0]);
    const ang = Math.acos(Math.max(-1, Math.min(1, (a * a + dd * dd - b * b) / (2 * a * dd))));
    return {joint: [o[0] + a * Math.cos(base + s * ang), o[1] + a * Math.sin(base + s * ang)], end: [o[0] + (dv[0] / (d || 1)) * dd, o[1] + (dv[1] / (d || 1)) * dd]};
  }
  function smooth(pts) {
    const n = pts.length, mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    let s = `M${mid(pts[n - 1], pts[0]).map(f1).join(' ')}`;
    for (let i = 0; i < n; i++) { const m = mid(pts[i], pts[(i + 1) % n]); s += ` Q${pts[i].map(f1).join(' ')} ${m.map(f1).join(' ')}`; }
    return s + ' Z';
  }
  const capsule = (p, q, w1, w2) => {
    const dv = unitv([q[0] - p[0], q[1] - p[1]]), n = [-dv[1], dv[0]], a = w1 / 2, b = w2 / 2;
    const P = [[p[0] + n[0] * a, p[1] + n[1] * a], [q[0] + n[0] * b, q[1] + n[1] * b], [q[0] - n[0] * b, q[1] - n[1] * b], [p[0] - n[0] * a, p[1] - n[1] * a]];
    return `M${P[0].join(' ')} L${P[1].join(' ')} A${b} ${b} 0 0 0 ${P[2].join(' ')} L${P[3].join(' ')} A${a} ${a} 0 0 0 ${P[0].join(' ')} Z`;
  };
  // a group of paths drawn as ONE piece: all outlines first, then all fills (no seams where pieces overlap)
  const piece = (paths, fill) => paths.map((d) => `<path d="${d}" fill="${S.ln}" stroke="${S.ln}" stroke-width="${S.lw}" stroke-linejoin="round"/>`).join('') + paths.map((d) => `<path d="${d}" fill="${fill}"/>`).join('');
  const ang = (w, e) => Math.atan2(w[1] - e[1], w[0] - e[0]) * 180 / Math.PI - 90;
  const skinFill = (u) => `url(#${u}k)`;

  // hands. A 'hold' hand puts the palm BEHIND the held object and the thumb IN FRONT of it.
  const handBack = (u, w, fd, kind, side) => {
    const c = v(w, sc(fd, 8)), a = ang(v(w, fd), w), sk = skinFill(u), st = `stroke="${S.ln}" stroke-width="${S.hw}"`;
    const palm = `<ellipse cx="0" cy="0" rx="8.5" ry="10" fill="${sk}" ${st}/>`;
    const thumb = `<ellipse cx="${side * 8.5}" cy="-1" rx="3.4" ry="6.4" fill="${sk}" ${st} transform="rotate(${side * 22} ${side * 8.5} -1)"/>`;
    let extra = '';
    if (kind === 'grip') extra = [-5.5, -1.8, 1.8, 5.5].map((x) => `<circle cx="${x}" cy="9" r="3.2" fill="${sk}" ${st}/>`).join('');
    else if (kind === 'point') extra = `<rect x="-2.6" y="6" width="5.2" height="19" rx="2.6" fill="${sk}" ${st}/>`;
    else if (kind === 'open') extra = [-6, -2, 2, 6].map((x, i) => `<rect x="${x - 1.9}" y="7" width="3.8" height="${12 - Math.abs(i - 1.5) * 2}" rx="1.9" fill="${sk}" ${st} transform="rotate(${(i - 1.5) * 11} ${x} 7)"/>`).join('');
    else if (kind === 'hold') extra = [-6, -2, 2, 6].map((x) => `<rect x="${x - 2}" y="4" width="4" height="13" rx="2" fill="${sk}" ${st}/>`).join('');
    return `<g transform="translate(${f1(c[0])} ${f1(c[1])}) rotate(${f1(a)})">${extra}${palm}${kind === 'hold' ? '' : thumb}</g>`;
  };
  const thumbFront = (u, w, fd, side) => {
    const c = v(w, sc(fd, 12)), a = ang(v(w, fd), w);
    return `<g transform="translate(${f1(c[0])} ${f1(c[1])}) rotate(${f1(a)})"><ellipse cx="${side * 5}" cy="2" rx="3.8" ry="7.2" fill="${skinFill(u)}" stroke="${S.ln}" stroke-width="${S.hw}" transform="rotate(${side * -28} ${side * 5} 2)"/></g>`;
  };
  function shoe(u, f, facing) {
    const s = facing, p = (x, y) => `${f1(f[0] + x * s)} ${f1(f[1] + y)}`;
    const d = `M${p(-9, -6)} Q${p(-13, 6)} ${p(-6, 11)} L${p(20, 11)} Q${p(30, 10)} ${p(26, 1)} Q${p(18, -6)} ${p(6, -9)} Z`;
    return `<path d="${d}" fill="${S.ln}" stroke="${S.ln}" stroke-width="${S.lw * 0.9}" stroke-linejoin="round"/><path d="${d}" fill="url(#${u}s)"/>`
      + `<path d="M${p(-8, 8)} L${p(26, 8)}" stroke="${S.ln === OUT ? '#b9ad94' : '#fff'}" stroke-width="2.6" opacity=".9" stroke-linecap="round"/><path d="M${p(10, -2)} Q${p(18, -1)} ${p(24, 3)}" stroke="${S.ln === OUT ? OUT : '#94a3b8'}" stroke-width="1.8" fill="none" opacity=".7"/>`;
  }

  // ---- flat-look face: thick dark brows, outlined white eyes, line mouths (like the original head sheet) ----
  const MF = {
    flat: `<path d="M86 132 L114 132"/>`, smile: `<path d="M76 120 Q100 148 124 120"/>`,
    laugh: `<path d="M74 116 Q100 166 126 116 Z" fill="#7a2a2a"/><path d="M84 121 Q100 130 116 121" stroke="#fff" stroke-width="4"/>`,
    frown: `<path d="M80 140 Q100 120 120 140"/>`, wail: `<path d="M80 144 Q100 114 120 144 Z" fill="#7a2a2a"/>`,
    grit: `<rect x="78" y="124" width="44" height="18" rx="5" fill="#fff"/><path d="M89 124 V142 M100 124 V142 M111 124 V142" stroke-width="2.4"/>`,
    grit2: `<path d="M78 133 L122 133" stroke-width="6.5"/>`, tiny: `<path d="M92 136 L108 136"/>`,
    oh: `<ellipse cx="100" cy="134" rx="10" ry="14" fill="#6a2424"/>`, wavy: `<path d="M78 136 Q86 126 94 136 T110 136 T124 136"/>`,
    smirk: `<path d="M82 132 Q106 140 124 118"/>`, wobble: `<path d="M86 138 Q94 130 100 136 T114 134"/>`,
    ts: `<ellipse cx="100" cy="133" rx="9" ry="5" fill="#6a2424"/>`, tm: `<ellipse cx="100" cy="134" rx="13" ry="9" fill="#6a2424"/>`,
    tw: `<ellipse cx="100" cy="136" rx="18" ry="13" fill="#6a2424"/><ellipse cx="100" cy="143" rx="10" ry="5" fill="#c46a6a" stroke="none"/>`,
    to: `<ellipse cx="100" cy="136" rx="9" ry="14" fill="#6a2424"/>`, te: `<rect x="80" y="127" width="40" height="11" rx="5.5" fill="#fff"/><path d="M84 132.5 H116" stroke-width="2"/>`,
  };
  function faceFlat(e, uid, skin) {
    const s = e.big || 1, ex = [70, 130], ey = 88, rx = 17 * s, ry = 22 * s;
    let g = '';
    ex.forEach((cx, i) => {
      const id = `fc${uid}_${i}`, side = i === 0 ? 1 : -1;
      if (e.arch) { g += `<path d="M${cx - 16} ${ey + 8} Q${cx} ${ey - 22} ${cx + 16} ${ey + 8}" stroke="${OUT}" stroke-width="6" stroke-linecap="round" fill="none"/>`; return; }
      g += `<clipPath id="${id}"><ellipse cx="${cx}" cy="${ey}" rx="${rx}" ry="${ry}"/></clipPath><clipPath id="${id}L"><ellipse cx="${cx}" cy="${ey}" rx="${rx + 1.5}" ry="${ry + 1.5}"/></clipPath>`;
      g += `<ellipse cx="${cx}" cy="${ey}" rx="${rx}" ry="${ry}" fill="#fff"/>`;
      const [pr, pdx, pdy] = e.pupil;
      g += `<circle cx="${cx + pdx}" cy="${ey + pdy}" r="${pr * 0.92}" fill="#1a0e08" clip-path="url(#${id})"/><circle cx="${cx + pdx - pr * 0.25}" cy="${ey + pdy - pr * 0.3}" r="${pr * 0.22}" fill="#fff" clip-path="url(#${id})"/>`;
      const [top, bot, tilt] = e.lid, t = tilt * side;
      if (top > 0) g += `<rect x="${cx - 60}" y="${ey - ry - 70}" width="120" height="${70 + 2 * ry * top}" fill="${skin}" transform="rotate(${t} ${cx} ${ey})" clip-path="url(#${id}L)"/><path d="M${cx - 44} ${ey - ry + 2 * ry * top} H${cx + 44}" stroke="${OUT}" stroke-width="3" transform="rotate(${t} ${cx} ${ey})" clip-path="url(#${id}L)"/>`;
      if (bot > 0) g += `<rect x="${cx - 40}" y="${ey + ry - 2 * ry * bot}" width="80" height="40" fill="${skin}" clip-path="url(#${id}L)"/><path d="M${cx - 40} ${ey + ry - 2 * ry * bot} H${cx + 40}" stroke="${OUT}" stroke-width="3" clip-path="url(#${id}L)"/>`;
      g += `<ellipse cx="${cx}" cy="${ey}" rx="${rx}" ry="${ry}" fill="none" stroke="${OUT}" stroke-width="3.4"/>`;
      if (e.bags) g += `<path d="M${cx - 15} ${ey + ry + 6} Q${cx} ${ey + ry + 13} ${cx + 15} ${ey + ry + 6}" stroke="#b98456" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
      if (e.tears) g += `<path d="M${cx} ${ey + ry} q-6 20 0 34 q6 -14 0 -34" fill="#8fd3ff" stroke="${OUT}" stroke-width="2"/>`;
    });
    const br = (cx, [dy, a]) => `<g transform="rotate(${a} ${cx} ${56 + dy})"><path d="M${cx - 19} ${58 + dy} Q${cx} ${51 + dy} ${cx + 19} ${58 + dy}" stroke="${OUT}" stroke-width="7.5" stroke-linecap="round" fill="none"/></g>`;
    g += br(70, e.bl) + br(130, e.br);
    g += `<g stroke="${OUT}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="none">${MF[e.mouth] || MF.flat}</g>`;
    return g;
  }

  // spec: {pal, u, style, hip, lean, chest, headTilt, turn (-1..1: body AND face turn, + = facing right), yaw, look, emo,
  //        armL/armR: {reach}|{ang} + hand, legL/legR: {foot}|{ang}, heldFn}
  function figure(spec) {
    const {pal = 'indigo', u = 'r', hip = [150, 250], lean = 0, chest = 0, headTilt = 0, facing = 1, look = null} = spec;
    const flat = spec.style === 'flat';
    const P = flat ? FLAT[pal] : PAL[pal];
    const SKC = flat ? P.skin : ['#46567a', '#1b2437'];
    S.ln = flat ? OUT : '#eaf6ff'; S.lw = flat ? 7 : 3.6; S.hw = flat ? 2.6 : 2.2; S.skin = SKC;
    const turn = spec.turn || 0, at = Math.min(1, Math.abs(turn)), yaw = spec.yaw !== undefined ? spec.yaw : turn;
    const hipHalf = 12 * (1 - 0.55 * at) + 1, shHalf = 27 * (1 - 0.62 * at) + 1, wsHalf = 23 * (1 - 0.34 * at), hemHalf = 20 * (1 - 0.3 * at);
    const H = hip, spine1 = up(lean), spine2 = up(lean + chest);
    const waist = v(H, sc(spine1, 46)), N = v(waist, sc(spine2, L.torso - 46));
    const hc = v(N, sc(up(lean + chest + headTilt), L.neck + 56));
    const pH = perp(lean), pC = perp(lean + chest);
    const sh = v(N, sc(spine2, -9));
    const shL = v(sh, sc(pC, -shHalf)), shR = v(sh, sc(pC, shHalf));
    const hipL = v(H, sc(pH, -hipHalf)), hipR = v(H, sc(pH, hipHalf));
    const nearL = turn >= 0;

    const leg = (s_, hp, side) => {
      let kn, ank;
      if (s_ && s_.ang) { kn = v(hp, sc([Math.sin(d2r(s_.ang[0])), Math.cos(d2r(s_.ang[0]))], L.thigh)); ank = v(kn, sc([Math.sin(d2r(s_.ang[1])), Math.cos(d2r(s_.ang[1]))], L.shin)); }
      else { const foot = (s_ && s_.foot) || [H[0] + side * 16 * (1 - 0.5 * at), 406]; const r = ik(hp, foot, L.thigh, L.shin, s_ && s_.bend ? s_.bend : -facing); kn = r.joint; ank = r.end; }
      return {kn, ank};
    };
    const lL = leg(spec.legL, hipL, -1), lR = leg(spec.legR, hipR, 1);
    const arm = (s_, shP, side) => {
      let el, wr;
      if (s_ && s_.reach) { const r = ik(shP, s_.reach, L.upper, L.fore, s_.bend || side * facing * (turn >= 0 ? 1 : -1)); el = r.joint; wr = r.end; }
      else { const a = (s_ && s_.ang) || [side * 8, side * 4]; el = v(shP, sc([Math.sin(d2r(a[0])), Math.cos(d2r(a[0]))], L.upper)); wr = v(el, sc([Math.sin(d2r(a[1])), Math.cos(d2r(a[1]))], L.fore)); }
      return {el, wr};
    };
    const aL = arm(spec.armL, shL, -1), aR = arm(spec.armR, shR, 1);
    const kindL = (spec.armL && spec.armL.hand) || 'relaxed', kindR = (spec.armR && spec.armR.hand) || 'relaxed';
    const fdOf = (a) => unitv([a.wr[0] - a.el[0], a.wr[1] - a.el[1]]);
    const fdL = fdOf(aL), fdR = fdOf(aR);

    let g = '';
    g += piece([`M${f1(N[0] - 30)} ${f1(N[1] + 2)} a30 17 ${lean + chest} 1 1 60 0 a30 17 ${lean + chest} 1 1 -60 0`], `url(#${u}h)`);
    const legPath = (l, hp) => [capsule(hp, l.kn, 24, 19), capsule(l.kn, l.ank, 19, 14)];
    const drawLeg = (l, hp) => piece(legPath(l, hp), `url(#${u}p)`) + shoe(u, l.ank, facing);
    if (nearL) g += drawLeg(lR, hipR) + drawLeg(lL, hipL); else g += drawLeg(lL, hipL) + drawLeg(lR, hipR);
    const busy = (k) => k === 'hold' || k === 'grip' || k === 'point' || k === 'open';
    const armPieces = (a, sp) => [capsule(sp, a.el, 20, 16), capsule(a.el, a.wr, 16, 13)];
    const farIsL = !nearL;
    if (at > 0.05 && !(farIsL ? busy(kindL) : busy(kindR))) { const a = farIsL ? aL : aR, sp = farIsL ? shL : shR; g += piece(armPieces(a, sp), `url(#${u}hh)`) + handBack(u, a.wr, farIsL ? fdL : fdR, farIsL ? kindL : kindR, farIsL ? -1 : 1); }
    const torso = smooth([hipL, v(hipL, sc(pH, -6)), v(waist, sc(pH, -wsHalf)), shL, v(N, sc(pC, -13 * (1 - 0.3 * at))), v(N, sc(pC, 13 * (1 - 0.3 * at))), shR, v(waist, sc(pH, wsHalf)), v(hipR, sc(pH, 6)), hipR, v(H, sc(spine1, -6))]);
    g += piece([torso], `url(#${u}hh)`);
    const dk = flat ? '#33190f' : '#000';
    const hem = v(H, sc(spine1, 8)), pk = v(H, sc(spine1, 30)), cd = v(N, sc(spine2, -6));
    g += `<path d="M${v(hem, sc(pH, -hemHalf)).map(f1).join(' ')} Q${f1(hem[0])} ${f1(hem[1] + 7)} ${v(hem, sc(pH, hemHalf)).map(f1).join(' ')}" stroke="${dk}" stroke-opacity="${flat ? 0.55 : 0.18}" stroke-width="${flat ? 3.2 : 3}" fill="none" stroke-linecap="round"/>`;
    g += `<g transform="translate(${f1(pk[0])} ${f1(pk[1])}) rotate(${lean})"><path d="M${-17 * (1 - 0.3 * at)} -8 H${17 * (1 - 0.3 * at)} L${15 * (1 - 0.3 * at)} 9 H${-15 * (1 - 0.3 * at)} Z" fill="${dk}" fill-opacity="${flat ? 0.1 : 0.15}" stroke="${dk}" stroke-opacity="${flat ? 0.5 : 0}" stroke-width="2.6" stroke-linejoin="round"/></g>`;
    g += `<path d="M${f1(cd[0] - 6 * (1 - 0.3 * at))} ${f1(cd[1])} l-2 28 M${f1(cd[0] + 6 * (1 - 0.3 * at))} ${f1(cd[1])} l2 28" stroke="${flat ? '#f2eadb' : '#fff'}" stroke-opacity=".9" stroke-width="2.6" stroke-linecap="round" fill="none"/>`;
    if (flat) g += `<path d="M${v(waist, sc(pH, -wsHalf * 0.5)).map(f1).join(' ')} q-6 8 -2 20 M${v(waist, sc(pH, wsHalf * 0.4)).map(f1).join(' ')} q5 7 2 18" stroke="${OUT}" stroke-opacity=".35" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
    const cuff = (a, fd) => `<ellipse cx="${f1(a.wr[0])}" cy="${f1(a.wr[1])}" rx="8" ry="4" fill="${flat ? P.hood[1] : '#fff'}" opacity="${flat ? 1 : 0.35}" stroke="${flat ? OUT : 'none'}" stroke-width="2.4" transform="rotate(${f1(Math.atan2(fd[1], fd[0]) * 180 / Math.PI - 90)} ${f1(a.wr[0])} ${f1(a.wr[1])})"/>`;
    const drawArm = (a, sp, kind, fd, side) => piece(armPieces(a, sp), `url(#${u}hh)`) + cuff(a, fd) + (kind === 'hold' ? handBack(u, a.wr, fd, kind, side) : '');
    const frontL = nearL || busy(kindL) || at <= 0.05, frontR = !nearL || busy(kindR) || at <= 0.05;
    if (frontL) g += drawArm(aL, shL, kindL, fdL, -1);
    if (frontR) g += drawArm(aR, shR, kindR, fdR, 1);
    if (spec.heldFn) g += spec.heldFn({L: aL.wr, R: aR.wr, head: hc, neck: N, hip: H});
    if (frontL) g += kindL === 'hold' ? thumbFront(u, aL.wr, fdL, -1) : handBack(u, aL.wr, fdL, kindL, -1);
    if (frontR) g += kindR === 'hold' ? thumbFront(u, aR.wr, fdR, 1) : handBack(u, aR.wr, fdR, kindR, 1);
    g += piece([capsule(v(N, sc(spine2, -4)), v(hc, sc(up(lean + chest + headTilt), -40)), 15, 14)], `url(#${u}k)`);

    // ---- head ----
    const emo = JSON.parse(JSON.stringify(spec.emo));
    if (look) {
      const dv = [look[0] - hc[0], look[1] - hc[1]], dn = unitv(dv), mag = Math.min(1, len(dv) / 140);
      emo.pupil = [emo.pupil[0], (emo.pupil[1] || 0) + dn[0] * 7 * mag, (emo.pupil[2] || 0) + dn[1] * 6 * mag];
    }
    const ay = Math.abs(yaw), sg = yaw >= 0 ? 1 : -1;
    const fx = 100 + yaw * 36, sx = 1 - 0.38 * ay;
    const tf = `translate(${f1(hc[0])} ${f1(hc[1])}) rotate(${f1(lean + chest + headTilt)}) scale(.92) translate(-100 -85)`;
    const lnH = flat ? OUT : '#eaf6ff', lwH = flat ? 3.4 : 2.6;
    // ear: on a sphere turned by phi (0 = facing the camera, 90 deg = profile) the visible ear sits at x = centre - 64 cos(phi), thin at the
    // edge and full width at the middle of the head in profile. It is drawn ON TOP of the head shape.
    const phi = ay * Math.PI / 2, cph = Math.cos(phi), earW = 5 + 7 * Math.sin(phi);
    const earAt = (x, inner) => `<ellipse cx="${f1(x)}" cy="97" rx="${f1(earW)}" ry="13" fill="url(#${u}kh)" stroke="${lnH}" stroke-width="${lwH}"/>${inner ? `<path d="M${f1(x - sg * earW * 0.1)} 90 Q${f1(x + sg * earW * 0.5)} 98 ${f1(x - sg * earW * 0.1)} 106" stroke="${lnH}" stroke-opacity=".55" stroke-width="2" fill="none" stroke-linecap="round"/>` : ''}`;
    const earNear = earAt(100 - sg * 62 * cph, ay > 0.25);                 // on top of the head: the ear on the side facing the camera
    const earFar = ay < 0.85 ? earAt(100 + sg * 62 * cph, false) : '';    // behind the head: only the part beyond the silhouette shows
    // nose: a short curved line on the face for 3/4 views, a real bump on the silhouette only in profile
    const nx = 100 + sg * (24 + 40 * ay);
    const noseLine = ay > 0.2 && ay <= 0.72 ? `<path d="M${f1(nx)} 90 Q${f1(nx + sg * 9)} 102 ${f1(nx + sg * 1)} 108" stroke="${lnH}" stroke-width="${flat ? 3.8 : 3}" fill="none" stroke-linecap="round" opacity="${f1(Math.min(1, (ay - 0.2) * 4))}"/>` : '';
    const noseBump = ay > 0.72 ? `<path d="M${f1(100 + sg * 60)} 84 Q${f1(100 + sg * (60 + 16 * (ay - 0.6) / 0.4))} 100 ${f1(100 + sg * 60)} 112" fill="url(#${u}kh)" stroke="${lnH}" stroke-width="${flat ? 5 : 3}" stroke-linejoin="round"/>` : '';
    const nose = noseLine + noseBump;
    const headShape = flat
      ? `<ellipse cx="100" cy="85" rx="64" ry="68" fill="url(#${u}kh)" stroke="${OUT}" stroke-width="7"/>`
      : headGlass(u);
    const faceInner = flat ? faceFlat(emo, u, SKC[0]) : face(emo, u);
    const faceG = `<g transform="${tf}"><clipPath id="${u}hc"><ellipse cx="100" cy="85" rx="63" ry="67"/></clipPath>${earFar}${headShape}${earNear}<g clip-path="url(#${u}hc)"><g transform="translate(${f1(fx)} 0) scale(${f1(sx)} 1) translate(-100 0)">${faceInner}</g></g>${nose}</g>`;

    const grad = (id, a, b, x1, y1, x2, y2) => `<linearGradient id="${u}${id}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
    const defsS = `<defs>${grad('h', P.hood[0], P.hood[1], 70, 120, 240, 330)}${grad('hh', P.hood[0], P.hood[1], 70, 120, 240, 330)}
      ${flat ? grad('p', P.pants[0], P.pants[1], 90, 250, 230, 420) : grad('p', '#6c7fa3', '#2b3a5c', 90, 250, 230, 420)}
      <linearGradient id="${u}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.shoe[0]}"/><stop offset="1" stop-color="${P.shoe[1]}"/></linearGradient>
      ${grad('k', SKC[0], SKC[1], 80, 100, 230, 330)}${grad('kh', SKC[0], SKC[1], 36, 17, 164, 153)}
      <filter id="${u}f" x="-30%" y="-20%" width="160%" height="150%"><feDropShadow dx="0" dy="7" stdDeviation="6" flood-color="#000" flood-opacity=".35"/></filter></defs>`;
    return {svg: `${defsS}<g opacity="${flat ? 1 : 0.92}" filter="url(#${u}f)">${g}</g>${faceG}`, hands: {L: aL.wr, R: aR.wr}, head: hc, neck: N, hip: H, feet: [lL.ank, lR.ank]};
  }
  return {figure, ik};
})();
