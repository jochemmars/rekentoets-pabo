/* Domein A · Hele getallen · hoofdrekenen */
import { nf, en, words, NB } from '../../core/notatie';
import { sum } from '../../core/rekenen';
import { def, RETRY, steps, tip, som, p, ask, mcNum, ordQ } from '../../core/opbouw';
import { gap } from '../hulp';
import { RN, roundEx } from './gedeeld';

const RULE = 'Volgorde: eerst haakjes, dan machten en wortels, dan vermenigvuldigen en delen, als laatste optellen en aftrekken.';

def('AH01', 'A', 'H', 'A.4', 'Handig optellen', (L, r) => {
  if (L === 3 && r.chance(0.5)) {
    const u = r.pick([150, 250, 350, 450, 650, 750]),
      x = 1000 * r.int(1, 4) + u,
      z = 1000 - u,
      y = r.pick([299, 399, 499, 599, 799, 899]);
    const ans = x + y + z;
    return {
      type: 'num',
      q: p('Reken uit.') + som(`${nf(x)} + ${nf(y)} + ${nf(z)} =`),
      ans,
      expl: steps(
        `Zoek eerst een handig paar: ${nf(x)} + ${nf(z)} = ${nf(x + z)}.`,
        `${nf(y)} is 1 minder dan ${nf(y + 1)}: ${nf(x + z)} + ${nf(y + 1)} = ${nf(x + z + y + 1)}.`,
        `Haal er 1 af: <b>${nf(ans)}</b>.`,
      ),
    };
  }
  const base = L === 1 ? r.pick([100, 200, 300]) : L === 2 ? r.pick([1000, 2000, 3000]) : r.pick([10000, 20000]);
  const k = L === 1 ? r.int(1, 3) : L === 2 ? r.pick([1, 2, 3, 5]) : r.pick([5, 15, 25]);
  const a = L === 1 ? r.int(125, 870) : L === 2 ? r.int(1150, 8700) : r.int(12400, 76500);
  const b = base - k,
    ans = a + b;
  return {
    type: 'num',
    q: p('Reken uit.') + som(`${nf(a)} + ${nf(b)} =`),
    ans,
    expl: steps(
      `${nf(b)} is ${k} minder dan ${nf(base)}.`,
      `${nf(a)} + ${nf(base)} = ${nf(a + base)}.`,
      `Haal er ${k} af: <b>${nf(ans)}</b>.`,
    ),
  };
});

def('AH02', 'A', 'H', 'A.4', 'Handig aftrekken', (L, r) => {
  if (L === 3 && r.chance(0.5)) {
    const a = r.pick([10000, 20000, 50000, 100000]);
    let b;
    do {
      b = r.int(1234, Math.min(a - 1001, 48999));
    } while (b % 10 === 0 || b % 100 < 10);
    const ans = a - b;
    return {
      type: 'num',
      q: p('Reken uit.') + som(`${nf(a)} − ${nf(b)} =`),
      ans,
      expl: steps(
        `Haal van beide getallen 1 af. Het verschil blijft gelijk: ${nf(a - 1)} − ${nf(b - 1)}.`,
        `Nu hoef je nergens te lenen: <b>${nf(ans)}</b>.`,
      ),
    };
  }
  let a, bb, k;
  if (L === 1) {
    a = r.int(310, 960);
    bb = r.pick([100, 200]);
    k = r.int(1, 3);
  } else if (L === 2) {
    const m = r.int(3, 9);
    a = 1000 * m + r.int(1, 25);
    bb = 1000 * r.int(1, m - 1);
    k = r.int(2, 8);
  } else {
    a = 10000 * r.int(1, 6) + r.int(1, 30);
    bb = 1000 * r.int(2, 9);
    k = r.int(2, 9);
  }
  const b = bb - k,
    ans = a - b;
  return {
    type: 'num',
    q: p('Reken uit.') + som(`${nf(a)} − ${nf(b)} =`),
    ans,
    expl: steps(
      `${nf(b)} is ${k} minder dan ${nf(bb)}. Trek eerst ${nf(bb)} af: ${nf(a)} − ${nf(bb)} = ${nf(a - bb)}.`,
      `Je hebt ${k} te veel afgetrokken. Tel ${k} erbij: <b>${nf(ans)}</b>.`,
    ),
  };
});

def('AH03', 'A', 'H', 'A.4', 'Handig vermenigvuldigen', (L, r) => {
  let a, b, ex;
  if (L === 1) {
    a = r.int(3, 9);
    b = r.int(12, 68);
    if (b % 10 === 0) throw RETRY;
    const t = Math.floor(b / 10) * 10,
      e = b % 10;
    ex = steps(`Splits ${b} in ${t} en ${e}.`, `${a} × ${t} = ${nf(a * t)} en ${a} × ${e} = ${a * e}.`, `Samen: <b>${nf(a * b)}</b>.`);
  } else if (L === 2) {
    const v = r.pick(['25', '99', '15', '5', '12']);
    if (v === '25') {
      a = 25;
      b = 4 * r.int(3, 22);
      ex = steps(`25 × 4 = 100 en ${b} = 4 × ${b / 4}.`, `Dus 25 × ${b} = 100 × ${b / 4} = <b>${nf(a * b)}</b>.`);
    } else if (v === '99') {
      a = r.pick([99, 101, 49, 51]);
      b = r.int(4, 9);
      const rb = a > 60 ? 100 : 50,
        less = a < rb;
      ex = steps(
        `${a} = ${rb} ${less ? '−' : '+'} 1.`,
        `${rb} × ${b} = ${nf(rb * b)}.`,
        `${less ? 'Haal er' : 'Tel er'} 1 × ${b} = ${b} ${less ? 'af' : 'bij op'}: <b>${nf(a * b)}</b>.`,
      );
    } else if (v === '15') {
      a = 15;
      b = 2 * r.int(6, 32);
      ex = steps(`10 × ${b} = ${nf(10 * b)}.`, `5 × ${b} is de helft daarvan: ${nf(5 * b)}.`, `Samen: <b>${nf(a * b)}</b>.`);
    } else if (v === '5') {
      a = 5;
      b = 2 * r.int(62, 493);
      ex = steps('5 keer is de helft van 10 keer.', `10 × ${b} = ${nf(10 * b)}.`, `De helft daarvan: <b>${nf(a * b)}</b>.`);
    } else {
      a = r.pick([12, 14, 16, 18]);
      b = r.pick([15, 25, 35, 45]);
      ex = steps(
        `Halveer het ene getal en verdubbel het andere: ${a} × ${b} = ${a / 2} × ${2 * b}.`,
        `${a / 2} × ${2 * b} = <b>${nf(a * b)}</b>.`,
      );
    }
  } else {
    const v = r.pick(['198', '250', '75', '125', '999']);
    if (v === '198') {
      const k = r.int(2, 5),
        j = r.int(1, 3);
      a = 100 * k - j;
      b = r.int(4, 9);
      ex = steps(
        `${a} = ${100 * k} − ${j}.`,
        `${100 * k} × ${b} = ${nf(100 * k * b)}.`,
        `Haal er ${j} × ${b} = ${j * b} af: <b>${nf(a * b)}</b>.`,
      );
    } else if (v === '250') {
      a = 4 * r.int(3, 12);
      b = 250;
      ex = steps(`4 × 250 = 1.000 en ${a} = ${a / 4} × 4.`, `Dus ${a} × 250 = ${a / 4} × 1.000 = <b>${nf(a * b)}</b>.`);
    } else if (v === '75') {
      a = 75;
      b = 4 * r.int(3, 9);
      ex = steps(`75 × 4 = 300 en ${b} = 4 × ${b / 4}.`, `Dus 75 × ${b} = 300 × ${b / 4} = <b>${nf(a * b)}</b>.`);
    } else if (v === '125') {
      a = 125;
      b = 8 * r.int(2, 9);
      ex = steps(`125 × 8 = 1.000 en ${b} = 8 × ${b / 8}.`, `Dus 125 × ${b} = 1.000 × ${b / 8} = <b>${nf(a * b)}</b>.`);
    } else {
      a = r.pick([999, 1001]);
      b = r.int(4, 9);
      const less = a < 1000;
      ex = steps(
        `${nf(a)} = 1.000 ${less ? '−' : '+'} 1.`,
        `1.000 × ${b} = ${nf(1000 * b)}.`,
        `${less ? 'Haal er' : 'Tel er'} ${b} ${less ? 'af' : 'bij op'}: <b>${nf(a * b)}</b>.`,
      );
    }
  }
  return { type: 'num', q: p('Reken uit.') + som(`${nf(a)} × ${nf(b)} =`), ans: a * b, expl: ex };
});

def('AH04', 'A', 'H', 'A.4', 'Delen', (L, r) => {
  let N, d, ans, ex;
  if (L === 1) {
    const dd = r.int(3, 9),
      q0 = r.int(3, 9),
      k = r.pick([1, 2]),
      j = r.int(0, 1);
    N = dd * q0 * Math.pow(10, k);
    d = dd * Math.pow(10, j);
    ans = q0 * Math.pow(10, k - j);
    ex = j
      ? steps(
          `Haal bij beide getallen een nul weg: ${nf(N)} : ${d} = ${nf(N / 10)} : ${dd}.`,
          k === 1
            ? `${dd * q0} : ${dd} = <b>${nf(ans)}</b>.`
            : `${dd * q0} : ${dd} = ${q0}, dus ${nf(N / 10)} : ${dd} = <b>${nf(ans)}</b>.`,
        )
      : steps(
          `${dd * q0} : ${dd} = ${q0}.`,
          `${nf(N)} is ${k === 1 ? '10' : '100'} keer zo groot als ${dd * q0}, dus de uitkomst ook: <b>${nf(ans)}</b>.`,
        );
  } else {
    let big, small;
    if (L === 2) {
      d = r.pick([4, 5, 6, 8, 9, 12, 25]);
      if (r.chance(0.5)) {
        const h = r.int(1, 9),
          u = r.int(1, 9);
        big = 100 * h;
        small = u;
      } else {
        const h = r.int(1, 4),
          u = r.int(1, 9);
        big = 1000 * h;
        small = 10 * u;
      }
    } else {
      d = r.pick([12, 15, 18, 24, 36, 45]);
      big = 1000 * r.int(1, 4);
      small = r.int(1, 20);
    }
    const q = big + small;
    N = d * q;
    ans = q;
    ex = steps(
      `Splits ${nf(N)} in ${nf(d * big)} + ${nf(d * small)}.`,
      `${nf(d * big)} : ${d} = ${nf(big)} en ${nf(d * small)} : ${d} = ${small}.`,
      `Samen: <b>${nf(ans)}</b>.`,
    );
  }
  return { type: 'num', q: p('Reken uit.') + som(`${nf(N)} : ${nf(d)} =`), ans, expl: ex };
});

def('AH05', 'A', 'H', 'A.4', 'Volgorde van bewerkingen', (L, r) => {
  let s, ans, ex;
  if (L === 1) {
    if (r.chance(0.5)) {
      const a = r.int(4, 30),
        b = r.int(2, 9),
        c = r.int(3, 9);
      s = `${a} + ${b} × ${c}`;
      ans = a + b * c;
      ex = steps(RULE, `Eerst ${b} × ${c} = ${b * c}.`, `Dan ${a} + ${b * c} = <b>${ans}</b>.`);
    } else {
      const c = r.int(2, 9),
        q = r.int(2, 9),
        b = c * q,
        a = q + r.int(3, 30);
      s = `${a} − ${b} : ${c}`;
      ans = a - q;
      ex = steps(RULE, `Eerst ${b} : ${c} = ${q}.`, `Dan ${a} − ${q} = <b>${ans}</b>.`);
    }
  } else if (L === 2) {
    const f = r.int(1, 4);
    if (f === 1) {
      const d = r.int(3, 12),
        b = r.int(4, 20),
        a = b + d,
        c = r.int(6, 19);
      s = `(${a} − ${b}) × ${c}`;
      ans = d * c;
      ex = steps(RULE, `Eerst de haakjes: ${a} − ${b} = ${d}.`, `Dan ${d} × ${c} = <b>${ans}</b>.`);
    } else if (f === 2) {
      const a = r.int(6, 12),
        b = r.int(6, 9),
        c = r.int(2, 5),
        d = r.int(3, 9);
      if (a * b - c * d < 3) throw RETRY;
      s = `${a} × ${b} − ${c} × ${d}`;
      ans = a * b - c * d;
      ex = steps(RULE, `${a} × ${b} = ${a * b} en ${c} × ${d} = ${c * d}.`, `Dan ${a * b} − ${c * d} = <b>${ans}</b>.`);
    } else if (f === 3) {
      const a = r.int(5, 40),
        b = r.int(3, 9),
        d = r.int(2, 9),
        c = d + r.int(2, 9);
      s = `${a} + ${b} × (${c} − ${d})`;
      ans = a + b * (c - d);
      ex = steps(
        RULE,
        `Eerst de haakjes: ${c} − ${d} = ${c - d}.`,
        `Dan ${b} × ${c - d} = ${b * (c - d)}.`,
        `Als laatste ${a} + ${b * (c - d)} = <b>${ans}</b>.`,
      );
    } else {
      const b = r.int(2, 9),
        c = r.int(2, 9),
        d = r.int(3, 8),
        a = (b + c) * d + r.int(5, 40);
      s = `${a} − (${b} + ${c}) × ${d}`;
      ans = a - (b + c) * d;
      ex = steps(
        RULE,
        `Eerst de haakjes: ${b} + ${c} = ${b + c}.`,
        `Dan ${b + c} × ${d} = ${(b + c) * d}.`,
        `Als laatste ${a} − ${(b + c) * d} = <b>${ans}</b>.`,
      );
    }
  } else {
    const f = r.int(1, 3);
    if (f === 1) {
      const sq = r.int(3, 9),
        b = r.int(3, 9),
        c = r.int(3, 9),
        g = r.int(2, 6),
        q = r.int(2, 9),
        e = g * q;
      s = `${sq}² + ${b} × ${c} − ${e} : ${g}`;
      ans = sq * sq + b * c - q;
      ex = steps(
        RULE,
        `${sq}² = ${sq * sq}.`,
        `${b} × ${c} = ${b * c} en ${e} : ${g} = ${q}.`,
        `${sq * sq} + ${b * c} − ${q} = <b>${ans}</b>.`,
      );
    } else if (f === 2) {
      const w = r.int(4, 12),
        d = r.int(1, 6),
        a = d + r.int(2, 7),
        t = r.int(3, 9);
      s = `√${w * w} × (${a} − ${d}) + ${t}²`;
      ans = w * (a - d) + t * t;
      ex = steps(
        RULE,
        `Haakjes: ${a} − ${d} = ${a - d}.`,
        `√${w * w} = ${w} en ${t}² = ${t * t}.`,
        `${w} × ${a - d} = ${w * (a - d)}.`,
        `${w * (a - d)} + ${t * t} = <b>${ans}</b>.`,
      );
    } else {
      const sv = r.pick([4, 6, 8, 9, 10, 12]);
      const d = r.pick([2, 3, 4, 6, 8, 9].filter((x) => (sv * sv) % x === 0));
      const b = r.int(1, sv - 1),
        c = sv - b;
      const A = (sv * sv) / d + r.int(10, 60);
      s = `${A} − (${b} + ${c})² : ${d}`;
      ans = A - (sv * sv) / d;
      ex = steps(
        RULE,
        `Haakjes: ${b} + ${c} = ${sv}.`,
        `${sv}² = ${sv * sv}.`,
        `${sv * sv} : ${d} = ${(sv * sv) / d}.`,
        `${A} − ${(sv * sv) / d} = <b>${ans}</b>.`,
      );
    }
  }
  return { type: 'num', q: p('Reken uit.') + som(s + ' ='), ans, expl: ex };
});

def('AH06', 'A', 'H', 'A.4', 'Rekenen met negatieve getallen', (L, r) => {
  let s, ans, ex;
  if (L === 1) {
    const f = r.int(1, 3);
    if (f === 1) {
      const a = r.int(3, 15),
        b = r.int(a + 1, a + 15);
      s = `−${a} + ${b}`;
      ans = b - a;
      ex = steps(`Je begint op −${a} en gaat ${b} omhoog.`, `Tot 0 is dat ${a}, daarna blijft er nog ${b} − ${a} over: <b>${ans}</b>.`);
    } else if (f === 2) {
      const a = r.int(2, 12),
        b = r.int(a + 2, a + 15);
      s = `${a} − ${b}`;
      ans = a - b;
      ex = steps(`Je begint op ${a} en gaat ${b} omlaag.`, `Tot 0 is dat ${a}, daarna ga je nog ${b - a} onder nul: <b>${nf(ans)}</b>.`);
    } else {
      const a = r.int(2, 15),
        b = r.int(2, 15);
      s = `−${a} − ${b}`;
      ans = -a - b;
      ex = steps(`Je begint op −${a} en gaat nog ${b} verder omlaag.`, `${a} + ${b} = ${a + b}, dus de uitkomst is <b>${nf(ans)}</b>.`);
    }
  } else if (L === 2) {
    const f = r.int(1, 5);
    if (f === 1) {
      const a = r.int(3, 15),
        b = r.int(5, 20),
        c = r.int(5, 20);
      s = `−${a} + ${b} − ${c}`;
      ans = -a + b - c;
      ex = steps(`−${a} + ${b} = ${nf(b - a)}.`, `${nf(b - a)} − ${c} = <b>${nf(ans)}</b>.`);
    } else if (f === 2) {
      const a = r.int(3, 12),
        b = r.int(3, 9);
      s = `−${a} × ${b}`;
      ans = -a * b;
      ex = steps(`${a} × ${b} = ${a * b}.`, `Een negatief getal keer een positief getal is negatief: <b>${nf(ans)}</b>.`);
    } else if (f === 3) {
      const b = r.int(3, 9),
        q = r.int(3, 12);
      s = `−${b * q} : ${b}`;
      ans = -q;
      ex = steps(`${b * q} : ${b} = ${q}.`, `Een negatief getal gedeeld door een positief getal is negatief: <b>${nf(ans)}</b>.`);
    } else if (f === 4) {
      const a = r.int(5, 30),
        b = r.int(3, 20);
      s = `${a} − (−${b})`;
      ans = a + b;
      ex = steps('Een negatief getal aftrekken is hetzelfde als optellen.', `${a} + ${b} = <b>${ans}</b>.`);
    } else {
      const t0 = -r.int(2, 9),
        up = r.int(4, 12),
        down = r.int(up + 1, up + 9);
      ans = t0 + up - down;
      return {
        type: 'num',
        unit: '°C',
        q:
          p(
            `Om 7 uur is het ${nf(t0)}${NB}°C. Overdag stijgt de temperatuur ${up} graden. In de avond daalt de temperatuur ${down} graden.`,
          ) + ask('Hoe warm is het dan?'),
        ans,
        expl: steps(`${nf(t0)} + ${up} = ${nf(t0 + up)}.`, `${nf(t0 + up)} − ${down} = <b>${nf(ans)}</b> °C.`),
      };
    }
  } else {
    const f = r.int(1, 4);
    if (f === 1) {
      const a = r.int(3, 9),
        b = r.int(3, 9),
        c = r.int(5, 40);
      s = `−${a} × (−${b}) + (−${c})`;
      ans = a * b - c;
      ex = steps(`Min keer min is plus: −${a} × (−${b}) = ${a * b}.`, `${a * b} + (−${c}) = ${a * b} − ${c} = <b>${nf(ans)}</b>.`);
    } else if (f === 2) {
      const a = r.int(3, 9),
        c = r.int(10, 99);
      s = `(−${a})² − ${c}`;
      ans = a * a - c;
      ex = steps(`(−${a})² = −${a} × (−${a}) = ${a * a}.`, `${a * a} − ${c} = <b>${nf(ans)}</b>.`);
    } else if (f === 3) {
      const b = r.int(3, 9),
        q = r.int(4, 25),
        c = r.int(5, 40);
      s = `−${b * q} : ${b} − (−${c})`;
      ans = -q + c;
      ex = steps(`−${b * q} : ${b} = −${q}.`, `Een negatief getal aftrekken is optellen: −${q} + ${c} = <b>${nf(ans)}</b>.`);
    } else {
      const a = r.int(3, 9),
        b = r.int(3, 9),
        c = r.int(2, 9),
        d = r.int(2, 9);
      s = `${a} × (−${b}) − (−${c}) × ${d}`;
      ans = -a * b + c * d;
      ex = steps(
        `${a} × (−${b}) = −${a * b} en (−${c}) × ${d} = −${c * d}.`,
        `−${a * b} − (−${c * d}) = −${a * b} + ${c * d} = <b>${nf(ans)}</b>.`,
      );
    }
  }
  return { type: 'num', q: p('Reken uit.') + som(s + ' ='), ans, expl: ex };
});

def('AH07', 'A', 'H', 'A.4', 'Kwadraten, machten en wortels', (L, r) => {
  let s, ans, ex;
  const sqEx = (n: number) => {
    const t = Math.floor(n / 10) * 10,
      e = n % 10;
    if (n < 13) return steps(`${n}² betekent ${n} × ${n}.`, `${n} × ${n} = <b>${n * n}</b>.`);
    if (e === 0) return steps(`${n / 10} × ${n / 10} = ${(n * n) / 100}.`, `Twee nullen erachter: <b>${nf(n * n)}</b>.`);
    return steps(`${n}² = ${n} × ${n}. Splits: ${n} × ${t} = ${n * t} en ${n} × ${e} = ${n * e}.`, `Samen: <b>${nf(n * n)}</b>.`);
  };
  if (L === 1) {
    const n = r.int(4, 12);
    if (r.chance(0.5)) {
      s = `${n}²`;
      ans = n * n;
      ex = sqEx(n);
    } else {
      s = `√${n * n}`;
      ans = n;
      ex = steps(
        `Zoek het getal dat met zichzelf vermenigvuldigd ${n * n} geeft.`,
        `${n} × ${n} = ${n * n}, dus de wortel is <b>${n}</b>.`,
      );
    }
  } else if (L === 2) {
    const f = r.int(1, 3),
      n = r.pick([13, 14, 15, 16, 17, 18, 19, 20, 25, 30]);
    if (f === 1) {
      s = `${n}²`;
      ans = n * n;
      ex = sqEx(n);
    } else if (f === 2) {
      s = `√${n * n}`;
      ans = n;
      ex = steps(
        `Zoek het getal dat met zichzelf vermenigvuldigd ${n * n} geeft.`,
        `Probeer: ${n} × ${n} = ${n * n}. De wortel is <b>${n}</b>.`,
      );
    } else {
      const [b, e] = r.pick([
        [2, 3],
        [2, 4],
        [2, 5],
        [2, 6],
        [3, 3],
        [4, 3],
        [5, 3],
        [10, 3],
        [10, 4],
        [10, 5],
        [3, 4],
      ]);
      s = `${b}<sup>${e}</sup>`;
      ans = Math.pow(b, e);
      ex = steps(
        `${b}<sup>${e}</sup> betekent ${e} keer het getal ${b} met elkaar vermenigvuldigen.`,
        `${Array(e).fill(b).join(' × ')} = <b>${nf(ans)}</b>.`,
      );
    }
  } else {
    const f = r.int(1, 4);
    if (f === 1) {
      const w = r.int(6, 15),
        b = r.int(4, 9);
      s = `√${w * w} + ${b}²`;
      ans = w + b * b;
      ex = steps(`√${w * w} = ${w}, want ${w} × ${w} = ${w * w}.`, `${b}² = ${b * b}.`, `${w} + ${b * b} = <b>${ans}</b>.`);
    } else if (f === 2) {
      const c = r.int(3, 9),
        w = r.int(11, 16);
      s = `${c} × √${w * w}`;
      ans = c * w;
      ex = steps(`√${w * w} = ${w}, want ${w} × ${w} = ${w * w}.`, `${c} × ${w} = <b>${ans}</b>.`);
    } else if (f === 3) {
      const n = r.int(15, 40);
      s = `${n + 1}² − ${n}²`;
      ans = 2 * n + 1;
      ex = steps(
        `${n + 1}² is ${n + 1} × ${n + 1}. Dat is ${n}² + ${n} + ${n + 1}.`,
        `Het verschil is dus ${n} + ${n + 1} = <b>${ans}</b>.`,
      );
    } else {
      const [a, b] = r.pick([
        [4, 25],
        [9, 16],
        [4, 36],
        [9, 25],
        [16, 25],
        [4, 49],
        [9, 49],
        [4, 81],
      ]);
      const ra = Math.sqrt(a),
        rb = Math.sqrt(b);
      s = `√(${a} × ${b})`;
      ans = ra * rb;
      ex = steps(`Je mag de wortel per getal nemen: √${a} = ${ra} en √${b} = ${rb}.`, `${ra} × ${rb} = <b>${ans}</b>.`);
    }
  }
  return { type: 'num', q: p('Reken uit.') + som(s + ' ='), ans, expl: ex };
});

def('AH08', 'A', 'H', 'A.3', 'Afronden', (L, r) => {
  let n, u;
  if (L === 1) {
    n = r.int(1012, 9988);
    u = r.pick([10, 100]);
  } else if (L === 2) {
    u = r.pick([100, 1000, 10000]);
    n = r.int(12000, 987000);
    if (r.chance(0.35)) n = Math.floor(n / (10 * u)) * 10 * u + 10 * u - r.int(1, u / 2);
  } else if (r.chance(0.5)) {
    n = r.int(101000000, 989000000);
    u = 1000000;
    if (n % u === 0) throw RETRY;
    const ans = Math.round(n / u);
    return {
      type: 'num',
      unit: 'miljoen',
      q: p(`Rond ${nf(n)} af op miljoenen.`) + ask('Hoeveel miljoen is dat?'),
      ans,
      expl: roundEx(n, u, `, dus <b>${ans}</b> miljoen`),
    };
  } else {
    n = r.int(1020000, 9870000);
    u = r.pick([10000, 100000]);
  }
  if (n % u === 0) throw RETRY;
  return { type: 'num', q: p(`Rond ${nf(n)} af op ${RN[u]}.`), ans: Math.round(n / u) * u, expl: roundEx(n, u) };
});

def('AH09', 'A', 'H', 'A.3', 'Schatten', (L, r) => {
  let expr, exact, est, opts, ex;
  const near = (base: number, dmax: number) => base + r.pick([-1, 1]) * r.int(1, dmax);
  if (L === 1) {
    const A = 10 * r.int(2, 9),
      B = 10 * r.int(2, 9),
      a = near(A, 2),
      b = near(B, 2);
    expr = `${a} × ${b}`;
    exact = a * b;
    est = A * B;
    opts = [est / 10, est * 10, est / 2];
    ex = `${a} is ongeveer ${A} en ${b} is ongeveer ${B}. ${A} × ${B} = ${nf(est)}.`;
  } else if (L === 2) {
    const A = 1000 * r.int(2, 9),
      B = 10 * r.int(2, 6),
      a = near(A, 45),
      b = near(B, 2);
    expr = `${nf(a)} × ${b}`;
    exact = a * b;
    est = A * B;
    opts = [est / 10, est * 10, est / 2];
    ex = `${nf(a)} is ongeveer ${nf(A)} en ${b} is ongeveer ${B}. ${nf(A)} × ${B} = ${nf(est)}.`;
  } else {
    const f = r.int(1, 3);
    if (f === 1) {
      const B = 10 * r.int(2, 8),
        Q = r.pick([200, 300, 400, 500, 600, 800]),
        A = B * Q,
        a = near(A, A / 100),
        b = near(B, 1);
      expr = `${nf(a)} : ${b}`;
      exact = a / b;
      est = Q;
      opts = [Q / 10, Q * 10, Q / 2];
      ex = `${nf(a)} is ongeveer ${nf(A)} en ${b} is ongeveer ${B}. ${nf(A)} : ${B} = ${nf(Q)}.`;
    } else if (f === 2) {
      const A = 100 * r.int(3, 9),
        B = 100 * r.int(3, 9),
        a = near(A, 14),
        b = near(B, 14);
      expr = `${a} × ${b}`;
      exact = a * b;
      est = A * B;
      opts = [est / 10, est * 10, est / 2];
      ex = `${a} is ongeveer ${A} en ${b} is ongeveer ${B}. ${A} × ${B} = ${nf(est)}.`;
    } else {
      const parts = [0, 1, 2, 3].map(() => 1000 * r.int(2, 9)),
        vals = parts.map((v) => near(v, 60));
      expr = vals.map((v) => nf(v)).join(' + ');
      exact = sum(vals);
      est = sum(parts);
      opts = [est - 2000, est + 2000, est - 1000];
      ex = `Rond elk getal af op duizendtallen: ${parts.map((v) => nf(v)).join(' + ')} = ${nf(est)}.`;
    }
  }
  const all = [est].concat(opts);
  if (all.some((o) => Math.abs(o - exact) <= Math.abs(est - exact) && o !== est)) throw RETRY;
  return Object.assign(mcNum(r, est, opts), {
    q: p(`Welke uitkomst ligt het dichtst bij <b>${expr}</b>?`) + p('Je hoeft niet precies te rekenen.'),
    expl: steps('Rond de getallen af op makkelijke getallen en reken daarmee.', ex, `Het antwoord ligt het dichtst bij <b>${nf(est)}</b>.`),
  });
});

def('AH10', 'A', 'H', 'A.5', 'Gemiddelde', (L, r) => {
  if (L === 1) {
    const m = r.int(8, 20),
      a = r.int(3, 30),
      b = r.int(3, 30),
      c = 3 * m - a - b;
    if (c < 2 || c > 40 || new Set([a, b, c]).size < 3) throw RETRY;
    return {
      type: 'num',
      q: p(`Wat is het gemiddelde van ${a}, ${b} en ${c}?`),
      ans: m,
      expl: steps(
        `Tel de getallen op: ${a} + ${b} + ${c} = ${a + b + c}.`,
        `Deel door het aantal getallen: ${a + b + c} : 3 = <b>${m}</b>.`,
      ),
    };
  }
  if (L === 2) {
    if (r.chance(0.5)) {
      const n = r.pick([4, 5]),
        m = r.int(12, 45),
        v = [];
      let s = 0;
      for (let i = 0; i < n - 1; i++) {
        const x = m + r.int(-10, 10);
        v.push(x);
        s += x;
      }
      const last = n * m - s;
      if (last < 2 || Math.abs(last - m) > 14) throw RETRY;
      v.push(last);
      const vs = r.shuffle(v);
      return {
        type: 'num',
        q: p(`Wat is het gemiddelde van ${en(vs)}?`),
        ans: m,
        expl: steps(`Tel de getallen op: ${vs.join(' + ')} = ${n * m}.`, `Deel door ${n}: ${n * m} : ${n} = <b>${m}</b>.`),
      };
    }
    const m = r.int(-4, 6),
      a = -r.int(1, 12),
      b = r.int(0, 15),
      c = 3 * m - a - b;
    if (c < -15 || c > 25 || c === a || c === b) throw RETRY;
    const vs = r.shuffle([a, b, c]);
    return {
      type: 'num',
      unit: '°C',
      q:
        p(`Op drie dagen is om 8 uur de temperatuur gemeten: ${en(vs.map((v) => nf(v) + NB + '°C'))}.`) +
        ask('Wat is de gemiddelde temperatuur?'),
      ans: m,
      expl: steps(
        `Tel de temperaturen op: ${vs.map((v) => (v < 0 ? '(' + nf(v) + ')' : nf(v))).join(' + ')} = ${nf(3 * m)}.`,
        `Deel door 3: ${nf(3 * m)} : 3 = <b>${nf(m)}</b> °C.`,
      ),
    };
  }
  const n = r.pick([4, 5]),
    m = r.int(10, 30),
    v = [];
  let s = 0;
  for (let i = 0; i < n - 1; i++) {
    const x = m + r.int(-8, 8);
    v.push(x);
    s += x;
  }
  const x = n * m - s;
  if (x < 1 || x > 60 || x === m) throw RETRY;
  return {
    type: 'num',
    q:
      p(`Het gemiddelde van ${n === 4 ? 'vier' : 'vijf'} getallen is ${m}. ${n === 4 ? 'Drie' : 'Vier'} van de getallen zijn ${en(v)}.`) +
      ask(`Wat is het ${n === 4 ? 'vierde' : 'vijfde'} getal?`),
    ans: x,
    expl: steps(
      `Samen zijn de ${n} getallen ${n} × ${m} = ${n * m}.`,
      `De bekende getallen zijn samen ${v.join(' + ')} = ${s}.`,
      `Het ontbrekende getal is ${n * m} − ${s} = <b>${x}</b>.`,
    ),
  };
});

/* verpakken: hoeveel vol, hoeveel over */
interface FloorC {
  N: [number, number];
  c: number[];
  t: (N: number, c: number) => string;
  full: string;
  rest: string;
  fq: string;
  rq: string;
}
/* vervoeren: hoeveel nodig, hoeveel leeg */
interface CeilC {
  N: [number, number];
  c: number[];
  t: (N: number, c: number) => string;
  aq: string;
  eq: string;
}
const FLOORC: FloorC[] = [
  {
    N: [130, 480],
    c: [6, 10, 12],
    t: (N: number, c: number) => `Een boer heeft ${N} eieren. Hij verpakt ze in dozen van ${c} eieren.`,
    full: 'volle dozen',
    rest: 'eieren over',
    fq: 'Hoeveel volle dozen kan hij maken?',
    rq: 'Hoeveel eieren blijven er over?',
  },
  {
    N: [250, 900],
    c: [12, 24],
    t: (N: number, c: number) => `In een fabriek staan ${N} flessen klaar. Ze gaan in kratten van ${c} flessen.`,
    full: 'volle kratten',
    rest: 'flessen over',
    fq: 'Hoeveel volle kratten worden dat?',
    rq: 'Hoeveel flessen blijven er over?',
  },
  {
    N: [90, 260],
    c: [3, 4],
    t: (N: number, c: number) => `Een sportwinkel heeft ${N} tennisballen. Ze worden verpakt in kokers van ${c} ballen.`,
    full: 'volle kokers',
    rest: 'ballen over',
    fq: 'Hoeveel volle kokers zijn dat?',
    rq: 'Hoeveel ballen blijven er over?',
  },
  {
    N: [150, 600],
    c: [8, 15, 25],
    t: (N: number, c: number) => `Een bakker bakt ${N} koekjes en doet ze in zakjes van ${c} koekjes.`,
    full: 'volle zakjes',
    rest: 'koekjes over',
    fq: 'Hoeveel volle zakjes kan de bakker maken?',
    rq: 'Hoeveel koekjes blijven er over?',
  },
  {
    N: [200, 700],
    c: [14, 18, 24],
    t: (N: number, c: number) => `In de aula worden ${N} stoelen neergezet in rijen van ${c} stoelen.`,
    full: 'volle rijen',
    rest: 'stoelen over',
    fq: 'Hoeveel volle rijen worden het?',
    rq: 'Hoeveel stoelen blijven er over voor de laatste rij?',
  },
];
const CEILC: CeilC[] = [
  {
    N: [150, 700],
    c: [48, 52, 56],
    t: (N: number, c: number) => `Er gaan ${N} leerlingen op excursie. In één bus passen ${c} leerlingen.`,
    aq: 'Hoeveel bussen zijn er minstens nodig?',
    eq: 'De school bestelt zo min mogelijk bussen. Hoeveel zitplaatsen blijven er leeg?',
  },
  {
    N: [60, 250],
    c: [6, 8],
    t: (N: number, c: number) => `Bij de kabelbaan staan ${N} mensen te wachten. In één gondel passen ${c} mensen.`,
    aq: 'Hoeveel gondels zijn er minstens nodig om iedereen mee te nemen?',
    eq: 'Alle gondels gaan vol weg, behalve de laatste. Hoeveel plaatsen blijven er in de laatste gondel leeg?',
  },
  {
    N: [120, 500],
    c: [15, 18, 25],
    t: (N: number, c: number) => `Een bibliotheek verhuist ${N} boeken. In één doos passen ${c} boeken.`,
    aq: 'Hoeveel dozen zijn er minstens nodig?',
    eq: 'Alle dozen worden helemaal gevuld, behalve de laatste. Hoeveel boeken kunnen er nog bij in de laatste doos?',
  },
  {
    N: [90, 400],
    c: [24, 36],
    t: (N: number, c: number) => `Er willen ${N} auto's de rivier over. Op de veerboot passen ${c} auto's per overtocht.`,
    aq: 'Hoeveel overtochten zijn er minstens nodig?',
    eq: 'De boot vaart steeds vol, behalve bij de laatste overtocht. Hoeveel plekken blijven er dan leeg?',
  },
  {
    N: [40, 130],
    c: [4, 6],
    t: (N: number, c: number) => `Op schoolkamp slapen ${N} leerlingen in tenten. In één tent passen ${c} leerlingen.`,
    aq: 'Hoeveel tenten zijn er minstens nodig?',
    eq: 'Er worden zo min mogelijk tenten opgezet. Hoeveel slaapplaatsen blijven er leeg?',
  },
];
/* enkelvoud bij rest 1 */
const ENKELVOUD: Partial<Record<string, string>> = {
  'eieren over': 'ei over',
  'flessen over': 'fles over',
  'ballen over': 'bal over',
  'koekjes over': 'koekje over',
  'stoelen over': 'stoel over',
};
def('AH11', 'A', 'H', 'A.4', 'Delen met rest', (L, r) => {
  const ceil = L === 2 ? r.chance(0.5) : L === 3 ? r.chance(0.5) : false;
  const C = r.pick<FloorC | CeilC>(ceil ? CEILC : FLOORC),
    c = r.pick(C.c),
    N = r.int(C.N[0], C.N[1]),
    q = Math.floor(N / c),
    rest = N - q * c;
  if (rest === 0) throw RETRY;
  const base = `${N} : ${c} = ${q} rest ${rest}, want ${q} × ${c} = ${nf(q * c)} en ${N} − ${nf(q * c)} = ${rest}.`;
  // 'aq' in C is gelijk aan ceil
  if ('aq' in C) {
    if (L === 3)
      return {
        type: 'num',
        q: p(C.t(N, c)) + ask(C.eq),
        ans: c - rest,
        expl: steps(
          base,
          `Er zijn dus ${q + 1} nodig, met samen ${q + 1} × ${c} = ${nf((q + 1) * c)} plaatsen.`,
          `${nf((q + 1) * c)} − ${N} = <b>${c - rest}</b>.`,
        ),
      };
    return {
      type: 'num',
      q: p(C.t(N, c)) + ask(C.aq),
      ans: q + 1,
      expl: steps(
        base,
        rest === 1
          ? `Met ${q} kom je er niet: er blijft er dan nog 1 over en die moet ook mee.`
          : `Met ${q} kom je er niet: de overige ${rest} moeten ook mee.`,
        `Er zijn er minstens <b>${q + 1}</b> nodig.`,
      ),
    };
  }
  if (L === 1) return { type: 'num', q: p(C.t(N, c)) + ask(C.fq), ans: q, expl: steps(base, `Dat zijn <b>${q}</b> ${C.full}.`) };
  if (L === 2)
    return {
      type: 'num',
      q: p(C.t(N, c)) + ask(C.rq),
      ans: rest,
      expl: steps(base, rest === 1 ? 'Er blijft er <b>1</b> over.' : `Er blijven er <b>${rest}</b> over.`),
    };
  return {
    type: 'multi',
    q: p(C.t(N, c)) + ask('Vul beide getallen in.'),
    fields: [
      { ans: q, unit: C.full },
      { ans: rest, unit: C.rest },
    ],
    expl: steps(base, `Dus <b>${q}</b> ${C.full} en <b>${rest}</b> ${rest === 1 ? ENKELVOUD[C.rest] || C.rest : C.rest}.`),
  };
});

def('AH12', 'A', 'H', 'A.1', 'Getallen in cijfers schrijven', (L, r) => {
  if (L === 1) {
    let n;
    do {
      n = r.int(10001, 99999);
    } while (String(n).indexOf('0') < 0 || n % 1000 === 0);
    return {
      type: 'num',
      q: p('Schrijf in cijfers:') + som(`<span class="wrd">${words(n)}</span>`),
      ans: n,
      expl:
        steps(
          `${words(Math.floor(n / 1000))}duizend is ${nf(Math.floor(n / 1000) * 1000)}.`,
          `Daar komt ${n % 1000} bij: <b>${nf(n)}</b>.`,
        ) + tip('Je typt het getal zonder punten: ' + n + '.'),
    };
  }
  if (L === 2) {
    if (r.chance(0.5)) {
      const x = r.int(1, 25),
        y = r.int(1, 9),
        n = (10 * x + y) * 100000;
      return {
        type: 'num',
        q: p('Schrijf in cijfers:') + som(`${x},${y} miljoen`),
        ans: n,
        expl: steps(
          '1 miljoen = 1.000.000 en 0,1 miljoen = 100.000.',
          `${x} miljoen = ${nf(x * 1e6)} en 0,${y} miljoen = ${nf(y * 1e5)}.`,
          `Samen: <b>${nf(n)}</b>.`,
        ),
      };
    }
    const m = r.int(2, 9),
      k = r.int(1, 99),
      n = m * 1e6 + k * 1000;
    return {
      type: 'num',
      q: p('Schrijf in cijfers:') + som(`<span class="wrd">${words(n)}</span>`),
      ans: n,
      expl: steps(
        `${words(m)} miljoen = ${nf(m * 1e6)}.`,
        `${words(k)}duizend = ${nf(k * 1000)}.`.replace(/^eenduizend/, 'duizend'),
        `Samen: <b>${nf(n)}</b>.`,
      ),
    };
  }
  if (r.chance(0.55)) {
    const x = r.int(1, 30),
      f = r.int(1, 3);
    if (f === 1) {
      const y = r.int(1, 9),
        n = x * 1e6 + y * 1e4;
      return {
        type: 'num',
        q: p('Schrijf in cijfers:') + som(`${x},0${y} miljoen`),
        ans: n,
        expl:
          steps(
            `${x} miljoen = ${nf(x * 1e6)}.`,
            `0,0${y} miljoen is ${y} honderdste miljoen: ${nf(y * 1e4)}.`,
            `Samen: <b>${nf(n)}</b>.`,
          ) + tip('Je typt het getal zonder punten.'),
      };
    }
    if (f === 2) {
      const y = r.int(1, 9),
        n = x * 1e9 + y * 1e8;
      return {
        type: 'num',
        q: p('Schrijf in cijfers:') + som(`${x},${y} miljard`),
        ans: n,
        expl:
          steps(
            `1 miljard = 1.000.000.000 en 0,1 miljard = 100.000.000.`,
            `${x} miljard = ${nf(x * 1e9)} en 0,${y} miljard = ${nf(y * 1e8)}.`,
            `Samen: <b>${nf(n)}</b>.`,
          ) + tip('Je typt het getal zonder punten.'),
      };
    }
    const y = r.int(11, 99),
      n = x * 1e6 + y * 1e4;
    if (y % 10 === 0) throw RETRY;
    return {
      type: 'num',
      q: p('Schrijf in cijfers:') + som(`${x},${y} miljoen`),
      ans: n,
      expl:
        steps(`${x} miljoen = ${nf(x * 1e6)}.`, `0,${y} miljoen = ${nf(y * 1e4)}.`, `Samen: <b>${nf(n)}</b>.`) +
        tip('Je typt het getal zonder punten.'),
    };
  }
  const c = r.pick<[string, number, string]>([
    ['2,05 miljard', 2050000000, '1 miljard = 1.000.000.000 en 0,05 miljard = 50.000.000.'],
    ['0,3 miljard', 300000000, '1 miljard = 1.000.000.000, dus 0,3 miljard is drie tiende daarvan.'],
    ['een kwart miljoen', 250000, 'Een kwart van 1.000.000 is 1.000.000 : 4.'],
    ['anderhalf miljoen', 1500000, 'Anderhalf is 1,5. Dus 1.000.000 + 500.000.'],
    ['een half miljard', 500000000, 'De helft van 1.000.000.000.'],
    ['driekwart miljoen', 750000, 'Driekwart van 1.000.000 is 3 × 250.000.'],
    ['4,25 miljoen', 4250000, '4 miljoen = 4.000.000 en 0,25 miljoen = 250.000.'],
    ['12,08 miljoen', 12080000, '12 miljoen = 12.000.000 en 0,08 miljoen = 80.000.'],
    ['1,007 miljard', 1007000000, '1 miljard = 1.000.000.000 en 0,007 miljard = 7.000.000.'],
  ]);
  return {
    type: 'num',
    q: p('Schrijf in cijfers:') + som(c[0]),
    ans: c[1],
    expl: steps(c[2], `Het getal is <b>${nf(c[1])}</b>.`) + tip('Je typt het getal zonder punten.'),
  };
});

def('AH13', 'A', 'H', 'A.4', 'Welk getal ontbreekt?', (L, r) => {
  let s, x, ex;
  if (L === 1) {
    const f = r.int(1, 3);
    if (f === 1) {
      const a = r.int(3, 9);
      x = r.int(3, 12);
      s = `${a} × ${gap} = ${a * x}`;
      ex = steps(`Draai de som om: ${a * x} : ${a} = <b>${x}</b>.`);
    } else if (f === 2) {
      const a = r.int(13, 68),
        c = r.pick([100, 120, 150, 200]);
      x = c - a;
      s = `${gap} + ${a} = ${c}`;
      ex = steps(`Draai de som om: ${c} − ${a} = <b>${x}</b>.`);
    } else {
      const a = r.int(3, 12);
      x = r.int(3, 9);
      s = `${a * x} : ${gap} = ${a}`;
      ex = steps(`${a * x} : ${a} = <b>${x}</b>. Controle: ${a * x} : ${x} = ${a}.`);
    }
  } else if (L === 2) {
    const f = r.int(1, 3);
    if (f === 1) {
      const a = r.int(125, 980),
        c = r.int(1005, 4200);
      x = a + c;
      s = `${gap} − ${nf(a)} = ${nf(c)}`;
      ex = steps(`Draai de som om: ${nf(c)} + ${nf(a)} = <b>${nf(x)}</b>.`);
    } else if (f === 2) {
      const [a, xs] = r.pick([
        [25, [8, 12, 16, 24, 40]],
        [50, [6, 14, 18, 24]],
        [125, [8, 16, 24]],
        [250, [4, 8, 12, 16]],
      ]);
      x = r.pick(xs);
      s = `${a} × ${gap} = ${nf(a * x)}`;
      ex = steps(`Draai de som om: ${nf(a * x)} : ${a} = <b>${x}</b>.`);
    } else {
      const q = r.pick([20, 30, 40, 60, 80]);
      x = r.pick([20, 30, 40, 50, 60]);
      s = `${nf(q * x)} : ${gap} = ${q}`;
      ex = steps(`${nf(q * x)} : ${q} = <b>${x}</b>.`);
    }
  } else {
    const f = r.int(1, 3);
    if (f === 1) {
      const b = r.int(3, 8),
        a = r.int(5, 25);
      x = r.int(4, 30);
      const c = (x + a) * b;
      s = `(${gap} + ${a}) × ${b} = ${nf(c)}`;
      ex = steps(`Tussen haakjes moet ${nf(c)} : ${b} = ${x + a} staan.`, `${x + a} − ${a} = <b>${x}</b>.`);
    } else if (f === 2) {
      const a = r.int(3, 9),
        b = r.int(5, 30);
      x = r.int(6, 25);
      const c = a * x - b;
      s = `${a} × ${gap} − ${b} = ${c}`;
      ex = steps(`Voordat er ${b} afging, was het ${c} + ${b} = ${c + b}.`, `${c + b} : ${a} = <b>${x}</b>.`);
    } else {
      const b = r.int(4, 9);
      x = r.int(12, 60);
      const A = r.pick([500, 800, 1000, 1200]),
        c = A - x * b;
      s = `${nf(A)} − ${gap} × ${b} = ${nf(c)}`;
      ex = steps(`Er gaat ${nf(A)} − ${nf(c)} = ${nf(A - c)} af.`, `${nf(A - c)} : ${b} = <b>${x}</b>.`);
    }
  }
  return { type: 'num', q: p('Welk getal hoort op de puntjes?') + som(s), ans: x, expl: ex };
});

def('AH14', 'A', 'H', 'A.3', 'Getallen ordenen', (L, r) => {
  let items, ex;
  if (L === 1) {
    const d = r.sample([1, 2, 3, 4, 5, 6, 7, 8, 9], 3).concat([0]),
      set = new Set<number>();
    for (let i = 0; i < 40 && set.size < 4; i++) {
      const s = r.shuffle(d);
      if (s[0] !== 0) set.add(s[0] * 1000 + s[1] * 100 + s[2] * 10 + s[3]);
    }
    if (set.size < 4) throw RETRY;
    items = Array.from(set).map((v) => ({ h: nf(v), v }));
    ex = 'Vergelijk eerst de duizendtallen, daarna de honderdtallen, dan de tientallen.';
  } else if (L === 2) {
    const set = new Set<number>();
    while (set.size < 5) set.add(r.int(-20, 20));
    const arr = Array.from(set);
    if (arr.filter((v) => v < 0).length < 2) throw RETRY;
    items = arr.map((v) => ({ h: nf(v), v }));
    ex = 'Negatieve getallen zijn kleiner dan positieve. Hoe verder onder nul, hoe kleiner het getal: −15 is kleiner dan −3.';
  } else if (r.chance(0.5)) {
    const set = new Set<number>();
    while (set.size < 5) set.add(r.int(85, 130) * 10000);
    items = Array.from(set).map((v) => ({ h: r.chance(0.5) ? nf(v) : nf(v / 1e6) + ' miljoen', v }));
    ex = 'Schrijf alles op dezelfde manier, bijvoorbeeld voluit: 1,2 miljoen = 1.200.000 en 0,9 miljoen = 900.000.';
  } else {
    const a = r.int(1, 4),
      b = r.int(5, 9);
    items = [-(a * 1000 + b * 10), -(a * 1000 + b * 100), -(a * 1000 + b), -(a * 100 + b * 10), -(a * 100 + b)].map((v) => ({
      h: nf(v),
      v,
    }));
    ex = 'Bij negatieve getallen is het getal met de meeste afstand tot nul het kleinst.';
  }
  const o = ordQ(r, items);
  return Object.assign(o, {
    q: p('Zet de getallen in de goede volgorde, van klein naar groot.'),
    expl: steps(ex, `De goede volgorde is: <b>${o.ans.map((i) => o.items[i]).join(' &lt; ')}</b>.`),
  });
});

def('AH15', 'A', 'H', 'A.2', 'Rekentaal: som, verschil, product, quotiënt', (L, r) => {
  const DEF = 'Som is optellen, verschil is aftrekken, product is vermenigvuldigen en quotiënt is delen.';
  if (L === 1) {
    const f = r.int(1, 4);
    if (f === 1) {
      const a = r.int(120, 900),
        b = r.int(20, a - 15);
      return { type: 'num', q: p(`Wat is het verschil van ${a} en ${b}?`), ans: a - b, expl: steps(DEF, `${a} − ${b} = <b>${a - b}</b>.`) };
    }
    if (f === 2) {
      const a = r.int(4, 12),
        b = r.int(6, 15);
      return { type: 'num', q: p(`Wat is het product van ${a} en ${b}?`), ans: a * b, expl: steps(DEF, `${a} × ${b} = <b>${a * b}</b>.`) };
    }
    if (f === 3) {
      const b = r.int(4, 12),
        q = r.int(6, 15);
      return { type: 'num', q: p(`Wat is het quotiënt van ${b * q} en ${b}?`), ans: q, expl: steps(DEF, `${b * q} : ${b} = <b>${q}</b>.`) };
    }
    const a = r.int(15, 90),
      b = r.int(15, 90),
      c = r.int(15, 90);
    return {
      type: 'num',
      q: p(`Wat is de som van ${a}, ${b} en ${c}?`),
      ans: a + b + c,
      expl: steps(DEF, `${a} + ${b} + ${c} = <b>${a + b + c}</b>.`),
    };
  }
  if (L === 2) {
    const f = r.int(1, 3);
    if (f === 1) {
      const a = r.int(4, 9),
        b = r.int(11, 19),
        d = r.int(4, 12),
        q = r.int(6, 14);
      return {
        type: 'num',
        q: p(`Tel het product van ${a} en ${b} op bij het quotiënt van ${d * q} en ${d}.`),
        ans: a * b + q,
        expl: steps(DEF, `Product: ${a} × ${b} = ${a * b}.`, `Quotiënt: ${d * q} : ${d} = ${q}.`, `${a * b} + ${q} = <b>${a * b + q}</b>.`),
      };
    }
    if (f === 2) {
      const b = r.int(12, 60),
        a = b + r.int(8, 40),
        c = r.int(3, 9);
      return {
        type: 'num',
        q: p(`Vermenigvuldig het verschil van ${a} en ${b} met ${c}.`),
        ans: (a - b) * c,
        expl: steps(DEF, `Verschil: ${a} − ${b} = ${a - b}.`, `${a - b} × ${c} = <b>${(a - b) * c}</b>.`),
      };
    }
    const a = r.int(20, 60),
      b = r.int(5, 18);
    return {
      type: 'num',
      q: p(`Trek het verschil van ${a} en ${b} af van de som van ${a} en ${b}.`),
      ans: 2 * b,
      expl: steps(DEF, `Som: ${a} + ${b} = ${a + b}.`, `Verschil: ${a} − ${b} = ${a - b}.`, `${a + b} − ${a - b} = <b>${2 * b}</b>.`),
    };
  }
  const f = r.int(1, 3);
  if (f === 1) {
    const a = r.int(6, 15),
      b = r.int(12, 30);
    return {
      type: 'num',
      q: p(`Het product van twee getallen is ${a * b}. Eén van de getallen is ${a}.`) + ask('Wat is de som van de twee getallen?'),
      ans: a + b,
      expl: steps(DEF, `Het andere getal is ${a * b} : ${a} = ${b}.`, `De som is ${a} + ${b} = <b>${a + b}</b>.`),
    };
  }
  if (f === 2) {
    const d = r.pick([6, 8, 12, 16, 24]),
      k = r.int(2, 5),
      a = ((k + 1) * d) / 2,
      b = ((k - 1) * d) / 2;
    if (b < 2) throw RETRY;
    return {
      type: 'num',
      q: p(`Deel de som van ${a} en ${b} door het verschil van ${a} en ${b}.`),
      ans: k,
      expl: steps(DEF, `Som: ${a} + ${b} = ${a + b}.`, `Verschil: ${a} − ${b} = ${a - b}.`, `${a + b} : ${a - b} = <b>${k}</b>.`),
    };
  }
  const a = 2 * r.int(4, 12),
    b = r.int(7, 15),
    c = r.int(8, Math.min(40, (a * b) / 2 - 3));
  return {
    type: 'num',
    q: p(`Neem de helft van het product van ${a} en ${b}. Haal daar ${c} af.`) + ask('Welk getal krijg je?'),
    ans: (a * b) / 2 - c,
    expl: steps(DEF, `Product: ${a} × ${b} = ${a * b}.`, `De helft: ${(a * b) / 2}.`, `${(a * b) / 2} − ${c} = <b>${(a * b) / 2 - c}</b>.`),
  };
});
