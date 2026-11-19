/* Opslag in deze browser (localStorage). Alles wat terugkomt is onbekend tot het gecontroleerd is. */
import type { Domein, Niveau } from '../core/types';
import type { HistorieRegel, Sessie, Telling } from '../engine';
import { MODE_NAME } from './eindtermen';
import { S, type Resultaat } from './state';

const mem: Record<string, unknown> = {};
const PREFIX = 'rwt.';

/** valt terug op het geheugen als localStorage niet werkt (privévenster, geblokkeerd) */
export const LS = {
  get(k: string): unknown {
    try {
      const v = window.localStorage.getItem(PREFIX + k);
      return v ? (JSON.parse(v) as unknown) : mem[k] === undefined ? null : mem[k];
    } catch {
      return mem[k] === undefined ? null : mem[k];
    }
  },
  set(k: string, v: unknown): boolean {
    mem[k] = v;
    try {
      window.localStorage.setItem(PREFIX + k, JSON.stringify(v));
      return true;
    } catch {
      return false;
    }
  },
  del(k: string): void {
    delete mem[k];
    try {
      window.localStorage.removeItem(PREFIX + k);
    } catch {
      /* geen opslag beschikbaar */
    }
  },
};

export const canStore = ((): boolean => {
  try {
    window.localStorage.setItem(PREFIX + 't', '1');
    window.localStorage.removeItem(PREFIX + 't');
    return true;
  } catch {
    return false;
  }
})();

export function saveSession(): void {
  if (S.s) LS.set('session', S.s);
}

const isObject = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object';

/** een bewaarde sessie die we kunnen hervatten (zelfde versie, bekend soort) */
export function alsSessie(x: unknown): Sessie | null {
  return isObject(x) && x.v === 1 && (x.kind === 'test' || x.kind === 'oefen') ? (x as unknown as Sessie) : null;
}
export function alsResultaat(x: unknown): Resultaat | null {
  return isObject(x) && (x.kind === 'test' || x.kind === 'oefen') && isObject(x.sum) && Array.isArray(x.items)
    ? (x as unknown as Resultaat)
    : null;
}

/* ---------- voortgang: alleen in deze browser ---------- */
const HIST_MAX = 150;

function cleanPair(o: unknown): Record<string, Telling> {
  const out: Record<string, Telling> = {};
  if (isObject(o))
    Object.keys(o)
      .slice(0, 60)
      .forEach((k) => {
        const v = o[k];
        if (/^[A-Z](\.\d{1,2})?$/.test(k) && Array.isArray(v) && isFinite(Number(v[0])) && isFinite(Number(v[1])))
          out[k] = [Math.max(0, Math.round(Number(v[0]))), Math.max(0, Math.round(Number(v[1])))];
      });
  return out;
}

const isModus = (m: unknown): m is HistorieRegel['mode'] => typeof m === 'string' && m in MODE_NAME;
const eindig = (x: unknown): boolean => isFinite(Number(x));

/** controleer en schoon de bewaarde voortgang op; sessies van vóór het wissen vallen weg */
export function cleanHist(list: unknown, wiped: number): HistorieRegel[] {
  const seen: Record<string, 1> = {};
  const out: HistorieRegel[] = [];
  (Array.isArray(list) ? (list as unknown[]) : []).forEach((h) => {
    if (
      !isObject(h) ||
      typeof h.id !== 'string' ||
      !/^[a-z0-9]{3,24}$/.test(h.id) ||
      seen[h.id] ||
      !isModus(h.mode) ||
      !eindig(h.t) ||
      !eindig(h.score) ||
      !eindig(h.n) ||
      !eindig(h.ok) ||
      Number(h.t) <= (wiped || 0)
    )
      return;
    seen[h.id] = 1;
    const e: HistorieRegel = {
      id: h.id,
      t: Number(h.t),
      mode: h.mode,
      n: Math.max(0, Math.round(Number(h.n))),
      ok: Math.max(0, Math.round(Number(h.ok))),
      score: Math.min(100, Math.max(0, Math.round(Number(h.score)))),
      dom: cleanPair(h.dom),
      part: cleanPair(h.part),
      et: cleanPair(h.et),
      secs: eindig(h.secs) ? Math.round(Number(h.secs)) : 0,
    };
    const sel = h.sel;
    if (isObject(sel) && typeof sel.d === 'string' && /^[A-D]{1,4}$/.test(sel.d))
      e.sel = {
        d: sel.d,
        p: sel.p === 'H' || sel.p === 'N' ? (sel.p) : 'HN',
        l: Number(sel.l) >= 1 && Number(sel.l) <= 3 ? (Math.round(Number(sel.l)) as Niveau) : 0,
      };
    out.push(e);
  });
  out.sort((a, b) => a.t - b.t);
  return out.slice(-HIST_MAX);
}

export function saveHistory(): void {
  LS.set('history', S.history);
}

export const isDomein = (d: unknown): d is Domein => d === 'A' || d === 'B' || d === 'C' || d === 'D';
