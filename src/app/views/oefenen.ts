/* Oefenen instellen: domeinen, onderdeel, niveau en aantal. */
import { TPL } from '../../banken';
import type { Onderdeel } from '../../core/types';
import { DOM } from '../../engine';
import { I } from '../iconen';
import { S } from '../state';

const DOMEINEN = ['A', 'B', 'C', 'D'] as const;

/** aantal opgavetypes in de huidige keuze */
export function pracOptions(): number {
  const p = S.prac;
  const parts: Onderdeel[] = p.part === 'HN' ? ['H', 'N'] : [p.part];
  let n = 0;
  p.doms.forEach((d) => {
    parts.forEach((pt) => {
      n += TPL.filter((t) => t.dom === d && t.part === pt).length;
    });
  });
  return n;
}

function seg(name: string, opts: readonly (readonly [string | number, string])[], cur: string | number): string {
  return (
    '<div class="seg" role="group">' +
    opts
      .map(
        (o) =>
          '<button type="button" data-act="pset" data-k="' +
          name +
          '" data-val="' +
          o[0] +
          '" aria-pressed="' +
          (String(cur) === String(o[0])) +
          '">' +
          o[1] +
          '</button>',
      )
      .join('') +
    '</div>'
  );
}

export function viewPractice(): string {
  const p = S.prac;
  const n = pracOptions();
  const msg = !p.doms.length
    ? 'Kies minstens één domein.'
    : !n
      ? 'Verbanden en statistiek komt alleen voor bij niet-hoofdrekenen. Kies een ander onderdeel of een ander domein.'
      : n + ' soorten opgaven in deze keuze. Elke opgave krijgt nieuwe getallen.';
  return (
    '<header class="stack"><h2>Oefenen per domein</h2><p class="lead">Zonder tijdsdruk. Na elke opgave zie je meteen of het goed is, met de uitwerking erbij.</p></header>' +
    '<section class="card"><div class="fgroup"><span class="lab">Domeinen</span><div class="checks">' +
    DOMEINEN.map(
      (d) =>
        '<button type="button" class="check" data-act="pdom" data-d="' +
        d +
        '" aria-pressed="' +
        p.doms.includes(d) +
        '"><span class="box">' +
        I.tick +
        '</span><span>' +
        DOM[d].name +
        '<small>' +
        TPL.filter((t) => t.dom === d).length +
        ' soorten opgaven</small></span></button>',
    ).join('') +
    '</div></div>' +
    '<div class="fgroup"><span class="lab">Onderdeel</span>' +
    seg(
      'part',
      [
        ['HN', 'Allebei'],
        ['H', 'Hoofdrekenen'],
        ['N', 'Niet-hoofdrekenen'],
      ],
      p.part,
    ) +
    '</div>' +
    '<div class="fgroup"><span class="lab">Niveau</span>' +
    seg(
      'level',
      [
        [0, 'Groeit mee'],
        [1, 'Opstap'],
        [2, 'Toetsniveau'],
        [3, 'Uitdaging'],
      ],
      p.level,
    ) +
    '<p class="hint">Bij ‘Groeit mee’ worden de opgaven moeilijker als je ze goed maakt, net als in de echte toets.</p></div>' +
    '<div class="fgroup"><span class="lab">Aantal opgaven</span>' +
    seg(
      'count',
      [
        [10, '10'],
        [20, '20'],
        [0, 'Tot ik stop'],
      ],
      p.count,
    ) +
    '</div>' +
    '<p class="hint">' +
    msg +
    '</p><button class="btn pri wide" data-act="startprac"' +
    (n ? '' : ' disabled') +
    '>Start met oefenen</button></section>'
  );
}
