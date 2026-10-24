// @ts-nocheck
// Seat scenery drawn in FIGURE space so it lines up exactly with a sitting figure (hip at about [150, 322]).
// `back` is drawn behind the figure, `front` in front of it (the near armrest covers the thigh, the knee comes out past it).
const RIMC = '#33190f';      // dark outline, like the original video's flat cartoon look
const rr = (x, y, w, h, rx, fill) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${RIMC}" stroke="${RIMC}" stroke-width="6"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;

export const ARMCHAIR_SIDE = {
  back: rr(34, 190, 92, 172, 38, '#c8693a') + rr(40, 336, 252, 52, 20, '#d9a24a') + rr(50, 386, 24, 30, 6, '#6b4630') + rr(270, 386, 24, 30, 6, '#6b4630')
    + `<path d="M60 214 Q80 206 104 214" stroke="#fff" stroke-opacity=".35" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  front: rr(56, 300, 96, 86, 26, '#b85a2e') + rr(48, 288, 124, 24, 12, '#a04e26'),
};
export const BED_EDGE = {
  back: '', front: '',
};
