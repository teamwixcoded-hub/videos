import {loadFont} from '@remotion/google-fonts/Montserrat';
import {loadFont as loadChakra} from '@remotion/google-fonts/ChakraPetch';
import {loadFont as loadMono} from '@remotion/google-fonts/ShareTechMono';

export const MONT = loadFont('normal', {weights: ['800']}).fontFamily;                 // infographics and inserts
export const DIGI = loadChakra('normal', {weights: ['600', '700']}).fontFamily;         // the digital display face for on-screen text
export const MONO = loadMono().fontFamily;                                              // terminal typing
export const W = 1920, H = 1080, FPS = 30;
