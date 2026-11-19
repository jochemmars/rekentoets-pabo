/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** link naar de doneerpagina (Ko-fi, Buy Me a Coffee, Tikkie, ...); leeg = geen steunknop */
  readonly VITE_STEUN_URL?: string;
  /** code van de GoatCounter-site (het deel vóór .goatcounter.com); leeg = geen teller */
  readonly VITE_GOATCOUNTER?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
