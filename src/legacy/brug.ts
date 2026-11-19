/* Tijdelijke brug tijdens de omzetting: geeft de nieuwe TypeScript-modules aan de oude
   engine en schermen onder de namen die die verwachten (globalThis.RWT). Verdwijnt in stap 5. */
import { inp, nf } from '../core/notatie';
import { make } from '../core/opbouw';
import { Rng } from '../core/rng';
import { TPL } from '../banken';

(globalThis as unknown as { RWT: Record<string, unknown> }).RWT = { Rng, TPL, make, kit: { inp, nf } };
