#!/bin/bash
cd "$(dirname "$0")/.."
export RES=1K
run() { [ -f "public/images/$1.png" ] && { echo "skip $1"; return; }; echo "== $1"; node scripts/gen.mjs "$1" "scripts/prompts/$1.txt" 16:9 "$2" 2>&1 | tail -6; }
for n in GL2_bed_swipe GL2_bed_laugh GL2_bed_relaxed; do run $n STYLE_REF2,GL2_bed_slump,GL2_props_phone; done
for n in GL2_arm_clock GL2_arm_yawn GL2_arm_sigh GL2_arm_shut GL2_arm_bored GL2_bus_read; do run $n GL2_arm_slump,STYLE_REF2,GL2_props_book; done
echo ALLDONE
