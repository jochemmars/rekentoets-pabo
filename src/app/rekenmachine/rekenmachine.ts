/* De rekenmachine onder in beeld, bij een deel van de niet-hoofdrekenopgaven. */
import { cleanNum, esc } from '../hulp';
import { render } from '../render';
import { S } from '../state';
import { calcEval, calcFmt } from './evaluator';

export function calcHtml(): string {
  const c = S.calc;
  const k = (lab: string, val: string, cls?: string, aria?: string) =>
    '<button type="button" data-act="ck" data-k="' +
    esc(val) +
    '"' +
    (cls ? ' class="' + cls + '"' : '') +
    (aria ? ' aria-label="' + aria + '"' : '') +
    '>' +
    lab +
    '</button>';
  const canPut = !!S.ui && S.ui.q.type === 'multi' && S.ui.q.fields.length === 1 && c.res !== '' && c.res !== 'Fout';
  return (
    '<div class="sheet-ov"><section class="calc" role="dialog" aria-label="Rekenmachine"><div class="calc-top"><span>Rekenmachine</span><button class="btn ghost sm" data-act="calc">Sluiten</button></div>' +
    '<div class="calc-d"><div class="calc-e">' +
    esc(c.expr) +
    '</div><div class="calc-r" aria-live="polite">' +
    esc(c.res === '' ? '0' : c.res) +
    '</div></div><div class="calc-k">' +
    k('C', 'C', 'op', 'Wissen') +
    k('(', '(', 'op') +
    k(')', ')', 'op') +
    k('⌫', 'B', 'op', 'Eén teken terug') +
    k('7', '7') +
    k('8', '8') +
    k('9', '9') +
    k('÷', '÷', 'op', 'Gedeeld door') +
    k('4', '4') +
    k('5', '5') +
    k('6', '6') +
    k('×', '×', 'op', 'Keer') +
    k('1', '1') +
    k('2', '2') +
    k('3', '3') +
    k('−', '−', 'op', 'Min') +
    k('0', '0') +
    k(',', ',') +
    k('√', '√', 'op', 'Wortel') +
    k('+', '+', 'op', 'Plus') +
    k('x²', '²', 'op', 'Kwadraat') +
    (canPut ? k('Antwoord', 'P', 'op', 'Zet de uitkomst in het antwoordvak') : k('±', 'N', 'op', 'Plus of min')) +
    k('=', '=', 'eq', 'Is gelijk aan') +
    '</div></section></div>'
  );
}

export function calcKey(k: string): void {
  const c = S.calc;
  if (k === 'C') {
    c.expr = '';
    c.res = '';
  } else if (k === 'B') c.expr = c.expr.slice(0, -1);
  else if (k === '=') {
    if (c.expr) {
      try {
        c.res = calcFmt(calcEval(c.expr));
      } catch {
        c.res = 'Fout';
      }
    }
  } else if (k === 'N') c.expr = c.expr.charAt(0) === '−' ? c.expr.slice(1) : '−' + c.expr;
  else if (k === 'P') {
    if (S.ui && S.ui.soort === 'multi' && c.res && c.res !== 'Fout') {
      S.ui.given[0] = cleanNum(c.res.replace('−', '-'));
      c.open = false;
    }
  } else {
    // na een uitkomst: verder rekenen met die uitkomst bij een bewerking, opnieuw beginnen bij een cijfer
    if (c.res !== '' && c.res !== 'Fout' && c.justEq) c.expr = /[0-9,(√]/.test(k) ? '' : c.res.replace('-', '−');
    if (c.expr.length < 40) c.expr += k;
  }
  c.justEq = k === '=';
  render();
}
