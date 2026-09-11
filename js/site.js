/* ==================================================================
   Prestige Automobile — Prototype 1, Basic package
   Plain ES2019. No framework, no build step, no third-party requests.
   ================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------------
     Footer year
     ---------------------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());


  /* ----------------------------------------------------------------
     Menu panel. The toggle is mobile-only (hidden from 901px up by
     css/site.css), where it is the only way to reach the nav.
     ---------------------------------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var panel = document.getElementById('nav-panel');

  if (toggle && panel) {
    var setMenu = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      panel.hidden = !open;
    };

    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (!panel.contains(e.target) && !toggle.contains(e.target)) setMenu(false);
    });
  }


  /* ----------------------------------------------------------------
     Sticky header. Hides on the way down, returns on the way up, on
     every width. Below THRESHOLD it always stays put, so the hero is
     never covered and a short page can never hide its own navigation.
     ---------------------------------------------------------------- */
  var header = document.querySelector('.site-header');

  if (header) {
    var THRESHOLD = 180;   // px scrolled before hiding is allowed at all
    var DELTA = 6;         // px of travel needed to count as a direction
    var lastY = window.pageYOffset;
    var queued = false;

    var menuIsOpen = function () {
      return !!toggle && toggle.getAttribute('aria-expanded') === 'true';
    };

    var show = function () { header.classList.remove('is-hidden'); };

    var update = function () {
      queued = false;
      /* Clamp: iOS rubber-banding reports negative and over-scrolled values. */
      var y = Math.max(0, window.pageYOffset);

      header.classList.toggle('is-stuck', y > 8);

      if (y <= THRESHOLD) { show(); lastY = y; return; }

      var moved = y - lastY;
      if (Math.abs(moved) < DELTA) return;   // ignore jitter, keep lastY

      /* Never hide the header out from under an open menu or a keyboard
         user tabbing through it. */
      if (moved > 0 && !menuIsOpen() && !header.contains(document.activeElement)) {
        header.classList.add('is-hidden');
      } else if (moved < 0) {
        show();
      }
      lastY = y;
    };

    window.addEventListener('scroll', function () {
      if (queued) return;
      queued = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    /* Tabbing into the header, or opening the menu, must reveal it. */
    header.addEventListener('focusin', show);
    if (toggle) toggle.addEventListener('click', show);
  }


  /* ----------------------------------------------------------------
     Scroll reveal — fade + 12px rise, once per element.
     ---------------------------------------------------------------- */
  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealables, function (el) {
      el.classList.add('is-visible');
    });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    Array.prototype.forEach.call(revealables, function (el) { observer.observe(el); });
  }


  /* ----------------------------------------------------------------
     Contact form.

     PROTOTYPE BEHAVIOUR: this validates the input and shows a local
     confirmation. Nothing is transmitted — there is no endpoint and no
     network request. To make it live, give the <form> an `action` and
     `method` (or POST it to a handler from `submit` below) and delete
     the `showSuccess()` shortcut.
     ---------------------------------------------------------------- */
  var form = document.getElementById('contact-form');
  var success = document.getElementById('form-success');

  if (form && success) {
    var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var PHONE = /^[+()\d][\d\s\-().]{5,}$/;

    var fieldOf = function (control) { return control.closest('[data-field]'); };

    var setError = function (control, message) {
      var field = fieldOf(control);
      if (!field) return;
      if (message) {
        field.classList.add('field--invalid');
        control.setAttribute('aria-invalid', 'true');
        var slot = field.querySelector('[data-error-text]');
        if (slot) slot.textContent = message;
      } else {
        field.classList.remove('field--invalid');
        control.removeAttribute('aria-invalid');
      }
    };

    /* Returns an error string, or '' when the control is acceptable. */
    var validate = function (control) {
      var value = (control.value || '').trim();

      if (control.type === 'checkbox') {
        return control.checked ? '' : 'Bevestig dit voordat u verstuurt.';
      }
      if (control.required && !value) {
        switch (control.id) {
          case 'name': return 'Vul uw naam in.';
          case 'email': return 'Vul uw e-mailadres in.';
          case 'interest': return 'Maak een keuze.';
          case 'message': return 'Voeg een kort bericht toe.';
          default: return 'Dit veld is verplicht.';
        }
      }
      if (control.id === 'email' && value && !EMAIL.test(value)) {
        return 'Vul een geldig e-mailadres in.';
      }
      if (control.id === 'phone' && value && !PHONE.test(value)) {
        return 'Vul een geldig telefoonnummer in.';
      }
      if (control.id === 'message' && value && value.length < 10) {
        return 'Voeg wat meer toelichting toe.';
      }
      return '';
    };

    var controls = form.querySelectorAll('.field__control, .checkbox');

    /* Validate on blur, but only clear errors while typing — re-running
       the full check on every keystroke shouts at someone mid-word. */
    Array.prototype.forEach.call(controls, function (control) {
      control.addEventListener('blur', function () {
        setError(control, validate(control));
      });
      control.addEventListener('input', function () {
        if (fieldOf(control).classList.contains('field--invalid') && !validate(control)) {
          setError(control, '');
        }
      });
      if (control.type === 'checkbox' || control.tagName === 'SELECT') {
        control.addEventListener('change', function () {
          setError(control, validate(control));
        });
      }
    });

    var showSuccess = function () {
      var name = (form.querySelector('#name').value || '').trim().split(/\s+/)[0];
      var slot = document.getElementById('success-message');
      if (slot) {
        slot.textContent = (name ? 'Dank u wel, ' + name + '.' : 'Dank u wel.') +
          ' Een medewerker van de showroom reageert binnen één werkdag.';
      }
      form.hidden = true;
      success.hidden = false;
      success.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var firstInvalid = null;
      Array.prototype.forEach.call(controls, function (control) {
        var message = validate(control);
        setError(control, message);
        if (message && !firstInvalid) firstInvalid = control;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      /* A short pending state, so the confirmation does not appear
         instantly and read as though nothing happened. */
      var button = form.querySelector('button[type="submit"]');
      var markup = button.innerHTML;          /* keeps the ↗ glyph */
      button.disabled = true;
      button.textContent = 'Versturen…';

      window.setTimeout(function () {
        button.disabled = false;
        button.innerHTML = markup;
        showSuccess();
      }, 600);
    });

    var reset = document.getElementById('form-reset');
    if (reset) {
      reset.addEventListener('click', function () {
        form.reset();
        Array.prototype.forEach.call(controls, function (c) { setError(c, ''); });
        success.hidden = true;
        form.hidden = false;
        form.querySelector('#name').focus();
      });
    }
  }

})();
