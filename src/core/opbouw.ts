/* Bouwstenen voor opgaven: tekstblokjes, meerkeuze, volgorde, namen, en het register van opgavetypes. */
import { nf } from './notatie';
import { rnd } from './rekenen';
import type { Rng } from './rng';
import type { Domein, Generator, McDeel, Niveau, Onderdeel, Opgave, OrderDeel, RuwVeld, Template } from './types';

/** Gooi dit in een generator om het opnieuw te proberen met nieuwe toevalsgetallen. */
class Opnieuw extends Error {
  constructor() {
    super('opnieuw proberen');
    this.name = 'Opnieuw';
  }
}
export const RETRY: Error = new Opnieuw();

export function steps(...regels: string[]): string {
  return '<ol class="st">' + regels.map((l) => '<li>' + l + '</li>').join('') + '</ol>';
}
export function tip(t: string): string {
  return '<p class="tip"><b>Let op.</b> ' + t + '</p>';
}
export function som(s: string): string {
  return '<div class="sum">' + s + '</div>';
}
export function p(s: string): string {
  return '<p>' + s + '</p>';
}
export function ask(s: string): string {
  return '<p class="ask">' + s + '</p>';
}

type Fout = number | null | undefined;

/** Meerkeuze met getallen, oplopend gesorteerd. */
export function mcNum(_r: Rng, correct: number, wrongs: readonly Fout[], fmt: (v: number) => string = nf): McDeel {
  const c = rnd(correct, 6);
  const seen = [c];
  const ws: number[] = [];
  wrongs.forEach((w) => {
    if (w === undefined || w === null || !isFinite(w)) return;
    const v = rnd(w, 6);
    if (!seen.includes(v)) {
      seen.push(v);
      ws.push(v);
    }
  });
  if (ws.length < 2) throw RETRY;
  const all = ws
    .slice(0, 3)
    .concat([c])
    .sort((a, b) => a - b);
  return { type: 'mc', opts: all.map((v) => fmt(v)), ans: all.indexOf(c) };
}

/** Meerkeuze met teksten, in willekeurige volgorde. */
export function mcTxt(r: Rng, correct: string, wrongs: readonly (string | null | undefined)[]): McDeel {
  const seen = [correct];
  const ws: string[] = [];
  wrongs.forEach((w) => {
    if (w !== undefined && w !== null && !seen.includes(w)) {
      seen.push(w);
      ws.push(w);
    }
  });
  if (ws.length < 2) throw RETRY;
  const all = r.shuffle(ws.slice(0, 3).concat([correct]));
  return { type: 'mc', opts: all, ans: all.indexOf(correct) };
}

export interface OrdItem {
  /** zoals het getoond wordt */
  h: string;
  /** de waarde om op te sorteren */
  v: number;
}
/** Volgorde-opgave: zet de items van klein naar groot. */
export function ordQ(r: Rng, items: readonly OrdItem[]): OrderDeel {
  const vs = items.map((i) => rnd(i.v, 9));
  for (let a = 0; a < vs.length; a++) for (let b = a + 1; b < vs.length; b++) if (vs[a] === vs[b]) throw RETRY;
  const sh = r.shuffle(items);
  const order = sh.map((_it, i) => i).sort((x, y) => sh[x].v - sh[y].v);
  if (order.every((v, i) => v === i)) throw RETRY;
  return { type: 'order', items: sh.map((i) => i.h), ans: order };
}

const NAMES = [
  'Sanne',
  'Daan',
  'Fatima',
  'Lars',
  'Yara',
  'Noah',
  'Emma',
  'Mees',
  'Sara',
  'Jesse',
  'Lotte',
  'Amir',
  'Tess',
  'Finn',
  'Noor',
  'Ruben',
  'Iris',
  'Sem',
  'Lina',
  'Thijs',
  'Meryem',
  'Bram',
  'Jasmijn',
  'Koen',
];
/** een naam, of k verschillende namen */
export function nm(r: Rng): string;
export function nm(r: Rng, k: number): string[];
export function nm(r: Rng, k?: number): string | string[] {
  return k ? r.sample(NAMES, k) : r.pick(NAMES);
}

/* ---------- register van opgavetypes ---------- */

export const TPL: Template[] = [];
export function def(id: string, dom: Domein, part: Onderdeel, et: string, name: string, gen: Generator): void {
  TPL.push({ id, dom, part, et, name, gen });
}

/**
 * Wat make() tijdens het afmaken met een opgave doet. Het object van de generator wordt bewust
 * ter plekke aangepast: zo blijft de volgorde van de sleutels gelijk aan de oorspronkelijke app.
 */
interface InBewerking {
  type: string;
  ans?: number | number[];
  unit?: string;
  pre?: string;
  dec?: number;
  fields?: RuwVeld[];
  id?: string;
  dom?: Domein;
  part?: Onderdeel;
  et?: string;
  name?: string;
  level?: Niveau;
  calc?: boolean;
}

/** Maak een opgave van een type op niveau L (1-3). */
export function make(tpl: Template, L: Niveau, rng: Rng): Opgave {
  for (let i = 0; i < 200; i++) {
    let ruw;
    try {
      ruw = tpl.gen(L, rng);
    } catch (e) {
      if (e === RETRY) continue;
      throw e;
    }
    if (!ruw) continue;
    const q = ruw as InBewerking;
    if (q.type === 'num') {
      q.fields = [{ ans: q.ans as number, unit: q.unit, pre: q.pre, dec: q.dec }];
      q.type = 'multi';
      delete q.ans;
      delete q.unit;
      delete q.pre;
      delete q.dec;
    }
    if (q.type === 'multi' && q.fields)
      q.fields = q.fields.map((f) => {
        const o: RuwVeld = { ans: rnd(f.ans, 6), unit: f.unit || '', pre: f.pre || '' };
        if (f.dec !== undefined) o.dec = f.dec;
        if (f.lab) o.lab = f.lab;
        return o;
      });
    q.id = tpl.id;
    q.dom = tpl.dom;
    q.part = tpl.part;
    q.et = q.et || tpl.et;
    q.name = tpl.name;
    q.level = L;
    q.calc = !!q.calc && tpl.part === 'N';
    return q as Opgave;
  }
  throw new Error('Opgavetype ' + tpl.id + ' (niveau ' + L + ') leverde geen opgave op.');
}
