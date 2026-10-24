import React from 'react';
import {AbsoluteFill, Sequence, interpolate, random, useCurrentFrame} from 'remotion';
import {Actor, Cam, Furn, Light, Obj, Plate} from './kit';
import {KeyPhrases} from '../components/KeyPhrases';
import {KP_ACT1, KP_S04, KP_S05, KP_S06, KP_S07, KP_S08, KP_S09, KP_S10, KP_S11, KP_S12} from '../keyphrases';
import {R, S, easeInOut} from '../easing';
import {SfxTrack} from '../components/Sfx';
import {CUES as HOOK_CUES} from '../scenes/Hook';
import {ACT1_SFX} from '../scenes/act1Sfx';
import {SFX as S04_SFX} from '../scenes/S04Day5';
import {SFX as S05_SFX} from '../scenes/S05Day21';
import {SFX as S06_SFX} from '../scenes/S06Spreads';
import {SFX as S07_SFX} from '../scenes/S07Day90';
import {SFX as S08_SFX} from '../scenes/S08Low';
import {SFX as S09_SFX} from '../scenes/S09Result';
import {SFX as S10_SFX} from '../scenes/S10Day365';
import {SFX as S11_SFX} from '../scenes/S11Turn';
import {SFX as S12_SFX} from '../scenes/S12End';

// ============================================================================================
// NEW-STYLE SCENES. Same story and same script as the original, rebuilt with the glass character, vector props,
// furniture and baked cinematic plates. Times are SCRIPT SECONDS (S) unless a scene says "real" (R).
// Red  = the phone man (coral hoodie, cold blue light).   Green = the book man (teal hoodie, warm lamp light).
// ============================================================================================

const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const FLOOR = 1010;
const GX = 1330, RX = 2540, LAMPX = 930, NSX = 1990, MID = 1935;   // Green's chair, Red's bed, lamp, nightstand, wide-shot centre
const font = '"Segoe UI Black", "Arial Black", "Segoe UI", system-ui, sans-serif';

// a shot lasting from..to (script seconds); children see local time starting at 0
const Shot: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => (
  <Sequence from={S(from)} durationInFrames={Math.max(1, S(to) - S(from))}>{children}</Sequence>
);
const Vig: React.FC<{o?: number}> = ({o = 0.55}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(0,0,0,${o}) 100%)`, pointerEvents: 'none'}} />
);
// fades children in and out between two times; script seconds by default, `real` = real seconds (the hook)
const Fade: React.FC<{from: number; to: number; frames?: number; real?: boolean; children: React.ReactNode}> = ({from, to, frames = 8, real = false, children}) => {
  const f = useCurrentFrame();
  const a = real ? R(from) : S(from), b = real ? R(to) : S(to), e = Math.max(1, Math.min(frames, Math.floor((b - a) / 2) - 1));
  const o = interpolate(f, [a, a + e, b - e, b], [0, 1, 1, 0], CLAMP);
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};
// big slam text (real seconds)
const Slam: React.FC<{text: string; at: number; until: number; size?: number; color?: string; y?: number; x?: number}> = ({text, at, until, size = 150, color = '#fff', y = 540, x = 960}) => {
  const f = useCurrentFrame();
  const a = R(at), b = R(until);
  if (f < a || f > b) return null;
  const s = interpolate(f, [a, a + 6, a + 12], [1.5, 0.94, 1], CLAMP);
  const o = interpolate(f, [a, a + 3, b - 5, b], [0, 1, 1, 0], CLAMP);
  return <div style={{position: 'absolute', left: x - 900, width: 1800, top: y - size, textAlign: 'center', font: `900 ${size}px/1 ${font}`, color, opacity: o, transform: `scale(${s})`, textShadow: '0 10px 50px rgba(0,0,0,.7)', letterSpacing: 2}}>{text}</div>;
};
// story tone: one soft colour wash over a scene (cold = phone, warm = book)
const Wash: React.FC<{color: string; o?: number}> = ({color, o = 0.18}) => <AbsoluteFill style={{background: color, opacity: o, mixBlendMode: 'soft-light', pointerEvents: 'none'}} />;

// ---- the two men, in the places they live ----
const GreenSeat: React.FC<{x: number; keys: any[]; scale?: number}> = ({x, keys, scale = 1}) => (
  <>
    <Furn name="armchair" x={x} y={FLOOR} w={400 * scale} />
    <Actor id="green" pal="teal" x={x} y={FLOOR} h={760 * scale} drop={68} keys={keys} />
    <Furn name="armchairFront" x={x} y={FLOOR} w={400 * scale} />
  </>
);
const RedBed: React.FC<{x: number; keys: any[]; scale?: number}> = ({x, keys, scale = 1}) => (
  <>
    <Furn name="bed" x={x} y={FLOOR} w={640 * scale} />
    <Actor id="red" pal="coral" x={x - 120 * scale} y={FLOOR} h={760 * scale} drop={71} keys={keys} />
    <Furn name="bedFront" x={x} y={FLOOR} w={640 * scale} />
  </>
);

// ============================================================================================
// S01 HOOK (8.4 s real): the ending first. Day 365, two lives, one man. Then rewind to Day 1.
// ============================================================================================
export const NHook: React.FC = () => {
  const f = useCurrentFrame();
  const rewind = interpolate(f, [R(3.7), R(6.0)], [365, 1], CLAMP);
  const inRewind = f >= R(3.7) && f < R(6.0);
  const jit = inRewind ? (random(`j${f}`) - 0.5) * 14 : 0;
  const dip = interpolate(f, [R(2.7), R(2.9), R(3.3), R(3.6)], [0, 0.85, 0.85, 0], CLAMP);
  return (
    <AbsoluteFill style={{background: '#05060c'}}>
      <AbsoluteFill style={{transform: `translateX(${jit}px)`, filter: inRewind ? `saturate(${0.5 + random(`s${f}`)}) hue-rotate(${(random(`h${f}`) - 0.5) * 40}deg)` : undefined}}>
        <div style={{position: 'absolute', left: 0, top: 0, width: 960, height: 1080, overflow: 'hidden'}}>
          <Cam vw={960} keys={[{t: 0, x: 960, y: 560, z: 1.0}, {t: 8.4, x: 960, y: 560, z: 1.12}]}>
            <Plate name="warm-study" />
            <Light x={620} y={560} r={420} color="rgba(255,190,90,.55)" />
            <GreenSeat x={960} keys={[{t: 0, pose: 'sitRead', emo: 'happy', hold: {name: 'book-open', size: 120, dy: 4}}]} />
          </Cam>
        </div>
        <div style={{position: 'absolute', left: 960, top: 0, width: 960, height: 1080, overflow: 'hidden'}}>
          <Cam vw={960} keys={[{t: 0, x: 960, y: 560, z: 1.0}, {t: 8.4, x: 960, y: 560, z: 1.12}]}>
            <Plate name="cold-bedroom" />
            <Light x={1000} y={640} r={420} color="rgba(110,200,255,.5)" />
            <RedBed x={960} keys={[{t: 0, pose: 'bedSlump', emo: 'tired', hold: {name: 'phone-lit', size: 120, dy: 4}}]} />
          </Cam>
        </div>
        <div style={{position: 'absolute', left: 958, top: 0, width: 4, height: 1080, background: 'rgba(255,255,255,.8)'}} />
      </AbsoluteFill>
      <Vig />
      {/* day 365 numbers */}
      <Slam text="SAME MAN." at={0.15} until={1.7} size={190} y={560} />
      <Fade real from={1.7} to={2.9}>
        <div style={{position: 'absolute', left: 60, width: 840, top: 800, font: `900 112px/1 ${font}`, color: '#7ee2a0', textAlign: 'center', textShadow: '0 8px 40px #000'}}>20+ BOOKS</div>
        <div style={{position: 'absolute', left: 1020, width: 840, top: 800, font: `900 90px/1.05 ${font}`, color: '#ff6b5e', textAlign: 'center', textShadow: '0 8px 40px #000'}}>1,000+ HOURS<br />ON A SCREEN</div>
      </Fade>
      <AbsoluteFill style={{background: '#000', opacity: dip, pointerEvents: 'none'}} />
      <Slam text="WHAT HAPPENED?" at={2.9} until={3.6} size={150} />
      {inRewind && (
        <>
          <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,.28) 0 2px, transparent 2px 5px)', mixBlendMode: 'multiply'}} />
          <div style={{position: 'absolute', left: 80, top: 70, font: `900 120px/1 ${font}`, color: '#fff', textShadow: '4px 0 #f33, -4px 0 #3cf'}}>◀◀ DAY {Math.max(1, Math.round(rewind))}</div>
        </>
      )}
      <Slam text="ONE SCROLLED." at={6.0} until={7.2} size={140} y={470} color="#ff6b5e" />
      <Slam text="ONE READ." at={6.5} until={8.4} size={140} y={640} color="#7ee2a0" />
      <SfxTrack cues={HOOK_CUES} />
    </AbsoluteFill>
  );
};

// ============================================================================================
// S02 ACT 1: one continuous wide room. Green (left, armchair, lamp) and Red (right, bed, phone) share the shot;
// the camera glides between them. "ONE SMALL CHOICE" -> night one -> the phone wins.
// ============================================================================================
export const NAct1: React.FC = () => (
  <AbsoluteFill style={{background: '#05060c'}}>
    <Cam w={3840} keys={[
      {t: 0, x: MID, y: 560, z: 1.0}, {t: 9, x: MID, y: 560, z: 1.04}, {t: 14, x: RX, y: 560, z: 1.25}, {t: 34, x: RX, y: 560, z: 1.4},
      {t: 49, x: RX - 40, y: 470, z: 1.8}, {t: 57, x: RX - 40, y: 470, z: 1.85}, {t: 60, x: MID, y: 560, z: 1.0}, {t: 64, x: GX, y: 560, z: 1.25},
      {t: 84, x: GX - 20, y: 540, z: 1.6}, {t: 88, x: MID, y: 560, z: 1.0}, {t: 92, x: RX, y: 560, z: 1.3}, {t: 102, x: RX, y: 560, z: 1.4}, {t: 108, x: MID, y: 560, z: 1.0},
    ]}>
      <Plate name="two-lives" w={3840} h={1080} />
      <Light x={GX - 80} y={600} r={620} color="rgba(255,190,90,.5)" />
      <Light x={RX + 40} y={720} r={620} color="rgba(110,200,255,.42)" />
      <Obj name="lamp" x={LAMPX} y={700} size={440} float={0} />
      <GreenSeat x={GX} keys={[
        {t: 0, pose: 'sitUp', emo: 'neutral'},
        {t: 12, pose: 'sitRead', emo: 'neutral', hold: {name: 'book-closed', size: 120, dy: 6}},
        {t: 16, pose: 'sitRead', emo: 'happy', hold: {name: 'book-open', size: 130, dy: 4}},
        {t: 62, pose: 'sitReadLean', emo: 'tired', hold: {name: 'book-open', size: 130, dy: 4}},
        {t: 72, pose: 'sitRead', emo: 'worried'}, {t: 82, pose: 'sitReadLean', emo: 'tired'}, {t: 90, pose: 'sitUp', emo: 'tired'},
      ]} />
      <Furn name="nightstand" x={NSX} y={FLOOR} w={190} />
      <Obj name="alarm" x={NSX} y={760} size={190} float={0} />
      <RedBed x={RX} keys={[
        {t: 0, pose: 'bedSlump', emo: 'tired'},
        {t: 14, pose: 'bedSlump', emo: 'tired'},
        {t: 22, pose: 'bedSit', emo: 'worried'},
        {t: 30, pose: 'bedPhone', emo: 'surprised', hold: {name: 'phone-lit', size: 140, dy: 6}},
        {t: 37, pose: 'bedPhone', emo: 'happy'},
        {t: 50, pose: 'bedPhone', emo: 'laughing'},
        {t: 90, pose: 'bedPhone', emo: 'smug'},
        {t: 104, pose: 'bedSlump', emo: 'tired'},
      ]} />
      <Light x={RX + 90} y={640} r={360} color="rgba(120,210,255,.55)" />
      <Obj name="sparkle" x={RX + 200} y={380} size={170} at={50} until={56} rot={8} />
      <Obj name="bolt" x={RX + 280} y={560} size={150} at={36} until={40} rot={10} />
    </Cam>
    <Vig />
    <KeyPhrases lines={KP_ACT1} />
    <SfxTrack cues={ACT1_SFX} />
  </AbsoluteFill>
);

// ============================================================================================
// S04 DAY 5: the phone is in every moment of Red's day (bed, kitchen, bathroom), the days blur; Green: same chair, same tea.
// ============================================================================================
export const NS04: React.FC = () => (
  <AbsoluteFill style={{background: '#05060c'}}>
    <Shot from={0} to={9}>
      <Cam keys={[{t: 0, x: 960, y: 560, z: 1.0}, {t: 9, x: 980, y: 560, z: 1.1}]}>
        <Plate name="cold-bedroom" /><Light x={900} y={660} r={480} color="rgba(110,200,255,.5)" />
        <RedBed x={960} keys={[{t: 0, pose: 'bedPhone', emo: 'tired', hold: {name: 'phone-lit', size: 130, dy: 6}}, {t: 5, pose: 'bedPhone', emo: 'smug'}]} />
      </Cam>
    </Shot>
    <Shot from={9} to={16}>
      <Cam keys={[{t: 0, x: 960, y: 560, z: 1.0}, {t: 7, x: 940, y: 560, z: 1.08}]}>
        <Plate name="kitchen" />
        <Furn name="table" x={1100} y={FLOOR} w={560} />
        <Actor id="red" pal="coral" x={760} y={FLOOR} h={780} keys={[{t: 0, pose: 'stand', emo: 'tired', hold: {name: 'phone-lit', size: 120, hand: 'R', dy: -6}}]} />
        <Obj name="cereal" x={1080} y={690} size={190} float={0} />
      </Cam>
    </Shot>
    <Shot from={16} to={24}>
      <Cam keys={[{t: 0, x: 960, y: 560, z: 1.0}, {t: 8, x: 980, y: 540, z: 1.08}]}>
        <Plate name="bathroom" />
        <Actor id="red" pal="coral" x={1000} y={FLOOR} h={780} keys={[{t: 0, pose: 'stand', emo: 'neutral', hold: {name: 'phone-lit', size: 120, hand: 'R', dy: -6}}]} />
        <Obj name="toothbrush" x={1250} y={640} size={190} float={3} />
      </Cam>
    </Shot>
    <Shot from={24} to={55}>
      <Cam keys={[{t: 0, x: 960, y: 560, z: 1.0}, {t: 31, x: 960, y: 540, z: 1.12}]}>
        <Plate name="warm-study" /><Light x={640} y={600} r={520} color="rgba(255,190,90,.5)" />
        <Obj name="lamp" x={380} y={700} size={430} float={0} />
        <GreenSeat x={960} keys={[{t: 0, pose: 'sitRead', emo: 'neutral', hold: {name: 'book-open', size: 130, dy: 4}}, {t: 20, pose: 'sitRead', emo: 'happy'}]} />
        <Obj name="teacup" x={1360} y={820} size={190} float={0} />
      </Cam>
    </Shot>
    <Vig />
    <KeyPhrases lines={KP_S04} />
    <SfxTrack cues={S04_SFX} />
  </AbsoluteFill>
);

// ============================================================================================
// S05 DAY 21: Red gets irritable, snaps at his mother over nothing, color drains. Green: the book stops fighting him.
// ============================================================================================
export const NS05: React.FC = () => {
  const f = useCurrentFrame();
  const drain = interpolate(f, [0, S(26)], [0, 0.85], CLAMP);
  return (
    <AbsoluteFill style={{background: '#05060c'}}>
      <Shot from={0} to={30}>
        <AbsoluteFill style={{filter: `grayscale(${drain})`}}>
          <Cam keys={[{t: 0, x: 960, y: 560, z: 1.0}, {t: 30, x: 1000, y: 540, z: 1.12}]}>
            <Plate name="living" />
            <Actor id="mom" pal="gold" x={1380} y={FLOOR} h={720} flip keys={[{t: 0, pose: 'idle', emo: 'neutral'}, {t: 19, pose: 'shrug', emo: 'worried'}, {t: 24, pose: 'idle', emo: 'sad'}]} />
            <Actor id="red" pal="coral" x={700} y={FLOOR} h={780} keys={[
              {t: 0, pose: 'tiredStand', emo: 'tired', hold: {name: 'phone-lit', size: 120, hand: 'R', dy: -6}},
              {t: 15, pose: 'tiredStand', emo: 'angry', hold: null}, {t: 18, pose: 'pointing', emo: 'angry'},
              {t: 25, pose: 'tiredStand', emo: 'sad'}, {t: 28, pose: 'tiredStand', emo: 'tired', hold: {name: 'phone-lit', size: 120, hand: 'R', dy: -6}},
            ]} />
            <Obj name="bubble-speech" x={1000} y={330} size={240} at={17} until={24} />
          </Cam>
        </AbsoluteFill>
      </Shot>
      <Shot from={30} to={52}>
        <Cam keys={[{t: 0, x: 960, y: 560, z: 1.0}, {t: 22, x: 960, y: 540, z: 1.12}]}>
          <Plate name="warm-study" /><Light x={640} y={600} r={620} color="rgba(255,190,90,.6)" />
          <Obj name="lamp" x={380} y={700} size={430} float={0} />
          <GreenSeat x={960} keys={[{t: 0, pose: 'sitReadLean', emo: 'determined', hold: {name: 'book-open', size: 130, dy: 4}}, {t: 7, pose: 'sitRead', emo: 'happy'}, {t: 14, pose: 'sitRead', emo: 'surprised'}]} />
          <Obj name="book-tower" x={1420} y={760} size={330} at={12} float={0} />
        </Cam>
      </Shot>
      <Vig />
      <KeyPhrases lines={KP_S05} />
      <SfxTrack cues={S05_SFX} />
    </AbsoluteFill>
  );
};

// ============================================================================================
// S06 IT SPREADS: the reading habit shows up in work, mornings and people.
// ============================================================================================
const Benefit: React.FC<{lines: string[]; at: number; x: number; y: number; color: string}> = ({lines, at, x, y, color}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: x, top: y}}>
      {lines.map((l, i) => {
        const a = S(at + i * 2.2), o = interpolate(f, [a, a + 8], [0, 1], CLAMP), s = interpolate(f, [a, a + 8], [0.8, 1], CLAMP);
        return <div key={i} style={{opacity: o, transform: `scale(${s})`, transformOrigin: 'left center', font: `800 54px/1.25 ${font}`, color: '#fff', textShadow: '0 6px 30px #000', marginBottom: 8}}><span style={{color}}>✓ </span>{l}</div>;
      })}
    </div>
  );
};
export const NS06: React.FC = () => (
  <AbsoluteFill style={{background: '#05060c'}}>
    <Shot from={0} to={16}>
      <Cam keys={[{t: 0, x: 960, y: 560, z: 1.0}, {t: 16, x: 980, y: 540, z: 1.1}]}>
        <Plate name="office" /><Furn name="desk" x={1000} y={FLOOR} w={760} />
        <Actor id="green" pal="teal" x={1000} y={FLOOR} h={690} drop={58} keys={[{t: 0, pose: 'sitUp', emo: 'determined'}, {t: 8, pose: 'sitRead', emo: 'happy'}]} />
      </Cam>
      <Benefit lines={['WRITES CLEARLY', 'LISTENS FIRST', 'STAYS CALM']} at={2} x={1160} y={270} color="#7ee2a0" />
    </Shot>
    <Shot from={16} to={30}>
      <Cam keys={[{t: 0, x: 960, y: 560, z: 1.0}, {t: 14, x: 940, y: 560, z: 1.08}]}>
        <Plate name="kitchen" /><Furn name="table" x={1180} y={FLOOR} w={560} />
        <Actor id="green" pal="teal" x={760} y={FLOOR} h={780} keys={[{t: 0, pose: 'stand', emo: 'happy'}, {t: 7, pose: 'idle', emo: 'happy'}]} />
        <Obj name="mug" x={1180} y={700} size={170} float={0} /><Obj name="alarm" x={1400} y={690} size={190} float={0} />
      </Cam>
      <Benefit lines={['WAKES EARLIER', 'EATS WELL', 'PLANS HIS DAY']} at={2} x={1100} y={250} color="#ffd23f" />
    </Shot>
    <Shot from={30} to={44}>
      <Cam keys={[{t: 0, x: 960, y: 560, z: 1.0}, {t: 14, x: 940, y: 560, z: 1.08}]}>
        <Plate name="living" /><Furn name="sofa" x={1000} y={FLOOR} w={760} />
        <Actor id="mom" pal="gold" x={1200} y={FLOOR} h={690} drop={58} keys={[{t: 0, pose: 'sitUp', emo: 'happy'}]} />
        <Actor id="green" pal="teal" x={820} y={FLOOR} h={690} drop={58} keys={[{t: 0, pose: 'sitUp', emo: 'happy'}, {t: 8, pose: 'sitRead', emo: 'smug'}]} />
        <Obj name="heart" x={1020} y={360} size={190} at={5} />
      </Cam>
      <Benefit lines={['MORE PATIENT', 'SITS WITH HIS MOTHER']} at={2} x={120} y={230} color="#ff8da1" />
    </Shot>
    <Vig />
    <KeyPhrases lines={KP_S06} />
    <SfxTrack cues={S06_SFX} />
  </AbsoluteFill>
);

// ============================================================================================
// S07 DAY 90: the crossing point. Red's days are copies; Green's look the same but he doesn't.
// ============================================================================================
export const NS07: React.FC = () => {
  const f = useCurrentFrame();
  const day = Math.min(90, Math.floor(interpolate(f, [S(1), S(26)], [1, 90], CLAMP)));
  return (
    <AbsoluteFill style={{background: '#05060c'}}>
      <Cam w={3840} keys={[{t: 0, x: MID, y: 560, z: 1.0}, {t: 7, x: RX, y: 560, z: 1.25}, {t: 18, x: RX, y: 560, z: 1.35}, {t: 21, x: GX, y: 560, z: 1.25}, {t: 30, x: GX, y: 560, z: 1.4}, {t: 36, x: MID, y: 560, z: 1.0}]}>
        <Plate name="two-lives" w={3840} h={1080} />
        <Light x={GX - 80} y={600} r={620} color="rgba(255,190,90,.5)" /><Light x={RX + 40} y={720} r={620} color="rgba(110,200,255,.4)" />
        <Obj name="lamp" x={LAMPX} y={700} size={440} float={0} />
        <GreenSeat x={GX} keys={[{t: 0, pose: 'sitRead', emo: 'happy', hold: {name: 'book-open', size: 130, dy: 4}}, {t: 24, pose: 'sitRead', emo: 'determined'}]} />
        <Obj name="book-tower" x={GX + 440} y={760} size={330} at={22} float={0} /><Obj name="books-flat" x={LAMPX - 90} y={880} size={190} at={24} float={0} />
        <Furn name="nightstand" x={NSX} y={FLOOR} w={190} />
        <RedBed x={RX} keys={[{t: 0, pose: 'bedPhone', emo: 'smug', hold: {name: 'phone-lit', size: 140, dy: 6}}, {t: 12, pose: 'bedPhone', emo: 'tired'}, {t: 24, pose: 'bedSlump', emo: 'tired'}]} />
        <Obj name="calendar" x={RX + 360} y={400} size={280} float={0} />
        <div style={{position: 'absolute', left: RX + 220, top: 400, width: 280, textAlign: 'center', font: `900 90px/1 ${font}`, color: '#ff6b5e', textShadow: '0 4px 20px #000'}}>{day}</div>
      </Cam>
      <Vig />
      <KeyPhrases lines={KP_S07} />
      <SfxTrack cues={S07_SFX} />
    </AbsoluteFill>
  );
};

// ============================================================================================
// S08 THE LOW POINT: he searches "how to fix your life", three videos, forty minutes later still in bed.
// ============================================================================================
export const NS08: React.FC = () => {
  const f = useCurrentFrame();
  const q = 'how to fix your life';
  const typed = q.slice(0, Math.floor(interpolate(f, [S(2), S(8)], [0, q.length], CLAMP)));
  const vids = ['DISCIPLINE', 'PRODUCTIVITY', 'WAKE UP AT 5 AM'];
  return (
    <AbsoluteFill style={{background: '#05060c'}}>
      <Cam keys={[{t: 0, x: 960, y: 560, z: 1.0}, {t: 36, x: 1000, y: 520, z: 1.14}]}>
        <Plate name="cold-bedroom" /><Light x={920} y={660} r={520} color="rgba(110,200,255,.5)" />
        <RedBed x={820} keys={[{t: 0, pose: 'bedPhone', emo: 'worried', hold: {name: 'phone-lit', size: 140, dy: 6}}, {t: 12, pose: 'bedPhone', emo: 'tired'}, {t: 26, pose: 'bedSlump', emo: 'sad'}]} />
      </Cam>
      <div style={{position: 'absolute', left: 1180, top: 190, width: 660, whiteSpace: 'nowrap', padding: '22px 28px', borderRadius: 18, background: 'rgba(255,255,255,.14)', border: '2px solid rgba(255,255,255,.4)', backdropFilter: 'blur(10px)', font: `700 38px/1.2 ${font}`, color: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,.4)'}}>
        🔍 {typed}<span style={{opacity: Math.floor(f / 8) % 2}}>|</span>
      </div>
      {vids.map((v, i) => {
        const a = S(9 + i * 3), o = interpolate(f, [a, a + 8], [0, 1], CLAMP), y = interpolate(f, [a, a + 10], [30, 0], CLAMP);
        return <div key={v} style={{position: 'absolute', left: 1180, top: 300 + i * 130 + y, width: 660, opacity: o, padding: '18px 26px', borderRadius: 16, background: 'rgba(15,20,40,.7)', border: '2px solid rgba(126,194,255,.5)', font: `800 40px/1.2 ${font}`, color: '#fff'}}>▶ {v}</div>;
      })}
      <Fade from={24} to={34}><div style={{position: 'absolute', left: 0, right: 0, top: 36, textAlign: 'center', font: `900 100px/1 ${font}`, color: '#ff6b5e', textShadow: '0 8px 40px #000'}}>40 MINUTES LATER</div></Fade>
      <Vig o={0.65} />
      <KeyPhrases lines={KP_S08} />
      <SfxTrack cues={S08_SFX} />
    </AbsoluteFill>
  );
};

// ============================================================================================
// S09 THE RESULT: his manager calls him in. A new role. Nobody saw the ten pages.
// ============================================================================================
export const NS09: React.FC = () => (
  <AbsoluteFill style={{background: '#05060c'}}>
    <Cam keys={[{t: 0, x: 960, y: 560, z: 1.0}, {t: 14, x: 980, y: 540, z: 1.1}, {t: 22, x: 1100, y: 520, z: 1.35}, {t: 30, x: 1100, y: 520, z: 1.4}]}>
      <Plate name="manager" />
      <Furn name="desk" x={1200} y={FLOOR} w={760} />
      <Actor id="manager" pal="indigo" x={1420} y={FLOOR} h={690} drop={58} flip keys={[{t: 0, pose: 'sitUp', emo: 'neutral'}, {t: 14, pose: 'sitUp', emo: 'happy'}]} />
      <Actor id="green" pal="teal" x={760} y={FLOOR} h={780} keys={[{t: 0, pose: 'stand', emo: 'worried'}, {t: 14, pose: 'idle', emo: 'surprised'}, {t: 20, pose: 'idle', emo: 'happy'}]} />
      <Obj name="sparkle" x={1000} y={330} size={230} at={20} rot={6} />
    </Cam>
    <Light x={1000} y={520} r={820} color="rgba(255,210,120,.35)" />
    <Vig />
    <KeyPhrases lines={KP_S09} />
    <SfxTrack cues={S09_SFX} />
  </AbsoluteFill>
);

// ============================================================================================
// S10 DAY 365: same framing as the first shot: same room, same night, same man. Two counters tick up.
// ============================================================================================
export const NS10: React.FC = () => {
  const f = useCurrentFrame();
  const books = Math.floor(interpolate(f, [S(2), S(22)], [0, 20], CLAMP)), hours = Math.floor(interpolate(f, [S(2), S(22)], [0, 1000], CLAMP));
  return (
    <AbsoluteFill style={{background: '#05060c'}}>
      <Cam w={3840} keys={[{t: 0, x: MID, y: 560, z: 1.0}, {t: 30, x: MID, y: 560, z: 1.08}]}>
        <Plate name="two-lives" w={3840} h={1080} />
        <Light x={GX - 80} y={600} r={620} color="rgba(255,190,90,.5)" /><Light x={RX + 40} y={720} r={620} color="rgba(110,200,255,.42)" />
        <Obj name="lamp" x={LAMPX} y={700} size={440} float={0} />
        <GreenSeat x={GX} keys={[{t: 0, pose: 'sitRead', emo: 'happy', hold: {name: 'book-open', size: 130, dy: 4}}]} />
        <Obj name="book-tower" x={GX + 440} y={760} size={330} float={0} />
        <Furn name="nightstand" x={NSX} y={FLOOR} w={190} />
        <RedBed x={RX} keys={[{t: 0, pose: 'bedPhone', emo: 'tired', hold: {name: 'phone-lit', size: 140, dy: 6}}]} />
      </Cam>
      <div style={{position: 'absolute', left: 90, width: 760, top: 70, textAlign: 'center', font: `900 130px/1 ${font}`, color: '#7ee2a0', textShadow: '0 8px 40px #000'}}>{books}+<div style={{fontSize: 56}}>BOOKS</div></div>
      <div style={{position: 'absolute', left: 1070, width: 760, top: 70, textAlign: 'center', font: `900 130px/1 ${font}`, color: '#ff6b5e', textShadow: '0 8px 40px #000'}}>{hours.toLocaleString()}+<div style={{fontSize: 56}}>HOURS ON A SCREEN</div></div>
      <Vig />
      <KeyPhrases lines={KP_S10} />
      <SfxTrack cues={S10_SFX} />
    </AbsoluteFill>
  );
};

// ============================================================================================
// S11 THE TURN: that night he sees the photo, turns the phone face down and opens a book. The light warms.
// ============================================================================================
export const NS11: React.FC = () => {
  const f = useCurrentFrame();
  const warm = interpolate(f, [S(8), S(24)], [0, 1], CLAMP);
  return (
    <AbsoluteFill style={{background: '#05060c'}}>
      <Cam keys={[{t: 0, x: 960, y: 560, z: 1.0}, {t: 12, x: 980, y: 560, z: 1.18}, {t: 20, x: 1000, y: 520, z: 1.5}, {t: 27, x: 980, y: 540, z: 1.2}]}>
        <Plate name="cold-bedroom" />
        <Plate name="warm-study" opacity={warm} />
        <Light x={920} y={660} r={520} color={`rgba(${Math.round(110 + 145 * warm)},${Math.round(200 - 10 * warm)},${Math.round(255 - 165 * warm)},.5)`} />
        <RedBed x={880} keys={[
          {t: 0, pose: 'bedPhone', emo: 'tired', hold: {name: 'phone-lit', size: 140, dy: 6}},
          {t: 6, pose: 'bedSit', emo: 'surprised', hold: null}, {t: 10, pose: 'bedPhone', emo: 'worried', hold: {name: 'photo', size: 150, dy: 4}},
          {t: 16, pose: 'bedSit', emo: 'determined', hold: null}, {t: 21, pose: 'bedPhone', emo: 'determined', hold: {name: 'book-open', size: 130, dy: 4}},
          {t: 25, pose: 'bedPhone', emo: 'happy'},
        ]} />
      </Cam>
      <Vig />
      <KeyPhrases lines={KP_S11} />
      <SfxTrack cues={S11_SFX} />
    </AbsoluteFill>
  );
};

// ============================================================================================
// S12 END: the phone gives you a good night, the book a good life. Which one will you pick up?
// ============================================================================================
export const NS12: React.FC = () => {
  const f = useCurrentFrame();
  const endCard = interpolate(f, [S(11), S(13)], [0, 1], CLAMP);
  return (
    <AbsoluteFill style={{background: '#05060c'}}>
      <Cam w={3840} keys={[{t: 0, x: MID, y: 560, z: 1.0}, {t: 9, x: MID, y: 560, z: 1.12}, {t: 15, x: MID, y: 560, z: 1.2}]}>
        <Plate name="two-lives" w={3840} h={1080} />
        <Light x={GX - 80} y={600} r={620} color="rgba(255,190,90,.5)" /><Light x={RX + 40} y={720} r={620} color="rgba(110,200,255,.42)" />
        <Obj name="lamp" x={LAMPX} y={700} size={440} float={0} />
        <GreenSeat x={GX} keys={[{t: 0, pose: 'sitRead', emo: 'happy', hold: {name: 'book-open', size: 130, dy: 4}}]} />
        <Furn name="nightstand" x={NSX} y={FLOOR} w={190} />
        <RedBed x={RX} keys={[{t: 0, pose: 'bedPhone', emo: 'tired', hold: {name: 'phone-lit', size: 140, dy: 6}}]} />
        <Obj name="bubble-thought" x={MID} y={280} size={360} at={8.6} float={6} />
      </Cam>
      <Vig />
      <AbsoluteFill style={{background: '#05060c', opacity: endCard * 0.85}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', opacity: endCard, font: `900 150px/1.1 ${font}`, color: '#fff', textShadow: '0 10px 60px #000'}}>WHICH ONE?</div>
      <KeyPhrases lines={KP_S12} />
      <SfxTrack cues={S12_SFX} />
    </AbsoluteFill>
  );
};

