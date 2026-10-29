import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Part} from './toon';

// ============================================================================================
// THE HARVEST: a window-box planter on the sill between the two lives. Left half = the reader's nights (gold seed -> green shoot ->
// flowering plant with glowing fruit). Right half = the scroller's nights (grey seed -> pale weeds -> dry thorny vines that creep over the
// sill, up the wall and around the bed). `bloom` and `thorn` run 0..1.
// ============================================================================================
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
type P3 = [number, number, number];

const Vine: React.FC<{pts: P3[]; g: number; r?: number; color?: string; seed?: number}> = ({pts, g, r = 0.02, color = '#3e3550', seed = 0}) => {
  const {geo, curve, total} = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
    const geo = new THREE.TubeGeometry(curve, 80, r, 6, false);
    return {geo, curve, total: geo.index!.count};
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(pts), r]);
  geo.setDrawRange(0, Math.floor(total * clamp01(g)));
  const thorns = useMemo(() => Array.from({length: 22}, (_, i) => {
    const u = (i + 0.5) / 22, p = curve.getPoint(u), tan = curve.getTangent(u);
    const a = Math.sin((i + seed) * 12.9898) * 43758.5453, rnd = a - Math.floor(a);
    const out = new THREE.Vector3(Math.cos(rnd * 6.28), Math.sin(rnd * 6.28), 0.3).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), out.cross(tan).add(out).normalize());
    return {u, p, q};
  }), [curve, seed]);
  if (g <= 0.001) return null;
  return (
    <group>
      <mesh geometry={geo} castShadow><meshStandardMaterial color={color} roughness={0.8} /></mesh>
      {thorns.filter((th) => th.u < g).map((th, i) => (
        <mesh key={i} position={th.p} quaternion={th.q} castShadow>
          <coneGeometry args={[r * 0.55, r * 3.2, 5]} /><meshStandardMaterial color="#2b2335" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
};

const VINES: {pts: P3[]; r: number; at: number}[] = [
  {pts: [[-0.1, 1.28, -3.3], [0.5, 1.5, -3.3], [1.1, 1.3, -3.3], [1.7, 1.95, -3.35], [2.5, 2.6, -3.3], [3.4, 2.95, -3.3]], r: 0.022, at: 0},
  {pts: [[0.1, 1.2, -3.2], [0.6, 1.0, -3.0], [1.2, 0.72, -3.1], [1.5, 0.95, -2.6], [1.95, 1.3, -3.0], [2.4, 1.65, -3.3]], r: 0.02, at: 0.08},
  {pts: [[-0.05, 1.3, -3.3], [-0.25, 2.0, -3.32], [0.2, 2.6, -3.3], [0.9, 3.0, -3.3]], r: 0.02, at: 0.16},
  {pts: [[2.75, 0.42, -3.2], [2.9, 0.5, -2.5], [2.95, 0.45, -1.8], [2.88, 0.58, -1.0]], r: 0.022, at: 0.28},
  {pts: [[0.1, 1.25, -3.2], [0.5, 1.2, -2.7], [0.9, 1.0, -2.3], [1.2, 0.75, -2.0]], r: 0.018, at: 0.38},
  // hangs in the foreground so the camera pushes past it
  {pts: [[0.9, 3.2, -1.2], [0.8, 2.6, -1.3], [0.95, 2.0, -1.2], [0.85, 1.55, -1.25]], r: 0.02, at: 0.5},
];

const FRUIT: P3[] = [[-0.45, 0.42, 0.05], [-0.2, 0.5, -0.04], [-0.62, 0.34, 0.03], [-0.34, 0.62, 0.05], [-0.12, 0.34, 0.06], [-0.52, 0.55, -0.03]];

export const Planter: React.FC<{pos?: P3; bloom: number; thorn: number; t: number; seedR?: number; seedS?: number}> = ({pos = [-0.5, 1.2, -3.2], bloom, thorn, t, seedR, seedS}) => {
  const weed = clamp01(thorn * 2.2), thornVine = clamp01((thorn - 0.12) / 0.88);
  // a seed falling into the soil: gold on the reader's half, grey on the scroller's
  const seed = (at: number | undefined, x: number, c: string) => {
    if (at === undefined) return null;
    const p = (t - at) / 0.7;
    if (p < 0 || p > 1) return null;
    return <mesh position={[x, 0.09 + (1 - p * p) * 0.55, 0.02]}><sphereGeometry args={[0.025, 12, 10]} /><meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.6} /></mesh>;
  };
  return (
    <group>
      <group position={pos}>
        <Part shape={{k: 'b', w: 1.3, h: 0.2, d: 0.32, round: 0.04}} color="#6b4a30" />
        <Part shape={{k: 'b', w: 1.2, h: 0.03, d: 0.26, round: 0.01}} color="#2a1d16" pos={[0, 0.1, 0]} castShadow={false} />
        <group position={[0, 0.1, 0]}>
          {/* reader: gold seed, shoot, flowering plant with glowing fruit */}
          {bloom > 0.001 && bloom < 0.12 && <mesh position={[-0.3, 0.02, 0.02]}><sphereGeometry args={[0.02, 10, 8]} /><meshStandardMaterial color="#ffd34e" emissive="#ffc400" emissiveIntensity={0.7} /></mesh>}
          {[0, 1, 2].map((i) => {
            const h = clamp01((bloom - 0.08) / 0.92) * (0.5 + 0.12 * i);
            if (h < 0.02) return null;
            const x = -0.45 + i * 0.16, lean = (i - 1) * 0.18;
            return (
              <group key={i} position={[x, 0, 0.0]} rotation={[0, 0, lean]}>
                <Part shape={{k: 'c', r: 0.014, l: h}} color="#4aa35a" pos={[0, h / 2, 0]} castShadow={false} />
                {[0, 1, 2, 3].map((k) => (h > 0.1 + k * 0.1 ? (
                  <Part key={k} shape={{k: 's', r: 0.05}} color="#66c477" gloss rough={0.4} pos={[(k % 2 ? 1 : -1) * 0.05, 0.08 + k * (h / 4.5), 0]} rot={[0, 0, (k % 2 ? -1 : 1) * 0.7]} scale={[1.6, 0.35, 0.8]} castShadow={false} />
                ) : null))}
              </group>
            );
          })}
          {FRUIT.map((f, i) => (bloom > 0.55 + i * 0.07 ? (
            <mesh key={i} position={[f[0] + 0.05, f[1] * Math.min(1, bloom), f[2]]}>
              <sphereGeometry args={[0.032, 14, 12]} /><meshStandardMaterial color="#ffcf5a" emissive="#ffb300" emissiveIntensity={1.4} />
            </mesh>
          ) : null))}
          {/* scroller: grey seed, pale weeds, then the vines take over */}
          {thorn > 0.001 && thorn < 0.08 && <mesh position={[0.3, 0.02, 0.02]}><sphereGeometry args={[0.02, 10, 8]} /><meshStandardMaterial color="#8d8f98" /></mesh>}
          {[0, 1, 2, 3, 4].map((i) => (weed > 0.05 ? (
            <Part key={i} shape={{k: 'c', r: 0.009, l: 0.2 * weed * (0.6 + 0.15 * i)}} color="#c9cdb4" pos={[0.12 + i * 0.1, 0.1 * weed, 0]} rot={[0, 0, (i - 2) * 0.3]} castShadow={false} />
          ) : null))}
          {seed(seedR, -0.3, '#ffd34e')}
          {seed(seedS, 0.3, '#9a9ca6')}
        </group>
      </group>
      {VINES.map((v, i) => <Vine key={i} pts={v.pts} r={v.r} g={clamp01((thornVine - v.at) / (1 - v.at))} seed={i} />)}
    </group>
  );
};

// a pile of finished books beside the reader's chair
const BOOK_COLS = ['#a33a3a', '#3a6aa3', '#c9a13a', '#4a8a5a', '#7a4a9a', '#d06a3a', '#3aa0a0'];
export const BookPile: React.FC<{count: number; pos?: P3}> = ({count, pos = [-3.2, 0, -0.9]}) => (
  <group position={pos}>
    {Array.from({length: count}, (_, i) => {
      const stack = Math.floor(i / 5), n = i % 5;
      return <Part key={i} shape={{k: 'b', w: 0.3 - (i % 3) * 0.02, h: 0.05, d: 0.22, round: 0.012}} color={BOOK_COLS[i % BOOK_COLS.length]} pos={[stack * 0.38 + (i % 2) * 0.012, 0.027 + n * 0.052, (stack % 2) * 0.05]} rot={[0, (i % 4 - 1.5) * 0.12, 0]} />;
    })}
  </group>
);
