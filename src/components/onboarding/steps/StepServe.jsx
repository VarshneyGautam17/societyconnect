import { useSocieties } from '@/lib/societies';
import Field, { inputCls } from '@/components/ui/Field';
import Icon from '@/components/ui/Icon';

/** Same normalisation the page uses to tell whether the verified address is still the one in
 *  the form -- any edit to these four fields means it has to be checked again. */
export function addressKey(draft) {
  return [draft.societyName, draft.street, draft.city, draft.pincode].map((v) => String(v || '').trim().toLowerCase()).join('|');
}

export default function StepServe({ draft, patch, errors, checking }) {
  const societies = useSocieties();
  const verified = draft.society && draft.society.key === addressKey(draft) ? draft.society : null;
  const others = societies.filter((s) => s.id !== verified?.id);

  function toggleSociety(id) {
    const served = draft.served.includes(id) ? draft.served.filter((x) => x !== id) : [...draft.served, id];
    patch({ served });
  }

  const cls = (key) => `${inputCls} ${errors[key] ? 'border-error' : 'border-outline-variant'}`;

  return (
    <>
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">Where are you based?</h2>
      <p className="font-body-md text-body-md text-on-surface-variant mb-5">Your society&apos;s address. We&apos;ll match you with your society on SocietySpot, or add it if it&apos;s new.</p>
      <div className="flex flex-col gap-5">
        <Field label="Society name" error={errors.societyName} hint="Start typing to pick a society already on SocietySpot, or enter a new one.">
          <input
            value={draft.societyName}
            onChange={(e) => patch({ societyName: e.target.value })}
            list="society-names"
            placeholder="e.g. Prestige Lakeside Habitat"
            maxLength={120}
            autoComplete="off"
            className={cls('societyName')}
          />
          <datalist id="society-names">
            {societies.map((s) => <option key={s.id} value={s.name}>{s.place}</option>)}
          </datalist>
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Flat, tower or block" hint="Shown on your listing only if you add it.">
            <input
              value={draft.area}
              onChange={(e) => patch({ area: e.target.value })}
              placeholder="e.g. Tower B"
              maxLength={120}
              className={cls('area')}
            />
          </Field>
          <Field label="Street or locality" error={errors.street}>
            <input
              value={draft.street}
              onChange={(e) => patch({ street: e.target.value })}
              placeholder="e.g. Varthur Main Road"
              maxLength={160}
              autoComplete="address-line1"
              className={cls('street')}
            />
          </Field>
          <Field label="City" error={errors.city}>
            <input
              value={draft.city}
              onChange={(e) => patch({ city: e.target.value })}
              placeholder="e.g. Bengaluru"
              maxLength={80}
              autoComplete="address-level2"
              className={cls('city')}
            />
          </Field>
          <Field label="PIN code" error={errors.pincode}>
            <input
              value={draft.pincode}
              onChange={(e) => patch({ pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
              placeholder="e.g. 560087"
              inputMode="numeric"
              autoComplete="postal-code"
              className={cls('pincode')}
            />
          </Field>
        </div>

        {errors.address ? (
          <div role="alert" className="flex items-start gap-3 rounded-2xl border border-error/40 bg-error-container/40 px-4 py-3 font-body-sm text-body-sm text-error">
            <Icon name="error" className="text-lg flex-none mt-px" />
            <span>{errors.address}</span>
          </div>
        ) : verified ? (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-300/60 bg-emerald-50 px-4 py-3 font-body-sm text-body-sm text-emerald-800">
            <Icon name="circleCheck" className="text-lg flex-none mt-px" />
            <span>Society confirmed: <strong className="font-semibold">{verified.name}</strong>{verified.place ? `, ${verified.place}` : ''}</span>
          </div>
        ) : checking ? (
          <div className="flex items-center gap-3 rounded-2xl bg-surface-container px-4 py-3 font-body-sm text-body-sm text-on-surface-variant">
            <span className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin flex-none" aria-hidden="true" />
            Confirming your society...
          </div>
        ) : null}

        {others.length > 0 && (
          <div>
            <div className="font-label-md text-label-md font-semibold text-on-surface mb-1">Also serve other societies <span className="font-normal text-on-surface-variant">(optional)</span></div>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-2.5">Your own society is included automatically.</p>
            <div className="flex flex-wrap gap-2">
              {others.map((s) => {
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
          </div>
        )}
      </div>
    </>
  );
}
