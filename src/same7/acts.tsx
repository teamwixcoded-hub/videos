import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {R, Ctx} from '../same2d/Same2D';
import {Person, SC2} from '../same2d/part2';
import {ClockInsert, PhoneFeed, TeaPour, PlanterInsert} from '../same2d/inserts';
import {CoinReward, SearchPhone, ChatPhone, FeedPhoto, PhoneFaceDown, NodeNetwork, IconGrid, BillInsert, YearFlip, EndCard} from '../same2d/inserts2';
import {ramp} from '../same2d/fx';
import {TypeSearch, TenRing} from './inserts';
import {TableScene, BookPageOne, BookOpening} from './book';
import {BookRead, PullGauge, NestedPhones, CountCard, Choice, CommentCard} from './inserts2';
import type {TW, StampT} from '../fathers/type';
import type {Cue3} from '../same2d/sound';
import {T, TA, FULL_TOTAL} from './timeline';

// ============================================================================================
// SAME MAN v2, ACTS 4 to 16 (64 s to the end), every shot placed on its words (docs/same-man-v2-plan.md). `k` is the kit of building blocks exported by Same2D / part2.
// ============================================================================================
type Fx = 'w' | 'f' | 'b';
export type Entry = [number, Fx | undefined, R];

export const buildActs = (k: any): Entry[] => {
  const {B, K, WIDE, camS, camR, sFace, rFace, sP, rB, D365, gaunt, kit, bath, bedScene} = k;
  const {kitE, kitWide, meet, offW, dine, resW, mgr, mgW, OF} = SC2;
  const fog = (r: R, o = 0.45): R => (c) => (<AbsoluteFill>{r(c)}<AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(255,255,255,.55), rgba(215,222,255,.3))', opacity: o, mixBlendMode: 'screen', filter: 'blur(18px)'}} /></AbsoluteFill>);
  const D = {...D365, books: 20, notes: 14, clutter: 1};
  const bedN = (extra: object = {}) => ({s: sP({mode: 'rest', lids: 0.4, smile: 0, glow: 0.3}), r: null, glowS: 0.3, ...extra});
  // one man, two ghosts that slide together and become one
  const Merge: R = (c) => {
    const e = ramp(c.l, 0.2, 1.6);
    return (
      <AbsoluteFill style={{background: '#0b0d1a'}}>
        {[-1, 1].map((s) => <AbsoluteFill key={s} style={{transform: `translateX(${s * (1 - e) * 120}px)`, opacity: s < 0 ? 1 : 0.55, mixBlendMode: s < 0 ? 'normal' : 'screen'}}>{bedScene(c, {cam: sFace(2.4, 2.6), s: sP({mode: 'rest', lids: 0.2, glow: 0.3}), r: null})}</AbsoluteFill>)}
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(255,246,214,.5), rgba(0,0,0,0) 55%)', opacity: e, mixBlendMode: 'screen'}} />
      </AbsoluteFill>
    );
  };
  const mgDesk: R = OF(offW[0], offW[1], (c: Ctx) => <Person k="man" x={1250} y={690} pitch={4} face={{smile: 0.1, lids: 0.25}} hn={[190, -44]} hf={[240, -44]} t={c.t} seed={0.7} />);
  const sunk = sFace(2.0, 2.2);
  const tDown = T('he turns the phone face down');

  const L: Entry[] = [
    // ===== ACT 4: NIGHT 1 (64 to 111) =====
    [T('the phone is easy'), 'w', B(...camS(1.5, 1.7, 420), () => ({s: sP({raise: 1, glow: 1.1, smile: 0.1}), r: null}))],
    [T('one video'), undefined, (c: Ctx) => <PhoneFeed t={c.l} />],
    [T('each one short'), undefined, B(K.HANDS_S[0], K.HANDS_S[1], () => ({s: sP(), r: null}), true)],
    [T('bright'), undefined, (c: Ctx) => <PhoneFeed t={c.l + 1.5} speed={1.5} />],
    [T('every swipe'), 'f', (c: Ctx) => <CoinReward t={c.l} />],
    [T('and asks for nothing'), undefined, B(...sFace(2.4, 2.6), () => ({s: sP({lids: 0.4, glow: 1.2, smile: 0.1}), r: null}))],
    [T('the book is hard'), 'w', B(...camR(1.5, 1.7), () => ({r: rB({lids: 0.35, smile: 0}), s: null, glowR: 1.1}))],
    [T('the first page'), undefined, (c: Ctx) => <BookPageOne t={c.l} />],
    [T('he reads the same line'), undefined, (c: Ctx) => <BookRead t={c.l} passes={2} per={1.0} />],
    [T('he checks the clock'), undefined, () => <ClockInsert text="11:48" />],
    [T('he yawns'), undefined, B(...rFace(2.2, 2.4), () => ({r: rB({lids: 0.5, open: 0.9, smile: 0}), s: null}))],
    [T('who even reads'), undefined, B(...rFace(2.0, 2.2), () => ({r: rB({lids: 0.3, smile: 0, brow: -0.2, browTilt: -6}), s: null}))],
    [T('at 200', 1), 'w', () => <ClockInsert text="2:00" />],
    [T('the phone finally'), undefined, B(...camS(1.3, 1.45), (c: Ctx) => ({s: sP({lids: 0.5, glow: Math.max(0, 1.2 - c.l * 0.7)}), r: null, glowS: Math.max(0.1, 1 - c.l * 0.4)}))],
    [T("he doesn't remember"), undefined, B(...sFace(2.2, 2.4), () => ({s: sP({mode: 'rest', lids: 0.5, smile: 0, glow: 0}), r: null, dim: 0.3}))],
    [T('in the chair he closed'), 'w', B(...camR(1.4, 1.55), () => ({r: rB({mode: 'shut', smile: 0.3}), s: null}))],
    [T('at 10 pages'), undefined, (c: Ctx) => <BookPageOne t={c.l} left="9" right="10" />],
    [T('and was asleep'), undefined, B(...rFace(2.2, 2.4), () => ({r: rB({mode: 'rest', lids: 0.95, smile: 0.3}), s: null, glowR: 0.5}))],
    [T('ten pages'), undefined, B(...WIDE, () => ({s: null, r: rB({mode: 'rest', lids: 0.9}), dim: 0.35}))],
    [T("it doesn't feel like anything"), undefined, B(K.LAMP[0], K.LAMP[1], () => ({s: null, r: rB({mode: 'rest'})}), true)],
    [T("but here's what nobody"), undefined, B([1600, 500, 0.6], [1600, 505, 0.68], () => ({s: sP({mode: 'rest', glow: 0.3}), r: rB({mode: 'rest'}), dim: 0.2}))],
    [T("every night you're planting"), undefined, (c: Ctx) => <PlanterInsert t={c.l} bloom={0} thorn={0} drop={[{at: 1.0, side: 'L'}, {at: 1.5, side: 'R'}]} />],
    [T("you just don't get"), undefined, (c: Ctx) => <PlanterInsert t={c.l} bloom={0.06} thorn={0} drop={[]} />],
    // ===== ACT 5: DAY 5 (112 to 136) =====
    [T('day five'), 'w', B(...WIDE, () => ({day: true, s: sP({mode: 'rest', glow: 0.3}), r: rB({mode: 'rest'})}))],
    [T('in bed the mornings'), undefined, B(...camS(1.2, 1.35), () => ({day: true, s: sP({lids: 0.6, glow: 0.6}), r: null, sat: 0.7}))],
    [T('the alarm'), 'w', () => <ClockInsert text="7:00" />],
    [T('snooze'), undefined, () => <ClockInsert text="7:09" />],
    [T('snooze again'), undefined, () => <ClockInsert text="7:18" />],
    [T('a rushed shower'), undefined, bath()],
    [T('a coffee he drinks'), undefined, kit()],
    [T('everything feels'), undefined, fog(B(...sFace(2.2, 2.4), () => ({day: true, s: sP({lids: 0.6, glow: 0.5, smile: 0}), r: null, sat: 0.6})))],
    [T('in the chair the mornings'), 'w', B(...camR(1.3, 1.45), () => ({day: true, r: rB({smile: 0.4, lids: 0.1}), s: null}))],
    [T('he wakes up'), undefined, () => <ClockInsert text="6:58" />],
    [T('and 10 pages'), undefined, B(...camR(1.2, 1.3), () => ({day: true, r: rB({smile: 0.4}), s: null, books: 1}))],
    [T('then 50'), undefined, B(...camR(1.2, 1.3), () => ({day: true, r: rB({smile: 0.5}), s: null, books: 3, notes: 2}))],
    [T('then a whole book'), undefined, (c: Ctx) => <BookPageOne t={c.l} left="311" right="THE END" />],
    // ===== ACT 6: DAY 21 (137 to 165) =====
    [T('day 21'), 'w', B(...WIDE, () => ({day: true, s: sP({mode: 'rest', glow: 0.4}), r: rB({mode: 'rest'}), bloom: 0.1}))],
    [T('his mother calls'), undefined, kitE(kitWide[0], kitWide[1], {mom: 900, phone: true})],
    [T("your food's getting cold"), undefined, kitE([1030, 100, 1.5], [1050, 96, 1.65], {mom: 960, momTalk: 1, momFace: {smile: 0, brow: 0.3, browTilt: 8}})],
    [T("in bed he doesn't look up"), 'w', B(...sFace(2.2, 2.4), () => ({s: sP({lids: 0.65, smile: 0, brow: -0.4, browTilt: 10, glow: 1}), r: null}))],
    [T("i said i'm coming"), undefined, kitE([1530, 270, 1.7], [1530, 266, 1.85], {snap: true, scTalk: 1, scFace: {lids: 0.1, brow: -0.7, browTilt: -16, smile: 0}})],
    [T('ten more minutes'), undefined, () => <ClockInsert text="10 MIN" />],
    [T('then 20'), undefined, () => <ClockInsert text="20 MIN" />],
    [T('the food goes cold'), undefined, kitE(kitWide[0], kitWide[1], {mom: 700, momFace: {smile: 0, lids: 0.3}, scFace: {lids: 0.5}})],
    [T('in the chair he looks up'), 'w', B(...rFace(2.0, 2.2), (c: Ctx) => ({day: true, r: rB({brow: 0.9, lids: 0, smile: 0.2, gaze: [0.4, c.l * 0.1]}), s: null}))],
    [T('he closes the book and goes'), undefined, kitE(kitWide[0], kitWide[1], {mom: 900, phone: false, momFace: {smile: 0.5}, scFace: {lids: 0.1, smile: 0.5, brow: 0.2}})],
    [T('three weeks ago'), undefined, kitE([760, 120, 1.7], [740, 116, 1.8], {mom: 700, momFace: {smile: 0, lids: 0.4, browTilt: 14, brow: 0.4}})],
    [T('something small has started'), 'b', (c: Ctx) => <PlanterInsert t={c.l} bloom={0.15} thorn={0.12} drop={[]} />],
    [T('on one windowsill'), undefined, (c: Ctx) => <PlanterInsert t={c.l} bloom={0.25} thorn={0} drop={[]} />],
    [T('on the other a pale'), undefined, (c: Ctx) => <PlanterInsert t={c.l} bloom={0.25} thorn={0.28} drop={[]} />],
    // ===== ACT 7: DAY 40 (166 to 184) =====
    [T('day 40'), 'w', B(...WIDE, () => ({day: true, s: sP({glow: 0.8}), r: rB(), bloom: 0.25, thorn: 0.2, books: 3}))],
    [T('at work a colleague'), undefined, meet(offW[0], offW[1])],
    [T('since when do you talk'), undefined, meet([2150, 430, 1.4], [2150, 424, 1.5], {coTalk: 1, co: {brow: 0.8, browTilt: 6, smile: 0.1}})],
    [T('he laughs'), undefined, meet([1330, 430, 1.6], [1330, 424, 1.7], {rd: {smile: 1, open: 0.6, lids: 0.2}})],
    [T('since chapter 12'), undefined, meet([1330, 430, 1.55], [1330, 424, 1.65], {rdTalk: 1, rd: {smile: 0.3}})],
    [T("that's the strange thing"), 'w', B(...camR(1.4, 1.55), () => ({day: true, r: rB({smile: 0.3}), s: null, books: 3}))],
    [T("it doesn't just fill"), undefined, B(...rFace(2.0, 2.2), () => ({r: rB({smile: 0.3, lids: 0.1}), s: null, books: 3}))],
    [T('it changes how you talk'), undefined, meet([1330, 430, 1.5], [1330, 424, 1.6], {rdTalk: 1, rd: {smile: 0.4}})],
    [T('how you listen'), undefined, meet([2150, 430, 1.4], [2150, 424, 1.5], {coTalk: 1, co: {smile: 0.3}})],
    [T('how you think'), undefined, B(...rFace(2.0, 2.2), () => ({r: rB({lids: 0.25, brow: 0.5, smile: 0.2, gaze: [0.3, 0.5]}), s: null, books: 3}))],
    [T("when nobody's watching"), undefined, B(K.LAMP[0], K.LAMP[1], () => ({s: null, r: rB(), books: 3}), true)],
    // ===== ACT 8: DAY 90 (185 to 209) =====
    [T('day 90'), 'w', B(...WIDE, () => ({s: sP({glow: 1}), r: rB(), bloom: 0.4, thorn: 0.3, books: 6, notes: 6, clutter: 0.5}))],
    [T("and here's where"), undefined, B(...camS(1.0, 1.1), () => ({s: sP({glow: 1.1}), r: null, clutter: 0.6, thorn: 0.3}))],
    [T('one night the man in bed'), 'w', (c: Ctx) => <TableScene t={c.l} hover={1} handX={lerpN(780, 1330, ramp(c.l, 0.3, 2.2))} handY={lerpN(330, 560, ramp(c.l, 1.8, 3.4))} />],
    [T('he opens it'), undefined, (c: Ctx) => <BookOpening t={c.l} at={0.15} />],
    [T('he reads one line'), undefined, (c: Ctx) => <BookRead t={c.l} passes={1} per={1.0} />],
    [T('then the phone buzzes'), 'w', (c: Ctx) => <TableScene t={c.l} hover={0.7} buzz={1} />],
    [T('and he puts the book down'), undefined, B(...camS(1.3, 1.45), () => ({s: sP({mode: 'rest', lids: 0.4, glow: 0.8, smile: 0}), r: null, clutter: 0.6}))],
    [T("it's not that he doesn't"), undefined, B(...sFace(2.1, 2.3), () => ({s: sP({lids: 0.5, glow: 1.2, smile: 0, brow: -0.3, browTilt: 8}), r: null}))],
    [T("it's that the phone"), 'w', (c: Ctx) => <PullGauge t={c.l} at={[T('always easier') - T("it's that the phone"), T('always closer') - T("it's that the phone"), T('always there') - T("it's that the phone")]} />],
    [T('at the exact moment'), undefined, B(K.BEDGLOW[0], K.BEDGLOW[1], () => ({s: sP(), r: null}), true)],
    [T("he's tired enough"), undefined, B(...sFace(2.2, 2.4), () => ({s: sP({lids: 0.7, glow: 1.3, smile: 0.1}), r: null}))],
    // ===== ACT 9: MONTH 6 (210 to 244) =====
    [T('month six'), 'w', B(...WIDE, () => ({day: true, s: sP({glow: 1}), r: rB(), bloom: 0.45, thorn: 0.4, books: 9, notes: 8, clutter: 0.6}))],
    [T('a message in the group chat'), undefined, (c: Ctx) => <ChatPhone t={c.l} mode="invite" />],
    [T('in bed he types'), 'w', (c: Ctx) => <ChatPhone t={c.l} mode="cancel" />],
    [T("he doesn't have plans"), undefined, B(...camS(1.1, 1.2), () => ({s: sP({slump: 0.9, lids: 0.4, glow: 1, smile: 0.2, lean: -10}), r: null, clutter: 0.7}))],
    [T('he just doesnt have'.replace('doesnt', "doesn't")), undefined, B(...sFace(2.1, 2.3), () => ({s: sP({lids: 0.8, glow: 0.9, smile: 0}), r: null}))],
    [T('in the chair he goes'), 'w', dine(resW[0], resW[1])],
    [T('two hours at a small table'), undefined, dine([1700, 450, 0.85], [1700, 450, 0.95], {rd: {smile: 0.5}, fr: {smile: 0.6}})],
    [T('with friends'), undefined, dine([1380, 440, 1.3], [1400, 436, 1.4], {rdTalk: 0.6, fr: {smile: 0.6}})],
    [T('someone leans in'), undefined, dine([2070, 440, 1.5], [2060, 436, 1.6], {frTalk: 1, fr: {smile: 0.9}})],
    [T('when did you get so interesting'), undefined, dine([2070, 440, 1.5], [2060, 436, 1.6], {frTalk: 1, glass: true, fr: {smile: 0.9}})],
    [T('he smiles'), undefined, dine([1380, 440, 1.5], [1390, 436, 1.6], {rd: {smile: 0.8, lids: 0.05}})],
    [T('somewhere around book nine'), undefined, dine([1380, 440, 1.5], [1390, 436, 1.6], {rdTalk: 1, rd: {smile: 0.8}})],
    [T('at midnight the man in bed'), 'w', B(...camS(1.2, 1.3), () => ({s: sP({glow: 1.3, lids: 0.35}), r: null, clutter: 0.7}))],
    [T('a photo of that dinner'), undefined, (c: Ctx) => <FeedPhoto t={c.l} />],
    [T('he likes it'), undefined, B(K.HANDS_S[0], K.HANDS_S[1], () => ({s: sP({glow: 1.3}), r: null}), true)],
    [T('one heart'), undefined, (c: Ctx) => <PhoneFeed t={c.l} speed={1.2} />],
    // ===== ACT 10: THE MONTHS PASS (244 to 259) =====
    [T('the months pass'), 'b', B(...WIDE, () => ({day: true, season: 1, s: sP({glow: 1}), r: rB(), books: 9, notes: 10, clutter: 0.6, bloom: 0.5, thorn: 0.4}))],
    [T('summer'), undefined, B(K.MOON[0], K.MOON[1], () => ({day: true, season: 1, s: sP({glow: 1}), r: rB(), books: 10, notes: 10, clutter: 0.6, bloom: 0.5, thorn: 0.4}), true)],
    [T('rain'), undefined, B(...WIDE, () => ({season: 2, s: sP({glow: 1}), r: rB(), books: 12, notes: 10, clutter: 0.7, bloom: 0.6, thorn: 0.5, vines: 0.3}))],
    [T('autumn'), undefined, B(...WIDE, () => ({day: true, season: 3, s: sP({glow: 1}), r: rB(), books: 15, notes: 12, clutter: 0.8, bloom: 0.7, thorn: 0.6, vines: 0.4}))],
    [T('winter'), undefined, B(...WIDE, () => ({season: 4, s: sP({glow: 1}), r: rB(), books: 18, notes: 12, clutter: 0.9, bloom: 0.8, thorn: 0.7, vines: 0.5}))],
    [T('on one windowsill the plant'), 'w', (c: Ctx) => <PlanterInsert t={c.l} bloom={1} thorn={0} drop={[]} />],
    [T('on the other the weeds'), 'w', (c: Ctx) => <PlanterInsert t={c.l} bloom={1} thorn={1} drop={[]} vines={0.4} />],
    [T('creeping over the edge'), undefined, B([1600, 500, 0.6], [1650, 480, 0.7], (c: Ctx) => ({s: sP({glow: 1}), r: rB(), ...D, vines: Math.min(1, 0.4 + c.l * 0.3)}))],
    // ===== ACT 11: DAY 300 (259 to 285) =====
    [T('day 300'), 'w', B(...WIDE, () => ({s: gaunt, r: rB(), ...D}))],
    [TA("it's 200", T('day 300')), undefined, () => <ClockInsert text="2:00" />],
    [T('the man in bed types'), 'w', (c: Ctx) => <TypeSearch t={c.l} text="how to fix your life" from={2.2} to={3.6} />],
    [T('he watches a video'), undefined, (c: Ctx) => <NestedPhones t={c.l} at={[0.0, T('then one about discipline') - T('he watches a video'), T('a video about why') - T('he watches a video')]} />],
    [T('forty minutes later'), 'w', () => <ClockInsert text="40 MIN" />],
    [T("he's still there"), undefined, B(...sFace(2.2, 2.4), () => ({s: gaunt, r: null, ...D, dim: 0.25}))],
    [T('he knows something is wrong'), undefined, B([2690, 265, 2.0], [2690, 260, 3.2], () => ({s: sP({lids: 0.7, glow: 1.2, smile: 0, gaze: [0, 0.4]}), r: null, ...D, dim: 0.3}))],
    [T('on a tuesday night'), 'f', () => <ClockInsert text="11:00" />],
    [T('in 10 seconds'), undefined, (c: Ctx) => <TenRing t={c.l} from={0.1} to={1.9} />],
    // ===== ACT 12: DAY 360 (285 to 307) =====
    [T('day 360'), 'w', B(...WIDE, () => ({s: gaunt, r: rB({smile: 0.5}), ...D}))],
    [T('his manager calls'), undefined, mgr(mgW[0], mgW[1], {rdX: 1450, mTalk: 0.4})],
    [T("we're starting something new"), undefined, mgr([1950, 40, 1.6], [1960, 36, 1.7], {mTalk: 1, mf: {smile: 0.4}})],
    [T('we want you to lead'), undefined, mgr([1950, 40, 1.7], [1960, 36, 1.8], {mTalk: 1, mf: {smile: 0.5}})],
    [TA('me', T('we want you to lead')), undefined, mgr([1470, 40, 1.7], [1480, 36, 1.8], {rf: {brow: 0.9, lids: 0, smile: 0, open: 0.25}})],
    [T("you've changed this year"), undefined, mgr([1950, 40, 1.7], [1960, 36, 1.8], {mTalk: 1, mf: {smile: 0.6}})],
    [T("everyone's noticed"), undefined, mgr(mgW[0], mgW[1], {shake: 1, mf: {smile: 0.8}, rf: {smile: 0.7}})],
    [T('he walks back'), 'w', mgDesk],
    [T('he just thinks'), undefined, B(K.ARM_R[0], K.ARM_R[1], () => ({s: null, r: rB({mode: 'rest'}), ...D}), true)],
    [TA('a lamp', T('he just thinks')), undefined, B(K.LAMP[0], K.LAMP[1], () => ({s: null, r: rB(), ...D}), true)],
    [T('a cup of tea'), undefined, (c: Ctx) => <TeaPour t={c.l + 0.6} />],
    [TA('and 10 pages', T('a cup of tea')), undefined, (c: Ctx) => <BookPageOne t={c.l} left="9" right="10" />],
    [T("didn't feel like anything"), undefined, B(...rFace(2.0, 2.2), () => ({r: rB({smile: 0.6, lids: 0.15}), s: null, ...D, glowR: 1.2}))],
    // ===== ACT 13: DAY 365, THE COUNT (307 to 338) =====
    [T('day 365'), 'w', B(...WIDE, () => ({s: gaunt, r: rB({smile: 0.6}), ...D}))],
    [T("let's count"), undefined, B(...camR(1.1, 1.2), () => ({r: rB({smile: 0.6}), s: null, ...D}))],
    [T('ten pages a night'), 'w', (c: Ctx) => <CountCard t={c.l} head="THE CHAIR" rows={[{text: '10 PAGES', at: 0.1}, {text: '× 365 NIGHTS', at: T('for a year') - T('ten pages a night')}]} total={{text: '3,650 PAGES', at: T('3650') - T('ten pages a night')}} color="#3ddc84" />],
    [T("that's about 20 books"), undefined, (c: Ctx) => <IconGrid t={c.l + 0.1} />],
    [T('twenty of the best'), undefined, B(...camR(1.1, 1.2), () => ({r: rB({smile: 0.7}), s: null, ...D, glowR: 1.2}))],
    [T('now living in his head'), undefined, (c: Ctx) => <NodeNetwork t={c.l} />],
    [T('and the man in bed'), 'w', B(...sFace(2.0, 2.2), () => ({s: gaunt, r: null, ...D, sat: 0.7}))],
    [T('three hours a night'), 'w', (c: Ctx) => <CountCard t={c.l} head="THE BED" rows={[{text: '3 HOURS', at: 0.1}, {text: '× 365 NIGHTS', at: T('for a year', 1) - T('three hours a night')}]} total={{text: '1,095 HOURS', at: T('1095') - T('three hours a night')}} color="#ff5a6e" />],
    [T("that's more than six months"), 'f', (c: Ctx) => <CountCard t={c.l} head="THE BED" rows={[{text: '1,095 HOURS', at: 0.1}, {text: 'MORE THAN 6 MONTHS', at: 0.9}, {text: 'OF FULL WORKING DAYS', at: 1.7}]} total={{text: 'GONE.', at: T('gone') - T("that's more than six months")}} color="#ff5a6e" />],
    [T('and if you ask him'), undefined, B(...sFace(2.2, 2.4), () => ({s: gaunt, r: null, ...D, sat: 0.7}))],
    // ===== ACT 14: THE REVEAL (338 to 356) =====
    [TA('same man', 330), 'w', B(...WIDE, () => ({s: gaunt, r: rB({smile: 0.5}), ...D}))],
    [TA('same room', 330), undefined, B(...camS(1.0, 1.1), () => ({s: gaunt, r: null, ...D}))],
    [T('same year'), undefined, B(...camR(1.0, 1.1), () => ({r: rB({smile: 0.5}), s: null, ...D}))],
    [T('what you sow'), 'b', (c: Ctx) => <PlanterInsert t={c.l} bloom={1} thorn={1} drop={[]} vines={1} />],
    [T("now here's the part"), undefined, B(...WIDE, () => ({s: gaunt, r: rB({smile: 0.4}), ...D, dim: 0.45}))],
    [T('there were never two men'), 'f', Merge],
    [T("there's only ever been one"), undefined, B(...sFace(2.4, 2.6), () => ({s: sP({mode: 'rest', lids: 0.15, smile: 0.1, brow: 0.2}), r: null, glowS: 0.4}))],
    [TA('one man', 349), undefined, B(K.MOON[0], K.MOON[1], () => ({s: sP({mode: 'rest'}), r: null, glowS: 0.3}), true)],
    [TA('and one choice', 349), undefined, (c: Ctx) => <TableScene t={c.l} hover={0.6} />],
    [T('every single evening'), 'f', () => <ClockInsert text="11:00" />],
    // ===== ACT 15: TONIGHT (356 to 382) =====
    [T('tonight the man in bed'), 'w', B(...camS(1.2, 1.3), () => ({s: sP({glow: 1}), r: null}))],
    [T('then across the room'), undefined, B([2300, 480, 0.72], [900, 470, 0.72], () => ({s: sP({mode: 'rest', glow: 0.8, gaze: [-0.8, 0.2]}), r: null})) ],
    [T('at the book with the bookmark'), undefined, (c: Ctx) => <BookPageOne t={c.l} />],
    [tDown - 0.2, undefined, (c: Ctx) => <PhoneFaceDown t={c.l} at={0.45} />],
    [T('the glow dies'), undefined, B(...sFace(2.1, 2.3), (c: Ctx) => ({s: sP({mode: 'rest', lids: 0.25, smile: 0, glow: Math.max(0, 1 - c.l * 1.2)}), r: null, glowS: Math.max(0.2, 1 - c.l)}))],
    [TA('okay', T('the glow dies')), undefined, B(...sFace(2.2, 2.4), () => ({s: sP({mode: 'rest', lids: 0.1, smile: 0.2, brow: 0.2}), r: null, glowS: 0.6}))],
    [TA('ten pages', T('the glow dies')), undefined, B(...sFace(2.3, 2.5), () => ({s: sP({mode: 'rest', lids: 0.1, smile: 0.35}), r: null, glowS: 0.6}))],
    [TA('he opens the book', T('the glow dies')), 'w', (c: Ctx) => <BookOpening t={c.l} at={0.15} />],
    [T('he reads the first line'), undefined, (c: Ctx) => <BookRead t={c.l} passes={1} per={1.1} />],
    [T('then he reads it again'), undefined, (c: Ctx) => <BookRead t={c.l} passes={1} per={1.2} />],
    [T('because this time'), undefined, B(...sFace(2.2, 2.4), () => ({s: sP({mode: 'rest', lids: 0.1, smile: 0.6, brow: 0.2}), r: null, glowS: 0.8}))],
    [T("that's all a turning point"), 'b', B(...WIDE, () => ({s: sP({mode: 'rest', glow: 0.6}), r: null, glowS: 0.8}))],
    // ===== ACT 16: THE QUESTION (382 to the end) =====
    [T('not a big decision'), undefined, B(...camS(1.2, 1.35), () => ({s: sP({mode: 'rest', lids: 0.15, smile: 0.4}), r: null, glowS: 0.8}))],
    [T('made one more time'), undefined, B(...sFace(2.0, 2.2), () => ({s: sP({mode: 'rest', lids: 0.1, smile: 0.5}), r: null, glowS: 0.8}))],
    [T('a year from now'), 'w', B(...WIDE, () => ({s: gaunt, r: rB({smile: 0.6}), ...D}))],
    [T('the year is going to pass'), 'b', (c: Ctx) => <YearFlip t={c.l} dur={2.0} />],
    [T('the only question is'), undefined, (c: Ctx) => <PlanterInsert t={c.l} bloom={0} thorn={0} drop={[{at: 1.6, side: 'L'}, {at: 2.1, side: 'R'}]} />],
    [T('so phone or book'), 'f', (c: Ctx) => <Choice t={c.l} />],
    [T('tell me in the comments'), undefined, (c: Ctx) => <CommentCard t={c.l} from={0.8} to={2.4} text="the last book I finished..." />],
    [T('finished'), undefined, (c: Ctx) => <EndCard t={c.l} />],
  ];
  return L;
};
const lerpN = (a: number, b: number, k: number) => a + (b - a) * k;

// ---------------- the words, stamps, tags, bubbles and sounds that belong to Acts 4 to 16 ----------------
const pop = (phrase: string, dur: number, text: string, accent?: number, after?: number): TW => ({at: after === undefined ? T(phrase) : TA(phrase, after), dur, text, accent, mode: 'pop'});
export const ACT_POPS: TW[] = [
  pop('tiny reward', 1.6, 'A TINY REWARD.', 2), pop('asks for nothing', 1.8, 'NOTHING BACK.', 1), pop('the book is hard', 1.6, 'THE BOOK IS HARD.', 3), pop('the same line', 2.0, 'SAME LINE. TWICE.', 0),
  pop('ten pages', 2.4, 'TEN PAGES. THAT’S IT.', 0), pop("you're planting", 2.2, 'YOU’RE PLANTING SOMETHING.', 2), pop('until much later', 2.0, 'UNTIL MUCH LATER.', 2),
  pop('a little foggy', 2.0, 'A LITTLE FOGGY.', 2), pop('in the chair the mornings', 1.8, 'QUIET MORNINGS.', 0), pop('then a whole book', 2.4, 'A WHOLE BOOK.', 2),
  pop('something small has started', 2.4, 'SOMETHING SMALL HAS STARTED TO GROW.', 2), pop('a green shoot', 1.8, 'A GREEN SHOOT.', 1), pop('a pale little weed', 1.8, 'A PALE LITTLE WEED.', 1),
  pop('how you talk', 1.0, 'TALK.', 0), pop('how you listen', 1.0, 'LISTEN.', 0), pop('how you think', 1.2, 'THINK.', 0),
  pop('always closer', 0.1, '', undefined), pop('one heart', 1.6, 'ONE HEART.', 1),
  pop('summer', 0.9, 'SUMMER', 0), pop('rain', 0.8, 'RAIN', 0), pop('autumn', 0.9, 'AUTUMN', 0), pop('winter', 1.0, 'WINTER', 0),
  pop('the plant thickens', 2.0, 'THE PLANT THICKENS.', 2), pop('the weeds have become', 2.4, 'WEEDS BECOME VINES.', 2),
  pop('forty minutes later', 1.8, '40 MINUTES LATER.', 0), pop('something is wrong', 1.8, 'SOMETHING IS WRONG.', 2), pop('it started on a tuesday', 2.2, 'IT STARTED ON A TUESDAY.', 3), pop('almost a year ago', 1.8, 'ALMOST A YEAR AGO.', 1),
  pop('a chair', 0.9, 'A CHAIR.', 1), pop('a cup of tea', 1.2, 'A CUP OF TEA.', 3),
  pop("that's about 20 books", 1.8, 'ABOUT 20 BOOKS.', 2), pop('now living in his head', 2.0, 'LIVING IN HIS HEAD.', 2), pop('gone', 1.4, 'GONE.', 0), pop("couldn't tell you", 2.4, 'NOT A SINGLE THING.', 2),
  pop('same man', 1.1, 'SAME MAN.', 0, 330), pop('same room', 1.1, 'SAME ROOM.', 0, 330), pop('same year', 1.3, 'SAME YEAR.', 0), pop('what you sow', 2.2, 'WHAT YOU SOW, YOU REAP.', 3),
  pop('there were never two men', 2.0, 'NEVER TWO MEN.', 1), pop("there's only ever been one", 2.0, 'ONLY EVER ONE.', 2), pop('one man', 1.0, 'ONE MAN.', 1, 349), pop('one night', 1.0, 'ONE NIGHT.', 1, 350), pop('one choice', 1.4, 'ONE CHOICE.', 1, 351),
  pop('tonight the man in bed', 1.4, 'TONIGHT.', 0), pop('a turning point', 2.2, 'A TURNING POINT.', 2, 380), pop('a small one', 1.6, 'A SMALL ONE.', 2), pop('made one more time', 2.4, 'ONE MORE TIME.', 2),
  pop('one of these two men', 2.2, 'ONE OF THESE TWO MEN.', 3), pop('pass either way', 1.8, 'EITHER WAY.', 0), pop('what you plant tonight', 2.4, 'WHAT YOU PLANT TONIGHT.', 3),
].filter((w) => w.text);
const st = (phrase: string, dur: number, kicker: string, label: string, after?: number): StampT => ({at: after === undefined ? T(phrase) : TA(phrase, after), dur, kicker, label});
export const ACT_STAMPS: StampT[] = [
  st('three weeks ago', 3.2, 'THREE WEEKS AGO', 'SHE ATE ALONE'), st('at work a colleague', 2.6, 'AT WORK', 'THE COFFEE MACHINE'), st('two hours at a small table', 3.2, 'IN THE CHAIR', 'DINNER WITH FRIENDS'),
  st('his manager calls', 2.6, 'DAY 360', 'THE GLASS OFFICE'), st('three hours a night', 0.1, '', ''),
].filter((s) => s.label);
export type Tag = {from: number; to: number; who: 'bed' | 'chair' | 'both'; text?: string};
const tg = (phrase: string, dur: number, who: Tag['who'], text?: string, after?: number): Tag => { const from = after === undefined ? T(phrase) : TA(phrase, after); return {from, to: from + dur, who, text}; };
export const ACT_TAGS: Tag[] = [
  tg('the phone is easy', 2.4, 'bed', 'NIGHT 1'), tg('the book is hard', 2.4, 'chair', 'NIGHT 1'),
  tg('day five', 1.8, 'both', 'DAY 5'), tg('in bed the mornings', 2.6, 'bed'), tg('in the chair the mornings', 2.6, 'chair'),
  tg('day 21', 1.5, 'both', 'DAY 21'), tg("in bed he doesn't look up", 2.0, 'bed'), tg('in the chair he looks up', 2.0, 'chair'),
  tg('day 40', 1.2, 'both', 'DAY 40'), tg('at work a colleague', 2.6, 'chair'),
  tg('day 90', 2.2, 'both', 'DAY 90'), tg('one night the man in bed', 3.2, 'bed'),
  tg('month six', 1.7, 'both', 'MONTH 6'), tg('in bed he types', 3.2, 'bed'), tg('in the chair he goes', 2.6, 'chair'),
  tg('day 300', 1.8, 'bed', 'DAY 300'), tg('day 360', 1.8, 'chair', 'DAY 360'),
  tg('day 365', 2.0, 'both', 'DAY 365'), tg('and the man in bed', 2.6, 'bed'),
];
export const ACT_BUBBLES: {from: number; to: number; text: string; x: number; y: number}[] = [
  {from: T('who even reads'), to: T('who even reads') + 1.9, text: 'Who even reads anymore?', x: 560, y: 200},
  {from: T("your food's getting cold"), to: T("your food's getting cold") + 1.5, text: '“Your food’s getting cold.”', x: 1050, y: 170},
  {from: T("i said i'm coming"), to: T("i said i'm coming") + 1.2, text: '“I said I’m coming.”', x: 1200, y: 170},
  {from: T('since when do you talk'), to: T('since when do you talk') + 1.8, text: '“Since when do you talk like that?”', x: 1250, y: 170},
  {from: T('since chapter 12'), to: T('since chapter 12') + 1.4, text: '“Since chapter 12.”', x: 600, y: 170},
  {from: T('when did you get so interesting'), to: T('when did you get so interesting') + 2.2, text: '“When did you get so interesting?”', x: 1250, y: 170},
  {from: T('somewhere around book nine'), to: T('somewhere around book nine') + 2.0, text: '“Somewhere around book nine.”', x: 600, y: 170},
  {from: T("we're starting something new"), to: T("we're starting something new") + 1.4, text: '“We’re starting something new.”', x: 1250, y: 170},
  {from: T('we want you to lead'), to: T('we want you to lead') + 1.2, text: '“We want you to lead it.”', x: 1250, y: 170},
  {from: TA('me', T('we want you to lead')), to: TA('me', T('we want you to lead')) + 0.8, text: '“Me?”', x: 600, y: 170},
  {from: T("you've changed this year"), to: T("you've changed this year") + 1.9, text: '“You’ve changed this year.”', x: 1250, y: 170},
  {from: T("everyone's noticed"), to: T("everyone's noticed") + 1.2, text: '“Everyone’s noticed.”', x: 1250, y: 170},
  {from: TA('okay', T('the glow dies')), to: TA('okay', T('the glow dies')) + 1.5, text: '“Okay.”', x: 1150, y: 170},
  {from: TA('ten pages', T('the glow dies')), to: TA('ten pages', T('the glow dies')) + 1.3, text: '“Ten pages.”', x: 1150, y: 170},
];
// pages counter (Day 5, in the chair): 10 -> 20 -> 50 ... a whole book
export const PAGES = {from: T('and 10 pages'), to: T('then a whole book')};
export const END_AT = FULL_TOTAL;

const ev = (file: string, at: number, vol: number, extra: Partial<Cue3> = {}): Cue3 => ({file, at, vol, ...extra});
const loop = (file: string, from: number, to: number, vol: number): Cue3 => ({file, at: from, dur: to - from, loop: true, vol, fadeIn: 1.2, fadeOut: 1.2});
export const ACT_CUES: Cue3[] = [
  loop('amb_night_room', 64, 112, 0.12), loop('amb_morning', 112, 137, 0.11), loop('amb_kitchen', T('his mother calls'), T('in bed he'), 0.11), loop('amb_kitchen', T('he closes the book and goes'), T('something small has started'), 0.11),
  loop('amb_office', T('at work a colleague'), T('that’s the strange thing'.replace('’', "'")), 0.1), loop('amb_restaurant', T('in the chair he goes'), T('at midnight the man in bed'), 0.12),
  loop('amb_night_room', T('day 300'), T('day 360'), 0.12), loop('amb_office', T('his manager calls'), T('he just thinks'), 0.1), loop('amb_night_room', T('tonight the man in bed'), 405, 0.12),
  ev('phone_swipe', T('one video') + 0.3, 0.1), ev('phone_swipe', T('one video') + 1.3, 0.1), ev('phone_swipe', T('bright') + 0.3, 0.1), ev('phone_swipe', T('bright') + 1.2, 0.1), ev('reward_pop', T('every swipe') + 0.6, 0.14), ev('coin_ping', T('tiny reward'), 0.12),
  ev('page_turn', T('the first page') + 0.5, 0.12), ev('page_flutter', T('he reads the same line'), 0.1), ev('clock_tick', T('he checks the clock'), 0.12, {dur: 1.3, loop: true}), ev('yawn', T('he yawns'), 0.18, {old: true}), ev('phone_unlock', T('the phone finally') + 0.3, 0.1), ev('book_close', T('in the chair he closed') + 0.4, 0.16),
  ev('seed_drop', T("every night you're planting") + 1.0, 0.14), ev('seed_drop', T("every night you're planting") + 1.5, 0.14),
  ev('alarm_beep', T('the alarm'), 0.12, {dur: 1.4, fadeOut: 0.2}), ev('alarm_beep', T('snooze'), 0.12, {dur: 0.9, fadeOut: 0.2}), ev('alarm_beep', T('snooze again'), 0.12, {dur: 1.0, fadeOut: 0.2}), ev('brush_teeth', T('a rushed shower'), 0.1, {dur: 1.2}), ev('spoon_bowl', T('a coffee he drinks'), 0.14),
  ev('page_turn', T('then 50'), 0.12), ev('counter_tick', T('and 10 pages') + 0.2, 0.1), ev('counter_tick', T('and 10 pages') + 0.7, 0.1), ev('counter_tick', T('then 50') + 0.2, 0.1),
  ev('clock_tick', T('ten more minutes'), 0.12, {dur: 2.2, loop: true}), ev('lamp_click', T('ten pages') + 0.5, 0.1),
  ev('phone_buzz', T('then the phone buzzes') + 0.2, 0.16), ev('page_turn', T('he opens it') + 0.3, 0.12), ev('book_open', T('he opens it'), 0.12),
  ev('phone_notif', T('a message in the group chat') + 0.4, 0.14), ev('phone_tap', T('in bed he types') + 0.5, 0.08), ev('phone_tap', T('in bed he types') + 0.9, 0.08), ev('phone_tap', T('in bed he types') + 1.3, 0.08), ev('glass_clink', T('when did you get so interesting') + 0.2, 0.12), ev('reward_pop', T('one heart'), 0.14),
  ev('whoosh_soft', T('the months pass'), 0.12), ev('shimmer', T('on one windowsill the plant'), 0.1),
  ev('clock_tick', TA("it's 200", T('day 300')), 0.12, {dur: 1.5, loop: true}), ev('phone_tap', T('the man in bed types') + 2.2, 0.08), ev('phone_tap', T('the man in bed types') + 2.6, 0.08), ev('phone_tap', T('the man in bed types') + 3.0, 0.08),
  ev('clock_tick', T('forty minutes later'), 0.12, {dur: 1.2, loop: true}), ev('riser', T('in 10 seconds') - 0.5, 0.12, {dur: 2.6, fadeOut: 0.05}),
  ev('tea_pour', T('a cup of tea') + 0.2, 0.14), ev('page_turn', T('a cup of tea') + 1.5, 0.1),
  ev('counter_whir', T('ten pages a night'), 0.1, {dur: 2.4}), ev('stamp_hit', T('3650') + 0.1, 0.16), ev('counter_whir', T('three hours a night'), 0.1, {dur: 2.4}), ev('stamp_hit', T('1095') + 0.1, 0.16), ev('receipt_print', T("that's more than six months"), 0.14),
  ev('impact_bloom', T('there were never two men') + 0.3, 0.2), ev('heartbeat', T('now here\'s the part'.replace("here's", "here's")), 0.12, {dur: 2.2, loop: true}),
  ev('clock_tick', T('every single evening'), 0.12, {dur: 2.0, loop: true}), ev('phone_unlock', T('then across the room') - 0.3, 0.08), ev('page_flutter', T('at the book with the bookmark'), 0.1),
  ev('phone_tap', T('he turns the phone face down') + 0.3, 0.14), ev('lamp_click', T('the glow dies') + 0.2, 0.1), ev('book_open', TA('he opens the book', T('the glow dies')), 0.14), ev('page_turn', T('he reads the first line'), 0.1), ev('page_turn', T('then he reads it again'), 0.1),
  ev('whoosh_soft', T('the year is going to pass'), 0.12), ev('seed_drop', T('the only question is') + 1.6, 0.14), ev('seed_drop', T('the only question is') + 2.1, 0.14), ev('title_hit', T('so phone or book'), 0.2), ev('phone_notif', T('tell me in the comments') + 2.4, 0.12), ev('shimmer', T('finished') + 0.4, 0.14),
];
export const ACT_MUSIC: {from: number; to: number; track: string; vol: number}[] = [
  {from: 63.5, to: 104, track: 'routine', vol: 0.09}, {from: 103, to: 137, track: 'tf_guitar', vol: 0.09}, {from: 136, to: 166, track: 'hope', vol: 0.08}, {from: 165, to: 186, track: 'wonder', vol: 0.08},
  {from: 185, to: 211, track: 'tf_thin', vol: 0.09}, {from: 210, to: 244.5, track: 'tf_guitar', vol: 0.09}, {from: 244, to: 259.5, track: 'wonder', vol: 0.08}, {from: 259, to: 285.5, track: 'tf_cold', vol: 0.1},
  {from: 285, to: 307.5, track: 'tf_build', vol: 0.1}, {from: 307, to: 343.4, track: 'tf_return', vol: 0.1}, {from: 345.2, to: 356.6, track: 'tf_thin', vol: 0.08}, {from: 356, to: 396.6, track: 'resolve', vol: 0.1}, {from: 396, to: FULL_TOTAL, track: 'tf_end', vol: 0.12},
];
