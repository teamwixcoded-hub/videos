import type {SeqFrame} from '../components/FrameSeq';

// Dissolves run a little faster than the numbers written in a scene, to keep the pace brisk.
export const quick = (frames: SeqFrame[]): SeqFrame[] =>
  frames.map((f) => (f.fade ? {...f, fade: Math.max(6, Math.round(f.fade * 0.7))} : f));
