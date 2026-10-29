const inputCls = 'min-h-[44px] rounded-2xl border border-outline-variant px-3.5 font-body-md text-body-md focus:border-primary focus:outline-none';

export default function HoursEditor({ hours, onChange }) {
  function update(i, key, value) {
    onChange(hours.map((h, idx) => (idx === i ? { ...h, [key]: value } : h)));
  }

  return (
    <section className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-sm" id="hours">
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">Opening hours</h2>
      <div>
        {hours.map((h, i) => (
          <div key={h.day} className="flex flex-wrap items-center gap-3 mb-2.5">
            <label className="flex-none w-36 flex items-center gap-2.5 font-label-lg text-label-lg font-medium text-on-surface">
              <input type="checkbox" checked={h.open} onChange={(e) => update(i, 'open', e.target.checked)} className="w-5 h-5 accent-primary" />
              {h.day}
            </label>
            <input
              aria-label="Opens"
              value={h.from}
              disabled={!h.open}
              onChange={(e) => update(i, 'from', e.target.value)}
              maxLength={20}
              className={`w-28 ${inputCls} ${h.open ? '' : 'bg-surface-container-high text-on-surface-variant'}`}
            />
            <span className="font-body-sm text-body-sm text-on-surface-variant">to</span>
            <input
              aria-label="Closes"
              value={h.to}
              disabled={!h.open}
              onChange={(e) => update(i, 'to', e.target.value)}
              maxLength={20}
              className={`w-28 ${inputCls} ${h.open ? '' : 'bg-surface-container-high text-on-surface-variant'}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
