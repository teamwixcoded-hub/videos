#!/bin/bash
cd "$(dirname "$0")/.."
gen() { for t in 1 2 3; do RES=2K node scripts/gen.mjs $1 scripts/prompts/$1.txt 16:9 $2 > out/gen-$1.log 2>&1 && return 0; sleep 8; done; }
gen FL_W1 FL_OF1 &
gen FL_W2 FL_OF1 &
gen FL_M2 FL_K1 &
gen FL_M3 FL_K1 &
gen FL_M4 FL_BM1 &
gen FL_P1 FL_L1 &
wait
