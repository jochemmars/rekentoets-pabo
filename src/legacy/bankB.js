/* bankB.js */
/* Domein B · Verhoudingen, procenten, breuken en decimale getallen */
(function () {
  'use strict';
  const { def, nf, eur, en, fr, frs, gcd, lcm, rnd, RETRY, steps, tip, som, p, ask, mcNum, mcTxt, ordQ, nm, NB, F } = RWT.kit;
  const gap = '<span class="gap">…</span>';
  const f6 = x => nf(rnd(x, 6));
  const proper = (r, b) => { let a; do { a = r.int(1, b - 1); } while (gcd(a, b) !== 1); return a; };
  const mixed = (w, a, b) => (w || '') + fr(a, b);
  // geen twijfelgevallen bij afronden: het cijfer na de laatste decimaal mag geen losse 5 zijn
  const tie = (x, d) => { const t = Math.round(Math.abs(x) * Math.pow(10, d + 3)); return t % 1000 === 500; };

  /* ================= hoofdrekenen ================= */

  def('BH01', 'B', 'H', 'B.3', 'Kommagetallen optellen en aftrekken', (L, r) => {
    let t; // termen in duizendsten, met teken
    if (L === 1) {
      if (r.chance(0.5)) { const a = 100 * r.int(1, 9), b = 10 * r.int(11, 89); if (b % 100 === 0) throw RETRY; t = [a, b]; }
      else { const a = 100 * r.int(11, 49), b = 10 * r.int(5, 95); if (b % 100 === 0 || b >= a) throw RETRY; t = [a, -b]; }
    } else if (L === 2) {
      if (r.chance(0.5)) { const a = 10 * r.int(51, 98), b = r.int(101, 499); if (b % 10 === 0 || b >= a) throw RETRY; t = [a, -b]; }
      else { const a = 10 * r.int(101, 899), b = r.int(1001, 3999); if (b % 10 === 0) throw RETRY; t = [a, b]; }
    } else if (r.chance(0.5)) { const a = 10 * r.int(201, 899), b = r.int(1001, 1999), c = 100 * r.int(1, 9); if (b % 10 === 0 || b >= a) throw RETRY; t = [a, -b, c]; }
    else { const a = 1000 * r.pick([5, 10, 20]), b = r.int(1001, 3999), c = 10 * r.int(1, 9); if (b % 10 === 0) throw RETRY; t = [a, -b, -c]; }
    const ans = t.reduce((x, y) => x + y, 0);
    const show = fmt => t.map((v, i) => (i ? (v < 0 ? ' − ' : ' + ') : '') + fmt(Math.abs(v))).join('');
    return { type: 'num', q: p('Reken uit.') + som(show(v => nf(v / 1000)) + ' ='), ans: ans / 1000,
      expl: steps('Zet de komma’s recht onder elkaar en vul lege plekken aan met nullen.', `${show(v => nf(v / 1000, 3))} = ${nf(ans / 1000, 3)}.`, `De uitkomst is <b>${nf(ans / 1000)}</b>.`) };
  });

  def('BH02', 'B', 'H', 'B.3', 'Kommagetallen vermenigvuldigen', (L, r) => {
    let ai, da, bi, db;
    const f = r.int(1, 3);
    if (L === 1) {
      if (f === 1) { ai = r.int(2, 9); da = 0; [bi, db] = r.pick([[25, 2], [5, 1], [75, 2], [15, 1], [25, 1], [2, 1], [4, 1], [6, 1], [8, 1], [12, 1]]); }
      else if (f === 2) { ai = 5; da = 1; bi = 2 * r.int(11, 48); db = 2; }
      else { ai = r.int(2, 9); da = 1; bi = r.int(2, 9); db = 1; }
    } else if (L === 2) {
      if (f === 1) { ai = r.int(11, 25); da = 1; bi = r.int(2, 9); db = 1; if (ai % 10 === 0) throw RETRY; }
      else if (f === 2) { ai = 25; da = 2; bi = 4 * r.int(11, 60); db = 1; }
      else { ai = r.int(2, 9); da = 2; bi = r.pick([50, 200, 300, 500, 700]); db = 0; }
    } else if (f === 1) { ai = 125; da = 3; bi = 8 * r.int(1, 9); db = 1; }
    else if (f === 2) { ai = r.int(2, 9); da = 1; bi = r.pick([15, 25, 35, 45, 12, 16]); db = 2; }
    else { ai = bi = r.pick([15, 25, 9, 12, 11, 35]); da = db = 1; }
    if ((da && ai % 10 === 0) || (db && bi % 10 === 0)) throw RETRY;
    const a = ai / Math.pow(10, da), b = bi / Math.pow(10, db), ans = rnd(ai * bi / Math.pow(10, da + db), 6), dn = da + db;
    return { type: 'num', q: p('Reken uit.') + som(`${nf(a)} × ${nf(b)} =`), ans,
      expl: steps(`Reken eerst zonder komma’s: ${ai} × ${bi} = ${nf(ai * bi)}.`, `In de som staan samen ${dn} ${dn === 1 ? 'cijfer' : 'cijfers'} achter de komma. Schuif de komma in de uitkomst ${dn} ${dn === 1 ? 'plaats' : 'plaatsen'} naar links.`, `${nf(a)} × ${nf(b)} = <b>${nf(ans)}</b>.`) };
  });

  def('BH03', 'B', 'H', 'B.3', 'Kommagetallen delen', (L, r) => {
    let dvd, dvs, q, ex;
    if (L === 1) {
      if (r.chance(0.5)) {
        const d = r.int(2, 9), qi = r.pick([2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 15]); if ((qi * d) % 10 === 0) throw RETRY;
        dvd = qi * d / 10; dvs = d; q = qi / 10;
        ex = steps(`Reken eerst zonder komma: ${qi * d} : ${d} = ${qi}.`, `${nf(dvd)} is 10 keer zo klein als ${qi * d}, dus de uitkomst ook: <b>${nf(q)}</b>.`);
      } else {
        const [dv, inv] = r.pick([[0.5, 2], [0.25, 4], [0.2, 5], [0.1, 10]]), n = r.int(2, 12); dvd = n; dvs = dv; q = n * inv;
        ex = steps(`In 1 past ${nf(dv)} precies ${inv} keer.`, `In ${n} past het dus ${n} × ${inv} = <b>${nf(q)}</b> keer.`);
      }
    } else if (L === 2) {
      const [di, k] = r.pick([[5, 3], [5, 2], [6, 2], [8, 2], [25, 2], [4, 2], [2, 2], [3, 2], [5, 1], [4, 1]]), m = Math.pow(10, k);
      q = r.int(12, 90); dvd = rnd(q * di / m, 6); dvs = di / m;
      ex = steps(`Maak van de deler een heel getal. Vermenigvuldig beide getallen met ${nf(m)}: ${nf(q * di)} : ${di}.`, `${nf(q * di)} : ${di} = <b>${nf(q)}</b>.`);
    } else {
      const di = r.pick([2, 3, 4, 6, 8, 9, 12]), k = r.int(1, 3), j = r.int(1, 2), qi = r.int(2, 95), m = Math.pow(10, k);
      if (qi % 10 === 0 || k + j > 4) throw RETRY;
      q = qi / Math.pow(10, j); dvd = rnd(di * qi / Math.pow(10, k + j), 6); dvs = di / m;
      ex = steps(`Maak van de deler een heel getal. Vermenigvuldig beide getallen met ${nf(m)}: ${f6(dvd * m)} : ${di}.`, `${di * qi} : ${di} = ${qi}, dus ${f6(dvd * m)} : ${di} = <b>${nf(q)}</b>.`);
    }
    return { type: 'num', q: p('Reken uit.') + som(`${nf(dvd)} : ${nf(dvs)} =`), ans: q, expl: ex };
  });

  const PAIRS1 = [[2, 4], [2, 6], [2, 8], [3, 6], [4, 8], [3, 9], [5, 10], [2, 10], [4, 12], [3, 12], [6, 12]];
  const PAIRS2 = [[2, 3], [3, 4], [2, 5], [4, 6], [3, 5], [6, 8], [4, 5], [6, 9], [8, 12], [4, 10], [2, 7]];
  def('BH04', 'B', 'H', 'B.6', 'Breuken optellen en aftrekken', (L, r) => {
    let [b, d] = r.pick(L === 1 ? PAIRS1 : PAIRS2); if (r.chance(0.5)) { const t = b; b = d; d = t; }
    const a = proper(r, b), c = proper(r, d), l = lcm(b, d), sub = r.chance(0.5);
    let w1 = 0, w2 = 0;
    if (L === 3) { w1 = r.int(1, 4); w2 = r.int(1, 3); if (sub && w1 <= w2) w1 = w2 + r.int(1, 2); }
    const an = a * (l / b), cn = c * (l / d), n1 = w1 * l + an, n2 = w2 * l + cn, n = sub ? n1 - n2 : n1 + n2;
    if (n <= 0) throw RETRY;
    const good = frs(n, l), W = sub ? w1 - w2 : w1 + w2, wr = [];
    if (!sub) wr.push(frs(W * (b + d) + a + c, b + d)); else if (b !== d && a !== c) wr.push(frs(W * Math.abs(b - d) + Math.abs(a - c), Math.abs(b - d)));
    if (sub ? W * l + a - c > 0 : true) wr.push(frs(W * l + (sub ? a - c : a + c), l));
    if (sub && an < cn) wr.push(frs(W * l + cn - an, l));
    wr.push(frs(n + 1, l)); if (n > 1) wr.push(frs(n - 1, l)); wr.push(frs(sub ? n1 + n2 : Math.abs(n1 - n2) || 1, l));
    const op = sub ? '−' : '+', A = mixed(w1, a, b), C = mixed(w2, c, d);
    const st = [];
    if (L === 3) st.push(`Schrijf de gemengde getallen als breuk met noemer ${l}: ${A} = ${fr(n1, l)} en ${C} = ${fr(n2, l)}.`);
    else st.push(`Maak de breuken gelijknamig met noemer ${l}: ${fr(a, b)} = ${fr(an, l)} en ${fr(c, d)} = ${fr(cn, l)}.`);
    st.push(`${fr(n1, l)} ${op} ${fr(n2, l)} = ${fr(n, l)}.`);
    st.push(good === fr(n, l) ? `De uitkomst is <b>${good}</b>.` : `Vereenvoudig: <b>${good}</b>.`);
    return Object.assign(mcTxt(r, good, wr), { q: p('Reken uit.') + som(`${A} ${op} ${C} =`), expl: steps.apply(null, st) });
  });

  def('BH05', 'B', 'H', 'B.6', 'Breuken vermenigvuldigen en delen', (L, r) => {
    let n1, d1, n2, d2, A, C, div = false, pre = [];
    if (L === 1) {
      if (r.chance(0.45)) { n1 = r.int(2, 6); d1 = 1; d2 = r.pick([3, 4, 5, 7, 8]); n2 = proper(r, d2); A = String(n1); C = fr(n2, d2); if (gcd(n1, d2) !== 1) throw RETRY; }
      else { d1 = r.pick([2, 3, 4, 5]); n1 = proper(r, d1); d2 = r.pick([2, 3, 4, 5, 7]); n2 = proper(r, d2); A = fr(n1, d1); C = fr(n2, d2); if (gcd(n1 * n2, d1 * d2) !== 1) throw RETRY; }
    } else if (L === 2) {
      div = r.chance(0.5);
      d1 = r.pick([3, 4, 5, 6, 8]); n1 = proper(r, d1); d2 = r.pick([2, 3, 4, 6, 8, 9]); n2 = proper(r, d2); A = fr(n1, d1); C = fr(n2, d2);
      if (!div && gcd(n1 * n2, d1 * d2) === 1) throw RETRY;
      if (n1 === n2 && d1 === d2) throw RETRY;
    } else {
      div = r.chance(0.5);
      const b = r.pick([2, 3, 4, 5]), a = proper(r, b), w1 = r.int(1, 3), d = r.pick([2, 3, 4, 5]), c = proper(r, d), w2 = r.int(div ? 0 : 1, 2);
      n1 = w1 * b + a; d1 = b; n2 = w2 * d + c; d2 = d; A = mixed(w1, a, b); C = mixed(w2, c, d);
      pre = [`Schrijf gemengde getallen eerst als breuk: ${A} = ${fr(n1, d1)}${w2 ? ` en ${C} = ${fr(n2, d2)}` : ''}.`];
    }
    const N = div ? n1 * d2 : n1 * n2, D = div ? d1 * n2 : d1 * d2, good = frs(N, D), wr = [];
    if (div) { wr.push(frs(n1 * n2, d1 * d2)); wr.push(frs(d1 * n2, n1 * d2)); wr.push(frs(n1 + d2, d1 + n2)); wr.push(frs(N + D, D)); }
    else { wr.push(frs(n1 * d2, d1 * n2)); if (d1 !== 1) wr.push(frs(n1 * d2 + n2 * d1, d1 * d2)); wr.push(frs(n1 + n2, d1 + d2)); wr.push(frs(N + D, D)); if (d1 === 1) wr.push(frs(n2, n1 * d2)); }
    if (L === 3 && !div) wr.unshift(frs(Math.floor(n1 / d1) * Math.floor(n2 / d2) * D + (n1 % d1) * (n2 % d2), D));
    const st = pre.slice();
    if (div) st.push(`Delen door een breuk is vermenigvuldigen met het omgekeerde: ${fr(n1, d1)} × ${fr(d2, n2)} = ${fr(N, D)}.`);
    else if (d1 === 1) st.push(`Vermenigvuldig alleen de teller: ${n1} × ${fr(n2, d2)} = ${fr(N, D)}.`);
    else st.push(`Teller keer teller en noemer keer noemer: ${fr(n1, d1)} × ${fr(n2, d2)} = ${fr(N, D)}.`);
    st.push(good === fr(N, D) ? `De uitkomst is <b>${good}</b>.` : `Vereenvoudig: <b>${good}</b>.`);
    return Object.assign(mcTxt(r, good, wr), { q: p('Reken uit.') + som(`${A} ${div ? ':' : '×'} ${C} =`), expl: steps.apply(null, st) });
  });

  function pctEx(pc, base) {
    const res = base * pc / 100, ten = base / 10, one = base / 100, B = f6(base);
    const M = {
      10: [`10% is het tiende deel: ${B} : 10 = <b>${f6(res)}</b>.`],
      20: [`10% van ${B} is ${f6(ten)}.`, `20% is het dubbele: <b>${f6(res)}</b>.`],
      25: [`25% is een kwart: ${B} : 4 = <b>${f6(res)}</b>.`],
      50: [`50% is de helft: ${B} : 2 = <b>${f6(res)}</b>.`],
      75: [`25% is een kwart: ${B} : 4 = ${f6(base / 4)}.`, `75% is drie keer zoveel: <b>${f6(res)}</b>.`],
      5: [`10% van ${B} is ${f6(ten)}.`, `5% is de helft daarvan: <b>${f6(res)}</b>.`],
      15: [`10% van ${B} is ${f6(ten)}.`, `5% is de helft daarvan: ${f6(ten / 2)}.`, `Samen: <b>${f6(res)}</b>.`],
      30: [`10% van ${B} is ${f6(ten)}.`, `30% is drie keer zoveel: <b>${f6(res)}</b>.`],
      35: [`10% van ${B} is ${f6(ten)}, dus 30% is ${f6(3 * ten)}.`, `5% is ${f6(ten / 2)}.`, `Samen: <b>${f6(res)}</b>.`],
      40: [`10% van ${B} is ${f6(ten)}.`, `40% is vier keer zoveel: <b>${f6(res)}</b>.`],
      45: [`50% van ${B} is ${f6(base / 2)} en 5% is ${f6(ten / 2)}.`, `45% = 50% − 5%: <b>${f6(res)}</b>.`],
      60: [`10% van ${B} is ${f6(ten)}.`, `60% is zes keer zoveel: <b>${f6(res)}</b>.`],
      12.5: [`12,5% is één achtste deel: ${B} : 8 = <b>${f6(res)}</b>.`],
      2.5: [`10% van ${B} is ${f6(ten)}.`, `2,5% is een kwart daarvan: <b>${f6(res)}</b>.`],
      0.5: [`1% van ${B} is ${f6(one)}.`, `0,5% is de helft daarvan: <b>${f6(res)}</b>.`],
      17.5: [`10% is ${f6(ten)}, 5% is ${f6(ten / 2)} en 2,5% is ${f6(ten / 4)}.`, `Samen: <b>${f6(res)}</b>.`],
      125: [`100% is ${B} en 25% is ${f6(base / 4)}.`, `Samen: <b>${f6(res)}</b>.`],
      150: [`100% is ${B} en 50% is ${f6(base / 2)}.`, `Samen: <b>${f6(res)}</b>.`],
      250: [`200% is ${f6(2 * base)} en 50% is ${f6(base / 2)}.`, `Samen: <b>${f6(res)}</b>.`],
      0.2: [`1% van ${B} is ${f6(one)}.`, `0,2% is een vijfde deel daarvan: <b>${f6(res)}</b>.`],
      37.5: [`25% is ${f6(base / 4)} en 12,5% is de helft daarvan: ${f6(base / 8)}.`, `Samen: <b>${f6(res)}</b>.`],
      62.5: [`50% is ${f6(base / 2)} en 12,5% is ${f6(base / 8)}.`, `Samen: <b>${f6(res)}</b>.`]
    };
    return M[pc] || [`1% van ${B} is ${f6(one)}.`, `${nf(pc)}% is ${nf(pc)} keer zoveel: <b>${f6(res)}</b>.`];
  }
  def('BH06', 'B', 'H', 'B.7', 'Procent en promille van een getal', (L, r) => {
    let pc, base;
    if (L === 1) { pc = r.pick([10, 20, 25, 50, 75]); base = 20 * r.int(2, 48); }
    else if (L === 2) { const [q, st, lo, hi] = r.pick([[15, 20, 3, 40], [35, 20, 3, 40], [30, 10, 4, 90], [45, 20, 3, 40], [60, 5, 8, 90], [5, 20, 3, 60], [12.5, 40, 2, 24], [2.5, 40, 2, 50], [0.5, 200, 2, 40]]); pc = q; base = st * r.int(lo, hi); }
    else if (r.chance(0.3)) {
      const pm = r.pick([2, 3, 4, 5, 8, 1.5, 2.5, 0.5]); base = 2000 * r.int(10, 400); const ans = rnd(base * pm / 1000, 6);
      return { type: 'num', q: p(`Hoeveel is ${nf(pm)} promille van ${nf(base)}?`), ans, expl: steps('Promille betekent: per duizend.', `1 promille van ${nf(base)} is ${nf(base)} : 1.000 = ${nf(base / 1000)}.`, `${nf(pm)} promille is ${nf(pm)} × ${nf(base / 1000)} = <b>${nf(ans)}</b>.`) };
    } else { const [q, st, lo, hi] = r.pick([[17.5, 40, 2, 30], [125, 4, 10, 200], [150, 2, 20, 300], [250, 2, 20, 200], [0.2, 500, 2, 120], [37.5, 8, 5, 100], [62.5, 8, 5, 100]]); pc = q; base = st * r.int(lo, hi); }
    return { type: 'num', q: p(`Hoeveel is ${nf(pc)}% van ${nf(base)}?`), ans: rnd(base * pc / 100, 6), expl: steps.apply(null, pctEx(pc, base)) };
  });

  def('BH07', 'B', 'H', 'B.8', 'Breuk, kommagetal en procent omzetten', (L, r) => {
    const f = r.int(1, 3);
    if (L === 1) {
      if (f === 1) { const [a, b] = r.pick([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10], [9, 10]]), k = 100 / b; return { type: 'num', unit: '%', q: p(`Schrijf ${fr(a, b)} als percentage.`), ans: a * k, expl: steps(`Maak van de noemer 100: ${fr(a, b)} = ${fr(a * k, 100)}.`, `Dat is <b>${a * k}</b>%.`) }; }
      if (f === 2) { const v = r.pick([2, 5, 7, 15, 35, 45, 60, 8, 12, 85]); return { type: 'num', unit: '%', q: p(`Schrijf ${nf(v / 100)} als percentage.`), ans: v, expl: steps(`Vermenigvuldig met 100: ${nf(v / 100)} × 100 = <b>${v}</b>%.`) }; }
      const [a, b] = r.pick([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [3, 10], [7, 10]]); return { type: 'num', q: p(`Schrijf ${fr(a, b)} als kommagetal.`), ans: a / b, expl: steps(`Deel de teller door de noemer: ${a} : ${b} = <b>${nf(a / b)}</b>.`) };
    }
    if (L === 2) {
      if (f === 1) { const [a, b] = r.pick([[1, 8], [3, 8], [5, 8], [7, 8], [7, 20], [9, 20], [3, 25], [7, 25], [11, 50], [3, 20], [13, 20], [17, 25]]); const v = rnd(a / b * 100, 4); return { type: 'num', unit: '%', q: p(`Schrijf ${fr(a, b)} als percentage.`), ans: v, expl: steps(b === 8 ? `${fr(1, 8)} is 12,5%, dus ${fr(a, 8)} is ${a} × 12,5%.` : `Maak van de noemer 100: ${fr(a, b)} = ${fr(a * 100 / b, 100)}.`, `Dat is <b>${nf(v)}</b>%.`) }; }
      if (f === 2) { const [a, b] = r.pick([[1, 8], [3, 8], [1, 20], [3, 25], [7, 20], [5, 8], [9, 25], [3, 40]]); return { type: 'num', q: p(`Schrijf ${fr(a, b)} als kommagetal.`), ans: a / b, expl: steps(`Deel de teller door de noemer: ${a} : ${b} = <b>${nf(a / b)}</b>.`) }; }
      const v = r.pick([135, 7, 12.5, 108, 2.5, 250, 0.5, 62.5]); return { type: 'num', q: p(`Schrijf ${nf(v)}% als kommagetal.`), ans: v / 100, expl: steps(`Procent betekent: per honderd. Deel door 100: ${nf(v)} : 100 = <b>${f6(v / 100)}</b>.`) };
    }
    if (f === 1) { const [a, b] = r.pick([[7, 40], [3, 16], [5, 16], [9, 40], [11, 40], [1, 16], [13, 40], [7, 16]]); const v = rnd(a / b * 100, 4); return { type: 'num', unit: '%', q: p(`Schrijf ${fr(a, b)} als percentage.`), ans: v, expl: steps(`Deel de teller door de noemer: ${a} : ${b} = ${nf(a / b)}.`, `Vermenigvuldig met 100: <b>${nf(v)}</b>%.`) }; }
    if (f === 2) { const [a, b] = r.pick([[2, 3], [1, 6], [5, 6], [1, 7], [2, 9], [4, 9], [5, 12], [1, 3], [7, 9], [5, 7]]); const v = rnd(a / b * 100, 1); return { type: 'num', unit: '%', dec: 1, q: p(`Schrijf ${fr(a, b)} als percentage. Rond af op één decimaal.`), ans: v, expl: steps(`${a} : ${b} = ${nf(a / b, 4)}…`, `Vermenigvuldig met 100: ${nf(a / b * 100, 2)}… Afgerond op één decimaal: <b>${nf(v, 1)}</b>%.`) }; }
    const [k, b] = r.pick([[7, 8], [3, 8], [5, 8], [7, 20], [9, 25], [13, 40], [11, 16]]); return { type: 'num', q: p('Welk getal hoort op de puntjes?') + som(`${nf(k / b)} = ` + fr(gap, b)), ans: k, expl: steps(`Vermenigvuldig het kommagetal met de noemer: ${nf(k / b)} × ${b} = <b>${k}</b>.`, `Controle: ${k} : ${b} = ${nf(k / b)}.`) };
  });

  const MIX = [['siroop', 'water', 'ml'], ['cement', 'zand', 'scheppen'], ['rode verf', 'witte verf', 'ml'], ['azijn', 'olie', 'ml'], ['sap', 'bronwater', 'ml']];
  def('BH08', 'B', 'H', 'B.5', 'Rekenen met verhoudingen', (L, r) => {
    if (L === 1) {
      const [x, y, u] = r.pick(MIX), k = r.int(3, 9), S = u === 'scheppen' ? r.int(2, 9) : r.pick([20, 25, 40, 50, 75, 80]);
      if (r.chance(0.5)) return { type: 'num', unit: u, q: p(`De verhouding ${x} : ${y} is 1 : ${k}.`) + ask(`Hoeveel ${u} ${y} hoort bij ${S} ${u} ${x}?`), ans: k * S, expl: steps(`Bij 1 deel ${x} horen ${k} delen ${y}.`, `${S} × ${k} = <b>${nf(k * S)}</b> ${u} ${y}.`) };
      return { type: 'num', unit: u, q: p(`De verhouding ${x} : ${y} is 1 : ${k}.`) + ask(`Hoeveel ${u} ${x} hoort bij ${nf(k * S)} ${u} ${y}?`), ans: S, expl: steps(`De hoeveelheid ${y} is ${k} keer zo groot als de hoeveelheid ${x}.`, `${nf(k * S)} : ${k} = <b>${S}</b> ${u} ${x}.`) };
    }
    if (L === 2) {
      const [a, b] = r.pick([[2, 3], [3, 5], [1, 4], [3, 4], [2, 5], [5, 7], [1, 3], [4, 5]]);
      if (r.chance(0.5)) { const u = r.pick([10, 20, 30, 40, 50, 60]), T = (a + b) * u; return { type: 'num', pre: '€', q: p(`Een bedrag van ${eur(T)} wordt verdeeld in de verhouding ${a} : ${b}.`) + ask('Hoe groot is het grootste deel?'), ans: b * u, expl: steps(`Er zijn ${a} + ${b} = ${a + b} delen.`, `Eén deel is ${eur(T)} : ${a + b} = ${eur(u)}.`, `Het grootste deel is ${b} × ${eur(u)} = <b>${eur(b * u)}</b>.`) }; }
      const u = r.int(3, 8); return { type: 'num', unit: 'jongens', q: p(`In een sportclub is de verhouding jongens : meisjes gelijk aan ${a} : ${b}. Er zijn ${b * u} meisjes.`) + ask('Hoeveel jongens zijn er?'), ans: a * u, expl: steps(`${b} delen zijn samen ${b * u} meisjes, dus één deel is ${b * u} : ${b} = ${u}.`, `Jongens: ${a} × ${u} = <b>${a * u}</b>.`) };
    }
    const f = r.int(1, 3);
    if (f === 1) { const [a, b, c] = r.pick([[3, 4, 5], [1, 2, 3], [2, 3, 5], [1, 3, 4], [2, 3, 4], [1, 4, 5]]), u = r.pick([20, 25, 30, 40, 50]), T = (a + b + c) * u; return { type: 'num', q: p(`Het getal ${nf(T)} wordt verdeeld in de verhouding ${a} : ${b} : ${c}.`) + ask('Hoe groot is het middelste deel?'), ans: b * u, expl: steps(`Er zijn ${a} + ${b} + ${c} = ${a + b + c} delen.`, `Eén deel is ${nf(T)} : ${a + b + c} = ${u}.`, `Het middelste deel is ${b} × ${u} = <b>${b * u}</b>.`) }; }
    if (f === 2) { const [a, b, c] = r.pick([[1, 2, 3], [1, 2, 4], [1, 3, 5], [2, 3, 4]]), u = r.int(3, 9); return { type: 'num', unit: 'scheppen', q: p(`Beton maak je van cement, zand en grind in de verhouding ${a} : ${b} : ${c}. Je gebruikt ${b * u} scheppen zand.`) + ask('Hoeveel scheppen gebruik je in totaal?'), ans: (a + b + c) * u, expl: steps(`${b} delen zand zijn ${b * u} scheppen, dus één deel is ${u} scheppen.`, `In totaal zijn er ${a} + ${b} + ${c} = ${a + b + c} delen.`, `${a + b + c} × ${u} = <b>${(a + b + c) * u}</b> scheppen.`) }; }
    const [a, b] = r.pick([[2, 5], [3, 7], [1, 4], [3, 5], [2, 7], [4, 9]]), u = r.pick([10, 15, 20, 30]); return { type: 'num', q: p(`Twee getallen verhouden zich als ${a} : ${b}. Het verschil tussen de twee getallen is ${(b - a) * u}.`) + ask('Hoeveel zijn de twee getallen samen?'), ans: (a + b) * u, expl: steps(`Het verschil is ${b} − ${a} = ${b - a} delen. Dat is ${(b - a) * u}, dus één deel is ${u}.`, `Samen zijn het ${a} + ${b} = ${a + b} delen.`, `${a + b} × ${u} = <b>${(a + b) * u}</b>.`) };
  });

  const POOL = [[fr(1, 4), 0.25], [fr(3, 8), 0.375], [fr(2, 5), 0.4], [fr(1, 2), 0.5], [fr(3, 5), 0.6], [fr(5, 8), 0.625], [fr(2, 3), 2 / 3], [fr(3, 4), 0.75], [fr(4, 5), 0.8], [fr(7, 8), 0.875], [fr(1, 3), 1 / 3], [fr(7, 10), 0.7], [fr(5, 6), 5 / 6],
    ['0,3', 0.3], ['0,35', 0.35], ['0,409', 0.409], ['0,45', 0.45], ['0,55', 0.55], ['0,65', 0.65], ['0,72', 0.72], ['0,85', 0.85], ['0,67', 0.67], ['0,6', 0.6], ['0,63', 0.63], ['0,333', 0.333], ['0,8', 0.8], ['0,38', 0.38],
    ['28%', 0.28], ['35%', 0.35], ['42%', 0.42], ['48%', 0.48], ['58%', 0.58], ['66%', 0.66], ['70%', 0.7], ['77%', 0.77], ['88%', 0.88], ['62%', 0.62], ['33%', 0.33], ['40%', 0.4], ['37%', 0.37]];
  def('BH09', 'B', 'H', 'B.4', 'Breuken, kommagetallen en procenten vergelijken', (L, r) => {
    if (L === 1) {
      const big = r.chance(0.5);
      if (r.chance(0.5)) {
        const dens = r.sample([2, 3, 4, 5, 6, 8, 10, 12], 4), pick = big ? Math.min.apply(null, dens) : Math.max.apply(null, dens);
        return Object.assign(mcTxt(r, fr(1, pick), dens.filter(d => d !== pick).map(d => fr(1, d))), { q: p(`Welke breuk is het ${big ? 'grootst' : 'kleinst'}?`), expl: steps('De tellers zijn gelijk. Dan geldt: hoe groter de noemer, hoe kleiner de stukjes.', `De ${big ? 'grootste' : 'kleinste'} breuk is <b>${fr(1, pick)}</b>.`) });
      }
      const d = r.pick([7, 9, 11, 12]), ns = r.sample([1, 2, 3, 4, 5, 6].filter(x => x < d), 4), pick = big ? Math.max.apply(null, ns) : Math.min.apply(null, ns);
      return Object.assign(mcTxt(r, fr(pick, d), ns.filter(x => x !== pick).map(x => fr(x, d))), { q: p(`Welke breuk is het ${big ? 'grootst' : 'kleinst'}?`), expl: steps('De noemers zijn gelijk. Dan vergelijk je alleen de tellers.', `De ${big ? 'grootste' : 'kleinste'} breuk is <b>${fr(pick, d)}</b>.`) });
    }
    const k = L === 2 ? 4 : 5, minGap = L === 2 ? 0.02 : 0.004, it = r.sample(POOL, k).map(x => ({ h: x[0], v: x[1] }));
    const kinds = new Set(it.map(x => x.h.indexOf('%') > 0 ? 'p' : x.h.indexOf('class') > 0 ? 'f' : 'd'));
    if (kinds.size < 2) throw RETRY;
    const sorted = it.map(x => x.v).sort((a, b) => a - b);
    for (let i = 1; i < k; i++) if (sorted[i] - sorted[i - 1] < minGap) throw RETRY;
    if (L === 3 && sorted[k - 1] - sorted[0] > 0.45) throw RETRY;
    const o = ordQ(r, it);
    return Object.assign(o, { q: p('Zet de getallen in de goede volgorde, van klein naar groot.'),
      expl: steps('Schrijf alles als kommagetal. Dan kun je goed vergelijken.', o.ans.map(i => `${o.items[i]} = ${nf(it.find(x => x.h === o.items[i]).v, 3).replace(/,?0+$/, '')}`).join('; ') + '.', `De goede volgorde is: <b>${o.ans.map(i => o.items[i]).join(' &lt; ')}</b>.`) });
  });

  const PLACE = ['tienden', 'honderdsten', 'duizendsten', 'tienduizendsten'];
  def('BH10', 'B', 'H', 'B.2', 'Kommagetallen afronden en plaatswaarde', (L, r) => {
    const dn = d => d === 0 ? 'een heel getal' : d === 1 ? 'één decimaal' : d === 2 ? 'twee decimalen' : 'drie decimalen';
    const ex = (x, d, ans) => { const s = nf(x, 6).replace(/0+$/, ''), dig = Math.floor(rnd(Math.abs(x) * Math.pow(10, d + 1), 3)) % 10; return steps(`Je houdt ${d === 0 ? 'geen cijfers' : d === 1 ? 'één cijfer' : d + ' cijfers'} achter de komma over. Kijk naar het cijfer daarna: dat is een ${dig}.`, dig >= 5 ? '5 of hoger: je rondt naar boven af.' : 'Lager dan 5: je rondt naar beneden af.', `${s} wordt <b>${nf(ans, d)}</b>.`); };
    if (L === 1) { const x = r.int(1001, 9989) / 1000; if (Math.round(x * 1000) % 10 === 0 || Math.round(x * 1000) % 100 === 50) throw RETRY; const ans = rnd(x, 1); return { type: 'num', dec: 1, q: p(`Rond ${nf(x)} af op één decimaal.`), ans, expl: ex(x, 1, ans) }; }
    if (L === 2) {
      if (r.chance(0.5)) { const x = r.int(10011, 99989) / 10000; if (Math.round(x * 10000) % 10 === 0 || Math.round(x * 10000) % 100 === 50) throw RETRY; const ans = rnd(x, 2); return { type: 'num', dec: 2, q: p(`Rond ${nf(x)} af op twee decimalen.`), ans, expl: ex(x, 2, ans) }; }
      const digs = r.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 5), s = digs[0] + ',' + digs.slice(1).join(''), pos = r.int(1, 4), dig = digs[pos];
      return Object.assign(mcTxt(r, PLACE[pos - 1], PLACE.filter((x, i) => i !== pos - 1)), { q: p(`Wat is de waarde van het cijfer ${dig} in het getal ${s}?`), expl: steps('Achter de komma staan achtereenvolgens de tienden, honderdsten, duizendsten en tienduizendsten.', `De ${dig} staat op plaats ${pos} achter de komma. Dat zijn de <b>${PLACE[pos - 1]}</b>.`) });
    }
    const d = r.int(0, 3), M = r.int(d === 0 ? 3 : 1, d === 0 ? 40 : 140), t = r.int(1, 49), base = d === 0 ? M : (M * 10) / Math.pow(10, d), x = rnd(base - t / Math.pow(10, d + 2), 6);
    if (x <= 0) throw RETRY;
    return { type: 'num', dec: d, q: p(`Rond ${nf(x)} af op ${dn(d)}.`), ans: rnd(base, 6), expl: ex(x, d, base) + (d > 0 ? tip(`De uitkomst eindigt op een nul. ${nf(base, d)} en ${nf(base)} zijn even groot; je mag beide invullen.`) : '') };
  });

  def('BH11', 'B', 'H', 'B.7', 'Korting en procentuele verandering', (L, r) => {
    const it = r.pick(['jas', 'broek', 'rugzak', 'paar schoenen', 'trui', 'lamp', 'boek']);
    if (L === 1) { const pc = r.pick([10, 20, 25, 50]), P = 20 * r.int(2, 12), k = P * pc / 100; return { type: 'num', pre: '€', q: p(`Een ${it} kost ${eur(P)}. Je krijgt ${pc}% korting.`) + ask('Wat is de nieuwe prijs?'), ans: P - k, expl: steps(`De korting is ${pc}% van ${eur(P)}: ${eur(k)}.`, `${eur(P)} − ${eur(k)} = <b>${eur(P - k)}</b>.`) }; }
    if (L === 2) {
      const pc = r.pick([15, 30, 35, 40, 5]);
      if (r.chance(0.5)) { const P = 20 * r.int(2, 14), k = P * pc / 100; return { type: 'num', pre: '€', q: p(`Een ${it} kost ${eur(P)}. Je krijgt ${pc}% korting.`) + ask('Wat is de nieuwe prijs?'), ans: P - k, expl: steps(`De korting is ${pc}% van ${eur(P)}: ${eur(k)}.`, `${eur(P)} − ${eur(k)} = <b>${eur(P - k)}</b>.`) }; }
      const c = 20 * r.int(6, 45), k = c * pc / 100; if (c % 100 === 0) throw RETRY;
      return { type: 'num', pre: '€', dec: 2, q: p(`Een pak koekjes kost ${eur(c / 100)}. Deze week krijg je ${pc}% korting.`) + ask('Wat is de nieuwe prijs?'), ans: (c - k) / 100, expl: steps(`De korting is ${pc}% van ${eur(c / 100)}: ${eur(k / 100)}.`, `${eur(c / 100)} − ${eur(k / 100)} = <b>${eur((c - k) / 100)}</b>.`) };
    }
    const f = r.int(1, 3);
    if (f < 3) {
      const up = f === 1, A = r.pick([20, 25, 40, 50, 80, 120, 150, 200, 250]), pc = r.pick([4, 5, 8, 10, 12, 15, 20, 25, 30]), d = A * pc / 100; if (d !== Math.round(d)) throw RETRY;
      const B = up ? A + d : A - d, what = r.pick([['Het aantal leden van een vereniging', 'leden'], ['Het aantal leerlingen in de bovenbouw', 'leerlingen'], ['De prijs van een abonnement', 'euro']]);
      return { type: 'num', unit: '%', q: p(`${what[0]} gaat van ${A} naar ${B}${what[1] === 'euro' ? ' euro' : ''}.`) + ask(`Met hoeveel procent is dat ${up ? 'gestegen' : 'gedaald'}?`), ans: pc, expl: steps(`Het verschil is ${Math.abs(B - A)}.`, `Vergelijk met het oude getal: ${Math.abs(B - A)} van de ${A}.`, `${Math.abs(B - A)} : ${A} × 100 = <b>${pc}</b>%.`) + tip('Je deelt altijd door het oude getal, niet door het nieuwe.') };
    }
    const pc = r.pick([10, 20, 25, 40]), old = 20 * r.int(2, 15), N = old * (100 - pc) / 100;
    return { type: 'num', pre: '€', q: p(`Na ${pc}% korting kost een ${it} nog ${eur(N)}.`) + ask('Wat was de oude prijs?'), ans: old, expl: steps(`Na ${pc}% korting betaal je nog ${100 - pc}% van de oude prijs.`, `${100 - pc}% is ${eur(N)}, dus 1% is ${eur(N)} : ${100 - pc} = ${eur(N / (100 - pc))}.`, `100% is <b>${eur(old)}</b>.`) + tip(`${pc}% van ${eur(N)} erbij optellen geeft een verkeerd antwoord: de korting is berekend over de oude prijs.`) };
  });

  def('BH12', 'B', 'H', 'B.6', 'Een deel van een geheel', (L, r) => {
    if (L === 1) { const b = r.pick([3, 4, 5, 6, 8, 10]), a = proper(r, b), u = r.pick([10, 15, 20, 30, 40, 50, 60, 90]), N = b * u; return { type: 'num', q: p(`Hoeveel is ${fr(a, b)} deel van ${nf(N)}?`), ans: a * u, expl: steps(`${fr(1, b)} deel van ${nf(N)} is ${nf(N)} : ${b} = ${u}.`, `${fr(a, b)} deel is ${a} × ${u} = <b>${nf(a * u)}</b>.`) }; }
    if (L === 2) {
      if (r.chance(0.5)) { const k = r.pick([4, 5, 8, 20, 25]), u = r.pick([30, 60, 90, 120, 150, 300]), N = k * u; return { type: 'num', unit: 'leerlingen', q: p(`Op een school met ${nf(N)} leerlingen komt 1 op de ${k} leerlingen lopend naar school.`) + ask('Hoeveel leerlingen zijn dat?'), ans: u, expl: steps(`1 op de ${k} is hetzelfde als ${fr(1, k)} deel.`, `${nf(N)} : ${k} = <b>${nf(u)}</b> leerlingen.`) }; }
      const b = r.pick([3, 4, 5, 6, 8]), a = proper(r, b), u = r.int(6, 30); if (a === 1) throw RETRY;
      return { type: 'num', q: p(`${fr(a, b)} deel van een getal is ${a * u}.`) + ask('Welk getal is dat?'), ans: b * u, expl: steps(`${a} delen zijn samen ${a * u}, dus één deel is ${a * u} : ${a} = ${u}.`, `Het hele getal bestaat uit ${b} delen: ${b} × ${u} = <b>${nf(b * u)}</b>.`) };
    }
    const f = r.int(1, 3);
    if (f === 1) { const b = r.pick([5, 6, 8]), a = proper(r, b), u = r.int(3, 5); if (a === 1) throw RETRY; return { type: 'num', unit: 'leerlingen', q: p(`In een klas draagt ${fr(a, b)} deel van de leerlingen een bril. Dat zijn ${a * u} leerlingen.`) + ask('Hoeveel leerlingen zitten er in de klas?'), ans: b * u, expl: steps(`${a} delen zijn ${a * u} leerlingen, dus één deel is ${u} leerlingen.`, `De hele klas is ${b} delen: ${b} × ${u} = <b>${b * u}</b> leerlingen.`) }; }
    if (f === 2) { const b = r.pick([4, 5, 6, 8]), a = proper(r, b), u = r.pick([5, 15, 25, 35, 45]); if (b - a === 1 && a === 1) throw RETRY; return { type: 'num', pre: '€', q: p(`${nm(r)} heeft ${fr(a, b)} deel van het zakgeld uitgegeven. Er is nog ${eur((b - a) * u)} over.`) + ask('Hoeveel zakgeld was er aan het begin?'), ans: b * u, expl: steps(`Er is nog ${fr(b - a, b)} deel over. Dat is ${eur((b - a) * u)}.`, b - a === 1 ? `Eén deel is dus ${eur(u)}.` : `Eén deel is ${eur((b - a) * u)} : ${b - a} = ${eur(u)}.`, `Het hele bedrag is ${b} × ${eur(u)} = <b>${eur(b * u)}</b>.`) + tip('Het bedrag dat over is, hoort bij het deel dat niet is uitgegeven.') }; }
    const [a, b] = r.pick([[2, 3], [3, 4], [1, 2], [3, 5]]), [c, d] = r.pick([[3, 4], [1, 2], [2, 5], [5, 6], [1, 3]]), N = b * d * r.pick([10, 20, 30]); if (a === c && b === d) throw RETRY;
    const mid = N / d * c, ans = mid / b * a;
    return { type: 'num', q: p(`Hoeveel is ${fr(a, b)} deel van ${fr(c, d)} deel van ${nf(N)}?`), ans, expl: steps(`Eerst ${fr(c, d)} deel van ${nf(N)}: ${nf(N)} : ${d} × ${c} = ${nf(mid)}.`, `Dan ${fr(a, b)} deel van ${nf(mid)}: ${nf(mid)} : ${b} × ${a} = <b>${nf(ans)}</b>.`) };
  });

  def('BH13', 'B', 'H', 'B.6', 'Gelijkwaardige breuken en vereenvoudigen', (L, r) => {
    if (L === 1) { const b = r.int(2, 9), a = proper(r, b), k = r.int(2, 6); return { type: 'num', q: p('Welk getal hoort op de puntjes?') + som(`${fr(a, b)} = ${fr(gap, b * k)}`), ans: a * k, expl: steps(`De noemer is ${k} keer zo groot geworden: ${b} × ${k} = ${b * k}.`, `De teller wordt dan ook ${k} keer zo groot: ${a} × ${k} = <b>${a * k}</b>.`) }; }
    if (L === 2) {
      const b = r.int(3, 9), a = proper(r, b);
      if (r.chance(0.5)) { const k = r.pick([4, 6, 8, 10, 12, 15, 20, 30]), n = a * k, d = b * k, h = [2, 3, 5].find(x => k % x === 0 && k / x > 1); const wr = [h ? fr(n / h, d / h) : null, fr(a, b + 1), fr(a + 1, b), fr(a, b - 1 > a ? b - 1 : b + 2)];
        return Object.assign(mcTxt(r, fr(a, b), wr), { q: p(`Vereenvoudig ${fr(n, d)} zo ver mogelijk.`), expl: steps(`Deel teller en noemer door hetzelfde getal, zo groot mogelijk. Hier is dat ${k}.`, `${n} : ${k} = ${a} en ${d} : ${k} = ${b}.`, `De breuk wordt <b>${fr(a, b)}</b>.`) + (h ? tip(`${fr(n / h, d / h)} is wel gelijk aan ${fr(n, d)}, maar kan nog verder vereenvoudigd worden.`) : '') }); }
      const k = r.int(3, 9); return { type: 'num', q: p('Welk getal hoort op de puntjes?') + som(`${fr(a * k, b * k)} = ${fr(a, gap)}`), ans: b, expl: steps(`De teller is gedeeld door ${k}: ${a * k} : ${k} = ${a}.`, `Deel de noemer ook door ${k}: ${b * k} : ${k} = <b>${b}</b>.`) };
    }
    const b = r.int(3, 9), a = proper(r, b);
    if (r.chance(0.5)) {
      const ks = r.sample([2, 3, 4, 5, 6, 8, 10, 20, 25], 3), eq = ks.map(k => fr(a * k, b * k)), kk = r.pick([3, 4, 5, 6, 7]), bad = r.chance(0.5) ? fr(a * kk, b * (kk + 1)) : fr(a * kk + 1, b * kk);
      return Object.assign(mcTxt(r, bad, eq), { q: p(`Welke breuk is <b>niet</b> gelijk aan ${fr(a, b)}?`), expl: steps(`Een breuk blijft gelijk als je teller en noemer met hetzelfde getal vermenigvuldigt.`, `Bij ${eq.join(', ')} is dat zo.`, `Bij <b>${bad}</b> zijn teller en noemer niet met hetzelfde getal vermenigvuldigd.`) });
    }
    const k = r.pick([12, 15, 16, 18, 24, 25]); return { type: 'num', q: p('Welk getal hoort op de puntjes?') + som(`${fr(a * k, b * k)} = ${fr(gap, b)}`), ans: a, expl: steps(`De noemer is gedeeld door ${k}: ${b * k} : ${k} = ${b}.`, `Deel de teller ook door ${k}: ${a * k} : ${k} = <b>${a}</b>.`) };
  });

  def('BH14', 'B', 'H', 'B.4', 'Kommagetallen op de getallenlijn', (L, r) => {
    let o, ans, why;
    if (L === 1) { const n = r.int(0, 9), k = r.pick([1, 2, 3, 4, 6, 7, 8, 9]); o = { min: n, max: n + 1, major: 1, minor: 0.1, arrow: n + k / 10 }; ans = n + k / 10; why = `Tussen ${n} en ${n + 1} staan 10 gelijke stapjes. Elk stapje is 0,1.` + `|De pijl staat ${k === 1 ? '1 stapje' : k + ' stapjes'} na ${n}.`; }
    else if (L === 2) { const a = r.int(11, 89) / 10, k = r.pick([1, 2, 3, 4, 6, 7, 8, 9]); o = { min: a, max: rnd(a + 0.1, 2), major: 0.1, minor: 0.01, arrow: rnd(a + k / 100, 3) }; ans = rnd(a + k / 100, 2); why = `Tussen ${nf(a)} en ${nf(a + 0.1)} staan 10 gelijke stapjes. Elk stapje is 0,01.` + `|De pijl staat ${k === 1 ? '1 stapje' : k + ' stapjes'} na ${nf(a)}.`; }
    else if (r.chance(0.5)) { const n = r.int(0, 4), k = r.pick([1, 3, 5, 7]); o = { min: n, max: n + 1, major: 1, minor: 0.125, arrow: n + k / 8 }; ans = n + k / 8; why = `Tussen ${n} en ${n + 1} staan 8 gelijke stapjes. Elk stapje is 1 : 8 = 0,125.` + `|De pijl staat ${k === 1 ? '1 stapje' : k + ' stapjes'} na ${n}: ${k} × 0,125 = ${nf(k / 8)}.`; }
    else { const a = r.int(111, 989) / 100, k = r.pick([1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19]); o = { min: a, max: rnd(a + 0.02, 2), major: 0.01, minor: 0.001, arrow: rnd(a + k / 1000, 3) }; ans = rnd(a + k / 1000, 3); why = `Tussen twee streepjes met een getal staan 10 gelijke stapjes. Elk stapje is 0,001.` + `|De pijl staat ${k === 1 ? '1 stapje' : k + ' stapjes'} na ${nf(a)}.`; }
    const w = why.split('|');
    return { type: 'num', q: p('Welk getal hoort bij de pijl? Schrijf het als kommagetal.'), fig: F.nline(o), ans, expl: steps(w[0], w[1], `Bij de pijl hoort <b>${nf(ans)}</b>.`) };
  });

  def('BH15', 'B', 'H', 'B.9', 'Breuken, procenten en kommagetallen door elkaar', (L, r) => {
    const nice = (x, d) => Math.abs(x - rnd(x, d)) < 1e-9;
    if (L === 1) {
      const [a, b] = r.pick([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10]]), dv = r.pick([0.1, 0.2, 0.25, 0.3, 0.5, 0.05, 0.15]), sub = r.chance(0.5), fv = a / b, ans = rnd(sub ? fv - dv : fv + dv, 4);
      if (ans <= 0 || !nice(ans, 2)) throw RETRY;
      return { type: 'num', q: p('Reken uit. Schrijf de uitkomst als kommagetal.') + som(`${fr(a, b)} ${sub ? '−' : '+'} ${nf(dv)} =`), ans, expl: steps(`Schrijf de breuk als kommagetal: ${fr(a, b)} = ${nf(fv)}.`, `${nf(fv)} ${sub ? '−' : '+'} ${nf(dv)} = <b>${nf(ans)}</b>.`) };
    }
    if (L === 2) {
      const f = r.int(1, 3);
      if (f === 1) { const w = r.int(1, 4), [a, b] = r.pick([[1, 2], [1, 4], [3, 4]]), dv = r.pick([0.25, 0.5, 0.05]), v = w + a / b, ans = rnd(v / dv, 4); if (!nice(ans, 0)) throw RETRY; return { type: 'num', q: p('Reken uit.') + som(`${mixed(w, a, b)} : ${nf(dv)} =`), ans, expl: steps(`Schrijf het gemengde getal als kommagetal: ${mixed(w, a, b)} = ${nf(v)}.`, `Vermenigvuldig beide getallen met 100: ${nf(v * 100)} : ${nf(dv * 100)}.`, `${nf(v * 100)} : ${nf(dv * 100)} = <b>${nf(ans)}</b>.`) }; }
      if (f === 2) { const dv = r.pick([0.6, 0.75, 0.8, 0.9, 1.2, 1.5, 2.4]), [a, b] = r.pick([[1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [1, 2], [5, 6]]), ans = rnd(dv * a / b, 6); if (!nice(ans, 2)) throw RETRY; return { type: 'num', q: p('Reken uit. Schrijf de uitkomst als kommagetal.') + som(`${nf(dv)} × ${fr(a, b)} =`), ans, expl: a === 1 ? steps(`${fr(1, b)} deel nemen is delen door ${b}.`, `${nf(dv)} : ${b} = <b>${nf(ans)}</b>.`) : steps(`Neem eerst ${fr(1, b)} deel: ${nf(dv)} : ${b} = ${f6(dv / b)}.`, `Dan keer ${a}: <b>${nf(ans)}</b>.`) }; }
      const pc = r.pick([20, 25, 50, 10, 40]), [a, b] = r.pick([[3, 4], [1, 5], [4, 5], [1, 2], [2, 5], [3, 5]]), ans = rnd(pc / 100 * a / b, 6); if (!nice(ans, 2)) throw RETRY;
      return { type: 'num', q: p(`Hoeveel is ${pc}% van ${fr(a, b)}? Schrijf de uitkomst als kommagetal.`), ans, expl: steps(`Schrijf de breuk als kommagetal: ${fr(a, b)} = ${nf(a / b)}.`, `${pc}% van ${nf(a / b)} is ${nf(a / b)} × ${nf(pc / 100)} = <b>${nf(ans)}</b>.`) };
    }
    const f = r.int(1, 3);
    if (f === 1) { const w = r.int(1, 3), [a, b] = r.pick([[1, 4], [3, 4], [1, 2], [2, 5], [4, 5]]), dv = r.pick([0.05, 0.25, 0.125, 0.2]), v = w + a / b, ans = rnd(v / dv, 4); if (!nice(ans, 0)) throw RETRY; return { type: 'num', q: p('Reken uit.') + som(`${mixed(w, a, b)} : ${nf(dv)} =`), ans, expl: steps(`Schrijf het gemengde getal als kommagetal: ${mixed(w, a, b)} = ${nf(v)}.`, `Vermenigvuldig beide getallen met 1.000: ${nf(v * 1000)} : ${nf(dv * 1000)}.`, `${nf(v * 1000)} : ${nf(dv * 1000)} = <b>${nf(ans)}</b>.`) }; }
    if (f === 2) { const k = r.pick([1, 3, 5, 7]), dv = r.pick([0.125, 0.25, 0.375, 0.5]), sub = r.chance(0.5), ans = rnd(sub ? k / 8 - dv : k / 8 + dv, 4); if (ans <= 0) throw RETRY; return { type: 'num', q: p('Reken uit. Schrijf de uitkomst als kommagetal.') + som(`${fr(k, 8)} ${sub ? '−' : '+'} ${nf(dv)} =`), ans, expl: steps(k === 1 ? `${fr(1, 8)} = 0,125.` : `${fr(1, 8)} = 0,125, dus ${fr(k, 8)} = ${k} × 0,125 = ${nf(k / 8)}.`, `${nf(k / 8)} ${sub ? '−' : '+'} ${nf(dv)} = <b>${nf(ans)}</b>.`) }; }
    const pc = r.pick([20, 25, 40, 50, 75, 12.5]), w = r.int(1, 4), [a, b] = r.pick([[1, 2], [1, 5], [2, 5], [1, 4], [3, 5]]), v = w + a / b, ans = rnd(pc / 100 * v, 6); if (!nice(ans, 2)) throw RETRY;
    return { type: 'num', q: p(`Hoeveel is ${nf(pc)}% van ${mixed(w, a, b)}? Schrijf de uitkomst als kommagetal.`), ans, expl: steps(`Schrijf het gemengde getal als kommagetal: ${mixed(w, a, b)} = ${nf(v)}.`, `${nf(pc)}% van ${nf(v)} is ${nf(v)} × ${f6(pc / 100)} = <b>${nf(ans)}</b>.`) };
  });

  RWT.kitB = { pctEx: pctEx, tie: tie, proper: proper, f6: f6, mixed: mixed };
})();

;
/* bankB2.js */
/* Domein B · Verhoudingen, procenten, breuken en decimale getallen · niet-hoofdrekenen */
(function () {
  'use strict';
  const { def, nf, eur, en, fr, frs, lcm, rnd, RETRY, steps, tip, p, ask, mcTxt, nm, NB } = RWT.kit;
  const { tie, f6 } = RWT.kitB;
  const C = c => eur(c / 100);
  const whole = x => Math.abs(x - Math.round(x)) < 1e-9;
  const m2 = x => whole(x) ? undefined : 2; // aantal decimalen om een bedrag te tonen

  const RECIPES = [
    ['pannenkoeken', [['bloem', 'g', 250], ['melk', 'ml', 500], ['boter', 'g', 40]]],
    ['appeltaart', [['bloem', 'g', 300], ['boter', 'g', 200], ['suiker', 'g', 150]]],
    ['tomatensoep', [['tomaten', 'g', 800], ['bouillon', 'ml', 600], ['room', 'ml', 120]]],
    ['risotto', [['rijst', 'g', 320], ['bouillon', 'ml', 900], ['kaas', 'g', 80]]],
    ['havermoutpap', [['havermout', 'g', 160], ['melk', 'ml', 800], ['honing', 'g', 40]]]
  ];
  def('BN01', 'B', 'N', 'B.5', 'Recept omrekenen', (L, r) => {
    const [dish, ing] = r.pick(RECIPES), name = nm(r), p0 = L === 1 ? r.pick([2, 4]) : r.pick([4, 6]), [it, u, amt] = ing[r.int(0, 2)];
    const intro = `Een recept voor ${dish} is bedoeld voor ${p0} personen. Je hebt nodig: ${en(ing.map(x => `${nf(x[2])} ${x[1]} ${x[0]}`))}.`, uw = u === 'g' ? 'gram' : 'milliliter';
    if (L === 1) { const k = r.pick([2, 3]), q = p0 * k; return { type: 'num', unit: u, q: p(`${intro} ${name} maakt het recept voor ${q} personen.`) + ask(`Hoeveel ${uw} ${it} is er nodig?`), ans: amt * k, expl: steps(`${q} personen is ${k} keer zoveel als ${p0} personen.`, `${k} × ${nf(amt)} = <b>${nf(amt * k)}</b> ${u} ${it}.`) + tip('De andere ingrediënten heb je voor deze vraag niet nodig.') }; }
    const per = amt / p0;
    if (L === 2) {
      const q = p0 === 4 ? r.pick([6, 10, 14]) : r.pick([9, 15, 21]), fct = q / p0, ans = rnd(amt * fct, 4); if (!whole(ans)) throw RETRY;
      return { type: 'num', unit: u, calc: true, q: p(`${intro} ${name} maakt het recept voor ${q} personen.`) + ask(`Hoeveel ${uw} ${it} is er nodig?`), ans, expl: steps(`${q} : ${p0} = ${nf(fct)}. Het recept moet ${nf(fct)} keer zo groot worden.`, `${nf(fct)} × ${nf(amt)} = <b>${nf(ans)}</b> ${u} ${it}.`) + tip('De andere ingrediënten heb je voor deze vraag niet nodig.') };
    }
    if (Math.abs(per - rnd(per, 1)) > 1e-9) throw RETRY;
    const n = r.int(p0 + 3, 4 * p0), S = rnd(per * n + per * r.pick([0.2, 0.4, 0.6]), 4); if (!whole(S)) throw RETRY;
    return { type: 'num', unit: 'personen', calc: true, q: p(`${intro} ${name} heeft nog ${nf(S)} ${u} ${it} in huis en genoeg van de andere ingrediënten.`) + ask(`Voor hoeveel personen kan ${name} het recept maximaal maken?`), ans: n,
      expl: steps(`Voor 1 persoon: ${nf(amt)} : ${p0} = ${f6(per)} ${u} ${it}.`, `${nf(S)} : ${f6(per)} = ${f6(rnd(S / per, 2))}.`, `Voor een hele persoon extra is er te weinig. Je rondt naar beneden af: <b>${n}</b> personen.`) };
  });

  def('BN02', 'B', 'N', 'B.7', 'Btw en korting', (L, r) => {
    const it = r.pick(['laptop', 'wasmachine', 'fiets', 'bureaustoel', 'televisie', 'koelkast']);
    if (L === 1) { const P = r.pick([50, 100, 150, 200, 250, 300, 400, 500]), b = r.pick([21, 21, 9]), ans = rnd(P * (100 + b) / 100, 2); return { type: 'num', pre: '€', dec: m2(ans), q: p(`Een ${b === 9 ? 'stapel studieboeken' : it} kost ${eur(P)} exclusief btw. Het btw-tarief is ${b}%.`) + ask('Wat is de prijs inclusief btw?'), ans, expl: steps(`De btw is ${b}% van ${eur(P)}: ${eur(P * b / 100)}.`, `${eur(P)} + ${eur(P * b / 100)} = <b>${eur(ans)}</b>.`) }; }
    if (L === 2) { const P = 20 * r.int(12, 60), pc = r.pick([15, 20, 25, 30]), k = r.pick([20, 25, 40, 50]), d = P * pc / 100, ans = P - d - k; return { type: 'num', pre: '€', calc: true, q: p(`Een ${it} kost ${eur(P)}. In de uitverkoop gaat er eerst ${pc}% van de prijs af. Met een kortingsbon krijg je daarna nog ${eur(k)} korting.`) + ask('Hoeveel betaal je?'), ans, expl: steps(`${pc}% van ${eur(P)} is ${eur(d)}.`, `${eur(P)} − ${eur(d)} = ${eur(P - d)}.`, `Daarna gaat de bon eraf: ${eur(P - d)} − ${eur(k)} = <b>${eur(ans)}</b>.`) + tip('De volgorde is belangrijk: eerst het percentage over de volle prijs, daarna het vaste bedrag.') }; }
    const P = 50 * r.int(4, 24), pc = r.pick([5, 10, 15, 20]), after = P * (100 - pc) / 100, v = after * 1.21; if (tie(v, 2)) throw RETRY; const ans = rnd(v, 2);
    return { type: 'num', pre: '€', dec: 2, calc: true, q: p(`Een bedrijf koopt een ${it} van ${eur(P)} exclusief btw. De leverancier geeft ${pc}% korting op de prijs exclusief btw. Daarna komt er 21% btw bij.`) + ask('Hoeveel betaalt het bedrijf? Rond af op hele centen.'), ans,
      expl: steps(`Na ${pc}% korting: ${eur(P)} × ${nf((100 - pc) / 100)} = ${eur(after)}.`, `Met 21% btw: ${eur(after)} × 1,21 = ${f6(v)}.`, `Afgerond op hele centen: <b>${eur(ans)}</b>.`) };
  });

  def('BN03', 'B', 'N', 'B.7', 'Terugrekenen naar 100%', (L, r) => {
    const it = r.pick(['jas', 'bank', 'fiets', 'tent', 'koffer', 'bureau']);
    if (L === 1) {
      const pc = r.pick([10, 20, 25, 50]), orig = 20 * r.int(10, 40), N = orig * (100 + pc) / 100, [pr, u] = r.pick([['fles shampoo', 'ml'], ['pak wasmiddel', 'g'], ['zak chips', 'g'], ['fles frisdrank', 'ml']]);
      return { type: 'num', unit: u, q: p(`Op een ${pr} staat: “Nu ${pc}% extra!” De verpakking bevat nu ${nf(N)} ${u}.`) + ask(`Hoeveel ${u === 'g' ? 'gram' : 'milliliter'} zit er in de gewone verpakking?`), ans: orig,
        expl: steps(`De nieuwe inhoud is 100% + ${pc}% = ${100 + pc}% van de gewone inhoud.`, `${100 + pc}% is ${nf(N)} ${u}, dus 1% is ${nf(N)} : ${100 + pc} = ${f6(N / (100 + pc))} ${u}.`, `100% is <b>${nf(orig)}</b> ${u}.`) + tip(`${pc}% van ${nf(N)} afhalen geeft een verkeerd antwoord: de ${pc}% hoort bij de gewone inhoud.`) };
    }
    if (L === 2) {
      if (r.chance(0.5)) { const pc = r.pick([15, 30, 35, 40]), old = 20 * r.int(3, 20), N = old * (100 - pc) / 100; return { type: 'num', pre: '€', calc: true, q: p(`In de uitverkoop krijg je ${pc}% korting op een ${it}. Je betaalt nu ${eur(N)}.`) + ask('Wat was de prijs zonder korting?'), ans: old, expl: steps(`Na ${pc}% korting betaal je nog ${100 - pc}% van de oude prijs.`, `${100 - pc}% is ${eur(N)}, dus 1% is ${eur(N)} : ${100 - pc} = ${f6(N / (100 - pc))} euro.`, `100% is <b>${eur(old)}</b>.`) + tip(`${pc}% van ${eur(N)} erbij optellen geeft een verkeerd antwoord.`) }; }
      const old = r.pick([100, 150, 200, 250, 300, 400, 450, 600]), N = rnd(old * 1.21, 2);
      return { type: 'num', pre: '€', calc: true, q: p(`Een ${it} kost ${eur(N)} inclusief 21% btw.`) + ask('Wat is de prijs exclusief btw?'), ans: old, expl: steps('De prijs inclusief btw is 100% + 21% = 121% van de prijs exclusief btw.', `1% is ${eur(N)} : 121 = ${f6(N / 121)} euro.`, `100% is <b>${eur(old)}</b>.`) + tip(`21% van ${eur(N)} afhalen geeft een verkeerd antwoord: de btw is berekend over de prijs zonder btw.`) };
    }
    const f = r.int(1, 3);
    if (f === 1) { const pc = r.pick([4, 6, 8, 12, 16]), old = 25 * r.int(8, 60), N = old * (100 + pc) / 100; if (!whole(N)) throw RETRY; return { type: 'num', pre: '€', calc: true, q: p(`De huur van een woning is dit jaar met ${pc}% gestegen. De huur is nu ${eur(N)} per maand.`) + ask('Hoe hoog was de huur vorig jaar?'), ans: old, expl: steps(`De nieuwe huur is ${100 + pc}% van de oude huur.`, `${eur(N)} : ${nf((100 + pc) / 100)} = <b>${eur(old)}</b>.`) + tip(`${pc}% van de nieuwe huur afhalen geeft een verkeerd antwoord.`) }; }
    if (f === 2) { const pc = r.pick([12, 15, 20, 24]), old = 100 * r.int(4, 30), N = old * (100 - pc) / 100; return { type: 'num', unit: 'leden', calc: true, q: p(`Een sportclub heeft dit jaar ${nf(N)} leden. Dat is ${pc}% minder dan vorig jaar.`) + ask('Hoeveel leden had de club vorig jaar?'), ans: old, expl: steps(`Dit jaar is ${100 - pc}% van vorig jaar.`, `${nf(N)} : ${nf((100 - pc) / 100)} = <b>${nf(old)}</b> leden.`) + tip(`${pc}% van ${nf(N)} erbij optellen geeft een verkeerd antwoord.`) }; }
    const old = r.pick([500, 1000, 1500, 2000, 3000, 4000]), pc = r.pick([10, 20]), fc = (100 + pc) / 100, mid = old * fc, N = rnd(mid * fc, 2); if (!whole(N)) throw RETRY;
    return { type: 'num', unit: 'bezoekers', calc: true, q: p(`Het aantal bezoekers van een museum steeg vorig jaar met ${pc}% en dit jaar opnieuw met ${pc}%. Dit jaar kwamen er ${nf(N)} bezoekers.`) + ask('Hoeveel bezoekers waren er twee jaar geleden?'), ans: old,
      expl: steps(`Dit jaar is ${100 + pc}% van vorig jaar. Vorig jaar: ${nf(N)} : ${nf(fc)} = ${nf(mid)} bezoekers.`, `Vorig jaar was ook ${100 + pc}% van het jaar ervoor: ${nf(mid)} : ${nf(fc)} = <b>${nf(old)}</b> bezoekers.`) + tip(`Twee keer ${pc}% is samen geen ${2 * pc}%: de tweede stijging gaat over een groter aantal.`) };
  });

  def('BN04', 'B', 'N', 'B.7', 'Procentuele toename en afname', (L, r) => {
    if (L === 1) { const A = r.pick([200, 250, 400, 500, 800, 1200, 1250]), pc = r.pick([4, 6, 8, 12, 14, 16, 24]), B = A * (100 + pc) / 100; return { type: 'num', unit: '%', calc: true, q: p(`Het aantal leerlingen van een school stijgt in één jaar van ${nf(A)} naar ${nf(B)}.`) + ask('Met hoeveel procent is het aantal leerlingen gestegen?'), ans: pc, expl: steps(`De toename is ${nf(B)} − ${nf(A)} = ${nf(B - A)}.`, `${nf(B - A)} : ${nf(A)} × 100 = <b>${pc}</b>%.`) + tip('Je deelt door het oude aantal.') }; }
    if (L === 2) { const A = 1000 * r.pick([24, 36, 48, 60, 75, 80, 120]), pc = r.pick([4, 6, 8, 12, 15, 18]), B = A * (100 - pc) / 100, kl = 100 * r.int(11, 29); return { type: 'num', unit: '%', calc: true, q: p(`Een winkel had vorig jaar een omzet van ${eur(A)}. Dit jaar is de omzet ${eur(B)}. Het aantal klanten bleef ongeveer ${nf(kl)}.`) + ask('Met hoeveel procent is de omzet gedaald?'), ans: pc, expl: steps(`De afname is ${eur(A)} − ${eur(B)} = ${eur(A - B)}.`, `${nf(A - B)} : ${nf(A)} × 100 = <b>${pc}</b>%.`) + tip('Het aantal klanten heb je niet nodig. Je deelt door de omzet van vorig jaar.') }; }
    if (r.chance(0.5)) {
      const pc = r.pick([10, 20, 30, 50]), up = 100 + pc, dn = up * pc / 100, fin = up - dn, ans = 100 - fin;
      return { type: 'num', unit: '%', calc: true, q: p(`De prijs van een product gaat eerst ${pc}% omhoog. Daarna gaat de nieuwe prijs weer ${pc}% omlaag.`) + ask('Hoeveel procent is de prijs nu lager dan aan het begin?'), ans,
        expl: steps('Neem als voorbeeld een beginprijs van € 100.', `Na de stijging: ${eur(up)}.`, `${pc}% van ${eur(up)} is ${eur(dn)}. Na de daling: ${eur(fin)}.`, `Dat is ${eur(ans)} minder dan ${eur(100)}, dus <b>${ans}</b>% lager.`) + tip('De daling wordt berekend over een hoger bedrag dan de stijging. Daarom kom je niet op de beginprijs uit.') };
    }
    const A = r.pick([400, 500, 800, 1200]), p1 = r.pick([5, 10, 15]), pc = r.pick([20, 25, 30, 35, 45]), B = A * (100 + p1) / 100, Cn = A * (100 + pc) / 100;
    return { type: 'num', unit: '%', calc: true, q: p(`Een vereniging had in 2022 ${nf(A)} leden, in 2023 ${nf(B)} leden en in 2024 ${nf(Cn)} leden.`) + ask('Hoeveel procent meer leden had de vereniging in 2024 dan in 2022?'), ans: pc,
      expl: steps(`Vergelijk 2024 met 2022: ${nf(Cn)} − ${nf(A)} = ${nf(Cn - A)} leden meer.`, `${nf(Cn - A)} : ${nf(A)} × 100 = <b>${pc}</b>%.`) + tip('Het aantal van 2023 heb je niet nodig. Je deelt door het aantal van 2022.') };
  });

  def('BN05', 'B', 'N', 'B.5', 'Brandstofverbruik en kosten', (L, r) => {
    const name = nm(r), pr = r.pick([179, 185, 189, 195, 199, 205, 209]) / 100;
    if (L < 3) {
      const k = r.pick([12, 15, 16, 18, 20]), half = r.int(20, 70), D = k * half / 2, lit = half / 2; if (!whole(D)) throw RETRY;
      const base = `De auto van ${name} rijdt 1 op ${k}. Dat betekent: op 1 liter benzine rijdt de auto ${k} kilometer.`;
      if (L === 1) return { type: 'num', unit: 'liter', q: p(base) + ask(`Hoeveel liter benzine is er nodig voor een rit van ${nf(D)} km?`), ans: lit, expl: steps(`Elke ${k} km kost 1 liter.`, `${nf(D)} : ${k} = <b>${nf(lit)}</b> liter.`) };
      const cost = lit * pr; if (tie(cost, 2)) throw RETRY; const ans = rnd(cost, 2);
      return { type: 'num', pre: '€', dec: 2, calc: true, q: p(`${base} ${name} maakt een rit van ${nf(D)} km. Benzine kost ${eur(pr)} per liter.`) + ask('Hoeveel kost de benzine voor deze rit? Rond af op hele centen.'), ans, expl: steps(`${nf(D)} : ${k} = ${nf(lit)} liter.`, `${nf(lit)} × ${eur(pr)} = ${f6(cost)}.`, `Afgerond op hele centen: <b>${eur(ans)}</b>.`) };
    }
    const c = r.pick([4.8, 5.2, 5.6, 6.4, 7.5]), D = 10 * r.int(8, 42), lit = rnd(2 * D * c / 100, 4), cost = lit * pr; if (tie(cost, 2)) throw RETRY; const ans = rnd(cost, 2);
    return { type: 'num', pre: '€', dec: 2, calc: true, q: p(`De auto van ${name} verbruikt gemiddeld ${nf(c)} liter benzine per 100 km. ${name} rijdt naar een stad die ${nf(D)} km verderop ligt en rijdt dezelfde dag weer terug. Benzine kost ${eur(pr)} per liter.`) + ask('Hoeveel kost de benzine voor de hele dag? Rond af op hele centen.'), ans,
      expl: steps(`Heen en terug is 2 × ${nf(D)} = ${nf(2 * D)} km.`, `Verbruik: ${nf(2 * D)} : 100 × ${nf(c)} = ${f6(lit)} liter.`, `${f6(lit)} × ${eur(pr)} = ${f6(cost)}, afgerond <b>${eur(ans)}</b>.`) + tip('Vergeet de terugweg niet.') };
  });

  def('BN06', 'B', 'N', 'B.5', 'Verdelen in een verhouding', (L, r) => {
    const [n1, n2, n3] = nm(r, 3);
    if (L === 1) { const [a, b] = r.pick([[1, 2], [2, 3], [1, 3], [3, 4], [2, 5], [3, 5]]), u = r.pick([15, 20, 25, 40, 50, 60, 80]), T = (a + b) * u; return { type: 'num', pre: '€', q: p(`${n1} en ${n2} verdienen samen ${eur(T)} met oppassen. Ze verdelen het geld in de verhouding ${a} : ${b}, omdat ${n2} vaker heeft opgepast.`) + ask(`Hoeveel euro krijgt ${n2}?`), ans: b * u, expl: steps(`Er zijn ${a} + ${b} = ${a + b} delen.`, `Eén deel is ${eur(T)} : ${a + b} = ${eur(u)}.`, `${n2} krijgt het grootste deel: ${b} × ${eur(u)} = <b>${eur(b * u)}</b>.`) }; }
    if (L === 2) {
      const v = r.sample([2, 3, 4, 5, 6, 7], 3), s = v[0] + v[1] + v[2], u = r.pick([100, 150, 200, 250, 300, 400, 500]), T = s * u, w = r.int(0, 2), who = [n1, n2, n3][w];
      return { type: 'num', pre: '€', q: p(`Drie vrienden kopen samen een lot van ${eur(s)}. ${n1} betaalt ${eur(v[0])}, ${n2} betaalt ${eur(v[1])} en ${n3} betaalt ${eur(v[2])}. Ze winnen een prijs van ${eur(T)} en verdelen die in dezelfde verhouding als hun inleg.`) + ask(`Hoeveel euro krijgt ${who}?`), ans: v[w] * u,
        expl: steps(`Samen hebben ze ${v[0]} + ${v[1]} + ${v[2]} = ${s} euro ingelegd.`, `Per ingelegde euro krijgen ze ${eur(T)} : ${s} = ${eur(u)}.`, `${who} legde ${eur(v[w])} in: ${v[w]} × ${eur(u)} = <b>${eur(v[w] * u)}</b>.`) };
    }
    const [a, b, c] = r.pick([[3, 2, 1], [5, 3, 2], [4, 3, 1], [5, 4, 3], [7, 5, 3], [6, 4, 1]]), u = r.pick([1500, 2500, 4250, 3200, 6000]), D = (a - c) * u, T = (a + b + c) * u;
    return { type: 'num', pre: '€', q: p(`Een erfenis wordt verdeeld over drie kinderen in de verhouding ${a} : ${b} : ${c}. Het kind met het grootste deel krijgt ${eur(D)} meer dan het kind met het kleinste deel.`) + ask('Hoe groot is de hele erfenis?'), ans: T,
      expl: steps(`Het verschil tussen het grootste en het kleinste deel is ${a} − ${c} = ${a - c} delen.`, `${a - c} delen zijn ${eur(D)}, dus één deel is ${eur(u)}.`, `De erfenis bestaat uit ${a} + ${b} + ${c} = ${a + b + c} delen: ${a + b + c} × ${eur(u)} = <b>${eur(T)}</b>.`) };
  });

  def('BN07', 'B', 'N', 'B.7', 'Promille', (L, r) => {
    if (L < 3) {
      const pm = L === 1 ? r.pick([2, 3, 4, 5, 8]) : r.pick([1.5, 2.5, 0.5, 3.5, 0.25]), N = L === 1 ? 1000 * r.pick([25, 40, 60, 120, 250, 550, 800]) : 4000 * r.int(5, 60), ans = rnd(N * pm / 1000, 4);
      const [t, qq, u] = r.pick([[`In een stad met ${nf(N)} inwoners is ${nf(pm)} promille van de inwoners lid van de schaakvereniging.`, 'Hoeveel inwoners zijn dat?', 'inwoners'], [`Een fabriek maakt ${nf(N)} lampen per maand. Daarvan is ${nf(pm)} promille kapot.`, 'Hoeveel lampen zijn dat?', 'lampen'], [`Van de ${nf(N)} pakketten die een bezorger dit jaar verstuurt, raakt ${nf(pm)} promille zoek.`, 'Hoeveel pakketten zijn dat?', 'pakketten']]);
      return { type: 'num', unit: u, q: p(t) + ask(qq), ans, expl: steps('Promille betekent: per duizend.', `1 promille van ${nf(N)} is ${nf(N)} : 1.000 = ${nf(N / 1000)}.`, `${nf(pm)} promille is ${nf(pm)} × ${nf(N / 1000)} = <b>${nf(ans)}</b> ${u}.`) };
    }
    if (r.chance(0.6)) {
      const [k, N] = r.pick([[12, 8000], [45, 18000], [9, 6000], [140, 40000], [33, 22000], [27, 4500], [36, 48000], [21, 6000], [130, 52000]]), ans = rnd(k / N * 1000, 4);
      return { type: 'num', unit: '‰', calc: true, q: p(`Bij een controle blijken ${k} van de ${nf(N)} producten niet goed te zijn.`) + ask('Hoeveel promille is dat?'), ans, expl: steps(`Deel het deel door het geheel: ${k} : ${nf(N)} = ${f6(k / N)}.`, `Vermenigvuldig met 1.000: <b>${nf(ans)}</b> promille.`) + tip('Voor procent vermenigvuldig je met 100, voor promille met 1.000.') };
    }
    const pm = r.pick([0.5, 0.2, 0.8, 1.5, 2.5, 5]), ans = rnd(pm / 10, 4);
    return { type: 'num', unit: '%', q: p(`In een verslag staat dat ${nf(pm)} promille van de leerlingen een zeldzame allergie heeft.`) + ask('Hoeveel procent is dat?'), ans, expl: steps('1 procent is 10 promille.', `${nf(pm)} : 10 = <b>${nf(ans)}</b>%.`) };
  });

  def('BN08', 'B', 'N', 'B.6', 'Breuken in een verhaal', (L, r) => {
    const [n1, n2] = nm(r, 2), st = n => n === 1 ? '1 stuk' : n + ' stukken';
    if (L === 1) {
      const b = r.pick([6, 8, 10, 12]), a1 = r.int(1, 3), a2 = r.int(1, 3), rest = b - a1 - a2, good = frs(rest, b);
      return Object.assign(mcTxt(r, good, [frs(a1 + a2, b), frs(rest + 1, b), frs(b - a1, b), frs(rest - 1 || 1, b)]), { q: p(`Een taart is in ${b} gelijke stukken gesneden. ${n1} eet ${st(a1)} en ${n2} eet ${st(a2)}.`) + ask('Welk deel van de taart is er nog over?'),
        expl: steps(`Samen eten ze ${a1} + ${a2} = ${a1 + a2} stukken.`, `${b} − ${a1 + a2} = ${rest}. Er ${rest === 1 ? 'blijft 1 stuk' : 'blijven ' + rest + ' stukken'} over. Dat is ${fr(rest, b)} deel.`, good === fr(rest, b) ? `Het antwoord is <b>${good}</b>.` : `Vereenvoudig: <b>${good}</b>.`) });
    }
    if (L === 2) {
      const P = r.pick([12, 18, 24]), [f1, f2] = r.sample([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 6], [5, 6]], 2), c1 = P * f1[0] / f1[1], c2 = P * f2[0] / f2[1]; if (!whole(c1) || !whole(c2)) throw RETRY;
      return { type: 'num', pre: '€', dec: m2(c1 + c2), q: p(`Bij de bakker kost een hele vlaai ${eur(P)}. Je kunt ook een deel van een vlaai kopen. Je betaalt dan naar verhouding. ${n1} koopt ${fr(f1[0], f1[1])} kersenvlaai en ${n2} koopt ${fr(f2[0], f2[1])} appelvlaai.`) + ask('Hoeveel euro betalen ze samen?'), ans: c1 + c2,
        expl: steps(`${fr(f1[0], f1[1])} van ${eur(P)} is ${eur(P)} : ${f1[1]} × ${f1[0]} = ${eur(c1)}.`, `${fr(f2[0], f2[1])} van ${eur(P)} is ${eur(P)} : ${f2[1]} × ${f2[0]} = ${eur(c2)}.`, `Samen: <b>${eur(c1 + c2)}</b>.`) };
    }
    const [[a, b], [c, d]] = r.pick([[[2, 5], [1, 3]], [[1, 2], [1, 3]], [[3, 8], [1, 4]], [[1, 4], [3, 5]], [[2, 3], [1, 5]], [[1, 2], [3, 10]], [[3, 5], [1, 4]], [[1, 3], [1, 4]]]);
    const l = lcm(b, d), n = l - a * l / b - c * l / d, u = r.int(Math.ceil(120 / l), Math.floor(600 / l)), R = n * u;
    return { type: 'num', unit: 'leerlingen', q: p(`Op een basisschool komt ${fr(a, b)} deel van de leerlingen met de fiets en ${fr(c, d)} deel komt lopend. De overige ${R} leerlingen worden met de auto gebracht.`) + ask('Hoeveel leerlingen telt de school?'), ans: l * u,
      expl: steps(`Fiets en lopend samen: ${fr(a, b)} + ${fr(c, d)} = ${fr(a * l / b, l)} + ${fr(c * l / d, l)} = ${fr(l - n, l)}.`, `Er blijft ${fr(n, l)} deel over. Dat zijn ${R} leerlingen.`, n === 1 ? `${fr(1, l)} deel is dus ${u} leerlingen.` : `${fr(1, l)} deel is ${R} : ${n} = ${u} leerlingen.`, `De hele school: ${l} × ${u} = <b>${l * u}</b> leerlingen.`) };
  });

  const DEALS = [['3 halen, 2 betalen', 100 / 3, 'je betaalt 2 van de 3 flessen. Dat is 33,3% korting'], ['2e fles voor de halve prijs', 25, 'voor 2 flessen betaal je 1,5 keer de prijs. Dat is 25% korting'], ['30% korting', 30, ''], ['35% korting', 35, ''], ['40% korting', 40, ''], ['5 halen, 4 betalen', 20, 'je betaalt 4 van de 5 flessen. Dat is 20% korting'], ['2 halen, 1 betalen', 50, 'je betaalt 1 van de 2 flessen. Dat is 50% korting'], ['28% korting', 28, '']];
  def('BN09', 'B', 'N', 'B.3', 'Prijs per eenheid en aanbiedingen', (L, r) => {
    const prod = r.pick(['koffie', 'muesli', 'rijst', 'waspoeder', 'kattenvoer', 'thee']), w = r.pick([250, 400, 500, 750, 800]);
    if (L === 1) { const pk = 40 * r.int(8, 32), price = pk * w / 1000; return { type: 'num', pre: '€', dec: 2, calc: true, q: p(`Een pak ${prod} van ${w} gram kost ${C(price)}.`) + ask('Wat is de prijs per kilogram?'), ans: pk / 100, expl: steps('1 kilogram is 1.000 gram.', `${C(price)} : ${w} × 1.000 = <b>${C(pk)}</b> per kilogram.`) }; }
    if (L === 2) {
      const pkA = 40 * r.int(10, 32), diff = 20 * r.int(1, 6), pkB = pkA - diff, wB = r.pick([1.2, 1.5, 2, 2.5]), prA = pkA * w / 1000, prB = Math.round(pkB * wB);
      return { type: 'num', pre: '€', dec: 2, calc: true, q: p(`Pak A bevat ${w} gram ${prod} en kost ${C(prA)}. Pak B bevat ${nf(wB)} kilogram ${prod} en kost ${C(prB)}.`) + ask('Hoeveel euro is pak B per kilogram goedkoper dan pak A?'), ans: diff / 100,
        expl: steps(`Pak A per kilogram: ${C(prA)} : ${w} × 1.000 = ${C(pkA)}.`, `Pak B per kilogram: ${C(prB)} : ${nf(wB)} = ${C(pkB)}.`, `Verschil: ${C(pkA)} − ${C(pkB)} = <b>${C(diff)}</b>.`) + tip('Vergelijk altijd dezelfde hoeveelheid, hier 1 kilogram.') };
    }
    const ds = r.sample(DEALS, 4), vals = ds.map(d => Math.round(d[1]));
    if (new Set(vals).size < 4) throw RETRY;
    const best = ds.slice().sort((x, y) => y[1] - x[1])[0];
    return Object.assign(mcTxt(r, best[0], ds.filter(d => d !== best).map(d => d[0])), { q: p('Vier winkels verkopen dezelfde fles shampoo voor dezelfde prijs. Elke winkel heeft een andere aanbieding. Je koopt precies zoveel flessen als voor de aanbieding nodig is.') + ask('Bij welke aanbieding betaal je per fles het minst?'),
      expl: steps.apply(null, ['Reken elke aanbieding om naar een percentage korting per fles.'].concat(ds.filter(d => d[2]).map(d => `${d[0]}: ${d[2]}.`), [`De grootste korting krijg je bij <b>${best[0]}</b>.`])) });
  });

  def('BN10', 'B', 'N', 'B.10', 'Vergroten en verkleinen met een percentage', (L, r) => {
    const w = r.pick([8, 10, 12, 15, 16, 20]), h = w + r.pick([2, 4, 5, 6, 8, 10]);
    if (L === 1) { const pc = r.pick([150, 200, 50, 120, 80, 250]), ans = rnd(w * pc / 100, 2); return { type: 'num', unit: 'cm', q: p(`Een foto is ${w} cm breed en ${h} cm hoog. De foto wordt afgedrukt op ${pc}% van de oorspronkelijke grootte.`) + ask('Hoe breed wordt de afdruk?'), ans, expl: steps(`Afdrukken op ${pc}% betekent: elke afmeting keer ${nf(pc / 100)}.`, `${w} × ${nf(pc / 100)} = <b>${nf(ans)}</b> cm.`) + tip('De hoogte heb je niet nodig.') }; }
    if (L === 2) {
      const up = r.chance(0.5), pc = up ? r.pick([25, 40, 60, 75]) : r.pick([20, 30, 40, 25]), tot = up ? 100 + pc : 100 - pc, hi = r.chance(0.5), val = hi ? h : w, ans = rnd(val * tot / 100, 2);
      return { type: 'num', unit: 'cm', calc: true, q: p(`Een tekening is ${w} cm breed en ${h} cm hoog. De tekening wordt met ${pc}% ${up ? 'vergroot' : 'verkleind'}.`) + ask(`Hoe ${hi ? 'hoog' : 'breed'} wordt de tekening?`), ans,
        expl: steps(`Met ${pc}% ${up ? 'vergroten' : 'verkleinen'} betekent: de nieuwe maat is 100% ${up ? '+' : '−'} ${pc}% = ${tot}% van de oude maat.`, `${val} × ${nf(tot / 100)} = <b>${nf(ans)}</b> cm.`) + tip(`Met ${pc}% ${up ? 'vergroten' : 'verkleinen'} is iets anders dan afdrukken op ${pc}%.`) };
    }
    if (r.chance(0.5)) { const w2 = r.pick([8, 12, 16, 20]), pc = r.pick([125, 150, 175, 225, 75, 60]), nw = rnd(w2 * pc / 100, 2); return { type: 'num', unit: '%', calc: true, q: p(`Een foto is ${w2} cm breed. Op de kopieermachine moet de foto ${nf(nw)} cm breed worden.`) + ask('Op hoeveel procent moet je de kopieermachine instellen?'), ans: pc, expl: steps(`Deel de nieuwe breedte door de oude: ${nf(nw)} : ${w2} = ${nf(pc / 100)}.`, `Dat is <b>${pc}</b>%.`) }; }
    const pc = r.pick([125, 140, 160, 175, 250]), orig = r.pick([20, 24, 30, 36, 40, 60, 80]), nh = rnd(orig * pc / 100, 2);
    return { type: 'num', unit: 'cm', calc: true, q: p(`Een poster is een vergroting van een foto. De kopieermachine stond ingesteld op ${pc}%. De poster is ${nf(nh)} cm hoog.`) + ask('Hoe hoog is de oorspronkelijke foto?'), ans: orig, expl: steps(`De poster is ${pc}% van het origineel.`, `1% is ${nf(nh)} : ${pc} = ${f6(nh / pc)} cm.`, `100% is <b>${orig}</b> cm.`) };
  });

  def('BN11', 'B', 'N', 'B.11', 'Kans en aantal mogelijkheden', (L, r) => {
    if (L === 1) {
      const total = r.pick([5, 10, 20, 25, 50]), red = r.int(1, total - 1), pc = red / total * 100, [c1, c2] = r.pick([['rode', 'blauwe'], ['groene', 'gele'], ['witte', 'zwarte']]);
      return { type: 'num', unit: '%', q: p(`In een zak zitten ${red} ${c1} en ${total - red} ${c2} knikkers. Je pakt zonder te kijken één knikker.`) + ask(`Hoe groot is de kans dat je een ${c1} knikker pakt? Geef je antwoord als percentage.`), ans: pc,
        expl: steps(`Er zitten ${red} + ${total - red} = ${total} knikkers in de zak. Het aantal ${c1} knikkers is ${red}.`, `De kans is ${fr(red, total)}. Dat is ${red} : ${total} × 100 = <b>${nf(pc)}</b>%.`) };
    }
    if (L === 2) {
      const s = r.int(4, 10), cnt = s <= 7 ? s - 1 : 13 - s, good = frs(cnt, 36), combos = [];
      for (let a = 1; a <= 6; a++) if (s - a >= 1 && s - a <= 6) combos.push(`${a} + ${s - a}`);
      return Object.assign(mcTxt(r, good, [fr(1, 11), fr(1, 6), frs(s, 36), frs(cnt + 1, 36), cnt > 1 ? frs(cnt - 1, 36) : null]), { q: p('Je gooit met twee dobbelstenen en telt de ogen bij elkaar op.') + ask(`Hoe groot is de kans dat je samen ${s} gooit?`),
        expl: steps('Met twee dobbelstenen zijn er 6 × 6 = 36 mogelijke worpen.', `Samen ${s} kan op ${cnt} manieren: ${combos.join(', ')}.`, good === fr(cnt, 36) ? `De kans is <b>${good}</b>.` : `De kans is ${fr(cnt, 36)}. Vereenvoudigd: <b>${good}</b>.`) + tip('3 + 5 en 5 + 3 zijn twee verschillende worpen.') });
    }
    const f = r.int(1, 4);
    if (f === 1) { const a = r.int(2, 5), b = r.int(3, 6), c = r.int(2, 4); return { type: 'num', q: p(`In een restaurant kun je kiezen uit ${a} voorgerechten, ${b} hoofdgerechten en ${c} nagerechten. Een menu bestaat uit één voorgerecht, één hoofdgerecht en één nagerecht.`) + ask('Hoeveel verschillende menu’s kun je samenstellen?'), ans: a * b * c, expl: steps('Bij elke keuze voor het voorgerecht kun je elk hoofdgerecht en elk nagerecht nemen.', `${a} × ${b} × ${c} = <b>${a * b * c}</b> menu’s.`) }; }
    if (f === 2) { const k = r.pick([3, 4]), ans = Math.pow(10, k); return { type: 'num', q: p(`Een cijferslot heeft ${k} ringen. Op elke ring staan de cijfers 0 tot en met 9.`) + ask('Hoeveel verschillende codes zijn er mogelijk?'), ans, expl: steps('Op elke ring zijn er 10 mogelijkheden: 0 tot en met 9.', `${Array(k).fill(10).join(' × ')} = <b>${nf(ans)}</b> codes.`) + tip('De cijfers 0 tot en met 9 zijn samen tien cijfers, niet negen.') }; }
    if (f === 3) { const a = r.int(3, 6), b = r.int(4, 8), c = r.int(2, 3); return { type: 'num', q: p(`${nm(r)} heeft ${a} broeken, ${b} shirts en ${c} paar schoenen.`) + ask('Hoeveel verschillende combinaties van een broek, een shirt en een paar schoenen zijn er mogelijk?'), ans: a * b * c, expl: steps('Elke broek kan bij elk shirt en bij elk paar schoenen.', `${a} × ${b} × ${c} = <b>${a * b * c}</b> combinaties.`) }; }
    const d = r.pick([1, 2]), ans = 26 * Math.pow(10, d);
    return { type: 'num', q: p(`De kluisjes op een school krijgen een code van één letter (A tot en met Z) gevolgd door ${d === 1 ? 'één cijfer' : 'twee cijfers'} (0 tot en met 9).`) + ask('Hoeveel verschillende codes zijn er mogelijk?'), ans, expl: steps('Er zijn 26 letters en 10 cijfers.', `26 × ${Array(d).fill(10).join(' × ')} = <b>${nf(ans)}</b> codes.`) };
  });

  def('BN12', 'B', 'N', 'B.9', 'Een deel van een deel', (L, r) => {
    if (L === 1) { const n = r.pick([20, 25, 30, 40]), pc = r.pick([20, 40, 60, 80, 30, 70]), boys = n * pc / 100; if (!whole(boys)) throw RETRY; return { type: 'num', unit: 'meisjes', q: p(`In een klas zitten ${n} leerlingen. Daarvan is ${pc}% jongen.`) + ask('Hoeveel meisjes zitten er in de klas?'), ans: n - boys, expl: steps(`${pc}% van ${n} is ${boys} jongens.`, `${n} − ${boys} = <b>${n - boys}</b> meisjes.`) + tip('Er wordt naar de meisjes gevraagd, niet naar de jongens.') }; }
    if (L === 2) { const p1 = r.pick([40, 50, 60, 80]), p2 = r.pick([20, 25, 30, 50, 75]), ans = p1 * p2 / 100, sp = r.pick(['voetbal', 'hockey', 'zwemmen', 'turnen']); if (!whole(ans)) throw RETRY; return { type: 'num', unit: '%', q: p(`Van alle leerlingen van een school is ${p1}% lid van een sportclub. Van de leerlingen die lid zijn van een sportclub doet ${p2}% aan ${sp}.`) + ask(`Hoeveel procent van alle leerlingen doet aan ${sp}?`), ans, expl: steps(`Neem als voorbeeld 100 leerlingen. Daarvan zijn er ${p1} lid van een sportclub.`, `${p2}% van ${p1} is ${ans} leerlingen.`, `Dat is <b>${ans}</b>% van alle leerlingen.`) + tip(`De ${p2}% gaat alleen over de sporters, niet over alle leerlingen.`) }; }
    const N = r.pick([800, 1200, 1600, 2400]), [a, b] = r.pick([[3, 8], [2, 5], [1, 4], [3, 5], [5, 8]]), pc = r.pick([20, 25, 30, 40, 60]), kids = N * a / b, ans = kids * (100 - pc) / 100; if (!whole(ans)) throw RETRY;
    return { type: 'num', unit: 'kinderen', calc: true, q: p(`Een pretpark heeft op een dag ${nf(N)} bezoekers. Daarvan is ${fr(a, b)} deel kind. Van de kinderen heeft ${pc}% een abonnement.`) + ask('Hoeveel kinderen hebben géén abonnement?'), ans,
      expl: steps(`Kinderen: ${nf(N)} : ${b} × ${a} = ${nf(kids)}.`, `Zonder abonnement is 100% − ${pc}% = ${100 - pc}% van de kinderen.`, `${100 - pc}% van ${nf(kids)} is <b>${nf(ans)}</b> kinderen.`) + tip('Er wordt gevraagd naar de kinderen zonder abonnement.') };
  });

  def('BN13', 'B', 'N', 'B.3', 'Kommagetallen in een verhaal', (L, r) => {
    if (L === 1) { const sz = r.pick([0.75, 0.5, 0.25, 1.5, 0.2, 0.4]), n = r.int(12, 90), vat = rnd(sz * n, 2); if (!whole(vat)) throw RETRY; return { type: 'num', unit: 'flessen', q: p(`Een sapfabriek vult flessen van ${nf(sz)} liter uit een vat van ${nf(vat)} liter.`) + ask('Hoeveel flessen kunnen er uit het vat gevuld worden?'), ans: n, expl: steps(`Deel de inhoud van het vat door de inhoud van één fles: ${nf(vat)} : ${nf(sz)}.`, `Vermenigvuldig beide getallen met 100: ${nf(vat * 100)} : ${f6(sz * 100)} = <b>${n}</b> flessen.`) }; }
    if (L === 2) { const lit = r.int(251, 549) / 10, pr = r.pick([1799, 1849, 1899, 1959, 2019, 2089]) / 1000, cost = lit * pr; if (tie(cost, 2)) throw RETRY; const ans = rnd(cost, 2); return { type: 'num', pre: '€', dec: 2, calc: true, q: p(`${nm(r)} tankt ${nf(lit)} liter benzine. De prijs is €${NB}${nf(pr, 3)} per liter.`) + ask('Hoeveel moet er betaald worden? Rond af op hele centen.'), ans, expl: steps(`${nf(lit)} × ${nf(pr, 3)} = ${f6(cost)}.`, `Afgerond op hele centen: <b>${eur(ans)}</b>.`) }; }
    const Lp = r.pick([2.4, 3, 3.6, 4.2]), piece = r.pick([0.85, 0.7, 1.1, 0.65, 0.95, 1.25]), ratio = rnd(Lp / piece, 6), per = Math.floor(ratio), n = r.int(7, 25);
    if (per < 2) throw RETRY;
    const ans = Math.ceil(n / per), naive = Math.ceil(rnd(n * piece / Lp, 6)); if (naive === ans) throw RETRY;
    return { type: 'num', unit: 'planken', calc: true, q: p(`Een timmerman heeft ${n} latten van ${nf(piece, 2)} meter nodig. De bouwmarkt verkoopt alleen planken van ${nf(Lp, 2)} meter. Uit één plank kun je meerdere latten zagen, maar reststukken kun je niet aan elkaar maken.`) + ask('Hoeveel planken moet de timmerman minstens kopen?'), ans,
      expl: steps(whole(ratio) ? `Uit één plank: ${nf(Lp, 2)} : ${nf(piece, 2)} = ${per} latten.` : `Uit één plank: ${nf(Lp, 2)} : ${nf(piece, 2)} is ongeveer ${nf(ratio, 2)}. Er passen dus ${per} hele latten uit een plank.`, n % per === 0 ? `${n} : ${per} = <b>${ans}</b> planken.` : `${n} : ${per} = ${Math.floor(n / per)} rest ${n % per}. Voor de laatste ${n % per === 1 ? 'lat' : n % per + ' latten'} is nog een plank nodig: <b>${ans}</b> planken.`) + tip(`Alle lengtes optellen en delen door ${nf(Lp, 2)} geeft ${naive} planken. Dat is te weinig, omdat je reststukken niet kunt gebruiken.`) };
  });

  def('BN14', 'B', 'N', 'B.7', 'Rente', (L, r) => {
    const S = 100 * r.int(5, 80), rt = r.pick([1, 1.5, 2, 2.5, 3, 3.5, 4]), name = nm(r), i1 = rnd(S * rt / 100, 2);
    const intro = `${name} zet ${eur(S)} op een spaarrekening. De bank geeft ${nf(rt)}% rente per jaar.`;
    if (L === 1) return { type: 'num', pre: '€', dec: m2(i1), q: p(intro) + ask(`Hoeveel euro rente krijgt ${name} na één jaar?`), ans: i1, expl: steps(`1% van ${eur(S)} is ${eur(S / 100)}.`, `${nf(rt)}% is ${nf(rt)} × ${eur(S / 100)} = <b>${eur(i1)}</b>.`) };
    if (L === 2) return { type: 'num', pre: '€', dec: m2(S + i1), calc: true, q: p(intro) + ask('Hoeveel euro staat er na één jaar op de rekening?'), ans: S + i1, expl: steps(`Rente: ${nf(rt)}% van ${eur(S)} is ${eur(i1)}.`, `${eur(S)} + ${eur(i1)} = <b>${eur(S + i1)}</b>.`) + tip('Er wordt gevraagd naar het hele bedrag, niet alleen naar de rente.') };
    const s1 = S + i1, i2 = s1 * rt / 100, s2 = s1 + i2; if (tie(s2, 2)) throw RETRY; const ans = rnd(s2, 2);
    return { type: 'num', pre: '€', dec: 2, calc: true, q: p(`${intro} De rente wordt elk jaar bij het spaargeld opgeteld en levert daarna zelf ook rente op.`) + ask('Hoeveel euro staat er na twee jaar op de rekening? Rond af op hele centen.'), ans,
      expl: steps(`Na één jaar: ${eur(S)} + ${eur(i1)} = ${eur(s1)}.`, `In het tweede jaar is de rente ${nf(rt)}% van ${eur(s1)}: ${f6(i2)} euro.`, `Na twee jaar: ${f6(s2)} euro, afgerond <b>${eur(ans)}</b>.`) + tip('In het tweede jaar krijg je ook rente over de rente van het eerste jaar.') };
  });

  def('BN15', 'B', 'N', 'B.8', 'Een deel als percentage', (L, r) => {
    if (L === 1) {
      const [b, a] = r.pick([[24, 18], [20, 13], [25, 8], [40, 26], [50, 17], [30, 12], [24, 6], [40, 15], [20, 7], [25, 19], [50, 36], [30, 27]]), ans = rnd(a / b * 100, 2), name = nm(r);
      const [t, qq] = r.pick([[`In een klas van ${b} leerlingen hebben ${a} leerlingen een zwemdiploma.`, 'Hoeveel procent van de klas heeft een zwemdiploma?'], [`Een toets heeft ${b} vragen. ${name} heeft er ${a} goed.`, 'Hoeveel procent van de vragen heeft ' + name + ' goed?']]);
      return { type: 'num', unit: '%', q: p(t) + ask(qq), ans, expl: steps(`Deel het deel door het geheel: ${a} : ${b} = ${nf(a / b)}.`, `Vermenigvuldig met 100: <b>${nf(ans)}</b>%.`) };
    }
    if (L === 2) { const N = r.pick([250, 400, 500, 800, 1250]), pc = 2 * r.int(6, 44), k = N * pc / 100; return { type: 'num', unit: '%', calc: true, q: p(`Voor een onderzoek zijn ${nf(N)} mensen ondervraagd. Op de vraag of zij elke dag ontbijten, antwoordden ${nf(k)} mensen ‘ja’. De anderen antwoordden ‘nee’.`) + ask('Hoeveel procent van de ondervraagden antwoordde ‘ja’?'), ans: pc, expl: steps(`Deel het deel door het geheel: ${nf(k)} : ${nf(N)} = ${nf(k / N)}.`, `Vermenigvuldig met 100: <b>${pc}</b>%.`) }; }
    if (r.chance(0.5)) {
      const total = r.pick([20, 25]), j = r.int(8, total - 9), m = total - j, fj = r.int(3, j - 1), fm = r.int(3, m - 1), pc = (fj + fm) / total * 100;
      return { type: 'num', unit: '%', calc: true, q: p(`In groep 7 zitten ${j} jongens en ${m} meisjes. Van de jongens komen er ${fj} met de fiets naar school, van de meisjes ${fm}.`) + ask('Hoeveel procent van de leerlingen van groep 7 komt met de fiets?'), ans: pc,
        expl: steps(`In de groep zitten ${j} + ${m} = ${total} leerlingen.`, `Met de fiets komen ${fj} + ${fm} = ${fj + fm} leerlingen.`, `${fj + fm} : ${total} × 100 = <b>${nf(pc)}</b>%.`) };
    }
    const N = r.pick([75, 120, 150, 180, 45, 36, 56, 64]), k = r.int(Math.ceil(N * 0.15), Math.floor(N * 0.85)), val = k / N * 100;
    if (tie(val, 1) || Math.abs(val - rnd(val, 1)) < 1e-9) throw RETRY;
    const ans = rnd(val, 1);
    return { type: 'num', unit: '%', dec: 1, calc: true, q: p(`Van de ${N} leden van een zwemclub komen er ${k} elke week trainen.`) + ask('Hoeveel procent van de leden is dat? Rond af op één decimaal.'), ans, expl: steps(`${k} : ${N} × 100 = ${nf(val, 3)}…`, `Afgerond op één decimaal: <b>${nf(ans, 1)}</b>%.`) };
  });

  const CUR = [['Amerikaanse dollars', 'dollar', [1.05, 1.08, 1.1, 1.12, 1.2]], ['Britse ponden', 'pond', [0.8, 0.85, 0.9, 0.75]], ['Zwitserse franken', 'frank', [0.95, 0.9, 0.96]], ['Poolse zloty', 'zloty', [4.3, 4.25, 4.5]], ['Deense kronen', 'kronen', [7.45, 7.5, 7.4]]];
  def('BN16', 'B', 'N', 'B.5', 'Wisselkoers', (L, r) => {
    const [full, sh, ks] = r.pick(CUR), k = r.pick(ks), name = nm(r), koers = `De wisselkoers is: 1 euro = ${nf(k, 2)} ${sh}.`;
    if (L === 1) { const E = 50 * r.int(1, 16), ans = rnd(E * k, 2); return { type: 'num', unit: sh, dec: m2(ans), q: p(`${name} gaat op vakantie en wisselt ${eur(E)} om in ${full}. ${koers}`) + ask(`Hoeveel ${sh} krijgt ${name}?`), ans, expl: steps(`Voor elke euro krijg je ${nf(k, 2)} ${sh}.`, `${E} × ${nf(k, 2)} = <b>${nf(ans)}</b> ${sh}.`) }; }
    if (L === 2) { const E = 20 * r.int(1, 20), V = rnd(E * k, 2); return { type: 'num', pre: '€', calc: true, q: p(`${name} koopt in het buitenland een jas van ${nf(V, whole(V) ? 0 : 2)} ${sh}. ${koers}`) + ask('Hoeveel euro kost de jas?'), ans: E, expl: steps(`Je weet het bedrag in ${sh} en wilt terug naar euro. Dan deel je door de koers.`, `${nf(V, whole(V) ? 0 : 2)} : ${nf(k, 2)} = <b>${eur(E)}</b>.`) + tip('Vermenigvuldigen met de koers geeft het bedrag in de andere munt, niet in euro.') }; }
    const E = 50 * r.int(2, 16), c = r.pick([2.5, 3.5, 4.5, 5]), val = (E - c) * k; if (tie(val, 2)) throw RETRY; const ans = rnd(val, 2);
    return { type: 'num', unit: sh, dec: 2, calc: true, q: p(`${name} wisselt ${eur(E)} om in ${full}. ${koers} Het wisselkantoor houdt eerst ${eur(c)} kosten in op het bedrag in euro.`) + ask(`Hoeveel ${sh} krijgt ${name}? Rond af op twee decimalen.`), ans,
      expl: steps(`Na aftrek van de kosten blijft er ${eur(E)} − ${eur(c)} = ${eur(E - c)} over.`, `${f6(E - c)} × ${nf(k, 2)} = ${f6(val)}.`, `Afgerond op twee decimalen: <b>${nf(ans, 2)}</b> ${sh}.`) + tip('De kosten gaan er eerst af. Daarna pas reken je om.') };
  });

  const SHOP = [['brood', 'broden', 239], ['pak melk', 'pakken melk', 119], ['stuk kaas', 'stukken kaas', 485], ['pot pindakaas', 'potten pindakaas', 295], ['doos eieren', 'dozen eieren', 320], ['pak koffie', 'pakken koffie', 549], ['pak pasta', 'pakken pasta', 89], ['zak rijst', 'zakken rijst', 199], ['bak yoghurt', 'bakken yoghurt', 165], ['fles sap', 'flessen sap', 215]];
  const KG = [['appels', 250], ['bananen', 180], ['tomaten', 320], ['druiven', 450], ['uien', 120]];
  def('BN17', 'B', 'N', 'B.3', 'Boodschappen afrekenen', (L, r) => {
    const name = nm(r), [A, B] = r.sample(SHOP, 2), n1 = r.int(2, 4), n2 = r.int(2, 3), [kg, pkg] = r.pick(KG), w = r.pick([0.8, 1.2, 1.5, 2.5, 0.6, 1.4]), wc = Math.round(w * pkg);
    const cnt = (n, it) => `${n} ${it[1]} van ${C(it[2])} per stuk`, bill = t => t < 1000 ? 1000 : t < 2000 ? 2000 : 5000;
    if (L === 1) { const tot = n1 * A[2] + n2 * B[2]; return { type: 'num', pre: '€', dec: 2, q: p(`${name} koopt ${cnt(n1, A)} en ${cnt(n2, B)}.`) + ask(`Hoeveel moet ${name} betalen?`), ans: tot / 100, expl: steps(`${n1} × ${C(A[2])} = ${C(n1 * A[2])}.`, `${n2} × ${C(B[2])} = ${C(n2 * B[2])}.`, `Samen: <b>${C(tot)}</b>.`) }; }
    if (L === 2) {
      const tot = n1 * A[2] + wc, pay = bill(tot);
      return { type: 'num', pre: '€', dec: 2, calc: true, q: p(`${name} koopt ${cnt(n1, A)} en ${nf(w)} kilogram ${kg} van ${C(pkg)} per kilogram. ${name} betaalt met een briefje van ${C(pay)}.`) + ask(`Hoeveel wisselgeld krijgt ${name} terug?`), ans: (pay - tot) / 100,
        expl: steps(`${n1} × ${C(A[2])} = ${C(n1 * A[2])}.`, `${nf(w)} × ${C(pkg)} = ${C(wc)}.`, `Samen: ${C(tot)}.`, `Wisselgeld: ${C(pay)} − ${C(tot)} = <b>${C(pay - tot)}</b>.`) };
    }
    const tot = 2 * A[2] + n2 * B[2] + wc, pay = bill(tot);
    return { type: 'num', pre: '€', dec: 2, calc: true, q: p(`${name} koopt 3 ${A[1]} van ${C(A[2])} per stuk. Voor dit product geldt deze week: ‘3 halen, 2 betalen’. Daarnaast koopt ${name} ${cnt(n2, B)} en ${nf(w)} kilogram ${kg} van ${C(pkg)} per kilogram. ${name} betaalt met een briefje van ${C(pay)}.`) + ask(`Hoeveel wisselgeld krijgt ${name} terug?`), ans: (pay - tot) / 100,
      expl: steps(`Door de aanbieding betaal je 2 van de 3 ${A[1]}: 2 × ${C(A[2])} = ${C(2 * A[2])}.`, `${n2} × ${C(B[2])} = ${C(n2 * B[2])} en ${nf(w)} × ${C(pkg)} = ${C(wc)}.`, `Samen: ${C(tot)}.`, `Wisselgeld: ${C(pay)} − ${C(tot)} = <b>${C(pay - tot)}</b>.`) + tip('Er wordt naar het wisselgeld gevraagd, niet naar het totaalbedrag.') };
  });
})();
