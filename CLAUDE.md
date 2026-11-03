# LOOK RICH vs RICH (comp RichVsRich, src/richvrich/): Sam and Jake (28), same paycheck, five years of choices (truck vs sedan, savings vs spending, layoff). Voice Look Rich Vs Rich/Look Rich VS Rich.mp3 (11:02, public/audio/richvrich.mp3), words in src/richvrich/data/words.ts (regenerate: node scripts/make-richvrich-words.cjs). Whole video built (END 664 in timeline.ts), first full cut, only checked as stills. FOCUS = polished props in src/richvrich/props.tsx (Car, Truck, Wheel, BankCard, Terminal, PhoneBank, Bills, Coins, Jar; preview comp RichProps) and scenes.tsx (Dusk road/lot, Showroom, Kitchen, Backyard, Garage, Box, Flatbed tow truck, Contract, Calc, Gauge, BarsG); acts act1..act6.tsx. Same cast as Overthinking (Fig from src/overthinking/scenes). Check: COMP=RichVsRich node scripts/still-fathers.cjs <=3 seconds per run. Render: node scripts/render-richvrich.cjs [frames] [concurrency] -> out/richvrich-full.mp4.

# OVERTHINKING (comp Overthink, src/overthinking/): Sam and Jake (both 26), three chances (email, Sarah, website idea), 2:00 AM. Voice Overthinking/Overthinking.mp3 (10:51, public/audio/overthinking.mp3), words in src/overthinking/data/words.ts (regenerate: node scripts/make-overthinking-words.cjs). Whole video built (END 653.4 in timeline.ts), first full cut, not yet watched in Studio. Same cast and bodies as Winter Arc (src/winter Hero/SideHero), own scenes (scenes.tsx: EmailUI, ThoughtCloud, CardRow, Ceiling) and act1..act5.tsx; shots on the narration with T(phrase) (nth occurrence for repeated phrases, e.g. T('he hits send', 1); Overthink.tsx throws if shots are out of order). Check: COMP=Overthink node scripts/still-fathers.cjs <=3 seconds per run (the preview browser drops on bigger batches). Render: node scripts/render-overthink.cjs [frames] [concurrency].

# WINTER ARC (comp Winter, src/winter/): Sam vs Jake workout video, voice Winter Arc/Winter Arc.mp3 (10:12, public/audio/winter-arc.mp3), words in src/winter/data/words.ts (regenerate: node scripts/make-winter-words.cjs). The whole video is built: 0 to 614 s (END in timeline.ts). Faces = the real Same Man head (same2d/Char Head; cast look man = Sam, colleague = Jake) on new smooth IK bodies (Hero.tsx front, SideHero.tsx side, limb.tsx; fat/muscle params). Scenes: scenes.tsx, scenes2.tsx; shots on the narration with T(phrase); the men lip-sync only their own spoken lines (speakOpen). Check without Studio: COMP=Winter node scripts/still-fathers.cjs <sec...>; character sheets: node scripts/thumbs.cjs WinterSheet WinterSide.


# SAME MAN v2 (comp `Same7`, src/same7/, plan in docs/same-man-v2-plan.md)
Built around the new voice-over public/audio/same-man-7.mp3 (6:42.3, words in src/same7/data/words.ts; T()/TA() in timeline.ts). One man, Daniel: IN BED (scroller rig) and IN THE CHAIR (reader rig) in one bedroom.
Same7.tsx = first minute + composition (grade, fx, tags, bubbles, sound, music); acts.tsx = Acts 4-16 (shots, pops, stamps, tags, bubbles, cues, music beds); book.tsx = hardcover book, table scene; inserts.tsx / inserts2.tsx = new inserts; tags.tsx = IN BED / IN THE CHAIR pills.
Reuses Same2D (exports B, K, camS... and part2 SC2 scene makers). Text rules: one short idea per text, <=2 rows of ~18 chars, one lower-third lane (pops + stamps never overlap), tags and pills on top. Music = existing beds (tf_*, routine, hope, wonder, resolve) at 0.08-0.12; sound gain 0.8, speech duck 0.55.
Render on a laptop: node scripts/render-same7.cjs [frames=all 12159] [concurrency=2] -> out/same7-full.mp4 (150-frame chunks, resumable). Needs no images or .env; everything it plays is in git. New computer: git clone, npm install, npm run dev (comp Same7).
Check without Studio: COMP=Same7 node scripts/still-fathers.cjs <seconds...> (<= 8 per run), then node scripts/contact.cjs out.png f1.png ...
# READ THIS FIRST: current work is "Same Man. Same Night." in 2D vector code (`Same2D`)

The sections further down describe the OLDER image-based Video01 and the vector/3D experiments. The **current, approved direction** is
the composition **`Same2D`** (`src/same2d/`), an 8:03 video + 10 s hook, built 100% in code (SVG), no AI images needed. To make more videos
"in the exact same style", copy how `Same2D` is built and obey the style rules below. Never regress to glass/3D/mannequin looks.

## What it is
Narration-driven explainer. Voice file `public/audio/Same Man.mp3` (user's own take; timeline `src/same/data/timeline.json`, captions
`src/same/data/captions.json`, `narration.srt`). Two identical men, same first night: the **Scroller** (phone, cold blue light, bed) and the
**Reader** (book, warm lamp, armchair). Habit diverges over 365 days; ends "Tonight, which one will you pick up?". Metaphor: the **BILL**
(receipt of aftereffects of phone use, total 1,095 h, tears) vs the **REWARD** (gold ticket with stamped gains). NOT planter/sowing.
Comps in `src/Root.tsx`: `Same2D` (14784 frames, 1920x1080, 30 fps) is the one. `Same3D`, `Video01`, `A1-New` etc. are legacy.

## Architecture (src/same2d/)
- `Same2D.tsx` main comp: `Sequence(HookC)` + `Sequence(Same2DMain)`; Scroller/Reader actors, bedroom scene, camera helpers, **LIST1** (shots 0-115 s),
  `LIST = [...LIST1, ...buildPart2(API)]`, KWORDS (kinetic words), CUES3 (sfx cues), `speechDuck`, music beds. Exports SAME2D_END/FRAMES/TOTAL.
- `part2.tsx` (1:55 to end, `buildPart2(API)`; API passed in to avoid circular imports, use `import type` from Same2D), `hook.tsx` (10 s hook, `makeHook(API)`).
- **Shot-list DSL:** `[startSec, fx('w' whip | 'f' flash | 'b' bridge)?, renderer(c: Ctx)]`, Ctx = {t,l,d,p,from}. Times are VIDEO seconds
  anchored to narration via `srcToVideo()/CAPTIONS` in `src/same/lib/timeline.ts`. **Every narration phrase gets its own picture; every pause gets a cutaway.**
- `Char.tsx` (front rig + `Head`/`Look`), `SideChar.tsx` (3/4 side-view rig facing +x, 2-bone IK arms/legs, `BookSide` open spread, `PhoneSide`),
  `Stage.tsx` (depth layers far/mid/chars/front/fg, blur, parallax, rim light, camera {cx,cy,z}, stage 3200x1080, floor y=830),
  `sets.tsx` / `sets2.tsx` (bedroom with seasons, bus, kitchen, bathroom, office, restaurant, manager room, BillPile, RewardWall),
  `inserts.tsx` / `inserts2.tsx` (full-frame inserts: PhoneFeed, LockScreen, Clock, BookOpenInsert (8-drawing open, 6-drawing page turn), Scoreboard, YearFlip calendar,
  BillInsert, RewardInsert, CoinReward, EndCard...), `fx.tsx` (text + transitions + grade), `sound.tsx` (`Sfx3`), `theme.ts` (fonts), `storyboard.ts`.
- Characters: man / mom / manager / colleague / friend share one Head with `turn` and `look` variants. Original characters only, never famous ones.

## STYLE RULES (user's, hard-won; follow exactly)
**Pacing:** fast, dynamic, ~2 s shots, whips, flash + speed lines, particle bridges, punch-ins, face -> insert -> face. No long static shots.
**No split screen** of the two men: each life gets its own full screen when spoken about. Mix close-ups with mid/wide distance (not always zoomed).
**Character:** glossy round "bubble head" look, natural faces and human movement, never mannequin. Brows must not look angry.
**Holding things:** SIDE view, arms slightly bent, book/phone held OUT IN FRONT at a distance (never hugging the chest). Reader holds an **OPEN** book, never closed
(opening animation is drawn frame by frame). Phone is scrolled with a thumb swipe, back/edge glow visible.
**Text (very important):** Hollywood / digital. Fonts DIGI=ChakraPetch, MONO=ShareTechMono, MONT=Montserrat (infographics). Modes: `pop`, `slam`, `whisper`
(typing effect with cursor), `title` (HUD brackets + scan line). Letters solid with dark outline + dark plate so they are always readable and big. **No glyph-scramble /
weird special characters while typing.** Kinetic word sizes: pop 112, title 136, big 156.
**Who-tags:** animated "SCROLLER" / "READER" pill + day tag (NIGHT 1, DAY 5, DAY 21, DAY 90, MONTH 6, MONTH 11, DAY 365). Appear ONLY at the moment that day is spoken; if both men share a day,
tag each separately (never an ambiguous duplicate "DAY 5").
**Hook (first 10 s):** starts on "The phone feels good, instantly." -> "The book does not feel good." -> "One year from now..." with a **calendar flip** (YearFlip, day counter 1 -> 365) -> gaunt scroller / glowing reader ->
flashes -> alternating faces + "WHICH ONE ARE YOU?". No pills in the hook, letterbox bars. The "one year from now" image must always be a calendar (relevant to the words).
**Bill / Reward:** Bill = receipt strip (BillInsert) listing aftereffects exactly as the story says them; Reward = the other side, gold ticket stamped items. The bedroom shows BillPile / RewardWall.
**Sound:** ElevenLabs text-to-sound generated by `scripts/el-sfx3.mjs` into `public/sfx3/`; must never drown the voice. `Sfx3` has `gain`, `minVol` (0.3 floor so effects are consistent and always felt)
and `duck` = `speechDuck` (smoothly lowers effects under speech). Hook uses gain 0.5 / duck 0.35. Real voices (yawn, sigh, chuckle) from `public/sfx` with `old:true`. Music beds `public/music`
(low, routine, hope, wonder, resolve): story bed low 0-118 s vol 0.11, others vol*0.7, hook bed 0.08. Each text mode has its own sound via `kwCues`.
**Dialogue lines** have no audio, so show speech bubbles (`BUBBLES2`).

## How to work with this user (reinforced)
- Short plain answers; say honestly what is verified. Verify with `npx tsc --noEmit` (slow: run in background) since nobody can watch Studio for you.
- The user reviews live in Remotion Studio (`npm run dev`, pick `Same2D`). Do NOT render stills/videos for review. Render only when asked.
- ElevenLabs / NanoBanana cost credits: ask before using. Edit big files with small idempotent `.cjs` patch scripts (Bash chokes on quotes in heredocs).

## Setup on a new computer (Same2D)
1. `git clone https://github.com/teamwixcoded-hub/videos.git && cd videos && npm install`
2. Copy `.env` by hand (ElevenLabs key needed only to generate NEW sfx). Everything `Same2D` plays is in git: `public/audio/Same Man.mp3`, `public/sfx`, `public/sfx3`, `public/music`.
   Images are NOT needed for `Same2D` (it is pure SVG). `public/images`, `public/char`, `public/poses`, `frames/`, `out/` are local-only.
3. `npm run dev` -> open `Same2D`. Tell Claude: "Read CLAUDE.md, then continue/make a new video in the Same2D style."
4. New video recipe: put narration in `public/audio/`, create timeline + captions JSON like `src/same/data/` (use `scripts/srt-to-captions.cjs`), write a shot list in the DSL above,
   reuse Stage/SideChar/sets/inserts/fx, generate sfx with el-sfx3.mjs (ask first), keep the style rules.

## Rendering Same2D on a low-RAM laptop
`node scripts/render-same2d.cjs [frames=1800] [concurrency=2]` -> `out/same2d-first-minute.mp4` (or `first-<N>`). Bundles once with a small public folder (audio, sfx, sfx3, music only), renders
150-frame chunks with retries, audio separately, stitches with ffmpeg; safe to stop and re-run. Full 8 min = pass 14784. Close Chrome first. First minute done and delivered; rest still to render.

---

# VIDEO 2: "Two Fathers. Same Salary. 20 Years Later." (comp TwoFathers, src/fathers/)
Version 2 (current): narration = public/audio/two-fathers-2.mp3 (6:56.4, user's ElevenLabs voice) with word timestamps in src/fathers/data/words2.json. The video is exactly as long as the recording (+3 s for the closing question, 419.4 s):
video time = recording time, no stretching, no wordless filler (the user's decision). Every shot and on-screen word is placed with T('a phrase of the narration') from src/fathers/timeline.ts (TE() = end of the phrase, speaking() drives mouths),
so edits never need hand-typed seconds. src/fathers/shots.tsx = the whole shot list + KWORDS; Fathers.tsx = grade, cues (sfx3 + sfx4), music beds (tf_*), counters, text. (The first version used the 3:36 recording and the plan PDF; the plan's beats are all still there.)
Story now: hook (paid-off house, silent phone, neighbour's phone rings 25 years) -> "which one are you?" -> 30 years earlier -> hospital, the promise, the fork (Fork insert) -> Adam's father (factory, double shifts, the watch wrapped in newspaper at his 12th birthday, the watch on Adam's wrist)
-> 6 PM choice -> Sam's hour (blocks on the floor), promotion, small house, old car -> Leo 5 / toy car -> Max's newspaper kite -> school play (Leo is a TREE; audience full, Adam's seat the only empty one) -> "they count the seats you fill" -> age 15 door -> arguments / tea stall -> worst night (split screen) ->
Leo grows up, has a son and repeats it (toy car) -> Adam at 65 scrolling photos, his wrist watch, "the time he never had" -> Sam at 65 -> the call (banking app, Adam:/Leo: spoken lines on camera) -> Friday: five cups and a glass of milk, grandson, kite -> closing words, polaroid, end card.
**LOOK = EXACTLY THE SAME AS SAME MAN** (the user rejected a warm flat-illustration attempt: "not even close"): glass bubble-head cast on the Same Man engine (src/same2d Char/SideChar Head, Stage, fx text modes, Cinema, Sfx3).
The BODY is new and more human (src/fathers/Human.tsx: tapered limbs, elbows/knees, chest-waist-hip silhouette, suits/cardigan/hoodie, shoes with soles, hands with fingers, a watch on Adam's wrist); People.tsx adapts shots to it (poses, outfit variants work/kid/pjs, CHAR_K).
Other files: sets.tsx + sets3.tsx (factory, car), props.tsx + props2.tsx (shaded boxes/laptop/cup/kite), inserts.tsx + inserts3.tsx (phone UIs, WatchInsert, Fork, SeatsCount, Blocks, OldCar, Newspaper), kit.tsx (Z camera, stand/sit/Pe, SC.* scenes, Split), fx.tsx (AgeTag, Counter, Rain, RewindCard).
Rules the user set for this video: speakers are on camera while they speak; both ends of every phone call are shown (ringing phone + the person answering); the seat that is empty is only meaningful when the rest of the audience is full;
objects must be clear (big, sharp, shaded), wall photos readable; motion human-like (eased poses with overshoot, weight shift, walking bob); text digital like Same Man.
Check without Studio: node scripts/still-fathers.cjs 12 80 200 ... in batches of <= 8 (more can crash on 16 GB). Do NOT run it or Studio during the long Same Man render. Validate phrases: every T() must exist in words2.json (a missing one throws at import).
Held objects: src/fathers/held.tsx (PhoneBack, CupHeld) are drawn in the hand frame under the fingers via Human.tsx `held` props; People.tsx HELD table maps pose->object (ear/phone->phone, cup->cup). Phone-at-ear hand target is side N:[-92,-452]. Set dressing: src/fathers/details.tsx (shelves, lamps, rug, bulbs, bicycle, fridge...) merged into sets inside kit.tsx SC.* wrappers. User's quality bar (latest): phones must look like phones at the ear, sitting/holding/backgrounds/objects must feel real, not basic.
**STYLE (latest): the flat-2D head experiment was REVERTED; Two Fathers uses the original glass Head with refined tapered-limb bodies, hands with fingers per gesture (Mitten curl: <=-0.5 open, 0-0.8 relaxed, >=1.5 point), richer sets (details.tsx). Text = src/fathers/type.tsx (TypeLayer: pop lower-third / slam / title / whisper quote; Stamp lower-left captions; STAMPS+QUOTES lists in Fathers.tsx). Sound: Sfx3 gain 0.8, minVol 0.08, speechDuck 0.55 so effects never cover the narration; text cues are quiet (0.1-0.26).**
Status: full build, type-checks, 48 frames across the timeline render without errors; user has NOT yet reviewed version 2 in Studio. Known to polish: more per-shot action, hospital/street palettes, faces.

---
# (Older) Project: Video 01, "One Scrolled. One Read."

A 4:20 animated YouTube video built with **Remotion** (React), 1920x1080, 30 fps, `Video01` = 7797 frames. This file is the
project's memory: read it first, then continue. (Written 2026-10-24 so work can move to another computer without losing context.)

## The story
Two identical men, same room, same first night. **Red** scrolls his phone (cold blue light, bed). **Green** reads a book (warm lamp,
armchair). Same choice every night for 365 days; the video shows how the days diverge and ends on the question
"Tonight... which one will you pick up?". Tagline: **ONE SCROLLED. ONE READ.** No voiceover: story is told by pictures, short captions
("key phrases"), music and sound effects.

Scenes (files in `src/scenes/`, order in `src/Video01.tsx`): Hook (ending first, then VHS rewind) -> Act1 (S01 two men, S02 the choice,
S03 night one) -> S04 Day 5 -> S05 Day 21 -> S06 It spreads (work / mornings / people) -> S07 Day 90 -> S08 Low point ->
S09 The result -> S10 Day 365 -> S11 The turn -> S12 End.

**Timing system (important):** everything is written in *script seconds* and converted by `S(sec)` in `src/easing.ts`
(`TIME_SCALE = 0.6`, so 1 script second = 18 frames). `R(sec)` = real seconds, unscaled (used by the Hook). Captions live in
`src/keyphrases.ts` (`from`/`to` in script seconds, `hi` = highlighted words, `big` = the scene's main line).

## How the original (image-based) video was made
- **Keyframes (AI images):** `node scripts/gen.mjs <name> <prompt-file> [aspect] [refName,...]` calls the **NanoBanana** API, saves
  `public/images/<name>.png` and records the hosted URL in `scripts/manifest.json` so later prompts can use earlier images as
  references (image-to-image). Prompts are in `scripts/prompts/*.txt` (~120). Naming: `FL_G*` = Green frames, `FL_R*` = Red frames,
  `SC_*` = scene stills, `BEDROOM/KITCHEN/...` rooms. Batch helpers: `scripts/gen-*.sh`, `regen-*.sh`. Costs credits: ask first.
- **Character look:** flat 2D cartoon, big round bald beige head, thick dark outline, no ears/nose in front view, big white eyes with
  black pupils, thick brows, line mouth, grey hoodie, dark jeans, white sneakers. Expression sheets are cut into
  `public/images/heads|mgr|mom|props|fx/` with `scripts/cut-heads.mjs` / `cut-sheet.mjs` (each folder has `_sizes.json`).
  `scripts/vectorize.mjs` cleans keyframes into `public/images/clean/`.
- **Scenes play frame sequences** (`src/components/FrameSeq.tsx`), with blink twins, camera moves (`src/vfx/Motion.tsx`), lighting,
  grade and hit-stops (`src/components/Cinema.tsx`, `BEATS`), counters, phone UI, etc.
- **Sound:** SFX generated with ElevenLabs text-to-sound (`scripts/el-sfx.mjs`, `el-sfx2.mjs`) into `public/sfx/`; some from Freesound
  (`scripts/sfx-search.mjs`, only CC0 / CC BY); keyboard clicks synthesised (`scripts/make-keys.cjs`). **Music beds**
  (wonder, routine, hope, low, resolve) from ElevenLabs Music (`scripts/el-music.mjs`) into `public/music/`, placed per scene in
  `src/Video01.tsx` with `<Music track startAt>` and ducked at beats. Each scene file exports its cue list (`SFX` / `CUES`, `Cue` type in
  `src/components/Sfx.tsx`); Act 1 uses `src/scenes/act1Sfx.ts`.
- **Final video:** `out/video-01.mp4` (4:19.9, ~264 MB).

## Secrets and data (NOT in git)
- `.env` holds four keys: `NANOBANANA_API_KEY`, `ELEVENLABS_API_KEY`, `FREESOUND_API_KEY`, `FREESOUND_CLIENT_ID`. Never commit or paste them
  in chat. Copy `.env` to a new computer by hand (password manager / encrypted USB).
- `public/images/` (~660 MB) is git-ignored: copy the folder between computers by hand. Also local only: `out/` (renders),
  `_reference/` (downloaded reference videos for private study), `node_modules/`.
- Hosted image URLs in `scripts/manifest.json` may expire; if image-to-image references fail, regenerate the reference first.

## The vector remake (in progress): same script, new approach
Goal: rebuild the same video with a **vector character that looks as natural as the image version** ("the images version was way better,
the vector version needs to be even better"). Feedback so far: first versions looked like mannequins; the face always faced the camera
while the body was sideways; sitting/holding/reading looked fake. Decisions made after that:
- **Look = the original's flat, outlined, beige style** (not glass, not cinematic, not neon).
- **Rig** `character-lab/rig2.js` (master) -> `src/new/rig2.ts` (generated copy: header `// @ts-nocheck` + imports + file + `export {Rig2}`;
  regenerate after editing the .js). 2-bone IK for arms/legs, **head and body turn together** (`turn` -1..1: face slides, nose/ear appear,
  far limbs tuck behind torso), hands that wrap behind a held object with the thumb in front, eyes that look at a target.
  `character-lab/held.js` -> `src/new/held.ts`: a **book that is read** (back cover + page edge face the camera) and a **phone that is scrolled**
  (back and glowing edge, thumb swiping). Side-view seat art in `src/new/seats.ts`.
- **Room/set:** `src/new/set.tsx` (one bedroom the camera moves through, clock, calendar, lamp, window), camera `Cam` in `src/new/kit.tsx`,
  actor `Actor2` in `src/new/kit2.tsx` (keyframes in script seconds, springs, breathing, blinks, lip-sync hook).
- **Compositions in Studio:** `A1-New` (first 58 script-seconds of Act 1, the most developed), `NewVideo01` (all 12 scenes, an older
  first-pass skeleton with the original timing/captions/music/sfx), `N01-Hook`..`N11-End`, `LabTest`.
- **Lip-sync:** `node scripts/lipsync.mjs <audio> <out.json> [fps]` makes per-frame mouth codes (see `src/lab/LabTest.tsx` for use).
  Not needed unless a voiceover is added.
- Design pages (open in a browser, no render needed): `character-lab/index.html` (old glass character), `rig2.html` (current rig tests),
  `props.html`, `rooms.html`, `scenes.html`, `thumb*.html`. Screenshot them with the headless Chrome Remotion downloads:
  `node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe --headless --allow-file-access-from-files --window-size=W,H --screenshot=OUT.png file:///...`
- **Next steps:** finish the rest of Act 1 (2 AM clock insert, Red lying in bed with the phone, BOOK 0 : PHONE 1 scoreboard, Green asleep,
  reward chart), then rebuild S04..S12 the same way (one real room, real camera coverage, insert shots, infographics), differentiate the
  mother and manager characters, then render. Study the original with reference frames from `out/video-01.mp4` (Remotion ffmpeg).

## Rendering (what works on a 16 GB laptop)
A single full render crashes (headless Chrome runs out of memory, and fonts need internet at render time). Use
`powershell -File scripts/render-chunked.ps1 -Comp Video01 -Total 7797`: 250-frame pieces with retries, audio rendered separately at
`--scale=0.1` (~10x faster), stitched with `npx remotion ffmpeg` without re-encoding. It resumes if stopped. Close Chrome/VS Code windows
first. Do not run the image-upload to GitHub at the same time (it slows the render).

## Thumbnails (final)
`out/thumb/thumbnail-A-one-habit.png`, `-B-1-year-later.png`, `-C-which-one-are-you.png` (1280x720, for A/B testing). Built by
`character-lab/thumb3.html` from the Day-1 art (`FL_G1` reader, `FL_R4` scroller). Rules the user set: show the two **behaviors**
(book vs phone) so the viewer understands, **hide the results**, exaggerate the faces, text = one of "ONE HABIT" / "1 YEAR LATER" /
"WHICH ONE ARE YOU?". **Keep it clean and simple: the cinematic and click-bait versions were rejected ("the more we try, the more we ruin it").**

## How to work with this user
- Short, plain answers. Say honestly what is and is not verified. Do not over-design: when a change makes it worse, revert.
- They review scenes **live in Remotion Studio** (`npm run dev`, http://localhost:3000): do not render stills/videos just for review.
- Ask before spending credits (NanoBanana / ElevenLabs) or pushing large files. Upload speed on the first computer is very slow (~35 KB/s).
- Windows; Git Bash and PowerShell both available. Characters must be original, never copies of famous ones.

## Set up on a new computer
1. Install Git, Node.js (v20+; built on v24), VS Code, Claude Code. Clone: `git clone https://github.com/teamwixcoded-hub/videos.git`
2. `cd videos` then `npm install`
3. Copy by hand: `.env` and `public/images/` (and optionally `out/video-01.mp4`).
4. `npm run dev` and open http://localhost:3000 (pick `A1-New` or `Video01`).
5. Start Claude Code in the folder; it reads this file. Say: "Read CLAUDE.md and continue the vector remake from the next steps."
