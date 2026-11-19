/* Toevalsgetallen met een seed, zodat een toets na herladen exact te herstellen is. */

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class Rng {
  private readonly f: () => number;

  constructor(seed: number) {
    this.f = mulberry32(seed >>> 0);
  }

  /** getal in [0, 1) */
  n(): number {
    return this.f();
  }

  /** geheel getal van a tot en met b */
  int(a: number, b: number): number {
    return a + Math.floor(this.f() * (b - a + 1));
  }

  pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(this.f() * arr.length)];
  }

  shuffle<T>(arr: readonly T[]): T[] {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(this.f() * (i + 1));
      const t = a[i];
      a[i] = a[j];
      a[j] = t;
    }
    return a;
  }

  sample<T>(arr: readonly T[], k: number): T[] {
    return this.shuffle(arr).slice(0, k);
  }

  chance(p: number): boolean {
    return this.f() < p;
  }
}
