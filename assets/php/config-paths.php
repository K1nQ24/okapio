<?php
/**
 * okapio – Orte, an denen die Konfigurationsdatei gesucht wird (in dieser Reihenfolge).
 * Gemeinsam genutzt von kontakt.php und diagnose.php. Enthält keine Zugangsdaten.
 */

declare(strict_types=1);

return (static function (): array {
    $docRoot = dirname(__DIR__, 2);                                  // Web-Ordner (assets/php -> assets -> Web-Ordner)
    $paths   = [dirname($docRoot) . '/okapio-config.php'];            // eine Ebene über dem Web-Ordner
    // Hetzner Webhosting: Der Web-Ordner liegt unter /usr/www/users/<Konto>, der SFTP-Stammordner (mit public_html) unter /usr/home/<Konto>.
    $paths[] = '/usr/home/' . basename($docRoot) . '/okapio-config.php';
    $home    = getenv('HOME');
    if (is_string($home) && $home !== '') {
        $paths[] = rtrim($home, '/') . '/okapio-config.php';
    }
    $paths[] = __DIR__ . '/config.php';                               // Notlösung, per .htaccess gesperrt
    return array_values(array_unique($paths));
})();
