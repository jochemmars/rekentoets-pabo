/* Gedeelde SVG-hulpjes. Kleuren lopen via CSS-klassen (figuren.css), zodat licht en donker werken. */

/** rond af op twee decimalen, voor korte SVG-coördinaten */
export function c2(x: number): number {
  return Math.round(x * 100) / 100;
}

export function svg(w: number, h: number, inner: string, label?: string, cls?: string): string {
  return (
    '<svg class="fig' +
    (cls ? ' ' + cls : '') +
    '" viewBox="0 0 ' +
    w +
    ' ' +
    h +
    '" role="img" aria-label="' +
    (label || 'Figuur') +
    '">' +
    inner +
    '</svg>'
  );
}

export type Anker = 'start' | 'middle' | 'end';

export function tx(x: number, y: number, s: string | number, cls?: string, anchor?: Anker): string {
  return (
    '<text x="' +
    x +
    '" y="' +
    y +
    '" class="' +
    (cls || 'ft') +
    '"' +
    (anchor ? ' text-anchor="' + anchor + '"' : '') +
    '>' +
    s +
    '</text>'
  );
}

export function ln(x1: number, y1: number, x2: number, y2: number, cls: string): string {
  return '<line x1="' + c2(x1) + '" y1="' + c2(y1) + '" x2="' + c2(x2) + '" y2="' + c2(y2) + '" class="' + cls + '"/>';
}
