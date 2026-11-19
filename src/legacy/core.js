/* core.js */
/* RWT oefenapp · kern: toevalsgetallen, notatie, hulpjes en figuren */
(function () {
  'use strict';
  var RWT = globalThis.RWT = globalThis.RWT || {};
  var NB = ' ';
  var RETRY = { retry: true };

  /* ---------- toevalsgetallen (met seed, zodat een toets te herstellen is) ---------- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function Rng(seed) { this.f = mulberry32(seed >>> 0); }
  Rng.prototype = {
    n: function () { return this.f(); },
    int: function (a, b) { return a + Math.floor(this.f() * (b - a + 1)); },
    pick: function (arr) { return arr[Math.floor(this.f() * arr.length)]; },
    shuffle: function (arr) {
      var a = arr.slice();
      for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(this.f() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    },
    sample: function (arr, k) { return this.shuffle(arr).slice(0, k); },
    chance: function (p) { return this.f() < p; }
  };

  /* ---------- rekenen zonder afrondingsruis ---------- */
  // rond af op d decimalen, half naar boven (weg van nul), bestand tegen 34.125 -> 34.12-fouten
  function rnd(x, d) {
    if (d === undefined) d = 6;
    if (Number.isInteger(x)) return x;
    var s = x < 0 ? -1 : 1, a = Math.abs(x), e = 3;
    while (e > 0 && a * Math.pow(10, d + e) > 9e14) e--;
    var big = Math.round(a * Math.pow(10, d + e));
    if (e === 0) return s * big / Math.pow(10, d);
    return s * Math.floor((big + 5 * Math.pow(10, e - 1)) / Math.pow(10, e)) / Math.pow(10, d);
  }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function lcm(a, b) { return a / gcd(a, b) * b; }
  function sum(arr) { var s = 0; for (var i = 0; i < arr.length; i++) s += arr[i]; return s; }

  /* ---------- Nederlandse notatie ---------- */
  function plain(a, d) {
    var s = d === undefined ? String(rnd(a, 6)) : rnd(a, d).toFixed(d);
    if (s.indexOf('e') >= 0) s = a.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
    return s;
  }
  // in opgaven: punt als duizendtalteken, komma als decimaalteken (zoals in de handreiking)
  function nf(x, d) {
    var s = plain(Math.abs(x), d).split('.');
    var i = s[0].length > 3 ? s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') : s[0];
    return (x < 0 ? '−' : '') + i + (s[1] ? ',' + s[1] : '');
  }
  // zoals je het intypt: alleen cijfers, komma en eventueel een minteken
  function inp(x, d) { return (x < 0 ? '-' : '') + plain(Math.abs(x), d).replace('.', ','); }
  function eur(x) {
    var a = Math.abs(x), whole = Math.abs(rnd(a, 2) - Math.round(a)) < 1e-9;
    return (x < 0 ? '−' : '') + '€' + NB + (whole ? nf(Math.round(a)) : nf(a, 2));
  }
  function en(arr) { // "a, b en c"
    arr = arr.map(String);
    if (arr.length < 2) return arr.join('');
    return arr.slice(0, -1).join(', ') + ' en ' + arr[arr.length - 1];
  }
  function klok(mins) { // minuten sinds middernacht -> 08:47
    mins = ((mins % 1440) + 1440) % 1440;
    var h = Math.floor(mins / 60), m = mins % 60;
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
  }
  function bare(x) { return String(x).replace(/<[^>]*>/g, ''); }
  function fr(a, b) { return '<span class="fr" role="math" aria-label="' + bare(a) + '/' + bare(b) + '"><span>' + a + '</span><span>' + b + '</span></span>'; }
  // vereenvoudigde breuk of gemengd getal
  function frs(n, d) {
    var g = gcd(n, d); n /= g; d /= g;
    if (d === 1) return String(n);
    var w = Math.floor(n / d), r = n - w * d;
    return w ? w + fr(r, d) : fr(n, d);
  }
  function words(n) {
    if (n === 0) return 'nul';
    var u = ['', 'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien', 'elf', 'twaalf', 'dertien', 'veertien', 'vijftien', 'zestien', 'zeventien', 'achttien', 'negentien'];
    var t = ['', '', 'twintig', 'dertig', 'veertig', 'vijftig', 'zestig', 'zeventig', 'tachtig', 'negentig'];
    function b100(x) { if (x < 20) return u[x]; var e = x % 10, z = Math.floor(x / 10); return e === 0 ? t[z] : u[e] + (e === 2 || e === 3 ? 'ën' : 'en') + t[z]; }
    function b1000(x) { var h = Math.floor(x / 100), r = x % 100; return (h ? (h > 1 ? u[h] : '') + 'honderd' : '') + (r ? b100(r) : ''); }
    var out = [], m = Math.floor(n / 1e6), k = Math.floor(n % 1e6 / 1000), r = n % 1000;
    if (m) out.push(b1000(m) + ' miljoen');
    if (k) out.push((k > 1 ? b1000(k) : '') + 'duizend');
    if (r) out.push(b1000(r));
    return out.join(' ');
  }

  /* ---------- opbouw van opgaven ---------- */
  function steps() { return '<ol class="st">' + Array.prototype.map.call(arguments, function (l) { return '<li>' + l + '</li>'; }).join('') + '</ol>'; }
  function tip(t) { return '<p class="tip"><b>Let op.</b> ' + t + '</p>'; }
  function som(s) { return '<div class="sum">' + s + '</div>'; }
  function p(s) { return '<p>' + s + '</p>'; }
  function ask(s) { return '<p class="ask">' + s + '</p>'; }

  function mcNum(r, correct, wrongs, fmt) {
    fmt = fmt || nf;
    var c = rnd(correct, 6), seen = [c], ws = [];
    wrongs.forEach(function (w) {
      if (w === undefined || w === null || !isFinite(w)) return;
      var v = rnd(w, 6);
      if (seen.indexOf(v) < 0) { seen.push(v); ws.push(v); }
    });
    if (ws.length < 2) throw RETRY;
    var all = ws.slice(0, 3).concat([c]).sort(function (a, b) { return a - b; });
    return { type: 'mc', opts: all.map(function (v) { return fmt(v); }), ans: all.indexOf(c) };
  }
  function mcTxt(r, correct, wrongs) {
    var seen = [correct], ws = [];
    wrongs.forEach(function (w) { if (w !== undefined && w !== null && seen.indexOf(w) < 0) { seen.push(w); ws.push(w); } });
    if (ws.length < 2) throw RETRY;
    var all = r.shuffle(ws.slice(0, 3).concat([correct]));
    return { type: 'mc', opts: all, ans: all.indexOf(correct) };
  }
  // items: [{h: tekst, v: waarde}] -> volgorde van klein naar groot
  function ordQ(r, items) {
    var vs = items.map(function (i) { return rnd(i.v, 9); });
    for (var a = 0; a < vs.length; a++) for (var b = a + 1; b < vs.length; b++) if (vs[a] === vs[b]) throw RETRY;
    var sh = r.shuffle(items);
    var order = sh.map(function (it, i) { return i; }).sort(function (x, y) { return sh[x].v - sh[y].v; });
    if (order.every(function (v, i) { return v === i; })) throw RETRY;
    return { type: 'order', items: sh.map(function (i) { return i.h; }), ans: order };
  }

  var NAMES = ['Sanne', 'Daan', 'Fatima', 'Lars', 'Yara', 'Noah', 'Emma', 'Mees', 'Sara', 'Jesse', 'Lotte', 'Amir', 'Tess', 'Finn', 'Noor', 'Ruben', 'Iris', 'Sem', 'Lina', 'Thijs', 'Meryem', 'Bram', 'Jasmijn', 'Koen'];
  function nm(r, k) { return k ? r.sample(NAMES, k) : r.pick(NAMES); }

  var TPL = [];
  function def(id, dom, part, et, name, gen) { TPL.push({ id: id, dom: dom, part: part, et: et, name: name, gen: gen }); }

  // maak een opgave van een type op niveau L (1-3)
  function make(tpl, L, rng) {
    for (var i = 0; i < 200; i++) {
      var q;
      try { q = tpl.gen(L, rng); } catch (e) { if (e === RETRY) continue; throw e; }
      if (!q) continue;
      if (q.type === 'num') { q.fields = [{ ans: q.ans, unit: q.unit, pre: q.pre, dec: q.dec }]; q.type = 'multi'; delete q.ans; delete q.unit; delete q.pre; delete q.dec; }
      if (q.type === 'multi') q.fields = q.fields.map(function (f) { var o = { ans: rnd(f.ans, 6), unit: f.unit || '', pre: f.pre || '' }; if (f.dec !== undefined) o.dec = f.dec; if (f.lab) o.lab = f.lab; return o; });
      q.id = tpl.id; q.dom = tpl.dom; q.part = tpl.part; q.et = q.et || tpl.et; q.name = tpl.name; q.level = L;
      q.calc = !!q.calc && tpl.part === 'N';
      return q;
    }
    throw new Error('Opgavetype ' + tpl.id + ' (niveau ' + L + ') leverde geen opgave op.');
  }

  /* ---------- figuren (SVG, kleuren via CSS-klassen zodat licht en donker werken) ---------- */
  var F = {};
  function c2(x) { return Math.round(x * 100) / 100; }
  function svg(w, h, inner, label, cls) {
    return '<svg class="fig' + (cls ? ' ' + cls : '') + '" viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="' + (label || 'Figuur') + '">' + inner + '</svg>';
  }
  function tx(x, y, s, cls, anchor) {
    return '<text x="' + x + '" y="' + y + '" class="' + (cls || 'ft') + '"' + (anchor ? ' text-anchor="' + anchor + '"' : '') + '>' + s + '</text>';
  }
  function ln(x1, y1, x2, y2, cls) { return '<line x1="' + c2(x1) + '" y1="' + c2(y1) + '" x2="' + c2(x2) + '" y2="' + c2(y2) + '" class="' + cls + '"/>'; }

  // staafdiagram: {cats, vals, yMax, yStep, yTitle, title, half}
  F.bar = function (o) {
    var W = 320, L = 46, Rt = 8, T = o.title ? 42 : 24, ph = 150, B = 28, H = T + ph + B, pw = W - L - Rt, n = o.cats.length, s = '';
    var y = function (v) { return T + ph - (v / o.yMax) * ph; };
    if (o.title) s += tx(L, 15, o.title, 'ft-title');
    if (o.yTitle) s += tx(L, T - 8, o.yTitle, 'ft-ax');
    var k = Math.round(o.yMax / o.yStep), j;
    if (o.half) for (j = 0; j < k; j++) s += ln(L, y((j + 0.5) * o.yStep), W - Rt, y((j + 0.5) * o.yStep), 'fg-grid2');
    for (j = 0; j <= k; j++) { var v = j * o.yStep; s += ln(L, y(v), W - Rt, y(v), j === 0 ? 'fg-base' : 'fg-grid') + tx(L - 6, c2(y(v) + 4), nf(rnd(v, 6)), 'ft-tick', 'end'); }
    var band = pw / n, bw = Math.min(24, band * 0.62);
    o.vals.forEach(function (val, i) {
      var cx = L + band * (i + 0.5), top = y(val), h = T + ph - top, rr = Math.max(0, Math.min(4, h));
      var x0 = c2(cx - bw / 2), x1 = c2(cx + bw / 2), yb = T + ph;
      if (h > 0) s += '<path class="fg-bar" d="M' + x0 + ',' + yb + ' V' + c2(top + rr) + ' Q' + x0 + ',' + c2(top) + ' ' + c2(x0 + rr) + ',' + c2(top) + ' H' + c2(x1 - rr) + ' Q' + x1 + ',' + c2(top) + ' ' + x1 + ',' + c2(top + rr) + ' V' + yb + ' Z"/>';
      s += tx(c2(cx), T + ph + 16, o.cats[i], 'ft-cat', 'middle');
    });
    return svg(W, H, s, o.label || o.title || 'Staafdiagram');
  };

  // lijngrafiek: {xs, series:[{name, vals}], yMin, yMax, yStep, yTitle, xTitle, title, dots}
  F.line = function (o) {
    var multi = o.series.length > 1;
    var W = 320, L = 46, Rt = 16, T = (o.title ? 42 : 24) + (multi ? 20 : 0), ph = 150, B = o.xTitle ? 44 : 28, H = T + ph + B, pw = W - L - Rt;
    var n = o.xs.length, yMin = o.yMin || 0, span = o.yMax - yMin, s = '';
    var X = function (i) { return L + (n === 1 ? pw / 2 : i * pw / (n - 1)); };
    var Y = function (v) { return T + ph - ((v - yMin) / span) * ph; };
    if (o.title) s += tx(L, 15, o.title, 'ft-title');
    if (o.yTitle) s += tx(L, T - 8, o.yTitle, 'ft-ax');
    var k = Math.round(span / o.yStep), j, i;
    var wide = Math.max.apply(null, o.xs.map(function (x) { return String(x).length; })) * 7 + 12, every = o.xEvery || (n > 1 && pw / (n - 1) < wide ? 2 : 1);
    for (i = 0; i < n; i++) {
      s += ln(X(i), T, X(i), T + ph, 'fg-grid');
      if (i % every === 0) s += tx(c2(X(i)), T + ph + 16, o.xs[i], 'ft-cat', 'middle');
    }
    if (o.yMinor) { var per = Math.round(o.yStep / o.yMinor), nm2 = Math.round(span / o.yMinor); for (j = 1; j < nm2; j++) if (j % per !== 0) s += ln(L, Y(yMin + j * o.yMinor), W - Rt, Y(yMin + j * o.yMinor), 'fg-grid2'); }
    for (j = 0; j <= k; j++) { var v = rnd(yMin + j * o.yStep, 6); s += ln(L, Y(v), W - Rt, Y(v), v === 0 || (j === 0 && yMin >= 0) ? 'fg-base' : 'fg-grid') + tx(L - 6, c2(Y(v) + 4), nf(v), 'ft-tick', 'end'); }
    if (o.xTitle) s += tx(L + pw / 2, H - 6, o.xTitle, 'ft-ax', 'middle');
    o.series.forEach(function (se, si) {
      var pts = se.vals.map(function (val, ii) { return c2(X(ii)) + ',' + c2(Y(val)); }).join(' ');
      s += '<polyline points="' + pts + '" class="fg-ln fg-ln' + (si + 1) + '"/>';
      if (o.dots !== false) se.vals.forEach(function (val, ii) {
        s += si === 0 ? '<circle cx="' + c2(X(ii)) + '" cy="' + c2(Y(val)) + '" r="4.5" class="fg-dot fg-s1"/>'
          : '<rect x="' + c2(X(ii) - 4) + '" y="' + c2(Y(val) - 4) + '" width="8" height="8" class="fg-dot fg-s2"/>';
      });
    });
    if (multi) {
      var lx = L, ly = T - 30;
      o.series.forEach(function (se, si) {
        s += ln(lx, ly, lx + 20, ly, 'fg-ln fg-ln' + (si + 1));
        s += si === 0 ? '<circle cx="' + (lx + 10) + '" cy="' + ly + '" r="4.5" class="fg-dot fg-s1"/>' : '<rect x="' + (lx + 6) + '" y="' + (ly - 4) + '" width="8" height="8" class="fg-dot fg-s2"/>';
        s += tx(lx + 26, ly + 4, se.name, 'ft');
        lx += 26 + se.name.length * 6.8 + 20;
      });
    }
    return svg(W, H, s, o.label || o.title || 'Lijngrafiek');
  };

  // cirkeldiagram: {parts:[{name, pct, show}], title}
  F.pie = function (o) {
    var W = 320, cx = 160, T = o.title ? 26 : 6, r = 80, cy = T + r + 2, H = cy + r + 6, a0 = -Math.PI / 2, s = '';
    if (o.title) s += tx(160, 15, o.title, 'ft-title', 'middle');
    o.parts.forEach(function (pt, i) {
      var a1 = a0 + pt.pct / 100 * 2 * Math.PI, large = (a1 - a0) > Math.PI ? 1 : 0, am = (a0 + a1) / 2;
      s += '<path class="fg-slice fg-s' + (i + 1) + '" d="M' + cx + ',' + cy + ' L' + c2(cx + r * Math.cos(a0)) + ',' + c2(cy + r * Math.sin(a0)) + ' A' + r + ',' + r + ' 0 ' + large + ' 1 ' + c2(cx + r * Math.cos(a1)) + ',' + c2(cy + r * Math.sin(a1)) + ' Z"/>';
      var rl = r * (pt.pct <= 12 ? 0.74 : 0.62);
      if (pt.show) s += tx(c2(cx + rl * Math.cos(am)), c2(cy + rl * Math.sin(am) + 4.5), pt.show, 'ft-in ft-in' + (i + 1), 'middle');
      a0 = a1;
    });
    var lg = '<ul class="lg">' + o.parts.map(function (pt, i) { return '<li><i class="sw fg-b' + (i + 1) + '"></i>' + pt.name + '</li>'; }).join('') + '</ul>';
    return '<div class="figbox">' + svg(W, H, s, o.label || o.title || 'Cirkeldiagram') + lg + '</div>';
  };

  // getallenlijn: {min, max, major, minor, arrow, labels:'major'|'ends'}
  F.nline = function (o) {
    var W = 320, H = 86, x0 = 20, x1 = 300, y = 50, s = '';
    var X = function (v) { return x0 + (v - o.min) / (o.max - o.min) * (x1 - x0); };
    s += ln(x0 - 10, y, x1 + 10, y, 'fg-axis');
    var nMin = Math.round((o.max - o.min) / o.minor), per = Math.round(o.major / o.minor);
    for (var i = 0; i <= nMin; i++) {
      var v = o.min + i * o.minor, maj = i % per === 0;
      s += ln(X(v), y - (maj ? 10 : 5), X(v), y + (maj ? 10 : 5), 'fg-axis');
      var show = o.labels === 'ends' ? (i === 0 || i === nMin) : maj;
      if (show) s += tx(c2(X(v)), y + 27, nf(rnd(v, 6)), 'ft-tick', 'middle');
    }
    if (o.arrow !== undefined) {
      var ax = c2(X(o.arrow));
      s += '<path d="M' + ax + ',12 V' + (y - 13) + ' M' + (ax - 5) + ',' + (y - 21) + ' L' + ax + ',' + (y - 12) + ' L' + (ax + 5) + ',' + (y - 21) + '" class="fg-arrow"/>' + tx(ax + 8, 22, '?', 'ft-q');
    }
    return svg(W, H, s, 'Getallenlijn van ' + nf(o.min) + ' tot ' + nf(o.max));
  };

  F.clock = function (h, m) {
    var W = 180, cx = 90, cy = 90, R = 80, s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" class="fg-shape"/>', i, a;
    for (i = 0; i < 60; i++) { a = i * 6 * Math.PI / 180; var r1 = i % 5 === 0 ? R - 10 : R - 5; s += ln(cx + r1 * Math.sin(a), cy - r1 * Math.cos(a), cx + (R - 2) * Math.sin(a), cy - (R - 2) * Math.cos(a), i % 5 === 0 ? 'fg-tk1' : 'fg-tk2'); }
    for (i = 1; i <= 12; i++) { a = i * 30 * Math.PI / 180; s += tx(c2(cx + (R - 23) * Math.sin(a)), c2(cy - (R - 23) * Math.cos(a) + 5), i, 'ft-clock', 'middle'); }
    var ah = ((h % 12) + m / 60) * 30 * Math.PI / 180, am = m * 6 * Math.PI / 180;
    s += ln(cx, cy, cx + 30 * Math.sin(ah), cy - 30 * Math.cos(ah), 'fg-hand1') + ln(cx, cy, cx + 46 * Math.sin(am), cy - 46 * Math.cos(am), 'fg-hand2') + '<circle cx="' + cx + '" cy="' + cy + '" r="4" class="fg-pin"/>';
    return svg(W, 180, s, 'Wijzerklok', 'fig-s');
  };

  // kaart met vakken: {n, marks:[{c, r, t}], compass}
  F.map = function (o) {
    var n = o.n, cs = n > 7 ? 30 : 34, L = 24, T = 8, W = L + n * cs + (o.compass ? 44 : 8), H = T + n * cs + 24, s = '', i;
    for (i = 0; i <= n; i++) s += ln(L + i * cs, T, L + i * cs, T + n * cs, 'fg-cell') + ln(L, T + i * cs, L + n * cs, T + i * cs, 'fg-cell');
    for (i = 0; i < n; i++) s += tx(L + i * cs + cs / 2, T + n * cs + 17, 'ABCDEFGHIJ'.charAt(i), 'ft-tick', 'middle') + tx(L - 8, T + (n - 1 - i) * cs + cs / 2 + 4, i + 1, 'ft-tick', 'end');
    (o.marks || []).forEach(function (mk) {
      var x = L + mk.c * cs + cs / 2, y = T + (n - 1 - mk.r) * cs + cs / 2;
      s += '<circle cx="' + x + '" cy="' + y + '" r="' + c2(cs * 0.34) + '" class="fg-mark"/>' + tx(x, y + 4.5, mk.t, 'ft-mark', 'middle');
    });
    if (o.compass) { var x = L + n * cs + 24; s += '<path d="M' + x + ',' + (T + 58) + ' V' + (T + 24) + ' M' + (x - 6) + ',' + (T + 33) + ' L' + x + ',' + (T + 22) + ' L' + (x + 6) + ',' + (T + 33) + '" class="fg-arrow"/>' + tx(x, T + 15, 'N', 'ft-title', 'middle'); }
    return svg(W, H, s, 'Kaart met vakken');
  };

  // plattegrond met hoogtegetallen; rij 0 is de achterkant
  F.hgrid = function (m) {
    var rows = m.length, cols = m[0].length, cs = 42, L = 16, T = 8, W = L + cols * cs + 84, H = T + rows * cs + 34, s = '';
    m.forEach(function (row, ri) { row.forEach(function (v, ci) { s += '<rect x="' + (L + ci * cs) + '" y="' + (T + ri * cs) + '" width="' + cs + '" height="' + cs + '" class="fg-cellbox"/>' + tx(L + ci * cs + cs / 2, T + ri * cs + cs / 2 + 7, v, 'ft-big', 'middle'); }); });
    var mx = L + cols * cs / 2, by = T + rows * cs;
    s += '<path d="M' + mx + ',' + (by + 20) + ' V' + (by + 7) + ' M' + (mx - 5) + ',' + (by + 13) + ' L' + mx + ',' + (by + 6) + ' L' + (mx + 5) + ',' + (by + 13) + '" class="fg-arrow"/>' + tx(mx + 10, by + 22, 'voorkant', 'ft');
    var rx = L + cols * cs, my = T + rows * cs / 2;
    s += '<path d="M' + (rx + 20) + ',' + my + ' H' + (rx + 7) + ' M' + (rx + 13) + ',' + (my - 5) + ' L' + (rx + 6) + ',' + my + ' L' + (rx + 13) + ',' + (my + 5) + '" class="fg-arrow"/>' + tx(rx + 25, my + 4, 'rechts', 'ft');
    return svg(W, H, s, 'Plattegrond van een blokkenbouwsel met hoogtegetallen');
  };

  F.rect = function (wl, hl, ratio) {
    var w = 190, h = Math.max(54, Math.min(120, 190 * ratio)), x0 = 78, y0 = 14, H = y0 + h + 30;
    var s = '<rect x="' + x0 + '" y="' + y0 + '" width="' + w + '" height="' + c2(h) + '" class="fg-shape"/>' + tx(x0 + w / 2, c2(y0 + h + 19), wl, 'ft-dim', 'middle') + tx(x0 - 8, c2(y0 + h / 2 + 4), hl, 'ft-dim', 'end');
    return svg(320, c2(H), s, 'Rechthoek van ' + wl + ' bij ' + hl);
  };

  // L-vorm: buitenmaat a x b, bovenrand 'top', rechter onderstuk 'right'
  F.lshape = function (o) {
    var sc = Math.min(190 / o.a, 118 / o.b), w = o.a * sc, h = o.b * sc, c = (o.a - o.top) * sc, d = (o.b - o.right) * sc, x0 = 70, y0 = 22, u = o.unit ? NB + o.unit : '';
    var s = '<path class="fg-shape" d="M' + x0 + ',' + y0 + ' H' + c2(x0 + w - c) + ' V' + c2(y0 + d) + ' H' + c2(x0 + w) + ' V' + c2(y0 + h) + ' H' + x0 + ' Z"/>';
    s += tx(c2(x0 + w / 2), c2(y0 + h + 19), nf(o.a) + u, 'ft-dim', 'middle') + tx(x0 - 8, c2(y0 + h / 2 + 4), nf(o.b) + u, 'ft-dim', 'end');
    s += tx(c2(x0 + (w - c) / 2), y0 - 7, nf(o.top) + u, 'ft-dim', 'middle') + tx(c2(x0 + w + 8), c2(y0 + d + (h - d) / 2 + 4), nf(o.right) + u, 'ft-dim');
    return svg(320, c2(y0 + h + 30), s, 'L-vormige figuur');
  };

  // driehoek met basis en hoogte: {base, h, unit, apex(0..1)}
  F.tri = function (o) {
    var bw = 200, hh = Math.max(60, Math.min(120, 200 * o.h / o.base)), x0 = 60, yb = 20 + hh, ax = x0 + bw * (o.apex === undefined ? 0.35 : o.apex), u = o.unit ? NB + o.unit : '';
    var s = '<path class="fg-shape" d="M' + x0 + ',' + c2(yb) + ' H' + (x0 + bw) + ' L' + c2(ax) + ',20 Z"/>' + ln(ax, 20, ax, yb, 'fg-dash');
    s += '<path class="fg-thin" d="M' + c2(ax) + ',' + c2(yb - 9) + ' h9 v9"/>';
    s += tx(x0 + bw / 2, c2(yb + 19), nf(o.base) + u, 'ft-dim', 'middle') + (ax > x0 + bw / 2 ? tx(c2(ax - 7), c2(20 + hh * 0.62 + 4), nf(o.h) + u, 'ft-dim', 'end') : tx(c2(ax + 7), c2(20 + hh * 0.62 + 4), nf(o.h) + u, 'ft-dim'));
    return svg(320, c2(yb + 30), s, 'Driehoek met basis ' + nf(o.base) + ' en hoogte ' + nf(o.h));
  };

  F.circ = function (label, mode) {
    var cx = 160, cy = 76, r = 62, s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" class="fg-shape"/><circle cx="' + cx + '" cy="' + cy + '" r="2.5" class="fg-pin"/>';
    if (mode === 'r') s += ln(cx, cy, cx + r, cy, 'fg-thin') + tx(cx + r / 2, cy - 7, label, 'ft-dim', 'middle');
    else s += ln(cx - r, cy, cx + r, cy, 'fg-thin') + tx(cx, cy - 8, label, 'ft-dim', 'middle');
    return svg(320, 150, s, 'Cirkel');
  };

  // balk in scheve projectie: {l, w, h, unit, fill (0..1)}
  F.cuboid = function (o) {
    var fw = 150, fh = 84, dx = 44, dy = -30, x0 = 62, y0 = 52, u = o.unit ? NB + o.unit : '', s = '';
    if (o.fill) { var wh = fh * o.fill, wy = y0 + fh - wh; s += '<path class="fg-water" d="M' + x0 + ',' + c2(wy) + ' h' + fw + ' l' + dx + ',' + dy + ' v' + c2(wh) + ' l' + (-dx) + ',' + (-dy) + ' h' + (-fw) + ' Z"/>'; }
    s += '<path class="fg-shape-o" d="M' + x0 + ',' + y0 + ' h' + fw + ' v' + fh + ' h' + (-fw) + ' Z M' + x0 + ',' + y0 + ' l' + dx + ',' + dy + ' h' + fw + ' l' + (-dx) + ',' + (-dy) + ' M' + (x0 + fw + dx) + ',' + (y0 + dy) + ' v' + fh + ' l' + (-dx) + ',' + (-dy) + '"/>';
    s += tx(x0 + fw / 2, y0 + fh + 19, o.l + u, 'ft-dim', 'middle') + tx(x0 + fw + dx / 2 + 12, y0 + fh + dy / 2 + 12, o.w + u, 'ft-dim') + tx(x0 + fw + dx + 8, y0 + dy + fh / 2 + 4, o.h + u, 'ft-dim');
    return svg(320, y0 + fh + 30, s, 'Balk van ' + o.l + ' bij ' + o.w + ' bij ' + o.h);
  };

  F.cyl = function (dl, hl) {
    var cx = 140, rx = 58, ry = 15, y0 = 30, h = 96;
    var s = '<path class="fg-shape" d="M' + (cx - rx) + ',' + y0 + ' v' + h + ' a' + rx + ',' + ry + ' 0 0 0 ' + (2 * rx) + ',0 v' + (-h) + '"/><ellipse cx="' + cx + '" cy="' + y0 + '" rx="' + rx + '" ry="' + ry + '" class="fg-shape"/>';
    s += ln(cx - rx, y0, cx + rx, y0, 'fg-thin') + tx(cx, y0 - 20, dl, 'ft-dim', 'middle') + tx(cx + rx + 10, y0 + h / 2 + 6, hl, 'ft-dim');
    return svg(320, y0 + h + 28, s, 'Cilinder');
  };

  // maatbeker: {max, major, minor, level, unit}
  F.cup = function (o) {
    var xL = 96, xR = 186, yB = 196, yT = 22, sc = 150 / o.max, s = '';
    var Y = function (v) { return yB - v * sc; };
    s += '<rect x="' + xL + '" y="' + c2(Y(o.level)) + '" width="' + (xR - xL) + '" height="' + c2(yB - Y(o.level)) + '" class="fg-water"/>';
    s += '<path class="fg-shape-o" d="M' + xL + ',' + yT + ' V' + yB + ' H' + xR + ' V' + yT + '"/>';
    var nMin = Math.round(o.max / o.minor), per = Math.round(o.major / o.minor);
    for (var i = 1; i <= nMin; i++) {
      var v = i * o.minor, maj = i % per === 0;
      s += ln(xL, Y(v), xL + (maj ? 22 : 12), Y(v), maj ? 'fg-tk1' : 'fg-tk2');
      if (maj) s += tx(xL - 7, c2(Y(v) + 4), nf(rnd(v, 6)), 'ft-tick', 'end');
    }
    s += tx(xL - 7, 16, o.unit, 'ft-ax', 'end');
    return svg(280, 208, s, 'Maatbeker', 'fig-m');
  };

  // thermometer: {min, max, major, minor, val, cap}
  F.thermo = function (o) {
    var x = 70, yB = 196, sc = 168 / (o.max - o.min), s = '';
    var Y = function (v) { return yB - (v - o.min) * sc; };
    s += '<rect x="' + (x - 7) + '" y="14" width="14" height="' + (yB - 6) + '" rx="7" class="fg-shape"/><circle cx="' + x + '" cy="' + (yB + 16) + '" r="14" class="fg-merc"/>';
    s += '<rect x="' + (x - 3.5) + '" y="' + c2(Y(o.val)) + '" width="7" height="' + c2(yB + 8 - Y(o.val)) + '" class="fg-merc"/>';
    var nMin = Math.round((o.max - o.min) / o.minor), per = Math.round(o.major / o.minor);
    for (var i = 0; i <= nMin; i++) {
      var v = o.min + i * o.minor, maj = i % per === 0;
      s += ln(x + 9, Y(v), x + (maj ? 22 : 16), Y(v), maj ? 'fg-tk1' : 'fg-tk2');
      if (maj) s += tx(x + 27, c2(Y(v) + 4), nf(rnd(v, 6)), 'ft-tick');
    }
    s += tx(x + 27, 12, '°C', 'ft-ax');
    if (o.cap) s += tx(x, yB + 46, o.cap, 'ft-dim', 'middle');
    return svg(150, yB + (o.cap ? 54 : 36), s, 'Thermometer', 'fig-t');
  };

  // luciferfiguren 1, 2 en 3: type 'vier' (vierkanten), 'drie' (driehoeken) of 'tafel'
  F.sticks = function (type) {
    var s = '', x = 14, sz = 26, top = 16;
    for (var n = 1; n <= 3; n++) {
      var w, i;
      if (type === 'vier') {
        w = n * sz;
        for (i = 0; i <= n; i++) s += ln(x + i * sz, top + 3, x + i * sz, top + sz - 3, 'fg-match');
        for (i = 0; i < n; i++) s += ln(x + i * sz + 3, top, x + (i + 1) * sz - 3, top, 'fg-match') + ln(x + i * sz + 3, top + sz, x + (i + 1) * sz - 3, top + sz, 'fg-match');
      } else if (type === 'drie') {
        var hh = sz * 0.87, pts = [];
        for (i = 0; i <= n + 1; i++) pts.push([x + i * sz / 2, i % 2 === 0 ? top + hh : top]);
        w = (n + 1) * sz / 2;
        for (i = 0; i < pts.length - 1; i++) s += ln(pts[i][0] + (pts[i + 1][0] - pts[i][0]) * 0.12, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * 0.12, pts[i][0] + (pts[i + 1][0] - pts[i][0]) * 0.88, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * 0.88, 'fg-match');
        for (i = 0; i < pts.length - 2; i++) s += ln(pts[i][0] + 3, pts[i][1], pts[i + 2][0] - 3, pts[i + 2][1], 'fg-match');
      } else {
        w = n * sz + 20; var tx0 = x + 10;
        s += '<rect x="' + tx0 + '" y="' + (top + 6) + '" width="' + (n * sz) + '" height="' + (sz - 12) + '" class="fg-shape"/>';
        for (i = 0; i < n; i++) s += '<circle cx="' + (tx0 + i * sz + sz / 2) + '" cy="' + top + '" r="4" class="fg-pin"/><circle cx="' + (tx0 + i * sz + sz / 2) + '" cy="' + (top + sz) + '" r="4" class="fg-pin"/>';
        s += '<circle cx="' + (tx0 - 6) + '" cy="' + (top + sz / 2) + '" r="4" class="fg-pin"/><circle cx="' + (tx0 + n * sz + 6) + '" cy="' + (top + sz / 2) + '" r="4" class="fg-pin"/>';
      }
      s += tx(c2(x + w / 2), top + sz + 22, 'figuur ' + n, 'ft', 'middle');
      x += w + 34;
    }
    return svg(Math.max(250, c2(x - 20)), top + sz + 30, s, 'De eerste drie figuren van een patroon');
  };

  // rij figuren: reeks van 't' (driehoek), 's' (vierkant), 'c' (cirkel), 'r' (ruit)
  F.shapes = function (seq) {
    var s = '', sz = 17, gap = 7.5, x = 6, y = 8;
    seq.forEach(function (k) {
      if (k === 't') s += '<path class="fg-sh fg-b1" d="M' + c2(x) + ',' + (y + sz) + ' h' + sz + ' l' + (-sz / 2) + ',' + (-sz) + ' Z"/>';
      else if (k === 's') s += '<rect class="fg-sh fg-b2" x="' + c2(x) + '" y="' + y + '" width="' + sz + '" height="' + sz + '"/>';
      else if (k === 'c') s += '<circle class="fg-sh fg-b3" cx="' + c2(x + sz / 2) + '" cy="' + (y + sz / 2) + '" r="' + (sz / 2) + '"/>';
      else s += '<path class="fg-sh fg-b5" d="M' + c2(x + sz / 2) + ',' + y + ' l' + (sz / 2) + ',' + (sz / 2) + ' l' + (-sz / 2) + ',' + (sz / 2) + ' l' + (-sz / 2) + ',' + (-sz / 2) + ' Z"/>';
      x += sz + gap;
    });
    s += tx(c2(x), y + sz - 2, '…', 'ft-title');
    return svg(c2(x + 18), y + sz + 10, s, 'Rij figuren die zich herhaalt');
  };

  // persoon naast een hoog voorwerp: {k: hoogte in persoonslengtes, kind}
  F.person = function (o) {
    var gy = 176, u = 150 / o.k, px = 70, s = ln(20, gy, 290, gy, 'fg-base');
    var hr = u * 0.1;
    s += '<circle cx="' + px + '" cy="' + c2(gy - u + hr) + '" r="' + c2(hr) + '" class="fg-pin"/><path class="fg-body" d="M' + px + ',' + c2(gy - u + 2 * hr) + ' V' + c2(gy - u * 0.42) + ' M' + px + ',' + c2(gy - u * 0.42) + ' L' + c2(px - u * 0.13) + ',' + gy + ' M' + px + ',' + c2(gy - u * 0.42) + ' L' + c2(px + u * 0.13) + ',' + gy + ' M' + c2(px - u * 0.17) + ',' + c2(gy - u * 0.66) + ' H' + c2(px + u * 0.17) + '"/>';
    var ox = 190, oh = u * o.k;
    if (o.kind === 'boom') s += '<rect x="' + (ox - 6) + '" y="' + c2(gy - oh * 0.45) + '" width="12" height="' + c2(oh * 0.45) + '" class="fg-trunk"/><ellipse cx="' + ox + '" cy="' + c2(gy - oh * 0.68) + '" rx="46" ry="' + c2(oh * 0.32) + '" class="fg-crown"/>';
    else if (o.kind === 'gebouw') {
      s += '<rect x="' + (ox - 44) + '" y="' + c2(gy - oh) + '" width="88" height="' + c2(oh) + '" class="fg-shape"/>';
    } else if (o.kind === 'mast') s += '<rect x="' + (ox - 2) + '" y="' + c2(gy - oh) + '" width="4" height="' + c2(oh) + '" class="fg-trunk"/><path class="fg-crown" d="M' + (ox + 2) + ',' + c2(gy - oh + 2) + ' h44 v26 h-44 Z"/>';
    else s += '<rect x="' + (ox - 2.5) + '" y="' + c2(gy - oh + 8) + '" width="5" height="' + c2(oh - 8) + '" class="fg-trunk"/><path class="fg-crown" d="M' + (ox - 16) + ',' + c2(gy - oh + 10) + ' h32 l-6,-10 h-20 Z"/>';
    return svg(310, 190, s, 'Een persoon naast een hoog voorwerp');
  };

  F.table = function (head, rows, o) {
    o = o || {};
    return '<div class="tblw"><table class="tbl' + (o.cls ? ' ' + o.cls : '') + '">' + (o.cap ? '<caption>' + o.cap + '</caption>' : '') +
      (head ? '<thead><tr>' + head.map(function (h) { return '<th scope="col">' + h + '</th>'; }).join('') + '</tr></thead>' : '') + '<tbody>' +
      rows.map(function (rw) { return '<tr>' + rw.map(function (c, i) { return i === 0 && o.rowHead !== false ? '<th scope="row">' + c + '</th>' : '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  };
  // rekenblad met kolomletters en rijnummers
  F.sheet = function (rows) {
    var cols = rows[0].length, h = '<tr><th class="crn"></th>';
    for (var c = 0; c < cols; c++) h += '<th scope="col">' + 'ABCDEFG'.charAt(c) + '</th>';
    h += '</tr>';
    return '<div class="tblw"><table class="tbl sheet"><thead>' + h + '</thead><tbody>' + rows.map(function (rw, i) { return '<tr><th scope="row">' + (i + 1) + '</th>' + rw.map(function (cell) { return '<td>' + cell + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>';
  };

  RWT.Rng = Rng;
  RWT.TPL = TPL;
  RWT.make = make;
  RWT.kit = { def: def, nf: nf, inp: inp, eur: eur, en: en, klok: klok, fr: fr, frs: frs, gcd: gcd, lcm: lcm, rnd: rnd, sum: sum, words: words, RETRY: RETRY, steps: steps, tip: tip, som: som, p: p, ask: ask, mcNum: mcNum, mcTxt: mcTxt, ordQ: ordQ, nm: nm, NB: NB, F: F, S: { svg: svg, tx: tx, ln: ln, c2: c2 } };
})();
