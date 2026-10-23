import React from 'react';
import {AbsoluteFill, Img, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {Shot} from './Shot';
import {Grain, Vignette} from '../vfx/Atmosphere';
import {focus} from '../vfx/Motion';
import {SfxTrack, Cue} from '../components/Sfx';
import {BenefitChips, HabitHub, ProgressBar, SectionBadge, Row} from '../components/Explain';
import {CineTitle, Letterbox} from '../components/Type';
import {whip} from '../transitions';
import {S} from '../easing';

// ============================================================================================
// S06 · IT SPREADS. What spreads? The reading habit. It leaves the armchair and shows up in three
// parts of his life, and for each one we SEE something productive happen and a benefit tick on:
//   1  WORK       he writes clearly, listens first, stays calm
//   2  MORNINGS   he wakes earlier, makes the bed, eats well, plans his day
//   3  PEOPLE     he is patient, he sits down with his mother
// Times are script seconds (S() scales them).
// ============================================================================================

const INK = '#2a1713';
const GREEN = '#7ee2a0';

// ---- closing recap: three productive moments side by side ----
const Panel: React.FC<{src: string; fx: number; fy: number; zoom: number; x: number; delay: number; tag: string}> = ({src, fx, fy, zoom, x, delay, tag}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 17, stiffness: 70}});
  const W = 560, H = 760;
  return (
    <div style={{position: 'absolute', left: x - W / 2, top: 170 + (1 - s) * 1000, width: W, height: H, borderRadius: 30, border: `8px solid ${INK}`, overflow: 'hidden', boxShadow: '0 0 60px rgba(100,210,130,0.5), 0 24px 40px rgba(0,0,0,0.45)', background: '#fff'}}>
      <Img src={staticFile(`images/${src}.png`)} style={{position: 'absolute', width: 1920 * zoom, height: 1080 * zoom, left: W / 2 - fx * zoom, top: H / 2 - fy * zoom}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, padding: '12px 0', background: 'rgba(10,8,14,0.82)', textAlign: 'center'}}>
        <span style={{fontFamily: 'Bebas Neue, sans-serif', fontSize: 54, letterSpacing: '0.16em', color: GREEN}}>{tag}</span>
      </div>
    </div>
  );
};

const Recap: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, #1c3a2c 0%, #0c1812 75%)'}}>
    <Panel src="FL_W1" fx={420} fy={520} zoom={1.8} x={330} delay={0} tag="WORK" />
    <Panel src="FL_M4" fx={1390} fy={560} zoom={1.9} x={960} delay={10} tag="MORNINGS" />
    <Panel src="FL_P1" fx={760} fy={560} zoom={1.45} x={1590} delay={20} tag="PEOPLE" />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(100,210,130,0.3) 100%)', pointerEvents: 'none'}} />
  </AbsoluteFill>
);

// ---- the three benefit lists (times are seconds after the vignette starts) ----
const WORK: Row[] = [{text: 'WRITES CLEARER', at: 1.4}, {text: 'LISTENS BEFORE REPLYING', at: 3.4}, {text: 'STAYS CALM UNDER PRESSURE', at: 5.6}];
const MORN: Row[] = [{text: 'WAKES UP EARLIER', at: 1.0}, {text: 'EATS A REAL BREAKFAST', at: 3.4}, {text: 'PLANS HIS DAY', at: 6.0}];
const PEOP: Row[] = [{text: 'MORE PATIENT', at: 1.4}, {text: 'LISTENS MORE', at: 3.4}, {text: 'MAKES TIME FOR HER', at: 5.6}];

const LENS = [6.4, 10.0, 10.0, 9.0, 7.0]; // hub, work, mornings, people, recap
const START = LENS.reduce<number[]>((a, l) => [...a, a[a.length - 1] + l], [0]); // cumulative starts in script seconds
export const S06_FRAMES = LENS.reduce((a, l) => a + S(l), 0);
const T = 14;

// one productive moment: frames + camera, a section badge, a benefit card and a progress bar
const Vignette1: React.FC<{frames: {src: string; at: number; fade?: number}[]; cam: ReturnType<typeof focus>[]; rows: Row[]; badge: [string, string]; bar: string; barTo: number}> = ({frames, cam, rows, badge, bar, barTo}) => (
  <AbsoluteFill>
    <Shot grade="day" frames={frames.map((f) => ({...f, at: S(f.at)}))} cam={cam} />
    <SectionBadge n={badge[0]} label={badge[1]} from={0.4} to={LENS[1] - 0.4} />
    <BenefitChips title="WHAT CHANGED" rows={rows} from={1.0} to={9.4} x={1560} y={230} w={600} />
  </AbsoluteFill>
);

const SFX: Cue[] = [
  {file: 'room_tone', at: 0, dur: 42, vol: 0.14, fadeIn: 1.5, fadeOut: 2},
  {file: 'swell', at: 0.4, dur: 5, vol: 0.2, fadeIn: 1.2, fadeOut: 1.8},
  {file: 'pop_a', at: 2.2, vol: 0.28}, {file: 'pop_b', at: 3.4, vol: 0.28}, {file: 'pop_c', at: 4.6, vol: 0.28},
  {file: 'sparkle', at: 2.3, dur: 1.4, vol: 0.18},
  {file: 'page', at: START[1] + 0.4, vol: 0.2},
  {file: 'cloth_a', at: START[1] + 4.0, vol: 0.16},
  {file: 'whoosh', at: START[1] - 0.3, vol: 0.2}, {file: 'whoosh', at: START[2] - 0.3, vol: 0.2}, {file: 'whoosh', at: START[3] - 0.3, vol: 0.2, rate: 0.9}, {file: 'whoosh', at: START[4] - 0.3, vol: 0.22, rate: 0.85},
  {file: 'tea', at: START[2] + 6.3, dur: 2.0, vol: 0.16, fadeOut: 0.3},
  {file: 'tea', at: START[3] + 0.8, dur: 2.0, vol: 0.18, fadeOut: 0.3},
  {file: 'pop_a', at: START[4] + 0.4, vol: 0.26}, {file: 'pop_b', at: START[4] + 1.0, vol: 0.26}, {file: 'pop_c', at: START[4] + 1.6, vol: 0.26},
  {file: 'swell', at: START[4] + 1.0, dur: 5, vol: 0.2, fadeIn: 1.5, fadeOut: 2},
];

export const S06Spreads: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={S(LENS[0]) + T}>
        <AbsoluteFill>
          <HabitHub from={0} to={LENS[0] + 0.5} nodeAt={[2.2, 3.4, 4.6]} />
          <CineTitle text="A HABIT SPREADS" from={0.5} to={LENS[0]} y={105} size={104} accentWords={['spreads']} accent={GREEN} />
        </AbsoluteFill>
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={whip('right')} timing={linearTiming({durationInFrames: T})} />
      <TransitionSeries.Sequence durationInFrames={S(LENS[1]) + T}>
        <Vignette1
          frames={[{src: 'FL_W1', at: 0}, {src: 'FL_OF3', at: 4.6, fade: 12}, {src: 'FL_W1', at: 8.2, fade: 12}]}
          cam={[focus(0, 520, 600, 1.35), focus(S(10), 500, 590, 1.5)]}
          rows={WORK} badge={['1', 'WORK']} bar="FOCUS" barTo={0.85}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={whip('left')} timing={linearTiming({durationInFrames: T})} />
      <TransitionSeries.Sequence durationInFrames={S(LENS[2]) + T}>
        <Vignette1
          frames={[{src: 'FL_M4', at: 0}, {src: 'FL_M2', at: 2.8, fade: 12}, {src: 'FL_M3', at: 6.0, fade: 12}]}
          cam={[focus(0, 1380, 600, 1.5), focus(S(2.8), 1380, 600, 1.5), focus(S(3.2), 800, 620, 1.5), focus(S(10), 800, 620, 1.62)]}
          rows={MORN} badge={['2', 'MORNINGS']} bar="ENERGY" barTo={0.8}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={whip('right')} timing={linearTiming({durationInFrames: T})} />
      <TransitionSeries.Sequence durationInFrames={S(LENS[3]) + T}>
        <Vignette1
          frames={[{src: 'FL_P1', at: 0}]}
          cam={[focus(0, 700, 620, 1.35), focus(S(9), 700, 610, 1.5)]}
          rows={PEOP} badge={['3', 'PEOPLE']} bar="PATIENCE" barTo={0.9}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={whip('left')} timing={linearTiming({durationInFrames: T})} />
      <TransitionSeries.Sequence durationInFrames={S(LENS[4])}>
        <AbsoluteFill>
          <Recap />
          <Letterbox from={0.6} to={LENS[4]} size={70} />
          <CineTitle text="ONE HABIT CHANGES THE OTHERS" from={1.0} to={LENS[4]} y={96} size={78} accentWords={['habit']} accent={GREEN} />
        </AbsoluteFill>
      </TransitionSeries.Sequence>
    </TransitionSeries>
    <SfxTrack cues={SFX} />
    <Vignette strength={0.3} />
    <Grain opacity={0.1} />
  </AbsoluteFill>
);
