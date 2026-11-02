import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Hero, Head, Mood} from './Hero';

// Character sheet for Winter Arc: every mood on the head, then Sam and Jake in several poses (the body is fat/muscle + a pose = two arm targets and two foot targets).
const LBL: React.CSSProperties = {fontFamily: 'Montserrat, sans-serif', fontWeight: 800};
const MOODS: Mood[] = ['happy', 'determined', 'neutral', 'tired', 'sad', 'shock'];
const Tag: React.FC<{x: number; t: string}> = ({x, t}) => <text x={x} y={1062} textAnchor="middle" style={LBL} fontSize={24} fill="#cfd6ff" letterSpacing={2}>{t}</text>;
export const WinterSheet: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 30% 30%, #1b2140, #090b16)'}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      {MOODS.map((m, i) => (
        <g key={m} transform={`translate(${160 + i * 320} 135) scale(0.4)`}>
          <Head mood={m} id={'m' + i} skin={m === 'sad' ? '#9db8f0' : undefined} hair={m === 'sad' ? '#2d3d6e' : undefined} look={m === 'determined' ? [0.3, -0.1] : [0, 0]} />
        </g>
      ))}
      {MOODS.map((m, i) => <text key={m} x={160 + i * 320} y={250} textAnchor="middle" style={LBL} fontSize={20} fill="#8c96c8" letterSpacing={3}>{m.toUpperCase()}</text>)}
      <Hero x={190} y={1030} scale={0.78} id="s1" mood="determined" muscle={0.45} top="tee" pose="idle" />
      <Hero x={540} y={1030} scale={0.78} id="s2" mood="happy" muscle={0.9} top="bare" pose="flex" />
      <Hero x={890} y={1030} scale={0.78} id="s3" mood="determined" muscle={0.6} top="tank" topColor="#35c0a6" shorts pose="hips" />
      <Hero x={1240} y={1030} scale={0.78} id="j1" mood="tired" fat={0.85} top="hoodie" topColor="#59607a" slump={0.7} pose="belly" />
      <Hero x={1590} y={1030} scale={0.78} id="j2" mood="sad" fat={0.7} top="tee" topColor="#8a6fb8" slump={0.4} pose="slump" skin="#f1d9b0" />
      <Hero x={1830} y={1030} scale={0.45} id="s4" mood="shock" muscle={0.3} top="tee" pose="up" />
      <Tag x={190} t="IDLE" /><Tag x={540} t="FLEX" /><Tag x={890} t="HANDS ON HIPS" /><Tag x={1240} t="JAKE, HAND ON BELLY" /><Tag x={1590} t="JAKE, SLUMP" /><Tag x={1830} t="ARMS UP" />
    </svg>
  </AbsoluteFill>
);
