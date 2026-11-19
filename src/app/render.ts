/* Het kader: tabs, dialoog, het scherm tekenen en navigeren. */
import { isComplete } from '../engine';
import { I } from './iconen';
import { S, type Scherm } from './state';
import { viewPractice } from './views/oefenen';
import { viewStart } from './views/start';
import { viewRun } from './views/toets';
import { viewInfo } from './views/uitleg';
import { viewResult } from './views/uitslag';
import { viewProgress } from './views/voortgang';

function appElement(): HTMLElement {
  const el = document.getElementById('app');
  if (!el) throw new Error('Element #app ontbreekt.');
  return el;
}

function tabs(): string {
  const cur = S.view === 'result' ? '' : S.view;
  const t = (v: Scherm, hash: string, icon: string, lab: string) =>
    '<a class="tab" href="#' +
    hash +
    '" data-act="nav" data-v="' +
    v +
    '"' +
    (cur === v ? ' aria-current="page"' : '') +
    '>' +
    icon +
    '<span>' +
    lab +
    '</span></a>';
  return (
    '<nav class="tabs" aria-label="Hoofdmenu"><div class="tabs-in">' +
    t('start', 'start', I.home, 'Start') +
    t('oefenen', 'oefenen', I.pen, 'Oefenen') +
    t('voortgang', 'voortgang', I.chart, 'Voortgang') +
    t('uitleg', 'over-de-toets', I.info, 'Uitleg') +
    '</div></nav>'
  );
}

function dialogHtml(): string {
  const d = S.dialog;
  if (!d) return '';
  return (
    '<div class="dlg-ov"><div class="dlg" role="alertdialog" aria-modal="true" aria-labelledby="dlg-t"><h3 id="dlg-t">' +
    d.title +
    '</h3><p>' +
    d.text +
    '</p><div class="row"><button class="btn pri" data-act="dlgno" id="dlg-no">' +
    d.no +
    '</button><button class="btn" data-act="dlgyes">' +
    d.yes +
    '</button></div></div></div>'
  );
}

const VIEWS: Record<Exclude<Scherm, 'run'>, () => string> = {
  start: viewStart,
  oefenen: viewPractice,
  voortgang: viewProgress,
  uitleg: viewInfo,
  result: viewResult,
};

/** selector om na opnieuw tekenen de focus terug te zetten op 'hetzelfde' element */
function focusKey(el: Element | null, app: HTMLElement): string | null {
  if (!el || !app.contains(el)) return null;
  if (el.id) return '#' + el.id;
  const a = el.getAttribute('data-act');
  if (!a) return null;
  let sel = '[data-act="' + a + '"]';
  ['data-i', 'data-k', 'data-val', 'data-d', 'data-mode', 'data-v', 'data-id', 'data-et'].forEach((n) => {
    const v = el.getAttribute(n);
    if (v !== null) sel += '[' + n + '="' + v.replace(/["\\]/g, '\\$&') + '"]';
  });
  return sel;
}

export function render(): void {
  const app = appElement();
  const key = focusKey(document.activeElement, app);
  let h: string;
  if (S.view === 'run' && S.s) h = viewRun();
  else {
    if (S.view === 'run') S.view = 'start';
    h = tabs() + '<main class="wrap">' + VIEWS[S.view]() + '</main>';
  }
  app.innerHTML = h + (S.dialog ? dialogHtml() : '');
  app.querySelectorAll<HTMLElement>('[data-w]').forEach((el) => {
    el.style.width = el.getAttribute('data-w') + '%';
  });
  app.querySelectorAll<HTMLElement>('[data-l]').forEach((el) => {
    el.style.left = el.getAttribute('data-l') + '%';
  });
  if (S.dialog) {
    document.getElementById('dlg-no')?.focus();
    return;
  }
  let el: Element | null = null;
  if (key) {
    try {
      el = app.querySelector(key);
    } catch {
      el = null;
    }
  }
  const uit = (el instanceof HTMLButtonElement || el instanceof HTMLInputElement) && el.disabled;
  // ook SVG-elementen kunnen focus hebben (de punten in de voortgangsgrafiek)
  if ((el instanceof HTMLElement || el instanceof SVGElement) && !uit) {
    try {
      el.focus({ preventScroll: true });
    } catch {
      el.focus();
    }
    if (el instanceof HTMLInputElement && el.value) {
      try {
        el.setSelectionRange(el.value.length, el.value.length);
      } catch {
        /* niet elk veld kan dit */
      }
    }
  }
}

const HASH: Partial<Record<Scherm, string>> = { start: 'start', oefenen: 'oefenen', voortgang: 'voortgang', uitleg: 'over-de-toets' };

export function go(v: Scherm): void {
  S.view = v;
  const hash = HASH[v];
  if (hash && location.hash !== '#' + hash) {
    try {
      location.hash = hash;
    } catch {
      /* hash niet beschikbaar */
    }
  }
  render();
  window.scrollTo(0, 0);
}

const VAN_HASH: Record<string, Scherm> = { oefenen: 'oefenen', voortgang: 'voortgang', 'over-de-toets': 'uitleg' };
export function viewFromHash(): Scherm {
  return VAN_HASH[(location.hash || '').replace('#', '')] || 'start';
}

/** knop Volgende/Controleer aan of uit, zonder alles opnieuw te tekenen */
export function syncSubmit(): void {
  const b = document.getElementById('submit');
  const u = S.ui;
  if (b instanceof HTMLButtonElement && u && !u.checked) b.disabled = !isComplete(u.q, u.given);
}
