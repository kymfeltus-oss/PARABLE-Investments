import fs from 'fs';
import path from 'path';

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.(tsx?|css)$/.test(ent.name)) out.push(p);
  }
  return out;
}

const replacements = [
  [/\[#00[Dd]4[Ff][Ff]\]/g, '[var(--cyan)]'],
  [/\[#030712\]/g, '[var(--bg-black)]'],
  [/\[#030406\]/g, '[var(--bg-black)]'],
  [/\[#0[Aa]1018\]/g, '[var(--bg-black-soft)]'],
  [/\[#F8FAFC\]/g, '[var(--white-soft)]'],
  [/rgba\(\s*0\s*,\s*212\s*,\s*255/g, 'rgba(0, 242, 255'],
  [/from-\[#030712\]/g, 'from-black'],
  [/via-\[#030712\]/g, 'via-black'],
  [/to-\[#030712\]/g, 'to-black'],
  [/bg-\[#030712\]/g, 'bg-black'],
  [/bg-\[#030406\]/g, 'bg-black'],
  [/hover:text-\[#00[Dd]4[Ff][Ff]\]/g, 'hover:text-[var(--cyan)]'],
];

let changed = 0;
for (const file of walk('src')) {
  const text = fs.readFileSync(file, 'utf8');
  let next = text;
  for (const [re, rep] of replacements) next = next.replace(re, rep);
  if (next !== text) {
    fs.writeFileSync(file, next, 'utf8');
    changed++;
    console.log(file);
  }
}
console.log('Updated files:', changed);
