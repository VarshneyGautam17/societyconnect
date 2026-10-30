import { CATEGORIES } from '@/data/categories';
import { slugify } from '@/lib/slugify';
import Field, { inputCls } from '@/components/ui/Field';
import Icon from '@/components/ui/Icon';
import RichTextEditor from '@/components/ui/RichTextEditor';

export default function StepBasics({ draft, patch, errors }) {
  function onNameChange(name) {
    /* Keeps the URL field following the business name right up until the vendor deliberately
       edits it themselves -- same "auto-slug until touched" pattern most site builders use, so
       typos in the name don't silently leave a stale URL behind, but a custom choice also never
       gets clobbered. */
    if (draft.slugCustom) {
      patch({ name });
    } else {
      patch({ name, slug: slugify(name) });
    }
  }

  function onSlugChange(raw) {
    const slug = slugify(raw);
    patch({ slug, slugCustom: slug.length > 0 });
  }

  return (
    <>
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-5">Tell us about your business</h2>
      <div className="flex flex-col gap-5">
        <Field label="Business name" error={errors.name}>
          <input
            value={draft.name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="e.g. Annapurna Home Kitchen"
            maxLength={120}
            className={`${inputCls} ${errors.name ? 'border-error' : 'border-outline-variant'}`}
          />
        </Field>

        <Field label="Your page link" hint="This is the web address residents (and anyone you share it with) will use to find your page.">
          <div className={`flex items-center mt-2 min-h-[48px] rounded-2xl border overflow-hidden focus-within:border-primary ${errors.slug ? 'border-error' : 'border-outline-variant'}`}>
            <span className="pl-4 pr-1 font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap select-none">societyspot.app/business/</span>
            <input
              value={draft.slug}
              onChange={(e) => onSlugChange(e.target.value)}
              placeholder="your-business-name"
              maxLength={60}
              className="flex-1 min-w-0 pr-4 py-2.5 bg-transparent font-body-md text-body-md text-on-surface focus:outline-none"
            />
          </div>
        </Field>

        <fieldset className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 border-0 p-0 m-0" aria-label="Category">
          {CATEGORIES.map((c) => {
            const on = draft.cat === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => patch({ cat: c.id })}
                aria-pressed={on}
                className={
                  'flex flex-col items-center justify-center gap-2 min-h-[84px] p-3 rounded-2xl text-center font-label-sm text-label-sm font-semibold transition-colors ' +
                  (on ? 'border-2 border-primary bg-primary-fixed text-primary' : 'border border-outline-variant text-on-surface-variant hover:border-primary/50')
                }
              >
                <Icon name={c.micon} className="text-xl" />
                <span>{c.name}</span>
              </button>
            );
          })}
        </fieldset>
        {errors.cat && <span className="block -mt-3 font-body-sm text-body-sm text-error">{errors.cat}</span>}

        <Field label="One-line description">
          <RichTextEditor value={draft.desc} onChange={(desc) => patch({ desc })} rows={2} placeholder="What do you offer?" maxLength={500} className="mt-2" />
          <span className="block mt-1.5 font-body-sm text-body-sm text-on-surface-variant">Keep it short. Neighbors read this first.</span>
        </Field>

        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[220px]">
            <Field label="WhatsApp number" error={errors.whatsapp}>
              <input
                value={draft.whatsapp}
                onChange={(e) => patch({ whatsapp: e.target.value.replace(/\D/g, '') })}
                inputMode="numeric"
                maxLength={10}
                className={`${inputCls} ${errors.whatsapp ? 'border-error' : 'border-outline-variant'}`}
              />
            </Field>
          </div>
          <div className="flex-1 min-w-[220px]">
            <Field label="Phone number for calls">
              <input
                value={draft.same ? draft.whatsapp : draft.call}
                onChange={(e) => patch({ call: e.target.value.replace(/\D/g, '') })}
                disabled={draft.same}
                inputMode="numeric"
                maxLength={10}
                className={`${inputCls} border-outline-variant disabled:bg-surface-container-high disabled:text-on-surface-variant`}
              />
            </Field>
          </div>
        </div>

        <label className="flex items-center gap-2.5 font-body-md text-body-md text-on-surface">
          <input type="checkbox" checked={draft.same} onChange={(e) => patch({ same: e.target.checked })} className="w-5 h-5 accent-primary" />
          Same number for WhatsApp and calls
        </label>

        <div className="bg-primary-fixed text-primary rounded-2xl px-4 py-3.5 font-body-sm text-body-sm leading-relaxed">
          Your number stays hidden until a resident taps to show it. Your listing starts as unverified, and you can ask for verification later.
        </div>
      </div>
    </>
  );
}
