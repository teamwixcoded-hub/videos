const fs = require('fs');
let s = fs.readFileSync('src/same2d/Same2D.tsx', 'utf8');
const r = (a, b) => { if (!s.includes(a)) throw new Error('MISSING ' + a.slice(0, 60)); s = s.split(a).join(b); };
// the book is held up in front of the face, its reading side turned to the eyes
r("lerpV(restN, [244, -128], rk)", "lerpV(restN, [214, -222], rk)");
r("lerpV(restF, [290 - turnF * 30, -146 - turnF * 120], rk)", "lerpV(restF, [262 - turnF * 30, -240 - turnF * 100], rk)");
r("<BookSide x={lerp(150, 272, rk)} y={lerp(-70, -232, rk)} deg={lerp(-4, -22, rk)} flip={fl} />", "<BookSide x={lerp(150, 246, rk)} y={lerp(-70, -312, rk)} deg={lerp(-4, -10, rk)} flip={fl} />");
r("const headPitch = 6 + (p.tilt ?? (mode === 'book' ? 8 : 0)) + (mode === 'book' ? 6 : 0) - (p.turn ?? 0) * 10;", "const headPitch = 6 + (p.tilt ?? (mode === 'book' ? 2 : 0)) + (mode === 'book' ? 3 : 0) - (p.turn ?? 0) * 10;");
r("gaze: p.gaze ?? (mode === 'book' ? [sweep * 0.5 + 0.3, 0.9] : [0.2, 0.2])", "gaze: p.gaze ?? (mode === 'book' ? [sweep * 0.4 + 0.5, 0.2] : [0.2, 0.2])");
fs.writeFileSync('src/same2d/Same2D.tsx', s);
