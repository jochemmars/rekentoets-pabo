/* Domein B · Verhoudingen, procenten, breuken en decimale getallen · niet-hoofdrekenen */
import { nf, eur, en, fr, frs, NB } from '../../core/notatie';
import { lcm, rnd } from '../../core/rekenen';
import { def, RETRY, steps, tip, p, ask, mcTxt, nm } from '../../core/opbouw';
import { f6, whole, tie } from '../hulp';

const C = (c: number) => eur(c / 100);
const m2 = (x: number) => (whole(x) ? undefined : 2); // aantal decimalen om een bedrag te tonen

// gerecht, ingrediënten als [naam, eenheid, hoeveelheid]
const RECIPES: [string, [string, string, number][]][] = [
  [
    'pannenkoeken',
    [
      ['bloem', 'g', 250],
      ['melk', 'ml', 500],
      ['boter', 'g', 40],
    ],
  ],
  [
    'appeltaart',
    [
      ['bloem', 'g', 300],
      ['boter', 'g', 200],
      ['suiker', 'g', 150],
    ],
  ],
  [
    'tomatensoep',
    [
      ['tomaten', 'g', 800],
      ['bouillon', 'ml', 600],
      ['room', 'ml', 120],
    ],
  ],
  [
    'risotto',
    [
      ['rijst', 'g', 320],
      ['bouillon', 'ml', 900],
      ['kaas', 'g', 80],
    ],
  ],
  [
    'havermoutpap',
    [
      ['havermout', 'g', 160],
      ['melk', 'ml', 800],
      ['honing', 'g', 40],
    ],
  ],
];
def('BN01', 'B', 'N', 'B.5', 'Recept omrekenen', (L, r) => {
  const [dish, ing] = r.pick(RECIPES),
    name = nm(r),
    p0 = L === 1 ? r.pick([2, 4]) : r.pick([4, 6]),
    [it, u, amt] = ing[r.int(0, 2)];
  const intro = `Een recept voor ${dish} is bedoeld voor ${p0} personen. Je hebt nodig: ${en(ing.map((x) => `${nf(x[2])} ${x[1]} ${x[0]}`))}.`,
    uw = u === 'g' ? 'gram' : 'milliliter';
  if (L === 1) {
    const k = r.pick([2, 3]),
      q = p0 * k;
    return {
      type: 'num',
      unit: u,
      q: p(`${intro} ${name} maakt het recept voor ${q} personen.`) + ask(`Hoeveel ${uw} ${it} is er nodig?`),
      ans: amt * k,
      expl:
        steps(`${q} personen is ${k} keer zoveel als ${p0} personen.`, `${k} × ${nf(amt)} = <b>${nf(amt * k)}</b> ${u} ${it}.`) +
        tip('De andere ingrediënten heb je voor deze vraag niet nodig.'),
    };
  }
  const per = amt / p0;
  if (L === 2) {
    const q = p0 === 4 ? r.pick([6, 10, 14]) : r.pick([9, 15, 21]),
      fct = q / p0,
      ans = rnd(amt * fct, 4);
    if (!whole(ans)) throw RETRY;
    return {
      type: 'num',
      unit: u,
      calc: true,
      q: p(`${intro} ${name} maakt het recept voor ${q} personen.`) + ask(`Hoeveel ${uw} ${it} is er nodig?`),
      ans,
      expl:
        steps(
          `${q} : ${p0} = ${nf(fct)}. Het recept moet ${nf(fct)} keer zo groot worden.`,
          `${nf(fct)} × ${nf(amt)} = <b>${nf(ans)}</b> ${u} ${it}.`,
        ) + tip('De andere ingrediënten heb je voor deze vraag niet nodig.'),
    };
  }
  if (Math.abs(per - rnd(per, 1)) > 1e-9) throw RETRY;
  const n = r.int(p0 + 3, 4 * p0),
    S = rnd(per * n + per * r.pick([0.2, 0.4, 0.6]), 4);
  if (!whole(S)) throw RETRY;
  return {
    type: 'num',
    unit: 'personen',
    calc: true,
    q:
      p(`${intro} ${name} heeft nog ${nf(S)} ${u} ${it} in huis en genoeg van de andere ingrediënten.`) +
      ask(`Voor hoeveel personen kan ${name} het recept maximaal maken?`),
    ans: n,
    expl: steps(
      `Voor 1 persoon: ${nf(amt)} : ${p0} = ${f6(per)} ${u} ${it}.`,
      `${nf(S)} : ${f6(per)} = ${f6(rnd(S / per, 2))}.`,
      `Voor een hele persoon extra is er te weinig. Je rondt naar beneden af: <b>${n}</b> personen.`,
    ),
  };
});

def('BN02', 'B', 'N', 'B.7', 'Btw en korting', (L, r) => {
  const it = r.pick(['laptop', 'wasmachine', 'fiets', 'bureaustoel', 'televisie', 'koelkast']);
  if (L === 1) {
    const P = r.pick([50, 100, 150, 200, 250, 300, 400, 500]),
      b = r.pick([21, 21, 9]),
      ans = rnd((P * (100 + b)) / 100, 2);
    return {
      type: 'num',
      pre: '€',
      dec: m2(ans),
      q:
        p(`Een ${b === 9 ? 'stapel studieboeken' : it} kost ${eur(P)} exclusief btw. Het btw-tarief is ${b}%.`) +
        ask('Wat is de prijs inclusief btw?'),
      ans,
      expl: steps(`De btw is ${b}% van ${eur(P)}: ${eur((P * b) / 100)}.`, `${eur(P)} + ${eur((P * b) / 100)} = <b>${eur(ans)}</b>.`),
    };
  }
  if (L === 2) {
    const P = 20 * r.int(12, 60),
      pc = r.pick([15, 20, 25, 30]),
      k = r.pick([20, 25, 40, 50]),
      d = (P * pc) / 100,
      ans = P - d - k;
    return {
      type: 'num',
      pre: '€',
      calc: true,
      q:
        p(
          `Een ${it} kost ${eur(P)}. In de uitverkoop gaat er eerst ${pc}% van de prijs af. Met een kortingsbon krijg je daarna nog ${eur(k)} korting.`,
        ) + ask('Hoeveel betaal je?'),
      ans,
      expl:
        steps(
          `${pc}% van ${eur(P)} is ${eur(d)}.`,
          `${eur(P)} − ${eur(d)} = ${eur(P - d)}.`,
          `Daarna gaat de bon eraf: ${eur(P - d)} − ${eur(k)} = <b>${eur(ans)}</b>.`,
        ) + tip('De volgorde is belangrijk: eerst het percentage over de volle prijs, daarna het vaste bedrag.'),
    };
  }
  const P = 50 * r.int(4, 24),
    pc = r.pick([5, 10, 15, 20]),
    after = (P * (100 - pc)) / 100,
    v = after * 1.21;
  if (tie(v, 2)) throw RETRY;
  const ans = rnd(v, 2);
  return {
    type: 'num',
    pre: '€',
    dec: 2,
    calc: true,
    q:
      p(
        `Een bedrijf koopt een ${it} van ${eur(P)} exclusief btw. De leverancier geeft ${pc}% korting op de prijs exclusief btw. Daarna komt er 21% btw bij.`,
      ) + ask('Hoeveel betaalt het bedrijf? Rond af op hele centen.'),
    ans,
    expl: steps(
      `Na ${pc}% korting: ${eur(P)} × ${nf((100 - pc) / 100)} = ${eur(after)}.`,
      `Met 21% btw: ${eur(after)} × 1,21 = ${f6(v)}.`,
      `Afgerond op hele centen: <b>${eur(ans)}</b>.`,
    ),
  };
});

def('BN03', 'B', 'N', 'B.7', 'Terugrekenen naar 100%', (L, r) => {
  const it = r.pick(['jas', 'bank', 'fiets', 'tent', 'koffer', 'bureau']);
  if (L === 1) {
    const pc = r.pick([10, 20, 25, 50]),
      orig = 20 * r.int(10, 40),
      N = (orig * (100 + pc)) / 100,
      [pr, u] = r.pick([
        ['fles shampoo', 'ml'],
        ['pak wasmiddel', 'g'],
        ['zak chips', 'g'],
        ['fles frisdrank', 'ml'],
      ]);
    return {
      type: 'num',
      unit: u,
      q:
        p(`Op een ${pr} staat: “Nu ${pc}% extra!” De verpakking bevat nu ${nf(N)} ${u}.`) +
        ask(`Hoeveel ${u === 'g' ? 'gram' : 'milliliter'} zit er in de gewone verpakking?`),
      ans: orig,
      expl:
        steps(
          `De nieuwe inhoud is 100% + ${pc}% = ${100 + pc}% van de gewone inhoud.`,
          `${100 + pc}% is ${nf(N)} ${u}, dus 1% is ${nf(N)} : ${100 + pc} = ${f6(N / (100 + pc))} ${u}.`,
          `100% is <b>${nf(orig)}</b> ${u}.`,
        ) + tip(`${pc}% van ${nf(N)} afhalen geeft een verkeerd antwoord: de ${pc}% hoort bij de gewone inhoud.`),
    };
  }
  if (L === 2) {
    if (r.chance(0.5)) {
      const pc = r.pick([15, 30, 35, 40]),
        old = 20 * r.int(3, 20),
        N = (old * (100 - pc)) / 100;
      return {
        type: 'num',
        pre: '€',
        calc: true,
        q: p(`In de uitverkoop krijg je ${pc}% korting op een ${it}. Je betaalt nu ${eur(N)}.`) + ask('Wat was de prijs zonder korting?'),
        ans: old,
        expl:
          steps(
            `Na ${pc}% korting betaal je nog ${100 - pc}% van de oude prijs.`,
            `${100 - pc}% is ${eur(N)}, dus 1% is ${eur(N)} : ${100 - pc} = ${f6(N / (100 - pc))} euro.`,
            `100% is <b>${eur(old)}</b>.`,
          ) + tip(`${pc}% van ${eur(N)} erbij optellen geeft een verkeerd antwoord.`),
      };
    }
    const old = r.pick([100, 150, 200, 250, 300, 400, 450, 600]),
      N = rnd(old * 1.21, 2);
    return {
      type: 'num',
      pre: '€',
      calc: true,
      q: p(`Een ${it} kost ${eur(N)} inclusief 21% btw.`) + ask('Wat is de prijs exclusief btw?'),
      ans: old,
      expl:
        steps(
          'De prijs inclusief btw is 100% + 21% = 121% van de prijs exclusief btw.',
          `1% is ${eur(N)} : 121 = ${f6(N / 121)} euro.`,
          `100% is <b>${eur(old)}</b>.`,
        ) + tip(`21% van ${eur(N)} afhalen geeft een verkeerd antwoord: de btw is berekend over de prijs zonder btw.`),
    };
  }
  const f = r.int(1, 3);
  if (f === 1) {
    const pc = r.pick([4, 6, 8, 12, 16]),
      old = 25 * r.int(8, 60),
      N = (old * (100 + pc)) / 100;
    if (!whole(N)) throw RETRY;
    return {
      type: 'num',
      pre: '€',
      calc: true,
      q:
        p(`De huur van een woning is dit jaar met ${pc}% gestegen. De huur is nu ${eur(N)} per maand.`) +
        ask('Hoe hoog was de huur vorig jaar?'),
      ans: old,
      expl:
        steps(`De nieuwe huur is ${100 + pc}% van de oude huur.`, `${eur(N)} : ${nf((100 + pc) / 100)} = <b>${eur(old)}</b>.`) +
        tip(`${pc}% van de nieuwe huur afhalen geeft een verkeerd antwoord.`),
    };
  }
  if (f === 2) {
    const pc = r.pick([12, 15, 20, 24]),
      old = 100 * r.int(4, 30),
      N = (old * (100 - pc)) / 100;
    return {
      type: 'num',
      unit: 'leden',
      calc: true,
      q:
        p(`Een sportclub heeft dit jaar ${nf(N)} leden. Dat is ${pc}% minder dan vorig jaar.`) +
        ask('Hoeveel leden had de club vorig jaar?'),
      ans: old,
      expl:
        steps(`Dit jaar is ${100 - pc}% van vorig jaar.`, `${nf(N)} : ${nf((100 - pc) / 100)} = <b>${nf(old)}</b> leden.`) +
        tip(`${pc}% van ${nf(N)} erbij optellen geeft een verkeerd antwoord.`),
    };
  }
  const old = r.pick([500, 1000, 1500, 2000, 3000, 4000]),
    pc = r.pick([10, 20]),
    fc = (100 + pc) / 100,
    mid = old * fc,
    N = rnd(mid * fc, 2);
  if (!whole(N)) throw RETRY;
  return {
    type: 'num',
    unit: 'bezoekers',
    calc: true,
    q:
      p(
        `Het aantal bezoekers van een museum steeg vorig jaar met ${pc}% en dit jaar opnieuw met ${pc}%. Dit jaar kwamen er ${nf(N)} bezoekers.`,
      ) + ask('Hoeveel bezoekers waren er twee jaar geleden?'),
    ans: old,
    expl:
      steps(
        `Dit jaar is ${100 + pc}% van vorig jaar. Vorig jaar: ${nf(N)} : ${nf(fc)} = ${nf(mid)} bezoekers.`,
        `Vorig jaar was ook ${100 + pc}% van het jaar ervoor: ${nf(mid)} : ${nf(fc)} = <b>${nf(old)}</b> bezoekers.`,
      ) + tip(`Twee keer ${pc}% is samen geen ${2 * pc}%: de tweede stijging gaat over een groter aantal.`),
  };
});

def('BN04', 'B', 'N', 'B.7', 'Procentuele toename en afname', (L, r) => {
  if (L === 1) {
    const A = r.pick([200, 250, 400, 500, 800, 1200, 1250]),
      pc = r.pick([4, 6, 8, 12, 14, 16, 24]),
      B = (A * (100 + pc)) / 100;
    return {
      type: 'num',
      unit: '%',
      calc: true,
      q:
        p(`Het aantal leerlingen van een school stijgt in één jaar van ${nf(A)} naar ${nf(B)}.`) +
        ask('Met hoeveel procent is het aantal leerlingen gestegen?'),
      ans: pc,
      expl:
        steps(`De toename is ${nf(B)} − ${nf(A)} = ${nf(B - A)}.`, `${nf(B - A)} : ${nf(A)} × 100 = <b>${pc}</b>%.`) +
        tip('Je deelt door het oude aantal.'),
    };
  }
  if (L === 2) {
    const A = 1000 * r.pick([24, 36, 48, 60, 75, 80, 120]),
      pc = r.pick([4, 6, 8, 12, 15, 18]),
      B = (A * (100 - pc)) / 100,
      kl = 100 * r.int(11, 29);
    return {
      type: 'num',
      unit: '%',
      calc: true,
      q:
        p(
          `Een winkel had vorig jaar een omzet van ${eur(A)}. Dit jaar is de omzet ${eur(B)}. Het aantal klanten bleef ongeveer ${nf(kl)}.`,
        ) + ask('Met hoeveel procent is de omzet gedaald?'),
      ans: pc,
      expl:
        steps(`De afname is ${eur(A)} − ${eur(B)} = ${eur(A - B)}.`, `${nf(A - B)} : ${nf(A)} × 100 = <b>${pc}</b>%.`) +
        tip('Het aantal klanten heb je niet nodig. Je deelt door de omzet van vorig jaar.'),
    };
  }
  if (r.chance(0.5)) {
    const pc = r.pick([10, 20, 30, 50]),
      up = 100 + pc,
      dn = (up * pc) / 100,
      fin = up - dn,
      ans = 100 - fin;
    return {
      type: 'num',
      unit: '%',
      calc: true,
      q:
        p(`De prijs van een product gaat eerst ${pc}% omhoog. Daarna gaat de nieuwe prijs weer ${pc}% omlaag.`) +
        ask('Hoeveel procent is de prijs nu lager dan aan het begin?'),
      ans,
      expl:
        steps(
          'Neem als voorbeeld een beginprijs van € 100.',
          `Na de stijging: ${eur(up)}.`,
          `${pc}% van ${eur(up)} is ${eur(dn)}. Na de daling: ${eur(fin)}.`,
          `Dat is ${eur(ans)} minder dan ${eur(100)}, dus <b>${ans}</b>% lager.`,
        ) + tip('De daling wordt berekend over een hoger bedrag dan de stijging. Daarom kom je niet op de beginprijs uit.'),
    };
  }
  const A = r.pick([400, 500, 800, 1200]),
    p1 = r.pick([5, 10, 15]),
    pc = r.pick([20, 25, 30, 35, 45]),
    B = (A * (100 + p1)) / 100,
    Cn = (A * (100 + pc)) / 100;
  return {
    type: 'num',
    unit: '%',
    calc: true,
    q:
      p(`Een vereniging had in 2022 ${nf(A)} leden, in 2023 ${nf(B)} leden en in 2024 ${nf(Cn)} leden.`) +
      ask('Hoeveel procent meer leden had de vereniging in 2024 dan in 2022?'),
    ans: pc,
    expl:
      steps(
        `Vergelijk 2024 met 2022: ${nf(Cn)} − ${nf(A)} = ${nf(Cn - A)} leden meer.`,
        `${nf(Cn - A)} : ${nf(A)} × 100 = <b>${pc}</b>%.`,
      ) + tip('Het aantal van 2023 heb je niet nodig. Je deelt door het aantal van 2022.'),
  };
});

def('BN05', 'B', 'N', 'B.5', 'Brandstofverbruik en kosten', (L, r) => {
  const name = nm(r),
    pr = r.pick([179, 185, 189, 195, 199, 205, 209]) / 100;
  if (L < 3) {
    const k = r.pick([12, 15, 16, 18, 20]),
      half = r.int(20, 70),
      D = (k * half) / 2,
      lit = half / 2;
    if (!whole(D)) throw RETRY;
    const base = `De auto van ${name} rijdt 1 op ${k}. Dat betekent: op 1 liter benzine rijdt de auto ${k} kilometer.`;
    if (L === 1)
      return {
        type: 'num',
        unit: 'liter',
        q: p(base) + ask(`Hoeveel liter benzine is er nodig voor een rit van ${nf(D)} km?`),
        ans: lit,
        expl: steps(`Elke ${k} km kost 1 liter.`, `${nf(D)} : ${k} = <b>${nf(lit)}</b> liter.`),
      };
    const cost = lit * pr;
    if (tie(cost, 2)) throw RETRY;
    const ans = rnd(cost, 2);
    return {
      type: 'num',
      pre: '€',
      dec: 2,
      calc: true,
      q:
        p(`${base} ${name} maakt een rit van ${nf(D)} km. Benzine kost ${eur(pr)} per liter.`) +
        ask('Hoeveel kost de benzine voor deze rit? Rond af op hele centen.'),
      ans,
      expl: steps(
        `${nf(D)} : ${k} = ${nf(lit)} liter.`,
        `${nf(lit)} × ${eur(pr)} = ${f6(cost)}.`,
        `Afgerond op hele centen: <b>${eur(ans)}</b>.`,
      ),
    };
  }
  const c = r.pick([4.8, 5.2, 5.6, 6.4, 7.5]),
    D = 10 * r.int(8, 42),
    lit = rnd((2 * D * c) / 100, 4),
    cost = lit * pr;
  if (tie(cost, 2)) throw RETRY;
  const ans = rnd(cost, 2);
  return {
    type: 'num',
    pre: '€',
    dec: 2,
    calc: true,
    q:
      p(
        `De auto van ${name} verbruikt gemiddeld ${nf(c)} liter benzine per 100 km. ${name} rijdt naar een stad die ${nf(D)} km verderop ligt en rijdt dezelfde dag weer terug. Benzine kost ${eur(pr)} per liter.`,
      ) + ask('Hoeveel kost de benzine voor de hele dag? Rond af op hele centen.'),
    ans,
    expl:
      steps(
        `Heen en terug is 2 × ${nf(D)} = ${nf(2 * D)} km.`,
        `Verbruik: ${nf(2 * D)} : 100 × ${nf(c)} = ${f6(lit)} liter.`,
        `${f6(lit)} × ${eur(pr)} = ${f6(cost)}, afgerond <b>${eur(ans)}</b>.`,
      ) + tip('Vergeet de terugweg niet.'),
  };
});

def('BN06', 'B', 'N', 'B.5', 'Verdelen in een verhouding', (L, r) => {
  const [n1, n2, n3] = nm(r, 3);
  if (L === 1) {
    const [a, b] = r.pick([
        [1, 2],
        [2, 3],
        [1, 3],
        [3, 4],
        [2, 5],
        [3, 5],
      ]),
      u = r.pick([15, 20, 25, 40, 50, 60, 80]),
      T = (a + b) * u;
    return {
      type: 'num',
      pre: '€',
      q:
        p(
          `${n1} en ${n2} verdienen samen ${eur(T)} met oppassen. Ze verdelen het geld in de verhouding ${a} : ${b}, omdat ${n2} vaker heeft opgepast.`,
        ) + ask(`Hoeveel euro krijgt ${n2}?`),
      ans: b * u,
      expl: steps(
        `Er zijn ${a} + ${b} = ${a + b} delen.`,
        `Eén deel is ${eur(T)} : ${a + b} = ${eur(u)}.`,
        `${n2} krijgt het grootste deel: ${b} × ${eur(u)} = <b>${eur(b * u)}</b>.`,
      ),
    };
  }
  if (L === 2) {
    const v = r.sample([2, 3, 4, 5, 6, 7], 3),
      s = v[0] + v[1] + v[2],
      u = r.pick([100, 150, 200, 250, 300, 400, 500]),
      T = s * u,
      w = r.int(0, 2),
      who = [n1, n2, n3][w];
    return {
      type: 'num',
      pre: '€',
      q:
        p(
          `Drie vrienden kopen samen een lot van ${eur(s)}. ${n1} betaalt ${eur(v[0])}, ${n2} betaalt ${eur(v[1])} en ${n3} betaalt ${eur(v[2])}. Ze winnen een prijs van ${eur(T)} en verdelen die in dezelfde verhouding als hun inleg.`,
        ) + ask(`Hoeveel euro krijgt ${who}?`),
      ans: v[w] * u,
      expl: steps(
        `Samen hebben ze ${v[0]} + ${v[1]} + ${v[2]} = ${s} euro ingelegd.`,
        `Per ingelegde euro krijgen ze ${eur(T)} : ${s} = ${eur(u)}.`,
        `${who} legde ${eur(v[w])} in: ${v[w]} × ${eur(u)} = <b>${eur(v[w] * u)}</b>.`,
      ),
    };
  }
  const [a, b, c] = r.pick([
      [3, 2, 1],
      [5, 3, 2],
      [4, 3, 1],
      [5, 4, 3],
      [7, 5, 3],
      [6, 4, 1],
    ]),
    u = r.pick([1500, 2500, 4250, 3200, 6000]),
    D = (a - c) * u,
    T = (a + b + c) * u;
  return {
    type: 'num',
    pre: '€',
    q:
      p(
        `Een erfenis wordt verdeeld over drie kinderen in de verhouding ${a} : ${b} : ${c}. Het kind met het grootste deel krijgt ${eur(D)} meer dan het kind met het kleinste deel.`,
      ) + ask('Hoe groot is de hele erfenis?'),
    ans: T,
    expl: steps(
      `Het verschil tussen het grootste en het kleinste deel is ${a} − ${c} = ${a - c} delen.`,
      `${a - c} delen zijn ${eur(D)}, dus één deel is ${eur(u)}.`,
      `De erfenis bestaat uit ${a} + ${b} + ${c} = ${a + b + c} delen: ${a + b + c} × ${eur(u)} = <b>${eur(T)}</b>.`,
    ),
  };
});

def('BN07', 'B', 'N', 'B.7', 'Promille', (L, r) => {
  if (L < 3) {
    const pm = L === 1 ? r.pick([2, 3, 4, 5, 8]) : r.pick([1.5, 2.5, 0.5, 3.5, 0.25]),
      N = L === 1 ? 1000 * r.pick([25, 40, 60, 120, 250, 550, 800]) : 4000 * r.int(5, 60),
      ans = rnd((N * pm) / 1000, 4);
    const [t, qq, u] = r.pick([
      [
        `In een stad met ${nf(N)} inwoners is ${nf(pm)} promille van de inwoners lid van de schaakvereniging.`,
        'Hoeveel inwoners zijn dat?',
        'inwoners',
      ],
      [`Een fabriek maakt ${nf(N)} lampen per maand. Daarvan is ${nf(pm)} promille kapot.`, 'Hoeveel lampen zijn dat?', 'lampen'],
      [
        `Van de ${nf(N)} pakketten die een bezorger dit jaar verstuurt, raakt ${nf(pm)} promille zoek.`,
        'Hoeveel pakketten zijn dat?',
        'pakketten',
      ],
    ]);
    return {
      type: 'num',
      unit: u,
      q: p(t) + ask(qq),
      ans,
      expl: steps(
        'Promille betekent: per duizend.',
        `1 promille van ${nf(N)} is ${nf(N)} : 1.000 = ${nf(N / 1000)}.`,
        `${nf(pm)} promille is ${nf(pm)} × ${nf(N / 1000)} = <b>${nf(ans)}</b> ${u}.`,
      ),
    };
  }
  if (r.chance(0.6)) {
    const [k, N] = r.pick([
        [12, 8000],
        [45, 18000],
        [9, 6000],
        [140, 40000],
        [33, 22000],
        [27, 4500],
        [36, 48000],
        [21, 6000],
        [130, 52000],
      ]),
      ans = rnd((k / N) * 1000, 4);
    return {
      type: 'num',
      unit: '‰',
      calc: true,
      q: p(`Bij een controle blijken ${k} van de ${nf(N)} producten niet goed te zijn.`) + ask('Hoeveel promille is dat?'),
      ans,
      expl:
        steps(`Deel het deel door het geheel: ${k} : ${nf(N)} = ${f6(k / N)}.`, `Vermenigvuldig met 1.000: <b>${nf(ans)}</b> promille.`) +
        tip('Voor procent vermenigvuldig je met 100, voor promille met 1.000.'),
    };
  }
  const pm = r.pick([0.5, 0.2, 0.8, 1.5, 2.5, 5]),
    ans = rnd(pm / 10, 4);
  return {
    type: 'num',
    unit: '%',
    q: p(`In een verslag staat dat ${nf(pm)} promille van de leerlingen een zeldzame allergie heeft.`) + ask('Hoeveel procent is dat?'),
    ans,
    expl: steps('1 procent is 10 promille.', `${nf(pm)} : 10 = <b>${nf(ans)}</b>%.`),
  };
});

def('BN08', 'B', 'N', 'B.6', 'Breuken in een verhaal', (L, r) => {
  const [n1, n2] = nm(r, 2),
    st = (n: number) => (n === 1 ? '1 stuk' : n + ' stukken');
  if (L === 1) {
    const b = r.pick([6, 8, 10, 12]),
      a1 = r.int(1, 3),
      a2 = r.int(1, 3),
      rest = b - a1 - a2,
      good = frs(rest, b);
    return Object.assign(mcTxt(r, good, [frs(a1 + a2, b), frs(rest + 1, b), frs(b - a1, b), frs(rest - 1 || 1, b)]), {
      q:
        p(`Een taart is in ${b} gelijke stukken gesneden. ${n1} eet ${st(a1)} en ${n2} eet ${st(a2)}.`) +
        ask('Welk deel van de taart is er nog over?'),
      expl: steps(
        `Samen eten ze ${a1} + ${a2} = ${a1 + a2} stukken.`,
        `${b} − ${a1 + a2} = ${rest}. Er ${rest === 1 ? 'blijft 1 stuk' : 'blijven ' + rest + ' stukken'} over. Dat is ${fr(rest, b)} deel.`,
        good === fr(rest, b) ? `Het antwoord is <b>${good}</b>.` : `Vereenvoudig: <b>${good}</b>.`,
      ),
    });
  }
  if (L === 2) {
    const P = r.pick([12, 18, 24]),
      [f1, f2] = r.sample(
        [
          [1, 2],
          [1, 3],
          [2, 3],
          [1, 4],
          [3, 4],
          [1, 6],
          [5, 6],
        ],
        2,
      ),
      c1 = (P * f1[0]) / f1[1],
      c2 = (P * f2[0]) / f2[1];
    if (!whole(c1) || !whole(c2)) throw RETRY;
    return {
      type: 'num',
      pre: '€',
      dec: m2(c1 + c2),
      q:
        p(
          `Bij de bakker kost een hele vlaai ${eur(P)}. Je kunt ook een deel van een vlaai kopen. Je betaalt dan naar verhouding. ${n1} koopt ${fr(f1[0], f1[1])} kersenvlaai en ${n2} koopt ${fr(f2[0], f2[1])} appelvlaai.`,
        ) + ask('Hoeveel euro betalen ze samen?'),
      ans: c1 + c2,
      expl: steps(
        `${fr(f1[0], f1[1])} van ${eur(P)} is ${eur(P)} : ${f1[1]} × ${f1[0]} = ${eur(c1)}.`,
        `${fr(f2[0], f2[1])} van ${eur(P)} is ${eur(P)} : ${f2[1]} × ${f2[0]} = ${eur(c2)}.`,
        `Samen: <b>${eur(c1 + c2)}</b>.`,
      ),
    };
  }
  const [[a, b], [c, d]] = r.pick([
    [
      [2, 5],
      [1, 3],
    ],
    [
      [1, 2],
      [1, 3],
    ],
    [
      [3, 8],
      [1, 4],
    ],
    [
      [1, 4],
      [3, 5],
    ],
    [
      [2, 3],
      [1, 5],
    ],
    [
      [1, 2],
      [3, 10],
    ],
    [
      [3, 5],
      [1, 4],
    ],
    [
      [1, 3],
      [1, 4],
    ],
  ]);
  const l = lcm(b, d),
    n = l - (a * l) / b - (c * l) / d,
    u = r.int(Math.ceil(120 / l), Math.floor(600 / l)),
    R = n * u;
  return {
    type: 'num',
    unit: 'leerlingen',
    q:
      p(
        `Op een basisschool komt ${fr(a, b)} deel van de leerlingen met de fiets en ${fr(c, d)} deel komt lopend. De overige ${R} leerlingen worden met de auto gebracht.`,
      ) + ask('Hoeveel leerlingen telt de school?'),
    ans: l * u,
    expl: steps(
      `Fiets en lopend samen: ${fr(a, b)} + ${fr(c, d)} = ${fr((a * l) / b, l)} + ${fr((c * l) / d, l)} = ${fr(l - n, l)}.`,
      `Er blijft ${fr(n, l)} deel over. Dat zijn ${R} leerlingen.`,
      n === 1 ? `${fr(1, l)} deel is dus ${u} leerlingen.` : `${fr(1, l)} deel is ${R} : ${n} = ${u} leerlingen.`,
      `De hele school: ${l} × ${u} = <b>${l * u}</b> leerlingen.`,
    ),
  };
});

// aanbieding, korting in %, uitleg
const DEALS: [string, number, string][] = [
  ['3 halen, 2 betalen', 100 / 3, 'je betaalt 2 van de 3 flessen. Dat is 33,3% korting'],
  ['2e fles voor de halve prijs', 25, 'voor 2 flessen betaal je 1,5 keer de prijs. Dat is 25% korting'],
  ['30% korting', 30, ''],
  ['35% korting', 35, ''],
  ['40% korting', 40, ''],
  ['5 halen, 4 betalen', 20, 'je betaalt 4 van de 5 flessen. Dat is 20% korting'],
  ['2 halen, 1 betalen', 50, 'je betaalt 1 van de 2 flessen. Dat is 50% korting'],
  ['28% korting', 28, ''],
];
def('BN09', 'B', 'N', 'B.3', 'Prijs per eenheid en aanbiedingen', (L, r) => {
  const prod = r.pick(['koffie', 'muesli', 'rijst', 'waspoeder', 'kattenvoer', 'thee']),
    w = r.pick([250, 400, 500, 750, 800]);
  if (L === 1) {
    const pk = 40 * r.int(8, 32),
      price = (pk * w) / 1000;
    return {
      type: 'num',
      pre: '€',
      dec: 2,
      calc: true,
      q: p(`Een pak ${prod} van ${w} gram kost ${C(price)}.`) + ask('Wat is de prijs per kilogram?'),
      ans: pk / 100,
      expl: steps('1 kilogram is 1.000 gram.', `${C(price)} : ${w} × 1.000 = <b>${C(pk)}</b> per kilogram.`),
    };
  }
  if (L === 2) {
    const pkA = 40 * r.int(10, 32),
      diff = 20 * r.int(1, 6),
      pkB = pkA - diff,
      wB = r.pick([1.2, 1.5, 2, 2.5]),
      prA = (pkA * w) / 1000,
      prB = Math.round(pkB * wB);
    return {
      type: 'num',
      pre: '€',
      dec: 2,
      calc: true,
      q:
        p(`Pak A bevat ${w} gram ${prod} en kost ${C(prA)}. Pak B bevat ${nf(wB)} kilogram ${prod} en kost ${C(prB)}.`) +
        ask('Hoeveel euro is pak B per kilogram goedkoper dan pak A?'),
      ans: diff / 100,
      expl:
        steps(
          `Pak A per kilogram: ${C(prA)} : ${w} × 1.000 = ${C(pkA)}.`,
          `Pak B per kilogram: ${C(prB)} : ${nf(wB)} = ${C(pkB)}.`,
          `Verschil: ${C(pkA)} − ${C(pkB)} = <b>${C(diff)}</b>.`,
        ) + tip('Vergelijk altijd dezelfde hoeveelheid, hier 1 kilogram.'),
    };
  }
  const ds = r.sample(DEALS, 4),
    vals = ds.map((d) => Math.round(d[1]));
  if (new Set(vals).size < 4) throw RETRY;
  const best = ds.slice().sort((x, y) => y[1] - x[1])[0];
  return Object.assign(
    mcTxt(
      r,
      best[0],
      ds.filter((d) => d !== best).map((d) => d[0]),
    ),
    {
      q:
        p(
          'Vier winkels verkopen dezelfde fles shampoo voor dezelfde prijs. Elke winkel heeft een andere aanbieding. Je koopt precies zoveel flessen als voor de aanbieding nodig is.',
        ) + ask('Bij welke aanbieding betaal je per fles het minst?'),
      expl: steps(
        ...['Reken elke aanbieding om naar een percentage korting per fles.'].concat(
          ds.filter((d) => d[2]).map((d) => `${d[0]}: ${d[2]}.`),
          [`De grootste korting krijg je bij <b>${best[0]}</b>.`],
        ),
      ),
    },
  );
});

def('BN10', 'B', 'N', 'B.10', 'Vergroten en verkleinen met een percentage', (L, r) => {
  const w = r.pick([8, 10, 12, 15, 16, 20]),
    h = w + r.pick([2, 4, 5, 6, 8, 10]);
  if (L === 1) {
    const pc = r.pick([150, 200, 50, 120, 80, 250]),
      ans = rnd((w * pc) / 100, 2);
    return {
      type: 'num',
      unit: 'cm',
      q:
        p(`Een foto is ${w} cm breed en ${h} cm hoog. De foto wordt afgedrukt op ${pc}% van de oorspronkelijke grootte.`) +
        ask('Hoe breed wordt de afdruk?'),
      ans,
      expl:
        steps(`Afdrukken op ${pc}% betekent: elke afmeting keer ${nf(pc / 100)}.`, `${w} × ${nf(pc / 100)} = <b>${nf(ans)}</b> cm.`) +
        tip('De hoogte heb je niet nodig.'),
    };
  }
  if (L === 2) {
    const up = r.chance(0.5),
      pc = up ? r.pick([25, 40, 60, 75]) : r.pick([20, 30, 40, 25]),
      tot = up ? 100 + pc : 100 - pc,
      hi = r.chance(0.5),
      val = hi ? h : w,
      ans = rnd((val * tot) / 100, 2);
    return {
      type: 'num',
      unit: 'cm',
      calc: true,
      q:
        p(`Een tekening is ${w} cm breed en ${h} cm hoog. De tekening wordt met ${pc}% ${up ? 'vergroot' : 'verkleind'}.`) +
        ask(`Hoe ${hi ? 'hoog' : 'breed'} wordt de tekening?`),
      ans,
      expl:
        steps(
          `Met ${pc}% ${up ? 'vergroten' : 'verkleinen'} betekent: de nieuwe maat is 100% ${up ? '+' : '−'} ${pc}% = ${tot}% van de oude maat.`,
          `${val} × ${nf(tot / 100)} = <b>${nf(ans)}</b> cm.`,
        ) + tip(`Met ${pc}% ${up ? 'vergroten' : 'verkleinen'} is iets anders dan afdrukken op ${pc}%.`),
    };
  }
  if (r.chance(0.5)) {
    const w2 = r.pick([8, 12, 16, 20]),
      pc = r.pick([125, 150, 175, 225, 75, 60]),
      nw = rnd((w2 * pc) / 100, 2);
    return {
      type: 'num',
      unit: '%',
      calc: true,
      q:
        p(`Een foto is ${w2} cm breed. Op de kopieermachine moet de foto ${nf(nw)} cm breed worden.`) +
        ask('Op hoeveel procent moet je de kopieermachine instellen?'),
      ans: pc,
      expl: steps(`Deel de nieuwe breedte door de oude: ${nf(nw)} : ${w2} = ${nf(pc / 100)}.`, `Dat is <b>${pc}</b>%.`),
    };
  }
  const pc = r.pick([125, 140, 160, 175, 250]),
    orig = r.pick([20, 24, 30, 36, 40, 60, 80]),
    nh = rnd((orig * pc) / 100, 2);
  return {
    type: 'num',
    unit: 'cm',
    calc: true,
    q:
      p(`Een poster is een vergroting van een foto. De kopieermachine stond ingesteld op ${pc}%. De poster is ${nf(nh)} cm hoog.`) +
      ask('Hoe hoog is de oorspronkelijke foto?'),
    ans: orig,
    expl: steps(`De poster is ${pc}% van het origineel.`, `1% is ${nf(nh)} : ${pc} = ${f6(nh / pc)} cm.`, `100% is <b>${orig}</b> cm.`),
  };
});

def('BN11', 'B', 'N', 'B.11', 'Kans en aantal mogelijkheden', (L, r) => {
  if (L === 1) {
    const total = r.pick([5, 10, 20, 25, 50]),
      red = r.int(1, total - 1),
      pc = (red / total) * 100,
      [c1, c2] = r.pick([
        ['rode', 'blauwe'],
        ['groene', 'gele'],
        ['witte', 'zwarte'],
      ]);
    return {
      type: 'num',
      unit: '%',
      q:
        p(`In een zak zitten ${red} ${c1} en ${total - red} ${c2} knikkers. Je pakt zonder te kijken één knikker.`) +
        ask(`Hoe groot is de kans dat je een ${c1} knikker pakt? Geef je antwoord als percentage.`),
      ans: pc,
      expl: steps(
        `Er zitten ${red} + ${total - red} = ${total} knikkers in de zak. Het aantal ${c1} knikkers is ${red}.`,
        `De kans is ${fr(red, total)}. Dat is ${red} : ${total} × 100 = <b>${nf(pc)}</b>%.`,
      ),
    };
  }
  if (L === 2) {
    const s = r.int(4, 10),
      cnt = s <= 7 ? s - 1 : 13 - s,
      good = frs(cnt, 36),
      combos = [];
    for (let a = 1; a <= 6; a++) if (s - a >= 1 && s - a <= 6) combos.push(`${a} + ${s - a}`);
    return Object.assign(mcTxt(r, good, [fr(1, 11), fr(1, 6), frs(s, 36), frs(cnt + 1, 36), cnt > 1 ? frs(cnt - 1, 36) : null]), {
      q: p('Je gooit met twee dobbelstenen en telt de ogen bij elkaar op.') + ask(`Hoe groot is de kans dat je samen ${s} gooit?`),
      expl:
        steps(
          'Met twee dobbelstenen zijn er 6 × 6 = 36 mogelijke worpen.',
          `Samen ${s} kan op ${cnt} manieren: ${combos.join(', ')}.`,
          good === fr(cnt, 36) ? `De kans is <b>${good}</b>.` : `De kans is ${fr(cnt, 36)}. Vereenvoudigd: <b>${good}</b>.`,
        ) + tip('3 + 5 en 5 + 3 zijn twee verschillende worpen.'),
    });
  }
  const f = r.int(1, 4);
  if (f === 1) {
    const a = r.int(2, 5),
      b = r.int(3, 6),
      c = r.int(2, 4);
    return {
      type: 'num',
      q:
        p(
          `In een restaurant kun je kiezen uit ${a} voorgerechten, ${b} hoofdgerechten en ${c} nagerechten. Een menu bestaat uit één voorgerecht, één hoofdgerecht en één nagerecht.`,
        ) + ask('Hoeveel verschillende menu’s kun je samenstellen?'),
      ans: a * b * c,
      expl: steps(
        'Bij elke keuze voor het voorgerecht kun je elk hoofdgerecht en elk nagerecht nemen.',
        `${a} × ${b} × ${c} = <b>${a * b * c}</b> menu’s.`,
      ),
    };
  }
  if (f === 2) {
    const k = r.pick([3, 4]),
      ans = Math.pow(10, k);
    return {
      type: 'num',
      q:
        p(`Een cijferslot heeft ${k} ringen. Op elke ring staan de cijfers 0 tot en met 9.`) +
        ask('Hoeveel verschillende codes zijn er mogelijk?'),
      ans,
      expl:
        steps('Op elke ring zijn er 10 mogelijkheden: 0 tot en met 9.', `${Array(k).fill(10).join(' × ')} = <b>${nf(ans)}</b> codes.`) +
        tip('De cijfers 0 tot en met 9 zijn samen tien cijfers, niet negen.'),
    };
  }
  if (f === 3) {
    const a = r.int(3, 6),
      b = r.int(4, 8),
      c = r.int(2, 3);
    return {
      type: 'num',
      q:
        p(`${nm(r)} heeft ${a} broeken, ${b} shirts en ${c} paar schoenen.`) +
        ask('Hoeveel verschillende combinaties van een broek, een shirt en een paar schoenen zijn er mogelijk?'),
      ans: a * b * c,
      expl: steps('Elke broek kan bij elk shirt en bij elk paar schoenen.', `${a} × ${b} × ${c} = <b>${a * b * c}</b> combinaties.`),
    };
  }
  const d = r.pick([1, 2]),
    ans = 26 * Math.pow(10, d);
  return {
    type: 'num',
    q:
      p(
        `De kluisjes op een school krijgen een code van één letter (A tot en met Z) gevolgd door ${d === 1 ? 'één cijfer' : 'twee cijfers'} (0 tot en met 9).`,
      ) + ask('Hoeveel verschillende codes zijn er mogelijk?'),
    ans,
    expl: steps('Er zijn 26 letters en 10 cijfers.', `26 × ${Array(d).fill(10).join(' × ')} = <b>${nf(ans)}</b> codes.`),
  };
});

def('BN12', 'B', 'N', 'B.9', 'Een deel van een deel', (L, r) => {
  if (L === 1) {
    const n = r.pick([20, 25, 30, 40]),
      pc = r.pick([20, 40, 60, 80, 30, 70]),
      boys = (n * pc) / 100;
    if (!whole(boys)) throw RETRY;
    return {
      type: 'num',
      unit: 'meisjes',
      q: p(`In een klas zitten ${n} leerlingen. Daarvan is ${pc}% jongen.`) + ask('Hoeveel meisjes zitten er in de klas?'),
      ans: n - boys,
      expl:
        steps(`${pc}% van ${n} is ${boys} jongens.`, `${n} − ${boys} = <b>${n - boys}</b> meisjes.`) +
        tip('Er wordt naar de meisjes gevraagd, niet naar de jongens.'),
    };
  }
  if (L === 2) {
    const p1 = r.pick([40, 50, 60, 80]),
      p2 = r.pick([20, 25, 30, 50, 75]),
      ans = (p1 * p2) / 100,
      sp = r.pick(['voetbal', 'hockey', 'zwemmen', 'turnen']);
    if (!whole(ans)) throw RETRY;
    return {
      type: 'num',
      unit: '%',
      q:
        p(
          `Van alle leerlingen van een school is ${p1}% lid van een sportclub. Van de leerlingen die lid zijn van een sportclub doet ${p2}% aan ${sp}.`,
        ) + ask(`Hoeveel procent van alle leerlingen doet aan ${sp}?`),
      ans,
      expl:
        steps(
          `Neem als voorbeeld 100 leerlingen. Daarvan zijn er ${p1} lid van een sportclub.`,
          `${p2}% van ${p1} is ${ans} leerlingen.`,
          `Dat is <b>${ans}</b>% van alle leerlingen.`,
        ) + tip(`De ${p2}% gaat alleen over de sporters, niet over alle leerlingen.`),
    };
  }
  const N = r.pick([800, 1200, 1600, 2400]),
    [a, b] = r.pick([
      [3, 8],
      [2, 5],
      [1, 4],
      [3, 5],
      [5, 8],
    ]),
    pc = r.pick([20, 25, 30, 40, 60]),
    kids = (N * a) / b,
    ans = (kids * (100 - pc)) / 100;
  if (!whole(ans)) throw RETRY;
  return {
    type: 'num',
    unit: 'kinderen',
    calc: true,
    q:
      p(
        `Een pretpark heeft op een dag ${nf(N)} bezoekers. Daarvan is ${fr(a, b)} deel kind. Van de kinderen heeft ${pc}% een abonnement.`,
      ) + ask('Hoeveel kinderen hebben géén abonnement?'),
    ans,
    expl:
      steps(
        `Kinderen: ${nf(N)} : ${b} × ${a} = ${nf(kids)}.`,
        `Zonder abonnement is 100% − ${pc}% = ${100 - pc}% van de kinderen.`,
        `${100 - pc}% van ${nf(kids)} is <b>${nf(ans)}</b> kinderen.`,
      ) + tip('Er wordt gevraagd naar de kinderen zonder abonnement.'),
  };
});

def('BN13', 'B', 'N', 'B.3', 'Kommagetallen in een verhaal', (L, r) => {
  if (L === 1) {
    const sz = r.pick([0.75, 0.5, 0.25, 1.5, 0.2, 0.4]),
      n = r.int(12, 90),
      vat = rnd(sz * n, 2);
    if (!whole(vat)) throw RETRY;
    return {
      type: 'num',
      unit: 'flessen',
      q:
        p(`Een sapfabriek vult flessen van ${nf(sz)} liter uit een vat van ${nf(vat)} liter.`) +
        ask('Hoeveel flessen kunnen er uit het vat gevuld worden?'),
      ans: n,
      expl: steps(
        `Deel de inhoud van het vat door de inhoud van één fles: ${nf(vat)} : ${nf(sz)}.`,
        `Vermenigvuldig beide getallen met 100: ${nf(vat * 100)} : ${f6(sz * 100)} = <b>${n}</b> flessen.`,
      ),
    };
  }
  if (L === 2) {
    const lit = r.int(251, 549) / 10,
      pr = r.pick([1799, 1849, 1899, 1959, 2019, 2089]) / 1000,
      cost = lit * pr;
    if (tie(cost, 2)) throw RETRY;
    const ans = rnd(cost, 2);
    return {
      type: 'num',
      pre: '€',
      dec: 2,
      calc: true,
      q:
        p(`${nm(r)} tankt ${nf(lit)} liter benzine. De prijs is €${NB}${nf(pr, 3)} per liter.`) +
        ask('Hoeveel moet er betaald worden? Rond af op hele centen.'),
      ans,
      expl: steps(`${nf(lit)} × ${nf(pr, 3)} = ${f6(cost)}.`, `Afgerond op hele centen: <b>${eur(ans)}</b>.`),
    };
  }
  const Lp = r.pick([2.4, 3, 3.6, 4.2]),
    piece = r.pick([0.85, 0.7, 1.1, 0.65, 0.95, 1.25]),
    ratio = rnd(Lp / piece, 6),
    per = Math.floor(ratio),
    n = r.int(7, 25);
  if (per < 2) throw RETRY;
  const ans = Math.ceil(n / per),
    naive = Math.ceil(rnd((n * piece) / Lp, 6));
  if (naive === ans) throw RETRY;
  return {
    type: 'num',
    unit: 'planken',
    calc: true,
    q:
      p(
        `Een timmerman heeft ${n} latten van ${nf(piece, 2)} meter nodig. De bouwmarkt verkoopt alleen planken van ${nf(Lp, 2)} meter. Uit één plank kun je meerdere latten zagen, maar reststukken kun je niet aan elkaar maken.`,
      ) + ask('Hoeveel planken moet de timmerman minstens kopen?'),
    ans,
    expl:
      steps(
        whole(ratio)
          ? `Uit één plank: ${nf(Lp, 2)} : ${nf(piece, 2)} = ${per} latten.`
          : `Uit één plank: ${nf(Lp, 2)} : ${nf(piece, 2)} is ongeveer ${nf(ratio, 2)}. Er passen dus ${per} hele latten uit een plank.`,
        n % per === 0
          ? `${n} : ${per} = <b>${ans}</b> planken.`
          : `${n} : ${per} = ${Math.floor(n / per)} rest ${n % per}. Voor de laatste ${n % per === 1 ? 'lat' : (n % per) + ' latten'} is nog een plank nodig: <b>${ans}</b> planken.`,
      ) +
      tip(
        `Alle lengtes optellen en delen door ${nf(Lp, 2)} geeft ${naive} planken. Dat is te weinig, omdat je reststukken niet kunt gebruiken.`,
      ),
  };
});

def('BN14', 'B', 'N', 'B.7', 'Rente', (L, r) => {
  const S = 100 * r.int(5, 80),
    rt = r.pick([1, 1.5, 2, 2.5, 3, 3.5, 4]),
    name = nm(r),
    i1 = rnd((S * rt) / 100, 2);
  const intro = `${name} zet ${eur(S)} op een spaarrekening. De bank geeft ${nf(rt)}% rente per jaar.`;
  if (L === 1)
    return {
      type: 'num',
      pre: '€',
      dec: m2(i1),
      q: p(intro) + ask(`Hoeveel euro rente krijgt ${name} na één jaar?`),
      ans: i1,
      expl: steps(`1% van ${eur(S)} is ${eur(S / 100)}.`, `${nf(rt)}% is ${nf(rt)} × ${eur(S / 100)} = <b>${eur(i1)}</b>.`),
    };
  if (L === 2)
    return {
      type: 'num',
      pre: '€',
      dec: m2(S + i1),
      calc: true,
      q: p(intro) + ask('Hoeveel euro staat er na één jaar op de rekening?'),
      ans: S + i1,
      expl:
        steps(`Rente: ${nf(rt)}% van ${eur(S)} is ${eur(i1)}.`, `${eur(S)} + ${eur(i1)} = <b>${eur(S + i1)}</b>.`) +
        tip('Er wordt gevraagd naar het hele bedrag, niet alleen naar de rente.'),
    };
  const s1 = S + i1,
    i2 = (s1 * rt) / 100,
    s2 = s1 + i2;
  if (tie(s2, 2)) throw RETRY;
  const ans = rnd(s2, 2);
  return {
    type: 'num',
    pre: '€',
    dec: 2,
    calc: true,
    q:
      p(`${intro} De rente wordt elk jaar bij het spaargeld opgeteld en levert daarna zelf ook rente op.`) +
      ask('Hoeveel euro staat er na twee jaar op de rekening? Rond af op hele centen.'),
    ans,
    expl:
      steps(
        `Na één jaar: ${eur(S)} + ${eur(i1)} = ${eur(s1)}.`,
        `In het tweede jaar is de rente ${nf(rt)}% van ${eur(s1)}: ${f6(i2)} euro.`,
        `Na twee jaar: ${f6(s2)} euro, afgerond <b>${eur(ans)}</b>.`,
      ) + tip('In het tweede jaar krijg je ook rente over de rente van het eerste jaar.'),
  };
});

def('BN15', 'B', 'N', 'B.8', 'Een deel als percentage', (L, r) => {
  if (L === 1) {
    const [b, a] = r.pick([
        [24, 18],
        [20, 13],
        [25, 8],
        [40, 26],
        [50, 17],
        [30, 12],
        [24, 6],
        [40, 15],
        [20, 7],
        [25, 19],
        [50, 36],
        [30, 27],
      ]),
      ans = rnd((a / b) * 100, 2),
      name = nm(r);
    const [t, qq] = r.pick([
      [`In een klas van ${b} leerlingen hebben ${a} leerlingen een zwemdiploma.`, 'Hoeveel procent van de klas heeft een zwemdiploma?'],
      [`Een toets heeft ${b} vragen. ${name} heeft er ${a} goed.`, 'Hoeveel procent van de vragen heeft ' + name + ' goed?'],
    ]);
    return {
      type: 'num',
      unit: '%',
      q: p(t) + ask(qq),
      ans,
      expl: steps(`Deel het deel door het geheel: ${a} : ${b} = ${nf(a / b)}.`, `Vermenigvuldig met 100: <b>${nf(ans)}</b>%.`),
    };
  }
  if (L === 2) {
    const N = r.pick([250, 400, 500, 800, 1250]),
      pc = 2 * r.int(6, 44),
      k = (N * pc) / 100;
    return {
      type: 'num',
      unit: '%',
      calc: true,
      q:
        p(
          `Voor een onderzoek zijn ${nf(N)} mensen ondervraagd. Op de vraag of zij elke dag ontbijten, antwoordden ${nf(k)} mensen ‘ja’. De anderen antwoordden ‘nee’.`,
        ) + ask('Hoeveel procent van de ondervraagden antwoordde ‘ja’?'),
      ans: pc,
      expl: steps(`Deel het deel door het geheel: ${nf(k)} : ${nf(N)} = ${nf(k / N)}.`, `Vermenigvuldig met 100: <b>${pc}</b>%.`),
    };
  }
  if (r.chance(0.5)) {
    const total = r.pick([20, 25]),
      j = r.int(8, total - 9),
      m = total - j,
      fj = r.int(3, j - 1),
      fm = r.int(3, m - 1),
      pc = ((fj + fm) / total) * 100;
    return {
      type: 'num',
      unit: '%',
      calc: true,
      q:
        p(`In groep 7 zitten ${j} jongens en ${m} meisjes. Van de jongens komen er ${fj} met de fiets naar school, van de meisjes ${fm}.`) +
        ask('Hoeveel procent van de leerlingen van groep 7 komt met de fiets?'),
      ans: pc,
      expl: steps(
        `In de groep zitten ${j} + ${m} = ${total} leerlingen.`,
        `Met de fiets komen ${fj} + ${fm} = ${fj + fm} leerlingen.`,
        `${fj + fm} : ${total} × 100 = <b>${nf(pc)}</b>%.`,
      ),
    };
  }
  const N = r.pick([75, 120, 150, 180, 45, 36, 56, 64]),
    k = r.int(Math.ceil(N * 0.15), Math.floor(N * 0.85)),
    val = (k / N) * 100;
  if (tie(val, 1) || Math.abs(val - rnd(val, 1)) < 1e-9) throw RETRY;
  const ans = rnd(val, 1);
  return {
    type: 'num',
    unit: '%',
    dec: 1,
    calc: true,
    q:
      p(`Van de ${N} leden van een zwemclub komen er ${k} elke week trainen.`) +
      ask('Hoeveel procent van de leden is dat? Rond af op één decimaal.'),
    ans,
    expl: steps(`${k} : ${N} × 100 = ${nf(val, 3)}…`, `Afgerond op één decimaal: <b>${nf(ans, 1)}</b>%.`),
  };
});

// munt, korte naam, mogelijke koersen
const CUR: [string, string, number[]][] = [
  ['Amerikaanse dollars', 'dollar', [1.05, 1.08, 1.1, 1.12, 1.2]],
  ['Britse ponden', 'pond', [0.8, 0.85, 0.9, 0.75]],
  ['Zwitserse franken', 'frank', [0.95, 0.9, 0.96]],
  ['Poolse zloty', 'zloty', [4.3, 4.25, 4.5]],
  ['Deense kronen', 'kronen', [7.45, 7.5, 7.4]],
];
def('BN16', 'B', 'N', 'B.5', 'Wisselkoers', (L, r) => {
  const [full, sh, ks] = r.pick(CUR),
    k = r.pick(ks),
    name = nm(r),
    koers = `De wisselkoers is: 1 euro = ${nf(k, 2)} ${sh}.`;
  if (L === 1) {
    const E = 50 * r.int(1, 16),
      ans = rnd(E * k, 2);
    return {
      type: 'num',
      unit: sh,
      dec: m2(ans),
      q: p(`${name} gaat op vakantie en wisselt ${eur(E)} om in ${full}. ${koers}`) + ask(`Hoeveel ${sh} krijgt ${name}?`),
      ans,
      expl: steps(`Voor elke euro krijg je ${nf(k, 2)} ${sh}.`, `${E} × ${nf(k, 2)} = <b>${nf(ans)}</b> ${sh}.`),
    };
  }
  if (L === 2) {
    const E = 20 * r.int(1, 20),
      V = rnd(E * k, 2);
    return {
      type: 'num',
      pre: '€',
      calc: true,
      q: p(`${name} koopt in het buitenland een jas van ${nf(V, whole(V) ? 0 : 2)} ${sh}. ${koers}`) + ask('Hoeveel euro kost de jas?'),
      ans: E,
      expl:
        steps(
          `Je weet het bedrag in ${sh} en wilt terug naar euro. Dan deel je door de koers.`,
          `${nf(V, whole(V) ? 0 : 2)} : ${nf(k, 2)} = <b>${eur(E)}</b>.`,
        ) + tip('Vermenigvuldigen met de koers geeft het bedrag in de andere munt, niet in euro.'),
    };
  }
  const E = 50 * r.int(2, 16),
    c = r.pick([2.5, 3.5, 4.5, 5]),
    val = (E - c) * k;
  if (tie(val, 2)) throw RETRY;
  const ans = rnd(val, 2);
  return {
    type: 'num',
    unit: sh,
    dec: 2,
    calc: true,
    q:
      p(`${name} wisselt ${eur(E)} om in ${full}. ${koers} Het wisselkantoor houdt eerst ${eur(c)} kosten in op het bedrag in euro.`) +
      ask(`Hoeveel ${sh} krijgt ${name}? Rond af op twee decimalen.`),
    ans,
    expl:
      steps(
        `Na aftrek van de kosten blijft er ${eur(E)} − ${eur(c)} = ${eur(E - c)} over.`,
        `${f6(E - c)} × ${nf(k, 2)} = ${f6(val)}.`,
        `Afgerond op twee decimalen: <b>${nf(ans, 2)}</b> ${sh}.`,
      ) + tip('De kosten gaan er eerst af. Daarna pas reken je om.'),
  };
});

// enkelvoud, meervoud, prijs in centen
const SHOP: [string, string, number][] = [
  ['brood', 'broden', 239],
  ['pak melk', 'pakken melk', 119],
  ['stuk kaas', 'stukken kaas', 485],
  ['pot pindakaas', 'potten pindakaas', 295],
  ['doos eieren', 'dozen eieren', 320],
  ['pak koffie', 'pakken koffie', 549],
  ['pak pasta', 'pakken pasta', 89],
  ['zak rijst', 'zakken rijst', 199],
  ['bak yoghurt', 'bakken yoghurt', 165],
  ['fles sap', 'flessen sap', 215],
];
// product, prijs per kg in centen
const KG: [string, number][] = [
  ['appels', 250],
  ['bananen', 180],
  ['tomaten', 320],
  ['druiven', 450],
  ['uien', 120],
];
def('BN17', 'B', 'N', 'B.3', 'Boodschappen afrekenen', (L, r) => {
  const name = nm(r),
    [A, B] = r.sample(SHOP, 2),
    n1 = r.int(2, 4),
    n2 = r.int(2, 3),
    [kg, pkg] = r.pick(KG),
    w = r.pick([0.8, 1.2, 1.5, 2.5, 0.6, 1.4]),
    wc = Math.round(w * pkg);
  const cnt = (n: number, it: [string, string, number]) => `${n} ${it[1]} van ${C(it[2])} per stuk`,
    bill = (t: number) => (t < 1000 ? 1000 : t < 2000 ? 2000 : 5000);
  if (L === 1) {
    const tot = n1 * A[2] + n2 * B[2];
    return {
      type: 'num',
      pre: '€',
      dec: 2,
      q: p(`${name} koopt ${cnt(n1, A)} en ${cnt(n2, B)}.`) + ask(`Hoeveel moet ${name} betalen?`),
      ans: tot / 100,
      expl: steps(`${n1} × ${C(A[2])} = ${C(n1 * A[2])}.`, `${n2} × ${C(B[2])} = ${C(n2 * B[2])}.`, `Samen: <b>${C(tot)}</b>.`),
    };
  }
  if (L === 2) {
    const tot = n1 * A[2] + wc,
      pay = bill(tot);
    return {
      type: 'num',
      pre: '€',
      dec: 2,
      calc: true,
      q:
        p(
          `${name} koopt ${cnt(n1, A)} en ${nf(w)} kilogram ${kg} van ${C(pkg)} per kilogram. ${name} betaalt met een briefje van ${C(pay)}.`,
        ) + ask(`Hoeveel wisselgeld krijgt ${name} terug?`),
      ans: (pay - tot) / 100,
      expl: steps(
        `${n1} × ${C(A[2])} = ${C(n1 * A[2])}.`,
        `${nf(w)} × ${C(pkg)} = ${C(wc)}.`,
        `Samen: ${C(tot)}.`,
        `Wisselgeld: ${C(pay)} − ${C(tot)} = <b>${C(pay - tot)}</b>.`,
      ),
    };
  }
  const tot = 2 * A[2] + n2 * B[2] + wc,
    pay = bill(tot);
  return {
    type: 'num',
    pre: '€',
    dec: 2,
    calc: true,
    q:
      p(
        `${name} koopt 3 ${A[1]} van ${C(A[2])} per stuk. Voor dit product geldt deze week: ‘3 halen, 2 betalen’. Daarnaast koopt ${name} ${cnt(n2, B)} en ${nf(w)} kilogram ${kg} van ${C(pkg)} per kilogram. ${name} betaalt met een briefje van ${C(pay)}.`,
      ) + ask(`Hoeveel wisselgeld krijgt ${name} terug?`),
    ans: (pay - tot) / 100,
    expl:
      steps(
        `Door de aanbieding betaal je 2 van de 3 ${A[1]}: 2 × ${C(A[2])} = ${C(2 * A[2])}.`,
        `${n2} × ${C(B[2])} = ${C(n2 * B[2])} en ${nf(w)} × ${C(pkg)} = ${C(wc)}.`,
        `Samen: ${C(tot)}.`,
        `Wisselgeld: ${C(pay)} − ${C(tot)} = <b>${C(pay - tot)}</b>.`,
      ) + tip('Er wordt naar het wisselgeld gevraagd, niet naar het totaalbedrag.'),
  };
});
