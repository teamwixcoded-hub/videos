#!/bin/bash
cd "$(dirname "$0")/.."
P=scripts/prompts
RES=2K node scripts/gen.mjs SC_R1b $P/SC_R1b.txt 16:9 SC_R1 > out/gen-SC_R1b.log 2>&1 &
RES=2K node scripts/gen.mjs SC_R6b $P/SC_R6b.txt 16:9 SC_R6 > out/gen-SC_R6b.log 2>&1 &
RES=2K node scripts/gen.mjs SC_G1b $P/SC_G1b.txt 16:9 SC_G1 > out/gen-SC_G1b.log 2>&1 &
RES=2K node scripts/gen.mjs SC_R2b $P/SC_R2b.txt 16:9 SC_R2,SC_R3 > out/gen-SC_R2b.log 2>&1 &
RES=2K node scripts/gen.mjs SC_R3b $P/SC_R3b.txt 16:9 SC_R3,SC_R4 > out/gen-SC_R3b.log 2>&1 &
RES=2K node scripts/gen.mjs SC_G4a $P/SC_G4a.txt 16:9 SC_G3,SC_G4 > out/gen-SC_G4a.log 2>&1 &
wait
