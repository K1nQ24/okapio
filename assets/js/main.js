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
  var fineQuery = window.matchMedia ? window.matchMedia('(hover: hover) and (pointer: fine)') : null;
  var finePointer = !!(fineQuery && fineQuery.matches);

  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  /* ---------- Menü (mobil) ----------
     Zweck: Navigation auf kleinen Bildschirmen ein- und ausklappen. Tastatur: Esc schließt und gibt den Fokus zurück. */
  function initNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-nav]');
    if (!toggle || !nav) { return; }
    var label = toggle.querySelector('[data-nav-toggle-label]') || toggle;

    function setOpen(open, returnFocus) {
      nav.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      label.textContent = open ? 'Menü schließen' : 'Menü öffnen';
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
      if (meta) { meta.setAttribute('content', isDark() ? '#000f2b' : '#001842'); }
    }
    function apply() {
      if (isDark()) { root.removeAttribute('data-mode'); } else { root.setAttribute('data-mode', 'dark'); }
      try { localStorage.setItem('okapio-mode', isDark() ? 'dark' : 'light'); } catch (e) { /* Speicher gesperrt */ }
      sync();
    }
    btn.addEventListener('click', function () {
      /* View Transition: der neue Modus breitet sich als Kreis vom Schalter aus. Ohne Unterstützung oder bei
         reduzierter Bewegung wechselt die Darstellung sofort. */
      if (reduce || !document.startViewTransition || !root.animate) { apply(); return; }
      var r = btn.getBoundingClientRect();
      var x = r.left + r.width / 2, y = r.top + r.height / 2;
      var radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      var transition = document.startViewTransition(apply);
      transition.ready.then(function () {
        root.animate(
          { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(function () { /* Übergang abgebrochen: Modus ist trotzdem gesetzt */ });
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
        if (!entry.isIntersecting) { return; }
        var el = entry.target;
        el.classList.add('is-in');
        revealIO.unobserve(el);
        /* Nach dem Einblenden die Staffel-Verzögerung entfernen, damit Hover-Übergänge sofort reagieren. */
        el.addEventListener('transitionend', function done(ev) {
          if (ev.target === el && ev.propertyName === 'opacity') { el.classList.add('is-done'); el.removeEventListener('transitionend', done); }
        });
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
     Zweck: strukturelle Zahlen (7 · 6 · 1) laufen einmal hoch. Nur bei echten Zahlen (data-count). */
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

  /* ---------- Zeiger-Effekte (nur echte Zeiger, nie bei reduzierter Bewegung) ----------
     - Lichtkegel: Karten mit [data-spot] bekommen die Zeigerposition als --mx/--my (CSS zeichnet den Verlauf).
     - Neigung: Der Hero-Graph ([data-tilt]) folgt dem Zeiger um wenige Pixel. Zweck: Tiefe, ohne abzulenken. */
  function onPointerFrame(el, handler) {
    var frame = 0, last = null;
    el.addEventListener('pointermove', function (e) {
      last = e;
      if (!frame) { frame = requestAnimationFrame(function () { frame = 0; handler(last); }); }
    }, { passive: true });
  }
  function initPointer() {
    if (!finePointer || reduce) { return; }
    $all('[data-spot]').forEach(function (card) {
      onPointerFrame(card, function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left).toFixed(0) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top).toFixed(0) + 'px');
      });
    });
    var tilt = document.querySelector('[data-tilt]');
    var host = tilt ? tilt.closest('section') : null;
    if (!tilt || !host) { return; }
    onPointerFrame(host, function (e) {
      var r = host.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.setProperty('--tx', (px * -16).toFixed(1) + 'px');
      tilt.style.setProperty('--ty', (py * -12).toFixed(1) + 'px');
    });
    host.addEventListener('pointerleave', function () { tilt.style.setProperty('--tx', '0px'); tilt.style.setProperty('--ty', '0px'); });
  }

  /* ---------- Scroll-gekoppelte Effekte (ein rAF-getakteter passiver Listener) ----------
     - Header: schrumpft und bekommt Blur-Hintergrund, sobald gescrollt wird; Lesefortschritt als Linie.
     - Scrollspy: Der Navigationspunkt der aktuellen Sektion wird markiert (aria-current).
     - Parallax: Streifenmuster bewegt sich langsamer als der Inhalt (Tiefe).
     - Timeline: Linie füllt sich, Schritte werden aktiv, die Schrittanzeige zählt mit. */
  function initScroll() {
    var header = document.querySelector('[data-header]');
    var progressBar = document.querySelector('[data-progress]');
    var stepNow = document.querySelector('[data-step-now]');
    var stepFill = document.querySelector('[data-step-fill]');
    var currentStep = -1, stepTimer = null;
    /* Scrollspy: Sektion → Link der Hauptnavigation (direkt oder über die Gruppe, die den Link enthält) */
    var spy = $all('main section[id]').map(function (section) {
      var link = document.querySelector('.site-nav > ul > li > a[href="#' + section.id + '"]');
      var inGroup = document.querySelector('.nav-group__list a[href="#' + section.id + '"]');
      return { el: section, link: link, group: inGroup ? inGroup.closest('[data-nav-group]') : null };
    }).filter(function (s) { return s.link || s.group; });
    var activeSpy = null;
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

      /* Lesefortschritt (auch bei reduzierter Bewegung: er folgt nur dem Scrollen, animiert nichts) */
      if (progressBar) {
        var max = Math.max(1, (root.scrollHeight || document.body.scrollHeight) - vh);
        progressBar.style.setProperty('--progress', clamp(y / max, 0, 1).toFixed(4));
      }

      /* Scrollspy: letzte Sektion, deren Oberkante die gedachte Leselinie überschritten hat */
      if (spy.length) {
        var probe = vh * 0.35, found = null;
        spy.forEach(function (s) { if (s.el.getBoundingClientRect().top <= probe) { found = s; } });
        if (found && found.el.getBoundingClientRect().bottom < probe) { found = null; }
        if (found !== activeSpy) {
          if (activeSpy) {
            if (activeSpy.link) { activeSpy.link.removeAttribute('aria-current'); }
            if (activeSpy.group) { activeSpy.group.classList.remove('is-current'); }
          }
          if (found) {
            if (found.link) { found.link.setAttribute('aria-current', 'true'); }
            if (found.group) { found.group.classList.add('is-current'); }
          }
          activeSpy = found;
        }
      }

      if (!reduce) {
        parallax.forEach(function (p) {
          var r = p.host.getBoundingClientRect();
          if (r.bottom < 0 || r.top > vh) { return; }
          p.el.style.setProperty('--py', (-r.top * p.factor).toFixed(1) + 'px');
        });
      }

      if (timeline) {
        var tr = timeline.getBoundingClientRect();
        var line = vh * 0.6;                         /* gedachte Leselinie */
        if (!reduce) { timeline.style.setProperty('--progress', clamp((line - tr.top) / tr.height, 0, 1).toFixed(3)); }
        var idx = 0;
        steps.forEach(function (step, i) {
          var active = step.getBoundingClientRect().top < line;
          step.classList.toggle('is-active', active);
          if (active) { idx = i; }
        });
        steps.forEach(function (step, i) { step.classList.toggle('is-current', i === idx && step.classList.contains('is-active')); });
        /* Schrittanzeige links: zählt mit (Zustand, keine Bewegung); mit Bewegung kurz ausgeblendet beim Wechsel. */
        if (stepNow && idx !== currentStep) {
          currentStep = idx;
          var write = function () {
            stepNow.textContent = (currentStep + 1 < 10 ? '0' : '') + (currentStep + 1);
            stepNow.classList.remove('is-changing');
          };
          clearTimeout(stepTimer);
          if (reduce) { write(); } else { stepNow.classList.add('is-changing'); stepTimer = setTimeout(write, 150); }
          if (stepFill) { stepFill.style.setProperty('--step-progress', ((idx + 1) / steps.length).toFixed(3)); }
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
    initPointer();
    initScroll();
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); } else { init(); }
})();
