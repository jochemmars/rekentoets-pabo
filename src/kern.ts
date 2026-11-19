// Alles behalve de schermen: kern, figuren, opgavebanken en engine.
// Tijdens de omzetting naar TypeScript wijst dit stap voor stap naar de nieuwe modules.
import { TPL } from './banken';
import { eur, frs, inp, klok, nf, words } from './core/notatie';
import { make } from './core/opbouw';
import { rnd } from './core/rekenen';
import { Rng } from './core/rng';
import './legacy/brug';
import './legacy/engine.js';

const oud = (globalThis as unknown as { RWT: { engine: unknown } }).RWT;

export const RWT = { TPL, Rng, make, kit: { nf, inp, eur, klok, words, frs, rnd }, engine: oud.engine };
