// Alles behalve de schermen: kern, figuren, opgavebanken en engine.
// Tijdens de omzetting naar TypeScript wijst dit stap voor stap naar de nieuwe modules.
import './legacy/brug';
import './legacy/bankA.js';
import './legacy/bankB.js';
import './legacy/bankC.js';
import './legacy/bankD.js';
import './legacy/engine.js';

export const RWT: unknown = (globalThis as { RWT?: unknown }).RWT;
