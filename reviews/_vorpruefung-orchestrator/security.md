# Review: SECURITY

**Urteil: NACHBESSERUNG** (keine kritischen Befunde; 2 mittlere, die vor dem Livegang geklärt werden müssen)
Prüfumfang: `index.html`, `impressum.html`, `datenschutz.html`, `assets/js/*.js`, `assets/css/*.css`, `assets/svg/*.svg`, `assets/php/kontakt.php`. Methode: Grep/Skript-Prüfung am gebauten HTML, Code-Lektüre. **`kontakt.php` wurde nicht ausgeführt** (auf dem Prüfrechner ist kein PHP installiert). Die Bewertung beruht auf Code-Lektüre, nicht auf einem Test.

## Bestanden (belegt)
| Prüfpunkt | Ergebnis |
|---|---|
| CSP als Meta, ohne `unsafe-inline`/`unsafe-eval`, `default-src 'none'` | ja, `index.html` Zeile 16 (und die Rechtsseiten) |
| Externe Requests (HTML, CSS, JS, SVG, Fonts) | keine. Treffer für `http(s)://` sind nur `xmlns`-Namespace-Kennungen der SVGs, `schema.org` im JSON-LD und ein auskommentierter Canonical-Platzhalter |
| Inline-Handler / `style=`-Attribute im ausgelieferten HTML | keine |
| JS-Sinks (`innerHTML`, `eval`, `new Function`, `document.write`) | keine im Code. Der Treffer `innerHTML` in `main.js` Zeile 3 ist ein Kommentar. `style.setProperty` (CSSOM) ist unter `style-src 'self'` erlaubt |
| SVG-Dateien | kein `<script>`, `<style>`, `<foreignObject>`, `<image>`, `<use>`, keine Event-Attribute, keine externen Referenzen |
| Externe Links | keine vorhanden, daher kein `rel="noopener"` nötig |
| Secrets im Code | keine. Empfänger und Absender sind Platzhalter bzw. Umgebungsvariablen. Solange Platzhalter drinstehen, sendet das Skript nicht |

## Findings
| ID | Schweregrad | Datei + Stelle | Problem | Konkreter Fix-Vorschlag | Zuständig |
|---|---|---|---|---|---|
| SEC-01 | mittel | `assets/php/kontakt.php` Z. 99–101 (`rate_limited`) | Das Rate-Limit nutzt `REMOTE_ADDR`. Hinter einem Reverse-Proxy oder CDN teilen sich alle Besucher eine IP, dann sperrt der fünfte Absender pro Stunde alle anderen (Selbst-DoS). Zusätzlich ist der IP-Hash unsalted (`'\|okapio-rl'` ist eine Konstante im Code) und für IPv4 mit Rainbow-Tabelle umkehrbar | Proxy-Header nur auswerten, wenn der Proxy vertrauenswürdig ist. Hash als `hash_hmac('sha256', $ip, getenv('OKAPIO_RL_SECRET'))`. Zusätzlich Limit auf Server-Ebene (fail2ban, `limit_req`) | FRONTEND |
| SEC-02 | mittel | `index.html` Z. 985, `kontakt.php` Konfiguration | `mailto:PLATZHALTER@example.invalid` ist als Fallback-Link live. Wird der Platzhalter vergessen, läuft der Fallback ins Leere, und Nutzer glauben, ihre Anfrage sei versendet | Platzhalter-Liste (Übergabe) beachten. Zusätzlich im Build-Skript einen Fehler werfen, wenn `PLATZHALTER` in `href` oder `action` vorkommt | FRONTEND |
| SEC-03 | niedrig | `kontakt.php` Z. 80–95 (`same_origin`) | Fehlen `Origin` und `Referer`, wird die Anfrage durchgelassen. Das ist bewusst (Datenschutz-Browser), schwächt aber die CSRF-Prüfung. Ein CSRF-Token ist bei einer statischen Seite ohne Session nicht sinnvoll umsetzbar | Als akzeptiertes Restrisiko dokumentieren. Der Schaden ist begrenzt (eine E-Mail an das eigene Postfach). Rate-Limit und Honeypot bleiben | FRONTEND |
| SEC-04 | niedrig | `kontakt.php` Z. 182 (`Reply-To`) | Die Absenderadresse ist vom Nutzer frei wählbar (validiert, aber ungeprüft). Antworten des Inhabers gehen an diese Adresse. Das ist Formularstandard, kann aber für Phishing-Rückkanäle genutzt werden | Hinweis in der Übergabe: E-Mails aus dem Formular nie ungeprüft weiterleiten oder Links darin öffnen | Inhaber |
| SEC-05 | niedrig | `kontakt.php` Z. 41 (`: never`), Z. 61 (`str_contains`) | Erfordert **PHP ≥ 8.1**. Auf älteren Hosts gibt es einen Parse-/Fatal-Error (HTTP 500), und das Formular läuft ins Leere | In den Deployment-Hinweisen PHP ≥ 8.1 verlangen. Alternativ `: never` entfernen | FRONTEND |
| SEC-06 | niedrig | `index.html` Z. 6–15 | `frame-ancestors`, `report-uri` und `sandbox` wirken nicht per Meta-CSP. Clickjacking-Schutz besteht daher nur, wenn der Server-Header gesetzt wird | Die Header aus dem Kommentar auf dem Server setzen (HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, COOP, CSP mit `frame-ancestors 'none'`) und mit securityheaders.com prüfen | Inhaber / Hosting |
| SEC-07 | niedrig | `kontakt.php` Z. 100–116 | Rate-Limit-Dateien liegen in `sys_get_temp_dir()`. Auf Shared Hosting ist das Verzeichnis oft geteilt, und Dateien wachsen unbegrenzt (keine Bereinigung) | Eigenes Verzeichnis außerhalb des Webroots, Aufräumen alter Dateien (z. B. Cron oder Zufallsaufruf) | FRONTEND |

## Glaubwürdigkeit für eine Security-Firma
Positiv: Keine Fremdressourcen, keine Cookies, keine Tracker, strikte CSP, Formular mit Honeypot, Ratenbegrenzung und ohne Fehlerdetails. Das entspricht dem, was die Seite verspricht. Beim Livegang die Server-Header setzen (SEC-06), sonst wird die Seite von Security-Scannern (die Kunden gerne testen) schlechter bewertet als ihr Inhalt.
