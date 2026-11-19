/* bankA.js */
/* Domein A · Hele getallen */
(function () {
  'use strict';
  const { def, nf, eur, en, klok, rnd, sum, words, RETRY, steps, tip, som, p, ask, mcNum, mcTxt, ordQ, nm, NB } = RWT.kit;
  const RULE = 'Volgorde: eerst haakjes, dan machten en wortels, dan vermenigvuldigen en delen, als laatste optellen en aftrekken.';
  const gap = '<span class="gap">…</span>';

  /* ================= hoofdrekenen ================= */

  def('AH01', 'A', 'H', 'A.4', 'Handig optellen', (L, r) => {
    if (L === 3 && r.chance(0.5)) {
      const u = r.pick([150, 250, 350, 450, 650, 750]), x = 1000 * r.int(1, 4) + u, z = 1000 - u, y = r.pick([299, 399, 499, 599, 799, 899]);
      const ans = x + y + z;
      return { type: 'num', q: p('Reken uit.') + som(`${nf(x)} + ${nf(y)} + ${nf(z)} =`), ans,
        expl: steps(`Zoek eerst een handig paar: ${nf(x)} + ${nf(z)} = ${nf(x + z)}.`, `${nf(y)} is 1 minder dan ${nf(y + 1)}: ${nf(x + z)} + ${nf(y + 1)} = ${nf(x + z + y + 1)}.`, `Haal er 1 af: <b>${nf(ans)}</b>.`) };
    }
    const base = L === 1 ? r.pick([100, 200, 300]) : L === 2 ? r.pick([1000, 2000, 3000]) : r.pick([10000, 20000]);
    const k = L === 1 ? r.int(1, 3) : L === 2 ? r.pick([1, 2, 3, 5]) : r.pick([5, 15, 25]);
    const a = L === 1 ? r.int(125, 870) : L === 2 ? r.int(1150, 8700) : r.int(12400, 76500);
    const b = base - k, ans = a + b;
    return { type: 'num', q: p('Reken uit.') + som(`${nf(a)} + ${nf(b)} =`), ans,
      expl: steps(`${nf(b)} is ${k} minder dan ${nf(base)}.`, `${nf(a)} + ${nf(base)} = ${nf(a + base)}.`, `Haal er ${k} af: <b>${nf(ans)}</b>.`) };
  });

  def('AH02', 'A', 'H', 'A.4', 'Handig aftrekken', (L, r) => {
    if (L === 3 && r.chance(0.5)) {
      const a = r.pick([10000, 20000, 50000, 100000]);
      let b; do { b = r.int(1234, Math.min(a - 1001, 48999)); } while (b % 10 === 0 || b % 100 < 10);
      const ans = a - b;
      return { type: 'num', q: p('Reken uit.') + som(`${nf(a)} − ${nf(b)} =`), ans,
        expl: steps(`Haal van beide getallen 1 af. Het verschil blijft gelijk: ${nf(a - 1)} − ${nf(b - 1)}.`, `Nu hoef je nergens te lenen: <b>${nf(ans)}</b>.`) };
    }
    let a, bb, k;
    if (L === 1) { a = r.int(310, 960); bb = r.pick([100, 200]); k = r.int(1, 3); }
    else if (L === 2) { const m = r.int(3, 9); a = 1000 * m + r.int(1, 25); bb = 1000 * r.int(1, m - 1); k = r.int(2, 8); }
    else { a = 10000 * r.int(1, 6) + r.int(1, 30); bb = 1000 * r.int(2, 9); k = r.int(2, 9); }
    const b = bb - k, ans = a - b;
    return { type: 'num', q: p('Reken uit.') + som(`${nf(a)} − ${nf(b)} =`), ans,
      expl: steps(`${nf(b)} is ${k} minder dan ${nf(bb)}. Trek eerst ${nf(bb)} af: ${nf(a)} − ${nf(bb)} = ${nf(a - bb)}.`, `Je hebt ${k} te veel afgetrokken. Tel ${k} erbij: <b>${nf(ans)}</b>.`) };
  });

  def('AH03', 'A', 'H', 'A.4', 'Handig vermenigvuldigen', (L, r) => {
    let a, b, ex;
    if (L === 1) {
      a = r.int(3, 9); b = r.int(12, 68); if (b % 10 === 0) throw RETRY;
      const t = Math.floor(b / 10) * 10, e = b % 10;
      ex = steps(`Splits ${b} in ${t} en ${e}.`, `${a} × ${t} = ${nf(a * t)} en ${a} × ${e} = ${a * e}.`, `Samen: <b>${nf(a * b)}</b>.`);
    } else if (L === 2) {
      const v = r.pick(['25', '99', '15', '5', '12']);
      if (v === '25') { a = 25; b = 4 * r.int(3, 22); ex = steps(`25 × 4 = 100 en ${b} = 4 × ${b / 4}.`, `Dus 25 × ${b} = 100 × ${b / 4} = <b>${nf(a * b)}</b>.`); }
      else if (v === '99') { a = r.pick([99, 101, 49, 51]); b = r.int(4, 9); const rb = a > 60 ? 100 : 50, less = a < rb; ex = steps(`${a} = ${rb} ${less ? '−' : '+'} 1.`, `${rb} × ${b} = ${nf(rb * b)}.`, `${less ? 'Haal er' : 'Tel er'} 1 × ${b} = ${b} ${less ? 'af' : 'bij op'}: <b>${nf(a * b)}</b>.`); }
      else if (v === '15') { a = 15; b = 2 * r.int(6, 32); ex = steps(`10 × ${b} = ${nf(10 * b)}.`, `5 × ${b} is de helft daarvan: ${nf(5 * b)}.`, `Samen: <b>${nf(a * b)}</b>.`); }
      else if (v === '5') { a = 5; b = 2 * r.int(62, 493); ex = steps('5 keer is de helft van 10 keer.', `10 × ${b} = ${nf(10 * b)}.`, `De helft daarvan: <b>${nf(a * b)}</b>.`); }
      else { a = r.pick([12, 14, 16, 18]); b = r.pick([15, 25, 35, 45]); ex = steps(`Halveer het ene getal en verdubbel het andere: ${a} × ${b} = ${a / 2} × ${2 * b}.`, `${a / 2} × ${2 * b} = <b>${nf(a * b)}</b>.`); }
    } else {
      const v = r.pick(['198', '250', '75', '125', '999']);
      if (v === '198') { const k = r.int(2, 5), j = r.int(1, 3); a = 100 * k - j; b = r.int(4, 9); ex = steps(`${a} = ${100 * k} − ${j}.`, `${100 * k} × ${b} = ${nf(100 * k * b)}.`, `Haal er ${j} × ${b} = ${j * b} af: <b>${nf(a * b)}</b>.`); }
      else if (v === '250') { a = 4 * r.int(3, 12); b = 250; ex = steps(`4 × 250 = 1.000 en ${a} = ${a / 4} × 4.`, `Dus ${a} × 250 = ${a / 4} × 1.000 = <b>${nf(a * b)}</b>.`); }
      else if (v === '75') { a = 75; b = 4 * r.int(3, 9); ex = steps(`75 × 4 = 300 en ${b} = 4 × ${b / 4}.`, `Dus 75 × ${b} = 300 × ${b / 4} = <b>${nf(a * b)}</b>.`); }
      else if (v === '125') { a = 125; b = 8 * r.int(2, 9); ex = steps(`125 × 8 = 1.000 en ${b} = 8 × ${b / 8}.`, `Dus 125 × ${b} = 1.000 × ${b / 8} = <b>${nf(a * b)}</b>.`); }
      else { a = r.pick([999, 1001]); b = r.int(4, 9); const less = a < 1000; ex = steps(`${nf(a)} = 1.000 ${less ? '−' : '+'} 1.`, `1.000 × ${b} = ${nf(1000 * b)}.`, `${less ? 'Haal er' : 'Tel er'} ${b} ${less ? 'af' : 'bij op'}: <b>${nf(a * b)}</b>.`); }
    }
    return { type: 'num', q: p('Reken uit.') + som(`${nf(a)} × ${nf(b)} =`), ans: a * b, expl: ex };
  });

  def('AH04', 'A', 'H', 'A.4', 'Delen', (L, r) => {
    let N, d, ans, ex;
    if (L === 1) {
      const dd = r.int(3, 9), q0 = r.int(3, 9), k = r.pick([1, 2]), j = r.int(0, 1);
      N = dd * q0 * Math.pow(10, k); d = dd * Math.pow(10, j); ans = q0 * Math.pow(10, k - j);
      ex = j ? steps(`Haal bij beide getallen een nul weg: ${nf(N)} : ${d} = ${nf(N / 10)} : ${dd}.`, k === 1 ? `${dd * q0} : ${dd} = <b>${nf(ans)}</b>.` : `${dd * q0} : ${dd} = ${q0}, dus ${nf(N / 10)} : ${dd} = <b>${nf(ans)}</b>.`)
        : steps(`${dd * q0} : ${dd} = ${q0}.`, `${nf(N)} is ${k === 1 ? '10' : '100'} keer zo groot als ${dd * q0}, dus de uitkomst ook: <b>${nf(ans)}</b>.`);
    } else {
      let q, big, small;
      if (L === 2) {
        d = r.pick([4, 5, 6, 8, 9, 12, 25]);
        if (r.chance(0.5)) { const h = r.int(1, 9), u = r.int(1, 9); big = 100 * h; small = u; } else { const h = r.int(1, 4), u = r.int(1, 9); big = 1000 * h; small = 10 * u; }
      } else { d = r.pick([12, 15, 18, 24, 36, 45]); big = 1000 * r.int(1, 4); small = r.int(1, 20); }
      q = big + small; N = d * q; ans = q;
      ex = steps(`Splits ${nf(N)} in ${nf(d * big)} + ${nf(d * small)}.`, `${nf(d * big)} : ${d} = ${nf(big)} en ${nf(d * small)} : ${d} = ${small}.`, `Samen: <b>${nf(ans)}</b>.`);
    }
    return { type: 'num', q: p('Reken uit.') + som(`${nf(N)} : ${nf(d)} =`), ans, expl: ex };
  });

  def('AH05', 'A', 'H', 'A.4', 'Volgorde van bewerkingen', (L, r) => {
    let s, ans, ex;
    if (L === 1) {
      if (r.chance(0.5)) { const a = r.int(4, 30), b = r.int(2, 9), c = r.int(3, 9); s = `${a} + ${b} × ${c}`; ans = a + b * c; ex = steps(RULE, `Eerst ${b} × ${c} = ${b * c}.`, `Dan ${a} + ${b * c} = <b>${ans}</b>.`); }
      else { const c = r.int(2, 9), q = r.int(2, 9), b = c * q, a = q + r.int(3, 30); s = `${a} − ${b} : ${c}`; ans = a - q; ex = steps(RULE, `Eerst ${b} : ${c} = ${q}.`, `Dan ${a} − ${q} = <b>${ans}</b>.`); }
    } else if (L === 2) {
      const f = r.int(1, 4);
      if (f === 1) { const d = r.int(3, 12), b = r.int(4, 20), a = b + d, c = r.int(6, 19); s = `(${a} − ${b}) × ${c}`; ans = d * c; ex = steps(RULE, `Eerst de haakjes: ${a} − ${b} = ${d}.`, `Dan ${d} × ${c} = <b>${ans}</b>.`); }
      else if (f === 2) { const a = r.int(6, 12), b = r.int(6, 9), c = r.int(2, 5), d = r.int(3, 9); if (a * b - c * d < 3) throw RETRY; s = `${a} × ${b} − ${c} × ${d}`; ans = a * b - c * d; ex = steps(RULE, `${a} × ${b} = ${a * b} en ${c} × ${d} = ${c * d}.`, `Dan ${a * b} − ${c * d} = <b>${ans}</b>.`); }
      else if (f === 3) { const a = r.int(5, 40), b = r.int(3, 9), d = r.int(2, 9), c = d + r.int(2, 9); s = `${a} + ${b} × (${c} − ${d})`; ans = a + b * (c - d); ex = steps(RULE, `Eerst de haakjes: ${c} − ${d} = ${c - d}.`, `Dan ${b} × ${c - d} = ${b * (c - d)}.`, `Als laatste ${a} + ${b * (c - d)} = <b>${ans}</b>.`); }
      else { const b = r.int(2, 9), c = r.int(2, 9), d = r.int(3, 8), a = (b + c) * d + r.int(5, 40); s = `${a} − (${b} + ${c}) × ${d}`; ans = a - (b + c) * d; ex = steps(RULE, `Eerst de haakjes: ${b} + ${c} = ${b + c}.`, `Dan ${b + c} × ${d} = ${(b + c) * d}.`, `Als laatste ${a} − ${(b + c) * d} = <b>${ans}</b>.`); }
    } else {
      const f = r.int(1, 3);
      if (f === 1) { const sq = r.int(3, 9), b = r.int(3, 9), c = r.int(3, 9), g = r.int(2, 6), q = r.int(2, 9), e = g * q; s = `${sq}² + ${b} × ${c} − ${e} : ${g}`; ans = sq * sq + b * c - q; ex = steps(RULE, `${sq}² = ${sq * sq}.`, `${b} × ${c} = ${b * c} en ${e} : ${g} = ${q}.`, `${sq * sq} + ${b * c} − ${q} = <b>${ans}</b>.`); }
      else if (f === 2) { const w = r.int(4, 12), d = r.int(1, 6), a = d + r.int(2, 7), t = r.int(3, 9); s = `√${w * w} × (${a} − ${d}) + ${t}²`; ans = w * (a - d) + t * t; ex = steps(RULE, `Haakjes: ${a} − ${d} = ${a - d}.`, `√${w * w} = ${w} en ${t}² = ${t * t}.`, `${w} × ${a - d} = ${w * (a - d)}.`, `${w * (a - d)} + ${t * t} = <b>${ans}</b>.`); }
      else { const sv = r.pick([4, 6, 8, 9, 10, 12]); const d = r.pick([2, 3, 4, 6, 8, 9].filter(x => (sv * sv) % x === 0)); const b = r.int(1, sv - 1), c = sv - b; const A = sv * sv / d + r.int(10, 60); s = `${A} − (${b} + ${c})² : ${d}`; ans = A - sv * sv / d; ex = steps(RULE, `Haakjes: ${b} + ${c} = ${sv}.`, `${sv}² = ${sv * sv}.`, `${sv * sv} : ${d} = ${sv * sv / d}.`, `${A} − ${sv * sv / d} = <b>${ans}</b>.`); }
    }
    return { type: 'num', q: p('Reken uit.') + som(s + ' ='), ans, expl: ex };
  });

  def('AH06', 'A', 'H', 'A.4', 'Rekenen met negatieve getallen', (L, r) => {
    let s, ans, ex;
    if (L === 1) {
      const f = r.int(1, 3);
      if (f === 1) { const a = r.int(3, 15), b = r.int(a + 1, a + 15); s = `−${a} + ${b}`; ans = b - a; ex = steps(`Je begint op −${a} en gaat ${b} omhoog.`, `Tot 0 is dat ${a}, daarna blijft er nog ${b} − ${a} over: <b>${ans}</b>.`); }
      else if (f === 2) { const a = r.int(2, 12), b = r.int(a + 2, a + 15); s = `${a} − ${b}`; ans = a - b; ex = steps(`Je begint op ${a} en gaat ${b} omlaag.`, `Tot 0 is dat ${a}, daarna ga je nog ${b - a} onder nul: <b>${nf(ans)}</b>.`); }
      else { const a = r.int(2, 15), b = r.int(2, 15); s = `−${a} − ${b}`; ans = -a - b; ex = steps(`Je begint op −${a} en gaat nog ${b} verder omlaag.`, `${a} + ${b} = ${a + b}, dus de uitkomst is <b>${nf(ans)}</b>.`); }
    } else if (L === 2) {
      const f = r.int(1, 5);
      if (f === 1) { const a = r.int(3, 15), b = r.int(5, 20), c = r.int(5, 20); s = `−${a} + ${b} − ${c}`; ans = -a + b - c; ex = steps(`−${a} + ${b} = ${nf(b - a)}.`, `${nf(b - a)} − ${c} = <b>${nf(ans)}</b>.`); }
      else if (f === 2) { const a = r.int(3, 12), b = r.int(3, 9); s = `−${a} × ${b}`; ans = -a * b; ex = steps(`${a} × ${b} = ${a * b}.`, `Een negatief getal keer een positief getal is negatief: <b>${nf(ans)}</b>.`); }
      else if (f === 3) { const b = r.int(3, 9), q = r.int(3, 12); s = `−${b * q} : ${b}`; ans = -q; ex = steps(`${b * q} : ${b} = ${q}.`, `Een negatief getal gedeeld door een positief getal is negatief: <b>${nf(ans)}</b>.`); }
      else if (f === 4) { const a = r.int(5, 30), b = r.int(3, 20); s = `${a} − (−${b})`; ans = a + b; ex = steps('Een negatief getal aftrekken is hetzelfde als optellen.', `${a} + ${b} = <b>${ans}</b>.`); }
      else {
        const t0 = -r.int(2, 9), up = r.int(4, 12), down = r.int(up + 1, up + 9); ans = t0 + up - down;
        return { type: 'num', unit: '°C', q: p(`Om 7 uur is het ${nf(t0)}${NB}°C. Overdag stijgt de temperatuur ${up} graden. In de avond daalt de temperatuur ${down} graden.`) + ask('Hoe warm is het dan?'), ans,
          expl: steps(`${nf(t0)} + ${up} = ${nf(t0 + up)}.`, `${nf(t0 + up)} − ${down} = <b>${nf(ans)}</b> °C.`) };
      }
    } else {
      const f = r.int(1, 4);
      if (f === 1) { const a = r.int(3, 9), b = r.int(3, 9), c = r.int(5, 40); s = `−${a} × (−${b}) + (−${c})`; ans = a * b - c; ex = steps(`Min keer min is plus: −${a} × (−${b}) = ${a * b}.`, `${a * b} + (−${c}) = ${a * b} − ${c} = <b>${nf(ans)}</b>.`); }
      else if (f === 2) { const a = r.int(3, 9), c = r.int(10, 99); s = `(−${a})² − ${c}`; ans = a * a - c; ex = steps(`(−${a})² = −${a} × (−${a}) = ${a * a}.`, `${a * a} − ${c} = <b>${nf(ans)}</b>.`); }
      else if (f === 3) { const b = r.int(3, 9), q = r.int(4, 25), c = r.int(5, 40); s = `−${b * q} : ${b} − (−${c})`; ans = -q + c; ex = steps(`−${b * q} : ${b} = −${q}.`, `Een negatief getal aftrekken is optellen: −${q} + ${c} = <b>${nf(ans)}</b>.`); }
      else { const a = r.int(3, 9), b = r.int(3, 9), c = r.int(2, 9), d = r.int(2, 9); s = `${a} × (−${b}) − (−${c}) × ${d}`; ans = -a * b + c * d; ex = steps(`${a} × (−${b}) = −${a * b} en (−${c}) × ${d} = −${c * d}.`, `−${a * b} − (−${c * d}) = −${a * b} + ${c * d} = <b>${nf(ans)}</b>.`); }
    }
    return { type: 'num', q: p('Reken uit.') + som(s + ' ='), ans, expl: ex };
  });

  def('AH07', 'A', 'H', 'A.4', 'Kwadraten, machten en wortels', (L, r) => {
    let s, ans, ex;
    const sqEx = n => {
      const t = Math.floor(n / 10) * 10, e = n % 10;
      if (n < 13) return steps(`${n}² betekent ${n} × ${n}.`, `${n} × ${n} = <b>${n * n}</b>.`);
      if (e === 0) return steps(`${n / 10} × ${n / 10} = ${n * n / 100}.`, `Twee nullen erachter: <b>${nf(n * n)}</b>.`);
      return steps(`${n}² = ${n} × ${n}. Splits: ${n} × ${t} = ${n * t} en ${n} × ${e} = ${n * e}.`, `Samen: <b>${nf(n * n)}</b>.`);
    };
    if (L === 1) {
      const n = r.int(4, 12);
      if (r.chance(0.5)) { s = `${n}²`; ans = n * n; ex = sqEx(n); }
      else { s = `√${n * n}`; ans = n; ex = steps(`Zoek het getal dat met zichzelf vermenigvuldigd ${n * n} geeft.`, `${n} × ${n} = ${n * n}, dus de wortel is <b>${n}</b>.`); }
    } else if (L === 2) {
      const f = r.int(1, 3), n = r.pick([13, 14, 15, 16, 17, 18, 19, 20, 25, 30]);
      if (f === 1) { s = `${n}²`; ans = n * n; ex = sqEx(n); }
      else if (f === 2) { s = `√${n * n}`; ans = n; ex = steps(`Zoek het getal dat met zichzelf vermenigvuldigd ${n * n} geeft.`, `Probeer: ${n} × ${n} = ${n * n}. De wortel is <b>${n}</b>.`); }
      else { const [b, e] = r.pick([[2, 3], [2, 4], [2, 5], [2, 6], [3, 3], [4, 3], [5, 3], [10, 3], [10, 4], [10, 5], [3, 4]]); s = `${b}<sup>${e}</sup>`; ans = Math.pow(b, e); ex = steps(`${b}<sup>${e}</sup> betekent ${e} keer het getal ${b} met elkaar vermenigvuldigen.`, `${Array(e).fill(b).join(' × ')} = <b>${nf(ans)}</b>.`); }
    } else {
      const f = r.int(1, 4);
      if (f === 1) { const w = r.int(6, 15), b = r.int(4, 9); s = `√${w * w} + ${b}²`; ans = w + b * b; ex = steps(`√${w * w} = ${w}, want ${w} × ${w} = ${w * w}.`, `${b}² = ${b * b}.`, `${w} + ${b * b} = <b>${ans}</b>.`); }
      else if (f === 2) { const c = r.int(3, 9), w = r.int(11, 16); s = `${c} × √${w * w}`; ans = c * w; ex = steps(`√${w * w} = ${w}, want ${w} × ${w} = ${w * w}.`, `${c} × ${w} = <b>${ans}</b>.`); }
      else if (f === 3) { const n = r.int(15, 40); s = `${n + 1}² − ${n}²`; ans = 2 * n + 1; ex = steps(`${n + 1}² is ${n + 1} × ${n + 1}. Dat is ${n}² + ${n} + ${n + 1}.`, `Het verschil is dus ${n} + ${n + 1} = <b>${ans}</b>.`); }
      else { const [a, b] = r.pick([[4, 25], [9, 16], [4, 36], [9, 25], [16, 25], [4, 49], [9, 49], [4, 81]]); const ra = Math.sqrt(a), rb = Math.sqrt(b); s = `√(${a} × ${b})`; ans = ra * rb; ex = steps(`Je mag de wortel per getal nemen: √${a} = ${ra} en √${b} = ${rb}.`, `${ra} × ${rb} = <b>${ans}</b>.`); }
    }
    return { type: 'num', q: p('Reken uit.') + som(s + ' ='), ans, expl: ex };
  });

  const RN = { 10: 'tientallen', 100: 'honderdtallen', 1000: 'duizendtallen', 10000: 'tienduizendtallen', 100000: 'honderdduizendtallen', 1000000: 'miljoenen' };
  function roundEx(n, u, tail) {
    const dig = Math.floor(n / (u / 10)) % 10, R = Math.round(n / u) * u;
    return steps(`Kijk naar het cijfer rechts van de ${RN[u]}: dat is een ${dig}.`, dig >= 5 ? '5 of hoger: je rondt naar boven af.' : 'Lager dan 5: je rondt naar beneden af.', `Het wordt <b>${nf(R)}</b>${tail || ''}.`);
  }
  def('AH08', 'A', 'H', 'A.3', 'Afronden', (L, r) => {
    let n, u;
    if (L === 1) { n = r.int(1012, 9988); u = r.pick([10, 100]); }
    else if (L === 2) {
      u = r.pick([100, 1000, 10000]); n = r.int(12000, 987000);
      if (r.chance(0.35)) n = Math.floor(n / (10 * u)) * 10 * u + 10 * u - r.int(1, u / 2);
    } else if (r.chance(0.5)) {
      n = r.int(101000000, 989000000); u = 1000000; if (n % u === 0) throw RETRY;
      const ans = Math.round(n / u);
      return { type: 'num', unit: 'miljoen', q: p(`Rond ${nf(n)} af op miljoenen.`) + ask('Hoeveel miljoen is dat?'), ans, expl: roundEx(n, u, `, dus <b>${ans}</b> miljoen`) };
    } else { n = r.int(1020000, 9870000); u = r.pick([10000, 100000]); }
    if (n % u === 0) throw RETRY;
    return { type: 'num', q: p(`Rond ${nf(n)} af op ${RN[u]}.`), ans: Math.round(n / u) * u, expl: roundEx(n, u) };
  });

  def('AH09', 'A', 'H', 'A.3', 'Schatten', (L, r) => {
    let expr, exact, est, opts, ex;
    const near = (base, dmax) => base + r.pick([-1, 1]) * r.int(1, dmax);
    if (L === 1) { const A = 10 * r.int(2, 9), B = 10 * r.int(2, 9), a = near(A, 2), b = near(B, 2); expr = `${a} × ${b}`; exact = a * b; est = A * B; opts = [est / 10, est * 10, est / 2]; ex = `${a} is ongeveer ${A} en ${b} is ongeveer ${B}. ${A} × ${B} = ${nf(est)}.`; }
    else if (L === 2) { const A = 1000 * r.int(2, 9), B = 10 * r.int(2, 6), a = near(A, 45), b = near(B, 2); expr = `${nf(a)} × ${b}`; exact = a * b; est = A * B; opts = [est / 10, est * 10, est / 2]; ex = `${nf(a)} is ongeveer ${nf(A)} en ${b} is ongeveer ${B}. ${nf(A)} × ${B} = ${nf(est)}.`; }
    else {
      const f = r.int(1, 3);
      if (f === 1) { const B = 10 * r.int(2, 8), Q = r.pick([200, 300, 400, 500, 600, 800]), A = B * Q, a = near(A, A / 100), b = near(B, 1); expr = `${nf(a)} : ${b}`; exact = a / b; est = Q; opts = [Q / 10, Q * 10, Q / 2]; ex = `${nf(a)} is ongeveer ${nf(A)} en ${b} is ongeveer ${B}. ${nf(A)} : ${B} = ${nf(Q)}.`; }
      else if (f === 2) { const A = 100 * r.int(3, 9), B = 100 * r.int(3, 9), a = near(A, 14), b = near(B, 14); expr = `${a} × ${b}`; exact = a * b; est = A * B; opts = [est / 10, est * 10, est / 2]; ex = `${a} is ongeveer ${A} en ${b} is ongeveer ${B}. ${A} × ${B} = ${nf(est)}.`; }
      else { const parts = [0, 1, 2, 3].map(() => 1000 * r.int(2, 9)), vals = parts.map(v => near(v, 60)); expr = vals.map(v => nf(v)).join(' + '); exact = sum(vals); est = sum(parts); opts = [est - 2000, est + 2000, est - 1000]; ex = `Rond elk getal af op duizendtallen: ${parts.map(v => nf(v)).join(' + ')} = ${nf(est)}.`; }
    }
    const all = [est].concat(opts);
    if (all.some(o => Math.abs(o - exact) <= Math.abs(est - exact) && o !== est)) throw RETRY;
    return Object.assign(mcNum(r, est, opts), { q: p(`Welke uitkomst ligt het dichtst bij <b>${expr}</b>?`) + p('Je hoeft niet precies te rekenen.'),
      expl: steps('Rond de getallen af op makkelijke getallen en reken daarmee.', ex, `Het antwoord ligt het dichtst bij <b>${nf(est)}</b>.`) });
  });

  def('AH10', 'A', 'H', 'A.5', 'Gemiddelde', (L, r) => {
    if (L === 1) {
      const m = r.int(8, 20), a = r.int(3, 30), b = r.int(3, 30), c = 3 * m - a - b;
      if (c < 2 || c > 40 || new Set([a, b, c]).size < 3) throw RETRY;
      return { type: 'num', q: p(`Wat is het gemiddelde van ${a}, ${b} en ${c}?`), ans: m, expl: steps(`Tel de getallen op: ${a} + ${b} + ${c} = ${a + b + c}.`, `Deel door het aantal getallen: ${a + b + c} : 3 = <b>${m}</b>.`) };
    }
    if (L === 2) {
      if (r.chance(0.5)) {
        const n = r.pick([4, 5]), m = r.int(12, 45), v = []; let s = 0;
        for (let i = 0; i < n - 1; i++) { const x = m + r.int(-10, 10); v.push(x); s += x; }
        const last = n * m - s; if (last < 2 || Math.abs(last - m) > 14) throw RETRY; v.push(last);
        const vs = r.shuffle(v);
        return { type: 'num', q: p(`Wat is het gemiddelde van ${en(vs)}?`), ans: m, expl: steps(`Tel de getallen op: ${vs.join(' + ')} = ${n * m}.`, `Deel door ${n}: ${n * m} : ${n} = <b>${m}</b>.`) };
      }
      const m = r.int(-4, 6), a = -r.int(1, 12), b = r.int(0, 15), c = 3 * m - a - b;
      if (c < -15 || c > 25 || c === a || c === b) throw RETRY;
      const vs = r.shuffle([a, b, c]);
      return { type: 'num', unit: '°C', q: p(`Op drie dagen is om 8 uur de temperatuur gemeten: ${en(vs.map(v => nf(v) + NB + '°C'))}.`) + ask('Wat is de gemiddelde temperatuur?'), ans: m,
        expl: steps(`Tel de temperaturen op: ${vs.map(v => v < 0 ? '(' + nf(v) + ')' : nf(v)).join(' + ')} = ${nf(3 * m)}.`, `Deel door 3: ${nf(3 * m)} : 3 = <b>${nf(m)}</b> °C.`) };
    }
    const n = r.pick([4, 5]), m = r.int(10, 30), v = []; let s = 0;
    for (let i = 0; i < n - 1; i++) { const x = m + r.int(-8, 8); v.push(x); s += x; }
    const x = n * m - s; if (x < 1 || x > 60 || x === m) throw RETRY;
    return { type: 'num', q: p(`Het gemiddelde van ${n === 4 ? 'vier' : 'vijf'} getallen is ${m}. ${n === 4 ? 'Drie' : 'Vier'} van de getallen zijn ${en(v)}.`) + ask(`Wat is het ${n === 4 ? 'vierde' : 'vijfde'} getal?`), ans: x,
      expl: steps(`Samen zijn de ${n} getallen ${n} × ${m} = ${n * m}.`, `De bekende getallen zijn samen ${v.join(' + ')} = ${s}.`, `Het ontbrekende getal is ${n * m} − ${s} = <b>${x}</b>.`) };
  });

  const FLOORC = [
    { N: [130, 480], c: [6, 10, 12], t: (N, c) => `Een boer heeft ${N} eieren. Hij verpakt ze in dozen van ${c} eieren.`, full: 'volle dozen', rest: 'eieren over', fq: 'Hoeveel volle dozen kan hij maken?', rq: 'Hoeveel eieren blijven er over?' },
    { N: [250, 900], c: [12, 24], t: (N, c) => `In een fabriek staan ${N} flessen klaar. Ze gaan in kratten van ${c} flessen.`, full: 'volle kratten', rest: 'flessen over', fq: 'Hoeveel volle kratten worden dat?', rq: 'Hoeveel flessen blijven er over?' },
    { N: [90, 260], c: [3, 4], t: (N, c) => `Een sportwinkel heeft ${N} tennisballen. Ze worden verpakt in kokers van ${c} ballen.`, full: 'volle kokers', rest: 'ballen over', fq: 'Hoeveel volle kokers zijn dat?', rq: 'Hoeveel ballen blijven er over?' },
    { N: [150, 600], c: [8, 15, 25], t: (N, c) => `Een bakker bakt ${N} koekjes en doet ze in zakjes van ${c} koekjes.`, full: 'volle zakjes', rest: 'koekjes over', fq: 'Hoeveel volle zakjes kan de bakker maken?', rq: 'Hoeveel koekjes blijven er over?' },
    { N: [200, 700], c: [14, 18, 24], t: (N, c) => `In de aula worden ${N} stoelen neergezet in rijen van ${c} stoelen.`, full: 'volle rijen', rest: 'stoelen over', fq: 'Hoeveel volle rijen worden het?', rq: 'Hoeveel stoelen blijven er over voor de laatste rij?' }
  ];
  const CEILC = [
    { N: [150, 700], c: [48, 52, 56], t: (N, c) => `Er gaan ${N} leerlingen op excursie. In één bus passen ${c} leerlingen.`, aq: 'Hoeveel bussen zijn er minstens nodig?', eq: 'De school bestelt zo min mogelijk bussen. Hoeveel zitplaatsen blijven er leeg?' },
    { N: [60, 250], c: [6, 8], t: (N, c) => `Bij de kabelbaan staan ${N} mensen te wachten. In één gondel passen ${c} mensen.`, aq: 'Hoeveel gondels zijn er minstens nodig om iedereen mee te nemen?', eq: 'Alle gondels gaan vol weg, behalve de laatste. Hoeveel plaatsen blijven er in de laatste gondel leeg?' },
    { N: [120, 500], c: [15, 18, 25], t: (N, c) => `Een bibliotheek verhuist ${N} boeken. In één doos passen ${c} boeken.`, aq: 'Hoeveel dozen zijn er minstens nodig?', eq: 'Alle dozen worden helemaal gevuld, behalve de laatste. Hoeveel boeken kunnen er nog bij in de laatste doos?' },
    { N: [90, 400], c: [24, 36], t: (N, c) => `Er willen ${N} auto's de rivier over. Op de veerboot passen ${c} auto's per overtocht.`, aq: 'Hoeveel overtochten zijn er minstens nodig?', eq: 'De boot vaart steeds vol, behalve bij de laatste overtocht. Hoeveel plekken blijven er dan leeg?' },
    { N: [40, 130], c: [4, 6], t: (N, c) => `Op schoolkamp slapen ${N} leerlingen in tenten. In één tent passen ${c} leerlingen.`, aq: 'Hoeveel tenten zijn er minstens nodig?', eq: 'Er worden zo min mogelijk tenten opgezet. Hoeveel slaapplaatsen blijven er leeg?' }
  ];
  def('AH11', 'A', 'H', 'A.4', 'Delen met rest', (L, r) => {
    const ceil = L === 2 ? r.chance(0.5) : L === 3 ? r.chance(0.5) : false;
    const C = r.pick(ceil ? CEILC : FLOORC), c = r.pick(C.c), N = r.int(C.N[0], C.N[1]), q = Math.floor(N / c), rest = N - q * c;
    if (rest === 0) throw RETRY;
    const base = `${N} : ${c} = ${q} rest ${rest}, want ${q} × ${c} = ${nf(q * c)} en ${N} − ${nf(q * c)} = ${rest}.`;
    if (ceil) {
      if (L === 3) return { type: 'num', q: p(C.t(N, c)) + ask(C.eq), ans: c - rest, expl: steps(base, `Er zijn dus ${q + 1} nodig, met samen ${q + 1} × ${c} = ${nf((q + 1) * c)} plaatsen.`, `${nf((q + 1) * c)} − ${N} = <b>${c - rest}</b>.`) };
      return { type: 'num', q: p(C.t(N, c)) + ask(C.aq), ans: q + 1, expl: steps(base, (rest === 1 ? `Met ${q} kom je er niet: er blijft er dan nog 1 over en die moet ook mee.` : `Met ${q} kom je er niet: de overige ${rest} moeten ook mee.`), `Er zijn er minstens <b>${q + 1}</b> nodig.`) };
    }
    if (L === 1) return { type: 'num', q: p(C.t(N, c)) + ask(C.fq), ans: q, expl: steps(base, `Dat zijn <b>${q}</b> ${C.full}.`) };
    if (L === 2) return { type: 'num', q: p(C.t(N, c)) + ask(C.rq), ans: rest, expl: steps(base, rest === 1 ? 'Er blijft er <b>1</b> over.' : `Er blijven er <b>${rest}</b> over.`) };
    return { type: 'multi', q: p(C.t(N, c)) + ask('Vul beide getallen in.'), fields: [{ ans: q, unit: C.full }, { ans: rest, unit: C.rest }],
      expl: steps(base, `Dus <b>${q}</b> ${C.full} en <b>${rest}</b> ${rest === 1 ? { 'eieren over': 'ei over', 'flessen over': 'fles over', 'ballen over': 'bal over', 'koekjes over': 'koekje over', 'stoelen over': 'stoel over' }[C.rest] || C.rest : C.rest}.`) };
  });

  def('AH12', 'A', 'H', 'A.1', 'Getallen in cijfers schrijven', (L, r) => {
    if (L === 1) {
      let n; do { n = r.int(10001, 99999); } while (String(n).indexOf('0') < 0 || n % 1000 === 0);
      return { type: 'num', q: p('Schrijf in cijfers:') + som(`<span class="wrd">${words(n)}</span>`), ans: n,
        expl: steps(`${words(Math.floor(n / 1000))}duizend is ${nf(Math.floor(n / 1000) * 1000)}.`, `Daar komt ${n % 1000} bij: <b>${nf(n)}</b>.`) + tip('Je typt het getal zonder punten: ' + n + '.') };
    }
    if (L === 2) {
      if (r.chance(0.5)) {
        const x = r.int(1, 25), y = r.int(1, 9), n = (10 * x + y) * 100000;
        return { type: 'num', q: p('Schrijf in cijfers:') + som(`${x},${y} miljoen`), ans: n,
          expl: steps('1 miljoen = 1.000.000 en 0,1 miljoen = 100.000.', `${x} miljoen = ${nf(x * 1e6)} en 0,${y} miljoen = ${nf(y * 1e5)}.`, `Samen: <b>${nf(n)}</b>.`) };
      }
      const m = r.int(2, 9), k = r.int(1, 99), n = m * 1e6 + k * 1000;
      return { type: 'num', q: p('Schrijf in cijfers:') + som(`<span class="wrd">${words(n)}</span>`), ans: n,
        expl: steps(`${words(m)} miljoen = ${nf(m * 1e6)}.`, `${words(k)}duizend = ${nf(k * 1000)}.`.replace(/^eenduizend/, 'duizend'), `Samen: <b>${nf(n)}</b>.`) };
    }
    if (r.chance(0.55)) {
      const x = r.int(1, 30), f = r.int(1, 3);
      if (f === 1) { const y = r.int(1, 9), n = x * 1e6 + y * 1e4; return { type: 'num', q: p('Schrijf in cijfers:') + som(`${x},0${y} miljoen`), ans: n, expl: steps(`${x} miljoen = ${nf(x * 1e6)}.`, `0,0${y} miljoen is ${y} honderdste miljoen: ${nf(y * 1e4)}.`, `Samen: <b>${nf(n)}</b>.`) + tip('Je typt het getal zonder punten.') }; }
      if (f === 2) { const y = r.int(1, 9), n = x * 1e9 + y * 1e8; return { type: 'num', q: p('Schrijf in cijfers:') + som(`${x},${y} miljard`), ans: n, expl: steps(`1 miljard = 1.000.000.000 en 0,1 miljard = 100.000.000.`, `${x} miljard = ${nf(x * 1e9)} en 0,${y} miljard = ${nf(y * 1e8)}.`, `Samen: <b>${nf(n)}</b>.`) + tip('Je typt het getal zonder punten.') }; }
      const y = r.int(11, 99), n = x * 1e6 + y * 1e4; if (y % 10 === 0) throw RETRY;
      return { type: 'num', q: p('Schrijf in cijfers:') + som(`${x},${y} miljoen`), ans: n, expl: steps(`${x} miljoen = ${nf(x * 1e6)}.`, `0,${y} miljoen = ${nf(y * 1e4)}.`, `Samen: <b>${nf(n)}</b>.`) + tip('Je typt het getal zonder punten.') };
    }
    const c = r.pick([
      ['2,05 miljard', 2050000000, '1 miljard = 1.000.000.000 en 0,05 miljard = 50.000.000.'],
      ['0,3 miljard', 300000000, '1 miljard = 1.000.000.000, dus 0,3 miljard is drie tiende daarvan.'],
      ['een kwart miljoen', 250000, 'Een kwart van 1.000.000 is 1.000.000 : 4.'],
      ['anderhalf miljoen', 1500000, 'Anderhalf is 1,5. Dus 1.000.000 + 500.000.'],
      ['een half miljard', 500000000, 'De helft van 1.000.000.000.'],
      ['driekwart miljoen', 750000, 'Driekwart van 1.000.000 is 3 × 250.000.'],
      ['4,25 miljoen', 4250000, '4 miljoen = 4.000.000 en 0,25 miljoen = 250.000.'],
      ['12,08 miljoen', 12080000, '12 miljoen = 12.000.000 en 0,08 miljoen = 80.000.'],
      ['1,007 miljard', 1007000000, '1 miljard = 1.000.000.000 en 0,007 miljard = 7.000.000.']
    ]);
    return { type: 'num', q: p('Schrijf in cijfers:') + som(c[0]), ans: c[1], expl: steps(c[2], `Het getal is <b>${nf(c[1])}</b>.`) + tip('Je typt het getal zonder punten.') };
  });

  def('AH13', 'A', 'H', 'A.4', 'Welk getal ontbreekt?', (L, r) => {
    let s, x, ex;
    if (L === 1) {
      const f = r.int(1, 3);
      if (f === 1) { const a = r.int(3, 9); x = r.int(3, 12); s = `${a} × ${gap} = ${a * x}`; ex = steps(`Draai de som om: ${a * x} : ${a} = <b>${x}</b>.`); }
      else if (f === 2) { const a = r.int(13, 68), c = r.pick([100, 120, 150, 200]); x = c - a; s = `${gap} + ${a} = ${c}`; ex = steps(`Draai de som om: ${c} − ${a} = <b>${x}</b>.`); }
      else { const a = r.int(3, 12); x = r.int(3, 9); s = `${a * x} : ${gap} = ${a}`; ex = steps(`${a * x} : ${a} = <b>${x}</b>. Controle: ${a * x} : ${x} = ${a}.`); }
    } else if (L === 2) {
      const f = r.int(1, 3);
      if (f === 1) { const a = r.int(125, 980), c = r.int(1005, 4200); x = a + c; s = `${gap} − ${nf(a)} = ${nf(c)}`; ex = steps(`Draai de som om: ${nf(c)} + ${nf(a)} = <b>${nf(x)}</b>.`); }
      else if (f === 2) { const [a, xs] = r.pick([[25, [8, 12, 16, 24, 40]], [50, [6, 14, 18, 24]], [125, [8, 16, 24]], [250, [4, 8, 12, 16]]]); x = r.pick(xs); s = `${a} × ${gap} = ${nf(a * x)}`; ex = steps(`Draai de som om: ${nf(a * x)} : ${a} = <b>${x}</b>.`); }
      else { const q = r.pick([20, 30, 40, 60, 80]); x = r.pick([20, 30, 40, 50, 60]); s = `${nf(q * x)} : ${gap} = ${q}`; ex = steps(`${nf(q * x)} : ${q} = <b>${x}</b>.`); }
    } else {
      const f = r.int(1, 3);
      if (f === 1) { const b = r.int(3, 8), a = r.int(5, 25); x = r.int(4, 30); const c = (x + a) * b; s = `(${gap} + ${a}) × ${b} = ${nf(c)}`; ex = steps(`Tussen haakjes moet ${nf(c)} : ${b} = ${(x + a)} staan.`, `${x + a} − ${a} = <b>${x}</b>.`); }
      else if (f === 2) { const a = r.int(3, 9), b = r.int(5, 30); x = r.int(6, 25); const c = a * x - b; s = `${a} × ${gap} − ${b} = ${c}`; ex = steps(`Voordat er ${b} afging, was het ${c} + ${b} = ${c + b}.`, `${c + b} : ${a} = <b>${x}</b>.`); }
      else { const b = r.int(4, 9); x = r.int(12, 60); const A = r.pick([500, 800, 1000, 1200]), c = A - x * b; s = `${nf(A)} − ${gap} × ${b} = ${nf(c)}`; ex = steps(`Er gaat ${nf(A)} − ${nf(c)} = ${nf(A - c)} af.`, `${nf(A - c)} : ${b} = <b>${x}</b>.`); }
    }
    return { type: 'num', q: p('Welk getal hoort op de puntjes?') + som(s), ans: x, expl: ex };
  });

  def('AH14', 'A', 'H', 'A.3', 'Getallen ordenen', (L, r) => {
    let items, ex;
    if (L === 1) {
      const d = r.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3).concat([0]), set = new Set();
      for (let i = 0; i < 40 && set.size < 4; i++) { const s = r.shuffle(d); if (s[0] !== 0) set.add(s[0] * 1000 + s[1] * 100 + s[2] * 10 + s[3]); }
      if (set.size < 4) throw RETRY;
      items = Array.from(set).map(v => ({ h: nf(v), v })); ex = 'Vergelijk eerst de duizendtallen, daarna de honderdtallen, dan de tientallen.';
    } else if (L === 2) {
      const set = new Set(); while (set.size < 5) set.add(r.int(-20, 20));
      const arr = Array.from(set); if (arr.filter(v => v < 0).length < 2) throw RETRY;
      items = arr.map(v => ({ h: nf(v), v })); ex = 'Negatieve getallen zijn kleiner dan positieve. Hoe verder onder nul, hoe kleiner het getal: −15 is kleiner dan −3.';
    } else if (r.chance(0.5)) {
      const set = new Set(); while (set.size < 5) set.add(r.int(85, 130) * 10000);
      items = Array.from(set).map(v => ({ h: r.chance(0.5) ? nf(v) : nf(v / 1e6) + ' miljoen', v })); ex = 'Schrijf alles op dezelfde manier, bijvoorbeeld voluit: 1,2 miljoen = 1.200.000 en 0,9 miljoen = 900.000.';
    } else {
      const a = r.int(1, 4), b = r.int(5, 9);
      items = [-(a * 1000 + b * 10), -(a * 1000 + b * 100), -(a * 1000 + b), -(a * 100 + b * 10), -(a * 100 + b)].map(v => ({ h: nf(v), v })); ex = 'Bij negatieve getallen is het getal met de meeste afstand tot nul het kleinst.';
    }
    const o = ordQ(r, items);
    return Object.assign(o, { q: p('Zet de getallen in de goede volgorde, van klein naar groot.'), expl: steps(ex, `De goede volgorde is: <b>${o.ans.map(i => o.items[i]).join(' &lt; ')}</b>.`) });
  });

  def('AH15', 'A', 'H', 'A.2', 'Rekentaal: som, verschil, product, quotiënt', (L, r) => {
    const DEF = 'Som is optellen, verschil is aftrekken, product is vermenigvuldigen en quotiënt is delen.';
    if (L === 1) {
      const f = r.int(1, 4);
      if (f === 1) { const a = r.int(120, 900), b = r.int(20, a - 15); return { type: 'num', q: p(`Wat is het verschil van ${a} en ${b}?`), ans: a - b, expl: steps(DEF, `${a} − ${b} = <b>${a - b}</b>.`) }; }
      if (f === 2) { const a = r.int(4, 12), b = r.int(6, 15); return { type: 'num', q: p(`Wat is het product van ${a} en ${b}?`), ans: a * b, expl: steps(DEF, `${a} × ${b} = <b>${a * b}</b>.`) }; }
      if (f === 3) { const b = r.int(4, 12), q = r.int(6, 15); return { type: 'num', q: p(`Wat is het quotiënt van ${b * q} en ${b}?`), ans: q, expl: steps(DEF, `${b * q} : ${b} = <b>${q}</b>.`) }; }
      const a = r.int(15, 90), b = r.int(15, 90), c = r.int(15, 90); return { type: 'num', q: p(`Wat is de som van ${a}, ${b} en ${c}?`), ans: a + b + c, expl: steps(DEF, `${a} + ${b} + ${c} = <b>${a + b + c}</b>.`) };
    }
    if (L === 2) {
      const f = r.int(1, 3);
      if (f === 1) { const a = r.int(4, 9), b = r.int(11, 19), d = r.int(4, 12), q = r.int(6, 14); return { type: 'num', q: p(`Tel het product van ${a} en ${b} op bij het quotiënt van ${d * q} en ${d}.`), ans: a * b + q, expl: steps(DEF, `Product: ${a} × ${b} = ${a * b}.`, `Quotiënt: ${d * q} : ${d} = ${q}.`, `${a * b} + ${q} = <b>${a * b + q}</b>.`) }; }
      if (f === 2) { const b = r.int(12, 60), a = b + r.int(8, 40), c = r.int(3, 9); return { type: 'num', q: p(`Vermenigvuldig het verschil van ${a} en ${b} met ${c}.`), ans: (a - b) * c, expl: steps(DEF, `Verschil: ${a} − ${b} = ${a - b}.`, `${a - b} × ${c} = <b>${(a - b) * c}</b>.`) }; }
      const a = r.int(20, 60), b = r.int(5, 18); return { type: 'num', q: p(`Trek het verschil van ${a} en ${b} af van de som van ${a} en ${b}.`), ans: 2 * b, expl: steps(DEF, `Som: ${a} + ${b} = ${a + b}.`, `Verschil: ${a} − ${b} = ${a - b}.`, `${a + b} − ${a - b} = <b>${2 * b}</b>.`) };
    }
    const f = r.int(1, 3);
    if (f === 1) { const a = r.int(6, 15), b = r.int(12, 30); return { type: 'num', q: p(`Het product van twee getallen is ${a * b}. Eén van de getallen is ${a}.`) + ask('Wat is de som van de twee getallen?'), ans: a + b, expl: steps(DEF, `Het andere getal is ${a * b} : ${a} = ${b}.`, `De som is ${a} + ${b} = <b>${a + b}</b>.`) }; }
    if (f === 2) { const d = r.pick([6, 8, 12, 16, 24]), k = r.int(2, 5), a = (k + 1) * d / 2, b = (k - 1) * d / 2; if (b < 2) throw RETRY; return { type: 'num', q: p(`Deel de som van ${a} en ${b} door het verschil van ${a} en ${b}.`), ans: k, expl: steps(DEF, `Som: ${a} + ${b} = ${a + b}.`, `Verschil: ${a} − ${b} = ${a - b}.`, `${a + b} : ${a - b} = <b>${k}</b>.`) }; }
    const a = 2 * r.int(4, 12), b = r.int(7, 15), c = r.int(8, Math.min(40, a * b / 2 - 3)); return { type: 'num', q: p(`Neem de helft van het product van ${a} en ${b}. Haal daar ${c} af.`) + ask('Welk getal krijg je?'), ans: a * b / 2 - c, expl: steps(DEF, `Product: ${a} × ${b} = ${a * b}.`, `De helft: ${a * b / 2}.`, `${a * b / 2} − ${c} = <b>${a * b / 2 - c}</b>.`) };
  });

  /* ================= niet-hoofdrekenen ================= */

  const DEST = ['het Openluchtmuseum', 'een pretpark', 'de dierentuin', 'een klimbos', 'het Spoorwegmuseum', 'een kinderboerderij', 'het strand'];
  def('AN01', 'A', 'N', 'A.4', 'Schoolreis met bussen', (L, r) => {
    const c = r.pick([48, 50, 52, 54, 56]);
    let n, b;
    do { n = r.int(L === 1 ? 60 : 95, L === 1 ? 150 : 260); b = r.int(L === 1 ? 4 : 8, L === 1 ? 10 : 22); } while ((n + b) % c === 0 || n + b < c + 5 || Math.ceil(n / c) === Math.ceil((n + b) / c) && L > 1);
    const k = Math.ceil((n + b) / c), price = r.pick([395, 420, 445, 475, 495, 520, 560]), ent = r.pick([6, 7, 8, 9, 11, 12]), dest = r.pick(DEST);
    const cnt = `Samen gaan er ${n} + ${b} = ${n + b} personen mee.`, bus = `${n + b} : ${c} = ${Math.floor((n + b) / c)} rest ${(n + b) % c}. Er zijn dus ${k} bussen nodig.`;
    if (L === 1) return { type: 'num', unit: 'bussen', q: p(`Een basisschool gaat op schoolreis naar ${dest}. Er gaan ${n} leerlingen en ${b} begeleiders mee. In één bus passen ${c} personen.`) + ask('Hoeveel bussen zijn er minstens nodig?'), ans: k,
      expl: steps(cnt, bus.replace('Er zijn dus', 'Er zijn dus minstens').replace(`${k} bussen nodig`, `<b>${k}</b> bussen nodig`)) + tip('De begeleiders hebben ook een zitplaats nodig.') };
    if (L === 2) return { type: 'num', pre: '€', q: p(`Een basisschool gaat op schoolreis naar ${dest}. Er gaan ${n} leerlingen en ${b} begeleiders mee. De entree is ${eur(ent)} per leerling. De school huurt bussen met ${c} zitplaatsen. Een bus kost ${eur(price)} per dag.`) + ask('Hoeveel betaalt de school in totaal voor de bussen?'), ans: k * price,
      expl: steps(cnt, bus, `${k} × ${eur(price)} = <b>${eur(k * price)}</b>.`) + tip('De entreeprijs heb je voor deze vraag niet nodig. De begeleiders tellen wel mee voor het aantal bussen.') };
    return { type: 'num', pre: '€', calc: true, q: p(`Een basisschool gaat op schoolreis naar ${dest}. Er gaan ${n} leerlingen en ${b} begeleiders mee. De entree is ${eur(ent)} per leerling; begeleiders mogen gratis naar binnen. Iedereen reist met de bus. De school huurt bussen met ${c} zitplaatsen voor ${eur(price)} per bus.`) + ask('Wat kost de schoolreis in totaal?'), ans: k * price + n * ent,
      expl: steps(cnt, bus, `Bussen: ${k} × ${eur(price)} = ${eur(k * price)}.`, `Entree: ${n} × ${eur(ent)} = ${eur(n * ent)}.`, `Samen: <b>${eur(k * price + n * ent)}</b>.`) + tip('Begeleiders betalen geen entree, maar zitten wel in de bus.') };
  });

  const ITEMS = [['tablets', [189, 219, 249, 279]], ['koptelefoons', [18, 24, 29, 35]], ['rekenmachines', [12, 14, 16, 19]], ['woordenboeken', [23, 27, 32]], ['leerlingstoelen', [48, 54, 62]], ['leerlingtafels', [85, 96, 115]], ['voetballen', [14, 17, 22]], ['atlassen', [26, 31, 38]]];
  def('AN02', 'A', 'N', 'A.4', 'Bestelling en budget', (L, r) => {
    const [i1, i2] = r.sample(ITEMS, 2), n1 = r.int(12, 32), p1 = r.pick(i1[1]), n2 = r.int(8, 30), p2 = r.pick(i2[1]), ship = r.pick([25, 35, 45]);
    if (L === 1) {
      const tot = n1 * p1, B = Math.ceil((tot + r.int(40, 400)) / 50) * 50;
      return { type: 'num', pre: '€', q: p(`Een school heeft een budget van ${eur(B)} voor nieuwe ${i1[0]}. De school bestelt ${n1} ${i1[0]} van ${eur(p1)} per stuk.`) + ask('Hoeveel euro blijft er over van het budget?'), ans: B - tot,
        expl: steps(`${n1} × ${eur(p1)} = ${eur(tot)}.`, `${eur(B)} − ${eur(tot)} = <b>${eur(B - tot)}</b>.`) };
    }
    if (L === 2) {
      const tot = n1 * p1 + n2 * p2, B = Math.ceil((tot + r.int(40, 400)) / 50) * 50;
      return { type: 'num', pre: '€', q: p(`Een school heeft dit jaar ${eur(B)} te besteden aan lesmateriaal. De school bestelt ${n1} ${i1[0]} van ${eur(p1)} per stuk en ${n2} ${i2[0]} van ${eur(p2)} per stuk.`) + ask('Hoeveel euro blijft er over?'), ans: B - tot,
        expl: steps(`${n1} × ${eur(p1)} = ${eur(n1 * p1)}.`, `${n2} × ${eur(p2)} = ${eur(n2 * p2)}.`, `Samen: ${eur(tot)}.`, `${eur(B)} − ${eur(tot)} = <b>${eur(B - tot)}</b>.`) };
    }
    const tot = n1 * p1 + n2 * p2 + ship, B = Math.floor((tot - r.int(60, 500)) / 50) * 50;
    return { type: 'num', pre: '€', calc: true, q: p(`Een school heeft nog ${eur(B)} over voor lesmateriaal. De directeur wil ${n1} ${i1[0]} van ${eur(p1)} per stuk en ${n2} ${i2[0]} van ${eur(p2)} per stuk bestellen. Voor de hele bestelling komt er één keer ${eur(ship)} verzendkosten bij.`) + ask('Hoeveel euro komt de school tekort?'), ans: tot - B,
      expl: steps(`${n1} × ${eur(p1)} = ${eur(n1 * p1)} en ${n2} × ${eur(p2)} = ${eur(n2 * p2)}.`, `Met verzendkosten: ${eur(n1 * p1)} + ${eur(n2 * p2)} + ${eur(ship)} = ${eur(tot)}.`, `Tekort: ${eur(tot)} − ${eur(B)} = <b>${eur(tot - B)}</b>.`) + tip('De verzendkosten tel je één keer mee, niet per stuk.') };
  });

  def('AN03', 'A', 'N', 'A.5', 'Gemiddelde in een verhaal', (L, r) => {
    const name = nm(r);
    if (L === 1) {
      const m = r.int(11, 22), v = []; let s = 0;
      for (let i = 0; i < 4; i++) { const x = m + r.int(-7, 7); v.push(x); s += x; }
      const last = 5 * m - s; if (last < 4 || Math.abs(last - m) > 9) throw RETRY; v.push(last);
      return { type: 'num', unit: 'km', q: p(`${name} fietst vijf dagen naar school en houdt bij hoeveel kilometer dat per dag is: ${en(v)} km.`) + ask('Hoeveel kilometer fietst ' + name + ' gemiddeld per dag?'), ans: m,
        expl: steps(`Tel alles op: ${v.join(' + ')} = ${5 * m}.`, `Deel door 5 dagen: ${5 * m} : 5 = <b>${m}</b> km.`) };
    }
    if (L === 2) {
      const k = r.pick([3, 4, 5]), m = r.int(60, 80), m2 = m + r.pick([-4, -3, -2, 2, 3, 4, 5]), x = (k + 1) * m2 - k * m;
      if (x < 30 || x > 100) throw RETRY;
      return { type: 'num', unit: 'punten', q: p(`${name} heeft ${k} toetsen gemaakt. Gemiddeld haalde ${name} ${m} punten per toets. Voor de volgende toets haalt ${name} ${x} punten.`) + ask(`Wat is het gemiddelde van ${name} na ${k + 1} toetsen?`), ans: m2,
        expl: steps(`Na ${k} toetsen is het totaal ${k} × ${m} = ${k * m} punten.`, `Met de nieuwe toets: ${k * m} + ${x} = ${k * m + x} punten.`, `${k * m + x} : ${k + 1} = <b>${m2}</b> punten.`) + tip(`Je mag ${m} en ${x} niet zomaar middelen: de eerste ${k} toetsen tellen ${k} keer mee.`) };
    }
    if (r.chance(0.5)) {
      const M = r.int(65, 75), v = []; let s = 0;
      for (let i = 0; i < 4; i++) { const x = M + r.int(-14, 12); v.push(x); s += x; }
      const need = 5 * M - s; if (need < 40 || need > 98 || need === M) throw RETRY;
      return { type: 'num', unit: 'punten', q: p(`Voor een vak moet ${name} over vijf toetsen gemiddeld minstens ${M} punten halen. De eerste vier toetsen leverden ${en(v)} punten op.`) + ask('Hoeveel punten moet ' + name + ' minstens halen voor de vijfde toets?'), ans: need,
        expl: steps(`Voor gemiddeld ${M} zijn in totaal 5 × ${M} = ${5 * M} punten nodig.`, `Er zijn al ${v.join(' + ')} = ${s} punten.`, `Nog nodig: ${5 * M} − ${s} = <b>${need}</b> punten.`) };
    }
    const m = r.int(-3, 2), v = []; let s = 0;
    for (let i = 0; i < 6; i++) { const x = m + r.int(-4, 4); v.push(x); s += x; }
    const last = 7 * m - s; if (Math.abs(last - m) > 5) throw RETRY; v.push(last);
    if (v.filter(x => x < 0).length < 2) throw RETRY;
    return { type: 'num', unit: '°C', q: p(`In een week in januari is elke ochtend om 7 uur de temperatuur gemeten: ${en(v.map(x => nf(x)))} °C.`) + ask('Wat was de gemiddelde temperatuur?'), ans: m,
      expl: steps(`Tel de temperaturen op: ${v.map(x => x < 0 ? '(' + nf(x) + ')' : x).join(' + ')} = ${nf(7 * m)}.`, `Deel door 7 dagen: ${nf(7 * m)} : 7 = <b>${nf(m)}</b> °C.`) };
  });

  def('AN04', 'A', 'N', 'A.4', 'Onder nul: saldo en temperatuur', (L, r) => {
    const name = nm(r);
    if (L < 3 && r.chance(0.3)) {
      const cities = r.sample(['Oslo', 'Rome', 'Helsinki', 'Madrid', 'Stockholm', 'Athene', 'Moskou', 'Lissabon'], 2), lo = -r.int(3, 18), hi = r.int(2, 16);
      if (L === 1) return { type: 'num', unit: 'graden', q: p(`Op een dag in februari is het in ${cities[0]} ${nf(lo)}${NB}°C en in ${cities[1]} ${hi}${NB}°C.`) + ask('Hoeveel graden is het verschil?'), ans: hi - lo,
        expl: steps(`Van ${nf(lo)} tot 0 is ${-lo} graden.`, `Van 0 tot ${hi} is ${hi} graden.`, `Samen: ${-lo} + ${hi} = <b>${hi - lo}</b> graden.`) };
      const d1 = r.int(6, 20), d2 = r.int(3, 9);
      return { type: 'num', unit: '°C', q: p(`In ${cities[0]} is het 's nachts ${nf(lo)}${NB}°C. Overdag is het ${d1} graden warmer dan 's nachts. De nacht daarna is het ${d2} graden kouder dan de eerste nacht.`) + ask('Hoe koud is het in de tweede nacht?'), ans: lo - d2,
        expl: steps(`De tweede nacht is ${d2} graden kouder dan de eerste nacht.`, `${nf(lo)} − ${d2} = <b>${nf(lo - d2)}</b> °C.`) + tip(`De temperatuur overdag (${nf(lo + d1)} °C) heb je niet nodig: de vergelijking is met de eerste nacht.`) };
    }
    if (L === 1) {
      const S = r.int(60, 420), A = S + r.int(35, 380);
      return { type: 'num', pre: '€', q: p(`Op de bankrekening van ${name} staat ${eur(S)}. Er wordt ${eur(A)} afgeschreven voor de huur.`) + ask('Wat is het saldo daarna?'), ans: S - A,
        expl: steps(`${S} − ${A} komt onder nul uit.`, `${A} − ${S} = ${A - S}, dus het saldo is <b>${nf(S - A)}</b> euro.`) + tip('Een saldo onder nul vul je in met een minteken.') };
    }
    if (L === 2) {
      const S = r.int(120, 620), sal = r.int(165, 240) * 10, rent = r.int(62, 98) * 10 + 5, shop = r.int(85, 260), lim = r.pick([500, 1000, 1500]);
      const ans = -S + sal - rent - shop;
      return { type: 'num', pre: '€', q: p(`${name} staat ${eur(S)} rood: het saldo is ${eur(-S)}. De bank staat toe dat ${name} maximaal ${eur(lim)} rood staat. Deze week wordt het salaris van ${eur(sal)} bijgeschreven. Daarna gaan de huur van ${eur(rent)} en ${eur(shop)} aan boodschappen eraf.`) + ask('Wat is het saldo aan het eind van de week?'), ans,
        expl: steps(`${eur(-S)} + ${eur(sal)} = ${eur(sal - S)}.`, `${eur(sal - S)} − ${eur(rent)} = ${eur(sal - S - rent)}.`, `${eur(sal - S - rent)} − ${eur(shop)} = <b>${eur(ans)}</b>.`) + tip('Het bedrag dat je maximaal rood mag staan, heb je niet nodig.') };
    }
    const S = r.int(90, 480), E = r.int(120, 640), bij = r.int(160, 260) * 10, af = -S + bij - E;
    return { type: 'num', pre: '€', q: p(`Op 1 maart is het saldo van ${name} ${eur(-S)}. Op 31 maart is het saldo ${eur(E)}. In maart is er in totaal ${eur(bij)} bijgeschreven.`) + ask('Hoeveel euro is er in maart in totaal afgeschreven?'), ans: af,
      expl: steps(`Begin plus bijschrijvingen: ${eur(-S)} + ${eur(bij)} = ${eur(bij - S)}.`, `Aan het eind staat er ${eur(E)}.`, `Er is dus ${eur(bij - S)} − ${eur(E)} = <b>${eur(af)}</b> afgeschreven.`) };
  });

  def('AN05', 'A', 'N', 'A.1', 'Rekenen met miljoenen en miljarden', (L, r) => {
    if (L === 1) {
      const x = r.int(11, 39), z = 5000 * r.int(4, 19), n = x * 100000 + z;
      return { type: 'num', q: p(`Een stad heeft ${nf(x / 10)} miljoen inwoners. In tien jaar komen er ${nf(z)} inwoners bij.`) + ask('Hoeveel inwoners heeft de stad dan? Schrijf het getal voluit.'), ans: n,
        expl: steps(`${nf(x / 10)} miljoen = ${nf(x * 100000)}.`, `${nf(x * 100000)} + ${nf(z)} = <b>${nf(n)}</b>.`) + tip('Je typt het getal zonder punten.') };
    }
    if (L === 2) {
      const P = r.pick([1500, 2000, 2500, 3000, 4000]), I = r.pick([200000, 400000, 500000, 800000]), G = P * I / 1e9, old = r.pick([20, 35, 40, 60, 80]);
      return { type: 'num', pre: '€', q: p(`Een gemeente met ${nf(I)} inwoners geeft dit jaar €${NB}${nf(G)} miljard uit. Dat is €${NB}${old} miljoen meer dan vorig jaar.`) + ask('Hoeveel euro geeft de gemeente dit jaar gemiddeld uit per inwoner?'), ans: P,
        expl: steps(`${nf(G)} miljard = ${nf(P * I)}.`, `${nf(P * I)} : ${nf(I)} = <b>${nf(P)}</b> euro per inwoner.`, 'Handig: streep bij beide getallen evenveel nullen weg.') + tip('Het verschil met vorig jaar heb je niet nodig.') };
    }
    const v = r.pick([0.5, 1.5, 2.5, 3.5, 4.5, 0.25, 1.25, 0.75]), k = r.int(3, 9), ans = rnd(v * k * 12, 2);
    return { type: 'num', unit: 'miljoen', q: p(`Een nieuwssite heeft ${nf(v)} miljoen bezoekers per maand. Elke bezoeker bekijkt gemiddeld ${k} pagina's per maand.`) + ask(`Hoeveel miljoen pagina's worden er in een heel jaar bekeken?`), ans,
      expl: steps(`Per maand: ${nf(v)} miljoen × ${k} = ${nf(v * k)} miljoen pagina's.`, `Per jaar: ${nf(v * k)} miljoen × 12 = <b>${nf(ans)}</b> miljoen pagina's.`) };
  });

  const PROD = [['machine', 'vult', 'flessen', 'kratten', 24, 'krat'], ['oven', 'bakt', 'broodjes', 'dozen', 30, 'doos'], ['drukpers', 'drukt', 'folders', 'pakken', 50, 'pak'], ['inpakrobot', 'verpakt', 'repen chocolade', 'dozen', 36, 'doos']];
  def('AN06', 'A', 'N', 'A.4', 'Productie per minuut en per uur', (L, r) => {
    const [m, verb, it, boxes, c, box] = r.pick(PROD);
    if (L === 1) {
      const R = r.pick([120, 150, 180, 240]), [tw, t] = r.pick([['een kwartier', 15], ['een half uur', 30], ['20 minuten', 20], ['drie kwartier', 45]]);
      return { type: 'num', unit: it, q: p(`Een ${m} ${verb} ${R} ${it} per minuut.`) + ask(`Hoeveel ${it} zijn dat in ${tw}?`), ans: R * t,
        expl: t === 20 ? steps(`${t} × ${R} = <b>${nf(R * t)}</b> ${it}.`) : steps(`${tw.charAt(0).toUpperCase() + tw.slice(1)} is ${t} minuten.`, `${t} × ${R} = <b>${nf(R * t)}</b> ${it}.`) };
    }
    if (L === 2) {
      const R = r.pick([120, 150, 180, 240, 300]), [hw, hmin] = r.pick([['één uur', 60], ['twee uur', 120], ['anderhalf uur', 90]]);
      if ((R * hmin) % c !== 0) throw RETRY;
      return { type: 'num', unit: boxes, calc: true, q: p(`Een ${m} ${verb} ${R} ${it} per minuut. De ${it} gaan in ${boxes} van ${c} stuks. De ${m} draait ${hw} achter elkaar.`) + ask(`Hoeveel volle ${boxes} levert dat op?`), ans: R * hmin / c,
        expl: steps(`${hw.charAt(0).toUpperCase() + hw.slice(1)} is ${hmin} minuten.`, `${hmin} × ${R} = ${nf(R * hmin)} ${it}.`, `${nf(R * hmin)} : ${c} = <b>${nf(R * hmin / c)}</b> ${boxes}.`) };
    }
    const Ra = r.pick([150, 180, 210, 240]), Rb = r.pick([120, 140, 160]), start = 8 * 60 + r.pick([0, 15, 30]), dur = r.pick([150, 180, 210, 240]), idle = r.pick([20, 30, 45]);
    const ans = Ra * dur + Rb * (dur - idle);
    return { type: 'num', unit: it, calc: true, q: p(`In een fabriek staan twee machines. Machine A ${verb} ${Ra} ${it} per minuut en machine B ${Rb} ${it} per minuut. Beide machines starten om ${klok(start)} uur en stoppen om ${klok(start + dur)} uur. Machine B staat tussendoor ${idle} minuten stil door een storing.`) + ask(`Hoeveel ${it} leveren de twee machines samen op?`), ans,
      expl: steps(`Van ${klok(start)} tot ${klok(start + dur)} uur is ${dur} minuten.`, `Machine A: ${dur} × ${Ra} = ${nf(Ra * dur)}.`, `Machine B draait ${dur} − ${idle} = ${dur - idle} minuten: ${dur - idle} × ${Rb} = ${nf(Rb * (dur - idle))}.`, `Samen: <b>${nf(ans)}</b> ${it}.`) };
  });

  def('AN07', 'A', 'N', 'A.2', 'Welke berekening hoort erbij?', (L, r) => {
    const name = nm(r);
    let t, qq = 'Met welke berekening reken je het totale bedrag uit?', good, bad, why;
    if (L === 1) {
      const n = r.int(24, 32), k = r.int(2, 5), pr = r.int(6, 12);
      t = `Een klas van ${n} leerlingen gaat naar het museum. Op de dag zelf zijn ${k} leerlingen ziek en blijven thuis. De entree is ${eur(pr)} per leerling.`;
      good = `(${n} − ${k}) × ${pr}`; bad = [`${n} − ${k} × ${pr}`, `(${n} + ${k}) × ${pr}`, `${n} × ${pr} − ${k}`];
      why = [`Eerst het aantal leerlingen dat meegaat: ${n} − ${k}. Daar staan haakjes om, want dit moet je eerst uitrekenen.`, 'Daarna keer de prijs per leerling.', `Zonder haakjes reken je eerst ${k} × ${pr} uit, en dat past niet bij het verhaal.`];
    } else if (L === 2 && r.chance(0.5)) {
      const a = r.int(2, 4), pa = r.int(12, 19), k = r.int(2, 5), pk = r.int(6, 9);
      if (a === k) throw RETRY; // anders is het verwisselde antwoord ook goed
      t = `Een gezin gaat naar het zwembad: ${a} volwassenen en ${k} kinderen. Een kaartje kost ${eur(pa)} voor een volwassene en ${eur(pk)} voor een kind.`;
      good = `${a} × ${pa} + ${k} × ${pk}`; bad = [`(${a} + ${k}) × (${pa} + ${pk})`, `${a} × ${pk} + ${k} × ${pa}`, `(${a} + ${k}) × ${pa}`];
      why = [`Volwassenen: ${a} × ${pa}. Kinderen: ${k} × ${pk}.`, 'De twee bedragen tel je bij elkaar op.', 'Let goed op welk aantal bij welke prijs hoort.'];
    } else if (L === 2) {
      const a = r.pick([50, 75, 100]), c = r.int(3, 5), b = r.int(8, 14);
      if (c * b >= a) throw RETRY;
      t = `${name} heeft ${eur(a)} in de portemonnee en koopt ${c} boeken van ${eur(b)} per stuk.`; qq = 'Met welke berekening reken je uit hoeveel geld er overblijft?';
      good = `${a} − ${c} × ${b}`; bad = [`(${a} − ${c}) × ${b}`, `${a} − ${c} + ${b}`, `${a} : ${c} − ${b}`];
      why = [`De boeken kosten samen ${c} × ${b}.`, `Dat bedrag gaat van ${a} af.`, 'Haakjes zijn niet nodig: vermenigvuldigen gaat altijd voor aftrekken.'];
    } else if (r.chance(0.5)) {
      const n = r.int(24, 32), k = r.int(2, 5), pr = r.int(6, 12), bus = r.pick([180, 220, 250, 310]);
      t = `Een klas van ${n} leerlingen gaat met de bus naar het theater. Op de dag zelf zijn ${k} leerlingen ziek. De school betaalt ${eur(pr)} per leerling die meegaat en ${eur(bus)} voor de bus.`;
      good = `(${n} − ${k}) × ${pr} + ${bus}`; bad = [`${n} − ${k} × ${pr} + ${bus}`, `(${n} − ${k}) × (${pr} + ${bus})`, `${n} × ${pr} − ${k} + ${bus}`];
      why = [`Aantal leerlingen dat meegaat: (${n} − ${k}).`, `Kaartjes: dat aantal keer ${pr}.`, `De bus komt er één keer bij: + ${bus}.`];
    } else {
      const n = r.int(8, 24), pr = r.int(14, 28), k = r.int(2, 5);
      if (n === pr) throw RETRY; // anders is (n − k) × prijs toevallig ook goed
      t = `Een kaartje voor de dierentuin kost ${eur(pr)}. Met een kortingspas krijg je ${eur(k)} korting per kaartje. Een groep van ${n} mensen koopt voor iedereen een kaartje met de kortingspas.`;
      good = `${n} × (${pr} − ${k})`; bad = [`${n} × ${pr} − ${k}`, `(${n} − ${k}) × ${pr}`, `${n} × ${pr} × ${k}`];
      why = [`Eén kaartje met korting kost ${pr} − ${k}.`, `Dat geldt voor alle ${n} mensen, dus de korting staat tussen haakjes bij de prijs.`, `Bij ${n} × ${pr} − ${k} krijgt de hele groep maar één keer korting.`];
    }
    return Object.assign(mcTxt(r, good, bad), { q: p(t) + ask(qq), expl: steps(why[0], why[1], why[2], `De goede berekening is <b>${good}</b>.`) });
  });

  def('AN08', 'A', 'N', 'A.3', 'Schatten in een verhaal', (L, r) => {
    const near = (base, pct) => { const d = Math.max(1, Math.round(base * pct)); return base + r.pick([-1, 1]) * r.int(1, d); };
    let t, est, exact, calcTxt, opts;
    if (L === 1) { const A = 10 * r.int(2, 6), B = 10 * r.int(3, 6), a = near(A, 0.06), b = near(B, 0.05); t = `Op een pallet staan ${a} dozen. In elke doos zitten ${b} pakken koffie.`; est = A * B; exact = a * b; calcTxt = `${a} is ongeveer ${A} en ${b} is ongeveer ${B}: ${A} × ${B} = ${nf(est)}.`; t += '|Hoeveel pakken koffie staan er ongeveer op de pallet?'; }
    else if (L === 2) {
      if (r.chance(0.5)) { const A = 2 * r.int(8, 16), B = 500 * r.int(3, 5), a = A, b = near(B, 0.03); t = `Een stadion heeft ${a} vakken met elk ongeveer ${nf(b)} zitplaatsen.|Hoeveel toeschouwers passen er ongeveer in het stadion?`; est = A * B; exact = a * b; calcTxt = `${nf(b)} is ongeveer ${nf(B)}: ${a} × ${nf(B)} = ${nf(est)}.`; }
      else { const A = 100 * r.int(3, 9), B = 10 * r.int(3, 6), a = near(A, 0.03), b = near(B, 0.04); t = `Op een school zitten ${a} leerlingen. Voor het schoolreisje betaalt elke leerling ${eur(b)}.|Hoeveel euro haalt de school ongeveer op?`; est = A * B; exact = a * b; calcTxt = `${a} is ongeveer ${A} en ${b} is ongeveer ${B}: ${A} × ${B} = ${nf(est)}.`; }
    } else { const A = 1000 * r.pick([150, 200, 250, 300, 400]), B = 10 * r.int(2, 4), a = near(A, 0.015), b = near(B, 0.04); t = `Een krant heeft ${nf(a)} abonnees. Zij betalen ${eur(b)} per maand.|Hoeveel euro ontvangt de krant ongeveer per jaar aan abonnementsgeld?`; est = A * B * 12; exact = a * b * 12; calcTxt = `${nf(a)} is ongeveer ${nf(A)} en ${b} is ongeveer ${B}. Per maand: ${nf(A)} × ${B} = ${nf(A * B)}. Per jaar: × 12 = ${nf(est)}.`; }
    opts = [est / 10, est * 10, L === 3 ? est / 12 : est / 2];
    if ([est].concat(opts).some(o => o !== est && Math.abs(o - exact) <= Math.abs(est - exact))) throw RETRY;
    const [story, question] = t.split('|');
    return Object.assign(mcNum(r, est, opts), { q: p(story) + ask(question), expl: steps('Rond af op makkelijke getallen.', calcTxt, `Het antwoord is ongeveer <b>${nf(est)}</b>.`) + (L === 3 ? tip('Er wordt naar een heel jaar gevraagd, dus 12 maanden.') : '') });
  });

  def('AN09', 'A', 'N', 'A.3', 'Afronden in een verhaal', (L, r) => {
    if (L === 1) { const n = r.int(10210, 48960); if (n % 100 === 0) throw RETRY; return { type: 'num', q: p(`Bij een concert waren ${nf(n)} bezoekers. In de krant wordt dit aantal afgerond op honderdtallen.`) + ask('Welk getal staat er in de krant?'), ans: Math.round(n / 100) * 100, expl: roundEx(n, 100) }; }
    if (L === 2) {
      let n = r.int(112000, 878000); if (r.chance(0.4)) n = Math.floor(n / 10000) * 10000 + 10000 - r.int(1, 500); if (n % 1000 === 0) throw RETRY;
      return { type: 'num', q: p(`Een gemeente telt ${nf(n)} inwoners. Op de website wordt dit afgerond op duizendtallen.`) + ask('Welk getal staat er op de website?'), ans: Math.round(n / 1000) * 1000, expl: roundEx(n, 1000) };
    }
    if (r.chance(0.5)) {
      const pack = r.pick([25, 50]), n = r.int(430, 1870); if (n % pack === 0) throw RETRY; const ans = Math.ceil(n / pack) * pack;
      return { type: 'num', unit: 'stoelen', q: p(`Voor een festival zijn ${nf(n)} stoelen nodig. De verhuurder levert stoelen alleen in stapels van ${pack} stuks.`) + ask('Hoeveel stoelen moet de organisatie minstens huren?'), ans,
        expl: steps(`${nf(n)} : ${pack} = ${Math.floor(n / pack)} rest ${n % pack}.`, `Met ${Math.floor(n / pack)} stapels zijn er te weinig stoelen. Er zijn ${Math.ceil(n / pack)} stapels nodig.`, `${Math.ceil(n / pack)} × ${pack} = <b>${nf(ans)}</b> stoelen.`) + tip('Hier rond je altijd naar boven af, ook als de rest klein is.') };
    }
    const n = r.int(102000000, 987000000); if (n % 1e6 === 0) throw RETRY; const ans = Math.round(n / 1e6);
    return { type: 'num', unit: 'miljoen euro', q: p(`Een bedrijf heeft een jaaromzet van ${eur(n)}. In het jaarverslag wordt dit afgerond op miljoenen euro's.`) + ask('Hoeveel miljoen euro staat er in het jaarverslag?'), ans, expl: roundEx(n, 1000000, `, dus <b>${ans}</b> miljoen euro`) };
  });

  def('AN10', 'A', 'N', 'A.4', 'Kwadraat en wortel in een verhaal', (L, r) => {
    if (L === 1) {
      const n = r.int(7, 15);
      if (r.chance(0.5)) return { type: 'num', unit: 'm²', q: p(`Een vierkant schoolplein heeft zijden van ${n} meter.`) + ask('Wat is de oppervlakte van het plein?'), ans: n * n, expl: steps(`Oppervlakte van een vierkant = zijde × zijde.`, `${n} × ${n} = <b>${n * n}</b> m².`) };
      return { type: 'num', unit: 'm', q: p(`Een vierkant schoolplein heeft een oppervlakte van ${n * n} m².`) + ask('Hoe lang is één zijde van het plein?'), ans: n, expl: steps(`Zoek het getal dat met zichzelf vermenigvuldigd ${n * n} geeft.`, `${n} × ${n} = ${n * n}, dus een zijde is <b>${n}</b> m.`) };
    }
    if (L === 2) { let n; do { n = r.int(21, 59); } while (n % 10 === 0); return { type: 'num', unit: 'm', calc: true, q: p(`Een vierkant plein heeft een oppervlakte van ${nf(n * n)} m².`) + ask('Hoe lang is één zijde van het plein?'), ans: n, expl: steps(`De zijde is de wortel van de oppervlakte: √${nf(n * n)}.`, `Controle: ${n} × ${n} = ${nf(n * n)}. De zijde is <b>${n}</b> m.`) }; }
    if (r.chance(0.5)) { const a = r.int(12, 20), b = a + r.int(2, 5); return { type: 'num', unit: 'tegels', calc: true, q: p(`Een vierkant terras bestaat uit ${a} rijen van ${a} tegels. Het terras wordt vergroot tot een vierkant van ${b} rijen van ${b} tegels.`) + ask('Hoeveel tegels komen erbij?'), ans: b * b - a * a, expl: steps(`Nieuw terras: ${b} × ${b} = ${b * b} tegels.`, `Oud terras: ${a} × ${a} = ${a * a} tegels.`, `${b * b} − ${a * a} = <b>${b * b - a * a}</b> tegels.`) + tip(`Het is niet genoeg om ${b} − ${a} = ${b - a} te kwadrateren.`) }; }
    let n; do { n = r.int(21, 59); } while (n % 10 === 0);
    return { type: 'num', unit: 'm', calc: true, q: p(`Een vierkante speelweide heeft een oppervlakte van ${nf(n * n)} m². Rond de hele weide komt een hek.`) + ask('Hoeveel meter hek is er nodig?'), ans: 4 * n, expl: steps(`Zijde: √${nf(n * n)} = ${n} m.`, `Een vierkant heeft vier gelijke zijden: 4 × ${n} = <b>${4 * n}</b> m.`) };
  });

  const WISH = [['fiets', [349, 429, 549, 679]], ['laptop', [499, 649, 799]], ['gitaar', [189, 259, 329]], ['telefoon', [279, 399, 459]], ['spelcomputer', [289, 349, 519]]];
  def('AN11', 'A', 'N', 'A.4', 'Sparen: tekort of over', (L, r) => {
    const name = nm(r), [it, ps] = r.pick(WISH), P = r.pick(ps), w = r.pick([12, 15, 18, 20, 25, 35]), H = r.int(3, 12) * 10;
    const weeksNeed = Math.ceil((P - H) / w);
    if (L === 1) { const k = r.int(6, 14); return { type: 'num', pre: '€', q: p(`${name} spaart voor een ${it} van ${eur(P)}. ${name} heeft al ${eur(H)} en legt elke week ${eur(w)} opzij.`) + ask(`Hoeveel euro heeft ${name} na ${k} weken?`), ans: H + k * w, expl: steps(`In ${k} weken: ${k} × ${eur(w)} = ${eur(k * w)}.`, `Met het beginbedrag: ${eur(H)} + ${eur(k * w)} = <b>${eur(H + k * w)}</b>.`) + tip(`De prijs van de ${it} heb je hier niet nodig.`) }; }
    if (L === 2) { const k = r.int(4, Math.max(5, weeksNeed - 2)); const short = P - H - k * w; if (short <= 0) throw RETRY; return { type: 'num', pre: '€', q: p(`${name} spaart voor een ${it} van ${eur(P)}. ${name} heeft al ${eur(H)} en legt elke week ${eur(w)} opzij.`) + ask(`Hoeveel euro komt ${name} na ${k} weken nog tekort?`), ans: short, expl: steps(`Na ${k} weken: ${eur(H)} + ${k} × ${eur(w)} = ${eur(H + k * w)}.`, `Tekort: ${eur(P)} − ${eur(H + k * w)} = <b>${eur(short)}</b>.`) }; }
    if ((P - H) % w === 0) throw RETRY;
    return { type: 'num', unit: 'weken', q: p(`${name} spaart voor een ${it} van ${eur(P)}. ${name} heeft al ${eur(H)} en legt elke week ${eur(w)} opzij.`) + ask(`Na hoeveel weken sparen kan ${name} de ${it} op zijn vroegst kopen?`), ans: weeksNeed,
      expl: steps(`Nog nodig: ${eur(P)} − ${eur(H)} = ${eur(P - H)}.`, `${P - H} : ${w} = ${Math.floor((P - H) / w)} rest ${(P - H) % w}.`, `Na ${Math.floor((P - H) / w) === 1 ? '1 week' : Math.floor((P - H) / w) + ' weken'} is er nog net te weinig. Het lukt na <b>${weeksNeed}</b> ${weeksNeed === 1 ? 'week' : 'weken'}.`) + tip('Je rondt hier naar boven af: een halve week sparen bestaat niet.') };
  });

  def('AN12', 'A', 'N', 'A.4', 'Stoelen en opbrengst in een zaal', (L, r) => {
    const R = r.int(14, 22), a = r.int(4, 8), s1 = r.pick([18, 20, 22, 24]), s2 = s1 + r.pick([2, 4, 6]), seats = a * s1 + (R - a) * s2, p1 = r.pick([28, 32, 35, 38]), p2 = p1 - r.pick([6, 8, 9]);
    const st = `De eerste ${a} rijen: ${a} × ${s1} = ${a * s1} stoelen.`, st2 = `De overige ${R} − ${a} = ${R - a} rijen: ${R - a} × ${s2} = ${(R - a) * s2} stoelen.`;
    const zaal = `Een theaterzaal heeft ${R} rijen. De eerste ${a} rijen hebben elk ${s1} stoelen. Alle andere rijen hebben elk ${s2} stoelen.`;
    if (L === 1) return { type: 'num', unit: 'stoelen', q: p(zaal) + ask('Hoeveel stoelen staan er in de zaal?'), ans: seats, expl: steps(st, st2, `Samen: <b>${nf(seats)}</b> stoelen.`) + tip(`Er zijn ${R - a} overige rijen, niet ${R}.`) };
    if (L === 2) return { type: 'num', pre: '€', calc: true, q: p(zaal + ` Een kaartje kost ${eur(p2)}.`) + ask('Wat is de opbrengst als de zaal helemaal is uitverkocht?'), ans: seats * p2, expl: steps(st, st2, `Samen: ${nf(seats)} stoelen.`, `${nf(seats)} × ${eur(p2)} = <b>${eur(seats * p2)}</b>.`) };
    const ans = a * s1 * p1 + (R - a) * s2 * p2;
    return { type: 'num', pre: '€', calc: true, q: p(zaal + ` Een kaartje voor de eerste ${a} rijen kost ${eur(p1)}. Voor de andere rijen kost een kaartje ${eur(p2)}.`) + ask('Wat is de opbrengst als de zaal helemaal is uitverkocht?'), ans,
      expl: steps(`${st} Opbrengst: ${a * s1} × ${eur(p1)} = ${eur(a * s1 * p1)}.`, `${st2} Opbrengst: ${(R - a) * s2} × ${eur(p2)} = ${eur((R - a) * s2 * p2)}.`, `Samen: <b>${eur(ans)}</b>.`) };
  });
})();
