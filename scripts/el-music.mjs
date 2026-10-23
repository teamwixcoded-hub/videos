// Generates the music beds with ElevenLabs Music -> public/music/<name>.mp3
// Usage: node scripts/el-music.mjs [name ...]
import fs from 'node:fs';

const KEY = fs.readFileSync('.env', 'utf8').match(/ELEVENLABS_API_KEY=(\S+)/)[1];
// name -> [prompt, seconds]
const TRACKS = {
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
