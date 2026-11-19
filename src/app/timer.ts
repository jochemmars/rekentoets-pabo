/* De klok: resterende tijd in de toets, verstreken tijd bij oefenen. */
import { timeUp } from './flow';
import { fmtTime } from './hulp';
import { I } from './iconen';
import { qElapsed, S } from './state';

export function timerHtml(sec: number, label: string, hide: boolean): string {
  return (
    '<span id="timer" class="timer" role="timer" aria-label="' +
    label +
    '"' +
    (hide ? ' hidden' : '') +
    '>' +
    I.clock +
    '<span id="timer-t">' +
    fmtTime(sec) +
    '</span></span>' +
    '<button type="button" class="btn ghost sm icon" data-act="timerhide" aria-pressed="' +
    !!S.timerHidden +
    '" aria-label="' +
    (S.timerHidden ? 'Toon de tijd' : 'Verberg de tijd') +
    '" title="' +
    (S.timerHidden ? 'Toon de tijd' : 'Verberg de tijd') +
    '">' +
    (S.timerHidden ? I.eye : I.eyeOff) +
    '</button>'
  );
}

/** verborgen tijd komt in de laatste minuut van een toetsdeel vanzelf terug */
export function timerShown(rem: number): boolean {
  return !S.timerHidden || rem <= 60;
}

/** resterende seconden in het lopende toetsdeel */
export function remaining(): number {
  const s = S.s;
  if (!s || s.kind !== 'test' || (s.phase !== 'H' && s.phase !== 'N')) return 0;
  return s.left[s.phase] - (S.runAt ? (Date.now() - S.runAt) / 1000 : 0);
}

/** verwerk de verstreken tijd in de sessie en start een nieuwe meting */
export function commit(): void {
  const s = S.s;
  if (!s) return;
  if (S.runAt && s.kind === 'test' && (s.phase === 'H' || s.phase === 'N')) {
    const d = (Date.now() - S.runAt) / 1000;
    s.left[s.phase] = Math.max(0, s.left[s.phase] - d);
    s.spent[s.phase] += d;
  }
  S.runAt = Date.now();
}

let ticker: ReturnType<typeof setInterval> | null = null;
export function startTick(): void {
  stopTick();
  ticker = setInterval(onTick, 400);
}
export function stopTick(): void {
  if (ticker) {
    clearInterval(ticker);
    ticker = null;
  }
}
function zetTijd(t: string): void {
  const el = document.getElementById('timer-t');
  if (el) el.textContent = t;
}
function onTick(): void {
  const s = S.s;
  const el = document.getElementById('timer');
  if (!s || S.view !== 'run') return stopTick();
  if (s.kind === 'test') {
    if (s.phase !== 'H' && s.phase !== 'N') return;
    const rem = remaining();
    if (rem <= 0) return timeUp();
    if (el) {
      zetTijd(fmtTime(rem));
      el.classList.toggle('low', rem <= (s.phase === 'H' ? 60 : 300));
      el.hidden = !timerShown(rem);
    }
  } else if (el && S.ui && !S.ui.checked) zetTijd(fmtTime(qElapsed()));
}
