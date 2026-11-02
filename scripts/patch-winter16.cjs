const fs = require('fs');
let s = fs.readFileSync('src/winter/act6.tsx', 'utf8');
const arr = (name, body) => { const re = new RegExp('const ' + name + ': Beat\\[\\] = \\[[\\s\\S]*?\\n\\];'); if (!re.test(s)) throw new Error('no array ' + name); s = s.replace(re, 'const ' + name + ': Beat[] = [\n' + body + '\n];'); };
const rep = (a, b) => { if (!s.includes(a)) throw new Error('missing: ' + a.slice(0, 70)); s = s.split(a).join(b); };
const Y = 990;
arr('B_FEB', `  {text: 'SOMEWHERE IN FEBRUARY,', at: T('somewhere in february'), to: T('other people start'), s: 84, y: ${Y}},
  {text: 'OTHER PEOPLE START TO NOTICE.', at: T('other people start'), s: 76, y: ${Y}, c: '#ffd23f'},`);
arr('B_TALK', `  {text: 'HE TALKS SLOWER.', at: T('he talks slower'), to: T('he thinks before'), s: 84, y: ${Y}},
  {text: 'HE THINKS BEFORE HE ANSWERS.', at: T('he thinks before'), s: 70, y: ${Y}, c: '#ffd23f'},`);
arr('B_MOOD', `  {text: 'HIS MOOD', at: T('his mood'), to: T('winter used to'), s: 110, y: ${Y}},
  {text: 'WINTER USED TO MAKE HIM HEAVY AND SLOW.', at: T('winter used to'), s: 58, y: ${Y}, c: '#8c96c8'},`);
arr('B_BEST', `  {text: 'THE BEST PART OF HIS DAY.', at: T('the best part'), s: 90, y: ${Y}, c: '#ffd23f'},`);
arr('B_JF', `  {text: "JAKE'S FEBRUARY IS DIFFERENT.", at: T('jakes february'), to: T('a few kilos'), s: 70, y: ${Y}},
  {text: 'A FEW KILOS HEAVIER', at: T('a few kilos'), to: T('more tired than'), s: 80, y: ${Y}, c: '#ff9a6a'},
  {text: 'MORE TIRED THAN IN DECEMBER', at: T('more tired than'), to: T('even though hes sleeping'), s: 70, y: ${Y}},
  {text: "EVEN THOUGH HE'S SLEEPING MORE.", at: T('even though hes sleeping'), s: 60, y: ${Y}, c: '#cfe2ff'},`);
arr('B_STAND', `  {text: 'SHOULDERS BACK. HEAD UP.', at: T('shoulders back'), to: T('not a fitness model'), s: 72, y: ${Y}},
  {text: 'NOT A FITNESS MODEL.', at: T('not a fitness model'), to: T('just a man who stopped'), s: 72, y: ${Y}, c: '#cfe2ff'},
  {text: 'JUST A MAN WHO STOPPED LOSING TO HIS OWN BED.', at: T('just a man who stopped'), s: 50, y: ${Y}, c: '#ffd23f'},`);
arr('B_JAKEB', `  {text: 'A LITTLE HEAVIER.', at: T('jake is a little'), to: T('and a lot more tired'), s: 84, y: ${Y}},
  {text: 'A LOT MORE TIRED.', at: T('and a lot more tired'), s: 84, y: ${Y}, c: '#ff9a6a'},`);
arr('B_SAMD1', `  {text: "SAM DIDN'T FEEL READY ON DECEMBER 1ST.", at: T('sam didnt feel ready'), to: T('he was cold'), s: 52, y: ${Y}},
  {text: 'COLD.', at: T('he was cold'), to: T('he was soft'), s: 100, y: ${Y}, c: '#6fd0ff'},
  {text: 'SOFT.', at: T('he was soft'), to: T('no idea'), s: 100, y: ${Y}, c: '#ffd23f'},
  {text: 'NO IDEA WHAT HE WAS DOING.', at: T('no idea'), s: 72, y: ${Y}, c: '#cfe2ff'},`);
rep("s: 80, y: 230, c: '#ffd23f'}]} /></Solo>}", "s: 80, y: 990, c: '#ffd23f'}]} /></Solo>}");
rep("s: 100, y: 200, c: '#3ddc84'}]} /><Pill x={560} y={330} text=\"MOM\"", "s: 100, y: 990, c: '#3ddc84'}]} /><Pill x={560} y={150} text=\"MOM\"");
rep("s: 130, y: 280, c: '#ffd23f'}]} /></Pair>}", "s: 120, y: 990, c: '#ffd23f'}]} /></Pair>}");
fs.writeFileSync('src/winter/act6.tsx', s);
