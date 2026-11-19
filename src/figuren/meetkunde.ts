/* Vlakke en ruimtelijke figuren met maten. */
import { NB, nf } from '../core/notatie';
import { c2, ln, svg, tx } from './svg';

export function rect(wl: string, hl: string, ratio: number): string {
  const w = 190;
  const h = Math.max(54, Math.min(120, 190 * ratio));
  const x0 = 78;
  const y0 = 14;
  const H = y0 + h + 30;
  const s =
    '<rect x="' +
    x0 +
    '" y="' +
    y0 +
    '" width="' +
    w +
    '" height="' +
    c2(h) +
    '" class="fg-shape"/>' +
    tx(x0 + w / 2, c2(y0 + h + 19), wl, 'ft-dim', 'middle') +
    tx(x0 - 8, c2(y0 + h / 2 + 4), hl, 'ft-dim', 'end');
  return svg(320, c2(H), s, 'Rechthoek van ' + wl + ' bij ' + hl);
}

export interface LVormOpties {
  /** buitenmaat breed */
  a: number;
  /** buitenmaat hoog */
  b: number;
  /** lengte van de bovenrand */
  top: number;
  /** hoogte van het rechter onderstuk */
  right: number;
  unit?: string;
}
export function lshape(o: LVormOpties): string {
  const sc = Math.min(190 / o.a, 118 / o.b);
  const w = o.a * sc;
  const h = o.b * sc;
  const c = (o.a - o.top) * sc;
  const d = (o.b - o.right) * sc;
  const x0 = 70;
  const y0 = 22;
  const u = o.unit ? NB + o.unit : '';
  let s =
    '<path class="fg-shape" d="M' +
    x0 +
    ',' +
    y0 +
    ' H' +
    c2(x0 + w - c) +
    ' V' +
    c2(y0 + d) +
    ' H' +
    c2(x0 + w) +
    ' V' +
    c2(y0 + h) +
    ' H' +
    x0 +
    ' Z"/>';
  s += tx(c2(x0 + w / 2), c2(y0 + h + 19), nf(o.a) + u, 'ft-dim', 'middle') + tx(x0 - 8, c2(y0 + h / 2 + 4), nf(o.b) + u, 'ft-dim', 'end');
  s +=
    tx(c2(x0 + (w - c) / 2), y0 - 7, nf(o.top) + u, 'ft-dim', 'middle') +
    tx(c2(x0 + w + 8), c2(y0 + d + (h - d) / 2 + 4), nf(o.right) + u, 'ft-dim');
  return svg(320, c2(y0 + h + 30), s, 'L-vormige figuur');
}

export interface DriehoekOpties {
  base: number;
  h: number;
  unit?: string;
  /** plaats van de top boven de basis, 0 tot 1 */
  apex?: number;
}
export function tri(o: DriehoekOpties): string {
  const bw = 200;
  const hh = Math.max(60, Math.min(120, (200 * o.h) / o.base));
  const x0 = 60;
  const yb = 20 + hh;
  const ax = x0 + bw * (o.apex === undefined ? 0.35 : o.apex);
  const u = o.unit ? NB + o.unit : '';
  let s = '<path class="fg-shape" d="M' + x0 + ',' + c2(yb) + ' H' + (x0 + bw) + ' L' + c2(ax) + ',20 Z"/>' + ln(ax, 20, ax, yb, 'fg-dash');
  s += '<path class="fg-thin" d="M' + c2(ax) + ',' + c2(yb - 9) + ' h9 v9"/>';
  s +=
    tx(x0 + bw / 2, c2(yb + 19), nf(o.base) + u, 'ft-dim', 'middle') +
    (ax > x0 + bw / 2
      ? tx(c2(ax - 7), c2(20 + hh * 0.62 + 4), nf(o.h) + u, 'ft-dim', 'end')
      : tx(c2(ax + 7), c2(20 + hh * 0.62 + 4), nf(o.h) + u, 'ft-dim'));
  return svg(320, c2(yb + 30), s, 'Driehoek met basis ' + nf(o.base) + ' en hoogte ' + nf(o.h));
}

/** cirkel met straal ('r') of middellijn */
export function circ(label: string, mode?: 'r' | 'd'): string {
  const cx = 160;
  const cy = 76;
  const r = 62;
  let s =
    '<circle cx="' +
    cx +
    '" cy="' +
    cy +
    '" r="' +
    r +
    '" class="fg-shape"/><circle cx="' +
    cx +
    '" cy="' +
    cy +
    '" r="2.5" class="fg-pin"/>';
  if (mode === 'r') s += ln(cx, cy, cx + r, cy, 'fg-thin') + tx(cx + r / 2, cy - 7, label, 'ft-dim', 'middle');
  else s += ln(cx - r, cy, cx + r, cy, 'fg-thin') + tx(cx, cy - 8, label, 'ft-dim', 'middle');
  return svg(320, 150, s, 'Cirkel');
}

export interface BalkOpties {
  l: string | number;
  w: string | number;
  h: string | number;
  unit?: string;
  /** hoe vol met water, 0 tot 1 */
  fill?: number;
}
/** balk in scheve projectie */
export function cuboid(o: BalkOpties): string {
  const fw = 150;
  const fh = 84;
  const dx = 44;
  const dy = -30;
  const x0 = 62;
  const y0 = 52;
  const u = o.unit ? NB + o.unit : '';
  let s = '';
  if (o.fill) {
    const wh = fh * o.fill;
    const wy = y0 + fh - wh;
    s +=
      '<path class="fg-water" d="M' +
      x0 +
      ',' +
      c2(wy) +
      ' h' +
      fw +
      ' l' +
      dx +
      ',' +
      dy +
      ' v' +
      c2(wh) +
      ' l' +
      -dx +
      ',' +
      -dy +
      ' h' +
      -fw +
      ' Z"/>';
  }
  s +=
    '<path class="fg-shape-o" d="M' +
    x0 +
    ',' +
    y0 +
    ' h' +
    fw +
    ' v' +
    fh +
    ' h' +
    -fw +
    ' Z M' +
    x0 +
    ',' +
    y0 +
    ' l' +
    dx +
    ',' +
    dy +
    ' h' +
    fw +
    ' l' +
    -dx +
    ',' +
    -dy +
    ' M' +
    (x0 + fw + dx) +
    ',' +
    (y0 + dy) +
    ' v' +
    fh +
    ' l' +
    -dx +
    ',' +
    -dy +
    '"/>';
  s +=
    tx(x0 + fw / 2, y0 + fh + 19, o.l + u, 'ft-dim', 'middle') +
    tx(x0 + fw + dx / 2 + 12, y0 + fh + dy / 2 + 12, o.w + u, 'ft-dim') +
    tx(x0 + fw + dx + 8, y0 + dy + fh / 2 + 4, o.h + u, 'ft-dim');
  return svg(320, y0 + fh + 30, s, 'Balk van ' + o.l + ' bij ' + o.w + ' bij ' + o.h);
}

export function cyl(dl: string, hl: string): string {
  const cx = 140;
  const rx = 58;
  const ry = 15;
  const y0 = 30;
  const h = 96;
  let s =
    '<path class="fg-shape" d="M' +
    (cx - rx) +
    ',' +
    y0 +
    ' v' +
    h +
    ' a' +
    rx +
    ',' +
    ry +
    ' 0 0 0 ' +
    2 * rx +
    ',0 v' +
    -h +
    '"/><ellipse cx="' +
    cx +
    '" cy="' +
    y0 +
    '" rx="' +
    rx +
    '" ry="' +
    ry +
    '" class="fg-shape"/>';
  s += ln(cx - rx, y0, cx + rx, y0, 'fg-thin') + tx(cx, y0 - 20, dl, 'ft-dim', 'middle') + tx(cx + rx + 10, y0 + h / 2 + 6, hl, 'ft-dim');
  return svg(320, y0 + h + 28, s, 'Cilinder');
}

export interface HuisOpties {
  /** breedte */
  w: number;
  /** hoogte van de rechthoek */
  h: number;
  /** hoogte van de driehoek */
  t: number;
  unit?: string;
  /** toon de totale hoogte in plaats van de hoogte van de driehoek */
  total?: number;
}
/** gevel: rechthoek met een driehoek erop */
export function house(o: HuisOpties): string {
  const sc = Math.min(150 / o.w, 130 / (o.h + o.t)),
    W = o.w * sc,
    H = o.h * sc,
    T = o.t * sc,
    x0 = 90,
    y0 = 14,
    u = o.unit ? NB + o.unit : '';
  let s =
    '<path class="fg-shape" d="M' +
    x0 +
    ',' +
    c2(y0 + T) +
    ' L' +
    c2(x0 + W / 2) +
    ',' +
    y0 +
    ' L' +
    c2(x0 + W) +
    ',' +
    c2(y0 + T) +
    ' V' +
    c2(y0 + T + H) +
    ' H' +
    x0 +
    ' Z"/>' +
    ln(x0, y0 + T, x0 + W, y0 + T, 'fg-dash');
  s +=
    tx(c2(x0 + W / 2), c2(y0 + T + H + 19), nf(o.w) + u, 'ft-dim', 'middle') +
    tx(x0 - 8, c2(y0 + T + H / 2 + 4), nf(o.h) + u, 'ft-dim', 'end');
  if (o.total)
    s +=
      ln(x0 + W + 16, y0, x0 + W + 16, y0 + T + H, 'fg-thin') +
      ln(x0 + W + 11, y0, x0 + W + 21, y0, 'fg-thin') +
      ln(x0 + W + 11, y0 + T + H, x0 + W + 21, y0 + T + H, 'fg-thin') +
      tx(c2(x0 + W + 24), c2(y0 + (T + H) / 2 + 4), nf(o.total) + u, 'ft-dim');
  else s += ln(x0 + W / 2, y0, x0 + W / 2, y0 + T, 'fg-dash') + tx(c2(x0 + W / 2 + 6), c2(y0 + T / 2 + 7), nf(o.t) + u, 'ft-dim');
  return svg(320, c2(y0 + T + H + 30), s, 'Gevel: een rechthoek met een driehoek erop');
}
