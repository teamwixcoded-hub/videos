import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Actor2} from './kit2';
import {ARMCHAIR_SIDE} from './seats';
import {POSES, POSE_PAGES} from './poses';

// Studio-only review page: every pose in the library, large, with its name. One PAGE per frame (scrub the timeline). Not part of the video.
export const PoseSheet: React.FC = () => {
  const page = Math.min(POSE_PAGES.length - 1, useCurrentFrame());
  const list = Object.entries(POSES).filter(([, p]) => p.group === POSE_PAGES[page]);
  const CW = 480, RH = 520;
  return (
    <AbsoluteFill style={{background: '#3a3a44'}}>
      <div style={{position: 'absolute', left: 30, top: 8, color: '#ffd23f', font: '800 34px sans-serif'}}>{POSE_PAGES[page].toUpperCase()}  ({page + 1}/{POSE_PAGES.length})</div>
      {list.map(([name, p], i) => {
        const col = i % 4, row = Math.floor(i / 4), cx = 240 + col * CW, base = 60 + row * RH + 400;
        const {group, who, seat, bed, floor, ...keys} = p as any;
        return (
          <React.Fragment key={name}>
            {bed && <div style={{position: 'absolute', left: cx - 180, top: base - 14, width: 400, height: 40, borderRadius: 12, background: '#d8d2c4'}} />}
            {floor && <div style={{position: 'absolute', left: cx + (floor[0] - 150) * (400 / 430) - 8, top: base + (floor[1] - 416) * (400 / 430) - 4, width: 34, height: 12, borderRadius: 4, background: '#2b3142', border: '2px solid #33190f'}} />}
            <Actor2 id={name} pal={who === 'green' ? 'teal' : 'coral'} x={cx} y={base} h={400} keys={[{t: 0, ...keys}]}
              seat={seat ? ARMCHAIR_SIDE : undefined} shadow={false} flips={name === 'bookTurnPage' ? [-0.4] : []} />
            <div style={{position: 'absolute', left: cx - 170, top: base + 26, width: 340, textAlign: 'center', color: '#fff', font: '700 28px sans-serif'}}>{name}</div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
