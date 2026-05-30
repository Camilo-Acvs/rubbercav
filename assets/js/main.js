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
      var lang = getLang();
      selectedIdx = -1;
      if (q.length < 2) { searchResults.classList.remove('open'); searchResults.innerHTML = ''; return; }
      var hits = SEARCH_INDEX.filter(function (p) {
        return (p.name && p.name.toLowerCase().includes(q))
            || (p.nameEn && p.nameEn.toLowerCase().includes(q))
            || (p.cat && p.cat.toLowerCase().includes(q))
            || (p.catEn && p.catEn.toLowerCase().includes(q));
      }).slice(0, 8);
      if (!hits.length) {
        searchResults.innerHTML = '<div class="nsr-empty">' + (lang === 'en' ? 'No results' : 'Sin resultados') + '</div>';
        searchResults.classList.add('open');
        return;
      }
      searchResults.innerHTML = hits.map(function (p, i) {
        var displayName = (lang === 'en' && p.nameEn) ? p.nameEn : p.name;
        var displayCat = (lang === 'en' && p.catEn) ? p.catEn : (p.cat || '');
        var hl = displayName.replace(new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>');
        return '<a class="nsr-item" href="' + p.file + '" data-idx="' + i + '">' +
          '<span class="nsr-cat">' + displayCat + '</span>' + hl + '</a>';
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

  // Mapa archivo→{es,en} de nombres de producto, hubs e industrias.
  // Fuente única de verdad para traducir h1, breadcrumb, listas, prod-cards, alt y title.
  var PRODUCT_NAMES = {
    'coiled-tubing-stripper-rubber.html':   { es: 'Coiled Tubing Stripper Rubber', en: 'Coiled Tubing Stripper Rubber' },
    'rod-stripper-rubber.html':             { es: 'Rod Stripper Rubber', en: 'Rod Stripper Rubber' },
    'swap-cups.html':                       { es: 'Swab Cups', en: 'Swab Cups' },
    'packing-mud-bucked.html':              { es: 'Packing Mud Bucked', en: 'Packing Mud Bucked' },
    'drill-pipe-wipers.html':               { es: 'Drill Pipe Wipers', en: 'Drill Pipe Wipers' },
    'oil-saver.html':                       { es: 'Oil Saver', en: 'Oil Saver' },
    'oil-saver-1.html':                     { es: 'Oil Saver', en: 'Oil Saver' },
    'hammer-unions-seals-1502.html':        { es: 'Hammer Union Seals 1502', en: 'Hammer Union Seals 1502' },
    'hammer-unions-seals-1502-1.html':      { es: 'Hammer Unions Seals 1502', en: 'Hammer Unions Seals 1502' },
    'diaphragms.html':                      { es: 'Diaphragms', en: 'Diaphragms' },
    'diaphragms-.html':                     { es: 'Diaphragms', en: 'Diaphragms' },
    'valve-cover-gasket-.html':             { es: 'Valve Cover Gasket', en: 'Valve Cover Gasket' },
    'valve-cover-gasket--1.html':           { es: 'Valve Cover Gasket', en: 'Valve Cover Gasket' },
    'packing-seals.html':                   { es: 'Packing Seals', en: 'Packing Seals' },
    'mechanical-seals.html':                { es: 'Mechanical Seals', en: 'Mechanical Seals' },
    'ptfe-seals.html':                      { es: 'PTFE Seals', en: 'PTFE Seals' },
    'mongoose-shale-shaker.html':           { es: 'Mongoose Shale Shaker', en: 'Mongoose Shale Shaker' },
    'shale-shakers-gaskets.html':           { es: 'Shale Shakers Gaskets', en: 'Shale Shakers Gaskets' },
    'rubber-support-shale.html':            { es: 'Rubber Support Shale', en: 'Rubber Support Shale' },
    'pipe-rubber-gaskets.html':             { es: 'Pipe Rubber Gaskets', en: 'Pipe Rubber Gaskets' },
    'pad-rubber-.html':                     { es: 'Pad Rubber', en: 'Pad Rubber' },
    'thread-protectors.html':               { es: 'Thread Protectors', en: 'Thread Protectors' },
    'regan-rubber-.html':                   { es: 'Regan Rubber', en: 'Regan Rubber' },
    'sucker-rod-wipers.html':               { es: 'Sucker Rod Wipers', en: 'Sucker Rod Wipers' },
    'vee-packing-stuffing-box.html':        { es: 'Vee Packing Stuffing Box', en: 'Vee Packing Stuffing Box' },
    'valve-cover-seal.html':                { es: 'Valve Cover Seal', en: 'Valve Cover Seal' },
    'rubber-piston-cup.html':               { es: 'Rubber Piston Cup', en: 'Rubber Piston Cup' },
    'valve-insert.html':                    { es: 'Valve Insert', en: 'Valve Insert' },
    'pack-off---line-wiper-rubbers.html':   { es: 'Pack Off & Line Wiper Rubbers', en: 'Pack Off & Line Wiper Rubbers' },
    'stuffing-box-packing.html':            { es: 'Stuffing Box Packing', en: 'Stuffing Box Packing' },
    'v-packing-seals.html':                 { es: 'V-Packing Seals', en: 'V-Packing Seals' },
    'vee-packing-seals.html':               { es: 'Vee Packing Seals', en: 'Vee Packing Seals' },
    'ram-bop-configuration.html':           { es: 'Ram BOP Configuration', en: 'Ram BOP Configuration' },
    'inner-seal-bop-.html':                 { es: 'Inner Seal BOP', en: 'Inner Seal BOP' },
    'outer--seal-bop-.html':                { es: 'Outer Seal BOP', en: 'Outer Seal BOP' },
    'ram-preventer-rubber.html':            { es: 'Ram Preventer Rubber', en: 'Ram Preventer Rubber' },
    'bop-ram-rod.html':                     { es: 'BOP Ram Rod', en: 'BOP Ram Rod' },
    'bop-ram-1--.html':                     { es: 'BOP Ram 1"', en: 'BOP Ram 1"' },
    'packer-element.html':                  { es: 'Packer Element', en: 'Packer Element' },
    'piston-seals.html':                    { es: 'Piston Seals', en: 'Piston Seals' },
    'buje-5--rueda-nuevo-holland.html':     { es: 'Buje 5ª Rueda Nuevo Holland', en: '5th Wheel Bushing — New Holland' },
    'corbatin-barra-tensora.html':          { es: 'Corbatín Barra Tensora', en: 'Tension Bar Corbatín' },
    'buje-suspension-primaax.html':         { es: 'Buje Suspensión PRIMAAX', en: 'PRIMAAX Suspension Bushing' },
    'bujes-quinta-rueda-holland-.html':     { es: 'Bujes Quinta Rueda Holland', en: 'Holland Fifth Wheel Bushings' },
    'soportes-y-bujes-en-nylon.html':       { es: 'Soportes y Bujes en Nylon', en: 'Nylon Supports & Bushings' },
    'buje-quinta-rueda-fontaine.html':      { es: 'Buje Quinta Rueda Fontaine', en: 'Fontaine Fifth Wheel Bushing' },
    'guia-capo-kenworth.html':              { es: 'Guía Capó Kenworth', en: 'Kenworth Hood Guide' },
    'buje-quinta-rueda-nylon-y-bronce.html':{ es: 'Buje Quinta Rueda Nylon y Bronce', en: 'Fifth Wheel Nylon & Bronze Bushing' },
    'soporte-motor-kenworth.html':          { es: 'Soporte Motor Kenworth', en: 'Kenworth Engine Mount' },
    'bujes-tensor-y-balancin.html':         { es: 'Bujes Tensor y Balancín', en: 'Tensioner & Rocker Arm Bushings' },
    'media-luna-cauho-y-nylon.html':        { es: 'Media Luna Caucho y Nylon', en: 'Rubber & Nylon Half-Moon' },
    'soporte-dite---telefono-.html':        { es: 'Soporte Dite (Teléfono)', en: 'Dite Support (Phone)' },
    'gasket-manhole-20--16--dite.html':     { es: 'Gasket Manhole 20"-16" Dite', en: 'Gasket Manhole 20"-16" Dite' },
    'gasket-manhole-16--10-inca.html':      { es: 'Gasket Manhole 16" 10" INCA', en: 'Gasket Manhole 16" 10" INCA' },
    'gasket-manhole-20-16--l.html':         { es: 'Gasket Manhole 20"16" L', en: 'Gasket Manhole 20" 16" L' },
    'gasket-manhole-20--17--national-.html':{ es: 'Gasket Manhole 20" 17" (National)', en: 'Gasket Manhole 20" 17" (National)' },
    'apoyo-compuesto-en-neopreno.html':     { es: 'Apoyo Compuesto en Neopreno (Refuerzo Interno)', en: 'Composite Neoprene Support (Internal Reinforcement)' },
    'apoyo-compuesto--en-neopreno_.html':   { es: 'Apoyo Compuesto en Neopreno (Refuerzo Externo)', en: 'Composite Neoprene Support (External Reinforcement)' },
    'apoyo-simple-.html':                   { es: 'Apoyo Simple', en: 'Simple Support' },
    'topes-para-muelle.html':               { es: 'Topes para Muelle', en: 'Dock Bumpers' },
    'bridas.html':                          { es: 'Bridas', en: 'Flanges' },
    'empaque-para-mezcladora.html':         { es: 'Empaque para Mezcladora', en: 'Mixer Gasket' },
    'planchas-anti-desgaste-dentadas.html': { es: 'Planchas Anti Desgaste Dentadas', en: 'Toothed Anti-Wear Plates' },
    'planchas-anti-desgaste-.html':         { es: 'Planchas Anti Desgaste', en: 'Anti-Wear Plates' },
    'barras--de-impacto-.html':             { es: 'Barras de Impacto', en: 'Impact Bars' }
  };

  var HUB_NAMES = {
    'workover-coiled-tubing-wiper-rubber.html': { es: 'Workover - Coiled Tubing - Wiper Rubber', en: 'Workover - Coiled Tubing - Wiper Rubber' },
    'solid-control-transport.html':             { es: 'Solid Control - Transport', en: 'Solid Control - Transport' },
    'wireline-slickline.html':                  { es: 'Wireline - Slickline', en: 'Wireline - Slickline' }
  };

  var INDUSTRY_NAMES = {
    'industria-petrolera.html':     { es: 'Industria Petrolera', en: 'Oil & Gas Industry' },
    'industria-automotriz.html':    { es: 'Industria Automotriz', en: 'Automotive Industry' },
    'construccion-y-mineria.html':  { es: 'Construcción y Minería', en: 'Construction & Mining' }
  };

  var PAGE_TITLES = {
    'index.html':     { es: 'Productos Técnicos de Caucho', en: 'Technical Rubber Products' },
    'empresa.html':   { es: 'Empresa', en: 'About' },
    'clientes.html':  { es: 'Clientes', en: 'Clients' },
    'contacto.html':  { es: 'Contacto', en: 'Contact' }
  };

  function getFilenameFromHref(href) {
    if (!href) return null;
    if (/^(https?:|mailto:|tel:|#)/i.test(href)) return null;
    var clean = href.replace(/^\.\//, '').split(/[?#]/)[0];
    var parts = clean.split('/');
    return parts[parts.length - 1] || null;
  }
  function lookupName(filename) {
    if (!filename) return null;
    return PRODUCT_NAMES[filename] || HUB_NAMES[filename] || INDUSTRY_NAMES[filename] || null;
  }
  function getCurrentFilename() {
    var p = (location.pathname || '').split('/').pop();
    return (p && p.length) ? p : 'index.html';
  }

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

    // Traducir enlaces a páginas de producto/hub/industria que no tengan data-i18n.
    document.querySelectorAll('a[href]').forEach(function (a) {
      if (a.hasAttribute('data-i18n')) return;
      var entry = lookupName(getFilenameFromHref(a.getAttribute('href')));
      if (!entry || !entry[lang]) return;

      // prod-card: traducir nombre y alt de la imagen
      var nameEl = a.querySelector('.prod-card-name');
      if (nameEl) nameEl.textContent = entry[lang];

      var img = a.querySelector('img');
      if (img) img.setAttribute('alt', entry[lang]);

      // hub-card: traducir h3 si no tiene data-i18n
      var h3 = a.querySelector('h3');
      if (h3 && !h3.hasAttribute('data-i18n')) h3.textContent = entry[lang];

      // Anchor con sólo texto (catálogo, breadcrumb intermedio)
      if (!nameEl && !img && !h3 && a.children.length === 0) {
        a.textContent = entry[lang];
      }
    });

    // Página actual: h1, último span del breadcrumb, title.
    var curFile = getCurrentFilename();
    var curEntry = lookupName(curFile);
    if (curEntry && curEntry[lang]) {
      document.querySelectorAll('h1').forEach(function (h1) {
        if (!h1.hasAttribute('data-i18n')) h1.textContent = curEntry[lang];
      });
      document.querySelectorAll('.breadcrumb').forEach(function (bc) {
        var spans = bc.querySelectorAll(':scope > span');
        var last = spans[spans.length - 1];
        if (last && !last.hasAttribute('data-i18n') && !last.querySelector('a')) {
          last.textContent = curEntry[lang];
        }
      });
      document.title = curEntry[lang] + ' · Rubbercav S.A.S';

      // En páginas de producto, reescribir el mensaje pre-rellenado de WhatsApp.
      if (PRODUCT_NAMES[curFile]) {
        var msgPrefix = lang === 'en' ? 'Hi, I am interested in the product: ' : 'Hola, me interesa el producto: ';
        document.querySelectorAll('a[href*="wa.me"][href*="text="]').forEach(function (a) {
          var href = a.getAttribute('href');
          a.setAttribute('href', href.replace(/text=[^&]*/, 'text=' + encodeURIComponent(msgPrefix + curEntry[lang])));
        });
      }
    } else if (PAGE_TITLES[curFile] && PAGE_TITLES[curFile][lang]) {
      document.title = PAGE_TITLES[curFile][lang] + ' · Rubbercav S.A.S';
    }

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

  /* ── FORMULARIO DE CONTACTO (FormSubmit) ── */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var cfg = window.FORM_CONFIG || {};
      var msg = document.getElementById('form-msg');
      var btn = form.querySelector('.form-submit');
      var origText = btn.textContent;
      btn.disabled = true;
      btn.textContent = I18N['cont.fSending'][getLang()];
      if (msg) { msg.textContent = ''; msg.className = 'form-msg'; }

      var get = function (n) {
        var el = form.querySelector('[name="' + n + '"]');
        return el ? el.value.trim() : '';
      };

      var payload = {
        _subject:  cfg.subject || 'Nuevo mensaje desde la web',
        _template: 'table',
        _captcha:  'false',
        _replyto:  get('email'),
        'Nombre':   get('name'),
        'Empresa':  get('company') || '—',
        'Correo':   get('email'),
        'Teléfono': get('phone') || '—',
        'Mensaje':  get('message'),
        _honey:     get('_honey'), // honeypot anti-spam: si viene lleno, FormSubmit lo descarta
      };

      function done(ok) {
        btn.disabled = false; btn.textContent = origText;
        if (msg) {
          msg.textContent = ok ? I18N['cont.fOk'][getLang()] : I18N['cont.fErr'][getLang()];
          msg.className = 'form-msg ' + (ok ? 'ok' : 'err');
        }
        if (ok) form.reset();
      }

      // Si aún no se ha puesto el correo destino, avisar en lugar de fallar en silencio.
      if (!cfg.email || cfg.email.indexOf('REEMPLAZAR') === 0) {
        done(false);
        if (msg) { msg.textContent = 'Formulario sin configurar: falta el correo en assets/js/form-config.js'; }
        return;
      }

      fetch('https://formsubmit.co/ajax/' + encodeURIComponent(cfg.email), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.json(); })
        .then(function (data) { done(String(data.success) === 'true'); })
        .catch(function () { done(false); });
    });
  }

})();
