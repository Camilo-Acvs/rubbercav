(function () {
  'use strict';

  /* ── POLYMERS BANNER ── */
  const BANNER_KEY = 'rcav-banner-v1';
  const banner = document.getElementById('top-banner');
  if (banner) {
    try {
      if (localStorage.getItem(BANNER_KEY)) {
        banner.remove();
      } else {
        document.body.classList.add('with-banner');
        document.getElementById('btn-banner-close').addEventListener('click', function () {
          banner.classList.add('hiding');
          setTimeout(function () {
            banner.remove();
            document.body.classList.remove('with-banner');
            try { localStorage.setItem(BANNER_KEY, '1'); } catch (e) {}
          }, 350);
        });
      }
    } catch (e) {
      document.body.classList.add('with-banner');
    }
  }

  /* ── NAVBAR scroll ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  /* ── DROPDOWN ── */
  var ddBtn = document.getElementById('dd-industries-btn');
  var ddMenu = document.getElementById('dd-industries-menu');
  if (ddBtn && ddMenu) {
    ddBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = ddMenu.classList.toggle('open');
      ddBtn.classList.toggle('open', open);
      ddBtn.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', function () {
      ddMenu.classList.remove('open');
      ddBtn.classList.remove('open');
      ddBtn.setAttribute('aria-expanded', 'false');
    });
    ddMenu.addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        ddMenu.classList.remove('open');
        ddBtn.classList.remove('open');
        ddBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ── MOBILE NAV ── */
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobile-nav');
  var mobileOverlay = document.getElementById('mobile-overlay');
  var mobileSubBtn = document.getElementById('mob-ind-btn');
  var mobileSub = document.getElementById('mob-ind-sub');

  function openMobileNav() {
    if (mobileNav) mobileNav.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('open');
    if (hamburger) hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMobileNav() {
    if (mobileNav) mobileNav.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    if (hamburger) hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (hamburger) hamburger.addEventListener('click', function () {
    mobileNav && mobileNav.classList.contains('open') ? closeMobileNav() : openMobileNav();
  });
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileNav);
  if (mobileSubBtn && mobileSub) {
    mobileSubBtn.addEventListener('click', function () {
      mobileSub.classList.toggle('open');
    });
  }

  /* ── CAROUSEL ── */
  var track = document.getElementById('carousel-track');
  if (track) {
    var slides = track.querySelectorAll('.carousel-slide');
    var dots = document.querySelectorAll('.carousel-dot');
    var current = 0;
    var timer;

    function goTo(n) {
      slides[current].classList.remove('active');
      dots[current] && dots[current].classList.remove('active');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current] && dots[current].classList.add('active');
    }
    function startTimer() { timer = setInterval(function () { goTo(current + 1); }, 5000); }
    function resetTimer() { clearInterval(timer); startTimer(); }

    var prev = document.getElementById('carousel-prev');
    var next = document.getElementById('carousel-next');
    if (prev) prev.addEventListener('click', function () { goTo(current - 1); resetTimer(); });
    if (next) next.addEventListener('click', function () { goTo(current + 1); resetTimer(); });
    dots.forEach(function (d, i) {
      d.addEventListener('click', function () { goTo(i); resetTimer(); });
    });

    // Touch swipe
    var ts = 0;
    track.addEventListener('touchstart', function (e) { ts = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      var diff = ts - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { goTo(current + (diff > 0 ? 1 : -1)); resetTimer(); }
    });

    startTimer();
  }

  /* ── SEARCH ── */
  var searchInput = document.getElementById('nav-search');
  var searchResults = document.getElementById('nav-search-results');
  if (searchInput && searchResults && typeof SEARCH_INDEX !== 'undefined') {
    var selectedIdx = -1;

    searchInput.addEventListener('input', function () {
      var q = this.value.trim().toLowerCase();
      selectedIdx = -1;
      if (q.length < 2) { searchResults.classList.remove('open'); searchResults.innerHTML = ''; return; }
      var hits = SEARCH_INDEX.filter(function (p) {
        return p.name.toLowerCase().includes(q) || (p.nameEn && p.nameEn.toLowerCase().includes(q)) || (p.cat && p.cat.toLowerCase().includes(q));
      }).slice(0, 8);
      if (!hits.length) {
        searchResults.innerHTML = '<div class="nsr-empty">Sin resultados</div>';
        searchResults.classList.add('open');
        return;
      }
      searchResults.innerHTML = hits.map(function (p, i) {
        var hl = p.name.replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>');
        return '<a class="nsr-item" href="' + p.file + '" data-idx="' + i + '">' +
          '<span class="nsr-cat">' + (p.cat || '') + '</span>' + hl + '</a>';
      }).join('');
      searchResults.classList.add('open');
    });

    document.addEventListener('keydown', function (e) {
      if (!searchResults.classList.contains('open')) return;
      var items = searchResults.querySelectorAll('.nsr-item');
      if (e.key === 'ArrowDown') { e.preventDefault(); selectedIdx = Math.min(selectedIdx + 1, items.length - 1); items.forEach(function (el, i) { el.classList.toggle('active', i === selectedIdx); }); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); selectedIdx = Math.max(selectedIdx - 1, 0); items.forEach(function (el, i) { el.classList.toggle('active', i === selectedIdx); }); }
      else if (e.key === 'Enter' && selectedIdx >= 0) { items[selectedIdx].click(); }
      else if (e.key === 'Escape') { searchResults.classList.remove('open'); searchResults.innerHTML = ''; searchInput.value = ''; }
    });

    document.addEventListener('click', function (e) {
      if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
        searchResults.classList.remove('open');
      }
    });
  }

  /* ── I18N ── */
  var I18N = {
    'nav.home': { es: 'Inicio', en: 'Home' },
    'nav.empresa': { es: 'Empresa', en: 'About' },
    'nav.industries': { es: 'Industrias', en: 'Industries' },
    'nav.clients': { es: 'Clientes', en: 'Clients' },
    'nav.contact': { es: 'Contacto', en: 'Contact' },
    'nav.search': { es: 'Buscar productos...', en: 'Search products...' },
    'industry.petrolera': { es: 'Industria Petrolera', en: 'Oil & Gas Industry' },
    'industry.automotriz': { es: 'Industria Automotriz', en: 'Automotive Industry' },
    'industry.construccion': { es: 'Construcción y Minería', en: 'Construction & Mining' },
    'banner.text': { es: '<strong>Rubbercav S.A.S</strong> ahora también opera como <strong>Polymers Seals Solutions</strong> — Visite nuestro nuevo sitio', en: '<strong>Rubbercav S.A.S</strong> now also operates as <strong>Polymers Seals Solutions</strong> — Visit our new website' },
    'banner.cta': { es: 'Ir al sitio', en: 'Go to site' },
    'home.prodTitle': { es: 'Productos', en: 'Products' },
    'home.viewAll': { es: 'Ver todos →', en: 'View all →' },
    'empresa.who': { es: 'Quiénes somos', en: 'About Us' },
    'empresa.misionTag': { es: 'Misión', en: 'Mission' },
    'empresa.visionTag': { es: 'Visión', en: 'Vision' },
    'empresa.idiTag': { es: 'I + D + i', en: 'R&D' },
    'cli.title': { es: 'Empresas que confían en nosotros', en: 'Companies that trust us' },
    'cont.title': { es: 'Contacto', en: 'Contact' },
    'cont.fName': { es: 'Nombre *', en: 'Name *' },
    'cont.fCompany': { es: 'Empresa', en: 'Company' },
    'cont.fEmail': { es: 'Correo electrónico *', en: 'Email *' },
    'cont.fPhone': { es: 'Teléfono', en: 'Phone' },
    'cont.fMsg': { es: 'Mensaje *', en: 'Message *' },
    'cont.fMsgPh': { es: 'Describa su consulta técnica...', en: 'Describe your technical query...' },
    'cont.fSubmit': { es: 'Enviar mensaje', en: 'Send message' },
    'cont.fSending': { es: 'Enviando...', en: 'Sending...' },
    'cont.fOk': { es: '¡Mensaje enviado! Le contactaremos pronto.', en: 'Message sent! We will contact you soon.' },
    'cont.fErr': { es: 'Error al enviar. Escríbanos a info@polymers-seals.com', en: 'Send error. Please write to info@polymers-seals.com' },
    'cont.iCel': { es: 'Celular / WhatsApp', en: 'Mobile / WhatsApp' },
    'cont.iEmail': { es: 'Correo electrónico', en: 'Email' },
    'cont.iAddr': { es: 'Dirección', en: 'Address' },
    'cont.iWa': { es: 'Escribir por WhatsApp', en: 'Message on WhatsApp' },
    'page.products': { es: 'Productos', en: 'Products' },
    'page.related': { es: 'Productos relacionados', en: 'Related products' },
    'page.bcHome': { es: 'Inicio', en: 'Home' },
    'page.bcInds': { es: 'Industrias', en: 'Industries' },
    'page.consultWa': { es: 'Consultar por WhatsApp', en: 'Ask via WhatsApp' },
    'page.requestQuote': { es: 'Solicitar cotización', en: 'Request a quote' },
    'page.feat1': { es: 'Fabricación bajo plano o muestra', en: 'Manufacturing from drawing or sample' },
    'page.feat2': { es: 'Compuestos según aplicación', en: 'Compounds per application' },
    'page.feat3': { es: 'Asesoría técnica directa', en: 'Direct technical support' },
    'page.feat4': { es: 'Despacho a nivel nacional', en: 'Nationwide dispatch' },
    'pdf.btn': { es: 'Descargar catálogo PDF', en: 'Download PDF catalog' },
    'foot.nav': { es: 'Navegación', en: 'Navigation' },
    'foot.inds': { es: 'Industrias', en: 'Industries' },
    'foot.contact': { es: 'Contacto', en: 'Contact' },
    'foot.tagline': { es: 'Más de 15 años fabricando productos técnicos de caucho para industrias petrolera, automotriz, minería y construcción.', en: 'Over 15 years manufacturing technical rubber products for oil & gas, automotive, mining and construction.' },
    'foot.rights': { es: 'Todos los derechos reservados.', en: 'All rights reserved.' },
  };

  var LANG_KEY = 'rcav-lang';
  function getLang() { try { return localStorage.getItem(LANG_KEY) || 'es'; } catch (e) { return 'es'; } }
  function applyLang(lang) {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var entry = I18N[key];
      if (!entry || !entry[lang]) return;
      if (/[<>]/.test(entry[lang])) el.innerHTML = entry[lang];
      else el.textContent = entry[lang];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      var entry = I18N[key];
      if (entry && entry[lang]) el.placeholder = entry[lang];
    });
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  document.querySelectorAll('.lang-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var lang = this.dataset.lang;
      try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
      applyLang(lang);
    });
  });

  applyLang(getLang());

  /* ── EMAILJS FORM ── */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('form-msg');
      var btn = form.querySelector('.form-submit');
      var origText = btn.textContent;
      btn.disabled = true;
      btn.textContent = I18N['cont.fSending'][getLang()];
      if (msg) { msg.textContent = ''; msg.className = 'form-msg'; }

      var params = {
        from_name: form.querySelector('[name="name"]') ? form.querySelector('[name="name"]').value : '',
        from_company: form.querySelector('[name="company"]') ? form.querySelector('[name="company"]').value : '',
        reply_to: form.querySelector('[name="email"]') ? form.querySelector('[name="email"]').value : '',
        phone: form.querySelector('[name="phone"]') ? form.querySelector('[name="phone"]').value : '',
        message: form.querySelector('[name="message"]') ? form.querySelector('[name="message"]').value : '',
      };

      if (typeof emailjs !== 'undefined' && window.EMAILJS_CONFIG) {
        emailjs.send(window.EMAILJS_CONFIG.serviceId, window.EMAILJS_CONFIG.templateId, params, window.EMAILJS_CONFIG.publicKey)
          .then(function () {
            btn.disabled = false; btn.textContent = origText;
            if (msg) { msg.textContent = I18N['cont.fOk'][getLang()]; msg.className = 'form-msg ok'; }
            form.reset();
          })
          .catch(function () {
            btn.disabled = false; btn.textContent = origText;
            if (msg) { msg.textContent = I18N['cont.fErr'][getLang()]; msg.className = 'form-msg err'; }
          });
      } else {
        setTimeout(function () {
          btn.disabled = false; btn.textContent = origText;
          if (msg) { msg.textContent = 'EmailJS no configurado. Escríbanos a info@polymers-seals.com'; msg.className = 'form-msg err'; }
        }, 800);
      }
    });
  }

})();
