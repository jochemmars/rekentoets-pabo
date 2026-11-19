// Golden master: legt de uitvoer van alle opgavetypes, de engine en de notatie vast.
// Dezelfde functie draait op de oude bundel (om golden.json te maken) en op de nieuwe
// TypeScript-modules (in golden.test.ts). De uitvoer moet byte voor byte gelijk blijven.

export interface GoldenRng {
  n(): number;
}
export interface GoldenTpl {
  id: string;
  dom: string;
  part: string;
}
export interface GoldenVeld {
  ans: number;
  dec?: number;
}
export interface GoldenOpgave {
  type: string;
  ans?: unknown;
  opts?: unknown[];
  items?: unknown[];
  fields?: GoldenVeld[];
}
export interface GoldenSessie {
  cur: GoldenOpgave | null;
}
export interface GoldenApi {
  TPL: readonly GoldenTpl[];
  Rng: new (seed: number) => GoldenRng;
  make(tpl: GoldenTpl, level: number, rng: GoldenRng): GoldenOpgave;
  kit: {
    nf(x: number, d?: number): string;
    inp(x: number, d?: number): string;
    eur(x: number): string;
    klok(mins: number): string;
    words(n: number): string;
    frs(n: number, d: number): string;
    rnd(x: number, d?: number): number;
  };
  engine: {
    newTest(mode: string, seed: number): GoldenSessie;
    newPractice(sel: object, seed: number): GoldenSessie;
    nextQuestion(s: GoldenSessie): GoldenOpgave | null;
    record(s: GoldenSessie, given: unknown, secs: number): boolean;
    summarize(s: GoldenSessie): unknown;
    historyEntry(s: GoldenSessie, sum: unknown): unknown;
    answerHtml(q: GoldenOpgave): string;
    givenHtml(q: GoldenOpgave, given: unknown): string;
    isComplete(q: GoldenOpgave, given: unknown): boolean;
    parseNum(s: string): number | null;
    estimate(resp: { level: number; ok: boolean }[]): number;
    scoreOf(th: number): number;
    levelFor(th: number): number;
    verdict(score: number): unknown;
  };
}

export const SEEDS = [101, 202, 303];
export const VASTE_TIJD = 1700000000000;

// JSON-kopie, zodat undefined-velden en key-volgorde vergeleken worden zoals ze geserialiseerd worden
const kopie = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

function antwoord(api: GoldenApi, q: GoldenOpgave, goed: boolean): unknown {
  if (q.type === 'mc') {
    const ans = q.ans as number;
    return goed ? ans : (ans + 1) % (q.opts?.length ?? 1);
  }
  if (q.type === 'order') {
    const ans = q.ans as number[];
    return goed ? ans.slice() : ans.slice().reverse();
  }
  return (q.fields ?? []).map((f) => (goed ? api.kit.inp(f.ans, f.dec) : '999999'));
}

function sessie(api: GoldenApi, s: GoldenSessie, max: number) {
  const stappen: unknown[] = [];
  for (let i = 0; i < max; i++) {
    const q = api.engine.nextQuestion(s);
    if (!q) break;
    const goed = i % 3 !== 2;
    const given = antwoord(api, q, goed);
    stappen.push({
      q: kopie(q),
      compleet: api.engine.isComplete(q, given),
      ok: api.engine.record(s, given, 20 + i),
      antwoord: api.engine.answerHtml(q),
      gegeven: api.engine.givenHtml(q, given),
    });
  }
  const sum = api.engine.summarize(s);
  return { stappen, sum: kopie(sum), historie: kopie(api.engine.historyEntry(s, sum)), eind: kopie(s) };
}

export function bouwOpgaven(api: GoldenApi): Record<string, unknown> {
  const uit: Record<string, unknown> = {};
  for (const tpl of api.TPL) {
    for (const L of [1, 2, 3]) {
      for (const seed of SEEDS) {
        const sleutel = `${tpl.id}|${L}|${seed}`;
        try {
          uit[sleutel] = kopie(api.make(tpl, L, new api.Rng(seed * 1000 + L)));
        } catch (e) {
          uit[sleutel] = { fout: String(e) };
        }
      }
    }
  }
  return uit;
}

export function bouwEngine(api: GoldenApi): Record<string, unknown> {
  const E = api.engine;
  const oefen = [
    { doms: ['A', 'B', 'C', 'D'], part: 'HN', level: 0, count: 10 },
    { doms: ['B'], part: 'H', level: 2, count: 10 },
    { doms: ['C', 'D'], part: 'N', level: 3, count: 10 },
    { doms: ['A'], part: 'HN', level: 0, count: 0 },
    { doms: ['D'], part: 'N', level: 0, count: 10, tpls: [api.TPL[api.TPL.length - 1]?.id, api.TPL[api.TPL.length - 2]?.id] },
  ];
  const getallen = [0, 1, -1, 7, 12.5, -0.25, 999, 1000, 1234567, 0.1 + 0.2, 34.125, 2.675, 1e-7, 1 / 3, 1250000000];
  return {
    toets: {
      full42: sessie(api, E.newTest('full', 42), 80),
      full4242: sessie(api, E.newTest('full', 4242), 80),
      short7: sessie(api, E.newTest('short', 7), 40),
      short77: sessie(api, E.newTest('short', 77), 40),
    },
    oefen: oefen.map((sel, i) => sessie(api, E.newPractice(sel, 900 + i), 25)),
    parseNum: ['12', '12,5', '1.250', ' 3 ', '-4', ',5', '5,', 'abc', '', '1,2,3', '−3'].map((x) => [x, E.parseNum(x)]),
    schatting: [
      [],
      [{ level: 2, ok: true }],
      [
        { level: 1, ok: false },
        { level: 3, ok: true },
      ],
      Array.from({ length: 20 }, (_, i) => ({ level: (i % 3) + 1, ok: i % 4 !== 0 })),
    ].map((r) => {
      const th = E.estimate(r);
      return [th, E.scoreOf(th), E.levelFor(th), kopie(E.verdict(E.scoreOf(th)))];
    }),
    notatie: getallen.map((x) => [x, api.kit.nf(x), api.kit.nf(x, 2), api.kit.inp(x), api.kit.eur(x), api.kit.rnd(x, 2)]),
    klok: [0, 59, 60, 527, 1439, 1440, -30].map((m) => api.kit.klok(m)),
    woorden: [0, 1, 13, 21, 22, 33, 100, 101, 999, 1000, 2025, 1000000, 3456789].map((n) => api.kit.words(n)),
    breuken: [
      [1, 2],
      [2, 4],
      [6, 4],
      [9, 3],
      [7, 12],
      [22, 7],
    ].map(([n, d]) => api.kit.frs(n, d)),
  };
}

export function bouwGolden(api: GoldenApi) {
  return { opgaven: bouwOpgaven(api), engine: bouwEngine(api) };
}
