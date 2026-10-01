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

Die Datei und das Passwort gehören nie ins Repository (`.gitignore`) und werden nie per Chat verschickt. Empfehlung: ein eigenes Postfach nur für das Formular verwenden.

PHP-Version in konsoleH: 8.2 oder neuer.

## 4. Cookiebot (Einwilligungsverwaltung)
Standardmäßig **aus**. Aktivieren: die Domain-Gruppen-ID (UUID) aus dem Cookiebot-Konto in `site.config.json` bei `cookiebotId` eintragen und `node tools/build.mjs` ausführen. Dann
- wird das Cookiebot-Skript in alle Seiten eingebunden,
- erlaubt die Content-Security-Policy die Cookiebot-Hosts (und `style-src 'unsafe-inline'`, das der Banner braucht),
- erscheint im Abschnitt 6 der Datenschutzerklärung der Cookiebot-Absatz.

Banner nach dem Livegang im Browser prüfen (Konsole auf blockierte Quellen). In der Cookiebot-Konfiguration die Domain `okapio.de` eintragen.

## 5. Nach dem Livegang
1. `https://okapio.de` aufrufen: Schloss-Symbol, `www.okapio.de` und `http://` leiten auf `https://okapio.de/` um.
2. Kontaktformular mit einer Test-Anfrage prüfen (Mail kommt an, Antwort-Adresse stimmt).
3. Google Search Console: Domain bestätigen, `https://okapio.de/sitemap.xml` einreichen.
4. GitHub Pages der Vorschau abschalten (Repository-Einstellungen → Pages), damit die Seite nicht doppelt erreichbar ist.
5. Logdateien-Aufbewahrung bei Hetzner (konsoleH) kurz halten und in der Datenschutzerklärung (Abschnitt 3) bei Bedarf konkretisieren.

## Domain ändern
`siteUrl` in `site.config.json` anpassen, `node tools/build.mjs` ausführen (setzt Canonical, Open Graph, JSON-LD, robots.txt, sitemap.xml) und in `.htaccess` die Domain in den Weiterleitungen ersetzen.
