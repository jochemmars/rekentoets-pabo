/* Uitleg over de echte toets en over deze app, met alle soorten opgaven. */
import { TPL } from '../../banken';
import { GOATCOUNTER } from '../../config';
import { DOM } from '../../engine';
import { steunKaart } from './steun';

export function viewInfo(): string {
  let h =
    '<header class="stack"><h2>Over de toets</h2><p class="lead">Wat de landelijke reken- en wiskundetoets voor de pabo (RWT) is, en hoe deze app daarop aansluit.</p></header>';
  h +=
    '<section class="card"><h3>De echte toets</h3><div class="prose"><ul>' +
    '<li>De RWT is sinds 1 september 2024 de rekentoets voor de pabo en is de opvolger van de Wiscat.</li>' +
    '<li>Je krijgt 55 opgaven: 17 keer hoofdrekenen in 17 minuten en 38 andere opgaven in 103 minuten. Vijftig opgaven tellen mee, vijf zijn proefopgaven.</li>' +
    '<li>De toets is adaptief. Na een goed antwoord volgt een moeilijkere opgave. Je kunt niet terug en niets overslaan.</li>' +
    '<li>Er zijn vier domeinen: hele getallen (30%), verhoudingen, procenten, breuken en decimale getallen (28%), meten en meetkunde (24%) en verbanden en statistiek (18%).</li>' +
    '<li>Je bent geslaagd bij een schaalscore van 575 of hoger, op een schaal van 0 tot 1.000.</li>' +
    '<li>Kladpapier mag altijd. Een rekenmachine is er alleen bij een deel van de opgaven buiten het hoofdrekenen.</li></ul>' +
    '<p class="small">Bron: <a href="https://cito.nl/media/12hjkpx5/cito-rwt-handreiking-31.pdf" target="_blank" rel="noopener">Handreiking RWT van Cito, versie 3.1 (augustus 2026)</a>. De regels voor het aantal kansen staan in de onderwijs- en examenregeling van je eigen hogeschool.</p></div></section>';
  h +=
    '<section class="card"><h3>Wat deze app wel en niet is</h3><div class="prose"><ul>' +
    '<li>De opbouw, de tijden en de verdeling over de domeinen volgen de echte toets.</li>' +
    '<li>De opgaven zijn zelfgemaakt bij de eindtermen uit de handreiking. Het zijn geen echte toetsopgaven: die geeft Cito niet vrij.</li>' +
    '<li>De oefenscore (0 tot 100) is een eigen maat van deze app. Je kunt er geen RWT-score uit afleiden.</li>' +
    (GOATCOUNTER
      ? '<li>De app telt anoniem hoe vaak hij gebruikt wordt, met GoatCounter: zonder cookies en zonder je antwoorden of resultaten. Die blijven alleen in je eigen browser.</li>'
      : '') +
    '<li>In de echte toets tellen vijf proefopgaven niet mee. In deze app tellen alle opgaven mee.</li>' +
    '<li>Maak daarnaast de officiële oefentoets van Cito. De link staat op <a href="https://www.goedvoorbereidnaardepabo.nl/rekenen-wiskunde/" target="_blank" rel="noopener">goedvoorbereidnaardepabo.nl</a>.</li></ul></div></section>';
  h +=
    '<section class="card"><h3>Antwoorden invullen</h3><div class="prose"><ul><li>Typ alleen cijfers en zo nodig een komma: 1250 en 12,5.</li><li>Zet geen punt in grote getallen. In de opgaven staat 1.250, maar je typt 1250.</li><li>Voor een negatief getal tik je op de knop ± naast het invulvak.</li><li>Staat er dat je moet afronden, doe dat dan precies zoals gevraagd.</li></ul></div></section>';
  h +=
    '<section class="card"><h3>Zo pak je een verhaalopgave aan</h3><div class="prose"><ul><li>Lees eerst de laatste zin: wat wordt er precies gevraagd, en in welke eenheid?</li><li>Lees daarna het hele verhaal en streep weg wat je niet nodig hebt.</li><li>Schrijf tussenstappen op kladpapier. Reken niet alles uit je hoofd.</li><li>Kijk aan het eind of je antwoord kan kloppen. Een deur van 20 meter hoog bestaat niet.</li></ul></div></section>';
  h += '<section class="card"><h3>Alle soorten opgaven</h3><p class="small">Tik op een onderwerp om er tien opgaven van te oefenen.</p>';
  (['A', 'B', 'C', 'D'] as const).forEach((d) => {
    const ts = TPL.filter((t) => t.dom === d);
    h +=
      '<details class="acc"><summary>' +
      DOM[d].name +
      ' <span class="tiny">' +
      ts.length +
      ' soorten</span></summary><ul class="list">' +
      ts
        .map(
          (t) =>
            '<li><span>' +
            t.name +
            '<span class="tiny">' +
            t.et +
            ' · ' +
            (t.part === 'H' ? 'hoofdrekenen' : 'niet-hoofdrekenen') +
            '</span></span><button class="btn sm" data-act="practpl" data-id="' +
            t.id +
            '">Oefen</button></li>',
        )
        .join('') +
      '</ul></details>';
  });
  return h + '</section>' + steunKaart();
}
