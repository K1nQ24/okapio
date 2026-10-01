<?php
/**
 * okapio – E-Mail-Vorlagen für das Kontaktformular.
 *
 * Zwei Mails mit demselben Aufbau (Logo, Schrift, Farben der Website):
 *  - mail_confirmation(): Bestätigung an die Person, die das Formular abgeschickt hat
 *  - mail_notification(): Benachrichtigung an okapio mit allen Angaben
 *
 * Jede Funktion liefert ['subject' => …, 'html' => …, 'text' => …]. Alle Eingaben werden maskiert.
 * E-Mail-Programme laden keine Webschriften zuverlässig: Apple Mail und Thunderbird zeigen Space Grotesk bzw. Inter,
 * alle anderen die Ersatzschriften (Segoe UI, Helvetica, Arial). Der Kopf (dunkler Streifen mit Logo) ist ein einziges eingebettetes PNG mit festem Hintergrund (cid:okapio-logo), damit der Dunkelmodus von Mail-Apps (z. B. Gmail iOS) ihn nicht umfärbt.
 */

declare(strict_types=1);

const MAIL_PHONE_DISPLAY = '+49 174 329 22 11';
const MAIL_PHONE_LINK    = '+491743292211';
const MAIL_ADDRESS       = 'Brühlweg 22, 71111 Waldenbuch';

function mail_h(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** Gemeinsames Gerüst: dunkler Kopf mit Logo, heller Inhalt, Fußzeile. */
function mail_layout(string $siteUrl, string $title, string $preheader, string $bodyHtml, ?array $cta = null): string
{
    $font    = "'Inter','Segoe UI',Helvetica,Arial,sans-serif";
    $display = "'Space Grotesk','Inter','Segoe UI',Helvetica,Arial,sans-serif";
    $button  = '';
    if ($cta !== null) {
        $button = '<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 4px"><tr>'
            . '<td style="border-radius:999px;background:#0a6cff"><a href="' . mail_h($cta['href']) . '" style="display:inline-block;padding:14px 28px;'
            . 'font:700 16px/1 ' . $font . ';color:#ffffff;text-decoration:none;border-radius:999px">' . mail_h($cta['label']) . '</a></td></tr></table>';
    }
    return '<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light"><meta name="supported-color-schemes" content="light">
<title>' . mail_h($title) . '</title>
<style>
@font-face{font-family:"Space Grotesk";font-weight:300 700;src:url("' . mail_h($siteUrl) . '/assets/fonts/space-grotesk-latin-wght-normal.woff2") format("woff2")}
@font-face{font-family:"Inter";font-weight:100 900;src:url("' . mail_h($siteUrl) . '/assets/fonts/inter-latin-wght-normal.woff2") format("woff2")}
@media (max-width:620px){.wrap{width:100%!important}.pad{padding:28px 22px!important}}
</style></head>
<body style="margin:0;padding:0;background:#e7ebf1">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">' . mail_h($preheader) . '</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#e7ebf1"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background:#fcfdfe;border-radius:18px;overflow:hidden">
<tr><td bgcolor="#0a101b" style="padding:0;background:#0a101b;line-height:0;font-size:0">
<a href="' . mail_h($siteUrl) . '/" style="text-decoration:none"><img src="cid:okapio-logo" width="600" alt="okapio" style="display:block;width:100%;height:auto;border:0;background:#0a101b;color:#fcfdfe;font:700 22px/60px \'Space Grotesk\',Helvetica,Arial,sans-serif"></a>
</td></tr>
<tr><td class="pad" style="padding:38px 40px 34px;font:400 16px/1.6 ' . $font . ';color:#3b4a5e">
<h1 style="margin:0 0 18px;font:700 28px/1.2 ' . $display . ';color:#001842;letter-spacing:-0.01em">' . mail_h($title) . '</h1>
' . $bodyHtml . $button . '
</td></tr>
<tr><td class="pad" style="padding:22px 40px 28px;background:#f3f5f8;border-top:1px solid #d3dae4;font:400 13px/1.6 ' . $font . ';color:#4b5b70">
<strong style="color:#001842">okapio</strong> · Cybersecurity aus einer Hand<br>
' . mail_h(MAIL_ADDRESS) . '<br>
<a href="tel:' . MAIL_PHONE_LINK . '" style="color:#005be6;text-decoration:none">' . mail_h(MAIL_PHONE_DISPLAY) . '</a> ·
<a href="mailto:info@okapio.de" style="color:#005be6;text-decoration:none">info@okapio.de</a><br>
<a href="' . mail_h($siteUrl) . '/impressum.html" style="color:#4b5b70">Impressum</a> ·
<a href="' . mail_h($siteUrl) . '/datenschutz.html" style="color:#4b5b70">Datenschutz</a>
</td></tr></table></td></tr></table></body></html>';
}

/** Zeile „Bezeichnung: Wert“ in der Datentabelle. */
function mail_row(string $label, string $valueHtml): string
{
    return '<tr><td style="padding:9px 14px 9px 0;vertical-align:top;width:92px;font:500 13px/1.5 \'Inter\',\'Segoe UI\',Helvetica,Arial,sans-serif;color:#4b5b70">' . mail_h($label)
        . '</td><td style="padding:9px 0;vertical-align:top;color:#001842">' . $valueHtml . '</td></tr>';
}

/** Bestätigung an die Person, die das Formular abgeschickt hat. Enthält bewusst nicht ihren Nachrichtentext (Missbrauchsschutz). */
function mail_confirmation(string $siteUrl, string $name): array
{
    $steps = [
        ['1', 'Wir lesen Ihre Anfrage', 'Wer sie liest, ist auch die Person, die später mit Ihnen spricht.'],
        ['2', 'Wir melden uns persönlich', 'In der Regel innerhalb von 24 Stunden, per E-Mail oder Telefon.'],
        ['3', 'Erstgespräch', 'Wir klären Ihre Situation und die sinnvollen nächsten Schritte. Ein Gespräch, kein Vertriebsdruck.'],
    ];
    $stepsHtml = '';
    foreach ($steps as [$n, $head, $text]) {
        $stepsHtml .= '<tr><td style="padding:10px 14px 10px 0;vertical-align:top;width:34px"><div style="width:30px;height:30px;line-height:30px;text-align:center;border-radius:50%;background:#e8f0ff;color:#005be6;font:700 14px/30px \'Space Grotesk\',\'Inter\',Helvetica,Arial,sans-serif">' . $n . '</div></td>'
            . '<td style="padding:10px 0;vertical-align:top"><strong style="color:#001842">' . mail_h($head) . '</strong><br><span style="font-size:15px">' . mail_h($text) . '</span></td></tr>';
    }
    $body = '<p style="margin:0 0 14px">Guten Tag ' . mail_h($name) . ',</p>'
        . '<p style="margin:0 0 22px">vielen Dank für Ihre Nachricht. Sie ist bei uns angekommen.</p>'
        . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 22px">' . $stepsHtml . '</table>'
        . '<p style="margin:0 0 14px">Es eilt? Rufen Sie uns gern an: <a href="tel:' . MAIL_PHONE_LINK . '" style="color:#005be6;font-weight:600;text-decoration:none">' . mail_h(MAIL_PHONE_DISPLAY) . '</a>.</p>'
        . '<p style="margin:22px 0 0;padding-top:18px;border-top:1px solid #e7ebf1;font-size:13px;color:#4b5b70">Sie erhalten diese automatische Nachricht, weil Ihre E-Mail-Adresse über das Kontaktformular auf okapio.de angegeben wurde. Haben Sie keine Anfrage gestellt, können Sie diese E-Mail ignorieren.</p>';

    $text = "Guten Tag $name,\n\n"
        . "vielen Dank für Ihre Nachricht. Sie ist bei uns angekommen.\n\n"
        . "So geht es weiter:\n"
        . "1. Wir lesen Ihre Anfrage.\n"
        . "2. Wir melden uns persönlich, in der Regel innerhalb von 24 Stunden, per E-Mail oder Telefon.\n"
        . "3. Im Erstgespräch klären wir Ihre Situation und die nächsten Schritte. Ein Gespräch, kein Vertriebsdruck.\n\n"
        . 'Es eilt? Rufen Sie uns gern an: ' . MAIL_PHONE_DISPLAY . "\n\n"
        . "--\nokapio · Cybersecurity aus einer Hand\n" . MAIL_ADDRESS . "\n" . MAIL_PHONE_DISPLAY . ' · info@okapio.de' . "\n"
        . "$siteUrl/impressum.html · $siteUrl/datenschutz.html\n\n"
        . "Sie erhalten diese automatische Nachricht, weil Ihre E-Mail-Adresse über das Kontaktformular auf okapio.de angegeben wurde. "
        . "Haben Sie keine Anfrage gestellt, können Sie diese E-Mail ignorieren.\n";

    return [
        'subject' => 'Ihre Anfrage bei okapio',
        'html'    => mail_layout($siteUrl, 'Danke für Ihre Anfrage.', 'Ihre Nachricht ist bei uns angekommen. Wir melden uns in der Regel innerhalb von 24 Stunden.', $body),
        'text'    => $text,
    ];
}

/** Benachrichtigung an okapio mit allen Angaben und einer Antwort-Schaltfläche. */
function mail_notification(string $siteUrl, string $name, string $firma, string $email, string $message, string $when): array
{
    $rows = mail_row('Name', mail_h($name))
        . mail_row('Firma', mail_h($firma))
        . mail_row('E-Mail', '<a href="mailto:' . mail_h(rawurlencode($email)) . '" style="color:#005be6;text-decoration:none">' . mail_h($email) . '</a>')
        . mail_row('Zeitpunkt', mail_h($when));
    $body = '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 18px;border-top:1px solid #e7ebf1;border-bottom:1px solid #e7ebf1">' . $rows . '</table>'
        . '<p style="margin:0 0 8px;font:500 13px/1.5 \'Inter\',\'Segoe UI\',Helvetica,Arial,sans-serif;color:#4b5b70">Nachricht</p>'
        . '<div style="padding:16px 18px;background:#f3f5f8;border-radius:12px;color:#001842;white-space:pre-wrap">' . mail_h($message) . '</div>'
        . '<p style="margin:22px 0 0;font-size:13px;color:#4b5b70">Die anfragende Person hat eine Bestätigung im selben Design erhalten.</p>';
    $subjectName = mb_substr($name, 0, 60, 'UTF-8');
    $reply = 'mailto:' . rawurlencode($email) . '?subject=' . rawurlencode('Ihre Anfrage bei okapio');

    $text = "Neue Anfrage über die Website\n\n"
        . "Name:      $name\nFirma:     $firma\nE-Mail:    $email\nZeitpunkt: $when\n\n"
        . "Nachricht:\n$message\n\n"
        . "Die anfragende Person hat eine Bestätigung im selben Design erhalten.\n";

    return [
        'subject' => 'Neue Anfrage: ' . $subjectName,
        'html'    => mail_layout($siteUrl, 'Neue Anfrage.', 'Neue Anfrage von ' . $name . ' (' . $firma . ')', $body, ['label' => 'Antworten', 'href' => $reply]),
        'text'    => $text,
    ];
}
