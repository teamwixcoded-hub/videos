import React from 'react';
import {Annotation, ChapterCard, CineTitle, Echo, GlitchText, Letterbox, NumberMorph, Scoreboard, Stamp, StrikeSwap, Typewriter, Versus, Whisper} from './components/Type';

// The text of the film, scene by scene. Rule: text is never a caption. Each moment is designed for what it
// MEANS: a contrast becomes a versus, a lie corrected is struck out, a thought is typed, a number morphs.
// All times are script seconds. Colours: blue = phone, gold = book, red = harm, green = recovery.
const BLUE = '#7fc2ff', GOLD = '#ffd23f', RED = '#ff6b5e', GREEN = '#7ee2a0';

export const TypoAct1: React.FC = () => (
  <>
    <Typewriter text="two men. same job. same tired night." from={0.8} to={6.4} y={930} size={60} />
    <Typewriter text="and one small choice tonight…" from={6.6} to={12.0} y={930} size={60} />
    <CineTitle text="ONE SMALL CHOICE" from={12.4} to={16.2} y={160} size={110} accentWords={['choice']} accent={GOLD} />
    <Annotation text="one tiny ping…" from={17.2} to={19.8} target={[1755, 748]} r={74} label={[1330, 905]} color={BLUE} size={62} />
    <ChapterCard label="DAY 1" sub="where it all begins" from={0.3} to={3.2} />
    <Whisper text="one year from now…" from={24.8} to={27.6} y={880} />
    <Whisper text="you already saw where this ends." from={27.8} to={30.6} y={880} />
    <CineTitle text="INSTANTLY." from={35.8} to={39.4} y={860} size={150} accentWords={['instantly']} accent={BLUE} track={0.2} />
    <Typewriter text="dopamine: a small reward…" from={50.0} to={55.0} y={930} size={58} />
    <Typewriter text="the book doesn't feel good." from={60.6} to={64.2} y={930} size={58} cps={14} />
    <NumberMorph from={71.2} to={75.8} morphAt={73.6} a="10" b="100" suffix="PAGES" y={40} x={560} size={150} />
    <Scoreboard title="Night one" left="BOOK" right="PHONE" leftScore={0} rightScore={1} leftColor={GOLD} rightColor={BLUE} from={88.2} to={92.8} y={90} />
    <CineTitle text="REWARD FIRST" from={96.4} to={99.6} y={880} size={110} accentWords={['reward']} accent={GOLD} />
    <Stamp text="BILL LATER" from={104.6} to={108.4} x={960} y={520} size={180} rotate={-6} />
  </>
);

export const TypoS04: React.FC = () => (
  <>
    <ChapterCard label="DAY 5" sub="the phone is the first thing he touches" from={0.5} to={3.4} />
    <Echo text="THE DAYS BLUR." from={22.2} to={25.6} y={820} size={140} />
    <ChapterCard label="DAY 5" sub="same chair. same tea. same ten pages." from={27.3} to={30.8} />
    <Letterbox from={35.8} to={43.4} size={110} />
    <Typewriter text="not because he wants to…" from={36.0} to={39.2} y={860} size={60} />
    <CineTitle text="BECAUSE HE DECIDED" from={39.4} to={43.2} y={850} size={110} accentWords={['decided']} accent={GREEN} />
    <Whisper text="still not fun." from={43.4} to={46.2} y={900} />
    <Whisper text="but it's becoming a pattern." from={46.8} to={51.0} y={900} />
  </>
);

export const TypoS05: React.FC = () => (
  <>
    <ChapterCard label="DAY 21" sub="something feels off" from={0.6} to={3.4} />
    <GlitchText text="SOMETHING FEELS OFF." from={3.4} to={6.2} y={800} size={118} />
    <Whisper text="over nothing." from={15.0} to={17.6} y={900} color="#ffb4aa" />
    <StrikeSwap lead="THE" before="CURE" after="CAUSE" from={22.4} swapAt={24.4} to={26.8} y={800} size={130} />
    <ChapterCard label="DAY 21" sub="something changes" from={27.2} to={30.2} />
    <Typewriter text="twenty pages. without noticing." from={31.8} to={36.8} y={930} size={58} />
    <CineTitle text="THE HARD PART GETS EASIER" from={44.8} to={49.0} y={860} size={95} accentWords={['easier']} accent={GREEN} />
  </>
);

export const TypoS07: React.FC = () => (
  <>
    <ChapterCard label="DAY 90" sub="look at them now" from={0.6} to={3.6} />
    <Echo text="SAME DAY." from={5.2} to={9.2} y={800} size={120} copies={6} color="#ffb4aa" />
    <Whisper text="but he doesn't." from={17.2} to={20.2} y={900} color="#bff0cf" />
    <Versus left="HARD" right="EASY" leftSub="the book" rightSub="the phone" fixedSubs leftColor={GOLD} rightColor={BLUE} from={29.4} to={36.4} swapAt={32.8} y={790} size={120} />
  </>
);

export const TypoS08: React.FC = () => (
  <>
    <Typewriter text="knowing is not changing." from={1.0} to={5.0} y={900} size={58} />
    <StrikeSwap lead="HE CHANGED" before="EVERYTHING" after="NOTHING" from={28.0} swapAt={30.8} to={34.0} y={800} size={118} />
  </>
);

export const TypoS09: React.FC = () => (
  <>
    <ChapterCard label="MONTH 11" sub="his manager calls him in" from={0.6} to={3.6} />
    <Whisper text="nobody saw the ten pages." from={16.0} to={19.4} y={900} />
    <Whisper text="they only see the result." from={19.6} to={22.9} y={900} />
    <Letterbox from={22.8} to={28.6} size={110} />
    <CineTitle text="HE KNOWS WHERE IT CAME FROM" from={23.2} to={28.2} y={850} size={96} accentWords={['knows']} accent={GOLD} />
  </>
);

export const TypoS10: React.FC = () => (
  <>
    <ChapterCard label="DAY 365" sub="same room. same night. same man." from={0.6} to={4.2} />
    <Whisper text="neither changed in one day." from={21.8} to={25.6} y={920} />
    <Letterbox from={25.6} to={30.2} size={110} />
    <CineTitle text="ONE NIGHT AT A TIME" from={25.8} to={30.0} y={830} size={118} accentWords={['night']} accent={GOLD} />
  </>
);

export const TypoS11: React.FC = () => (
  <>
    <ChapterCard label="DAY 366" sub="that night" from={0.4} to={3.0} size={150} />
    <Typewriter text="for the first time…" from={8.0} to={11.0} y={900} size={62} />
    <CineTitle text="LIKE NIGHT ONE" from={20.6} to={25.9} y={790} size={120} accentWords={['night']} accent={GOLD} sub="exactly like the other one did" />
  </>
);

export const TypoS12: React.FC = () => (
  <>
    <Versus left="A GOOD LIFE" right="A GOOD NIGHT" leftColor={GOLD} rightColor={BLUE} from={1.0} to={8.2} y={800} size={92} />
    <CineTitle text="WHICH ONE?" from={8.6} to={12.9} y={820} size={150} accentWords={['which']} accent={GOLD} track={0.25} />
  </>
);
