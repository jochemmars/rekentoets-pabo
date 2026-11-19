/* De toestand van de app: één object S, plus de toestand van de opgave die op het scherm staat. */
import type { Domein, Gegeven, McOpgave, MultiOpgave, Niveau, Onderdeel, Opgave, OrderOpgave } from '../core/types';
import type { HistorieRegel, Modus, OefenSelectie, PerOnderdeel, Samenvatting, Sessie } from '../engine';

export type Scherm = 'start' | 'oefenen' | 'voortgang' | 'uitleg' | 'result' | 'run';

/** de opgave op het scherm en het antwoord tot nu toe; de vorm van het antwoord hangt af van het soort opgave */
interface UiBasis {
  checked: boolean;
  ok: boolean | null;
  /** starttijd van de lopende meting, of null als de klok stilstaat */
  t0: number | null;
  /** al verstreken seconden */
  acc: number;
}
export type UiState =
  | (UiBasis & { soort: 'mc'; q: McOpgave; given: number | null })
  | (UiBasis & { soort: 'order'; q: OrderOpgave; given: number[] })
  | (UiBasis & { soort: 'multi'; q: MultiOpgave; given: string[] });

export interface Dialoog {
  title: string;
  text: string;
  yes: string;
  no: string;
  onYes?: () => void;
  onNo?: () => void;
}

export interface Rekenmachine {
  open: boolean;
  expr: string;
  res: string;
  /** de vorige toets was '=' */
  justEq?: boolean;
}

export interface Resultaat {
  kind: 'test' | 'oefen';
  mode: Modus | 'oefen';
  t: number;
  sum: Samenvatting;
  sel: OefenSelectie | null;
  spent: PerOnderdeel;
  notice: string;
  items: { q: Opgave; given: Gegeven; ok: boolean; secs: number }[];
}

export interface OefenInstelling {
  doms: Domein[];
  part: Onderdeel | 'HN';
  level: 0 | Niveau;
  count: number;
}

export type Filter = 'toets' | 'oefen' | 'alles';

export interface AppState {
  view: Scherm;
  s: Sessie | null;
  ui: UiState | null;
  /** tijdstip waarop de toetsklok voor het laatst is bijgewerkt (0 = staat stil) */
  runAt: number;
  result: Resultaat | null;
  history: HistorieRegel[];
  demo: UiState | null;
  dialog: Dialoog | null;
  calc: Rekenmachine;
  prac: OefenInstelling;
  demoOpen: boolean;
  timerHidden: boolean;
  onlyWrong: boolean;
  filter: Filter;
  notice: string;
  /** tijdstip waarop de voortgang voor het laatst gewist is */
  wiped: number;
}

export const S: AppState = {
  view: 'start',
  s: null,
  ui: null,
  runAt: 0,
  result: null,
  history: [],
  demo: null,
  dialog: null,
  calc: { open: false, expr: '', res: '' },
  prac: { doms: ['A', 'B', 'C', 'D'], part: 'HN', level: 0, count: 10 },
  demoOpen: false,
  timerHidden: false,
  onlyWrong: false,
  filter: 'toets',
  notice: '',
  wiped: 0,
};

export function newUi(q: Opgave): UiState {
  const basis: UiBasis = { checked: false, ok: null, t0: Date.now(), acc: 0 };
  if (q.type === 'multi') return { soort: 'multi', q, given: q.fields.map(() => ''), ...basis };
  if (q.type === 'order') return { soort: 'order', q, given: [], ...basis };
  return { soort: 'mc', q, given: null, ...basis };
}

/** seconden besteed aan de huidige opgave */
export function qElapsed(): number {
  const u = S.ui;
  return u ? u.acc + (u.t0 ? (Date.now() - u.t0) / 1000 : 0) : 0;
}
