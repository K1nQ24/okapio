#!/usr/bin/env node
// Optionales Build-Skript (Node ≥ 18, keine Abhängigkeiten).
// Ersetzt <!-- @svg:name [noid] --> in src/*.src.html durch den Inhalt von assets/svg/name.svg
// und schreibt <name>.html ins Projektverzeichnis. Aufruf: node tools/build.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const svg = (name, noid) => {
  let s = readFileSync(join(root, 'assets/svg', `${name}.svg`), 'utf8').trim();
  s = s.replace(/<\?xml[^>]*\?>\s*/, '').replace(/ xmlns="http:\/\/www\.w3\.org\/2000\/svg"/, '');
  if (noid) s = s.replace(/ id="[^"]*"/g, '').replace(/ aria-labelledby="[^"]*"/, ' aria-label="okapio"').replace(/<title[^>]*>[^<]*<\/title>\s*/, '');
  return s.replace(/<!--[\s\S]*?-->\s*/g, '');
};
for (const f of readdirSync(join(root, 'src')).filter(f => f.endsWith('.src.html'))) {
  const out = readFileSync(join(root, 'src', f), 'utf8').replace(/<!--\s*@svg:([\w-]+)(\s+noid)?\s*-->/g, (_, n, noid) => svg(n, !!noid));
  const target = f.replace('.src.html', '.html');
  writeFileSync(join(root, target), out);
  console.log('gebaut:', target, `(${(out.length / 1024).toFixed(1)} KB)`);
}
