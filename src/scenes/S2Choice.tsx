import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {Grade} from '../components/Grade';
import {KText} from '../components/KText';
import {Camera, Sticker, focus} from '../vfx/Motion';
import {Flash, Grain, Vignette} from '../vfx/Atmosphere';
import {Dim, Glow, PropImg, Room, BED} from './common';
import {RedMan} from './Characters';
import {HEAD_FONT} from '../fonts';

const GRAB = 62;

// Dopamine meter: a bar that jumps up each time something good happens.
const Meter: React.FC = () => {
  const frame = useCurrentFrame();
  const fill = interpolate(frame, [GRAB + 20, GRAB + 40, GRAB + 90, GRAB + 110, GRAB + 150, GRAB + 165], [0, 0.45, 0.45, 0.78, 0.78, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const o = interpolate(frame, [GRAB + 10, GRAB + 24], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 90, top: 250, opacity: o}}>
      <div style={{fontFamily: HEAD_FONT, fontSize: 44, color: '#fff', marginBottom: 10, textShadow: '0 3px 0 #000'}}>DOPAMINE</div>
      <div style={{width: 120, height: 420, border: '8px solid #1a1210', borderRadius: 28, background: 'rgba(0,0,0,0.45)', position: 'relative', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${fill * 100}%`, background: 'linear-gradient(0deg,#ff8a3d,#ffd23f)'}} />
      </div>
    </div>
  );
};

// ~8 s. The camera is already close on Red (carrying over from the hook), he reaches back, grabs the phone and lights up.
export const S2Choice: React.FC = () => {
  const frame = useCurrentFrame();
  const flicker = 0.8 + random(`g-${frame}`) * 0.2;
  const faceGlow = interpolate(frame, [GRAB + 25, GRAB + 55], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * flicker;
  const holding = frame >= GRAB + 8;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera keys={[focus(0, 1500, 640, 1.9), focus(70, 1360, 600, 1.6), focus(240, 1280, 520, 1.35)]}>
        <Grade from="red">
          <Room name="BEDROOM" />
          <Dim opacity={0.5} />
          {!holding && <PropImg name="phone-lit" x={BED.nightstandPhone[0]} y={BED.nightstandPhone[1] - 20} w={46} rotate={-4} />}
          <Glow x={BED.nightstandPhone[0]} y={BED.nightstandPhone[1]} r={320} color="rgba(120,170,255,0.4)" opacity={holding ? 0 : 1} />
          <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
            <RedMan
              poses={[{at: 0, pose: 'slumped'}, {at: 30, pose: 'reachBack', damping: 12}, {at: GRAB + 14, pose: 'phoneHold', damping: 13}]}
              exprs={[[0, 'tired'], [GRAB, 'surprised'], [GRAB + 34, 'relieved'], [GRAB + 90, 'phone-laugh'], [GRAB + 150, 'smile']]}
              phoneAt={GRAB + 8}
              shake={[[GRAB + 90, GRAB + 150]]}
            />
          </svg>
          <Glow x={1195} y={430} r={330} color="rgba(130,185,255,0.9)" opacity={faceGlow * 0.5} />
          <Sticker name="heart" x={1360} y={330} size={90} at={GRAB + 40} mode="float" life={70} />
          <Sticker name="sparkle" x={1070} y={330} size={80} at={GRAB + 55} mode="pop" />
          <Sticker name="heart" x={1250} y={290} size={100} at={GRAB + 100} mode="float" life={70} />
          <Sticker name="sparkle" x={1400} y={440} size={70} at={GRAB + 112} mode="pop" />
          <Sticker name="heart" x={1120} y={300} size={80} at={GRAB + 150} mode="float" life={70} />
        </Grade>
      </Camera>
      <Flash at={GRAB + 8} color="#9cc4ff" peak={0.45} duration={10} />
      <Meter />
      <KText text="IT FEELS GOOD." at={GRAB + 24} until={200} y={900} size={110} highlight={['good']} accent="#7fc2ff" />
      <KText text="INSTANTLY." at={GRAB + 70} until={225} y={1015} size={80} color="#cfe3ff" />
      <Vignette strength={0.6} />
      <Grain />
    </AbsoluteFill>
  );
};
