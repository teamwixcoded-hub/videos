const fs=require('fs');let f=fs.readFileSync('src/fathers/Fathers.tsx','utf8');
const r=(a,b,t)=>{if(!f.includes(a)){console.log('MISSING',t||a.slice(0,50));return;}f=f.replace(a,b)};
// bloom: a blurred, contrast-boosted copy of the shot added with "screen" so only the bright parts glow (lamps, windows, screens, candles)
r("        {shot.C(c)}\n      </AbsoluteFill>","        {shot.C(c)}\n        {!paperCard && <AbsoluteFill style={{mixBlendMode: 'screen', opacity: 0.4, filter: 'blur(26px) brightness(1.2) contrast(1.7)', pointerEvents: 'none'}}>{shot.C(c)}</AbsoluteFill>}\n      </AbsoluteFill>",'bloom');
// stronger teal / orange split, bottom haze, a warm key light that drifts, deeper vignette
r("      {!paperCard && <Cinema t={t} />}","      {!paperCard && <Cinema t={t} />}\n      {!paperCard && <>\n        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(14,80,125,.30) 0%, rgba(0,0,0,0) 48%, rgba(255,125,45,.20) 100%)', mixBlendMode: 'soft-light', pointerEvents: 'none'}} />\n        <AbsoluteFill style={{background: 'linear-gradient(0deg, rgba(8,10,26,.5) 0%, rgba(8,10,26,0) 34%)', pointerEvents: 'none'}} />\n        <AbsoluteFill style={{background: `radial-gradient(ellipse at ${warm ? 78 : 22}% 24%, rgba(${warm ? '255,196,120' : '150,190,255'},.2) 0%, rgba(0,0,0,0) 55%)`, mixBlendMode: 'screen', pointerEvents: 'none'}} />\n      </>}",'grade');
r("rgba(0,0,0,0) 52%, rgba(0,0,0,.55) 100%)","rgba(0,0,0,0) 44%, rgba(0,0,0,.66) 100%)",'vignette');
// anamorphic bars under the text layers
r("      <KineticWord t={t} words={WORDS} />","      {!paperCard && <><div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 54, background: '#000'}} /><div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 54, background: '#000'}} /></>}\n      <KineticWord t={t} words={WORDS} />",'bars');
fs.writeFileSync('src/fathers/Fathers.tsx',f);
