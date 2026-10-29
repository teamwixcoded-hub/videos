import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import sizes from '../../public/poses/_sizes.json';

// Studio-only: the approved pose images (public/poses/*.png, cut from character-lab/pose-refs by scripts/cut-poses.cjs). One page per frame.
const PAGES: string[][] = [
  ['sitRelaxed', 'sitTired', 'sitTalk', 'getUp1', 'getUp2', 'getUp3', 'standRelaxed', 'standTired'],
  ['phoneOnBedSit', 'phoneReach', 'phoneGrab', 'phoneLift', 'phoneHeld', 'phoneLowRelaxed', 'phoneGlanceUp', 'phoneStand'],
  ['brushTeeth', 'brushTeethFace', 'talkListen', 'talkSpeak', 'talkExplain', 'talkWorried', 'stretch'],
  ['lyingPhone', 'sleeping', 'tear', 'officeWork', 'manager', 'mother', 'walking'],
];
export const POSE_LIB_PAGES = PAGES.length;
export const PoseLibrary: React.FC = () => {
  const page = Math.min(PAGES.length - 1, useCurrentFrame());
  return (
    <AbsoluteFill style={{background: '#3a3a44'}}>
      {PAGES[page].map((n, i) => {
        const sz = (sizes as any)[n], k = Math.min(400 / sz.h, 440 / sz.w), col = i % 4, row = Math.floor(i / 4), cx = 240 + col * 480, base = 470 + row * 520;
        return (
          <React.Fragment key={n}>
            <Img src={staticFile(`poses/${n}.png`)} style={{position: 'absolute', left: cx - sz.w * k / 2, top: base - sz.h * k, width: sz.w * k, height: sz.h * k}} />
            <div style={{position: 'absolute', left: cx - 170, top: base + 14, width: 340, textAlign: 'center', color: '#fff', font: '700 28px sans-serif'}}>{n}</div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
