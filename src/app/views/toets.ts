/* Toets en oefenen: de intro per deel, de balk bovenin, de opgave en de knoppenbalk. */
import { isComplete, MODES, PART, type ToetsSessie } from '../../engine';
import { ET } from '../eindtermen';
import { dots } from '../hulp';
import { I } from '../iconen';
import { calcHtml } from '../rekenmachine/rekenmachine';
import { qElapsed, S } from '../state';
import { remaining, timerHtml, timerShown } from '../timer';
import { answerUi, feedback, qBody } from './opgave';

export function partCounts(s: ToetsSessie): { H: number; N: number } {
  const nH = s.plan.filter((x) => x.part === 'H').length;
  return { H: nH, N: s.plan.length - nH };
}

function introHtml(s: ToetsSessie): string {
  const c = partCounts(s);
  const M = MODES[s.mode];
  const isH = s.phase === 'introH';
  const missed = (s.skipped || []).length;
  let h =
    '<main class="wrap run"><section class="card"><p class="eyebrow">' +
    M.name +
    ' · deel ' +
    (isH ? 1 : 2) +
    ' van 2</p><h2>' +
    (isH ? 'Hoofdrekenen' : 'Niet-hoofdrekenen') +
    '</h2>';
  if (!isH && missed)
    h +=
      '<p class="tip"><b>De tijd voor hoofdrekenen was om.</b> ' +
      missed +
      (missed === 1 ? ' opgave heb' : ' opgaven heb') +
      ' je niet gemaakt. Die ' +
      (missed === 1 ? 'telt' : 'tellen') +
      ' als fout.</p>';
  h +=
    '<ul class="facts"><li>' +
    (isH ? c.H : c.N) +
    ' opgaven</li><li>' +
    Math.round((isH ? M.tH : M.tN) / 60) +
    ' minuten</li><li>' +
    (isH ? 'geen rekenmachine' : 'soms een rekenmachine') +
    '</li></ul><div class="prose">';
  if (isH)
    h +=
      '<p>Je hebt ongeveer één minuut per opgave. De klok loopt door tot het deel af is. Wil je hem niet zien? Verberg hem met het oog naast de tijd. In de laatste minuut komt hij vanzelf terug.</p><p>Je kunt niet terug naar een vorige opgave en je kunt geen opgave overslaan. Weet je het niet? Vul dan je beste gok in.</p><p>Kladpapier mag je gebruiken. De toets past zich aan: na een goed antwoord wordt de volgende opgave vaak moeilijker.</p>';
  else
    h +=
      '<p>Lees elke opgave goed en let op wat er precies gevraagd wordt. In sommige opgaven staan gegevens die je niet nodig hebt.</p><p>Bij een deel van de opgaven mag je de rekenmachine gebruiken. Dat zie je aan de knop Rekenmachine onder de opgave.</p><p>Ook hier kun je niet terug en niets overslaan.</p>';
  h +=
    '<p class="tip"><b>Antwoorden invullen.</b> Typ alleen cijfers en zo nodig een komma, zonder punt in grote getallen: 1250 en 12,5. Voor een negatief getal tik je op ±. Met Enter kom je op de knop; nog een keer Enter gaat naar de volgende opgave.</p>';
  return (
    h +
    '</div><button class="btn pri wide" data-act="begin">Start deel ' +
    (isH ? 1 : 2) +
    '</button><button class="btn ghost" data-act="stop">Toets stoppen</button></section></main>'
  );
}

export function viewRun(): string {
  const s = S.s;
  if (!s) return '';
  if (s.kind === 'test' && (s.phase === 'introH' || s.phase === 'introN')) return introHtml(s);
  const u = S.ui;
  if (!u) return '';
  const q = u.q;
  const test = s.kind === 'test';
  let left: string, right: string, bar: number, total: number;
  if (s.kind === 'test') {
    const c = partCounts(s);
    total = c[q.part];
    const num = q.part === 'H' ? s.idx + 1 : s.idx - c.H + 1;
    left = '<b>' + PART[q.part] + '</b><span>Opgave ' + num + ' van ' + total + '</span>';
    right = timerHtml(remaining(), 'Resterende tijd', !timerShown(remaining()));
    bar = s.idx / s.plan.length;
  } else {
    total = s.sel.count;
    const num = s.items.length + (u.checked ? 0 : 1);
    const good = s.items.filter((x) => x.ok).length;
    left = '<b>Oefenen</b><span>Opgave ' + num + (total ? ' van ' + total : '') + ' · ' + good + ' goed</span>';
    right = timerHtml(qElapsed(), 'Tijd voor deze opgave', S.timerHidden);
    bar = total ? s.items.length / total : 0;
  }
  // één voortgangsbalk voor de hele toets, met een streepje waar deel 2 begint
  const split = s.kind === 'test' ? '<b class="rb-split" data-l="' + ((partCounts(s).H / s.plan.length) * 100).toFixed(2) + '"></b>' : '';
  let h =
    '<header class="runbar"><div class="runbar-in"><div class="rb-l">' +
    left +
    '</div><div class="rb-r">' +
    right +
    '<button class="btn ghost sm quiet" data-act="stop" aria-label="' +
    (test ? 'Toets stoppen' : 'Stoppen met oefenen') +
    '">' +
    I.x +
    '<span class="lbl">Stoppen</span></button></div></div><div class="rb-prog" role="progressbar" aria-label="Voortgang" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' +
    Math.round(bar * 100) +
    '"><i data-w="' +
    Math.round(bar * 100) +
    '"></i>' +
    split +
    '</div></header>';
  h += '<main class="wrap run' + (S.calc.open ? ' calc-open' : '') + '"><article class="q">';
  if (!test)
    h +=
      '<div class="q-meta"><span class="pill">' +
      q.et +
      ' · ' +
      (ET[q.et] || q.name) +
      '</span><span>' +
      PART[q.part] +
      '</span>' +
      dots(q.level) +
      '</div>';
  h += qBody(q) + answerUi(u, 'ans', test);
  if (q.calc && !u.checked)
    h +=
      '<div class="row"><button class="btn sm" data-act="calc" aria-expanded="' +
      S.calc.open +
      '">' +
      I.calc +
      'Rekenmachine</button></div>';
  h += '</article>';
  if (!test && u.checked) h += feedback(q, u.given, !!u.ok);
  const lastQ = s.kind === 'test' ? s.idx + 1 >= s.plan.length : total && s.items.length >= total;
  const nextPart = s.kind === 'test' && s.plan[s.idx + 1] && s.plan[s.idx + 1].part !== q.part;
  h += '<div class="actbar">' + (test ? '<p class="kbd tiny" aria-hidden="true">Druk op Enter om verder te gaan</p>' : '');
  if (test)
    h +=
      '<button class="btn pri" id="submit" data-act="next"' +
      (isComplete(q, u.given) ? '' : ' disabled') +
      '>' +
      (lastQ ? 'Toets afronden' : nextPart ? 'Naar deel 2' : 'Volgende opgave') +
      '</button>';
  else if (!u.checked)
    h += '<button class="btn pri" id="submit" data-act="check"' + (isComplete(q, u.given) ? '' : ' disabled') + '>Controleer</button>';
  else h += '<button class="btn pri" id="submit" data-act="pnext">' + (lastQ ? 'Bekijk het resultaat' : 'Volgende opgave') + '</button>';
  h += '</div></main>';
  if (S.calc.open) h += calcHtml();
  return h;
}
