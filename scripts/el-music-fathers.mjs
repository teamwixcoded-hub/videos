// Generates the music beds with ElevenLabs Music -> public/music/<name>.mp3
// Usage: node scripts/el-music.mjs [name ...]
import fs from 'node:fs';

const KEY = fs.readFileSync('.env', 'utf8').match(/ELEVENLABS_API_KEY=(\S+)/)[1];
// name -> [prompt, seconds]
const TRACKS = {
  tf_cold: ['sparse intimate instrumental, a quiet ticking clock feel, a single soft piano note now and then, cold empty morning, very slow, no drums, no vocals', 34],
  tf_guitar: ['warm gentle acoustic guitar instrumental with soft light piano, nostalgic and tender, steady calm tempo, family warmth, no drums, no vocals', 76],
  tf_thin: ['thin sad piano instrumental, sparse notes, a lonely teenage night, slow, with long silences, subtle soft strings, no drums, no vocals', 70],
  tf_return: ['quiet reflective piano instrumental, the same lonely melody returning older and heavier, slow, melancholic, sparse, no drums, no vocals', 52],
  tf_build: ['slow emotional build, soft piano and strings gradually rising, anticipation and quiet courage, no drums, no vocals', 32],
  tf_end: ['warm acoustic guitar and piano resolve, hopeful, gentle, tender and uplifting, a family reunited, slowly swelling then calm, no vocals', 52],
  wonder: ['gentle curious ambient instrumental, soft felt piano with a warm airy pad, slow tempo, intimate and reflective, a quiet sense of mystery, minimal, no drums, no vocals', 72],
  routine: ['monotonous repetitive instrumental, muted soft piano with a dull steady pulse, slightly melancholic and tired, slow, minimal, a feeling of days blurring together, no vocals', 66],
  hope: ['warm hopeful instrumental, soft acoustic guitar and light piano slowly building, gentle optimism, sunrise feeling, calm and uplifting, no drums, no vocals', 74],
  low: ['dark sparse ambient instrumental, low drone with a lonely single piano note now and then, empty and heavy, sad and isolated, very slow, no vocals', 26],
  resolve: ['emotional cinematic instrumental, piano and strings slowly swelling to a quiet powerful resolution, reflective, hopeful, bittersweet, no vocals', 50],
};

fs.mkdirSync('public/music', {recursive: true});
const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(TRACKS);
for (const name of names) {
  const [prompt, sec] = TRACKS[name];
  const res = await fetch('https://api.elevenlabs.io/v1/music?output_format=mp3_44100_128', {
    method: 'POST',
    headers: {'xi-api-key': KEY, 'Content-Type': 'application/json'},
    body: JSON.stringify({prompt, music_length_ms: sec * 1000, force_instrumental: true}),
  });
  if (!res.ok) { console.log(name, 'FAILED', res.status, (await res.text()).slice(0, 200)); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(`public/music/${name}.mp3`, buf);
  console.log(name.padEnd(9), sec + 's', Math.round(buf.length / 1024) + 'KB');
}
