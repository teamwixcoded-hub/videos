const fs=require('fs');let s=fs.readFileSync('src/fathers/ImgHead.tsx','utf8');
const a=s.indexOf("  return (\n    <g>\n      <defs><clipPath");const b=s.indexOf("    </g>\n  );\n};",a)+"    </g>\n  );\n};".length;
s=s.slice(0,a)+`  const bottom = (m.chin - m.cy + 0.2 * m.w) * S;
  return (
    <g>
      <defs><clipPath id={id}><rect x={-400} y={-400} width={800} height={400 + bottom} /></clipPath></defs>
      <g clipPath={\`url(#\${id})\`}><g transform={\`scale(\${S}) translate(\${-m.cx} \${-m.cy})\`}><image href={staticFile(\`images/ft/\${set.dir}/\${set.pre}\${f}.png\`)} x={0} y={0} width={m.cw} height={m.ch} /></g></g>
    </g>
  );
};`+s.slice(b);
fs.writeFileSync('src/fathers/ImgHead.tsx',s);
