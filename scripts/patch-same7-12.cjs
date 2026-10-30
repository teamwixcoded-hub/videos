const fs = require('fs');
let s = fs.readFileSync('src/same7/Same7.tsx', 'utf8');
const r = (re, b) => { if (!re.test(s)) throw new Error('MISSING ' + re); s = s.replace(re, b); };
r(/const Same7Main: React\.FC = \(\) => \{/, `// a music bed that swells in the pauses and sinks a little under the voice. The recordings are loud (about -19 dBFS) and the voice is quiet (about -23 dBFS), so vol 0.1 on the old scale is about 0.24 here.
const MusicBed: React.FC<{track: string; from: number; to: number; vol: number}> = ({track, from, to, vol}) => {
  const frames = Math.round((to - from) * FPS);
  return (
    <Sequence from={Math.round(from * FPS)} durationInFrames={frames}>
      <Audio src={staticFile(\`music/\${track}.mp3\`)} volume={(f) => Math.min(1, vol * 2.4 * (1 - 0.3 * talkEnv(from + f / FPS)) * Math.min(1, f / 60) * Math.min(1, Math.max(0, (frames - f) / 75)))} />
    </Sequence>
  );
};
const Same7Main: React.FC = () => {`);
r(/<Sequence from=\{0\} durationInFrames=\{Math\.round\(56 \* FPS\)\}><Music[^\n]*\n/, '<MusicBed track="low" from={0} to={56} vol={0.1} />\n');
r(/<Sequence from=\{Math\.round\(55\.5 \* FPS\)\} durationInFrames=\{Math\.round\(9 \* FPS\)\}><Music[^\n]*\n/, '<MusicBed track="wonder" from={55.5} to={64.5} vol={0.08} />\n');
r(/\{ACT_MUSIC\.map\(\(m, i\) => <Sequence[^\n]*\n/, "{ACT_MUSIC.map((m, i) => <MusicBed key={'am' + i} track={m.track} from={m.from} to={m.to} vol={m.vol} />)}\n");
s = s.replace("import {Music} from '../components/Music';\n", '');
fs.writeFileSync('src/same7/Same7.tsx', s);
