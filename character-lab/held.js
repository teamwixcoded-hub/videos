// Held objects, drawn the way they really look from the SIDE of the person holding them (figure space, person faces right).
// A book being read shows its BACK cover and page edge to the camera (the pages face the reader).
// A phone being used shows its back and glowing edge (the screen faces the person's face); a thumb swipes on its edge.
const Held = (() => {
  const OUT = '#33190f';
  const f1 = (x) => x.toFixed(1);
  // book: (cx, cy) = centre; tilt: degrees, negative = top leans back toward the reader
  function book(cx, cy, o = {}) {
    const tilt = o.tilt === undefined ? -16 : o.tilt, cover = o.cover || '#b5473a', k = o.scale || 1;
    return `<g transform="translate(${f1(cx)} ${f1(cy)}) rotate(${tilt}) scale(${k})">
      <path d="M-13 -34 L19 -29 L19 33 L-13 38 Z" fill="${cover}" stroke="${OUT}" stroke-width="3.6" stroke-linejoin="round"/>
      <path d="M-13 -34 L-21 -31 L-21 36 L-13 38 Z" fill="#f2eadb" stroke="${OUT}" stroke-width="3.2" stroke-linejoin="round"/>
      <path d="M-18 -26 L-13 -28 M-18 -16 L-13 -18 M-18 -6 L-13 -8 M-18 4 L-13 2 M-18 14 L-13 12 M-18 24 L-13 22" stroke="#b9ad94" stroke-width="1.6"/>
      <path d="M-13 -34 L-13 38" stroke="${OUT}" stroke-opacity=".5" stroke-width="2"/>
      <rect x="-1" y="-18" width="14" height="5" rx="2.5" fill="#f2c36a" opacity=".9" transform="skewY(5)"/>
      <rect x="1" y="-8" width="10" height="3.5" rx="1.8" fill="#f2c36a" opacity=".6" transform="skewY(5)"/>
    </g>`;
  }
  // phone: back + glowing screen edge toward the face; `scroll` is a number that increases over time (thumb swipes)
  function phone(cx, cy, o = {}) {
    const tilt = o.tilt === undefined ? -18 : o.tilt, scroll = o.scroll || 0, k = o.scale || 1, colr = o.glow || '#6fd6ff';
    const ph = scroll % 1, swipe = ph < 0.55 ? ph / 0.55 : 1, e = 1 - Math.pow(1 - swipe, 2);
    const ty = 12 - 26 * e, top = ph < 0.62 ? 1 : 0;
    return `<g transform="translate(${f1(cx)} ${f1(cy)}) rotate(${tilt}) scale(${k})">
      <ellipse cx="-17" cy="0" rx="22" ry="40" fill="${colr}" opacity=".22"/>
      <rect x="-11" y="-34" width="25" height="68" rx="8" fill="#5b6478" stroke="${OUT}" stroke-width="3.6"/>
      <path d="M-11 -26 L-11 26" stroke="${colr}" stroke-width="4" stroke-linecap="round" opacity=".98"/>
      <circle cx="5" cy="-20" r="4" fill="#12151d" stroke="${OUT}" stroke-width="1.8"/><circle cx="5" cy="-20" r="1.6" fill="#3b4a6a"/>
      <rect x="-1" y="2" width="8" height="12" rx="3" fill="#3a4152" opacity=".7"/>
      <g opacity="${top}"><ellipse cx="-11" cy="${f1(ty)}" rx="4.6" ry="7.4" fill="url(#${o.skin || 'k'})" stroke="${OUT}" stroke-width="2.4" transform="rotate(-12 -11 ${f1(ty)})"/></g>
    </g>`;
  }
  return {book, phone};
})();
