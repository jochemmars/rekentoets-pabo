import { describe, expect, it } from 'vitest';
import { en, eur, frs, inp, klok, NB, nf, words } from '../../src/core/notatie';
import { rnd } from '../../src/core/rekenen';

describe('nf: getallen in opgaven', () => {
  it('zet een punt als duizendtalteken vanaf 10.000 en ook bij 4 cijfers', () => {
    expect(nf(1250)).toBe('1.250');
    expect(nf(1234567)).toBe('1.234.567');
    expect(nf(999)).toBe('999');
  });
  it('gebruikt een komma als decimaalteken en een echt minteken', () => {
    expect(nf(12.5)).toBe('12,5');
    expect(nf(-0.25)).toBe('−0,25');
    expect(nf(3, 2)).toBe('3,00');
  });
  it('heeft geen last van afrondingsruis', () => {
    expect(nf(0.1 + 0.2)).toBe('0,3');
  });
});

describe('inp: zoals je het intypt', () => {
  it('heeft geen duizendtalteken en een gewoon minteken', () => {
    expect(inp(1250)).toBe('1250');
    expect(inp(-4.5)).toBe('-4,5');
  });
});

describe('eur', () => {
  it('toont hele bedragen zonder centen en anders met twee decimalen', () => {
    expect(eur(12)).toBe('€' + NB + '12');
    expect(eur(7.5)).toBe('€' + NB + '7,50');
  });
});

describe('rnd', () => {
  it('rondt half naar boven af, ook bij binaire randgevallen', () => {
    expect(rnd(34.125, 2)).toBe(34.13);
    expect(rnd(2.675, 2)).toBe(2.68);
    expect(rnd(-1.005, 2)).toBe(-1.01);
  });
});

describe('klok, words, frs, en', () => {
  it('klok telt rond middernacht door', () => {
    expect(klok(527)).toBe('08:47');
    expect(klok(1440)).toBe('00:00');
    expect(klok(-30)).toBe('23:30');
  });
  it('words schrijft getallen voluit', () => {
    expect(words(21)).toBe('eenentwintig');
    expect(words(22)).toBe('tweeëntwintig');
    expect(words(1000000)).toBe('een miljoen');
  });
  it('frs vereenvoudigt en maakt gemengde getallen', () => {
    expect(frs(9, 3)).toBe('3');
    expect(frs(6, 4)).toContain('<span>1</span><span>2</span>');
    expect(frs(6, 4).startsWith('1')).toBe(true);
  });
  it('en maakt een opsomming', () => {
    expect(en(['a', 'b', 'c'])).toBe('a, b en c');
    expect(en([1])).toBe('1');
  });
});
