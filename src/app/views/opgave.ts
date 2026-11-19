/* Een opgave tekenen: tekst, figuur en de invoer voor het antwoord. */
import type { Gegeven, Opgave } from '../../core/types';
import { answerHtml, givenHtml, NEG } from '../../engine';
import { esc } from '../hulp';
import { I } from '../iconen';
import type { UiState } from '../state';

export function qBody(q: Opgave): string {
  return '<div class="q-text">' + q.q + '</div>' + (q.fig ? '<div class="q-fig">' + q.fig + '</div>' : '');
}

/** pfx: voorvoegsel voor de id's van de invulvakken ('ans' of 'demo'); noHint: geen invulhint (in de toets) */
export function answerUi(ui: UiState, pfx: string, noHint?: boolean): string {
  const lock = ui.checked ? ' disabled' : '';
  if (ui.soort === 'mc') {
    const q = ui.q;
    const given = ui.given;
    return (
      '<div class="opts" role="radiogroup" aria-label="Antwoorden">' +
      q.opts
        .map((o, i) => {
          const cls =
            'opt' +
            (given === i ? ' on' : '') +
            (ui.checked && i === q.ans ? ' ok' : '') +
            (ui.checked && given === i && i !== q.ans ? ' no' : '');
          return (
            '<button type="button" class="' +
            cls +
            '" role="radio" aria-checked="' +
            (given === i) +
            '" data-act="pick" data-i="' +
            i +
            '"' +
            lock +
            '><span class="opt-k">' +
            'ABCDE'.charAt(i) +
            '</span><span class="opt-t">' +
            o +
            '</span></button>'
          );
        })
        .join('') +
      '</div>'
    );
  }
  if (ui.soort === 'order') {
    const q = ui.q;
    const given = ui.given;
    const seq = given
      .map(
        (i, k) =>
          (k ? '<span class="lt">&lt;</span>' : '') +
          '<button type="button" class="chip sel" data-act="ordrem" data-i="' +
          i +
          '"' +
          lock +
          ' aria-label="Haal weg">' +
          q.items[i] +
          '</button>',
      )
      .join('');
    const pool = q.items
      .map((h, i) =>
        given.includes(i) ? '' : '<button type="button" class="chip" data-act="ordadd" data-i="' + i + '"' + lock + '>' + h + '</button>',
      )
      .join('');
    return (
      '<div class="ord"><p class="hint">Tik de getallen aan in de goede volgorde, de kleinste eerst. Tik op een gekozen getal om het terug te leggen.</p><div class="ord-seq" aria-live="polite">' +
      (seq || '<span class="hint">Jouw volgorde komt hier.</span>') +
      '</div><div class="ord-pool">' +
      pool +
      '</div></div>'
    );
  }
  const q = ui.q;
  const given = ui.given;
  return (
    '<div class="fields">' +
    q.fields
      .map(
        (f, i) =>
          '<div class="field">' +
          (f.pre ? '<span class="f-pre">' + f.pre + '</span>' : '') +
          '<input id="' +
          pfx +
          i +
          '" class="f-in" type="text" inputmode="decimal" autocomplete="off" autocapitalize="off" spellcheck="false" enterkeyhint="done" aria-label="Antwoord' +
          (q.fields.length > 1 ? ' ' + (i + 1) : '') +
          '" data-i="' +
          i +
          '" value="' +
          esc(given[i] || '') +
          '"' +
          lock +
          '>' +
          (NEG[q.id]
            ? '<button type="button" class="f-sign" data-act="sign" data-i="' +
              i +
              '" aria-label="Maak het getal negatief of positief"' +
              lock +
              '>±</button>'
            : '') +
          (f.unit ? '<span class="f-unit">' + f.unit + '</span>' : '') +
          '</div>',
      )
      .join('') +
    '</div>' +
    (noHint
      ? ''
      : '<p class="hint">Alleen cijfers en een komma. Geen punt in grote getallen.' +
        (NEG[q.id] ? ' Met ± maak je het getal negatief.' : '') +
        '</p>')
  );
}

/** bij een goed antwoord staat de uitwerking ingeklapt, bij een fout antwoord open */
export function feedback(q: Opgave, given: Gegeven, ok: boolean): string {
  return (
    '<section class="fb ' +
    (ok ? 'ok' : 'no') +
    '" aria-live="polite"><div class="fb-h">' +
    (ok ? I.ok + 'Goed' : I.no + 'Niet goed') +
    '</div>' +
    '<dl class="kv"><dt>Jouw antwoord</dt><dd>' +
    givenHtml(q, given) +
    '</dd>' +
    (ok ? '' : '<dt>Goede antwoord</dt><dd>' + answerHtml(q) + '</dd>') +
    '</dl>' +
    '<details class="uitw"' +
    (ok ? '' : ' open') +
    '><summary>' +
    I.chev +
    'Uitwerking</summary><div class="uitw-b">' +
    q.expl +
    '</div></details></section>'
  );
}
