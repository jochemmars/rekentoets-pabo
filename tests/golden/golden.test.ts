import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { bouwEngine, bouwOpgaven, VASTE_TIJD, type GoldenApi } from './bouw.ts';

interface Golden {
  opgaven: Record<string, unknown>;
  engine: Record<string, unknown>;
}
const golden = JSON.parse(readFileSync(new URL('./golden.json', import.meta.url), 'utf8')) as Golden;

let api: GoldenApi;
beforeAll(async () => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(VASTE_TIJD);
  api = (await import('../../src/kern.ts')).RWT as GoldenApi;
});

describe('golden master', () => {
  it('heeft dezelfde 107 opgavetypes in dezelfde volgorde', () => {
    const ids = [...new Set(Object.keys(golden.opgaven).map((k) => k.split('|')[0]))];
    expect(api.TPL.map((t) => t.id)).toEqual(ids);
  });

  it('maakt elke opgave exact zoals voorheen', () => {
    const nu = bouwOpgaven(api);
    const anders = Object.keys(golden.opgaven).filter((k) => JSON.stringify(nu[k]) !== JSON.stringify(golden.opgaven[k]));
    // bij een verschil: toon de eerste afwijking volledig
    if (anders.length)
      expect({ sleutel: anders[0], opgave: nu[anders[0]] }).toEqual({ sleutel: anders[0], opgave: golden.opgaven[anders[0]] });
    expect(anders).toEqual([]);
  });

  it('kiest, kijkt na en scoort exact zoals voorheen', () => {
    const nu = bouwEngine(api);
    for (const deel of Object.keys(golden.engine)) {
      expect(JSON.parse(JSON.stringify(nu[deel])) as unknown, deel).toEqual(golden.engine[deel]);
    }
  });
});
