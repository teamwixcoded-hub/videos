import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {Hook, HOOK_FRAMES} from './scenes/Hook';
import {Act1, ACT1_FRAMES} from './scenes/Act1';
import {S04Day5, S04_FRAMES} from './scenes/S04Day5';
import {S05Day21, S05_FRAMES} from './scenes/S05Day21';
import {S06Spreads, S06_FRAMES} from './scenes/S06Spreads';
import {S07Day90, S07_FRAMES} from './scenes/S07Day90';
import {S08Low, S08_FRAMES} from './scenes/S08Low';
import {S09Result, S09_FRAMES} from './scenes/S09Result';
import {S10Day365, S10_FRAMES} from './scenes/S10Day365';
import {S11Turn, S11_FRAMES} from './scenes/S11Turn';
import {S12End, S12_FRAMES} from './scenes/S12End';
import {whip, zoomThrough} from './transitions';
import {Music} from './components/Music';
import {Cinema, BEATS} from './components/Cinema';

// The whole video, one scene after another. Each scene carries its own sound, captions and lighting,
// and the cuts between rooms are camera moves (whip / zoom-through) or a soft dissolve between moods.
const T = 20;

type Bed = {track: string; startAt?: number; vol?: number};
const scenes: {C: React.FC; frames: number; bed?: Bed; id?: string}[] = [
  {C: Hook, frames: HOOK_FRAMES}, // cold open: the ending first, then rewind
  {C: Act1, id: 'Act1', frames: ACT1_FRAMES, bed: {track: 'wonder'}}, // S01 · S02 the choice · S03 night one
  {C: S04Day5, frames: S04_FRAMES, bed: {track: 'routine'}},
  {C: S05Day21, id: 'S05Day21', frames: S05_FRAMES, bed: {track: 'routine', startAt: 31}},
  {C: S06Spreads, frames: S06_FRAMES, bed: {track: 'hope'}},
  {C: S07Day90, id: 'S07Day90', frames: S07_FRAMES, bed: {track: 'hope', startAt: 27}},
  {C: S08Low, id: 'S08Low', frames: S08_FRAMES, bed: {track: 'low'}},
  {C: S09Result, id: 'S09Result', frames: S09_FRAMES, bed: {track: 'hope', startAt: 50}},
  {C: S10Day365, id: 'S10Day365', frames: S10_FRAMES, bed: {track: 'resolve'}},
  {C: S11Turn, id: 'S11Turn', frames: S11_FRAMES, bed: {track: 'resolve', startAt: 17}},
  {C: S12End, id: 'S12End', frames: S12_FRAMES, bed: {track: 'resolve', startAt: 34}},
];
const TRANS = [fade(), fade(), whip('left'), zoomThrough(960, 540), whip('right'), fade(), fade(), whip('left'), fade(), fade()];

export const VIDEO01_FRAMES = scenes.reduce((a, s) => a + s.frames, 0) - T * (scenes.length - 1);

export const Video01: React.FC = () => (
  <Cinema>
    <TransitionSeries>
      {scenes.flatMap(({C, frames, bed, id}, i) => {
        const seq = (
          <TransitionSeries.Sequence key={`s${i}`} durationInFrames={frames}>
            <C />
            {bed && <Music track={bed.track} startAt={bed.startAt} frames={frames} vol={bed.vol ?? 0.2} beats={id ? BEATS[id] : []} />}
          </TransitionSeries.Sequence>
        );
        return i < scenes.length - 1
          ? [seq, <TransitionSeries.Transition key={`t${i}`} presentation={TRANS[i] as never} timing={linearTiming({durationInFrames: T})} />]
          : [seq];
      })}
    </TransitionSeries>
  </Cinema>
);
