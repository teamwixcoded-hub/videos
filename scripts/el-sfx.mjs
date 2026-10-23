// Generates every sound effect with ElevenLabs text-to-sound and writes public/sfx/<name>.mp3.
// Old (Freesound) files are kept in public/sfx/old/. Usage: node scripts/el-sfx.mjs [name ...]  (no args = all)
import fs from 'node:fs';

const KEY = fs.readFileSync('.env', 'utf8').match(/ELEVENLABS_API_KEY=(\S+)/)[1];

// name -> [prompt, seconds, loop?]
const SFX = {
  room_tone: ['quiet bedroom at night, very soft room tone, faint distant air conditioning hum, no music, no voices', 22, true],
  swell: ['soft cinematic ambient swell rising gently then fading, warm pad, no melody, no drums', 5],
  whoosh: ['soft smooth air whoosh, gentle camera move, short', 1.0],
  cloth_a: ['soft cotton clothing rustle as a person shifts their arm, quiet, close up', 1.0],
  cloth_b: ['quick soft fabric rustle of a hoodie sleeve, quiet, close up', 0.7],
  pickup: ['hand picks up a smartphone from a soft cotton bed blanket, gentle plastic and fabric sound, close up', 1.2],
  notification: ['single soft smartphone notification ping, clean, friendly, one note', 1.0],
  swipe: ['quick finger swipe on a smartphone touchscreen, soft whoosh with a tiny tap', 0.5],
  chuckle: ['a man quietly chuckles and laughs at something funny on his phone, short, close, natural', 2.0],
  pop_a: ['cute soft bubble pop, cartoon, short, bright', 0.5],
  pop_b: ['cute cartoon pop with a slightly lower pitch, short and soft', 0.5],
  pop_c: ['small cartoon bubble pop with a higher pitch, short and light', 0.5],
  sparkle: ['gentle magical sparkle chime, three tiny glassy bell notes rising, soft', 1.4],
  meter: ['short rising video game reward tick, a single bright rising blip, soft and clean', 0.6],
  page: ['one page of a paperback book being turned, soft paper rustle, close up, quiet', 1.0],
  clock: ['wall clock ticking steadily, slow soft tick tock, quiet room, no music', 5, true],
  yawn: ['a tired man gives a big long yawn with a sleepy sigh at the end, close up, natural', 3.5],
  sigh: ['a tired man lets out a long heavy sigh of frustration, close up, natural', 2.5],
  switch: ['one clean click of a floor lamp switch being turned off, small mechanical click', 0.5],
  door: ['a wooden interior door slowly opening with a gentle creak', 2.5],
  gasp: ['a middle aged woman gasps softly in hurt surprise, close up', 1.0],
  shout: ['a young man snaps and shouts angrily "hey!" in a short irritated outburst, close up', 1.2],
  brush: ['person brushing teeth with a manual toothbrush, steady scrubbing sound, close up', 4.0],
  tea: ['hot tea being poured into a ceramic cup, gentle liquid sound, cozy and quiet', 2.3],
  thud: ['a hardback book gently set down on top of other books, soft muted thud', 0.6],
  boom: ['deep cinematic impact hit with a short low rumble tail, trailer style, no music', 1.6],
  riser: ['tension riser, rising pitch and intensity building up then cutting off, cinematic, no melody', 2.5],
  rewind: ['tape rewind sound, fast reverse whirr with a short digital glitch, retro VHS', 2.0],
  glitch: ['short digital glitch burst, quick static stutter', 0.5],
  key: ['single mechanical keyboard key press, one clean soft click, close microphone', 0.5],
  stamp: ['heavy rubber stamp slamming down on paper, one solid thud with a short papery thump', 0.9],
  scribble: ['felt pen scribbling a quick circle on paper, short scratchy pen sound', 0.9],
  strike: ['quick marker pen strike-through swipe across paper, one fast scratch', 0.6],
  titlehit: ['soft cinematic title hit, low impact with a short airy shimmer, tasteful, no music', 1.2],
  chapter: ['low cinematic whoosh into a gentle deep thump, title card appearing, tasteful', 1.5],
  tick: ['small soft interface tick, clean subtle digital tick', 0.5],
  sleepy: ['soft sleepy descending three note chime, gentle marimba, lullaby feel, no voice', 2.5],
  exhale: ['soft airy descending breath of wind, a slow sad whoosh fading out, no voice', 2.0],
  plink: ['playful cheerful pizzicato plucks, three quick happy plinks rising, no voice', 1.2],
  sting: ['short tense orchestral string stab, sudden and quiet, no voice', 0.8],
  thump: ['dull soft low thump, like a heavy door closing far away, no voice', 0.8],
  sub: ['deep sub bass drop, a single huge low frequency boom that fades slowly, cinematic trailer impact, no music', 2.5],
  heartbeat: ['slow tense heartbeat, two deep soft thumps, cinematic suspense, no voice', 2.0],
  revswell: ['reverse cymbal swell rising into a sudden stop, cinematic build up, no music', 2.5],
  typing: ['a few quick soft taps of a finger typing on a smartphone screen', 1.2],
};

fs.mkdirSync('public/sfx/old', {recursive: true});
const names = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SFX);
for (const name of names) {
  const [text, dur, loop] = SFX[name];
  const body = {text, duration_seconds: dur, prompt_influence: 0.6, model_id: 'eleven_text_to_sound_v2', ...(loop ? {loop: true} : {})};
  let res = await fetch('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128', {method: 'POST', headers: {'xi-api-key': KEY, 'Content-Type': 'application/json'}, body: JSON.stringify(body)});
  if (!res.ok && loop) { // older model without loop support: retry plainly
    delete body.loop;
    res = await fetch('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128', {method: 'POST', headers: {'xi-api-key': KEY, 'Content-Type': 'application/json'}, body: JSON.stringify(body)});
  }
  if (!res.ok) { console.log(name.padEnd(13), 'FAILED', res.status, (await res.text()).slice(0, 160)); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  const out = `public/sfx/${name}.mp3`;
  if (fs.existsSync(out) && !fs.existsSync(`public/sfx/old/${name}.mp3`)) fs.copyFileSync(out, `public/sfx/old/${name}.mp3`);
  fs.writeFileSync(out, buf);
  console.log(name.padEnd(13), dur + 's', Math.round(buf.length / 1024) + 'KB');
}
