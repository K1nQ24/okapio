<?php
/**
 * okapio – Konfiguration des Kontaktformulars (VORLAGE, ohne Zugangsdaten).
 *
 * So geht es:
 *  1. Diese Datei kopieren und als okapio-config.php EINE EBENE ÜBER den Web-Ordner legen (neben public_html, nicht hinein).
 *     Alternativ als config.php in dieses Verzeichnis (dann per assets/php/.htaccess vor Abruf geschützt).
 *  2. Werte eintragen. Die echte Datei gehört NICHT ins Git-Repository (.gitignore).
 *
 * SMTP-Daten des IONOS-Postfachs: smtp.ionos.de, Port 587 (STARTTLS) oder 465 (SSL). Benutzername ist die volle Mail-Adresse.
 * IONOS verlangt, dass der Absender (mail_from) dem angemeldeten Postfach oder einem seiner Aliase entspricht.
 */
return [
    'smtp_host'   => 'smtp.ionos.de',
    'smtp_port'   => 587,
    'smtp_secure' => 'tls',                 // 'tls' (Port 587) oder 'ssl' (Port 465)
    'smtp_user'   => 'info@okapio.de',
    'smtp_pass'   => '',                    // Passwort des Postfachs (hier eintragen, nie weitergeben)
    'mail_to'     => 'info@okapio.de',
    'mail_from'   => 'info@okapio.de',
];
