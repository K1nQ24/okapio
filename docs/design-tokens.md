# okapio – Design Tokens & Layout-Prinzipien

Besitzer: Agent DESIGN-SYSTEM · Quelle der Wahrheit: `/assets/css/tokens.css`

## 1. Konzept in sechs Sätzen

1. **Logo-Tiefblau und Frost.** Das Tiefblau des Logos (`--night-900` = `#001842`) trägt Header, Hero, Werkzeuge, Kontakt und Footer. Ein kühles Off-White (`--frost-100`) trägt die Inhaltsbereiche. Gemischter Grundton: dunkle Bänder geben Rhythmus, gelesen wird auf Hell.
2. **Logo-Blau = Handlung und Risiko.** `--blue-*` (Basis `#0A6CFF`) steht für Buttons, Links, Angriffspfade und Findings. Orange/Terrakotta kommt nicht mehr vor.
3. **Logo-Cyan = erkannt / geschützt.** `--cyan-*` (Basis `#00DAF2`) erscheint dort, wo etwas geschützt oder erkannt wurde (Schild, Häkchen, Fortschritt), sowie als Hervorhebung „sichtbar" im Hero und am i-Punkt des Logos.
4. **Streifen als Tarnung.** Vertikale Streifen verdichten sich, wo etwas verborgen ist, und lösen sich per Maske auf, wo Klarheit entsteht.
5. **Keine Lila-Blau-Verläufe, kein Neon, kein Glassmorphism.** Verläufe nur als weiche Tonwertübergänge innerhalb der Palette. Einzige Ausnahme: der Header bekommt beim Scrollen eine fast deckende Fläche mit leichter Unschärfe.
6. **Technische Typografie.** Überschriften in Space Grotesk, Text in Inter, Labels und Nummern in JetBrains Mono. Der zweite Teil jeder Sektionsüberschrift steht in der gedämpften Textfarbe (`.h-accent`); nur „sichtbar" im Hero ist Logo-Cyan.

## 2. Palette

| Token | Wert | Rolle |
|---|---|---|
| `--night-950` | `#000f2b` | tiefster Grund (Footer, „night" im Dunkelmodus) |
| `--night-900` | `#001842` (Logo) | dunkler Hintergrund (Header, Hero, Werkzeuge, Kontakt); Text auf Hell |
| `--night-800` | `#082453` | Karten auf Dunkel |
| `--night-700` | `#113065` | erhöhte Flächen auf Dunkel |
| `--night-600` | `#1d3f7a` | Linien auf Dunkel (dekorativ) |
| `--frost-50` | `#fcfdfe` | Karten auf Hell, Text auf Dunkel |
| `--frost-100` | `#f3f5f8` | Standard heller Hintergrund |
| `--frost-200` | `#e7ebf1` | zweite helle Fläche (Thema „sand") |
| `--frost-300` | `#d3dae4` | Linien auf Hell (dekorativ) |
| `--haze-50/100` | `#f7f9fc` / `#e8eef6` | kühle Tönung („dark" im hellen Modus) |
| `--dusk-950 … 700` | `#000c24` … `#132f60` | Flächen im Dunkelmodus |
| `--ink-700/600` | `#3b4a5e` / `#4b5b70` | gedämpfter Text auf Hell |
| `--mist-300/400` | `#a6b4c7` / `#8a9bb2` | gedämpfter Text / starke Linien auf Dunkel |
| `--blue-300/400/500/600` | `#6aa8ff` / `#4d94ff` / `#0a6cff` (Logo) / `#005be6` | Akzent: Text auf Dunkel / Grafik auf Dunkel / Buttons, Grafik auf Hell / Text auf Hell, Hover |
| `--cyan-100/300/700` | `#b3f4fb` / `#00daf2` (Logo) / `#006877` | Platzhalter / Schutz-Akzent auf Dunkel / auf Hell |
| `--error-300/600` | `#ff9aa6` / `#c01f36` | Formularfehler (auf Dunkel / Hell) |
| `--white` | `#ffffff` | Button-Schrift auf Logo-Blau |
| `--slate-400/500` | `#6f86a0` / `#66758a` | Grafiklinien mit ≥ 3:1 |

Semantische Tokens (`--c-bg`, `--c-text`, `--c-accent` …) wechseln über `data-theme` am `<section>`: `light`, `sand`, `dark` und `night`. Illustrationen lesen **nur** `--ill-*`, dadurch passen sie sich der Sektion an.

- `dark` wird im hellen Modus (Standard) zu kühlem Dunst (`--haze-*`), im Dunkelmodus zu Dämmerung (`--dusk-*`).
- `night` bleibt in **beiden** Modi dunkel (gleiche Werte und Kontraste wie das dunkle Thema, siehe Tabelle unten). Eingesetzt für das Werkzeug-Band und den Footer: zwei bewusste dunkle Bänder geben der hellen Seite Rhythmus und einen klaren Abschluss.
- Abgeleitete Tönungen (`--c-accent-tint`, `--c-accent-glow`, `--c-grid`, `--c-glass`) entstehen per `color-mix()` je Thema neu. Sie sind rein dekorativ (Lichtkegel, Raster, Header-Fläche) und tragen keinen Text.

## 3. Kontrast (WCAG 2.x, berechnet mit `tools/contrast.mjs`)

Text: AA = 4,5:1 (normal), 3:1 (≥ 24 px oder ≥ 18,66 px fett). Grafik/UI: 3:1. Ausgabe von `node tools/contrast.mjs`:

| Paar | Farben | Verhältnis | Ergebnis |
|---|---|---|---|
| Text auf Hell | `#001842` auf `#f3f5f8` | 15,90 | AAA |
| Text auf Hell 2 | `#001842` auf `#e7ebf1` | 14,51 | AAA |
| Text gedämpft auf Hell | `#3b4a5e` auf `#f3f5f8` | 8,26 | AAA |
| Text gedämpft auf Hell 2 | `#3b4a5e` auf `#e7ebf1` | 7,54 | AAA |
| Text gedämpft auf Dunst | `#3b4a5e` auf `#e8eef6` | 7,73 | AAA |
| Text gedämpft 2 auf Karte | `#4b5b70` auf `#fcfdfe` | 6,81 | AA |
| Text auf Dunkel | `#fcfdfe` auf `#001842` | 17,05 | AAA |
| Text gedämpft auf Dunkel | `#a6b4c7` auf `#001842` | 8,25 | AAA |
| Text gedämpft auf Karte dunkel | `#a6b4c7` auf `#082453` | 7,19 | AAA |
| Text gedämpft auf night-700 | `#a6b4c7` auf `#113065` | 6,10 | AA |
| Text gedämpft auf dusk-700 | `#a6b4c7` auf `#132f60` | 6,22 | AA |
| Akzent-Text auf Hell | `#005be6` auf `#f3f5f8` | 5,28 | AA |
| Akzent-Text auf Hell 2 | `#005be6` auf `#e7ebf1` | 4,82 | AA |
| Akzent-Text auf Dunst | `#005be6` auf `#e8eef6` | 4,94 | AA |
| Akzent-Text auf Karte | `#005be6` auf `#fcfdfe` | 5,67 | AA |
| Akzent-Text auf Dunkel | `#6aa8ff` auf `#001842` | 7,16 | AAA |
| Akzent-Text auf Karte dunkel | `#6aa8ff` auf `#082453` | 6,24 | AA |
| Akzent-Text auf dusk-700 | `#6aa8ff` auf `#132f60` | 5,40 | AA |
| Akzent-Text auf dusk-800 | `#6aa8ff` auf `#0b234d` | 6,36 | AA |
| Button-Text (Standard) | `#ffffff` auf `#0a6cff` | 4,56 | AA |
| Button-Text Hover | `#ffffff` auf `#005be6` | 5,77 | AA |
| Grafik/Fokus auf Hell | `#0a6cff` auf `#f3f5f8` | 4,18 | AA-large/UI |
| Grafik auf Dunst | `#0a6cff` auf `#e8eef6` | 3,91 | AA-large/UI |
| Grafik auf Dunkel | `#4d94ff` auf `#001842` | 5,78 | AA |
| Grafik auf Karte dunkel | `#4d94ff` auf `#082453` | 5,04 | AA |
| Grafik auf dusk-800 | `#4d94ff` auf `#0b234d` | 5,14 | AA |
| Button-Fläche gegen Dunkel | `#0a6cff` auf `#001842` | 3,81 | AA-large/UI |
| Geschützt auf Hell | `#006877` auf `#f3f5f8` | 5,92 | AA |
| Geschützt auf Hell 2 | `#006877` auf `#e7ebf1` | 5,41 | AA |
| Geschützt auf Dunst | `#006877` auf `#e8eef6` | 5,54 | AA |
| Geschützt/Fokus auf Dunkel | `#00daf2` auf `#001842` | 10,18 | AAA |
| Geschützt auf Karte dunkel | `#00daf2` auf `#082453` | 8,87 | AAA |
| Geschützt auf dusk-700 | `#00daf2` auf `#132f60` | 7,68 | AAA |
| Platzhalter-Markierung | `#001842` auf `#b3f4fb` | 14,26 | AAA |
| Fehlertext auf Formular | `#c01f36` auf `#fcfdfe` | 5,91 | AA |
| Fehlertext auf Hell | `#c01f36` auf `#f3f5f8` | 5,51 | AA |
| Fehlertext auf Dunkel | `#ff9aa6` auf `#001842` | 8,62 | AAA |
| Grafiklinie auf Hell | `#66758a` auf `#f3f5f8` | 4,30 | AA-large/UI |
| Grafiklinie auf Hell 2 | `#66758a` auf `#e7ebf1` | 3,92 | AA-large/UI |
| Grafiklinie auf Dunst | `#66758a` auf `#e8eef6` | 4,02 | AA-large/UI |
| Grafiklinie auf Dunkel | `#6f86a0` auf `#001842` | 4,63 | AA |
| Grafiklinie auf Karte dunkel | `#6f86a0` auf `#082453` | 4,03 | AA-large/UI |
| Linie stark auf dusk-700 | `#8a9bb2` auf `#132f60` | 4,62 | AA |

**Bewusst verworfen bzw. nur dekorativ:** `#0a6cff` als kleiner Text auf Hell (4,2:1, deshalb `blue-600`), `#00daf2` auf Hell (zu hell, deshalb `cyan-700`), getöntes Weiß auf `#0a6cff` (4,48:1, deshalb reines Weiß). Linien `--c-line` (`frost-300`, `night-600`) sind rein dekorativ und tragen keine Information.

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
| 8 | Region | **dunkel** | 6 Sp. Text / 6 Sp. Kartengrafik. Karte bricht rechts aus dem Raster | Grafik randlos |
| 9 | Team | hell | 5 Sp. Fotofläche 4:5 / 7 Sp. Kicker, H2, Person mit Akzentlinie, direkte Kontaktwege | – |
| 10 | FAQ | sand | Schmale Spalte (`--container-narrow`), Überschrift links davor ab 64 em | – |
| 11 | Kontakt | **night** | 5 Sp. Text + Direktkontakt als Karten (sticky) / 7 Sp. Formular auf heller Karte, Name und Firma nebeneinander. Streifen lösen sich zum Formular hin auf | Heller Block in dunkler Sektion |
| 12 | Footer | **night** (`night-950`) | Marke + 3 Spalten, Streifenkante oben, große angeschnittene Wortmarke als Abschluss | Wortmarke randlos |

**Rhythmus (heller Modus):** night (Header, Hero) → hell (Vertrauen, Leistungen) → Tönung (Warum) → hell (Vorgehen) → night (Werkzeuge) → Tönung (Region) → hell (Team) → hell 2 (FAQ) → night (Kontakt, Footer). Im Dunkelmodus werden alle hellen Flächen zu Dämmerungs-Tönen.

## 8. Illustrations-Tokens

Alle SVGs verwenden ausschließlich `currentColor` oder `var(--ill-…)`:
`--ill-line`, `--ill-line-soft`, `--ill-ink`, `--ill-surface`, `--ill-surface-2`, `--ill-risk`, `--ill-safe`, `--ill-muted`.
Einheitlicher Stil: Strichstärke 2 (bei ViewBox-Breite 480), `stroke-linecap: round`, `stroke-linejoin: round`, Eckenradius 8, Knoten-Radius 14/10.
