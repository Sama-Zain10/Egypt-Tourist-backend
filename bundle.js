const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'src');
const OUT = path.join(__dirname, 'project-bundle.txt');
const SKIP = ['node_modules', 'dist', '.git'];

let output = '';

function walk(dir) {
  for (const file of fs.readdirSync(dir)) {
    if (SKIP.includes(file)) continue;
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      walk(full);
    } else if (full.endsWith('.ts') && !full.endsWith('.spec.ts')) {
      output += `\n\n===== ${path.relative(__dirname, full)} =====\n`;
      output += fs.readFileSync(full, 'utf8');
    }
  }
}

walk(ROOT);
fs.writeFileSync(OUT, output);
console.log('Done: project-bundle.txt');


// الفايل ده بيجمع كود المشروع في فايل واحد عشان لما ابعته لاي شات يفهم علي طول 
// بيشتغل بالكوماند ده 
//node bundle.js   
//هرفع الفايل ده مع + PROJECT_CONTEXT-------FOR ANY CHATBOOT