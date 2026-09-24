# okapio – SVG-Manifest

Besitzer: Agent ILLUSTRATION · Quelle: `/assets/svg/*.svg`

## Einbindung (wichtig)

SVGs in `<img>` erben weder `currentColor` noch `var(--token)` der Seite und sind per ID nicht animierbar. Deshalb werden die Dateien **inline** ins HTML übernommen. `tools/build.mjs` (optional, Node, keine Abhängigkeiten) ersetzt in `src/index.src.html` die Marker `<!-- @svg:dateiname -->` durch den Dateiinhalt und schreibt `index.html`. Die SVG-Dateien sind die Quelle der Wahrheit. Standalone (Doppelklick) erscheinen sie ohne Farben, weil die Tokens fehlen.

Flag `noid` am Marker (`<!-- @svg:logo-wordmark noid -->`) entfernt `id`-Attribute (für Mehrfachverwendung wie Logo in Header und Footer).

## Stilregeln (für alle)

- Strichstärke 2 (ViewBox-Breite ≈ 480–640), `stroke-linecap/-linejoin: round`, Eckenradius 8, Knoten-Radius 14–26.
- Farben ausschließlich `currentColor` oder `var(--ill-…)`. Keine Hex-Werte, keine externen Referenzen, kein `<script>`, keine Event-Attribute, keine `<style>`.
- Informative SVGs: `role="img"` + `<title>`/`<desc>`. Dekorative: `aria-hidden="true" focusable="false"`.
- Zeichnende Pfade haben `pathLength="1"`. MOTION setzt `stroke-dasharray: 1; stroke-dashoffset: 1 → 0`.
- Bedeutung: `--ill-risk` (Blau) = Risiko/Angriff/Finding. `--ill-safe` (Cyan) = erkannt/geschützt/erledigt.

## Dateien und IDs

### `logo-wordmark.svg` – `#ill-logo` (informativ, Text „okapio")
`#wordmark` (Pfade, `currentColor`) · `#dot` (i-Punkt, `--ill-risk`). **Animation:** keine (statisch).

### `logo-symbol.svg` – `#ill-logo-symbol` (dekorativ)
`#ring` · `#stripes` (neun Streifen im unteren Halbkreis) · `#dot`. **Animation:** optional Streifen beim Laden aufbauen (nicht genutzt).

### `hero-graph.svg` – `#ill-hero-graph` (informativ)
| ID | Inhalt | Animation |
|---|---|---|
| `#stripes` | 16 vertikale Balken (Tarnschicht) | Balken bauen sich von unten auf (`scaleY`, gestaffelt), danach ruhig |
| `#edges` → `#e-…` (11 Pfade) | Netzwerkkanten | zeichnen sich (`data-draw`-Logik, `stroke-dashoffset`), gestaffelt |
| `#attack-path` → `#attack-seg`, `#attack-head` | Angriffspfad Internet → Web → API → Schild | `#attack-seg` zeichnet sich, Kopf erscheint am Ende (opacity) |
| `#node-rings` → `#ring-…` (7) | Puls-Ringe | sehr leichter Puls (`scale` 1 → 1,1, `opacity`), lange Periode |
| `#nodes` → `#n-internet`, `#n-web`, `#n-api`, `#n-cloud`, `#n-laptop`, `#n-server`, `#n-endpoint`, `#n-data` | Knoten | Einblenden gestaffelt (`opacity`, kleiner `scale`) |
| `#labels` | 4 Beschriftungen | Einblenden mit Knoten |
| `#shield` → `#shield-ring`, `#shield-body`, `#shield-check` | Schild | Schild „rastet ein" (`scale` + `opacity`), Häkchen zeichnet sich, Ring pulst einmal auf |
| `#blocked-tag` | Etikett „blockiert" | erscheint nach dem Aufprall (`opacity`, `translateY`) |

Sequenz: Kanten → Knoten → Angriffspfad → Schild + Ring → Etikett → dauerhaft nur Puls-Ringe.

### `hero-stripes.svg` – `#ill-hero-stripes` (dekorativ, Hero-Hintergrund)
`#stripes` mit `#hs-01` … `#hs-59`. **Animation:** Aufbau von unten (`scaleY`, `transform-origin: bottom`, Staffel), Parallax (`data-parallax`).

### `service-roadmap.svg` – `#ill-roadmap`
`#stripes` · `#route` (zeichnet sich) · `#branch-rejected` (zeichnet sich, gestrichelt) · `#rejected-mark` · `#milestones` → `#m1`, `#decision`, `#m2`, `#m3`, `#m4` (poppen nacheinander auf) · `#m1-ring` (Blau = „jetzt") · `#labels`.

### `service-topology.svg` – `#ill-topology`
`#zones` (`#zone-office`, `#zone-server`, `#zone-ot`) · `#links` (`#l-…`, zeichnen sich von oben nach unten) · `#blocked-link` (`#blocked-path` zeichnet sich, `#blocked-mark` poppt auf) · `#devices` (`#firewall`, `#d-…`) · `#labels`.

### `service-cloud-graph.svg` – `#ill-cloud-graph`
`#edges` (`#e-…`, zeichnen sich) · `#nodes` (`#cloud-core`, `#n-storage`, `#n-iam`, `#n-db`, `#n-saas`) · `#findings-markers` (`#mk-1`, `#mk-2`, `#mk-3`; `.mk-ring` pulsiert bei `mk-1`/`mk-2`) · `#panel` (`#panel-card`, `#row-1`, `#row-2`, `#row-3` fahren nacheinander ein).

### `service-audit-path.svg` – `#ill-audit-path`
`#checklist` · `#audit-path` (zeichnet sich) · `#rows` (`#row-1` … `#row-5`) · `#status-icons` (`#st-1` … `#st-5`; `#st-1-check`, `#st-2-check` zeichnen sich, `#st-3-dots`) · `#gauge` (`#gauge-track`, `#gauge-done`, `#gauge-review` füllen sich) · `#legend`.

### `service-awareness.svg` – `#ill-awareness`
`#network-edges` (`#pe-…`) · `#phish` (`#phish-mail`, `#phish-path-main`, `#phish-path-1`, `#phish-path-2`) · `#people` (`#p-1` … `#p-5`, `#p-3-body`, `#signal-ring-1/2`) · `#recognized` (`#recognized-badge`, `#recognized-check`, `#report-path`, `#report-node`) · `#labels`.
Sequenz: Netz → Mail läuft zu Personen → `#p-3` erkennt (Signal-Ringe expandieren, Häkchen) → Meldung läuft zur Meldestelle.

### `region-map.svg` – `#ill-region-map` (informativ, „nicht maßstäblich")
`#contours` · `#river` (zeichnet sich) · `#service-area` · `#routes` (`#r-…`, zeichnen sich von Böblingen aus) · `#towns` (`#town-…`) · `#pin` (`#pin-pulse` pulsiert leicht) · `#labels`.

### `divider-stripes.svg` – `#ill-divider` (dekorativ)
`#stripes` (113 Balken, hängen vom oberen Rand und lösen sich nach rechts auf). **Animation:** Aufbau per Reveal (`scaleY`, Origin oben) bei Sichtbarkeit. Wiederverwendung gespiegelt per CSS (`transform: scaleY(-1)`).

## Dauerbewegung (`.flow`)

Jede Illustration (außer Streifen, Icons, Logo) enthält am Ende eine Gruppe `class="flow"` mit ID `…-flow` (Hero zusätzlich `hg-flow-attack`). Darin laufen per SMIL (`animateMotion` + `mpath`) kleine Datenpakete entlang vorhandener Pfade (Referenz per `href="#pfad-id"`), und Impulsringe (`animate` auf `r`/`opacity`) markieren Risiko- oder Schutzpunkte. Farben nur `--ill-ink` (Verkehr), `--ill-risk` (Angriff/Finding), `--ill-safe` (geschützt). Die Gruppe ist per CSS standardmäßig ausgeblendet und erscheint erst mit JS, ohne reduzierte Bewegung und nach dem Aufbau (`--flow-d` in motion.css). main.js pausiert die SMIL-Zeit, solange die Grafik nicht sichtbar ist. **Pfad-IDs, auf die sich `.flow` bezieht, nicht umbenennen.**

## Vom Frontend gesetzte data-Attribute (Auszug)

MOTION greift **nur** auf `data-*` und die obigen IDs zu. Für die Illustrationen setzt FRONTEND am umschließenden Element `data-illustration="<name>"` (`hero`, `roadmap`, `topology`, `cloud`, `audit`, `awareness`, `region`). MOTION startet die Sequenz, wenn das Element sichtbar wird, indem es `is-playing` setzt.
