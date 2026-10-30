const fs=require('fs');let h=fs.readFileSync('src/fathers/Human.tsx','utf8');
const a=h.indexOf("  const hangF = T[1] > S[1] + 250");const b=h.indexOf("\n",a);
if(a<0)throw new Error('line');
h=h.slice(0,a)+`  // a raised arm: the upper arm hangs from the shoulder as low as it can (elbow beside or in front of the waist, never winged out) and only swings up when the hand is too high to reach; the forearm is then shorter (foreshortened toward the camera)
  const hangF = T[1] > S[1] + 250, ox = S[0] < 0 ? -1 : 1;
  let {J: E, H} = ik2(S, Tg, 176, 164, (c) => ((c[0][0] - c[1][0]) * ox > 0 ? c[0] : c[1]));
  if (!hangF) {
    for (let d = 8; d <= 172; d += 4) {
      const th = (d * Math.PI) / 180, cands: V[] = [[S[0] + ox * 176 * Math.sin(th), S[1] + 176 * Math.cos(th)], [S[0] - ox * 176 * Math.sin(th), S[1] + 176 * Math.cos(th)]];
      const ok = cands.find((c) => Math.hypot(c[0] - T[0], c[1] - T[1]) <= 178);
      if (ok) { E = ok; H = T; break; }
    }
  }`+h.slice(b);
fs.writeFileSync('src/fathers/Human.tsx',h);
