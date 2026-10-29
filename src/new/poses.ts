import {K2} from './kit2';

// POSE LIBRARY. Every pose is a COMPLETE pose (nothing carried over), reviewed on the PoseSheet composition (one page per frame).
// Animations in act1v2 move from one finished pose to the next. Figure space: 300 x 430, person faces right.
export type Pose = Omit<K2, 't'> & {group: string; who: 'green' | 'red'; seat?: boolean; bed?: boolean; floor?: Pt};
type Pt = [number, number];
const BK = {name: 'book-back', at: 'mid' as const, dx: 4, dy: -28};
const PH = {name: 'phone-back', at: 'L' as const, dx: 20, dy: -24};

const SIT_G = {turn: 0.92, hip: [150, 322] as Pt, legL: {foot: [226, 405] as Pt}, legR: {foot: [248, 405] as Pt}};
const SIT_R = {turn: 0.92, hip: [150, 311] as Pt, legL: {foot: [214, 405] as Pt}, legR: {foot: [236, 405] as Pt}};
const STAND = {turn: 0.92, hip: [150, 250] as Pt, legL: {foot: [132, 405] as Pt}, legR: {foot: [176, 405] as Pt}};
const rest = {armL: {ang: [-8, -4] as Pt}, armR: {ang: [8, 4] as Pt}};

export const POSES: Record<string, Pose> = {
  // ---------------- 1. SITTING IN A CHAIR / GETTING UP ----------------
  sitRelaxed: {group: 'sit & stand', who: 'green', seat: true, ...SIT_G, emo: 'neutral', lean: 0, chest: 3, headTilt: 4, armL: {reach: [200, 306], hand: 'relaxed'}, armR: {reach: [222, 310], hand: 'relaxed'}, look: [260, 270]},
  sitTired: {group: 'sit & stand', who: 'green', seat: true, ...SIT_G, emo: 'tired', lean: 8, chest: 8, headTilt: 18, armL: {reach: [206, 316], hand: 'relaxed'}, armR: {reach: [226, 320], hand: 'relaxed'}, look: [250, 330]},
  sitTalk: {group: 'sit & stand', who: 'green', seat: true, ...SIT_G, turn: 0.55, emo: 'happy', lean: -2, chest: 5, headTilt: 2, armL: {reach: [210, 300], hand: 'relaxed'}, armR: {reach: [250, 250], hand: 'open'}, look: [260, 215]},
  getUp1: {group: 'sit & stand', who: 'green', seat: true, ...SIT_G, emo: 'determined', lean: 20, chest: 6, headTilt: 4, hip: [146, 316], armL: {reach: [206, 322], hand: 'grip'}, armR: {reach: [224, 326], hand: 'grip'}, look: [270, 250]},
  getUp2: {group: 'sit & stand', who: 'green', seat: true, turn: 0.92, hip: [144, 286], lean: 30, chest: 6, headTilt: 0, legL: {foot: [190, 405]}, legR: {foot: [214, 405]}, emo: 'determined', armL: {reach: [196, 302], hand: 'grip'}, armR: {reach: [214, 306], hand: 'grip'}, look: [270, 230]},
  getUp3: {group: 'sit & stand', who: 'green', ...STAND, lean: 6, chest: 4, headTilt: 0, emo: 'neutral', ...rest, look: [280, 200]},
  standRelaxed: {group: 'sit & stand', who: 'green', ...STAND, emo: 'neutral', lean: 0, chest: 3, headTilt: 0, ...rest, look: [280, 200]},
  standTired: {group: 'sit & stand', who: 'red', ...STAND, emo: 'tired', lean: 10, chest: 10, headTilt: 18, armL: {ang: [-4, 10]}, armR: {ang: [4, 12]}, look: [250, 320]},
  tiredRubEyes: {group: 'sit & stand', who: 'red', ...STAND, emo: 'tired', lean: 6, chest: 8, headTilt: 10, armL: {ang: [-4, 10]}, armR: {reach: [204, 104], hand: 'relaxed'}, look: [250, 250]},

  // ---------------- 2. THE PHONE ----------------
  phoneOnBedSit: {group: 'phone', who: 'red', bed: true, ...SIT_R, emo: 'tired', lean: 12, chest: 10, headTilt: 18, armL: {reach: [214, 322], hand: 'relaxed'}, armR: {reach: [232, 326], hand: 'relaxed'}, look: [250, 330]},
  phoneReach: {group: 'phone', who: 'red', bed: true, floor: [262, 326], ...SIT_R, hip: [132, 313], emo: 'worried', lean: 36, chest: 10, headTilt: 12, armL: {reach: [262, 324], hand: 'open'}, armR: {reach: [214, 326], hand: 'relaxed'}, look: [262, 326]},
  phoneGrab: {group: 'phone', who: 'red', bed: true, floor: [262, 326], ...SIT_R, hip: [132, 313], emo: 'surprised', lean: 36, chest: 10, headTilt: 12, armL: {reach: [262, 324], hand: 'grip'}, armR: {reach: [214, 326], hand: 'relaxed'}, look: [262, 326]},
  phoneLift: {group: 'phone', who: 'red', bed: true, ...SIT_R, emo: 'surprised', lean: 10, chest: 8, headTilt: 14, armL: {reach: [240, 296], hand: 'hold'}, armR: {reach: [220, 326], hand: 'relaxed'}, look: [244, 284], hold: PH},
  phoneHeld: {group: 'phone', who: 'red', bed: true, ...SIT_R, emo: 'happy', lean: 4, chest: 6, headTilt: 12, armL: {reach: [222, 268], hand: 'hold'}, armR: {reach: [222, 326], hand: 'relaxed'}, look: [236, 262], hold: PH},
  phoneLowRelaxed: {group: 'phone', who: 'red', bed: true, ...SIT_R, emo: 'laughing', lean: 6, chest: 4, headTilt: 16, armL: {reach: [224, 290], hand: 'hold'}, armR: {reach: [214, 322], hand: 'relaxed'}, look: [236, 284], hold: {...PH, dy: -20}},
  phoneGlanceUp: {group: 'phone', who: 'red', bed: true, ...SIT_R, emo: 'smug', lean: 4, chest: 6, headTilt: 5, armL: {reach: [222, 268], hand: 'hold'}, armR: {reach: [222, 326], hand: 'relaxed'}, look: [270, 200], hold: PH},
  phoneStand: {group: 'phone', who: 'red', ...STAND, emo: 'happy', lean: 4, chest: 5, headTilt: 14, armL: {reach: [214, 200], hand: 'hold'}, armR: {ang: [6, 12]}, look: [236, 196], hold: PH},

  // ---------------- 3. THE BOOK ----------------
  bookReach: {group: 'book', who: 'green', seat: true, ...SIT_G, emo: 'neutral', lean: 16, chest: 6, headTilt: 8, armL: {reach: [240, 300], hand: 'open'}, armR: {reach: [220, 306], hand: 'relaxed'}, look: [244, 304]},
  bookClosedLap: {group: 'book', who: 'green', seat: true, ...SIT_G, emo: 'neutral', lean: 0, chest: 2, headTilt: 10, open: 0, armL: {reach: [200, 300], hand: 'hold'}, armR: {reach: [220, 306], hand: 'hold'}, look: [214, 300], hold: BK},
  bookLifted: {group: 'book', who: 'green', seat: true, ...SIT_G, emo: 'neutral', lean: -1, chest: 3, headTilt: 12, open: 0, armL: {reach: [204, 268], hand: 'hold'}, armR: {reach: [224, 274], hand: 'hold'}, look: [220, 262], hold: BK},
  bookOpening: {group: 'book', who: 'green', seat: true, ...SIT_G, emo: 'neutral', lean: -2, chest: 4, headTilt: 13, open: 0.5, armL: {reach: [204, 264], hand: 'hold'}, armR: {reach: [226, 266], hand: 'hold'}, look: [222, 250], hold: BK},
  bookReading: {group: 'book', who: 'green', seat: true, ...SIT_G, emo: 'neutral', lean: -2, chest: 5, headTilt: 14, open: 1, armL: {reach: [204, 262], hand: 'hold'}, armR: {reach: [222, 268], hand: 'hold'}, look: [222, 238], hold: BK},
  bookTurnPage: {group: 'book', who: 'green', seat: true, ...SIT_G, emo: 'neutral', lean: -2, chest: 5, headTilt: 12, open: 1, armL: {reach: [204, 262], hand: 'hold'}, armR: {reach: [238, 250], hand: 'hold'}, look: [222, 238], hold: BK},
  bookGlanceUp: {group: 'book', who: 'green', seat: true, ...SIT_G, emo: 'happy', lean: -4, chest: 6, headTilt: 4, open: 1, armL: {reach: [204, 262], hand: 'hold'}, armR: {reach: [222, 268], hand: 'hold'}, look: [260, 190], hold: BK},
  bookStand: {group: 'book', who: 'green', ...STAND, emo: 'happy', lean: 0, chest: 5, headTilt: 12, open: 1, armL: {reach: [206, 202], hand: 'hold'}, armR: {reach: [224, 206], hand: 'hold'}, look: [222, 184], hold: BK},

  // ---------------- 4. DAILY LIFE: bathroom, talking ----------------
  brushTeeth: {group: 'daily', who: 'red', ...STAND, turn: 0.7, emo: 'tired', lean: 6, chest: 6, headTilt: 10, armR: {reach: [214, 204], hand: 'hold'}, armL: {reach: [204, 128], hand: 'grip'}, look: [222, 200], hold: {...PH, at: 'R'}, hold2: {name: 'toothbrush', at: 'L' as const, size: 110, dx: 18, dy: -16, rot: 0}},
  brushTeethFace: {group: 'daily', who: 'green', ...STAND, emo: 'neutral', lean: 2, chest: 4, headTilt: 4, armL: {ang: [-6, 8]}, armR: {reach: [204, 128], hand: 'grip'}, look: [280, 130], hold2: {name: 'toothbrush', at: 'R' as const, size: 110, dx: 18, dy: -16, rot: 0}},
  talkListen: {group: 'daily', who: 'green', ...STAND, turn: 0.5, emo: 'neutral', lean: 0, chest: 3, headTilt: 3, ...rest, look: [290, 170]},
  talkSpeak: {group: 'daily', who: 'green', ...STAND, turn: 0.5, emo: 'happy', lean: -2, chest: 5, headTilt: 3, armL: {ang: [-8, 6]}, armR: {reach: [232, 158], hand: 'open'}, look: [290, 170]},
  talkExplain: {group: 'daily', who: 'green', ...STAND, turn: 0.5, emo: 'determined', lean: -2, chest: 5, headTilt: 3, armL: {reach: [220, 168], hand: 'open'}, armR: {reach: [244, 130], hand: 'point'}, look: [290, 170]},
  talkWorried: {group: 'daily', who: 'red', ...STAND, turn: 0.5, emo: 'worried', lean: 4, chest: 6, headTilt: 8, armL: {reach: [196, 176], hand: 'relaxed'}, armR: {reach: [204, 170], hand: 'relaxed'}, look: [290, 190]},
  stretch: {group: 'daily', who: 'green', ...STAND, turn: 0.3, emo: 'happy', lean: -4, chest: 6, headTilt: -6, armL: {reach: [96, 52], hand: 'open'}, armR: {reach: [204, 52], hand: 'open'}, look: [260, 100]},
};

export const POSE_PAGES = ['sit & stand', 'phone', 'book', 'daily'];
