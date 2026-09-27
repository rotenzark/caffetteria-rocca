/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'caffetteria-rocca',
    whatsapp: {
      number: '393279716303', // dichiarato da loro: «Scrivici su Instagram o WhatsApp (il numero è su Google)»
      message: 'Ciao! Vorrei un’informazione.',
      ids: ['testataWhatsapp', 'heroWhatsapp', 'doveWhatsapp'],
    },
    /* scheda Google (27/9/2026): dal lunedì al venerdì 7–17, il sabato 7:30–17, domenica chiuso
       (la bio Instagram e PagineGialle dicono 7–19:30: in nota per Kristian) */
    hours: {
      0: [],
      1: [['07:00', '17:00']],
      2: [['07:00', '17:00']],
      3: [['07:00', '17:00']],
      4: [['07:00', '17:00']],
      5: [['07:00', '17:00']],
      6: [['07:30', '17:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1180,
    EN: {
      "m.salta": "Skip to the menu",
      "m.top": "Caffetteria Rocca, back to the top",
      "m.sezioni": "Sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "v.cornetti": "Croissants",
      "v.caffe": "Coffee",
      "v.specialita": "Specialities",
      "v.tavola": "Cold food",
      "v.aperitivo": "Aperitivo",
      "v.natale": "At Christmas",
      "v.dove": "Find us",
      "t.wa": "Message us",
      "h.insegna": "Coffee · Bar · Cold food",
      "h.titolo": "The early bird<br> gets the<br> croissant.",
      "h.sotto": "Baristas in Milan since 2009, now at Via Ambrogio Binda 16. The sourdough croissant is filled on the spot with the cream you choose: there are nine, on the wheel.",
      "h.scelta": "The wheel picked:",
      "h.gira": "Spin again",
      "h.wa": "Message us on WhatsApp",
      "h.tel": "Call 327 971 6303",
      "h.voti": "on Google · 366 reviews",
      "c1.k": "Pastries",
      "c1.t": "Croissants",
      "c1.p1": "The croissant is made with sourdough: plain, or filled on the spot with one of the nine creams on the wheel. If you can’t decide, you can ask for two at once: there’s the double-filled brioche.",
      "c1.creme": "The nine creams",
      "r.v.albicocca": "Apricot",
      "r.v.bosco": "Mixed berries",
      "r.v.crema": "Custard",
      "r.v.nocciola": "Hazelnut",
      "r.v.bianco": "White chocolate",
      "r.v.miele": "Honey",
      "r.v.arancia": "Orange and ginger",
      "r.v.ricotta": "Ricotta",
      "r.v.pistacchio": "Pistachio",
      "c1.p2": "In the window there are also puff pastries (pain au chocolat, the braid with pecans and maple syrup, custard and chocolate chips), doughnuts and ring doughnuts filled as you like, the butter croissant and the vegan brioche. And pancakes with whipped cream, with maple syrup, pistachio, white chocolate, apricot or mixed berries; or the tiramisù pancake.",
      "c1.alt1": "The pastry window: croissants, pain au chocolat with chocolate chips, puff pastries, doughnuts with custard and chocolate, icing sugar",
      "c1.cap1": "The window, one June morning.",
      "c1.alt2": "A flaky croissant dusted with icing sugar, the cream peeking out on top, on a white plate",
      "c1.cap2": "Just filled.",
      "c2.k": "Coffee bar",
      "c2.t": "Coffee",
      "c2.p1": "The espresso is a 70% Arabica, 30% Robusta blend; the decaf is decaffeinated naturally, with air. Cappuccino also with soy, oat or lactose-free milk, the flat white with a double espresso, the macchiatone, latte macchiato, ginseng coffee, barley coffee, loose-leaf tea.",
      "c2.p2": "And then the specialty filter: a single-origin Arabica, slowly brewed, in a large cup, and it changes every day. Ask us which coffee we have today. The drawing on the foam is made at the counter: a heart, a rosetta.",
      "c2.cit": "«The aroma of freshly ground coffee greets you right at the door <span class=\"taglio\">[…]</span>»",
      "c2.chi": "a customer, on Google (translated from Italian)",
      "c2.alt1": "A cappuccino with a rosetta drawn in the foam, held by the handle over the counter",
      "c2.alt2": "A cappuccino with a foam heart on the black marble counter veined with white",
      "c2.alt3": "From above: a cappuccino with a heart and a bowl of pancakes with banana, strawberry and blueberries on the black marble table",
      "c3.k": "House specials",
      "c3.t": "Specialities",
      "r.v.pistacchino": "Pistacchino",
      "r.v.leccese": "Leccese",
      "r.v.marocchino": "Marocchino",
      "r.v.cremacaffe": "Coffee cream",
      "r.v.mistermilk": "Mister Milk",
      "r.v.cioccolata": "Hot chocolate",
      "r.v.shakerato": "Shakerato",
      "r.v.ice": "Iced cappuccino",
      "c3.d1": "espresso, milk foam, pistachio, whipped cream",
      "c3.d2": "almond milk syrup, espresso, ice",
      "c3.d3": "also with soy milk",
      "c3.d4": "the cold coffee cream",
      "c3.d5": "milk, hot or cold with ice, chocolate, cocoa, whipped cream; also with coffee",
      "c3.d6": "the old recipe, the way it used to be: cocoa, potato starch and carob seed flour",
      "c3.d7": "coffee shaken with ice, also with vanilla",
      "c3.d8": "with creamy milk frothed cold",
      "c3.alt": "A latte macchiato in a glass, a croissant and a small bowl of honey on the black marble table with the number 6",
      "c3.cap": "Latte macchiato, croissant and honey at table 6.",
      "c4.k": "Lunch and snacks",
      "c4.t": "Cold food",
      "c4.p1": "It’s written on the sign, under the name: tavola fredda. For lunch the toast with ham and fontina, the piadina from Romagna, panini, the big salad made on the spot, the caprese, the plate of cold cuts and cheeses. And for a snack the savoury brioche, focaccia, margherita pizza.",
      "c4.alt": "The cream cartouche sign reading Caffetteria Rocca and, below, Bar · Tavola fredda, the gold disc with the logo and a lit lantern",
      "c4.cap": "The sign on Via Binda.",
      "c5.k": "At the counter",
      "c5.t": "Aperitivo",
      "c5.p1": "Spritz with DOCG Prosecco and soda water, the classics (Americano, Negroni, Sbagliato, Milano-Torino, gin and tonic), Valdobbiadene prosecco by the glass, wines, craft beer; with crisps and olives, or with the aperitivo plate. And alcohol-free drinks, for whoever is driving.",
      "c6.k": "From November",
      "c6.t": "At Christmas, panettone",
      "c6.p1": "For Christmas the artisan panettone by Italo Vezzoli arrives, multi-award-winning at Re Panettone: the Originale, the Milano and the Cioccolato Caraibico, naturally leavened. Stocks are small: book by phone, on WhatsApp or by dropping into the café.",
      "c7.k": "About us",
      "c7.t": "Baristas since 2009",
      "c7.p1": "We have been baristas in Milan since 2009. Then the move to Via Ambrogio Binda 16, between Barona and San Cristoforo, and the renovated bar: the counter and the tables in black marble, the cream sign with the gold disc. Here come those who have made it their regular breakfast stop, those who come with their colleagues on Fridays, and those from far away: someone had the first and the last breakfast of their trip to Milan here.",
      "c7.alt": "The façade on Via Binda: the two cream cartouches reading Caffetteria Rocca and Rocca, the disc with the gold R, the hanging sign on its wrought-iron bracket and the grey awning",
      "c7.cap": "Via Ambrogio Binda 16.",
      "c8.k": "What people say",
      "c8.t": "on Google, 366 reviews",
      "c8.r1": "«a regular breakfast stop for months now, very kind staff and the brioches, which they fill on the spot, are among the best in Milan…the ricotta one is out of this world <span class=\"taglio\">[…]</span>»",
      "c8.tradotta": "on Google (translated from Italian)",
      "c8.inglese": "on Google",
      "c8.r3": "«Not a very big place but nicely furnished, friendly and helpful staff, an “artist” barista who manages to draw works of art on the cappuccino foam»",
      "c8.r4": "«Cosy and very well-kept little place. The owners always smiling. A fixed appointment on my Saturdays back in Barona: the special coffee, pistachio cream and whipped cream. Try it and see.»",
      "c8.r6": "«Caffè, Cappuccino, Croissant and Cortesia (courtesy)... all with a capital “C”! 🔝🔝🔝»",
      "c8.nota": "From the reviews on Google, as they were written.",
      "c9.k": "Where and when",
      "c9.t": "Via Ambrogio Binda 16",
      "c9.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "g.chiuso": "closed",
      "c9.k1": "Address",
      "c9.k2": "Area",
      "c9.v2": "Barona and San Cristoforo, 100 metres from Via Ettore Ponti",
      "c9.k3": "Metro",
      "c9.v3": "M2 Romolo, about a kilometre away",
      "c9.k4": "Phone and WhatsApp",
      "c9.strada": "Directions",
      "c9.mappa": "Map: Caffetteria Rocca, Via Ambrogio Binda 16, Milan",
      "z.tipo": "Coffee · Bar · Cold food",
      "z.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · the menu from their digital menu, the words from their Instagram, photos and reviews from the Google listing (September 2026).",
      "z.su": "Back to the top ↑",
      "w.aria": "The menu wheel: inside, the five families (coffee, specialities, croissants, cold food, aperitivo); outside, their items; for the croissants, the nine creams. The golden pointer picks the cream.",
      "wf.caffe": "Coffee",
      "w.espresso": "Espresso",
      "w.decaffeinato": "Decaf",
      "w.macchiatone": "Macchiatone",
      "w.cappuccino": "Cappuccino",
      "w.flatwhite": "Flat white",
      "w.lattemacchiato": "Latte macchiato",
      "w.americano": "Americano",
      "w.filtro": "Specialty filter",
      "wf.specialita": "Specialities",
      "w.pistacchino": "Pistacchino",
      "w.leccese": "Leccese",
      "w.marocchino": "Marocchino",
      "w.cremacaffe": "Coffee cream",
      "w.mistermilk": "Mister Milk",
      "w.cioccolata": "Hot chocolate",
      "w.shakerato": "Shakerato",
      "w.ice": "Iced cappuccino",
      "wf.cornetti": "Croissants",
      "w.albicocca": "Apricot",
      "w.bosco": "Mixed berries",
      "w.crema": "Custard",
      "w.nocciola": "Hazelnut",
      "w.bianco": "White chocolate",
      "w.miele": "Honey",
      "w.arancia": "Orange & ginger",
      "w.ricotta": "Ricotta",
      "w.pistacchio": "Pistachio",
      "wf.tavola": "Cold food",
      "w.toast": "Toast",
      "w.piadina": "Piadina",
      "w.panino": "Panino",
      "w.insalatona": "Big salad",
      "w.caprese": "Caprese",
      "w.salumi": "Charcuterie",
      "w.focaccia": "Focaccia",
      "w.pizza": "Pizza",
      "wf.aperitivo": "Aperitivo",
      "w.spritz": "Spritz",
      "w.negroni": "Negroni",
      "w.sbagliato": "Sbagliato",
      "w.milanotorino": "Milano-Torino",
      "w.gintonic": "Gin & tonic",
      "w.prosecco": "Prosecco",
      "w.birra": "Craft beer",
      "w.analcolici": "Alcohol-free"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ CAFFETTERIA ROCCA — «Chi dorme non piglia cornetto.» ══════════
     La pagina gira intorno alla ruota del loro menù, come la Coffee Taster's Flavor Wheel: dentro le cinque famiglie,
     fuori le voci, per i cornetti le nove creme (la ruota la scrive _crc_ruota.mjs, una sola fonte per voci e colori).
     la FIRMA — la ruota sceglie la crema: all'apertura gira un giro e mezzo rallentando, l'indice d'oro scatta a ogni
     piolo che passa, e sotto l'indice si ferma la ricotta (la crema più lodata nelle recensioni). «Gira ancora» sceglie a
     caso un'altra delle nove creme. Su desktop, scorrendo, la ruota porta sotto l'indice la famiglia del capitolo che si
     legge e spegne un po' le altre; fuori dalle famiglie torna sulla crema scelta.
     Stato finale = l'HTML: la ruota ferma sulla ricotta (transform in linea), la frase scritta. Senza JS non gira; con
     reduced-motion il bottone cambia crema senza giro e i capitoli rimettono la ruota a posto di colpo, senza animazione.
     Durante l'attesa l'head mette firma-attesa (la ruota un giro e mezzo prima, --pre) e la toglie da solo dopo 2,5 s:
     se questo codice arriva dopo, la ruota resta dov'è. Il giro è un rAF a tempo: la firma non dipende da GSAP. */
  var RUOTA = {"N":41,"A":8.78048780487805,"FINE":153.659,"PRE":-386.341,"scelta":"ricotta","creme":[["albicocca",144.88,"#E8913A","il cornetto all'albicocca","an apricot croissant"],["bosco",153.66,"#7E2F55","il cornetto ai frutti di bosco","a mixed-berry croissant"],["crema",162.44,"#F0CC62","il cornetto alla crema","a custard croissant"],["nocciola",171.22,"#96623A","il cornetto alla nocciola","a hazelnut croissant"],["bianco",180,"#EFE2C4","il cornetto al cioccolato bianco","a white-chocolate croissant"],["miele",188.78,"#D9A12E","il cornetto al miele","a honey croissant"],["arancia",197.56,"#E0692F","il cornetto all'arancia e zenzero","an orange and ginger croissant"],["ricotta",206.34,"#F6F1E6","il cornetto alla ricotta","a ricotta croissant"],["pistacchio",215.12,"#8BAE55","il cornetto al pistacchio","a pistachio croissant"]],"famiglie":[["caffe",35.12],["specialita",105.37],["cornetti",180],["tavola",254.63],["aperitivo",324.88]]};
  var ruota = document.getElementById('ruota');
  var disco = document.getElementById('ruotaDisco');
  var lama = document.getElementById('ruotaLama');
  var esito = document.getElementById('sceltaEsito');
  var nomeScelta = document.getElementById('sceltaNome');
  var pallino = document.getElementById('sceltaPallino');
  var bottoneGira = document.getElementById('giraAncora');
  var desktop = window.matchMedia('(min-width: 1000px)');

  var CREME = {}, FAM = {};
  RUOTA.creme.forEach(function (c) { CREME[c[0]] = { centro: c[1], colore: c[2], it: c[3], en: c[4] }; });
  RUOTA.famiglie.forEach(function (f) { FAM[f[0]] = f[1]; });

  var ang = RUOTA.FINE;              /* la rotazione del disco in gradi, senza modulo */
  var crema = RUOTA.scelta;          /* la crema scelta (quella scritta nella frase) */
  var anim = null, rafId = 0, guardia = 0, attesa = 0;
  var piolo = null, colpo = -1e9, flette = 0;
  var sezione = 'apertura';

  function modulo(x, m) { return ((x % m) + m) % m; }
  function voltaPer(centro) { return -centro; }
  /* la via più corta dall'angolo attuale a quello che porta «centro» sotto l'indice */
  function vicino(centro) { return ang + (modulo(voltaPer(centro) - ang + 180, 360) - 180); }

  /* l'indice scatta a ogni piolo che passa: un colpo, poi torna a riposo in una settantina di millisecondi */
  function indice(ora) {
    var p = Math.floor(modulo(-ang, 360) / RUOTA.A);
    if (piolo !== null && p !== piolo) colpo = ora;
    piolo = p;
    flette = 22 * Math.exp(-(ora - colpo) / 70);
    if (lama) lama.setAttribute('transform', flette > 0.05 ? 'rotate(' + (-flette).toFixed(2) + ')' : '');
  }
  function applica(a, ora) {
    ang = a;
    disco.style.transform = 'rotate(' + a.toFixed(3) + 'deg)';
    indice(ora === undefined ? performance.now() : ora);
  }
  /* un salto senza animazione (reduced-motion, pagina aperta su un capitolo): l'indice non scatta. Senza un rAF che lo
     riporti a riposo restava piegato di 22° (27/9, check della firma) */
  function salta(a) { piolo = null; colpo = -1e9; applica(a); }

  function lingua() { return root.lang === 'en' ? 'en' : 'it'; }
  function scrivi() {
    var c = CREME[crema];
    if (!c) return;
    if (nomeScelta) nomeScelta.textContent = c[lingua()];
    if (pallino) pallino.style.setProperty('--c', c.colore);
  }
  function segna(id) {
    crema = id;
    disco.querySelectorAll('.ruota__voce').forEach(function (g) { g.classList.toggle('is-scelta', g.getAttribute('data-v') === id); });
    scrivi();
  }

  var dolce = function (u) { return 1 - Math.pow(1 - u, 4); };                                  /* il giro: parte forte, si ferma piano */
  var morbida = function (u) { return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; }; /* i capitoli */

  function ferma(completa) {
    if (!anim) return;
    var a = anim; anim = null;
    clearTimeout(guardia);
    if (completa) applica(a.a);
    ruota.setAttribute('data-ruota', 'ferma');
    if (a.fine) a.fine();
  }
  function passo(ora) {
    rafId = 0;
    if (anim) {
      var u = Math.min(1, (ora - anim.t0) / anim.dur);
      applica(anim.da + (anim.a - anim.da) * anim.ease(u), ora);
      if (u >= 1) ferma(false);
    } else indice(ora);
    /* il rAF continua finché l'indice non è tornato a riposo */
    if (anim || flette > 0.05) rafId = requestAnimationFrame(passo);
  }
  function muovi(a, dur, ease, fine) {
    if (anim) ferma(false);
    anim = { da: ang, a: a, t0: performance.now(), dur: dur, ease: ease, fine: fine };
    ruota.setAttribute('data-ruota', 'gira');
    clearTimeout(guardia);
    /* se il rAF si ferma (scheda in background) la ruota arriva comunque */
    guardia = setTimeout(function () { ferma(true); }, dur + 1500);
    if (!rafId) rafId = requestAnimationFrame(passo);
  }

  /* il giro che sceglie la crema: almeno un giro intero, sempre in senso orario */
  function giraVerso(id, da) {
    var c = CREME[id];
    var arrivo = voltaPer(c.centro);
    var delta = modulo(arrivo - ang, 360);
    delta += delta < 200 ? 720 : 360;
    if (da !== undefined) delta = da;
    if (esito) esito.classList.add('is-gira');
    if (bottoneGira) bottoneGira.disabled = true;
    muovi(ang + delta, 2600 + delta * 2.4, dolce, function () {
      segna(id);
      if (esito) esito.classList.remove('is-gira');
      if (bottoneGira) bottoneGira.disabled = false;
    });
  }
  function altraCrema() {
    var ids = Object.keys(CREME).filter(function (k) { return k !== crema; });
    return ids[Math.floor(Math.random() * ids.length)];
  }

  /* su desktop la ruota segue i capitoli: la famiglia del capitolo sotto l'indice, le altre spente */
  var sezioni = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  function sezioneCorrente() {
    var linea = (window.innerHeight || 800) * 0.45, cur = sezioni[0];
    for (var i = 0; i < sezioni.length; i++) if (sezioni[i].getBoundingClientRect().top <= linea) cur = sezioni[i];
    return cur;
  }
  function famigliaDi(sez) { return sez ? sez.getAttribute('data-famiglia') : null; }
  function segui(subito) {
    if (!desktop.matches) {
      if (ruota.hasAttribute('data-attiva')) ruota.removeAttribute('data-attiva');
      return;
    }
    var sez = sezioneCorrente(), id = sez ? sez.id : '';
    if (id === sezione && !subito) return;
    sezione = id;
    var fam = famigliaDi(sez);
    if (fam) ruota.setAttribute('data-attiva', fam); else ruota.removeAttribute('data-attiva');
    /* se sta ancora girando per la crema, il giro finisce qui: la frase si scrive e la ruota va al capitolo */
    if (anim && anim.fine && !subito) { var f = anim.fine; anim.fine = null; f(); }
    var bersaglio = vicino(fam ? FAM[fam] : CREME[crema].centro);
    if (Math.abs(bersaglio - ang) < 0.01) return;
    /* reduced-motion: la ruota si rimette a posto di colpo, senza animazione. Senza rotazione la famiglia accesa restava
       fuori schermo e si vedevano solo le famiglie spente (27/9) */
    if (subito || reducedMotion) { if (anim) ferma(false); salta(bersaglio); return; }
    muovi(bersaglio, 900 + Math.min(700, Math.abs(bersaglio - ang) * 4), morbida);
  }
  var inCoda = false;
  function alloScroll() {
    if (inCoda) return;
    inCoda = true;
    requestAnimationFrame(function () { inCoda = false; segui(false); });
  }

  /* lo stato degli orari anche in «Dove e quando», col pallino verde quando è aperto */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  new MutationObserver(function () { copiaStato(); scrivi(); }).observe(root, { attributes: true, attributeFilter: ['lang'] });

  function inVista() {
    var r = ruota.getBoundingClientRect(), vh = window.innerHeight || 800;
    return Math.min(r.bottom, vh) - Math.max(r.top, 0) > Math.min(r.height, vh) * 0.35;
  }

  if (ruota && disco) {
    try { clearTimeout(window.__attesaRuota); } catch (e) {}
    window.__ruota = { stato: function () { return { ang: ang, crema: crema, gira: !!anim, attiva: ruota.getAttribute('data-attiva'), flette: flette }; } };
    ruota.setAttribute('data-ruota', 'ferma');
    if (bottoneGira) bottoneGira.addEventListener('click', function () {
      if (anim && anim.fine) return;
      var id = altraCrema();
      if (reducedMotion) { salta(voltaPer(CREME[id].centro)); segna(id); return; }
      if (desktop.matches && famigliaDi(sezioneCorrente())) { segna(id); return; }
      giraVerso(id);
    });
    window.addEventListener('scroll', alloScroll, { passive: true });
    window.addEventListener('resize', alloScroll);
    if (desktop.addEventListener) desktop.addEventListener('change', function () { segui(true); });

    var partenza = sezioneCorrente();
    var daGirare = !reducedMotion && root.classList.contains('firma-attesa') && !(desktop.matches && famigliaDi(partenza));
    if (!daGirare) {
      /* niente giro: codice arrivato tardi, reduced-motion o pagina aperta su un capitolo. La ruota resta sulla ricotta */
      root.classList.remove('firma-attesa');
      segui(true);
    } else {
      /* la ruota passa dalla classe al transform in linea senza muoversi, poi aspetta di essere vista e gira */
      applica(RUOTA.PRE);
      root.classList.remove('firma-attesa');
      if (esito) esito.classList.add('is-gira');
      ruota.setAttribute('data-ruota', 'attesa');
      var via = function () {
        /* nell'attesa la pagina è andata su un capitolo (un link diretto a #tavola, uno scroll veloce): niente giro
           d'apertura, la ruota segue già il capitolo. Il giro e mezzo esatto solo se la ruota è ancora dove aspettava:
           prima partiva sempre con +540° da dove si trovava e si fermava fuori posto (27/9) */
        if (desktop.matches && famigliaDi(sezioneCorrente())) {
          segna(RUOTA.scelta);
          if (esito) esito.classList.remove('is-gira');
          if (!anim) ruota.setAttribute('data-ruota', 'ferma');
          return;
        }
        giraVerso(RUOTA.scelta, Math.abs(ang - RUOTA.PRE) < 0.01 ? RUOTA.FINE - RUOTA.PRE : undefined);
      };
      if (inVista()) attesa = setTimeout(via, 650);
      else if ('IntersectionObserver' in window) {
        var osserva = new IntersectionObserver(function (voci) {
          if (voci[0].isIntersecting) { osserva.disconnect(); attesa = setTimeout(via, 350); }
        }, { threshold: 0.35 });
        osserva.observe(ruota);
      } else via();
      /* il capitolo di partenza si segna senza toccare la ruota (segui(true) la porterebbe subito sulla ricotta) */
      sezione = partenza ? partenza.id : '';
    }
  }
})();
