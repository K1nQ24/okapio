/* okapio – init.js (Besitzer: MOTION)
   Zweck: Klasse "js" setzen und die gespeicherte Darstellung (hell/dunkel) anwenden, bevor der erste Paint passiert.
   Nur dann greifen die Ausgangszustände der Animationen (Reveal, Draw); ohne JavaScript bleibt die Seite vollständig
   sichtbar, lesbar und hell.
   Bewusst separate, winzige Datei statt Inline-Skript (strikte CSP ohne unsafe-inline).
   Darstellung: Standard ist hell. Nur eine vom Nutzer per Schalter getroffene Wahl wird im Browser (localStorage,
   Schlüssel "okapio-mode") gespeichert; sie wird nicht an den Server übertragen. */
document.documentElement.classList.add('js');
(function () {
  try {
    if (localStorage.getItem('okapio-mode') === 'dark') { document.documentElement.setAttribute('data-mode', 'dark'); }
  } catch (e) { /* Speicher gesperrt: Standard (hell) bleibt */ }
})();
/* Gemerkte Position des Darstellungsschalters (neben dem Cookiebot-Symbol) sofort setzen, damit er beim Laden nicht springt.
   Wird von main.js (initCookiebotAlign) geschrieben; nur Zahlen, nicht an den Server übertragen. */
(function () {
  try {
    var v = localStorage.getItem('okapio-fab-' + (window.innerWidth <= 480 ? 'm' : 'd'));
    var m = /^(-?\d{1,4})\|(\d{1,4})$/.exec(v || '');
    if (m) {
      document.documentElement.style.setProperty('--fab-mode-x', m[1] + 'px');
      document.documentElement.style.setProperty('--fab-mode-y', m[2] + 'px');
    }
  } catch (e) { /* Speicher gesperrt: Standardposition */ }
})();
