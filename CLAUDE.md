# Project: Video 01, "One Scrolled. One Read."

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
