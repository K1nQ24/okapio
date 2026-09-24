# okapio – Design Tokens & Layout-Prinzipien

Besitzer: Agent DESIGN-SYSTEM · Quelle der Wahrheit: `/assets/css/tokens.css`

## 1. Konzept in sechs Sätzen

1. **Tiefblau und Frost.** Ein tiefes, kühles Blau (`--night-900`) trägt Header, Hero, Werkzeuge, Kontakt und Footer. Ein kühles Off-White (`--frost-100`) trägt die Inhaltsbereiche. Gemischter Grundton: dunkle Bänder geben Rhythmus, gelesen wird auf Hell.
2. **Terrakotta = Risiko und Handlung.** `--clay-*` steht für Angriffspfade, Findings, Buttons. Es ist die Farbe des Okapi-Fells, kein Alarm-Rot, und auf dem kühlen Grund der einzige warme Ton.
3. **Teal = erkannt / geschützt.** `--sig-*` erscheint ausschließlich dort, wo etwas geschützt oder erkannt wurde (Schild, Häkchen, bestandener Prüfpunkt). Dadurch ist die Farbe *bedeutungstragend* und wird sparsam.
4. **Streifen als Tarnung.** Vertikale Streifen verdichten sich, wo etwas verborgen ist, und lösen sich per Maske auf, wo Klarheit entsteht.
5. **Keine Lila-Blau-Verläufe, kein Neon, kein Glassmorphism.** Verläufe nur als weiche Tonwertübergänge innerhalb der Palette. Einzige Ausnahme: der Header bekommt beim Scrollen eine fast deckende Fläche mit leichter Unschärfe.
6. **Technische Typografie.** Überschriften in Space Grotesk, Text in Inter, Labels und Nummern in JetBrains Mono. Der zweite Teil jeder Sektionsüberschrift steht in der gedämpften Textfarbe (`.h-accent`); nur „sichtbar" im Hero ist Terrakotta.

## 2. Palette

| Token | Wert | Rolle |
|---|---|---|
| `--night-950` | `#060e1a` | tiefster Grund (Footer, „night" im Dunkelmodus) |
| `--night-900` | `#0a1628` | dunkler Hintergrund (Header, Hero, Werkzeuge, Kontakt); Text auf Hell |
| `--night-800` | `#11213a` | Karten auf Dunkel |
| `--night-700` | `#1a2d4a` | erhöhte Flächen auf Dunkel |
| `--night-600` | `#2a4062` | Linien auf Dunkel (dekorativ) |
| `--frost-50` | `#fcfdfe` | Karten auf Hell, Text auf Dunkel |
| `--frost-100` | `#f3f5f8` | Standard heller Hintergrund |
| `--frost-200` | `#e7ebf1` | zweite helle Fläche (Thema „sand") |
| `--frost-300` | `#d3dae4` | Linien auf Hell (dekorativ) |
| `--haze-50/100` | `#f7f9fc` / `#e8eef6` | kühle Tönung („dark" im hellen Modus) |
| `--dusk-950 … 700` | `#07101e` … `#1b3050` | Flächen im Dunkelmodus |
| `--ink-700/600` | `#3b4a5e` / `#4b5b70` | gedämpfter Text auf Hell |
| `--mist-300/400` | `#a6b4c7` / `#8a9bb2` | gedämpfter Text / starke Linien auf Dunkel |
| `--clay-300/500/600/700` | `#f0a07c` / `#d2603a` / `#b84a26` / `#9c3c1b` | Akzent, gestuft nach Einsatz |
| `--sig-300/500/700` | `#7fd6c8` / `#3fb3a3` / `#1b6f65` | Schutz-Akzent |
| `--slate-400/500` | `#6f86a0` / `#66758a` | Grafiklinien mit ≥ 3:1 |

Semantische Tokens (`--c-bg`, `--c-text`, `--c-accent` …) wechseln über `data-theme` am `<section>`: `light`, `sand`, `dark` und `night`. Illustrationen lesen **nur** `--ill-*`, dadurch passen sie sich der Sektion an.

- `dark` wird im hellen Modus (Standard) zu kühlem Dunst (`--haze-*`), im Dunkelmodus zu Dämmerung (`--dusk-*`).
- `night` bleibt in **beiden** Modi dunkel (gleiche Werte und Kontraste wie das dunkle Thema, siehe Tabelle unten). Eingesetzt für das Werkzeug-Band und den Footer: zwei bewusste dunkle Bänder geben der hellen Seite Rhythmus und einen klaren Abschluss.
- Abgeleitete Tönungen (`--c-accent-tint`, `--c-accent-glow`, `--c-grid`, `--c-glass`) entstehen per `color-mix()` je Thema neu. Sie sind rein dekorativ (Lichtkegel, Raster, Header-Fläche) und tragen keinen Text.

## 3. Kontrast (WCAG 2.x, berechnet mit `tools/contrast.mjs`)

Text: AA = 4,5:1 (normal), 3:1 (≥ 24 px oder ≥ 18,66 px fett). Grafik/UI: 3:1. Ausgabe von `node tools/contrast.mjs`:

| Paar | Farben | Verhältnis | Ergebnis |
|---|---|---|---|
| Text auf Hell | `#0a1628` auf `#f3f5f8` | 16,60 | AAA |
| Text auf Sand | `#0a1628` auf `#e7ebf1` | 15,15 | AAA |
| Text gedämpft auf Hell | `#3b4a5e` auf `#f3f5f8` | 8,26 | AAA |
| Text gedämpft2 auf Hell | `#4b5b70` auf `#f3f5f8` | 6,35 | AA |
| Text gedämpft auf Sand | `#3b4a5e` auf `#e7ebf1` | 7,54 | AAA |
| Text auf Dunkel | `#fcfdfe` auf `#0a1628` | 17,80 | AAA |
| Text gedämpft auf Dunkel | `#a6b4c7` auf `#0a1628` | 8,61 | AAA |
| gedämpft auf Dunkel-Fläche | `#a6b4c7` auf `#11213a` | 7,66 | AAA |
| mist400 auf night900 | `#8a9bb2` auf `#0a1628` | 6,40 | AA |
| Akzent-Text auf Hell | `#9c3c1b` auf `#f3f5f8` | 6,25 | AA |
| clay600 auf Hell | `#b84a26` auf `#f3f5f8` | 4,75 | AA |
| clay600 auf Sand | `#b84a26` auf `#e7ebf1` | 4,34 | AA-large/UI |
| clay700 auf Sand | `#9c3c1b` auf `#e7ebf1` | 5,71 | AA |
| clay500 auf Hell | `#d2603a` auf `#f3f5f8` | 3,51 | AA-large/UI |
| Akzent-Text auf Dunkel | `#f0a07c` auf `#0a1628` | 8,65 | AAA |
| clay500 auf Dunkel | `#d2603a` auf `#0a1628` | 4,73 | AA |
| clay500 auf night800 | `#d2603a` auf `#11213a` | 4,20 | AA-large/UI |
| Button-Text night900 auf clay500 | `#0a1628` auf `#d2603a` | 4,73 | AA |
| frost50 auf clay500 | `#fcfdfe` auf `#d2603a` | 3,77 | AA-large/UI |
| frost50 auf clay600 | `#fcfdfe` auf `#b84a26` | 5,10 | AA |
| frost50 auf clay700 | `#fcfdfe` auf `#9c3c1b` | 6,70 | AA |
| Teal-Text auf Hell | `#1b6f65` auf `#f3f5f8` | 5,48 | AA |
| Teal-Text auf Dunkel | `#7fd6c8` auf `#0a1628` | 10,67 | AAA |
| sig500 auf Dunkel (Grafik) | `#3fb3a3` auf `#0a1628` | 7,07 | AAA |
| Grafik-Terrakotta auf Hell (3:1) | `#d2603a` auf `#f3f5f8` | 3,51 | AA-large/UI |
| Grafik-Teal auf Hell (3:1) | `#3fb3a3` auf `#f3f5f8` | 2,35 | FAIL |
| sig700 auf frost50 | `#1b6f65` auf `#fcfdfe` | 5,88 | AA |
| Linie auf Dunkel (dekorativ) | `#2a4062` auf `#0a1628` | 1,73 | FAIL |
| Linie auf Hell (dekorativ) | `#d3dae4` auf `#f3f5f8` | 1,29 | FAIL |
| ink600 auf frost50 | `#4b5b70` auf `#fcfdfe` | 6,81 | AA |
| ink900 auf frost50 | `#0a1628` auf `#fcfdfe` | 17,80 | AAA |
| clay700 auf frost50 | `#9c3c1b` auf `#fcfdfe` | 6,70 | AA |
| ink900 auf clay300 | `#0a1628` auf `#f0a07c` | 8,65 | AAA |
| Text gedämpft auf Dunst | `#3b4a5e` auf `#e8eef6` | 7,73 | AAA |
| Akzent-Text auf Dunst | `#9c3c1b` auf `#e8eef6` | 5,85 | AA |
| Grafiklinie auf Dunst | `#66758a` auf `#e8eef6` | 4,02 | AA-large/UI |
| Text gedämpft auf night-950 | `#a6b4c7` auf `#060e1a` | 9,19 | AAA |
| Text gedämpft auf dusk-700 | `#a6b4c7` auf `#1b3050` | 6,29 | AA |
| Akzent-Text auf dusk-800 | `#f0a07c` auf `#13243c` | 7,45 | AAA |
| Linie stark auf dusk-700 | `#8a9bb2` auf `#1b3050` | 4,68 | AA |
| Grafiklinie auf night-800 | `#6f86a0` auf `#11213a` | 4,29 | AA-large/UI |
| Grafiklinie auf frost-200 | `#66758a` auf `#e7ebf1` | 3,92 | AA-large/UI |
| frost50 auf night700 | `#fcfdfe` auf `#1a2d4a` | 13,58 | AAA |
| mist300 auf night700 | `#a6b4c7` auf `#1a2d4a` | 6,57 | AA |

**Bewusst verworfen bzw. nur dekorativ:** `sig-500` auf hellem Grund (fällt durch, deshalb `sig-700` in hellen Sektionen), `clay-500` als Text auf Hell, `frost-50` auf `clay-500`. Linien `--c-line` (`frost-300`, `night-600`) sind rein dekorativ (Trennlinien, Kartenränder) und tragen keine Information.

## 4. Typografie

- **Display: Space Grotesk** (Florian Karsten, OFL, variabel 400–700). Technische Grotesk mit eigenem Charakter (abgeleitet aus Space Mono), gut lesbar auch groß. H1–H4 in 600, enges Tracking.
- **Text: Inter** (OFL, variabel 400–700). Für Bildschirme gebaut, sehr gute Lesbarkeit bei 17 px, klare Ziffern.
- **Technik: JetBrains Mono** (OFL, variabel 400–600). Kicker, Nummern (`01 /07`), Tags, Schweregrade, Werte in den Werkzeug-Vorschauen.
- **Self-hosted, DSGVO:** `/assets/fonts/*.woff2`, Latin-Subset (ä ö ü ß und Satzzeichen), mit fontTools auf die genutzten Gewichte beschnitten: Space Grotesk 22 KB, Inter 36 KB, JetBrains Mono 30 KB. Die Dateien stammen aus den Open-Source-Paketen der Projekte (OFL, Lizenzen liegen bei). Die Seite lädt nichts von Google oder anderen Dritten; die Datenschutzerklärung („alle Schriften von der eigenen Domain") bleibt korrekt. `font-display: swap`. Preload: Space Grotesk und Inter (58 KB). Fallbacks mit Metrik-Anpassung (`size-adjust`, `ascent-override` …) gegen Layoutsprung.
- **Skala (fluid, clamp):** `--fs-h1` 2,5 → 5,1 rem (im Hero über Container-Query-Einheiten an die Spaltenbreite gekoppelt, damit die drei Zeilen immer passen) · `--fs-h2` 2,05 → 3,75 rem · `--fs-h3` 1,3 → 1,75 rem · `--fs-num` 3 → 5,75 rem · `--fs-lead` 1,125 → 1,375 rem · `--fs-base` 1,0625 rem (17 px) · `--fs-sm` 0,875 rem · `--fs-xs`/`--fs-kicker` 0,75 rem.
- **Zeilenhöhen:** Display 1,04 · Überschriften 1,15 · Text 1,65. Zeilenlänge max. 62 ch.
- **Tracking:** Display −0,035 em, Überschriften −0,018 em, Kicker +0,1 em (Versalien nur bei Kickern, in JetBrains Mono).
- **Logo:** Die Wortmarke bleibt aus Bricolage Grotesque Bold gezeichnet (Pfade). Die Schriftdatei liegt nur für `tools/gen_svg_marks.py` in `tools/fonts/` und wird von der Website nicht geladen.

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

Raster: 12 Spalten ab 64 em, 4 ab 40 em, 1 darunter. Sektionen wechseln zwischen `light`, `sand`, `dark` und `night`.

| # | Sektion | Thema | Raster & Rhythmus | Rasterbruch |
|---|---|---|---|---|
| 1 | Header | **night** | Sticky, 1 Zeile. Logo links, Nav mittig (Scrollspy), CTA rechts, Lesefortschritt an der Unterkante. Mobil: Menü-Button mit Icon | – |
| 2 | Hero | **night** | 12 Sp.: Text 6 Sp. linksbündig, Illustration 6 Sp. Illustration ragt rechts aus dem Container. Streifen-Textur läuft nach unten aus | Illustration über Containerrand. H1 linksbündig statt zentriert |
| 3 | Vertrauensleiste | hell | Schmale Zeile, Standards als Textmarken mit dünnen Trennlinien. Streifen-Trenner oben | – |
| 4 | Leistungen | hell | Geteilter Kopf (H2 links, Lead rechts). **Bento** aus 12 Sp.: 7+5 / 5+7 / 7+5 / 12. Jede Karte hat eigene Fläche und Anordnung von Text und Illustration | Kartengrößen und Ausrichtung bewusst ungleich. Nummerierung `01 /07` in Mono als roter Faden |
| 5 | Warum okapio | **dunkel** | 5 Sp. Überschrift (sticky) / 7 Sp. drei Punkte mit kursiven Nummern. Drei Fakten-Karten mit Strichliste | Überschrift sticky, Liste scrollt |
| 6 | Vorgehen | hell | 5 Sp. Kopf mit Schrittanzeige (sticky) / 7 Sp. Timeline aus Karten, Linie links füllt sich per Scroll | Kopf bleibt stehen, Schritte scrollen |
| 6b | Werkzeuge | **night** (immer dunkel) | Geteilter Kopf, zwei Karten mit Fenster-Vorschau, feines Raster im Hintergrund | rechte Karte tiefer versetzt |
| 7 | Branchenfokus | sand | Drei Spalten mit unterschiedlicher Höhe (Versatz nach unten), je ein Icon | Versatz statt gleicher Höhe |
| 8 | Region | **dunkel** | 6 Sp. Text / 6 Sp. Kartengrafik. Karte bricht rechts aus dem Raster | Grafik randlos |
| 9 | Team | hell | 5 Sp. Fotofläche 4:5 / 7 Sp. Kicker, H2, Person mit Akzentlinie, direkte Kontaktwege | – |
| 10 | FAQ | sand | Schmale Spalte (`--container-narrow`), Überschrift links davor ab 64 em | – |
| 11 | Kontakt | **night** | 5 Sp. Text + Direktkontakt als Karten (sticky) / 7 Sp. Formular auf heller Karte, Name und Firma nebeneinander. Streifen lösen sich zum Formular hin auf | Heller Block in dunkler Sektion |
| 12 | Footer | **night** (`night-950`) | Marke + 3 Spalten, Streifenkante oben, große angeschnittene Wortmarke als Abschluss | Wortmarke randlos |

**Rhythmus (heller Modus):** night (Header, Hero) → hell (Vertrauen, Leistungen) → Tönung (Warum) → hell (Vorgehen) → night (Werkzeuge) → hell 2 (Branchen) → Tönung (Region) → hell (Team) → hell 2 (FAQ) → night (Kontakt, Footer). Im Dunkelmodus werden alle hellen Flächen zu Dämmerungs-Tönen.

## 8. Illustrations-Tokens

Alle SVGs verwenden ausschließlich `currentColor` oder `var(--ill-…)`:
`--ill-line`, `--ill-line-soft`, `--ill-ink`, `--ill-surface`, `--ill-surface-2`, `--ill-risk`, `--ill-safe`, `--ill-muted`.
Einheitlicher Stil: Strichstärke 2 (bei ViewBox-Breite 480), `stroke-linecap: round`, `stroke-linejoin: round`, Eckenradius 8, Knoten-Radius 14/10.
