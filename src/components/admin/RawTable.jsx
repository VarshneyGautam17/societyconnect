/** Renders one database table's rows exactly as stored -- every declared column, in schema
 *  order, even where every row happens to be null for it. Used by /admin/data to show admins
 *  the raw backend data (as opposed to the curated views on /admin/vendors and /admin/businesses). */
const ISO_TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const TZ = 'Asia/Kolkata';

function formatDateTime(text) {
  const d = new Date(text);
  if (Number.isNaN(d.getTime())) return text;
  const date = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: TZ });
  const time = d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: TZ });
  return `${date}, ${time.toUpperCase()}`;
}

function formatDate(text) {
  const d = new Date(`${text}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return text;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}

function cell(value) {
  if (value === null || value === undefined || value === '') return <span className="text-on-surface-variant/50">—</span>;
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'string' && ISO_TIMESTAMP.test(value)) return <span title={value}>{formatDateTime(value)}</span>;
  if (typeof value === 'string' && ISO_DATE.test(value)) return <span title={value}>{formatDate(value)}</span>;
  if (Array.isArray(value) && value.every((v) => typeof v === 'string' || typeof v === 'number')) {
    const joined = value.join(', ');
    return joined.length > 60 ? <span title={joined} className="cursor-help">{joined.slice(0, 60)}…</span> : joined;
  }
  if (Array.isArray(value) || typeof value === 'object') {
    const json = JSON.stringify(value);
    const short = json.length > 60 ? `${json.slice(0, 60)}…` : json;
    return <span title={json} className="cursor-help">{short}</span>;
  }
  const text = String(value);
  if (text.length > 60) return <span title={text} className="cursor-help">{text.slice(0, 60)}…</span>;
  return text;
}

export default function RawTable({ name, columns, rows, totalCount }) {
  return (
    <section id={name} className="bg-surface-container-lowest rounded-2xl sm:rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-3 sm:py-4 border-b border-outline-variant/30">
        <h2 className="font-headline-sm text-label-lg sm:text-headline-sm text-on-surface">{name}</h2>
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          {rows.length === totalCount ? `${totalCount} row${totalCount === 1 ? '' : 's'}` : `Showing latest ${rows.length} of ${totalCount}`}
        </span>
      </div>
      {rows.length === 0 ? (
        <p className="font-body-sm text-body-sm text-on-surface-variant px-4 sm:px-6 py-4">No rows yet.</p>
      ) : (
        <div className="overflow-auto max-h-[70vh]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c} className="sticky top-0 z-10 px-3 py-2.5 bg-surface-container border-b-2 border-outline-variant/40 font-label-sm text-label-sm font-bold uppercase tracking-wide text-on-surface-variant whitespace-nowrap">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={row.id ?? i} className="border-t border-outline-variant/20 even:bg-surface-container/40 hover:bg-primary-fixed/25 transition-colors">
                  {columns.map((c) => (
                    <td key={c} className="px-3 py-2 font-mono text-body-sm tabular-nums text-on-surface align-top whitespace-nowrap">{cell(row[c])}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
