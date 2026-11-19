# Rekentoets pabo oefenen

Een gratis oefenapp voor de **landelijke reken- en wiskundetoets voor de pabo (RWT)**. Je maakt proeftoetsen in de opbouw van de echte toets. Elke keer krijg je nieuwe getallen en situaties, en na afloop zie je bij elke opgave de uitwerking.

**Open de app:** https://jochemmars.github.io/rekentoets-pabo/

Je hebt geen account nodig en er hoeft niets geïnstalleerd te worden. De app werkt op je telefoon, tablet en computer.

## Wat kun je ermee?

| Oefenvorm                | Wat het is                                                                                                                                                      |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Volledige proeftoets** | 55 opgaven: 17 hoofdrekenen in 17 minuten en 38 andere opgaven in 103 minuten. Je kunt niet terugbladeren en niets overslaan. De uitslag krijg je aan het eind. |
| **Korte proeftoets**     | 20 opgaven in dezelfde verhouding, in 6 + 38 minuten. Handig om snel te zien waar je staat.                                                                     |
| **Oefenen per domein**   | Zonder tijdsdruk. Na elke opgave zie je meteen of het goed is, met de uitwerking erbij. Je kiest het domein, het onderdeel en het niveau.                       |
| **Voortgang**            | Je oefenscore per sessie, je resultaten per domein en de onderwerpen waar je de meeste fouten maakt. Met één tik oefen je precies die onderwerpen.              |

## Zo werken de opgaven

- **Vier domeinen**, verdeeld zoals in de echte toets: hele getallen; verhoudingen, procenten, breuken en decimale getallen; meten en meetkunde; verbanden en statistiek.
- **107 soorten opgaven** bij de eindtermen uit de handreiking van Cito. Bij elke opgave worden de getallen, namen en situaties opnieuw gekozen.
- **Verhaalopgaven** buiten het hoofdrekenen. Ze vragen om goed lezen, en soms staan er gegevens in die je niet nodig hebt. Hoofdrekenen bestaat vooral uit kale sommen.
- **Grafieken, tabellen en figuren**, zoals staafdiagrammen, lijngrafieken, plattegronden en een rekenblad.
- **Adaptief:** na een goed antwoord wordt de volgende opgave vaak moeilijker, net als in de echte toets.
- **Rekenmachine** bij een deel van de opgaven buiten het hoofdrekenen.
- **Antwoorden invullen zoals in de echte toets:** alleen cijfers en een komma, zonder punt in grote getallen. Je typt dus `1250`, niet `1.250`.

## Belangrijk om te weten

- **Dit is geen officiële toets.** De app is niet van Cito. De opgaven zijn zelfgemaakte variaties op de eindtermen en geen echte toetsopgaven.
- **De oefenscore (0 tot 100) is een eigen maat van deze app.** Daar kun je geen RWT-score uit afleiden. Vanaf 70 ben je in deze app op koers.
- **Maak ook de officiële oefentoets van Cito.** De link staat op [goedvoorbereidnaardepabo.nl](https://www.goedvoorbereidnaardepabo.nl/rekenen-wiskunde/).
- Meer over de echte toets staat in de [handreiking RWT van Cito](https://cito.nl/media/12hjkpx5/cito-rwt-handreiking-31.pdf).

## Je voortgang

Je resultaten worden alleen bewaard in je eigen browser, op je eigen apparaat. Niemand anders kan ze zien en je antwoorden en resultaten worden nooit naar een server gestuurd. De app telt wel anoniem hoe vaak hij gebruikt wordt, met [GoatCounter](https://www.goatcounter.com): zonder cookies en zonder persoonsgegevens. Daardoor geldt wel:

- Gebruik steeds hetzelfde apparaat en dezelfde browser.
- In een privé- of incognitovenster wordt niets bewaard.
- Als je je browsergegevens wist, ben je je voortgang kwijt.

Stop je halverwege een toets, dan kun je later verder waar je was. De klok staat stil zolang de app niet open is.

## Op je beginscherm zetten

- **iPhone:** open de link in Safari, tik op de deelknop en kies **Zet op beginscherm**.
- **Android:** open de link in Chrome, tik op het menu (drie puntjes) en kies **Toevoegen aan startscherm**.

## Voor ontwikkelaars

De app is geschreven in TypeScript (strict) met Vite, zonder framework. Alles draait in de browser; er is geen server.

```bash
npm ci            # pakketten installeren (Node 22 of nieuwer)
npm run dev       # ontwikkelserver met direct herladen
npm test          # golden master en unit tests (Vitest)
npm run e2e       # de hele flow in Chromium (Playwright); lokaal kan PW_CHROME=/usr/bin/google-chrome
npm run lint      # ESLint
npm run build     # typecheck en productie-build in dist/
```

### Mappen

| Map            | Inhoud                                                                                  |
| -------------- | --------------------------------------------------------------------------------------- |
| `src/core`     | types, toevalsgetallen met seed, rekenen, Nederlandse notatie, opbouw van opgaven       |
| `src/figuren`  | SVG-figuren: grafieken, getallenlijn, klok, kaart, meetkunde, meten, patronen, tabellen |
| `src/banken`   | de 107 opgavetypes, per domein en per onderdeel (hoofdrekenen / niet-hoofdrekenen)      |
| `src/engine`   | toetsopbouw, adaptieve niveaukeuze, nakijken, score en uitslag                          |
| `src/app`      | de schermen (`views/`), de rekenmachine, toestand, opslag in de browser en de bediening |
| `src/styles`   | CSS: tokens (licht en donker), basis, componenten, toets, uitslag, figuren              |
| `tests/golden` | golden master: legt de uitvoer van alle opgavetypes en de engine vast                   |
| `tests/unit`   | unit tests                                                                              |
| `tests/e2e`    | Playwright: de hele flow in licht en donker, op 390 en 1280 pixels breed                |

### Golden master

`tests/golden/golden.json` bevat de uitvoer van alle opgavetypes op drie niveaus met vaste seeds, plus gesimuleerde proeftoetsen en oefenrondes. Het is gemaakt uit de oude versie van één bestand (`npm run golden:uit-oude-versie`). Verandert een opgave bewust, werk het bestand dan bij met `npm run golden:bijwerken` en controleer het verschil in de diff voordat je het commit.

### Steunknop en bezoekersteller

Beide staan uit tot je ze instelt, als repository-variabele onder **Settings → Secrets and variables → Actions → Variables**:

| Variabele     | Voorbeeld                    | Wat het doet                                                                        |
| ------------- | ---------------------------- | ----------------------------------------------------------------------------------- |
| `STEUN_URL`   | `https://ko-fi.com/jouwnaam` | toont een rustige steunkaart onder de uitslag en bij de uitleg (alleen https-links) |
| `GOATCOUNTER` | `rekentoets-pabo`            | telt anoniem bezoeken en gebeurtenissen zoals 'proeftoets gestart' via GoatCounter  |

Na het instellen: draai de workflow **Deploy** opnieuw (Actions → Deploy → Run workflow). Lokaal kan het ook met `VITE_STEUN_URL=... npm run dev`.

### Publiceren

Elke push naar `main` draait alle controles (`.github/workflows/ci.yml`) en zet daarna de build op GitHub Pages (`deploy.yml`). Een branch of pull request krijgt alleen de controles.
