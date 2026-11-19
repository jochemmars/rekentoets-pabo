/* Sessies: een proeftoets of een oefenronde, met alles wat nodig is om hem te hervatten. */
import type { Domein, Gegeven, Niveau, Onderdeel, Opgave } from '../core/types';
import type { Modus } from './constanten';

export interface Slot {
  part: Onderdeel;
  dom: Domein;
}
export interface OefenSelectie {
  doms: Domein[];
  part: Onderdeel | 'HN';
  /** 0 = groeit mee, anders een vast niveau */
  level: 0 | Niveau;
  /** 10, 20 of 0 (tot je stopt) */
  count: number;
  /** alleen deze opgavetypes */
  tpls?: string[];
}
export interface Item {
  q: Opgave;
  given: Gegeven;
  ok: boolean;
  secs: number;
  level: Niveau;
  dom: Domein;
  part: Onderdeel;
  et: string;
  id: string;
}
export interface PerOnderdeel {
  H: number;
  N: number;
}
interface SessieBasis {
  v: 1;
  seed: number;
  started: number;
  idx: number;
  items: Item[];
  /** hoe vaak elk opgavetype al gekozen is */
  used: Record<string, number>;
  /** geschatte vaardigheid */
  theta: number;
  cur: Opgave | null;
  spent: PerOnderdeel;
}
export type Fase = 'introH' | 'H' | 'introN' | 'N';
export interface ToetsSessie extends SessieBasis {
  kind: 'test';
  mode: Modus;
  plan: Slot[];
  phase: Fase;
  /** resterende tijd per deel in seconden */
  left: PerOnderdeel;
  /** opgaven die door tijdgebrek niet gemaakt zijn */
  skipped?: Slot[];
}
export interface OefenSessie extends SessieBasis {
  kind: 'oefen';
  mode: 'oefen';
  sel: OefenSelectie;
  phase: 'run';
}
export type Sessie = ToetsSessie | OefenSessie;

/** [goed, totaal] */
export type Telling = [number, number];
export interface Oordeel {
  key: 'good' | 'warn' | 'bad';
  label: string;
  text: string;
}
export interface Samenvatting {
  n: number;
  ok: number;
  missed: number;
  dom: Partial<Record<Domein, Telling>>;
  part: Record<Onderdeel, Telling>;
  et: Record<string, Telling>;
  theta: number;
  score: number;
  verdict: Oordeel;
  secs: number;
}
export interface HistorieRegel {
  id: string;
  t: number;
  mode: Modus | 'oefen';
  n: number;
  ok: number;
  score: number;
  dom: Partial<Record<string, Telling>>;
  part: Partial<Record<string, Telling>>;
  et: Partial<Record<string, Telling>>;
  secs: number;
  sel?: { d: string; p: Onderdeel | 'HN'; l: 0 | Niveau };
}
