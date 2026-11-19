/* Een nieuwe proeftoets of oefenronde starten, en een antwoord vastleggen. */
import { Rng } from '../core/rng';
import type { Gegeven } from '../core/types';
import { MODES, type Modus } from './constanten';
import { makePlan } from './kiezen';
import { check } from './nakijken';
import { BL, estimate } from './schatting';
import type { OefenSelectie, OefenSessie, Sessie, ToetsSessie } from './types';

// let op: de volgorde van de sleutels is bewust gelijk aan de oorspronkelijke app (bewaarde sessies, golden master)
export function newTest(mode: Modus, seed: number): ToetsSessie {
  return {
    v: 1,
    kind: 'test',
    mode,
    seed,
    started: Date.now(),
    plan: makePlan(mode, new Rng(seed)),
    idx: 0,
    items: [],
    used: {},
    theta: 0,
    phase: 'introH',
    left: { H: MODES[mode].tH, N: MODES[mode].tN },
    spent: { H: 0, N: 0 },
    cur: null,
  };
}

export function newPractice(sel: OefenSelectie, seed: number): OefenSessie {
  return {
    v: 1,
    kind: 'oefen',
    mode: 'oefen',
    seed,
    started: Date.now(),
    sel,
    idx: 0,
    items: [],
    used: {},
    theta: sel.level ? BL[sel.level] : -0.3,
    phase: 'run',
    cur: null,
    spent: { H: 0, N: 0 },
  };
}

/** leg het antwoord op de huidige opgave vast; geeft terug of het goed was */
export function record(s: Sessie, given: Gegeven, secs: number): boolean {
  const q = s.cur;
  if (!q) throw new Error('Er is geen opgave om na te kijken.');
  const ok = check(q, given);
  s.items.push({ q, given, ok, secs: Math.round(secs), level: q.level, dom: q.dom, part: q.part, et: q.et, id: q.id });
  s.idx++;
  s.cur = null;
  if (!(s.kind === 'oefen' && s.sel.level)) s.theta = estimate(s.items);
  return ok;
}
