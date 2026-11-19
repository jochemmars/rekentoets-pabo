/* Nederlandse notatie van getallen, bedragen, tijden en breuken. */
import { gcd, rnd } from './rekenen';

/** vaste spatie */
export const NB = ' ';

function plain(a: number, d?: number): string {
  let s = d === undefined ? String(rnd(a, 6)) : rnd(a, d).toFixed(d);
  if (s.includes('e')) s = a.toFixed(6).replace(/0+$/, '').replace(/\.$/, '');
  return s;
}

/** In opgaven: punt als duizendtalteken, komma als decimaalteken (zoals in de handreiking). */
export function nf(x: number, d?: number): string {
  const s = plain(Math.abs(x), d).split('.');
  const i = s[0].length > 3 ? s[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.') : s[0];
  return (x < 0 ? '−' : '') + i + (s[1] ? ',' + s[1] : '');
}

/** Zoals je het intypt: alleen cijfers, een komma en eventueel een minteken. */
export function inp(x: number, d?: number): string {
  return (x < 0 ? '-' : '') + plain(Math.abs(x), d).replace('.', ',');
}

export function eur(x: number): string {
  const a = Math.abs(x);
  const whole = Math.abs(rnd(a, 2) - Math.round(a)) < 1e-9;
  return (x < 0 ? '−' : '') + '€' + NB + (whole ? nf(Math.round(a)) : nf(a, 2));
}

/** "a, b en c" */
export function en(arr: readonly (string | number)[]): string {
  const t = arr.map(String);
  if (t.length < 2) return t.join('');
  return t.slice(0, -1).join(', ') + ' en ' + t[t.length - 1];
}

/** minuten sinds middernacht -> 08:47 */
export function klok(mins: number): string {
  mins = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
}

function bare(x: string | number): string {
  return String(x).replace(/<[^>]*>/g, '');
}

/** breuk als HTML met teller boven noemer */
export function fr(a: string | number, b: string | number): string {
  return '<span class="fr" role="math" aria-label="' + bare(a) + '/' + bare(b) + '"><span>' + a + '</span><span>' + b + '</span></span>';
}

/** vereenvoudigde breuk of gemengd getal */
export function frs(n: number, d: number): string {
  const g = gcd(n, d);
  n /= g;
  d /= g;
  if (d === 1) return String(n);
  const w = Math.floor(n / d);
  const r = n - w * d;
  return w ? w + fr(r, d) : fr(n, d);
}

const EEN = [
  '',
  'een',
  'twee',
  'drie',
  'vier',
  'vijf',
  'zes',
  'zeven',
  'acht',
  'negen',
  'tien',
  'elf',
  'twaalf',
  'dertien',
  'veertien',
  'vijftien',
  'zestien',
  'zeventien',
  'achttien',
  'negentien',
];
const TIEN = ['', '', 'twintig', 'dertig', 'veertig', 'vijftig', 'zestig', 'zeventig', 'tachtig', 'negentig'];

/** getal in woorden, tot en met miljarden niet nodig: tot 999.999.999 */
export function words(n: number): string {
  if (n === 0) return 'nul';
  const b100 = (x: number): string => {
    if (x < 20) return EEN[x];
    const e = x % 10;
    const z = Math.floor(x / 10);
    return e === 0 ? TIEN[z] : EEN[e] + (e === 2 || e === 3 ? 'ën' : 'en') + TIEN[z];
  };
  const b1000 = (x: number): string => {
    const h = Math.floor(x / 100);
    const r = x % 100;
    return (h ? (h > 1 ? EEN[h] : '') + 'honderd' : '') + (r ? b100(r) : '');
  };
  const out: string[] = [];
  const m = Math.floor(n / 1e6);
  const k = Math.floor((n % 1e6) / 1000);
  const r = n % 1000;
  if (m) out.push(b1000(m) + ' miljoen');
  if (k) out.push((k > 1 ? b1000(k) : '') + 'duizend');
  if (r) out.push(b1000(r));
  return out.join(' ');
}
