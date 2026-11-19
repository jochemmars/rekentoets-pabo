/* Meetinstrumenten en hoogte schatten: maatbeker, thermometer, persoon naast een voorwerp. */
import { nf } from '../core/notatie';
import { rnd } from '../core/rekenen';
import { c2, ln, svg, tx } from './svg';

export interface MaatbekerOpties {
  max: number;
  major: number;
  minor: number;
  level: number;
  unit: string;
}
export function cup(o: MaatbekerOpties): string {
  const xL = 96;
  const xR = 186;
  const yB = 196;
  const yT = 22;
  const sc = 150 / o.max;
  let s = '';
  const Y = (v: number) => yB - v * sc;
  s += '<rect x="' + xL + '" y="' + c2(Y(o.level)) + '" width="' + (xR - xL) + '" height="' + c2(yB - Y(o.level)) + '" class="fg-water"/>';
  s += '<path class="fg-shape-o" d="M' + xL + ',' + yT + ' V' + yB + ' H' + xR + ' V' + yT + '"/>';
  const nMin = Math.round(o.max / o.minor);
  const per = Math.round(o.major / o.minor);
  for (let i = 1; i <= nMin; i++) {
    const v = i * o.minor;
    const maj = i % per === 0;
    s += ln(xL, Y(v), xL + (maj ? 22 : 12), Y(v), maj ? 'fg-tk1' : 'fg-tk2');
    if (maj) s += tx(xL - 7, c2(Y(v) + 4), nf(rnd(v, 6)), 'ft-tick', 'end');
  }
  s += tx(xL - 7, 16, o.unit, 'ft-ax', 'end');
  return svg(280, 208, s, 'Maatbeker', 'fig-m');
}

export interface ThermometerOpties {
  min: number;
  max: number;
  major: number;
  minor: number;
  val: number;
  /** onderschrift, bijvoorbeeld 'buiten' */
  cap?: string;
}
export function thermo(o: ThermometerOpties): string {
  const x = 70;
  const yB = 196;
  const sc = 168 / (o.max - o.min);
  let s = '';
  const Y = (v: number) => yB - (v - o.min) * sc;
  s +=
    '<rect x="' +
    (x - 7) +
    '" y="14" width="14" height="' +
    (yB - 6) +
    '" rx="7" class="fg-shape"/><circle cx="' +
    x +
    '" cy="' +
    (yB + 16) +
    '" r="14" class="fg-merc"/>';
  s += '<rect x="' + (x - 3.5) + '" y="' + c2(Y(o.val)) + '" width="7" height="' + c2(yB + 8 - Y(o.val)) + '" class="fg-merc"/>';
  const nMin = Math.round((o.max - o.min) / o.minor);
  const per = Math.round(o.major / o.minor);
  for (let i = 0; i <= nMin; i++) {
    const v = o.min + i * o.minor;
    const maj = i % per === 0;
    s += ln(x + 9, Y(v), x + (maj ? 22 : 16), Y(v), maj ? 'fg-tk1' : 'fg-tk2');
    if (maj) s += tx(x + 27, c2(Y(v) + 4), nf(rnd(v, 6)), 'ft-tick');
  }
  s += tx(x + 27, 12, '°C', 'ft-ax');
  if (o.cap) s += tx(x, yB + 46, o.cap, 'ft-dim', 'middle');
  return svg(150, yB + (o.cap ? 54 : 36), s, 'Thermometer', 'fig-t');
}

export interface PersoonOpties {
  /** hoogte van het voorwerp in persoonslengtes */
  k: number;
  kind: 'boom' | 'gebouw' | 'mast' | 'lantaarn';
}
/** persoon naast een hoog voorwerp */
export function person(o: PersoonOpties): string {
  const gy = 176;
  const u = 150 / o.k;
  const px = 70;
  let s = ln(20, gy, 290, gy, 'fg-base');
  const hr = u * 0.1;
  s +=
    '<circle cx="' +
    px +
    '" cy="' +
    c2(gy - u + hr) +
    '" r="' +
    c2(hr) +
    '" class="fg-pin"/><path class="fg-body" d="M' +
    px +
    ',' +
    c2(gy - u + 2 * hr) +
    ' V' +
    c2(gy - u * 0.42) +
    ' M' +
    px +
    ',' +
    c2(gy - u * 0.42) +
    ' L' +
    c2(px - u * 0.13) +
    ',' +
    gy +
    ' M' +
    px +
    ',' +
    c2(gy - u * 0.42) +
    ' L' +
    c2(px + u * 0.13) +
    ',' +
    gy +
    ' M' +
    c2(px - u * 0.17) +
    ',' +
    c2(gy - u * 0.66) +
    ' H' +
    c2(px + u * 0.17) +
    '"/>';
  const ox = 190;
  const oh = u * o.k;
  if (o.kind === 'boom')
    s +=
      '<rect x="' +
      (ox - 6) +
      '" y="' +
      c2(gy - oh * 0.45) +
      '" width="12" height="' +
      c2(oh * 0.45) +
      '" class="fg-trunk"/><ellipse cx="' +
      ox +
      '" cy="' +
      c2(gy - oh * 0.68) +
      '" rx="46" ry="' +
      c2(oh * 0.32) +
      '" class="fg-crown"/>';
  else if (o.kind === 'gebouw') {
    s += '<rect x="' + (ox - 44) + '" y="' + c2(gy - oh) + '" width="88" height="' + c2(oh) + '" class="fg-shape"/>';
  } else if (o.kind === 'mast')
    s +=
      '<rect x="' +
      (ox - 2) +
      '" y="' +
      c2(gy - oh) +
      '" width="4" height="' +
      c2(oh) +
      '" class="fg-trunk"/><path class="fg-crown" d="M' +
      (ox + 2) +
      ',' +
      c2(gy - oh + 2) +
      ' h44 v26 h-44 Z"/>';
  else
    s +=
      '<rect x="' +
      (ox - 2.5) +
      '" y="' +
      c2(gy - oh + 8) +
      '" width="5" height="' +
      c2(oh - 8) +
      '" class="fg-trunk"/><path class="fg-crown" d="M' +
      (ox - 16) +
      ',' +
      c2(gy - oh + 10) +
      ' h32 l-6,-10 h-20 Z"/>';
  return svg(310, 190, s, 'Een persoon naast een hoog voorwerp');
}
