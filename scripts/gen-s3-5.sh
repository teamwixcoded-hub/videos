#!/bin/bash
cd "$(dirname "$0")/.."
gen() { for t in 1 2 3; do RES=2K node scripts/gen.mjs $1 scripts/prompts/$1.txt 16:9 $2 > out/gen-$1.log 2>&1 && return 0; sleep 8; done; }
gen FL_N1 FL_R1 &
gen FL_G8 FL_G7 &
gen FL_G9 FL_G7 &
gen FL_G10 FL_G1 &
gen FL_K1 HEADS,KITCHEN,FL_R5 &
gen FL_B1 HEADS,BATHROOM,FL_R5 &
gen FL_L1 HEADS,LIVING,FL_R5,MOM &
wait
gen FL_N2 FL_N1 &
gen FL_N3 FL_N1 &
gen FL_G11 FL_G10 &
gen FL_K2 FL_K1 &
gen FL_B2 FL_B1 &
gen FL_L2 FL_L1 &
gen FL_L3 FL_L1 &
wait
