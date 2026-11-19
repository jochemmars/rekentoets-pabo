// Maakt golden.json uit de oude bundel van één bestand (commit 0a5d351, vóór de TypeScript-omzetting).
// Eenmalig gebruikt; de uitkomst staat in de repo. Draaien: node tests/golden/maak-golden.ts
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import vm from 'node:vm';
import { bouwGolden, VASTE_TIJD, type GoldenApi } from './bouw.ts';

const BRON = '0a5d351';
const html = execFileSync('git', ['show', `${BRON}:index.html`], { encoding: 'utf8', maxBuffer: 1 << 26 });
const script = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
// alles behalve de schermen (app.js): kern, de vier opgavebanken en de engine
const kern = script.slice(0, script.indexOf('/* app.js */'));

const ctx = vm.createContext({});
vm.runInContext(`Date.now = () => ${VASTE_TIJD};`, ctx);
vm.runInContext(kern, ctx, { filename: `${BRON}:index.html` });
const api = (ctx as { RWT: GoldenApi }).RWT;

const golden = bouwGolden(api);
const uit = new URL('./golden.json', import.meta.url);
writeFileSync(uit, JSON.stringify(golden, null, 1) + '\n');
const n = Object.keys(golden.opgaven).length;
const fouten = Object.values(golden.opgaven).filter((o) => (o as { fout?: string }).fout).length;
console.log(`golden.json: ${n} opgaven (${fouten} met fout), ${api.TPL.length} types`);
