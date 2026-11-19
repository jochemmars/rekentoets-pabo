import { describe, expect, it } from 'vitest';
import { Rng } from '../../src/core/rng';

describe('Rng', () => {
  it('geeft bij dezelfde seed dezelfde reeks', () => {
    const a = new Rng(42);
    const b = new Rng(42);
    expect(Array.from({ length: 5 }, () => a.n())).toEqual(Array.from({ length: 5 }, () => b.n()));
  });

  it('geeft bij een andere seed een andere reeks', () => {
    expect(new Rng(1).n()).not.toBe(new Rng(2).n());
  });

  it('int blijft binnen de grenzen, beide inclusief', () => {
    const r = new Rng(7);
    const gezien = new Set<number>();
    for (let i = 0; i < 500; i++) {
      const v = r.int(3, 6);
      expect(v).toBeGreaterThanOrEqual(3);
      expect(v).toBeLessThanOrEqual(6);
      gezien.add(v);
    }
    expect([...gezien].sort()).toEqual([3, 4, 5, 6]);
  });

  it('shuffle levert een permutatie en laat het origineel heel', () => {
    const r = new Rng(9);
    const bron = [1, 2, 3, 4, 5, 6];
    const uit = r.shuffle(bron);
    expect(bron).toEqual([1, 2, 3, 4, 5, 6]);
    expect([...uit].sort()).toEqual(bron);
  });

  it('sample geeft k verschillende elementen', () => {
    const uit = new Rng(3).sample(['a', 'b', 'c', 'd', 'e'], 3);
    expect(uit).toHaveLength(3);
    expect(new Set(uit).size).toBe(3);
  });
});
