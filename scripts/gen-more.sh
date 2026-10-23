#!/bin/bash
cd "$(dirname "$0")/.."
gen() { for t in 1 2 3; do RES=2K node scripts/gen.mjs $1 scripts/prompts/$1.txt 16:9 $2 > out/gen-$1.log 2>&1 && return 0; sleep 8; done; }
gen FL_G1p FL_G1 &
gen FL_G1s FL_G1 &
gen FL_G1l FL_G1 &
gen FL_G1c FL_G1 &
gen FL_R1y FL_R1 &
gen FL_R1s FL_R1 &
gen FL_R1h FL_R1 &
gen FL_R1g FL_R1 &
wait
gen FL_L0 FL_L1 &
gen FL_L0b FL_L1 &
gen FL_L1c FL_L1 &
gen FL_R9 FL_R5 &
gen FL_R10 FL_R5 &
gen FL_G13 FL_G12 &
gen FL_G14 FL_G12 &
gen FL_BL4 FL_BL1 &
wait
gen FL_BL5 FL_BL1 &
gen FL_BL6 FL_BL1 &
gen FL_G15 FL_G12 &
gen FL_R11 FL_R8 &
gen FL_RS1 FL_RS2 &
gen FL_RS2b FL_RS2 &
gen FL_OF3 FL_OF1 &
wait
