// Pixabay video search for the shoot list. Usage: node scripts/pixabay-search.cjs  -> out/pixabay/candidates.json + thumbnails
const fs = require('fs'), path = require('path');
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('=')).map((l) => [l.split('=')[0], l.slice(l.indexOf('=') + 1)]));
const KEY = env.PIXABAY_API_KEY;
const QUERIES = {
  c01_sit_tired_bed: ['man sitting on bed tired', 'tired man sitting edge of bed night'],
  c02_pickup_phone: ['man picks up phone', 'man looking at smartphone sitting'],
  c03_pickup_open_book: ['man opens book reading', 'man picks up book'],
  c05_scrolling_phone: ['man scrolling smartphone', 'scrolling phone sofa'],
  c06_reading_book_yawn: ['man reading book night lamp', 'man yawning reading book'],
  c08_close_book_frustrated: ['man closes book', 'man frustrated reading book'],
  c10_bus_reading: ['man reading book bus', 'reading book on train'],
  s04_wake_reach_phone: ['man wakes up alarm phone bed', 'man reaching phone nightstand'],
  s04_breakfast_phone: ['man breakfast looking at phone', 'man eating phone table'],
  s04_brush_teeth_phone: ['man brushing teeth phone', 'brushing teeth bathroom man'],
  s04_tea_book: ['man drinking tea reading book', 'tea cup book armchair'],
  s05_slump_table_phone: ['tired man kitchen table phone', 'man exhausted phone table'],
  s05_mother_calls: ['mother calling son dinner kitchen', 'woman talking kitchen'],
  s05_lamp_sleep: ['man turns off lamp bed', 'man falling asleep book'],
  s06_meeting_speaks: ['man speaking meeting office calm', 'businessman talking colleagues'],
  s06_wake_curtains_stretch: ['man opens curtains morning stretch', 'man waking up stretching sunrise'],
  s07b_phone_ping_reply: ['man typing message smartphone', 'man receives message phone'],
  s07b_dinner_laugh: ['friends dinner restaurant laughing', 'men dinner toast glasses'],
  s08_lying_phone_face: ['man lying bed phone above face', 'man lying in bed scrolling phone night'],
  s09_manager_handshake: ['handshake office congratulations', 'manager shaking hands employee'],
  s09_walk_office: ['man walking office corridor', 'businessman walking'],
  s11_phone_facedown: ['man puts phone face down table', 'phone face down table'],
  s12_hand_hover: ['hand reaching phone book nightstand', 'hand choosing book or phone'],
  lib_walk_side: ['man walking side view full body', 'man walking street'],
  lib_sit_stand: ['man sits down chair', 'man stands up from chair'],
};
(async () => {
  fs.mkdirSync('out/pixabay/thumbs', {recursive: true});
  const result = {};
  for (const [clip, qs] of Object.entries(QUERIES)) {
    const seen = new Map();
    for (const q of qs) {
      const r = await fetch(`https://pixabay.com/api/videos/?key=${KEY}&q=${encodeURIComponent(q)}&per_page=8&safesearch=true`);
      if (!r.ok) { console.log('HTTP', r.status, q, (await r.text()).slice(0, 80)); continue; }
      const j = await r.json();
      for (const h of j.hits) if (!seen.has(h.id)) seen.set(h.id, {id: h.id, query: q, tags: h.tags, duration: h.duration, user: h.user, page: h.pageURL, thumb: h.videos.medium.thumbnail || h.videos.small.thumbnail, ai: !!h.isAiGenerated, views: h.views, w: h.videos.large.width || h.videos.medium.width, h: h.videos.large.height || h.videos.medium.height, url: h.videos.large.url || h.videos.medium.url, medium: h.videos.medium.url});
      await new Promise((s) => setTimeout(s, 700));
    }
    result[clip] = [...seen.values()];
    console.log(clip, result[clip].length);
  }
  fs.writeFileSync('out/pixabay/candidates.json', JSON.stringify(result, null, 1));
})();
