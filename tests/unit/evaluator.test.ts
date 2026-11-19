import { describe, expect, it } from 'vitest';
import { calcEval, calcFmt } from '../../src/app/rekenmachine/evaluator';
import { cleanNum } from '../../src/app/hulp';

describe('rekenmachine', () => {
  it.each([
    ['12×3', 36],
    ['2+3×4', 14],
    ['(2+3)×4', 20],
    ['10÷4', 2.5],
    ['7−10', -3],
    ['√16+1', 5],
    ['3²', 9],
    ['1,5×2', 3],
    ['−2×3', -6],
  ])('%s = %s', (expr, uit) => expect(calcEval(expr)).toBe(uit));

  it.each(['(2+3', '2+', '1÷0', '×2'])('geeft een fout bij %s', (expr) => expect(() => calcEval(expr)).toThrow());

  it('toont hoogstens 12 significante cijfers met een komma', () => {
    expect(calcFmt(0.1 + 0.2)).toBe('0,3');
    expect(calcFmt(1 / 3)).toBe('0,333333333333');
  });
});

describe('cleanNum: invoer opschonen', () => {
  it.each([
    ['1.250', '1,250'],
    ['12,5,3', '12,53'],
    ['ab-12', '-12'],
    ['−7', '-7'],
    ['12345678901234567', '12345678901234'],
  ])('%s wordt %s', (in_, uit) => expect(cleanNum(in_)).toBe(uit));
});
