/* Rekent een uitdrukking van de rekenmachine uit, met de gewone voorrangsregels.
   Ondersteunt + − × ÷, haakjes, √ (wortel van wat erna komt), ² (kwadraat) en komma's. */

export function calcEval(expr: string): number {
  const s = expr.replace(/,/g, '.').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
  let i = 0;
  function atom(): number {
    let v: number;
    const ch = s.charAt(i);
    if (ch === '(') {
      i++;
      v = sum();
      if (s.charAt(i) !== ')') throw new Error('haakje');
      i++;
    } else if (ch === '√') {
      i++;
      v = Math.sqrt(atom());
    } else if (ch === '-') {
      i++;
      v = -atom();
    } else {
      const st = i;
      while (/[0-9.]/.test(s.charAt(i))) i++;
      if (st === i) throw new Error('getal');
      v = parseFloat(s.slice(st, i));
    }
    while (s.charAt(i) === '²') {
      i++;
      v = v * v;
    }
    return v;
  }
  function term(): number {
    let v = atom();
    while (s.charAt(i) === '*' || s.charAt(i) === '/') {
      const op = s.charAt(i++);
      const w = atom();
      v = op === '*' ? v * w : v / w;
    }
    return v;
  }
  function sum(): number {
    let v = term();
    while (s.charAt(i) === '+' || s.charAt(i) === '-') {
      const op = s.charAt(i++);
      const w = term();
      v = op === '+' ? v + w : v - w;
    }
    return v;
  }
  const out = sum();
  if (i < s.length || !isFinite(out)) throw new Error('rest');
  return out;
}

/** uitkomst zoals de rekenmachine hem toont: hoogstens 12 significante cijfers, komma als decimaalteken */
export function calcFmt(v: number): string {
  return String(parseFloat(v.toPrecision(12))).replace('.', ',');
}
