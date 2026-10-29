import Field, { inputCls } from '@/components/ui/Field';
import Icon from '@/components/ui/Icon';
import PhotoUploader from '@/components/business/PhotoUploader';

const MAX_ITEMS = 20;

export default function StepOfferings({ draft, patch, errors }) {
  function updateItem(i, key, value) {
    const items = draft.items.map((row, idx) => (idx === i ? (key === 0 ? [value, row[1], row[2]] : [row[0], row[1], value]) : row));
    patch({ items });
  }
  function removeItem(i) {
    const items = draft.items.filter((_, idx) => idx !== i);
    patch({ items: items.length ? items : [['', '', '']] });
  }
  function addItem() {
    if (draft.items.length >= MAX_ITEMS) return;
    patch({ items: [...draft.items, ['', '', '']] });
  }

  return (
    <>
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-5">Photos and what you offer</h2>
      <div className="flex flex-col gap-7">
        <PhotoUploader v={draft} patch={patch} />

        <div className="flex flex-col gap-5">
          <div>
            {draft.items.map((r, i) => (
              <div key={i} className="flex flex-wrap gap-2.5 items-center mb-2.5">
                <input
                  aria-label="Item name"
                  value={r[0]}
                  onChange={(e) => updateItem(i, 0, e.target.value)}
                  placeholder="Item or service"
                  maxLength={120}
                  className="flex-[2_1_180px] min-h-[44px] rounded-2xl border border-outline-variant px-3.5 font-body-md text-body-md"
                />
                <input
                  aria-label="Price"
                  value={r[2]}
                  onChange={(e) => updateItem(i, 2, e.target.value)}
                  placeholder="Price"
                  maxLength={40}
                  className="flex-[0_1_120px] min-h-[44px] rounded-2xl border border-outline-variant px-3.5 font-body-md text-body-md"
                />
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  aria-label="Remove item"
                  className="h-11 px-4 rounded-full border border-outline-variant text-on-surface-variant hover:border-error hover:text-error flex items-center justify-center flex-none"
                >
                  <Icon name="close" className="text-lg" />
                </button>
              </div>
            ))}
          </div>
          <div>
            <button
              type="button"
              onClick={addItem}
              disabled={draft.items.length >= MAX_ITEMS}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary-fixed text-primary font-label-md text-label-md font-bold hover:bg-primary-fixed-dim transition-colors disabled:opacity-50"
            >
              Add item
            </button>
          </div>
          {errors.items && <span className="block -mt-3 font-body-sm text-body-sm text-error">{errors.items}</span>}

          <Field label="Offer (optional)">
            <input
              value={draft.offer}
              onChange={(e) => patch({ offer: e.target.value })}
              placeholder="e.g. 10% off your first order"
              maxLength={200}
              className={`${inputCls} border-outline-variant`}
            />
          </Field>
          <div className="bg-primary-fixed text-primary rounded-2xl px-4 py-3.5 font-body-sm text-body-sm leading-relaxed">
            Prices are optional.
          </div>
        </div>
      </div>
    </>
  );
}
