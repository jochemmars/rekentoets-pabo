/* Opstarten: bewaarde gegevens inlezen, luisteraars koppelen en het eerste scherm tekenen. */
import { TPL } from '../banken';
import { make } from '../core/opbouw';
import { Rng } from '../core/rng';
import { newDemo } from './flow';
import { luister } from './invoer';
import { alsSessie, cleanHist, isDomein, LS } from './opslag';
import { render, viewFromHash } from './render';
import { S } from './state';
import { startTeller } from './teller';

function leesInstelling(): void {
  const p = LS.get('prac');
  if (!p || typeof p !== 'object' || !('doms' in p) || !Array.isArray(p.doms)) return;
  const o = p as { doms: unknown[]; part?: unknown; level?: unknown; count?: unknown };
  const lv = Number(o.level) || 0;
  S.prac = {
    doms: o.doms.filter(isDomein),
    part: o.part === 'H' || o.part === 'N' ? o.part : 'HN',
    level: lv === 1 || lv === 2 || lv === 3 ? lv : 0,
    count: o.count === 20 || o.count === 0 ? o.count : 10,
  };
}

export function boot(): void {
  S.wiped = Number(LS.get('wiped')) || 0;
  S.history = cleanHist(LS.get('history'), S.wiped);
  leesInstelling();
  S.s = alsSessie(LS.get('session'));
  S.timerHidden = LS.get('timerHidden') === true;
  newDemo();
  S.view = viewFromHash();
  luister();
  render();
  startTeller();
  // testhaak voor de end-to-end-tests (alleen met ?e2e in de adresbalk)
  if (new URLSearchParams(location.search).has('e2e'))
    Object.defineProperty(window, '__rwt', { configurable: true, value: { S, TPL, make, Rng } });
}
