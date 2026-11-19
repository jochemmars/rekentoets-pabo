/* Voortgang: score per sessie, resultaten per domein, zwakke onderwerpen en alle sessies. */
import { NB } from '../../core/notatie';
import type { HistorieRegel, Telling } from '../../engine';
import { ET, MODE_NAME } from '../eindtermen';
import { esc, fmtDate } from '../hulp';
import { canStore, LS } from '../opslag';
import { S, type Filter } from '../state';
import { bars, DOM_NAMEN } from './uitslag';

function progressChart(list: readonly HistorieRegel[]): string {
  const W = 320;
  const H = 176;
  const L = 30;
  const R = 58;
  const T = 12;
  const B = 26;
  const pw = W - L - R;
  const ph = H - T - B;
  const n = list.length;
  let s = '';
  const X = (i: number) => (n === 1 ? L + pw / 2 : L + (i * pw) / (n - 1));
  const Y = (v: number) => T + ph - (v / 100) * ph;
  [0, 25, 50, 75, 100].forEach((v) => {
    s +=
      '<line x1="' +
      L +
      '" x2="' +
      (W - R) +
      '" y1="' +
      Y(v) +
      '" y2="' +
      Y(v) +
      '" class="pg-grid"/><text x="' +
      (L - 6) +
      '" y="' +
      (Y(v) + 4) +
      '" text-anchor="end" class="pg-t">' +
      v +
      '</text>';
  });
  s +=
    '<line x1="' +
    L +
    '" x2="' +
    (W - R) +
    '" y1="' +
    Y(70) +
    '" y2="' +
    Y(70) +
    '" class="pg-goal"/><text x="' +
    (W - R + 5) +
    '" y="' +
    (Y(70) + 4) +
    '" class="pg-t pg-tg">op koers</text>';
  const pts = list.map((h, i) => X(i).toFixed(1) + ',' + Y(h.score).toFixed(1));
  if (n > 1)
    s +=
      '<polygon class="pg-area" points="' +
      X(0).toFixed(1) +
      ',' +
      Y(0) +
      ' ' +
      pts.join(' ') +
      ' ' +
      X(n - 1).toFixed(1) +
      ',' +
      Y(0) +
      '"/><polyline class="pg-ln" points="' +
      pts.join(' ') +
      '"/>';
  list.forEach((h, i) => {
    s +=
      '<circle class="pg-dot' +
      (i === n - 1 ? ' last' : '') +
      '" cx="' +
      X(i).toFixed(1) +
      '" cy="' +
      Y(h.score).toFixed(1) +
      '" r="' +
      (i === n - 1 ? 5.5 : 4.5) +
      '"/>';
    s +=
      '<circle class="pg-hit" cx="' +
      X(i).toFixed(1) +
      '" cy="' +
      Y(h.score).toFixed(1) +
      '" r="14" tabindex="0" role="img" aria-label="' +
      fmtDate(h.t) +
      ', ' +
      MODE_NAME[h.mode] +
      ', oefenscore ' +
      h.score +
      '" data-tip="' +
      esc('<b>' + h.score + '</b><br>' + fmtDate(h.t) + ' · ' + MODE_NAME[h.mode] + '<br>' + h.ok + ' van ' + h.n + ' goed') +
      '"/>';
  });
  s +=
    '<text x="' +
    X(0).toFixed(1) +
    '" y="' +
    (H - 7) +
    '" text-anchor="' +
    (n === 1 ? 'middle' : 'start') +
    '" class="pg-t">' +
    fmtDate(list[0].t) +
    '</text>';
  if (n > 1)
    s += '<text x="' + X(n - 1).toFixed(1) + '" y="' + (H - 7) + '" text-anchor="end" class="pg-t">' + fmtDate(list[n - 1].t) + '</text>';
  return (
    '<div class="chart"><svg viewBox="0 0 ' +
    W +
    ' ' +
    H +
    '" role="img" aria-label="Lijngrafiek van je oefenscore per sessie">' +
    s +
    '</svg></div>'
  );
}

const FILTERS: readonly (readonly [Filter, string])[] = [
  ['toets', 'Proeftoetsen'],
  ['oefen', 'Oefenen'],
  ['alles', 'Alles'],
];

/** tel [goed, totaal] op over sessies */
function optellen(doel: Record<string, Telling>, bron: Partial<Record<string, Telling>>): void {
  Object.keys(bron).forEach((k) => {
    const b = bron[k];
    if (!b) return;
    const d = (doel[k] = doel[k] || [0, 0]);
    d[0] += b[0];
    d[1] += b[1];
  });
}

export function viewProgress(): string {
  const all = S.history;
  let h =
    '<header class="stack"><h2>Je voortgang</h2><p class="lead">Elke proeftoets en elke oefenronde wordt hier bijgehouden, alleen voor jou.</p></header>';
  if (!all.length)
    return (
      h +
      '<section class="card"><h3>Nog geen resultaten</h3><p>Maak een korte proeftoets om te zien waar je staat. Dat kost ongeveer drie kwartier.</p><div class="row"><button class="btn pri" data-act="start" data-mode="short">Start de korte proeftoets</button><a class="btn" href="#oefenen" data-act="nav" data-v="oefenen">Eerst oefenen</a></div></section>'
    );
  const list = all.filter((x) => (S.filter === 'alles' ? true : S.filter === 'toets' ? x.mode !== 'oefen' : x.mode === 'oefen')).slice(-20);
  const seg =
    '<div class="seg" role="group" aria-label="Kies wat de grafiek laat zien">' +
    FILTERS.map(
      (o) =>
        '<button type="button" data-act="filter" data-val="' + o[0] + '" aria-pressed="' + (S.filter === o[0]) + '">' + o[1] + '</button>',
    ).join('') +
    '</div>';
  const best = list.length ? Math.max(...list.map((x) => x.score)) : 0;
  const stats = list.length
    ? '<dl class="stats"><div><dt>Laatste</dt><dd>' +
      list[list.length - 1].score +
      '</dd></div><div><dt>Hoogste</dt><dd>' +
      best +
      '</dd></div><div><dt>Sessies</dt><dd>' +
      list.length +
      '</dd></div></dl>'
    : '';
  h +=
    '<section class="card"><h3>Oefenscore per sessie</h3>' +
    seg +
    stats +
    (list.length
      ? progressChart(list) +
        '<p class="small">' +
        (list.length === 1
          ? 'Dit is je eerste meting. Na een tweede sessie zie je hier een lijn.'
          : 'De laatste ' + list.length + ' sessies. Tik op een punt voor de details.') +
        '</p>'
      : '<p class="small">Nog geen sessies van dit soort.</p>') +
    '</section>';
  const recent = all.slice(-12);
  const dom: Record<string, Telling> = {};
  const et: Record<string, Telling> = {};
  recent.forEach((x) => {
    optellen(dom, x.dom || {});
    optellen(et, x.et || {});
  });
  h +=
    '<section class="card"><h3>Per domein</h3><p class="small">Over je laatste ' +
    recent.length +
    (recent.length === 1 ? ' sessie.' : ' sessies.') +
    '</p>' +
    bars(dom, ['A', 'B', 'C', 'D'], DOM_NAMEN) +
    '</section>';
  const weak = Object.keys(et)
    .filter((e) => et[e][1] >= 3 && et[e][0] / et[e][1] < 0.7)
    .sort((a, b) => et[a][0] / et[a][1] - et[b][0] / et[b][1])
    .slice(0, 5);
  h += '<section class="card"><h3>Hier valt het meeste te winnen</h3>';
  if (weak.length)
    h +=
      '<ul class="list">' +
      weak
        .map(
          (e) =>
            '<li><span>' +
            (ET[e] || e) +
            '<span class="tiny">' +
            e +
            ' · ' +
            et[e][0] +
            ' van ' +
            et[e][1] +
            ' goed</span></span><button class="btn sm" data-act="pracet" data-et="' +
            e +
            '">Oefen</button></li>',
        )
        .join('') +
      '</ul>';
  else
    h +=
      '<p class="small">Er is nog geen onderwerp dat er duidelijk uitspringt. Na meer opgaven verschijnen hier de onderwerpen waar je de meeste fouten maakt.</p>';
  h += '</section>';
  h +=
    '<section class="card"><h3>Alle sessies</h3><div class="tblw"><table class="tbl hist"><thead><tr><th scope="col">Datum</th><th scope="col">Soort</th><th scope="col">Goed</th><th scope="col">Score</th></tr></thead><tbody>' +
    all
      .slice()
      .reverse()
      .slice(0, 40)
      .map(
        (x) =>
          '<tr><td class="tl">' +
          fmtDate(x.t) +
          '</td><td class="tl">' +
          MODE_NAME[x.mode] +
          '</td><td>' +
          x.ok +
          NB +
          '/' +
          NB +
          x.n +
          '</td><td><b>' +
          x.score +
          '</b></td></tr>',
      )
      .join('') +
    '</tbody></table></div>' +
    '<p class="tiny">' +
    (canStore
      ? 'Je voortgang wordt bewaard in deze browser. Als je de browsergegevens wist of een ander apparaat gebruikt, is hij weg.'
      : 'Deze browser kan je voortgang niet bewaren. Hij blijft staan zolang deze pagina open is.') +
    '</p>' +
    '<div class="row">' +
    (LS.get('last') ? '<button class="btn sm" data-act="showlast">Bekijk de laatste uitslag</button>' : '') +
    '<button class="btn sm ghost quiet" data-act="askclear">Wis mijn voortgang</button></div></section>';
  return h;
}
