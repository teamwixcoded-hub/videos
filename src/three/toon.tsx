import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// Soft, rounded, physically lit look: everything has a bevel. `gloss` gives the glassy clear-coat of the characters,
// `rim` adds the dark edge ring around heads, shoes and hair.
export const OUTLINE = 0;
export type Shape =
  | {k: 's'; r: number}
  | {k: 'c'; r: number; l: number}
  | {k: 'b'; w: number; h: number; d: number; round?: number}
  | {k: 'cyl'; r: number; h: number};

type PartProps = {
  shape: Shape; color: string; pos?: [number, number, number]; rot?: [number, number, number];
  scale?: [number, number, number]; outline?: number | false; emissive?: string; rough?: number; metal?: number;
  gloss?: boolean; rim?: number; rimColor?: string;
  children?: React.ReactNode; castShadow?: boolean;
};

const inflate = (s: Shape, d: number): Shape => {
  switch (s.k) {
    case 's': return {...s, r: s.r + d};
    case 'c': return {...s, r: s.r + d};
    case 'cyl': return {k: 'cyl', r: s.r + d, h: s.h + 2 * d};
    default: return {...s, w: s.w + 2 * d, h: s.h + 2 * d, d: s.d + 2 * d};
  }
};

const Geo: React.FC<{shape: Shape}> = ({shape}) => {
  const g = useMemo(() => {
    switch (shape.k) {
      case 's': return new THREE.SphereGeometry(shape.r, 48, 32);
      case 'c': return new THREE.CapsuleGeometry(shape.r, shape.l, 10, 28);
      case 'cyl': return new THREE.CylinderGeometry(shape.r, shape.r, shape.h, 40);
      default: {
        const r = shape.round ?? Math.min(0.06, Math.min(shape.w, shape.h, shape.d) * 0.3);
        return new RoundedBoxGeometry(shape.w, shape.h, shape.d, 4, r);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(shape)]);
  return <primitive object={g} attach="geometry" />;
};

export const Part: React.FC<PartProps> = ({shape, color, pos, rot, scale, emissive, rough = 0.62, metal = 0, gloss, rim, rimColor = '#221d2b', children, castShadow = true}) => (
  <group position={pos} rotation={rot} scale={scale}>
    <mesh castShadow={castShadow} receiveShadow>
      <Geo shape={shape} />
      {gloss
        ? <meshPhysicalMaterial color={color} roughness={Math.min(rough, 0.3)} metalness={metal} clearcoat={1} clearcoatRoughness={0.06} emissive={emissive ?? '#000'} />
        : <meshStandardMaterial color={color} roughness={rough} metalness={metal} emissive={emissive ?? '#000'} />}
    </mesh>
    {rim ? <mesh><Geo shape={inflate(shape, rim)} /><meshBasicMaterial color={rimColor} side={THREE.BackSide} /></mesh> : null}
    {children}
  </group>
);

// flat, unlit colour (screens, flames, glow)
export const Glow: React.FC<{w: number; h: number; color: string; pos?: [number, number, number]; rot?: [number, number, number]}> = ({w, h, color, pos, rot}) => (
  <mesh position={pos} rotation={rot}>
    <planeGeometry args={[w, h]} />
    <meshBasicMaterial color={color} toneMapped={false} />
  </mesh>
);
