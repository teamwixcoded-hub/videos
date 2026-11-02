import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Hero, Head} from './Hero';

// Character sheet for Winter Arc: the happy | sad split head (from the reference), then Sam (fit) and Jake (soft) side by side.
const LBL: React.CSSProperties = {fontFamily: 'Montserrat, sans-serif', fontWeight: 800};
export const WinterSheet: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 30% 40%, #1b2140, #090b16)'}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      <defs>
        <clipPath id="clipL"><rect x={-300} y={-300} width={300} height={600} /></clipPath>
        <clipPath id="clipR"><rect x={0} y={-300} width={300} height={600} /></clipPath>
      </defs>
      <g transform="translate(300 420) scale(0.95)">
        <g clipPath="url(#clipL)"><Head mood="happy" id="a" /></g>
        <g clipPath="url(#clipR)"><Head mood="sad" skin="#8fb0ee" hair="#2d3d6e" id="b" /></g>
        <rect x={-2} y={-210} width={4} height={420} fill="#fff" opacity={0.9} />
      </g>
      <text x={300} y={760} textAnchor="middle" style={LBL} fontSize={34} fill="#cfd6ff" letterSpacing={4}>HAPPY | SAD</text>
      <Hero x={820} y={1010} scale={1.05} id="sam" mood="determined" fat={0.05} muscle={0.55} top="tee" topColor="#e9962c" />
      <Hero x={1230} y={1010} scale={1.05} id="jake" mood="tired" fat={0.85} muscle={0} top="hoodie" topColor="#59607a" slump={0.6} />
      <Hero x={1640} y={1010} scale={1.05} id="sam2" mood="happy" fat={0} muscle={0.9} top="bare" />
      <text x={820} y={1050} textAnchor="middle" style={LBL} fontSize={26} fill="#fff">SAM</text>
      <text x={1230} y={1050} textAnchor="middle" style={LBL} fontSize={26} fill="#fff">JAKE</text>
      <text x={1640} y={1050} textAnchor="middle" style={LBL} fontSize={26} fill="#fff">SAM, DAY 90</text>
    </svg>
  </AbsoluteFill>
);
