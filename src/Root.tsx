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
import {PoseSheet} from './new/PoseSheet';
import {PoseLibrary, POSE_LIB_PAGES} from './new/PoseLibrary';
import {PoseTest, POSETEST_FRAMES} from './new/PoseTest';
import {PoseScenes, POSE_SCENES} from './new/PoseScenes';
import {Demo01, DEMO_FRAMES} from './new/demo01';
import {SameMan} from './same/SameMan';
import {Same3D, SAME3D_FRAMES} from './three/Same3D';
import {Same2D, SAME2D_TOTAL} from './same2d/Same2D';
import {Same7, SAME7_FRAMES} from './same7/Same7';
import {ThumbSame7A, ThumbFathersA, ThumbFathersB} from './thumbs/Thumbs';
import {ThumbVecA, ThumbVecB, ThumbVecC} from './thumbs/ThumbsVector';
import {WinterSheet} from './winter/Sheet';
import {WinterSide} from './winter/SideSheet';
import {Winter, WINTER_FRAMES} from './winter/Winter';
import {Overthink, OVERTHINK_FRAMES} from './overthinking/Overthink';
import {PropSheet} from './richvrich/PropSheet';
import {RichVsRich, RICH_FRAMES} from './richvrich/RichVsRich';
import {TwoFathers, FATHERS_FRAMES} from './fathers/Fathers';
import {StickSheet} from './same/StickSheet';
import {FrameSeqTest} from './same/FrameSeqTest';
import {TOTAL_FRAMES as SAME_FRAMES} from './same/lib/timeline';

const W = 1920, H = 1080, FPS = 30;

export const Root: React.FC = () => {
  return (
    <>
      <Composition id="Video01" component={Video01} durationInFrames={VIDEO01_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="LabTest" component={LabTest} durationInFrames={LAB_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="NewVideo01" component={NewVideo01} durationInFrames={NEW01_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="A1-New" component={Act1New} durationInFrames={A1_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="PoseSheet" component={PoseSheet} durationInFrames={4} fps={FPS} width={W} height={H} />
      <Composition id="PoseLibrary" component={PoseLibrary} durationInFrames={POSE_LIB_PAGES} fps={FPS} width={W} height={H} />
      <Composition id="PoseTest" component={PoseTest} durationInFrames={POSETEST_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="PoseScenes" component={PoseScenes} durationInFrames={POSE_SCENES} fps={FPS} width={W} height={H} />
      <Composition id="Demo01" component={Demo01} durationInFrames={DEMO_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="SameMan" component={SameMan} durationInFrames={SAME_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="Same2D" component={Same2D} durationInFrames={SAME2D_TOTAL} fps={FPS} width={W} height={H} />
      <Composition id="Same7" component={Same7} durationInFrames={SAME7_FRAMES} fps={FPS} width={W} height={H} />

      <Composition id="ThumbSame7A" component={ThumbSame7A} durationInFrames={1} fps={30} width={1280} height={720} />
      <Composition id="ThumbFathersA" component={ThumbFathersA} durationInFrames={1} fps={30} width={1280} height={720} />

      <Composition id="WinterSheet" component={WinterSheet} durationInFrames={1} fps={30} width={1920} height={1080} />
      <Composition id="Winter" component={Winter} durationInFrames={WINTER_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="Overthink" component={Overthink} durationInFrames={OVERTHINK_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="RichVsRich" component={RichVsRich} durationInFrames={RICH_FRAMES} fps={30} width={1920} height={1080} />
      <Composition id="RichProps" component={PropSheet} durationInFrames={1} fps={30} width={1920} height={1080} />
      <Composition id="WinterSide" component={WinterSide} durationInFrames={1} fps={30} width={1920} height={1080} />
      <Composition id="ThumbVecA" component={ThumbVecA} durationInFrames={1} fps={30} width={1920} height={1080} />
      <Composition id="ThumbVecB" component={ThumbVecB} durationInFrames={1} fps={30} width={1920} height={1080} />
      <Composition id="ThumbVecC" component={ThumbVecC} durationInFrames={1} fps={30} width={1920} height={1080} />
      <Composition id="ThumbFathersB" component={ThumbFathersB} durationInFrames={1} fps={30} width={1280} height={720} />
      <Composition id="TwoFathers" component={TwoFathers} durationInFrames={FATHERS_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="Same3D" component={Same3D} durationInFrames={SAME3D_FRAMES} fps={FPS} width={W} height={H} />
      <Composition id="StickSheet" component={StickSheet} durationInFrames={30} fps={FPS} width={W} height={H} />
      <Composition id="FrameSeqTest" component={FrameSeqTest} durationInFrames={240} fps={FPS} width={W} height={H} />
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
