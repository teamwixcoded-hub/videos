// Second pass: recording-style prompts, two variants (A, B) per sound.
// Writes candidates to public/sfx/cand2/<name>-A.mp3 / -B.mp3, installs A as public/sfx/<name>.mp3 for object sounds,
// restores the real recorded voices (Freesound) for human vocal sounds, and writes out/sfx-review2.html to compare.
import fs from 'node:fs';

const KEY = fs.readFileSync('.env', 'utf8').match(/ELEVENLABS_API_KEY=(\S+)/)[1];

// name -> [prompt, seconds, loop?, voice?]
const SFX = {
  room_tone: ['very quiet empty bedroom at night, subtle low room tone, no voices, no music, nothing happening', 22, true],
  swell: ['soft ambient pad swell, gentle rise and fall, warm, no melody, no percussion', 5],
  whoosh: ['soft airy transition whoosh, smooth, no impact, no tail', 0.9],
  cloth_a: ['foley recording: soft cotton fabric movement, a person shifting on a bed, close microphone, no voice', 1.0],
  cloth_b: ['foley recording: quick light sleeve fabric swish, close microphone, no voice', 0.6],
  pickup: ['foley recording: a smartphone picked up from a cotton bedsheet, light fabric drag then soft plastic grip, no voice', 1.1],
  notification: ['a single gentle smartphone notification chime, two soft pleasant notes, clean', 0.9],
  swipe: ['foley recording: a finger swiping on a glass touchscreen, light airy swish', 0.5],
  pop_a: ['a single soft bubble pop, natural, short, close', 0.5],
  pop_b: ['a single soft low bubble pop, natural, short, close', 0.5],
  pop_c: ['a single tiny high bubble pop, natural, short, close', 0.5],
  sparkle: ['soft twinkling chime run, subtle fairy sparkle, three tiny bell notes', 1.3],
  meter: ['a short soft rising chime blip, subtle interface reward sound, clean', 0.5],
  page: ['foley recording: one page of a paperback book turned, crisp paper, close microphone, no voice', 1.0],
  clock: ['analog wall clock ticking, clean steady tick tock, quiet, dry, no echo', 5, true],
  door: ['a bedroom door opening slowly with a soft hinge creak, close microphone', 2.4],
  switch: ['one clean click of a lamp switch, small mechanical click, dry', 0.5],
  tea: ['hot tea poured into a ceramic cup, gentle liquid pour, close microphone', 2.2],
  brush: ['foley recording: manual toothbrush scrubbing teeth, steady rhythm, close microphone', 4.0],
  thud: ['foley recording: a hardback book set down gently on a wooden table, soft dull thud', 0.5],
  typing: ['foley recording: a few light finger taps on a phone touchscreen', 1.0],
  // human voices: AI versions are generated for comparison only; real recordings stay the default
  yawn: ['a tired man yawning, natural, close microphone', 3.5, false, true],
  sigh: ['a man exhaling a long tired sigh, natural, close microphone', 2.5, false, true],
  chuckle: ['a man quietly chuckling, natural, close microphone', 2.0, false, true],
  gasp: ['a woman gasping softly, natural, close microphone', 0.9, false, true],
  shout: ['a young man shouting a short annoyed "hey", natural, close microphone', 1.0, false, true],
};

fs.mkdirSync('public/sfx/cand2', {recursive: true});
const gen = async (name, [text, dur, loop], tag) => {
  const body = {text, duration_seconds: dur, prompt_influence: 0.7, model_id: 'eleven_text_to_sound_v2', ...(loop ? {loop: true} : {})};
  let res = await fetch('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128', {method: 'POST', headers: {'xi-api-key': KEY, 'Content-Type': 'application/json'}, body: JSON.stringify(body)});
  if (!res.ok && loop) { delete body.loop; res = await fetch('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128', {method: 'POST', headers: {'xi-api-key': KEY, 'Content-Type': 'application/json'}, body: JSON.stringify(body)}); }
  if (!res.ok) { console.log(name, tag, 'FAILED', res.status, (await res.text()).slice(0, 120)); return false; }
  fs.writeFileSync(`public/sfx/cand2/${name}-${tag}.mp3`, Buffer.from(await res.arrayBuffer()));
  return true;
};

const only = process.argv.slice(2);
for (const [name, spec] of Object.entries(SFX)) {
  if (only.length && !only.includes(name)) continue;
  const okA = await gen(name, spec, 'A');
  const okB = await gen(name, spec, 'B');
  const voice = spec[3];
  if (voice) {
    // real recordings stay the default for human voices
    if (fs.existsSync(`public/sfx/old/${name}.mp3`)) fs.copyFileSync(`public/sfx/old/${name}.mp3`, `public/sfx/${name}.mp3`);
  } else if (okA) fs.copyFileSync(`public/sfx/cand2/${name}-A.mp3`, `public/sfx/${name}.mp3`);
  console.log(name.padEnd(13), okA && okB ? 'A+B' : 'partial', voice ? '(real recording kept as default)' : '');
}

// listening page: current default vs the other options
const rows = Object.entries(SFX).map(([name, spec]) => {
  const cands = [];
  if (fs.existsSync(`public/sfx/old/${name}.mp3`)) cands.push([`old (${spec[3] ? 'real recording, default' : 'stock'})`, `../public/sfx/old/${name}.mp3`]);
  for (const t of ['A', 'B']) if (fs.existsSync(`public/sfx/cand2/${name}-${t}.mp3`)) cands.push([`AI ${t}${!spec[3] && t === 'A' ? ' (default)' : ''}`, `../public/sfx/cand2/${name}-${t}.mp3`]);
  return `<section><h2>${name} <small>${spec[3] ? 'human voice' : ''}</small></h2>${cands.map(([l, p]) => `<div class="row"><b>${l}</b><audio controls preload="none" src="${p}"></audio></div>`).join('')}</section>`;
}).join('');
fs.writeFileSync('out/sfx-review2.html', `<!doctype html><meta charset="utf-8"><title>SFX review 2</title><style>body{font:15px system-ui;background:#14131a;color:#eee;max-width:900px;margin:30px auto;padding:0 16px}h2{margin:26px 0 6px}small{color:#9a96ad;font-weight:400}.row{display:flex;gap:14px;align-items:center;background:#1e1c27;border-radius:10px;padding:8px 14px;margin:6px 0}.row b{width:230px;font-weight:600}audio{flex:1}</style><h1>Sound effect options</h1><p>Tell me which sounds are wrong and which option you prefer.</p>${rows}`);
console.log('review page: out/sfx-review2.html');
