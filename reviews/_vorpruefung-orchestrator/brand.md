# Review: BRAND-REVIEW

**Urteil: BESTANDEN** (mit 3 mittleren und 2 niedrigen Hinweisen; keine kritischen oder hohen Befunde)
Geprüft gegen `docs/brand-guide.md`. Methode: Wortlisten-Skript über den sichtbaren Text von `index.html`, Sichtprüfung von Screenshots bei 1440 und 360 px (Endzustand), Abgleich Token-Nutzung.

## Belegte Prüfungen
| Prüfpunkt | Ergebnis |
|---|---|
| Verbotene Floskeln (maßgeschneidert, innovativ, ganzheitlich, Hacker, Lösungen, führend, „Partner für digitale Sicherheit", Ausrufezeichen …) | keine Treffer |
| „zertifiziert" | 1 Treffer, als **Frage** im FAQ („Sind Sie … zertifiziert?"), Antwort verneint eine Eigenzertifizierung. Zulässig |
| Erfundene Zahlen / Referenzen / Logos / Zertifikate / Testimonials | keine. Sichtbare Zahlen: `5 · 4 · 1` (strukturell, auf der Seite selbst belegbar), `01–05` (Nummerierung), `1200 × 1500` (Foto-Vorgabe im Platzhalter) |
| „orientiert an" statt „zertifiziert" | durchgehend (Vertrauensleiste inkl. Erklärzeile, Leistungen, FAQ) |
| Platzhalter | alle als `<mark class="ph">[PLATZHALTER: …]</mark>` (sichtbar, terrakotta-hell, 8,4:1) |
| Fünf Leistungen unterscheidbar | ja: verschiedene Fläche (hell/dunkel/sand/hell mit Akzentkante/dunkel breit), Reihenfolge Text/Grafik, Spannweiten 7/5/5/7/12, eigene Bildlogik (Roadmap, Topologie, Cloud-Graph mit UI-Panel, Checkliste mit Gauge, Personen-Netz) |
| Konsistenz Logo/Farbe/Typo | Wortmarke aus echten Bricolage-Pfaden, i-Punkt Terrakotta. Teal nur für „geschützt/erkannt/erledigt", Terrakotta für Risiko/Aktion |
| Streifenmotiv | vertikal, ungleiche Stärken, löst sich in Trenner, Hero-Textur, Foto-Platzhalter, Kartenkante, Kontaktbereich auf. Kein Tier-Kitsch, kein Zebra |
| Vermeiden-Liste (KI-Look) | kein Lila/Blau-Neon, kein Glassmorphism (nur `backdrop-filter` am gescrollten Header, wie gefordert), kein 3-Spalten-Kartenraster mit Standardicons, keine Partikel, kein Dauer-Glow (Attack-Pfad dimmt nach dem Block), H1 linksbündig mit Illustration statt zentrierter Headline + zwei Buttons |

## Findings
| ID | Schweregrad | Datei + Selektor | Problem | Konkreter Fix-Vorschlag | Zuständig |
|---|---|---|---|---|---|
| BR-01 | mittel | `index.html` `#warum-okapio` Punkt 03; `#vorgehen` Schritt 2 | Zusagen, die der Inhaber bestätigen muss: „Wer Ihr Projekt startet, führt es auch zu Ende." und „Auf Wunsch unterzeichnen wir vorher eine Geheimhaltungsvereinbarung." Das sind Leistungsversprechen, keine belegten Tatsachen | Im Übergabe-Dokument als „vom Inhaber zu bestätigen" führen (siehe Platzhalter-Liste, Abschnitt B) | BRAND |
| BR-02 | mittel | `index.html` `#branchen` | „Drei Umfelder, die wir kennen." behauptet Branchenerfahrung. Ein Platzhalter-Hinweis steht darunter, die Überschrift selbst ist aber eine Aussage | Überschrift erst nach Bestätigung stehen lassen. Alternativ neutraler: „Für drei Umfelder gemacht." | BRAND |
| BR-03 | mittel | `index.html` `#region` | Die Aufzählung „vor Ort in … Leonberg, Herrenberg, Esslingen" ist eine Einsatzgebiet-Zusage, die aus dem Briefing („Böblingen, Stuttgart und Umgebung") abgeleitet wurde | Orte vom Inhaber bestätigen lassen. Bei Kürzung `region-map.svg` und Liste anpassen | BRAND / ILLUSTRATION |
| BR-04 | niedrig | Service-Karte 01 (`.service--1`), ab 1024 px | Große Leerfläche zwischen Text und Illustration, weil die Karte auf die Höhe der dunklen Nachbarkarte gestreckt wird | `align-self: start` für `.service--1` oder Illustration mit `align-self: end` | FRONTEND |
| BR-05 | niedrig | Mobil (360 px), Hero-Graph | Beschriftungen im Hero-Graph sind bei Breite 360 px etwa 6 px hoch und damit kaum lesbar (dekorativ, `figcaption` liefert den Inhalt) | Auf Mobil Beschriftungen ausblenden (`#hg-labels`) oder Graph größer zuschneiden | ILLUSTRATION |

## Einschätzung Eigenständigkeit
Die Bedeutungsregel (Terrakotta = Risiko, Teal = geschützt) und der Angriffspfad-Moment tragen die Seite und unterscheiden sie von generischen Security-Seiten. Schwächer als gewünscht: Das Streifenmotiv ist in den Karten selten sichtbar (nur Karte 03, Roadmap-Grafik). Wenn mehr Wiedererkennung gewünscht ist, Trenner zwischen weiteren Sektionen ergänzen.
