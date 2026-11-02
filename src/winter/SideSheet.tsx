import React from 'react';
import {AbsoluteFill} from 'remotion';
import {SideHero} from './SideHero';

// Side-view sheet: the gym poses and Jake's bed pose.
const LBL: React.CSSProperties = {fontFamily: 'Montserrat, sans-serif', fontWeight: 800};
const T: React.FC<{x: number; y: number; t: string}> = ({x, y, t}) => <text x={x} y={y} textAnchor="middle" style={LBL} fontSize={24} fill="#cfd6ff" letterSpacing={2}>{t}</text>;
export const WinterSide: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 30% 30%, #1b2140, #090b16)'}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      <rect x={0} y={520} width={1920} height={4} fill="#2b3350" /><rect x={0} y={1000} width={1920} height={80} fill="#0d1020" />
      {/* row 1 (floor y = 480) */}
      <SideHero x={130} y={480} scale={0.52} id="a1" mood="determined" muscle={0.4} pose="stand" />
      <SideHero x={420} y={480} scale={0.52} id="a2" mood="determined" muscle={0.7} top="tank" topColor="#35c0a6" shorts pose="squat" />
      <SideHero x={740} y={480} scale={0.52} id="a3" mood="happy" muscle={0.9} top="bare" pose="curl" />
      <SideHero x={1230} y={480} scale={0.52} id="a4" mood="determined" muscle={0.5} top="tank" topColor="#35c0a6" shorts pose="pushup" />
      <SideHero x={1660} y={480} scale={0.52} id="a5" mood="determined" muscle={0.6} top="tank" topColor="#35c0a6" shorts pose="run" />
      <T x={130} y={510} t="STAND" /><T x={420} y={510} t="SQUAT" /><T x={740} y={510} t="CURL" /><T x={1130} y={510} t="PUSH-UP" /><T x={1660} y={510} t="RUN" />
      {/* row 2: Jake */}
      <rect x={90} y={930} width={420} height={40} rx={10} fill="#4b3f78" stroke="#16121c" strokeWidth={6} /><rect x={90} y={970} width={420} height={30} fill="#2b2547" />
      <SideHero x={250} y={1000} scale={0.52} id="j1" mood="tired" fat={0.85} top="hoodie" topColor="#6b4fc4" pose="sit" />
      <SideHero x={700} y={1000} scale={0.52} id="j2" mood="sad" fat={0.8} top="tee" topColor="#8a6fb8" pose="stand" />
      <SideHero x={1100} y={1000} scale={0.52} id="j3" mood="tired" fat={0.6} top="hoodie" topColor="#6b4fc4" pose="run" />
      <T x={300} y={1050} t="JAKE ON THE BED" /><T x={700} y={1050} t="JAKE, SOFT" /><T x={1130} y={1050} t="JAKE TRIES TO RUN" />
      <SideHero x={1500} y={1000} scale={0.52} id="s2" mood="happy" muscle={0.9} top="bare" pose="stand" />
      <T x={1540} y={1050} t="SAM, DAY 90" />
    </svg>
  </AbsoluteFill>
);
