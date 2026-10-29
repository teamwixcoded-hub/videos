const fs=require('fs');let s=fs.readFileSync('CLAUDE.md','utf8');
const a="Status: full build, type-checks";
const add="Held objects: src/fathers/held.tsx (PhoneBack, CupHeld) are drawn in the hand frame under the fingers via Human.tsx `held` props; People.tsx HELD table maps pose->object (ear/phone->phone, cup->cup). Phone-at-ear hand target is side N:[-92,-452]. Set dressing: src/fathers/details.tsx (shelves, lamps, rug, bulbs, bicycle, fridge...) merged into sets inside kit.tsx SC.* wrappers. User's quality bar (latest): phones must look like phones at the ear, sitting/holding/backgrounds/objects must feel real, not basic.\n";
if(!s.includes('Held objects:'))s=s.replace(a,add+a);fs.writeFileSync('CLAUDE.md',s);
