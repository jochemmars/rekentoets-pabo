/* Instellingen die per omgeving verschillen. In GitHub Actions komen ze uit de repository-variabelen
   STEUN_URL en GOATCOUNTER (zie deploy.yml). Zijn ze leeg, dan is de functie gewoon uit. */

/** alleen een https-adres wordt gebruikt */
export function veiligeUrl(u: string | undefined): string {
  const t = (u ?? '').trim();
  try {
    return t && new URL(t).protocol === 'https:' ? t : '';
  } catch {
    return '';
  }
}

/** alleen kleine letters, cijfers en streepjes, zoals GoatCounter ze toestaat */
export function tellerCode(c: string | undefined): string {
  const t = (c ?? '').trim();
  return /^[a-z0-9-]{1,50}$/.test(t) ? t : '';
}

export const STEUN_URL = veiligeUrl(import.meta.env.VITE_STEUN_URL);
export const GOATCOUNTER = tellerCode(import.meta.env.VITE_GOATCOUNTER);
