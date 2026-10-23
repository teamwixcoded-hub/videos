#!/bin/bash
cd "$(dirname "$0")/.."
gen() { for t in 1 2 3; do RES=2K node scripts/gen.mjs $1 scripts/prompts/$1.txt 16:9 $2 > out/gen-$1.log 2>&1 && return 0; sleep 8; done; }
gen FL_R2 FL_R1 &
gen FL_R4 FL_R1 &
gen FL_R5 FL_R1 &
gen FL_R6 FL_R1 &
gen FL_R7 FL_R1 &
wait
gen FL_R2b FL_R2,FL_R3 &
gen FL_R3b FL_R3,FL_R4 &
gen FL_R6b FL_R6 &
wait
