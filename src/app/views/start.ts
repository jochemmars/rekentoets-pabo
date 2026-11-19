/* Startscherm: verder gaan, oefenvorm kiezen, laatste resultaat, voorbeeldsom. */
import { verdict } from '../../engine';
import { MODE_NAME } from '../eindtermen';
import { fmtDate, pill } from '../hulp';
import { I } from '../iconen';
import { S } from '../state';
import { answerUi, feedback, qBody } from './opgave';

function demoHtml(): string {
  const u = S.demo;
  if (!u) return '';
  const q = u.q;
  return (
    '<details class="card demo demo-d"' +
    (S.demoOpen ? ' open' : '') +
    '><summary><span><b>Probeer een voorbeeldsom</b><span class="tiny">Eén opgave hoofdrekenen, zonder klok</span></span>' +
    I.down +
    '</summary><div class="demo-b">' +
    qBody(q) +
    answerUi(u, 'demo') +
    (u.checked
      ? feedback(q, u.given, !!u.ok) + '<div class="row"><button class="btn" data-act="demonew">Nog een som</button></div>'
      : '<div class="row"><button class="btn" data-act="democheck">Controleer</button></div>') +
    '</div></details>'
  );
}

export function viewStart(): string {
  const saved = S.s;
  const last = S.history.length ? S.history[S.history.length - 1] : null;
  let h = '';
  h +=
    '<header class="hero"><p class="eyebrow">Landelijke reken- en wiskundetoets (RWT)</p><h1>Oefen de rekentoets voor de pabo</h1><p class="lead">Proeftoetsen in de opbouw van de echte toets. Elke keer met nieuwe getallen en nieuwe verhalen, en na afloop de uitwerking van elke opgave.</p></header>';
  if (saved) {
    const pos =
      saved.kind === 'test'
        ? 'opgave ' + Math.min(saved.idx + 1, saved.plan.length) + ' van ' + saved.plan.length
        : saved.items.length + ' opgaven gemaakt';
    h +=
      '<section class="card"><h3>Je was nog bezig</h3><p>' +
      MODE_NAME[saved.mode] +
      ', ' +
      pos +
      '. De tijd heeft stilgestaan.</p><div class="row"><button class="btn pri" data-act="resume">Verder gaan</button><button class="btn" data-act="discard">Stoppen</button></div></section>';
  }
  // alleen de hoofdmodus krijgt een gevulde knop; de andere twee zijn rustige secundaire knoppen
  h +=
    '<section class="stack"><h2>Kies een oefenvorm</h2><div class="modes">' +
    '<article class="card mode main"><h3>Volledige proeftoets</h3><ul class="facts"><li>55 opgaven</li><li>17 + 103 minuten</li><li>niet terugbladeren</li></ul><button class="btn pri" data-act="start" data-mode="full">Start de proeftoets</button></article>' +
    '<article class="card mode"><h3>Korte proeftoets</h3><ul class="facts"><li>20 opgaven</li><li>6 + 38 minuten</li><li>zelfde opbouw</li></ul><button class="btn" data-act="start" data-mode="short">Start' +
    I.arrow +
    '</button></article>' +
    '<article class="card mode"><h3>Oefenen per domein</h3><ul class="facts"><li>zonder tijdsdruk</li><li>meteen de uitwerking</li></ul><a class="btn" href="#oefenen" data-act="nav" data-v="oefenen">Kies onderwerpen' +
    I.arrow +
    '</a></article></div></section>';
  if (last)
    h +=
      '<section class="card"><h3>Laatste resultaat</h3><div class="row">' +
      pill(verdict(last.score)) +
      '<span>Oefenscore <b>' +
      last.score +
      '</b></span><span class="tiny">' +
      MODE_NAME[last.mode] +
      ', ' +
      fmtDate(last.t) +
      '</span></div><div class="row"><a class="btn sm ghost" href="#voortgang" data-act="nav" data-v="voortgang">Bekijk je voortgang' +
      I.arrow +
      '</a></div></section>';
  h += demoHtml();
  h +=
    '<p class="tiny">Deze oefenapp is niet van Cito. De opgaven zijn zelfgemaakte variaties op de eindtermen van de RWT, geen echte toetsopgaven.</p>';
  return h;
}
