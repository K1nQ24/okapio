# okapio – Design Tokens & Layout-Prinzipien

Besitzer: Agent DESIGN-SYSTEM · Quelle der Wahrheit: `/assets/css/tokens.css`

## 1. Konzept in fünf Sätzen

1. **Nacht und Knochen.** Ein tiefes Nachtblau (`--night-900`) trägt die dunklen Sektionen. Ein warmes Off-White (`--bone-100`) trägt die hellen. Der Wechsel erzeugt Rhythmus.
2. **Terrakotta = Risiko und Handlung.** `--clay-*` steht für Angriffspfade, Findings, Buttons. Es ist die Farbe des Okapi-Fells, kein Alarm-Rot.
3. **Teal = erkannt / geschützt.** `--sig-*` erscheint ausschließlich dort, wo etwas geschützt oder erkannt wurde (Schild, Häkchen, bestandener Prüfpunkt). Dadurch ist die Farbe *bedeutungstragend* und wird sparsam.
4. **Streifen als Tarnung.** Vertikale Streifen verdichten sich, wo etwas verborgen ist, und lösen sich per Maske auf, wo Klarheit entsteht.
5. **Keine Lila-Blau-Verläufe, kein Neon, kein Glassmorphism.** Verläufe nur als weiche Tonwertübergänge innerhalb der Palette.

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

Semantische Tokens (`--c-bg`, `--c-text`, `--c-accent` …) wechseln über `data-theme="dark"` bzw. `data-theme="sand"` am `<section>`. Illustrationen lesen **nur** `--ill-*`, dadurch passen sie sich der Sektion an.

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

- **Display: Bricolage Grotesque** (variabel, 200–800, OFL). Charakterstarke Grotesk mit leicht eigenwilligen Formen und Tintenfallen. Wirkt handwerklich, nicht generisch, und bleibt bei großen Größen ruhig. Genutzt bei Bold (700) mit engem Tracking.
- **Text: Manrope** (variabel, 200–800, OFL). Offene, geometrische Formen, sehr gute Lesbarkeit bei 17 px, klare Zahlen (wichtig bei Audit-/Prüfkontext).
- **Self-hosted:** `/assets/fonts/*.woff2`, Latin-Subset (deckt ä ö ü ß und die Satzzeichen ab, zusammen etwa 66 KB). `font-display: swap`. Preload der beiden Dateien im `<head>`.
- **Skala (fluid, clamp):** `--fs-h1` 2,6 → 6 rem · `--fs-h2` 2,125 → 4,1 rem · `--fs-h3` 1,375 → 1,9 rem · `--fs-lead` 1,125 → 1,4 rem · `--fs-base` 1,0625 rem (17 px) · `--fs-sm` 0,875 rem · `--fs-xs` 0,75 rem.
- **Zeilenhöhen:** Display 1,02 · Überschriften 1,12 · Text 1,62. Zeilenlänge max. 62 ch.
- **Tracking:** Display −0,035 em, Überschriften −0,02 em, Kicker +0,12 em (Versalien nur bei Kickern).

## 5. Abstand, Radius, Schatten, Bewegung

- **Spacing** (4-px-Basis): `--space-1` 0,25 rem … `--space-10` 8 rem. Sektionen: `--section-y` (fluid 4,5–9 rem).
- **Radien:** `--r-sm` 0,625 · `--r-md` 1 · `--r-lg` 1,75 · `--r-xl` 2,5 rem · `--r-pill`. Karten `--r-lg`, Buttons `--r-pill`, Inputs `--r-sm`.
- **Schatten:** `--shadow-1` (Ruhe), `--shadow-2` (Hover/Anheben). Weich, warm getönt, nie farbig.
- **Easing:** `--ease-out` (Standard für Einblendungen), `--ease-in-out` (Loops), `--ease-pop` (kleine Einrast-Effekte, sparsam).
- **Dauern:** fast 150 ms · base 320 ms · slow 700 ms · draw 1400 ms · loop 3600 ms · Staffel 90 ms.
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
| 1 | Header | dunkel | Sticky, 1 Zeile. Logo links, Nav mittig, CTA rechts. Mobil: Menü-Button | – |
| 2 | Hero | **dunkel** | 12 Sp.: Text 6 Sp. linksbündig, Illustration 6 Sp. Illustration ragt rechts aus dem Container. Streifen-Textur läuft nach unten aus | Illustration über Containerrand. H1 linksbündig statt zentriert |
| 3 | Vertrauensleiste | hell | Schmale Zeile, Standards als Textmarken mit dünnen Trennlinien. Streifen-Trenner oben | – |
| 4 | Leistungen | hell | **Bento** aus 12 Sp.: 7+5 / 5+7 / 12. Jede Karte hat eigene Fläche (weiß, dunkel, sand-akzentuiert, weiß mit Rand, dunkel breit) und eigene Anordnung von Text und Illustration | Kartengrößen und Ausrichtung bewusst ungleich. Nummerierung 01–05 als roter Faden |
| 5 | Warum okapio | **dunkel** | 5 Sp. Überschrift (sticky) / 7 Sp. drei Punkte als Liste mit großen Nummern. Fakten-Zeile unten | Überschrift sticky, Liste scrollt |
| 6 | Vorgehen | hell | Vertikale Timeline mit Linie links (Füllung per Scroll), Schritte alternierend eingerückt (Desktop) | Schritte versetzt |
| 7 | Branchenfokus | sand | Drei Spalten mit unterschiedlicher Höhe (Versatz nach unten), je ein Icon | Versatz statt gleicher Höhe |
| 8 | Region | **dunkel** | 6 Sp. Text / 6 Sp. Kartengrafik. Karte bricht rechts aus dem Raster | Grafik randlos |
| 9 | Team | hell | 3 Fotoflächen 4:5, mittlere Karte tiefer versetzt. Texte darunter | Versatz |
| 10 | FAQ | sand | Schmale Spalte (`--container-narrow`), Überschrift links davor ab 64 em | – |
| 11 | Kontakt | **dunkel** | 5 Sp. Text + Direktkontakt / 7 Sp. Formular auf heller Karte (Kontrast, hoher Fokus). Streifen lösen sich zum Formular hin auf | Heller Block in dunkler Sektion |
| 12 | Footer | tiefdunkel (`night-950`) | 3 Spalten, Streifen-Trenner oben | – |

**Rhythmus:** dunkel (Header/Hero) → hell (Vertrauen, Leistungen) → dunkel (Warum) → hell (Vorgehen) → sand (Branchen) → dunkel (Region) → hell (Team) → sand (FAQ) → dunkel (Kontakt, Footer).

## 8. Illustrations-Tokens

Alle SVGs verwenden ausschließlich `currentColor` oder `var(--ill-…)`:
`--ill-line`, `--ill-line-soft`, `--ill-ink`, `--ill-surface`, `--ill-surface-2`, `--ill-risk`, `--ill-safe`, `--ill-muted`.
Einheitlicher Stil: Strichstärke 2 (bei ViewBox-Breite 480), `stroke-linecap: round`, `stroke-linejoin: round`, Eckenradius 8, Knoten-Radius 14/10.
