import React from 'react';
import {Video01, VIDEO01_FRAMES} from './Video01';
import {Hook, HOOK_FRAMES} from './scenes/Hook';
import {S06Spreads, S06_FRAMES} from './scenes/S06Spreads';
import {S07Day90, S07_FRAMES} from './scenes/S07Day90';
import {S08Low, S08_FRAMES} from './scenes/S08Low';
import {S09Result, S09_FRAMES} from './scenes/S09Result';
import {S10Day365, S10_FRAMES} from './scenes/S10Day365';
import {S11Turn, S11_FRAMES} from './scenes/S11Turn';
import {S12End, S12_FRAMES} from './scenes/S12End';
import {Composition} from 'remotion';
import {Sample2, SAMPLE2_FRAMES} from './scenes/Sample2';
import {Sample4, SAMPLE4_FRAMES} from './scenes/Sample4';
import {Sample5, SAMPLE5_FRAMES} from './scenes/Sample5';
import {Act1, ACT1_FRAMES} from './scenes/Act1';
import {S04Day5, S04_FRAMES} from './scenes/S04Day5';
import {S05Day21, S05_FRAMES} from './scenes/S05Day21';
import {Sample3, SAMPLE3_FRAMES, Shot1Hook, Shot2Choice, Shot3Struggle, Shot4Night} from './scenes/Sample3';
import {S1Hook} from './scenes/S1Hook';
import {S2Choice} from './scenes/S2Choice';
import {S3Struggle} from './scenes/S3Struggle';
import {S4Night} from './scenes/S4Night';
import {S5Montage} from './scenes/S5Montage';
import {LabTest, LAB_FRAMES} from './lab/LabTest';
import {NewVideo01, NEW01_FRAMES, NEW_SCENE_LIST} from './new/NewVideo01';
import {Act1New, A1_FRAMES} from './new/act1v2';

const W = 1920, H = 1080, FPS = 30;

export const Root: React.FC = () => {
  return (
    <>
      <Composition id="Video01" component={Video01} durationInFrames={VIDEO01_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="LabTest" component={LabTest} durationInFrames={LAB_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="NewVideo01" component={NewVideo01} durationInFrames={NEW01_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="A1-New" component={Act1New} durationInFrames={A1_FRAMES} fps={FPS} width={W} height={H} />
      {NEW_SCENE_LIST.map((s) => <Composition key={s.id} id={s.id} component={s.C} durationInFrames={s.frames} fps={FPS} width={W} height={H} />)}
      <Composition id="Hook" component={Hook} durationInFrames={HOOK_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="S06Spreads" component={S06Spreads} durationInFrames={S06_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="S07Day90" component={S07Day90} durationInFrames={S07_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="S08Low" component={S08Low} durationInFrames={S08_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="S09Result" component={S09Result} durationInFrames={S09_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="S10Day365" component={S10Day365} durationInFrames={S10_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="S11Turn" component={S11Turn} durationInFrames={S11_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="S12End" component={S12End} durationInFrames={S12_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="S05Day21" component={S05Day21} durationInFrames={S05_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="S04Day5" component={S04Day5} durationInFrames={S04_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="Act1" component={Act1} durationInFrames={ACT1_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="Sample5" component={Sample5} durationInFrames={SAMPLE5_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="Sample4" component={Sample4} durationInFrames={SAMPLE4_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="Sample3" component={Sample3} durationInFrames={SAMPLE3_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="Shot1Hook" component={Shot1Hook} durationInFrames={210} fps={FPS} width={W} height={H} />
      <Composition id="Shot2Choice" component={Shot2Choice} durationInFrames={240} fps={FPS} width={W} height={H} />
      <Composition id="Shot3Struggle" component={Shot3Struggle} durationInFrames={240} fps={FPS} width={W} height={H} />
      <Composition id="Shot4Night" component={Shot4Night} durationInFrames={200} fps={FPS} width={W} height={H} />
      <Composition id="Sample2" component={Sample2} durationInFrames={SAMPLE2_FRAMES} fps={FPS} width={W} height={H} />
      {/* single scenes, for fast previews */}
      <Composition id="S1Hook" component={S1Hook} durationInFrames={210} fps={FPS} width={W} height={H} />
      <Composition id="S2Choice" component={S2Choice} durationInFrames={240} fps={FPS} width={W} height={H} />
      <Composition id="S3Struggle" component={S3Struggle} durationInFrames={210} fps={FPS} width={W} height={H} />
      <Composition id="S4Night" component={S4Night} durationInFrames={180} fps={FPS} width={W} height={H} />
      <Composition id="S5Montage" component={S5Montage} durationInFrames={200} fps={FPS} width={W} height={H} />
    </>
  );
};
