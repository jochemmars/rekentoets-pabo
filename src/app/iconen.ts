/* Iconen als inline SVG-tekst. */
// iconen van Lucide (lucide.dev, ISC-licentie), lucide-static 0.468.0, hier ingebouwd zodat er geen extra pakket nodig is
function svgI(d: string, extra?: string): string {
  return (
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' +
    (extra || '') +
    '>' +
    d +
    '</svg>'
  );
}
export const I = {
  ok: svgI('<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'), // circle-check
  no: svgI('<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>'), // circle-x
  warn: svgI(
    '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  ), // triangle-alert
  chev: svgI('<path d="m9 18 6-6-6-6"/>', ' class="chev"'), // chevron-right
  tick: svgI('<path d="M20 6 9 17l-5-5"/>'), // check
  home: svgI(
    '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  ), // house
  pen: svgI(
    '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  ), // pencil
  chart: svgI('<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="m19 9-5 5-4-4-3 3"/>'), // chart-line
  info: svgI('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>'), // info
  calc: svgI(
    '<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>',
  ), // calculator
  clock: svgI('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'), // clock
  x: svgI('<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'), // x
  eye: svgI(
    '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
  ), // eye
  eyeOff: svgI(
    '<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',
  ), // eye-off
  arrow: svgI('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>'), // arrow-right
  down: svgI('<path d="m6 9 6 6 6-6"/>', ' class="chev"'), // chevron-down
} as const;
