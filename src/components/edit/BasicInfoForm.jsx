import { CATEGORIES } from '@/data/categories';
import { inputCls } from '@/components/ui/Field';

export default function BasicInfoForm({ v, patch }) {
  return (
    <section className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-sm" id="basic">
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">Basic info</h2>
      <div className="flex flex-col gap-4">
        <label className="block font-label-md text-label-md font-semibold text-on-surface">
          Business name
          <input value={v.name} onChange={(e) => patch({ name: e.target.value })} className={`${inputCls} border-outline-variant`} />
        </label>
        <label className="block font-label-md text-label-md font-semibold text-on-surface">
          Description
          <textarea value={v.desc} onChange={(e) => patch({ desc: e.target.value })} rows={3} className={`${inputCls} border-outline-variant`} />
        </label>
        <label className="block font-label-md text-label-md font-semibold text-on-surface">
          Category
          <select value={v.cat} onChange={(e) => patch({ cat: e.target.value })} className={`${inputCls} border-outline-variant`}>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </label>
        <label className="block font-label-md text-label-md font-semibold text-on-surface">
          Tower, block or area
          <input value={v.area} onChange={(e) => patch({ area: e.target.value })} className={`${inputCls} border-outline-variant`} />
        </label>
      </div>
    </section>
  );
}
