export default function ActivityChart({ bars }) {
  const max = Math.max(...bars.map((b) => Math.max(b.v, b.c)), 5);
  return (
    <section className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">Activity, last 14 days</h2>
        <div className="flex gap-4 font-body-sm text-body-sm text-on-surface-variant">
          <span className="flex items-center gap-1.5"><i className="inline-block w-3 h-3 rounded-sm bg-primary" />Profile views</span>
          <span className="flex items-center gap-1.5"><i className="inline-block w-3 h-3 rounded-sm bg-amber-500" />Contact attempts</span>
        </div>
      </div>
      <div className="flex items-end gap-2 h-44 border-b border-outline-variant/40">
        {bars.map((b, i) => (
          <div key={i} className="flex-1 min-w-0 flex items-end justify-center gap-1 h-full">
            <div className="w-[42%] rounded-t bg-primary" style={{ height: `${Math.round((b.v / max) * 170)}px` }} title={`${b.v} views`} />
            <div className="w-[42%] rounded-t bg-amber-500" style={{ height: `${Math.round((b.c / max) * 170)}px` }} title={`${b.c} contact attempts`} />
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-1.5">
        {bars.map((b, i) => <span key={i} className="flex-1 text-center font-label-sm text-label-sm text-on-surface-variant">{b.day}</span>)}
      </div>
    </section>
  );
}
