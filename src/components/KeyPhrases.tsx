import React from 'react';
import {KText} from './KText';
import {S} from '../easing';

// Short on-screen phrases that pop in word by word, in the scene, instead of a subtitle bar.
// Times are script seconds (S() applies the global speed setting). `hi` = words drawn in the accent colour.
export type KP = {t: string; from: number; to: number; hi?: string[]; accent?: string; pos?: 'bottom' | 'top'; color?: string; big?: boolean};

export const KeyPhrases: React.FC<{lines: KP[]}> = ({lines}) => (
  <>
    {lines.map((l, i) => {
      const n = l.t.length;
      const base = n > 26 ? 76 : n > 18 ? 88 : n > 12 ? 100 : 112;
      const size = l.big ? Math.round(base * 1.3) : base;
      return (
        <KText
          key={i}
          text={l.t}
          at={S(l.from)}
          until={S(l.to)}
          x={960}
          y={l.pos === 'top' ? 160 : 940}
          size={size}
          rotate={i % 2 === 0 ? -1.2 : 1.2}
          highlight={l.hi ?? []}
          accent={l.accent ?? '#ffd23f'}
          color={l.color ?? '#fff'}
          stagger={3}
        />
      );
    })}
  </>
);
