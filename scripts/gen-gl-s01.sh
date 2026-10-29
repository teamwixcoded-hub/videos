#!/bin/bash
cd "$(dirname "$0")/.."
export RES=1K
run() { echo "== $1"; node scripts/gen.mjs "$1" "scripts/prompts/$1.txt" 16:9 "$2" 2>&1 | tail -6; }
for n in GL_bed_blink GL_bed_sigh GL_bed_glance GL_bed_reach1 GL_bed_reach2 GL_bed_lookup; do run $n STYLE_REF2,GL_bed_slump; done
run GL_arm_slump STYLE_REF2,GL_bed_slump
for n in GL_arm_reach GL_arm_bookclosed GL_arm_bookopen GL_arm_lookup; do run $n STYLE_REF2,GL_arm_slump; done
echo ALLDONE
