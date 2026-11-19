/* Domein C · Meten en meetkunde · niet-hoofdrekenen */
import { nf, eur, en, klok, NB } from '../../core/notatie';
import { rnd, sum } from '../../core/rekenen';
import { def, RETRY, steps, tip, p, ask, mcNum, mcTxt, nm } from '../../core/opbouw';
import { F } from '../../figuren';
import { f6, whole, tie, cap, mnt } from '../hulp';

const PI = 'Neem voor π het getal 3,14.';

def('CN01', 'C', 'N', 'C.10', 'Tegels leggen', (L, r) => {
  if (L === 1) {
    const t = r.pick([50, 25, 20]),
      a = r.int(3, 6),
      b = r.int(2, a - 1),
      na = (a * 100) / t,
      nb = (b * 100) / t;
    return {
      type: 'num',
      unit: 'tegels',
      q:
        p(`Een rechthoekige vloer is ${a} m lang en ${b} m breed. De vloer wordt betegeld met vierkante tegels van ${t} cm bij ${t} cm.`) +
        ask('Hoeveel tegels zijn er nodig?'),
      ans: na * nb,
      expl: steps(
        `In de lengte passen ${a * 100} : ${t} = ${na} tegels.`,
        `In de breedte passen ${b * 100} : ${t} = ${nb} tegels.`,
        `${na} × ${nb} = <b>${nf(na * nb)}</b> tegels.`,
      ),
    };
  }
  const t = r.pick([30, 40, 60]),
    i = r.int(7, 16),
    j = r.int(5, 12),
    a = (t * i) / 100,
    b = (t * j) / 100,
    n = i * j;
  if ((whole(a) && whole(b)) || j >= i) throw RETRY;
  const vloer = `Een rechthoekige vloer is ${nf(a)} m lang en ${nf(b)} m breed. De vloer wordt betegeld met vierkante tegels van ${t} cm bij ${t} cm.`;
  const st1 = `${nf(a)} m = ${t * i} cm en ${nf(b)} m = ${t * j} cm.`,
    st2 = `In de lengte: ${t * i} : ${t} = ${i} tegels. In de breedte: ${t * j} : ${t} = ${j} tegels.`;
  if (L === 2)
    return {
      type: 'num',
      unit: 'tegels',
      calc: true,
      q: p(vloer) + ask('Hoeveel tegels zijn er nodig?'),
      ans: n,
      expl: steps(st1, st2, `${i} × ${j} = <b>${n}</b> tegels.`) + tip('Reken eerst alles om naar dezelfde eenheid.'),
    };
  const k = r.pick([8, 10, 12]),
    extra = Math.ceil(rnd(n * 1.1, 6)),
    boxes = Math.ceil(extra / k);
  return {
    type: 'num',
    unit: 'dozen',
    calc: true,
    q:
      p(
        `${vloer} De tegelzetter bestelt 10% extra tegels voor snijverlies en rondt dat aantal naar boven af op hele tegels. De tegels worden alleen verkocht in dozen van ${k} stuks.`,
      ) + ask('Hoeveel dozen moet de tegelzetter minstens bestellen?'),
    ans: boxes,
    expl: steps(
      st2,
      `Zonder snijverlies: ${i} × ${j} = ${n} tegels.`,
      `Met 10% extra: ${n} × 1,1 = ${f6(n * 1.1)}${whole(n * 1.1) ? '' : `. Naar boven afgerond: ${extra}`} tegels.`,
      extra % k === 0
        ? `${extra} : ${k} = <b>${boxes}</b> dozen.`
        : `${extra} : ${k} = ${Math.floor(extra / k)} rest ${extra % k}. Er zijn dus minstens <b>${boxes}</b> dozen nodig.`,
    ),
  };
});

def('CN02', 'C', 'N', 'C.10', 'Oppervlakte van samengestelde figuren', (L, r) => {
  if (L === 1) {
    const w = r.pick([4.5, 6, 7.5, 8, 9, 5.5]),
      h = r.pick([3, 3.5, 4, 2.5]),
      ans = rnd(w * h, 2);
    return {
      type: 'num',
      unit: 'm²',
      q: p('Hieronder zie je de plattegrond van een kamer.') + ask('Wat is de oppervlakte van de kamer?'),
      fig: F.rect(nf(w) + NB + 'm', nf(h) + NB + 'm', h / w),
      ans,
      expl: steps('Oppervlakte rechthoek = lengte × breedte.', `${nf(w)} × ${nf(h)} = <b>${nf(ans)}</b> m².`),
    };
  }
  const a = r.int(6, 12),
    b = r.int(5, 9),
    c = r.int(2, a - 3),
    d = r.int(2, b - 2),
    area = a * b - c * d,
    fig = F.lshape({ a: a, b: b, top: a - c, right: b - d, unit: 'm' });
  const base = 'Hieronder zie je de plattegrond van een L-vormige woonkamer. Alle hoeken zijn recht.',
    cut = `Het ontbrekende hoekstuk is ${a} − ${a - c} = ${c} m breed en ${b} − ${b - d} = ${d} m hoog.`;
  if (L === 2)
    return {
      type: 'num',
      unit: 'm²',
      q: p(base) + ask('Wat is de oppervlakte van de woonkamer?'),
      fig,
      ans: area,
      expl: steps(
        `Maak er eerst een hele rechthoek van: ${a} × ${b} = ${a * b} m².`,
        cut,
        `Het hoekstuk is ${c} × ${d} = ${c * d} m².`,
        `${a * b} − ${c * d} = <b>${area}</b> m².`,
      ),
    };
  if (r.chance(0.5))
    return {
      type: 'num',
      unit: 'm',
      q: p(`${base} Langs alle wanden komt een plint.`) + ask('Hoeveel meter plint is er nodig?'),
      fig,
      ans: 2 * (a + b),
      expl:
        steps(
          cut,
          `Tel alle zijden op: ${a} + ${b} + ${a - c} + ${d} + ${c} + ${b - d} = <b>${2 * (a + b)}</b> m.`,
          `Dat is evenveel als de omtrek van de hele rechthoek: 2 × ${a} + 2 × ${b}.`,
        ) + tip('Twee zijden hebben geen maat in de tekening. Die moet je eerst zelf uitrekenen.'),
    };
  const pr = r.pick([18, 24, 29, 32, 36]);
  return {
    type: 'num',
    pre: '€',
    calc: true,
    q: p(`${base} In de kamer komt vloerbedekking van ${eur(pr)} per m².`) + ask('Hoeveel kost de vloerbedekking?'),
    fig,
    ans: area * pr,
    expl: steps(
      `Hele rechthoek: ${a} × ${b} = ${a * b} m².`,
      `${cut} Dat is ${c} × ${d} = ${c * d} m².`,
      `Oppervlakte van de kamer: ${a * b} − ${c * d} = ${area} m².`,
      `${area} × ${eur(pr)} = <b>${eur(area * pr)}</b>.`,
    ),
  };
});

def('CN03', 'C', 'N', 'C.10', 'Wanden verven', (L, r) => {
  const l = r.int(4, 7),
    w = r.int(3, Math.min(5, l - 1)),
    h = r.pick([2.4, 2.5, 2.6, 2.8]),
    o = r.pick([4.8, 5.2, 6, 3.6, 7.4]),
    room = `Een kamer is ${l} m lang, ${w} m breed en ${nf(h)} m hoog.`;
  if (L === 1) {
    const ans = rnd(l * h, 2);
    return {
      type: 'num',
      unit: 'm²',
      q: p(`${room} Eén van de lange wanden wordt behangen.`) + ask('Wat is de oppervlakte van die wand?'),
      ans,
      expl:
        steps('Een wand is een rechthoek: lengte × hoogte.', `${l} × ${nf(h)} = <b>${nf(ans)}</b> m².`) +
        tip('De breedte van de kamer heb je niet nodig.'),
    };
  }
  const walls = rnd(2 * (l + w) * h, 2),
    net = rnd(walls - o, 2);
  if (L === 2)
    return {
      type: 'num',
      unit: 'm²',
      calc: true,
      q:
        p(`${room} De vier wanden worden geverfd. De deur en de ramen zijn samen ${nf(o)} m² en worden niet geverfd.`) +
        ask('Hoeveel m² wordt er geverfd?'),
      ans: net,
      expl:
        steps(
          `Twee lange wanden: 2 × ${l} × ${nf(h)} = ${f6(2 * l * h)} m².`,
          `Twee korte wanden: 2 × ${w} × ${nf(h)} = ${f6(2 * w * h)} m².`,
          `Samen ${nf(walls)} m². Zonder deur en ramen: ${nf(walls)} − ${nf(o)} = <b>${nf(net)}</b> m².`,
        ) + tip('Het plafond en de vloer tellen niet mee.'),
    };
  const cov = r.pick([8, 10]),
    can = r.pick([2.5, 5]),
    lit = rnd((net * 2) / cov, 4),
    cans = Math.ceil(rnd(lit / can, 6));
  return {
    type: 'num',
    unit: 'blikken',
    calc: true,
    q:
      p(
        `${room} De vier wanden worden twee keer geverfd. De deur en de ramen zijn samen ${nf(o)} m² en worden niet geverfd. Met 1 liter verf kun je ${cov} m² één keer verven. De verf wordt verkocht in blikken van ${nf(can)} liter.`,
      ) + ask('Hoeveel blikken verf zijn er minstens nodig?'),
    ans: cans,
    expl:
      steps(
        `Wanden: 2 × (${l} + ${w}) × ${nf(h)} = ${nf(walls)} m². Zonder deur en ramen: ${nf(net)} m².`,
        `Twee lagen: 2 × ${nf(net)} = ${f6(2 * net)} m².`,
        `Verf: ${f6(2 * net)} : ${cov} = ${f6(lit)} liter.`,
        whole(lit / can)
          ? `${f6(lit)} : ${nf(can)} = <b>${cans}</b> ${cans === 1 ? 'blik' : 'blikken'}.`
          : `${f6(lit)} : ${nf(can)} is ongeveer ${nf(rnd(lit / can, 2))}. Je rondt naar boven af: <b>${cans}</b> ${cans === 1 ? 'blik' : 'blikken'}.`,
      ) + tip('Er wordt twee keer geverfd, dus er is twee keer zoveel verf nodig.'),
  };
});

def('CN04', 'C', 'N', 'C.12', 'Inhoud van een balk', (L, r) => {
  if (L < 3) {
    const l = 10 * r.int(4, 12),
      w = 5 * r.int(4, 10),
      h = 5 * r.int(5, 12),
      x = r.pick([4, 5, 6, 8, 10]);
    if (L === 1) {
      const ans = rnd((l * w * h) / 1000, 3);
      return {
        type: 'num',
        unit: 'liter',
        calc: true,
        q:
          p(`Een doos heeft de vorm van een balk van ${l} cm lang, ${w} cm breed en ${h} cm hoog.`) +
          ask('Wat is de inhoud van de doos in liters?'),
        fig: F.cuboid({ l: l, w: w, h: h, unit: 'cm' }),
        ans,
        expl: steps(
          'Inhoud balk = lengte × breedte × hoogte.',
          `${l} × ${w} × ${h} = ${nf(l * w * h)} cm³.`,
          `1 liter = 1.000 cm³, dus de inhoud is <b>${nf(ans)}</b> liter.`,
        ),
      };
    }
    const ans = rnd((l * w * (h - x)) / 1000, 3);
    return {
      type: 'num',
      unit: 'liter',
      calc: true,
      q:
        p(
          `Een aquarium heeft de vorm van een balk van ${l} cm lang, ${w} cm breed en ${h} cm hoog. Het water staat tot ${x} cm onder de rand.`,
        ) + ask('Hoeveel liter water zit er in het aquarium?'),
      fig: F.cuboid({ l: l, w: w, h: h, unit: 'cm', fill: (h - x) / h }),
      ans,
      expl:
        steps(
          `Het water staat ${h} − ${x} = ${h - x} cm hoog.`,
          `${l} × ${w} × ${h - x} = ${nf(l * w * (h - x))} cm³.`,
          `1 liter = 1.000 cm³, dus er zit <b>${nf(ans)}</b> liter water in.`,
        ) + tip('Reken met de hoogte van het water, niet met de hoogte van het aquarium.'),
    };
  }
  const l = r.pick([8, 10, 12, 25]),
    w = r.pick([4, 5, 6, 10]),
    d = r.pick([1.2, 1.5, 1.8, 2]),
    V = rnd(l * w * d, 2);
  if (r.chance(0.5))
    return {
      type: 'num',
      unit: 'liter',
      calc: true,
      q:
        p(`Een zwembad is ${l} m lang en ${w} m breed. Het water is overal ${nf(d)} m diep.`) +
        ask('Hoeveel liter water zit er in het zwembad?'),
      ans: Math.round(V * 1000),
      expl:
        steps(`${l} × ${w} × ${nf(d)} = ${nf(V)} m³.`, `1 m³ = 1.000 liter, dus dat is <b>${nf(Math.round(V * 1000))}</b> liter.`) +
        tip('Je typt het getal zonder punten.'),
    };
  const pump = r.pick([6, 8, 12, 15, 20, 25]),
    hrs = rnd(V / pump, 4);
  if (!whole(hrs * 2)) throw RETRY;
  return {
    type: 'num',
    unit: 'uur',
    calc: true,
    q:
      p(
        `Een leeg zwembad is ${l} m lang en ${w} m breed. Het wordt gevuld tot het water overal ${nf(d)} m diep staat. De pomp levert ${pump} m³ water per uur.`,
      ) + ask('Hoeveel uur duurt het vullen?'),
    ans: hrs,
    expl: steps(`Benodigd water: ${l} × ${w} × ${nf(d)} = ${nf(V)} m³.`, `${nf(V)} : ${pump} = <b>${nf(hrs)}</b> uur.`),
  };
});

def('CN05', 'C', 'N', 'C.11', 'Omtrek van een cirkel', (L, r) => {
  const use = 'Gebruik: omtrek cirkel = π × diameter. ' + PI;
  if (L === 1) {
    const d = 5 * r.int(6, 18),
      ans = rnd(3.14 * d, 2);
    return {
      type: 'num',
      unit: 'cm',
      calc: true,
      q: p(`Een fietswiel heeft een diameter van ${d} cm. ${use}`) + ask('Wat is de omtrek van het wiel?'),
      fig: F.circ(d + NB + 'cm', 'd'),
      ans,
      expl: steps(`Omtrek = 3,14 × ${d}.`, `3,14 × ${d} = <b>${nf(ans)}</b> cm.`),
    };
  }
  if (L === 2) {
    const d = r.pick([50, 60, 70, 80]),
      n = r.pick([100, 200, 500, 1000]),
      ans = rnd((3.14 * d * n) / 100, 2);
    return {
      type: 'num',
      unit: 'm',
      calc: true,
      q:
        p(`Een fietswiel heeft een diameter van ${d} cm. ${use}`) +
        ask(`Hoeveel meter legt de fiets af als het wiel ${nf(n)} keer ronddraait?`),
      ans,
      expl:
        steps(
          `Eén keer rond is 3,14 × ${d} = ${f6(3.14 * d)} cm.`,
          `${nf(n)} keer rond is ${nf(n)} × ${f6(3.14 * d)} = ${f6(3.14 * d * n)} cm.`,
          `Dat is <b>${nf(ans)}</b> m.`,
        ) + tip('Het antwoord wordt in meters gevraagd.'),
    };
  }
  if (r.chance(0.5)) {
    const rr = r.pick([2.5, 3, 3.5, 4, 5, 6]),
      a = r.pick([0.5, 1, 1.5, 2]),
      dd = 2 * (rr + a),
      ans = rnd(3.14 * dd, 2);
    return {
      type: 'num',
      unit: 'm',
      calc: true,
      q:
        p(`Een ronde vijver heeft een straal van ${nf(rr)} m. Op ${nf(a)} m afstand van de rand komt rondom de vijver een hek. ${use}`) +
        ask('Hoeveel meter hek is er nodig?'),
      ans,
      expl:
        steps(
          `De straal van de cirkel van het hek is ${nf(rr)} + ${nf(a)} = ${nf(rr + a)} m.`,
          `De diameter is 2 × ${nf(rr + a)} = ${nf(dd)} m.`,
          `3,14 × ${nf(dd)} = <b>${nf(ans)}</b> m.`,
        ) + tip('Het hek staat verder van het midden dan de rand van de vijver. En: de diameter is twee keer de straal.'),
    };
  }
  const d = r.pick([20, 25, 30, 40, 50, 60, 75]),
    om = rnd(3.14 * d, 2);
  return {
    type: 'num',
    unit: 'cm',
    calc: true,
    q: p(`Een rond tafelblad heeft een omtrek van ${nf(om)} cm. ${use}`) + ask('Wat is de diameter van het tafelblad?'),
    ans: d,
    expl: steps('Omtrek = 3,14 × diameter, dus diameter = omtrek : 3,14.', `${nf(om)} : 3,14 = <b>${d}</b> cm.`),
  };
});

def('CN06', 'C', 'N', 'C.10', 'Oppervlakte van een cirkel', (L, r) => {
  const use = 'Gebruik: oppervlakte cirkel = π × straal × straal. ' + PI;
  if (L === 1) {
    const rr = r.pick([2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20]),
      ans = rnd(3.14 * rr * rr, 2);
    return {
      type: 'num',
      unit: 'cm²',
      calc: true,
      q: p(`Een cirkel heeft een straal van ${rr} cm. ${use}`) + ask('Wat is de oppervlakte van de cirkel?'),
      fig: F.circ(rr + NB + 'cm', 'r'),
      ans,
      expl: steps(`Oppervlakte = 3,14 × ${rr} × ${rr}.`, `3,14 × ${rr * rr} = <b>${nf(ans)}</b> cm².`),
    };
  }
  if (L === 2) {
    const d = r.pick([0.5, 0.6, 0.8, 0.9, 1, 1.1, 1.2, 1.4, 1.5, 1.6, 1.8, 2, 2.2, 2.4, 2.6, 2.8, 3, 3.2, 3.6, 4]),
      rr = d / 2,
      v = 3.14 * rr * rr;
    if (tie(v, 2)) throw RETRY;
    const ans = rnd(v, 2);
    return {
      type: 'num',
      unit: 'm²',
      dec: 2,
      calc: true,
      q:
        p(`Een ronde tafel heeft een diameter van ${nf(d)} m. ${use}`) +
        ask('Wat is de oppervlakte van het tafelblad? Rond af op twee decimalen.'),
      fig: F.circ(nf(d) + NB + 'm', 'd'),
      ans,
      expl:
        steps(
          `De straal is de helft van de diameter: ${nf(d)} : 2 = ${nf(rr)} m.`,
          `3,14 × ${nf(rr)} × ${nf(rr)} = ${f6(v)}.`,
          `Afgerond: <b>${nf(ans, 2)}</b> m².`,
        ) + tip('In de formule staat de straal, niet de diameter.'),
    };
  }
  const s = r.pick([8, 10, 12, 15]),
    d = r.pick([2, 3, 4, 5, 6]),
    rr = d / 2,
    pond = 3.14 * rr * rr,
    v = s * s - pond;
  if (tie(v, 2)) throw RETRY;
  const ans = rnd(v, 2);
  return {
    type: 'num',
    unit: 'm²',
    dec: 2,
    calc: true,
    q:
      p(`Een vierkant gazon heeft zijden van ${s} m. Midden in het gazon ligt een ronde vijver met een diameter van ${d} m. ${use}`) +
      ask('Hoeveel m² gras is er? Rond af op twee decimalen.'),
    ans,
    expl:
      steps(
        `Gazon met vijver: ${s} × ${s} = ${s * s} m².`,
        `Vijver: de straal is ${nf(rr)} m, dus 3,14 × ${nf(rr)} × ${nf(rr)} = ${f6(pond)} m².`,
        f6(v) === nf(ans)
          ? `Gras: ${s * s} − ${f6(pond)} = <b>${nf(ans)}</b> m².`
          : `Gras: ${s * s} − ${f6(pond)} = ${f6(v)}. Afgerond: <b>${nf(ans, 2)}</b> m².`,
      ) + tip('In de formule staat de straal, niet de diameter.'),
  };
});

def('CN07', 'C', 'N', 'C.12', 'Inhoud van een cilinder', (L, r) => {
  if (L === 1) {
    const G = r.pick([0.2, 0.25, 0.3, 0.4, 0.5]),
      h = r.pick([0.8, 0.9, 1, 1.2]),
      ans = rnd(G * h * 1000, 2);
    return {
      type: 'num',
      unit: 'liter',
      calc: true,
      q:
        p(
          `Een regenton heeft de vorm van een cilinder. Het grondvlak heeft een oppervlakte van ${nf(G)} m². De ton is ${nf(h)} m hoog. Gebruik: inhoud cilinder = oppervlakte grondvlak × hoogte.`,
        ) + ask('Hoeveel liter water kan er in de regenton?'),
      ans,
      expl: steps(`${nf(G)} × ${nf(h)} = ${f6(G * h)} m³.`, `1 m³ = 1.000 liter, dus dat is <b>${nf(ans)}</b> liter.`),
    };
  }
  const use = 'Gebruik: inhoud cilinder = π × straal × straal × hoogte. ' + PI;
  if (L === 2) {
    const rr = r.pick([10, 15, 20, 25, 30]),
      h = r.pick([40, 50, 60, 80, 90]),
      cm3 = 3.14 * rr * rr * h,
      v = cm3 / 1000;
    if (tie(v, 0)) throw RETRY;
    const ans = rnd(v, 0);
    return {
      type: 'num',
      unit: 'liter',
      calc: true,
      q:
        p(`Een ton heeft de vorm van een cilinder met een diameter van ${2 * rr} cm en een hoogte van ${h} cm. ${use}`) +
        ask('Hoeveel liter kan er in de ton? Rond af op hele liters.'),
      fig: F.cyl(2 * rr + NB + 'cm', h + NB + 'cm'),
      ans,
      expl:
        steps(
          `De straal is de helft van de diameter: ${2 * rr} : 2 = ${rr} cm.`,
          `3,14 × ${rr} × ${rr} × ${h} = ${f6(cm3)} cm³.`,
          `1 liter = 1.000 cm³: dat is ${f6(v)} liter. Afgerond: <b>${nf(ans)}</b> liter.`,
        ) + tip('In de formule staat de straal, niet de diameter.'),
    };
  }
  const d = r.pick([8, 10, 12]),
    h = r.pick([10, 12, 15]),
    V = r.pick([5, 8, 10, 12]),
    vol = 3.14 * (d / 2) * (d / 2) * h,
    ratio = (V * 1000) / vol,
    n = Math.floor(rnd(ratio, 6));
  if (whole(ratio)) throw RETRY;
  return {
    type: 'num',
    unit: 'blikken',
    calc: true,
    q:
      p(
        `Soepblikken hebben de vorm van een cilinder met een diameter van ${d} cm en een hoogte van ${h} cm. Een kok heeft ${V} liter soep. ${use}`,
      ) + ask('Hoeveel blikken kan de kok helemaal vullen?'),
    fig: F.cyl(d + NB + 'cm', h + NB + 'cm'),
    ans: n,
    expl:
      steps(
        `De straal is ${d} : 2 = ${d / 2} cm.`,
        `Inhoud van één blik: 3,14 × ${d / 2} × ${d / 2} × ${h} = ${f6(vol)} cm³.`,
        `${V} liter = ${nf(V * 1000)} cm³.`,
        `${nf(V * 1000)} : ${f6(vol)} is ongeveer ${nf(ratio, 2)}. Er kunnen <b>${n}</b> blikken helemaal gevuld worden.`,
      ) + tip('Je rondt naar beneden af: het laatste blik raakt niet vol.'),
  };
});

def('CN08', 'C', 'N', 'C.4', 'Schaal op kaart en plattegrond', (L, r) => {
  if (L === 1) {
    const n = r.pick([25000, 50000]),
      x = r.int(6, 18),
      ans = rnd((x * n) / 100000, 3);
    return {
      type: 'num',
      unit: 'km',
      q: p(`Op een wandelkaart met schaal 1 : ${nf(n)} is een route ${x} cm lang.`) + ask('Hoe lang is de route in werkelijkheid?'),
      ans,
      expl: steps(
        `1 cm op de kaart is ${nf(n)} cm in werkelijkheid. Dat is ${f6(n / 100)} m.`,
        `${x} × ${f6(n / 100)} = ${nf((x * n) / 100)} m.`,
        `Dat is <b>${nf(ans)}</b> km.`,
      ),
    };
  }
  if (L === 2) {
    if (r.chance(0.5)) {
      const n = r.pick([50000, 100000, 200000, 25000]),
        ca = r.pick([3, 4, 5, 6, 8]),
        cb = r.pick([1.5, 2, 2.5]),
        A = rnd((ca * n) / 100000, 3),
        B = rnd((cb * n) / 100000, 3);
      return {
        type: 'multi',
        calc: true,
        q:
          p(
            `Een natuurgebied is in werkelijkheid ${nf(A)} km lang en ${nf(B)} km breed. Het wordt getekend op een kaart met schaal 1 : ${nf(n)}.`,
          ) + ask('Hoe lang en hoe breed is het gebied op de kaart?'),
        fields: [
          { ans: ca, unit: 'cm lang' },
          { ans: cb, unit: 'cm breed' },
        ],
        expl: steps(
          `1 km = 100.000 cm. Op de kaart is alles ${nf(n)} keer zo klein.`,
          `Lengte: ${nf(A)} km = ${nf(Math.round(A * 100000))} cm. ${nf(Math.round(A * 100000))} : ${nf(n)} = <b>${nf(ca)}</b> cm.`,
          `Breedte: ${nf(B)} km = ${nf(Math.round(B * 100000))} cm. ${nf(Math.round(B * 100000))} : ${nf(n)} = <b>${nf(cb)}</b> cm.`,
        ),
      };
    }
    const n = r.pick([450000, 250000, 150000, 300000]),
      x = r.pick([2.4, 3.8, 5.2, 6.5, 4.6]),
      ans = rnd((x * n) / 100000, 3);
    return {
      type: 'num',
      unit: 'km',
      calc: true,
      q: p(`Op een kaart met schaal 1 : ${nf(n)} is een meer ${nf(x)} cm lang.`) + ask('Hoe lang is het meer in werkelijkheid?'),
      ans,
      expl: steps(`${nf(x)} × ${nf(n)} = ${nf(Math.round(x * n))} cm.`, `1 km = 100.000 cm, dus dat is <b>${nf(ans)}</b> km.`),
    };
  }
  if (r.chance(0.5)) {
    const n = r.pick([50, 100, 200]),
      a = r.pick([4, 5, 6, 8, 9, 11]),
      b = r.pick([3, 4, 5, 7]),
      ra = (a * n) / 100,
      rb = (b * n) / 100,
      ans = rnd(ra * rb, 2);
    return {
      type: 'num',
      unit: 'm²',
      calc: true,
      q:
        p(`Op een bouwtekening met schaal 1 : ${n} is een kamer ${a} cm lang en ${b} cm breed.`) +
        ask('Wat is de oppervlakte van de kamer in werkelijkheid?'),
      ans,
      expl:
        steps(
          `Lengte: ${a} × ${n} = ${a * n} cm = ${nf(ra)} m.`,
          `Breedte: ${b} × ${n} = ${b * n} cm = ${nf(rb)} m.`,
          `${nf(ra)} × ${nf(rb)} = <b>${nf(ans)}</b> m².`,
        ) + tip('Reken eerst beide zijden om naar de werkelijke lengte. Daarna pas vermenigvuldigen.'),
    };
  }
  const n = r.pick([100, 200, 500]),
    A = r.pick([4, 6, 9, 12, 15]),
    ans = rnd((A * n * n) / 10000, 2);
  return {
    type: 'num',
    unit: 'm²',
    calc: true,
    q:
      p(`Op een tekening met schaal 1 : ${n} heeft een tuin een oppervlakte van ${A} cm².`) +
      ask('Wat is de oppervlakte van de tuin in werkelijkheid?'),
    ans,
    expl:
      steps(
        `Elke lengte wordt ${n} keer zo groot. Een oppervlakte wordt dan ${n} × ${n} = ${nf(n * n)} keer zo groot.`,
        `${A} × ${nf(n * n)} = ${nf(A * n * n)} cm².`,
        `1 m² = 10.000 cm², dus dat is <b>${nf(ans)}</b> m².`,
      ) + tip(`Alleen keer ${n} is niet genoeg: het gaat om een oppervlakte.`),
  };
});

def('CN09', 'C', 'N', 'C.3', 'Snelheid, afstand en tijd', (L, r) => {
  if (L === 1) {
    const v = r.pick([60, 80, 90, 100, 120]),
      t = r.pick([1.5, 2, 2.5]),
      D = v * t;
    return {
      type: 'num',
      unit: 'km/u',
      q:
        p(`Een trein rijdt in ${nf(t)} uur van de ene stad naar de andere. De afstand is ${nf(D)} km.`) +
        ask('Wat is de gemiddelde snelheid van de trein?'),
      ans: v,
      expl: steps('Snelheid = afstand : tijd.', `${nf(D)} : ${nf(t)} = <b>${v}</b> km/u.`),
    };
  }
  if (L === 2) {
    const v = 4 * r.int(15, 30),
      dur = r.pick([45, 75, 90, 105, 135, 150]),
      D = (v * dur) / 60,
      t1 = r.int(6, 15) * 60 + r.pick([7, 12, 23, 38, 47, 52]),
      stops = r.int(2, 5);
    return {
      type: 'num',
      unit: 'km/u',
      calc: true,
      q:
        p(
          `Een trein vertrekt om ${klok(t1)} uur en komt om ${klok(t1 + dur)} uur aan. Onderweg stopt de trein op ${stops} stations. De afstand is ${nf(D)} km.`,
        ) + ask('Wat is de gemiddelde snelheid over de hele reis?'),
      ans: v,
      expl:
        steps(
          `De reis duurt van ${klok(t1)} tot ${klok(t1 + dur)}: ${dur} minuten. Dat is ${nf(dur / 60)} uur.`,
          `${nf(D)} : ${nf(dur / 60)} = <b>${v}</b> km/u.`,
        ) + tip('Voor de gemiddelde snelheid telt de hele reistijd mee, ook het stilstaan op de stations.'),
    };
  }
  const v = r.pick([12, 15, 18, 20, 24]),
    mins = r.pick([40, 50, 75, 80, 100, 110, 140]),
    D = (v * mins) / 60;
  if (!whole(D)) throw RETRY;
  const pause = r.pick([10, 15, 20, 25]),
    t1 = r.int(8, 13) * 60 + 5 * r.int(0, 11),
    good = klok(t1 + mins + pause),
    name = nm(r),
    hrs = D / v;
  return Object.assign(
    mcTxt(r, good, [
      klok(t1 + mins),
      klok(t1 + Math.floor(hrs) * 60 + Math.round((hrs % 1) * 100) + pause),
      klok(t1 + mins + pause + 60),
      klok(t1 + mins - pause),
    ]),
    {
      q:
        p(
          `${name} fietst met een gemiddelde snelheid van ${v} km per uur. ${name} vertrekt om ${klok(t1)} uur voor een tocht van ${D} km en neemt onderweg ${pause} minuten pauze.`,
        ) + ask(`Hoe laat komt ${name} aan?`),
      expl:
        steps(
          `Fietstijd: ${D} : ${v} × 60 = ${mins} minuten.`,
          `Met de pauze erbij: ${mins} + ${pause} = ${mins + pause} minuten. Dat is ${Math.floor((mins + pause) / 60)} uur en ${(mins + pause) % 60} minuten.`,
          `${klok(t1)} + ${mins + pause} minuten = <b>${good}</b> uur.`,
        ) + tip('Een kommagetal in uren is geen tijd in minuten: 1,5 uur is 1 uur en 30 minuten.'),
    },
  );
});

def('CN10', 'C', 'N', 'C.3', 'Samengestelde grootheden', (L, r) => {
  if (L === 1) {
    const d = r.pick([400, 750, 1200, 1500, 2500, 3200]),
      a = r.pick([12, 25, 30, 48, 80]),
      P = d * a;
    return {
      type: 'num',
      unit: 'inwoners per km²',
      calc: true,
      q: p(`Een gemeente heeft ${nf(P)} inwoners en een oppervlakte van ${a} km².`) + ask('Hoeveel inwoners wonen er gemiddeld per km²?'),
      ans: d,
      expl: steps('Deel het aantal inwoners door het aantal km².', `${nf(P)} : ${a} = <b>${nf(d)}</b> inwoners per km².`),
    };
  }
  if (L === 2) {
    if (r.chance(0.5)) {
      const gb = r.pick([1.5, 2.4, 3, 4.5, 6, 7.5]),
        sp = r.pick([10, 20, 25, 40, 50]),
        sec = (gb * 1000) / sp,
        mins = rnd(sec / 60, 4);
      if (!whole(mins * 2)) throw RETRY;
      return {
        type: 'num',
        unit: 'minuten',
        calc: true,
        q:
          p(`${nm(r)} downloadt een film van ${nf(gb)} GB. De downloadsnelheid is ${sp} MB per seconde. Er geldt: 1 GB = 1.000 MB.`) +
          ask('Hoeveel minuten duurt het downloaden?'),
        ans: mins,
        expl:
          steps(
            `${nf(gb)} GB = ${nf(gb * 1000)} MB.`,
            `${nf(gb * 1000)} : ${sp} = ${f6(sec)} seconden.`,
            `${f6(sec)} : 60 = <b>${nf(mins)}</b> ${mins === 1 ? 'minuut' : 'minuten'}.`,
          ) + tip('Het antwoord wordt in minuten gevraagd, niet in seconden.'),
      };
    }
    const rate = r.pick([16, 18, 24, 30, 36]),
      mins = r.pick([7.5, 12.5, 17.5, 22.5, 8.5, 15.5]),
      n = rate * mins;
    if (!whole(n)) throw RETRY;
    return {
      type: 'num',
      unit: 'minuten',
      calc: true,
      q: p(`Een printer drukt ${rate} pagina’s per minuut af.`) + ask(`Hoeveel minuten duurt het afdrukken van ${nf(n)} pagina’s?`),
      ans: mins,
      expl: steps('Deel het aantal pagina’s door het aantal pagina’s per minuut.', `${nf(n)} : ${rate} = <b>${nf(mins)}</b> minuten.`),
    };
  }
  if (r.chance(0.5)) {
    const c = r.pick([5, 5.6, 6.4, 4, 8]),
      T = r.pick([40, 42, 48, 56, 64]),
      km = rnd((T / c) * 100, 4);
    if (!whole(km)) throw RETRY;
    return {
      type: 'num',
      unit: 'km',
      calc: true,
      q:
        p(`Een auto verbruikt gemiddeld ${nf(c)} liter benzine per 100 km. De tank is helemaal vol en bevat ${T} liter.`) +
        ask('Hoeveel kilometer kan de auto met deze tank rijden?'),
      ans: km,
      expl: steps(
        `Met ${nf(c)} liter rijdt de auto 100 km.`,
        `${T} : ${nf(c)} = ${f6(T / c)}. De tank is goed voor ${f6(T / c)} keer 100 km.`,
        `Dat is <b>${nf(km)}</b> km.`,
      ),
    };
  }
  const flow = r.pick([8, 12, 15, 16]),
    V = r.pick([150, 180, 200, 240]),
    part = r.pick<[string, number]>([
      ['voor driekwart', 0.75],
      ['voor de helft', 0.5],
      ['voor twee derde', 2 / 3],
    ]),
    need = rnd(V * part[1], 4),
    mins = rnd(need / flow, 4);
  if (!whole(mins * 4) || !whole(need)) throw RETRY;
  return {
    type: 'num',
    unit: 'minuten',
    calc: true,
    q:
      p(`Uit een kraan stroomt ${flow} liter water per minuut. Een bad heeft een inhoud van ${V} liter en wordt ${part[0]} gevuld.`) +
      ask('Hoeveel minuten duurt dat?'),
    ans: mins,
    expl:
      steps(`Er moet ${nf(need)} liter water in het bad.`, `${nf(need)} : ${flow} = <b>${nf(mins)}</b> minuten.`) +
      tip('Het bad wordt niet helemaal gevuld.'),
  };
});

def('CN11', 'C', 'N', 'C.2', 'Maten omrekenen in een verhaal', (L, r) => {
  if (L === 1) {
    const V = r.pick([0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.4, 1.5, 1.6, 1.8, 2]),
      kw = r.pick([60, 65, 70, 75, 80, 85, 90]),
      lit = Math.round(V * 1000),
      n = Math.ceil(lit / kw);
    if (lit % kw === 0) throw RETRY;
    return {
      type: 'num',
      unit: 'keer',
      q:
        p(`Een tuinman moet ${nf(V)} m³ zand verplaatsen. In zijn kruiwagen past ${kw} liter zand.`) +
        ask('Hoeveel keer moet de tuinman minstens lopen met de kruiwagen?'),
      ans: n,
      expl: steps(
        `1 m³ = 1.000 liter, dus ${nf(V)} m³ = ${nf(lit)} liter.`,
        `${nf(lit)} : ${kw} = ${Math.floor(lit / kw)} rest ${lit % kw}.`,
        `Voor het laatste beetje moet hij nog een keer lopen: <b>${n}</b> keer.`,
      ),
    };
  }
  if (L === 2) {
    const kav = r.pick([350, 400, 600, 700, 800]),
      n = r.int(12, 60),
      m2 = kav * n;
    if (m2 % 100 !== 0) throw RETRY;
    return {
      type: 'num',
      unit: 'kavels',
      calc: true,
      q: p(`Een stuk bouwgrond van ${nf(m2 / 10000)} hectare wordt verdeeld in kavels van ${kav} m².`) + ask('Hoeveel kavels worden dat?'),
      ans: n,
      expl: steps(`1 hectare = 10.000 m², dus ${nf(m2 / 10000)} ha = ${nf(m2)} m².`, `${nf(m2)} : ${kav} = <b>${n}</b> kavels.`),
    };
  }
  const mm = r.pick([6, 8, 12, 15, 25]),
    A = r.pick([45, 60, 80, 120, 150]);
  if (r.chance(0.5))
    return {
      type: 'num',
      unit: 'liter',
      calc: true,
      q:
        p(`Tijdens een bui valt er ${mm} mm regen. Het regenwater van een plat dak van ${A} m² wordt opgevangen.`) +
        ask('Hoeveel liter regenwater is dat?'),
      ans: mm * A,
      expl: steps(
        `${mm} mm = ${nf(mm / 1000)} m.`,
        `Inhoud: ${A} × ${nf(mm / 1000)} = ${f6((A * mm) / 1000)} m³.`,
        `1 m³ = 1.000 liter, dus dat is <b>${nf(mm * A)}</b> liter.`,
        'Handig om te onthouden: 1 mm regen op 1 m² is precies 1 liter.',
      ),
    };
  const ton = r.pick([200, 250, 400]),
    tot = mm * A,
    n = Math.floor(tot / ton);
  if (tot % ton === 0 || n < 1) throw RETRY;
  return {
    type: 'num',
    unit: 'regentonnen',
    calc: true,
    q:
      p(`Tijdens een bui valt er ${mm} mm regen op een plat dak van ${A} m². Het water wordt opgevangen in regentonnen van ${ton} liter.`) +
      ask('Hoeveel regentonnen raken helemaal vol?'),
    ans: n,
    expl: steps(
      `1 mm regen op 1 m² is 1 liter. Er valt dus ${mm} × ${A} = ${nf(tot)} liter.`,
      `${nf(tot)} : ${ton} = ${n} rest ${tot % ton}.`,
      `Er ${n === 1 ? 'raakt <b>1</b> regenton' : 'raken <b>' + n + '</b> regentonnen'} helemaal vol.`,
    ),
  };
});

def('CN12', 'C', 'N', 'C.9', 'Rekenen met kloktijden', (L, r) => {
  const name = nm(r);
  if (L === 1) {
    const t0 = r.int(6, 9) * 60 + r.pick([5, 10, 20, 35, 40, 50]),
      a = r.int(8, 22),
      bh = r.int(1, 2),
      bm = r.pick([5, 15, 25, 35, 40, 50]),
      c = r.int(6, 15),
      tot = a + bh * 60 + bm + c,
      good = klok(t0 + tot);
    return Object.assign(mcTxt(r, good, [klok(t0 + tot - c), klok(t0 + tot - a), klok(t0 + tot + 60), klok(t0 + tot - 10)]), {
      q:
        p(
          `${name} vertrekt om ${klok(t0)} uur van huis. Eerst fietst ${name} ${a} minuten naar het station. De treinreis duurt ${bh} uur en ${bm} minuten. Daarna is het nog ${c} minuten lopen naar school.`,
        ) + ask(`Hoe laat komt ${name} op school aan?`),
      expl:
        steps(
          `Tel de reistijden op: ${a} minuten + ${bh} uur en ${bm} minuten + ${c} minuten = ${bh} uur en ${a + bm + c} minuten.`,
          a + bm + c >= 60
            ? `Dat is ${bh + Math.floor((a + bm + c) / 60)} uur en ${mnt((a + bm + c) % 60)}.`
            : 'Minder dan 60 minuten, dus omrekenen is niet nodig.',
          `${klok(t0)} + ${Math.floor(tot / 60)} uur en ${mnt(tot % 60)} = <b>${good}</b> uur.`,
        ) + tip('Alle drie de delen van de reis tellen mee.'),
    });
  }
  if (L === 2) {
    const first = r.int(7, 8) * 60 + r.pick([2, 12, 17, 22, 42]),
      iv = r.pick([20, 30]),
      ride = r.int(18, 34),
      walk = r.int(8, 16),
      deps = [0, 1, 2, 3].map((i) => first + i * iv),
      arrs = deps.map((d) => d + ride),
      k = r.int(1, 2),
      deadline = arrs[k] + r.int(3, Math.min(iv - 3, 12));
    const good = klok(deps[k] - walk),
      fig = F.table(
        ['Vertrek halte Dorpsplein', 'Aankomst station'],
        deps.map((d, i) => [klok(d), klok(arrs[i])]),
        { rowHead: false },
      );
    return Object.assign(
      mcTxt(r, good, [klok(deps[k]), klok(deps[k + 1] - walk), klok(deps[k - 1] - walk), klok(deadline - ride - walk)]),
      {
        q:
          p(
            `${name} moet uiterlijk om ${klok(deadline)} uur op het station zijn. De bus rijdt volgens de dienstregeling hieronder. Van huis naar de halte Dorpsplein is het ${walk} minuten lopen.`,
          ) + ask(`Hoe laat moet ${name} uiterlijk van huis vertrekken?`),
        fig,
        expl:
          steps(
            `Zoek de laatste bus die op tijd is. De bus van ${klok(deps[k])} komt om ${klok(arrs[k])} aan. De bus daarna komt om ${klok(arrs[k + 1])} aan en dat is te laat.`,
            `${name} moet ${walk} minuten voor het vertrek van de bus van huis gaan.`,
            `${klok(deps[k])} − ${walk} minuten = <b>${good}</b> uur.`,
          ) + tip('Uiterlijk betekent: zo laat mogelijk, maar nog wel op tijd.'),
      },
    );
  }
  const st = r.pick([1290, 1320, 1335, 1365, 1380]),
    en2 = r.pick([360, 390, 435, 465]),
    pause = r.pick([30, 45, 60]),
    tot = 1440 - st + en2,
    work = tot - pause,
    ans = work / 60;
  return {
    type: 'num',
    unit: 'uur',
    q:
      p(
        `${name} werkt in de nachtdienst van ${klok(st)} uur tot ${klok(en2)} uur de volgende ochtend. Tijdens de dienst heeft ${name} ${pause} minuten pauze. De pauze telt niet mee als werktijd.`,
      ) + ask(`Hoeveel uur werkt ${name}? Geef je antwoord in uren, zo nodig als kommagetal.`),
    ans,
    expl:
      steps(
        `Van ${klok(st)} tot middernacht is ${1440 - st} minuten.`,
        `Van middernacht tot ${klok(en2)} is ${en2} minuten.`,
        `Samen ${tot} minuten. Zonder pauze: ${tot} − ${pause} = ${work} minuten.`,
        `${work} : 60 = <b>${nf(ans)}</b> uur.`,
      ) +
      (work % 60
        ? tip(
            `${Math.floor(work / 60)} uur en ${work % 60} minuten schrijf je als ${nf(ans)} uur, niet als ${Math.floor(work / 60)},${work % 60}.`,
          )
        : ''),
  };
});

def('CN13', 'C', 'N', 'C.13', 'Vergroten: oppervlakte en inhoud', (L, r) => {
  const k = r.pick([2, 3, 4, 5, 6, 8, 10]);
  if (L === 1) {
    if (r.chance(0.6))
      return {
        type: 'num',
        unit: 'keer',
        q: p(`De zijden van een vierkant worden ${k} keer zo lang.`) + ask('Hoeveel keer zo groot wordt de oppervlakte?'),
        ans: k * k,
        expl: steps(
          'Neem als voorbeeld een vierkant van 1 bij 1. De oppervlakte is 1.',
          `Na het vergroten is het ${k} bij ${k}. De oppervlakte is ${k} × ${k} = ${k * k}.`,
          `De oppervlakte wordt <b>${k * k}</b> keer zo groot.`,
        ),
      };
    return {
      type: 'num',
      unit: 'keer',
      q: p(`De lengte en de breedte van een rechthoek worden allebei ${k} keer zo groot.`) + ask('Hoeveel keer zo groot wordt de omtrek?'),
      ans: k,
      expl:
        steps(`De omtrek is een lengte. Elke zijde wordt ${k} keer zo lang.`, `De omtrek wordt dus ook <b>${k}</b> keer zo groot.`) +
        tip(`Bij de oppervlakte is dat anders: die wordt ${k * k} keer zo groot.`),
    };
  }
  if (L === 2) {
    const f = r.int(1, 3);
    if (f === 1)
      return {
        type: 'num',
        unit: 'keer',
        q: p(`De ribben van een kubus worden ${k} keer zo lang.`) + ask('Hoeveel keer zo groot wordt de inhoud?'),
        ans: k * k * k,
        expl: steps(
          'Neem als voorbeeld een kubus van 1 bij 1 bij 1. De inhoud is 1.',
          `Na het vergroten: ${k} × ${k} × ${k} = ${nf(k * k * k)}.`,
          `De inhoud wordt <b>${nf(k * k * k)}</b> keer zo groot.`,
        ),
      };
    if (f === 2)
      return {
        type: 'num',
        unit: 'keer',
        q:
          p(`Van een balk worden de lengte en de breedte ${k} keer zo groot. De hoogte blijft gelijk.`) +
          ask('Hoeveel keer zo groot wordt de inhoud?'),
        ans: k * k,
        expl:
          steps(
            'Inhoud = lengte × breedte × hoogte.',
            `De lengte en de breedte worden elk ${k} keer zo groot, de hoogte niet: ${k} × ${k} × 1 = ${k * k}.`,
            `De inhoud wordt <b>${k * k}</b> keer zo groot.`,
          ) + tip(`De hoogte verandert niet, dus het is geen ${nf(k * k * k)} keer.`),
      };
    return {
      type: 'num',
      unit: 'keer',
      q:
        p(`De ribben van een kubus worden ${k} keer zo lang.`) +
        ask('Hoeveel keer zo groot wordt de totale oppervlakte van de zes zijvlakken?'),
      ans: k * k,
      expl: steps(
        `Elk zijvlak is een vierkant waarvan de zijden ${k} keer zo lang worden.`,
        `De oppervlakte van elk vlak wordt ${k} × ${k} = ${k * k} keer zo groot.`,
        `De totale oppervlakte wordt dus ook <b>${k * k}</b> keer zo groot.`,
      ),
    };
  }
  const f = r.int(1, 3);
  if (f === 1) {
    const n = r.pick([10, 20, 50]),
      m = r.pick([0.5, 1, 2, 4]),
      ans = m * n * n * n;
    return {
      type: 'num',
      unit: 'liter',
      calc: true,
      q:
        p(`Van een vijver is een schaalmodel gemaakt met schaal 1 : ${n}. Het model kan ${nf(m)} liter water bevatten.`) +
        ask('Hoeveel liter water kan de echte vijver bevatten?'),
      ans,
      expl:
        steps(
          `Elke lengte is in het echt ${n} keer zo groot.`,
          `De inhoud is dan ${n} × ${n} × ${n} = ${nf(n * n * n)} keer zo groot.`,
          `${nf(m)} × ${nf(n * n * n)} = <b>${nf(ans)}</b> liter.`,
        ) + tip(`Alleen keer ${n} is niet genoeg: het gaat om een inhoud.`),
    };
  }
  if (f === 2) {
    const d = r.pick([20, 24, 25, 30]),
      kk = r.pick([2, 3]),
      pr = r.pick([6, 7, 8]);
    return {
      type: 'num',
      unit: 'keer',
      q:
        p(
          `Een kleine pizza heeft een diameter van ${d} cm en kost ${eur(pr)}. Een grote pizza heeft een diameter van ${d * kk} cm. Beide pizza’s zijn even dik.`,
        ) + ask('Hoeveel keer zoveel pizza krijg je bij de grote pizza?'),
      ans: kk * kk,
      expl:
        steps(
          `De diameter is ${kk} keer zo groot.`,
          `De oppervlakte wordt dan ${kk} × ${kk} = ${kk * kk} keer zo groot.`,
          `Je krijgt <b>${kk * kk}</b> keer zoveel pizza.`,
        ) + tip('De prijs heb je niet nodig.'),
    };
  }
  const pc = r.pick([150, 200, 120, 250, 300]),
    ans = rnd((pc * pc) / 10000, 4);
  return {
    type: 'num',
    unit: 'keer',
    calc: true,
    q:
      p(
        `Een foto wordt afgedrukt op ${pc}% van de oorspronkelijke grootte. De lengte en de breedte worden dus allebei ${nf(pc / 100)} keer zo groot.`,
      ) + ask('Hoeveel keer zo groot wordt de oppervlakte van de foto?'),
    ans,
    expl: steps(
      `De lengte en de breedte worden elk ${nf(pc / 100)} keer zo groot.`,
      `${nf(pc / 100)} × ${nf(pc / 100)} = ${nf(ans)}.`,
      `De oppervlakte wordt <b>${nf(ans)}</b> keer zo groot.`,
    ),
  };
});

const pairs = (A: number): [number, number][] => {
  const out: [number, number][] = [];
  for (let i = 1; i * i <= A; i++) if (A % i === 0) out.push([i, A / i]);
  return out;
};
def('CN14', 'C', 'N', 'C.13', 'Rechthoeken met vaste oppervlakte of omtrek', (L, r) => {
  if (L === 1) {
    const A = r.pick([12, 16, 18, 20, 24, 28, 30, 32, 36, 40, 42, 45, 48, 50, 54, 56, 60, 64, 72]),
      ps = pairs(A);
    return {
      type: 'num',
      unit: 'rechthoeken',
      q:
        p(
          `Je tekent rechthoeken met een oppervlakte van ${A} cm². De zijden zijn hele centimeters. Een rechthoek van 1 bij ${A} is dezelfde als een rechthoek van ${A} bij 1. Een vierkant telt ook mee.`,
        ) + ask('Hoeveel verschillende rechthoeken kun je tekenen?'),
      ans: ps.length,
      expl: steps(
        `Zoek alle paren hele getallen die vermenigvuldigd ${A} geven.`,
        ps.map((x) => `${x[0]} × ${x[1]}`).join(', ') + '.',
        `Dat zijn <b>${ps.length}</b> rechthoeken.`,
      ),
    };
  }
  if (L === 2) {
    const A = r.pick([12, 18, 20, 24, 30, 36, 40, 48]),
      ps = pairs(A),
      per = ps.map((x) => 2 * (x[0] + x[1])),
      cand = [];
    for (let v = Math.min.apply(null, per) + 2; v < Math.max.apply(null, per); v += 2) if (per.indexOf(v) < 0) cand.push(v);
    if (!cand.length) throw RETRY;
    const bad = r.pick(cand);
    return Object.assign(
      mcNum(r, bad, r.sample(per, 3), (v) => v + NB + 'cm'),
      {
        q:
          p(`Een rechthoek heeft een oppervlakte van ${A} cm². De zijden zijn hele centimeters.`) +
          ask('Welke omtrek kan deze rechthoek <b>niet</b> hebben?'),
        expl: steps(
          `Zoek alle rechthoeken met oppervlakte ${A} en bereken van elk de omtrek.`,
          ps.map((x) => `${x[0]} bij ${x[1]}: omtrek ${2 * (x[0] + x[1])} cm`).join('; ') + '.',
          `Een omtrek van <b>${bad}${NB}cm</b> komt daar niet bij voor.`,
        ),
      },
    );
  }
  if (r.chance(0.5)) {
    const P = r.pick([20, 24, 26, 28, 30, 32, 36]),
      s = P / 2,
      a = Math.floor(s / 2),
      b = s - a;
    return {
      type: 'num',
      unit: 'cm²',
      q:
        p(`Een rechthoek heeft een omtrek van ${P} cm. De zijden zijn hele centimeters.`) +
        ask('Wat is de grootste oppervlakte die deze rechthoek kan hebben?'),
      ans: a * b,
      expl:
        steps(
          `Lengte en breedte zijn samen ${P} : 2 = ${s} cm.`,
          `De oppervlakte is het grootst als lengte en breedte zo dicht mogelijk bij elkaar liggen: ${b} bij ${a}.`,
          `${b} × ${a} = <b>${a * b}</b> cm².`,
        ) + (a === b ? tip('Een vierkant is ook een rechthoek.') : ''),
    };
  }
  const A = r.pick([24, 30, 36, 48, 60, 72]),
    ps = pairs(A),
    best = ps[ps.length - 1],
    ans = 2 * (best[0] + best[1]);
  return {
    type: 'num',
    unit: 'cm',
    q:
      p(`Een rechthoek heeft een oppervlakte van ${A} cm². De zijden zijn hele centimeters.`) +
      ask('Wat is de kleinste omtrek die deze rechthoek kan hebben?'),
    ans,
    expl: steps(
      `Mogelijke rechthoeken: ${ps.map((x) => `${x[0]} bij ${x[1]}`).join(', ')}.`,
      `De omtrek is het kleinst als lengte en breedte zo dicht mogelijk bij elkaar liggen: ${best[0]} bij ${best[1]}.`,
      `2 × ${best[0]} + 2 × ${best[1]} = <b>${ans}</b> cm.`,
    ),
  };
});

def('CN15', 'C', 'N', 'C.7', 'Blokkenbouwsel en aanzichten', (L, r) => {
  const rows = r.pick([2, 3]),
    cols = 3,
    m: number[][] = [];
  for (let i = 0; i < rows; i++) {
    const row: number[] = [];
    for (let j = 0; j < cols; j++) row.push(r.int(1, 4));
    m.push(row);
  }
  const tot = sum(m.map(sum)),
    colMax = [0, 1, 2].map((j) =>
      Math.max.apply(
        null,
        m.map((row) => row[j]),
      ),
    ),
    rowMax = m.map((row) => Math.max.apply(null, row)),
    mx = Math.max.apply(null, colMax);
  const base =
      'Hieronder zie je de plattegrond van een blokkenbouwsel. Elk getal geeft aan hoeveel blokjes er op die plek op elkaar staan.',
    fig = F.hgrid(m);
  if (L === 1)
    return {
      type: 'num',
      unit: 'blokjes',
      q: p(base) + ask('Uit hoeveel blokjes bestaat het bouwsel?'),
      fig,
      ans: tot,
      expl: steps('Tel alle getallen bij elkaar op.', `${m.map((row) => row.join(' + ')).join(' + ')} = <b>${tot}</b> blokjes.`),
    };
  if (L === 2)
    return {
      type: 'num',
      unit: 'vierkantjes',
      q: p(`${base} Je kijkt van voren tegen het bouwsel aan.`) + ask('Uit hoeveel vierkantjes bestaat het vooraanzicht?'),
      fig,
      ans: sum(colMax),
      expl: steps(
        'Van voren zie je per kolom alleen de hoogste stapel. Lagere stapels in dezelfde kolom vallen daarachter of daarvoor weg.',
        `De hoogste stapels per kolom, van links naar rechts: ${colMax.join(', ')}.`,
        `${colMax.join(' + ')} = <b>${sum(colMax)}</b> vierkantjes.`,
      ),
    };
  if (r.chance(0.5))
    return {
      type: 'num',
      unit: 'vierkantjes',
      q: p(`${base} Je kijkt van rechts tegen het bouwsel aan.`) + ask('Uit hoeveel vierkantjes bestaat het rechterzijaanzicht?'),
      fig,
      ans: sum(rowMax),
      expl: steps(
        'Van opzij zie je per rij alleen de hoogste stapel.',
        `De hoogste stapels per rij, van achter naar voor: ${rowMax.join(', ')}.`,
        `${rowMax.join(' + ')} = <b>${sum(rowMax)}</b> vierkantjes.`,
      ),
    };
  const full = rows * cols * mx,
    ans = full - tot;
  if (ans < 3) throw RETRY;
  return {
    type: 'num',
    unit: 'blokjes',
    q:
      p(`${base} Je vult het bouwsel aan tot een massieve balk van ${cols} blokjes breed, ${rows} blokjes diep en ${mx} blokjes hoog.`) +
      ask('Hoeveel blokjes moet je toevoegen?'),
    fig,
    ans,
    expl: steps(
      `De balk bestaat uit ${cols} × ${rows} × ${mx} = ${full} blokjes.`,
      `Het bouwsel heeft nu ${tot} blokjes.`,
      `${full} − ${tot} = <b>${ans}</b> blokjes.`,
    ),
  };
});

const AXES: [string, number][] = [
  ['een rechthoek die geen vierkant is', 2],
  ['een vierkant', 4],
  ['een gelijkzijdige driehoek', 3],
  ['een gelijkbenige driehoek die niet gelijkzijdig is', 1],
  ['een regelmatige zeshoek', 6],
  ['een ruit die geen vierkant is', 2],
  ['een regelmatige vijfhoek', 5],
  ['een parallellogram dat geen ruit en geen rechthoek is', 0],
  ['een regelmatige achthoek', 8],
  ['een vlieger die geen ruit is', 1],
];
type Symm = 'line' | 'both' | 'rot' | 'none';
const LET: Record<Symm, string> = { line: 'AMTUVWY', both: 'HIOX', rot: 'NSZ', none: 'FGJLPR' };
def('CN16', 'C', 'N', 'C.6', 'Symmetrie', (L, r) => {
  if (L === 1) {
    const [sh, n] = r.pick(AXES);
    return {
      type: 'num',
      q: p(`Hoeveel symmetrieassen heeft ${sh}?`),
      ans: n,
      expl: steps(
        'Een symmetrieas is een lijn waarlangs je de figuur kunt dubbelvouwen, zodat de twee helften precies op elkaar vallen.',
        n === 0
          ? `Bij ${sh} lukt dat nergens: <b>0</b> symmetrieassen.`
          : `${cap(sh)} heeft <b>${n}</b> ${n === 1 ? 'symmetrieas' : 'symmetrieassen'}.`,
      ),
    };
  }
  if (L === 2) {
    const kind = r.pick(['both', 'rot', 'none', 'line'] as const),
      ltr = (ch: string) => `<span class="ltr">${ch}</span>`,
      good = ltr(r.pick(LET[kind].split('')));
    const others = (['line', 'both', 'rot', 'none'] as const).filter((k) => k !== kind).map((k) => ltr(r.pick(LET[k].split(''))));
    const Q = {
      both: 'Welke hoofdletter is lijnsymmetrisch én draaisymmetrisch?',
      rot: 'Welke hoofdletter is wel draaisymmetrisch, maar niet lijnsymmetrisch?',
      none: 'Welke hoofdletter is niet lijnsymmetrisch en ook niet draaisymmetrisch?',
      line: 'Welke hoofdletter is wel lijnsymmetrisch, maar niet draaisymmetrisch?',
    }[kind];
    return Object.assign(mcTxt(r, good, others), {
      q: p(Q) + p('Ga uit van rechte blokletters, zoals in de antwoorden hieronder.'),
      expl: steps(
        'Lijnsymmetrisch: je kunt de letter dubbelvouwen zodat de helften op elkaar vallen. Draaisymmetrisch: na een halve slag draaien ziet de letter er hetzelfde uit.',
        'Alleen lijnsymmetrisch zijn bijvoorbeeld A, M en T. Alleen draaisymmetrisch zijn N, S en Z. Allebei zijn H, I, O en X. Geen van beide: F, G, J, L, P en R.',
        `Het goede antwoord is <b>${good}</b>.`,
      ),
    });
  }
  if (r.chance(0.6)) {
    const [sh, n] = r.pick<[string, number]>([
      ['een gelijkzijdige driehoek', 3],
      ['een vierkant', 4],
      ['een regelmatige vijfhoek', 5],
      ['een regelmatige zeshoek', 6],
      ['een regelmatige achthoek', 8],
      ['een regelmatige negenhoek', 9],
      ['een regelmatige tienhoek', 10],
      ['een regelmatige twaalfhoek', 12],
    ]);
    return {
      type: 'num',
      unit: 'graden',
      q:
        p(`Je draait ${sh} om het middelpunt.`) +
        ask('Over hoeveel graden moet je minstens draaien totdat de figuur weer precies op zichzelf past?'),
      ans: 360 / n,
      expl: steps(
        `Een hele draai is 360 graden. ${cap(sh)} past tijdens een hele draai ${n} keer op zichzelf.`,
        `360 : ${n} = <b>${360 / n}</b> graden.`,
      ),
    };
  }
  const n = r.pick([7, 9, 10, 12, 15, 20]);
  return {
    type: 'num',
    q: p(`Hoeveel symmetrieassen heeft een regelmatige ${n}-hoek?`),
    ans: n,
    expl: steps(
      'Een regelmatige veelhoek heeft evenveel symmetrieassen als hoeken.',
      `Een regelmatige ${n}-hoek heeft <b>${n}</b> symmetrieassen.`,
    ),
  };
});

const PLACES: [string, string][] = [
  ['S', 'de school'],
  ['B', 'de bibliotheek'],
  ['Z', 'het zwembad'],
  ['P', 'het park'],
  ['M', 'het museum'],
  ['W', 'de winkel'],
];
const cell = (c: number, rw: number): string => 'ABCDEFGHIJ'.charAt(c) + (rw + 1);
const DIRS: [string, number, number][] = [
  ['het noorden', 0, 1],
  ['het oosten', 1, 0],
  ['het zuiden', 0, -1],
  ['het westen', -1, 0],
];
// stip op de kaart met naam van de plek
interface Plek {
  c: number;
  r: number;
  t: string;
  name: string;
}
def('CN17', 'C', 'N', 'C.8', 'Vakken op een kaart en routes', (L, r) => {
  const n = r.pick([6, 7]),
    used = new Set<string>(),
    marks: Plek[] = [];
  r.sample(PLACES, 3).forEach((x) => {
    let c, rw;
    do {
      c = r.int(0, n - 1);
      rw = r.int(0, n - 1);
    } while (used.has(c + ',' + rw));
    used.add(c + ',' + rw);
    marks.push({ c: c, r: rw, t: x[0], name: x[1] });
  });
  const fig = F.map({ n: n, marks: marks, compass: true }),
    legend = `Op de kaart staan ${en(marks.map((m) => `${m.name} (${m.t})`))}.`,
    st = marks[0];
  if (L === 1) {
    const good = cell(st.c, st.r);
    return Object.assign(
      mcTxt(r, good, [cell(st.r, st.c), cell(marks[1].c, marks[1].r), cell(marks[2].c, marks[2].r), cell(st.c, (st.r + 1) % n)]),
      {
        q: p(`${legend} Elk vak heeft een letter en een cijfer, bijvoorbeeld A1.`) + ask(`In welk vak ligt ${st.name}?`),
        fig,
        expl: steps(
          `Zoek de ${st.t} op de kaart. Kijk recht naar beneden voor de letter: ${'ABCDEFGHIJ'.charAt(st.c)}.`,
          `Kijk recht naar links voor het cijfer: ${st.r + 1}.`,
          `${cap(st.name)} ligt in vak <b>${good}</b>.`,
        ),
      },
    );
  }
  const legs: [number, number][] = [],
    nLegs = L === 2 ? 3 : 4;
  let c = st.c,
    rw = st.r,
    last = -1,
    tries = 0;
  const trail: string[] = [];
  while (legs.length < nLegs) {
    if (++tries > 80) throw RETRY;
    const di = r.int(0, 3);
    if (di === last || (last >= 0 && di === (last + 2) % 4)) continue;
    const k = r.int(1, 3),
      nc = c + DIRS[di][1] * k,
      nr = rw + DIRS[di][2] * k;
    if (nc < 0 || nc >= n || nr < 0 || nr >= n) continue;
    legs.push([di, k]);
    c = nc;
    rw = nr;
    last = di;
    trail.push(cell(c, rw));
  }
  if (c === st.c && rw === st.r) throw RETRY;
  const route = legs.map((g, i) => `${i === 0 ? '' : 'dan '}${g[1]} ${g[1] === 1 ? 'vak' : 'vakken'} naar ${DIRS[g[0]][0]}`).join(', ');
  if (L === 2) {
    const walk = (fe: boolean, fn: boolean) => {
      let cc = st.c,
        rr = st.r;
      legs.forEach((g) => {
        cc += DIRS[g[0]][1] * g[1] * (fe ? -1 : 1);
        rr += DIRS[g[0]][2] * g[1] * (fn ? -1 : 1);
      });
      return cc >= 0 && cc < n && rr >= 0 && rr < n ? cell(cc, rr) : null;
    };
    const good = cell(c, rw);
    return Object.assign(
      mcTxt(r, good, [
        walk(true, false),
        walk(false, true),
        walk(true, true),
        cell(Math.min(n - 1, c + 1), rw),
        cell(c, Math.max(0, rw - 1)),
        cell(Math.max(0, c - 1), rw),
      ]),
      {
        et: 'C.5',
        q: p(`${legend} Het noorden is boven. Je begint bij ${st.name} (${st.t}) en loopt ${route}.`) + ask('In welk vak kom je uit?'),
        fig,
        expl: steps(
          `Je begint in vak ${cell(st.c, st.r)}. Noorden is omhoog, oosten is naar rechts, zuiden is omlaag en westen is naar links.`,
          `Volg de stappen één voor één. Je komt achtereenvolgens in ${trail.join(', ')}.`,
          `Je komt uit in vak <b>${good}</b>.`,
        ),
      },
    );
  }
  const side = r.pick([200, 250, 400, 500]),
    tot = sum(legs.map((g) => g[1])),
    ans = tot * side;
  return {
    type: 'num',
    unit: 'm',
    et: 'C.5',
    q:
      p(
        `${legend} Het noorden is boven. Elk vak is ${side} m bij ${side} m. Je begint in het midden van het vak van ${st.name} (${st.t}) en loopt ${route}. Je loopt steeds van het midden van een vak naar het midden van het volgende vak.`,
      ) + ask('Hoeveel meter heb je in totaal gelopen?'),
    fig,
    ans,
    expl:
      steps(
        `Tel het aantal vakken dat je opschuift: ${legs.map((g) => g[1]).join(' + ')} = ${tot}.`,
        `Elke stap naar een volgend vak is ${side} m.`,
        `${tot} × ${side} = <b>${nf(ans)}</b> m.`,
      ) + tip('De plaats waar je uitkomt heb je niet nodig. Het gaat om de afstand die je loopt.'),
  };
});

def('CN18', 'C', 'N', 'C.10', 'Driehoeken en samengestelde vormen', (L, r) => {
  const use = 'Gebruik: oppervlakte driehoek = ½ × basis × hoogte.';
  if (L === 1) {
    const b = 2 * r.int(3, 10),
      h = r.int(4, 12);
    return {
      type: 'num',
      unit: 'cm²',
      q: p(`Hieronder zie je een driehoek. ${use}`) + ask('Wat is de oppervlakte van de driehoek?'),
      fig: F.tri({ base: b, h: h, unit: 'cm', apex: r.pick([0.25, 0.4, 0.6, 0.75]) }),
      ans: (b * h) / 2,
      expl:
        steps(`½ × ${b} × ${h} = ${b / 2} × ${h}.`, `${b / 2} × ${h} = <b>${(b * h) / 2}</b> cm².`) +
        tip('De hoogte staat loodrecht op de basis.'),
    };
  }
  const w = 2 * r.int(3, 6),
    h = r.int(3, 7),
    t = r.int(2, 5),
    ans = w * h + (w * t) / 2;
  if (L === 2)
    return {
      type: 'num',
      unit: 'm²',
      q:
        p(`De zijgevel van een schuur bestaat uit een rechthoek met een driehoek erop. ${use}`) +
        ask('Wat is de oppervlakte van de gevel?'),
      fig: F.house({ w: w, h: h, t: t, unit: 'm' }),
      ans,
      expl: steps(`Rechthoek: ${w} × ${h} = ${w * h} m².`, `Driehoek: ½ × ${w} × ${t} = ${(w * t) / 2} m².`, `Samen: <b>${ans}</b> m².`),
    };
  const pr = r.pick([12, 15, 18, 24]);
  return {
    type: 'num',
    pre: '€',
    calc: true,
    q:
      p(
        `De zijgevel van een schuur bestaat uit een rechthoek met een driehoek erop. In het midden is de gevel ${h + t} m hoog. De gevel wordt bekleed met hout van ${eur(pr)} per m². ${use}`,
      ) + ask('Hoeveel kost het hout voor de gevel?'),
    fig: F.house({ w: w, h: h, t: t, unit: 'm', total: h + t }),
    ans: ans * pr,
    expl:
      steps(
        `De driehoek is ${h + t} − ${h} = ${t} m hoog.`,
        `Rechthoek: ${w} × ${h} = ${w * h} m². Driehoek: ½ × ${w} × ${t} = ${(w * t) / 2} m².`,
        `Samen ${ans} m².`,
        `${ans} × ${eur(pr)} = <b>${eur(ans * pr)}</b>.`,
      ) + tip('De hoogte van de driehoek staat niet in de figuur. Die reken je uit met de totale hoogte.'),
  };
});

type Vorm = 't' | 's' | 'c' | 'r';
const SHN: Record<Vorm, string> = { t: 'driehoek', s: 'vierkant', c: 'cirkel', r: 'ruit' },
  SHP: Record<Vorm, string> = { t: 'driehoeken', s: 'vierkanten', c: 'cirkels', r: 'ruiten' };
def('CN19', 'C', 'N', 'C.14', 'Patronen voortzetten', (L, r) => {
  const u = r.pick([3, 4, 5]),
    kinds = r.sample(['t', 's', 'c', 'r'] as const, r.int(2, 3)),
    unit: Vorm[] = [];
  for (let i = 0; i < u; i++) unit.push(r.pick(kinds));
  if (new Set(unit).size < 2) throw RETRY;
  for (let q = 1; q < u; q++) if (u % q === 0 && unit.every((x, i) => x === unit[i % q])) throw RETRY;
  const seq: Vorm[] = [];
  for (let i = 0; i < Math.min(12, 2 * u + 2); i++) seq.push(unit[i % u]);
  const fig = F.shapes(seq),
    base =
      'Hieronder zie je het begin van een rij figuren. De rij gaat steeds op dezelfde manier door.' +
      (L === 1 ? ` Het patroon herhaalt zich na ${u} figuren.` : '');
  const pat = `Het patroon dat zich herhaalt bestaat uit ${u} figuren: ${unit.map((x) => SHN[x]).join(', ')}.`;
  if (L < 3) {
    const N = L === 1 ? r.int(17, 40) : r.int(52, 160),
      rest = N % u,
      good = SHN[unit[(N - 1) % u]];
    return Object.assign(
      mcTxt(
        r,
        good,
        Object.values(SHN).filter((x) => x !== good),
      ),
      {
        q: p(base) + ask(`Welke figuur staat op plaats ${N}?`),
        fig,
        expl: steps(
          pat,
          `${N} : ${u} = ${Math.floor(N / u)} rest ${rest}.`,
          rest === 0
            ? `Er is geen rest. Plaats ${N} is dus de laatste figuur van het patroon: een <b>${good}</b>.`
            : `Plaats ${N} is dus de ${rest}e figuur van het patroon: een <b>${good}</b>.`,
        ),
      },
    );
  }
  const k = r.pick(Array.from(new Set(unit))),
    N = r.int(30, 90),
    per = unit.filter((x) => x === k).length,
    full = Math.floor(N / u),
    rest = N % u,
    extra = unit.slice(0, rest).filter((x) => x === k).length,
    ans = full * per + extra;
  return {
    type: 'num',
    unit: SHP[k],
    q: p(base) + ask(`Hoeveel ${SHP[k]} staan er bij de eerste ${N} figuren?`),
    fig,
    ans,
    expl: steps(
      `${pat} Daarin ${per === 1 ? 'staat 1 ' + SHN[k] : 'staan ' + per + ' ' + SHP[k]}.`,
      `${N} : ${u} = ${full} rest ${rest}. Er zijn ${full} hele patronen: ${full} × ${per} = ${full * per}.`,
      rest === 0
        ? `Er is geen rest, dus het antwoord is <b>${ans}</b>.`
        : extra === 0
          ? `In de ${rest === 1 ? 'ene figuur' : rest + ' figuren'} die ${rest === 1 ? 'overblijft' : 'overblijven'}, staat geen ${SHN[k]} meer. Het antwoord is <b>${ans}</b>.`
          : `In de laatste ${rest === 1 ? 'figuur' : rest + ' figuren'} ${extra === 1 ? 'staat nog 1 ' + SHN[k] : 'staan nog ' + extra + ' ' + SHP[k]}: ${full * per} + ${extra} = <b>${ans}</b>.`,
    ),
  };
});

def('CN20', 'C', 'N', 'C.2', 'Meetinstrumenten aflezen', (L, r) => {
  const T = { min: -20, max: 40, major: 10, minor: 2 };
  if (L === 1) {
    const lvl = 50 * r.int(2, 9);
    return {
      type: 'num',
      unit: 'ml',
      q: p('Hieronder zie je een maatbeker met limonade.') + ask('Hoeveel milliliter limonade zit er in de maatbeker?'),
      fig: F.cup({ max: 500, major: 100, minor: 50, level: lvl, unit: 'ml' }),
      ans: lvl,
      expl: steps(
        'Bij de lange streepjes staan getallen. Tussen twee lange streepjes zit 100 ml.',
        'Het korte streepje daartussen is de helft: 50 ml.',
        `De limonade staat bij <b>${lvl}</b> ml.`,
      ),
    };
  }
  if (L === 2) {
    if (r.chance(0.5)) {
      const lvl = 25 * r.int(5, 19);
      if (lvl % 100 === 0) throw RETRY;
      const k = (lvl % 100) / 25;
      return {
        type: 'num',
        unit: 'ml',
        q: p('Hieronder zie je een maatbeker met water.') + ask('Hoeveel milliliter water zit er in de maatbeker?'),
        fig: F.cup({ max: 500, major: 100, minor: 25, level: lvl, unit: 'ml' }),
        ans: lvl,
        expl: steps(
          'Tussen twee getallen zit 100 ml. Dat stuk is in 4 gelijke stapjes verdeeld.',
          'Elk stapje is 100 : 4 = 25 ml.',
          `Het water staat ${k} ${k === 1 ? 'stapje' : 'stapjes'} boven de ${Math.floor(lvl / 100) * 100}: <b>${lvl}</b> ml.`,
        ),
      };
    }
    const v = 2 * r.int(-8, 17);
    if (v % 10 === 0) throw RETRY;
    return {
      type: 'num',
      unit: '°C',
      q: p('Hieronder zie je een thermometer.') + ask('Welke temperatuur geeft de thermometer aan?'),
      fig: F.thermo(Object.assign({ val: v }, T)),
      ans: v,
      expl:
        steps(
          'Tussen twee getallen zit 10 graden. Dat stuk is in 5 gelijke stapjes verdeeld.',
          'Elk stapje is 10 : 5 = 2 graden.',
          `De thermometer wijst <b>${nf(v)}</b> °C aan.`,
        ) + (v < 0 ? tip('Onder nul tel je vanaf 0 naar beneden.') : ''),
    };
  }
  if (r.chance(0.5)) {
    const lvl = 25 * r.int(5, 19),
      tg = r.pick([500, 600, 750, 700]);
    if (lvl % 100 === 0 || tg <= lvl) throw RETRY;
    return {
      type: 'num',
      unit: 'ml',
      q:
        p(`Hieronder zie je een maatbeker met melk. Voor een recept is ${nf(tg / 1000)} liter melk nodig.`) +
        ask('Hoeveel milliliter melk moet er nog bij?'),
      fig: F.cup({ max: 800, major: 100, minor: 25, level: lvl, unit: 'ml' }),
      ans: tg - lvl,
      expl: steps(
        `Elk klein stapje is 25 ml. In de maatbeker zit ${lvl} ml.`,
        `${nf(tg / 1000)} liter = ${tg} ml.`,
        `${tg} − ${lvl} = <b>${tg - lvl}</b> ml.`,
      ),
    };
  }
  const out = 2 * r.int(-9, -1),
    inn = 2 * r.int(7, 12);
  return {
    type: 'num',
    unit: 'graden',
    q: p('Hieronder zie je twee thermometers: één buiten en één binnen.') + ask('Hoeveel graden is het binnen warmer dan buiten?'),
    fig:
      '<div class="figrow">' +
      F.thermo(Object.assign({ val: out, cap: 'buiten' }, T)) +
      F.thermo(Object.assign({ val: inn, cap: 'binnen' }, T)) +
      '</div>',
    ans: inn - out,
    expl: steps(
      `Elk stapje is 2 graden. Buiten is het ${nf(out)} °C en binnen ${inn} °C.`,
      `Van ${nf(out)} tot 0 is ${-out} graden. Van 0 tot ${inn} is ${inn} graden.`,
      `Samen: <b>${inn - out}</b> graden.`,
    ),
  };
});

def('CN21', 'C', 'N', 'C.4', 'Hoogte schatten met een vergelijking', (L, r) => {
  const kind = r.pick(['boom', 'gebouw', 'mast', 'lantaarn'] as const),
    what = { boom: 'de boom', gebouw: 'het gebouw', mast: 'de vlaggenmast', lantaarn: 'de lantaarnpaal' }[kind];
  const k = L === 1 ? r.pick([3, 4]) : L === 2 ? r.pick([4.5, 5, 6, 7]) : r.pick([5, 6, 7, 8]),
    ref = L === 3 ? 1.2 : 1.8,
    good = Math.round(k * ref),
    who = L === 3 ? 'het kind' : 'de persoon';
  const wr = [Math.round(k), Math.round(k * ref * 1.6), Math.round(k * ref * 2.3), Math.round(k * ref * 0.55)].filter(
    (w) => w > 0 && Math.abs(w - good) / good >= 0.3,
  );
  return Object.assign(
    mcNum(r, good, wr, (v) => 'ongeveer ' + v + NB + 'm'),
    {
      q: p(`${cap(who)} op de tekening is ${nf(ref, 2)} m lang.`) + ask(`Hoe hoog is ${what} ongeveer?`),
      fig: F.person({ k: k, kind: kind }),
      expl: steps(
        `Kijk hoe vaak de lengte van ${who} in de hoogte van ${what} past. Dat is ongeveer ${nf(k)} keer.`,
        `${nf(k)} × ${nf(ref, 2)} = ${nf(rnd(k * ref, 2))} m.`,
        `${cap(what)} is <b>ongeveer ${good}${NB}m</b> hoog.`,
      ),
    },
  );
});

def('CN22', 'C', 'N', 'C.11', 'Omtrek in een verhaal', (L, r) => {
  if (L < 3) {
    const l = r.int(8, 25),
      w = r.int(5, l - 2);
    if (L === 1)
      return {
        type: 'num',
        unit: 'm',
        q:
          p(`Een rechthoekige moestuin is ${l} m lang en ${w} m breed. Om de hele tuin komt een hek.`) +
          ask('Hoeveel meter hek is er nodig?'),
        ans: 2 * (l + w),
        expl: steps('Het hek loopt langs alle vier de zijden.', `2 × ${l} + 2 × ${w} = <b>${2 * (l + w)}</b> m.`),
      };
    const gate = r.pick([1.5, 2, 2.5, 3]),
      roll = r.pick([10, 15, 25]),
      need = 2 * (l + w) - gate,
      n = Math.ceil(rnd(need / roll, 6));
    if (whole(need / roll)) throw RETRY;
    return {
      type: 'num',
      unit: 'rollen',
      calc: true,
      q:
        p(
          `Een rechthoekige tuin is ${l} m lang en ${w} m breed. Om de tuin komt gaas. Er komt ook een poort van ${nf(gate)} m breed. Daar komt geen gaas. Het gaas wordt verkocht op rollen van ${roll} m.`,
        ) + ask('Hoeveel rollen gaas zijn er minstens nodig?'),
      ans: n,
      expl: steps(
        `Omtrek: 2 × ${l} + 2 × ${w} = ${2 * (l + w)} m.`,
        `Zonder de poort: ${2 * (l + w)} − ${nf(gate)} = ${nf(need)} m gaas.`,
        `${nf(need)} : ${roll} is ongeveer ${nf(rnd(need / roll, 2))}. Je rondt naar boven af: <b>${n}</b> ${n === 1 ? 'rol' : 'rollen'}.`,
      ),
    };
  }
  const sp = r.pick([2, 2.5, 3, 4]),
    i = r.int(3, 9),
    j = r.int(2, 6),
    l = sp * i,
    w = sp * j,
    n = 2 * (i + j);
  if (i === j) throw RETRY;
  return {
    type: 'num',
    unit: 'palen',
    q:
      p(
        `Een rechthoekige weide is ${nf(l)} m lang en ${nf(w)} m breed. Rondom de weide komen palen voor een afrastering. Op elke hoek staat een paal en de afstand tussen twee palen is steeds ${nf(sp)} m.`,
      ) + ask('Hoeveel palen zijn er nodig?'),
    ans: n,
    expl:
      steps(
        `Omtrek: 2 × ${nf(l)} + 2 × ${nf(w)} = ${nf(2 * (l + w))} m.`,
        `Rondom zijn er ${nf(2 * (l + w))} : ${nf(sp)} = ${n} tussenruimtes.`,
        `Bij een gesloten rondje zijn er evenveel palen als tussenruimtes: <b>${n}</b> palen.`,
      ) + tip('De hoekpalen tel je maar één keer. Er komt dus geen paal extra bij.'),
  };
});
