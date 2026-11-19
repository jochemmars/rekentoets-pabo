/* Teksten bij eindtermen, maanden, toetsvormen en niveaus. */
import type { Modus } from '../engine';

// korte eigen omschrijving bij elke eindterm uit de handreiking
export const ET: Record<string, string> = {
  'A.1': 'Getallen tot en met miljard',
  'A.2': 'Rekentaal en symbolen',
  'A.3': 'Ordenen, afronden en schatten',
  'A.4': 'Bewerkingen met hele getallen',
  'A.5': 'Gemiddelde',
  'B.1': 'Schrijfwijze en begrippen',
  'B.2': 'Kommagetallen: plaatswaarde en afronden',
  'B.3': 'Rekenen met kommagetallen',
  'B.4': 'Vergelijken en ordenen',
  'B.5': 'Verhoudingen',
  'B.6': 'Breuken',
  'B.7': 'Procenten en promille',
  'B.8': 'Breuk, kommagetal en procent omzetten',
  'B.9': 'Breuken, procenten en kommagetallen door elkaar',
  'B.10': 'Vergroten en verkleinen met een percentage',
  'B.11': 'Kans en aantal mogelijkheden',
  'C.1': 'Meetkundige begrippen en figuren',
  'C.2': 'Maten omrekenen en kiezen',
  'C.3': 'Snelheid en andere samengestelde grootheden',
  'C.4': 'Schaal',
  'C.5': 'Plattegronden en routes',
  'C.6': 'Symmetrie',
  'C.7': 'Aanzichten',
  'C.8': 'Vakken en coördinaten',
  'C.9': 'Kloktijden',
  'C.10': 'Oppervlakte',
  'C.11': 'Omtrek',
  'C.12': 'Inhoud',
  'C.13': 'Vergroten: oppervlakte en inhoud',
  'C.14': 'Meetkundige patronen',
  'D.1': 'Soorten diagrammen',
  'D.2': 'Grafieken en tabellen lezen',
  'D.3': 'Gegevens verwerken, ook in een rekenblad',
  'D.4': 'Regelmaat en formules',
  'D.5': 'Rekenen met verbanden',
};
// eindtermen die alleen op sommige niveaus van een opgavetype voorkomen
export const ET_TPL: Record<string, string[]> = { 'C.5': ['CN17'] };

export const MND = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
export const MODE_NAME: Record<Modus | 'oefen', string> = { full: 'Volledige proeftoets', short: 'Korte proeftoets', oefen: 'Oefenen' };
export const LVL = ['Groeit mee', 'Opstap', 'Toetsniveau', 'Uitdaging'];
