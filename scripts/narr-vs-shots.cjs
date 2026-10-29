const fs=require('fs');
const m=fs.readFileSync('src/fathers/data/words2.ts','utf8');
const W=eval(m.slice(m.indexOf('= [')+2,m.lastIndexOf(']')+1).replace(/;$/,''));
const words=W.map(([w,a,b])=>({w,a,b}));
const norm=p=>p.toLowerCase().replace(/-/g,'').replace(/[^a-z0-9' ]/g,' ').split(/\s+/).filter(Boolean);
const T=(p,n=0)=>{const q=norm(p);let h=0;for(let i=0;i+q.length<=words.length;i++){if(q.every((w,k)=>words[i+k].w===w)){if(h===n)return words[i].a;h++}}throw new Error(p)};
const TE=(p,n=0)=>{const q=norm(p);let h=0;for(let i=0;i+q.length<=words.length;i++){if(q.every((w,k)=>words[i+k].w===w)){if(h===n)return words[i+q.length-1].b;h++}}throw new Error(p)};
const src=fs.readFileSync('src/fathers/shots.tsx','utf8').split('\n');
const st=src.findIndex(l=>l.startsWith('export const LIST'));
const shots=[];
for(let i=st;i<src.length;i++){const l=src[i];const mm=l.match(/^  \[((?:T|TE)\(.*?\)(?:\s*[-+]\s*[\d.]+)?|[\d.]+),\s*(?:undefined|'.')/);if(mm){let t;try{t=eval(mm[1])}catch(e){continue}shots.push({t,line:i+1,txt:l.slice(mm[0].length,mm[0].length+170)})}}
shots.sort((a,b)=>a.t-b.t);
const from=+process.argv[2]||0,to=+process.argv[3]||999;
for(let k=0;k<shots.length;k++){const a=shots[k].t,b=k+1<shots.length?shots[k+1].t:999;if(a<from||a>to)continue;
const nar=words.filter(w=>w.a>=a-0.01&&w.a<b-0.01).map(w=>w.w).join(' ');
console.log(a.toFixed(1)+' L'+shots[k].line+' | "'+nar+'"\n     '+shots[k].txt.replace(/\s+/g,' '));}
