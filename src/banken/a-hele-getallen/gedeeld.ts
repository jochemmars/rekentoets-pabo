/* Domein A · gedeeld door hoofdrekenen en niet-hoofdrekenen */
import { nf } from '../../core/notatie';
import { steps } from '../../core/opbouw';

export const RN: Record<number, string> = {
  10: 'tientallen',
  100: 'honderdtallen',
  1000: 'duizendtallen',
  10000: 'tienduizendtallen',
  100000: 'honderdduizendtallen',
  1000000: 'miljoenen',
};
export function roundEx(n: number, u: number, tail?: string): string {
  const dig = Math.floor(n / (u / 10)) % 10,
    R = Math.round(n / u) * u;
  return steps(
    `Kijk naar het cijfer rechts van de ${RN[u]}: dat is een ${dig}.`,
    dig >= 5 ? '5 of hoger: je rondt naar boven af.' : 'Lager dan 5: je rondt naar beneden af.',
    `Het wordt <b>${nf(R)}</b>${tail || ''}.`,
  );
}
