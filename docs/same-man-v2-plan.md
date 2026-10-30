# SAME MAN v2: the video, built around the new voice-over

Voice: `Same Man 7 Minutes.mp3` (6:42.3) with word timestamps in `Same_Man_7_Minutes_eng.json` (1,057 words, 140 sentences).
Length: 402.3 s of voice + about 3 s end card = about 405 s = about 12,150 frames at 1920x1080, 30 fps (the old cut was 14,784).
Built 100% in code (SVG), in the exact Same2D style (see CLAUDE.md "STYLE RULES"). Every shot is placed with `T('a phrase of the narration')`, so no hand-typed seconds.

## 1. The idea in one paragraph
One man, Daniel, 28, on one Tuesday night at 11 o'clock. We split the night in two: **IN BED** (the phone) and **IN THE CHAIR** (the book).
The same room, the same man, ten seconds of difference. We follow both through 365 days, and the gap grows in the room itself: two windowsills, one plant thriving and one choked by weeds.
At Day 365 we count the cost (1,095 hours gone) and the gain (3,650 pages, about 20 books). Then the twist: **there were never two men, there is only one**, and tonight he gets to choose.
The video ends with Daniel turning the phone face down: "Okay. Ten pages." and the viewer's question: **Phone or book?**

## 2. What changed compared with the old Same Man
| Old Same2D | New v2 |
|---|---|
| Two men: Scroller and Reader | One man, two versions: **IN BED** / **IN THE CHAIR** (tags use the script's own words) |
| A 10 s hook, then the story | The script is its own hook: the first 32 s state the whole promise |
| Bill and Reward as the main metaphor | Windowsill plants are the running clock (the script plants and sows), the **1,095 h receipt** (Bill) and the **20-book shelf** (Reward) are the Day 365 count |
| Ends on "which one will you pick up?" | Twist: one man, one choice, he picks up the book, then "Phone or book? Comment." |
| Days: 5, 21, 90, Month 6, Month 11, 365 | Days: 5, 21, **40**, 90, Month 6, **300, 360**, 365 |

## 3. Rules that stay (user's hard-won style)
- Fast, about 2 s shots, whips, flashes, bridges, punch-ins, face -> insert -> face. Every sentence gets its own picture, every pause gets a cutaway.
- No split screen: each life gets the full screen when spoken about. Mix close-ups and wider shots.
- Glossy bubble-head characters, natural faces, no angry brows. Side view for holding things, arms bent, book and phone held out in front. The reader holds an OPEN book.
- Tags appear only when that day is spoken: pill `IN BED` / `IN THE CHAIR` plus the day tag (NIGHT 1, DAY 5, DAY 21, DAY 40, DAY 90, MONTH 6, DAY 300, DAY 360, DAY 365).
- Dialogue has no audio, so it gets speech bubbles. Text: bold digital type, readable on any picture. Sound never drowns the voice (gain 0.8, speech duck 0.55, text cues 0.1 to 0.26).

## 4. Beat sheet (video seconds = voice seconds)

### ACT 1: THE PROMISE (0 to 32)
| Time | Voice | Picture |
|---|---|---|
| 0.2 | "This is the same man on the same night in the same room." | Slow push into the bedroom, night, one man. He "doubles" into two identical men with a soft ghost split. Title `SAME MAN. SAME NIGHT. SAME ROOM.` |
| 4.7 | "In one year, one of them will be asked to lead the biggest project..." | Calendar flip 1 -> 365, then a glass office, a hand opening a folder "LEAD THE PROJECT" (the bright future, warm light) |
| 9.7 | "The other will be lying in this bed at 2:00..." | Cold blue: alarm clock 2:00 AM, close on the face, phone typing "How to fix your life" (type effect) |
| 16.8 | "Same job, same salary, same 24 hours." | Three icons slam in one by one: briefcase / $ / 24H ring |
| 21.0 | "The only difference... next 10 seconds." | A 10-second countdown ring fills around the bedside table |
| 25.9 | "By the end of this video you'll realize..." | The man looks at the camera, then the screen turns into a mirror: the viewer's own face in a dark phone screen. Text `YOU MAKE THIS CHOICE EVERY NIGHT.` |

### ACT 2: MEET DANIEL (33 to 55)
| 33.1 | "His name is Daniel. He's 28." | Name card (digital): `DANIEL · 28` |
| 36.0 | "11 o'clock on a Tuesday... tired" | Wall clock 11:00 PM, `TUESDAY`, a long boring day in 2 s of flashes (laptop, bus, queue) then a heavy, tired face |
| 42.7 | "On the bedside table, a book a friend gave him..." | Insert: the table, the book with a ribbon `3 MONTHS AGO` (gift tag) |
| 46.7 | "The bookmark is still on page one." | Extreme close-up of the bookmark on page 1, dust on the cover |
| 49.2 | "And next to it, his phone." | Whip to the phone, glowing, the lock screen waking up |
| 51.4 | "He picks up the phone. Of course he does. Anyone would." | Hand reaches (side view). Cut to Daniel's shrug, a small guilty smile |

### ACT 3: THE SPLIT (55 to 63)
| 55.2 | "But let's split this night in two." | The room is cut by a vertical light line and the whole picture slides into two parallel rooms (this is the ONE moment we show both, for 1 s; after it, one life per screen) |
| 57.6 | "In one version he picks up the phone." | IN BED pill, blue light |
| 60.1 | "In the other, just this once, he picks up the book." | IN THE CHAIR pill, warm lamp, armchair. Book opens frame by frame |

### ACT 4: NIGHT 1 (64 to 111)
| 64.0 | "The phone is easy... a little better than the last." | PhoneFeed, thumb swipes, short bright clips, a tiny reward burst per swipe |
| 71.8 | "Every swipe gives his brain a tiny reward and asks for nothing back." | Brain icon: coin ping each swipe; a receipt line prints `$0 BACK` |
| 76.9 | "The book is hard. First page is slow." | Chair side: the page barely turns, heavy eyelids |
| 80.9 | "reads the same line twice / checks the clock / yawns" | Three quick cuts: the same line highlighted twice, clock, a real yawn |
| 85.8 | "Who even reads anymore?" | Thought bubble, a tempting glow from the phone across the room |
| 87.9 | "At 2:00 the phone goes dark." | IN BED: phone dies, he stares at the ceiling, text `2:00 AM`. "He doesn't remember a single thing" -> the feed turns to blank white squares |
| 94.1 | "In the chair, he closed the book at 10 pages..." | IN THE CHAIR: bookmark moves from page 1 to page 11, lamp clicks off, asleep before midnight `11:48 PM` |
| 99.1 | "Ten pages. That's it. It doesn't feel like anything." | Big quiet text. The camera lingers on the dark room |
| 103.2 | "Every night, you're planting something." | The windowsill appears: two empty pots. A seed falls into each. Soil, a tiny sparkle. This is the running clock for the rest of the film |

### ACT 5: DAY 5 (112 to 136)
Tags `DAY 5`. IN BED: mornings blur (alarm, snooze, snooze again, rushed shower, coffee in the car, fog effect over the lens).
IN THE CHAIR: quiet morning, wakes before the alarm, a page counter rolls 10 -> 20 -> 50 -> the shelf now has one book.

### ACT 6: DAY 21 (137 to 165)
Tag `DAY 21`. Mother's call as a speech bubble ("Your food's getting cold."). IN BED: he doesn't look up, the dinner plate cools (steam stops). IN THE CHAIR: he looks up, closes the book, sits with her (warm kitchen).
"Three weeks ago he wouldn't have noticed she was eating alone": a small shot of her chair, empty. 158 s: windowsills, a green shoot on one, a pale weed on the other.

### ACT 7: DAY 40 (166 to 184)
Tag `DAY 40`. Coffee machine at work, a colleague, speech bubbles: "Since when do you talk like that?" / "Since chapter 12." Then three kinetic words as the narrator says them: `TALK` · `LISTEN` · `THINK`.

### ACT 8: DAY 90 (185 to 209)
Tag `DAY 90`. The pull: IN BED reaches past the phone, picks up the book, opens it, reads one line (a faint glow on the page), the phone buzzes, the book goes down. Visual aid: a "distance gauge" (phone 10 cm / book across the room) and a text `ALWAYS EASIER. ALWAYS CLOSER.`

### ACT 9: MONTH 6 (210 to 243)
Tag `MONTH 6`. Group chat bubble "Dinner Saturday?". IN BED: types "Sorry, can't make it", no plans, no energy (a flat battery icon). IN THE CHAIR: dinner with friends (restaurant set), "When did you get so interesting?" / "Somewhere around book nine." At midnight IN BED scrolls past the dinner photo and drops one heart.

### ACT 10: THE MONTHS PASS (244 to 258)
Seasons wheel (summer, rain, autumn, winter) over the windowsills. One plant thickens and flowers. The other weeds become vines that creep over the edge and up the bedroom wall (this grows for real across the wall for 8 seconds).

### ACT 11: DAY 300 (259 to 285)
Tag `DAY 300`. Mirror of the opening: 2:00 AM, IN BED types "How to fix your life." A video about morning routines -> discipline -> "why you can't stop watching videos" (phones inside phones, zooming deeper). `40 MINUTES LATER`. "He knows something is wrong." 278 s: flashback, a fast rewind to the first Tuesday, the 10-second clock, `11:00 PM`.

### ACT 12: DAY 360 (285 to 306)
Tag `DAY 360`. Glass office, the manager, speech bubbles ("We want you to lead it." / "Me?" / "You've changed this year. Everyone's noticed."). He walks back to his desk. Then 4 inserts in beat with "a chair, a lamp, a cup of tea, ten pages": armchair, lamp, tea cup, a page.

### ACT 13: DAY 365, THE COUNT (307 to 337)
Tag `DAY 365`. Two scoreboards, one per life:
- IN THE CHAIR: `10 PAGES x 365 = 3,650 PAGES` -> `ABOUT 20 BOOKS`, the shelf fills with 20 spines, glowing words flow into his head ("living in his head").
- IN BED: `3 HOURS x 365 = 1,095 HOURS`, the receipt prints, a calendar of full working days is torn away (6+ months). "He couldn't tell you a single thing": a blank thought bubble.

### ACT 14: THE REVEAL (338 to 356)
`SAME MAN. SAME ROOM. SAME YEAR.` `WHAT YOU SOW, YOU REAP.` Then a held beat of music dropping out at "Now, here's the part I haven't told you." The two Daniels slide together and merge into ONE on "There were never two men." `ONE MAN. ONE NIGHT. ONE CHOICE.` The 11 PM clock loops forever.

### ACT 15: TONIGHT (356 to 382)
The room as at the start, present tense. Daniel in bed looks at the phone, then across the room at the chair, at the book with the bookmark on page one. He turns the phone face down. The glow dies. Speech bubble `"Okay. Ten pages."` He opens the book, reads the first line, reads it again, "because this time, he wants to." Close on his face: the smile of someone who chose. `THAT'S ALL A TURNING POINT EVER IS.`

### ACT 16: THE QUESTION (382 to 405)
`NOT A BIG DECISION. JUST A SMALL ONE, MADE ONE MORE TIME THAN THE LAST.` "A year from now you're going to be one of these two men": the two silhouettes fade up on the windowsill plants. "The year will pass either way." "What you plant tonight": a seed drops. `PHONE OR BOOK?` Two big buttons pulse. Then "Tell me in the comments, what's the last book you finished?" -> comment bubble, end card (3 s), fade out.

## 5. Sound and music
- Beds from `public/music` (low, routine, hope, wonder, resolve): cold low bed 0 to 55, light curious bed for the split and Night 1, routine bed for Days 5 to 40, tension for Day 90, warm hope during the chair scenes, hollow bed for Day 300, silence at 343.5 ("here's the part I haven't told you"), resolve builds from 356 and swells at "Okay. Ten pages." and the end.
- Effects: only the ones the Same2D set already has (`public/sfx3`), kept soft. New ones to generate if you agree (costs ElevenLabs credits, I ask before using): seed drop into soil, plant growth rustle, vines creeping, a soft ticking for the 10-second ring, a mirror glass tone.

## 6. How we build it (same method as Two Fathers)
1. Copy the mp3 into `public/audio/`, convert the JSON into `src/same7/data/words.ts` (`[word, start, end]`), `T()/TE()` helpers and speech-ducking like `src/fathers/timeline.ts`.
2. New folder `src/same7/` with the shot list, importing the rig, stage, sets and inserts from `src/same2d/` (Char, SideChar, Stage, sets, inserts, fx). New props: windowsill with two growing plants (stages 0 to 6), vines, 20-book shelf, 1,095 h receipt, nested phones, seasons wheel, glass office.
3. Typography from the new `src/fathers/type.tsx` (mask-reveal pop, slam, title, quote, caption stamps) in the digital type, so it matches the Fathers upgrade.
4. Build and review in order: Acts 1 to 3 (first 63 s) first, then Acts 4 to 9, then Acts 10 to 16. You review live in Studio; I only render stills for my own checks and never render a video until you ask.
5. Composition `Same7`, about 12,150 frames. The old `Same2D` stays untouched.

## 7. Decisions needed from you
1. Name of the tags: `IN BED` / `IN THE CHAIR` (default) or keep SCROLLER / READER?
2. Windowsill plants as the running clock (default yes) or keep the Bill/Reward receipts as the only metaphor?
3. Is the split in Act 3 shown for 1 s as the single "both at once" moment, or never?
4. New sound effects (seed, plant rustle, vines, mirror tone): generate them (credits) or reuse existing ones only?
5. Same glossy glass men as Same2D, with Daniel's outfit: grey hoodie. OK?
