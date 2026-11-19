/* Wijzerklok. */
import { c2, ln, svg, tx } from './svg';

export function clock(h: number, m: number): string {
  const W = 180;
  const cx = 90;
  const cy = 90;
  const R = 80;
  let s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" class="fg-shape"/>';
  for (let i = 0; i < 60; i++) {
    const a = (i * 6 * Math.PI) / 180;
    const r1 = i % 5 === 0 ? R - 10 : R - 5;
    s += ln(
      cx + r1 * Math.sin(a),
      cy - r1 * Math.cos(a),
      cx + (R - 2) * Math.sin(a),
      cy - (R - 2) * Math.cos(a),
      i % 5 === 0 ? 'fg-tk1' : 'fg-tk2',
    );
  }
  for (let i = 1; i <= 12; i++) {
    const a = (i * 30 * Math.PI) / 180;
    s += tx(c2(cx + (R - 23) * Math.sin(a)), c2(cy - (R - 23) * Math.cos(a) + 5), i, 'ft-clock', 'middle');
  }
  const ah = (((h % 12) + m / 60) * 30 * Math.PI) / 180;
  const am = (m * 6 * Math.PI) / 180;
  s +=
    ln(cx, cy, cx + 30 * Math.sin(ah), cy - 30 * Math.cos(ah), 'fg-hand1') +
    ln(cx, cy, cx + 46 * Math.sin(am), cy - 46 * Math.cos(am), 'fg-hand2') +
    '<circle cx="' +
    cx +
    '" cy="' +
    cy +
    '" r="4" class="fg-pin"/>';
  return svg(W, 180, s, 'Wijzerklok', 'fig-s');
}
