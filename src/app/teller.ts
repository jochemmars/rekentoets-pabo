/* Anonieme bezoekersteller (GoatCounter): geen cookies, geen antwoorden, geen persoonsgegevens.
   Telt alleen paginabezoeken en een paar gebeurtenissen, zoals 'proeftoets gestart'. */
import { GOATCOUNTER } from '../config';

interface GoatCounter {
  count(vars: { path: string; title?: string; event?: boolean }): void;
}
declare global {
  interface Window {
    goatcounter?: Partial<GoatCounter>;
  }
}

/** laad het telscript, behalve als er geen code is ingesteld of tijdens tests */
export function startTeller(): void {
  if (!GOATCOUNTER || new URLSearchParams(location.search).has('e2e')) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.dataset.goatcounter = 'https://' + GOATCOUNTER + '.goatcounter.com/count';
  document.head.appendChild(s);
}

export type Gebeurtenis =
  'proeftoets-start-full' | 'proeftoets-start-short' | 'proeftoets-klaar' | 'oefenen-start' | 'oefenen-klaar' | 'steun-klik';

/** tel een gebeurtenis; doet niets als de teller (nog) niet geladen is */
export function tel(naam: Gebeurtenis): void {
  window.goatcounter?.count?.({ path: naam, event: true });
}
