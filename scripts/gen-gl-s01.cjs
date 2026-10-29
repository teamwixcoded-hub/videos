// Prompts for the glass-style S01 frames (STYLE_REF2 = the user's glossy glass stick-figure reference).
const fs = require('fs');
const STYLE = 'Use the reference images as the exact character and rendering style: a simple stick-figure man with a big round translucent glass-bubble head with a thin dark rim, soft white specular highlights and a glossy swoop of hair on top, simple glossy black oval eyes, small brows and a simple mouth, a glossy lavender-purple t-shirt, glossy black rounded limbs, big white mitten-style hands, glossy white rounded shoes, all with the same shiny glassy plastic look. Keep the camera, framing, character size and position identical to the reference. Clean pure white background, soft lavender contact shadow on the floor, no text.';
const BED = 'He sits on the edge of the same frosted translucent lavender glass bed (plain mattress block, pillow, rumpled blanket, headboard), in side view facing left, feet flat on the floor.';
const CHAIR = 'He sits in a simple rounded armchair made of the same frosted translucent lavender glass material, in side view facing right, feet flat on the floor.';
const F = {
  GL_bed_blink: `${STYLE} ${BED} Exactly the same slumped tired pose as the first reference, but his eyes are fully closed in a blink (thin curved lines).`,
  GL_bed_sigh: `${STYLE} ${BED} In the middle of a heavy sigh: shoulders dropped even lower, head tilted further down with his chin toward his chest, eyes closed, and a small puff of breath drawn as three short wavy lines near his mouth.`,
  GL_bed_glance: `${STYLE} ${BED} Both hands rest on his knees, head raised a little, his eyes glancing sideways toward a smartphone lying on the blanket beside him which glows with a soft blue-white light and a few short glow lines. Tired, curious expression.`,
  GL_bed_reach1: `${STYLE} ${BED} Slumped and tired. His near hand lifts from his knee and reaches out toward a smartphone lying on the blanket beside him; his eyes are on the phone, heavy eyelids.`,
  GL_bed_reach2: `${STYLE} ${BED} He has picked up the smartphone and holds it half raised near his chest in one hand, looking at it with tired eyes, shoulders still slumped.`,
  GL_bed_lookup: `${STYLE} ${BED} He has lowered the smartphone to his lap and lifts his head, looking straight ahead past the viewer with a calm thoughtful expression.`,
  GL_arm_slump: `${STYLE} ${CHAIR} Slumped and tired, shoulders dropped, head tilted down, heavy half-closed eyelids, a small frown, both hands resting on his knees.`,
  GL_arm_reach: `${STYLE} ${CHAIR} Slumped and tired. His near hand reaches out to the side toward a closed hardcover book lying on a small round frosted-glass side table next to the armchair.`,
  GL_arm_bookclosed: `${STYLE} ${CHAIR} He holds a closed hardcover book in both hands on his lap, looking down at its cover with a tired but curious expression.`,
  GL_arm_bookopen: `${STYLE} ${CHAIR} He holds an open book in both hands in front of his chest, head tilted down, eyes on the page, a faint calm smile.`,
  GL_arm_lookup: `${STYLE} ${CHAIR} The open book is lowered to his lap; he lifts his head and looks straight ahead past the viewer with a calm thoughtful expression.`,
};
for (const [k, v] of Object.entries(F)) fs.writeFileSync(`scripts/prompts/${k}.txt`, v);
console.log(Object.keys(F).length, 'prompts');
