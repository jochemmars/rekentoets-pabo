/* Luisteraars: klikken, typen, toetsenbord, uitklappen, grafiektips, zichtbaarheid en navigatie. */
import { isComplete } from '../engine';
import { ACT, uiFor } from './acties';
import { checkPractice } from './flow';
import { cleanNum } from './hulp';
import { saveSession } from './opslag';
import { render, syncSubmit, viewFromHash } from './render';
import { qElapsed, S } from './state';
import { tel } from './teller';
import { commit } from './timer';

function heeftKlasse(t: EventTarget | null, k: string): t is Element {
  return t instanceof Element && t.classList.contains(k);
}

/* ---------- uitleg bij een punt in de voortgangsgrafiek ---------- */
function tipShow(el: Element): void {
  const box = el.closest('.chart');
  const svg = box?.querySelector('svg');
  if (!(box instanceof HTMLElement) || !svg) return;
  const r = svg.getBoundingClientRect();
  const vb = svg.viewBox.baseVal;
  let tip = box.querySelector<HTMLElement>('.tipbox');
  if (!tip) {
    tip = document.createElement('div');
    tip.className = 'tipbox';
    box.appendChild(tip);
  }
  tip.innerHTML = el.getAttribute('data-tip') ?? '';
  const x = (Number(el.getAttribute('cx')) / vb.width) * r.width;
  const y = (Number(el.getAttribute('cy')) / vb.height) * r.height;
  tip.style.left = Math.min(Math.max(x, 70), r.width - 70) + 'px';
  tip.style.top = Math.max(y, 62) + 'px';
}
function tipHide(): void {
  document.querySelector('.tipbox')?.remove();
}

export function luister(): void {
  document.addEventListener('click', (ev) => {
    // de doneerlink opent gewoon; we tellen alleen dat erop geklikt is
    if (ev.target instanceof Element && ev.target.closest('a.steun')) tel('steun-klik');
    const el = ev.target instanceof Element ? ev.target.closest('[data-act]') : null;
    if (!el || ((el instanceof HTMLButtonElement || el instanceof HTMLInputElement) && el.disabled)) return;
    const fn = ACT[el.getAttribute('data-act') ?? ''];
    if (fn) {
      ev.preventDefault();
      fn(el);
    }
  });

  document.addEventListener('input', (ev) => {
    const el = ev.target;
    if (!(el instanceof HTMLInputElement) || !el.classList.contains('f-in')) return;
    const u = uiFor(el);
    const v = cleanNum(el.value);
    if (v !== el.value) el.value = v;
    if (u && !u.checked && u.soort === 'multi') {
      u.given[Number(el.getAttribute('data-i'))] = v;
      if (u === S.ui) syncSubmit();
    }
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      if (S.dialog) ACT.dlgno(document.body);
      else if (S.calc.open) ACT.calc(document.body);
      return;
    }
    const t = ev.target;
    if (ev.key !== 'Enter' || !heeftKlasse(t, 'f-in')) return;
    ev.preventDefault();
    if (t.closest('.demo')) return ACT.democheck(t);
    const u = S.ui;
    if (!u || !isComplete(u.q, u.given)) return;
    // in de toets kun je niet terug: de eerste Enter zet de focus op de knop, pas een tweede Enter gaat door
    if (S.s && S.s.kind === 'test') document.getElementById('submit')?.focus();
    else if (!u.checked) checkPractice();
  });

  // onthoud of de voorbeeldsom open staat, zodat hij na opnieuw tekenen open blijft ('toggle' bubbelt niet: daarom capture)
  document.addEventListener(
    'toggle',
    (ev) => {
      const d = ev.target;
      if (d instanceof HTMLDetailsElement && d.classList.contains('demo-d')) S.demoOpen = d.open;
    },
    true,
  );

  (['pointerover', 'focusin', 'click'] as const).forEach((naam) => {
    document.addEventListener(naam, (ev) => {
      if (heeftKlasse(ev.target, 'pg-hit')) tipShow(ev.target);
      else if (naam === 'click') tipHide();
    });
  });
  (['pointerout', 'focusout'] as const).forEach((naam) => {
    document.addEventListener(naam, (ev) => {
      if (heeftKlasse(ev.target, 'pg-hit')) tipHide();
    });
  });

  // de klok staat stil als de app niet in beeld is
  document.addEventListener('visibilitychange', () => {
    if (!S.s || S.view !== 'run') return;
    if (document.hidden) {
      commit();
      S.runAt = 0;
      if (S.ui && S.ui.t0) {
        S.ui.acc = qElapsed();
        S.ui.t0 = null;
      }
      saveSession();
    } else if (!S.dialog) {
      S.runAt = Date.now();
      if (S.ui && !S.ui.checked) S.ui.t0 = Date.now();
    }
  });
  window.addEventListener('pagehide', () => {
    if (S.s && S.view === 'run') {
      commit();
      saveSession();
    }
  });
  window.addEventListener('hashchange', () => {
    if (S.view === 'run') return;
    const v = viewFromHash();
    if (v !== S.view) {
      S.view = v;
      render();
      window.scrollTo(0, 0);
    }
  });
}
