import React from 'react';
import {useCurrentFrame} from 'remotion';
import {STICK_POSES as P} from '../Stick';
import {PKey, easeInOut, ramp, clamp01, mix} from '../lib/anim';
import {Item, srcToVideo, FPS} from '../lib/timeline';
import {Actor, Armchair, Bed, DayTag, FLOOR, GREEN, Label, Pops, ReaderRoom, RED, ScrollerRoom, TitleCard, INK} from '../world';

// Scenes S01 Hook, S02 The choice, S03 Night one. Times: `A(src)` = recording second -> seconds on THIS scene's clock.
export type SceneProps = {items: Item[]; startSec: number};
export const useClock = (startSec: number) => {
  const f = useCurrentFrame(), t = f / FPS;
  return {t, A: (src: number) => (srcToVideo(src) ?? 0) - startSec, f};
};

// ---- the stage: a reader cell (left) and a scroller cell (right) that slide apart on `p` ------------
export const Stage: React.FC<{p: number; zl?: number; zr?: number; focusL?: [number, number]; focusR?: [number, number]; left: (cx: number) => React.ReactNode; right: (cx: number) => React.ReactNode; vignette?: boolean}> = ({p, zl = 1, zr = 1, focusL, focusR, left, right}) => {
  const cl = 480 * p, cr = 960 + 480 * p, split = 960 * p;
  const cam = (c: number, z: number, fx: number, fy: number) => `translate(${c} 560) scale(${z}) translate(${-fx} ${-fy})`;
  return (
    <svg viewBox="0 0 1920 1080" width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
      <defs>
        <clipPath id="clipL"><rect x={0} y={0} width={Math.max(0, split)} height={1080} /></clipPath>
        <clipPath id="clipR"><rect x={split} y={0} width={1920 - split} height={1080} /></clipPath>
        <radialGradient id="vig" cx="50%" cy="50%" r="75%"><stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.62" /></radialGradient>
      </defs>
      <g clipPath="url(#clipR)"><g transform={cam(cr, zr, focusR?.[0] ?? cr, focusR?.[1] ?? 560)}>{right(cr)}</g></g>
      {p > 0.002 && <g clipPath="url(#clipL)"><g transform={cam(cl, zl, focusL?.[0] ?? cl, focusL?.[1] ?? 560)}>{left(cl)}</g></g>}
      {p > 0.002 && p < 0.999 || p >= 0.999 ? <g><rect x={split - 3} y={0} width={6} height={1080} fill="#f6efe0" opacity={0.9} /><rect x={split - 14} y={0} width={28} height={1080} fill="#f6efe0" opacity={0.08} /></g> : null}
      <rect width={1920} height={1080} fill="url(#vig)" pointerEvents="none" />
    </svg>
  );
};

const READER_X = (cx: number) => cx - 40, SCROLLER_X = (cx: number) => cx + 120;
const WARM = '#ffb347', COLD = '#6fb6ff';
export const Grade: React.FC<{p: number}> = ({p}) => (
  <svg viewBox="0 0 1920 1080" width="1920" height="1080" style={{position: 'absolute', inset: 0, pointerEvents: 'none', mixBlendMode: 'soft-light'}}>
    <rect x={0} y={0} width={960 * p} height={1080} fill={WARM} opacity={0.22} />
    <rect x={960 * p} y={0} width={1920 - 960 * p} height={1080} fill={COLD} opacity={0.2} />
  </svg>
);

// ============================================================================================ S01 HOOK
export const S01Hook: React.FC<SceneProps> = ({startSec}) => {
  const {t, A} = useClock(startSec);
  const tSplit = A(11.5);
  const p = easeInOut((t - tSplit) / 1.0);
  const zoom = mix(1.0, 1.22, ramp(t, 0, tSplit + 0.2)) * (1 - 0.1 * p);
  const fade = clamp01(t / 1.0);
  const sc: PKey[] = [
    {t: 0, pose: P.bedEdgeSlump}, {t: A(13.4), pose: P.bedEdgePhone, dur: 1.0}, {t: A(19.0), pose: P.bedEdgeLookUp, dur: 0.9},
  ];
  const rd: PKey[] = [
    {t: 0, pose: P.armchairSlump}, {t: A(16.14), pose: P.armchairBookClosed, dur: 0.9}, {t: A(17.5), pose: P.armchairBook, dur: 0.8}, {t: A(19.0), pose: P.armchairLookUp, dur: 0.9},
  ];
  const titleT = t - 23.2;       // video 25.7 s: the title card
  return (
    <div style={{position: 'absolute', inset: 0, background: '#05060b'}}>
      <div style={{position: 'absolute', inset: 0, opacity: fade}}>
        <Stage p={p} zr={zoom} zl={1.12}
          focusR={[SCROLLER_X(960 + 480 * p) - 120, 640]} focusL={[READER_X(480 * p) + 60, 640]}
          right={(cx) => (<><ScrollerRoom cx={cx} id="s1" clock="11:40" />
            <Actor id="sc1" accent={RED} keys={sc} t={t} x={SCROLLER_X(cx)} flip behind={<Bed />} scroll={t > A(14.2) && t < A(19)} /></>)}
          left={(cx) => (<><ReaderRoom cx={cx} id="r1" />
            <Actor id="rd1" accent={GREEN} keys={rd} t={t} x={READER_X(cx)} seed={1.3} behind={<Armchair />} /></>)} />
        <Grade p={p} />
      </div>
      {titleT > 0 && <svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}><TitleCard words={['ONE', 'HABIT.']} t={titleT} /></svg>}
    </div>
  );
};

// ============================================================================================ S02 THE CHOICE
export const S02Choice: React.FC<SceneProps> = ({startSec}) => {
  const {t, A} = useClock(startSec);
  const pops = [A(27.1), A(28.0), A(28.9), A(31), A(33.3)];
  const glance = A(41.4), yawn = A(42.6), dlg = 51.1 - startSec;
  const sc: PKey[] = [{t: 0, pose: P.bedEdgePhone}, {t: dlg, pose: P.bedEdgePhone}];
  const rd: PKey[] = [
    {t: 0, pose: P.armchairBook}, {t: glance, pose: P.armchairLookUp, dur: 0.5}, {t: glance + 1.2, pose: P.armchairBook, dur: 0.6},
    {t: yawn, pose: P.armchairYawn, dur: 0.5}, {t: yawn + 1.5, pose: P.armchairBook, dur: 0.6},
    {t: dlg, pose: P.armchairSlump, dur: 0.7},
  ];
  const hand = (t / 60) * Math.PI * 2 * 12;
  const bubble = clamp01(ramp(t, dlg + 0.2, dlg + 0.6));
  return (
    <div style={{position: 'absolute', inset: 0, background: '#05060b'}}>
      <Stage p={1} zr={1.12} zl={1.12}
        focusR={[SCROLLER_X(1440) - 120, 640]} focusL={[READER_X(480) + 60, 640]}
        right={(cx) => (<><ScrollerRoom cx={cx} id="s2" clock="11:40" />
          <Actor id="sc2" accent={RED} keys={sc} t={t} x={SCROLLER_X(cx)} flip behind={<Bed />} scroll front={<Pops times={pops.filter((x) => x > 0)} t={t} at={[130, -300]} />} /></>)}
        left={(cx) => (<><ReaderRoom cx={cx} id="r2" clockHand={hand} />
          <Actor id="rd2" accent={GREEN} keys={rd} t={t} x={READER_X(cx)} seed={1.3} behind={<Armchair />} readSweep={t < glance || (t > glance + 1.8 && t < yawn) || (t > yawn + 2.1 && t < dlg)} /></>)} />
      <Grade p={1} />
      {t > dlg && (
        <svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
          <g opacity={bubble} transform={`translate(340 330) scale(${0.85 + 0.15 * bubble})`}>
            <path d="M0,0 h330 a26,26 0 0 1 26,26 v70 a26,26 0 0 1 -26,26 h-210 l-34,38 l4,-38 h-90 a26,26 0 0 1 -26,-26 v-70 a26,26 0 0 1 26,-26 z" fill="#f6efe0" stroke={INK} strokeWidth={6} />
            <text x={178} y={72} textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight={800} fontSize={30} fill={INK}>Who even reads</text>
            <text x={178} y={108} textAnchor="middle" fontFamily="Inter, Arial, sans-serif" fontWeight={800} fontSize={30} fill={INK}>anymore…</text>
          </g>
        </svg>
      )}
    </div>
  );
};

// ============================================================================================ S03 NIGHT ONE
const Bus: React.FC<{cx: number; t: number}> = ({cx, t}) => (
  <g>
    <rect x={cx - 560} y={0} width={1120} height={FLOOR} fill="#24303d" />
    <rect x={cx - 560} y={FLOOR} width={1120} height={200} fill="#161b22" />
    <rect x={cx - 520} y={170} width={560} height={300} rx={14} fill="#0d1620" stroke={INK} strokeWidth={9} />
    {/* buildings sliding past the window */}
    <clipPath id="busWin"><rect x={cx - 516} y={174} width={552} height={292} rx={10} /></clipPath>
    <g clipPath="url(#busWin)">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const w = 90 + ((i * 37) % 60), x = cx - 520 + ((i * 140 - t * 160) % 1120 + 1120) % 1120 - 140; return <g key={i}><rect x={x} y={470 - (150 + ((i * 53) % 110))} width={w} height={150 + ((i * 53) % 110)} fill="#1a2a3d" /><rect x={x + 14} y={470 - (150 + ((i * 53) % 110)) + 18} width={14} height={14} fill="#f2c36a" opacity={0.7} /></g>; })}
    </g>
    <rect x={cx + 90} y={FLOOR - 30} width={260} height={24} rx={8} fill="#3a4a5c" stroke={INK} strokeWidth={7} />
    <path d={`M${cx + 330},120 V${FLOOR}`} stroke="#b9c3cf" strokeWidth={14} />
  </g>
);
export const BusSeat: React.FC = () => (
  <g>
    <rect x={-150} y={-330} width={92} height={240} rx={26} fill="#3b6a7a" stroke={INK} strokeWidth={8} />
    <rect x={-150} y={-122} width={230} height={48} rx={14} fill="#4a8396" stroke={INK} strokeWidth={8} />
    <rect x={-120} y={-74} width={20} height={74} fill="#2a2f36" />
  </g>
);

export const S03Night: React.FC<SceneProps> = ({startSec}) => {
  const {t, A} = useClock(startSec);
  const clockT = A(49.5), shut = A(52.9), bored = A(59.94), bill = A(67.6), night2 = A(69.56), night3 = A(72.6);
  // the nightstand clock races from 11:40 to 2:00 over 2.5 s starting at clockT
  const mins = Math.round(mix(23 * 60 + 40, 26 * 60, easeInOut((t - clockT) / 2.6)));
  const hh = Math.floor(mins / 60) % 24, mm = mins % 60;
  const clockTxt = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  const bigClock = t > clockT && t < clockT + 5.4;
  const rd: PKey[] = [
    {t: 0, pose: P.armchairBook}, {t: shut - 0.8, pose: P.armchairSlump}, {t: shut, pose: P.armchairBookClosed, dur: 0.5},
    {t: bored, pose: P.armchairBookClosed, dur: 0.8}, {t: night2, pose: P.armchairBookClosed, dur: 0.6}, {t: night3, pose: P.armchairBook, dur: 0.6},
  ];
  const sc: PKey[] = [{t: 0, pose: P.bedEdgePhone}, {t: bored, pose: {...P.bedEdgePhone, face: 'happy', lean: 6, headTilt: 14}, dur: 0.9}, {t: night2, pose: P.bedEdgePhone, dur: 0.8}];
  const onBus = t > night3;
  const label = t > night3 ? 'NIGHT 3' : t > night2 ? 'NIGHT 2' : 'NIGHT 1';
  const hand = 0;
  return (
    <div style={{position: 'absolute', inset: 0, background: '#05060b'}}>
      <Stage p={1} zr={1.12} zl={1.12}
        focusR={[SCROLLER_X(1440) - 120, 640]} focusL={[READER_X(480) + 60, 640]}
        right={(cx) => (<><ScrollerRoom cx={cx} id="s3" clock={clockTxt} showBill={t > bill ? 1 + Math.floor(ramp(t, bill, bill + 3) * 2) : 0} />
          <Actor id="sc3" accent={RED} keys={sc} t={t} x={SCROLLER_X(cx)} flip behind={<Bed />} scroll />
        </>)}
        left={(cx) => (onBus ? (<><Bus cx={cx} t={t} />
            <Actor id="rd3b" accent={GREEN} keys={rd} t={t} x={READER_X(cx)} seed={1.3} behind={<BusSeat />} readSweep />
          </>) : (<><ReaderRoom cx={cx} id="r3" clockHand={hand + (t > clockT ? (t - clockT) * 0.9 : 0)} />
            <Actor id="rd3" accent={GREEN} keys={rd} t={t} x={READER_X(cx)} seed={1.3} behind={<Armchair />} readSweep={t < shut - 0.9} />
          </>))} />
      <Grade p={1} />
      <svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
        <DayTag text={label} t={t} at={0.2} />
        {bigClock && <Label text={t > clockT + 2.6 ? '2:00 AM' : clockTxt.replace(/^0/, '')} x={960} y={520} t={t} at={clockT} until={clockT + 5.2} size={170} color="#ffd23f" />}
      </svg>
    </div>
  );
};
