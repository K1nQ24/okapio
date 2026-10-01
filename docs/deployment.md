# Livegang: Hetzner (Webhosting) + IONOS (E-Mail)

Stand: Oktober 2026. Domain **okapio.de**, Webseite bei **Hetzner Webhosting**, E-Mail bleibt bei **IONOS**.

## 1. Domain (DNS bleibt bei IONOS)
Beim Domain-Anbieter (IONOS) nur diese Einträge ändern, die Mail-Einträge (MX, SPF, DKIM, DMARC) **nicht** anfassen:

| Typ | Host | Wert |
|---|---|---|
| A | `@` | IPv4-Adresse des Hetzner-Webhostings (konsoleH / Willkommens-Mail) |
| A | `www` | dieselbe IPv4-Adresse |
| AAAA | `@`, `www` | IPv6-Adresse, falls Hetzner eine nennt |

Danach in konsoleH die Domain dem Webhosting zuordnen und das kostenlose HTTPS-Zertifikat ausstellen.

## 2. Dateien hochladen (SFTP, z. B. FileZilla) in den Web-Ordner (`public_html`)
- `index.html`, `impressum.html`, `datenschutz.html`
- `favicon.ico`, `robots.txt`, `sitemap.xml`, **`.htaccess`** (versteckte Datei: in FileZilla „Versteckte Dateien anzeigen“ aktivieren)
- Ordner `assets/` (inklusive `assets/php/` mit `.htaccess` und `vendor/`)

**Nicht** hochladen: `src/`, `tools/`, `docs/`, `reviews/`, `.git`, `site.config.json`, `.gitignore`.

## 3. Zugangsdaten für das Kontaktformular (einmalig, nur auf dem Server)
Die Datei `assets/php/config.example.php` als **`okapio-config.php`** kopieren und **eine Ebene über `public_html`** ablegen (neben den Ordner, nicht hinein). Dort eintragen:
- `smtp_host` / `smtp_port` / `smtp_secure`: laut IONOS-Anleitung (Standard `smtp.ionos.de`, 587, `tls`)
- `smtp_user`: volle Mail-Adresse des Postfachs, `smtp_pass`: dessen Passwort
- `mail_to`: Empfänger der Anfragen, `mail_from`: Absender (muss das angemeldete Postfach oder ein Alias sein)
- `site_url`: Adresse der Seite (für Links und Webschriften in den Mails, Standard `https://okapio.de`)

Die Datei und das Passwort gehören nie ins Repository (`.gitignore`) und werden nie per Chat verschickt. Empfehlung: ein eigenes Postfach nur für das Formular verwenden.

PHP-Version in konsoleH: 8.2 oder neuer.

Bei jeder Anfrage gehen zwei HTML-Mails raus (Vorlagen: `assets/php/mail-template.php`, Logo: `assets/php/mail/okapio-logo.png`, beides liegt in `assets/php/` und wird mit hochgeladen): eine **Benachrichtigung an okapio** mit allen Angaben und Antworten-Schaltfläche, eine **Bestätigung an die anfragende Person** im selben Design. Die Bestätigung enthält bewusst nicht den Nachrichtentext der Person, damit das Formular nicht als Absender für fremde Texte missbraucht werden kann.

## 4. Cookiebot (Einwilligungsverwaltung)
Aktiv. Die Domain-Gruppen-ID steht in `site.config.json` (`cookiebotId`); sie ist keine geheime Angabe, sie steht ohnehin im Quelltext der Seite. Ohne ID (leerer Wert) lässt `node tools/build.mjs` Cookiebot weg. Mit ID
- wird das Cookiebot-Skript in alle Seiten eingebunden (`data-blockingmode="auto"`, Sprache Deutsch),
- erlaubt die Content-Security-Policy die Cookiebot-Hosts (und `style-src 'unsafe-inline'`, das der Banner braucht),
- erscheint im Abschnitt 6 der Datenschutzerklärung der Cookiebot-Absatz.

Im Cookiebot-Konto muss die Domain `okapio.de` (und `www.okapio.de`) für diese ID eingetragen sein, sonst erscheint der Banner nicht. Nach dem Livegang im Browser prüfen: Banner erscheint, Konsole zeigt keine blockierten Quellen (CSP), Auswahl bleibt nach dem Neuladen erhalten.

## 5. Nach dem Livegang
1. `https://okapio.de` aufrufen: Schloss-Symbol, `www.okapio.de` und `http://` leiten auf `https://okapio.de/` um.
2. Kontaktformular mit einer Test-Anfrage prüfen (Mail kommt an, Antwort-Adresse stimmt).
3. Google Search Console: Domain bestätigen, `https://okapio.de/sitemap.xml` einreichen.
4. GitHub Pages der Vorschau abschalten (Repository-Einstellungen → Pages), damit die Seite nicht doppelt erreichbar ist.
5. Logdateien-Aufbewahrung bei Hetzner (konsoleH) kurz halten und in der Datenschutzerklärung (Abschnitt 3) bei Bedarf konkretisieren.

## Domain ändern
`siteUrl` in `site.config.json` anpassen, `node tools/build.mjs` ausführen (setzt Canonical, Open Graph, JSON-LD, robots.txt, sitemap.xml) und in `.htaccess` die Domain in den Weiterleitungen ersetzen.
