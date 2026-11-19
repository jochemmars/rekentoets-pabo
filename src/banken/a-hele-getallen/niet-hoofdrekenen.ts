/* Domein A · Hele getallen · niet-hoofdrekenen */
import { nf, eur, en, klok, NB } from '../../core/notatie';
import { rnd } from '../../core/rekenen';
import { def, RETRY, steps, tip, p, ask, mcNum, mcTxt, nm } from '../../core/opbouw';
import { roundEx } from './gedeeld';

const DEST = [
  'het Openluchtmuseum',
  'een pretpark',
  'de dierentuin',
  'een klimbos',
  'het Spoorwegmuseum',
  'een kinderboerderij',
  'het strand',
];
def('AN01', 'A', 'N', 'A.4', 'Schoolreis met bussen', (L, r) => {
  const c = r.pick([48, 50, 52, 54, 56]);
  let n, b;
  do {
    n = r.int(L === 1 ? 60 : 95, L === 1 ? 150 : 260);
    b = r.int(L === 1 ? 4 : 8, L === 1 ? 10 : 22);
  } while ((n + b) % c === 0 || n + b < c + 5 || (Math.ceil(n / c) === Math.ceil((n + b) / c) && L > 1));
  const k = Math.ceil((n + b) / c),
    price = r.pick([395, 420, 445, 475, 495, 520, 560]),
    ent = r.pick([6, 7, 8, 9, 11, 12]),
    dest = r.pick(DEST);
  const cnt = `Samen gaan er ${n} + ${b} = ${n + b} personen mee.`,
    bus = `${n + b} : ${c} = ${Math.floor((n + b) / c)} rest ${(n + b) % c}. Er zijn dus ${k} bussen nodig.`;
  if (L === 1)
    return {
      type: 'num',
      unit: 'bussen',
      q:
        p(
          `Een basisschool gaat op schoolreis naar ${dest}. Er gaan ${n} leerlingen en ${b} begeleiders mee. In één bus passen ${c} personen.`,
        ) + ask('Hoeveel bussen zijn er minstens nodig?'),
      ans: k,
      expl:
        steps(cnt, bus.replace('Er zijn dus', 'Er zijn dus minstens').replace(`${k} bussen nodig`, `<b>${k}</b> bussen nodig`)) +
        tip('De begeleiders hebben ook een zitplaats nodig.'),
    };
  if (L === 2)
    return {
      type: 'num',
      pre: '€',
      q:
        p(
          `Een basisschool gaat op schoolreis naar ${dest}. Er gaan ${n} leerlingen en ${b} begeleiders mee. De entree is ${eur(ent)} per leerling. De school huurt bussen met ${c} zitplaatsen. Een bus kost ${eur(price)} per dag.`,
        ) + ask('Hoeveel betaalt de school in totaal voor de bussen?'),
      ans: k * price,
      expl:
        steps(cnt, bus, `${k} × ${eur(price)} = <b>${eur(k * price)}</b>.`) +
        tip('De entreeprijs heb je voor deze vraag niet nodig. De begeleiders tellen wel mee voor het aantal bussen.'),
    };
  return {
    type: 'num',
    pre: '€',
    calc: true,
    q:
      p(
        `Een basisschool gaat op schoolreis naar ${dest}. Er gaan ${n} leerlingen en ${b} begeleiders mee. De entree is ${eur(ent)} per leerling; begeleiders mogen gratis naar binnen. Iedereen reist met de bus. De school huurt bussen met ${c} zitplaatsen voor ${eur(price)} per bus.`,
      ) + ask('Wat kost de schoolreis in totaal?'),
    ans: k * price + n * ent,
    expl:
      steps(
        cnt,
        bus,
        `Bussen: ${k} × ${eur(price)} = ${eur(k * price)}.`,
        `Entree: ${n} × ${eur(ent)} = ${eur(n * ent)}.`,
        `Samen: <b>${eur(k * price + n * ent)}</b>.`,
      ) + tip('Begeleiders betalen geen entree, maar zitten wel in de bus.'),
  };
});

const ITEMS: [string, number[]][] = [
  ['tablets', [189, 219, 249, 279]],
  ['koptelefoons', [18, 24, 29, 35]],
  ['rekenmachines', [12, 14, 16, 19]],
  ['woordenboeken', [23, 27, 32]],
  ['leerlingstoelen', [48, 54, 62]],
  ['leerlingtafels', [85, 96, 115]],
  ['voetballen', [14, 17, 22]],
  ['atlassen', [26, 31, 38]],
];
def('AN02', 'A', 'N', 'A.4', 'Bestelling en budget', (L, r) => {
  const [i1, i2] = r.sample(ITEMS, 2),
    n1 = r.int(12, 32),
    p1 = r.pick(i1[1]),
    n2 = r.int(8, 30),
    p2 = r.pick(i2[1]),
    ship = r.pick([25, 35, 45]);
  if (L === 1) {
    const tot = n1 * p1,
      B = Math.ceil((tot + r.int(40, 400)) / 50) * 50;
    return {
      type: 'num',
      pre: '€',
      q:
        p(`Een school heeft een budget van ${eur(B)} voor nieuwe ${i1[0]}. De school bestelt ${n1} ${i1[0]} van ${eur(p1)} per stuk.`) +
        ask('Hoeveel euro blijft er over van het budget?'),
      ans: B - tot,
      expl: steps(`${n1} × ${eur(p1)} = ${eur(tot)}.`, `${eur(B)} − ${eur(tot)} = <b>${eur(B - tot)}</b>.`),
    };
  }
  if (L === 2) {
    const tot = n1 * p1 + n2 * p2,
      B = Math.ceil((tot + r.int(40, 400)) / 50) * 50;
    return {
      type: 'num',
      pre: '€',
      q:
        p(
          `Een school heeft dit jaar ${eur(B)} te besteden aan lesmateriaal. De school bestelt ${n1} ${i1[0]} van ${eur(p1)} per stuk en ${n2} ${i2[0]} van ${eur(p2)} per stuk.`,
        ) + ask('Hoeveel euro blijft er over?'),
      ans: B - tot,
      expl: steps(
        `${n1} × ${eur(p1)} = ${eur(n1 * p1)}.`,
        `${n2} × ${eur(p2)} = ${eur(n2 * p2)}.`,
        `Samen: ${eur(tot)}.`,
        `${eur(B)} − ${eur(tot)} = <b>${eur(B - tot)}</b>.`,
      ),
    };
  }
  const tot = n1 * p1 + n2 * p2 + ship,
    B = Math.floor((tot - r.int(60, 500)) / 50) * 50;
  return {
    type: 'num',
    pre: '€',
    calc: true,
    q:
      p(
        `Een school heeft nog ${eur(B)} over voor lesmateriaal. De directeur wil ${n1} ${i1[0]} van ${eur(p1)} per stuk en ${n2} ${i2[0]} van ${eur(p2)} per stuk bestellen. Voor de hele bestelling komt er één keer ${eur(ship)} verzendkosten bij.`,
      ) + ask('Hoeveel euro komt de school tekort?'),
    ans: tot - B,
    expl:
      steps(
        `${n1} × ${eur(p1)} = ${eur(n1 * p1)} en ${n2} × ${eur(p2)} = ${eur(n2 * p2)}.`,
        `Met verzendkosten: ${eur(n1 * p1)} + ${eur(n2 * p2)} + ${eur(ship)} = ${eur(tot)}.`,
        `Tekort: ${eur(tot)} − ${eur(B)} = <b>${eur(tot - B)}</b>.`,
      ) + tip('De verzendkosten tel je één keer mee, niet per stuk.'),
  };
});

def('AN03', 'A', 'N', 'A.5', 'Gemiddelde in een verhaal', (L, r) => {
  const name = nm(r);
  if (L === 1) {
    const m = r.int(11, 22),
      v = [];
    let s = 0;
    for (let i = 0; i < 4; i++) {
      const x = m + r.int(-7, 7);
      v.push(x);
      s += x;
    }
    const last = 5 * m - s;
    if (last < 4 || Math.abs(last - m) > 9) throw RETRY;
    v.push(last);
    return {
      type: 'num',
      unit: 'km',
      q:
        p(`${name} fietst vijf dagen naar school en houdt bij hoeveel kilometer dat per dag is: ${en(v)} km.`) +
        ask('Hoeveel kilometer fietst ' + name + ' gemiddeld per dag?'),
      ans: m,
      expl: steps(`Tel alles op: ${v.join(' + ')} = ${5 * m}.`, `Deel door 5 dagen: ${5 * m} : 5 = <b>${m}</b> km.`),
    };
  }
  if (L === 2) {
    const k = r.pick([3, 4, 5]),
      m = r.int(60, 80),
      m2 = m + r.pick([-4, -3, -2, 2, 3, 4, 5]),
      x = (k + 1) * m2 - k * m;
    if (x < 30 || x > 100) throw RETRY;
    return {
      type: 'num',
      unit: 'punten',
      q:
        p(
          `${name} heeft ${k} toetsen gemaakt. Gemiddeld haalde ${name} ${m} punten per toets. Voor de volgende toets haalt ${name} ${x} punten.`,
        ) + ask(`Wat is het gemiddelde van ${name} na ${k + 1} toetsen?`),
      ans: m2,
      expl:
        steps(
          `Na ${k} toetsen is het totaal ${k} × ${m} = ${k * m} punten.`,
          `Met de nieuwe toets: ${k * m} + ${x} = ${k * m + x} punten.`,
          `${k * m + x} : ${k + 1} = <b>${m2}</b> punten.`,
        ) + tip(`Je mag ${m} en ${x} niet zomaar middelen: de eerste ${k} toetsen tellen ${k} keer mee.`),
    };
  }
  if (r.chance(0.5)) {
    const M = r.int(65, 75),
      v = [];
    let s = 0;
    for (let i = 0; i < 4; i++) {
      const x = M + r.int(-14, 12);
      v.push(x);
      s += x;
    }
    const need = 5 * M - s;
    if (need < 40 || need > 98 || need === M) throw RETRY;
    return {
      type: 'num',
      unit: 'punten',
      q:
        p(
          `Voor een vak moet ${name} over vijf toetsen gemiddeld minstens ${M} punten halen. De eerste vier toetsen leverden ${en(v)} punten op.`,
        ) + ask('Hoeveel punten moet ' + name + ' minstens halen voor de vijfde toets?'),
      ans: need,
      expl: steps(
        `Voor gemiddeld ${M} zijn in totaal 5 × ${M} = ${5 * M} punten nodig.`,
        `Er zijn al ${v.join(' + ')} = ${s} punten.`,
        `Nog nodig: ${5 * M} − ${s} = <b>${need}</b> punten.`,
      ),
    };
  }
  const m = r.int(-3, 2),
    v = [];
  let s = 0;
  for (let i = 0; i < 6; i++) {
    const x = m + r.int(-4, 4);
    v.push(x);
    s += x;
  }
  const last = 7 * m - s;
  if (Math.abs(last - m) > 5) throw RETRY;
  v.push(last);
  if (v.filter((x) => x < 0).length < 2) throw RETRY;
  return {
    type: 'num',
    unit: '°C',
    q:
      p(`In een week in januari is elke ochtend om 7 uur de temperatuur gemeten: ${en(v.map((x) => nf(x)))} °C.`) +
      ask('Wat was de gemiddelde temperatuur?'),
    ans: m,
    expl: steps(
      `Tel de temperaturen op: ${v.map((x) => (x < 0 ? '(' + nf(x) + ')' : x)).join(' + ')} = ${nf(7 * m)}.`,
      `Deel door 7 dagen: ${nf(7 * m)} : 7 = <b>${nf(m)}</b> °C.`,
    ),
  };
});

def('AN04', 'A', 'N', 'A.4', 'Onder nul: saldo en temperatuur', (L, r) => {
  const name = nm(r);
  if (L < 3 && r.chance(0.3)) {
    const cities = r.sample(['Oslo', 'Rome', 'Helsinki', 'Madrid', 'Stockholm', 'Athene', 'Moskou', 'Lissabon'], 2),
      lo = -r.int(3, 18),
      hi = r.int(2, 16);
    if (L === 1)
      return {
        type: 'num',
        unit: 'graden',
        q:
          p(`Op een dag in februari is het in ${cities[0]} ${nf(lo)}${NB}°C en in ${cities[1]} ${hi}${NB}°C.`) +
          ask('Hoeveel graden is het verschil?'),
        ans: hi - lo,
        expl: steps(
          `Van ${nf(lo)} tot 0 is ${-lo} graden.`,
          `Van 0 tot ${hi} is ${hi} graden.`,
          `Samen: ${-lo} + ${hi} = <b>${hi - lo}</b> graden.`,
        ),
      };
    const d1 = r.int(6, 20),
      d2 = r.int(3, 9);
    return {
      type: 'num',
      unit: '°C',
      q:
        p(
          `In ${cities[0]} is het 's nachts ${nf(lo)}${NB}°C. Overdag is het ${d1} graden warmer dan 's nachts. De nacht daarna is het ${d2} graden kouder dan de eerste nacht.`,
        ) + ask('Hoe koud is het in de tweede nacht?'),
      ans: lo - d2,
      expl:
        steps(`De tweede nacht is ${d2} graden kouder dan de eerste nacht.`, `${nf(lo)} − ${d2} = <b>${nf(lo - d2)}</b> °C.`) +
        tip(`De temperatuur overdag (${nf(lo + d1)} °C) heb je niet nodig: de vergelijking is met de eerste nacht.`),
    };
  }
  if (L === 1) {
    const S = r.int(60, 420),
      A = S + r.int(35, 380);
    return {
      type: 'num',
      pre: '€',
      q:
        p(`Op de bankrekening van ${name} staat ${eur(S)}. Er wordt ${eur(A)} afgeschreven voor de huur.`) +
        ask('Wat is het saldo daarna?'),
      ans: S - A,
      expl:
        steps(`${S} − ${A} komt onder nul uit.`, `${A} − ${S} = ${A - S}, dus het saldo is <b>${nf(S - A)}</b> euro.`) +
        tip('Een saldo onder nul vul je in met een minteken.'),
    };
  }
  if (L === 2) {
    const S = r.int(120, 620),
      sal = r.int(165, 240) * 10,
      rent = r.int(62, 98) * 10 + 5,
      shop = r.int(85, 260),
      lim = r.pick([500, 1000, 1500]);
    const ans = -S + sal - rent - shop;
    return {
      type: 'num',
      pre: '€',
      q:
        p(
          `${name} staat ${eur(S)} rood: het saldo is ${eur(-S)}. De bank staat toe dat ${name} maximaal ${eur(lim)} rood staat. Deze week wordt het salaris van ${eur(sal)} bijgeschreven. Daarna gaan de huur van ${eur(rent)} en ${eur(shop)} aan boodschappen eraf.`,
        ) + ask('Wat is het saldo aan het eind van de week?'),
      ans,
      expl:
        steps(
          `${eur(-S)} + ${eur(sal)} = ${eur(sal - S)}.`,
          `${eur(sal - S)} − ${eur(rent)} = ${eur(sal - S - rent)}.`,
          `${eur(sal - S - rent)} − ${eur(shop)} = <b>${eur(ans)}</b>.`,
        ) + tip('Het bedrag dat je maximaal rood mag staan, heb je niet nodig.'),
    };
  }
  const S = r.int(90, 480),
    E = r.int(120, 640),
    bij = r.int(160, 260) * 10,
    af = -S + bij - E;
  return {
    type: 'num',
    pre: '€',
    q:
      p(
        `Op 1 maart is het saldo van ${name} ${eur(-S)}. Op 31 maart is het saldo ${eur(E)}. In maart is er in totaal ${eur(bij)} bijgeschreven.`,
      ) + ask('Hoeveel euro is er in maart in totaal afgeschreven?'),
    ans: af,
    expl: steps(
      `Begin plus bijschrijvingen: ${eur(-S)} + ${eur(bij)} = ${eur(bij - S)}.`,
      `Aan het eind staat er ${eur(E)}.`,
      `Er is dus ${eur(bij - S)} − ${eur(E)} = <b>${eur(af)}</b> afgeschreven.`,
    ),
  };
});

def('AN05', 'A', 'N', 'A.1', 'Rekenen met miljoenen en miljarden', (L, r) => {
  if (L === 1) {
    const x = r.int(11, 39),
      z = 5000 * r.int(4, 19),
      n = x * 100000 + z;
    return {
      type: 'num',
      q:
        p(`Een stad heeft ${nf(x / 10)} miljoen inwoners. In tien jaar komen er ${nf(z)} inwoners bij.`) +
        ask('Hoeveel inwoners heeft de stad dan? Schrijf het getal voluit.'),
      ans: n,
      expl:
        steps(`${nf(x / 10)} miljoen = ${nf(x * 100000)}.`, `${nf(x * 100000)} + ${nf(z)} = <b>${nf(n)}</b>.`) +
        tip('Je typt het getal zonder punten.'),
    };
  }
  if (L === 2) {
    const P = r.pick([1500, 2000, 2500, 3000, 4000]),
      I = r.pick([200000, 400000, 500000, 800000]),
      G = (P * I) / 1e9,
      old = r.pick([20, 35, 40, 60, 80]);
    return {
      type: 'num',
      pre: '€',
      q:
        p(
          `Een gemeente met ${nf(I)} inwoners geeft dit jaar €${NB}${nf(G)} miljard uit. Dat is €${NB}${old} miljoen meer dan vorig jaar.`,
        ) + ask('Hoeveel euro geeft de gemeente dit jaar gemiddeld uit per inwoner?'),
      ans: P,
      expl:
        steps(
          `${nf(G)} miljard = ${nf(P * I)}.`,
          `${nf(P * I)} : ${nf(I)} = <b>${nf(P)}</b> euro per inwoner.`,
          'Handig: streep bij beide getallen evenveel nullen weg.',
        ) + tip('Het verschil met vorig jaar heb je niet nodig.'),
    };
  }
  const v = r.pick([0.5, 1.5, 2.5, 3.5, 4.5, 0.25, 1.25, 0.75]),
    k = r.int(3, 9),
    ans = rnd(v * k * 12, 2);
  return {
    type: 'num',
    unit: 'miljoen',
    q:
      p(`Een nieuwssite heeft ${nf(v)} miljoen bezoekers per maand. Elke bezoeker bekijkt gemiddeld ${k} pagina's per maand.`) +
      ask(`Hoeveel miljoen pagina's worden er in een heel jaar bekeken?`),
    ans,
    expl: steps(
      `Per maand: ${nf(v)} miljoen × ${k} = ${nf(v * k)} miljoen pagina's.`,
      `Per jaar: ${nf(v * k)} miljoen × 12 = <b>${nf(ans)}</b> miljoen pagina's.`,
    ),
  };
});

const PROD: [string, string, string, string, number, string][] = [
  ['machine', 'vult', 'flessen', 'kratten', 24, 'krat'],
  ['oven', 'bakt', 'broodjes', 'dozen', 30, 'doos'],
  ['drukpers', 'drukt', 'folders', 'pakken', 50, 'pak'],
  ['inpakrobot', 'verpakt', 'repen chocolade', 'dozen', 36, 'doos'],
];
def('AN06', 'A', 'N', 'A.4', 'Productie per minuut en per uur', (L, r) => {
  const [m, verb, it, boxes, c] = r.pick(PROD);
  if (L === 1) {
    const R = r.pick([120, 150, 180, 240]),
      [tw, t] = r.pick<[string, number]>([
        ['een kwartier', 15],
        ['een half uur', 30],
        ['20 minuten', 20],
        ['drie kwartier', 45],
      ]);
    return {
      type: 'num',
      unit: it,
      q: p(`Een ${m} ${verb} ${R} ${it} per minuut.`) + ask(`Hoeveel ${it} zijn dat in ${tw}?`),
      ans: R * t,
      expl:
        t === 20
          ? steps(`${t} × ${R} = <b>${nf(R * t)}</b> ${it}.`)
          : steps(`${tw.charAt(0).toUpperCase() + tw.slice(1)} is ${t} minuten.`, `${t} × ${R} = <b>${nf(R * t)}</b> ${it}.`),
    };
  }
  if (L === 2) {
    const R = r.pick([120, 150, 180, 240, 300]),
      [hw, hmin] = r.pick<[string, number]>([
        ['één uur', 60],
        ['twee uur', 120],
        ['anderhalf uur', 90],
      ]);
    if ((R * hmin) % c !== 0) throw RETRY;
    return {
      type: 'num',
      unit: boxes,
      calc: true,
      q:
        p(`Een ${m} ${verb} ${R} ${it} per minuut. De ${it} gaan in ${boxes} van ${c} stuks. De ${m} draait ${hw} achter elkaar.`) +
        ask(`Hoeveel volle ${boxes} levert dat op?`),
      ans: (R * hmin) / c,
      expl: steps(
        `${hw.charAt(0).toUpperCase() + hw.slice(1)} is ${hmin} minuten.`,
        `${hmin} × ${R} = ${nf(R * hmin)} ${it}.`,
        `${nf(R * hmin)} : ${c} = <b>${nf((R * hmin) / c)}</b> ${boxes}.`,
      ),
    };
  }
  const Ra = r.pick([150, 180, 210, 240]),
    Rb = r.pick([120, 140, 160]),
    start = 8 * 60 + r.pick([0, 15, 30]),
    dur = r.pick([150, 180, 210, 240]),
    idle = r.pick([20, 30, 45]);
  const ans = Ra * dur + Rb * (dur - idle);
  return {
    type: 'num',
    unit: it,
    calc: true,
    q:
      p(
        `In een fabriek staan twee machines. Machine A ${verb} ${Ra} ${it} per minuut en machine B ${Rb} ${it} per minuut. Beide machines starten om ${klok(start)} uur en stoppen om ${klok(start + dur)} uur. Machine B staat tussendoor ${idle} minuten stil door een storing.`,
      ) + ask(`Hoeveel ${it} leveren de twee machines samen op?`),
    ans,
    expl: steps(
      `Van ${klok(start)} tot ${klok(start + dur)} uur is ${dur} minuten.`,
      `Machine A: ${dur} × ${Ra} = ${nf(Ra * dur)}.`,
      `Machine B draait ${dur} − ${idle} = ${dur - idle} minuten: ${dur - idle} × ${Rb} = ${nf(Rb * (dur - idle))}.`,
      `Samen: <b>${nf(ans)}</b> ${it}.`,
    ),
  };
});

def('AN07', 'A', 'N', 'A.2', 'Welke berekening hoort erbij?', (L, r) => {
  const name = nm(r);
  let t,
    qq = 'Met welke berekening reken je het totale bedrag uit?',
    good,
    bad,
    why;
  if (L === 1) {
    const n = r.int(24, 32),
      k = r.int(2, 5),
      pr = r.int(6, 12);
    t = `Een klas van ${n} leerlingen gaat naar het museum. Op de dag zelf zijn ${k} leerlingen ziek en blijven thuis. De entree is ${eur(pr)} per leerling.`;
    good = `(${n} − ${k}) × ${pr}`;
    bad = [`${n} − ${k} × ${pr}`, `(${n} + ${k}) × ${pr}`, `${n} × ${pr} − ${k}`];
    why = [
      `Eerst het aantal leerlingen dat meegaat: ${n} − ${k}. Daar staan haakjes om, want dit moet je eerst uitrekenen.`,
      'Daarna keer de prijs per leerling.',
      `Zonder haakjes reken je eerst ${k} × ${pr} uit, en dat past niet bij het verhaal.`,
    ];
  } else if (L === 2 && r.chance(0.5)) {
    const a = r.int(2, 4),
      pa = r.int(12, 19),
      k = r.int(2, 5),
      pk = r.int(6, 9);
    if (a === k) throw RETRY; // anders is het verwisselde antwoord ook goed
    t = `Een gezin gaat naar het zwembad: ${a} volwassenen en ${k} kinderen. Een kaartje kost ${eur(pa)} voor een volwassene en ${eur(pk)} voor een kind.`;
    good = `${a} × ${pa} + ${k} × ${pk}`;
    bad = [`(${a} + ${k}) × (${pa} + ${pk})`, `${a} × ${pk} + ${k} × ${pa}`, `(${a} + ${k}) × ${pa}`];
    why = [
      `Volwassenen: ${a} × ${pa}. Kinderen: ${k} × ${pk}.`,
      'De twee bedragen tel je bij elkaar op.',
      'Let goed op welk aantal bij welke prijs hoort.',
    ];
  } else if (L === 2) {
    const a = r.pick([50, 75, 100]),
      c = r.int(3, 5),
      b = r.int(8, 14);
    if (c * b >= a) throw RETRY;
    t = `${name} heeft ${eur(a)} in de portemonnee en koopt ${c} boeken van ${eur(b)} per stuk.`;
    qq = 'Met welke berekening reken je uit hoeveel geld er overblijft?';
    good = `${a} − ${c} × ${b}`;
    bad = [`(${a} − ${c}) × ${b}`, `${a} − ${c} + ${b}`, `${a} : ${c} − ${b}`];
    why = [
      `De boeken kosten samen ${c} × ${b}.`,
      `Dat bedrag gaat van ${a} af.`,
      'Haakjes zijn niet nodig: vermenigvuldigen gaat altijd voor aftrekken.',
    ];
  } else if (r.chance(0.5)) {
    const n = r.int(24, 32),
      k = r.int(2, 5),
      pr = r.int(6, 12),
      bus = r.pick([180, 220, 250, 310]);
    t = `Een klas van ${n} leerlingen gaat met de bus naar het theater. Op de dag zelf zijn ${k} leerlingen ziek. De school betaalt ${eur(pr)} per leerling die meegaat en ${eur(bus)} voor de bus.`;
    good = `(${n} − ${k}) × ${pr} + ${bus}`;
    bad = [`${n} − ${k} × ${pr} + ${bus}`, `(${n} − ${k}) × (${pr} + ${bus})`, `${n} × ${pr} − ${k} + ${bus}`];
    why = [`Aantal leerlingen dat meegaat: (${n} − ${k}).`, `Kaartjes: dat aantal keer ${pr}.`, `De bus komt er één keer bij: + ${bus}.`];
  } else {
    const n = r.int(8, 24),
      pr = r.int(14, 28),
      k = r.int(2, 5);
    if (n === pr) throw RETRY; // anders is (n − k) × prijs toevallig ook goed
    t = `Een kaartje voor de dierentuin kost ${eur(pr)}. Met een kortingspas krijg je ${eur(k)} korting per kaartje. Een groep van ${n} mensen koopt voor iedereen een kaartje met de kortingspas.`;
    good = `${n} × (${pr} − ${k})`;
    bad = [`${n} × ${pr} − ${k}`, `(${n} − ${k}) × ${pr}`, `${n} × ${pr} × ${k}`];
    why = [
      `Eén kaartje met korting kost ${pr} − ${k}.`,
      `Dat geldt voor alle ${n} mensen, dus de korting staat tussen haakjes bij de prijs.`,
      `Bij ${n} × ${pr} − ${k} krijgt de hele groep maar één keer korting.`,
    ];
  }
  return Object.assign(mcTxt(r, good, bad), {
    q: p(t) + ask(qq),
    expl: steps(why[0], why[1], why[2], `De goede berekening is <b>${good}</b>.`),
  });
});

def('AN08', 'A', 'N', 'A.3', 'Schatten in een verhaal', (L, r) => {
  const near = (base: number, pct: number) => {
    const d = Math.max(1, Math.round(base * pct));
    return base + r.pick([-1, 1]) * r.int(1, d);
  };
  let t, est, exact, calcTxt;
  if (L === 1) {
    const A = 10 * r.int(2, 6),
      B = 10 * r.int(3, 6),
      a = near(A, 0.06),
      b = near(B, 0.05);
    t = `Op een pallet staan ${a} dozen. In elke doos zitten ${b} pakken koffie.`;
    est = A * B;
    exact = a * b;
    calcTxt = `${a} is ongeveer ${A} en ${b} is ongeveer ${B}: ${A} × ${B} = ${nf(est)}.`;
    t += '|Hoeveel pakken koffie staan er ongeveer op de pallet?';
  } else if (L === 2) {
    if (r.chance(0.5)) {
      const A = 2 * r.int(8, 16),
        B = 500 * r.int(3, 5),
        a = A,
        b = near(B, 0.03);
      t = `Een stadion heeft ${a} vakken met elk ongeveer ${nf(b)} zitplaatsen.|Hoeveel toeschouwers passen er ongeveer in het stadion?`;
      est = A * B;
      exact = a * b;
      calcTxt = `${nf(b)} is ongeveer ${nf(B)}: ${a} × ${nf(B)} = ${nf(est)}.`;
    } else {
      const A = 100 * r.int(3, 9),
        B = 10 * r.int(3, 6),
        a = near(A, 0.03),
        b = near(B, 0.04);
      t = `Op een school zitten ${a} leerlingen. Voor het schoolreisje betaalt elke leerling ${eur(b)}.|Hoeveel euro haalt de school ongeveer op?`;
      est = A * B;
      exact = a * b;
      calcTxt = `${a} is ongeveer ${A} en ${b} is ongeveer ${B}: ${A} × ${B} = ${nf(est)}.`;
    }
  } else {
    const A = 1000 * r.pick([150, 200, 250, 300, 400]),
      B = 10 * r.int(2, 4),
      a = near(A, 0.015),
      b = near(B, 0.04);
    t = `Een krant heeft ${nf(a)} abonnees. Zij betalen ${eur(b)} per maand.|Hoeveel euro ontvangt de krant ongeveer per jaar aan abonnementsgeld?`;
    est = A * B * 12;
    exact = a * b * 12;
    calcTxt = `${nf(a)} is ongeveer ${nf(A)} en ${b} is ongeveer ${B}. Per maand: ${nf(A)} × ${B} = ${nf(A * B)}. Per jaar: × 12 = ${nf(est)}.`;
  }
  const opts = [est / 10, est * 10, L === 3 ? est / 12 : est / 2];
  if ([est].concat(opts).some((o) => o !== est && Math.abs(o - exact) <= Math.abs(est - exact))) throw RETRY;
  const [story, question] = t.split('|');
  return Object.assign(mcNum(r, est, opts), {
    q: p(story) + ask(question),
    expl:
      steps('Rond af op makkelijke getallen.', calcTxt, `Het antwoord is ongeveer <b>${nf(est)}</b>.`) +
      (L === 3 ? tip('Er wordt naar een heel jaar gevraagd, dus 12 maanden.') : ''),
  });
});

def('AN09', 'A', 'N', 'A.3', 'Afronden in een verhaal', (L, r) => {
  if (L === 1) {
    const n = r.int(10210, 48960);
    if (n % 100 === 0) throw RETRY;
    return {
      type: 'num',
      q:
        p(`Bij een concert waren ${nf(n)} bezoekers. In de krant wordt dit aantal afgerond op honderdtallen.`) +
        ask('Welk getal staat er in de krant?'),
      ans: Math.round(n / 100) * 100,
      expl: roundEx(n, 100),
    };
  }
  if (L === 2) {
    let n = r.int(112000, 878000);
    if (r.chance(0.4)) n = Math.floor(n / 10000) * 10000 + 10000 - r.int(1, 500);
    if (n % 1000 === 0) throw RETRY;
    return {
      type: 'num',
      q:
        p(`Een gemeente telt ${nf(n)} inwoners. Op de website wordt dit afgerond op duizendtallen.`) +
        ask('Welk getal staat er op de website?'),
      ans: Math.round(n / 1000) * 1000,
      expl: roundEx(n, 1000),
    };
  }
  if (r.chance(0.5)) {
    const pack = r.pick([25, 50]),
      n = r.int(430, 1870);
    if (n % pack === 0) throw RETRY;
    const ans = Math.ceil(n / pack) * pack;
    return {
      type: 'num',
      unit: 'stoelen',
      q:
        p(`Voor een festival zijn ${nf(n)} stoelen nodig. De verhuurder levert stoelen alleen in stapels van ${pack} stuks.`) +
        ask('Hoeveel stoelen moet de organisatie minstens huren?'),
      ans,
      expl:
        steps(
          `${nf(n)} : ${pack} = ${Math.floor(n / pack)} rest ${n % pack}.`,
          `Met ${Math.floor(n / pack)} stapels zijn er te weinig stoelen. Er zijn ${Math.ceil(n / pack)} stapels nodig.`,
          `${Math.ceil(n / pack)} × ${pack} = <b>${nf(ans)}</b> stoelen.`,
        ) + tip('Hier rond je altijd naar boven af, ook als de rest klein is.'),
    };
  }
  const n = r.int(102000000, 987000000);
  if (n % 1e6 === 0) throw RETRY;
  const ans = Math.round(n / 1e6);
  return {
    type: 'num',
    unit: 'miljoen euro',
    q:
      p(`Een bedrijf heeft een jaaromzet van ${eur(n)}. In het jaarverslag wordt dit afgerond op miljoenen euro's.`) +
      ask('Hoeveel miljoen euro staat er in het jaarverslag?'),
    ans,
    expl: roundEx(n, 1000000, `, dus <b>${ans}</b> miljoen euro`),
  };
});

def('AN10', 'A', 'N', 'A.4', 'Kwadraat en wortel in een verhaal', (L, r) => {
  if (L === 1) {
    const n = r.int(7, 15);
    if (r.chance(0.5))
      return {
        type: 'num',
        unit: 'm²',
        q: p(`Een vierkant schoolplein heeft zijden van ${n} meter.`) + ask('Wat is de oppervlakte van het plein?'),
        ans: n * n,
        expl: steps(`Oppervlakte van een vierkant = zijde × zijde.`, `${n} × ${n} = <b>${n * n}</b> m².`),
      };
    return {
      type: 'num',
      unit: 'm',
      q: p(`Een vierkant schoolplein heeft een oppervlakte van ${n * n} m².`) + ask('Hoe lang is één zijde van het plein?'),
      ans: n,
      expl: steps(
        `Zoek het getal dat met zichzelf vermenigvuldigd ${n * n} geeft.`,
        `${n} × ${n} = ${n * n}, dus een zijde is <b>${n}</b> m.`,
      ),
    };
  }
  if (L === 2) {
    let n;
    do {
      n = r.int(21, 59);
    } while (n % 10 === 0);
    return {
      type: 'num',
      unit: 'm',
      calc: true,
      q: p(`Een vierkant plein heeft een oppervlakte van ${nf(n * n)} m².`) + ask('Hoe lang is één zijde van het plein?'),
      ans: n,
      expl: steps(
        `De zijde is de wortel van de oppervlakte: √${nf(n * n)}.`,
        `Controle: ${n} × ${n} = ${nf(n * n)}. De zijde is <b>${n}</b> m.`,
      ),
    };
  }
  if (r.chance(0.5)) {
    const a = r.int(12, 20),
      b = a + r.int(2, 5);
    return {
      type: 'num',
      unit: 'tegels',
      calc: true,
      q:
        p(
          `Een vierkant terras bestaat uit ${a} rijen van ${a} tegels. Het terras wordt vergroot tot een vierkant van ${b} rijen van ${b} tegels.`,
        ) + ask('Hoeveel tegels komen erbij?'),
      ans: b * b - a * a,
      expl:
        steps(
          `Nieuw terras: ${b} × ${b} = ${b * b} tegels.`,
          `Oud terras: ${a} × ${a} = ${a * a} tegels.`,
          `${b * b} − ${a * a} = <b>${b * b - a * a}</b> tegels.`,
        ) + tip(`Het is niet genoeg om ${b} − ${a} = ${b - a} te kwadrateren.`),
    };
  }
  let n;
  do {
    n = r.int(21, 59);
  } while (n % 10 === 0);
  return {
    type: 'num',
    unit: 'm',
    calc: true,
    q:
      p(`Een vierkante speelweide heeft een oppervlakte van ${nf(n * n)} m². Rond de hele weide komt een hek.`) +
      ask('Hoeveel meter hek is er nodig?'),
    ans: 4 * n,
    expl: steps(`Zijde: √${nf(n * n)} = ${n} m.`, `Een vierkant heeft vier gelijke zijden: 4 × ${n} = <b>${4 * n}</b> m.`),
  };
});

const WISH: [string, number[]][] = [
  ['fiets', [349, 429, 549, 679]],
  ['laptop', [499, 649, 799]],
  ['gitaar', [189, 259, 329]],
  ['telefoon', [279, 399, 459]],
  ['spelcomputer', [289, 349, 519]],
];
def('AN11', 'A', 'N', 'A.4', 'Sparen: tekort of over', (L, r) => {
  const name = nm(r),
    [it, ps] = r.pick(WISH),
    P = r.pick(ps),
    w = r.pick([12, 15, 18, 20, 25, 35]),
    H = r.int(3, 12) * 10;
  const weeksNeed = Math.ceil((P - H) / w);
  if (L === 1) {
    const k = r.int(6, 14);
    return {
      type: 'num',
      pre: '€',
      q:
        p(`${name} spaart voor een ${it} van ${eur(P)}. ${name} heeft al ${eur(H)} en legt elke week ${eur(w)} opzij.`) +
        ask(`Hoeveel euro heeft ${name} na ${k} weken?`),
      ans: H + k * w,
      expl:
        steps(
          `In ${k} weken: ${k} × ${eur(w)} = ${eur(k * w)}.`,
          `Met het beginbedrag: ${eur(H)} + ${eur(k * w)} = <b>${eur(H + k * w)}</b>.`,
        ) + tip(`De prijs van de ${it} heb je hier niet nodig.`),
    };
  }
  if (L === 2) {
    const k = r.int(4, Math.max(5, weeksNeed - 2));
    const short = P - H - k * w;
    if (short <= 0) throw RETRY;
    return {
      type: 'num',
      pre: '€',
      q:
        p(`${name} spaart voor een ${it} van ${eur(P)}. ${name} heeft al ${eur(H)} en legt elke week ${eur(w)} opzij.`) +
        ask(`Hoeveel euro komt ${name} na ${k} weken nog tekort?`),
      ans: short,
      expl: steps(
        `Na ${k} weken: ${eur(H)} + ${k} × ${eur(w)} = ${eur(H + k * w)}.`,
        `Tekort: ${eur(P)} − ${eur(H + k * w)} = <b>${eur(short)}</b>.`,
      ),
    };
  }
  if ((P - H) % w === 0) throw RETRY;
  return {
    type: 'num',
    unit: 'weken',
    q:
      p(`${name} spaart voor een ${it} van ${eur(P)}. ${name} heeft al ${eur(H)} en legt elke week ${eur(w)} opzij.`) +
      ask(`Na hoeveel weken sparen kan ${name} de ${it} op zijn vroegst kopen?`),
    ans: weeksNeed,
    expl:
      steps(
        `Nog nodig: ${eur(P)} − ${eur(H)} = ${eur(P - H)}.`,
        `${P - H} : ${w} = ${Math.floor((P - H) / w)} rest ${(P - H) % w}.`,
        `Na ${Math.floor((P - H) / w) === 1 ? '1 week' : Math.floor((P - H) / w) + ' weken'} is er nog net te weinig. Het lukt na <b>${weeksNeed}</b> ${weeksNeed === 1 ? 'week' : 'weken'}.`,
      ) + tip('Je rondt hier naar boven af: een halve week sparen bestaat niet.'),
  };
});

def('AN12', 'A', 'N', 'A.4', 'Stoelen en opbrengst in een zaal', (L, r) => {
  const R = r.int(14, 22),
    a = r.int(4, 8),
    s1 = r.pick([18, 20, 22, 24]),
    s2 = s1 + r.pick([2, 4, 6]),
    seats = a * s1 + (R - a) * s2,
    p1 = r.pick([28, 32, 35, 38]),
    p2 = p1 - r.pick([6, 8, 9]);
  const st = `De eerste ${a} rijen: ${a} × ${s1} = ${a * s1} stoelen.`,
    st2 = `De overige ${R} − ${a} = ${R - a} rijen: ${R - a} × ${s2} = ${(R - a) * s2} stoelen.`;
  const zaal = `Een theaterzaal heeft ${R} rijen. De eerste ${a} rijen hebben elk ${s1} stoelen. Alle andere rijen hebben elk ${s2} stoelen.`;
  if (L === 1)
    return {
      type: 'num',
      unit: 'stoelen',
      q: p(zaal) + ask('Hoeveel stoelen staan er in de zaal?'),
      ans: seats,
      expl: steps(st, st2, `Samen: <b>${nf(seats)}</b> stoelen.`) + tip(`Er zijn ${R - a} overige rijen, niet ${R}.`),
    };
  if (L === 2)
    return {
      type: 'num',
      pre: '€',
      calc: true,
      q: p(zaal + ` Een kaartje kost ${eur(p2)}.`) + ask('Wat is de opbrengst als de zaal helemaal is uitverkocht?'),
      ans: seats * p2,
      expl: steps(st, st2, `Samen: ${nf(seats)} stoelen.`, `${nf(seats)} × ${eur(p2)} = <b>${eur(seats * p2)}</b>.`),
    };
  const ans = a * s1 * p1 + (R - a) * s2 * p2;
  return {
    type: 'num',
    pre: '€',
    calc: true,
    q:
      p(zaal + ` Een kaartje voor de eerste ${a} rijen kost ${eur(p1)}. Voor de andere rijen kost een kaartje ${eur(p2)}.`) +
      ask('Wat is de opbrengst als de zaal helemaal is uitverkocht?'),
    ans,
    expl: steps(
      `${st} Opbrengst: ${a * s1} × ${eur(p1)} = ${eur(a * s1 * p1)}.`,
      `${st2} Opbrengst: ${(R - a) * s2} × ${eur(p2)} = ${eur((R - a) * s2 * p2)}.`,
      `Samen: <b>${eur(ans)}</b>.`,
    ),
  };
});
