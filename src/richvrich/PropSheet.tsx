import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Car, Truck, BankCard, PhoneBank, Bills, Coins, Jar} from './props';

// Prop sheet for Look Rich vs Rich: every prop in its main states.
export const PropSheet: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 30% 20%, #232a5c, #0a0d20)'}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      <rect y={470} width={1920} height={16} fill="#2b3350" opacity={0.6} />
      <Truck x={470} y={440} scale={0.95} />
      <Car x={1330} y={440} scale={1.0} color="#c9cfe0" />
      <Car x={1740} y={300} scale={0.4} color="#d9534f" lights />
      <BankCard x={270} y={720} scale={0.72} />
      <BankCard x={700} y={720} scale={0.72} c1="#d84f4f" c2="#7a1f2a" declined name="JAKE MILLER" />
      <BankCard x={1130} y={720} scale={0.72} c1="#2a2f55" c2="#0a0d20" credit digits="5301 8842 0017 6620" name="JAKE MILLER" />
      <PhoneBank x={1560} y={760} scale={0.5} balance="$4,000" sub="PAYDAY" accent="#3b6fd8" rows={[{label: 'Rent', amt: '-$1,600'}, {label: 'Streaming', amt: '-$18'}, {label: 'Gym', amt: '-$49', c: '#ffb04a'}]} />
      <PhoneBank x={1800} y={760} scale={0.5} balance="-$240" balC="#ff4a5e" sub="OVERDRAFT" accent="#a8283a" rows={[{label: 'Delivery', amt: '-$28'}, {label: 'Venmo', amt: '-$60'}, {label: 'Fee', amt: '-$35', c: '#ff4a5e'}]} />
      <Bills x={930} y={930} scale={0.62} n={4} />
      <Coins x={1180} y={960} scale={0.55} n={6} />
      <Jar x={1360} y={930} scale={0.34} fill={0.6} />
    </svg>
  </AbsoluteFill>
);
