/* De uitslag van een sessie en de regel die in de voortgang bewaard wordt. */
import type { Domein, Niveau, Onderdeel } from '../core/types';
import { estimate, scoreOf, verdict, type Antwoord } from './schatting';
import type { HistorieRegel, Samenvatting, Sessie, Telling } from './types';

export function summarize(s: Sessie): Samenvatting {
  const dom: Partial<Record<Domein, Telling>> = {};
  const part: Record<Onderdeel, Telling> = { H: [0, 0], N: [0, 0] };
  const et: Record<string, Telling> = {};
  const resp: Antwoord[] = [];
  let ok = 0;
  let n = 0;
  let secs = 0;
  const add = (d: Domein, p: Onderdeel, e: string | null, good: boolean, level: Niveau) => {
    const td = (dom[d] = dom[d] || [0, 0]);
    td[1]++;
    part[p][1]++;
    n++;
    if (e) {
      et[e] = et[e] || [0, 0];
      et[e][1]++;
    }
    if (good) {
      td[0]++;
      part[p][0]++;
      ok++;
      if (e) et[e][0]++;
    }
    resp.push({ level, ok: good });
  };
  s.items.forEach((it) => {
    add(it.dom, it.part, it.et, it.ok, it.level);
    secs += it.secs;
  });
  let missed = 0;
  // opgaven die door tijdgebrek niet gemaakt zijn, tellen als fout
  if (s.kind === 'test')
    (s.skipped || []).forEach((sl) => {
      add(sl.dom, sl.part, null, false, 2);
      missed++;
    });
  const th = estimate(resp);
  const sc = scoreOf(th);
  return { n, ok, missed, dom, part, et, theta: th, score: sc, verdict: verdict(sc), secs };
}

export function historyEntry(s: Sessie, sum: Samenvatting): HistorieRegel {
  const e: HistorieRegel = {
    id: 'r' + s.started.toString(36) + (s.seed % 1296).toString(36),
    t: Date.now(),
    mode: s.mode,
    n: sum.n,
    ok: sum.ok,
    score: sum.score,
    dom: sum.dom,
    part: sum.part,
    et: sum.et,
    secs: sum.secs,
  };
  if (s.kind === 'oefen') e.sel = { d: s.sel.doms.join(''), p: s.sel.part, l: s.sel.level };
  return e;
}
