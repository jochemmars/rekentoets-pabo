/* Vaste gegevens van de toets: domeinen, toetsvormen en onderdelen. */
import type { Domein, Onderdeel } from '../core/types';

export const DOM: Record<Domein, { name: string; short: string }> = {
  A: { name: 'Hele getallen', short: 'Hele getallen' },
  B: { name: 'Verhoudingen, procenten, breuken en decimale getallen', short: 'Breuken en procenten' },
  C: { name: 'Meten en meetkunde', short: 'Meten en meetkunde' },
  D: { name: 'Verbanden en statistiek', short: 'Verbanden en statistiek' },
};

export type Modus = 'full' | 'short';
export interface ToetsVorm {
  name: string;
  /** aantal opgaven per domein bij hoofdrekenen */
  H: Partial<Record<Domein, number>>;
  /** aantal opgaven per domein bij niet-hoofdrekenen */
  N: Partial<Record<Domein, number>>;
  /** tijd in seconden */
  tH: number;
  tN: number;
}
// verdeling volgens de toetsmatrijs van de RWT (50 tellende + 5 proefopgaven); kort = zelfde verhoudingen
export const MODES: Record<Modus, ToetsVorm> = {
  full: { name: 'Volledige proeftoets', H: { A: 9, B: 6, C: 2 }, N: { A: 7, B: 10, C: 11, D: 10 }, tH: 17 * 60, tN: 103 * 60 },
  short: { name: 'Korte proeftoets', H: { A: 3, B: 2, C: 1 }, N: { A: 3, B: 4, C: 4, D: 3 }, tH: 6 * 60, tN: 38 * 60 },
};

export const PART: Record<Onderdeel, string> = { H: 'Hoofdrekenen', N: 'Niet-hoofdrekenen' };

/** opgavetypes waarbij het antwoord negatief kan zijn: daar staat een plus-minknop naast het invulvak */
export const NEG: Record<string, 1> = { AH06: 1, AH10: 1, AN03: 1, AN04: 1, CN20: 1, DN11: 1 };

/** bij het getal 1 hoort een enkelvoud */
export const SING: Record<string, string> = {
  'ballen over': 'bal over',
  'koekjes over': 'koekje over',
  'eieren over': 'ei over',
  'flessen over': 'fles over',
  'stoelen over': 'stoel over',
  minuten: 'minuut',
  regentonnen: 'regenton',
  rollen: 'rol',
  maanden: 'maand',
  weken: 'week',
  blikken: 'blik',
  keer: 'keer',
};
