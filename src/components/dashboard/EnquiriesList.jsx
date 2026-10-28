export default function EnquiriesList({ list }) {
  return (
    <section className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-sm" id="leads">
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">Recent enquiries</h2>
      {list.length === 0 ? (
        <p className="font-body-sm text-body-sm text-on-surface-variant py-3">No enquiries yet. They will appear here when residents send one.</p>
      ) : (
        list.map((e, i) => (
          <div key={i} className="flex flex-wrap items-center justify-between gap-3 py-3.5 border-t border-outline-variant/30">
            <div className="flex-1 min-w-[220px]">
              <strong className="block font-label-lg text-label-lg text-on-surface">{e.who}</strong>
              <p className="font-body-sm text-body-sm text-on-surface-variant">{e.msg}</p>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">{e.when}</span>
            <span className={`font-label-sm text-label-sm font-bold px-2.5 py-1 rounded-full ${e.status === 'New' ? 'bg-primary-fixed text-primary' : 'bg-emerald-100 text-emerald-800'}`}>{e.status}</span>
          </div>
        ))
      )}
    </section>
  );
}
