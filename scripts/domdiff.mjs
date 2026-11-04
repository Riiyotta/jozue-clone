// Structural DOM diff: original page vs locally rendered page (normalised whitespace/attr order).
import fs from 'node:fs';
import { parseDocument } from 'htmlparser2';
const norm = (html) => {
  const d = parseDocument(html, { decodeEntities: true });
  const out = [];
  const walk = (n, depth) => {
    for (const c of n.children || []) {
      if (c.type === 'comment' || c.type === 'directive') continue;
      if (c.type === 'text') { const t = c.data.replace(/\s+/g, ' ').trim(); if (t) out.push(depth + ' #' + t); continue; }
      if (c.name === 'script' && /_vercel/.test(c.attribs.src || '')) continue;
      if (c.name === 'script' && c.attribs.src === '/@vite/client') continue;
      const a = Object.entries(c.attribs).filter(([k]) => k !== 'style').map(([k, v]) => `${k.toLowerCase()}=${v}`).sort().join(' ');
      const st = (c.attribs.style || '').replace(/\s+/g, '').replace(/;$/, '').split(';').map(s=>s.replace(/^([^:]+):/, (m,k)=>k.toLowerCase()+':')).sort().join(';');
      out.push(`${depth} <${c.name} ${a}${st ? ' style=' + st : ''}>`);
      if (['script', 'style', 'template', 'noscript'].includes(c.name)) { out.push(depth + ' RAW ' + (c.children||[]).map(x=>x.data||'').join('').length); continue; }
      walk(c, depth + 1);
    }
  };
  walk(d, 0);
  return out;
};
const [a, b] = process.argv.slice(2).map((f) => norm(fs.readFileSync(f, 'utf8')));
let diffs = 0;
for (let i = 0; i < Math.max(a.length, b.length); i++) {
  if (a[i] !== b[i]) { if (diffs++ < 8) console.log(`#${i}\n  orig: ${a[i]?.slice(0, 220)}\n  mine: ${b[i]?.slice(0, 220)}`); }
}
console.log(`${process.argv[2]}: nodes ${a.length} vs ${b.length}, diffs ${diffs}`);
