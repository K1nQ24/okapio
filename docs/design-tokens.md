# okapio – Design Tokens & Layout-Prinzipien

Besitzer: Agent DESIGN-SYSTEM · Quelle der Wahrheit: `/assets/css/tokens.css`

## 1. Konzept in fünf Sätzen

1. **Nacht und Knochen.** Ein tiefes Nachtblau (`--night-900`) trägt die dunklen Sektionen. Ein warmes Off-White (`--bone-100`) trägt die hellen. Der Wechsel erzeugt Rhythmus.
2. **Terrakotta = Risiko und Handlung.** `--clay-*` steht für Angriffspfade, Findings, Buttons. Es ist die Farbe des Okapi-Fells, kein Alarm-Rot.
3. **Teal = erkannt / geschützt.** `--sig-*` erscheint ausschließlich dort, wo etwas geschützt oder erkannt wurde (Schild, Häkchen, bestandener Prüfpunkt). Dadurch ist die Farbe *bedeutungstragend* und wird sparsam.
4. **Streifen als Tarnung.** Vertikale Streifen verdichten sich, wo etwas verborgen ist, und lösen sich per Maske auf, wo Klarheit entsteht.
5. **Keine Lila-Blau-Verläufe, kein Neon, kein Glassmorphism.** Verläufe nur als weiche Tonwertübergänge innerhalb der Palette. Einzige Ausnahme: der Header bekommt beim Scrollen eine leicht transparente Fläche mit Unschärfe, damit er sich vom Inhalt trennt.
6. **Serif trägt die Aussage, Mono die Technik.** Überschriften in Newsreader; der zweite Teil jeder Sektionsüberschrift steht kursiv in Terrakotta (`.h-accent`). Technische Labels, Nummern und Kicker in Geist Mono.

## 2. Palette

| Token | Wert | Rolle |
|---|---|---|
| `--night-950` | `#0a1117` | tiefster Grund (Footer, alternierende dunkle Flächen) |
| `--night-900` | `#0f1a23` | Standard dunkler Hintergrund; Text auf Hell |
| `--night-800` | `#15232e` | Karten auf Dunkel |
| `--night-700` | `#1d303d` | erhöhte Flächen auf Dunkel |
| `--night-600` | `#2b4252` | Linien auf Dunkel (dekorativ) |
| `--bone-50` | `#fbf8f3` | Karten auf Hell, Text auf Dunkel |
| `--bone-100` | `#f5f0e7` | Standard heller Hintergrund |
| `--bone-200` | `#ebe3d5` | Sand-Sektionen |
| `--bone-300` | `#d8cdb9` | Linien auf Hell (dekorativ) |
| `--ink-700/600` | `#3a4954` / `#4b5a65` | gedämpfter Text auf Hell |
| `--mist-300/400` | `#a9b7c0` / `#8fa0ab` | gedämpfter Text auf Dunkel |
| `--clay-300/500/600/700` | `#f0a07c` / `#d2603a` / `#b84a26` / `#9c3c1b` | Akzent, gestuft nach Einsatz |
| `--sig-300/500/700` | `#7fd6c8` / `#3fb3a3` / `#1b6f65` | Schutz-Akzent |
| `--slate-400/500` | `#6b8595` / `#6a7780` | Grafiklinien mit ≥ 3:1 |

Semantische Tokens (`--c-bg`, `--c-text`, `--c-accent` …) wechseln über `data-theme` am `<section>`: `light`, `sand`, `dark` und `night`. Illustrationen lesen **nur** `--ill-*`, dadurch passen sie sich der Sektion an.

- `dark` wird im hellen Modus (Standard) zu kühlem Dunst (`--haze-*`), im Dunkelmodus zu Dämmerung (`--dusk-*`).
- `night` bleibt in **beiden** Modi dunkel (gleiche Werte und Kontraste wie das dunkle Thema, siehe Tabelle unten). Eingesetzt für das Werkzeug-Band und den Footer: zwei bewusste dunkle Bänder geben der hellen Seite Rhythmus und einen klaren Abschluss.
- Abgeleitete Tönungen (`--c-accent-tint`, `--c-accent-glow`, `--c-grid`, `--c-glass`) entstehen per `color-mix()` je Thema neu. Sie sind rein dekorativ (Lichtkegel, Raster, Header-Fläche) und tragen keinen Text.

## 3. Kontrast (WCAG 2.x, berechnet mit `tools/contrast.mjs`)

Text: AA = 4,5:1 (normal), 3:1 (≥ 24 px oder ≥ 18,66 px fett). Grafik/UI: 3:1.

| Paar (Vordergrund auf Grund) | Verhältnis | Einsatz | Ergebnis |
|---|---|---|---|
| ink-900 auf bone-100 | 15,52 | Text hell | AAA |
| ink-900 auf bone-200 | 13,82 | Text Sand | AAA |
| ink-700 auf bone-100 | 8,18 | Muted hell | AAA |
| ink-700 auf bone-200 | 7,29 | Muted Sand | AAA |
| bone-50 auf night-900 | 16,63 | Text dunkel | AAA |
| mist-300 auf night-900 | 8,57 | Muted dunkel | AAA |
| mist-300 auf night-800 | 7,79 | Muted auf Karte dunkel | AAA |
| clay-700 auf bone-100 | 6,01 | Akzent-Text hell | AA |
| clay-700 auf bone-200 | 5,36 | Akzent-Text Sand | AA |
| clay-300 auf night-900 | 8,41 | Akzent-Text dunkel | AAA |
| clay-300 auf night-800 | 7,64 | Akzent-Text auf Karte dunkel | AAA |
| **bone-50 auf clay-600** | **4,90** | **Button-Text (Standard)** | AA |
| bone-50 auf clay-700 | 6,44 | Button hover | AA |
| clay-600 auf bone-100 | 4,57 | Grafik/Rahmen, Fokus hell | AA |
| clay-500 auf night-900 | 4,59 | Grafik dunkel | AA |
| clay-600 auf night-900 | 3,39 | Button-Fläche gegen Grund | UI ≥ 3:1 |
| sig-700 auf bone-100 | 5,27 | Teal-Text/Grafik hell | AA |
| sig-700 auf bone-200 | 4,70 | Teal auf Sand | AA |
| sig-300 auf night-900 | 10,36 | Teal-Text/Grafik dunkel | AAA |
| slate-500 auf bone-100 | 4,05 | Grafiklinie hell | UI |
| slate-500 auf bone-200 | 3,61 | Grafiklinie Sand | UI |
| slate-400 auf night-900 | 4,54 | Grafiklinie dunkel | UI |
| slate-400 auf night-800 | 4,13 | Grafiklinie auf Karte dunkel | UI |

**Bewusst verworfen:** `sig-500` auf hellem Grund (2,26 : 1, fällt durch), `clay-500` als Text auf Hell (3,38 : 1), `bone-50` auf `clay-500` (3,62 : 1). Deshalb gibt es in hellen Sektionen die dunkleren Varianten (`sig-700`, `clay-600/700`).
Linien `--c-line` (`bone-300`, `night-600`) sind rein dekorativ (Trennlinien, Kartenränder). Sie tragen keine Information.

## 4. Typografie

- **Display: Newsreader** (Production Type, OFL). Ruhige, lesefreundliche Serif mit redaktionellem Charakter: wirkt vertrauenswürdig und beratend statt laut. Die optische Größe ist mit fontTools auf 36 fixiert (ein Schnitt für H1 bis H4), Gewichtsachse 400–700. H1/H2 in 500, H3/H4 in 600. Kursiv (400–600) nur für Akzentwörter (`.h-accent`) und große Zahlen.
- **Text: Hanken Grotesk** (OFL, variabel 400–700). Neutrale, offene Grotesk mit guter Lesbarkeit bei 17 px; Bedienelemente in 500/600.
- **Technik: Geist Mono** (OFL, variabel 400–600). Kicker, Nummern (`01 /07`), Tags, Schweregrade, Werte in den Werkzeug-Vorschauen. Gibt dem Prüf- und Audit-Kontext Glaubwürdigkeit.
- **Self-hosted:** `/assets/fonts/*.woff2`, Latin-Subset (ä ö ü ß und Satzzeichen). Newsreader 41 KB, Newsreader Kursiv 44 KB, Hanken Grotesk 23 KB, Geist Mono 16 KB. `font-display: swap`. Preload nur Newsreader (normal) und Hanken Grotesk (zusammen 64 KB, so viel wie vorher). Fallbacks mit Metrik-Anpassung (`size-adjust`, `ascent-override` …) gegen Layoutsprung.
- **Skala (fluid, clamp):** `--fs-h1` 2,8 → 5,9 rem (im Hero über Container-Query-Einheiten an die Spaltenbreite gekoppelt, damit die drei Zeilen immer passen) · `--fs-h2` 2,35 → 4,35 rem · `--fs-h3` 1,45 → 2 rem · `--fs-num` 3,25 → 6,5 rem · `--fs-lead` 1,125 → 1,375 rem · `--fs-base` 1,0625 rem (17 px) · `--fs-sm` 0,875 rem · `--fs-xs`/`--fs-kicker` 0,75 rem.
- **Zeilenhöhen:** Display 1,02 · Überschriften 1,12 · Text 1,65. Zeilenlänge max. 62 ch.
- **Tracking:** Display −0,028 em, Überschriften −0,012 em, Kicker +0,14 em (Versalien nur bei Kickern, in Geist Mono).
- **Logo:** Die Wortmarke bleibt aus Bricolage Grotesque Bold gezeichnet (Pfade). Die Schriftdatei liegt nur noch für `tools/gen_svg_marks.py` in `tools/fonts/` und wird von der Website nicht geladen.

## 5. Abstand, Radius, Schatten, Bewegung

- **Spacing** (4-px-Basis): `--space-1` 0,25 rem … `--space-10` 8 rem. Sektionen: `--section-y` (fluid 4,5–9 rem).
- **Radien:** `--r-sm` 0,625 · `--r-md` 1 · `--r-lg` 1,75 · `--r-xl` 2,5 rem · `--r-pill`. Karten `--r-lg`, Buttons `--r-pill`, Inputs `--r-sm`.
- **Schatten:** `--shadow-1` (Ruhe), `--shadow-2` (Hover/Anheben). Weich, warm getönt, nie farbig.
- **Easing:** `--ease-expo` (Reveals, lange weiche Auslaufkurve), `--ease-out` (Zustände, Hover), `--ease-in-out` (Loops, Linien), `--ease-snap` (Flächen und Masken: Button-Wischer, Tarnstreifen), `--ease-pop` (kleine Einrast-Effekte, sparsam).
- **Dauern:** fast 150 ms · base 320 ms · slow 700 ms · reveal 1100 ms · Illustrationen 0,7–3,4 s · loop 5200 ms · Staffel 90 ms.
- **Bewegungskatalog (Zweck steht jeweils in `motion.css`):** Hero baut sich zeilenweise auf; über „sichtbar" fahren Tarnstreifen weg (Kernmetapher) · Reveal mit Staffel, Kicker-Linie zeichnet sich · Header wird kompakter, Lesefortschritt als Linie, Scrollspy markiert die aktuelle Sektion · Lichtkegel folgt dem Zeiger auf Karten · Hero-Graph folgt dem Zeiger um wenige Pixel · Hero-Grafik tritt beim Weiterscrollen zurück, Regionskarte gleitet (nur mit Scroll-Timelines) · Fakten-Strichliste wächst · Timeline füllt sich, Schrittanzeige zählt mit · Scan-Linie im Attack Surface Monitor (mit Pause) · FAQ klappt weich auf · Dunkelmodus breitet sich kreisförmig vom Schalter aus (View Transitions).
- **Reduzierte Bewegung / ohne JS:** alle Endzustände sofort sichtbar, keine Loops, keine Zeiger-Effekte. Lesefortschritt, Scrollspy und Schrittanzeige bleiben (sie zeigen Zustand, sie animieren nicht).
- **Breakpoints** (in Media Queries als em, da `var()` dort nicht geht): **40em** (640 px, Tablet klein), **64em** (1024 px, Desktop), **80em** (1280 px, Breit). Mobile-first.
- **Container:** `--container` 78 rem, `--gutter` fluid 1,25–3 rem.

## 6. Streifenmuster (Okapi-Motiv)

`--stripes` ist eine wiederholbare 72-px-Kachel aus sechs Streifen mit den Stärken **2 · 5 · 1 · 8 · 2 · 3 px** in unregelmäßigen Abständen. `--stripes-dense` (36 px) ist die engere Variante.

```css
.beispiel {
  background-image: var(--stripes);
  background-size: var(--stripe-tile) 100%;
  opacity: var(--stripe-opacity);              /* 0,09: Textur, nie Konkurrenz */
  mask-image: var(--stripe-fade-down);         /* Auflösen = Klarheit */
}
```

Regeln: nur vertikal · als Textur mit niedriger Deckkraft · immer mit Ausblendung zum Inhalt hin · nie hinter Fließtext ohne Maske · Farbe folgt dem Thema (`--c-stripe`).

## 7. Layout-Prinzipien pro Sektion

Raster: 12 Spalten ab 64 em, 4 ab 40 em, 1 darunter. Sektionen wechseln zwischen `light`, `sand` und `dark`.

| # | Sektion | Thema | Raster & Rhythmus | Rasterbruch |
|---|---|---|---|---|
| 1 | Header | dunkel | Sticky, 1 Zeile. Logo links, Nav mittig (Scrollspy), CTA rechts, Lesefortschritt an der Unterkante. Mobil: Menü-Button mit Icon | – |
| 2 | Hero | **dunkel** | 12 Sp.: Text 6 Sp. linksbündig, Illustration 6 Sp. Illustration ragt rechts aus dem Container. Streifen-Textur läuft nach unten aus | Illustration über Containerrand. H1 linksbündig statt zentriert |
| 3 | Vertrauensleiste | hell | Schmale Zeile, Standards als Textmarken mit dünnen Trennlinien. Streifen-Trenner oben | – |
| 4 | Leistungen | hell | Geteilter Kopf (H2 links, Lead rechts). **Bento** aus 12 Sp.: 7+5 / 5+7 / 7+5 / 12. Jede Karte hat eigene Fläche und Anordnung von Text und Illustration | Kartengrößen und Ausrichtung bewusst ungleich. Nummerierung `01 /07` in Mono als roter Faden |
| 5 | Warum okapio | **dunkel** | 5 Sp. Überschrift (sticky) / 7 Sp. drei Punkte mit kursiven Nummern. Drei Fakten-Karten mit Strichliste | Überschrift sticky, Liste scrollt |
| 6 | Vorgehen | hell | 5 Sp. Kopf mit Schrittanzeige (sticky) / 7 Sp. Timeline aus Karten, Linie links füllt sich per Scroll | Kopf bleibt stehen, Schritte scrollen |
| 6b | Werkzeuge | **night** (immer dunkel) | Geteilter Kopf, zwei Karten mit Fenster-Vorschau, feines Raster im Hintergrund | rechte Karte tiefer versetzt |
| 7 | Branchenfokus | sand | Drei Spalten mit unterschiedlicher Höhe (Versatz nach unten), je ein Icon | Versatz statt gleicher Höhe |
| 8 | Region | **dunkel** | 6 Sp. Text / 6 Sp. Kartengrafik. Karte bricht rechts aus dem Raster | Grafik randlos |
| 9 | Team | hell | 5 Sp. Fotofläche 4:5 / 7 Sp. Kicker, H2, Person mit Akzentlinie, direkte Kontaktwege | – |
| 10 | FAQ | sand | Schmale Spalte (`--container-narrow`), Überschrift links davor ab 64 em | – |
| 11 | Kontakt | **dunkel** | 5 Sp. Text + Direktkontakt als Karten (sticky) / 7 Sp. Formular auf heller Karte, Name und Firma nebeneinander. Streifen lösen sich zum Formular hin auf | Heller Block in dunkler Sektion |
| 12 | Footer | **night** (`night-950`) | Marke + 3 Spalten, Streifenkante oben, große angeschnittene Wortmarke als Abschluss | Wortmarke randlos |

**Rhythmus:** dunkel (Header/Hero) → hell (Vertrauen, Leistungen) → dunkel (Warum) → hell (Vorgehen) → **night** (Werkzeuge) → sand (Branchen) → dunkel (Region) → hell (Team) → sand (FAQ) → dunkel (Kontakt) → **night** (Footer).

## 8. Illustrations-Tokens

Alle SVGs verwenden ausschließlich `currentColor` oder `var(--ill-…)`:
`--ill-line`, `--ill-line-soft`, `--ill-ink`, `--ill-surface`, `--ill-surface-2`, `--ill-risk`, `--ill-safe`, `--ill-muted`.
Einheitlicher Stil: Strichstärke 2 (bei ViewBox-Breite 480), `stroke-linecap: round`, `stroke-linejoin: round`, Eckenradius 8, Knoten-Radius 14/10.
