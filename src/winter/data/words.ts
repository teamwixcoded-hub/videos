// Word timestamps for the first minute of "Winter Arc" (from the ElevenLabs export "Winter Arc.json", 0 to 67.3 s): word:start:end, lower case, punctuation removed.
// When the full voice-over is uploaded, replace this with the whole list (same format).
const RAW = `december:0.12:0.56 1st:0.7:1.14 600:2.04:2.16 am:2.2:2.56 same:3.28:3.56 cold:3.68:3.96 room:4.059:4.3 same:4.92:5.18 dark:5.32:5.58 window:5.66:6.04
two:6.72:6.86 men:6.96:7.2 wake:7.26:7.48 up:7.56:7.68 to:7.72:7.8 the:7.84:7.98 same:8.06:8.28 alarm:8.34:8.74 same:9.44:9.72 age:9.82:10.14 same:10.6:10.8 job:10.92:11.28
same:11.9:12.12 soft:12.28:12.58 belly:12.7:12.96 they:13.02:13.14 keep:13.2:13.38 hiding:13.44:13.76 under:13.8:13.96 hoodies:14.04:14.46 same:15.18:15.44 promise:15.5:15.94
theyve:15.96:16.18 made:16.239:16.56 every:16.62:16.88 winter:16.96:17.34 for:17.38:17.46 five:17.64:17.96 years:18.04:18.4 this:18.42:19.18 time:19.28:19.54 ill:19.94:20.08 change:20.14:20.58
this:21.48:21.58 is:21.64:21.74 sam:21.8:22.08 and:22.68:22.9 this:22.94:23.06 is:23.1:23.22 jake:23.28:23.56 90:24.42:24.58 days:24.6:24.84 from:24.86:25.02 now:25.08:25.32
itll:25.6:25.76 be:25.8:25.92 march:25.98:26.34 one:27.0:27.1 of:27.16:27.24 them:27.28:27.46 will:27.5:27.62 look:27.66:27.82 like:27.86:27.98 a:28.02:28.1 different:28.14:28.46 man:28.5:28.8
the:29.28:29.4 other:29.48:29.9 will:29.92:30.04 look:30.06:30.24 exactly:30.3:30.9 the:30.94:31.04 same:31.1:31.36 maybe:31.94:32.18 a:32.24:32.259 little:32.299:32.52 worse:32.56:32.9
the:33.58:33.66 difference:33.7:34.14 wont:34.18:34.34 be:34.38:34.5 talent:34.56:35.0 it:35.38:35.46 wont:35.5:35.66 be:35.68:35.8 money:35.84:36.14
it:36.68:36.76 will:36.8:36.9 be:36.94:37.16 one:37.22:37.4 decision:37.5:38.0 made:38.52:38.82 on:38.88:39.1 one:39.14:39.32 cold:39.46:39.72 morning:39.8:40.12 today:40.64:41.0
people:41.9:42.16 online:42.22:42.64 call:42.76:42.96 it:43.0:43.16 a:43.22:43.26 winter:43.36:43.7 arc:43.78:44.04 while:44.58:44.76 everyone:44.82:45.12 else:45.16:45.34
hibernates:45.4:46.02 eats:46.3:46.58 and:46.68:46.78 waits:46.88:47.12 for:47.16:47.26 new:47.32:47.42 year:47.52:47.72 you:48.2:48.3 go:48.34:48.48 quiet:48.56:48.98
you:49.48:49.58 train:49.66:50.08 you:50.5:50.58 sleep:50.62:50.86 early:50.9:51.2 you:51.7:51.82 fix:51.9:52.1 your:52.14:52.28 food:52.34:52.66 you:53.08:53.2 read:53.26:53.56
90:54.5:54.64 days:54.74:55.16 and:55.66:55.76 when:55.78:55.88 spring:56.02:56.26 comes:56.3:56.64 you:57.08:57.16 walk:57.22:57.42 out:57.48:57.68 different:57.72:58.14
both:59.08:59.3 men:59.4:59.56 saw:59.66:59.82 the:59.86:59.98 same:60.06:60.34 video:60.38:60.62 about:60.7:60.92 it:60.94:61.04 last:61.08:61.32 night:61.38:61.64
both:62.14:62.32 of:62.36:62.42 them:62.46:62.64 said:62.68:62.82 the:62.86:62.98 same:63.04:63.34 thing:63.38:63.6 to:63.62:63.7 the:63.74:63.82 ceiling:63.88:64.2
im:64.739:64.959 doing:65.0:65.28 this:65.34:65.58 the:66.38:66.44 alarm:66.5:66.84 rings:66.92:67.3`;
export const WORDS_W: [string, number, number][] = RAW.split(/\s+/).filter(Boolean).map((t) => { const [w, a, b] = t.split(':'); return [w, Number(a), Number(b)]; });
