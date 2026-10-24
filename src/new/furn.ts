// @ts-nocheck
// Vector furniture in the same glass style as the props. Each piece has a viewBox size and an SVG string.
// Pieces with a "Front" twin (bed blanket, armchair arms) are drawn AFTER the character so they overlap the legs.
import {U, one, sk, line, hl, PROP_DEFS, setRim} from '../lab/props';

const RIMC = '#eaf6ff';
const R = (x, y, w, h, rx, fill) => one('rect', `x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"`, fill);

export const FURN = {
  // ---------------- bed (side-on, headboard on the left) ----------------
  bed: {w: 560, h: 230, svg: () =>
    R(24, 180, 26, 44, 8, 'brown') + R(504, 180, 26, 44, 8, 'brown')
    + R(14, 40, 44, 170, 16, 'brown') + R(36, 112, 500, 74, 16, 'brown')
    + R(56, 92, 482, 54, 18, 'paper') + one('ellipse', 'cx="112" cy="84" rx="52" ry="24"', 'paper')
    + line('M70 70 Q112 60 156 72', '#a9b2c3', 3, .6)},
  bedFront: {w: 560, h: 230, svg: () =>
    one('path', 'd="M176 92 Q176 70 204 70 H508 Q540 70 540 100 V150 Q540 172 512 172 H206 Q176 172 176 146 Z"', 'indigo')
    + line('M196 100 Q360 84 524 104 M196 128 Q360 114 524 132', '#fff', 3, .35) + hl('M206 82 Q330 70 470 78', .35)},
  // ---------------- armchair (front-on) ----------------
  armchair: {w: 330, h: 320, svg: () =>
    R(48, 262, 30, 50, 8, 'brown') + R(252, 262, 30, 50, 8, 'brown')
    + R(62, 28, 206, 196, 48, 'terra') + R(50, 178, 230, 78, 26, 'orange')
    + line('M90 60 Q165 44 240 60', '#fff', 3, .35) + hl('M82 52 Q110 40 150 40', .4)},
  armchairFront: {w: 330, h: 320, svg: () =>
    R(8, 120, 62, 150, 28, 'terra') + R(260, 120, 62, 150, 28, 'terra') + hl('M22 140 Q22 180 24 220', .35)},
  // ---------------- nightstand ----------------
  nightstand: {w: 190, h: 230, svg: () =>
    R(24, 200, 20, 26, 6, 'brown') + R(146, 200, 20, 26, 6, 'brown')
    + R(14, 62, 162, 148, 14, 'brown') + R(4, 44, 182, 28, 12, 'orange')
    + line('M28 134 H162', '#5a3a1e', 3, .6) + one('circle', 'cx="95" cy="104" r="7"', 'gold') + one('circle', 'cx="95" cy="168" r="7"', 'gold')},
  // ---------------- desk with laptop ----------------
  desk: {w: 560, h: 300, svg: () =>
    R(40, 120, 24, 170, 8, 'brown') + R(496, 120, 24, 170, 8, 'brown') + R(8, 110, 544, 26, 12, 'orange')
    + one('path', 'd="M180 108 L204 36 H376 L400 108 Z"', 'slate') + `<path d="M192 100 L212 44 H368 L388 100 Z" fill="url(#g-screen)" opacity=".92"/>`
    + R(160, 100, 260, 12, 6, 'grey') + hl('M214 52 H330', .5)
    + one('circle', 'cx="470" cy="86" r="0"', 'grey')},
  // ---------------- sofa (front-on) ----------------
  sofa: {w: 520, h: 250, svg: () =>
    R(40, 214, 30, 30, 8, 'brown') + R(450, 214, 30, 30, 8, 'brown')
    + R(30, 40, 460, 150, 44, 'teal') + R(20, 120, 80, 100, 30, 'green') + R(420, 120, 80, 100, 30, 'green')
    + R(90, 128, 340, 86, 26, 'teal') + line('M260 132 V212', '#fff', 3, .35) + hl('M60 60 Q200 44 360 56', .35)},
  // ---------------- kitchen table ----------------
  table: {w: 460, h: 260, svg: () =>
    R(60, 120, 20, 134, 8, 'brown') + R(380, 120, 20, 134, 8, 'brown') + R(18, 100, 424, 30, 14, 'orange') + hl('M44 110 H400', .4)},
};

export function furnSvg(name, flat = false) {
  const f = FURN[name];
  setRim(flat ? '#33190f' : '#eaf6ff');       // flat look = dark outline like the original video
  const inner = f.svg();
  setRim('#eaf6ff');
  return `<defs>${PROP_DEFS}</defs><g opacity=".96">${inner}</g>`;
}
