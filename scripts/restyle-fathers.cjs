// Re-skins the Two Fathers sets and props to the Same Man look: deep cinematic blues and purples, warm lamplit ambers, thin dark-navy outlines.
// One-off (run once). Colours are converted in HSL: lightness down, low-saturation greys pulled toward blue-violet, saturated warms kept.
const fs = require('fs');
const toHsl = (h) => { const n = parseInt(h.slice(1), 16), r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; let hh = 0, s = 0;
  if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn); hh = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; hh *= 60; } return [hh, s, l]; };
const hue = (p, q, t) => { if (t < 0) t += 1; if (t > 1) t -= 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
const toHex = (h, s, l) => { h /= 360; const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q, f = (t) => Math.round(Math.min(1, Math.max(0, hue(p, q, t))) * 255).toString(16).padStart(2, '0'); return s === 0 ? '#' + f(0) .repeat(0) + [l, l, l].map((v) => Math.round(v * 255).toString(16).padStart(2, '0')).join('') : '#' + f(h + 1 / 3) + f(h) + f(h - 1 / 3); };
const moody = (hx) => {
  if (hx.toLowerCase() === '#3a2a26') return '#1d1a2e';
  let [h, s, l] = toHsl(hx);
  l = l < 0.9 ? l * 0.6 : l * 0.82;
  if (s < 0.32) { h = 228; s = Math.max(s, 0.28); }
  return toHex(h, s, l);
};
for (const f of ['src/fathers/sets.tsx', 'src/fathers/props.tsx']) {
  let s = fs.readFileSync(f, 'utf8');
  s = s.replace(/#[0-9a-fA-F]{6}\b/g, (m) => moody(m));
  s = s.replace(/strokeWidth=\{(\d+(?:\.\d+)?)\}/g, (m, w) => `strokeWidth={${Math.max(1.6, +(+w * 0.6).toFixed(1))}}`);
  fs.writeFileSync(f, s);
}
let t = fs.readFileSync('src/fathers/theme.ts', 'utf8');
t = t.replace("export const INK = '#3a2a26';          // every outline is warm dark brown, never black", "export const INK = '#1d1a2e';          // the Same Man ink: dark navy outlines");
fs.writeFileSync('src/fathers/theme.ts', t);
console.log('restyled');
