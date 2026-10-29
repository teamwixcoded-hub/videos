// Sound design for the 2D cut (Same2D). Generates recording-style sounds with ElevenLabs text-to-sound into public/sfx3/.
// Usage: node scripts/el-sfx3.mjs            (all)   |   node scripts/el-sfx3.mjs page_turn whoosh_soft   (some)
// Sounds with a "b" variant also write <name>_b.mp3 so two takes can be compared by ear. Existing public/sfx/ is never touched.
import fs from 'node:fs';

const KEY = fs.readFileSync('.env', 'utf8').match(/ELEVENLABS_API_KEY=(\S+)/)[1];

// name -> [prompt, seconds (min 0.5), loop?, makeVariantB?]
const SFX = {
  // ---- phone ----
  phone_swipe: ['foley recording: one finger swiping up on a glass smartphone touchscreen, a single light airy slide, close microphone, dry, no music', 0.5, false, true],
  phone_tap: ['a single soft finger tap on a glass touchscreen, dry, close microphone', 0.5],
  phone_notif: ['a single clean modern smartphone notification, two short bright notes, no reverb, no music', 0.9],
  phone_unlock: ['a smartphone unlocking: a soft click and a quick subtle rising chime, clean', 0.7],
  phone_buzz: ['a smartphone vibrating on a wooden bedside table, two short buzzes, close microphone', 1.4],
  phone_pickup: ['foley recording: a smartphone picked up from a cotton bedsheet, fabric drag then a soft plastic grip, close microphone, no voice', 1.1],
  alarm_beep: ['a digital bedside alarm clock beeping, a rapid series of dry electronic beeps, no echo', 2.2],
  // ---- rewards and interface ----
  reward_pop: ['a bright cheerful reward sound like a game coin collect with a tiny sparkle, short, clean, no music', 0.7, false, true],
  dopamine_tick: ['a soft satisfying rising interface blip, single, clean', 0.5],
  counter_tick: ['a very short crisp interface tick, dry, like a number counter ticking up', 0.5],
  kw_pop: ['a soft low pop with a quick airy whoosh, like text popping onto screen, clean, short', 0.6],
  // ---- books ----
  page_turn: ['foley recording: one page of a paperback book turned slowly, crisp paper rustle, close microphone, no voice', 0.9, false, true],
  page_flutter: ['foley recording: several pages of a paperback book flipping quickly under a thumb, close microphone', 1.0],
  book_open: ['foley recording: a hardcover book opened, a soft creak of the spine and cover, close microphone', 0.9],
  book_close: ['foley recording: a paperback book closed firmly, a soft pat of the covers, short, close microphone', 0.6],
  book_toss: ['foley recording: a hardcover book tossed onto the upholstered arm of a chair, a soft thump with a fabric rustle', 0.8],
  // ---- time ----
  clock_tick: ['a quiet bedside clock ticking, dry steady tick tock, no echo, no music', 4.0, true],
  clock_spin: ['a time-lapse clock sound: fast ticking speeding up with a rising whir, ending on one soft chime, cinematic, clean', 2.6],
  // ---- transitions and hits ----
  whoosh_soft: ['a smooth airy cinematic transition whoosh, mid length, no impact, no tail', 0.8, false, true],
  whip: ['a very fast whip-pan swish, sharp airy whoosh, very short', 0.5],
  flash_boom: ['a cinematic hit: a low sub boom with a bright shimmering tail, trailer impact, clean', 1.6],
  title_hit: ['a deep powerful cinematic title impact with a long reverb tail, preceded by a very short riser', 2.6],
  tape_rewind: ['a tape rewind sweep: a quick reverse whoosh with spinning tape ending abruptly, then silence', 1.5],
  shimmer: ['a soft magical shimmer sweep of tiny glassy chimes moving across, short, delicate', 1.2],
  riser: ['a short tense cinematic riser, rising noise and tone, building, no melody', 3.0],
  paper_scatter: ['sheets of paper bursting and scattering through the air, a quick flutter', 1.0],
  // ---- props and life ----
  spoon_bowl: ['foley recording: a spoon clinking softly against a ceramic cereal bowl, a few taps, close microphone', 1.5],
  brush_teeth: ['foley recording: a manual toothbrush scrubbing teeth, steady rhythm, close microphone', 3.0],
  tea_pour: ['foley recording: hot tea poured into a ceramic mug, a gentle liquid stream, close microphone', 2.4],
  lamp_click: ['one clean click of a lamp switch, small mechanical click, dry', 0.5],
  cloth_shift: ['foley recording: soft cotton bedsheet rustle as a person shifts position, close microphone, no voice', 1.0],
  seed_drop: ['a tiny seed dropping into soil: one soft earthy plop with a faint sparkle, close microphone', 0.7],
  bus_bell: ['a single city bus stop-request bell ding, clean', 0.8],
  // ---- places (looped beds) ----
  amb_night_room: ['a quiet bedroom at night, very soft room tone with faint distant traffic, subtle, no voices, no music', 20, true],
  amb_bus: ['inside a city bus at night, engine hum, soft road noise and faint rattles, no voices, no music', 20, true],
  amb_kitchen: ['a quiet home kitchen in the morning, a faint fridge hum and birds outside, no voices, no music', 14, true],
  receipt_print: ['a thermal receipt printer printing: a steady mechanical whirr with small ratchet clicks, close microphone', 2.0],
  receipt_tear: ['a long paper receipt being torn sharply in two, crisp rip, close microphone', 0.9],
  stamp_hit: ['a rubber stamp pressed firmly onto paper: one satisfying thud with a tiny ink slap', 0.6],
  coin_ping: ['a bright gold coin collect ping with a short sparkle, game reward sound, clean', 0.8],
  text_slam: ['a cinematic text impact: a deep short sub boom with a crisp transient hit and a quick reverb tail, trailer style, clean', 1.2],
  text_pop: ['a crisp modern UI text pop with a short airy whoosh, satisfying, clean, very short', 0.6],
  text_whisper: ['a soft airy shimmer swell, delicate glassy breath rising gently then fading, cinematic, no melody', 1.4],
  text_title: ['an epic cinematic title hit: a powerful low impact with a bright metallic shimmer and a long reverb tail', 2.4],
  tag_whoosh: ['a quick smooth swipe whoosh with a tiny sparkle at the end, clean, short', 0.6],
  pill_pop: ['a short bouncy pop with a tiny rising blip, playful UI sound, clean', 0.5],
  glitch_hit: ['a digital glitch stutter hit with a crunchy transient, short, cinematic', 0.6],
  counter_whir: ['a number counter whirring up fast with mechanical ticks, rising in pitch, one second', 1.0],
  terminal_type: ['a quick burst of mechanical keyboard typing with soft digital ticks, quiet room, close microphone', 2.0],
  decode_blips: ['rapid digital data decoding blips and tiny chirps, clean sci-fi interface, short', 0.9],
  hud_scan: ['a clean sci-fi HUD scan sweep with a soft electronic beep at the end, short', 0.9],
  amb_office: ['a quiet modern open-plan office, faint air conditioning, distant keyboards and low murmur, no clear words, no music', 16, true],
  amb_restaurant: ['a warm restaurant in the evening, soft chatter, faint cutlery and glasses, no clear words, no music', 20, true],
  amb_rain: ['soft steady rain on a window, calm, no thunder, no music', 12, true],
  typing_keys: ['foley recording: a person typing on a laptop keyboard at a steady pace, close microphone', 2.5],
  glass_clink: ['two wine glasses clinking together once, clean, bright, short', 0.8],
  vine_snap: ['a dry brittle plant vine snapping sharply with a woody crack and a low impact', 1.2],
  impact_bloom: ['a soft cinematic bloom impact: a warm low boom blooming into a bright airy shimmer, emotional', 2.2],
  door_open: ['an office glass door opening and closing softly, close microphone', 1.6],
  heartbeat: ['a slow calm human heartbeat, deep and soft, steady, no music', 6, true],
  amb_morning: ['gentle early morning birdsong outside a bedroom window, soft, no voices', 10, true],
};

fs.mkdirSync('public/sfx3', {recursive: true});
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
for (const [name, [text, dur, loop, variant]] of Object.entries(SFX)) {
  if (only.length && !only.includes(name)) continue;
  const takes = variant ? [['', 'A'], ['_b', 'B']] : [['', 'A']];
  for (const [suffix] of takes) {
    const out = `public/sfx3/${name}${suffix}.mp3`;
    if (fs.existsSync(out) && !only.length) { console.log(name + suffix, 'exists, skipped'); continue; }
    const r = await gen(text, dur, loop);
    if (r.ok) { fs.writeFileSync(out, r.buf); done++; console.log(name + suffix, 'ok'); } else { failed++; console.log(name + suffix, 'FAILED', r.err); }
  }
}
console.log(`done: ${done} generated, ${failed} failed`);
