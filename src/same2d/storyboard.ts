// ============================================================================================
// SAME MAN, 2D: the storyboard. One row per beat, in VIDEO seconds (narration timing from src/same/data/timeline.json).
// Rule: the picture always shows what the line says. A new place (bus, kitchen, bathroom) is a new set, never the same room.
//   place : which set        who: R = reader (warm), S = scroller (cold), both = cross-cut
//   shot  : face -> insert -> face, wide <-> close, punch-in (PI), match cut (MC), whip (W), particle bridge (PB), flash + speed lines (FL)
// ============================================================================================
export type Place = 'bedroom-night' | 'bedroom-day' | 'bus-night' | 'kitchen-day' | 'bathroom-day' | 'sky';
export type Beat = {
  from: number; to: number;
  line: string;              // what is being said (or '' for a hold)
  place: Place;
  who: 'R' | 'S' | 'both' | 'none';
  shows: string;             // what we see
  graphic?: string;          // kinetic word / insert / infographic on this beat
  cut?: string;              // transition into the beat
};

export const STORYBOARD: Beat[] = [
  // ---------------- COLD OPEN (0 - 27.7): the setup, then a one-second glimpse of where it ends ----------------
  {from: 0.0, to: 2.7, line: '', place: 'bedroom-night', who: 'S', shows: 'Dust in black, slow push on a tired man on the edge of the bed, phone dark in his hand'},
  {from: 2.7, to: 4.1, line: 'Same man,', place: 'bedroom-night', who: 'S', shows: 'Close-up of his tired face, facing us', graphic: 'KW "SAME MAN."'},
  {from: 4.1, to: 5.6, line: 'same room,', place: 'bedroom-night', who: 'both', shows: 'Wide of the bedroom: bed on one side, armchair with a book on its arm on the other', graphic: 'KW "SAME ROOM."', cut: 'W'},
  {from: 5.6, to: 7.6, line: 'same tired eyes', place: 'bedroom-night', who: 'S', shows: 'Extreme close-up of his half-lidded eyes, slow blink'},
  {from: 7.6, to: 9.3, line: 'at the end of a long day.', place: 'bedroom-night', who: 'S', shows: 'Insert: clock 11:40 PM. Back to him rubbing his face', graphic: 'Insert: clock'},
  {from: 9.3, to: 11.0, line: 'Tonight, he makes one small choice,', place: 'bedroom-night', who: 'both', shows: 'Insert: phone and book lying side by side on the blanket', graphic: 'KW "ONE SMALL CHOICE."'},
  {from: 11.0, to: 12.6, line: '', place: 'bedroom-night', who: 'S', shows: 'Insert: his hand hovers over the two, glow of the phone on his knuckles'},
  {from: 12.6, to: 15.9, line: 'and that choice splits his life in two.', place: 'bedroom-night', who: 'both', shows: 'The frame tears down the middle like paper: two copies of the room slide apart', graphic: 'Paper-tear split (the only split before Day 365)', cut: 'FL'},
  {from: 15.9, to: 18.6, line: 'In one life, he picks up his phone.', place: 'bedroom-night', who: 'S', shows: 'Bed, cold blue room. He lies back, thumb starts to scroll, glow washes his face', graphic: 'Insert: phone feed', cut: 'W'},
  {from: 18.6, to: 21.5, line: 'In the other, he picks up a book.', place: 'bedroom-night', who: 'R', shows: 'Same framing, warm armchair and lamp. He opens the book, eyes begin to move', cut: 'MC'},
  {from: 21.5, to: 24.0, line: 'One year from now, these two men won’t', place: 'bedroom-night', who: 'both', shows: 'Glimpse of Day 365: his gaunt face lit by the phone, thorny vines on the window; then the reader glowing, plant in bloom', graphic: 'Planter in shadow', cut: 'PB'},
  {from: 24.0, to: 25.7, line: 'recognize each other.', place: 'bedroom-night', who: 'both', shows: 'Two close-ups, one cut apart: gaunt vs glowing', cut: 'FL'},
  {from: 25.7, to: 27.7, line: '', place: 'sky', who: 'none', shows: 'Title hold', graphic: 'KW "ONE HABIT."'},
  {from: 27.7, to: 28.7, line: '', place: 'sky', who: 'none', shows: 'Paper scatter to off-white', graphic: 'Card "ONE YEAR EARLIER"'},

  // ---------------- S02 THE CHOICE (28.7 - 53.6) ----------------
  {from: 28.7, to: 29.4, line: '', place: 'bedroom-night', who: 'both', shows: 'Night one, wide: he sits on the bed edge, phone in one hand; book unread on the armchair arm', cut: 'cut'},
  {from: 29.4, to: 31.4, line: 'The phone feels good,', place: 'bedroom-night', who: 'S', shows: 'Phone lights his face; first small smile', graphic: 'Insert: screen lights up'},
  {from: 31.4, to: 32.6, line: 'instantly.', place: 'bedroom-night', who: 'S', shows: 'Reward pop: sparkles burst off the screen', graphic: 'KW "INSTANTLY."'},
  {from: 32.6, to: 35.8, line: 'A video, a laugh, another one.', place: 'bedroom-night', who: 'S', shows: 'Full-frame feed: video, laughing face, next video, next. He chuckles', graphic: 'Insert: feed, 3 pops'},
  {from: 35.8, to: 38.9, line: 'His shoulders drop. His brain gets a small', place: 'bedroom-night', who: 'S', shows: 'Side view: shoulders sag, whole body melts into the pillow', graphic: 'Infographic: dopamine bar +1'},
  {from: 38.9, to: 41.8, line: 'reward and asks for one more.', place: 'bedroom-night', who: 'S', shows: 'His thumb swipes again, instantly', graphic: 'Insert: thumb swipe, bar ticks again'},
  {from: 41.8, to: 44.6, line: 'The book does not feel good. He reads the', place: 'bedroom-night', who: 'R', shows: 'Armchair close-up, brow furrowed, eyes crawling along a line', graphic: 'Insert: page with one line highlighted'},
  {from: 44.6, to: 46.9, line: 'same line three times.', place: 'bedroom-night', who: 'R', shows: 'Eyes snap back to the start of the line, again, again', graphic: 'KW "SAME LINE ×3"'},
  {from: 46.9, to: 49.1, line: 'His eyes drift to the clock.', place: 'bedroom-night', who: 'R', shows: 'Eyes slide off the page toward the clock, then the clock itself', graphic: 'Insert: clock 11:50', cut: 'W'},
  {from: 49.1, to: 51.1, line: 'Ten pages feel like a hundred.', place: 'bedroom-night', who: 'R', shows: 'Book looks huge in his hands; he yawns', graphic: 'KW "TEN PAGES."'},
  {from: 51.1, to: 53.6, line: '', place: 'bedroom-night', who: 'R', shows: 'He sighs and keeps going'},

  // ---------------- S03 NIGHT ONE (53.6 - 86.9) ----------------
  {from: 53.6, to: 56.3, line: '', place: 'bedroom-night', who: 'both', shows: 'Night, both lives, lamp glow vs phone glow', graphic: 'Tag NIGHT 1'},
  {from: 56.3, to: 59.5, line: '"Just five more minutes," says the scroller.', place: 'bedroom-night', who: 'S', shows: 'Close-up, he mutters it without looking up', graphic: 'Speech bubble'},
  {from: 59.5, to: 61.3, line: 'It’s 2:00 in the morning.', place: 'bedroom-night', who: 'S', shows: 'Insert: phone lock screen, time jumps 11:40 → 2:00 AM, battery 8%', graphic: 'Insert: lock screen + Tag 2:00 AM', cut: 'FL'},
  {from: 61.3, to: 64.5, line: 'The reader closes the book after 10 pages,', place: 'bedroom-night', who: 'R', shows: 'Insert: book shuts on page 10. Close on his face, deflated', graphic: 'Insert: page counter 10'},
  {from: 64.5, to: 65.8, line: 'frustrated.', place: 'bedroom-night', who: 'R', shows: 'He tosses the book onto the chair arm, jaw tight'},
  {from: 65.8, to: 68.9, line: 'And honestly, on night one, the phone is', place: 'bedroom-night', who: 'S', shows: 'Scroller grinning in the glow, thumb flying', graphic: 'Scoreboard: BOOK 0 : PHONE 1'},
  {from: 68.9, to: 69.9, line: 'winning.', place: 'bedroom-night', who: 'S', shows: 'The 1 on the scoreboard pops'},
  {from: 69.9, to: 72.2, line: 'One of them is relaxed, the other is', place: 'bedroom-night', who: 'S', shows: 'Scroller melted into the pillow, calm smile'},
  {from: 72.2, to: 73.3, line: 'bored.', place: 'bedroom-night', who: 'R', shows: 'Reader, flat stare, chin on hand'},
  {from: 73.3, to: 75.6, line: 'That’s why most people choose the phone.', place: 'bedroom-night', who: 'none', shows: 'Dark overlay: a row of ten little people, eight turn to a phone', graphic: 'Infographic: icon crowd 8 / 10'},
  {from: 75.6, to: 78.3, line: 'The reward comes first, the bill comes later.', place: 'bedroom-night', who: 'S', shows: 'Insert: window-box planter on the sill. A grey seed drops into the soil', graphic: 'KW "WHAT YOU SOW"', cut: 'PB'},
  {from: 78.3, to: 79.6, line: '', place: 'bedroom-night', who: 'both', shows: 'Quiet beat: the dark window, the planter, one grey speck of soil'},
  {from: 79.6, to: 82.7, line: 'Night two, he almost doesn’t open it.', place: 'bedroom-night', who: 'R', shows: 'Armchair: the book sits closed on his knee; hand rests on the cover, does not open it; he glances at the phone-lit bed', graphic: 'Tag NIGHT 2'},
  {from: 82.7, to: 85.5, line: 'Night three, he reads on the bus, mostly', place: 'bus-night', who: 'R', shows: 'BUS, night: he sits by the window, city lights streaming past, book open. Passengers around him stare at their phones', graphic: 'Tag NIGHT 3', cut: 'W'},
  {from: 85.5, to: 86.9, line: 'to prove he can.', place: 'bus-night', who: 'R', shows: 'Close-up: a stubborn little smile as the bus lights slide across his face'},

  // ---------------- S04 DAY 5 (86.9 - 115.3) ----------------
  {from: 86.9, to: 89.4, line: '', place: 'bedroom-day', who: 'S', shows: 'Morning light. Alarm buzzes, his hand slaps for the phone', graphic: 'Tag DAY 5', cut: 'FL'},
  {from: 89.4, to: 90.7, line: 'Day five,', place: 'bedroom-day', who: 'S', shows: 'Eyes still shut, phone already in his hand'},
  {from: 90.7, to: 92.8, line: 'the phone is the first thing he touches in', place: 'bedroom-day', who: 'S', shows: 'Insert: lock screen 6:30, his thumb unlocks it before his eyes open'},
  {from: 92.8, to: 95.8, line: 'the morning and the last thing he sees at night.', place: 'bedroom-night', who: 'S', shows: 'Cut: night, same pose, same glow on his face', cut: 'MC'},
  {from: 95.8, to: 98.1, line: 'Breakfast with a screen,', place: 'kitchen-day', who: 'S', shows: 'KITCHEN: cereal spoon halfway to his mouth, eyes on the phone propped on the cereal box', graphic: 'Label BREAKFAST', cut: 'W'},
  {from: 98.1, to: 99.4, line: 'bathroom with a screen,', place: 'bathroom-day', who: 'S', shows: 'BATHROOM: toothbrush in his mouth, phone propped on the sink', graphic: 'Label BATHROOM', cut: 'W'},
  {from: 99.4, to: 100.5, line: 'bed with a screen.', place: 'bedroom-night', who: 'S', shows: 'Back in bed, glow on his face', graphic: 'Label BED', cut: 'W'},
  {from: 100.5, to: 102.9, line: 'The days start to blur.', place: 'bedroom-day', who: 'S', shows: 'Motion-blur whip through calendar pages; ghost copies of him at the table, sink, bed slide by', graphic: 'KW "BLUR."'},
  {from: 102.9, to: 105.4, line: 'Day five, same chair, same cup of tea,', place: 'bedroom-night', who: 'R', shows: 'Reader in the same armchair, tea poured into the same mug, steam curling up', graphic: 'Tag DAY 5 + Insert: tea pour'},
  {from: 105.4, to: 108.0, line: 'same 10 pages.', place: 'bedroom-night', who: 'R', shows: 'Book page, bookmark at page 10; his finger on the line', graphic: 'Insert: page 10'},
  {from: 108.0, to: 110.0, line: 'Not because he wants to,', place: 'bedroom-night', who: 'R', shows: 'Close-up, eyes tired, mouth flat'},
  {from: 110.0, to: 111.9, line: 'because he decided to.', place: 'bedroom-night', who: 'R', shows: 'Jaw sets. He turns the page', graphic: 'BigCounter pages 10 → 50'},
  {from: 111.9, to: 115.3, line: 'It still isn’t fun, but it’s becoming a pattern.', place: 'bedroom-night', who: 'R', shows: 'Calm face; behind him a calendar fills with check marks', graphic: 'KW "A PATTERN."'},
];
