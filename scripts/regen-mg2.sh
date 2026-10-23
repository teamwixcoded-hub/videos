#!/bin/bash
cd "$(dirname "$0")/.."
gen() { for t in 1 2 3; do RES=2K node scripts/gen.mjs $1 scripts/prompts/$1.txt 16:9 $2 > out/gen-$1.log 2>&1 && return 0; sleep 8; done; }
gen FL_MG3 FL_MG2 &
gen FL_MG4 FL_MG2 &
gen FL_MG5 FL_MG2 &
wait
