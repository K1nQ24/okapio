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
 * Versand: per SMTP über das Postfach beim E-Mail-Anbieter (IONOS) mit PHPMailer (assets/php/vendor/phpmailer).
 * Zwei HTML-Mails (mit Textfassung und eingebettetem Logo): Benachrichtigung an uns, Bestätigung an die anfragende Person.
 * Secrets: keine im Code und nicht im Repository. Zugangsdaten stehen in einer Konfigurationsdatei auf dem Server
 * (Vorlage: config.example.php, Beschreibung: docs/deployment.md).
 */

declare(strict_types=1);

use PHPMailer\PHPMailer\Exception as MailException;
use PHPMailer\PHPMailer\PHPMailer;

ini_set('display_errors', '0');
ini_set('log_errors', '1');

// ---------- Konfiguration ----------
// Zugangsdaten: bevorzugt außerhalb des Web-Ordners (eine Ebene über public_html), sonst neben diesem Skript (per .htaccess gesperrt).
$CONFIG = [];
foreach ([dirname(__DIR__, 3) . '/okapio-config.php', __DIR__ . '/config.php'] as $candidate) {
    if (is_file($candidate)) {
        $loaded = include $candidate;
        if (is_array($loaded)) {
            $CONFIG = $loaded;
            break;
        }
    }
}
if ($CONFIG === []) {
    $configMissing = true;
}
$MAIL_TO   = (string)($CONFIG['mail_to']   ?? '');
$MAIL_FROM = (string)($CONFIG['mail_from'] ?? '');

// Relative Ziele: von /assets/php/kontakt.php aus ist ../../ der Seitenanfang (auch in einem Unterordner).
const REDIRECT_OK      = '../../#kontakt-gesendet';
const REDIRECT_ERROR   = '../../#kontakt-fehler';
const REDIRECT_INVALID = '../../#kontakt-eingabe';

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
    // Mit JS sendet die Seite per fetch und erwartet JSON (kein Neuladen, kein Springen). Sonst: Weiterleitung wie bisher.
    if (str_contains((string)($_SERVER['HTTP_ACCEPT'] ?? ''), 'application/json')) {
        $status = str_ends_with($target, '#kontakt-gesendet') ? 'ok' : (str_ends_with($target, '#kontakt-eingabe') ? 'invalid' : 'error');
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['status' => $status]);
        exit;
    }
    header('Location: ' . $target, true, 303);
    exit;
}

/**
 * Grund eines Fehlers protokollieren (nie Formulareingaben). Ins PHP-Fehlerlog und, wenn möglich, in
 * okapio-kontakt.log eine Ebene über dem Web-Ordner (per SFTP abrufbar, nicht im Internet erreichbar).
 */
function log_reason(string $msg): void
{
    error_log('okapio kontakt: ' . $msg);
    $file = dirname(__DIR__, 3) . '/okapio-kontakt.log';
    if (is_file($file) && (@filesize($file) ?: 0) > 200000) {
        @unlink($file); // einfache Begrenzung
    }
    @file_put_contents($file, gmdate('Y-m-d H:i:s') . ' UTC ' . $msg . "\n", FILE_APPEND | LOCK_EX);
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

/** Sehr einfaches Rate-Limit. Die IP wird nur gehasht gespeichert; abgelaufene Dateien werden bei jedem Aufruf gelöscht. */
function rate_limited(): bool
{
    // Aufräumen: Dateien, deren letzter Eintrag älter als das Zeitfenster ist, enthalten nichts Relevantes mehr.
    foreach (glob(sys_get_temp_dir() . '/okapio_rl_*.json') ?: [] as $old) {
        $mtime = @filemtime($old);
        if ($mtime !== false && $mtime < time() - RATE_WINDOW) {
            @unlink($old);
        }
    }
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
    log_reason('Herkunftsprüfung fehlgeschlagen');
    respond(REDIRECT_ERROR);
}

// Konfiguration vollständig?
if (!empty($configMissing)) {
    log_reason('Konfigurationsdatei nicht gefunden (okapio-config.php eine Ebene über dem Web-Ordner oder assets/php/config.php)');
    respond(REDIRECT_ERROR);
}
foreach (['smtp_host', 'smtp_user', 'smtp_pass'] as $key) {
    if (!isset($CONFIG[$key]) || !is_string($CONFIG[$key]) || $CONFIG[$key] === '') {
        log_reason('Konfiguration unvollständig (' . $key . ')');
        respond(REDIRECT_ERROR);
    }
}
if (!filter_var($MAIL_TO, FILTER_VALIDATE_EMAIL) || !filter_var($MAIL_FROM, FILTER_VALIDATE_EMAIL)) {
    log_reason('Empfänger/Absender nicht konfiguriert');
    respond(REDIRECT_ERROR);
}

// Honeypot: Bots füllen das Feld. Wir tun so, als wäre alles gut.
if (isset($_POST['website']) && $_POST['website'] !== '') {
    respond(REDIRECT_OK);
}

if (rate_limited()) {
    log_reason('Rate-Limit erreicht');
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

// Zwei Mails im selben Design (assets/php/mail-template.php): Benachrichtigung an uns, Bestätigung an die anfragende Person.
// Die Bestätigung enthält bewusst nicht den Nachrichtentext, damit das Formular nicht als Absender für fremde Texte missbraucht werden kann.
require_once __DIR__ . '/mail-template.php';
$siteUrl = rtrim((string)($CONFIG['site_url'] ?? 'https://okapio.de'), '/');
$when    = (new DateTimeImmutable('now', new DateTimeZone('Europe/Berlin')))->format('d.m.Y, H:i') . ' Uhr';
$notify  = mail_notification($siteUrl, $name, $firma, $email, $message, $when);
$confirm = mail_confirmation($siteUrl, $name);

$port   = (int)($CONFIG['smtp_port'] ?? 587);
$secure = (string)($CONFIG['smtp_secure'] ?? ($port === 465 ? 'ssl' : 'tls'));

/** Gemeinsame SMTP-Einstellungen; liefert eine frische Mail mit Absender, Logo und beiden Textfassungen. */
$build = static function (array $content) use ($CONFIG, $port, $secure, $MAIL_FROM): PHPMailer {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host        = $CONFIG['smtp_host'];
    $mail->Port        = $port;
    $mail->SMTPAuth    = true;
    $mail->Username    = $CONFIG['smtp_user'];
    $mail->Password    = $CONFIG['smtp_pass'];
    $mail->SMTPSecure  = $secure === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : ($secure === 'tls' ? PHPMailer::ENCRYPTION_STARTTLS : '');
    $mail->SMTPAutoTLS = $secure === 'tls';
    $mail->SMTPKeepAlive = true;
    $mail->Timeout     = 15;
    $mail->CharSet     = 'UTF-8';
    $mail->Encoding    = PHPMailer::ENCODING_QUOTED_PRINTABLE; // sicher auch für Server ohne 8BITMIME
    $mail->setFrom($MAIL_FROM, 'okapio');
    $mail->isHTML(true);
    $mail->Subject = $content['subject'];
    $mail->Body    = $content['html'];
    $mail->AltBody = $content['text'];
    $mail->addEmbeddedImage(__DIR__ . '/mail/okapio-logo.png', 'okapio-logo', 'okapio-logo.png', 'base64', 'image/png');
    return $mail;
};

try {
    require_once __DIR__ . '/vendor/phpmailer/Exception.php';
    require_once __DIR__ . '/vendor/phpmailer/PHPMailer.php';
    require_once __DIR__ . '/vendor/phpmailer/SMTP.php';

    // 1) Benachrichtigung an uns. Scheitert sie, bekommt die Person eine Fehlermeldung (die Anfrage ist nicht angekommen).
    $mail = $build($notify);
    $mail->addAddress($MAIL_TO);
    $mail->addReplyTo($email);          // validiert; Header-Injection ausgeschlossen
    $mail->send();
} catch (MailException $e) {
    log_reason('SMTP-Versand fehlgeschlagen: ' . $e->getMessage()); // bewusst ohne Formulareingaben
    respond(REDIRECT_ERROR);
} catch (Throwable $e) {
    log_reason('Fehler beim Versand: ' . get_class($e));
    respond(REDIRECT_ERROR);
}

// 2) Bestätigung an die Person. Scheitert sie, ist die Anfrage trotzdem angekommen: nur loggen.
try {
    $reply = $build($confirm);
    $reply->addAddress($email);
    $reply->addReplyTo($MAIL_TO, 'okapio');
    $reply->addCustomHeader('Auto-Submitted', 'auto-replied');
    $reply->addCustomHeader('X-Auto-Response-Suppress', 'All');
    $reply->send();
} catch (Throwable $e) {
    log_reason('Bestätigung nicht versendet: ' . get_class($e));
}

respond(REDIRECT_OK);
