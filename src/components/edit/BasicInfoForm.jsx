import { CATEGORIES } from '@/data/categories';
import { slugify } from '@/lib/slugify';
import { inputCls } from '@/components/ui/Field';
import RichTextEditor from '@/components/ui/RichTextEditor';
import Select from '@/components/ui/Select';

const CATEGORY_OPTIONS = CATEGORIES.map((c) => ({ value: c.id, label: c.name, icon: c.micon }));

export default function BasicInfoForm({ v, patch }) {
  return (
    <section className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-sm" id="basic">
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">Basic info</h2>
      <div className="flex flex-col gap-4">
        <label className="block font-label-md text-label-md font-semibold text-on-surface">
          Business name
          <input value={v.name} onChange={(e) => patch({ name: e.target.value })} maxLength={120} className={`${inputCls} border-outline-variant`} />
        </label>
        <label className="block font-label-md text-label-md font-semibold text-on-surface">
          Your page link
          <div className="flex items-center mt-2 min-h-[48px] rounded-2xl border border-outline-variant overflow-hidden focus-within:border-primary">
            <span className="pl-4 pr-1 font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap select-none">societyspot.app/business/</span>
            <input
              value={v.slug || ''}
              onChange={(e) => patch({ slug: slugify(e.target.value) })}
              placeholder={slugify(v.name) || 'your-business-name'}
              maxLength={60}
              className="flex-1 min-w-0 pr-4 py-2.5 bg-transparent font-body-md text-body-md text-on-surface focus:outline-none"
            />
          </div>
          <span className="block mt-1.5 font-body-sm text-body-sm text-on-surface-variant font-normal">Changing this changes the web address residents use to reach your page.</span>
        </label>
        <div className="block font-label-md text-label-md font-semibold text-on-surface">
          Description
          <RichTextEditor value={v.desc} onChange={(desc) => patch({ desc })} rows={3} maxLength={500} className="mt-2" />
        </div>
        <div className="block font-label-md text-label-md font-semibold text-on-surface">
          Category
          <Select
            ariaLabel="Category"
            value={v.cat}
            onChange={(cat) => patch({ cat })}
            options={CATEGORY_OPTIONS}
            triggerClassName="w-full mt-2 min-h-[48px] rounded-2xl border border-outline-variant px-4 font-body-md text-body-md focus:border-primary focus:outline-none flex items-center justify-between gap-2 text-left"
          />
        </div>
        <label className="block font-label-md text-label-md font-semibold text-on-surface">
          Tower, block or area
          <input value={v.area} onChange={(e) => patch({ area: e.target.value })} maxLength={120} className={`${inputCls} border-outline-variant`} />
        </label>
      </div>
    </section>
  );
}
