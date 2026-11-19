/* Domein C · Meten en meetkunde · hoofdrekenen */
import { nf, klok } from '../../core/notatie';
import { rnd } from '../../core/rekenen';
import { def, RETRY, steps, tip, som, p, ask, mcTxt } from '../../core/opbouw';
import { F } from '../../figuren';
import type { Niveau } from '../../core/types';
import { f6, mnt, gap } from '../hulp';

const decs = (x: number): number => (String(Math.abs(rnd(x, 6))).split('.')[1] || '').length;

// [van, naar, factor, soort]  (naar = van x factor)
type Soort = 'l' | 'g' | 'i' | 'o' | 'v';
const CONV: Record<Niveau, [string, string, number, Soort][]> = {
  1: [
    ['km', 'm', 1000, 'l'],
    ['m', 'cm', 100, 'l'],
    ['cm', 'mm', 10, 'l'],
    ['kg', 'g', 1000, 'g'],
    ['l', 'dl', 10, 'i'],
    ['l', 'cl', 100, 'i'],
    ['l', 'ml', 1000, 'i'],
    ['g', 'kg', 0.001, 'g'],
    ['cl', 'l', 0.01, 'i'],
    ['mm', 'cm', 0.1, 'l'],
    ['m', 'km', 0.001, 'l'],
    ['cm', 'm', 0.01, 'l'],
  ],
  2: [
    ['m²', 'dm²', 100, 'o'],
    ['dm²', 'cm²', 100, 'o'],
    ['cm²', 'mm²', 100, 'o'],
    ['ha', 'm²', 10000, 'o'],
    ['m²', 'cm²', 10000, 'o'],
    ['dm³', 'l', 1, 'v'],
    ['m³', 'l', 1000, 'v'],
    ['cm³', 'l', 0.001, 'v'],
    ['l', 'cm³', 1000, 'v'],
    ['km²', 'ha', 100, 'o'],
    ['ton', 'kg', 1000, 'g'],
    ['dm³', 'cm³', 1000, 'v'],
  ],
  3: [
    ['mm²', 'dm²', 0.0001, 'o'],
    ['m³', 'dm³', 1000, 'v'],
    ['dm³', 'cl', 100, 'v'],
    ['mg', 'g', 0.001, 'g'],
    ['km²', 'm²', 1000000, 'o'],
    ['cm³', 'dm³', 0.001, 'v'],
    ['ha', 'km²', 0.01, 'o'],
    ['m²', 'ha', 0.0001, 'o'],
    ['ml', 'dl', 0.01, 'i'],
    ['dm²', 'm²', 0.01, 'o'],
    ['cm²', 'dm²', 0.01, 'o'],
    ['m³', 'cm³', 1000000, 'v'],
  ],
};
const VALS = [
  2.5, 0.45, 350, 3.2, 1500, 0.6, 0.05, 20000, 4.5, 250, 1.2, 75, 0.8, 12, 6.4, 0.25, 40, 7, 1.5, 3000, 0.3, 180, 0.07, 5200, 9, 0.9, 64,
  12500, 0.125, 800,
];
const WHY: Record<Soort, string> = {
  l: 'Bij lengtematen is elke stap in de rij km – hm – dam – m – dm – cm – mm een factor 10.',
  g: 'Kilo betekent duizend en milli betekent een duizendste: 1 kg = 1.000 g, 1 ton = 1.000 kg en 1 g = 1.000 mg.',
  i: 'Bij inhoudsmaten is elke stap in de rij l – dl – cl – ml een factor 10.',
  o: 'Bij oppervlaktematen is elke stap een factor 100. Een hectare (ha) is 10.000 m² en 1 km² is 100 ha.',
  v: 'Bij inhoudsmaten met een ³ is elke stap een factor 1.000. Verder geldt: 1 dm³ = 1 liter en 1 cm³ = 1 ml.',
};
def('CH01', 'C', 'H', 'C.2', 'Maten omrekenen', (L, r) => {
  const [from, to, fc, kind] = r.pick(CONV[L]),
    v = r.pick(VALS),
    ans = rnd(v * fc, 8);
  if (decs(ans) > 4 || ans >= 1e7 || ans < 0.001 || (fc === 1 && L > 1 && r.chance(0.7))) throw RETRY;
  const rel = fc >= 1 ? `1 ${from} = ${nf(fc)} ${to}` : `1 ${to} = ${nf(Math.round(1 / fc))} ${from}`;
  return {
    type: 'num',
    unit: to,
    q: p('Welk getal hoort op de puntjes?') + som(`${nf(v)} ${from} = ${gap} ${to}`),
    ans,
    expl: steps(
      WHY[kind],
      `${rel}.`,
      fc >= 1
        ? `${nf(v)} × ${nf(fc)} = <b>${nf(ans)}</b> ${to}.`
        : `Je deelt dus: ${nf(v)} : ${nf(Math.round(1 / fc))} = <b>${nf(ans)}</b> ${to}.`,
    ),
  };
});

def('CH02', 'C', 'H', 'C.2', 'Rekenen met tijd', (L, r) => {
  const f = r.int(1, 3);
  if (L === 1) {
    if (f === 1) {
      const h = r.pick([1.5, 2.5, 0.75, 1.25, 2.25, 3.5, 0.5, 1.75, 0.25]);
      return {
        type: 'num',
        unit: 'minuten',
        q: p(`Hoeveel minuten is ${nf(h)} uur?`),
        ans: h * 60,
        expl: steps('1 uur is 60 minuten.', `${nf(h)} × 60 = <b>${h * 60}</b> minuten.`),
      };
    }
    if (f === 2) {
      const h = r.int(1, 2),
        m1 = 10 * r.int(1, 5),
        m2 = 5 * r.int(5, 11);
      return {
        type: 'num',
        unit: 'minuten',
        q: p(`Hoeveel minuten is ${h} uur en ${m1} minuten plus ${m2} minuten samen?`),
        ans: h * 60 + m1 + m2,
        expl: steps(`${h} uur is ${h * 60} minuten.`, `${h * 60} + ${m1} + ${m2} = <b>${h * 60 + m1 + m2}</b> minuten.`),
      };
    }
    const m = r.pick([1.5, 2.5, 3.5, 0.5, 4.5, 2.25, 0.75]);
    return {
      type: 'num',
      unit: 'seconden',
      q: p(`Hoeveel seconden is ${nf(m)} minuut?`),
      ans: m * 60,
      expl: steps('1 minuut is 60 seconden.', `${nf(m)} × 60 = <b>${m * 60}</b> seconden.`),
    };
  }
  if (L === 2) {
    if (f < 3) {
      const t1 = r.int(7, 11) * 60 + 5 * r.int(1, 11),
        d = 5 * r.int(21, 53),
        t2 = t1 + d;
      if (t1 % 60 <= t2 % 60) throw RETRY;
      return {
        type: 'num',
        unit: 'minuten',
        q: p(`Hoeveel minuten zitten er tussen ${klok(t1)} uur en ${klok(t2)} uur?`),
        ans: d,
        expl: steps(
          `Van ${klok(t1)} tot ${klok(Math.ceil(t1 / 60) * 60)} is ${60 - (t1 % 60)} minuten.`,
          `Van ${klok(Math.ceil(t1 / 60) * 60)} tot ${klok(t2)} is ${Math.floor(t2 / 60) - Math.ceil(t1 / 60)} uur en ${t2 % 60} minuten: ${t2 - Math.ceil(t1 / 60) * 60} minuten.`,
          `Samen: <b>${d}</b> minuten.`,
        ),
      };
    }
    const h = r.pick([0.2, 0.3, 0.4, 0.6, 0.7, 0.8, 0.9, 1.1, 1.2, 1.3, 1.4, 1.6, 2.2, 2.4, 2.75, 1.15]),
      ans = rnd(h * 60, 4);
    return {
      type: 'num',
      unit: 'minuten',
      q: p(`Hoeveel minuten is ${nf(h)} uur?`),
      ans,
      expl:
        steps('1 uur is 60 minuten, dus 0,1 uur is 6 minuten.', `${nf(h)} × 60 = <b>${nf(ans)}</b> minuten.`) +
        tip(`${nf(h)} uur is niet hetzelfde als ${String(h).split('.')[0]} uur en ${mnt(+String(h).split('.')[1])}.`),
    };
  }
  if (f === 1) {
    const start = r.int(19, 22) * 60 + 5 * r.int(2, 11),
      d = r.int(95, 168),
      end = start + d,
      hh = Math.floor(d / 60),
      mm = d % 60;
    const good = klok(end),
      wr = [klok(start + hh * 100 * 0 + Math.floor(d / 100) * 60 + (d % 100)), klok(end + 60), klok(end - 10), klok(end + 20)];
    return Object.assign(mcTxt(r, good, wr), {
      q: p(`Een film begint om ${klok(start)} uur en duurt ${d} minuten.`) + ask('Hoe laat is de film afgelopen?'),
      expl:
        steps(
          `${d} minuten is ${hh} uur en ${mnt(mm)}.`,
          `${klok(start)} + ${hh} uur = ${klok(start + hh * 60)}.`,
          `${klok(start + hh * 60)} + ${mnt(mm)} = <b>${good}</b> uur.`,
        ) + tip(`${d} minuten is niet ${Math.floor(d / 100)} uur en ${mnt(d % 100)}: een uur heeft 60 minuten.`),
    });
  }
  if (f === 2) {
    const h = r.int(1, 5),
      t = r.int(1, 9);
    if (t === 5) throw RETRY;
    return {
      type: 'num',
      unit: 'minuten',
      q: p('Welk getal hoort op de puntjes?') + som(`${h},${t} uur = ${h} uur en ${gap} minuten`),
      ans: t * 6,
      expl: steps('0,1 uur is 6 minuten.', `0,${t} uur is ${t} × 6 = <b>${t * 6}</b> minuten.`) + tip(`0,${t} uur is niet ${t}0 minuten.`),
    };
  }
  const h = r.int(1, 6),
    m = r.pick([15, 45, 30, 12, 36, 48, 6, 54]),
    ans = rnd(h + m / 60, 4);
  return {
    type: 'num',
    unit: 'uur',
    q: p(`Schrijf ${h} uur en ${m} minuten als kommagetal in uren.`),
    ans,
    expl: steps(`${m} minuten is ${m} : 60 = ${nf(m / 60)} uur.`, `${h} + ${nf(m / 60)} = <b>${nf(ans)}</b> uur.`),
  };
});

def('CH03', 'C', 'H', 'C.10', 'Omtrek en oppervlakte', (L, r) => {
  if (L === 1) {
    const a = r.int(6, 15),
      b = r.int(3, a - 1);
    if (r.chance(0.5))
      return {
        type: 'num',
        unit: 'cm²',
        q: p(`Een rechthoek is ${a} cm lang en ${b} cm breed.`) + ask('Wat is de oppervlakte?'),
        ans: a * b,
        expl: steps('Oppervlakte rechthoek = lengte × breedte.', `${a} × ${b} = <b>${a * b}</b> cm².`),
      };
    return {
      type: 'num',
      unit: 'cm',
      q: p(`Een rechthoek is ${a} cm lang en ${b} cm breed.`) + ask('Wat is de omtrek?'),
      ans: 2 * (a + b),
      expl: steps(
        'De omtrek is de lengte van alle zijden samen: twee keer de lengte en twee keer de breedte.',
        `2 × ${a} + 2 × ${b} = <b>${2 * (a + b)}</b> cm.`,
      ),
    };
  }
  if (L === 2) {
    if (r.chance(0.5)) {
      const s = r.int(5, 12);
      return {
        type: 'num',
        unit: 'cm²',
        q: p(`Een vierkant heeft een omtrek van ${4 * s} cm.`) + ask('Wat is de oppervlakte van het vierkant?'),
        ans: s * s,
        expl: steps(
          `Een vierkant heeft vier gelijke zijden: ${4 * s} : 4 = ${s} cm per zijde.`,
          `Oppervlakte: ${s} × ${s} = <b>${s * s}</b> cm².`,
        ),
      };
    }
    const w = r.int(3, 8),
      l = w + r.int(2, 9),
      P = 2 * (l + w);
    return {
      type: 'num',
      unit: 'cm²',
      q: p(`Een rechthoek heeft een omtrek van ${P} cm. De breedte is ${w} cm.`) + ask('Wat is de oppervlakte van de rechthoek?'),
      ans: l * w,
      expl: steps(
        `Lengte en breedte zijn samen de helft van de omtrek: ${P} : 2 = ${P / 2} cm.`,
        `De lengte is ${P / 2} − ${w} = ${l} cm.`,
        `Oppervlakte: ${l} × ${w} = <b>${l * w}</b> cm².`,
      ),
    };
  }
  const f = r.int(1, 3);
  if (f === 1) {
    const w = r.int(4, 9),
      l = w + r.int(2, 8);
    return {
      type: 'num',
      unit: 'cm',
      q: p(`Een rechthoek heeft een oppervlakte van ${l * w} cm². De lengte is ${l} cm.`) + ask('Wat is de omtrek van de rechthoek?'),
      ans: 2 * (l + w),
      expl: steps(`De breedte is ${l * w} : ${l} = ${w} cm.`, `Omtrek: 2 × ${l} + 2 × ${w} = <b>${2 * (l + w)}</b> cm.`),
    };
  }
  if (f === 2) {
    const b = 2 * r.int(4, 12),
      h = r.int(5, 15);
    return {
      type: 'num',
      unit: 'cm²',
      q:
        p(`Een driehoek heeft een basis van ${b} cm en een hoogte van ${h} cm. Gebruik: oppervlakte driehoek = ½ × basis × hoogte.`) +
        ask('Wat is de oppervlakte van de driehoek?'),
      ans: (b * h) / 2,
      expl: steps(`½ × ${b} × ${h} = ${b / 2} × ${h}.`, `${b / 2} × ${h} = <b>${(b * h) / 2}</b> cm².`),
    };
  }
  const s = r.int(6, 15);
  return {
    type: 'num',
    unit: 'cm',
    q: p(`Een vierkant heeft een oppervlakte van ${s * s} cm².`) + ask('Wat is de omtrek van het vierkant?'),
    ans: 4 * s,
    expl: steps(`De zijde is √${s * s} = ${s} cm, want ${s} × ${s} = ${s * s}.`, `Omtrek: 4 × ${s} = <b>${4 * s}</b> cm.`),
  };
});

def('CH04', 'C', 'H', 'C.3', 'Snelheid', (L, r) => {
  if (L === 1) {
    if (r.chance(0.5)) {
      const v = 12 * r.int(4, 10),
        t = r.pick([10, 15, 20, 30, 45]),
        d = (v * t) / 60;
      return {
        type: 'num',
        unit: 'km',
        q: p(`Een auto rijdt ${v} km per uur.`) + ask(`Hoeveel kilometer legt de auto af in ${t} minuten?`),
        ans: d,
        expl: steps(
          `${t} minuten is ${t === 10 ? 'een zesde' : t === 15 ? 'een kwart' : t === 20 ? 'een derde' : t === 30 ? 'een half' : 'drie kwart'} uur.`,
          t === 45 ? `${v} : 4 × 3 = <b>${d}</b> km.` : `${v} : ${60 / t} = <b>${d}</b> km.`,
        ),
      };
    }
    const v = r.pick([40, 50, 60, 80, 90, 100]),
      t = r.pick([1.5, 2, 2.5, 3, 0.5]),
      d = v * t;
    return {
      type: 'num',
      unit: 'km/u',
      q: p(`Een trein rijdt ${nf(d)} km in ${nf(t)} uur.`) + ask('Wat is de gemiddelde snelheid in km per uur?'),
      ans: v,
      expl: steps('Snelheid = afstand : tijd.', `${nf(d)} : ${nf(t)} = <b>${v}</b> km/u.`),
    };
  }
  if (L === 2) {
    if (r.chance(0.5)) {
      const v = r.pick([18, 36, 54, 72, 90, 108]);
      return {
        type: 'num',
        unit: 'm/s',
        q: p('Welk getal hoort op de puntjes?') + som(`${v} km/u = ${gap} m/s`),
        ans: v / 3.6,
        expl: steps(
          `${v} km per uur is ${nf(v * 1000)} meter in 3.600 seconden.`,
          `${nf(v * 1000)} : 3.600 = <b>${f6(v / 3.6)}</b> m/s.`,
          'Onthoud: van km/u naar m/s deel je door 3,6.',
        ),
      };
    }
    const v = r.pick([12, 16, 18, 20, 24, 30, 40, 60, 80]),
      t = r.pick([15, 20, 30, 40, 45]),
      d = (v * t) / 60;
    if (d !== Math.round(d)) throw RETRY;
    return {
      type: 'num',
      unit: 'km/u',
      q: p(`Een fietser rijdt ${d} km in ${t} minuten.`) + ask('Wat is de gemiddelde snelheid in km per uur?'),
      ans: v,
      expl: steps(`In ${t} minuten ${d} km. Reken om naar 60 minuten.`, `${d} : ${t} × 60 = <b>${v}</b> km/u.`),
    };
  }
  if (r.chance(0.5)) {
    const v = r.pick([5, 10, 15, 20, 25, 30, 12.5, 7.5]);
    return {
      type: 'num',
      unit: 'km/u',
      q: p('Welk getal hoort op de puntjes?') + som(`${nf(v)} m/s = ${gap} km/u`),
      ans: rnd(v * 3.6, 4),
      expl: steps(
        `In een uur zitten 3.600 seconden: ${nf(v)} × 3.600 = ${nf(v * 3600)} meter per uur.`,
        `Dat is <b>${f6(v * 3.6)}</b> km/u.`,
        'Onthoud: van m/s naar km/u vermenigvuldig je met 3,6.',
      ),
    };
  }
  const ms = r.pick([2.5, 4, 5, 6, 7.5, 8, 10]),
    t = r.pick([20, 40, 50, 80, 100]),
    d = ms * t;
  return {
    type: 'num',
    unit: 'km/u',
    q: p(`Een hardloper loopt ${nf(d)} meter in ${t} seconden.`) + ask('Wat is de gemiddelde snelheid in km per uur?'),
    ans: rnd(ms * 3.6, 4),
    expl: steps(
      `${nf(d)} : ${t} = ${nf(ms)} meter per seconde.`,
      `Van m/s naar km/u vermenigvuldig je met 3,6: ${nf(ms)} × 3,6 = <b>${f6(ms * 3.6)}</b> km/u.`,
    ),
  };
});

def('CH05', 'C', 'H', 'C.4', 'Schaal', (L, r) => {
  if (L === 1) {
    const n = r.pick([50, 100, 200, 500]),
      x = r.int(2, 12),
      ans = (x * n) / 100;
    return {
      type: 'num',
      unit: 'm',
      q:
        p(`Een tekening heeft schaal 1 : ${n}. Op de tekening is een muur ${x} cm lang.`) +
        ask('Hoe lang is de muur in werkelijkheid? Geef je antwoord in meters.'),
      ans,
      expl: steps(
        `Schaal 1 : ${n} betekent: 1 cm op de tekening is ${n} cm in werkelijkheid.`,
        `${x} × ${n} = ${nf(x * n)} cm.`,
        `Dat is <b>${nf(ans)}</b> m.`,
      ),
    };
  }
  if (L === 2) {
    const n = r.pick([25000, 50000, 100000, 200000, 250000]),
      x = r.pick([2, 3, 4, 5, 6, 7, 8, 9, 12, 14, 2.5, 4.5, 6.5]),
      ans = rnd((x * n) / 100000, 4);
    return {
      type: 'num',
      unit: 'km',
      q:
        p(`Een kaart heeft schaal 1 : ${nf(n)}. Twee dorpen liggen op de kaart ${nf(x)} cm van elkaar.`) +
        ask('Hoeveel kilometer is dat in werkelijkheid?'),
      ans,
      expl: steps(
        `1 cm op de kaart is ${nf(n)} cm in werkelijkheid. Dat is ${f6(n / 100000)} km.`,
        `${nf(x)} × ${f6(n / 100000)} = <b>${nf(ans)}</b> km.`,
      ),
    };
  }
  const n = r.pick([25000, 50000, 100000, 200000, 400000, 500000]),
    x = r.pick([2, 3, 4, 5, 6, 8, 12, 2.5, 7.5]),
    D = rnd((x * n) / 100000, 4);
  if (r.chance(0.5))
    return {
      type: 'num',
      unit: 'cm',
      q:
        p(`Een kaart heeft schaal 1 : ${nf(n)}. Twee steden liggen in werkelijkheid ${nf(D)} km van elkaar.`) +
        ask('Hoeveel centimeter is dat op de kaart?'),
      ans: x,
      expl: steps(
        `${nf(D)} km is ${nf(D * 100000)} cm.`,
        `Op de kaart is alles ${nf(n)} keer zo klein: ${nf(D * 100000)} : ${nf(n)} = <b>${nf(x)}</b> cm.`,
      ),
    };
  return {
    type: 'num',
    q: p(`Op een kaart is ${nf(x)} cm in werkelijkheid ${nf(D)} km.`) + ask('Wat is de schaal van de kaart?') + som(`1 : ${gap}`),
    ans: n,
    expl:
      steps(
        `${nf(D)} km is ${nf(D * 100000)} cm.`,
        `${nf(x)} cm op de kaart is dus ${nf(D * 100000)} cm in werkelijkheid.`,
        `1 cm op de kaart is ${nf(D * 100000)} : ${nf(x)} = <b>${nf(n)}</b> cm. De schaal is 1 : ${nf(n)}.`,
      ) + tip('Je typt het getal zonder punten.'),
  };
});

const REF: [string, string, string[]][] = [
  ['de hoogte van een deur', '2 m', ['20 cm', '20 m', '200 mm']],
  ['het gewicht van een pak suiker', '1 kg', ['100 g', '10 kg', '10 g']],
  ['de inhoud van een emmer', '10 l', ['1 l', '100 l', '10 cl']],
  ['de lengte van een nieuw potlood', '18 cm', ['18 mm', '1,8 m', '180 cm']],
  ['de oppervlakte van een klaslokaal', '50 m²', ['5 m²', '500 m²', '50 dm²']],
  ['het gewicht van een volwassen man', '80 kg', ['8 kg', '800 g', '800 kg']],
  ['de inhoud van een theelepel', '5 ml', ['5 cl', '5 dl', '50 cl']],
  ['de dikte van een munt van 1 euro', '2 mm', ['2 cm', '0,2 mm', '20 mm']],
  ['de afstand die je in één uur wandelt', '5 km', ['500 m', '50 km', '15 km']],
  ['de inhoud van een badkuip', '150 l', ['15 l', '1.500 l', '15 m³']],
  ['de inhoud van een drinkglas', '2 dl', ['2 ml', '2 l', '20 dl']],
  ['het gewicht van een ei', '60 g', ['6 g', '600 g', '6 kg']],
  ['de lengte van een personenauto', '4,5 m', ['45 cm', '45 m', '450 mm']],
  ['de hoogte van een klaslokaal', '3 m', ['30 cm', '30 m', '3 dm']],
  ['de oppervlakte van een voetbalveld', '0,7 ha', ['70 m²', '7 km²', '700 m²']],
  ['de inhoud van een pak melk', '1 l', ['1 dl', '10 l', '100 ml']],
];
const EQ: [string, string, string[]][] = [
  ['2,5 liter', '25 dl', ['250 ml', '25 cl', '2.500 cl']],
  ['0,4 kg', '400 g', ['40 g', '4.000 g', '4 g']],
  ['3,5 m', '350 cm', ['35 cm', '3.500 cm', '35 dm²']],
  ['750 ml', '0,75 l', ['7,5 l', '75 dl', '0,075 l']],
  ['1,2 km', '1.200 m', ['120 m', '12.000 m', '12 hm²']],
  ['45 mm', '4,5 cm', ['0,45 cm', '45 cm', '0,45 m']],
  ['0,06 m', '6 cm', ['0,6 cm', '60 cm', '6 mm']],
  ['3 dm³', '3 l', ['30 l', '3 ml', '0,3 l']],
  ['2 ha', '20.000 m²', ['2.000 m²', '200 m²', '200.000 m²']],
  ['500 cm³', '0,5 l', ['5 l', '50 l', '0,05 l']],
];
def('CH06', 'C', 'H', 'C.2', 'Passende maat kiezen', (L, r) => {
  if (L === 1) {
    const [what, good, bad] = r.pick(REF);
    return Object.assign(mcTxt(r, good, bad), {
      q: p(`Welke maat past het best bij ${what}?`),
      expl: steps(
        'Vergelijk met maten die je kent: een deur is ongeveer 2 meter hoog, een pak melk is 1 liter en 1 kilogram, een stap is ongeveer 1 meter.',
        `Het best past <b>${good}</b>.`,
      ),
    });
  }
  if (L === 2) {
    const [what, good, bad] = r.pick(EQ);
    return Object.assign(mcTxt(r, good, bad), {
      q: p(`Welke maat is even groot als ${what}?`),
      expl: steps('Reken om met de vaste stappen van het metriek stelsel.', `${what} = <b>${good}</b>.`),
    });
  }
  const big = r.chance(0.5),
    kind = r.pick([
      ['m', 'dm', 'cm', 'mm'],
      ['l', 'dl', 'cl', 'ml'],
    ]),
    set = new Set<number>();
  while (set.size < 4) set.add(10 * r.int(21, 44));
  const vals = r.shuffle(Array.from(set)),
    it = vals.map((v, i) => ({ h: `${f6(v / Math.pow(10, 3 - i))} ${kind[i]}`, v })),
    pick = it.slice().sort((a, b) => (big ? b.v - a.v : a.v - b.v))[0];
  return Object.assign(
    mcTxt(
      r,
      pick.h,
      it.filter((x) => x !== pick).map((x) => x.h),
    ),
    {
      q: p(`Welke maat is het ${big ? 'grootst' : 'kleinst'}?`),
      expl: steps(
        `Schrijf alles in dezelfde eenheid, bijvoorbeeld ${kind[3]}.`,
        it.map((x) => `${x.h} = ${x.v} ${kind[3]}`).join('; ') + '.',
        `Het ${big ? 'grootst' : 'kleinst'} is <b>${pick.h}</b>.`,
      ),
    },
  );
});

const UUR = ['twaalf', 'een', 'twee', 'drie', 'vier', 'vijf', 'zes', 'zeven', 'acht', 'negen', 'tien', 'elf'];
function tijdWoord(h: number, m: number): string {
  const a = UUR[h % 12],
    b = UUR[(h + 1) % 12];
  const woord: Record<number, string> = {
    0: `${a} uur`,
    5: `vijf over ${a}`,
    10: `tien over ${a}`,
    15: `kwart over ${a}`,
    20: `tien voor half ${b}`,
    25: `vijf voor half ${b}`,
    30: `half ${b}`,
    35: `vijf over half ${b}`,
    40: `tien over half ${b}`,
    45: `kwart voor ${b}`,
    50: `tien voor ${b}`,
    55: `vijf voor ${b}`,
  };
  return woord[m];
}
def('CH07', 'C', 'H', 'C.9', 'Klokkijken', (L, r) => {
  const h = r.int(1, 11),
    m = 5 * r.int(1, 11),
    t = h * 60 + m,
    sw = ((m / 5 || 12) % 12) * 60 + ((h * 5) % 60);
  if (L === 1) {
    const hh = r.int(6, 11),
      tt = hh * 60 + m,
      sw1 = ((m / 5) % 12) * 60 + ((hh * 5) % 60);
    return Object.assign(mcTxt(r, klok(tt), [klok(sw1 < 60 ? sw1 + 720 : sw1), klok(tt + 720), klok(tt + 60), klok(tt - 60)]), {
      q: p('Het is ochtend. Welke digitale tijd hoort bij deze klok?'),
      fig: F.clock(hh, m),
      expl: steps(
        `De korte wijzer wijst de uren aan: hij staat ${m === 0 ? 'op' : 'voorbij'} de ${hh}.`,
        `De lange wijzer wijst de minuten aan: hij staat op de ${m / 5}, dat is ${m} minuten.`,
        `In de ochtend is dat <b>${klok(tt)}</b>.`,
      ),
    });
  }
  if (L === 2) {
    const tt = t + 720;
    return Object.assign(mcTxt(r, klok(tt), [klok(t), klok(sw + 720), klok(tt + 60), klok(tt - 60)]), {
      q: p('Het is avond. Welke digitale tijd hoort bij deze klok?'),
      fig: F.clock(h, m),
      expl: steps(
        `De korte wijzer staat ${m === 0 ? 'op' : 'voorbij'} de ${h}, de lange wijzer op de ${m / 5}: ${h} uur en ${m} minuten.`,
        `Na 12 uur 's middags tel je 12 uur erbij: ${h} + 12 = ${h + 12}.`,
        `De digitale tijd is <b>${klok(tt)}</b>.`,
      ),
    });
  }
  const pm = r.chance(0.6),
    tt = t + (pm ? 720 : 0),
    dag = pm ? (h >= 6 ? '’s avonds' : '’s middags') : h >= 6 ? '’s ochtends' : '’s nachts',
    w = tijdWoord(h, m);
  if (r.chance(0.5))
    return Object.assign(
      mcTxt(r, klok(tt), [
        klok(tt + (m > 15 && m < 45 ? (m < 30 ? 2 * (30 - m) : -2 * (m - 30)) : 60)),
        klok(tt + (pm ? -720 : 720)),
        klok(tt + 60),
        klok(tt - 60),
      ]),
      {
        q: p(`Het is ${dag} ${w}.`) + ask('Welke digitale tijd hoort daarbij?'),
        expl: steps(
          m >= 20 && m <= 40
            ? `Half ${UUR[(h + 1) % 12]} is ${h}:30. ${m === 30 ? '' : m < 30 ? `${30 - m} minuten daarvóór is ${h}:${m}.` : `${m - 30} minuten daarna is ${h}:${m}.`}`
            : `${w.charAt(0).toUpperCase() + w.slice(1)} is ${h}:${m < 10 ? '0' + m : m}${m > 40 ? `, want het is ${60 - m} minuten vóór ${UUR[(h + 1) % 12]} uur` : ''}.`,
          pm ? `Het is ${dag}, dus tel 12 uur erbij.` : `Het is ${dag}, dus er komt geen 12 uur bij.`,
          `De digitale tijd is <b>${klok(tt)}</b>.`,
        ),
      },
    );
  const others = [tijdWoord((h + 1) % 12, m), tijdWoord(h, (m + 30) % 60), tijdWoord((h + 11) % 12, m), tijdWoord(h, (60 - m) % 60)];
  return Object.assign(mcTxt(r, w, others), {
    q: p(`Een digitale klok geeft ${klok(tt)} aan.`) + ask('Hoe zeg je deze tijd?'),
    expl: steps(
      `${klok(tt)} is ${pm ? `${h + 12} − 12 = ` : ''}${h} uur en ${m} minuten.`,
      m >= 20 && m <= 40
        ? `Rond het halve uur tel je vanaf ‘half ${UUR[(h + 1) % 12]}’ (${h}:30).`
        : m > 40
          ? `Na kwart voor tel je naar het volgende hele uur: ${UUR[(h + 1) % 12]} uur.`
          : `Tot kwart over tel je vanaf het hele uur: ${UUR[h % 12]} uur.`,
      `Je zegt: <b>${w}</b>.`,
    ),
  });
});

const SOL: Record<Niveau, [string, number, number, number][]> = {
  1: [
    ['kubus', 12, 8, 6],
    ['balk', 12, 8, 6],
  ],
  2: [
    ['piramide met een vierkant als grondvlak', 8, 5, 5],
    ['prisma met een driehoek als grondvlak', 9, 6, 5],
    ['piramide met een driehoek als grondvlak', 6, 4, 4],
  ],
  3: [
    ['prisma met een zeshoek als grondvlak', 18, 12, 8],
    ['piramide met een zeshoek als grondvlak', 12, 7, 7],
    ['prisma met een vijfhoek als grondvlak', 15, 10, 7],
    ['piramide met een vijfhoek als grondvlak', 10, 6, 6],
  ],
};
const TERM: [string, string, string[]][] = [
  ['Hoe heet een vierhoek met vier even lange zijden en geen rechte hoeken?', 'ruit', ['vierkant', 'trapezium', 'rechthoek']],
  ['Hoe heet een vierhoek met precies één paar evenwijdige zijden?', 'trapezium', ['parallellogram', 'ruit', 'vlieger']],
  [
    'Hoe heet een driehoek met precies twee even lange zijden?',
    'gelijkbenige driehoek',
    ['gelijkzijdige driehoek', 'rechthoekige driehoek', 'stomphoekige driehoek'],
  ],
  ['Hoe heet de lijn van het middelpunt van een cirkel naar de rand?', 'straal', ['diameter', 'omtrek', 'koorde']],
  ['Hoe heet een ruimtefiguur met twee even grote cirkels als grondvlak en bovenvlak?', 'cilinder', ['kegel', 'bol', 'prisma']],
  ['Hoe heet een lijn in een vierhoek die twee overstaande hoekpunten verbindt?', 'diagonaal', ['zijde', 'hoogtelijn', 'straal']],
  [
    'Hoe heet een vierhoek met twee paar evenwijdige zijden en geen rechte hoeken?',
    'parallellogram',
    ['trapezium', 'rechthoek', 'vlieger'],
  ],
  ['Hoe heet een ruimtefiguur met een cirkel als grondvlak en één punt als top?', 'kegel', ['cilinder', 'piramide', 'bol']],
];
def('CH08', 'C', 'H', 'C.1', 'Meetkundige figuren en begrippen', (L, r) => {
  if (L === 1 && r.chance(0.4)) {
    const rr = r.int(3, 24);
    if (r.chance(0.5))
      return {
        type: 'num',
        unit: 'cm',
        q: p(`De diameter van een cirkel is ${2 * rr} cm.`) + ask('Hoe lang is de straal?'),
        ans: rr,
        expl: steps(
          'De straal loopt van het middelpunt naar de rand. De diameter loopt van rand tot rand door het middelpunt.',
          `De straal is de helft van de diameter: ${2 * rr} : 2 = <b>${rr}</b> cm.`,
        ),
      };
    return {
      type: 'num',
      unit: 'cm',
      q: p(`De straal van een cirkel is ${rr} cm.`) + ask('Hoe lang is de diameter?'),
      ans: 2 * rr,
      expl: steps(
        'De diameter loopt van rand tot rand door het middelpunt.',
        `De diameter is twee keer de straal: 2 × ${rr} = <b>${2 * rr}</b> cm.`,
      ),
    };
  }
  if (L === 3 && r.chance(0.4)) {
    const [qq, good, bad] = r.pick(TERM);
    return Object.assign(mcTxt(r, good, bad), { q: p(qq), expl: steps(`Het goede begrip is <b>${good}</b>.`) });
  }
  const [name, rib, hoek, vlak] = r.pick(SOL[L]),
    k = r.int(0, 2),
    what = ['ribben', 'hoekpunten', 'vlakken'][k],
    ans = [rib, hoek, vlak][k];
  const n = name.indexOf('zeshoek') > 0 ? 6 : name.indexOf('vijfhoek') > 0 ? 5 : name.indexOf('driehoek') > 0 ? 3 : 4,
    pyr = name.indexOf('piramide') === 0;
  const why =
    L === 1
      ? [
          'Een ' + name + ' heeft 4 ribben onder, 4 ribben boven en 4 opstaande ribben.',
          'Onder en boven liggen elk 4 hoekpunten.',
          'Er zijn 6 vlakken: onder, boven en vier zijvlakken.',
        ][k]
      : pyr
        ? [
            `Het grondvlak heeft ${n} ribben. Naar de top lopen nog eens ${n} ribben.`,
            `Het grondvlak heeft ${n} hoekpunten. De top komt erbij.`,
            `Er is 1 grondvlak en er zijn ${n} driehoekige zijvlakken.`,
          ][k]
        : [
            `Grondvlak en bovenvlak hebben elk ${n} ribben. Daartussen staan ${n} opstaande ribben.`,
            `Grondvlak en bovenvlak hebben elk ${n} hoekpunten.`,
            `Er zijn een grondvlak, een bovenvlak en ${n} zijvlakken.`,
          ][k];
  return { type: 'num', unit: what, q: p(`Hoeveel ${what} heeft een ${name}?`), ans, expl: steps(why, `Samen: <b>${ans}</b> ${what}.`) };
});
