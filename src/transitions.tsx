import React from 'react';
import {AbsoluteFill, interpolate, Easing} from 'remotion';
import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';

// Whip pan: both scenes slide sideways fast with horizontal motion blur, so the cut reads as one camera move.
type WhipProps = {direction?: 'left' | 'right'};

const Whip: React.FC<TransitionPresentationComponentProps<WhipProps>> = ({children, presentationProgress, presentationDirection, passedProps}) => {
  const dir = passedProps.direction === 'right' ? 1 : -1;
  const p = Easing.inOut(Easing.cubic)(presentationProgress);
  // entering comes from the opposite side of where exiting leaves to
  const x = presentationDirection === 'entering' ? (1 - p) * -dir * 100 : p * dir * 100;
  const blur = Math.sin(presentationProgress * Math.PI) * 40;
  const id = `whip-${presentationDirection}`;
  return (
    <AbsoluteFill style={{transform: `translateX(${x}%)`, filter: `url(#${id})`}}>
      <svg width="0" height="0" style={{position: 'absolute'}}>
        <filter id={id} x="-20%" y="-5%" width="140%" height="110%">
          <feGaussianBlur stdDeviation={`${blur} 0`} />
        </filter>
      </svg>
      {children}
    </AbsoluteFill>
  );
};
export const whip = (direction: 'left' | 'right' = 'left'): TransitionPresentation<WhipProps> => ({component: Whip, props: {direction}});

// Zoom through: the old scene rushes toward the camera and fades while the new one settles in from far away.
type ZoomProps = {originX?: number; originY?: number; flash?: boolean};

const ZoomThrough: React.FC<TransitionPresentationComponentProps<ZoomProps>> = ({children, presentationProgress, presentationDirection, passedProps}) => {
  const {originX = 960, originY = 540} = passedProps;
  const p = presentationProgress;
  if (presentationDirection === 'exiting') {
    const s = interpolate(p, [0, 1], [1, 4], {easing: Easing.in(Easing.cubic)});
    const o = interpolate(p, [0.45, 1], [1, 0], {extrapolateLeft: 'clamp'});
    return <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: `${originX}px ${originY}px`, opacity: o}}>{children}</AbsoluteFill>;
  }
  const s = interpolate(p, [0, 1], [0.55, 1], {easing: Easing.out(Easing.cubic)});
  const o = interpolate(p, [0.3, 0.8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{transform: `scale(${s})`, opacity: o}}>{children}</AbsoluteFill>;
};
export const zoomThrough = (originX = 960, originY = 540): TransitionPresentation<ZoomProps> => ({component: ZoomThrough, props: {originX, originY}});

// Hard "pop" cut with a white flash, for punchy beats.
type PopProps = Record<string, never>;
const Pop: React.FC<TransitionPresentationComponentProps<PopProps>> = ({children, presentationProgress, presentationDirection}) => {
  const visible = presentationDirection === 'entering' ? presentationProgress > 0.5 : presentationProgress < 0.5;
  const flash = Math.max(0, 1 - Math.abs(presentationProgress - 0.5) * 4);
  return (
    <AbsoluteFill style={{opacity: visible ? 1 : 0}}>
      {children}
      {presentationDirection === 'entering' && <AbsoluteFill style={{background: '#fff', opacity: flash}} />}
    </AbsoluteFill>
  );
};
export const pop = (): TransitionPresentation<PopProps> => ({component: Pop, props: {}});
