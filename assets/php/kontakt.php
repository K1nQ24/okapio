<?php
/**
 * okapio – Kontaktformular-Endpunkt (Beispielimplementierung, vor dem Livegang prüfen)
 * Besitzer: Agent FRONTEND · Review: SECURITY
 *
 * Verhalten:
 *  - nimmt nur POST an, prüft serverseitig alle Felder
 *  - keine Nutzereingaben in Mail-Headern außer der validierten Reply-To-Adresse (Header-Injection-Schutz)
 *  - Honeypot-Feld "website": gefüllt → stilles "Erfolg" ohne Versand
 *  - Rate-Limit (Beispiel, dateibasiert, IP gehasht). Besser zusätzlich auf Server-Ebene begrenzen (z. B. fail2ban, Reverse-Proxy).
 *  - Herkunftsprüfung (Origin/Referer) als CSRF-Schutz für ein cookieloses Formular
 *  - antwortet ausschließlich mit Redirect (303). Keine Fehlerdetails an den Client, Details nur ins Server-Log
 *
 * Ausgabe-Escaping: Es wird kein HTML ausgegeben. Die Mail ist reiner Text (text/plain, UTF-8).
 * Secrets: keine im Code. Empfänger und Absender unten eintragen (oder per Umgebungsvariable setzen).
 */

declare(strict_types=1);

ini_set('display_errors', '0');
ini_set('log_errors', '1');

// ---------- Konfiguration ----------
// Empfänger und Absender. Der Absender muss zur sendenden Domain passen (SPF/DKIM/DMARC); bei Domainwechsel per Umgebungsvariable anpassen.
$MAIL_TO   = getenv('OKAPIO_MAIL_TO')   ?: 'info@plussec.de';
$MAIL_FROM = getenv('OKAPIO_MAIL_FROM') ?: 'info@plussec.de';

const REDIRECT_OK      = '../../index.html#kontakt-gesendet';
const REDIRECT_ERROR   = '../../index.html#kontakt-fehler';
const REDIRECT_INVALID = '../../index.html#kontakt-eingabe';

const MAX_NAME    = 120;
const MAX_FIRMA   = 160;
const MAX_EMAIL   = 200;
const MAX_MESSAGE = 4000;

const RATE_MAX    = 5;     // Anfragen pro Fenster und (gehashter) IP
const RATE_WINDOW = 3600;  // Sekunden

// ---------- Hilfsfunktionen ----------
function respond(string $target): never
{
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: no-referrer');
    header('Location: ' . $target, true, 303);
    exit;
}

/** Einzeiler: Steuerzeichen (inkl. CR/LF) entfernen, trimmen. */
function clean_line(mixed $v, int $max): ?string
{
    if (!is_string($v)) {
        return null;
    }
    $v = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $v);
    if ($v === null) {
        return null;
    }
    $v = trim($v);
    return (mb_strlen($v, 'UTF-8') <= $max) ? $v : null;
}

/** Mehrzeiler: nur Zeilenumbrüche behalten, andere Steuerzeichen entfernen. */
function clean_text(mixed $v, int $max): ?string
{
    if (!is_string($v)) {
        return null;
    }
    $v = str_replace(["\r\n", "\r"], "\n", $v);
    $v = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]+/u', '', $v);
    if ($v === null) {
        return null;
    }
    $v = trim($v);
    return (mb_strlen($v, 'UTF-8') <= $max) ? $v : null;
}

/** Stammt die Anfrage von der eigenen Seite? (Origin, sonst Referer; fehlen beide, wird nicht blockiert) */
function same_origin(): bool
{
    $host = strtolower((string)($_SERVER['HTTP_HOST'] ?? ''));
    foreach (['HTTP_ORIGIN', 'HTTP_REFERER'] as $key) {
        if (!empty($_SERVER[$key])) {
            $h = parse_url((string)$_SERVER[$key], PHP_URL_HOST);
            if (!is_string($h)) {
                return false;
            }
            $p = parse_url((string)$_SERVER[$key], PHP_URL_PORT);
            $h = strtolower($h) . (is_int($p) ? ':' . $p : '');
            return $h === $host;
        }
    }
    return true;
}

/** Sehr einfaches Rate-Limit. Die IP wird nur gehasht und nur für das Zeitfenster gespeichert. */
function rate_limited(): bool
{
    $ip   = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
    $file = sys_get_temp_dir() . '/okapio_rl_' . hash('sha256', $ip . '|okapio-rl') . '.json';
    $now  = time();
    $fh   = @fopen($file, 'c+');
    if ($fh === false) {
        return false; // im Zweifel nicht blockieren, aber loggen
    }
    $limited = false;
    if (flock($fh, LOCK_EX)) {
        $raw   = stream_get_contents($fh);
        $times = json_decode($raw ?: '[]', true);
        $times = is_array($times) ? array_filter($times, static fn($t) => is_int($t) && $t > $now - RATE_WINDOW) : [];
        if (count($times) >= RATE_MAX) {
            $limited = true;
        } else {
            $times[] = $now;
        }
        ftruncate($fh, 0);
        rewind($fh);
        fwrite($fh, json_encode(array_values($times)));
        fflush($fh);
        flock($fh, LOCK_UN);
    }
    fclose($fh);
    return $limited;
}

// ---------- Ablauf ----------
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    http_response_code(405);
    exit;
}

if (!same_origin()) {
    error_log('okapio kontakt: Herkunftsprüfung fehlgeschlagen');
    respond(REDIRECT_ERROR);
}

// Konfiguration vollständig? (Platzhalter dürfen nicht live gehen)
if (str_contains($MAIL_TO, 'PLATZHALTER') || str_contains($MAIL_FROM, 'PLATZHALTER')
    || !filter_var($MAIL_TO, FILTER_VALIDATE_EMAIL) || !filter_var($MAIL_FROM, FILTER_VALIDATE_EMAIL)) {
    error_log('okapio kontakt: Empfänger/Absender nicht konfiguriert');
    respond(REDIRECT_ERROR);
}

// Honeypot: Bots füllen das Feld. Wir tun so, als wäre alles gut.
if (isset($_POST['website']) && $_POST['website'] !== '') {
    respond(REDIRECT_OK);
}

if (rate_limited()) {
    error_log('okapio kontakt: Rate-Limit erreicht');
    respond(REDIRECT_ERROR);
}

$name    = clean_line($_POST['name']    ?? null, MAX_NAME);
$firma   = clean_line($_POST['firma']   ?? null, MAX_FIRMA);
$email   = clean_line($_POST['email']   ?? null, MAX_EMAIL);
$message = clean_text($_POST['nachricht'] ?? null, MAX_MESSAGE);
$consent = ($_POST['datenschutz'] ?? '') === '1';

if ($name === null || $name === ''
    || $firma === null || $firma === ''
    || $email === null || !filter_var($email, FILTER_VALIDATE_EMAIL)
    || $message === null || $message === ''
    || !$consent) {
    respond(REDIRECT_INVALID);
}

// Mail bauen: Betreff und Header enthalten keine Nutzereingaben (außer der validierten Reply-To-Adresse).
$subject = 'Anfrage über die Website';
$body = "Neue Anfrage über das Kontaktformular\n"
      . "Zeitpunkt: " . gmdate('Y-m-d H:i') . " UTC\n\n"
      . "Name:  $name\n"
      . "Firma: $firma\n"
      . "E-Mail: $email\n\n"
      . "Nachricht:\n$message\n\n"
      . "Einwilligung zur Datenschutzerklärung: ja\n";

$headers = [
    'From'                      => $MAIL_FROM,
    'Reply-To'                  => $email,
    'MIME-Version'              => '1.0',
    'Content-Type'              => 'text/plain; charset=UTF-8',
    'Content-Transfer-Encoding' => '8bit',
];

$sent = mail($MAIL_TO, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers);

if (!$sent) {
    error_log('okapio kontakt: mail() fehlgeschlagen'); // bewusst ohne Nutzerdaten
    respond(REDIRECT_ERROR);
}

respond(REDIRECT_OK);
