/* Antwoorden lezen, nakijken en tonen. */
import { inp, NB } from '../core/notatie';
import type { Gegeven, Opgave, Veld } from '../core/types';
import { SING } from './constanten';

/** "12,5" -> 12.5; punten tellen als komma; ongeldig -> null */
export function parseNum(str: string | number | null | undefined): number | null {
  const t = String(str === undefined || str === null ? '' : str)
    .replace(/\s+/g, '')
    .replace(/\./g, ',')
    .replace(/,$/, '');
  if (!/^-?(\d+(,\d+)?|,\d+)$/.test(t)) return null;
  return parseFloat(t.replace(',', '.'));
}

const isLijst = (g: Gegeven): g is number[] | string[] => Array.isArray(g);

export function check(q: Opgave, given: Gegeven | undefined): boolean {
  if (given === null || given === undefined) return false;
  if (q.type === 'mc') return given === q.ans;
  if (q.type === 'order') return isLijst(given) && given.length === q.ans.length && given.every((v, i) => v === q.ans[i]);
  if (!isLijst(given)) return false;
  return q.fields.every((f, i) => {
    const v = parseNum(given[i]);
    return v !== null && Math.abs(v - f.ans) < 1e-6;
  });
}

export function isComplete(q: Opgave, given: Gegeven | undefined): boolean {
  if (given === null || given === undefined) return false;
  if (q.type === 'mc') return typeof given === 'number';
  if (q.type === 'order') return isLijst(given) && given.length === q.items.length;
  if (!isLijst(given)) return false;
  return q.fields.every((_f, i) => parseNum(given[i]) !== null);
}

function fieldText(f: Veld, val: string): string {
  const n = parseNum(val);
  const u = f.unit && n !== null && Math.abs(n) === 1 && SING[f.unit] ? SING[f.unit] : f.unit;
  // vaste spaties: een bedrag of eenheid breekt nooit af van het getal
  return (f.pre ? f.pre + NB : '') + val + (u ? NB + u : '');
}

export function answerHtml(q: Opgave): string {
  if (q.type === 'mc') return q.opts[q.ans];
  if (q.type === 'order') return q.ans.map((i) => q.items[i]).join(' &lt; ');
  return q.fields.map((f) => fieldText(f, inp(f.ans, f.dec))).join(' en ');
}

export function givenHtml(q: Opgave, given: Gegeven | undefined): string {
  if (given === null || given === undefined) return '<i>geen antwoord</i>';
  if (q.type === 'mc') return typeof given !== 'number' || q.opts[given] === undefined ? '<i>geen antwoord</i>' : q.opts[given];
  if (q.type === 'order') return isLijst(given) ? given.map((i) => q.items[Number(i)]).join(' &lt; ') : '<i>geen antwoord</i>';
  const lijst: readonly (string | number | undefined)[] = isLijst(given) ? given : [];
  return q.fields
    .map((f, i) => {
      const raw = String(lijst[i] === undefined ? '' : lijst[i]).replace(/[<>&]/g, '');
      return raw === '' ? '<i>leeg</i>' : fieldText(f, raw);
    })
    .join(' en ');
}
