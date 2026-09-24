#!/usr/bin/env python3
"""Erzeugt Logo-Wortmarke, Symbol, Hero-Streifen und Trenner (Besitzer: ILLUSTRATION).
Benötigt: fonttools, brotli. Aufruf: python3 tools/gen_svg_marks.py
Alle Farben über currentColor bzw. var(--ill-*)."""
import math, os
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.boundsPen import BoundsPen

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
OUT = os.path.join(ROOT, 'assets', 'svg')
fmt = lambda v: ('%.1f' % v).rstrip('0').rstrip('.')

# ---------- Wortmarke ----------
f = TTFont(os.path.join(ROOT, 'assets/fonts/bricolage-grotesque-latin-wght-normal.woff2'))
inst = instancer.instantiateVariableFont(f, {'wght': 700})
gs, cmap, hm = inst.getGlyphSet(), inst.getBestCmap(), inst['hmtx']
KERN = {'ok': -10, 'ka': -6, 'ap': -4, 'pi': -8, 'io': -6}  # dezente optische Korrektur (Font-Einheiten)
x, body, dot = 0, [], None
word = 'okapio'
for idx, ch in enumerate(word):
    g = cmap[ord(ch)]
    if idx: x += KERN.get(word[idx-1]+ch, 0)
    if ch == 'i' and idx == 4:
        # „i" ist ein Komposit (dotlessi + Punkt): Komponenten einzeln zeichnen, Punkt separat einfärben
        rec = RecordingPen(); gs[g].draw(rec)
        parts = []
        for op, args in rec.value:
            if op != 'addComponent': continue
            name, tr = args
            pen = SVGPathPen(gs, ntos=fmt)
            gs[name].draw(TransformPen(TransformPen(pen, (1, 0, 0, -1, x, 0)), tr))
            bp = BoundsPen(gs); gs[name].draw(TransformPen(bp, tr))
            parts.append((bp.bounds[3], pen.getCommands()))
        parts.sort(reverse=True)            # höchster Teil = Punkt
        dot = parts[0][1]
        body.append(parts[1][1])
    else:
        pen = SVGPathPen(gs, ntos=fmt); gs[g].draw(TransformPen(pen, (1, 0, 0, -1, x, 0)))
        body.append(pen.getCommands())
    x += hm[g][0]
total = x
top, bottom = -745, 285   # Oberlänge (i-Punkt) bis Unterlänge (p)
pad = 20
vb = f'{-pad} {top-pad} {total+2*pad-10} {bottom-top+2*pad}'
w, h = vb.split()[2:]
wordmark = f'''<svg xmlns="http://www.w3.org/2000/svg" id="ill-logo" viewBox="{vb}" role="img" aria-labelledby="ill-logo-title" fill="currentColor">
  <title id="ill-logo-title">okapio</title>
  <g id="wm-wordmark"><path d="{' '.join(body)}"/></g>
  <path id="wm-dot" fill="var(--ill-risk)" d="{dot}"/>
</svg>
'''
open(os.path.join(OUT, 'logo-wordmark.svg'), 'w').write(wordmark)

# ---------- Symbol: Kreis, untere Hälfte in Streifen aufgelöst ----------
R, cx, cy = 15.4, 24, 24        # Innenradius (Ring: Radius 18.5, Strich 3.6) minus Abstand
widths = [1.2, 2.6, 1.0, 3.6, 1.2, 2.2, 1.0, 2.8, 1.2]   # unterschiedliche Stärken
gaps   = [1.8, 1.4, 1.6, 1.2, 1.5, 1.3, 1.0, 1.4]
total = sum(widths) + sum(gaps)
xc, bars = cx - total / 2, []
for i, wd in enumerate(widths):
    mid = xc + wd / 2; dx = mid - cx
    yb = cy + math.sqrt(max(R*R - dx*dx, 0))
    bars.append(f'M{fmt(xc)} 25h{fmt(wd)}v{fmt(yb-25)}h-{fmt(wd)}z')
    xc += wd + (gaps[i] if i < len(gaps) else 0)
symbol = f'''<svg xmlns="http://www.w3.org/2000/svg" id="ill-logo-symbol" viewBox="0 0 48 48" aria-hidden="true" focusable="false" fill="currentColor">
  <path id="ls-ring" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" d="M5.5 24a18.5 18.5 0 1 1 37 0a18.5 18.5 0 1 1-37 0z"/>
  <path id="ls-stripes" d="{''.join(bars)}"/>
  <circle id="ls-dot" cx="24" cy="16" r="2.4" fill="var(--ill-risk)"/>
</svg>
'''
open(os.path.join(OUT, 'logo-symbol.svg'), 'w').write(symbol)

# ---------- Streifenfolge (wie --stripes: 2·5·1·8·2·3) ----------
CYC = [(2, 8), (5, 5), (1, 13), (8, 5), (2, 11), (3, 9)]   # (Stärke, Lücke danach)

def bars_falloff(x0, x1, y0, hmax, dir_=1, power=1.6, minh=6, seed=0):
    """Streifen, deren Länge von hmax auf ~0 abnimmt (Auflösen = Klarheit)."""
    out, xx, i = [], x0, seed
    span = x1 - x0
    while xx < x1:
        wd, gap = CYC[i % len(CYC)]
        t = (xx - x0) / span
        hh = hmax * (1 - t) ** power
        if hh >= minh:
            out.append((xx, wd, hh))
        xx += wd + gap; i += 1
    return out

# Hero-Backdrop 720×640: Streifen wachsen von unten, links dicht, rechts aufgelöst
hb = bars_falloff(0, 720, 640, 600, power=1.25)
rects = []
for n, (bx, wd, hh) in enumerate(hb, 1):
    rects.append(f'<rect id="hs-{n:02d}" x="{fmt(bx)}" y="{fmt(640-hh)}" width="{wd}" height="{fmt(hh)}"/>')
hero_stripes = f'''<svg xmlns="http://www.w3.org/2000/svg" id="ill-hero-stripes" viewBox="0 0 720 640" preserveAspectRatio="xMinYMax slice" aria-hidden="true" focusable="false" fill="currentColor">
  <g id="hs-stripes" data-stagger="grow">
    {chr(10).join('    '+r for r in rects).strip()}
  </g>
</svg>
'''
open(os.path.join(OUT, 'hero-stripes.svg'), 'w').write(hero_stripes)

# ---------- Trenner 1440×56: hängt vom oberen Rand, löst sich nach rechts auf ----------
db = bars_falloff(0, 1440, 0, 56, power=1.05, minh=3)
drects = [f'<rect x="{fmt(bx)}" y="0" width="{wd}" height="{fmt(hh)}"/>' for bx, wd, hh in db]
divider = f'''<svg xmlns="http://www.w3.org/2000/svg" id="ill-divider" viewBox="0 0 1440 56" preserveAspectRatio="xMinYMin slice" aria-hidden="true" focusable="false" fill="currentColor">
  <g id="dv-stripes" data-stagger="grow">{''.join(drects)}</g>
</svg>
'''
open(os.path.join(OUT, 'divider-stripes.svg'), 'w').write(divider)
print('ok', len(hb), len(db), 'wordmark viewBox', vb)
