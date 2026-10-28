import Icon from '@/components/ui/Icon';

const inputCls = 'min-h-[44px] rounded-2xl border border-outline-variant px-3.5 font-body-md text-body-md focus:border-primary focus:outline-none';

export default function ItemsEditor({ items, onChange }) {
  function updateItem(i, key, value) {
    onChange(items.map((row, idx) => (idx === i ? (key === 0 ? [value, row[1], row[2]] : key === 1 ? [row[0], value, row[2]] : [row[0], row[1], value]) : row)));
  }
  function removeItem(i) {
    onChange(items.filter((_, idx) => idx !== i));
  }
  function addItem() {
    onChange([...items, ['', '', '']]);
  }

  return (
    <section className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-sm" id="menu">
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">Products, services and prices</h2>
      <div>
        {items.map((r, i) => (
          <div key={i} className="flex flex-wrap gap-2.5 items-center mb-2.5">
            <input aria-label="Item name" value={r[0]} onChange={(e) => updateItem(i, 0, e.target.value)} className={`flex-[2_1_180px] ${inputCls}`} />
            <input aria-label="Short note" value={r[1]} onChange={(e) => updateItem(i, 1, e.target.value)} className={`flex-[2_1_160px] ${inputCls}`} />
            <input aria-label="Price" value={r[2]} onChange={(e) => updateItem(i, 2, e.target.value)} className={`flex-[0_1_110px] ${inputCls}`} />
            <button type="button" onClick={() => removeItem(i)} aria-label="Remove item" className="h-11 px-4 rounded-full border border-outline-variant text-on-surface-variant hover:border-error hover:text-error flex items-center justify-center flex-none">
              <Icon name="close" className="text-lg" />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addItem} className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary-fixed text-primary font-label-md text-label-md font-bold hover:bg-primary-fixed-dim transition-colors mt-1">
        Add item
      </button>
    </section>
  );
}
