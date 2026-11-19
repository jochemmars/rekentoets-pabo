/* Domein B · Verhoudingen, procenten, breuken en decimale getallen · hoofdrekenen */
import { nf, eur, fr, frs } from '../../core/notatie';
import { gcd, lcm, rnd } from '../../core/rekenen';
import { def, RETRY, steps, tip, som, p, ask, mcTxt, ordQ, nm } from '../../core/opbouw';
import { F } from '../../figuren';
import type { Rng } from '../../core/rng';
import { f6, gap } from '../hulp';

const proper = (r: Rng, b: number) => {
  let a: number;
  do {
    a = r.int(1, b - 1);
  } while (gcd(a, b) !== 1);
  return a;
};
const mixed = (w: number, a: number, b: number) => (w || '') + fr(a, b);
// geen twijfelgevallen bij afronden: het cijfer na de laatste decimaal mag geen losse 5 zijn

def('BH01', 'B', 'H', 'B.3', 'Kommagetallen optellen en aftrekken', (L, r) => {
  let t; // termen in duizendsten, met teken
  if (L === 1) {
    if (r.chance(0.5)) {
      const a = 100 * r.int(1, 9),
        b = 10 * r.int(11, 89);
      if (b % 100 === 0) throw RETRY;
      t = [a, b];
    } else {
      const a = 100 * r.int(11, 49),
        b = 10 * r.int(5, 95);
      if (b % 100 === 0 || b >= a) throw RETRY;
      t = [a, -b];
    }
  } else if (L === 2) {
    if (r.chance(0.5)) {
      const a = 10 * r.int(51, 98),
        b = r.int(101, 499);
      if (b % 10 === 0 || b >= a) throw RETRY;
      t = [a, -b];
    } else {
      const a = 10 * r.int(101, 899),
        b = r.int(1001, 3999);
      if (b % 10 === 0) throw RETRY;
      t = [a, b];
    }
  } else if (r.chance(0.5)) {
    const a = 10 * r.int(201, 899),
      b = r.int(1001, 1999),
      c = 100 * r.int(1, 9);
    if (b % 10 === 0 || b >= a) throw RETRY;
    t = [a, -b, c];
  } else {
    const a = 1000 * r.pick([5, 10, 20]),
      b = r.int(1001, 3999),
      c = 10 * r.int(1, 9);
    if (b % 10 === 0) throw RETRY;
    t = [a, -b, -c];
  }
  const ans = t.reduce((x, y) => x + y, 0);
  const show = (fmt: (v: number) => string) => t.map((v, i) => (i ? (v < 0 ? ' − ' : ' + ') : '') + fmt(Math.abs(v))).join('');
  return {
    type: 'num',
    q: p('Reken uit.') + som(show((v) => nf(v / 1000)) + ' ='),
    ans: ans / 1000,
    expl: steps(
      'Zet de komma’s recht onder elkaar en vul lege plekken aan met nullen.',
      `${show((v) => nf(v / 1000, 3))} = ${nf(ans / 1000, 3)}.`,
      `De uitkomst is <b>${nf(ans / 1000)}</b>.`,
    ),
  };
});

def('BH02', 'B', 'H', 'B.3', 'Kommagetallen vermenigvuldigen', (L, r) => {
  let ai, da, bi, db;
  const f = r.int(1, 3);
  if (L === 1) {
    if (f === 1) {
      ai = r.int(2, 9);
      da = 0;
      [bi, db] = r.pick([
        [25, 2],
        [5, 1],
        [75, 2],
        [15, 1],
        [25, 1],
        [2, 1],
        [4, 1],
        [6, 1],
        [8, 1],
        [12, 1],
      ]);
    } else if (f === 2) {
      ai = 5;
      da = 1;
      bi = 2 * r.int(11, 48);
      db = 2;
    } else {
      ai = r.int(2, 9);
      da = 1;
      bi = r.int(2, 9);
      db = 1;
    }
  } else if (L === 2) {
    if (f === 1) {
      ai = r.int(11, 25);
      da = 1;
      bi = r.int(2, 9);
      db = 1;
      if (ai % 10 === 0) throw RETRY;
    } else if (f === 2) {
      ai = 25;
      da = 2;
      bi = 4 * r.int(11, 60);
      db = 1;
    } else {
      ai = r.int(2, 9);
      da = 2;
      bi = r.pick([50, 200, 300, 500, 700]);
      db = 0;
    }
  } else if (f === 1) {
    ai = 125;
    da = 3;
    bi = 8 * r.int(1, 9);
    db = 1;
  } else if (f === 2) {
    ai = r.int(2, 9);
    da = 1;
    bi = r.pick([15, 25, 35, 45, 12, 16]);
    db = 2;
  } else {
    ai = bi = r.pick([15, 25, 9, 12, 11, 35]);
    da = db = 1;
  }
  if ((da && ai % 10 === 0) || (db && bi % 10 === 0)) throw RETRY;
  const a = ai / Math.pow(10, da),
    b = bi / Math.pow(10, db),
    ans = rnd((ai * bi) / Math.pow(10, da + db), 6),
    dn = da + db;
  return {
    type: 'num',
    q: p('Reken uit.') + som(`${nf(a)} × ${nf(b)} =`),
    ans,
    expl: steps(
      `Reken eerst zonder komma’s: ${ai} × ${bi} = ${nf(ai * bi)}.`,
      `In de som staan samen ${dn} ${dn === 1 ? 'cijfer' : 'cijfers'} achter de komma. Schuif de komma in de uitkomst ${dn} ${dn === 1 ? 'plaats' : 'plaatsen'} naar links.`,
      `${nf(a)} × ${nf(b)} = <b>${nf(ans)}</b>.`,
    ),
  };
});

def('BH03', 'B', 'H', 'B.3', 'Kommagetallen delen', (L, r) => {
  let dvd, dvs, q, ex;
  if (L === 1) {
    if (r.chance(0.5)) {
      const d = r.int(2, 9),
        qi = r.pick([2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 15]);
      if ((qi * d) % 10 === 0) throw RETRY;
      dvd = (qi * d) / 10;
      dvs = d;
      q = qi / 10;
      ex = steps(
        `Reken eerst zonder komma: ${qi * d} : ${d} = ${qi}.`,
        `${nf(dvd)} is 10 keer zo klein als ${qi * d}, dus de uitkomst ook: <b>${nf(q)}</b>.`,
      );
    } else {
      const [dv, inv] = r.pick([
          [0.5, 2],
          [0.25, 4],
          [0.2, 5],
          [0.1, 10],
        ]),
        n = r.int(2, 12);
      dvd = n;
      dvs = dv;
      q = n * inv;
      ex = steps(`In 1 past ${nf(dv)} precies ${inv} keer.`, `In ${n} past het dus ${n} × ${inv} = <b>${nf(q)}</b> keer.`);
    }
  } else if (L === 2) {
    const [di, k] = r.pick([
        [5, 3],
        [5, 2],
        [6, 2],
        [8, 2],
        [25, 2],
        [4, 2],
        [2, 2],
        [3, 2],
        [5, 1],
        [4, 1],
      ]),
      m = Math.pow(10, k);
    q = r.int(12, 90);
    dvd = rnd((q * di) / m, 6);
    dvs = di / m;
    ex = steps(
      `Maak van de deler een heel getal. Vermenigvuldig beide getallen met ${nf(m)}: ${nf(q * di)} : ${di}.`,
      `${nf(q * di)} : ${di} = <b>${nf(q)}</b>.`,
    );
  } else {
    const di = r.pick([2, 3, 4, 6, 8, 9, 12]),
      k = r.int(1, 3),
      j = r.int(1, 2),
      qi = r.int(2, 95),
      m = Math.pow(10, k);
    if (qi % 10 === 0 || k + j > 4) throw RETRY;
    q = qi / Math.pow(10, j);
    dvd = rnd((di * qi) / Math.pow(10, k + j), 6);
    dvs = di / m;
    ex = steps(
      `Maak van de deler een heel getal. Vermenigvuldig beide getallen met ${nf(m)}: ${f6(dvd * m)} : ${di}.`,
      `${di * qi} : ${di} = ${qi}, dus ${f6(dvd * m)} : ${di} = <b>${nf(q)}</b>.`,
    );
  }
  return { type: 'num', q: p('Reken uit.') + som(`${nf(dvd)} : ${nf(dvs)} =`), ans: q, expl: ex };
});

const PAIRS1 = [
  [2, 4],
  [2, 6],
  [2, 8],
  [3, 6],
  [4, 8],
  [3, 9],
  [5, 10],
  [2, 10],
  [4, 12],
  [3, 12],
  [6, 12],
];
const PAIRS2 = [
  [2, 3],
  [3, 4],
  [2, 5],
  [4, 6],
  [3, 5],
  [6, 8],
  [4, 5],
  [6, 9],
  [8, 12],
  [4, 10],
  [2, 7],
];
def('BH04', 'B', 'H', 'B.6', 'Breuken optellen en aftrekken', (L, r) => {
  let [b, d] = r.pick(L === 1 ? PAIRS1 : PAIRS2);
  if (r.chance(0.5)) {
    const t = b;
    b = d;
    d = t;
  }
  const a = proper(r, b),
    c = proper(r, d),
    l = lcm(b, d),
    sub = r.chance(0.5);
  let w1 = 0,
    w2 = 0;
  if (L === 3) {
    w1 = r.int(1, 4);
    w2 = r.int(1, 3);
    if (sub && w1 <= w2) w1 = w2 + r.int(1, 2);
  }
  const an = a * (l / b),
    cn = c * (l / d),
    n1 = w1 * l + an,
    n2 = w2 * l + cn,
    n = sub ? n1 - n2 : n1 + n2;
  if (n <= 0) throw RETRY;
  const good = frs(n, l),
    W = sub ? w1 - w2 : w1 + w2,
    wr = [];
  if (!sub) wr.push(frs(W * (b + d) + a + c, b + d));
  else if (b !== d && a !== c) wr.push(frs(W * Math.abs(b - d) + Math.abs(a - c), Math.abs(b - d)));
  if (sub ? W * l + a - c > 0 : true) wr.push(frs(W * l + (sub ? a - c : a + c), l));
  if (sub && an < cn) wr.push(frs(W * l + cn - an, l));
  wr.push(frs(n + 1, l));
  if (n > 1) wr.push(frs(n - 1, l));
  wr.push(frs(sub ? n1 + n2 : Math.abs(n1 - n2) || 1, l));
  const op = sub ? '−' : '+',
    A = mixed(w1, a, b),
    C = mixed(w2, c, d);
  const st = [];
  if (L === 3) st.push(`Schrijf de gemengde getallen als breuk met noemer ${l}: ${A} = ${fr(n1, l)} en ${C} = ${fr(n2, l)}.`);
  else st.push(`Maak de breuken gelijknamig met noemer ${l}: ${fr(a, b)} = ${fr(an, l)} en ${fr(c, d)} = ${fr(cn, l)}.`);
  st.push(`${fr(n1, l)} ${op} ${fr(n2, l)} = ${fr(n, l)}.`);
  st.push(good === fr(n, l) ? `De uitkomst is <b>${good}</b>.` : `Vereenvoudig: <b>${good}</b>.`);
  return Object.assign(mcTxt(r, good, wr), { q: p('Reken uit.') + som(`${A} ${op} ${C} =`), expl: steps(...st) });
});

def('BH05', 'B', 'H', 'B.6', 'Breuken vermenigvuldigen en delen', (L, r) => {
  let n1,
    d1,
    n2,
    d2,
    A,
    C,
    div = false,
    pre: string[] = [];
  if (L === 1) {
    if (r.chance(0.45)) {
      n1 = r.int(2, 6);
      d1 = 1;
      d2 = r.pick([3, 4, 5, 7, 8]);
      n2 = proper(r, d2);
      A = String(n1);
      C = fr(n2, d2);
      if (gcd(n1, d2) !== 1) throw RETRY;
    } else {
      d1 = r.pick([2, 3, 4, 5]);
      n1 = proper(r, d1);
      d2 = r.pick([2, 3, 4, 5, 7]);
      n2 = proper(r, d2);
      A = fr(n1, d1);
      C = fr(n2, d2);
      if (gcd(n1 * n2, d1 * d2) !== 1) throw RETRY;
    }
  } else if (L === 2) {
    div = r.chance(0.5);
    d1 = r.pick([3, 4, 5, 6, 8]);
    n1 = proper(r, d1);
    d2 = r.pick([2, 3, 4, 6, 8, 9]);
    n2 = proper(r, d2);
    A = fr(n1, d1);
    C = fr(n2, d2);
    if (!div && gcd(n1 * n2, d1 * d2) === 1) throw RETRY;
    if (n1 === n2 && d1 === d2) throw RETRY;
  } else {
    div = r.chance(0.5);
    const b = r.pick([2, 3, 4, 5]),
      a = proper(r, b),
      w1 = r.int(1, 3),
      d = r.pick([2, 3, 4, 5]),
      c = proper(r, d),
      w2 = r.int(div ? 0 : 1, 2);
    n1 = w1 * b + a;
    d1 = b;
    n2 = w2 * d + c;
    d2 = d;
    A = mixed(w1, a, b);
    C = mixed(w2, c, d);
    pre = [`Schrijf gemengde getallen eerst als breuk: ${A} = ${fr(n1, d1)}${w2 ? ` en ${C} = ${fr(n2, d2)}` : ''}.`];
  }
  const N = div ? n1 * d2 : n1 * n2,
    D = div ? d1 * n2 : d1 * d2,
    good = frs(N, D),
    wr = [];
  if (div) {
    wr.push(frs(n1 * n2, d1 * d2));
    wr.push(frs(d1 * n2, n1 * d2));
    wr.push(frs(n1 + d2, d1 + n2));
    wr.push(frs(N + D, D));
  } else {
    wr.push(frs(n1 * d2, d1 * n2));
    if (d1 !== 1) wr.push(frs(n1 * d2 + n2 * d1, d1 * d2));
    wr.push(frs(n1 + n2, d1 + d2));
    wr.push(frs(N + D, D));
    if (d1 === 1) wr.push(frs(n2, n1 * d2));
  }
  if (L === 3 && !div) wr.unshift(frs(Math.floor(n1 / d1) * Math.floor(n2 / d2) * D + (n1 % d1) * (n2 % d2), D));
  const st = pre.slice();
  if (div) st.push(`Delen door een breuk is vermenigvuldigen met het omgekeerde: ${fr(n1, d1)} × ${fr(d2, n2)} = ${fr(N, D)}.`);
  else if (d1 === 1) st.push(`Vermenigvuldig alleen de teller: ${n1} × ${fr(n2, d2)} = ${fr(N, D)}.`);
  else st.push(`Teller keer teller en noemer keer noemer: ${fr(n1, d1)} × ${fr(n2, d2)} = ${fr(N, D)}.`);
  st.push(good === fr(N, D) ? `De uitkomst is <b>${good}</b>.` : `Vereenvoudig: <b>${good}</b>.`);
  return Object.assign(mcTxt(r, good, wr), { q: p('Reken uit.') + som(`${A} ${div ? ':' : '×'} ${C} =`), expl: steps(...st) });
});

function pctEx(pc: number, base: number) {
  const res = (base * pc) / 100,
    ten = base / 10,
    one = base / 100,
    B = f6(base);
  const M: Partial<Record<number, string[]>> = {
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
    62.5: [`50% is ${f6(base / 2)} en 12,5% is ${f6(base / 8)}.`, `Samen: <b>${f6(res)}</b>.`],
  };
  return M[pc] || [`1% van ${B} is ${f6(one)}.`, `${nf(pc)}% is ${nf(pc)} keer zoveel: <b>${f6(res)}</b>.`];
}
def('BH06', 'B', 'H', 'B.7', 'Procent en promille van een getal', (L, r) => {
  let pc, base;
  if (L === 1) {
    pc = r.pick([10, 20, 25, 50, 75]);
    base = 20 * r.int(2, 48);
  } else if (L === 2) {
    const [q, st, lo, hi] = r.pick([
      [15, 20, 3, 40],
      [35, 20, 3, 40],
      [30, 10, 4, 90],
      [45, 20, 3, 40],
      [60, 5, 8, 90],
      [5, 20, 3, 60],
      [12.5, 40, 2, 24],
      [2.5, 40, 2, 50],
      [0.5, 200, 2, 40],
    ]);
    pc = q;
    base = st * r.int(lo, hi);
  } else if (r.chance(0.3)) {
    const pm = r.pick([2, 3, 4, 5, 8, 1.5, 2.5, 0.5]);
    base = 2000 * r.int(10, 400);
    const ans = rnd((base * pm) / 1000, 6);
    return {
      type: 'num',
      q: p(`Hoeveel is ${nf(pm)} promille van ${nf(base)}?`),
      ans,
      expl: steps(
        'Promille betekent: per duizend.',
        `1 promille van ${nf(base)} is ${nf(base)} : 1.000 = ${nf(base / 1000)}.`,
        `${nf(pm)} promille is ${nf(pm)} × ${nf(base / 1000)} = <b>${nf(ans)}</b>.`,
      ),
    };
  } else {
    const [q, st, lo, hi] = r.pick([
      [17.5, 40, 2, 30],
      [125, 4, 10, 200],
      [150, 2, 20, 300],
      [250, 2, 20, 200],
      [0.2, 500, 2, 120],
      [37.5, 8, 5, 100],
      [62.5, 8, 5, 100],
    ]);
    pc = q;
    base = st * r.int(lo, hi);
  }
  return {
    type: 'num',
    q: p(`Hoeveel is ${nf(pc)}% van ${nf(base)}?`),
    ans: rnd((base * pc) / 100, 6),
    expl: steps(...pctEx(pc, base)),
  };
});

def('BH07', 'B', 'H', 'B.8', 'Breuk, kommagetal en procent omzetten', (L, r) => {
  const f = r.int(1, 3);
  if (L === 1) {
    if (f === 1) {
      const [a, b] = r.pick([
          [1, 2],
          [1, 4],
          [3, 4],
          [1, 5],
          [2, 5],
          [3, 5],
          [4, 5],
          [1, 10],
          [3, 10],
          [7, 10],
          [9, 10],
        ]),
        k = 100 / b;
      return {
        type: 'num',
        unit: '%',
        q: p(`Schrijf ${fr(a, b)} als percentage.`),
        ans: a * k,
        expl: steps(`Maak van de noemer 100: ${fr(a, b)} = ${fr(a * k, 100)}.`, `Dat is <b>${a * k}</b>%.`),
      };
    }
    if (f === 2) {
      const v = r.pick([2, 5, 7, 15, 35, 45, 60, 8, 12, 85]);
      return {
        type: 'num',
        unit: '%',
        q: p(`Schrijf ${nf(v / 100)} als percentage.`),
        ans: v,
        expl: steps(`Vermenigvuldig met 100: ${nf(v / 100)} × 100 = <b>${v}</b>%.`),
      };
    }
    const [a, b] = r.pick([
      [1, 2],
      [1, 4],
      [3, 4],
      [1, 5],
      [2, 5],
      [3, 5],
      [4, 5],
      [3, 10],
      [7, 10],
    ]);
    return {
      type: 'num',
      q: p(`Schrijf ${fr(a, b)} als kommagetal.`),
      ans: a / b,
      expl: steps(`Deel de teller door de noemer: ${a} : ${b} = <b>${nf(a / b)}</b>.`),
    };
  }
  if (L === 2) {
    if (f === 1) {
      const [a, b] = r.pick([
        [1, 8],
        [3, 8],
        [5, 8],
        [7, 8],
        [7, 20],
        [9, 20],
        [3, 25],
        [7, 25],
        [11, 50],
        [3, 20],
        [13, 20],
        [17, 25],
      ]);
      const v = rnd((a / b) * 100, 4);
      return {
        type: 'num',
        unit: '%',
        q: p(`Schrijf ${fr(a, b)} als percentage.`),
        ans: v,
        expl: steps(
          b === 8
            ? `${fr(1, 8)} is 12,5%, dus ${fr(a, 8)} is ${a} × 12,5%.`
            : `Maak van de noemer 100: ${fr(a, b)} = ${fr((a * 100) / b, 100)}.`,
          `Dat is <b>${nf(v)}</b>%.`,
        ),
      };
    }
    if (f === 2) {
      const [a, b] = r.pick([
        [1, 8],
        [3, 8],
        [1, 20],
        [3, 25],
        [7, 20],
        [5, 8],
        [9, 25],
        [3, 40],
      ]);
      return {
        type: 'num',
        q: p(`Schrijf ${fr(a, b)} als kommagetal.`),
        ans: a / b,
        expl: steps(`Deel de teller door de noemer: ${a} : ${b} = <b>${nf(a / b)}</b>.`),
      };
    }
    const v = r.pick([135, 7, 12.5, 108, 2.5, 250, 0.5, 62.5]);
    return {
      type: 'num',
      q: p(`Schrijf ${nf(v)}% als kommagetal.`),
      ans: v / 100,
      expl: steps(`Procent betekent: per honderd. Deel door 100: ${nf(v)} : 100 = <b>${f6(v / 100)}</b>.`),
    };
  }
  if (f === 1) {
    const [a, b] = r.pick([
      [7, 40],
      [3, 16],
      [5, 16],
      [9, 40],
      [11, 40],
      [1, 16],
      [13, 40],
      [7, 16],
    ]);
    const v = rnd((a / b) * 100, 4);
    return {
      type: 'num',
      unit: '%',
      q: p(`Schrijf ${fr(a, b)} als percentage.`),
      ans: v,
      expl: steps(`Deel de teller door de noemer: ${a} : ${b} = ${nf(a / b)}.`, `Vermenigvuldig met 100: <b>${nf(v)}</b>%.`),
    };
  }
  if (f === 2) {
    const [a, b] = r.pick([
      [2, 3],
      [1, 6],
      [5, 6],
      [1, 7],
      [2, 9],
      [4, 9],
      [5, 12],
      [1, 3],
      [7, 9],
      [5, 7],
    ]);
    const v = rnd((a / b) * 100, 1);
    return {
      type: 'num',
      unit: '%',
      dec: 1,
      q: p(`Schrijf ${fr(a, b)} als percentage. Rond af op één decimaal.`),
      ans: v,
      expl: steps(
        `${a} : ${b} = ${nf(a / b, 4)}…`,
        `Vermenigvuldig met 100: ${nf((a / b) * 100, 2)}… Afgerond op één decimaal: <b>${nf(v, 1)}</b>%.`,
      ),
    };
  }
  const [k, b] = r.pick([
    [7, 8],
    [3, 8],
    [5, 8],
    [7, 20],
    [9, 25],
    [13, 40],
    [11, 16],
  ]);
  return {
    type: 'num',
    q: p('Welk getal hoort op de puntjes?') + som(`${nf(k / b)} = ` + fr(gap, b)),
    ans: k,
    expl: steps(`Vermenigvuldig het kommagetal met de noemer: ${nf(k / b)} × ${b} = <b>${k}</b>.`, `Controle: ${k} : ${b} = ${nf(k / b)}.`),
  };
});

const MIX = [
  ['siroop', 'water', 'ml'],
  ['cement', 'zand', 'scheppen'],
  ['rode verf', 'witte verf', 'ml'],
  ['azijn', 'olie', 'ml'],
  ['sap', 'bronwater', 'ml'],
];
def('BH08', 'B', 'H', 'B.5', 'Rekenen met verhoudingen', (L, r) => {
  if (L === 1) {
    const [x, y, u] = r.pick(MIX),
      k = r.int(3, 9),
      S = u === 'scheppen' ? r.int(2, 9) : r.pick([20, 25, 40, 50, 75, 80]);
    if (r.chance(0.5))
      return {
        type: 'num',
        unit: u,
        q: p(`De verhouding ${x} : ${y} is 1 : ${k}.`) + ask(`Hoeveel ${u} ${y} hoort bij ${S} ${u} ${x}?`),
        ans: k * S,
        expl: steps(`Bij 1 deel ${x} horen ${k} delen ${y}.`, `${S} × ${k} = <b>${nf(k * S)}</b> ${u} ${y}.`),
      };
    return {
      type: 'num',
      unit: u,
      q: p(`De verhouding ${x} : ${y} is 1 : ${k}.`) + ask(`Hoeveel ${u} ${x} hoort bij ${nf(k * S)} ${u} ${y}?`),
      ans: S,
      expl: steps(`De hoeveelheid ${y} is ${k} keer zo groot als de hoeveelheid ${x}.`, `${nf(k * S)} : ${k} = <b>${S}</b> ${u} ${x}.`),
    };
  }
  if (L === 2) {
    const [a, b] = r.pick([
      [2, 3],
      [3, 5],
      [1, 4],
      [3, 4],
      [2, 5],
      [5, 7],
      [1, 3],
      [4, 5],
    ]);
    if (r.chance(0.5)) {
      const u = r.pick([10, 20, 30, 40, 50, 60]),
        T = (a + b) * u;
      return {
        type: 'num',
        pre: '€',
        q: p(`Een bedrag van ${eur(T)} wordt verdeeld in de verhouding ${a} : ${b}.`) + ask('Hoe groot is het grootste deel?'),
        ans: b * u,
        expl: steps(
          `Er zijn ${a} + ${b} = ${a + b} delen.`,
          `Eén deel is ${eur(T)} : ${a + b} = ${eur(u)}.`,
          `Het grootste deel is ${b} × ${eur(u)} = <b>${eur(b * u)}</b>.`,
        ),
      };
    }
    const u = r.int(3, 8);
    return {
      type: 'num',
      unit: 'jongens',
      q:
        p(`In een sportclub is de verhouding jongens : meisjes gelijk aan ${a} : ${b}. Er zijn ${b * u} meisjes.`) +
        ask('Hoeveel jongens zijn er?'),
      ans: a * u,
      expl: steps(
        `${b} delen zijn samen ${b * u} meisjes, dus één deel is ${b * u} : ${b} = ${u}.`,
        `Jongens: ${a} × ${u} = <b>${a * u}</b>.`,
      ),
    };
  }
  const f = r.int(1, 3);
  if (f === 1) {
    const [a, b, c] = r.pick([
        [3, 4, 5],
        [1, 2, 3],
        [2, 3, 5],
        [1, 3, 4],
        [2, 3, 4],
        [1, 4, 5],
      ]),
      u = r.pick([20, 25, 30, 40, 50]),
      T = (a + b + c) * u;
    return {
      type: 'num',
      q: p(`Het getal ${nf(T)} wordt verdeeld in de verhouding ${a} : ${b} : ${c}.`) + ask('Hoe groot is het middelste deel?'),
      ans: b * u,
      expl: steps(
        `Er zijn ${a} + ${b} + ${c} = ${a + b + c} delen.`,
        `Eén deel is ${nf(T)} : ${a + b + c} = ${u}.`,
        `Het middelste deel is ${b} × ${u} = <b>${b * u}</b>.`,
      ),
    };
  }
  if (f === 2) {
    const [a, b, c] = r.pick([
        [1, 2, 3],
        [1, 2, 4],
        [1, 3, 5],
        [2, 3, 4],
      ]),
      u = r.int(3, 9);
    return {
      type: 'num',
      unit: 'scheppen',
      q:
        p(`Beton maak je van cement, zand en grind in de verhouding ${a} : ${b} : ${c}. Je gebruikt ${b * u} scheppen zand.`) +
        ask('Hoeveel scheppen gebruik je in totaal?'),
      ans: (a + b + c) * u,
      expl: steps(
        `${b} delen zand zijn ${b * u} scheppen, dus één deel is ${u} scheppen.`,
        `In totaal zijn er ${a} + ${b} + ${c} = ${a + b + c} delen.`,
        `${a + b + c} × ${u} = <b>${(a + b + c) * u}</b> scheppen.`,
      ),
    };
  }
  const [a, b] = r.pick([
      [2, 5],
      [3, 7],
      [1, 4],
      [3, 5],
      [2, 7],
      [4, 9],
    ]),
    u = r.pick([10, 15, 20, 30]);
  return {
    type: 'num',
    q:
      p(`Twee getallen verhouden zich als ${a} : ${b}. Het verschil tussen de twee getallen is ${(b - a) * u}.`) +
      ask('Hoeveel zijn de twee getallen samen?'),
    ans: (a + b) * u,
    expl: steps(
      `Het verschil is ${b} − ${a} = ${b - a} delen. Dat is ${(b - a) * u}, dus één deel is ${u}.`,
      `Samen zijn het ${a} + ${b} = ${a + b} delen.`,
      `${a + b} × ${u} = <b>${(a + b) * u}</b>.`,
    ),
  };
});

const POOL: [string, number][] = [
  [fr(1, 4), 0.25],
  [fr(3, 8), 0.375],
  [fr(2, 5), 0.4],
  [fr(1, 2), 0.5],
  [fr(3, 5), 0.6],
  [fr(5, 8), 0.625],
  [fr(2, 3), 2 / 3],
  [fr(3, 4), 0.75],
  [fr(4, 5), 0.8],
  [fr(7, 8), 0.875],
  [fr(1, 3), 1 / 3],
  [fr(7, 10), 0.7],
  [fr(5, 6), 5 / 6],
  ['0,3', 0.3],
  ['0,35', 0.35],
  ['0,409', 0.409],
  ['0,45', 0.45],
  ['0,55', 0.55],
  ['0,65', 0.65],
  ['0,72', 0.72],
  ['0,85', 0.85],
  ['0,67', 0.67],
  ['0,6', 0.6],
  ['0,63', 0.63],
  ['0,333', 0.333],
  ['0,8', 0.8],
  ['0,38', 0.38],
  ['28%', 0.28],
  ['35%', 0.35],
  ['42%', 0.42],
  ['48%', 0.48],
  ['58%', 0.58],
  ['66%', 0.66],
  ['70%', 0.7],
  ['77%', 0.77],
  ['88%', 0.88],
  ['62%', 0.62],
  ['33%', 0.33],
  ['40%', 0.4],
  ['37%', 0.37],
];
def('BH09', 'B', 'H', 'B.4', 'Breuken, kommagetallen en procenten vergelijken', (L, r) => {
  if (L === 1) {
    const big = r.chance(0.5);
    if (r.chance(0.5)) {
      const dens = r.sample([2, 3, 4, 5, 6, 8, 10, 12], 4),
        pick = big ? Math.min(...dens) : Math.max(...dens);
      return Object.assign(
        mcTxt(
          r,
          fr(1, pick),
          dens.filter((d) => d !== pick).map((d) => fr(1, d)),
        ),
        {
          q: p(`Welke breuk is het ${big ? 'grootst' : 'kleinst'}?`),
          expl: steps(
            'De tellers zijn gelijk. Dan geldt: hoe groter de noemer, hoe kleiner de stukjes.',
            `De ${big ? 'grootste' : 'kleinste'} breuk is <b>${fr(1, pick)}</b>.`,
          ),
        },
      );
    }
    const d = r.pick([7, 9, 11, 12]),
      ns = r.sample(
        [1, 2, 3, 4, 5, 6].filter((x) => x < d),
        4,
      ),
      pick = big ? Math.max(...ns) : Math.min(...ns);
    return Object.assign(
      mcTxt(
        r,
        fr(pick, d),
        ns.filter((x) => x !== pick).map((x) => fr(x, d)),
      ),
      {
        q: p(`Welke breuk is het ${big ? 'grootst' : 'kleinst'}?`),
        expl: steps(
          'De noemers zijn gelijk. Dan vergelijk je alleen de tellers.',
          `De ${big ? 'grootste' : 'kleinste'} breuk is <b>${fr(pick, d)}</b>.`,
        ),
      },
    );
  }
  const k = L === 2 ? 4 : 5,
    minGap = L === 2 ? 0.02 : 0.004,
    it = r.sample(POOL, k).map((x) => ({ h: x[0], v: x[1] }));
  const kinds = new Set(it.map((x) => (x.h.indexOf('%') > 0 ? 'p' : x.h.indexOf('class') > 0 ? 'f' : 'd')));
  if (kinds.size < 2) throw RETRY;
  const sorted = it.map((x) => x.v).sort((a, b) => a - b);
  for (let i = 1; i < k; i++) if (sorted[i] - sorted[i - 1] < minGap) throw RETRY;
  if (L === 3 && sorted[k - 1] - sorted[0] > 0.45) throw RETRY;
  const o = ordQ(r, it);
  return Object.assign(o, {
    q: p('Zet de getallen in de goede volgorde, van klein naar groot.'),
    expl: steps(
      'Schrijf alles als kommagetal. Dan kun je goed vergelijken.',
      o.ans.map((i) => `${o.items[i]} = ${nf(it.find((x) => x.h === o.items[i])!.v, 3).replace(/,?0+$/, '')}`).join('; ') + '.',
      `De goede volgorde is: <b>${o.ans.map((i) => o.items[i]).join(' &lt; ')}</b>.`,
    ),
  });
});

const PLACE = ['tienden', 'honderdsten', 'duizendsten', 'tienduizendsten'];
def('BH10', 'B', 'H', 'B.2', 'Kommagetallen afronden en plaatswaarde', (L, r) => {
  const dn = (d: number) => (d === 0 ? 'een heel getal' : d === 1 ? 'één decimaal' : d === 2 ? 'twee decimalen' : 'drie decimalen');
  const ex = (x: number, d: number, ans: number) => {
    const s = nf(x, 6).replace(/0+$/, ''),
      dig = Math.floor(rnd(Math.abs(x) * Math.pow(10, d + 1), 3)) % 10;
    return steps(
      `Je houdt ${d === 0 ? 'geen cijfers' : d === 1 ? 'één cijfer' : d + ' cijfers'} achter de komma over. Kijk naar het cijfer daarna: dat is een ${dig}.`,
      dig >= 5 ? '5 of hoger: je rondt naar boven af.' : 'Lager dan 5: je rondt naar beneden af.',
      `${s} wordt <b>${nf(ans, d)}</b>.`,
    );
  };
  if (L === 1) {
    const x = r.int(1001, 9989) / 1000;
    if (Math.round(x * 1000) % 10 === 0 || Math.round(x * 1000) % 100 === 50) throw RETRY;
    const ans = rnd(x, 1);
    return { type: 'num', dec: 1, q: p(`Rond ${nf(x)} af op één decimaal.`), ans, expl: ex(x, 1, ans) };
  }
  if (L === 2) {
    if (r.chance(0.5)) {
      const x = r.int(10011, 99989) / 10000;
      if (Math.round(x * 10000) % 10 === 0 || Math.round(x * 10000) % 100 === 50) throw RETRY;
      const ans = rnd(x, 2);
      return { type: 'num', dec: 2, q: p(`Rond ${nf(x)} af op twee decimalen.`), ans, expl: ex(x, 2, ans) };
    }
    const digs = r.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 5),
      s = digs[0] + ',' + digs.slice(1).join(''),
      pos = r.int(1, 4),
      dig = digs[pos];
    return Object.assign(
      mcTxt(
        r,
        PLACE[pos - 1],
        PLACE.filter((x, i) => i !== pos - 1),
      ),
      {
        q: p(`Wat is de waarde van het cijfer ${dig} in het getal ${s}?`),
        expl: steps(
          'Achter de komma staan achtereenvolgens de tienden, honderdsten, duizendsten en tienduizendsten.',
          `De ${dig} staat op plaats ${pos} achter de komma. Dat zijn de <b>${PLACE[pos - 1]}</b>.`,
        ),
      },
    );
  }
  const d = r.int(0, 3),
    M = r.int(d === 0 ? 3 : 1, d === 0 ? 40 : 140),
    t = r.int(1, 49),
    base = d === 0 ? M : (M * 10) / Math.pow(10, d),
    x = rnd(base - t / Math.pow(10, d + 2), 6);
  if (x <= 0) throw RETRY;
  return {
    type: 'num',
    dec: d,
    q: p(`Rond ${nf(x)} af op ${dn(d)}.`),
    ans: rnd(base, 6),
    expl:
      ex(x, d, base) +
      (d > 0 ? tip(`De uitkomst eindigt op een nul. ${nf(base, d)} en ${nf(base)} zijn even groot; je mag beide invullen.`) : ''),
  };
});

def('BH11', 'B', 'H', 'B.7', 'Korting en procentuele verandering', (L, r) => {
  const it = r.pick(['jas', 'broek', 'rugzak', 'paar schoenen', 'trui', 'lamp', 'boek']);
  if (L === 1) {
    const pc = r.pick([10, 20, 25, 50]),
      P = 20 * r.int(2, 12),
      k = (P * pc) / 100;
    return {
      type: 'num',
      pre: '€',
      q: p(`Een ${it} kost ${eur(P)}. Je krijgt ${pc}% korting.`) + ask('Wat is de nieuwe prijs?'),
      ans: P - k,
      expl: steps(`De korting is ${pc}% van ${eur(P)}: ${eur(k)}.`, `${eur(P)} − ${eur(k)} = <b>${eur(P - k)}</b>.`),
    };
  }
  if (L === 2) {
    const pc = r.pick([15, 30, 35, 40, 5]);
    if (r.chance(0.5)) {
      const P = 20 * r.int(2, 14),
        k = (P * pc) / 100;
      return {
        type: 'num',
        pre: '€',
        q: p(`Een ${it} kost ${eur(P)}. Je krijgt ${pc}% korting.`) + ask('Wat is de nieuwe prijs?'),
        ans: P - k,
        expl: steps(`De korting is ${pc}% van ${eur(P)}: ${eur(k)}.`, `${eur(P)} − ${eur(k)} = <b>${eur(P - k)}</b>.`),
      };
    }
    const c = 20 * r.int(6, 45),
      k = (c * pc) / 100;
    if (c % 100 === 0) throw RETRY;
    return {
      type: 'num',
      pre: '€',
      dec: 2,
      q: p(`Een pak koekjes kost ${eur(c / 100)}. Deze week krijg je ${pc}% korting.`) + ask('Wat is de nieuwe prijs?'),
      ans: (c - k) / 100,
      expl: steps(
        `De korting is ${pc}% van ${eur(c / 100)}: ${eur(k / 100)}.`,
        `${eur(c / 100)} − ${eur(k / 100)} = <b>${eur((c - k) / 100)}</b>.`,
      ),
    };
  }
  const f = r.int(1, 3);
  if (f < 3) {
    const up = f === 1,
      A = r.pick([20, 25, 40, 50, 80, 120, 150, 200, 250]),
      pc = r.pick([4, 5, 8, 10, 12, 15, 20, 25, 30]),
      d = (A * pc) / 100;
    if (d !== Math.round(d)) throw RETRY;
    const B = up ? A + d : A - d,
      what = r.pick([
        ['Het aantal leden van een vereniging', 'leden'],
        ['Het aantal leerlingen in de bovenbouw', 'leerlingen'],
        ['De prijs van een abonnement', 'euro'],
      ]);
    return {
      type: 'num',
      unit: '%',
      q:
        p(`${what[0]} gaat van ${A} naar ${B}${what[1] === 'euro' ? ' euro' : ''}.`) +
        ask(`Met hoeveel procent is dat ${up ? 'gestegen' : 'gedaald'}?`),
      ans: pc,
      expl:
        steps(
          `Het verschil is ${Math.abs(B - A)}.`,
          `Vergelijk met het oude getal: ${Math.abs(B - A)} van de ${A}.`,
          `${Math.abs(B - A)} : ${A} × 100 = <b>${pc}</b>%.`,
        ) + tip('Je deelt altijd door het oude getal, niet door het nieuwe.'),
    };
  }
  const pc = r.pick([10, 20, 25, 40]),
    old = 20 * r.int(2, 15),
    N = (old * (100 - pc)) / 100;
  return {
    type: 'num',
    pre: '€',
    q: p(`Na ${pc}% korting kost een ${it} nog ${eur(N)}.`) + ask('Wat was de oude prijs?'),
    ans: old,
    expl:
      steps(
        `Na ${pc}% korting betaal je nog ${100 - pc}% van de oude prijs.`,
        `${100 - pc}% is ${eur(N)}, dus 1% is ${eur(N)} : ${100 - pc} = ${eur(N / (100 - pc))}.`,
        `100% is <b>${eur(old)}</b>.`,
      ) + tip(`${pc}% van ${eur(N)} erbij optellen geeft een verkeerd antwoord: de korting is berekend over de oude prijs.`),
  };
});

def('BH12', 'B', 'H', 'B.6', 'Een deel van een geheel', (L, r) => {
  if (L === 1) {
    const b = r.pick([3, 4, 5, 6, 8, 10]),
      a = proper(r, b),
      u = r.pick([10, 15, 20, 30, 40, 50, 60, 90]),
      N = b * u;
    return {
      type: 'num',
      q: p(`Hoeveel is ${fr(a, b)} deel van ${nf(N)}?`),
      ans: a * u,
      expl: steps(`${fr(1, b)} deel van ${nf(N)} is ${nf(N)} : ${b} = ${u}.`, `${fr(a, b)} deel is ${a} × ${u} = <b>${nf(a * u)}</b>.`),
    };
  }
  if (L === 2) {
    if (r.chance(0.5)) {
      const k = r.pick([4, 5, 8, 20, 25]),
        u = r.pick([30, 60, 90, 120, 150, 300]),
        N = k * u;
      return {
        type: 'num',
        unit: 'leerlingen',
        q:
          p(`Op een school met ${nf(N)} leerlingen komt 1 op de ${k} leerlingen lopend naar school.`) + ask('Hoeveel leerlingen zijn dat?'),
        ans: u,
        expl: steps(`1 op de ${k} is hetzelfde als ${fr(1, k)} deel.`, `${nf(N)} : ${k} = <b>${nf(u)}</b> leerlingen.`),
      };
    }
    const b = r.pick([3, 4, 5, 6, 8]),
      a = proper(r, b),
      u = r.int(6, 30);
    if (a === 1) throw RETRY;
    return {
      type: 'num',
      q: p(`${fr(a, b)} deel van een getal is ${a * u}.`) + ask('Welk getal is dat?'),
      ans: b * u,
      expl: steps(
        `${a} delen zijn samen ${a * u}, dus één deel is ${a * u} : ${a} = ${u}.`,
        `Het hele getal bestaat uit ${b} delen: ${b} × ${u} = <b>${nf(b * u)}</b>.`,
      ),
    };
  }
  const f = r.int(1, 3);
  if (f === 1) {
    const b = r.pick([5, 6, 8]),
      a = proper(r, b),
      u = r.int(3, 5);
    if (a === 1) throw RETRY;
    return {
      type: 'num',
      unit: 'leerlingen',
      q:
        p(`In een klas draagt ${fr(a, b)} deel van de leerlingen een bril. Dat zijn ${a * u} leerlingen.`) +
        ask('Hoeveel leerlingen zitten er in de klas?'),
      ans: b * u,
      expl: steps(
        `${a} delen zijn ${a * u} leerlingen, dus één deel is ${u} leerlingen.`,
        `De hele klas is ${b} delen: ${b} × ${u} = <b>${b * u}</b> leerlingen.`,
      ),
    };
  }
  if (f === 2) {
    const b = r.pick([4, 5, 6, 8]),
      a = proper(r, b),
      u = r.pick([5, 15, 25, 35, 45]);
    if (b - a === 1 && a === 1) throw RETRY;
    return {
      type: 'num',
      pre: '€',
      q:
        p(`${nm(r)} heeft ${fr(a, b)} deel van het zakgeld uitgegeven. Er is nog ${eur((b - a) * u)} over.`) +
        ask('Hoeveel zakgeld was er aan het begin?'),
      ans: b * u,
      expl:
        steps(
          `Er is nog ${fr(b - a, b)} deel over. Dat is ${eur((b - a) * u)}.`,
          b - a === 1 ? `Eén deel is dus ${eur(u)}.` : `Eén deel is ${eur((b - a) * u)} : ${b - a} = ${eur(u)}.`,
          `Het hele bedrag is ${b} × ${eur(u)} = <b>${eur(b * u)}</b>.`,
        ) + tip('Het bedrag dat over is, hoort bij het deel dat niet is uitgegeven.'),
    };
  }
  const [a, b] = r.pick([
      [2, 3],
      [3, 4],
      [1, 2],
      [3, 5],
    ]),
    [c, d] = r.pick([
      [3, 4],
      [1, 2],
      [2, 5],
      [5, 6],
      [1, 3],
    ]),
    N = b * d * r.pick([10, 20, 30]);
  if (a === c && b === d) throw RETRY;
  const mid = (N / d) * c,
    ans = (mid / b) * a;
  return {
    type: 'num',
    q: p(`Hoeveel is ${fr(a, b)} deel van ${fr(c, d)} deel van ${nf(N)}?`),
    ans,
    expl: steps(
      `Eerst ${fr(c, d)} deel van ${nf(N)}: ${nf(N)} : ${d} × ${c} = ${nf(mid)}.`,
      `Dan ${fr(a, b)} deel van ${nf(mid)}: ${nf(mid)} : ${b} × ${a} = <b>${nf(ans)}</b>.`,
    ),
  };
});

def('BH13', 'B', 'H', 'B.6', 'Gelijkwaardige breuken en vereenvoudigen', (L, r) => {
  if (L === 1) {
    const b = r.int(2, 9),
      a = proper(r, b),
      k = r.int(2, 6);
    return {
      type: 'num',
      q: p('Welk getal hoort op de puntjes?') + som(`${fr(a, b)} = ${fr(gap, b * k)}`),
      ans: a * k,
      expl: steps(
        `De noemer is ${k} keer zo groot geworden: ${b} × ${k} = ${b * k}.`,
        `De teller wordt dan ook ${k} keer zo groot: ${a} × ${k} = <b>${a * k}</b>.`,
      ),
    };
  }
  if (L === 2) {
    const b = r.int(3, 9),
      a = proper(r, b);
    if (r.chance(0.5)) {
      const k = r.pick([4, 6, 8, 10, 12, 15, 20, 30]),
        n = a * k,
        d = b * k,
        h = [2, 3, 5].find((x) => k % x === 0 && k / x > 1);
      const wr = [h ? fr(n / h, d / h) : null, fr(a, b + 1), fr(a + 1, b), fr(a, b - 1 > a ? b - 1 : b + 2)];
      return Object.assign(mcTxt(r, fr(a, b), wr), {
        q: p(`Vereenvoudig ${fr(n, d)} zo ver mogelijk.`),
        expl:
          steps(
            `Deel teller en noemer door hetzelfde getal, zo groot mogelijk. Hier is dat ${k}.`,
            `${n} : ${k} = ${a} en ${d} : ${k} = ${b}.`,
            `De breuk wordt <b>${fr(a, b)}</b>.`,
          ) + (h ? tip(`${fr(n / h, d / h)} is wel gelijk aan ${fr(n, d)}, maar kan nog verder vereenvoudigd worden.`) : ''),
      });
    }
    const k = r.int(3, 9);
    return {
      type: 'num',
      q: p('Welk getal hoort op de puntjes?') + som(`${fr(a * k, b * k)} = ${fr(a, gap)}`),
      ans: b,
      expl: steps(
        `De teller is gedeeld door ${k}: ${a * k} : ${k} = ${a}.`,
        `Deel de noemer ook door ${k}: ${b * k} : ${k} = <b>${b}</b>.`,
      ),
    };
  }
  const b = r.int(3, 9),
    a = proper(r, b);
  if (r.chance(0.5)) {
    const ks = r.sample([2, 3, 4, 5, 6, 8, 10, 20, 25], 3),
      eq = ks.map((k) => fr(a * k, b * k)),
      kk = r.pick([3, 4, 5, 6, 7]),
      bad = r.chance(0.5) ? fr(a * kk, b * (kk + 1)) : fr(a * kk + 1, b * kk);
    return Object.assign(mcTxt(r, bad, eq), {
      q: p(`Welke breuk is <b>niet</b> gelijk aan ${fr(a, b)}?`),
      expl: steps(
        `Een breuk blijft gelijk als je teller en noemer met hetzelfde getal vermenigvuldigt.`,
        `Bij ${eq.join(', ')} is dat zo.`,
        `Bij <b>${bad}</b> zijn teller en noemer niet met hetzelfde getal vermenigvuldigd.`,
      ),
    });
  }
  const k = r.pick([12, 15, 16, 18, 24, 25]);
  return {
    type: 'num',
    q: p('Welk getal hoort op de puntjes?') + som(`${fr(a * k, b * k)} = ${fr(gap, b)}`),
    ans: a,
    expl: steps(`De noemer is gedeeld door ${k}: ${b * k} : ${k} = ${b}.`, `Deel de teller ook door ${k}: ${a * k} : ${k} = <b>${a}</b>.`),
  };
});

def('BH14', 'B', 'H', 'B.4', 'Kommagetallen op de getallenlijn', (L, r) => {
  let o, ans, why;
  if (L === 1) {
    const n = r.int(0, 9),
      k = r.pick([1, 2, 3, 4, 6, 7, 8, 9]);
    o = { min: n, max: n + 1, major: 1, minor: 0.1, arrow: n + k / 10 };
    ans = n + k / 10;
    why =
      `Tussen ${n} en ${n + 1} staan 10 gelijke stapjes. Elk stapje is 0,1.` +
      `|De pijl staat ${k === 1 ? '1 stapje' : k + ' stapjes'} na ${n}.`;
  } else if (L === 2) {
    const a = r.int(11, 89) / 10,
      k = r.pick([1, 2, 3, 4, 6, 7, 8, 9]);
    o = { min: a, max: rnd(a + 0.1, 2), major: 0.1, minor: 0.01, arrow: rnd(a + k / 100, 3) };
    ans = rnd(a + k / 100, 2);
    why =
      `Tussen ${nf(a)} en ${nf(a + 0.1)} staan 10 gelijke stapjes. Elk stapje is 0,01.` +
      `|De pijl staat ${k === 1 ? '1 stapje' : k + ' stapjes'} na ${nf(a)}.`;
  } else if (r.chance(0.5)) {
    const n = r.int(0, 4),
      k = r.pick([1, 3, 5, 7]);
    o = { min: n, max: n + 1, major: 1, minor: 0.125, arrow: n + k / 8 };
    ans = n + k / 8;
    why =
      `Tussen ${n} en ${n + 1} staan 8 gelijke stapjes. Elk stapje is 1 : 8 = 0,125.` +
      `|De pijl staat ${k === 1 ? '1 stapje' : k + ' stapjes'} na ${n}: ${k} × 0,125 = ${nf(k / 8)}.`;
  } else {
    const a = r.int(111, 989) / 100,
      k = r.pick([1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19]);
    o = { min: a, max: rnd(a + 0.02, 2), major: 0.01, minor: 0.001, arrow: rnd(a + k / 1000, 3) };
    ans = rnd(a + k / 1000, 3);
    why =
      `Tussen twee streepjes met een getal staan 10 gelijke stapjes. Elk stapje is 0,001.` +
      `|De pijl staat ${k === 1 ? '1 stapje' : k + ' stapjes'} na ${nf(a)}.`;
  }
  const w = why.split('|');
  return {
    type: 'num',
    q: p('Welk getal hoort bij de pijl? Schrijf het als kommagetal.'),
    fig: F.nline(o),
    ans,
    expl: steps(w[0], w[1], `Bij de pijl hoort <b>${nf(ans)}</b>.`),
  };
});

def('BH15', 'B', 'H', 'B.9', 'Breuken, procenten en kommagetallen door elkaar', (L, r) => {
  const nice = (x: number, d: number) => Math.abs(x - rnd(x, d)) < 1e-9;
  if (L === 1) {
    const [a, b] = r.pick([
        [1, 2],
        [1, 4],
        [3, 4],
        [1, 5],
        [2, 5],
        [3, 5],
        [4, 5],
        [1, 10],
        [3, 10],
        [7, 10],
      ]),
      dv = r.pick([0.1, 0.2, 0.25, 0.3, 0.5, 0.05, 0.15]),
      sub = r.chance(0.5),
      fv = a / b,
      ans = rnd(sub ? fv - dv : fv + dv, 4);
    if (ans <= 0 || !nice(ans, 2)) throw RETRY;
    return {
      type: 'num',
      q: p('Reken uit. Schrijf de uitkomst als kommagetal.') + som(`${fr(a, b)} ${sub ? '−' : '+'} ${nf(dv)} =`),
      ans,
      expl: steps(
        `Schrijf de breuk als kommagetal: ${fr(a, b)} = ${nf(fv)}.`,
        `${nf(fv)} ${sub ? '−' : '+'} ${nf(dv)} = <b>${nf(ans)}</b>.`,
      ),
    };
  }
  if (L === 2) {
    const f = r.int(1, 3);
    if (f === 1) {
      const w = r.int(1, 4),
        [a, b] = r.pick([
          [1, 2],
          [1, 4],
          [3, 4],
        ]),
        dv = r.pick([0.25, 0.5, 0.05]),
        v = w + a / b,
        ans = rnd(v / dv, 4);
      if (!nice(ans, 0)) throw RETRY;
      return {
        type: 'num',
        q: p('Reken uit.') + som(`${mixed(w, a, b)} : ${nf(dv)} =`),
        ans,
        expl: steps(
          `Schrijf het gemengde getal als kommagetal: ${mixed(w, a, b)} = ${nf(v)}.`,
          `Vermenigvuldig beide getallen met 100: ${nf(v * 100)} : ${nf(dv * 100)}.`,
          `${nf(v * 100)} : ${nf(dv * 100)} = <b>${nf(ans)}</b>.`,
        ),
      };
    }
    if (f === 2) {
      const dv = r.pick([0.6, 0.75, 0.8, 0.9, 1.2, 1.5, 2.4]),
        [a, b] = r.pick([
          [1, 3],
          [2, 3],
          [1, 4],
          [3, 4],
          [2, 5],
          [1, 2],
          [5, 6],
        ]),
        ans = rnd((dv * a) / b, 6);
      if (!nice(ans, 2)) throw RETRY;
      return {
        type: 'num',
        q: p('Reken uit. Schrijf de uitkomst als kommagetal.') + som(`${nf(dv)} × ${fr(a, b)} =`),
        ans,
        expl:
          a === 1
            ? steps(`${fr(1, b)} deel nemen is delen door ${b}.`, `${nf(dv)} : ${b} = <b>${nf(ans)}</b>.`)
            : steps(`Neem eerst ${fr(1, b)} deel: ${nf(dv)} : ${b} = ${f6(dv / b)}.`, `Dan keer ${a}: <b>${nf(ans)}</b>.`),
      };
    }
    const pc = r.pick([20, 25, 50, 10, 40]),
      [a, b] = r.pick([
        [3, 4],
        [1, 5],
        [4, 5],
        [1, 2],
        [2, 5],
        [3, 5],
      ]),
      ans = rnd(((pc / 100) * a) / b, 6);
    if (!nice(ans, 2)) throw RETRY;
    return {
      type: 'num',
      q: p(`Hoeveel is ${pc}% van ${fr(a, b)}? Schrijf de uitkomst als kommagetal.`),
      ans,
      expl: steps(
        `Schrijf de breuk als kommagetal: ${fr(a, b)} = ${nf(a / b)}.`,
        `${pc}% van ${nf(a / b)} is ${nf(a / b)} × ${nf(pc / 100)} = <b>${nf(ans)}</b>.`,
      ),
    };
  }
  const f = r.int(1, 3);
  if (f === 1) {
    const w = r.int(1, 3),
      [a, b] = r.pick([
        [1, 4],
        [3, 4],
        [1, 2],
        [2, 5],
        [4, 5],
      ]),
      dv = r.pick([0.05, 0.25, 0.125, 0.2]),
      v = w + a / b,
      ans = rnd(v / dv, 4);
    if (!nice(ans, 0)) throw RETRY;
    return {
      type: 'num',
      q: p('Reken uit.') + som(`${mixed(w, a, b)} : ${nf(dv)} =`),
      ans,
      expl: steps(
        `Schrijf het gemengde getal als kommagetal: ${mixed(w, a, b)} = ${nf(v)}.`,
        `Vermenigvuldig beide getallen met 1.000: ${nf(v * 1000)} : ${nf(dv * 1000)}.`,
        `${nf(v * 1000)} : ${nf(dv * 1000)} = <b>${nf(ans)}</b>.`,
      ),
    };
  }
  if (f === 2) {
    const k = r.pick([1, 3, 5, 7]),
      dv = r.pick([0.125, 0.25, 0.375, 0.5]),
      sub = r.chance(0.5),
      ans = rnd(sub ? k / 8 - dv : k / 8 + dv, 4);
    if (ans <= 0) throw RETRY;
    return {
      type: 'num',
      q: p('Reken uit. Schrijf de uitkomst als kommagetal.') + som(`${fr(k, 8)} ${sub ? '−' : '+'} ${nf(dv)} =`),
      ans,
      expl: steps(
        k === 1 ? `${fr(1, 8)} = 0,125.` : `${fr(1, 8)} = 0,125, dus ${fr(k, 8)} = ${k} × 0,125 = ${nf(k / 8)}.`,
        `${nf(k / 8)} ${sub ? '−' : '+'} ${nf(dv)} = <b>${nf(ans)}</b>.`,
      ),
    };
  }
  const pc = r.pick([20, 25, 40, 50, 75, 12.5]),
    w = r.int(1, 4),
    [a, b] = r.pick([
      [1, 2],
      [1, 5],
      [2, 5],
      [1, 4],
      [3, 5],
    ]),
    v = w + a / b,
    ans = rnd((pc / 100) * v, 6);
  if (!nice(ans, 2)) throw RETRY;
  return {
    type: 'num',
    q: p(`Hoeveel is ${nf(pc)}% van ${mixed(w, a, b)}? Schrijf de uitkomst als kommagetal.`),
    ans,
    expl: steps(
      `Schrijf het gemengde getal als kommagetal: ${mixed(w, a, b)} = ${nf(v)}.`,
      `${nf(pc)}% van ${nf(v)} is ${nf(v)} × ${f6(pc / 100)} = <b>${nf(ans)}</b>.`,
    ),
  };
});
