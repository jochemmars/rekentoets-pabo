/* Wat een klik op een element met data-act doet. */
import { TPL } from '../banken';
import { check, isComplete, type Modus } from '../engine';
import { ET_TPL } from './eindtermen';
import { beginPart, checkPractice, finish, newDemo, resume, showQuestion, startPractice, startTest, submitTest } from './flow';
import { cleanNum } from './hulp';
import { alsResultaat, isDomein, LS, saveHistory } from './opslag';
import { calcKey } from './rekenmachine/rekenmachine';
import { go, render, syncSubmit } from './render';
import { qElapsed, S, type Filter, type Scherm, type UiState } from './state';
import { commit, startTick, stopTick } from './timer';
import { pracOptions } from './views/oefenen';

const attr = (el: Element, naam: string): string => el.getAttribute(naam) ?? '';
const SCHERMEN: readonly Scherm[] = ['start', 'oefenen', 'voortgang', 'uitleg', 'result'];
const isScherm = (v: string): v is Scherm => SCHERMEN.some((s) => s === v);
const isModus = (v: string): v is Modus => v === 'full' || v === 'short';
const NIVEAUS = [0, 1, 2, 3] as const;
const isFilter = (v: string): v is Filter => v === 'toets' || v === 'oefen' || v === 'alles';

/** de voorbeeldsom op het startscherm of de opgave van de lopende toets */
export function uiFor(el: Element): UiState | null {
  return el.closest('.demo') ? S.demo : S.ui;
}

export const ACT: Record<string, (el: Element) => void> = {
  nav: (el) => {
    const v = attr(el, 'data-v');
    if (S.view === 'run' || !isScherm(v)) return;
    go(v);
  },
  start: (el) => {
    const m = attr(el, 'data-mode');
    if (isModus(m)) startTest(m);
  },
  resume: () => resume(),
  discard: () => {
    LS.del('session');
    S.s = null;
    S.ui = null;
    render();
  },
  begin: () => beginPart(),
  next: () => submitTest(),
  check: () => checkPractice(),
  pnext: () => showQuestion(),
  stop: () => {
    const s = S.s;
    if (!s) return;
    if (s.kind === 'oefen') {
      if (s.items.length) finish();
      else {
        LS.del('session');
        S.s = null;
        S.ui = null;
        stopTick();
        go('oefenen');
      }
      return;
    }
    commit();
    S.runAt = 0;
    stopTick();
    S.dialog = {
      title: 'Toets stoppen?',
      text: 'Je antwoorden van deze toets worden dan niet bewaard en tellen niet mee in je voortgang.',
      yes: 'Stoppen',
      no: 'Doorgaan met de toets',
      onYes: () => {
        LS.del('session');
        S.s = null;
        S.ui = null;
        S.calc.open = false;
        go('start');
      },
      onNo: () => {
        S.runAt = Date.now();
        if (S.ui) S.ui.t0 = Date.now();
        startTick();
      },
    };
    if (S.ui && S.ui.t0) {
      S.ui.acc = qElapsed();
      S.ui.t0 = null;
    }
    render();
  },
  dlgyes: () => {
    const d = S.dialog;
    S.dialog = null;
    if (d && d.onYes) d.onYes();
    else render();
  },
  dlgno: () => {
    const d = S.dialog;
    S.dialog = null;
    if (d && d.onNo) d.onNo();
    render();
  },
  pick: (el) => {
    const u = uiFor(el);
    if (!u || u.checked || u.soort !== 'mc') return;
    u.given = Number(attr(el, 'data-i'));
    render();
  },
  // volgorde-opgaven: getallen aantikken en weer terugleggen
  ordadd: (el) => {
    const u = S.ui;
    if (!u || u.checked || u.soort !== 'order') return;
    u.given.push(Number(attr(el, 'data-i')));
    render();
  },
  ordrem: (el) => {
    const u = S.ui;
    if (!u || u.checked || u.soort !== 'order') return;
    const i = Number(attr(el, 'data-i'));
    u.given = u.given.filter((x) => x !== i);
    render();
  },
  sign: (el) => {
    const u = uiFor(el);
    const i = Number(attr(el, 'data-i'));
    if (!u || u.checked || u.soort !== 'multi') return;
    const inp = el.parentElement?.querySelector('.f-in');
    if (!(inp instanceof HTMLInputElement)) return;
    let v = cleanNum(inp.value);
    v = v.charAt(0) === '-' ? v.slice(1) : '-' + v;
    inp.value = v;
    u.given[i] = v;
    if (u === S.ui) syncSubmit();
    inp.focus();
  },
  calc: () => {
    S.calc.open = !S.calc.open;
    render();
  },
  timerhide: () => {
    S.timerHidden = !S.timerHidden;
    LS.set('timerHidden', S.timerHidden);
    render();
  },
  ck: (el) => calcKey(attr(el, 'data-k')),
  democheck: () => {
    const u = S.demo;
    if (!u) return;
    if (!isComplete(u.q, u.given)) {
      document.getElementById('demo0')?.focus();
      return;
    }
    u.ok = check(u.q, u.given);
    u.checked = true;
    render();
  },
  demonew: () => {
    newDemo();
    render();
  },
  pdom: (el) => {
    const d = attr(el, 'data-d');
    if (!isDomein(d)) return;
    const i = S.prac.doms.indexOf(d);
    if (i >= 0) S.prac.doms.splice(i, 1);
    else S.prac.doms.push(d);
    S.prac.doms.sort();
    LS.set('prac', S.prac);
    render();
  },
  pset: (el) => {
    const k = attr(el, 'data-k');
    const v = attr(el, 'data-val');
    if (k === 'part' && (v === 'H' || v === 'N' || v === 'HN')) S.prac.part = v;
    else if (k === 'level') {
      const lv = NIVEAUS.find((x) => String(x) === v);
      if (lv !== undefined) S.prac.level = lv;
    } else if (k === 'count') S.prac.count = Number(v);
    LS.set('prac', S.prac);
    render();
  },
  startprac: () => {
    if (!pracOptions()) return;
    startPractice({ doms: S.prac.doms.slice(), part: S.prac.part, level: S.prac.level, count: S.prac.count });
  },
  pracdom: (el) => {
    const d = attr(el, 'data-d');
    if (isDomein(d)) startPractice({ doms: [d], part: 'HN', level: 0, count: 10 });
  },
  practpl: (el) => {
    const t = TPL.find((x) => x.id === attr(el, 'data-id'));
    if (t) startPractice({ doms: [t.dom], part: t.part, level: 0, count: 10, tpls: [t.id] });
  },
  pracet: (el) => {
    const e = attr(el, 'data-et');
    const ts = TPL.filter((x) => x.et === e || (ET_TPL[e] || []).includes(x.id));
    if (ts.length) startPractice({ doms: [ts[0].dom], part: 'HN', level: 0, count: 10, tpls: ts.map((x) => x.id) });
  },
  onlywrong: (el) => {
    S.onlyWrong = attr(el, 'data-val') === 'true';
    render();
  },
  filter: (el) => {
    const f = attr(el, 'data-val');
    if (isFilter(f)) S.filter = f;
    render();
  },
  showlast: () => {
    const l = alsResultaat(LS.get('last'));
    if (l) {
      S.result = l;
      S.onlyWrong = false;
      S.view = 'result';
      render();
      window.scrollTo(0, 0);
    }
  },
  askclear: () => {
    S.dialog = {
      title: 'Voortgang wissen?',
      text: 'Al je resultaten worden verwijderd. Dit kun je niet ongedaan maken.',
      yes: 'Wissen',
      no: 'Bewaren',
      onYes: () => {
        S.history = [];
        S.wiped = Date.now();
        LS.set('wiped', S.wiped);
        LS.del('last');
        saveHistory();
        render();
      },
    };
    render();
  },
};
