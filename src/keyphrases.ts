import type {KP} from './components/KeyPhrases';

// What deserves a caption? Only what the picture cannot say by itself:
//   thoughts and feelings, time jumps, cause and effect, and the video's main contrasts.
// Never a word for something already visible (a phone in his hand, a book, a door). At least ~4 s apart.
// `big` = the single most important line of the scene. Script seconds.
const BLUE = '#7fc2ff', RED = '#ff6b5e', GOLD = '#ffd23f', GREEN = '#7ee2a0';

export const KP_ACT1: KP[] = [
  {t: 'ONE SMALL CHOICE.', from: 12.6, to: 15.8, hi: ['choice'], accent: GOLD},
  {t: 'ONE YEAR LATER…', from: 25.0, to: 29.6},
  {t: 'INSTANTLY.', from: 36.0, to: 39.2, accent: BLUE, hi: ['instantly']},
  {t: 'DOPAMINE.', from: 50.0, to: 54.2, accent: GOLD, hi: ['dopamine']},
  {t: "THE BOOK DOESN'T.", from: 60.8, to: 63.6, hi: ['doesnt'], accent: RED},
  {t: 'TEN PAGES FEEL LIKE A HUNDRED.', from: 71.4, to: 75.4, hi: ['hundred'], accent: RED},
  {t: 'THE PHONE WINS.', from: 88.4, to: 92.6, hi: ['wins'], accent: BLUE, big: true},
  {t: 'REWARD FIRST.', from: 101.0, to: 103.8, hi: ['reward']},
  {t: 'BILL LATER.', from: 104.0, to: 107.6, hi: ['bill'], accent: RED, big: true},
];

export const KP_S04: KP[] = [
  {t: 'THE DAYS BLUR.', from: 22.2, to: 25.4, hi: ['blur']},
  {t: 'NOT BECAUSE HE WANTS TO.', from: 36.0, to: 39.2},
  {t: 'BECAUSE HE DECIDED.', from: 39.4, to: 42.6, hi: ['decided'], accent: GREEN, big: true},
  {t: 'STILL NOT FUN.', from: 43.2, to: 46.0},
  {t: 'BUT IT IS BECOMING A PATTERN.', from: 46.8, to: 50.8, hi: ['pattern'], accent: GREEN},
];

export const KP_S05: KP[] = [
  {t: 'SOMETHING FEELS OFF.', from: 3.4, to: 6.0, hi: ['off']},
  {t: 'OVER NOTHING.', from: 15.0, to: 17.4, hi: ['nothing'], accent: RED},
  {t: 'THE CURE IS THE CAUSE.', from: 22.8, to: 26.4, hi: ['cause'], accent: RED, big: true},
  {t: 'SOMETHING CHANGES.', from: 27.8, to: 31.4, hi: ['changes'], accent: GREEN},
  {t: 'TWENTY PAGES. WITHOUT NOTICING.', from: 31.8, to: 36.6, hi: ['twenty']},
  {t: 'THE HARD PART GETS EASIER.', from: 44.8, to: 48.6, hi: ['easier'], accent: GREEN},
];

export const KP_S06: KP[] = [
  {t: 'IT SPREADS.', from: 0.8, to: 4.8, hi: ['spreads'], accent: GREEN},
  {t: 'ONE HABIT CHANGES THE OTHERS.', from: 28.0, to: 32.8, hi: ['habit'], accent: GREEN, big: true},
];

export const KP_S07: KP[] = [
  {t: 'SAME DAY. COPIED.', from: 5.2, to: 9.0, hi: ['copied'], accent: RED},
  {t: "BUT HE DOESN'T.", from: 17.2, to: 20.0, hi: ['doesnt'], accent: GREEN},
  {t: 'PHONE: EASY.   BOOK: HARD.', from: 29.4, to: 32.2},
  {t: "NOW IT'S REVERSED.", from: 32.8, to: 36.0, hi: ['reversed'], accent: GREEN, big: true},
];

export const KP_S08: KP[] = [
  {t: 'KNOWING IS NOT CHANGING.', from: 1.0, to: 4.4, hi: ['knowing']},
  {t: 'STILL IN BED.', from: 23.4, to: 26.8, hi: ['bed']},
  {t: 'CHANGED NOTHING.', from: 30.8, to: 33.6, hi: ['nothing'], accent: RED, big: true},
];

export const KP_S09: KP[] = [
  {t: 'NOBODY SAW THE TEN PAGES.', from: 16.0, to: 19.4},
  {t: 'THEY ONLY SEE THE RESULT.', from: 19.6, to: 22.8, hi: ['result'], accent: GREEN},
  {t: 'HE KNOWS WHERE IT CAME FROM.', from: 23.4, to: 27.8, hi: ['knows'], accent: GOLD, big: true},
];

export const KP_S10: KP[] = [
  {t: 'NEITHER CHANGED IN ONE DAY.', from: 21.8, to: 25.4},
  {t: 'ONE NIGHT AT A TIME.', from: 25.8, to: 29.8, hi: ['night'], accent: GOLD, big: true},
];

export const KP_S11: KP[] = [
  {t: 'FOR THE FIRST TIME…', from: 8.0, to: 10.8, hi: ['first']},
  {t: 'LIKE THE OTHER ONE… ON NIGHT ONE.', from: 20.8, to: 25.8, hi: ['night'], accent: GOLD, big: true},
];

export const KP_S12: KP[] = [
  {t: 'A GOOD NIGHT.', from: 1.0, to: 4.0, hi: ['night'], accent: BLUE},
  {t: 'A GOOD LIFE.', from: 4.6, to: 7.8, hi: ['life'], accent: GOLD},
  {t: 'WHICH ONE?', from: 8.6, to: 12.8, hi: ['which'], accent: GOLD, big: true},
];
