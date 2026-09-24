/* ==========================================================================
   okapio – main.js (Besitzer: Agent MOTION)
   Vanilla JS, keine Abhängigkeiten, kein innerHTML, kein eval.
   Alle Animationen greifen nur über data-Attribute und die SVG-IDs aus /docs/svg-manifest.md.
   Ohne JS bleibt die Seite vollständig lesbar (Basis: init.js setzt nur die Klasse "js").
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduceQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var reduce = !!(reduceQuery && reduceQuery.matches);
  var hasIO = 'IntersectionObserver' in window;

  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  /* ---------- Menü (mobil) ----------
     Zweck: Navigation auf kleinen Bildschirmen ein- und ausklappen. Tastatur: Esc schließt und gibt den Fokus zurück. */
  function initNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-nav]');
    if (!toggle || !nav) { return; }

    function setOpen(open, returnFocus) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? 'Menü schließen' : 'Menü öffnen';
      if (!open && returnFocus) { toggle.focus(); }
    }
    toggle.addEventListener('click', function () { setOpen(!nav.classList.contains('is-open')); });
    nav.addEventListener('click', function (e) {
      if (e.target && e.target.closest && e.target.closest('a')) { setOpen(false); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false, true); }
    });
    if (window.matchMedia) {
      var mq = window.matchMedia('(min-width: 64em)');
      var onChange = function () { if (mq.matches) { setOpen(false); } };
      if (mq.addEventListener) { mq.addEventListener('change', onChange); }
    }
  }

  /* ---------- Nav-Gruppen (Dropdown) ----------
     Zweck: Menü kürzen. Ab 64em öffnet die Gruppe als Popover (Hover mit kurzer Schließ-Verzögerung, Klick, Tastatur),
     mobil als Aufklapp-Liste im Menü. Esc und Klick außerhalb schließen. Ohne JS bleiben alle Links sichtbar. */
  function initNavGroups() {
    var groups = $all('[data-nav-group]');
    if (!groups.length) { return; }
    var canHover = window.matchMedia ? window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 64em)') : null;

    function setOpen(group, open) {
      group.classList.toggle('is-open', open);
      var btn = group.querySelector('[data-nav-group-btn]');
      if (btn) { btn.setAttribute('aria-expanded', open ? 'true' : 'false'); }
    }
    function closeAll(except) { groups.forEach(function (g) { if (g !== except) { setOpen(g, false); } }); }

    groups.forEach(function (group) {
      var btn = group.querySelector('[data-nav-group-btn]');
      var timer = null;
      if (!btn) { return; }
      btn.addEventListener('click', function () {
        var willOpen = !group.classList.contains('is-open');
        closeAll(group);
        setOpen(group, willOpen);
      });
      /* Hover nur mit echtem Zeiger. Kurze Verzögerung beim Schließen, damit die Maus die Lücke zum Popover überbrücken kann. */
      group.addEventListener('mouseenter', function () {
        if (!canHover || !canHover.matches) { return; }
        clearTimeout(timer); closeAll(group); setOpen(group, true);
      });
      group.addEventListener('mouseleave', function () {
        if (!canHover || !canHover.matches) { return; }
        clearTimeout(timer);
        timer = setTimeout(function () { setOpen(group, false); }, 320);
      });
      group.addEventListener('focusout', function (e) {
        if (!group.contains(e.relatedTarget)) { setOpen(group, false); }
      });
      group.addEventListener('click', function (e) {
        if (e.target && e.target.closest && e.target.closest('.nav-group__list a')) { setOpen(group, false); }
      });
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest || !e.target.closest('[data-nav-group]')) { closeAll(null); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') { return; }
      var open = groups.filter(function (g) { return g.classList.contains('is-open'); })[0];
      if (open) { setOpen(open, false); var b = open.querySelector('[data-nav-group-btn]'); if (b) { b.focus(); } }
    });
  }

  /* ---------- Darstellung hell/dunkel ----------
     Zweck: Schalter für den Dunkelmodus. Die Wahl wird nur auf Wunsch der Nutzerin oder des Nutzers im Browser gespeichert. */
  function initModeToggle() {
    var btn = document.querySelector('[data-mode-toggle]');
    if (!btn) { return; }
    function isDark() { return root.getAttribute('data-mode') === 'dark'; }
    function sync() {
      btn.setAttribute('aria-pressed', isDark() ? 'true' : 'false');
      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) { meta.setAttribute('content', isDark() ? '#111d27' : '#e5eef2'); }
    }
    btn.addEventListener('click', function () {
      if (isDark()) { root.removeAttribute('data-mode'); } else { root.setAttribute('data-mode', 'dark'); }
      try { localStorage.setItem('okapio-mode', isDark() ? 'dark' : 'light'); } catch (e) { /* Speicher gesperrt */ }
      sync();
    });
    sync();
  }

  /* ---------- Formular ----------
     Zweck: verständliche Fehlermeldungen direkt am Feld. Ohne JS greift die native Validierung und die
     serverseitige Prüfung in kontakt.php. Das Formular wird immer normal gesendet (kein fetch). */
  function initForm() {
    var form = document.querySelector('[data-form]');
    if (!form) { return; }
    var summary = form.querySelector('[data-error-summary]');

    function fieldOf(input) { return input.closest('.field'); }
    function errorOf(input) { return document.getElementById(input.id + '-err'); }
    function setError(input, on) {
      var field = fieldOf(input), err = errorOf(input);
      if (field) { field.classList.toggle('field--error', on); }
      if (err) { err.hidden = !on; }
      input.setAttribute('aria-invalid', on ? 'true' : 'false');
    }
    function isValid(input) {
      if (input.type === 'checkbox') { return input.checked; }
      var v = input.value.trim();
      if (input.required && v === '') { return false; }
      if (input.type === 'email') { return input.validity ? !input.validity.typeMismatch && v !== '' : v.indexOf('@') > 0; }
      return true;
    }

    var inputs = $all('input[required], textarea[required]', form);
    inputs.forEach(function (input) {
      input.addEventListener('input', function () { if (isValid(input)) { setError(input, false); } });
      input.addEventListener('change', function () { if (isValid(input)) { setError(input, false); } });
    });

    form.addEventListener('submit', function (e) {
      var firstInvalid = null;
      inputs.forEach(function (input) {
        var ok = isValid(input);
        setError(input, !ok);
        if (!ok && !firstInvalid) { firstInvalid = input; }
      });
      if (firstInvalid) {
        e.preventDefault();
        if (summary) { summary.hidden = false; summary.focus(); }
      } else if (summary) {
        summary.hidden = true;
      }
    });

    /* Statusmeldung nach dem Redirect von kontakt.php (#kontakt-gesendet / -fehler / -eingabe):
       Fokus setzen, damit Screenreader die Meldung vorlesen. */
    var hash = window.location.hash.replace('#', '');
    if (/^kontakt-(gesendet|fehler|eingabe)$/.test(hash)) {
      var status = document.getElementById(hash);
      if (status) { status.setAttribute('tabindex', '-1'); status.focus(); }
    }
  }

  /* Alles Weitere sind Animationen. Bei reduzierter Bewegung oder ohne IntersectionObserver zeigen wir
     Endzustände sofort und starten nichts. */
  function showEverything() {
    $all('[data-reveal]').forEach(function (el) { el.classList.add('is-in'); });
    $all('[data-illustration]').forEach(function (el) { el.classList.add('is-playing'); });
  }

  /* ---------- Staffel-Indizes ----------
     Zweck: CSS bekommt --i je Kind von [data-stagger], um Verzögerungen zu staffeln. */
  function initStagger() {
    $all('[data-stagger]').forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) { child.style.setProperty('--i', String(i)); });
    });
  }

  /* ---------- Reveal & Illustrationen starten ----------
     Zweck: Reveal beim Eintreten in den Viewport; Illustrationen spielen genau einmal, wenn sie sichtbar werden. */
  function initObservers() {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); revealIO.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $all('[data-reveal]').forEach(function (el) { revealIO.observe(el); });

    var illuIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-playing'); illuIO.unobserve(entry.target); }
      });
    }, { threshold: 0.3 });
    $all('[data-illustration]').forEach(function (el) { illuIO.observe(el); });
  }

  /* ---------- Zähler ----------
     Zweck: strukturelle Zahlen (5 · 4 · 1) laufen einmal hoch. Nur bei echten Zahlen (data-count). */
  function initCounters() {
    var els = $all('[data-count]');
    if (!els.length) { return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        io.unobserve(entry.target);
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        if (!isFinite(target)) { return; }
        var start = null, dur = 900;
        function tick(ts) {
          if (start === null) { start = ts; }
          var t = clamp((ts - start) / dur, 0, 1);
          var eased = 1 - Math.pow(1 - t, 3);
          el.textContent = String(Math.round(target * eased));
          if (t < 1) { requestAnimationFrame(tick); } else { el.textContent = String(target); }
        }
        el.textContent = '0';
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Scroll-gekoppelte Effekte (ein rAF-getakteter passiver Listener) ----------
     - Header: schrumpft und bekommt Blur-Hintergrund, sobald gescrollt wird.
     - Parallax: Streifenmuster bewegt sich langsamer als der Inhalt (Tiefe).
     - Timeline: Linie füllt sich, Schritte werden aktiv. */
  function initScroll() {
    var header = document.querySelector('[data-header]');
    var parallax = $all('[data-parallax]').map(function (el) {
      return { el: el, factor: parseFloat(el.getAttribute('data-parallax')) || 0.1, host: el.closest('section') || el.parentElement };
    });
    var timeline = document.querySelector('[data-timeline]');
    var steps = timeline ? $all('.timeline__step', timeline) : [];
    var ticking = false;

    function update() {
      ticking = false;
      var y = window.pageYOffset || root.scrollTop || 0;
      var vh = window.innerHeight || root.clientHeight;

      if (header) { header.classList.toggle('is-scrolled', y > 24); }

      if (!reduce) {
        parallax.forEach(function (p) {
          var r = p.host.getBoundingClientRect();
          if (r.bottom < 0 || r.top > vh) { return; }
          p.el.style.setProperty('--py', (-r.top * p.factor).toFixed(1) + 'px');
        });

        if (timeline) {
          var tr = timeline.getBoundingClientRect();
          var line = vh * 0.6;                       /* gedachte Leselinie */
          var progress = clamp((line - tr.top) / tr.height, 0, 1);
          timeline.style.setProperty('--progress', progress.toFixed(3));
          steps.forEach(function (step) {
            step.classList.toggle('is-active', step.getBoundingClientRect().top < line);
          });
        }
      }
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  function init() {
    initNav();
    initNavGroups();
    initModeToggle();
    initForm();
    if (reduce || !hasIO) {
      showEverything();
      initScroll();            /* nur Header-Zustand; Parallax/Timeline sind bei reduce deaktiviert */
      return;
    }
    initStagger();
    initObservers();
    initCounters();
    initScroll();
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
