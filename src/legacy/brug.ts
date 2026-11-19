/* Tijdelijke brug tijdens de omzetting: geeft de nieuwe TypeScript-modules aan de oude
   schermen (app.js) onder de namen die die verwachten (globalThis.RWT). Verdwijnt in stap 5. */
import { TPL } from '../banken';
import { inp, nf } from '../core/notatie';
import { make } from '../core/opbouw';
import { Rng } from '../core/rng';
import * as engine from '../engine';

(globalThis as unknown as { RWT: Record<string, unknown> }).RWT = { Rng, TPL, make, kit: { inp, nf }, engine };
