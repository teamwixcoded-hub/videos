import React from 'react';
import {useCurrentFrame} from 'remotion';
import {StickRig, PoseKey, ExprKey} from '../components/StickRig';
import {Held, PhoneHeld, BED} from './common';

// The two paths of the same man. Positions are fixed in the bedroom set so a character can carry
// from one scene into the next without jumping.

export const GreenMan: React.FC<{poses: PoseKey[]; exprs: ExprKey[]; holdBook?: boolean; reading?: [number, number][]; tap?: [number, number][]; x?: number; y?: number; scale?: number}> = ({
  poses, exprs, holdBook = true, reading, tap, x = BED.armchairHip[0], y = BED.armchairHip[1], scale = 0.95,
}) => (
  <StickRig
    poses={poses}
    exprs={exprs}
    reading={reading}
    tap={tap}
    x={x}
    y={y}
    scale={scale}
    seed={0.5}
    renderHeld={holdBook ? (hand) => <Held name="book-closed" hand={hand} w={96} h={76} dx={10} dy={-14} rotate={-14} /> : undefined}
  />
);

export const RedMan: React.FC<{
  poses: PoseKey[]; exprs: ExprKey[];
  phoneAt?: number; // frame from which the phone is in his hand (before it, the scene shows it on the nightstand)
  lying?: boolean;
  shake?: [number, number][];
  x?: number; y?: number; scale?: number;
}> = ({poses, exprs, phoneAt = 0, lying = false, shake, x = BED.bedEdgeHip[0], y = BED.bedEdgeHip[1], scale = 0.95}) => {
  const frame = useCurrentFrame();
  return (
    <StickRig
      poses={poses}
      exprs={exprs}
      flip={!lying}
      shake={shake}
      x={x}
      y={y}
      scale={scale}
      seed={2}
      renderHeld={frame >= phoneAt ? (hand) => <PhoneHeld hand={hand} frame={frame} counter={lying ? -90 : 0} /> : undefined}
    />
  );
};
