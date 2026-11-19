// Alles behalve de schermen: kern, figuren, opgavebanken en engine, als één API.
// De golden master test via dit bestand; de schermen gebruiken de modules rechtstreeks.
import { TPL } from './banken';
import { eur, frs, inp, klok, nf, words } from './core/notatie';
import { make } from './core/opbouw';
import { rnd } from './core/rekenen';
import { Rng } from './core/rng';
import * as engine from './engine';

export const RWT = { TPL, Rng, make, kit: { nf, inp, eur, klok, words, frs, rnd }, engine };
