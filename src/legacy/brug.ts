/* Tijdelijke brug tijdens de omzetting: geeft de nieuwe TypeScript-modules aan de oude
   JavaScript-bestanden onder de namen die die verwachten (globalThis.RWT). Verdwijnt in stap 5. */
import { en, eur, fr, frs, inp, klok, NB, nf, words } from '../core/notatie';
import { ask, def, make, mcNum, mcTxt, nm, ordQ, p, RETRY, som, steps, tip, TPL } from '../core/opbouw';
import { gcd, lcm, rnd, sum } from '../core/rekenen';
import { Rng } from '../core/rng';
import { c2, F, ln, svg, tx } from '../figuren';

const kit = { def, nf, inp, eur, en, klok, fr, frs, gcd, lcm, rnd, sum, words, RETRY, steps, tip, som, p, ask, mcNum, mcTxt, ordQ, nm, NB, F: { ...F }, S: { svg, tx, ln, c2 } };
(globalThis as unknown as { RWT: Record<string, unknown> }).RWT = { Rng, TPL, make, kit };
