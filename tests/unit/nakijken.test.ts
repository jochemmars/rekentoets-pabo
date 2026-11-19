import { describe, expect, it } from 'vitest';
import type { McOpgave, MultiOpgave, OrderOpgave } from '../../src/core/types';
import { answerHtml, check, givenHtml, isComplete, parseNum } from '../../src/engine';

const basis = { q: '', expl: '', calc: false, et: 'A.4', id: 'XX01', dom: 'A', part: 'H', name: 'Test', level: 2 } as const;
const multi: MultiOpgave = { ...basis, type: 'multi', fields: [{ ans: 12.5, unit: 'minuten', pre: '' }] };
const mc: McOpgave = { ...basis, type: 'mc', opts: ['a', 'b', 'c'], ans: 1 };
const order: OrderOpgave = { ...basis, type: 'order', items: ['3', '1', '2'], ans: [1, 2, 0] };

describe('parseNum', () => {
  it.each([
    ['12', 12],
    ['12,5', 12.5],
    [' 3 ', 3],
    ['-4', -4],
    [',5', 0.5],
    ['5,', 5],
    // een punt telt als komma: daarom vraagt de app om geen punt in grote getallen te typen
    ['1.250', 1.25],
  ])('leest %s als %s', (in_, uit) => expect(parseNum(in_)).toBe(uit));
  it.each(['abc', '', '1,2,3', '1.250.000'])('weigert %s', (in_) => expect(parseNum(in_)).toBeNull());
});

describe('check en isComplete', () => {
  it('invulvak: goed als het getal klopt, leeg is niet compleet', () => {
    expect(check(multi, ['12,5'])).toBe(true);
    expect(check(multi, ['12,6'])).toBe(false);
    expect(isComplete(multi, [''])).toBe(false);
    expect(isComplete(multi, ['7'])).toBe(true);
  });
  it('meerkeuze en volgorde', () => {
    expect(check(mc, 1)).toBe(true);
    expect(check(mc, 2)).toBe(false);
    expect(isComplete(mc, null)).toBe(false);
    expect(check(order, [1, 2, 0])).toBe(true);
    expect(check(order, [0, 1, 2])).toBe(false);
    expect(isComplete(order, [1, 2])).toBe(false);
  });
});

describe('antwoorden tonen', () => {
  it('gebruikt het enkelvoud bij 1 en vaste spaties', () => {
    expect(givenHtml(multi, ['1'])).toBe('1 minuut');
    expect(answerHtml(multi)).toBe('12,5 minuten');
  });
  it('haalt HTML-tekens uit een gegeven antwoord', () => {
    expect(givenHtml(multi, ['<b>3'])).toBe('b3 minuten');
    expect(givenHtml(multi, null)).toBe('<i>geen antwoord</i>');
  });
});
