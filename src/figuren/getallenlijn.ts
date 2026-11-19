/* Getallenlijn met maatstreepjes en eventueel een pijl met een vraagteken. */
import { nf } from '../core/notatie';
import { rnd } from '../core/rekenen';
import { c2, ln, svg, tx } from './svg';

export interface GetallenlijnOpties {
  min: number;
  max: number;
  major: number;
  minor: number;
  /** positie van de pijl met '?' */
  arrow?: number;
  /** getallen bij elk groot streepje, of alleen bij de uiteinden */
  labels?: 'major' | 'ends';
}
export function nline(o: GetallenlijnOpties): string {
  const W = 320;
  const H = 86;
  const x0 = 20;
  const x1 = 300;
  const y = 50;
  let s = '';
  const X = (v: number) => x0 + ((v - o.min) / (o.max - o.min)) * (x1 - x0);
  s += ln(x0 - 10, y, x1 + 10, y, 'fg-axis');
  const nMin = Math.round((o.max - o.min) / o.minor);
  const per = Math.round(o.major / o.minor);
  for (let i = 0; i <= nMin; i++) {
    const v = o.min + i * o.minor;
    const maj = i % per === 0;
    s += ln(X(v), y - (maj ? 10 : 5), X(v), y + (maj ? 10 : 5), 'fg-axis');
    const show = o.labels === 'ends' ? i === 0 || i === nMin : maj;
    if (show) s += tx(c2(X(v)), y + 27, nf(rnd(v, 6)), 'ft-tick', 'middle');
  }
  if (o.arrow !== undefined) {
    const ax = c2(X(o.arrow));
    s +=
      '<path d="M' +
      ax +
      ',12 V' +
      (y - 13) +
      ' M' +
      (ax - 5) +
      ',' +
      (y - 21) +
      ' L' +
      ax +
      ',' +
      (y - 12) +
      ' L' +
      (ax + 5) +
      ',' +
      (y - 21) +
      '" class="fg-arrow"/>' +
      tx(ax + 8, 22, '?', 'ft-q');
  }
  return svg(W, H, s, 'Getallenlijn van ' + nf(o.min) + ' tot ' + nf(o.max));
}
