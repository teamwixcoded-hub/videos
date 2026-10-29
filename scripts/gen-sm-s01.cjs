// Writes the prompt files for the S01 frame batch. Run: node scripts/gen-sm-s01.cjs, then scripts/gen-sm-s01.sh
const fs = require('fs');
const STYLE = 'Use the reference image(s) as the exact character and art style: the same round white head with the same swoop of hair on top, the same thick painted black brush outline, the same simple dot-and-line face, the same watercolor purple t-shirt, thin black stick arms and legs, white sneakers with a soft lavender oval shadow, and everything else drawn in the same thick brush outline with flat lavender and white fills. Keep the camera, framing, character size and proportions identical to the reference. Pure white background, no text.';
const BED = 'He sits on the edge of the same simple bed (plain mattress, one pillow, rumpled blanket, headboard on the left), in side view facing left, feet flat on the floor.';
const CHAIR = 'He sits in a simple armchair (rounded back on the left, a seat cushion, one armrest, drawn in thick brush outline with a flat lavender fill), in side view facing right, feet flat on the floor.';
const F = {
  SM_bed_reach1: `${STYLE} ${BED} Slumped and tired. His near hand lifts from his knee and reaches out toward a smartphone lying on the blanket beside him; his eyes are on the phone, heavy eyelids.`,
  SM_bed_reach2: `${STYLE} ${BED} He has picked up the smartphone and holds it half raised near his chest with one hand, looking at it with tired eyes, shoulders still slumped.`,
  SM_bed_phone: `${STYLE} ${BED} He holds the smartphone in front of his chest with both hands, thumb on the screen, head tilted down toward it, a small content smile, the screen glowing a soft blue-lavender with a few short glow lines.`,
  SM_bed_lookup: `${STYLE} ${BED} He has lowered the smartphone to his lap and lifts his head, looking straight ahead past the viewer with a calm thoughtful expression.`,
  SM_arm_slump: `${STYLE} ${CHAIR} Slumped and tired, shoulders dropped, head tilted down, heavy half-closed eyelids, both hands resting on his knees.`,
  SM_arm_reach: `${STYLE} ${CHAIR} Slumped and tired. His near hand reaches out to the side toward a closed hardcover book lying on a small round side table next to the armchair.`,
  SM_arm_bookclosed: `${STYLE} ${CHAIR} He holds a closed hardcover book in both hands on his lap, looking down at its cover with a tired but curious expression.`,
  SM_arm_bookopen: `${STYLE} ${CHAIR} He holds an open book in both hands in front of his chest, head tilted down, eyes on the page, a faint calm smile.`,
  SM_arm_lookup: `${STYLE} ${CHAIR} The open book is lowered to his lap; he lifts his head and looks straight ahead past the viewer with a calm thoughtful expression.`,
};
for (const [k, v] of Object.entries(F)) fs.writeFileSync(`scripts/prompts/${k}.txt`, v);
console.log(Object.keys(F).join(' '));
