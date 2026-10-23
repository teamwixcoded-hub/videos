import React from 'react';
import {Img, staticFile} from 'remotion';

export type HeroExpr =
  | 'neutral' | 'bored' | 'tired' | 'frustrated' | 'sad' | 'crying' | 'angry' | 'focused' | 'smile' | 'proud' | 'surprised' | 'relieved'
  | 'read-calm' | 'read-smile' | 'read-puzzled' | 'read-bored' | 'read-absorbed' | 'phone-stare' | 'phone-laugh' | 'phone-slack' | 'closed' | 'closed-tired' | 'content' | 'guilty'
  | 'asleep' | 'yawn' | 'look-up-right' | 'look-left' | 'talk-wide' | 'talk-o' | 'nervous' | 'scared' | 'smug' | 'bloodshot' | 'laugh' | 'glazed';
export type MomExpr = 'neutral' | 'smile' | 'worried' | 'hurt' | 'surprised' | 'talk';
export type MgrExpr = 'neutral' | 'smile' | 'impressed' | 'skeptical' | 'serious' | 'talk' | 'talk-smile' | 'smirk';

export type HeadSet = 'hero' | 'mom' | 'mgr';
export type Expression = HeroExpr | MomExpr | MgrExpr;

const DIR: Record<HeadSet, string> = {hero: 'heads', mom: 'mom', mgr: 'mgr'};

// One head image from the generated expression library. Heads are 400x400 transparent PNGs.
export const Head: React.FC<{expression?: Expression; set?: HeadSet; size?: number; opacity?: number}> = ({expression = 'neutral', set = 'hero', size = 200, opacity = 1}) => (
  <Img src={staticFile(`images/${DIR[set]}/${expression}.png`)} style={{width: size, height: size, opacity}} />
);
