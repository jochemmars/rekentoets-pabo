/* Het verloop van een toets of oefenronde: starten, opgaven tonen, nakijken, tijd om, afronden. */
import { TPL } from '../banken';
import { make } from '../core/opbouw';
import { Rng } from '../core/rng';
import { historyEntry, isComplete, newPractice, newTest, nextQuestion, record, summarize, type Modus, type OefenSelectie } from '../engine';
import { seed } from './hulp';
import { cleanHist, LS, saveHistory, saveSession } from './opslag';
import { go, render } from './render';
import { newUi, qElapsed, S } from './state';
import { commit, startTick, stopTick } from './timer';

const DEMO_IDS = ['AH01', 'AH02', 'AH03', 'AH04', 'AH05', 'BH01', 'BH02', 'BH06', 'BH11'];
/** een nieuwe voorbeeldsom met één invulvak voor het startscherm */
export function newDemo(): void {
  const r = new Rng(seed());
  const id = r.pick(DEMO_IDS);
  const tpl = TPL.find((t) => t.id === id);
  if (!tpl) return;
  const q = make(tpl, 2, r);
  if (q.type !== 'multi' || q.fields.length !== 1) return newDemo();
  S.demo = newUi(q);
}

function naarBoven(): void {
  window.scrollTo(0, 0);
}

export function showQuestion(): void {
  const s = S.s;
  if (!s) return;
  S.calc = { open: false, expr: '', res: '' };
  if (!s.cur && !nextQuestion(s)) return finish();
  if (!s.cur) return;
  S.ui = newUi(s.cur);
  saveSession();
  render();
  naarBoven();
  startTick();
  if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) {
    const f = document.getElementById('ans0');
    if (f) f.focus();
  }
}

export function beginPart(): void {
  const s = S.s;
  if (!s || s.kind !== 'test') return;
  s.phase = s.phase === 'introH' ? 'H' : 'N';
  S.runAt = Date.now();
  showQuestion();
}

export function timeUp(): void {
  const s = S.s;
  if (!s || s.kind !== 'test' || (s.phase !== 'H' && s.phase !== 'N')) return;
  const part = s.phase;
  commit();
  s.left[part] = 0;
  const rest = [];
  while (s.plan[s.idx] && s.plan[s.idx].part === part) {
    rest.push(s.plan[s.idx]);
    s.idx++;
  }
  s.skipped = (s.skipped || []).concat(rest);
  s.cur = null;
  S.ui = null;
  S.calc.open = false;
  if (part === 'H' && s.plan[s.idx]) {
    s.phase = 'introN';
    stopTick();
    saveSession();
    render();
    naarBoven();
  } else {
    S.notice = 'De tijd was om. De opgaven die je niet hebt gemaakt, tellen als fout.';
    finish();
  }
}

export function submitTest(): void {
  const s = S.s;
  const u = S.ui;
  if (!s || s.kind !== 'test' || !u || !isComplete(u.q, u.given)) return;
  const part = u.q.part;
  commit();
  record(s, u.given, qElapsed());
  const slot = s.plan[s.idx];
  if (!slot) return finish();
  if (slot.part !== part) {
    s.phase = 'introN';
    S.ui = null;
    stopTick();
    saveSession();
    render();
    naarBoven();
    return;
  }
  showQuestion();
}

export function checkPractice(): void {
  const s = S.s;
  const u = S.ui;
  if (!s || !u || !isComplete(u.q, u.given) || u.checked) return;
  u.acc = qElapsed();
  u.t0 = null;
  u.ok = record(s, u.given, u.acc);
  u.checked = true;
  S.calc.open = false;
  saveSession();
  render();
  const fb = document.querySelector('.fb');
  if (fb && fb.scrollIntoView) fb.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

export function finish(): void {
  const s = S.s;
  if (!s) return;
  commit();
  stopTick();
  if (!s.items.length && !(s.kind === 'test' && (s.skipped || []).length)) {
    LS.del('session');
    S.s = null;
    S.ui = null;
    go(s.kind === 'test' ? 'start' : 'oefenen');
    return;
  }
  const sum = summarize(s);
  const counts = s.kind === 'test' || sum.n >= 5;
  if (counts) {
    S.history = cleanHist(S.history.concat([historyEntry(s, sum)]), S.wiped);
    saveHistory();
  } else S.notice = 'Deze ronde was te kort om mee te tellen in je voortgang. Vanaf vijf opgaven wordt een oefenronde bewaard.';
  S.result = {
    kind: s.kind,
    mode: s.mode,
    t: Date.now(),
    sum,
    sel: s.kind === 'oefen' ? s.sel : null,
    spent: s.spent,
    notice: S.notice,
    items: s.items.map((it) => ({ q: it.q, given: it.given, ok: it.ok, secs: it.secs })),
  };
  S.notice = '';
  LS.set('last', S.result);
  LS.del('session');
  S.s = null;
  S.ui = null;
  S.calc.open = false;
  S.onlyWrong = false;
  S.view = 'result';
  render();
  naarBoven();
}

export function startTest(mode: Modus): void {
  S.s = newTest(mode, seed());
  S.ui = null;
  S.notice = '';
  S.view = 'run';
  saveSession();
  render();
  naarBoven();
}

export function startPractice(sel: OefenSelectie): void {
  const s = newPractice(sel, seed());
  if (!nextQuestion(s)) return;
  S.s = s;
  S.view = 'run';
  S.notice = '';
  S.runAt = Date.now();
  showQuestion();
}

export function resume(): void {
  const s = S.s;
  if (!s) return;
  S.view = 'run';
  S.runAt = Date.now();
  if (s.kind === 'test' && (s.phase === 'introH' || s.phase === 'introN')) {
    render();
    naarBoven();
    return;
  }
  showQuestion();
}
