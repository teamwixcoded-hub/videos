const fs = require('fs');
const edit = (file, fn) => { let s = fs.readFileSync(file, 'utf8'); s = fn(s); fs.writeFileSync(file, s); };
const rep = (s, a, b) => { if (!s.includes(a)) throw new Error('missing: ' + String(a).slice(0, 80)); return s.split(a).join(b); };

edit('src/winter/scenes.tsx', (s) => {
  s = rep(s, '<SideHero x={880} y={900} scale={1.1} id="tr"', '<SideHero x={880} y={900} scale={0.88} id="tr"');
  s = rep(s, '<rect x={300} y={830} width={1000} height={80} rx={20} fill="#3d4180" stroke={INK} strokeWidth={8} />\n    <SideHero x={760} y={780} scale={1.1} id="rd"', '<rect x={260} y={810} width={1000} height={90} rx={20} fill="#3d4180" stroke={INK} strokeWidth={8} />\n    <SideHero x={760} y={960} scale={0.95} id="rd"');
  // the doorway scene: a plain dark wall that warms as the door opens, no see-through layers
  s = rep(s, '<rect width={1920} height={1080} fill="#26325a" opacity={1 - open * 0.9} />\n      <rect width={1920} height={1080} fill="#2b3f6e" />', '<rect width={1920} height={1080} fill="#2b3f6e" />');
  s = rep(s, '<g transform={`translate(960 ${540 + (1 - ramp(t, t0, t0 + 0.4)) * 90}) rotate(-4)`}>', '<g transform={`translate(1240 ${540 + (1 - ramp(t, t0, t0 + 0.4)) * 90}) rotate(-4)`}>');
  return s;
});

edit('src/winter/Winter.tsx', (s) => {
  s = rep(s, "{at: T('same cold'), cam: [960, 500, 1.12]", "{at: T('same cold'), cam: [960, 760, 1.3]");
  s = rep(s, "{at: T('two men'), cam: [960, 640, 1.1]", "{at: T('two men'), cam: [960, 760, 1.28]");
  s = rep(s, "cam: [960, 430, 1.22], node: (t) => <TwoMen t={t} sam={{top: 'tee', mood: 'neutral'}}", "cam: [960, 820, 1.16], node: (t) => <TwoMen t={t} sam={{top: 'tee', mood: 'neutral'}}");
  s = rep(s, "cam: [960, 760, 1.18]", "cam: [960, 840, 1.14]");
  s = rep(s, "cam: [960, 720, 1.22]", "cam: [960, 840, 1.16]");
  s = rep(s, "{at: T('this is sam'), cam: [560, 560, 1.2]", "{at: T('this is sam'), cam: [960, 840, 1.12]");
  s = rep(s, "{at: T('one of them'), cam: [960, 560, 1.1]", "{at: T('one of them'), cam: [960, 840, 1.1]");
  s = rep(s, "{at: T('both men'), cam: [960, 640, 1.1]", "{at: T('both men'), cam: [960, 760, 1.28]");
  s = rep(s, "{at: T('both of them'), cam: [960, 640, 1.12]", "{at: T('both of them'), cam: [960, 760, 1.28]");
  s = rep(s, "{at: T('the alarm'), cam: [960, 700, 1.15]", "{at: T('the alarm'), cam: [960, 760, 1.3]");
  s = rep(s, "x: 480, y: 440}", "x: 470, y: 520}");
  s = rep(s, "x: 1120, y: 440}", "x: 1130, y: 520}");
  return s;
});
