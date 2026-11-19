/* Welke opgave komt hierna: het toetsplan en de keuze van het opgavetype. */
import { TPL } from '../banken';
import { make } from '../core/opbouw';
import { Rng } from '../core/rng';
import type { Domein, Onderdeel, Opgave, Template } from '../core/types';
import { MODES, type Modus } from './constanten';
import { levelFor } from './schatting';
import type { Sessie, Slot } from './types';

/** de volgorde van domeinen in de toets: eerst alle hoofdrekenopgaven, dan de rest, elk deel geschud */
export function makePlan(mode: Modus, rng: Rng): Slot[] {
  const M = MODES[mode];
  let plan: Slot[] = [];
  (['H', 'N'] as const).forEach((part) => {
    const slots: Slot[] = [];
    (Object.keys(M[part]) as Domein[]).forEach((d) => {
      for (let i = 0; i < (M[part][d] ?? 0); i++) slots.push({ part, dom: d });
    });
    plan = plan.concat(rng.shuffle(slots));
  });
  return plan;
}

/** het minst gebruikte opgavetype voor dit domein en onderdeel */
function pickTpl(dom: Domein, part: Onderdeel, used: Record<string, number>, rng: Rng): Template | null {
  const cands = TPL.filter((t) => t.dom === dom && t.part === part);
  if (!cands.length) return null;
  const least = Math.min(...cands.map((t) => used[t.id] || 0));
  return rng.pick(cands.filter((t) => (used[t.id] || 0) === least));
}

export function hasTpl(dom: Domein, part: Onderdeel): boolean {
  return TPL.some((t) => t.dom === dom && t.part === part);
}

export function slotFor(s: Sessie): Slot | null {
  if (s.kind === 'test') return s.plan[s.idx] || null;
  if (s.sel.count && s.idx >= s.sel.count) return null;
  const rng = new Rng(s.seed * 31 + s.idx * 977 + 5);
  const parts: Onderdeel[] = s.sel.part === 'HN' ? ['H', 'N'] : [s.sel.part];
  const opts: Slot[] = [];
  s.sel.doms.forEach((d) => {
    parts.forEach((p) => {
      if (hasTpl(d, p)) opts.push({ dom: d, part: p });
    });
  });
  if (!opts.length) return null;
  // wissel de domeinen eerlijk af
  const counts: Record<string, number> = {};
  s.items.forEach((it) => {
    counts[it.dom + it.part] = (counts[it.dom + it.part] || 0) + 1;
  });
  const least = Math.min(...opts.map((o) => counts[o.dom + o.part] || 0));
  return rng.pick(opts.filter((o) => (counts[o.dom + o.part] || 0) === least));
}

export function nextQuestion(s: Sessie): Opgave | null {
  const rng = new Rng(s.seed * 1000003 + s.idx * 7919 + 17);
  let tpl: Template | null;
  if (s.kind === 'oefen' && s.sel.tpls && s.sel.tpls.length) {
    // oefenen met een vaste selectie opgavetypes
    const tpls = s.sel.tpls;
    if (s.sel.count && s.idx >= s.sel.count) {
      s.cur = null;
      return null;
    }
    const cands = TPL.filter((t) => tpls.includes(t.id));
    if (!cands.length) {
      s.cur = null;
      return null;
    }
    const least = Math.min(...cands.map((t) => s.used[t.id] || 0));
    tpl = rng.pick(cands.filter((t) => (s.used[t.id] || 0) === least));
  } else {
    const slot = slotFor(s);
    if (!slot) {
      s.cur = null;
      return null;
    }
    tpl = pickTpl(slot.dom, slot.part, s.used, rng);
  }
  // in de oude app ontbrak deze controle: een leeg slot kon niet voorkomen, omdat het plan alleen bestaande combinaties bevat
  if (!tpl) {
    s.cur = null;
    return null;
  }
  const level = s.kind === 'oefen' && s.sel.level ? s.sel.level : levelFor(s.theta);
  const q = make(tpl, level, rng);
  s.used[tpl.id] = (s.used[tpl.id] || 0) + 1;
  s.cur = q;
  return q;
}
