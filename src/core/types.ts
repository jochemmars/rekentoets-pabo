import type { Rng } from './rng';

/** A hele getallen · B verhoudingen, procenten, breuken, decimalen · C meten en meetkunde · D verbanden en statistiek */
export type Domein = 'A' | 'B' | 'C' | 'D';
/** H hoofdrekenen · N niet-hoofdrekenen */
export type Onderdeel = 'H' | 'N';
/** 1 opstap · 2 toetsniveau · 3 uitdaging */
export type Niveau = 1 | 2 | 3;

/* ---------- wat een opgavegenerator teruggeeft ---------- */

interface RuwBasis {
  q: string;
  expl: string;
  fig?: string;
  /** rekenmachine toegestaan (alleen bij niet-hoofdrekenen) */
  calc?: boolean;
  /** afwijkende eindterm voor deze variant */
  et?: string;
}
export interface RuwVeld {
  ans: number;
  unit?: string;
  pre?: string;
  /** aantal decimalen waarop het antwoord getoond wordt */
  dec?: number;
  lab?: string;
}
/** één invulvak; make() zet dit om naar type 'multi' */
export interface RuwNum extends RuwBasis {
  type: 'num';
  ans: number;
  unit?: string;
  pre?: string;
  dec?: number;
}
export interface RuwMulti extends RuwBasis {
  type: 'multi';
  fields: RuwVeld[];
}
export interface McDeel {
  type: 'mc';
  opts: string[];
  ans: number;
}
export interface RuwMc extends RuwBasis, McDeel {}
export interface OrderDeel {
  type: 'order';
  items: string[];
  ans: number[];
}
export interface RuwOrder extends RuwBasis, OrderDeel {}
export type RuwOpgave = RuwNum | RuwMulti | RuwMc | RuwOrder;

export type Generator = (L: Niveau, r: Rng) => RuwOpgave | null | undefined;

export interface Template {
  id: string;
  dom: Domein;
  part: Onderdeel;
  et: string;
  name: string;
  gen: Generator;
}

/* ---------- een kant-en-klare opgave, zoals make() hem oplevert ---------- */

export interface Veld {
  ans: number;
  unit: string;
  pre: string;
  dec?: number;
  lab?: string;
}
interface OpgaveBasis {
  q: string;
  expl: string;
  fig?: string;
  calc: boolean;
  et: string;
  id: string;
  dom: Domein;
  part: Onderdeel;
  name: string;
  level: Niveau;
}
export interface McOpgave extends OpgaveBasis {
  type: 'mc';
  opts: string[];
  ans: number;
}
export interface OrderOpgave extends OpgaveBasis {
  type: 'order';
  items: string[];
  ans: number[];
}
export interface MultiOpgave extends OpgaveBasis {
  type: 'multi';
  fields: Veld[];
}
export type Opgave = McOpgave | OrderOpgave | MultiOpgave;

/** antwoord van de leerling: index bij mc, volgorde bij order, invulteksten bij multi */
export type Gegeven = number | number[] | string[] | null;
