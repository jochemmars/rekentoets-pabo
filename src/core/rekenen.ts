/* Rekenen zonder afrondingsruis. */

/** Rond af op d decimalen, half naar boven (weg van nul); bestand tegen 34.125 -> 34.12-fouten. */
export function rnd(x: number, d = 6): number {
  if (Number.isInteger(x)) return x;
  const s = x < 0 ? -1 : 1;
  const a = Math.abs(x);
  let e = 3;
  while (e > 0 && a * Math.pow(10, d + e) > 9e14) e--;
  const big = Math.round(a * Math.pow(10, d + e));
  if (e === 0) return (s * big) / Math.pow(10, d);
  return (s * Math.floor((big + 5 * Math.pow(10, e - 1)) / Math.pow(10, e))) / Math.pow(10, d);
}

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
}

export function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}

export function sum(arr: readonly number[]): number {
  let s = 0;
  for (const v of arr) s += v;
  return s;
}
