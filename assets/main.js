/* =============================================================================
   CasA.Mi.Ca. — comportamenti della pagina
   1. header  2. menu mobile  3. reveal  4. lightbox
   5. scala logaritmica delle distanze  6. filtri  7. mappa
   ========================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------- 1. header ---- */
  var head = document.getElementById('head');
  var onScroll = function () {
    head.classList.toggle('is-stuck', window.scrollY > 8);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* -------------------------------------------------- 2. menu mobile ---- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    var open = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!open));
    burger.setAttribute('aria-label', open ? 'Apri il menu' : 'Chiudi il menu');
    nav.classList.toggle('is-open', !open);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      burger.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
    }
  });

  /* ------------------------------------------------------- 3. reveal ---- */
  var reveals = document.querySelectorAll('.rv');
  if (reduce || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.06 });
    Array.prototype.forEach.call(reveals, function (el) { io.observe(el); });
  }

  /* ----------------------------------------------------- 4. lightbox ---- */
  var lb = document.getElementById('lb');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCap');
  var shots = Array.prototype.slice.call(document.querySelectorAll('#gallery button'));
  var idx = 0;

  function show(i) {
    idx = (i + shots.length) % shots.length;
    var b = shots[idx];
    lbImg.src = b.dataset.full;
    lbImg.alt = b.querySelector('img').alt;
    lbCap.textContent = b.dataset.label + '  ·  ' + (idx + 1) + '/' + shots.length;
  }

  shots.forEach(function (b, i) {
    b.addEventListener('click', function () {
      show(i);
      if (typeof lb.showModal === 'function') { lb.showModal(); } else { lb.setAttribute('open', ''); }
    });
  });

  document.getElementById('lbPrev').addEventListener('click', function () { show(idx - 1); });
  document.getElementById('lbNext').addEventListener('click', function () { show(idx + 1); });
  document.getElementById('lbClose').addEventListener('click', function () { lb.close(); });

  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target.classList.contains('lb__inner')) lb.close();
  });
  document.addEventListener('keydown', function (e) {
    if (!lb.open) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
  });

  /* -------------------------------------- 5. scala log delle distanze ---- */
  var MIN = 0.07, MAX = 130;
  var SPAN = Math.log10(MAX / MIN);
  function pos(km) {
    return Math.max(0, Math.min(100, (Math.log10(km / MIN) / SPAN) * 100));
  }

  var ticks = document.querySelectorAll('#scale span');
  [0.1, 1, 10, 100].forEach(function (km, i) {
    if (ticks[i]) ticks[i].style.left = pos(km).toFixed(2) + '%';
  });

  var buttons = Array.prototype.slice.call(document.querySelectorAll('.place'));
  buttons.forEach(function (btn) {
    var p = pos(parseFloat(btn.dataset.km));
    btn.querySelector('.place__t i').style.left = p.toFixed(2) + '%';
    btn.querySelector('.place__t b').style.width = p.toFixed(2) + '%';
  });

  /* ------------------------------------------------------ 6. filtri ------ */
  var chips = document.querySelectorAll('.chips button');
  var rows = document.querySelectorAll('#places li[data-cat]');
  var groups = document.querySelectorAll('#places li[data-group]');

  function applyFilter(cat) {
    Array.prototype.forEach.call(rows, function (li) {
      li.hidden = !(cat === 'all' || li.dataset.cat === cat);
    });
    Array.prototype.forEach.call(groups, function (li) {
      li.hidden = !(cat === 'all' || li.dataset.group === cat);
    });
    if (window.__syncMarkers) window.__syncMarkers(cat);
  }

  Array.prototype.forEach.call(chips, function (c) {
    c.addEventListener('click', function () {
      Array.prototype.forEach.call(chips, function (o) { o.setAttribute('aria-pressed', 'false'); });
      c.setAttribute('aria-pressed', 'true');
      applyFilter(c.dataset.filter);
    });
  });

  /* ------------------------------------------------------- 7. mappa ------ */
  var HOME = [40.8411693, 17.4682893];   // Via del Faro 176, Torre Canne (BR)
  var mapEl = document.getElementById('map');
  var fallback = document.getElementById('mapFallback');

  if (typeof L === 'undefined') {
    fallback.innerHTML =
      '<div><p class="mono">Mappa non disponibile</p>' +
      '<p style="margin-top:.5rem"><a href="https://www.google.com/maps/search/?api=1&query=Torre+Canne+Fasano" ' +
      'target="_blank" rel="noopener">Apri Torre Canne su Google Maps ↗</a></p></div>';
    return;
  }
  fallback.remove();

  var map = L.map(mapEl, {
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: true
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &middot; &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  /* casa */
  var homeIcon = L.divIcon({
    className: '',
    html: '<span class="pin pin--home"><svg viewBox="0 0 32 48" aria-hidden="true" fill="currentColor">' +
          '<path d="M16 0l4.2 5.2-1.3 2.3h-5.8L11.8 5.2z"/><path d="M10.6 9.5h10.8l1.6 5.2H9z"/>' +
          '<path d="M8.8 16.5h14.4L26 47H6z"/></svg></span>',
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18]
  });

  L.marker(HOME, { icon: homeIcon, zIndexOffset: 900, title: 'CasA.Mi.Ca.' })
    .addTo(map)
    .bindPopup('<strong>CasA.Mi.Ca.</strong><em>Via del Faro 176 · Torre Canne</em>');

  L.circle(HOME, {
    radius: 1000,
    color: '#12707A',
    weight: 1,
    opacity: .5,
    dashArray: '3 5',
    fillColor: '#4FA9A8',
    fillOpacity: .06,
    interactive: false
  }).addTo(map);

  /* luoghi */
  var pinIcon = L.divIcon({
    className: '',
    html: '<span class="pin"></span>',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
    popupAnchor: [0, -8]
  });

  var pairs = [];
  buttons.forEach(function (btn) {
    var lat = parseFloat(btn.dataset.lat);
    var lng = parseFloat(btn.dataset.lng);
    var name = btn.querySelector('.place__n').textContent;
    var num = btn.querySelector('.place__k').firstChild.textContent.trim();
    var time = btn.querySelector('.place__k small').textContent;

    var m = L.marker([lat, lng], { icon: pinIcon, title: name }).addTo(map);
    m.bindPopup(
      '<strong>' + name + '</strong><em>' + num + ' · ' + time + '</em>' +
      '<div style="margin-top:.45rem"><a href="https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent(name + ' Puglia') + '" target="_blank" rel="noopener">Apri su Google Maps ↗</a></div>'
    );

    var pair = { btn: btn, marker: m, cat: btn.parentNode.dataset.cat, latlng: [lat, lng] };
    pairs.push(pair);

    function hot(on) {
      var el = m.getElement();
      if (el) el.classList.toggle('is-hot', on);
      btn.classList.toggle('is-active', on);
    }

    btn.addEventListener('mouseenter', function () { hot(true); });
    btn.addEventListener('mouseleave', function () { if (!btn.dataset.pinned) hot(false); });
    btn.addEventListener('focus', function () { hot(true); });
    btn.addEventListener('blur', function () { if (!btn.dataset.pinned) hot(false); });

    btn.addEventListener('click', function () {
      pairs.forEach(function (p) {
        delete p.btn.dataset.pinned;
        p.btn.classList.remove('is-active');
        var e = p.marker.getElement();
        if (e) e.classList.remove('is-hot');
      });
      btn.dataset.pinned = '1';
      hot(true);
      var z = parseFloat(btn.dataset.km) < 2 ? 15 : 12;
      map.flyTo([lat, lng], z, { duration: reduce ? 0 : 1.1 });
      m.openPopup();
    });

    m.on('click', function () {
      pairs.forEach(function (p) { p.btn.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var r = btn.getBoundingClientRect();
      if (r.top < 80 || r.bottom > window.innerHeight - 20) {
        btn.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
      }
    });
  });

  /* vista iniziale: il raggio “locale”, entro 25 km */
  function localBounds() {
    var pts = [HOME];
    pairs.forEach(function (p) {
      if (parseFloat(p.btn.dataset.km) <= 25) pts.push(p.latlng);
    });
    return L.latLngBounds(pts).pad(0.12);
  }
  var home = localBounds();
  map.fitBounds(home);

  document.getElementById('mapReset').addEventListener('click', function () {
    pairs.forEach(function (p) {
      delete p.btn.dataset.pinned;
      p.btn.classList.remove('is-active');
      var e = p.marker.getElement();
      if (e) e.classList.remove('is-hot');
    });
    map.closePopup();
    map.flyToBounds(home, { duration: reduce ? 0 : 1 });
  });

  /* i filtri agiscono anche sui marker */
  window.__syncMarkers = function (cat) {
    pairs.forEach(function (p) {
      var on = (cat === 'all' || p.cat === cat);
      if (on && !map.hasLayer(p.marker)) map.addLayer(p.marker);
      if (!on && map.hasLayer(p.marker)) map.removeLayer(p.marker);
    });
    if (cat === 'all') { map.flyToBounds(home, { duration: reduce ? 0 : .8 }); return; }
    var pts = [HOME];
    pairs.forEach(function (p) { if (p.cat === cat) pts.push(p.latlng); });
    map.flyToBounds(L.latLngBounds(pts).pad(0.15), { duration: reduce ? 0 : .8 });
  };

  /* la rotella zooma solo dopo un click sulla mappa (evita di “rubare” lo scroll) */
  map.on('click', function () { map.scrollWheelZoom.enable(); });
  map.on('mouseout', function () { map.scrollWheelZoom.disable(); });
})();
