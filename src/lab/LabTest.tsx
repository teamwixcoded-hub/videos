import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {EMO, POSES, figure} from './character';
import {propSvg} from './props';
import v1 from './lipsync/lab-v1.json';
import v2 from './lipsync/lab-v2.json';
import v3 from './lipsync/lab-v3.json';
import v4 from './lipsync/lab-v4.json';

// Voice lines: each starts on its story beat. `data` is the lip-sync analysis of that audio file.
const LINES = [
  {start: 8, data: v1, file: 'audio/lab-v1.wav'},
  {start: 92, data: v2, file: 'audio/lab-v2.wav'},
  {start: 158, data: v3, file: 'audio/lab-v3.wav'},
  {start: 214, data: v4, file: 'audio/lab-v4.wav'},
];
const AUDIO_COMP = 1;
const MOUTH_FOR: Record<string, string> = {s: 'ts', m: 'tm', w: 'tw', o: 'to', e: 'te'};
// What is being said right now (mouth shape code + loudness), or null in the gaps.
const speechAt = (frame: number) => {
  for (const l of LINES) {
    const i = frame - l.start;
    if (i >= 0 && i < l.data.frames.length) return {code: l.data.frames[i], energy: l.data.energy[i] ?? 0};
  }
  return null;
};

export const LAB_FRAMES = 300;

type Pose = {lean: number; tilt: number; armL: number[]; armR: number[]; legL: number[]; legR: number[]};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const mixArr = (a: number[], b: number[], t: number) => a.map((v, i) => mix(v, b[i], t));
const mixPose = (a: Pose, b: Pose, t: number): Pose => ({
  lean: mix(a.lean, b.lean, t), tilt: mix(a.tilt, b.tilt, t),
  armL: mixArr(a.armL, b.armL, t), armR: mixArr(a.armR, b.armR, t),
  legL: mixArr(a.legL, b.legL, t), legR: mixArr(a.legR, b.legR, t),
});

// Keyframes: the story beat, the pose and the face for each moment.
const KEYS = [
  {f: 0, pose: 'slumped', emo: 'sad'},
  {f: 85, pose: 'idle', emo: 'worried'},
  {f: 125, pose: 'pointing', emo: 'determined'},
  {f: 205, pose: 'triumphant', emo: 'laughing'},
];
const BG = [
  {f: 0, src: 'bg/midnight-window.jpg'},
  {f: 120, src: 'bg/gym-dawn.jpg'},
  {f: 200, src: 'bg/summit.jpg'},
];

const Face = (a: any, b: any, t: number) => {
  const e: any = {
    bl: mixArr(a.bl, b.bl, t), br: mixArr(a.br, b.br, t), lid: mixArr(a.lid, b.lid, t), pupil: mixArr(a.pupil, b.pupil, t),
  };
  const src = t > 0.5 ? b : a;
  e.mouth = src.mouth; e.arch = src.arch; e.bags = src.bags; e.tears = src.tears; e.big = src.big;
  return e;
};

const Prop: React.FC<{name: string; x: number; y: number; size: number; at: number; until?: number; rot?: number}> = ({name, x, y, size, at, until, rot = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const out = until === undefined ? 1 : interpolate(frame, [until, until + 10], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const s = spring({frame: frame - at, fps, config: {damping: 9, stiffness: 140}}) * out;
  const float = Math.sin((frame - at) / 14) * 6;
  if (frame < at || out <= 0) return null;
  return (
    <svg viewBox="0 0 200 200" style={{position: 'absolute', left: x, top: y + float, width: size, height: size, transform: `scale(${s}) rotate(${rot}deg)`, filter: 'drop-shadow(0 14px 22px rgba(0,0,0,.35))'}}
      dangerouslySetInnerHTML={{__html: propSvg(name)}} />
  );
};

const Caption: React.FC<{text: string; from: number; to: number}> = ({text, from, to}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [from, from + 10, to - 10, to], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const y = interpolate(frame, [from, from + 14], [18, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 90, textAlign: 'center', opacity: o, transform: `translateY(${y}px)`,
      font: '700 64px/1.1 Inter, "Segoe UI", system-ui, sans-serif', color: '#fff', letterSpacing: 1, textShadow: '0 6px 30px rgba(0,0,0,.55)'}}>
      {text}
    </div>
  );
};

export const LabTest: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // which keyframe segment are we in, and how far (spring gives a little overshoot = life)
  let k = 0;
  KEYS.forEach((key, i) => { if (frame >= key.f) k = i; });
  const from = KEYS[Math.max(0, k - 1)], to = KEYS[k];
  const p = k === 0 ? 1 : spring({frame: frame - to.f, fps, config: {damping: 13, stiffness: 95, mass: 0.9}});
  const base = mixPose(POSES[from.pose], POSES[to.pose], p) as Pose;

  // breathing, weight shift and a slow head drift
  const pose: any = {
    ...base,
    lean: base.lean + Math.sin(frame / 22) * 0.9,
    tilt: base.tilt + Math.sin(frame / 31) * 1.4,
    armL: [base.armL[0] + Math.sin(frame / 26) * 1.6, base.armL[1] + Math.sin(frame / 26 + 1) * 2],
    armR: [base.armR[0] - Math.sin(frame / 26) * 1.6, base.armR[1] - Math.sin(frame / 26 + 1) * 2],
  };

  // face: blend emotions, add a blink every ~110 frames
  const emo = Face(EMO[from.emo], EMO[to.emo], k === 0 ? 1 : Math.min(1, Math.max(0, p)));
  const bp = frame % 110;
  const blink = bp < 8 ? Math.sin((bp / 8) * Math.PI) : 0;
  if (!emo.arch && blink > 0) emo.lid = [Math.max(emo.lid[0], blink * 1.1), emo.lid[1], emo.lid[2] * (1 - blink)];
  // lip-sync: while a line is spoken, the mouth follows the voice; loud syllables lift the brows and nod the head
  const speech = speechAt(frame);
  if (speech) {
    if (speech.code !== 'c') emo.mouth = MOUTH_FOR[speech.code];
    emo.bl = [emo.bl[0] - speech.energy * 3.5, emo.bl[1]];
    emo.br = [emo.br[0] - speech.energy * 3.5, emo.br[1]];
    pose.tilt += speech.energy * 2.2;
  }
  pose.emo = null;

  // pose objects carry an emo key in POSES; figure() reads EMO[pose.emo], so register a live face for this frame
  (EMO as any).__live = emo; pose.emo = '__live';
  const svg = figure(pose, 'indigo', 'lab', true);

  // camera: slow push-in with a gentle drift
  const zoom = interpolate(frame, [0, LAB_FRAMES], [1.0, 1.1]);
  const panX = interpolate(frame, [0, LAB_FRAMES], [0, -24]);

  const bgIdx = BG.reduce((acc, b, i) => (frame >= b.f ? i : acc), 0);
  const cur = BG[bgIdx], prev = BG[Math.max(0, bgIdx - 1)];
  const fade = bgIdx === 0 ? 1 : interpolate(frame, [cur.f, cur.f + 24], [0, 1], {extrapolateRight: 'clamp'});

  const figH = 880, k2 = figH / 430;
  return (
    <AbsoluteFill style={{background: '#05060c'}}>
      <AbsoluteFill style={{transform: `scale(${zoom}) translateX(${panX}px)`}}>
        {bgIdx > 0 && <Img src={staticFile(prev.src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}} />}
        <Img src={staticFile(cur.src)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: fade}} />
        <div style={{position: 'absolute', left: 1920 / 2 - 150 * k2, top: 1080 - figH - 24, width: 300 * k2, height: figH}}>
          <svg viewBox="0 0 300 430" style={{width: '100%', height: '100%', overflow: 'visible', filter: 'drop-shadow(0 0 26px rgba(150,170,255,.55))'}} dangerouslySetInnerHTML={{__html: svg}} />
        </div>
        <Prop name="alarm" x={330} y={430} size={300} at={30} until={118} rot={-8} />
        <Prop name="bolt" x={1330} y={400} size={200} at={140} until={198} rot={6} />
        <Prop name="sparkle" x={1290} y={250} size={230} at={215} rot={8} />
        <Prop name="heart" x={430} y={330} size={200} at={228} rot={-10} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,.45) 100%)', pointerEvents: 'none'}} />
      {LINES.map((l) => (
        // audio starts 1 frame early to cancel the ~43 ms delay the AAC encoder adds (measured on the rendered file)
        <Sequence key={l.file} from={l.start - AUDIO_COMP}><Audio src={staticFile(l.file)} /></Sequence>
      ))}
      <Caption text="I couldn't get up." from={8} to={78} />
      <Caption text="One minute." from={92} to={150} />
      <Caption text="Day 1." from={158} to={198} />
      <Caption text="And I kept going." from={214} to={290} />
    </AbsoluteFill>
  );
};
