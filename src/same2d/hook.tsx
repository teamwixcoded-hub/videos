import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {AnimText, Cinema, Dust, SpeedLines, ramp} from './fx';
import {PhoneFeed, PhoneBook} from './inserts';
import {CoinReward, YearFlip} from './inserts2';
import {DIGI, FPS} from './theme';
import {Sfx3, Cue3} from './sound';
import {Music} from '../components/Music';
import {AUDIO_FILE} from '../same/lib/timeline';
import type {Api} from './part2';
import type {Ctx, R, SP} from './Same2D';

// ============================================================================================
// THE HOOK (first 10 s). It opens on something everyone knows: "The phone feels good, instantly." (the scroller, the coin pops out of the
// phone), then "The book does not feel good." (the reader frowning at the same line), and THEN the stakes: both faces morph from day 1 to day 365
// while a counter spins, "One year from now, these two men won't recognize each other." Silence, then one personal question.
// The three lines are cut straight out of the narration.
// ============================================================================================
export const HOOK_END = 10.0;
const VOICE: {at: number; from: number; to: number}[] = [
  {at: 0.35, from: 23.85, to: 26.6},     // "The phone feels good, instantly."
  {at: 3.2, from: 36.2, to: 38.3},       // "The book does not feel good."
  {at: 5.3, from: 18.95, to: 22.7},      // "One year from now, these two men won't recognize each other."
];

const HOOK_CUES: Cue3[] = [
  {file: 'heartbeat', at: 0.0, dur: 0.45, vol: 0.5},
  // the phone feels good
  {file: 'terminal_type', at: 0.4, dur: 1.7, vol: 0.22}, {file: 'phone_swipe', at: 1.2, vol: 0.16}, {file: 'phone_swipe', at: 1.65, vol: 0.16}, {file: 'phone_swipe', at: 2.1, vol: 0.16},
  {file: 'reward_pop', at: 1.4, vol: 0.3}, {file: 'reward_pop', at: 1.9, vol: 0.3}, {file: 'coin_ping', at: 2.25, vol: 0.4},
  {file: 'text_slam', at: 2.35, vol: 0.5}, {file: 'glitch_hit', at: 2.37, vol: 0.25},
  // the book does not
  {file: 'whip', at: 3.15, vol: 0.2}, {file: 'terminal_type', at: 3.25, dur: 1.8, vol: 0.22}, {file: 'page_turn', at: 4.3, vol: 0.2},
  // silence, then a year later
  {file: 'heartbeat', at: 5.1, dur: 0.3, vol: 0.55}, {file: 'decode_blips', at: 5.35, vol: 0.3}, {file: 'riser', at: 5.3, dur: 3.0, vol: 0.4, fadeOut: 0.05},
  {file: 'counter_whir', at: 5.45, dur: 1.3, vol: 0.35}, {file: 'page_flutter', at: 5.4, vol: 0.3}, {file: 'whip', at: 6.9, vol: 0.2}, {file: 'whip', at: 7.5, vol: 0.2},
  {file: 'text_slam', at: 8.1, vol: 0.55}, {file: 'flash_boom', at: 8.1, vol: 0.3}, {file: 'glitch_hit', at: 8.12, vol: 0.25}, {file: 'whip', at: 8.4, vol: 0.2}, {file: 'whip', at: 8.7, vol: 0.2},
  // the question
  {file: 'text_title', at: 9.1, vol: 0.55}, {file: 'hud_scan', at: 9.2, vol: 0.3}, {file: 'heartbeat', at: 9.0, dur: 1.0, vol: 0.4},
  {file: 'whoosh_soft', at: 9.6, vol: 0.2}, {file: 'flash_boom', at: 9.95, vol: 0.3},
];

export const makeHook = (api: Api): React.FC => {
  const {B, sP, rB, sFace, rFace, K} = api;
  const D = {bloom: 1, thorn: 1, vines: 1, books: 20, notes: 14, clutter: 1};
  const gaunt: SP = {mode: 'phone', tee: '#7d6f99', lids: 0.62, smile: 0, brow: -0.4, browTilt: 14, glow: 1.3};
  // the same two men on day 1 and on day 365, in the same framing, so one face can melt into the other
  const scD1 = B(...sFace(2.2, 2.4), () => ({s: sP({lids: 0.3, glow: 1.1, smile: 0.05}), r: null}));
  const scD365 = B(...sFace(2.2, 2.4), () => ({s: gaunt, r: null, ...D, sat: 0.7}));
  const rdD1 = B(...rFace(2.2, 2.4), () => ({r: rB({smile: 0.2, lids: 0.15}), s: null}));
  const rdD365 = B(...rFace(2.2, 2.4), () => ({r: rB({smile: 0.7, lids: 0.08}), s: null, ...D, glowR: 1.3}));
  const morph = (a: R, b: R, from: number, to: number): R => (c) => {
    const k = ramp(c.t, from, to);
    return (
      <div style={{position: 'absolute', inset: 0}}>
        <div style={{position: 'absolute', inset: 0, opacity: 1 - k}}>{a(c)}</div>
        <div style={{position: 'absolute', inset: 0, opacity: k}}>{b(c)}</div>
        {k > 0 && k < 1 && <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: Math.sin(k * Math.PI) * 0.35}} />}
      </div>
    );
  };
  const flashS = (z: number) => B(...sFace(z, z + 0.3), () => ({s: gaunt, r: null, ...D, sat: 0.7}));
  const flashR = (z: number) => B(...rFace(z, z + 0.3), () => ({r: rB({smile: 0.8, lids: 0.08}), s: null, ...D, glowR: 1.3}));
  const dayS = B(...sFace(2.6, 2.9), () => ({s: sP({lids: 0.4, glow: 1.4, smile: 0}), r: null}));
  const dayR = B(...rFace(2.6, 2.9), () => ({r: rB({smile: 0.3, lids: 0.12}), s: null, glowR: 1.3}));
  const shots: [number, number, R][] = [
    // 1. the phone feels good, instantly
    [0.3, 1.15, B(...sFace(2.4, 2.7), () => ({s: sP({smile: 0.7, lids: 0.12, glow: 1.4}), r: null}))],
    [1.15, 2.2, (c: Ctx) => <PhoneFeed t={c.l} speed={1.5} />],
    [2.2, 3.1, (c: Ctx) => <CoinReward t={c.l} />],
    // 2. the book does not
    [3.2, 4.1, B(...rFace(2.2, 2.4), () => ({r: rB({brow: -0.5, browTilt: -10, smile: 0, lids: 0.2}), s: null}))],
    [4.1, 5.1, B(K.EYES_R[0], K.EYES_R[1], () => ({r: rB({brow: -0.5, browTilt: -10, smile: 0, lids: 0.2}), s: null}))],
    // 3. one year from now
    [5.3, 6.9, (c: Ctx) => <YearFlip t={c.l} dur={1.5} />],
    [6.9, 7.5, scD365],
    [7.5, 8.1, rdD365],
    [8.1, 8.4, flashS(3.0)], [8.4, 8.7, flashR(3.0)], [8.7, 9.05, flashS(3.5)],
    // 4. which one are you
    [9.1, 9.37, dayS], [9.37, 9.64, dayR], [9.64, 9.92, dayS], [9.92, 10.0, dayR],
    [9.9, 10.0, dayR],
  ];
  const book = (c: Ctx) => <div style={{position: 'absolute', inset: 0, filter: 'brightness(.85)'}}><PhoneBook t={c.l + 3} hover={1} /></div>;
  void book;
  return () => {
    const frame = useCurrentFrame(), t = frame / FPS;
    const i = shots.findIndex((s) => t >= s[0] && t < s[1]);
    const shot = i >= 0 ? shots[i] : null;
    const c: Ctx | null = shot ? {t, l: t - shot[0], d: shot[1] - shot[0], p: (t - shot[0]) / (shot[1] - shot[0]), from: shot[0]} : null;
    const cutFlash = shot ? Math.max(0, 1 - (t - shot[0]) / 0.1) * 0.35 : 0;
    const beat = [0.1, 5.12].reduce((m, h) => (t >= h && t < h + 0.35 ? Math.max(m, 1 - (t - h) / 0.35) : m), 0);
    const bars = 110 * (1 - ramp(t, HOOK_END - 0.6, HOOK_END - 0.05));
    const flashEnd = ramp(t, HOOK_END - 0.2, HOOK_END);
    const T = (from: number, to: number) => ({f: (t - from) * FPS, out: ramp(t, to - 0.2, to), on: t >= from && t < to});
    const tA = T(0.4, 2.3), tB = T(2.35, 3.15), tC = T(3.25, 5.05), tD = T(5.35, 6.9), tE = T(6.95, 8.1), tF = T(8.1, 9.05), tG = T(9.1, 9.98);
    // the day counter spins from DAY 1 to DAY 365 as each face changes
    const spinning = (t >= 5.3 && t < 8.1);
    const dayN = t < 6.9 ? Math.max(1, Math.round(365 * ramp(t, 5.45, 6.75))) : 365;
    return (
      <AbsoluteFill style={{background: '#000'}}>
        <AbsoluteFill>{c && shot ? shot[2](c) : null}</AbsoluteFill>
        <AbsoluteFill style={{background: 'rgba(60,110,190,.18)', mixBlendMode: 'soft-light'}} />
        <Cinema t={t} />
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 45%, rgba(0,0,0,.65) 100%)'}} />
        <Dust t={t} dense />
        {cutFlash > 0 && <AbsoluteFill style={{background: '#fff', opacity: cutFlash}} />}
        {beat > 0 && <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(255,40,60,0), rgba(255,40,60,.5))', opacity: beat * 0.6}} />}
        {spinning && <div style={{position: 'absolute', left: 150, top: 135, fontFamily: DIGI, fontWeight: 700, color: '#fff', textShadow: '0 0 30px rgba(120,220,255,.6), 0 8px 22px rgba(0,0,0,.6)', lineHeight: 1}}>
          <div style={{fontSize: 40, letterSpacing: 12, color: '#7fe9ff'}}>DAY</div><div style={{fontSize: 170}}>{dayN}</div>
        </div>}
        {tA.on && <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 175}}><AnimText text="THE PHONE FEELS GOOD," f={tA.f} size={84} mode="whisper" out={tA.out} /></AbsoluteFill>}
        {tB.on && <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 150}}><AnimText text="INSTANTLY." f={tB.f} size={150} mode="slam" accent={[0]} out={tB.out} /></AbsoluteFill>}
        {tC.on && <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 175}}><div style={{maxWidth: 1600}}><AnimText text="THE BOOK DOES NOT FEEL GOOD." f={tC.f} size={84} mode="whisper" out={tC.out} /></div></AbsoluteFill>}
        {tD.on && <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 175}}><AnimText text="ONE YEAR LATER" f={tD.f} size={110} mode="pop" out={tD.out} /></AbsoluteFill>}
        {tE.on && <AbsoluteFill style={{alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 160}}><AnimText text="THESE TWO MEN" f={tE.f} size={120} mode="pop" out={tE.out} /></AbsoluteFill>}
        {tF.on && <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}><div style={{maxWidth: 1500}}><AnimText text="WON'T RECOGNIZE EACH OTHER." f={tF.f} size={116} mode="slam" accent={[2, 3]} out={tF.out} /></div></AbsoluteFill>}
        {tG.on && <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}><div style={{maxWidth: 1600}}><AnimText text="WHICH ONE ARE YOU?" f={tG.f} size={140} mode="title" accent={[3, 4]} out={0} /></div></AbsoluteFill>}
        {t >= 9.1 && t < 9.35 && <SpeedLines o={1 - (t - 9.1) / 0.25} />}
        <AbsoluteFill style={{background: '#fff', opacity: flashEnd}} />
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: bars, background: '#000'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: bars, background: '#000'}} />
        {VOICE.map((v, k) => <Sequence key={k} from={Math.round(v.at * FPS)}><Audio src={staticFile(AUDIO_FILE)} startFrom={Math.round(v.from * FPS)} endAt={Math.round(v.to * FPS)} /></Sequence>)}
        <Sfx3 cues={HOOK_CUES} gain={0.5} duck={(t) => (VOICE.some((v) => t >= v.at - 0.05 && t <= v.at + (v.to - v.from) + 0.1) ? 0.35 : 1)} />
        <Sequence from={0} durationInFrames={Math.round(HOOK_END * FPS)}><Music track="low" frames={Math.round(HOOK_END * FPS)} vol={0.08} fadeIn={20} fadeOut={20} /></Sequence>
      </AbsoluteFill>
    );
  };
};
