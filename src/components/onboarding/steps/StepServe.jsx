import { SOCIETIES } from '@/data/societies';
import Field, { inputCls } from '@/components/ui/Field';

export default function StepServe({ draft, patch, errors }) {
  function toggleSociety(id) {
    const i = draft.served.indexOf(id);
    const served = i >= 0 ? draft.served.filter((x) => x !== id) : [...draft.served, id];
    patch({ served });
  }

  return (
    <>
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-5">Where do you serve?</h2>
      <div className="flex flex-col gap-5">
        <div>
          <div className="font-label-md text-label-md font-semibold text-on-surface mb-2.5">Choose one or more societies</div>
          <div className="flex flex-wrap gap-2">
            {SOCIETIES.map((s) => {
              const on = draft.served.includes(s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSociety(s.id)}
                  aria-pressed={on}
                  className={
                    'inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full font-label-md text-label-md font-semibold transition-colors ' +
                    (on ? 'bg-primary-fixed border border-primary text-primary' : 'border border-outline-variant text-on-surface-variant hover:border-primary/50')
                  }
                >
                  {s.name}
                </button>
              );
            })}
          </div>
          {errors.served && <span className="block mt-2 font-body-sm text-body-sm text-error">{errors.served}</span>}
        </div>
        <Field label="Tower, block or area" hint="Your exact address is shown only if you choose to.">
          <input
            value={draft.area}
            onChange={(e) => patch({ area: e.target.value })}
            placeholder="e.g. Tower B"
            className={`${inputCls} border-outline-variant`}
          />
        </Field>
      </div>
    </>
  );
}
