#!/bin/bash
cd "$(dirname "$0")/.."
gen() { for t in 1 2 3; do RES=2K node scripts/gen.mjs $1 scripts/prompts/$1.txt ${3:-16:9} $2 > out/gen-$1.log 2>&1 && return 0; sleep 8; done; }
gen FL_OF1 HEADS,OFFICE,FL_G10 16:9 &
gen FL_BM1 FL_G1 16:9 &
gen FL_G12 FL_G1 16:9 &
gen FL_BL1 FL_N1 16:9 &
gen FL_MG1 HEADS,MANAGER,MGR,FL_G10 16:9 &
gen FL_PH HEADS,FL_G10 1:1 &
gen FL_R8 FL_R1 16:9 &
gen FL_RS2 FL_R5 16:9 &
gen FL_RS3 FL_R1 16:9 &
gen FL_RS4 FL_R1 16:9 &
gen FL_RS5 FL_R1 16:9 &
wait
gen FL_OF2 FL_OF1 &
gen FL_BM2 FL_BM1 &
gen FL_BL2 FL_BL1 &
gen FL_BL3 FL_BL1 &
gen FL_MG2 FL_MG1 &
gen FL_MG3 FL_MG1 &
gen FL_MG4 FL_MG1 &
gen FL_MG5 FL_MG1 &
wait
