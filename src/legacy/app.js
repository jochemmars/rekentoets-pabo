/* app.js */
/* RWT oefenapp · schermen en bediening */
(function () {
  'use strict';
  var RWT = window.RWT, E = RWT.engine, K = RWT.kit, TPL = RWT.TPL, nf = K.nf;
  var app = document.getElementById('app');
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  // iconen van Lucide (lucide.dev, ISC-licentie), lucide-static 0.468.0, hier ingebouwd zodat de app één bestand blijft
  function svgI(d, extra) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' + (extra || '') + '>' + d + '</svg>'; }
  var I = {
    ok: svgI('<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'), // circle-check
    no: svgI('<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>'), // circle-x
    warn: svgI('<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>'), // triangle-alert
    chev: svgI('<path d="m9 18 6-6-6-6"/>', ' class="chev"'), // chevron-right
    tick: svgI('<path d="M20 6 9 17l-5-5"/>'), // check
    home: svgI('<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'), // house
    pen: svgI('<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>'), // pencil
    chart: svgI('<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="m19 9-5 5-4-4-3 3"/>'), // chart-line
    info: svgI('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'), // info
    calc: svgI('<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>'), // calculator
    clock: svgI('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'), // clock
    x: svgI('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'), // x
    eye: svgI('<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>'), // eye
    eyeOff: svgI('<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>'), // eye-off
    arrow: svgI('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'), // arrow-right
    down: svgI('<path d="m6 9 6 6 6-6"/>', ' class="chev"') // chevron-down
  };
  // korte eigen omschrijving bij elke eindterm uit de handreiking
  var ET = { 'A.1': 'Getallen tot en met miljard', 'A.2': 'Rekentaal en symbolen', 'A.3': 'Ordenen, afronden en schatten', 'A.4': 'Bewerkingen met hele getallen', 'A.5': 'Gemiddelde',
    'B.1': 'Schrijfwijze en begrippen', 'B.2': 'Kommagetallen: plaatswaarde en afronden', 'B.3': 'Rekenen met kommagetallen', 'B.4': 'Vergelijken en ordenen', 'B.5': 'Verhoudingen', 'B.6': 'Breuken', 'B.7': 'Procenten en promille',
    'B.8': 'Breuk, kommagetal en procent omzetten', 'B.9': 'Breuken, procenten en kommagetallen door elkaar', 'B.10': 'Vergroten en verkleinen met een percentage', 'B.11': 'Kans en aantal mogelijkheden',
    'C.1': 'Meetkundige begrippen en figuren', 'C.2': 'Maten omrekenen en kiezen', 'C.3': 'Snelheid en andere samengestelde grootheden', 'C.4': 'Schaal', 'C.5': 'Plattegronden en routes', 'C.6': 'Symmetrie', 'C.7': 'Aanzichten',
    'C.8': 'Vakken en coördinaten', 'C.9': 'Kloktijden', 'C.10': 'Oppervlakte', 'C.11': 'Omtrek', 'C.12': 'Inhoud', 'C.13': 'Vergroten: oppervlakte en inhoud', 'C.14': 'Meetkundige patronen',
    'D.1': 'Soorten diagrammen', 'D.2': 'Grafieken en tabellen lezen', 'D.3': 'Gegevens verwerken, ook in een rekenblad', 'D.4': 'Regelmaat en formules', 'D.5': 'Rekenen met verbanden' };
  // eindtermen die alleen op sommige niveaus van een opgavetype voorkomen
  var ET_TPL = { 'C.5': ['CN17'] };
  var MND = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
  var MODE_NAME = { full: 'Volledige proeftoets', short: 'Korte proeftoets', oefen: 'Oefenen' };
  var LVL = ['Groeit mee', 'Opstap', 'Toetsniveau', 'Uitdaging'];

  /* ---------- toestand en opslag ---------- */
  var S = { view: 'start', s: null, ui: null, runAt: 0, result: null, history: [], demo: null, dialog: null, calc: { open: false, expr: '', res: '' },
    prac: { doms: ['A', 'B', 'C', 'D'], part: 'HN', level: 0, count: 10 }, demoOpen: false, timerHidden: false, onlyWrong: false, filter: 'toets', notice: '', wiped: 0 };
  var mem = {};
  var LS = {
    get: function (k) { try { var v = window.localStorage.getItem('rwt.' + k); return v ? JSON.parse(v) : (mem[k] === undefined ? null : mem[k]); } catch (e) { return mem[k] === undefined ? null : mem[k]; } },
    set: function (k, v) { mem[k] = v; try { window.localStorage.setItem('rwt.' + k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    del: function (k) { delete mem[k]; try { window.localStorage.removeItem('rwt.' + k); } catch (e) { /* geen opslag beschikbaar */ } }
  };
  var canStore = (function () { try { window.localStorage.setItem('rwt.t', '1'); window.localStorage.removeItem('rwt.t'); return true; } catch (e) { return false; } })();
  function seed() { return Math.floor(Math.random() * 2147483000) + 1; }
  function saveSession() { if (S.s) LS.set('session', S.s); }

  /* voortgang: alleen in deze browser (localStorage) */
  var HIST_MAX = 150;
  function cleanPair(o) {
    var out = {};
    if (o && typeof o === 'object') Object.keys(o).slice(0, 60).forEach(function (k) {
      var v = o[k];
      if (/^[A-Z](\.\d{1,2})?$/.test(k) && Array.isArray(v) && isFinite(v[0]) && isFinite(v[1])) out[k] = [Math.max(0, Math.round(+v[0])), Math.max(0, Math.round(+v[1]))];
    });
    return out;
  }
  function cleanHist(list, wiped) {
    var seen = {}, out = [];
    (Array.isArray(list) ? list : []).forEach(function (h) {
      if (!h || typeof h.id !== 'string' || !/^[a-z0-9]{3,24}$/.test(h.id) || seen[h.id] || !MODE_NAME[h.mode] || !isFinite(h.t) || !isFinite(h.score) || !isFinite(h.n) || !isFinite(h.ok) || +h.t <= (wiped || 0)) return;
      seen[h.id] = 1;
      var e = { id: h.id, t: +h.t, mode: h.mode, n: Math.max(0, Math.round(+h.n)), ok: Math.max(0, Math.round(+h.ok)), score: Math.min(100, Math.max(0, Math.round(+h.score))), dom: cleanPair(h.dom), part: cleanPair(h.part), et: cleanPair(h.et), secs: isFinite(h.secs) ? Math.round(+h.secs) : 0 };
      if (h.sel && typeof h.sel.d === 'string' && /^[A-D]{1,4}$/.test(h.sel.d)) e.sel = { d: h.sel.d, p: h.sel.p === 'H' || h.sel.p === 'N' ? h.sel.p : 'HN', l: +h.sel.l >= 1 && +h.sel.l <= 3 ? Math.round(+h.sel.l) : 0 };
      out.push(e);
    });
    out.sort(function (a, b) { return a.t - b.t; });
    return out.slice(-HIST_MAX);
  }
  function saveHistory() { LS.set('history', S.history); }

  /* ---------- hulpjes ---------- */
  function fmtTime(sec) { sec = Math.max(0, Math.ceil(sec)); var m = Math.floor(sec / 60), s = sec % 60; return m + ':' + (s < 10 ? '0' : '') + s; }
  function fmtDur(sec) { var m = Math.round(sec / 60); return m < 1 ? 'minder dan 1 minuut' : m + (m === 1 ? ' minuut' : ' minuten'); }
  function fmtSecs(s) { return s < 60 ? s + ' s' : Math.floor(s / 60) + ' min ' + (s % 60) + ' s'; }
  function fmtDate(t) { var d = new Date(t); return d.getDate() + ' ' + MND[d.getMonth()]; }
  function dots(level) { return '<span class="dots" role="img" aria-label="Niveau ' + level + ' van 3">' + [1, 2, 3].map(function (i) { return '<i' + (i <= level ? ' class="on"' : '') + '></i>'; }).join('') + '</span>'; }
  function pill(v) { return '<span class="pill ' + v.key + '">' + (v.key === 'good' ? I.ok : v.key === 'warn' ? I.warn : I.no) + v.label + '</span>'; }
  function pct(a, b) { return b ? Math.round(a / b * 100) : 0; }
  function cleanNum(v) {
    v = String(v).replace(/\./g, ',').replace(/[^0-9,\-−]/g, '');
    var neg = /^[-−]/.test(v); v = v.replace(/[-−]/g, '');
    var i = v.indexOf(','); if (i >= 0) v = v.slice(0, i + 1) + v.slice(i + 1).replace(/,/g, '');
    return ((neg ? '-' : '') + v).slice(0, 14);
  }
  function newUi(q) { return { q: q, given: q.type === 'multi' ? q.fields.map(function () { return ''; }) : q.type === 'order' ? [] : null, checked: false, ok: null, t0: Date.now(), acc: 0 }; }
  function qElapsed() { var u = S.ui; return u ? u.acc + (u.t0 ? (Date.now() - u.t0) / 1000 : 0) : 0; }

  /* ---------- opgave tekenen ---------- */
  function qBody(q) { return '<div class="q-text">' + q.q + '</div>' + (q.fig ? '<div class="q-fig">' + q.fig + '</div>' : ''); }
  function answerUi(q, ui, pfx, noHint) {
    var lock = ui.checked ? ' disabled' : '';
    if (q.type === 'mc') return '<div class="opts" role="radiogroup" aria-label="Antwoorden">' + q.opts.map(function (o, i) {
      var cls = 'opt' + (ui.given === i ? ' on' : '') + (ui.checked && i === q.ans ? ' ok' : '') + (ui.checked && ui.given === i && i !== q.ans ? ' no' : '');
      return '<button type="button" class="' + cls + '" role="radio" aria-checked="' + (ui.given === i) + '" data-act="pick" data-i="' + i + '"' + lock + '><span class="opt-k">' + 'ABCDE'.charAt(i) + '</span><span class="opt-t">' + o + '</span></button>';
    }).join('') + '</div>';
    if (q.type === 'order') {
      var seq = ui.given.map(function (i, k) { return (k ? '<span class="lt">&lt;</span>' : '') + '<button type="button" class="chip sel" data-act="ordrem" data-i="' + i + '"' + lock + ' aria-label="Haal weg">' + q.items[i] + '</button>'; }).join('');
      var pool = q.items.map(function (h, i) { return ui.given.indexOf(i) >= 0 ? '' : '<button type="button" class="chip" data-act="ordadd" data-i="' + i + '"' + lock + '>' + h + '</button>'; }).join('');
      return '<div class="ord"><p class="hint">Tik de getallen aan in de goede volgorde, de kleinste eerst. Tik op een gekozen getal om het terug te leggen.</p><div class="ord-seq" aria-live="polite">' + (seq || '<span class="hint">Jouw volgorde komt hier.</span>') + '</div><div class="ord-pool">' + pool + '</div></div>';
    }
    return '<div class="fields">' + q.fields.map(function (f, i) {
      return '<div class="field">' + (f.pre ? '<span class="f-pre">' + f.pre + '</span>' : '') + '<input id="' + pfx + i + '" class="f-in" type="text" inputmode="decimal" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" aria-label="Antwoord' + (q.fields.length > 1 ? ' ' + (i + 1) : '') + '" data-i="' + i + '" value="' + esc(ui.given[i] || '') + '"' + lock + '>' +
        (E.NEG[q.id] ? '<button type="button" class="f-sign" data-act="sign" data-i="' + i + '" aria-label="Maak het getal negatief of positief"' + lock + '>±</button>' : '') + (f.unit ? '<span class="f-unit">' + f.unit + '</span>' : '') + '</div>';
    }).join('') + '</div>' + (noHint ? '' : '<p class="hint">Alleen cijfers en een komma. Geen punt in grote getallen.' + (E.NEG[q.id] ? ' Met ± maak je het getal negatief.' : '') + '</p>');
  }
  // bij een goed antwoord staat de uitwerking ingeklapt, bij een fout antwoord open
  function feedback(q, given, ok) {
    return '<section class="fb ' + (ok ? 'ok' : 'no') + '" aria-live="polite"><div class="fb-h">' + (ok ? I.ok + 'Goed' : I.no + 'Niet goed') + '</div>' +
      '<dl class="kv"><dt>Jouw antwoord</dt><dd>' + E.givenHtml(q, given) + '</dd>' + (ok ? '' : '<dt>Goede antwoord</dt><dd>' + E.answerHtml(q) + '</dd>') + '</dl>' +
      '<details class="uitw"' + (ok ? '' : ' open') + '><summary>' + I.chev + 'Uitwerking</summary><div class="uitw-b">' + q.expl + '</div></details></section>';
  }

  /* ---------- startscherm ---------- */
  var DEMO_IDS = ['AH01', 'AH02', 'AH03', 'AH04', 'AH05', 'BH01', 'BH02', 'BH06', 'BH11'];
  function newDemo() {
    var r = new RWT.Rng(seed()), id = r.pick(DEMO_IDS), tpl = TPL.filter(function (t) { return t.id === id; })[0], q = RWT.make(tpl, 2, r);
    if (q.type !== 'multi' || q.fields.length !== 1) return newDemo();
    S.demo = newUi(q);
  }
  function demoHtml() {
    var u = S.demo, q = u.q;
    return '<details class="card demo demo-d"' + (S.demoOpen ? ' open' : '') + '><summary><span><b>Probeer een voorbeeldsom</b><span class="tiny">Eén opgave hoofdrekenen, zonder klok</span></span>' + I.down + '</summary><div class="demo-b">' + qBody(q) + answerUi(q, u, 'demo') +
      (u.checked ? feedback(q, u.given, u.ok) + '<div class="row"><button class="btn" data-act="demonew">Nog een som</button></div>' : '<div class="row"><button class="btn" data-act="democheck">Controleer</button></div>') + '</div></details>';
  }
  function viewStart() {
    var saved = S.s, last = S.history.length ? S.history[S.history.length - 1] : null, h = '';
    h += '<header class="hero"><p class="eyebrow">Landelijke reken- en wiskundetoets (RWT)</p><h1>Oefen de rekentoets voor de pabo</h1><p class="lead">Proeftoetsen in de opbouw van de echte toets. Elke keer met nieuwe getallen en nieuwe verhalen, en na afloop de uitwerking van elke opgave.</p></header>';
    if (saved) {
      var pos = saved.kind === 'test' ? 'opgave ' + Math.min(saved.idx + 1, saved.plan.length) + ' van ' + saved.plan.length : saved.items.length + ' opgaven gemaakt';
      h += '<section class="card"><h3>Je was nog bezig</h3><p>' + MODE_NAME[saved.mode] + ', ' + pos + '. De tijd heeft stilgestaan.</p><div class="row"><button class="btn pri" data-act="resume">Verder gaan</button><button class="btn" data-act="discard">Stoppen</button></div></section>';
    }
    // alleen de hoofdmodus krijgt een gevulde knop; de andere twee zijn rustige secundaire knoppen
    h += '<section class="stack"><h2>Kies een oefenvorm</h2><div class="modes">' +
      '<article class="card mode main"><h3>Volledige proeftoets</h3><ul class="facts"><li>55 opgaven</li><li>17 + 103 minuten</li><li>niet terugbladeren</li></ul><button class="btn pri" data-act="start" data-mode="full">Start de proeftoets</button></article>' +
      '<article class="card mode"><h3>Korte proeftoets</h3><ul class="facts"><li>20 opgaven</li><li>6 + 38 minuten</li><li>zelfde opbouw</li></ul><button class="btn" data-act="start" data-mode="short">Start' + I.arrow + '</button></article>' +
      '<article class="card mode"><h3>Oefenen per domein</h3><ul class="facts"><li>zonder tijdsdruk</li><li>meteen de uitwerking</li></ul><a class="btn" href="#oefenen" data-act="nav" data-v="oefenen">Kies onderwerpen' + I.arrow + '</a></article></div></section>';
    if (last) h += '<section class="card"><h3>Laatste resultaat</h3><div class="row">' + pill(E.verdict(last.score)) + '<span>Oefenscore <b>' + last.score + '</b></span><span class="tiny">' + MODE_NAME[last.mode] + ', ' + fmtDate(last.t) + '</span></div><div class="row"><a class="btn sm ghost" href="#voortgang" data-act="nav" data-v="voortgang">Bekijk je voortgang' + I.arrow + '</a></div></section>';
    h += demoHtml();
    h += '<p class="tiny">Deze oefenapp is niet van Cito. De opgaven zijn zelfgemaakte variaties op de eindtermen van de RWT, geen echte toetsopgaven.</p>';
    return h;
  }

  /* ---------- oefenen instellen ---------- */
  function pracOptions() {
    var p = S.prac, parts = p.part === 'HN' ? ['H', 'N'] : [p.part], n = 0;
    p.doms.forEach(function (d) { parts.forEach(function (pt) { n += TPL.filter(function (t) { return t.dom === d && t.part === pt; }).length; }); });
    return n;
  }
  function viewPractice() {
    var p = S.prac, n = pracOptions();
    var seg = function (name, opts, cur) { return '<div class="seg" role="group">' + opts.map(function (o) { return '<button type="button" data-act="pset" data-k="' + name + '" data-val="' + o[0] + '" aria-pressed="' + (String(cur) === String(o[0])) + '">' + o[1] + '</button>'; }).join('') + '</div>'; };
    var msg = !p.doms.length ? 'Kies minstens één domein.' : !n ? 'Verbanden en statistiek komt alleen voor bij niet-hoofdrekenen. Kies een ander onderdeel of een ander domein.' : n + ' soorten opgaven in deze keuze. Elke opgave krijgt nieuwe getallen.';
    return '<header class="stack"><h2>Oefenen per domein</h2><p class="lead">Zonder tijdsdruk. Na elke opgave zie je meteen of het goed is, met de uitwerking erbij.</p></header>' +
      '<section class="card"><div class="fgroup"><span class="lab">Domeinen</span><div class="checks">' + ['A', 'B', 'C', 'D'].map(function (d) {
        return '<button type="button" class="check" data-act="pdom" data-d="' + d + '" aria-pressed="' + (p.doms.indexOf(d) >= 0) + '"><span class="box">' + I.tick + '</span><span>' + E.DOM[d].name + '<small>' + TPL.filter(function (t) { return t.dom === d; }).length + ' soorten opgaven</small></span></button>';
      }).join('') + '</div></div>' +
      '<div class="fgroup"><span class="lab">Onderdeel</span>' + seg('part', [['HN', 'Allebei'], ['H', 'Hoofdrekenen'], ['N', 'Niet-hoofdrekenen']], p.part) + '</div>' +
      '<div class="fgroup"><span class="lab">Niveau</span>' + seg('level', [[0, 'Groeit mee'], [1, 'Opstap'], [2, 'Toetsniveau'], [3, 'Uitdaging']], p.level) + '<p class="hint">Bij ‘Groeit mee’ worden de opgaven moeilijker als je ze goed maakt, net als in de echte toets.</p></div>' +
      '<div class="fgroup"><span class="lab">Aantal opgaven</span>' + seg('count', [[10, '10'], [20, '20'], [0, 'Tot ik stop']], p.count) + '</div>' +
      '<p class="hint">' + msg + '</p><button class="btn pri wide" data-act="startprac"' + (n ? '' : ' disabled') + '>Start met oefenen</button></section>';
  }

  /* ---------- toets en oefenen ---------- */
  function partCounts(s) { var nH = s.plan.filter(function (x) { return x.part === 'H'; }).length; return { H: nH, N: s.plan.length - nH }; }
  function introHtml(s) {
    var c = partCounts(s), M = E.MODES[s.mode], isH = s.phase === 'introH', missed = (s.skipped || []).length;
    var h = '<main class="wrap run"><section class="card"><p class="eyebrow">' + M.name + ' · deel ' + (isH ? 1 : 2) + ' van 2</p><h2>' + (isH ? 'Hoofdrekenen' : 'Niet-hoofdrekenen') + '</h2>';
    if (!isH && missed) h += '<p class="tip"><b>De tijd voor hoofdrekenen was om.</b> ' + missed + (missed === 1 ? ' opgave heb' : ' opgaven heb') + ' je niet gemaakt. Die ' + (missed === 1 ? 'telt' : 'tellen') + ' als fout.</p>';
    h += '<ul class="facts"><li>' + (isH ? c.H : c.N) + ' opgaven</li><li>' + Math.round((isH ? M.tH : M.tN) / 60) + ' minuten</li><li>' + (isH ? 'geen rekenmachine' : 'soms een rekenmachine') + '</li></ul><div class="prose">';
    if (isH) h += '<p>Je hebt ongeveer één minuut per opgave. De klok loopt door tot het deel af is. Wil je hem niet zien? Verberg hem met het oog naast de tijd. In de laatste minuut komt hij vanzelf terug.</p><p>Je kunt niet terug naar een vorige opgave en je kunt geen opgave overslaan. Weet je het niet? Vul dan je beste gok in.</p><p>Kladpapier mag je gebruiken. De toets past zich aan: na een goed antwoord wordt de volgende opgave vaak moeilijker.</p>';
    else h += '<p>Lees elke opgave goed en let op wat er precies gevraagd wordt. In sommige opgaven staan gegevens die je niet nodig hebt.</p><p>Bij een deel van de opgaven mag je de rekenmachine gebruiken. Dat zie je aan de knop Rekenmachine onder de opgave.</p><p>Ook hier kun je niet terug en niets overslaan.</p>';
    h += '<p class="tip"><b>Antwoorden invullen.</b> Typ alleen cijfers en zo nodig een komma, zonder punt in grote getallen: 1250 en 12,5. Voor een negatief getal tik je op ±. Met Enter kom je op de knop; nog een keer Enter gaat naar de volgende opgave.</p>';
    return h + '</div><button class="btn pri wide" data-act="begin">Start deel ' + (isH ? 1 : 2) + '</button><button class="btn ghost" data-act="stop">Toets stoppen</button></section></main>';
  }
  function viewRun() {
    var s = S.s; if (!s) return '';
    if (s.kind === 'test' && (s.phase === 'introH' || s.phase === 'introN')) return introHtml(s);
    var u = S.ui, q = u.q, test = s.kind === 'test', left, total, num, right, bar;
    if (test) {
      var c = partCounts(s); total = c[q.part]; num = q.part === 'H' ? s.idx + 1 : s.idx - c.H + 1;
      left = '<b>' + E.PART[q.part] + '</b><span>Opgave ' + num + ' van ' + total + '</span>';
      right = timerHtml(remaining(), 'Resterende tijd', !timerShown(remaining()));
      bar = s.idx / s.plan.length;
    } else {
      total = s.sel.count; num = s.items.length + (u.checked ? 0 : 1); var good = s.items.filter(function (x) { return x.ok; }).length;
      left = '<b>Oefenen</b><span>Opgave ' + num + (total ? ' van ' + total : '') + ' · ' + good + ' goed</span>';
      right = timerHtml(qElapsed(), 'Tijd voor deze opgave', S.timerHidden);
      bar = total ? s.items.length / total : 0;
    }
    // één voortgangsbalk voor de hele toets, met een streepje waar deel 2 begint
    var split = test ? '<b class="rb-split" data-l="' + (partCounts(s).H / s.plan.length * 100).toFixed(2) + '"></b>' : '';
    var h = '<header class="runbar"><div class="runbar-in"><div class="rb-l">' + left + '</div><div class="rb-r">' + right + '<button class="btn ghost sm quiet" data-act="stop" aria-label="' + (test ? 'Toets stoppen' : 'Stoppen met oefenen') + '">' + I.x + '<span class="lbl">Stoppen</span></button></div></div><div class="rb-prog" role="progressbar" aria-label="Voortgang" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(bar * 100) + '"><i data-w="' + Math.round(bar * 100) + '"></i>' + split + '</div></header>';
    h += '<main class="wrap run' + (S.calc.open ? ' calc-open' : '') + '"><article class="q">';
    if (!test) h += '<div class="q-meta"><span class="pill">' + q.et + ' · ' + (ET[q.et] || q.name) + '</span><span>' + E.PART[q.part] + '</span>' + dots(q.level) + '</div>';
    h += qBody(q) + answerUi(q, u, 'ans', test);
    if (q.calc && !u.checked) h += '<div class="row"><button class="btn sm" data-act="calc" aria-expanded="' + S.calc.open + '">' + I.calc + 'Rekenmachine</button></div>';
    h += '</article>';
    if (!test && u.checked) h += feedback(q, u.given, u.ok);
    var lastQ = test ? s.idx + 1 >= s.plan.length : (total && s.items.length >= total), nextPart = test && s.plan[s.idx + 1] && s.plan[s.idx + 1].part !== q.part;
    h += '<div class="actbar">' + (test ? '<p class="kbd tiny" aria-hidden="true">Druk op Enter om verder te gaan</p>' : '');
    if (test) h += '<button class="btn pri" id="submit" data-act="next"' + (E.isComplete(q, u.given) ? '' : ' disabled') + '>' + (lastQ ? 'Toets afronden' : nextPart ? 'Naar deel 2' : 'Volgende opgave') + '</button>';
    else if (!u.checked) h += '<button class="btn pri" id="submit" data-act="check"' + (E.isComplete(q, u.given) ? '' : ' disabled') + '>Controleer</button>';
    else h += '<button class="btn pri" id="submit" data-act="pnext">' + (lastQ ? 'Bekijk het resultaat' : 'Volgende opgave') + '</button>';
    h += '</div></main>';
    if (S.calc.open) h += calcHtml();
    return h;
  }
  function timerHtml(sec, label, hide) {
    return '<span id="timer" class="timer" role="timer" aria-label="' + label + '"' + (hide ? ' hidden' : '') + '>' + I.clock + '<span id="timer-t">' + fmtTime(sec) + '</span></span>' +
      '<button type="button" class="btn ghost sm icon" data-act="timerhide" aria-pressed="' + !!S.timerHidden + '" aria-label="' + (S.timerHidden ? 'Toon de tijd' : 'Verberg de tijd') + '" title="' + (S.timerHidden ? 'Toon de tijd' : 'Verberg de tijd') + '">' + (S.timerHidden ? I.eye : I.eyeOff) + '</button>';
  }
  // verborgen tijd komt in de laatste minuut van een toetsdeel vanzelf terug
  function timerShown(rem) { return !S.timerHidden || rem <= 60; }
  function remaining() { var s = S.s; return s.left[s.phase] - (S.runAt ? (Date.now() - S.runAt) / 1000 : 0); }
  function commit() {
    var s = S.s; if (!s) return;
    if (S.runAt && s.kind === 'test' && (s.phase === 'H' || s.phase === 'N')) { var d = (Date.now() - S.runAt) / 1000; s.left[s.phase] = Math.max(0, s.left[s.phase] - d); s.spent[s.phase] += d; }
    S.runAt = Date.now();
  }
  var ticker = null;
  function startTick() { stopTick(); ticker = setInterval(onTick, 400); }
  function stopTick() { if (ticker) { clearInterval(ticker); ticker = null; } }
  function onTick() {
    var s = S.s, el = document.getElementById('timer');
    if (!s || S.view !== 'run') return stopTick();
    if (s.kind === 'test') {
      if (s.phase !== 'H' && s.phase !== 'N') return;
      var rem = remaining(); if (rem <= 0) return timeUp();
      if (el) { document.getElementById('timer-t').textContent = fmtTime(rem); el.classList.toggle('low', rem <= (s.phase === 'H' ? 60 : 300)); el.hidden = !timerShown(rem); }
    } else if (el && S.ui && !S.ui.checked) document.getElementById('timer-t').textContent = fmtTime(qElapsed());
  }
  function showQuestion() {
    var s = S.s; S.calc = { open: false, expr: '', res: '' };
    if (!s.cur && !E.nextQuestion(s)) return finish();
    S.ui = newUi(s.cur); saveSession(); render(); window.scrollTo(0, 0); startTick();
    if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) { var f = document.getElementById('ans0'); if (f) f.focus(); }
  }
  function beginPart() {
    var s = S.s; s.phase = s.phase === 'introH' ? 'H' : 'N'; S.runAt = Date.now(); showQuestion();
  }
  function timeUp() {
    var s = S.s, part = s.phase; commit(); s.left[part] = 0;
    var rest = []; while (s.plan[s.idx] && s.plan[s.idx].part === part) { rest.push(s.plan[s.idx]); s.idx++; }
    s.skipped = (s.skipped || []).concat(rest); s.cur = null; S.ui = null; S.calc.open = false;
    if (part === 'H' && s.plan[s.idx]) { s.phase = 'introN'; stopTick(); saveSession(); render(); window.scrollTo(0, 0); }
    else { S.notice = 'De tijd was om. De opgaven die je niet hebt gemaakt, tellen als fout.'; finish(); }
  }
  function submitTest() {
    var s = S.s, u = S.ui; if (!E.isComplete(u.q, u.given)) return;
    var part = u.q.part; commit(); E.record(s, u.given, qElapsed());
    var slot = s.plan[s.idx];
    if (!slot) return finish();
    if (slot.part !== part) { s.phase = 'introN'; S.ui = null; stopTick(); saveSession(); render(); window.scrollTo(0, 0); return; }
    showQuestion();
  }
  function checkPractice() {
    var s = S.s, u = S.ui; if (!E.isComplete(u.q, u.given) || u.checked) return;
    u.acc = qElapsed(); u.t0 = null; u.ok = E.record(s, u.given, u.acc); u.checked = true; S.calc.open = false; saveSession(); render();
    var fb = document.querySelector('.fb'); if (fb && fb.scrollIntoView) fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  function finish() {
    var s = S.s; if (!s) return;
    commit(); stopTick();
    if (!s.items.length && !(s.skipped || []).length) { LS.del('session'); S.s = null; S.ui = null; go(s.kind === 'test' ? 'start' : 'oefenen'); return; }
    var sum = E.summarize(s), counts = s.kind === 'test' || sum.n >= 5;
    if (counts) { S.history = cleanHist(S.history.concat([E.historyEntry(s, sum)]), S.wiped); saveHistory(); }
    else S.notice = 'Deze ronde was te kort om mee te tellen in je voortgang. Vanaf vijf opgaven wordt een oefenronde bewaard.';
    S.result = { kind: s.kind, mode: s.mode, t: Date.now(), sum: sum, sel: s.sel || null, spent: s.spent, notice: S.notice, items: s.items.map(function (it) { return { q: it.q, given: it.given, ok: it.ok, secs: it.secs }; }) };
    S.notice = ''; LS.set('last', S.result); LS.del('session'); S.s = null; S.ui = null; S.calc.open = false; S.onlyWrong = false; S.view = 'result'; render(); window.scrollTo(0, 0);
  }
  function startTest(mode) { S.s = E.newTest(mode, seed()); S.ui = null; S.notice = ''; S.view = 'run'; saveSession(); render(); window.scrollTo(0, 0); }
  function startPractice(sel) {
    var s = E.newPractice(sel, seed());
    if (!E.nextQuestion(s)) return;
    S.s = s; S.view = 'run'; S.notice = ''; S.runAt = Date.now(); showQuestion();
  }
  function resume() {
    var s = S.s; if (!s) return;
    S.view = 'run'; S.runAt = Date.now();
    if (s.kind === 'test' && (s.phase === 'introH' || s.phase === 'introN')) { render(); window.scrollTo(0, 0); return; }
    showQuestion();
  }

  /* ---------- rekenmachine ---------- */
  function calcEval(expr) {
    var s = expr.replace(/,/g, '.').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-'), i = 0;
    function atom() {
      var v, ch = s.charAt(i);
      if (ch === '(') { i++; v = sum(); if (s.charAt(i) !== ')') throw new Error('haakje'); i++; }
      else if (ch === '√') { i++; v = Math.sqrt(atom()); }
      else if (ch === '-') { i++; v = -atom(); }
      else { var st = i; while (/[0-9.]/.test(s.charAt(i))) i++; if (st === i) throw new Error('getal'); v = parseFloat(s.slice(st, i)); }
      while (s.charAt(i) === '²') { i++; v = v * v; }
      return v;
    }
    function term() { var v = atom(); while (s.charAt(i) === '*' || s.charAt(i) === '/') { var op = s.charAt(i++), w = atom(); v = op === '*' ? v * w : v / w; } return v; }
    function sum() { var v = term(); while (s.charAt(i) === '+' || s.charAt(i) === '-') { var op = s.charAt(i++), w = term(); v = op === '+' ? v + w : v - w; } return v; }
    var out = sum(); if (i < s.length || !isFinite(out)) throw new Error('rest');
    return out;
  }
  function calcFmt(v) { return String(parseFloat(v.toPrecision(12))).replace('.', ','); }
  function calcHtml() {
    var c = S.calc, k = function (lab, val, cls, aria) { return '<button type="button" data-act="ck" data-k="' + esc(val) + '"' + (cls ? ' class="' + cls + '"' : '') + (aria ? ' aria-label="' + aria + '"' : '') + '>' + lab + '</button>'; };
    var canPut = S.ui && S.ui.q.type === 'multi' && S.ui.q.fields.length === 1 && c.res !== '' && c.res !== 'Fout';
    return '<div class="sheet-ov"><section class="calc" role="dialog" aria-label="Rekenmachine"><div class="calc-top"><span>Rekenmachine</span><button class="btn ghost sm" data-act="calc">Sluiten</button></div>' +
      '<div class="calc-d"><div class="calc-e">' + esc(c.expr) + '</div><div class="calc-r" aria-live="polite">' + esc(c.res === '' ? '0' : c.res) + '</div></div><div class="calc-k">' +
      k('C', 'C', 'op', 'Wissen') + k('(', '(', 'op') + k(')', ')', 'op') + k('⌫', 'B', 'op', 'Eén teken terug') +
      k('7', '7') + k('8', '8') + k('9', '9') + k('÷', '÷', 'op', 'Gedeeld door') + k('4', '4') + k('5', '5') + k('6', '6') + k('×', '×', 'op', 'Keer') +
      k('1', '1') + k('2', '2') + k('3', '3') + k('−', '−', 'op', 'Min') + k('0', '0') + k(',', ',') + k('√', '√', 'op', 'Wortel') + k('+', '+', 'op', 'Plus') +
      k('x²', '²', 'op', 'Kwadraat') + (canPut ? k('Antwoord', 'P', 'op', 'Zet de uitkomst in het antwoordvak') : k('±', 'N', 'op', 'Plus of min')) + k('=', '=', 'eq', 'Is gelijk aan') + '</div></section></div>';
  }
  function calcKey(k) {
    var c = S.calc;
    if (k === 'C') { c.expr = ''; c.res = ''; }
    else if (k === 'B') c.expr = c.expr.slice(0, -1);
    else if (k === '=') { if (c.expr) { try { c.res = calcFmt(calcEval(c.expr)); } catch (e) { c.res = 'Fout'; } } }
    else if (k === 'N') c.expr = c.expr.charAt(0) === '−' ? c.expr.slice(1) : '−' + c.expr;
    else if (k === 'P') { if (S.ui && c.res && c.res !== 'Fout') { S.ui.given[0] = cleanNum(c.res.replace('−', '-')); c.open = false; } }
    else {
      // na een uitkomst: verder rekenen met die uitkomst bij een bewerking, opnieuw beginnen bij een cijfer
      if (c.res !== '' && c.res !== 'Fout' && c.justEq) { c.expr = /[0-9,(√]/.test(k) ? '' : c.res.replace('-', '−'); }
      if (c.expr.length < 40) c.expr += k;
    }
    c.justEq = k === '='; render();
  }

  /* ---------- uitslag ---------- */
  function bars(obj, order, names) {
    return '<div class="bars">' + order.filter(function (k) { return obj[k] && obj[k][1]; }).map(function (k) {
      var a = obj[k][0], b = obj[k][1];
      return '<div class="bar"><span>' + names[k] + '</span><b>' + a + ' van ' + b + '</b><div class="bar-t" role="img" aria-label="' + pct(a, b) + ' procent goed"><i data-w="' + pct(a, b) + '"></i></div></div>';
    }).join('') + '</div>';
  }
  function viewResult() {
    var R = S.result; if (!R) return viewStart();
    var sum = R.sum, test = R.kind === 'test', v = E.verdict(sum.score), h = '';
    var names = {}; Object.keys(E.DOM).forEach(function (d) { names[d] = E.DOM[d].name; });
    h += '<header class="stack"><p class="eyebrow">Uitslag · ' + MODE_NAME[R.mode] + ' · ' + fmtDate(R.t) + '</p><h2>' + (test ? 'Je oefenscore' : 'Zo ging het oefenen') + '</h2></header>';
    if (R.notice) h += '<p class="tip">' + R.notice + '</p>';
    if (test) {
      h += '<section class="card"><div class="score"><span class="score-n">' + sum.score + '<span class="score-of"> / 100</span></span><div class="score-l">' + pill(v) + '<span class="small">' + sum.ok + ' van de ' + sum.n + ' opgaven goed</span></div></div><p>' + v.text + '</p>' +
        '<details class="more"><summary>' + I.info + 'Hoe werkt de oefenscore?</summary><p class="small">De oefenscore loopt van 0 tot 100 en weegt mee hoe moeilijk je opgaven waren. Wie goed antwoordt, krijgt moeilijkere opgaven. Daarom zegt het aantal goede antwoorden niet alles. Vanaf 70 ben je in deze app op koers. Het is geen officiële RWT-score.</p></details></section>';
      h += '<section class="card"><h3>Per onderdeel</h3>' + bars(sum.part, ['H', 'N'], E.PART) + '<p class="small">Gebruikte tijd: hoofdrekenen ' + fmtDur(R.spent.H) + ', niet-hoofdrekenen ' + fmtDur(R.spent.N) + '.' + (sum.missed ? ' Niet gemaakt door tijdgebrek: ' + sum.missed + '.' : '') + '</p></section>';
    } else {
      h += '<section class="card"><div class="score"><span class="score-n">' + sum.ok + '<span class="score-of"> / ' + sum.n + '</span></span><div class="score-l"><span class="small">opgaven goed</span><span class="small">oefenscore ' + sum.score + (sum.n < 10 ? ' (ruwe schatting bij weinig opgaven)' : '') + '</span></div></div></section>';
    }
    var doms = Object.keys(sum.dom).filter(function (d) { return sum.dom[d][1] >= 2; }).sort(function (a, b) { return sum.dom[a][0] / sum.dom[a][1] - sum.dom[b][0] / sum.dom[b][1]; });
    h += '<section class="card"><h3>Per domein</h3>' + bars(sum.dom, ['A', 'B', 'C', 'D'], names);
    if (doms.length > 1 && sum.dom[doms[0]][0] < sum.dom[doms[0]][1]) h += '<p>De meeste fouten maakte je bij <b>' + E.DOM[doms[0]].name.toLowerCase() + '</b>.</p><div class="row"><button class="btn sm" data-act="pracdom" data-d="' + doms[0] + '">Oefen dit domein</button></div>';
    h += '</section>';
    var wrong = R.items.filter(function (x) { return !x.ok; }).length, lastPart = '';
    h += '<section class="card"><div class="row between"><h3>Alle opgaven</h3>' + (wrong && wrong < R.items.length ? '<div class="seg seg-s" role="group" aria-label="Welke opgaven">' + [[false, 'Alle (' + R.items.length + ')'], [true, 'Fout (' + wrong + ')']].map(function (o) { return '<button type="button" data-act="onlywrong" data-val="' + o[0] + '" aria-pressed="' + (S.onlyWrong === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div>' : '') + '</div><div class="revs">';
    R.items.forEach(function (it, i) {
      if (S.onlyWrong && it.ok) return;
      var q = it.q;
      // tussenkopjes per onderdeel, zodat dat niet bij elke regel hoeft te staan
      if (q.part !== lastPart) { lastPart = q.part; h += '<p class="rev-g">' + E.PART[q.part] + '</p>'; }
      h += '<details class="rev"><summary><span class="rev-n">' + (i + 1) + '</span><span class="rev-i ' + (it.ok ? 'ok' : 'no') + '">' + (it.ok ? I.ok : I.no) + '<span class="sr">' + (it.ok ? 'Goed' : 'Fout') + '</span></span><span class="rev-t">' + q.name + '</span><span class="rev-m">' + q.et + ' · ' + fmtSecs(it.secs) + '</span>' + I.chev + '</summary>' +
        '<div class="rev-b">' + qBody(q) + '<dl class="kv"><dt>Jouw antwoord</dt><dd>' + E.givenHtml(q, it.given) + '</dd><dt>Goede antwoord</dt><dd>' + E.answerHtml(q) + '</dd><dt>Niveau</dt><dd>' + dots(q.level) + ' ' + LVL[q.level].toLowerCase() + '</dd></dl><div class="stack"><b>Uitwerking</b>' + q.expl + '</div><div class="row"><button class="btn sm" data-act="practpl" data-id="' + q.id + '">Oefen dit soort opgave</button></div></div></details>';
    });
    h += '</div></section><div class="row"><a class="btn" href="#start" data-act="nav" data-v="start">Naar start</a>' + (test ? '<button class="btn pri" data-act="start" data-mode="' + R.mode + '">Nog een proeftoets</button>' : '<a class="btn pri" href="#oefenen" data-act="nav" data-v="oefenen">Verder oefenen</a>') + '</div>';
    return h;
  }

  /* ---------- voortgang ---------- */
  function progressChart(list) {
    var W = 320, H = 176, L = 30, R = 58, T = 12, B = 26, pw = W - L - R, ph = H - T - B, n = list.length, s = '';
    var X = function (i) { return n === 1 ? L + pw / 2 : L + i * pw / (n - 1); }, Y = function (v) { return T + ph - v / 100 * ph; };
    [0, 25, 50, 75, 100].forEach(function (v) { s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" class="pg-grid"/><text x="' + (L - 6) + '" y="' + (Y(v) + 4) + '" text-anchor="end" class="pg-t">' + v + '</text>'; });
    s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(70) + '" y2="' + Y(70) + '" class="pg-goal"/><text x="' + (W - R + 5) + '" y="' + (Y(70) + 4) + '" class="pg-t pg-tg">op koers</text>';
    var pts = list.map(function (h, i) { return X(i).toFixed(1) + ',' + Y(h.score).toFixed(1); });
    if (n > 1) s += '<polygon class="pg-area" points="' + X(0).toFixed(1) + ',' + Y(0) + ' ' + pts.join(' ') + ' ' + X(n - 1).toFixed(1) + ',' + Y(0) + '"/><polyline class="pg-ln" points="' + pts.join(' ') + '"/>';
    list.forEach(function (h, i) {
      s += '<circle class="pg-dot' + (i === n - 1 ? ' last' : '') + '" cx="' + X(i).toFixed(1) + '" cy="' + Y(h.score).toFixed(1) + '" r="' + (i === n - 1 ? 5.5 : 4.5) + '"/>';
      s += '<circle class="pg-hit" cx="' + X(i).toFixed(1) + '" cy="' + Y(h.score).toFixed(1) + '" r="14" tabindex="0" role="img" aria-label="' + fmtDate(h.t) + ', ' + MODE_NAME[h.mode] + ', oefenscore ' + h.score + '" data-tip="' + esc('<b>' + h.score + '</b><br>' + fmtDate(h.t) + ' · ' + MODE_NAME[h.mode] + '<br>' + h.ok + ' van ' + h.n + ' goed') + '"/>';
    });
    s += '<text x="' + X(0).toFixed(1) + '" y="' + (H - 7) + '" text-anchor="' + (n === 1 ? 'middle' : 'start') + '" class="pg-t">' + fmtDate(list[0].t) + '</text>';
    if (n > 1) s += '<text x="' + X(n - 1).toFixed(1) + '" y="' + (H - 7) + '" text-anchor="end" class="pg-t">' + fmtDate(list[n - 1].t) + '</text>';
    return '<div class="chart"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Lijngrafiek van je oefenscore per sessie">' + s + '</svg></div>';
  }
  function viewProgress() {
    var all = S.history, h = '<header class="stack"><h2>Je voortgang</h2><p class="lead">Elke proeftoets en elke oefenronde wordt hier bijgehouden, alleen voor jou.</p></header>';
    if (!all.length) return h + '<section class="card"><h3>Nog geen resultaten</h3><p>Maak een korte proeftoets om te zien waar je staat. Dat kost ongeveer drie kwartier.</p><div class="row"><button class="btn pri" data-act="start" data-mode="short">Start de korte proeftoets</button><a class="btn" href="#oefenen" data-act="nav" data-v="oefenen">Eerst oefenen</a></div></section>';
    var list = all.filter(function (x) { return S.filter === 'alles' ? true : S.filter === 'toets' ? x.mode !== 'oefen' : x.mode === 'oefen'; }).slice(-20);
    var seg = '<div class="seg" role="group" aria-label="Kies wat de grafiek laat zien">' + [['toets', 'Proeftoetsen'], ['oefen', 'Oefenen'], ['alles', 'Alles']].map(function (o) { return '<button type="button" data-act="filter" data-val="' + o[0] + '" aria-pressed="' + (S.filter === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</div>';
    var best = list.length ? Math.max.apply(null, list.map(function (x) { return x.score; })) : 0;
    var stats = list.length ? '<dl class="stats"><div><dt>Laatste</dt><dd>' + list[list.length - 1].score + '</dd></div><div><dt>Hoogste</dt><dd>' + best + '</dd></div><div><dt>Sessies</dt><dd>' + list.length + '</dd></div></dl>' : '';
    h += '<section class="card"><h3>Oefenscore per sessie</h3>' + seg + stats + (list.length ? progressChart(list) + '<p class="small">' + (list.length === 1 ? 'Dit is je eerste meting. Na een tweede sessie zie je hier een lijn.' : 'De laatste ' + list.length + ' sessies. Tik op een punt voor de details.') + '</p>' : '<p class="small">Nog geen sessies van dit soort.</p>') + '</section>';
    var recent = all.slice(-12), dom = {}, et = {};
    recent.forEach(function (x) {
      Object.keys(x.dom || {}).forEach(function (d) { dom[d] = dom[d] || [0, 0]; dom[d][0] += x.dom[d][0]; dom[d][1] += x.dom[d][1]; });
      Object.keys(x.et || {}).forEach(function (e) { et[e] = et[e] || [0, 0]; et[e][0] += x.et[e][0]; et[e][1] += x.et[e][1]; });
    });
    var names = {}; Object.keys(E.DOM).forEach(function (d) { names[d] = E.DOM[d].name; });
    h += '<section class="card"><h3>Per domein</h3><p class="small">Over je laatste ' + recent.length + (recent.length === 1 ? ' sessie.' : ' sessies.') + '</p>' + bars(dom, ['A', 'B', 'C', 'D'], names) + '</section>';
    var weak = Object.keys(et).filter(function (e) { return et[e][1] >= 3 && et[e][0] / et[e][1] < 0.7; }).sort(function (a, b) { return et[a][0] / et[a][1] - et[b][0] / et[b][1]; }).slice(0, 5);
    h += '<section class="card"><h3>Hier valt het meeste te winnen</h3>';
    if (weak.length) h += '<ul class="list">' + weak.map(function (e) { return '<li><span>' + (ET[e] || e) + '<span class="tiny">' + e + ' · ' + et[e][0] + ' van ' + et[e][1] + ' goed</span></span><button class="btn sm" data-act="pracet" data-et="' + e + '">Oefen</button></li>'; }).join('') + '</ul>';
    else h += '<p class="small">Er is nog geen onderwerp dat er duidelijk uitspringt. Na meer opgaven verschijnen hier de onderwerpen waar je de meeste fouten maakt.</p>';
    h += '</section>';
    h += '<section class="card"><h3>Alle sessies</h3><div class="tblw"><table class="tbl hist"><thead><tr><th scope="col">Datum</th><th scope="col">Soort</th><th scope="col">Goed</th><th scope="col">Score</th></tr></thead><tbody>' +
      all.slice().reverse().slice(0, 40).map(function (x) { return '<tr><td class="tl">' + fmtDate(x.t) + '</td><td class="tl">' + MODE_NAME[x.mode] + '</td><td>' + x.ok + ' / ' + x.n + '</td><td><b>' + x.score + '</b></td></tr>'; }).join('') + '</tbody></table></div>' +
      '<p class="tiny">' + (canStore ? 'Je voortgang wordt bewaard in deze browser. Als je de browsergegevens wist of een ander apparaat gebruikt, is hij weg.' : 'Deze browser kan je voortgang niet bewaren. Hij blijft staan zolang deze pagina open is.') + '</p>' +
      '<div class="row">' + (LS.get('last') ? '<button class="btn sm" data-act="showlast">Bekijk de laatste uitslag</button>' : '') + '<button class="btn sm ghost quiet" data-act="askclear">Wis mijn voortgang</button></div></section>';
    return h;
  }

  /* ---------- uitleg ---------- */
  function viewInfo() {
    var h = '<header class="stack"><h2>Over de toets</h2><p class="lead">Wat de landelijke reken- en wiskundetoets voor de pabo (RWT) is, en hoe deze app daarop aansluit.</p></header>';
    h += '<section class="card"><h3>De echte toets</h3><div class="prose"><ul>' +
      '<li>De RWT is sinds 1 september 2024 de rekentoets voor de pabo en is de opvolger van de Wiscat.</li>' +
      '<li>Je krijgt 55 opgaven: 17 keer hoofdrekenen in 17 minuten en 38 andere opgaven in 103 minuten. Vijftig opgaven tellen mee, vijf zijn proefopgaven.</li>' +
      '<li>De toets is adaptief. Na een goed antwoord volgt een moeilijkere opgave. Je kunt niet terug en niets overslaan.</li>' +
      '<li>Er zijn vier domeinen: hele getallen (30%), verhoudingen, procenten, breuken en decimale getallen (28%), meten en meetkunde (24%) en verbanden en statistiek (18%).</li>' +
      '<li>Je bent geslaagd bij een schaalscore van 575 of hoger, op een schaal van 0 tot 1.000.</li>' +
      '<li>Kladpapier mag altijd. Een rekenmachine is er alleen bij een deel van de opgaven buiten het hoofdrekenen.</li></ul>' +
      '<p class="small">Bron: <a href="https://cito.nl/media/12hjkpx5/cito-rwt-handreiking-31.pdf" target="_blank" rel="noopener">Handreiking RWT van Cito, versie 3.1 (augustus 2026)</a>. De regels voor het aantal kansen staan in de onderwijs- en examenregeling van je eigen hogeschool.</p></div></section>';
    h += '<section class="card"><h3>Wat deze app wel en niet is</h3><div class="prose"><ul>' +
      '<li>De opbouw, de tijden en de verdeling over de domeinen volgen de echte toets.</li>' +
      '<li>De opgaven zijn zelfgemaakt bij de eindtermen uit de handreiking. Het zijn geen echte toetsopgaven: die geeft Cito niet vrij.</li>' +
      '<li>De oefenscore (0 tot 100) is een eigen maat van deze app. Je kunt er geen RWT-score uit afleiden.</li>' +
      '<li>In de echte toets tellen vijf proefopgaven niet mee. In deze app tellen alle opgaven mee.</li>' +
      '<li>Maak daarnaast de officiële oefentoets van Cito. De link staat op <a href="https://www.goedvoorbereidnaardepabo.nl/rekenen-wiskunde/" target="_blank" rel="noopener">goedvoorbereidnaardepabo.nl</a>.</li></ul></div></section>';
    h += '<section class="card"><h3>Antwoorden invullen</h3><div class="prose"><ul><li>Typ alleen cijfers en zo nodig een komma: 1250 en 12,5.</li><li>Zet geen punt in grote getallen. In de opgaven staat 1.250, maar je typt 1250.</li><li>Voor een negatief getal tik je op de knop ± naast het invulvak.</li><li>Staat er dat je moet afronden, doe dat dan precies zoals gevraagd.</li></ul></div></section>';
    h += '<section class="card"><h3>Zo pak je een verhaalopgave aan</h3><div class="prose"><ul><li>Lees eerst de laatste zin: wat wordt er precies gevraagd, en in welke eenheid?</li><li>Lees daarna het hele verhaal en streep weg wat je niet nodig hebt.</li><li>Schrijf tussenstappen op kladpapier. Reken niet alles uit je hoofd.</li><li>Kijk aan het eind of je antwoord kan kloppen. Een deur van 20 meter hoog bestaat niet.</li></ul></div></section>';
    h += '<section class="card"><h3>Alle soorten opgaven</h3><p class="small">Tik op een onderwerp om er tien opgaven van te oefenen.</p>';
    ['A', 'B', 'C', 'D'].forEach(function (d) {
      var ts = TPL.filter(function (t) { return t.dom === d; });
      h += '<details class="acc"><summary>' + E.DOM[d].name + ' <span class="tiny">' + ts.length + ' soorten</span></summary><ul class="list">' + ts.map(function (t) { return '<li><span>' + t.name + '<span class="tiny">' + t.et + ' · ' + (t.part === 'H' ? 'hoofdrekenen' : 'niet-hoofdrekenen') + '</span></span><button class="btn sm" data-act="practpl" data-id="' + t.id + '">Oefen</button></li>'; }).join('') + '</ul></details>';
    });
    return h + '</section>';
  }

  /* ---------- kader ---------- */
  function tabs() {
    var cur = S.view === 'result' ? '' : S.view, t = function (v, hash, icon, lab) { return '<a class="tab" href="#' + hash + '" data-act="nav" data-v="' + v + '"' + (cur === v ? ' aria-current="page"' : '') + '>' + icon + '<span>' + lab + '</span></a>'; };
    return '<nav class="tabs" aria-label="Hoofdmenu"><div class="tabs-in">' + t('start', 'start', I.home, 'Start') + t('oefenen', 'oefenen', I.pen, 'Oefenen') + t('voortgang', 'voortgang', I.chart, 'Voortgang') + t('uitleg', 'over-de-toets', I.info, 'Uitleg') + '</div></nav>';
  }
  function dialogHtml() {
    var d = S.dialog;
    return '<div class="dlg-ov"><div class="dlg" role="alertdialog" aria-modal="true" aria-labelledby="dlg-t"><h3 id="dlg-t">' + d.title + '</h3><p>' + d.text + '</p><div class="row"><button class="btn pri" data-act="dlgno" id="dlg-no">' + d.no + '</button><button class="btn" data-act="dlgyes">' + d.yes + '</button></div></div></div>';
  }
  var VIEWS = { start: viewStart, oefenen: viewPractice, voortgang: viewProgress, uitleg: viewInfo, result: viewResult };
  function focusKey(el) {
    if (!el || !el.getAttribute || !app.contains(el)) return null;
    if (el.id) return '#' + el.id;
    var a = el.getAttribute('data-act'); if (!a) return null;
    var sel = '[data-act="' + a + '"]';
    ['data-i', 'data-k', 'data-val', 'data-d', 'data-mode', 'data-v', 'data-id', 'data-et'].forEach(function (n) { var v = el.getAttribute(n); if (v !== null) sel += '[' + n + '="' + v.replace(/["\\]/g, '\\$&') + '"]'; });
    return sel;
  }
  function render() {
    var key = focusKey(document.activeElement), h;
    if (S.view === 'run' && S.s) h = viewRun();
    else { if (S.view === 'run') S.view = 'start'; h = tabs() + '<main class="wrap">' + VIEWS[S.view]() + '</main>'; }
    app.innerHTML = h + (S.dialog ? dialogHtml() : '');
    Array.prototype.forEach.call(app.querySelectorAll('[data-w]'), function (el) { el.style.width = el.getAttribute('data-w') + '%'; });
    Array.prototype.forEach.call(app.querySelectorAll('[data-l]'), function (el) { el.style.left = el.getAttribute('data-l') + '%'; });
    if (S.dialog) { var b = document.getElementById('dlg-no'); if (b) b.focus(); return; }
    var el = null; if (key) { try { el = app.querySelector(key); } catch (e) { el = null; } }
    if (el && !el.disabled && el.focus) {
      try { el.focus({ preventScroll: true }); } catch (e2) { el.focus(); }
      if (el.setSelectionRange && el.value) { try { el.setSelectionRange(el.value.length, el.value.length); } catch (e3) { /* niet elk veld kan dit */ } }
    }
  }
  function go(v) {
    S.view = v;
    var hash = { start: 'start', oefenen: 'oefenen', voortgang: 'voortgang', uitleg: 'over-de-toets' }[v];
    if (hash && location.hash !== '#' + hash) { try { location.hash = hash; } catch (e) { /* hash niet beschikbaar */ } }
    render(); window.scrollTo(0, 0);
  }
  function viewFromHash() { return { oefenen: 'oefenen', voortgang: 'voortgang', 'over-de-toets': 'uitleg' }[(location.hash || '').replace('#', '')] || 'start'; }
  function syncSubmit() { var b = document.getElementById('submit'), u = S.ui; if (b && u && !u.checked) b.disabled = !E.isComplete(u.q, u.given); }
  function uiFor(el) { return el.closest('.demo') ? S.demo : S.ui; }

  /* ---------- bediening ---------- */
  var ACT = {
    nav: function (el) { if (S.view === 'run') return; go(el.getAttribute('data-v')); },
    start: function (el) { startTest(el.getAttribute('data-mode')); },
    resume: function () { resume(); },
    discard: function () { LS.del('session'); S.s = null; S.ui = null; render(); },
    begin: function () { beginPart(); },
    next: function () { submitTest(); },
    check: function () { checkPractice(); },
    pnext: function () { showQuestion(); },
    stop: function () {
      var s = S.s; if (!s) return;
      if (s.kind === 'oefen') { if (s.items.length) finish(); else { LS.del('session'); S.s = null; S.ui = null; stopTick(); go('oefenen'); } return; }
      commit(); S.runAt = 0; stopTick();
      S.dialog = { title: 'Toets stoppen?', text: 'Je antwoorden van deze toets worden dan niet bewaard en tellen niet mee in je voortgang.', yes: 'Stoppen', no: 'Doorgaan met de toets', onYes: function () { LS.del('session'); S.s = null; S.ui = null; S.calc.open = false; go('start'); }, onNo: function () { S.runAt = Date.now(); if (S.ui) S.ui.t0 = Date.now(); startTick(); } };
      if (S.ui && S.ui.t0) { S.ui.acc = qElapsed(); S.ui.t0 = null; }
      render();
    },
    dlgyes: function () { var d = S.dialog; S.dialog = null; if (d && d.onYes) d.onYes(); else render(); },
    dlgno: function () { var d = S.dialog; S.dialog = null; if (d && d.onNo) d.onNo(); render(); },
    pick: function (el) { var u = uiFor(el); if (!u || u.checked) return; u.given = +el.getAttribute('data-i'); render(); },
    ordadd: function (el) { var u = S.ui; if (!u || u.checked) return; u.given.push(+el.getAttribute('data-i')); render(); },
    ordrem: function (el) { var u = S.ui; if (!u || u.checked) return; var i = +el.getAttribute('data-i'); u.given = u.given.filter(function (x) { return x !== i; }); render(); },
    sign: function (el) {
      var u = uiFor(el), i = +el.getAttribute('data-i'); if (!u || u.checked) return;
      var inp = el.parentNode.querySelector('.f-in'), v = cleanNum(inp.value); v = v.charAt(0) === '-' ? v.slice(1) : '-' + v;
      inp.value = v; u.given[i] = v; if (u === S.ui) syncSubmit(); inp.focus();
    },
    calc: function () { S.calc.open = !S.calc.open; render(); },
    timerhide: function () { S.timerHidden = !S.timerHidden; LS.set('timerHidden', S.timerHidden); render(); },
    ck: function (el) { calcKey(el.getAttribute('data-k')); },
    democheck: function () { var u = S.demo; if (!E.isComplete(u.q, u.given)) { var f = document.getElementById('demo0'); if (f) f.focus(); return; } u.ok = E.check(u.q, u.given); u.checked = true; render(); },
    demonew: function () { newDemo(); render(); },
    pdom: function (el) { var d = el.getAttribute('data-d'), i = S.prac.doms.indexOf(d); if (i >= 0) S.prac.doms.splice(i, 1); else S.prac.doms.push(d); S.prac.doms.sort(); LS.set('prac', S.prac); render(); },
    pset: function (el) { var k = el.getAttribute('data-k'), v = el.getAttribute('data-val'); S.prac[k] = k === 'part' ? v : +v; LS.set('prac', S.prac); render(); },
    startprac: function () { if (!pracOptions()) return; startPractice({ doms: S.prac.doms.slice(), part: S.prac.part, level: S.prac.level, count: S.prac.count }); },
    pracdom: function (el) { startPractice({ doms: [el.getAttribute('data-d')], part: 'HN', level: 0, count: 10 }); },
    practpl: function (el) { var t = TPL.filter(function (x) { return x.id === el.getAttribute('data-id'); })[0]; if (t) startPractice({ doms: [t.dom], part: t.part, level: 0, count: 10, tpls: [t.id] }); },
    pracet: function (el) { var e = el.getAttribute('data-et'), ts = TPL.filter(function (x) { return x.et === e || (ET_TPL[e] || []).indexOf(x.id) >= 0; }); if (ts.length) startPractice({ doms: [ts[0].dom], part: 'HN', level: 0, count: 10, tpls: ts.map(function (x) { return x.id; }) }); },
    onlywrong: function (el) { S.onlyWrong = el.getAttribute('data-val') === 'true'; render(); },
    filter: function (el) { S.filter = el.getAttribute('data-val'); render(); },
    showlast: function () { var l = LS.get('last'); if (l) { S.result = l; S.onlyWrong = false; S.view = 'result'; render(); window.scrollTo(0, 0); } },
    askclear: function () { S.dialog = { title: 'Voortgang wissen?', text: 'Al je resultaten worden verwijderd. Dit kun je niet ongedaan maken.', yes: 'Wissen', no: 'Bewaren', onYes: function () { S.history = []; S.wiped = Date.now(); LS.set('wiped', S.wiped); LS.del('last'); saveHistory(); render(); } }; render(); }
  };
  document.addEventListener('click', function (ev) {
    var el = ev.target.closest ? ev.target.closest('[data-act]') : null; if (!el || el.disabled) return;
    var fn = ACT[el.getAttribute('data-act')]; if (fn) { ev.preventDefault(); fn(el); }
  });
  document.addEventListener('input', function (ev) {
    var el = ev.target; if (!el.classList || !el.classList.contains('f-in')) return;
    var u = uiFor(el), v = cleanNum(el.value); if (v !== el.value) el.value = v;
    if (u && !u.checked) { u.given[+el.getAttribute('data-i')] = v; if (u === S.ui) syncSubmit(); }
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') { if (S.dialog) ACT.dlgno(); else if (S.calc.open) ACT.calc(); return; }
    if (ev.key !== 'Enter' || !ev.target.classList || !ev.target.classList.contains('f-in')) return;
    ev.preventDefault();
    if (ev.target.closest('.demo')) return ACT.democheck();
    var u = S.ui; if (!u || !E.isComplete(u.q, u.given)) return;
    // in de toets kun je niet terug: de eerste Enter zet de focus op de knop, pas een tweede Enter gaat door
    if (S.s.kind === 'test') { var b = document.getElementById('submit'); if (b) b.focus(); }
    else if (!u.checked) checkPractice();
  });
  // onthoud of de voorbeeldsom open staat, zodat hij na opnieuw tekenen open blijft ('toggle' bubbelt niet: daarom capture)
  document.addEventListener('toggle', function (ev) { var d = ev.target; if (d.classList && d.classList.contains('demo-d')) S.demoOpen = d.open; }, true);
  // uitleg bij een punt in de voortgangsgrafiek
  function tipShow(el) {
    var box = el.closest('.chart'), svg = box.querySelector('svg'), r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal, tip = box.querySelector('.tipbox');
    if (!tip) { tip = document.createElement('div'); tip.className = 'tipbox'; box.appendChild(tip); }
    tip.innerHTML = el.getAttribute('data-tip');
    var x = +el.getAttribute('cx') / vb.width * r.width, y = +el.getAttribute('cy') / vb.height * r.height;
    tip.style.left = Math.min(Math.max(x, 70), r.width - 70) + 'px'; tip.style.top = Math.max(y, 62) + 'px';
  }
  function tipHide() { var t = document.querySelector('.tipbox'); if (t) t.parentNode.removeChild(t); }
  ['pointerover', 'focusin', 'click'].forEach(function (nmE) { document.addEventListener(nmE, function (ev) { var el = ev.target; if (el.classList && el.classList.contains('pg-hit')) tipShow(el); else if (nmE === 'click') tipHide(); }); });
  ['pointerout', 'focusout'].forEach(function (nmE) { document.addEventListener(nmE, function (ev) { if (ev.target.classList && ev.target.classList.contains('pg-hit')) tipHide(); }); });
  // de klok staat stil als de app niet in beeld is
  document.addEventListener('visibilitychange', function () {
    if (!S.s || S.view !== 'run') return;
    if (document.hidden) { commit(); S.runAt = 0; if (S.ui && S.ui.t0) { S.ui.acc = qElapsed(); S.ui.t0 = null; } saveSession(); }
    else if (!S.dialog) { S.runAt = Date.now(); if (S.ui && !S.ui.checked) S.ui.t0 = Date.now(); }
  });
  window.addEventListener('pagehide', function () { if (S.s && S.view === 'run') { commit(); saveSession(); } });
  window.addEventListener('hashchange', function () { if (S.view === 'run') return; var v = viewFromHash(); if (v !== S.view) { S.view = v; render(); window.scrollTo(0, 0); } });

  /* ---------- opstarten ---------- */
  function boot() {
    S.wiped = +LS.get('wiped') || 0; S.history = cleanHist(LS.get('history'), S.wiped);
    var p = LS.get('prac'); if (p && Array.isArray(p.doms)) S.prac = { doms: p.doms.filter(function (d) { return E.DOM[d]; }), part: p.part === 'H' || p.part === 'N' ? p.part : 'HN', level: +p.level || 0, count: p.count === 20 || p.count === 0 ? p.count : 10 };
    var s = LS.get('session'); S.s = s && s.v === 1 && (s.kind === 'test' || s.kind === 'oefen') ? s : null;
    S.timerHidden = LS.get('timerHidden') === true;
    newDemo(); S.view = viewFromHash();
    render();
  }
  boot();
  RWT.app = { S: S, render: render, calcEval: calcEval };
})()
