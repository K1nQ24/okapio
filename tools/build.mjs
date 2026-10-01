#!/usr/bin/env node
// Build-Skript (Node ≥ 18, keine Abhängigkeiten). Aufruf: node tools/build.mjs
//  - ersetzt <!-- @svg:name [noid] --> in src/*.src.html durch den Inhalt von assets/svg/name.svg
//  - ersetzt {{SITE_URL}}, {{COOKIEBOT_ID}}, {{CSP}} (Werte aus site.config.json)
//  - <!-- @if cookiebot -->…<!-- @else -->…<!-- @endif -->: Inhalt nur, wenn eine Cookiebot-ID gesetzt ist
//  - schreibt <name>.html, robots.txt und sitemap.xml ins Projektverzeichnis
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const cfg = JSON.parse(readFileSync(join(root, 'site.config.json'), 'utf8'));
const siteUrl = String(cfg.siteUrl || '').replace(/\/+$/, '');
const cbId = String(cfg.cookiebotId || '').trim();
const cookiebot = cbId !== '';
if (!/^https:\/\/[a-z0-9.-]+$/i.test(siteUrl)) throw new Error('site.config.json: siteUrl muss https://domain sein');
if (cookiebot && !/^[0-9a-f-]{36}$/i.test(cbId)) throw new Error('site.config.json: cookiebotId sieht nicht wie eine Cookiebot-ID (UUID) aus');

// Content-Security-Policy (als Meta-Tag). Mit Cookiebot kommen dessen Hosts dazu.
const CB_HOSTS = 'https://consent.cookiebot.com https://consentcdn.cookiebot.com';
const csp = [
  "default-src 'none'",
  `script-src 'self'${cookiebot ? ' ' + CB_HOSTS : ''}`,
  `style-src 'self'${cookiebot ? " 'unsafe-inline'" : ''}`,
  `img-src 'self'${cookiebot ? ' https://imgsct.cookiebot.com data:' : ''}`,
  "font-src 'self'",
  `connect-src 'self'${cookiebot ? ' ' + CB_HOSTS : ''}`,
  "form-action 'self'",
  "base-uri 'none'",
  "object-src 'none'",
  "manifest-src 'self'",
  'upgrade-insecure-requests',
].join('; ');

const svg = (name, noid) => {
  let s = readFileSync(join(root, 'assets/svg', `${name}.svg`), 'utf8').trim();
  s = s.replace(/<\?xml[^>]*\?>\s*/, '').replace(/ xmlns="http:\/\/www\.w3\.org\/2000\/svg"/, '');
  if (noid) s = s.replace(/ id="[^"]*"/g, '').replace(/ aria-labelledby="[^"]*"/, ' aria-label="okapio"').replace(/<title[^>]*>[^<]*<\/title>\s*/, '');
  return s.replace(/<!--[\s\S]*?-->\s*/g, '');
};

for (const f of readdirSync(join(root, 'src')).filter(f => f.endsWith('.src.html'))) {
  const out = readFileSync(join(root, 'src', f), 'utf8')
    .replace(/<!--\s*@if cookiebot\s*-->([\s\S]*?)(?:<!--\s*@else\s*-->([\s\S]*?))?<!--\s*@endif\s*-->/g, (_, a, b) => (cookiebot ? a : (b || '')))
    .replace(/<!--\s*@svg:([\w-]+)(\s+noid)?\s*-->/g, (_, n, noid) => svg(n, !!noid))
    .replaceAll('{{SITE_URL}}', siteUrl)
    .replaceAll('{{COOKIEBOT_ID}}', cbId)
    .replaceAll('{{CSP}}', csp);
  const target = f.replace('.src.html', '.html');
  writeFileSync(join(root, target), out);
  console.log('gebaut:', target, `(${(out.length / 1024).toFixed(1)} KB)`);
}

const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(root, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /assets/php/\n\nSitemap: ${siteUrl}/sitemap.xml\n`);
writeFileSync(join(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${siteUrl}/</loc>\n    <lastmod>${today}</lastmod>\n  </url>\n</urlset>\n`);
console.log('gebaut: robots.txt, sitemap.xml', cookiebot ? '(Cookiebot aktiv)' : '(Cookiebot nicht aktiv: keine ID in site.config.json)');
