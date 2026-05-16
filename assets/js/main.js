(function () {
  'use strict';

  /* ── POLYMERS BANNER ── */
  const banner = document.getElementById('top-banner');
  if (banner) {
    document.body.classList.add('with-banner');
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
    'banner.text': { es: '<strong>Rubbercav S.A.S</strong> ahora es <strong>Polymers Seals Solutions</strong> — Visite nuestro nuevo sitio', en: '<strong>Rubbercav S.A.S</strong> is now <strong>Polymers Seals Solutions</strong> — Visit our new website' },
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
    'industry.lines': { es: 'Líneas de producto', en: 'Product lines' },
    'industry.viewProds': { es: 'Ver productos →', en: 'View products →' },
    'industry.petHeroSub': { es: 'Productos técnicos de caucho para wireline, slickline, workover, coiled tubing, BOP, well control y solid control.', en: 'Technical rubber products for wireline, slickline, workover, coiled tubing, BOP, well control and solid control.' },
    'industry.autHeroSub': { es: 'Bujes, soportes, gaskets manhole, corbatines y piezas en caucho y nylon para flotas pesadas y livianas.', en: 'Bushings, supports, manhole gaskets, corbatines and rubber & nylon parts for heavy and light fleets.' },
    'industry.conHeroSub': { es: 'Apoyos compuestos en neopreno con refuerzo en acero, planchas anti-desgaste, topes para muelle y bridas.', en: 'Composite neoprene supports with steel reinforcement, anti-wear plates, spring bumpers and flanges.' },
    'hub.workoverSub': { es: 'Línea de productos para operaciones de workover, coiled tubing y wiper rubber.', en: 'Product line for workover, coiled tubing and wiper rubber operations.' },
    'hub.solidSub': { es: 'Componentes para shale shakers, gaskets, soportes y empaques en sistemas de control de sólidos.', en: 'Components for shale shakers, gaskets, supports and seals in solid control systems.' },
    'hub.wireSub': { es: 'Pack-off, line wipers, BOP rubber, packing seals, ram preventers y elementos para wireline y slickline.', en: 'Pack-off, line wipers, BOP rubber, packing seals, ram preventers and elements for wireline and slickline.' },
    'empresa.heroSub': { es: 'Fabricantes de productos técnicos de caucho con más de 15 años de experiencia en el mercado colombiano.', en: 'Manufacturers of technical rubber products with over 15 years of experience in the Colombian market.' },
    'empresa.whoP1': { es: 'Somos una compañía de origen colombiano dedicada a la producción y comercialización de productos de caucho y plástico. Con una trayectoria en el mercado de 15 años en diseño, desarrollo y producción de piezas en caucho para las industrias automotriz, alimenticia, petrolera, constructora, textil, minera, mecánica, eléctrica y la industria en general; nuestro principal objetivo es enfocarnos en las necesidades de nuestros clientes dándoles un trato personalizado y profesional, observando exhaustivamente cada proyecto y brindando las mejores opciones en los productos que nos solicitan.', en: 'We are a Colombian company dedicated to the production and marketing of rubber and plastic products. With 15 years in the market designing, developing and producing rubber parts for the automotive, food, oil, construction, textile, mining, mechanical, electrical and general industries; our main goal is to focus on our customers\' needs, giving them personalized and professional treatment, thoroughly reviewing each project and offering the best options for the products they request.' },
    'empresa.whoP2': { es: 'RUBBERCAV S.A.S cuenta con técnicos y profesionales calificados, idóneos con experiencia de más de cuarenta años en el sector; quienes desarrollan compuestos específicos para cada artículo teniendo en cuenta las condiciones de trabajo bajo las cuales estará expuesto, garantizando un excelente desempeño en su aplicación.', en: 'RUBBERCAV S.A.S has qualified and skilled technicians and professionals with over forty years of industry experience; who develop specific compounds for each product taking into account the working conditions to which it will be exposed, guaranteeing excellent performance in its application.' },
    'empresa.misionP': { es: 'Desarrollar y suministrar productos técnicos de caucho para los diferentes sectores de la industria, satisfaciendo las necesidades del cliente por encima de sus expectativas, apoyándonos en la investigación y tecnología que nos permiten dar las mejores soluciones a cada proyecto, comprometidos así con el desarrollo del país y de nuestro equipo humano.', en: 'To develop and supply technical rubber products for different industrial sectors, satisfying customer needs beyond their expectations, supported by research and technology that allow us to provide the best solutions for each project, committed to the development of our country and our team.' },
    'empresa.visionP': { es: 'Ser el proveedor líder de productos técnicos de caucho a nivel industrial, reconocidos por nuestros diseños innovadores, calidad ajustada a las necesidades, confiabilidad y eficiencia. Diferenciándonos por una política de mejora continua y responsabilidad social activa.', en: 'To be the leading supplier of industrial technical rubber products, recognized for our innovative designs, need-adjusted quality, reliability and efficiency. Setting ourselves apart through a policy of continuous improvement and active social responsibility.' },
    'empresa.idiP': { es: 'Nuestro departamento de investigación, desarrollo e innovación analiza su requerimiento y determina el diseño del artículo en función de su aplicación o bien nos ajustamos a planos, muestras o especificaciones del cliente. Contamos con un departamento de mecanizado donde desarrollamos y fabricamos los moldes y/o matrices, máquinas hidráulicas especializadas, la vulcanización, inyección y extrusión de nuestros productos, lo cual garantiza una trazabilidad y control de calidad en todos nuestros procesos.', en: 'Our research, development and innovation department analyzes your requirements and determines the product design based on its application, or we adapt to customer drawings, samples or specifications. We have a machining department where we develop and manufacture molds and/or dies, specialized hydraulic machines, vulcanization, injection and extrusion of our products, ensuring traceability and quality control throughout all our processes.' },
    'cont.heroSub': { es: 'Comuníquese con nosotros. Le respondemos en menos de 24 horas hábiles.', en: 'Get in touch with us. We respond within 24 business hours.' },
    'cli.heroSub': { es: 'Llevamos más de 15 años trabajando con empresas líderes en sus respectivos sectores.', en: 'We have been working with leading companies in their respective sectors for over 15 years.' },
    'page.prodDescGeneric': { es: 'Producto fabricado en caucho de alta calidad para aplicaciones industriales exigentes. Disponible en distintos tamaños y compuestos según los requerimientos del cliente.', en: 'Product manufactured in high-quality rubber for demanding industrial applications. Available in various sizes and compounds according to customer requirements.' },
    'prod.apoyo1Desc': { es: 'Apoyo compuesto en neopreno con refuerzo interno de placas en acero — usado en estructuras de puentes y obras civiles.', en: 'Composite neoprene support with internal steel plate reinforcement — used in bridge structures and civil works.' },
    'prod.apoyo2Desc': { es: 'Apoyo compuesto en neopreno con refuerzo externo de placas en acero — para cargas pesadas en obras civiles.', en: 'Composite neoprene support with external steel plate reinforcement — for heavy loads in civil works.' },
    'prod.apoyoSimpleDesc': { es: 'Apoyos simples en neopreno para estructuras civiles y obras de construcción.', en: 'Simple neoprene supports for civil structures and construction works.' },
    'prod.topesDesc': { es: 'Topes en caucho macizo para muelles de carga, atenuadores de impacto en zonas de transporte.', en: 'Solid rubber bumpers for loading docks, impact attenuators in transport areas.' },
    'prod.bridasDesc': { es: 'Bridas fabricadas en caucho de diferentes pulgadas que se ajustan a la necesidad de cada cliente.', en: 'Rubber flanges manufactured in different sizes to meet each customer\'s needs.' },
    'prod.empaqueDesc': { es: 'Empaque en caucho diseñado para mezcladoras industriales, resistente a la abrasión y al impacto.', en: 'Rubber seal designed for industrial mixers, resistant to abrasion and impact.' },
    'prod.planchasDentDesc': { es: 'Planchas anti desgaste con dentado especial para retención de material en sistemas de transporte minero.', en: 'Anti-wear plates with special tread for material retention in mining transport systems.' },
    'prod.planchasDesc': { es: 'Planchas anti desgaste en caucho para protección de tolvas, conductos y zonas de impacto en plantas mineras.', en: 'Anti-wear rubber plates for protection of hoppers, ducts and impact zones in mining plants.' },
    'prod.barrasDesc': { es: 'Barras de impacto en caucho para amortiguar el contacto en zonas de descarga y bandas transportadoras.', en: 'Rubber impact bars to cushion contact in discharge areas and conveyor belts.' },
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
