const fs = require('fs');
let s = fs.readFileSync('src/same2d/Same2D.tsx', 'utf8');
const r = (a, b) => { if (!s.includes(a)) throw new Error('MISSING ' + a.slice(0, 60)); s = s.split(a).join(b); };
// reference pose: the book rests open in front of the chest, tilted back about 35 degrees so its pages face up at him; the head is bowed and the eyes are on the page
r("lerpV(restN, [214, -222], rk)", "lerpV(restN, [226, -150], rk)");
r("lerpV(restF, [262 - turnF * 30, -240 - turnF * 100], rk)", "lerpV(restF, [276 - turnF * 30, -172 - turnF * 100], rk)");
r("<BookSide x={lerp(150, 246, rk)} y={lerp(-70, -312, rk)} deg={lerp(-4, -10, rk)} flip={fl} />", "<BookSide x={lerp(150, 252, rk)} y={lerp(-70, -214, rk)} deg={lerp(-4, -36, rk)} flip={fl} />");
r("(mode === 'book' ? 2 : 0)) + (mode === 'book' ? 3 : 0)", "(mode === 'book' ? 14 : 0)) + (mode === 'book' ? 6 : 0)");
r("[sweep * 0.4 + 0.5, 0.2] : [0.2, 0.2])", "[sweep * 0.4 + 0.45, 0.85] : [0.2, 0.2])");
fs.writeFileSync('src/same2d/Same2D.tsx', s);
