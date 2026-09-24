// Erzeugt einen Kontaktbogen aller SVGs (hell + dunkel) für die visuelle Prüfung. Ausgabe: stdout (HTML)
import { readFileSync, readdirSync } from 'node:fs';
const dir = new URL('../assets/svg/', import.meta.url);
const files = readdirSync(dir).filter(f => f.endsWith('.svg')).sort();
const cell = (f, theme) => `<figure data-theme="${theme}"><figcaption>${f}</figcaption>${readFileSync(new URL(f, dir), 'utf8').replace(/<svg /, '<svg class="pv" ')}</figure>`;
const only = process.argv[2];
process.stdout.write(`<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="../../assets/css/tokens.css">
<style>body{margin:0;font-family:var(--font-text);background:#888;display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:12px}
figure{margin:0;padding:12px;background:var(--c-bg);color:var(--c-text);border-radius:12px}figcaption{font-size:11px;opacity:.6;margin-bottom:6px}
svg.pv{width:100%;height:auto;max-height:420px;color:var(--c-text)}svg#ill-divider,svg#ill-hero-stripes{max-height:120px}
:root{--ill-line:var(--slate-500)}</style>
${files.filter(f=>!only||f.includes(only)).map(f => cell(f, 'light') + cell(f, 'dark')).join('\n')}`);
