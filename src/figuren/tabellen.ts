/* Tabellen en een rekenblad (HTML, geen SVG). */

export interface TabelOpties {
  /** extra klasse, bijvoorbeeld 'wide' */
  cls?: string;
  cap?: string;
  /** eerste cel van elke rij als rijkop (standaard ja) */
  rowHead?: boolean;
}
type Cel = string | number;

export function table(head: readonly Cel[] | null, rows: readonly (readonly Cel[])[], o: TabelOpties = {}): string {
  return (
    '<div class="tblw"><table class="tbl' +
    (o.cls ? ' ' + o.cls : '') +
    '">' +
    (o.cap ? '<caption>' + o.cap + '</caption>' : '') +
    (head ? '<thead><tr>' + head.map((h) => '<th scope="col">' + h + '</th>').join('') + '</tr></thead>' : '') +
    '<tbody>' +
    rows
      .map(
        (rw) =>
          '<tr>' +
          rw.map((c, i) => (i === 0 && o.rowHead !== false ? '<th scope="row">' + c + '</th>' : '<td>' + c + '</td>')).join('') +
          '</tr>',
      )
      .join('') +
    '</tbody></table></div>'
  );
}

/** rekenblad met kolomletters en rijnummers */
export function sheet(rows: readonly (readonly Cel[])[]): string {
  const cols = rows[0].length;
  let h = '<tr><th class="crn"></th>';
  for (let c = 0; c < cols; c++) h += '<th scope="col">' + 'ABCDEFG'.charAt(c) + '</th>';
  h += '</tr>';
  return (
    '<div class="tblw"><table class="tbl sheet"><thead>' +
    h +
    '</thead><tbody>' +
    rows
      .map((rw, i) => '<tr><th scope="row">' + (i + 1) + '</th>' + rw.map((cell) => '<td>' + cell + '</td>').join('') + '</tr>')
      .join('') +
    '</tbody></table></div>'
  );
}
