import React from 'react';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {HOOK_FRAMES} from '../scenes/Hook';
import {ACT1_FRAMES} from '../scenes/Act1';
import {S04_FRAMES} from '../scenes/S04Day5';
import {S05_FRAMES} from '../scenes/S05Day21';
import {S06_FRAMES} from '../scenes/S06Spreads';
import {S07_FRAMES} from '../scenes/S07Day90';
import {S08_FRAMES} from '../scenes/S08Low';
import {S09_FRAMES} from '../scenes/S09Result';
import {S10_FRAMES} from '../scenes/S10Day365';
import {S11_FRAMES} from '../scenes/S11Turn';
import {S12_FRAMES} from '../scenes/S12End';
import {whip, zoomThrough} from '../transitions';
import {Music} from '../components/Music';
import {Cinema, BEATS} from '../components/Cinema';
import {NHook, NAct1, NS04, NS05, NS06, NS07, NS08, NS09, NS10, NS11, NS12} from './scenes';

// The same video as Video01, rebuilt in the new style. Same scene lengths, same captions (src/keyphrases.ts),
// same music beds and transitions, so the timing is identical to the original.
const T = 20;
type Bed = {track: string; startAt?: number; vol?: number};
const scenes: {C: React.FC; frames: number; bed?: Bed; id?: string}[] = [
  {C: NHook, frames: HOOK_FRAMES},
  {C: NAct1, id: 'Act1', frames: ACT1_FRAMES, bed: {track: 'wonder'}},
  {C: NS04, frames: S04_FRAMES, bed: {track: 'routine'}},
  {C: NS05, id: 'S05Day21', frames: S05_FRAMES, bed: {track: 'routine', startAt: 31}},
  {C: NS06, frames: S06_FRAMES, bed: {track: 'hope'}},
  {C: NS07, id: 'S07Day90', frames: S07_FRAMES, bed: {track: 'hope', startAt: 27}},
  {C: NS08, id: 'S08Low', frames: S08_FRAMES, bed: {track: 'low'}},
  {C: NS09, id: 'S09Result', frames: S09_FRAMES, bed: {track: 'hope', startAt: 50}},
  {C: NS10, id: 'S10Day365', frames: S10_FRAMES, bed: {track: 'resolve'}},
  {C: NS11, id: 'S11Turn', frames: S11_FRAMES, bed: {track: 'resolve', startAt: 17}},
  {C: NS12, id: 'S12End', frames: S12_FRAMES, bed: {track: 'resolve', startAt: 34}},
];
// each scene on its own, for previewing in Studio (compositions "N01-Hook" ... "N11-End")
export const NEW_SCENE_LIST = scenes.map((s, i) => ({id: `N${String(i + 1).padStart(2, '0')}-${['Hook', 'Act1', 'Day5', 'Day21', 'Spreads', 'Day90', 'Low', 'Result', 'Day365', 'Turn', 'End'][i]}`, C: s.C, frames: s.frames}));
const TRANS = [fade(), fade(), whip('left'), zoomThrough(960, 540), whip('right'), fade(), fade(), whip('left'), fade(), fade()];

export const NEW01_FRAMES = scenes.reduce((a, s) => a + s.frames, 0) - T * (scenes.length - 1);
export const NEW01_STARTS = scenes.reduce<number[]>((acc, s, i) => { acc.push(i === 0 ? 0 : acc[i - 1] + scenes[i - 1].frames - T); return acc; }, []);

export const NewVideo01: React.FC = () => (
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
