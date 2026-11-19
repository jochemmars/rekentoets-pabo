/* Kaart met vakken en een plattegrond met hoogtegetallen. */
import { c2, ln, svg, tx } from './svg';

export interface Markering {
  /** kolom vanaf 0 (A) */
  c: number;
  /** rij vanaf 0 (onder) */
  r: number;
  /** letter in de stip */
  t: string;
}
export interface KaartOpties {
  n: number;
  marks?: readonly Markering[];
  compass?: boolean;
}
export function map(o: KaartOpties): string {
  const n = o.n;
  const cs = n > 7 ? 30 : 34;
  const L = 24;
  const T = 8;
  const W = L + n * cs + (o.compass ? 44 : 8);
  const H = T + n * cs + 24;
  let s = '';
  for (let i = 0; i <= n; i++)
    s += ln(L + i * cs, T, L + i * cs, T + n * cs, 'fg-cell') + ln(L, T + i * cs, L + n * cs, T + i * cs, 'fg-cell');
  for (let i = 0; i < n; i++)
    s +=
      tx(L + i * cs + cs / 2, T + n * cs + 17, 'ABCDEFGHIJ'.charAt(i), 'ft-tick', 'middle') +
      tx(L - 8, T + (n - 1 - i) * cs + cs / 2 + 4, i + 1, 'ft-tick', 'end');
  (o.marks || []).forEach((mk) => {
    const x = L + mk.c * cs + cs / 2;
    const y = T + (n - 1 - mk.r) * cs + cs / 2;
    s += '<circle cx="' + x + '" cy="' + y + '" r="' + c2(cs * 0.34) + '" class="fg-mark"/>' + tx(x, y + 4.5, mk.t, 'ft-mark', 'middle');
  });
  if (o.compass) {
    const x = L + n * cs + 24;
    s +=
      '<path d="M' +
      x +
      ',' +
      (T + 58) +
      ' V' +
      (T + 24) +
      ' M' +
      (x - 6) +
      ',' +
      (T + 33) +
      ' L' +
      x +
      ',' +
      (T + 22) +
      ' L' +
      (x + 6) +
      ',' +
      (T + 33) +
      '" class="fg-arrow"/>' +
      tx(x, T + 15, 'N', 'ft-title', 'middle');
  }
  return svg(W, H, s, 'Kaart met vakken');
}

/** Plattegrond met hoogtegetallen; rij 0 is de achterkant. */
export function hgrid(m: readonly (readonly number[])[]): string {
  const rows = m.length;
  const cols = m[0].length;
  const cs = 42;
  const L = 16;
  const T = 8;
  const W = L + cols * cs + 84;
  const H = T + rows * cs + 34;
  let s = '';
  m.forEach((row, ri) => {
    row.forEach((v, ci) => {
      s +=
        '<rect x="' +
        (L + ci * cs) +
        '" y="' +
        (T + ri * cs) +
        '" width="' +
        cs +
        '" height="' +
        cs +
        '" class="fg-cellbox"/>' +
        tx(L + ci * cs + cs / 2, T + ri * cs + cs / 2 + 7, v, 'ft-big', 'middle');
    });
  });
  const mx = L + (cols * cs) / 2;
  const by = T + rows * cs;
  s +=
    '<path d="M' +
    mx +
    ',' +
    (by + 20) +
    ' V' +
    (by + 7) +
    ' M' +
    (mx - 5) +
    ',' +
    (by + 13) +
    ' L' +
    mx +
    ',' +
    (by + 6) +
    ' L' +
    (mx + 5) +
    ',' +
    (by + 13) +
    '" class="fg-arrow"/>' +
    tx(mx + 10, by + 22, 'voorkant', 'ft');
  const rx = L + cols * cs;
  const my = T + (rows * cs) / 2;
  s +=
    '<path d="M' +
    (rx + 20) +
    ',' +
    my +
    ' H' +
    (rx + 7) +
    ' M' +
    (rx + 13) +
    ',' +
    (my - 5) +
    ' L' +
    (rx + 6) +
    ',' +
    my +
    ' L' +
    (rx + 13) +
    ',' +
    (my + 5) +
    '" class="fg-arrow"/>' +
    tx(rx + 25, my + 4, 'rechts', 'ft');
  return svg(W, H, s, 'Plattegrond van een blokkenbouwsel met hoogtegetallen');
}
