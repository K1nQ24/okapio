<?php
/**
 * okapio – Diagnose für das Kontaktformular (NUR ZUM TESTEN, danach vom Server LÖSCHEN).
 *
 * Aufruf im Browser: https://okapio.de/assets/php/diagnose.php
 * Prüft PHP-Version, Konfigurationsdatei, Dateien, Schreibrechte und die Anmeldung am Mailserver.
 * Es wird keine Mail verschickt. Passwörter werden nicht angezeigt.
 */

declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

header('Content-Type: text/plain; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');
ini_set('display_errors', '1');

function line(string $label, bool $ok, string $note = ''): void
{
    echo ($ok ? '[ OK ] ' : '[FEHLER] ') . $label . ($note !== '' ? ' - ' . $note : '') . "\n";
}

echo "okapio Formular-Diagnose (danach diese Datei vom Server löschen)\n\n";

// 1) PHP
line('PHP-Version ' . PHP_VERSION . ' (benötigt 8.1 oder neuer)', version_compare(PHP_VERSION, '8.1.0', '>='));
line('Erweiterung mbstring', extension_loaded('mbstring'));
line('Erweiterung openssl (für TLS)', extension_loaded('openssl'));

// 2) Dateien
$base = __DIR__;
foreach (['kontakt.php', 'config-paths.php', 'mail-template.php', 'mail/okapio-logo.png', 'vendor/phpmailer/PHPMailer.php', 'vendor/phpmailer/SMTP.php', 'vendor/phpmailer/Exception.php'] as $f) {
    line('Datei assets/php/' . $f, is_file($base . '/' . $f));
}

// 3) Konfiguration
$candidates = is_file($base . '/config-paths.php') ? require $base . '/config-paths.php' : [dirname($base, 3) . '/okapio-config.php', $base . '/config.php'];
$CONFIG = [];
$found = null;
foreach ($candidates as $c) {
    if (is_file($c)) {
        $found = $c;
        $loaded = @include $c;
        if (is_array($loaded)) {
            $CONFIG = $loaded;
            break;
        }
    }
}
echo "\nGesucht wurde in:\n";
foreach ($candidates as $c) {
    echo '  - ' . $c . (is_file($c) ? '  (vorhanden)' : '  (nicht vorhanden)') . "\n";
}
echo '  Web-Ordner: ' . dirname($base, 2) . "\n";
line('Konfigurationsdatei gefunden und lesbar als PHP-Array', $CONFIG !== [], $found === null ? 'keine Datei gefunden' : ($CONFIG === [] ? 'Datei vorhanden, aber ungültig: fehlt "return [ ... ];" oder falsche Anführungszeichen?' : ''));
foreach (['smtp_host', 'smtp_user', 'smtp_pass', 'mail_to', 'mail_from'] as $k) {
    $v = $CONFIG[$k] ?? '';
    line('Eintrag ' . $k, is_string($v) && $v !== '', $k === 'smtp_pass' ? (is_string($v) && $v !== '' ? 'gesetzt, ' . strlen($v) . ' Zeichen' : 'leer') : (is_string($v) ? $v : 'fehlt'));
}
$port   = (int)($CONFIG['smtp_port'] ?? 587);
$secure = (string)($CONFIG['smtp_secure'] ?? ($port === 465 ? 'ssl' : 'tls'));
echo "  smtp_port: $port, smtp_secure: $secure\n";

// 4) Schreibrechte für das Fehlerprotokoll (neben der Konfigurationsdatei bzw. an einem der Suchorte)
$logOk = false; $logWhere = '';
$dirs = $found !== null ? [dirname($found)] : [];
foreach ($candidates as $c) { $dirs[] = dirname($c); }
foreach (array_unique($dirs) as $d) {
    if (is_dir($d) && is_writable($d) && @file_put_contents($d . '/okapio-kontakt.log', gmdate('Y-m-d H:i:s') . " UTC Diagnose-Test\n", FILE_APPEND | LOCK_EX) !== false) { $logOk = true; $logWhere = $d; break; }
}
line('Schreiben von okapio-kontakt.log', $logOk, $logOk ? $logWhere : 'kein beschreibbarer Ordner unter den Suchorten (unkritisch)');

// 5) Verbindung zum Mailserver
if (($CONFIG['smtp_host'] ?? '') !== '') {
    echo "\nVerbindung zu " . $CONFIG['smtp_host'] . ':' . $port . " ...\n";
    $errno = 0; $errstr = '';
    $fp = @fsockopen(($secure === 'ssl' ? 'ssl://' : '') . $CONFIG['smtp_host'], $port, $errno, $errstr, 8);
    line('Netzverbindung zum Mailserver', $fp !== false, $fp === false ? "$errstr ($errno): Hetzner blockiert ggf. ausgehende Verbindungen oder Server/Port sind falsch" : 'Server antwortet');
    if ($fp) {
        fclose($fp);
    }

    // 6) Anmeldung (ohne Mail zu versenden)
    if (is_file($base . '/vendor/phpmailer/PHPMailer.php') && ($CONFIG['smtp_user'] ?? '') !== '' && ($CONFIG['smtp_pass'] ?? '') !== '') {
        require_once $base . '/vendor/phpmailer/Exception.php';
        require_once $base . '/vendor/phpmailer/PHPMailer.php';
        require_once $base . '/vendor/phpmailer/SMTP.php';
        try {
            $m = new PHPMailer(true);
            $m->isSMTP();
            $m->Host = $CONFIG['smtp_host'];
            $m->Port = $port;
            $m->SMTPAuth = true;
            $m->Username = $CONFIG['smtp_user'];
            $m->Password = $CONFIG['smtp_pass'];
            $m->SMTPSecure = $secure === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : ($secure === 'tls' ? PHPMailer::ENCRYPTION_STARTTLS : '');
            $m->SMTPAutoTLS = $secure === 'tls';
            $m->Timeout = 12;
            $ok = $m->smtpConnect();
            line('Anmeldung am Mailserver', $ok, $ok ? 'Benutzername und Passwort werden akzeptiert' : $m->ErrorInfo);
            $m->smtpClose();
        } catch (Throwable $e) {
            line('Anmeldung am Mailserver', false, preg_replace('/\s+/', ' ', $e->getMessage()));
        }
    }
}
echo "\nFertig. Bitte diese Datei jetzt vom Server löschen.\n";
