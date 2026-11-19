/* Kleine hulpjes die in meerdere opgavebanken voorkomen. */
import { nf } from '../core/notatie';
import { rnd } from '../core/rekenen';

/** getal netjes genoteerd, zonder afrondingsruis */
export const f6 = (x: number): string => nf(rnd(x, 6));
/** is x (vrijwel) een geheel getal? */
export const whole = (x: number): boolean => Math.abs(x - Math.round(x)) < 1e-9;
/** twijfelgeval bij afronden op d decimalen: het cijfer daarna is precies een losse 5 */
export const tie = (x: number, d: number): boolean => Math.round(Math.abs(x) * Math.pow(10, d + 3)) % 1000 === 500;
/** eerste letter een hoofdletter */
export const cap = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
/** "1 minuut", "5 minuten" */
export const mnt = (n: number): string => n + (n === 1 ? ' minuut' : ' minuten');
/** invulplek in een kale som */
export const gap = '<span class="gap">…</span>';
