#!/bin/bash
# S01 frames. Scroller frames reference the style + the first bed frame; reader frames reference the style, then the first reader frame.
cd "$(dirname "$0")/.."
export RES=1K
for n in SM_bed_reach1 SM_bed_reach2 SM_bed_phone SM_bed_lookup; do node scripts/gen.mjs $n scripts/prompts/$n.txt 16:9 STYLE_REF1,SM_bed_slump 2>&1 | tail -1; done
node scripts/gen.mjs SM_arm_slump scripts/prompts/SM_arm_slump.txt 16:9 STYLE_REF1 2>&1 | tail -1
for n in SM_arm_reach SM_arm_bookclosed SM_arm_bookopen SM_arm_lookup; do node scripts/gen.mjs $n scripts/prompts/$n.txt 16:9 STYLE_REF1,SM_arm_slump 2>&1 | tail -1; done
