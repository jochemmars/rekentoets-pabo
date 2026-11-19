/* Vaardigheidsschatting (één-parameter-logistisch model met een zwakke voorkeur voor het midden) en de oefenscore. */
import type { Niveau } from '../core/types';
import type { Oordeel } from './types';

const DISC = 1.3;
const SIGMA = 1.2;
/** moeilijkheid per niveau */
export const BL: Record<Niveau, number> = { 1: -1, 2: 0, 3: 1 };

/** kans op een goed antwoord bij vaardigheid th op dit niveau */
export function pOk(th: number, level: Niveau): number {
  return 1 / (1 + Math.exp(-DISC * (th - BL[level])));
}

export interface Antwoord {
  level: Niveau;
  ok: boolean;
}
/** meest waarschijnlijke vaardigheid bij deze antwoorden (Newton-Raphson) */
export function estimate(resp: readonly Antwoord[]): number {
  let th = 0;
  for (let it = 0; it < 40; it++) {
    let g = -th / (SIGMA * SIGMA);
    let h = -1 / (SIGMA * SIGMA);
    for (const a of resp) {
      const p = pOk(th, a.level);
      g += DISC * ((a.ok ? 1 : 0) - p);
      h -= DISC * DISC * p * (1 - p);
    }
    const step = g / h;
    th -= step;
    if (Math.abs(step) < 1e-7) break;
  }
  return th;
}

/** oefenscore: verwacht percentage goed op een vaste mix van makkelijke, gemiddelde en moeilijke opgaven */
export function scoreOf(th: number): number {
  return Math.round(((pOk(th, 1) + pOk(th, 2) + pOk(th, 3)) / 3) * 100);
}

export function levelFor(th: number): Niveau {
  return th < -0.5 ? 1 : th <= 0.5 ? 2 : 3;
}

export function verdict(score: number): Oordeel {
  if (score >= 70)
    return { key: 'good', label: 'Op koers', text: 'Je maakt opgaven op toetsniveau meestal goed. Blijf oefenen om dit vast te houden.' };
  if (score >= 55)
    return {
      key: 'warn',
      label: 'Bijna',
      text: 'Je zit dicht bij het niveau van de toets. Oefen gericht met de domeinen waar je de meeste fouten maakt.',
    };
  return {
    key: 'bad',
    label: 'Nog oefenen',
    text: 'Opgaven op toetsniveau gaan nog te vaak fout. Begin met oefenen per domein, zonder tijdsdruk.',
  };
}
