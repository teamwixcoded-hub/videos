#!/bin/bash
# the rest of S01 take 2, at 1K (skips frames that already exist)
cd "$(dirname "$0")/.."
export RES=1K
run() { [ -f "public/images/$1.png" ] && { echo "skip $1"; return; }; echo "== $1"; node scripts/gen.mjs "$1" "scripts/prompts/$1.txt" 16:9 "$2" 2>&1 | tail -6; }
for n in GL2_bed_blink GL2_bed_sigh; do run $n STYLE_REF2,GL2_bed_slump; done
run GL2_bed_choice STYLE_REF2,GL2_bed_slump,GL2_props_phone,GL2_props_book
for n in GL2_bed_glance GL2_bed_reach1 GL2_bed_reach2 GL2_bed_phone GL2_bed_lookup; do run $n STYLE_REF2,GL2_bed_slump,GL2_props_phone; done
run GL2_arm_slump STYLE_REF2,GL2_bed_slump
for n in GL2_arm_reach GL2_arm_bookclosed GL2_arm_bookopen GL2_arm_lookup; do run $n STYLE_REF2,GL2_arm_slump,GL2_props_book; done
echo ALLDONE
