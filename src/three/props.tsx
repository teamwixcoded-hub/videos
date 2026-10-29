import React, {useEffect, useMemo} from 'react';
import * as THREE from 'three';
import {Part, Glow} from './toon';
import {Hold, faceQuat} from './Man';

const ease = (x: number) => x * x * (3 - 2 * x);

// ---- Phone: back + glowing screen toward the face, a feed that is swiped every ~0.9 s ----
const CARDS = ['#ff4f6d', '#ffd23f', '#3fd0ff', '#9b6bff', '#42e08c'];
export const Phone: React.FC<{hold: Hold; t: number}> = ({hold, t}) => {
  const k = Math.floor(t / 0.95), fr = (t / 0.95) % 1;
  const pos = (k + ease(Math.min(1, fr * 2.2))) * 0.07;
  const H = 0.28;
  return (
    <group position={hold.pos} quaternion={faceQuat(hold.normal)}>
      <Part shape={{k: 'b', w: 0.082, h: 0.168, d: 0.012}} color="#1b1d24" outline={0.008} />
      <Glow w={0.07} h={0.15} color="#0b1a33" pos={[0, 0, 0.0065]} />
      {CARDS.map((c, i) => {
        const y = ((((i * 0.07 - pos) % H) + H) % H) - H / 2;
        const h = 0.062 * THREE.MathUtils.clamp((0.075 - Math.abs(y)) / 0.02, 0, 1);
        return h > 0.002 ? <Glow key={i} w={0.062} h={h} color={c} pos={[0, y, 0.007]} /> : null;
      })}
    </group>
  );
};

// ---- Book: we see the back cover; the face side has the pages and a page that turns now and then ----
export const Book: React.FC<{hold: Hold; flipAt: number[]; t: number; shut?: boolean}> = ({hold, flipAt, t, shut}) => {
  let flip = 0;
  for (const f of flipAt) if (t >= f && t < f + 0.9) flip = ease((t - f) / 0.9);
  if (shut) return (
    <group position={hold.pos} quaternion={faceQuat(hold.normal)}>
      <Part shape={{k: 'b', w: 0.19, h: 0.26, d: 0.05}} color="#2f6f5e" />
      <Part shape={{k: 'b', w: 0.17, h: 0.24, d: 0.03, round: 0.01}} color="#f1e8d0" pos={[0.012, 0, 0.012]} />
    </group>
  );
  return (
    <group position={hold.pos} quaternion={faceQuat(hold.normal)}>
      <Part shape={{k: 'b', w: 0.36, h: 0.26, d: 0.03}} color="#2f6f5e" outline={0.01} />
      <Part shape={{k: 'b', w: 0.012, h: 0.265, d: 0.034}} color="#1f4d41" pos={[0, 0, 0]} outline={false} />
      <Part shape={{k: 'b', w: 0.33, h: 0.235, d: 0.012}} color="#f1e8d0" pos={[0, 0, 0.02]} outline={0.005} />
      <group position={[0, 0, 0.03]} rotation={[0, -flip * Math.PI, 0]}>
        <Part shape={{k: 'b', w: 0.16, h: 0.225, d: 0.004}} color="#f7f0dc" pos={[0.085, 0, 0]} outline={0.003} />
      </group>
    </group>
  );
};

// ---- Alarm clock with a changeable time ----
export const ClockFace: React.FC<{text: string}> = ({text}) => {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 128;
    const g = c.getContext('2d')!;
    g.fillStyle = '#05120a'; g.fillRect(0, 0, 256, 128);
    g.fillStyle = '#ff3b30'; g.font = '700 96px monospace'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.shadowColor = '#ff3b30'; g.shadowBlur = 18;
    g.fillText(text, 128, 70);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [text]);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh position={[0, 0, 0.062]}>
      <planeGeometry args={[0.2, 0.1]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
};

// little reward sparkles that burst above the phone on every pop
export const Pops: React.FC<{at: number[]; t: number; pos: [number, number, number]}> = ({at, t, pos}) => {
  const COL = ['#ffd23f', '#ff4f6d', '#3fd0ff', '#42e08c', '#ffffff', '#ff9a3f'];
  return (
    <group position={pos}>
      {at.map((a, i) => {
        const p = (t - a) / 0.7;
        if (p < 0 || p > 1) return null;
        return COL.map((c, j) => {
          const ang = (j / COL.length) * Math.PI * 2 + i, r = 0.04 + 0.16 * (1 - (1 - p) * (1 - p));
          return (
            <mesh key={i + '-' + j} position={[Math.cos(ang) * r, Math.sin(ang) * r + 0.05 * p, 0]} scale={(1 - p) * 0.9 + 0.1}>
              <sphereGeometry args={[0.014, 10, 8]} /><meshBasicMaterial color={c} toneMapped={false} />
            </mesh>
          );
        });
      })}
    </group>
  );
};
