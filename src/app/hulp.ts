/* Kleine hulpjes voor de schermen. */
import type { Oordeel } from '../engine';
import { MND } from './eindtermen';
import { I } from './iconen';

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
export function esc(s: string | number): string {
  return String(s).replace(/[&<>"]/g, (c) => ESC[c]);
}

/** willekeurige seed voor een nieuwe toets */
export function seed(): number {
  return Math.floor(Math.random() * 2147483000) + 1;
}

/** 125 -> 2:05 */
export function fmtTime(sec: number): string {
  sec = Math.max(0, Math.ceil(sec));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m + ':' + (s < 10 ? '0' : '') + s;
}
export function fmtDur(sec: number): string {
  const m = Math.round(sec / 60);
  return m < 1 ? 'minder dan 1 minuut' : m + (m === 1 ? ' minuut' : ' minuten');
}
export function fmtSecs(s: number): string {
  return s < 60 ? s + ' s' : Math.floor(s / 60) + ' min ' + (s % 60) + ' s';
}
export function fmtDate(t: number): string {
  const d = new Date(t);
  return d.getDate() + ' ' + MND[d.getMonth()];
}

export function dots(level: number): string {
  return (
    '<span class="dots" role="img" aria-label="Niveau ' +
    level +
    ' van 3">' +
    [1, 2, 3].map((i) => '<i' + (i <= level ? ' class="on"' : '') + '></i>').join('') +
    '</span>'
  );
}
export function pill(v: Oordeel): string {
  return '<span class="pill ' + v.key + '">' + (v.key === 'good' ? I.ok : v.key === 'warn' ? I.warn : I.no) + v.label + '</span>';
}
export function pct(a: number, b: number): number {
  return b ? Math.round((a / b) * 100) : 0;
}

/** wat iemand intypt, teruggebracht tot cijfers, één komma en eventueel een minteken voorop */
export function cleanNum(v: string): string {
  v = v.replace(/\./g, ',').replace(/[^0-9,\-−]/g, '');
  const neg = /^[-−]/.test(v);
  v = v.replace(/[-−]/g, '');
  const i = v.indexOf(',');
  if (i >= 0) v = v.slice(0, i + 1) + v.slice(i + 1).replace(/,/g, '');
  return ((neg ? '-' : '') + v).slice(0, 14);
}
