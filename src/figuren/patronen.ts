/* Patronen: luciferfiguren en een rij herhalende vormen. */
import { c2, ln, svg, tx } from './svg';

/** luciferfiguren 1, 2 en 3: vierkanten, driehoeken of tafels met stoelen */
export function sticks(type: 'vier' | 'drie' | 'tafel'): string {
  let s = '';
  let x = 14;
  const sz = 26;
  const top = 16;
  for (let n = 1; n <= 3; n++) {
    let w: number;
    if (type === 'vier') {
      w = n * sz;
      for (let i = 0; i <= n; i++) s += ln(x + i * sz, top + 3, x + i * sz, top + sz - 3, 'fg-match');
      for (let i = 0; i < n; i++)
        s +=
          ln(x + i * sz + 3, top, x + (i + 1) * sz - 3, top, 'fg-match') +
          ln(x + i * sz + 3, top + sz, x + (i + 1) * sz - 3, top + sz, 'fg-match');
    } else if (type === 'drie') {
      const hh = sz * 0.87;
      const pts: [number, number][] = [];
      for (let i = 0; i <= n + 1; i++) pts.push([x + (i * sz) / 2, i % 2 === 0 ? top + hh : top]);
      w = ((n + 1) * sz) / 2;
      for (let i = 0; i < pts.length - 1; i++)
        s += ln(
          pts[i][0] + (pts[i + 1][0] - pts[i][0]) * 0.12,
          pts[i][1] + (pts[i + 1][1] - pts[i][1]) * 0.12,
          pts[i][0] + (pts[i + 1][0] - pts[i][0]) * 0.88,
          pts[i][1] + (pts[i + 1][1] - pts[i][1]) * 0.88,
          'fg-match',
        );
      for (let i = 0; i < pts.length - 2; i++) s += ln(pts[i][0] + 3, pts[i][1], pts[i + 2][0] - 3, pts[i + 2][1], 'fg-match');
    } else {
      w = n * sz + 20;
      const tx0 = x + 10;
      s += '<rect x="' + tx0 + '" y="' + (top + 6) + '" width="' + n * sz + '" height="' + (sz - 12) + '" class="fg-shape"/>';
      for (let i = 0; i < n; i++)
        s +=
          '<circle cx="' +
          (tx0 + i * sz + sz / 2) +
          '" cy="' +
          top +
          '" r="4" class="fg-pin"/><circle cx="' +
          (tx0 + i * sz + sz / 2) +
          '" cy="' +
          (top + sz) +
          '" r="4" class="fg-pin"/>';
      s +=
        '<circle cx="' +
        (tx0 - 6) +
        '" cy="' +
        (top + sz / 2) +
        '" r="4" class="fg-pin"/><circle cx="' +
        (tx0 + n * sz + 6) +
        '" cy="' +
        (top + sz / 2) +
        '" r="4" class="fg-pin"/>';
    }
    s += tx(c2(x + w / 2), top + sz + 22, 'figuur ' + n, 'ft', 'middle');
    x += w + 34;
  }
  return svg(Math.max(250, c2(x - 20)), top + sz + 30, s, 'De eerste drie figuren van een patroon');
}

/** rij figuren: 't' driehoek, 's' vierkant, 'c' cirkel, anders een ruit */
export function shapes(seq: readonly string[]): string {
  let s = '';
  const sz = 17;
  const gap = 7.5;
  let x = 6;
  const y = 8;
  seq.forEach((k) => {
    if (k === 't') s += '<path class="fg-sh fg-b1" d="M' + c2(x) + ',' + (y + sz) + ' h' + sz + ' l' + -sz / 2 + ',' + -sz + ' Z"/>';
    else if (k === 's') s += '<rect class="fg-sh fg-b2" x="' + c2(x) + '" y="' + y + '" width="' + sz + '" height="' + sz + '"/>';
    else if (k === 'c') s += '<circle class="fg-sh fg-b3" cx="' + c2(x + sz / 2) + '" cy="' + (y + sz / 2) + '" r="' + sz / 2 + '"/>';
    else
      s +=
        '<path class="fg-sh fg-b5" d="M' +
        c2(x + sz / 2) +
        ',' +
        y +
        ' l' +
        sz / 2 +
        ',' +
        sz / 2 +
        ' l' +
        -sz / 2 +
        ',' +
        sz / 2 +
        ' l' +
        -sz / 2 +
        ',' +
        -sz / 2 +
        ' Z"/>';
    x += sz + gap;
  });
  s += tx(c2(x), y + sz - 2, '…', 'ft-title');
  return svg(c2(x + 18), y + sz + 10, s, 'Rij figuren die zich herhaalt');
}
