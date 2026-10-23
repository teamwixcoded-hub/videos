#!/bin/bash
# Runs the asset batch in parallel. Style refs: HEADS for characters/props, BEDROOM for rooms.
cd "$(dirname "$0")/.."
P=scripts/prompts
node scripts/gen.mjs PROPS1 $P/PROPS1.txt 4:3 HEADS > out/gen-PROPS1.log 2>&1 &
node scripts/gen.mjs PROPS2 $P/PROPS2.txt 4:3 HEADS > out/gen-PROPS2.log 2>&1 &
node scripts/gen.mjs FX $P/FX.txt 4:3 HEADS > out/gen-FX.log 2>&1 &
node scripts/gen.mjs HEADS2 $P/HEADS2.txt 4:3 HEADS > out/gen-HEADS2.log 2>&1 &
node scripts/gen.mjs MOM $P/MOM.txt 3:2 HEADS > out/gen-MOM.log 2>&1 &
node scripts/gen.mjs MGR $P/MGR.txt 3:2 HEADS > out/gen-MGR.log 2>&1 &
node scripts/gen.mjs KITCHEN $P/KITCHEN.txt 16:9 BEDROOM > out/gen-KITCHEN.log 2>&1 &
node scripts/gen.mjs BATHROOM $P/BATHROOM.txt 16:9 BEDROOM > out/gen-BATHROOM.log 2>&1 &
node scripts/gen.mjs LIVING $P/LIVING.txt 16:9 BEDROOM > out/gen-LIVING.log 2>&1 &
node scripts/gen.mjs OFFICE $P/OFFICE.txt 16:9 BEDROOM > out/gen-OFFICE.log 2>&1 &
node scripts/gen.mjs MANAGER $P/MANAGER.txt 16:9 BEDROOM > out/gen-MANAGER.log 2>&1 &
wait
