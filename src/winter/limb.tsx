import React from 'react';

// ============================================================================================
// LIMB: one smooth tapered shape for a whole arm or leg (instead of stacked segments with round joints).
// The centre line is a quadratic curve through shoulder / elbow / wrist (it passes through the elbow), the width follows a smooth curve through three widths
// plus optional bumps (biceps, calf), and the outline is smoothed with Catmull-Rom curves. A sleeve or a short leg is the same limb cut at t0..t1 with a flat end.
// ============================================================================================
export type V = [number, number];
const NAVY = '#1b1a3a';
export type Bump = {t: number; amt: number; sigma: number};
export type LimbGeom = {pts: [V, V, V]; w: [number, number, number]; bump?: Bump[]};

const centre = (g: LimbGeom, t: number): V => {
  const [a, b, e] = g.pts, c: V = [2 * b[0] - (a[0] + e[0]) / 2, 2 * b[1] - (a[1] + e[1]) / 2], u = 1 - t;
  return [u * u * a[0] + 2 * u * t * c[0] + t * t * e[0], u * u * a[1] + 2 * u * t * c[1] + t * t * e[1]];
};
const tangent = (g: LimbGeom, t: number): V => {
  const [a, b, e] = g.pts, c: V = [2 * b[0] - (a[0] + e[0]) / 2, 2 * b[1] - (a[1] + e[1]) / 2];
  const d: V = [2 * (1 - t) * (c[0] - a[0]) + 2 * t * (e[0] - c[0]), 2 * (1 - t) * (c[1] - a[1]) + 2 * t * (e[1] - c[1])], l = Math.hypot(d[0], d[1]) || 1;
  return [d[0] / l, d[1] / l];
};
const width = (g: LimbGeom, t: number): number => {
  const [w0, w1, w2] = g.w;
  let w = w0 * 2 * (t - 0.5) * (t - 1) + w1 * 4 * t * (1 - t) + w2 * 2 * t * (t - 0.5);
  for (const b of g.bump ?? []) w += b.amt * Math.exp(-(((t - b.t) / b.sigma) ** 2));
  return w;
};
export const limbAt = (pts: [V, V, V], t: number): V => centre({pts, w: [0, 0, 0]}, t);

const open = (pts: V[]): string => {   // Catmull-Rom through the points, as cubic segments (no initial M)
  let d = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C ${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  return d;
};
export const limbPath = (g: LimbGeom, t0 = 0, t1 = 1, extra = 0, flat = false): string => {
  const N = 18, L: V[] = [], R: V[] = [];
  for (let i = 0; i <= N; i++) {
    const t = t0 + (t1 - t0) * i / N, p = centre(g, t), d = tangent(g, t), r = (width(g, t) + extra) / 2, n: V = [-d[1], d[0]];
    L.push([p[0] + n[0] * r, p[1] + n[1] * r]); R.push([p[0] - n[0] * r, p[1] - n[1] * r]);
  }
  const cap = (t: number, sgn: 1 | -1): V[] => {   // a half circle round the end of the limb
    const p = centre(g, t), d = tangent(g, t), r = (width(g, t) + extra) / 2, n: V = [-d[1], d[0]], out: V[] = [];
    for (const th of [Math.PI / 4, Math.PI / 2, 3 * Math.PI / 4]) out.push([p[0] + (n[0] * Math.cos(th) * sgn + d[0] * Math.sin(th) * sgn) * r, p[1] + (n[1] * Math.cos(th) * sgn + d[1] * Math.sin(th) * sgn) * r]);
    return out;
  };
  if (flat) {
    const Rr = [...R].reverse();
    return `M ${L[0][0]},${L[0][1]}${open(L)} L ${Rr[0][0]},${Rr[0][1]}${open(Rr)} Z`;
  }
  const start = cap(t0, -1);   // from the -normal side round the back to the +normal side
  const pts: V[] = [...L, ...cap(t1, 1), ...[...R].reverse(), ...start];
  const n = pts.length;
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += ` C ${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  return d + ' Z';
};

export const Limb: React.FC<LimbGeom & {fill: string; t0?: number; t1?: number; extra?: number; flat?: boolean; stroke?: number; opacity?: number}> = ({fill, t0 = 0, t1 = 1, extra = 0, flat = false, stroke = 9, opacity, ...g}) => (
  <path d={limbPath(g, t0, t1, extra, flat)} fill={fill} stroke={NAVY} strokeWidth={stroke} strokeLinejoin="round" opacity={opacity} />
);

// a closed smooth outline through the points (Catmull-Rom as cubic segments)
export const smoothClosed = (pts: V[]): string => {
  const n = pts.length;
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    d += ` C ${p1[0] + (p2[0] - p0[0]) / 6},${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6},${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]},${p2[1]}`;
  }
  return d + ' Z';
};
