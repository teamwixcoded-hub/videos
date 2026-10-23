import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {FrameSeq, SeqFrame} from '../components/FrameSeq';
import {Camera, Sticker, focus} from '../vfx/Motion';
import {Dust, Grain, Vignette} from '../vfx/Atmosphere';
import {Glow} from './common';
import {GradeNight, GradeWarm} from '../components/Lighting';
import {DopamineMeter, NarrationCaptions, PhoneInset, ThoughtTower, TimeStamp, TitleCard, WallClock, CaptionLine} from '../components/Props4';
import {S, TIME_SCALE, easeInOut, clamp01} from '../easing';
import {PropPop} from '../components/PropPop';
import {NameTag, RewardChart} from '../components/Explain';
import {CalendarFlip} from '../components/Props5';
import {TypoAct1} from '../typography';
import {Beats} from '../components/Cinema';
import {SfxTrack} from '../components/Sfx';
import {frameCues, camCues} from '../components/autoSfx';

import {ACT1_SFX} from './act1Sfx';

// ============================================================================================
// One continuous room. Green (left, armchair) and Red (right, bed) live in the SAME shot, each
// playing their own frame sequence; a soft light-falloff blends warm lamp light into cold phone
// light, so there is no hard split and no cut. The camera glides between them.
// Everything below is in SECONDS (S() converts to frames) and follows the script's narration pace.
// ============================================================================================

const GREEN_HEAD = [346, 470] as const;
const RED_HEAD = [1478, 490] as const;
const CLOCK = [958, 292] as const;

// ---- Red: slumped -> glance -> reach -> grab -> lift -> glow -> laugh -> relax ----
const RED: SeqFrame[] = [
  {src: 'FL_R1', at: S(0)},
  {src: 'FL_R1y', at: S(3.6), fade: 10}, // rubs his eyes
  {src: 'FL_R1', at: S(5.9), fade: 10},
  {src: 'FL_R1s', at: S(8.6), fade: 12}, // a long sigh
  {src: 'FL_R1', at: S(11.3), fade: 12},
  {src: 'FL_R1g', at: S(13.0), fade: 10}, // glances toward the phone
  {src: 'FL_R1g', at: S(16.4), fade: 24},
  {src: 'FL_R1y', at: S(26.0), fade: 14},
  {src: 'FL_R1g', at: S(29.6), fade: 12},
  {src: 'FL_R2', at: S(33.4), fade: 12},
  {src: 'FL_R2b', at: S(35.6), fade: 18},
  {src: 'FL_R3', at: S(36.9), fade: 16},
  {src: 'FL_R4', at: S(39.5), fade: 16},
  {src: 'FL_R5', at: S(41.0), fade: 20},
  {src: 'FL_R7', at: S(43.0), fade: 12},
  {src: 'FL_R5', at: S(45.0), fade: 14},
  {src: 'FL_R6', at: S(46.0), fade: 26},
  {src: 'FL_R5', at: S(47.5), fade: 14},
  {src: 'FL_R6', at: S(48.9), fade: 14},
  {src: 'FL_R5', at: S(50.0), fade: 16},
  {src: 'FL_R7', at: S(52.0), fade: 12},
  {src: 'FL_R6', at: S(54.2), fade: 22},
  {src: 'FL_R10', at: S(57.8), fade: 16}, // glazed scrolling
  {src: 'FL_R6', at: S(61.0), fade: 18},
  {src: 'FL_R7', at: S(66.0), fade: 12},
  {src: 'FL_R6', at: S(68.4), fade: 22},
  // night one: he settles into bed while the camera is on Green, then the phone keeps him awake
  {src: 'FL_N1', at: S(72.2), fade: 14},
  {src: 'FL_N2', at: S(80.2), fade: 12},
  {src: 'FL_N1', at: S(88.4), fade: 18},
  {src: 'FL_N3', at: S(96.4), fade: 26},
];
// ---- Green: reading -> re-reading -> eyes to the clock -> yawn -> sleepy -> sigh ----
const GREEN: SeqFrame[] = [
  {src: 'FL_G1', at: S(0)},
  {src: 'FL_G1p', at: S(6.0), fade: 10}, // turns a page
  {src: 'FL_G1', at: S(7.6), fade: 10},
  {src: 'FL_G1l', at: S(12.4), fade: 12}, // looks up, thinking
  {src: 'FL_G1', at: S(15.0), fade: 12},
  {src: 'FL_G1s', at: S(21.0), fade: 14}, // a sip of tea
  {src: 'FL_G1', at: S(24.8), fade: 14},
  {src: 'FL_G1c', at: S(30.0), fade: 14}, // crosses his legs
  {src: 'FL_G1p', at: S(36.0), fade: 10},
  {src: 'FL_G1', at: S(37.6), fade: 10},
  {src: 'FL_G1s', at: S(45.0), fade: 14},
  {src: 'FL_G1', at: S(48.6), fade: 14},
  {src: 'FL_G1l', at: S(53.4), fade: 12},
  {src: 'FL_G1', at: S(55.6), fade: 12},
  {src: 'FL_G1p', at: S(58.0), fade: 10},
  {src: 'FL_G2', at: S(62.0), fade: 14},
  {src: 'FL_G1', at: S(63.8), fade: 14},
  {src: 'FL_G2', at: S(65.2), fade: 14},
  {src: 'FL_G3', at: S(67.0), fade: 18},
  {src: 'FL_G4a', at: S(71.2), fade: 14},
  {src: 'FL_G4', at: S(72.1), fade: 12},
  {src: 'FL_G5', at: S(74.6), fade: 20},
  {src: 'FL_G6', at: S(76.0), fade: 22},
  {src: 'FL_G7', at: S(83.0), fade: 18},
  {src: 'FL_G9', at: S(95.2), fade: 16},
  {src: 'FL_G8', at: S(99.8), fade: 20},
];
const RED_BLINK = {twins: {FL_R1: 'FL_R1b', FL_R6: 'FL_R6b'}, seed: 'red'};
const GREEN_BLINK = {twins: {FL_G1: 'FL_G1b'}, seed: 'green'};

// ---- camera: where to look, when. Slow moves, long holds. ----
const CAM = [
  focus(S(0), 960, 560, 1.0),
  focus(S(9), 960, 560, 1.06),
  focus(S(14), 1260, 600, 1.2),
  focus(S(17.5), 1450, 585, 1.5),
  focus(S(19), 1450, 585, 1.52),
  focus(S(24), 400, 600, 1.5),
  focus(S(25), 400, 600, 1.52),
  focus(S(31), 960, 560, 1.05),
  focus(S(35), 960, 560, 1.07),
  focus(S(38.5), 1450, 575, 1.6),
  focus(S(41.5), 1450, 560, 1.75),
  focus(S(49), 1450, 555, 1.8),
  focus(S(57), 1450, 545, 1.95),
  focus(S(58), 1450, 545, 1.95),
  focus(S(61.5), 420, 590, 1.65),
  focus(S(66), 420, 585, 1.7),
  focus(S(68.4), CLOCK[0], CLOCK[1] + 30, 2.9),
  focus(S(70.8), CLOCK[0], CLOCK[1] + 30, 2.95),
  focus(S(72.6), 400, 570, 1.85),
  focus(S(75.4), 400, 570, 1.85),
  focus(S(77.4), 1490, 655, 1.55), // to Red in bed
  focus(S(78.4), 1490, 655, 1.6),
  focus(S(79.4), CLOCK[0], CLOCK[1] + 30, 2.9), // the clock spins to 2 AM
  focus(S(81.8), CLOCK[0], CLOCK[1] + 30, 2.95),
  focus(S(83.8), 420, 590, 1.7), // across the line: Green closes the book
  focus(S(87.4), 430, 600, 1.72),
  focus(S(89.6), 1490, 650, 1.6), // back to Red, relaxed
  focus(S(92.4), 1490, 650, 1.62),
  focus(S(94.4), 960, 580, 1.1), // wide: the lamp goes out
  focus(S(110), 960, 570, 1.05),
];

const CAPTIONS: CaptionLine[] = [
  {text: 'Same room.', from: 0.8, to: 2.6},
  {text: 'Same night.', from: 3.0, to: 4.8},
  {text: 'Same tired eyes after a long day.', from: 5.2, to: 8.6},
  {text: 'Two versions of the same man… and one small choice.', from: 9.6, to: 15.4},
  {text: 'One picks up his phone.', from: 16.0, to: 19.0},
  {text: 'The other picks up a book.', from: 19.6, to: 23.0},
  {text: "One year from now, they won't recognize each other.", from: 24.2, to: 30.5},
  {text: 'The phone feels good. Instantly.', from: 35.2, to: 39.2},
  {text: 'A video. A laugh. Another one.', from: 40.2, to: 44.8},
  {text: 'His shoulders drop.', from: 46.0, to: 48.4},
  {text: 'His brain gets a small reward, a little hit of dopamine, and it asks for one more.', from: 49.4, to: 57.4},
  {text: "The book doesn't feel good.", from: 58.2, to: 61.4},
  {text: 'He reads the same line three times.', from: 62.0, to: 66.0},
  {text: 'His eyes drift to the clock.', from: 67.0, to: 70.5},
  {text: 'Ten pages feel like a hundred.', from: 71.2, to: 75.2},
  {text: '"Just five more minutes."', from: 75.6, to: 78.0},
  {text: "It's 2 AM.", from: 78.6, to: 80.4},
  {text: 'Across the line, he closes the book after ten pages.', from: 81.2, to: 85.6},
  {text: 'Frustrated.', from: 85.8, to: 87.2},
  {text: 'Honestly? On night one, the phone is winning.', from: 87.8, to: 92.0},
  {text: "He's relaxed. The reader is bored.", from: 92.6, to: 96.0},
  {text: "That's why most people choose the phone.", from: 96.8, to: 100.0},
  {text: 'The reward comes first… and the bill comes later.', from: 100.8, to: 106.6},
];

export const ACT1_FRAMES = S(110);

// dissolves speed up with the timeline too
const quick = (frames: SeqFrame[]): SeqFrame[] => frames.map((f) => (f.fade ? {...f, fade: Math.max(6, Math.round(f.fade * 0.7))} : f));

const REACTIONS: {at: number; x: number; y: number; name: 'heart' | 'sparkle' | 'bolt'; size: number}[] = [
  {at: 49.6, x: 1360, y: 400, name: 'heart', size: 74},
  {at: 51.0, x: 1590, y: 360, name: 'sparkle', size: 64},
  {at: 52.4, x: 1330, y: 330, name: 'heart', size: 80},
  {at: 53.8, x: 1620, y: 430, name: 'bolt', size: 60},
  {at: 55.2, x: 1400, y: 300, name: 'heart', size: 70},
  {at: 56.2, x: 1560, y: 330, name: 'sparkle', size: 66},
];

export const Act1: React.FC = () => {
  const frame = useCurrentFrame();
  const lamp = 0.8 + 0.2 * Math.sin(frame / 31) + random(`lamp-${Math.floor(frame / 5)}`) * 0.05;
  const phoneLit = interpolate(frame, [S(39.5), S(41.5)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const flick = phoneLit * (0.8 + random(`ph-${Math.floor(frame / 2)}`) * 0.2);
  // clock time: stands still until the camera arrives, then minutes visibly pass
  const clockMin =
    11 * 60 + 40 +
    interpolate(frame, [S(68.2), S(71)], [0, 4.5], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) +
    135.5 * easeInOut(clamp01((frame - S(78.4)) / (S(80.6) - S(78.4)))); // 11:45 -> 2:00 AM
  const warm = interpolate(frame, [S(97.6), S(99.6)], [1, 0.1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}); // the lamp goes out
  const inBed = frame >= S(72.2);
  const fadeOut = interpolate(frame, [S(108), S(110)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Camera keys={CAM} handheld={0.45}>
        {/* Green path: the whole room image, warm */}
        <GradeWarm lampX={440} lampY={470} warm={warm}>
          <FrameSeq frames={quick(GREEN)} fade={7} blink={GREEN_BLINK} />
        </GradeWarm>
        {/* Red path: the same room in cold light, blended in through a soft falloff */}
        <AbsoluteFill style={{WebkitMaskImage: 'linear-gradient(to right, transparent 40%, #000 60%)', maskImage: 'linear-gradient(to right, transparent 40%, #000 60%)'}}>
          <GradeNight>
            <FrameSeq frames={quick(RED)} fade={7} blink={RED_BLINK} />
          </GradeNight>
        </AbsoluteFill>

        <WallClock minutes={clockMin} x={CLOCK[0]} y={CLOCK[1]} />

        {/* living light on top of the keyframes */}
        <Glow x={440} y={470} r={520} color="rgba(255,200,120,0.3)" opacity={lamp * 0.6 * warm} />
        <Glow x={inBed ? 1580 : RED_HEAD[0] - 20} y={inBed ? 700 : RED_HEAD[1] + 300} r={400} color="rgba(110,175,255,0.8)" opacity={flick * 0.85} />
        <Dust count={22} area={{x: 40, y: 220, w: 760, h: 700}} seed="lamp" />

        {/* the reward lands: reactions drift up from his phone */}
        {REACTIONS.map((r, i) => (
          <Sticker key={i} name={r.name} x={r.x} y={r.y} size={r.size} at={S(r.at)} mode="float" life={110} />
        ))}
        <ThoughtTower from={S(71.6)} to={S(75.4)} build={70} x={680} y={440} />
        {/* who is who: the reader (left, good path) and the scroller (right) */}
        <NameTag text="THE READER" x={350} y={365} from={1.4} to={11.5} color="#ffd23f" sub="reads at night" />
        <NameTag text="THE SCROLLER" x={1480} y={375} from={2.0} to={11.5} color="#7fc2ff" sub="scrolls at night" />
        <NameTag text="SCROLLS" x={1480} y={340} from={17.0} to={23.0} color="#7fc2ff" size={40} />
        <NameTag text="READS" x={365} y={330} from={22.4} to={28.4} color="#ffd23f" size={40} />
        {/* props that carry the story */}
        <PropPop src="fx/zzz" x={1640} y={420} w={110} from={5.6} to={8.4} float />
        <PropPop src="fx/question" x={1500} y={370} w={96} from={12.8} to={15.0} />
        <PropPop src="fx/question" x={385} y={350} w={96} from={13.2} to={15.2} />
        <PropPop src="fx/badge" x={1800} y={716} w={58} from={16.8} to={19.6} />
        <PropPop src="props/book-closed" x={560} y={330} w={140} from={19.8} to={22.4} rotate={-8} />
        <PropPop src="fx/sweat" x={430} y={410} w={80} from={59.0} to={61.6} />
        <PropPop src="fx/question" x={375} y={350} w={92} from={63.0} to={64.8} />
        <PropPop src="fx/question" x={375} y={350} w={92} from={65.4} to={67.0} />
        <PropPop src="props/bubble-speech" x={1700} y={500} w={300} from={78.2} to={80.6} label="5 MORE MINUTES" />
        <PropPop src="fx/anger" x={335} y={380} w={96} from={85.9} to={87.8} rotate={-8} />
      </Camera>

      <CalendarFlip from={S(24.4)} hide={S(30.6)} flips={Array.from({length: 10}, (_, i) => S(25.2 + i * 0.55))} x={1580} y={320} w={230} />
      <RewardChart from={99.8} to={104.4} />
      <PhoneInset from={S(40.4)} to={S(46)} x={1680} y={520} swipes={[S(41.8), S(43.6), S(45.0)]} />
      <DopamineMeter from={S(49.4)} to={S(58.2)} hits={[S(49.8), S(51.3), S(52.8), S(54.3), S(55.8)]} x={1810} y={300} />
      <Beats scene="Act1" />
    <SfxTrack cues={[...ACT1_SFX, ...frameCues(RED, 0), ...frameCues(GREEN, 1)]} />
      <TimeStamp text="2 AM" from={S(80.7)} to={S(83.0)} />
      <TypoAct1 />
      <Vignette strength={0.3} />
      <Grain opacity={0.1} />
      <AbsoluteFill style={{background: '#000', opacity: fadeOut, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
