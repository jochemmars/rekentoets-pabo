/* Domein D · Verbanden en statistiek · niet-hoofdrekenen */
import { nf, eur, en, klok } from '../../core/notatie';
import { rnd, sum } from '../../core/rekenen';
import { def, RETRY, steps, tip, som, p, ask, mcTxt, nm } from '../../core/opbouw';
import { F } from '../../figuren';
import type { Rng } from '../../core/rng';
import { f6, whole, tie, cap } from '../hulp';

const MND = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'],
  MK = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
const DAG = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'],
  DK = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'];
const max = (a: readonly number[]): number => Math.max(...a),
  min = (a: readonly number[]): number => Math.min(...a);

const BARC = [
  {
    title: 'Verkochte ijsjes per maand',
    y: 'aantal ijsjes',
    it: 'ijsjes',
    verb: 'verkocht',
    per: 'maand',
    prep: 'in',
    cats: MK.slice(3, 9),
    full: MND.slice(3, 9),
  },
  {
    title: 'Bezoekers van het zwembad per dag',
    y: 'aantal bezoekers',
    it: 'bezoekers',
    verb: 'geteld',
    per: 'dag',
    prep: 'op',
    cats: DK,
    full: DAG,
  },
  {
    title: 'Uitgeleende boeken per maand',
    y: 'aantal boeken',
    it: 'boeken',
    verb: 'uitgeleend',
    per: 'maand',
    prep: 'in',
    cats: MK.slice(0, 6),
    full: MND.slice(0, 6),
  },
  {
    title: 'Verkochte kaartjes per dag',
    y: 'aantal kaartjes',
    it: 'kaartjes',
    verb: 'verkocht',
    per: 'dag',
    prep: 'op',
    cats: DK.slice(0, 5),
    full: DAG.slice(0, 5),
  },
  {
    title: 'Ingeleverde flessen per maand',
    y: 'aantal flessen',
    it: 'flessen',
    verb: 'ingeleverd',
    per: 'maand',
    prep: 'in',
    cats: MK.slice(6, 12),
    full: MND.slice(6, 12),
  },
];
// staafdiagram met waarden op de roosterlijnen of er precies tussenin
interface BarOpties {
  steps?: number[];
}
function barData(r: Rng, o?: BarOpties) {
  o = o || {};
  const C = r.pick(BARC),
    step = r.pick(o.steps || [10, 20, 50, 100]),
    k = r.pick([5, 6]),
    yMax = step * k,
    n = C.cats.length,
    vals: number[] = [];
  for (let i = 0; i < n; i++) vals.push((step / 2) * r.int(2, 2 * k - 1));
  return {
    C: C,
    step: step,
    yMax: yMax,
    n: n,
    vals: vals,
    fig: F.bar({ cats: C.cats, vals: vals, yMax: yMax, yStep: step, yTitle: C.y, title: C.title, half: true }),
    at: (i: number) => `${C.prep} ${C.full[i]}`,
  };
}
const READ = 'De waarden lees je af op de verticale as. De dunne lijnen tussen twee getallen liggen precies halverwege.';

def('DN01', 'D', 'N', 'D.2', 'Staafdiagram aflezen en rekenen', (L, r) => {
  const d = barData(r),
    C = d.C,
    v = d.vals,
    intro = 'Bekijk het staafdiagram.';
  if (L === 1) {
    if (r.chance(0.5)) {
      const i = r.int(0, d.n - 1);
      return {
        type: 'num',
        unit: C.it,
        q: p(intro) + ask(`Hoeveel ${C.it} werden er ${d.at(i)} ${C.verb}?`),
        fig: d.fig,
        ans: v[i],
        expl: steps(READ, `De staaf van ${C.full[i]} komt tot <b>${nf(v[i])}</b>.`),
      };
    }
    const hi = max(v),
      lo = min(v);
    if (hi === lo) throw RETRY;
    return {
      type: 'num',
      unit: C.it,
      q: p(intro) + ask(`Hoeveel is het verschil tussen de hoogste en de laagste staaf?`),
      fig: d.fig,
      ans: hi - lo,
      expl: steps(READ, `De hoogste staaf is ${nf(hi)} en de laagste is ${nf(lo)}.`, `${nf(hi)} − ${nf(lo)} = <b>${nf(hi - lo)}</b>.`),
    };
  }
  if (L === 2) {
    if (r.chance(0.5)) {
      const [i, j] = r.sample(
        v.map((x, k) => k),
        2,
      );
      if (v[i] <= v[j]) throw RETRY;
      return {
        type: 'num',
        unit: C.it,
        q: p(intro) + ask(`Hoeveel ${C.it} werden er ${d.at(i)} meer ${C.verb} dan ${d.at(j)}?`),
        fig: d.fig,
        ans: v[i] - v[j],
        expl: steps(
          READ,
          `${cap(C.full[i])}: ${nf(v[i])}. ${cap(C.full[j])}: ${nf(v[j])}.`,
          `${nf(v[i])} − ${nf(v[j])} = <b>${nf(v[i] - v[j])}</b> ${C.it}.`,
        ),
      };
    }
    const k = 3,
      tot = v[0] + v[1] + v[2];
    return {
      type: 'num',
      unit: C.it,
      calc: true,
      q:
        p(intro) +
        ask(`Hoeveel ${C.it} werden er in totaal ${C.verb} in de eerste drie ${C.per === 'maand' ? 'maanden' : 'dagen'} van het diagram?`),
      fig: d.fig,
      ans: tot,
      expl:
        steps(
          READ,
          `De eerste drie staven zijn ${nf(v[0])}, ${nf(v[1])} en ${nf(v[2])}.`,
          `${nf(v[0])} + ${nf(v[1])} + ${nf(v[2])} = <b>${nf(tot)}</b> ${C.it}.`,
        ) + tip(`Het diagram heeft ${d.n} staven, maar er wordt naar de eerste ${k} gevraagd.`),
    };
  }
  if (r.chance(0.5)) {
    const tot = sum(v),
      avg = tot / d.n;
    if (!whole(avg * 2)) throw RETRY;
    return {
      type: 'num',
      unit: C.it,
      calc: true,
      q: p(intro) + ask(`Hoeveel ${C.it} werden er gemiddeld per ${C.per} ${C.verb}?`),
      fig: d.fig,
      ans: avg,
      expl: steps(
        READ,
        `Tel alle staven op: ${v.map((x) => nf(x)).join(' + ')} = ${nf(tot)}.`,
        `Deel door het aantal ${C.per === 'maand' ? 'maanden' : 'dagen'}: ${nf(tot)} : ${d.n} = <b>${nf(avg)}</b> ${C.it}.`,
      ),
    };
  }
  const cand: [number, number][] = [];
  for (let i = 0; i < d.n - 1; i++) {
    const pc = ((v[i + 1] - v[i]) / v[i]) * 100;
    if (pc >= 10 && pc <= 100 && whole(pc / 5)) cand.push([i, Math.round(pc)]);
  }
  if (!cand.length) throw RETRY;
  const [i, pc] = r.pick(cand);
  return {
    type: 'num',
    unit: '%',
    calc: true,
    q: p(intro) + ask(`Met hoeveel procent steeg het aantal ${C.it} van ${C.full[i]} naar ${C.full[i + 1]}?`),
    fig: d.fig,
    ans: pc,
    expl:
      steps(
        READ,
        `${cap(C.full[i])}: ${nf(v[i])}. ${cap(C.full[i + 1])}: ${nf(v[i + 1])}. De toename is ${nf(v[i + 1] - v[i])}.`,
        `${nf(v[i + 1] - v[i])} : ${nf(v[i])} × 100 = <b>${pc}</b>%.`,
      ) + tip('Je deelt door het oude aantal.'),
  };
});

def('DN02', 'D', 'N', 'D.2', 'Grootste toename aflezen', (L, r) => {
  const d = barData(r),
    C = d.C,
    v = d.vals,
    diffs: number[] = [],
    rel: number[] = [];
  for (let i = 1; i < d.n; i++) {
    diffs.push(v[i] - v[i - 1]);
    rel.push((v[i] - v[i - 1]) / v[i - 1]);
  }
  const pos = diffs.filter((x) => x > 0);
  if (pos.length < 2) throw RETRY;
  const useRel = L === 3,
    arr = useRel ? rel : diffs,
    best = max(arr),
    bi = arr.indexOf(best);
  if (arr.filter((x) => Math.abs(x - best) < 1e-9).length > 1) throw RETRY;
  if (useRel && diffs.indexOf(max(diffs)) === bi) throw RETRY;
  if (L === 1 && Math.abs(best) < d.step) throw RETRY;
  const good = C.full[bi + 1],
    others = C.full.slice(1).filter((x) => x !== good),
    biAbs = diffs.indexOf(max(diffs));
  const wr = useRel ? [C.full[biAbs + 1]].concat(r.shuffle(others.filter((x) => x !== C.full[biAbs + 1]))) : r.shuffle(others);
  const list = diffs
    .map(
      (x, i) =>
        `${C.full[i]} → ${C.full[i + 1]}: ${x > 0 ? '+' : x < 0 ? '−' : ''}${nf(Math.abs(x))}` +
        (useRel && x > 0 ? ` (${nf(rnd(rel[i] * 100, 0))}%)` : ''),
    )
    .join('; ');
  return Object.assign(mcTxt(r, good, wr), {
    calc: useRel,
    q:
      p('Bekijk het staafdiagram.') +
      ask(`${cap(C.prep)} welke ${C.per} was de ${useRel ? 'procentuele ' : ''}toename ten opzichte van de ${C.per} ervoor het grootst?`),
    fig: d.fig,
    expl:
      steps(
        useRel
          ? 'Bereken voor elke stap de toename en deel die door het aantal ervoor.'
          : `Bereken voor elke ${C.per} het verschil met de ${C.per} ervoor.`,
        list + '.',
        `De grootste ${useRel ? 'procentuele ' : ''}toename was ${C.prep} <b>${good}</b>.`,
      ) +
      (useRel
        ? tip(`De grootste toename in aantallen was ${C.prep} ${C.full[biAbs + 1]}, maar daar was het aantal ervoor ook groter.`)
        : tip('Het gaat om de grootste stijging, niet om de hoogste staaf.')),
  });
});

def('DN03', 'D', 'N', 'D.2', 'Lijngrafiek aflezen', (L, r) => {
  const xs = ['6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
    n = xs.length,
    base = L === 3 ? r.int(-8, -3) : r.int(4, 12),
    v: number[] = [];
  let t = base;
  const up = [2, 3, 4, 3, 2, -1, -3, -4];
  for (let i = 0; i < n; i++) {
    v.push(t);
    t += up[i] + r.int(-1, 1);
  }
  const lo = min(v),
    hi = max(v),
    yMin = Math.floor(lo / 5) * 5,
    yMax = Math.ceil((hi + 1) / 5) * 5;
  if ((yMax - yMin) / 5 > 7) throw RETRY;
  const fig = F.line({
    xs: xs.map((x) => x.replace(':00', '')),
    series: [{ name: 'temperatuur', vals: v }],
    yMin: yMin,
    yMax: yMax,
    yStep: 5,
    yMinor: 1,
    yTitle: 'temperatuur (°C)',
    xTitle: 'tijd (uur)',
    title: 'Temperatuur op één dag',
  });
  const READT = 'Tussen twee getallen op de verticale as zit 5 graden. Elke dunne lijn daartussen is 1 graad.';
  if (L === 1) {
    const i = r.int(0, n - 1);
    if (v[i] % 5 !== 0 && r.chance(0.5)) throw RETRY;
    return {
      type: 'num',
      unit: '°C',
      q: p('De grafiek laat de temperatuur op één dag zien.') + ask(`Hoe warm was het om ${xs[i]} uur?`),
      fig,
      ans: v[i],
      expl: steps(READT, `Ga bij ${xs[i]} uur recht omhoog naar de lijn en lees links de temperatuur af: <b>${nf(v[i])}</b> °C.`),
    };
  }
  if (L === 2) {
    const dif: number[] = [];
    for (let i = 1; i < n; i++) dif.push(v[i] - v[i - 1]);
    const rise = r.chance(0.5),
      best = rise ? max(dif) : min(dif),
      bi = dif.indexOf(best);
    if (dif.filter((x) => x === best).length > 1 || (rise ? best <= 0 : best >= 0)) throw RETRY;
    const iv = (i: number) => `tussen ${xs[i]} en ${xs[i + 1]} uur`,
      good = iv(bi),
      wr = r.shuffle(dif.map((x, i) => i).filter((i) => i !== bi)).map(iv);
    return Object.assign(mcTxt(r, good, wr), {
      q:
        p('De grafiek laat de temperatuur op één dag zien.') +
        ask(`Tussen welke twee tijdstippen ${rise ? 'steeg' : 'daalde'} de temperatuur het meest?`),
      fig,
      expl: steps(
        READT,
        `Zoek het stuk waar de lijn het steilst ${rise ? 'omhoog' : 'omlaag'} loopt.`,
        `${cap(good)} ging de temperatuur van ${nf(v[bi])} naar ${nf(v[bi + 1])} °C. Dat is ${Math.abs(best)} graden: de grootste ${rise ? 'stijging' : 'daling'}. Het antwoord is <b>${good}</b>.`,
      ),
    });
  }
  if (lo >= 0) throw RETRY;
  return {
    type: 'num',
    unit: 'graden',
    q:
      p('De grafiek laat de temperatuur op een dag in januari zien.') +
      ask('Hoeveel graden is het verschil tussen de hoogste en de laagste temperatuur?'),
    fig,
    ans: hi - lo,
    expl: steps(
      READT,
      `De laagste temperatuur is ${nf(lo)} °C en de hoogste is ${nf(hi)} °C.`,
      `Van ${nf(lo)} tot 0 is ${-lo} graden. Van 0 tot ${hi} is ${hi} graden. Samen: <b>${hi - lo}</b> graden.`,
    ),
  };
});

// titel, categorieën, wie, omschrijving
const PIEC: [string, string[], string, (k: string) => string][] = [
  ['Hoe komen de leerlingen naar school?', ['fiets', 'lopend', 'auto', 'bus', 'step'], 'leerlingen', (k) => `met de ${k}`],
  [
    'Favoriete sport van de leerlingen',
    ['voetbal', 'hockey', 'zwemmen', 'turnen', 'dansen'],
    'leerlingen',
    (k) => `met ${k} als favoriete sport`,
  ],
  [
    'Waaraan geven leerlingen hun zakgeld uit?',
    ['snoep', 'sparen', 'kleding', 'games', 'overig'],
    'leerlingen',
    (k) => `die het meeste geld uitgeven aan ${k}`,
  ],
];
function pieData(r: Rng, n: number): number[] {
  for (let t = 0; t < 60; t++) {
    const ps: number[] = [];
    let left = 100;
    for (let i = 0; i < n - 1; i++) {
      const x = 5 * r.int(2, 8);
      ps.push(x);
      left -= x;
    }
    if (left >= 10 && left <= 50 && left % 5 === 0) {
      ps.push(left);
      return ps.sort((a, b) => b - a);
    }
  }
  throw RETRY;
}
def('DN04', 'D', 'N', 'D.2', 'Cirkeldiagram', (L, r) => {
  const [title, cats, who] = r.pick(PIEC),
    n = r.pick([4, 5]),
    ps = pieData(r, n),
    names = cats.slice(0, n),
    i = r.int(0, n - 1);
  const figWith = (hide: number) =>
    F.pie({ title: title, parts: names.map((nmn, k) => ({ name: nmn, pct: ps[k], show: k === hide ? '?' : ps[k] + '%' })) });
  if (L === 1) {
    const rest = ps.filter((x, k) => k !== i);
    return {
      type: 'num',
      unit: '%',
      q: p('In het cirkeldiagram ontbreekt één percentage.') + ask(`Welk percentage hoort bij ‘${names[i]}’?`),
      fig: figWith(i),
      ans: ps[i],
      expl: steps(
        'Alle delen van een cirkeldiagram zijn samen 100%.',
        `De andere delen zijn samen ${rest.join(' + ')} = ${sum(rest)}%.`,
        `100 − ${sum(rest)} = <b>${ps[i]}</b>%.`,
      ),
    };
  }
  if (L === 2) {
    const N = 20 * r.int(6, 30),
      ans = (N * ps[i]) / 100;
    return {
      type: 'num',
      unit: who,
      calc: true,
      q: p(`Het cirkeldiagram hoort bij een onderzoek onder ${nf(N)} ${who}.`) + ask(`Hoeveel ${who} horen bij het deel ‘${names[i]}’?`),
      fig: figWith(-1),
      ans,
      expl: steps(`Bij ‘${names[i]}’ hoort ${ps[i]}%.`, `${ps[i]}% van ${nf(N)} is ${nf(N)} : 100 × ${ps[i]} = <b>${nf(ans)}</b> ${who}.`),
    };
  }
  if (r.chance(0.5)) {
    const N = 20 * r.int(6, 30),
      k = (N * ps[i]) / 100;
    return {
      type: 'num',
      unit: who,
      calc: true,
      q:
        p(`Het cirkeldiagram hoort bij een onderzoek op een school. Bij het deel ‘${names[i]}’ horen ${nf(k)} ${who}.`) +
        ask(`Hoeveel ${who} deden mee aan het onderzoek?`),
      fig: figWith(-1),
      ans: N,
      expl: steps(`${ps[i]}% is ${nf(k)} ${who}.`, `1% is ${nf(k)} : ${ps[i]} = ${f6(k / ps[i])}.`, `100% is <b>${nf(N)}</b> ${who}.`),
    };
  }
  const ans = rnd(ps[i] * 3.6, 2);
  return {
    type: 'num',
    unit: 'graden',
    calc: true,
    q: p('Een hele cirkel is 360 graden.') + ask(`Hoeveel graden is de hoek van het deel ‘${names[i]}’ in het cirkeldiagram?`),
    fig: figWith(-1),
    ans,
    expl: steps(
      `Bij ‘${names[i]}’ hoort ${ps[i]}% van de cirkel.`,
      `1% van 360 graden is 3,6 graden.`,
      `${ps[i]} × 3,6 = <b>${nf(ans)}</b> graden.`,
    ),
  };
});

def('DN05', 'D', 'N', 'D.2', 'Tarieven in een tabel', (L, r) => {
  const place = r.pick(['de dierentuin', 'het zwembad', 'het museum', 'het pretpark']),
    pv = r.pick([12, 13.5, 14.5, 16, 18.5]),
    pk = pv - r.pick([4, 4.5, 5.5, 6]),
    ps = pv - r.pick([1.5, 2, 2.5]),
    park = r.pick([5, 6, 7.5]);
  const fig = F.table(
    ['Bezoeker', 'Prijs'],
    [
      ['Volwassene (13 t/m 64 jaar)', eur(pv)],
      ['Kind (4 t/m 12 jaar)', eur(pk)],
      ['Kind (0 t/m 3 jaar)', 'gratis'],
      ['65 jaar en ouder', eur(ps)],
      ['Parkeren, per auto', eur(park)],
    ],
    { cap: 'Tarieven van ' + place },
  );
  const e2 = (x: number) => eur(x);
  if (L === 1) {
    const a = 2,
      ages = r.sample([5, 6, 7, 8, 9, 10, 11, 12], r.int(2, 3)).sort((x, y) => x - y),
      tot = a * pv + ages.length * pk;
    return {
      type: 'num',
      pre: '€',
      dec: whole(tot) ? undefined : 2,
      q:
        p(
          `Een gezin gaat naar ${place}: twee volwassenen van 38 en 41 jaar en ${ages.length} kinderen van ${en(ages)} jaar. Ze komen met de fiets.`,
        ) + ask('Hoeveel betaalt het gezin in totaal?'),
      fig,
      ans: tot,
      expl:
        steps(
          `Volwassenen: 2 × ${e2(pv)} = ${e2(2 * pv)}.`,
          `Kinderen: ${ages.length} × ${e2(pk)} = ${e2(ages.length * pk)}.`,
          `Samen: <b>${e2(tot)}</b>.`,
        ) + tip('Ze komen met de fiets, dus er zijn geen parkeerkosten.'),
    };
  }
  if (L === 2) {
    const kids = r.sample([5, 6, 8, 9, 11, 12], 2).sort((x, y) => x - y),
      baby = r.int(1, 3),
      oma = r.int(66, 79),
      teen = r.chance(0.5) ? r.int(13, 16) : 0;
    const nv = 2 + (teen ? 1 : 0),
      tot = nv * pv + 2 * pk + ps + park;
    return {
      type: 'num',
      pre: '€',
      dec: whole(tot) ? undefined : 2,
      calc: true,
      q:
        p(
          `Een familie gaat met één auto naar ${place}: vader (44), moeder (42), oma (${oma}) en ${teen ? 'vier' : 'drie'} kinderen van ${en([baby].concat(kids, teen ? [teen] : []))} jaar.`,
        ) + ask('Hoeveel betaalt de familie in totaal, inclusief parkeren?'),
      fig,
      ans: tot,
      expl:
        steps(
          `Volwassenen (13 t/m 64 jaar): vader, moeder${teen ? ` en het kind van ${teen}` : ''}. Dat is ${nv} × ${e2(pv)} = ${e2(nv * pv)}.`,
          `Kinderen van 4 t/m 12 jaar: ${en(kids)} jaar. Dat is 2 × ${e2(pk)} = ${e2(2 * pk)}.`,
          `Het kind van ${baby} is gratis. Oma (${oma}): ${e2(ps)}. Parkeren: ${e2(park)}.`,
          `Samen: <b>${e2(tot)}</b>.`,
        ) +
        tip(
          teen
            ? `Een kind van ${teen} jaar betaalt de prijs voor volwassenen.`
            : 'Kijk voor elke persoon goed in welke leeftijdsgroep die valt.',
        ),
    };
  }
  const nk = r.int(18, 28),
    nb = r.int(2, 4),
    autos = r.int(0, 2),
    ent = nk * pk + nb * pv,
    after = ent * 0.9,
    tot = rnd(after + autos * park, 2);
  return {
    type: 'num',
    pre: '€',
    dec: 2,
    calc: true,
    q:
      p(
        `Een schoolklas gaat naar ${place}: ${nk} leerlingen van 10 en 11 jaar en ${nb} begeleiders tussen 30 en 50 jaar. ${autos === 0 ? 'Ze komen met de bus en parkeren niet.' : `De begeleiders komen met ${autos === 1 ? 'één auto' : 'twee auto’s'}.`} Voor groepen van 10 of meer betalende bezoekers geldt 10% korting op de entreeprijs. Op parkeren is geen korting.`,
      ) + ask('Hoeveel betaalt de school in totaal?'),
    fig,
    ans: tot,
    expl:
      steps(
        `Leerlingen: ${nk} × ${e2(pk)} = ${e2(nk * pk)}. Begeleiders: ${nb} × ${e2(pv)} = ${e2(nb * pv)}.`,
        `Entree samen: ${e2(ent)}. Met 10% korting: ${e2(ent)} × 0,9 = ${e2(after)}.`,
        autos ? `Parkeren: ${autos} × ${e2(park)} = ${e2(autos * park)}.` : 'Er zijn geen parkeerkosten.',
        `Totaal: <b>${e2(tot)}</b>.`,
      ) + tip('De korting geldt alleen voor de entree.'),
  };
});

// kop kolom A, kop kolom B, labels
const SHEETC: [string, string, string[]][] = [
  ['Dag', 'Aantal bezoekers', DAG.slice(0, 5)],
  ['Maand', 'Verkochte fietsen', MND.slice(0, 5)],
  ['Klas', 'Aantal leerlingen', ['Groep 4', 'Groep 5', 'Groep 6', 'Groep 7', 'Groep 8']],
];
def('DN06', 'D', 'N', 'D.3', 'Rekenen in een rekenblad', (L, r) => {
  if (L < 3) {
    const [h1, h2, labs] = r.pick(SHEETC),
      big = h1 !== 'Klas',
      vals = labs.map(() => (big ? 5 * r.int(8, 60) : r.int(19, 32)));
    const fig = F.sheet([[h1, h2], ...labs.map((l, i) => [l, vals[i]])]);
    if (L === 1) {
      const what = r.pick([
        ['het gemiddelde', '=GEMIDDELDE(B2:B6)'],
        ['de som', '=SOM(B2:B6)'],
        ['het grootste getal', '=MAX(B2:B6)'],
        ['het kleinste getal', '=MIN(B2:B6)'],
      ]);
      return Object.assign(
        mcTxt(
          r,
          what[1],
          ['=GEMIDDELDE(B2:B6)', '=SOM(B2:B6)', '=MAX(B2:B6)', '=MIN(B2:B6)', '=AANTAL(B2:B6)'].filter((x) => x !== what[1]),
        ),
        {
          q:
            p('Hieronder zie je een deel van een rekenblad.') +
            ask(`Met welke formule bereken je ${what[0]} van de getallen in de cellen B2 tot en met B6?`),
          fig,
          expl: steps(
            'SOM telt de getallen op, GEMIDDELDE berekent het gemiddelde, MAX geeft het grootste getal, MIN het kleinste en AANTAL telt hoeveel getallen er staan.',
            'B2:B6 betekent: de cellen B2 tot en met B6.',
            `De goede formule is <b>${what[1]}</b>.`,
          ),
        },
      );
    }
    const f = r.int(1, 3),
      tot = sum(vals);
    if (f === 1)
      return {
        type: 'num',
        calc: true,
        q:
          p('Hieronder zie je een deel van een rekenblad. In cel B7 wordt de formule =SOM(B2:B6) getypt.') +
          ask('Welk getal komt er in cel B7 te staan?'),
        fig,
        ans: tot,
        expl: steps(
          '=SOM(B2:B6) telt de getallen in de cellen B2 tot en met B6 bij elkaar op.',
          `${vals.join(' + ')} = <b>${nf(tot)}</b>.`,
        ),
      };
    if (f === 2)
      return {
        type: 'num',
        calc: true,
        q:
          p('Hieronder zie je een deel van een rekenblad. In cel B7 wordt de formule =MAX(B2:B6)-MIN(B2:B6) getypt.') +
          ask('Welk getal komt er in cel B7 te staan?'),
        fig,
        ans: max(vals) - min(vals),
        expl: steps(
          'MAX geeft het grootste getal en MIN het kleinste getal.',
          `Het grootste getal is ${max(vals)} en het kleinste is ${min(vals)}.`,
          `${max(vals)} − ${min(vals)} = <b>${max(vals) - min(vals)}</b>.`,
        ),
      };
    if (tot % 5 !== 0) throw RETRY;
    return {
      type: 'num',
      calc: true,
      q:
        p('Hieronder zie je een deel van een rekenblad. In cel B7 wordt de formule =GEMIDDELDE(B2:B6) getypt.') +
        ask('Welk getal komt er in cel B7 te staan?'),
      fig,
      ans: tot / 5,
      expl: steps(
        'GEMIDDELDE telt de getallen op en deelt door het aantal getallen.',
        `${vals.join(' + ')} = ${nf(tot)}.`,
        `${nf(tot)} : 5 = <b>${nf(tot / 5)}</b>.`,
      ),
    };
  }
  const items = r.sample<[string, number]>(
      [
        ['Schriften', 0.85],
        ['Pennen', 1.2],
        ['Mappen', 2.5],
        ['Linialen', 0.95],
        ['Scharen', 3.4],
        ['Lijmstiften', 1.75],
      ],
      4,
    ),
    n = items.map(() => r.int(6, 40)),
    sub = items.map((x, i) => rnd(x[1] * n[i], 2)),
    tot = rnd(sum(sub), 2);
  const fig = F.sheet([
    ['Artikel', 'Aantal', 'Prijs per stuk', 'Bedrag'],
    ...items.map((x, i) => [x[0], n[i], eur(x[1]), i === 0 ? '=B2*C2' : '…']),
    ['Totaal', '', '', '?'],
  ]);
  return {
    type: 'num',
    pre: '€',
    dec: 2,
    calc: true,
    q:
      p(
        'Hieronder zie je een bestellijst in een rekenblad. In cel D2 staat de formule =B2*C2. Die formule is gekopieerd naar de cellen D3, D4 en D5. In cel D6 staat de formule =SOM(D2:D5).',
      ) + ask('Welk bedrag komt er in cel D6 te staan?'),
    fig,
    ans: tot,
    expl: steps(
      'In kolom D staat steeds: aantal × prijs per stuk. Het sterretje (*) betekent vermenigvuldigen.',
      items.map((x, i) => `${x[0]}: ${n[i]} × ${eur(x[1])} = ${eur(sub[i])}`).join('; ') + '.',
      `Cel D6 telt deze vier bedragen op: <b>${eur(tot)}</b>.`,
    ),
  };
});

const LINC = [
  {
    t: 'Een taxibedrijf rekent een starttarief en een bedrag per kilometer.',
    y: 'ritprijs',
    dy: 'de ritprijs',
    is: 'is',
    x: 'aantal kilometers',
    xu: 'km',
    b: [3, 3.5, 4],
    a: [2.2, 2.4, 2.5],
    xs: [5, 10, 15, 20, 25],
  },
  {
    t: 'Een loodgieter rekent voorrijkosten en een bedrag per uur.',
    y: 'kosten',
    dy: 'de kosten',
    is: 'zijn',
    x: 'aantal uren',
    xu: 'uur',
    b: [35, 45, 50],
    a: [48, 56, 60, 65],
    xs: [2, 3, 4, 5, 6],
  },
  {
    t: 'Een fietsverhuurder rekent een vast bedrag en een bedrag per dag.',
    y: 'huurprijs',
    dy: 'de huurprijs',
    is: 'is',
    x: 'aantal dagen',
    xu: 'dagen',
    b: [10, 15],
    a: [8.5, 9, 12],
    xs: [2, 3, 4, 6, 8],
  },
  {
    t: 'Bij een telefoonabonnement betaal je elke maand een vast bedrag en een bedrag per belminuut.',
    y: 'maandbedrag',
    dy: 'het maandbedrag',
    is: 'is',
    x: 'aantal belminuten',
    xu: 'minuten',
    b: [12, 15, 18],
    a: [0.05, 0.08, 0.1],
    xs: [50, 100, 150, 200, 250],
  },
  {
    t: 'Een busmaatschappij verhuurt een bus voor een vast bedrag en een bedrag per kilometer.',
    y: 'huurprijs',
    dy: 'de huurprijs',
    is: 'is',
    x: 'aantal kilometers',
    xu: 'km',
    b: [150, 180, 200],
    a: [1.5, 1.8, 2],
    xs: [60, 80, 100, 120, 150],
  },
];
def('DN07', 'D', 'N', 'D.4', 'Rekenen met een woordformule', (L, r) => {
  const C = r.pick(LINC),
    b = r.pick(C.b),
    a = r.pick(C.a),
    x = r.pick(C.xs),
    y = rnd(b + a * x, 2),
    form = `${C.y} = ${nf(b)} + ${nf(a)} × ${C.x}`;
  const base = p(`${C.t} Voor ${C.dy} in euro geldt de formule:`) + som(form);
  if (L === 1)
    return {
      type: 'num',
      pre: '€',
      dec: whole(y) ? undefined : 2,
      q: base + ask(`Wat ${C.is} ${C.dy} bij ${x} ${C.xu}?`),
      ans: y,
      expl:
        steps(
          `Vul ${x} in op de plaats van ‘${C.x}’: ${nf(b)} + ${nf(a)} × ${x}.`,
          `Eerst vermenigvuldigen: ${nf(a)} × ${x} = ${f6(a * x)}.`,
          `${nf(b)} + ${f6(a * x)} = <b>${eur(y)}</b>.`,
        ) + tip('Vermenigvuldigen gaat voor optellen.'),
    };
  if (L === 2)
    return {
      type: 'num',
      unit: C.xu,
      calc: true,
      q: base + ask(`Bij hoeveel ${C.xu} ${C.is} ${C.dy} ${eur(y)}?`),
      ans: x,
      expl: steps(
        `Haal eerst het vaste bedrag eraf: ${eur(y)} − ${eur(b)} = ${eur(y - b)}.`,
        `Deel door het bedrag per eenheid: ${f6(y - b)} : ${nf(a)} = <b>${x}</b> ${C.xu}.`,
      ),
    };
  const a2 = rnd(a * r.pick([1.2, 1.25, 1.5, 0.8, 0.75]), 3),
    xe = r.pick(C.xs),
    b2 = rnd(b + (a - a2) * xe, 3);
  if (b2 <= 0 || !whole(b2 * 2) || !whole(a2 * 100) || a2 === a) throw RETRY;
  return {
    type: 'num',
    unit: C.xu,
    calc: true,
    q:
      p(`${C.t} Twee bedrijven gebruiken elk een eigen formule voor ${C.dy} in euro:`) +
      som(`bedrijf A: ${form}`) +
      som(`bedrijf B: ${C.y} = ${nf(b2)} + ${nf(a2)} × ${C.x}`) +
      ask(`Bij hoeveel ${C.xu} zijn de twee bedrijven even duur?`),
    ans: xe,
    expl: steps(
      `Het verschil in vast bedrag is ${eur(Math.abs(b2 - b))}.`,
      `Per eenheid is het verschil ${f6(Math.abs(a - a2))} euro, maar dan andersom: het bedrijf met het hoogste vaste bedrag is per eenheid goedkoper.`,
      `Het verschil is ingelopen na ${f6(Math.abs(b2 - b))} : ${f6(Math.abs(a - a2))} = <b>${xe}</b> ${C.xu}.`,
      `Controle: beide formules geven dan ${eur(rnd(b + a * xe, 2))}.`,
    ),
  };
});

def('DN08', 'D', 'N', 'D.4', 'Welke formule past bij de tabel?', (L, r) => {
  const xs = [1, 2, 3, 4, 5];
  let fy: (x: number) => number, good: string, wr: string[], why: string;
  if (L === 1) {
    const a = r.int(2, 9);
    fy = (x: number) => a * x;
    good = `kosten = ${a} × aantal`;
    wr = [`kosten = aantal + ${a}`, `kosten = ${a} × aantal + 1`, `kosten = ${a + 1} × aantal`, `kosten = aantal × aantal`];
    why = `Elke keer dat het aantal 1 groter wordt, komt er ${a} bij. Bij aantal 0 horen kosten 0.`;
  } else if (L === 2) {
    const a = r.int(2, 6),
      b = r.int(1, 9);
    if (a === b) throw RETRY;
    fy = (x: number) => a * x + b;
    good = `kosten = ${a} × aantal + ${b}`;
    wr = [`kosten = ${a + b} × aantal`, `kosten = ${b} × aantal + ${a}`, `kosten = ${a} × aantal`, `kosten = aantal + ${a + b - 1}`];
    why = `Elke keer dat het aantal 1 groter wordt, komt er ${a} bij. Dat is het getal waarmee je vermenigvuldigt. Bij aantal 1 is de uitkomst ${a + b}; ${a} × 1 = ${a}, dus er komt nog ${b} bij.`;
  } else if (r.chance(0.5)) {
    const a = r.int(2, 6),
      c = r.pick([40, 50, 60, 80, 100]);
    fy = (x: number) => c - a * x;
    good = `kosten = ${c} − ${a} × aantal`;
    wr = [`kosten = ${c - a} − aantal`, `kosten = ${c} − aantal`, `kosten = ${a} × aantal − ${c}`, `kosten = ${c - a} × aantal`];
    why = `Elke keer dat het aantal 1 groter wordt, gaat er ${a} af. Bij aantal 1 is de uitkomst ${c - a}; bij aantal 0 zou dat ${c} zijn.`;
  } else {
    const b = r.int(1, 5),
      sq = r.chance(0.5);
    fy = sq ? (x: number) => x * x + b : (x: number) => x * (x + b);
    good = sq ? `kosten = aantal × aantal + ${b}` : `kosten = aantal × (aantal + ${b})`;
    wr = [
      `kosten = ${b + 1} × aantal`,
      sq ? `kosten = aantal × (aantal + ${b})` : `kosten = aantal × aantal + ${b}`,
      sq ? `kosten = aantal + ${b}` : `kosten = ${b + 3} × aantal − 2`,
      `kosten = 2 × aantal + ${b}`,
    ];
    why =
      'De stappen in de onderste rij zijn niet gelijk: ze worden steeds 2 groter. Dan zit er een kwadraat (aantal × aantal) in de formule.';
  }
  const ys = xs.map(fy),
    fig = F.table(
      null,
      [
        ['aantal', ...xs],
        ['kosten', ...ys],
      ],
      { cls: 'wide' },
    );
  return Object.assign(mcTxt(r, good, wr), {
    q: p('Bij de tabel hoort een formule.') + ask('Welke formule past bij alle getallen in de tabel?'),
    fig,
    expl:
      steps(
        why,
        `Controleer met een ander getal uit de tabel, bijvoorbeeld aantal ${xs[3]}: de uitkomst moet ${ys[3]} zijn.`,
        `De goede formule is <b>${good}</b>.`,
      ) + tip('Een formule die alleen bij het eerste getal klopt, is niet goed. Controleer altijd meer kolommen.'),
  });
});

// omschrijving, toename, start, wat je telt
const STK: Record<'vier' | 'drie' | 'tafel', [string, number, number, string]> = {
  vier: ['vierkanten naast elkaar', 3, 1, 'lucifers'],
  drie: ['driehoeken naast elkaar', 2, 1, 'lucifers'],
  tafel: ['tafels die tegen elkaar aan staan, met stoelen eromheen', 2, 2, 'stoelen'],
};
def('DN09', 'D', 'N', 'D.4', 'Regelmaat in figuren', (L, r) => {
  const type = r.pick(['vier', 'drie', 'tafel'] as const),
    [desc, a, b, it] = STK[type],
    fig = F.sticks(type),
    f = (n: number) => a * n + b;
  const base =
    type === 'tafel'
      ? `Hieronder zie je ${desc}. Bij figuur 1 staat 1 tafel, bij figuur 2 staan 2 tafels, enzovoort. De rondjes zijn stoelen.`
      : `Met lucifers worden ${desc} gelegd. Figuur 1 heeft 1 ${type === 'vier' ? 'vierkant' : 'driehoek'}, figuur 2 heeft er 2, enzovoort.`;
  const rule = `Figuur 1 heeft ${f(1)} ${it}, figuur 2 heeft er ${f(2)} en figuur 3 heeft er ${f(3)}. Er komen er steeds ${a} bij.`,
    form = `Regel: aantal ${it} = ${a} × figuurnummer + ${b}.`;
  if (L < 3) {
    const n = L === 1 ? r.int(5, 8) : r.int(15, 60);
    return {
      type: 'num',
      unit: it,
      q: p(base) + ask(`Hoeveel ${it} heeft figuur ${n}?`),
      fig,
      ans: f(n),
      expl: steps(rule, form, `Voor figuur ${n}: ${a} × ${n} + ${b} = <b>${f(n)}</b> ${it}.`),
    };
  }
  if (r.chance(0.5)) {
    const n = r.int(18, 70);
    return {
      type: 'num',
      q: p(base) + ask(`Welk figuurnummer heeft precies ${f(n)} ${it}?`),
      fig,
      ans: n,
      expl: steps(rule, form, `Reken terug: ${f(n)} − ${b} = ${f(n) - b} en ${f(n) - b} : ${a} = <b>${n}</b>.`),
    };
  }
  const good = `aantal ${it} = ${a} × figuurnummer + ${b}`;
  return Object.assign(
    mcTxt(r, good, [
      `aantal ${it} = ${a + b} × figuurnummer`,
      `aantal ${it} = ${b} × figuurnummer + ${a}`,
      `aantal ${it} = figuurnummer + ${a + b - 1}`,
      `aantal ${it} = ${a + 1} × figuurnummer`,
    ]),
    {
      q: p(base) + ask(`Met welke formule bereken je het aantal ${it} van elke figuur?`),
      fig,
      expl: steps(
        rule,
        `Het getal dat er steeds bij komt, is het getal waarmee je het figuurnummer vermenigvuldigt: ${a}.`,
        `Bij figuur 1 geeft ${a} × 1 = ${a}. Er zijn er ${f(1)}, dus er komt nog ${b} bij.`,
        `De goede formule is <b>${good}</b>.`,
      ),
    },
  );
});

def('DN10', 'D', 'N', 'D.4', 'Formule met een kwadraat', (L, r) => {
  const f = r.int(1, 3);
  if (f === 1) {
    const form = 'aantal wedstrijden = aantal teams × (aantal teams − 1) : 2',
      base = p('In een competitie speelt elk team één keer tegen elk ander team. Voor het aantal wedstrijden geldt:') + som(form);
    const n = L === 1 ? r.int(4, 8) : r.int(10, 24),
      w = (n * (n - 1)) / 2;
    if (L < 3)
      return {
        type: 'num',
        unit: 'wedstrijden',
        calc: L === 2,
        q: base + ask(`Hoeveel wedstrijden worden er gespeeld met ${n} teams?`),
        ans: w,
        expl: steps(
          `Vul ${n} in: ${n} × (${n} − 1) : 2.`,
          `Eerst de haakjes: ${n} − 1 = ${n - 1}.`,
          `${n} × ${n - 1} = ${n * (n - 1)} en ${n * (n - 1)} : 2 = <b>${w}</b>.`,
        ),
      };
    const m = r.int(7, 16),
      wm = (m * (m - 1)) / 2;
    return {
      type: 'num',
      unit: 'teams',
      calc: true,
      q: base + ask(`Er worden ${wm} wedstrijden gespeeld. Hoeveel teams doen er mee?`),
      ans: m,
      expl: steps(
        `Twee keer het aantal wedstrijden is ${2 * wm}. Dat is het aantal teams keer één minder.`,
        `Zoek twee opeenvolgende getallen die vermenigvuldigd ${2 * wm} geven: ${m} × ${m - 1} = ${2 * wm}.`,
        `Er doen <b>${m}</b> teams mee.`,
      ),
    };
  }
  if (f === 2) {
    const base =
      p('Een steen valt van een hoge toren. Voor de afstand die de steen heeft afgelegd geldt:') +
      som('afstand in meters = 5 × tijd × tijd') +
      p('De tijd is in seconden.');
    const t = L === 1 ? r.int(2, 4) : r.pick([1.5, 2.5, 3.5, 5, 6]);
    if (L < 3)
      return {
        type: 'num',
        unit: 'm',
        calc: L === 2,
        q: base + ask(`Hoeveel meter heeft de steen afgelegd na ${nf(t)} seconden?`),
        ans: rnd(5 * t * t, 2),
        expl: steps(
          `Vul ${nf(t)} in: 5 × ${nf(t)} × ${nf(t)}.`,
          `${nf(t)} × ${nf(t)} = ${f6(t * t)}.`,
          `5 × ${f6(t * t)} = <b>${f6(5 * t * t)}</b> m.`,
        ),
      };
    const tt = r.int(3, 9);
    return {
      type: 'num',
      unit: 'seconden',
      calc: true,
      q: base + ask(`Na hoeveel seconden heeft de steen ${5 * tt * tt} meter afgelegd?`),
      ans: tt,
      expl: steps(
        `Deel eerst door 5: ${5 * tt * tt} : 5 = ${tt * tt}.`,
        `Zoek het getal dat met zichzelf vermenigvuldigd ${tt * tt} geeft: √${tt * tt} = ${tt}.`,
        `Na <b>${tt}</b> seconden.`,
      ),
    };
  }
  const base =
    p('Voor de remweg van een auto op een droge weg wordt deze vuistregel gebruikt:') +
    som('remweg in meters = (snelheid : 10) × (snelheid : 10)') +
    p('De snelheid is in km per uur.');
  const v = L === 1 ? r.pick([30, 50, 60, 80]) : r.pick([70, 90, 100, 120, 130, 45, 65]);
  if (L < 3)
    return {
      type: 'num',
      unit: 'm',
      calc: L === 2,
      q: base + ask(`Hoe lang is de remweg bij een snelheid van ${v} km per uur?`),
      ans: rnd((v * v) / 100, 2),
      expl: steps(`${v} : 10 = ${nf(v / 10)}.`, `${nf(v / 10)} × ${nf(v / 10)} = <b>${f6((v * v) / 100)}</b> m.`),
    };
  const v1 = r.pick([40, 50, 60]),
    v2 = 2 * v1;
  return {
    type: 'num',
    unit: 'keer',
    calc: true,
    q: base + ask(`Hoeveel keer zo lang is de remweg bij ${v2} km per uur als bij ${v1} km per uur?`),
    ans: 4,
    expl:
      steps(
        `Bij ${v1} km/u: ${v1 / 10} × ${v1 / 10} = ${(v1 * v1) / 100} m.`,
        `Bij ${v2} km/u: ${v2 / 10} × ${v2 / 10} = ${(v2 * v2) / 100} m.`,
        `${(v2 * v2) / 100} : ${(v1 * v1) / 100} = <b>4</b> keer zo lang.`,
      ) + tip('Twee keer zo snel rijden geeft dus niet twee, maar vier keer zo veel remweg.'),
  };
});

def('DN11', 'D', 'N', 'D.4', 'Celsius en Fahrenheit', (L, r) => {
  const base = p('In de Verenigde Staten wordt de temperatuur gemeten in graden Fahrenheit (°F). Er geldt:') + som('°F = 1,8 × °C + 32');
  if (L === 1) {
    const c = r.int(2, 40),
      fv = rnd(1.8 * c + 32, 2);
    return {
      type: 'num',
      unit: '°F',
      calc: true,
      q: base + ask(`Hoeveel graden Fahrenheit is ${c} °C?`),
      ans: fv,
      expl: steps(`Vul ${c} in: 1,8 × ${c} + 32.`, `1,8 × ${c} = ${f6(1.8 * c)}.`, `${f6(1.8 * c)} + 32 = <b>${f6(fv)}</b> °F.`),
    };
  }
  if (L === 2) {
    const c = r.int(2, 40),
      fv = rnd(1.8 * c + 32, 2);
    return {
      type: 'num',
      unit: '°C',
      calc: true,
      q: base + ask(`Hoeveel graden Celsius is ${f6(fv)} °F?`),
      ans: c,
      expl:
        steps(
          `Reken terug. Haal eerst 32 eraf: ${f6(fv)} − 32 = ${f6(fv - 32)}.`,
          `Deel daarna door 1,8: ${f6(fv - 32)} : 1,8 = <b>${c}</b> °C.`,
        ) + tip('Bij terugrekenen doe je de stappen in omgekeerde volgorde.'),
    };
  }
  const c = -5 * r.int(1, 6),
    fv = rnd(1.8 * c + 32, 2);
  if (r.chance(0.5))
    return {
      type: 'num',
      unit: '°F',
      calc: true,
      q: base + ask(`Hoeveel graden Fahrenheit is ${nf(c)} °C?`),
      ans: fv,
      expl: steps(
        `Vul ${nf(c)} in: 1,8 × (${nf(c)}) + 32.`,
        `1,8 × (${nf(c)}) = ${f6(1.8 * c)}.`,
        `${f6(1.8 * c)} + 32 = <b>${nf(fv)}</b> °F.`,
      ),
    };
  return {
    type: 'num',
    unit: '°C',
    calc: true,
    q: base + ask(`Hoeveel graden Celsius is ${nf(fv)} °F?`),
    ans: c,
    expl:
      steps(`Haal eerst 32 eraf: ${nf(fv)} − 32 = ${f6(fv - 32)}.`, `Deel daarna door 1,8: ${f6(fv - 32)} : 1,8 = <b>${nf(c)}</b> °C.`) +
      tip('De uitkomst is negatief: het vriest.'),
  };
});

def('DN12', 'D', 'N', 'D.2', 'Welke uitspraak klopt?', (L, r) => {
  const d = barData(r),
    C = d.C,
    v = d.vals,
    n = d.n,
    tot = sum(v),
    hi = max(v),
    lo = min(v),
    plural = C.per === 'maand' ? 'maanden' : 'dagen';
  if (v.filter((x) => x === hi).length > 1 || v.filter((x) => x === lo).length > 1) throw RETRY;
  const iHi = v.indexOf(hi),
    iLo = v.indexOf(lo),
    // [soort uitspraak, tekst]
    T: [string, string][] = [],
    Fa: [string, string][] = [],
    [i, j] = r.sample(
      v.map((x, k) => k),
      2,
    );
  const add = (kind: string, ok: boolean, txt: string) => (ok ? T : Fa).push([kind, txt]);
  add('max', true, `${cap(d.at(iHi))} werden de meeste ${C.it} ${C.verb}.`);
  add('max', false, `${cap(d.at((iHi + 1 + r.int(0, n - 2)) % n))} werden de meeste ${C.it} ${C.verb}.`);
  add('min', true, `${cap(d.at(iLo))} werden de minste ${C.it} ${C.verb}.`);
  if (v[i] !== v[j]) {
    const a = v[i] > v[j] ? i : j,
      b = v[i] > v[j] ? j : i;
    add('dif', true, `${cap(d.at(a))} werden ${nf(v[a] - v[b])} ${C.it} meer ${C.verb} dan ${d.at(b)}.`);
    add('dif', false, `${cap(d.at(a))} werden ${nf(v[a] - v[b] + d.step / 2)} ${C.it} meer ${C.verb} dan ${d.at(b)}.`);
    add('dbl', v[a] === 2 * v[b], `${cap(d.at(a))} werden precies twee keer zoveel ${C.it} ${C.verb} als ${d.at(b)}.`);
  }
  const inc = v.every((x, k) => k === 0 || x > v[k - 1]);
  add('inc', inc, `Het aantal ${C.it} steeg elke ${C.per}.`);
  if (L >= 2) {
    add('tot', true, `In totaal werden er ${nf(tot)} ${C.it} ${C.verb}.`);
    add('tot', false, `In totaal werden er ${nf(tot + d.step * r.pick([-1, 1]))} ${C.it} ${C.verb}.`);
    add('half', hi + lo > tot / 2, `De beste en de slechtste ${C.per} zijn samen goed voor meer dan de helft van het totaal.`);
  }
  if (L === 3) {
    const avg = tot / n;
    if (whole(avg * 2)) {
      add('avg', true, `Gemiddeld werden er ${nf(avg)} ${C.it} per ${C.per} ${C.verb}.`);
      add('avg', false, `Gemiddeld werden er ${nf(avg + d.step / 2)} ${C.it} per ${C.per} ${C.verb}.`);
    }
    const above = v.filter((x) => x > avg).length;
    add('abv', true, `In ${above} van de ${n} ${plural} lag het aantal boven het gemiddelde.`);
    add('abv', false, `In ${above === n - 1 ? above - 1 : above + 1} van de ${n} ${plural} lag het aantal boven het gemiddelde.`);
  }
  const good = r.pick(
    L === 1 ? T : T.filter((x) => x[0] !== 'max' && x[0] !== 'min').concat(L === 2 ? T.filter((x) => x[0] === 'max') : []),
  );
  if (!good) throw RETRY;
  const wrong = r.shuffle(Fa.filter((x) => x[0] !== good[0])),
    seen: Record<string, number> = {},
    wr: string[] = [];
  wrong.forEach((x) => {
    if (!seen[x[0]] && wr.length < 3) {
      seen[x[0]] = 1;
      wr.push(x[1]);
    }
  });
  if (wr.length < 3) throw RETRY;
  return Object.assign(mcTxt(r, good[1], wr), {
    calc: L === 3,
    q: p('Bekijk het staafdiagram.') + ask('Welke uitspraak is juist?'),
    fig: d.fig,
    expl: steps(
      READ,
      `De staven zijn, van links naar rechts: ${v.map((x) => nf(x)).join(', ')}. Samen is dat ${nf(tot)}${L === 3 ? `, gemiddeld ${whole((tot / n) * 10) ? '' : 'ongeveer '}${nf(rnd(tot / n, 1))} per ${C.per}` : ''}.`,
      'Reken elke uitspraak na met deze getallen.',
      `Alleen deze uitspraak klopt: <b>${good[1]}</b>`,
    ),
  });
});

const USE = [
  ['hoe de temperatuur in de loop van een dag verandert', 'lijndiagram'],
  ['hoe het aantal leerlingen van een school in tien jaar is veranderd', 'lijndiagram'],
  ['welk deel van het zakgeld naar snoep, kleding en sparen gaat', 'cirkeldiagram'],
  ['hoe de 100% van de stemmen is verdeeld over vier partijen', 'cirkeldiagram'],
  ['hoeveel leerlingen er in elk van de acht groepen zitten', 'staafdiagram'],
  ['hoeveel boeken er per genre zijn uitgeleend', 'staafdiagram'],
  ['hoe de groei van een zonnebloem per week verloopt', 'lijndiagram'],
  ['welk deel van de leerlingen met de fiets, lopend of met de auto komt', 'cirkeldiagram'],
];
const KINDS = ['staafdiagram', 'lijndiagram', 'cirkeldiagram', 'beelddiagram'];
def('DN13', 'D', 'N', 'D.1', 'Soorten diagrammen en begrippen', (L, r) => {
  if (L === 1) {
    const k = r.pick(['staafdiagram', 'lijndiagram', 'cirkeldiagram']);
    let fig;
    if (k === 'staafdiagram') fig = barData(r).fig;
    else if (k === 'lijndiagram') {
      const v = [0, 1, 2, 3, 4, 5].map(() => 5 * r.int(2, 9));
      fig = F.line({
        xs: MK.slice(0, 6),
        series: [{ name: 'a', vals: v }],
        yMin: 0,
        yMax: 50,
        yStep: 10,
        yTitle: 'aantal',
        title: 'Verkochte fietsen per maand',
      });
    } else {
      const ps = pieData(r, 4);
      fig = F.pie({
        title: 'Favoriete sport',
        parts: ['voetbal', 'hockey', 'zwemmen', 'turnen'].map((nmn, i) => ({ name: nmn, pct: ps[i], show: ps[i] + '%' })),
      });
    }
    return Object.assign(
      mcTxt(
        r,
        k,
        KINDS.filter((x) => x !== k),
      ),
      {
        q: p('Bekijk het diagram.') + ask('Hoe heet dit soort diagram?'),
        fig,
        expl: steps(
          'Een staafdiagram heeft losse staven. Een lijndiagram heeft punten die met een lijn verbonden zijn. Een cirkeldiagram is een cirkel die in delen is verdeeld. In een beelddiagram staan plaatjes die elk een aantal voorstellen.',
          `Dit is een <b>${k}</b>.`,
        ),
      },
    );
  }
  if (L === 2) {
    const [what, k] = r.pick(USE);
    return Object.assign(
      mcTxt(
        r,
        k,
        KINDS.filter((x) => x !== k),
      ),
      {
        q: p(`Je wilt in één diagram laten zien ${what}.`) + ask('Welk soort diagram is daarvoor het meest geschikt?'),
        expl: steps(
          'Een lijndiagram laat een verloop in de tijd zien. Een cirkeldiagram laat zien hoe een geheel in delen is verdeeld. Een staafdiagram vergelijkt aantallen van losse groepen.',
          `Het meest geschikt is een <b>${k}</b>.`,
        ),
      },
    );
  }
  const f = r.int(1, 3),
    d = barData(r);
  if (f === 1)
    return {
      type: 'num',
      q:
        p('Bekijk het staafdiagram. De dunne lijnen tellen niet mee.') +
        ask('Hoe groot is de stap tussen twee getallen die naast de verticale as staan?'),
      fig: d.fig,
      ans: d.step,
      expl: steps(
        `Naast de verticale as staan de getallen 0, ${nf(d.step)}, ${nf(2 * d.step)}, enzovoort.`,
        `De stap is steeds <b>${nf(d.step)}</b>.`,
      ),
    };
  if (f === 2)
    return Object.assign(mcTxt(r, d.C.y, ['de ' + (d.C.per === 'maand' ? 'maanden' : 'dagen'), 'de titel van het diagram', 'de legenda']), {
      q: p('Bekijk het staafdiagram.') + ask('Wat is er uitgezet op de verticale as?'),
      fig: d.fig,
      expl: steps(
        'De verticale as loopt van onder naar boven. Daarlangs staat wat er geteld of gemeten is.',
        `Op de verticale as staat: <b>${d.C.y}</b>.`,
      ),
    });
  const good = 'welke kleur of welk symbool bij welke groep hoort';
  return Object.assign(
    mcTxt(r, good, ['hoe groot de stappen op de assen zijn', 'waar de gegevens vandaan komen', 'wat de titel van het diagram is']),
    {
      q: p('Bij veel diagrammen staat een legenda.') + ask('Wat lees je af in een legenda?'),
      expl: steps(
        'Een legenda is de verklaring van de kleuren, lijnen of symbolen in een diagram of op een kaart.',
        `In de legenda staat <b>${good}</b>.`,
      ),
    },
  );
});

def('DN14', 'D', 'N', 'D.2', 'Afstand-tijdgrafiek', (L, r) => {
  const name = nm(r),
    slot = 30,
    s1 = r.pick([5, 10]),
    s2 = r.pick([5, 10]),
    n1 = r.int(2, 3),
    np = r.int(1, 2),
    n2 = r.int(2, 3),
    t0 = r.int(8, 10) * 60,
    d = [0];
  for (let i = 0; i < n1; i++) d.push(d[d.length - 1] + s1);
  for (let i = 0; i < np; i++) d.push(d[d.length - 1]);
  for (let i = 0; i < n2; i++) d.push(d[d.length - 1] + s2);
  const xs = d.map((x, i) => klok(t0 + i * slot)),
    tot = d[d.length - 1],
    yMax = Math.ceil((tot + 1) / 10) * 10;
  const fig = F.line({
    xs: xs,
    series: [{ name: 'afstand', vals: d }],
    yMin: 0,
    yMax: yMax,
    yStep: yMax > 40 ? 10 : 5,
    yMinor: yMax > 40 ? 5 : 0,
    yTitle: 'afstand vanaf huis (km)',
    xTitle: 'tijd',
    title: 'Fietstocht van ' + name,
  });
  const base = `${name} maakt een fietstocht en houdt onderweg een pauze. De grafiek laat zien hoe ver ${name} van huis is.`;
  if (L === 1) {
    const i = r.int(1, d.length - 1);
    return {
      type: 'num',
      unit: 'km',
      q: p(base) + ask(`Hoe ver is ${name} van huis om ${xs[i]} uur?`),
      fig,
      ans: d[i],
      expl: steps(
        `Ga bij ${xs[i]} uur recht omhoog naar de lijn en lees links de afstand af.`,
        `Om ${xs[i]} uur is ${name} <b>${d[i]}</b> km van huis.`,
      ),
    };
  }
  if (L === 2) {
    if (r.chance(0.5))
      return {
        type: 'num',
        unit: 'minuten',
        q: p(base) + ask('Hoeveel minuten duurt de pauze?'),
        fig,
        ans: np * slot,
        expl: steps(
          'Tijdens de pauze verandert de afstand niet. De lijn loopt dan horizontaal.',
          `De lijn is horizontaal van ${xs[n1]} tot ${xs[n1 + np]} uur.`,
          `Dat is <b>${np * slot}</b> minuten.`,
        ),
      };
    return {
      type: 'num',
      unit: 'km/u',
      calc: true,
      q: p(base) + ask(`Wat is de gemiddelde snelheid van ${name} vóór de pauze?`),
      fig,
      ans: s1 * 2,
      expl: steps(
        `Vóór de pauze fietst ${name} van ${xs[0]} tot ${xs[n1]} uur: ${n1 * slot} minuten. In die tijd legt ${name} ${n1 * s1} km af.`,
        `Snelheid = afstand : tijd. ${n1 * slot} minuten is ${nf((n1 * slot) / 60)} uur.`,
        `${n1 * s1} : ${nf((n1 * slot) / 60)} = <b>${s1 * 2}</b> km/u.`,
      ),
    };
  }
  const hrs = ((d.length - 1) * slot) / 60,
    avg = tot / hrs;
  if (!whole(avg * 10)) throw RETRY;
  return {
    type: 'num',
    unit: 'km/u',
    calc: true,
    q: p(base) + ask('Wat is de gemiddelde snelheid over de hele tocht, inclusief de pauze?'),
    fig,
    ans: rnd(avg, 1),
    expl:
      steps(
        `De tocht duurt van ${xs[0]} tot ${xs[xs.length - 1]} uur. Dat is ${nf(hrs)} uur.`,
        `In die tijd legt ${name} ${tot} km af.`,
        `${tot} : ${nf(hrs)} = <b>${nf(rnd(avg, 1))}</b> km/u.`,
      ) + tip('De pauze telt mee in de totale tijd. Daardoor is het gemiddelde lager dan de snelheid tijdens het fietsen.'),
  };
});

def('DN15', 'D', 'N', 'D.2', 'Tabel met jongens en meisjes', (L, r) => {
  const groups = ['Groep 5', 'Groep 6', 'Groep 7', 'Groep 8'],
    gi = r.int(0, 3),
    girlsTot = L === 3 ? r.pick([40, 50]) : r.pick([40, 50, 60, 80]);
  let g: number[], b: number[], tot: number[];
  for (let t = 0; ; t++) {
    if (t > 300) throw RETRY;
    g = [0, 1, 2, 3].map(() => r.int(8, 22));
    if (sum(g) !== girlsTot) continue;
    tot = [0, 1, 2, 3].map(() => r.pick([20, 25, 25, 30, 32]));
    b = tot.map((x, i) => x - g[i]);
    if (b.some((x) => x < 6) || (tot[gi] !== 20 && tot[gi] !== 25)) continue;
    break;
  }
  const fig = F.table(
    ['', 'Jongens', 'Meisjes', 'Totaal'],
    groups.map((nmn, i) => [nmn, b[i], g[i], tot[i]]),
    { cap: 'Leerlingen in de bovenbouw' },
  );
  if (L === 1) {
    const jong = r.chance(0.5),
      arr = jong ? b : g;
    return {
      type: 'num',
      unit: jong ? 'jongens' : 'meisjes',
      q: p('Bekijk de tabel.') + ask(`Hoeveel ${jong ? 'jongens' : 'meisjes'} zitten er in totaal in groep 5 tot en met 8?`),
      fig,
      ans: sum(arr),
      expl: steps(`Tel de getallen in de kolom ‘${jong ? 'Jongens' : 'Meisjes'}’ op.`, `${arr.join(' + ')} = <b>${sum(arr)}</b>.`),
    };
  }
  if (L === 2) {
    const pc = (g[gi] / tot[gi]) * 100;
    return {
      type: 'num',
      unit: '%',
      calc: true,
      q: p('Bekijk de tabel.') + ask(`Hoeveel procent van de leerlingen in ${groups[gi].toLowerCase()} is een meisje?`),
      fig,
      ans: pc,
      expl:
        steps(
          `In ${groups[gi].toLowerCase()} zitten ${g[gi]} meisjes op een totaal van ${tot[gi]} leerlingen.`,
          `${g[gi]} : ${tot[gi]} × 100 = <b>${f6(pc)}</b>%.`,
        ) + tip('Je deelt door het totaal van deze groep, niet door alle leerlingen.'),
    };
  }
  const pc = (g[gi] / girlsTot) * 100;
  return {
    type: 'num',
    unit: '%',
    calc: true,
    q: p('Bekijk de tabel.') + ask(`Hoeveel procent van alle meisjes in de bovenbouw zit in ${groups[gi].toLowerCase()}?`),
    fig,
    ans: rnd(pc, 2),
    expl:
      steps(
        `In totaal zijn er ${g.join(' + ')} = ${girlsTot} meisjes.`,
        `In ${groups[gi].toLowerCase()} zitten ${g[gi]} meisjes.`,
        `${g[gi]} : ${girlsTot} × 100 = <b>${f6(pc)}</b>%.`,
      ) +
      tip(
        `Je deelt hier door het totale aantal meisjes (${girlsTot}), niet door het aantal leerlingen in ${groups[gi].toLowerCase()} (${tot[gi]}).`,
      ),
  };
});

def('DN16', 'D', 'N', 'D.3', 'Frequentietabel met cijfers', (L, r) => {
  const cij = [4, 5, 6, 7, 8, 9],
    N = r.pick([20, 25]);
  let fr: number[];
  for (let t = 0; ; t++) {
    if (t > 300) throw RETRY;
    fr = [r.int(0, 2), r.int(1, 4), r.int(3, 7), r.int(4, 8), r.int(2, 6), r.int(0, 3)];
    if (sum(fr) === N) break;
  }
  const fig = F.table(
    null,
    [
      ['Cijfer', ...cij],
      ['Aantal leerlingen', ...fr],
    ],
    { cls: 'wide', cap: 'Uitslag van een toets' },
  );
  if (L === 1) {
    const k = r.pick([6, 7, 8]),
      cnt = sum(fr.filter((x, i) => cij[i] >= k));
    return {
      type: 'num',
      unit: 'leerlingen',
      q: p('Bekijk de tabel.') + ask(`Hoeveel leerlingen haalden een ${k} of hoger?`),
      fig,
      ans: cnt,
      expl:
        steps(
          `Tel de aantallen bij de cijfers ${cij.filter((x) => x >= k).join(', ')}.`,
          `${fr.filter((x, i) => cij[i] >= k).join(' + ')} = <b>${cnt}</b> leerlingen.`,
        ) + tip(`De ${k} zelf telt ook mee.`),
    };
  }
  if (L === 2) {
    const onv = fr[0] + fr[1],
      pc = (onv / N) * 100;
    return {
      type: 'num',
      unit: '%',
      calc: true,
      q:
        p('Bekijk de tabel. Een cijfer lager dan 6 is een onvoldoende.') + ask('Hoeveel procent van de leerlingen haalde een onvoldoende?'),
      fig,
      ans: pc,
      expl: steps(
        `Onvoldoendes zijn de cijfers 4 en 5: ${fr[0]} + ${fr[1]} = ${onv} ${onv === 1 ? 'leerling' : 'leerlingen'}.`,
        `In totaal maakten ${fr.join(' + ')} = ${N} leerlingen de toets.`,
        `${onv} : ${N} × 100 = <b>${f6(pc)}</b>%.`,
      ),
    };
  }
  const pts = sum(fr.map((x, i) => x * cij[i])),
    avg = pts / N;
  if (tie(avg, 1)) throw RETRY;
  const ans = rnd(avg, 1);
  return {
    type: 'num',
    dec: 1,
    calc: true,
    q: p('Bekijk de tabel.') + ask('Wat is het gemiddelde cijfer van de klas? Rond af op één decimaal.'),
    fig,
    ans,
    expl:
      steps(
        `Vermenigvuldig elk cijfer met het aantal leerlingen en tel alles op: ${fr.map((x, i) => `${x} × ${cij[i]}`).join(' + ')} = ${pts}.`,
        `Er zijn ${N} leerlingen.`,
        f6(avg) === nf(ans, 1) || f6(avg) === nf(ans)
          ? `${pts} : ${N} = <b>${nf(ans, 1)}</b>.`
          : `${pts} : ${N} = ${f6(avg)}. Afgerond: <b>${nf(ans, 1)}</b>.`,
      ) + tip('De cijfers zelf optellen en door 6 delen is niet goed: niet elk cijfer komt even vaak voor.'),
  };
});

def('DN17', 'D', 'N', 'D.2', 'Twee lijnen vergelijken', (L, r) => {
  const [n1, n2] = nm(r, 2),
    xs = MK.slice(0, 6),
    a: number[] = [],
    b: number[] = [];
  let va = 10 * r.int(6, 10),
    vb = 10 * r.int(1, 4);
  for (let i = 0; i < 6; i++) {
    a.push(va);
    b.push(vb);
    va += 10 * r.int(0, 1) * (L === 1 ? r.pick([1, -1]) : 1);
    vb += 10 * r.int(1, 3);
  }
  const all = a.concat(b),
    yMax = Math.ceil((max(all) + 1) / 20) * 20;
  if (min(all) < 0 || yMax > 160) throw RETRY;
  const fig = F.line({
    xs: xs,
    series: [
      { name: n1, vals: a },
      { name: n2, vals: b },
    ],
    yMin: 0,
    yMax: yMax,
    yStep: 20,
    yMinor: 10,
    yTitle: 'spaargeld (€)',
    title: 'Spaargeld aan het eind van de maand',
  });
  const base = `${n1} en ${n2} sparen allebei. De grafiek laat zien hoeveel spaargeld ze aan het eind van elke maand hebben.`,
    dif = a.map((x, i) => Math.abs(x - b[i]));
  const list = xs.map((x, i) => `${MND[i]}: ${a[i]} en ${b[i]}`).join('; ') + '.';
  if (L === 1) {
    const best = max(dif),
      bi = dif.indexOf(best);
    if (dif.filter((x) => x === best).length > 1) throw RETRY;
    return Object.assign(mcTxt(r, MND[bi], r.shuffle(MND.slice(0, 6).filter((x, i) => i !== bi))), {
      q: p(base) + ask(`In welke maand is het verschil tussen ${n1} en ${n2} het grootst?`),
      fig,
      expl: steps(
        `Lees per maand beide bedragen af (${n1} en ${n2}). ${cap(list)}`,
        `De verschillen zijn: ${dif.join(', ')} euro.`,
        `Het grootste verschil is ${best} euro, in <b>${MND[bi]}</b>.`,
      ),
    });
  }
  const more = b.filter((x, i) => x > a[i]).length,
    first = b.findIndex((x, i) => x > a[i]);
  if (first < 2 || b.some((x, i) => x === a[i])) throw RETRY;
  if (L === 2)
    return {
      type: 'num',
      unit: 'maanden',
      q: p(base) + ask(`In hoeveel van de zes maanden heeft ${n2} meer spaargeld dan ${n1}?`),
      fig,
      ans: more,
      expl: steps(
        `Lees per maand beide bedragen af (${n1} en ${n2}). ${cap(list)}`,
        `${n2} heeft meer dan ${n1} vanaf ${MND[first]}.`,
        `Dat is in <b>${more}</b> ${more === 1 ? 'maand' : 'maanden'}.`,
      ),
    };
  const ans = b[5] - b[0] - (a[5] - a[0]);
  return {
    type: 'num',
    pre: '€',
    q: p(base) + ask(`Hoeveel euro heeft ${n2} tussen eind januari en eind juni meer gespaard dan ${n1}?`),
    fig,
    ans,
    expl:
      steps(
        `${n2} ging van ${b[0]} naar ${b[5]} euro: ${b[5] - b[0]} euro erbij.`,
        `${n1} ging van ${a[0]} naar ${a[5]} euro: ${a[5] - a[0]} euro erbij.`,
        `${b[5] - b[0]} − ${a[5] - a[0]} = <b>${ans}</b> euro.`,
      ) + tip('Het gaat om wat erbij is gekomen, niet om het bedrag aan het eind.'),
  };
});

def('DN18', 'D', 'N', 'D.5', 'Tabel met een vast verband', (L, r) => {
  const [it, u, rates] = r.pick([
      ['kaas', 'kg', [9.6, 12, 12.8, 14.4]],
      ['appels', 'kg', [1.8, 2.4, 2.5, 3.2]],
      ['stof', 'm', [6.5, 7.2, 8.4, 9]],
      ['noten', 'kg', [11.2, 13.5, 16]],
    ]),
    rate = r.pick(rates);
  if (L < 3) {
    const xs =
        L === 1
          ? [1, 2, 4]
          : r.pick([
              [2, 5, 8],
              [3, 4, 10],
              [2, 6, 9],
              [4, 5, 12],
            ]),
      xq = L === 1 ? r.pick([3, 6, 8]) : r.pick([7, 11, 13, 15].filter((x) => xs.indexOf(x) < 0)),
      ans = rnd(rate * xq, 2);
    const fig = F.table(
      null,
      [
        [`${it} (${u})`, ...xs, xq],
        ['prijs (€)'].concat(
          xs.map((x) => nf(rnd(rate * x, 2), 2)),
          ['?'],
        ),
      ],
      { cls: 'wide' },
    );
    return {
      type: 'num',
      pre: '€',
      dec: 2,
      calc: L === 2,
      q:
        p(`De prijs van ${it} hangt af van de hoeveelheid. De prijs per ${u} is steeds gelijk.`) +
        ask('Welk bedrag hoort op de plaats van het vraagteken?'),
      fig,
      ans,
      expl: steps(
        xs[0] === 1
          ? `In de tabel staat de prijs van 1 ${u}: ${nf(rate, 2)} euro.`
          : `Reken eerst de prijs van 1 ${u} uit: ${nf(rnd(rate * xs[0], 2), 2)} : ${xs[0]} = ${nf(rate, 2)} euro.`,
        `${xq} ${u} kost ${xq} × ${nf(rate, 2)} = <b>${eur(ans)}</b>.`,
      ),
    };
  }
  const fee = r.pick([2.5, 4, 5, 7.5]),
    per = r.pick([1.5, 2, 2.5, 3.5]),
    xs = [1, 2, 3],
    xq = r.pick([8, 10, 12, 15]),
    ans = rnd(fee + per * xq, 2);
  const fig = F.table(
    null,
    [
      ['uren', ...xs, xq],
      ['prijs (€)'].concat(
        xs.map((x) => nf(fee + per * x, 2)),
        ['?'],
      ),
    ],
    { cls: 'wide' },
  );
  return {
    type: 'num',
    pre: '€',
    dec: 2,
    calc: true,
    q:
      p('De tabel hoort bij het huren van een kano. De huurprijs bestaat uit een vast bedrag en een bedrag per uur.') +
      ask('Welk bedrag hoort op de plaats van het vraagteken?'),
    fig,
    ans,
    expl:
      steps(
        `Elk uur komt er ${nf(per, 2)} euro bij: ${nf(fee + 2 * per, 2)} − ${nf(fee + per, 2)} = ${nf(per, 2)}.`,
        `Het vaste bedrag is de prijs van 1 uur min het bedrag per uur: ${nf(fee + per, 2)} − ${nf(per, 2)} = ${nf(fee, 2)} euro.`,
        `Voor ${xq} uur: ${nf(fee, 2)} + ${xq} × ${nf(per, 2)} = <b>${eur(ans)}</b>.`,
      ) + tip(`De prijs van 1 uur keer ${xq} nemen is niet goed: het vaste bedrag betaal je maar één keer.`),
  };
});
