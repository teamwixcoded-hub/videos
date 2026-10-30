const fs=require('fs');let f=fs.readFileSync('src/fathers/Fathers.tsx','utf8');
const a=f.indexOf("      {!paperCard && <>\n        <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(14,80,125,.30)");
const b=f.indexOf("</>}",a)+4;
if(a<0)console.log('MISSING block');else f=f.slice(0,a)+f.slice(b+1);
f=f.replace("      {!paperCard && <Shafts t={t} warm={warm} />}\n","").replace("      {!paperCard && <Cinema t={t} />}\n","");
fs.writeFileSync('src/fathers/Fathers.tsx',f);
