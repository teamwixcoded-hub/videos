// Two Fathers: the sounds this story needs that public/sfx and public/sfx3 do not have. ElevenLabs text-to-sound -> public/sfx4/.
// COSTS CREDITS: ask the user first. Usage: node scripts/el-sfx4.mjs   |   node scripts/el-sfx4.mjs phone_ring door_knock
// After generating, set HAVE_SFX4 = true in src/fathers/Fathers.tsx and add the cues listed next to each sound (times are video seconds).
import fs from 'node:fs';

const KEY = fs.readFileSync('.env', 'utf8').match(/ELEVENLABS_API_KEY=(\S+)/)[1];

// name -> [prompt, seconds (min 0.5), loop?]   (cue times in the comment)
const SFX = {
  phone_ring_far: ['a muffled smartphone ringtone heard through a closed window from across a quiet street, soft and distant, two rings, no music', 4.0],        // 26.4 (Sam's phone across the street), 302.6, SundayFlip rings
  phone_ring_close: ['a warm classic smartphone ringtone, close and clear, three rings, no music, dry', 4.0],                                                      // 299.7, then every Sunday in the M3 flip on the beat
  door_knock: ['three firm knocks on a wooden interior door, close microphone, dry, a little hollow', 1.6],                                                       // 198.3 (one knock), 198.9
  laptop_lid: ['a laptop lid closing with a soft final click, close microphone, dry', 0.8],                                                                        // 56.95, 82.75
  party_noise: ['a children birthday party in a living room, kids laughing and chattering, a few party horns, muffled, loopable', 8.0, true],                      // 95.0-105.0 (loop, low)
  kite_wind: ['wind in an open field with a paper kite fluttering and a line humming, gentle, loopable', 8.0, true],                                               // 109.0-120.0 and 120-148 (loop, low)
  kite_tear: ['paper tearing slowly, a short rip of a paper kite, close microphone', 1.2],                                                                         // 140.9
  applause_hall: ['applause in a small school auditorium, a hundred people clapping, one person clapping louder, room reverb', 6.0],                              // 168.0 (Sam claps too loud), 172.5
  hospital_amb: ['a quiet hospital corridor ambience, far footsteps, a distant trolley, soft air conditioning hum, loopable', 8.0, true],                          // 35.0-53.0
  baby_coo: ['a newborn baby making a tiny soft coo sound, close microphone, no crying', 1.5],                                                                     // 48.0
  transfer_chime: ['a clean banking app notification chime, two soft rising notes, no reverb', 1.0],                                                               // 297.3 (replaces phone_notif)
  shutter_click: ['a smartphone camera shutter click with a tiny soft thud, dry, close', 0.6],                                                                      // 466.0
  footsteps_walk: ['two people walking slowly side by side on a paved street, calm footsteps, loopable', 6.0, true],                                               // 220.6, 362.0, 454.0
  crowd_cafe_street: ['a quiet street corner tea stall ambience, distant traffic, a kettle, a few voices, loopable', 8.0, true],                                   // 223.5, 367.3, 458.0
  chair_slam: ['a wooden kitchen chair pushed back hard and scraping, then a bang as it hits a wall, close, dry', 1.2],                                            // 217.8
};

fs.mkdirSync('public/sfx4', {recursive: true});
const gen = async (text, dur, loop) => {
  const body = {text, duration_seconds: dur, prompt_influence: 0.7, model_id: 'eleven_text_to_sound_v2', ...(loop ? {loop: true} : {})};
  const post = (b) => fetch('https://api.elevenlabs.io/v1/sound-generation?output_format=mp3_44100_128', {method: 'POST', headers: {'xi-api-key': KEY, 'Content-Type': 'application/json'}, body: JSON.stringify(b)});
  let res = await post(body);
  if (!res.ok && loop) { delete body.loop; res = await post(body); }
  if (!res.ok) return {ok: false, err: `${res.status} ${(await res.text()).slice(0, 140)}`};
  return {ok: true, buf: Buffer.from(await res.arrayBuffer())};
};
const only = process.argv.slice(2);
let done = 0, failed = 0;
for (const [name, [text, dur, loop]] of Object.entries(SFX)) {
  if (only.length && !only.includes(name)) continue;
  const out = `public/sfx4/${name}.mp3`;
  if (fs.existsSync(out) && !only.length) { console.log(name, 'exists, skipped'); continue; }
  const r = await gen(text, dur, loop);
  if (r.ok) { fs.writeFileSync(out, r.buf); done++; console.log(name, 'ok'); } else { failed++; console.log(name, 'FAILED', r.err); }
}
console.log(`done: ${done} generated, ${failed} failed`);
