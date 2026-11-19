/* engine.js */
/* RWT oefenapp · toetsopbouw, adaptieve niveaukeuze, nakijken en score */
(function () {
  'use strict';
  var RWT = globalThis.RWT, Rng = RWT.Rng, TPL = RWT.TPL, make = RWT.make, kit = RWT.kit;

  var DOM = {
    A: { name: 'Hele getallen', short: 'Hele getallen' },
    B: { name: 'Verhoudingen, procenten, breuken en decimale getallen', short: 'Breuken en procenten' },
    C: { name: 'Meten en meetkunde', short: 'Meten en meetkunde' },
    D: { name: 'Verbanden en statistiek', short: 'Verbanden en statistiek' }
  };
  // verdeling volgens de toetsmatrijs van de RWT (50 tellende + 5 proefopgaven); kort = zelfde verhoudingen
  var MODES = {
    full: { name: 'Volledige proeftoets', H: { A: 9, B: 6, C: 2 }, N: { A: 7, B: 10, C: 11, D: 10 }, tH: 17 * 60, tN: 103 * 60 },
    short: { name: 'Korte proeftoets', H: { A: 3, B: 2, C: 1 }, N: { A: 3, B: 4, C: 4, D: 3 }, tH: 6 * 60, tN: 38 * 60 }
  };
  var PART = { H: 'Hoofdrekenen', N: 'Niet-hoofdrekenen' };
  // opgavetypen waarbij het antwoord negatief kan zijn: daar staat een plus-minknop naast het invulvak
  var NEG = { AH06: 1, AH10: 1, AN03: 1, AN04: 1, CN20: 1, DN11: 1 };

  /* ---------- vaardigheidsschatting ---------- */
  var DISC = 1.3, SIGMA = 1.2, BL = { 1: -1, 2: 0, 3: 1 };
  function pOk(th, level) { return 1 / (1 + Math.exp(-DISC * (th - BL[level]))); }
  // meest waarschijnlijke vaardigheid bij deze antwoorden (met een zwakke voorkeur voor het midden)
  function estimate(resp) {
    var th = 0;
    for (var it = 0; it < 40; it++) {
      var g = -th / (SIGMA * SIGMA), h = -1 / (SIGMA * SIGMA);
      for (var i = 0; i < resp.length; i++) { var p = pOk(th, resp[i].level); g += DISC * ((resp[i].ok ? 1 : 0) - p); h -= DISC * DISC * p * (1 - p); }
      var step = g / h; th -= step;
      if (Math.abs(step) < 1e-7) break;
    }
    return th;
  }
  // oefenscore: verwacht percentage goed op een vaste mix van makkelijke, gemiddelde en moeilijke opgaven
  function scoreOf(th) { return Math.round((pOk(th, 1) + pOk(th, 2) + pOk(th, 3)) / 3 * 100); }
  function levelFor(th) { return th < -0.5 ? 1 : th <= 0.5 ? 2 : 3; }
  function verdict(score) {
    if (score >= 70) return { key: 'good', label: 'Op koers', text: 'Je maakt opgaven op toetsniveau meestal goed. Blijf oefenen om dit vast te houden.' };
    if (score >= 55) return { key: 'warn', label: 'Bijna', text: 'Je zit dicht bij het niveau van de toets. Oefen gericht met de domeinen waar je de meeste fouten maakt.' };
    return { key: 'bad', label: 'Nog oefenen', text: 'Opgaven op toetsniveau gaan nog te vaak fout. Begin met oefenen per domein, zonder tijdsdruk.' };
  }

  /* ---------- opgaven kiezen ---------- */
  function shuffle(arr, rng) { return rng.shuffle(arr); }
  function makePlan(mode, rng) {
    var M = MODES[mode], plan = [];
    ['H', 'N'].forEach(function (part) {
      var slots = [];
      Object.keys(M[part]).forEach(function (d) { for (var i = 0; i < M[part][d]; i++) slots.push({ part: part, dom: d }); });
      plan = plan.concat(shuffle(slots, rng));
    });
    return plan;
  }
  function pickTpl(dom, part, used, rng) {
    var cands = TPL.filter(function (t) { return t.dom === dom && t.part === part; });
    if (!cands.length) return null;
    var least = Math.min.apply(null, cands.map(function (t) { return used[t.id] || 0; }));
    return rng.pick(cands.filter(function (t) { return (used[t.id] || 0) === least; }));
  }
  function hasTpl(dom, part) { return TPL.some(function (t) { return t.dom === dom && t.part === part; }); }

  /* ---------- sessie ---------- */
  function newTest(mode, seed) {
    return { v: 1, kind: 'test', mode: mode, seed: seed, started: Date.now(), plan: makePlan(mode, new Rng(seed)), idx: 0, items: [], used: {}, theta: 0,
      phase: 'introH', left: { H: MODES[mode].tH, N: MODES[mode].tN }, spent: { H: 0, N: 0 }, cur: null };
  }
  function newPractice(sel, seed) {
    // sel: {doms:[...], part:'H'|'N'|'HN', level:0 (meegroeiend) of 1..3, count:10/20/0 (doorgaan)}
    return { v: 1, kind: 'oefen', mode: 'oefen', seed: seed, started: Date.now(), sel: sel, idx: 0, items: [], used: {}, theta: sel.level ? BL[sel.level] : -0.3, phase: 'run', cur: null, spent: { H: 0, N: 0 } };
  }
  function slotFor(s) {
    if (s.kind === 'test') return s.plan[s.idx] || null;
    if (s.sel.count && s.idx >= s.sel.count) return null;
    var rng = new Rng(s.seed * 31 + s.idx * 977 + 5), parts = s.sel.part === 'HN' ? ['H', 'N'] : [s.sel.part], opts = [];
    s.sel.doms.forEach(function (d) { parts.forEach(function (p) { if (hasTpl(d, p)) opts.push({ dom: d, part: p }); }); });
    if (!opts.length) return null;
    // wissel de domeinen eerlijk af
    var counts = {}; s.items.forEach(function (it) { counts[it.dom + it.part] = (counts[it.dom + it.part] || 0) + 1; });
    var least = Math.min.apply(null, opts.map(function (o) { return counts[o.dom + o.part] || 0; }));
    return rng.pick(opts.filter(function (o) { return (counts[o.dom + o.part] || 0) === least; }));
  }
  function nextQuestion(s) {
    var rng = new Rng(s.seed * 1000003 + s.idx * 7919 + 17), tpl;
    if (s.kind === 'oefen' && s.sel.tpls && s.sel.tpls.length) {
      // oefenen met een vaste selectie opgavetypen
      if (s.sel.count && s.idx >= s.sel.count) { s.cur = null; return null; }
      var cands = TPL.filter(function (t) { return s.sel.tpls.indexOf(t.id) >= 0; });
      if (!cands.length) { s.cur = null; return null; }
      var least = Math.min.apply(null, cands.map(function (t) { return s.used[t.id] || 0; }));
      tpl = rng.pick(cands.filter(function (t) { return (s.used[t.id] || 0) === least; }));
    } else {
      var slot = slotFor(s); if (!slot) { s.cur = null; return null; }
      tpl = pickTpl(slot.dom, slot.part, s.used, rng);
    }
    var level = s.kind === 'oefen' && s.sel.level ? s.sel.level : levelFor(s.theta);
    var q = make(tpl, level, rng);
    s.used[tpl.id] = (s.used[tpl.id] || 0) + 1;
    s.cur = q;
    return q;
  }

  /* ---------- nakijken ---------- */
  function parseNum(str) {
    var t = String(str === undefined || str === null ? '' : str).replace(/\s+/g, '').replace(/\./g, ',').replace(/,$/, '');
    if (!/^-?(\d+(,\d+)?|,\d+)$/.test(t)) return null;
    return parseFloat(t.replace(',', '.'));
  }
  function check(q, given) {
    if (given === null || given === undefined) return false;
    if (q.type === 'mc') return given === q.ans;
    if (q.type === 'order') return Array.isArray(given) && given.length === q.ans.length && given.every(function (v, i) { return v === q.ans[i]; });
    return q.fields.every(function (f, i) { var v = parseNum(given[i]); return v !== null && Math.abs(v - f.ans) < 1e-6; });
  }
  function isComplete(q, given) {
    if (given === null || given === undefined) return false;
    if (q.type === 'mc') return typeof given === 'number';
    if (q.type === 'order') return Array.isArray(given) && given.length === q.items.length;
    return q.fields.every(function (f, i) { return parseNum(given[i]) !== null; });
  }
  // bij het getal 1 hoort een enkelvoud
  var SING = { 'ballen over': 'bal over', 'koekjes over': 'koekje over', 'eieren over': 'ei over', 'flessen over': 'fles over', 'stoelen over': 'stoel over', 'minuten': 'minuut', 'regentonnen': 'regenton', 'rollen': 'rol', 'maanden': 'maand', 'weken': 'week', 'blikken': 'blik', 'keer': 'keer' };
  function fieldText(f, val) { var n = parseNum(val), u = f.unit && n !== null && Math.abs(n) === 1 && SING[f.unit] ? SING[f.unit] : f.unit; return (f.pre ? f.pre + ' ' : '') + val + (u ? ' ' + u : ''); }
  function answerHtml(q) {
    if (q.type === 'mc') return q.opts[q.ans];
    if (q.type === 'order') return q.ans.map(function (i) { return q.items[i]; }).join(' &lt; ');
    return q.fields.map(function (f) { return fieldText(f, kit.inp(f.ans, f.dec)); }).join(' en ');
  }
  function givenHtml(q, given) {
    if (given === null || given === undefined) return '<i>geen antwoord</i>';
    if (q.type === 'mc') return q.opts[given] === undefined ? '<i>geen antwoord</i>' : q.opts[given];
    if (q.type === 'order') return given.map(function (i) { return q.items[i]; }).join(' &lt; ');
    return q.fields.map(function (f, i) { var raw = String(given[i] === undefined ? '' : given[i]).replace(/[<>&]/g, ''); return raw === '' ? '<i>leeg</i>' : fieldText(f, raw); }).join(' en ');
  }
  function record(s, given, secs) {
    var q = s.cur, ok = check(q, given);
    s.items.push({ q: q, given: given, ok: ok, secs: Math.round(secs), level: q.level, dom: q.dom, part: q.part, et: q.et, id: q.id });
    s.idx++; s.cur = null;
    if (!(s.kind === 'oefen' && s.sel.level)) s.theta = estimate(s.items);
    return ok;
  }

  /* ---------- uitslag ---------- */
  function summarize(s) {
    var dom = {}, part = { H: [0, 0], N: [0, 0] }, et = {}, resp = [], ok = 0, n = 0, secs = 0;
    function add(d, p, e, good, level) {
      dom[d] = dom[d] || [0, 0]; dom[d][1]++; part[p][1]++; n++;
      if (e) { et[e] = et[e] || [0, 0]; et[e][1]++; }
      if (good) { dom[d][0]++; part[p][0]++; ok++; if (e) et[e][0]++; }
      resp.push({ level: level, ok: good });
    }
    s.items.forEach(function (it) { add(it.dom, it.part, it.et, it.ok, it.level); secs += it.secs; });
    var missed = 0;
    // opgaven die door tijdgebrek niet gemaakt zijn, tellen als fout
    if (s.kind === 'test') (s.skipped || []).forEach(function (sl) { add(sl.dom, sl.part, null, false, 2); missed++; });
    var th = estimate(resp), sc = scoreOf(th);
    return { n: n, ok: ok, missed: missed, dom: dom, part: part, et: et, theta: th, score: sc, verdict: verdict(sc), secs: secs };
  }
  function historyEntry(s, sum) {
    var e = { id: 'r' + s.started.toString(36) + (s.seed % 1296).toString(36), t: Date.now(), mode: s.mode, n: sum.n, ok: sum.ok, score: sum.score, dom: sum.dom, part: sum.part, et: sum.et, secs: sum.secs };
    if (s.kind === 'oefen') e.sel = { d: s.sel.doms.join(''), p: s.sel.part, l: s.sel.level };
    return e;
  }

  RWT.engine = { DOM: DOM, MODES: MODES, PART: PART, NEG: NEG, SING: SING, estimate: estimate, scoreOf: scoreOf, levelFor: levelFor, verdict: verdict, pOk: pOk, makePlan: makePlan, hasTpl: hasTpl,
    newTest: newTest, newPractice: newPractice, nextQuestion: nextQuestion, slotFor: slotFor, parseNum: parseNum, check: check, isComplete: isComplete, answerHtml: answerHtml, givenHtml: givenHtml, record: record, summarize: summarize, historyEntry: historyEntry };
})();
