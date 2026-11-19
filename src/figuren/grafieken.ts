/* Staafdiagram, lijngrafiek en cirkeldiagram. */
import { nf } from '../core/notatie';
import { rnd } from '../core/rekenen';
import { c2, ln, svg, tx } from './svg';

export interface StaafOpties {
  cats: readonly (string | number)[];
  vals: readonly number[];
  yMax: number;
  yStep: number;
  yTitle?: string;
  title?: string;
  /** hulplijnen halverwege */
  half?: boolean;
  label?: string;
}
export function bar(o: StaafOpties): string {
  const W = 320;
  const L = 46;
  const Rt = 8;
  const T = o.title ? 42 : 24;
  const ph = 150;
  const B = 28;
  const H = T + ph + B;
  const pw = W - L - Rt;
  const n = o.cats.length;
  let s = '';
  const y = (v: number) => T + ph - (v / o.yMax) * ph;
  if (o.title) s += tx(L, 15, o.title, 'ft-title');
  if (o.yTitle) s += tx(L, T - 8, o.yTitle, 'ft-ax');
  const k = Math.round(o.yMax / o.yStep);
  if (o.half) for (let j = 0; j < k; j++) s += ln(L, y((j + 0.5) * o.yStep), W - Rt, y((j + 0.5) * o.yStep), 'fg-grid2');
  for (let j = 0; j <= k; j++) {
    const v = j * o.yStep;
    s += ln(L, y(v), W - Rt, y(v), j === 0 ? 'fg-base' : 'fg-grid') + tx(L - 6, c2(y(v) + 4), nf(rnd(v, 6)), 'ft-tick', 'end');
  }
  const band = pw / n;
  const bw = Math.min(24, band * 0.62);
  o.vals.forEach((val, i) => {
    const cx = L + band * (i + 0.5);
    const top = y(val);
    const h = T + ph - top;
    const rr = Math.max(0, Math.min(4, h));
    const x0 = c2(cx - bw / 2);
    const x1 = c2(cx + bw / 2);
    const yb = T + ph;
    if (h > 0)
      s +=
        '<path class="fg-bar" d="M' +
        x0 +
        ',' +
        yb +
        ' V' +
        c2(top + rr) +
        ' Q' +
        x0 +
        ',' +
        c2(top) +
        ' ' +
        c2(x0 + rr) +
        ',' +
        c2(top) +
        ' H' +
        c2(x1 - rr) +
        ' Q' +
        x1 +
        ',' +
        c2(top) +
        ' ' +
        x1 +
        ',' +
        c2(top + rr) +
        ' V' +
        yb +
        ' Z"/>';
    s += tx(c2(cx), T + ph + 16, o.cats[i], 'ft-cat', 'middle');
  });
  return svg(W, H, s, o.label || o.title || 'Staafdiagram');
}

export interface Reeks {
  name: string;
  vals: readonly number[];
}
export interface LijnOpties {
  xs: readonly (string | number)[];
  series: readonly Reeks[];
  yMin?: number;
  yMax: number;
  yStep: number;
  yMinor?: number;
  yTitle?: string;
  xTitle?: string;
  title?: string;
  /** toon elk zoveelste label op de x-as */
  xEvery?: number;
  dots?: boolean;
  label?: string;
}
export function line(o: LijnOpties): string {
  const multi = o.series.length > 1;
  const W = 320;
  const L = 46;
  const Rt = 16;
  const T = (o.title ? 42 : 24) + (multi ? 20 : 0);
  const ph = 150;
  const B = o.xTitle ? 44 : 28;
  const H = T + ph + B;
  const pw = W - L - Rt;
  const n = o.xs.length;
  const yMin = o.yMin || 0;
  const span = o.yMax - yMin;
  let s = '';
  const X = (i: number) => L + (n === 1 ? pw / 2 : (i * pw) / (n - 1));
  const Y = (v: number) => T + ph - ((v - yMin) / span) * ph;
  if (o.title) s += tx(L, 15, o.title, 'ft-title');
  if (o.yTitle) s += tx(L, T - 8, o.yTitle, 'ft-ax');
  const k = Math.round(span / o.yStep);
  const wide = Math.max(...o.xs.map((x) => String(x).length)) * 7 + 12;
  const every = o.xEvery || (n > 1 && pw / (n - 1) < wide ? 2 : 1);
  for (let i = 0; i < n; i++) {
    s += ln(X(i), T, X(i), T + ph, 'fg-grid');
    if (i % every === 0) s += tx(c2(X(i)), T + ph + 16, o.xs[i], 'ft-cat', 'middle');
  }
  if (o.yMinor) {
    const minor = o.yMinor;
    const per = Math.round(o.yStep / minor);
    const nm2 = Math.round(span / minor);
    for (let j = 1; j < nm2; j++) if (j % per !== 0) s += ln(L, Y(yMin + j * minor), W - Rt, Y(yMin + j * minor), 'fg-grid2');
  }
  for (let j = 0; j <= k; j++) {
    const v = rnd(yMin + j * o.yStep, 6);
    s +=
      ln(L, Y(v), W - Rt, Y(v), v === 0 || (j === 0 && yMin >= 0) ? 'fg-base' : 'fg-grid') +
      tx(L - 6, c2(Y(v) + 4), nf(v), 'ft-tick', 'end');
  }
  if (o.xTitle) s += tx(L + pw / 2, H - 6, o.xTitle, 'ft-ax', 'middle');
  o.series.forEach((se, si) => {
    const pts = se.vals.map((val, ii) => c2(X(ii)) + ',' + c2(Y(val))).join(' ');
    s += '<polyline points="' + pts + '" class="fg-ln fg-ln' + (si + 1) + '"/>';
    if (o.dots !== false)
      se.vals.forEach((val, ii) => {
        s +=
          si === 0
            ? '<circle cx="' + c2(X(ii)) + '" cy="' + c2(Y(val)) + '" r="4.5" class="fg-dot fg-s1"/>'
            : '<rect x="' + c2(X(ii) - 4) + '" y="' + c2(Y(val) - 4) + '" width="8" height="8" class="fg-dot fg-s2"/>';
      });
  });
  if (multi) {
    let lx = L;
    const ly = T - 30;
    o.series.forEach((se, si) => {
      s += ln(lx, ly, lx + 20, ly, 'fg-ln fg-ln' + (si + 1));
      s +=
        si === 0
          ? '<circle cx="' + (lx + 10) + '" cy="' + ly + '" r="4.5" class="fg-dot fg-s1"/>'
          : '<rect x="' + (lx + 6) + '" y="' + (ly - 4) + '" width="8" height="8" class="fg-dot fg-s2"/>';
      s += tx(lx + 26, ly + 4, se.name, 'ft');
      lx += 26 + se.name.length * 6.8 + 20;
    });
  }
  return svg(W, H, s, o.label || o.title || 'Lijngrafiek');
}

export interface Sector {
  name: string;
  pct: number;
  /** tekst in de sector, bijvoorbeeld '25%' of '?' */
  show?: string;
}
export interface CirkelOpties {
  parts: readonly Sector[];
  title?: string;
  label?: string;
}
export function pie(o: CirkelOpties): string {
  const W = 320;
  const cx = 160;
  const T = o.title ? 26 : 6;
  const r = 80;
  const cy = T + r + 2;
  const H = cy + r + 6;
  let a0 = -Math.PI / 2;
  let s = '';
  if (o.title) s += tx(160, 15, o.title, 'ft-title', 'middle');
  o.parts.forEach((pt, i) => {
    const a1 = a0 + (pt.pct / 100) * 2 * Math.PI;
    const large = a1 - a0 > Math.PI ? 1 : 0;
    const am = (a0 + a1) / 2;
    s +=
      '<path class="fg-slice fg-s' +
      (i + 1) +
      '" d="M' +
      cx +
      ',' +
      cy +
      ' L' +
      c2(cx + r * Math.cos(a0)) +
      ',' +
      c2(cy + r * Math.sin(a0)) +
      ' A' +
      r +
      ',' +
      r +
      ' 0 ' +
      large +
      ' 1 ' +
      c2(cx + r * Math.cos(a1)) +
      ',' +
      c2(cy + r * Math.sin(a1)) +
      ' Z"/>';
    const rl = r * (pt.pct <= 12 ? 0.74 : 0.62);
    if (pt.show) s += tx(c2(cx + rl * Math.cos(am)), c2(cy + rl * Math.sin(am) + 4.5), pt.show, 'ft-in ft-in' + (i + 1), 'middle');
    a0 = a1;
  });
  const lg =
    '<ul class="lg">' + o.parts.map((pt, i) => '<li><i class="sw fg-b' + (i + 1) + '"></i>' + pt.name + '</li>').join('') + '</ul>';
  return '<div class="figbox">' + svg(W, H, s, o.label || o.title || 'Cirkeldiagram') + lg + '</div>';
}
