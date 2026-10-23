// Searches Freesound for each sound cue, downloads the top candidates' previews, and writes a
// listening page (out/sfx-review.html) plus scripts/sfx-candidates.json (license + attribution info).
// Only CC0 and CC BY sounds are considered, so they are safe for a monetised channel.
// Usage: node scripts/sfx-search.mjs [cue ...]   (no args = all cues)
import fs from 'node:fs';
import path from 'node:path';

const env = fs.readFileSync('.env', 'utf8');
const KEY = env.match(/FREESOUND_API_KEY=(\S+)/)[1];
const API = 'https://freesound.org/apiv2/search/text/';

// cue name -> [what it is for, search query, [min, max] seconds]
export const CUES = {
  phone_pickup: ['Red lifts the phone off the bed', 'phone handling', [0.3, 6]],
  phone_swipe: ['each swipe in the phone inset', 'swipe', [0.1, 2]],
  notification: ['the red notification badge pulses', 'notification', [0.2, 4]],
  pop: ['hearts and sparkles popping up', 'bubble pop', [0.1, 1]],
  sparkle: ['sparkle reaction icons', 'sparkle magic chime', [0.4, 3]],
  meter_rise: ['dopamine meter steps up', 'level up', [0.3, 4]],
  clock_tick: ['wall clock ticking during the clock beat', 'wall clock ticking', [4, 30]],
  page_turn: ['Green turning a page', 'book page turn', [0.3, 3]],
  yawn: ['Green yawns', 'man yawn', [0.8, 6]],
  sigh: ['Green sighs', 'sigh male', [0.8, 5]],
  book_thud: ['books stacking into the tower', 'book drop', [0.1, 3]],
  whoosh: ['soft air under each camera glide', 'whoosh', [0.3, 3]],
  room_tone: ['quiet night room ambience bed', 'room tone', [10, 180]],
  title_swell: ['title card swell', 'soft cinematic swell', [2, 8]],
  cloth: ['clothing rustle when he shifts', 'clothes rustle fabric', [0.3, 3]],
  chuckle: ['Red laughing at the phone', 'man chuckle laugh', [0.5, 4]],
  light_switch: ['Green switches the lamp off', 'light switch', [0.1, 2]],
  bed_rustle: ['Red settling into bed under the blanket', 'blanket rustle', [0.5, 4]],
  door_creak: ['the mother at the doorway', 'door creak', [0.5, 4]],
  gasp: ['the mother hurt by the snap', 'gasp female', [0.3, 3]],
  shout: ['Red snaps', 'man shout', [0.3, 3]],
  toothbrush: ['brushing teeth', 'brushing teeth', [1, 8]],
  spoon_bowl: ['cereal spoon in a bowl', 'spoon bowl', [0.3, 4]],
  steam_kettle: ['tea / kettle', 'tea pour cup', [0.5, 6]],
};

const LICENSES = {
  'https://creativecommons.org/publicdomain/zero/1.0/': 'CC0',
  'https://creativecommons.org/licenses/by/4.0/': 'CC BY 4.0',
  'https://creativecommons.org/licenses/by/3.0/': 'CC BY 3.0',
};

const wanted = process.argv.slice(2);
const names = wanted.length ? wanted : Object.keys(CUES);
const out = {};
fs.mkdirSync('public/sfx/cand', {recursive: true});
fs.mkdirSync('out', {recursive: true});

for (const cue of names) {
  const [why, query, [min, max]] = CUES[cue];
  const params = new URLSearchParams({
    query,
    filter: `duration:[${min} TO ${max}] license:("Creative Commons 0" OR "Attribution")`,
    sort: 'downloads_desc',
    fields: 'id,name,username,license,duration,num_downloads,avg_rating,previews,url',
    page_size: '8',
  });
  const res = await fetch(`${API}?${params}`, {headers: {Authorization: `Token ${KEY}`}});
  const json = await res.json();
  const picks = (json.results ?? []).filter((r) => LICENSES[r.license]).slice(0, 4);
  out[cue] = {why, query, results: []};
  let n = 0;
  for (const r of picks) {
    n++;
    const file = `public/sfx/cand/${cue}-${n}.mp3`;
    const buf = Buffer.from(await (await fetch(r.previews['preview-hq-mp3'])).arrayBuffer());
    fs.writeFileSync(file, buf);
    out[cue].results.push({
      file: `${cue}-${n}.mp3`, id: r.id, name: r.name, user: r.username, license: LICENSES[r.license],
      duration: Math.round(r.duration * 10) / 10, downloads: r.num_downloads, url: r.url,
    });
  }
  console.log(cue.padEnd(14), out[cue].results.length, 'candidates');
}

const prev = fs.existsSync('scripts/sfx-candidates.json') ? JSON.parse(fs.readFileSync('scripts/sfx-candidates.json', 'utf8')) : {};
const merged = {...prev, ...out};
fs.writeFileSync('scripts/sfx-candidates.json', JSON.stringify(merged, null, 2));

// listening page
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const rows = Object.entries(merged).map(([cue, c]) => `
  <section><h2>${esc(cue)} <small>${esc(c.why)}</small></h2>
  ${c.results.map((r) => `<div class="row"><audio controls preload="none" src="../public/sfx/cand/${r.file}"></audio>
    <div><b>${esc(r.file)}</b> · ${r.duration}s · <span class="lic ${r.license === 'CC0' ? 'zero' : 'by'}">${r.license}</span> · ${r.downloads} downloads<br>
    <span class="meta">${esc(r.name)} — by ${esc(r.user)} · <a href="${r.url}" target="_blank">freesound</a></span></div></div>`).join('')}
  </section>`).join('');
fs.writeFileSync('out/sfx-review.html', `<!doctype html><meta charset="utf-8"><title>SFX review</title>
<style>body{font:15px system-ui;background:#14131a;color:#eee;max-width:980px;margin:30px auto;padding:0 16px}
h2{margin:28px 0 8px;font-size:20px}small{color:#9a96ad;font-weight:400;font-size:14px}
.row{display:flex;gap:14px;align-items:center;background:#1e1c27;border-radius:10px;padding:10px 14px;margin:8px 0}
audio{width:300px;flex:none}.meta{color:#9a96ad;font-size:13px}a{color:#8fb4ff}
.lic{padding:1px 8px;border-radius:9px;font-size:12px}.zero{background:#1d5c3a}.by{background:#6b4a14}</style>
<h1>Sound effect candidates</h1><p>CC0 needs no credit. CC BY needs the credit listed in the video description.</p>${rows}`);
console.log('review page: out/sfx-review.html');
