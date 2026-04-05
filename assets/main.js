// SAM Construction — shared site JS
(function () {
  'use strict';

  var isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Custom cursor (desktop only, pointer devices with hover) ──
  if (!isTouch && window.matchMedia && window.matchMedia('(hover: hover)').matches) {
    var cursor = document.getElementById('cursor');
    var ring = document.getElementById('cursorRing');
    if (cursor && ring) {
      var mx = 0, my = 0, rx = 0, ry = 0;
      document.addEventListener('mousemove', function (e) {
        mx = e.clientX; my = e.clientY;
        cursor.style.left = mx + 'px';
        cursor.style.top = my + 'px';
      });
      (function animate() {
        rx += (mx - rx) * 0.12;
        ry += (my - ry) * 0.12;
        ring.style.left = rx + 'px';
        ring.style.top = ry + 'px';
        requestAnimationFrame(animate);
      })();
      document.querySelectorAll('a,button,.service-item,.proj,.testimonial-card,.blog-card,.faq-question,.whatsapp-btn,.cookie-btn').forEach(function (el) {
        el.addEventListener('mouseenter', function () {
          ring.style.width = '60px';
          ring.style.height = '60px';
          ring.style.borderColor = 'rgba(201,168,76,0.8)';
        });
        el.addEventListener('mouseleave', function () {
          ring.style.width = '36px';
          ring.style.height = '36px';
          ring.style.borderColor = 'rgba(201,168,76,0.5)';
        });
      });
    }
  } else {
    // Hide cursor elements on touch
    document.documentElement.classList.add('is-touch');
  }

  // ── Loader fade (with 3s failsafe) ──
  var loader = document.getElementById('loader');
  if (loader) {
    var hideLoader = function () { loader.classList.add('hide'); };
    window.addEventListener('load', function () { setTimeout(hideLoader, 600); });
    setTimeout(hideLoader, 3000); // failsafe
  }

  // ── Nav scroll state ──
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ── Mobile hamburger menu ──
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      navToggle.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('nav-open', open);
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      });
    });
  }

  // ── Reveal on scroll ──
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('visible'); });
  }

  // ── Language switch ──
  var LANG_KEY = 'samLang';
  var supported = ['en', 'fr', 'de', 'lb'];
  window.setLang = function (lang) {
    if (supported.indexOf(lang) === -1) lang = 'en';
    document.documentElement.lang = lang;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
    document.querySelectorAll('.lang-btn button').forEach(function (b) { b.classList.remove('active'); });
    var activeBtn = document.querySelector('.lang-btn button[data-lang="' + lang + '"]');
    if (activeBtn) activeBtn.classList.add('active');
    document.querySelectorAll('[data-en]').forEach(function (el) {
      var val = el.getAttribute('data-' + lang) || el.getAttribute('data-en');
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = val;
      else if (el.tagName === 'OPTION') el.textContent = val;
      else el.textContent = val;
    });
  };
  // Restore language: URL ?lang= takes priority, then localStorage, then browser, then EN default
  (function initLang() {
    var chosen = null;
    // 1. URL param
    var m = window.location.search.match(/[?&]lang=([a-z]{2})/i);
    if (m && supported.indexOf(m[1].toLowerCase()) !== -1) {
      chosen = m[1].toLowerCase();
    }
    // 2. localStorage
    if (!chosen) {
      try {
        var saved = localStorage.getItem(LANG_KEY);
        if (saved && supported.indexOf(saved) !== -1) chosen = saved;
      } catch (e) {}
    }
    // 3. Browser language (pick first match)
    if (!chosen && navigator.language) {
      var bl = navigator.language.slice(0, 2).toLowerCase();
      if (supported.indexOf(bl) !== -1) chosen = bl;
    }
    // 4. Apply (default EN stays as-is in HTML)
    if (chosen && chosen !== 'en') {
      window.setLang(chosen);
    }
  })();

  // ── FAQ accordion ──
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function () {
      var item = btn.parentElement;
      var answer = item.querySelector('.faq-answer');
      var isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(function (fi) {
        fi.classList.remove('active');
        var a = fi.querySelector('.faq-answer');
        if (a) a.style.maxHeight = null;
        var b = fi.querySelector('.faq-question');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        item.classList.add('active');
        if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ── Cookie consent (cosmetic banner — real consent comes later) ──
  (function () {
    var banner = document.getElementById('cookieBanner');
    if (!banner) return;
    var choice;
    try { choice = localStorage.getItem('cookieConsent'); } catch (e) {}
    if (choice) {
      banner.classList.add('hidden');
    } else {
      setTimeout(function () { banner.classList.add('show'); }, 1500);
    }
    var accept = document.getElementById('cookieAccept');
    var decline = document.getElementById('cookieDecline');
    if (accept) accept.addEventListener('click', function () {
      try { localStorage.setItem('cookieConsent', 'accepted'); } catch (e) {}
      banner.classList.remove('show');
      setTimeout(function () { banner.classList.add('hidden'); }, 500);
    });
    if (decline) decline.addEventListener('click', function () {
      try { localStorage.setItem('cookieConsent', 'declined'); } catch (e) {}
      banner.classList.remove('show');
      setTimeout(function () { banner.classList.add('hidden'); }, 500);
    });
  })();

  // ── Smooth scroll with fixed-nav offset ──
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (href === '#' || href.length < 2) return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });

  // ── Auto year in footer ──
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
