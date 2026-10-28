/* Dependency-free CSV export. Excel opens .csv natively, and hand-rolling this
   avoids pulling in a third-party xlsx library just to re-serialize data we
   already trust (the npm `xlsx` package currently ships an unpatched high
   severity advisory, and parsing/writing-protection libraries like it are
   overkill for "write out an array of plain objects"). */

function csvCell(value) {
  if (value === null || value === undefined) return '';
  const s = Array.isArray(value) ? value.join('; ') : typeof value === 'object' ? JSON.stringify(value) : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** Downloads `rows` (array of flat objects) as a .csv file named `filename`.
 *  `columns` is an ordered list of [key, header] pairs; defaults to the keys
 *  of the first row if omitted. */
export function downloadCsv(filename, rows, columns) {
  const cols = columns || (rows[0] ? Object.keys(rows[0]).map((k) => [k, k]) : []);
  const lines = [
    cols.map(([, header]) => csvCell(header)).join(','),
    ...rows.map((row) => cols.map(([key]) => csvCell(row[key])).join(','))
  ];
  // Leading BOM so Excel detects UTF-8 (otherwise ₹ and other non-ASCII render as mojibake).
  const blob = new Blob(['﻿' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
