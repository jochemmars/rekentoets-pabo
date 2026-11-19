/* De vraag om steun: een rustige kaart, alleen als er een doneerlink is ingesteld. */
import { STEUN_URL } from '../../config';
import { esc } from '../hulp';
import { I } from '../iconen';

export function steunKaart(): string {
  if (!STEUN_URL) return '';
  return (
    '<section class="card steun-kaart"><h3>Heb je iets aan deze app?</h3><p class="small">De app is gratis en zonder reclame, en dat blijft zo. Met een kleine bijdrage help je de opgaven up-to-date te houden.</p>' +
    '<div class="row"><a class="btn steun" href="' +
    esc(STEUN_URL) +
    '" target="_blank" rel="noopener">' +
    I.heart +
    'Steun de app</a></div></section>'
  );
}
