import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {AUDIO_FILE, AUDIO_ITEMS, CAPTIONS, FPS, ITEMS, Item} from './lib/timeline';
import {S02Frames, S03Frames} from './scenes/frames2';
import {S01Frames} from './scenes/frames';
import {SAME_SFX} from './data/sfx';
import {SfxTrack} from '../components/Sfx';
import {Music} from '../components/Music';

// ============================================================================================
// SAME MAN. SAME NIGHT. Step 0 = the ANIMATIC: the whole 8:02.8 cut list, your real narration, your captions, and one storyboard
// card per span. Scenes get replaced by the real animation one at a time (key = item.scene).
// ============================================================================================
const BG: Record<string, string> = {hold: '#232a38', audio: '#1d3a2d', dialogue: '#4a3a1f', montage: '#33284a', silence: '#0d0f14', end: '#000'};
const TAG: Record<string, string> = {hold: 'HOLD', audio: 'NARRATION', dialogue: 'DIALOGUE (recorded line)', montage: 'MONTAGE', silence: 'SILENCE', end: 'END CARD'};
const SANS = "Inter, 'Segoe UI', Arial, sans-serif", TITLE = "'Bebas Neue', Impact, sans-serif";

const Card: React.FC<{it: Item}> = ({it}) => {
  const f = useCurrentFrame(), t = f / FPS;
  return (
    <AbsoluteFill style={{background: BG[it.type], color: '#f3efe6', fontFamily: SANS, padding: '70px 90px'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
        <div style={{fontFamily: TITLE, fontSize: 120, letterSpacing: 3, lineHeight: 1}}>{it.scene.toUpperCase()}</div>
        <div style={{fontSize: 34, opacity: 0.75}}>{TAG[it.type]} · {it.outStart.toFixed(1)}–{it.outEnd.toFixed(1)}s</div>
      </div>
      <div style={{fontSize: 40, fontWeight: 700, marginTop: 30, opacity: 0.95}}>{it.label}</div>
      <div style={{fontSize: 36, marginTop: 36, lineHeight: 1.35, maxWidth: 1500}}><b style={{opacity: 0.6}}>PICTURE  </b>{it.visual}</div>
      {it.sfx && <div style={{fontSize: 28, marginTop: 18, opacity: 0.8}}><b style={{opacity: 0.6}}>SFX  </b>{it.sfx}</div>}
      {it.music && <div style={{fontSize: 28, marginTop: 10, opacity: 0.8}}><b style={{opacity: 0.6}}>MUSIC  </b>{it.music}</div>}
      {it.onScreenText && <div style={{position: 'absolute', left: 0, right: 0, top: 480, textAlign: 'center', fontFamily: TITLE, fontSize: 190, letterSpacing: 4, color: '#fff', textShadow: '0 6px 0 rgba(0,0,0,.5)'}}>{it.onScreenText}</div>}
      <div style={{position: 'absolute', left: 0, bottom: 0, height: 10, width: `${(t / (it.dur / FPS)) * 100}%`, background: '#ffd23f'}} />
    </AbsoluteFill>
  );
};

const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const c = CAPTIONS.find((x) => f >= x.from && f < x.to);
  if (!c) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 96, display: 'flex', justifyContent: 'center'}}>
      <div style={{background: 'rgba(8,8,12,.78)', borderRadius: 18, padding: '12px 30px', font: `700 46px/1.25 ${SANS}`, color: '#fff', maxWidth: 1500, textAlign: 'center'}}>{c.text}</div>
    </div>
  );
};

// scenes that are finished (key = scene name in timeline.json); everything else still shows its storyboard card
const SCENES: Record<string, React.FC<{items: Item[]; startSec: number}>> = {'S01 Hook': S01Frames, 'S02 The choice': S02Frames, 'S03 Night one': S03Frames};
const SPANS = Array.from(new Set(ITEMS.map((i) => i.scene))).map((scene) => {
  const items = ITEMS.filter((i) => i.scene === scene);
  return {scene, items, from: items[0].from, dur: items[items.length - 1].from + items[items.length - 1].dur - items[0].from, startSec: items[0].outStart};
});

export const SameMan: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {SPANS.map((sp) => {
      const C = SCENES[sp.scene];
      if (C) return <Sequence key={sp.scene} from={sp.from} durationInFrames={sp.dur}><C items={sp.items} startSec={sp.startSec} /></Sequence>;
      return sp.items.map((it) => <Sequence key={it.index} from={it.from} durationInFrames={it.dur}><Card it={it} /></Sequence>);
    })}
    {AUDIO_ITEMS.map((a) => (
      <Sequence key={'a' + a.index} from={a.from} durationInFrames={a.dur}>
        <Audio src={staticFile(AUDIO_FILE)} startFrom={Math.round(a.srcStart! * FPS)} endAt={Math.round(a.srcEnd! * FPS)} />
      </Sequence>
    ))}
    <Captions />
    <SfxTrack cues={SAME_SFX} />
    <Sequence from={0} durationInFrames={Math.round(86.9 * FPS)}><Music track="low" frames={Math.round(86.9 * FPS)} vol={0.16} fadeIn={60} fadeOut={90} /></Sequence>
  </AbsoluteFill>
);
