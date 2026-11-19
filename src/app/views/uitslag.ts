/* Uitslag na een proeftoets of oefenronde. */
import type { Domein } from '../../core/types';
import { answerHtml, DOM, givenHtml, PART, verdict, type Telling } from '../../engine';
import { LVL, MODE_NAME } from '../eindtermen';
import { dots, fmtDate, fmtDur, fmtSecs, pct, pill } from '../hulp';
import { I } from '../iconen';
import { S } from '../state';
import { qBody } from './opgave';
import { viewStart } from './start';

/** balkjes met 'a van b goed' per onderdeel of domein */
export function bars(obj: Partial<Record<string, Telling>>, order: readonly string[], names: Record<string, string>): string {
  return (
    '<div class="bars">' +
    order
      .filter((k) => {
        const t = obj[k];
        return t && t[1];
      })
      .map((k) => {
        const [a, b] = obj[k] ?? [0, 0];
        return (
          '<div class="bar"><span>' +
          names[k] +
          '</span><b>' +
          a +
          ' van ' +
          b +
          '</b><div class="bar-t" role="img" aria-label="' +
          pct(a, b) +
          ' procent goed"><i data-w="' +
          pct(a, b) +
          '"></i></div></div>'
        );
      })
      .join('') +
    '</div>'
  );
}

export const DOM_NAMEN: Record<string, string> = Object.fromEntries(Object.entries(DOM).map(([d, v]) => [d, v.name]));

export function viewResult(): string {
  const R = S.result;
  if (!R) return viewStart();
  const sum = R.sum;
  const test = R.kind === 'test';
  const v = verdict(sum.score);
  let h = '';
  h +=
    '<header class="stack"><p class="eyebrow">Uitslag · ' +
    MODE_NAME[R.mode] +
    ' · ' +
    fmtDate(R.t) +
    '</p><h2>' +
    (test ? 'Je oefenscore' : 'Zo ging het oefenen') +
    '</h2></header>';
  if (R.notice) h += '<p class="tip">' + R.notice + '</p>';
  if (test) {
    h +=
      '<section class="card"><div class="score"><span class="score-n">' +
      sum.score +
      '<span class="score-of"> / 100</span></span><div class="score-l">' +
      pill(v) +
      '<span class="small">' +
      sum.ok +
      ' van de ' +
      sum.n +
      ' opgaven goed</span></div></div><p>' +
      v.text +
      '</p>' +
      '<details class="more"><summary>' +
      I.info +
      'Hoe werkt de oefenscore?</summary><p class="small">De oefenscore loopt van 0 tot 100 en weegt mee hoe moeilijk je opgaven waren. Wie goed antwoordt, krijgt moeilijkere opgaven. Daarom zegt het aantal goede antwoorden niet alles. Vanaf 70 ben je in deze app op koers. Het is geen officiële RWT-score.</p></details></section>';
    h +=
      '<section class="card"><h3>Per onderdeel</h3>' +
      bars(sum.part, ['H', 'N'], PART) +
      '<p class="small">Gebruikte tijd: hoofdrekenen ' +
      fmtDur(R.spent.H) +
      ', niet-hoofdrekenen ' +
      fmtDur(R.spent.N) +
      '.' +
      (sum.missed ? ' Niet gemaakt door tijdgebrek: ' + sum.missed + '.' : '') +
      '</p></section>';
  } else {
    h +=
      '<section class="card"><div class="score"><span class="score-n">' +
      sum.ok +
      '<span class="score-of"> / ' +
      sum.n +
      '</span></span><div class="score-l"><span class="small">opgaven goed</span><span class="small">oefenscore ' +
      sum.score +
      (sum.n < 10 ? ' (ruwe schatting bij weinig opgaven)' : '') +
      '</span></div></div></section>';
  }
  const deel = (d: Domein): number => {
    const t = sum.dom[d] ?? [0, 1];
    return t[0] / t[1];
  };
  const doms = (Object.keys(sum.dom) as Domein[]).filter((d) => (sum.dom[d]?.[1] ?? 0) >= 2).sort((a, b) => deel(a) - deel(b));
  h += '<section class="card"><h3>Per domein</h3>' + bars(sum.dom, ['A', 'B', 'C', 'D'], DOM_NAMEN);
  const zwak = doms.length > 1 ? sum.dom[doms[0]] : undefined;
  if (zwak && zwak[0] < zwak[1])
    h +=
      '<p>De meeste fouten maakte je bij <b>' +
      DOM[doms[0]].name.toLowerCase() +
      '</b>.</p><div class="row"><button class="btn sm" data-act="pracdom" data-d="' +
      doms[0] +
      '">Oefen dit domein</button></div>';
  h += '</section>';
  const wrong = R.items.filter((x) => !x.ok).length;
  let lastPart = '';
  h +=
    '<section class="card"><div class="row between"><h3>Alle opgaven</h3>' +
    (wrong && wrong < R.items.length
      ? '<div class="seg seg-s" role="group" aria-label="Welke opgaven">' +
        (
          [
            [false, 'Alle (' + R.items.length + ')'],
            [true, 'Fout (' + wrong + ')'],
          ] as const
        )
          .map(
            (o) =>
              '<button type="button" data-act="onlywrong" data-val="' +
              o[0] +
              '" aria-pressed="' +
              (S.onlyWrong === o[0]) +
              '">' +
              o[1] +
              '</button>',
          )
          .join('') +
        '</div>'
      : '') +
    '</div><div class="revs">';
  R.items.forEach((it, i) => {
    if (S.onlyWrong && it.ok) return;
    const q = it.q;
    // tussenkopjes per onderdeel, zodat dat niet bij elke regel hoeft te staan
    if (q.part !== lastPart) {
      lastPart = q.part;
      h += '<p class="rev-g">' + PART[q.part] + '</p>';
    }
    h +=
      '<details class="rev"><summary><span class="rev-n">' +
      (i + 1) +
      '</span><span class="rev-i ' +
      (it.ok ? 'ok' : 'no') +
      '">' +
      (it.ok ? I.ok : I.no) +
      '<span class="sr">' +
      (it.ok ? 'Goed' : 'Fout') +
      '</span></span><span class="rev-t">' +
      q.name +
      '</span><span class="rev-m">' +
      q.et +
      ' · ' +
      fmtSecs(it.secs) +
      '</span>' +
      I.chev +
      '</summary>' +
      '<div class="rev-b">' +
      qBody(q) +
      '<dl class="kv"><dt>Jouw antwoord</dt><dd>' +
      givenHtml(q, it.given) +
      '</dd><dt>Goede antwoord</dt><dd>' +
      answerHtml(q) +
      '</dd><dt>Niveau</dt><dd>' +
      dots(q.level) +
      ' ' +
      LVL[q.level].toLowerCase() +
      '</dd></dl><div class="stack"><b>Uitwerking</b>' +
      q.expl +
      '</div><div class="row"><button class="btn sm" data-act="practpl" data-id="' +
      q.id +
      '">Oefen dit soort opgave</button></div></div></details>';
  });
  h +=
    '</div></section><div class="row"><a class="btn" href="#start" data-act="nav" data-v="start">Naar start</a>' +
    (test
      ? '<button class="btn pri" data-act="start" data-mode="' + R.mode + '">Nog een proeftoets</button>'
      : '<a class="btn pri" href="#oefenen" data-act="nav" data-v="oefenen">Verder oefenen</a>') +
    '</div>';
  return h;
}
