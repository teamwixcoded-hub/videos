import {loadFont as loadLilita} from '@remotion/google-fonts/LilitaOne';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadBebas} from '@remotion/google-fonts/BebasNeue';
import {loadFont as loadPlayfair} from '@remotion/google-fonts/PlayfairDisplay';
import {loadFont as loadTypewriter} from '@remotion/google-fonts/SpecialElite';
import {loadFont as loadCaveat} from '@remotion/google-fonts/Caveat';

// Chunky cartoon face (counters, labels that sit inside the artwork)
export const HEAD_FONT = loadLilita().fontFamily;
export const BODY_FONT = loadInter('normal', {weights: ['700', '800']}).fontFamily;
// Film-title faces
export const CINE_FONT = loadBebas().fontFamily; // tall, condensed, trailer-style
export const SERIF_FONT = loadPlayfair('italic', {weights: ['500', '700']}).fontFamily; // elegant subtitles
export const TYPE_FONT = loadTypewriter().fontFamily; // thoughts, typed text
export const HAND_FONT = loadCaveat('normal', {weights: ['600', '700']}).fontFamily; // handwritten annotations
