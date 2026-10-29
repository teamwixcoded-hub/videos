// @ts-nocheck
// Generated from character-lab/held.js: a book that is read and a phone that is scrolled, as seen from the side.
// Held objects, drawn the way they really look from the SIDE of the person holding them (figure space, person faces right).
// A book being read shows its BACK cover and page edge to the camera (the pages face the reader).
// A phone being used shows its back and glowing edge (the screen faces the person's face); a thumb swipes on its edge.
const Held = (() => {
  const OUT = '#33190f';
  const f1 = (x) => x.toFixed(1);
  // book: open amount o.open 0..1 (0 = closed on the lap, the cover swings over the spine), o.flip 0..1 = a page turning
  function book(cx, cy, o = {}) {
    const tilt = o.tilt === undefined ? -10 : o.tilt, cover = o.cover || '#b5473a', k = o.scale || 1.25;
    const a = o.open === undefined ? 1 : Math.max(0, Math.min(1, o.open)), fl = o.flip || 0;
    const cs = Math.cos(Math.PI * (1 - a));                       // -1 closed (flap over the left half) ... 1 open
    const rx = (w) => -2 + w * cs;                                // x of the swinging flap's outer edge
    const lift = (1 - Math.abs(cs)) * 14;                         // the flap rises while it swings
    let L = '', Rr = '';
    for (let i = 0; i < 6; i++) { const y = -14 + i * 8; L += `M-34 ${y - 4 + i * 0.8} L-8 ${y + 2}`; Rr += `M6 ${y + 2} L30 ${y - 6 - i * 0.6}`; }
    const base = `<path d="M-42 -27 L-2 -17 L-2 41 L-42 31 Z" fill="${cover}" stroke="${OUT}" stroke-width="3.4" stroke-linejoin="round"/>`;
    const left = a > 0.5 ? `<path d="M-37 -26 L-2 -16 L-2 36 L-37 27 Z" fill="#fbf5e6" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/><path d="${L}" stroke="#9c917a" stroke-width="1.7" stroke-linecap="round"/>` : '';
    // right half: the swinging flap. shows cover colour when it is on the back side, pages when it is open
    const X = rx(40), Xi = rx(35);
    const flap = a > 0.5
      ? `<path d="M-2 -16 L${f1(Xi)} ${f1(-16 - 14 * cs - lift)} L${f1(Xi)} ${f1(36 - 12 * cs - lift * 0.4)} L-2 36 Z" fill="#f2ead7" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/>${cs > 0.6 ? `<path d="${Rr}" stroke="#9c917a" stroke-width="1.7" stroke-linecap="round"/>` : ''}`
      : `<path d="M-2 -17 L${f1(X)} ${f1(-17 - 16 * cs - lift)} L${f1(X)} ${f1(41 - 10 * cs - lift * 0.4)} L-2 41 Z" fill="${cover}" stroke="${OUT}" stroke-width="3.2" stroke-linejoin="round"/>`;
    const closedTitle = a < 0.2 ? `<rect x="-34" y="-8" width="24" height="5" rx="2.5" fill="#f2c36a" opacity=".9" transform="skewY(14)"/><rect x="-30" y="2" width="16" height="3.5" rx="1.8" fill="#f2c36a" opacity=".6" transform="skewY(14)"/>` : '';
    // a turning page: leaves the right side, swings over the spine to the left
    let turn = '';
    if (a > 0.9 && fl > 0 && fl < 1) { const c = Math.cos(Math.PI * fl), px = -2 + 34 * c, up = Math.sin(Math.PI * fl) * 16; turn = `<path d="M-2 -16 L${f1(px)} ${f1(-28 - up)} L${f1(px)} ${f1(22 - up * 0.6)} L-2 36 Z" fill="#fffaf0" stroke="${OUT}" stroke-width="2.4" stroke-linejoin="round"/>`; }
    return `<g transform="translate(${f1(cx)} ${f1(cy)}) rotate(${tilt}) scale(${k}) translate(${f1(20 * (1 - a))} 0)">${base}${left}${flap}${closedTitle}${turn}<path d="M-2 -17 L-2 41" stroke="${OUT}" stroke-opacity=".5" stroke-width="2.2"/></g>`;
  }
  // phone: held in front of the chest, screen angled toward the face and still readable from the side; thumb swipes on it
  function phone(cx, cy, o = {}) {
    const tilt = o.tilt === undefined ? -14 : o.tilt, scroll = o.scroll || 0, k = o.scale || 1.3, colr = o.glow || '#6fd6ff';
    const ph = scroll % 1, swipe = ph < 0.55 ? ph / 0.55 : 1, e = 1 - Math.pow(1 - swipe, 2);
    const ty = 16 - 30 * e;
    let ui = '';
    for (let i = 0; i < 4; i++) { const y = -26 + i * 15 - e * 8; ui += `<rect x="-9" y="${f1(y)}" width="18" height="10" rx="2.5" fill="#ffffff" opacity=".55"/>`; }
    return `<g transform="translate(${f1(cx)} ${f1(cy)}) rotate(${tilt}) scale(${k})">
      <ellipse cx="0" cy="0" rx="34" ry="46" fill="${colr}" opacity=".2"/>
      <path d="M-15 -36 L13 -32 L13 34 L-15 38 Z" fill="#2b3142" stroke="${OUT}" stroke-width="3.4" stroke-linejoin="round"/>
      <path d="M-11 -31 L9 -28 L9 29 L-11 32 Z" fill="${colr}" opacity=".9"/>
      <clipPath id="pc${o.skin || 'k'}"><path d="M-11 -31 L9 -28 L9 29 L-11 32 Z"/></clipPath>
      <g clip-path="url(#pc${o.skin || 'k'})">${ui}</g>
      <ellipse cx="-2" cy="${f1(ty)}" rx="5.4" ry="8.6" fill="url(#${o.skin || 'k'})" stroke="${OUT}" stroke-width="2.4" transform="rotate(-18 -2 ${f1(ty)})"/>
    </g>`;
  }
  return {book, phone};
})();

export {Held};
