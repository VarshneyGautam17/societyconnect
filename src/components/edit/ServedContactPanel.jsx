import { SOCIETIES } from '@/data/societies';
import { inputCls } from '@/components/ui/Field';
import { useToast } from '@/components/ui/Toast';

export default function ServedContactPanel({ v, patch }) {
  const toast = useToast();

  function toggleSociety(id) {
    const i = v.served.indexOf(id);
    if (i >= 0) {
      if (v.served.length > 1) patch({ served: v.served.filter((x) => x !== id) });
      else toast('Keep at least one society selected.');
    } else {
      patch({ served: [...v.served, id] });
    }
  }

  return (
    <section className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-sm" id="contact">
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">Contact and societies served</h2>
      <div className="flex flex-wrap gap-4">
        <label className="flex-1 min-w-[220px] block font-label-md text-label-md font-semibold text-on-surface">
          WhatsApp
          <input value={v.whatsapp} onChange={(e) => patch({ whatsapp: e.target.value })} maxLength={20} className={`${inputCls} border-outline-variant`} />
        </label>
        <label className="flex-1 min-w-[220px] block font-label-md text-label-md font-semibold text-on-surface">
          Phone
          <input value={v.phone} onChange={(e) => patch({ phone: e.target.value })} maxLength={20} className={`${inputCls} border-outline-variant`} />
        </label>
      </div>
      <label className="flex items-center gap-2.5 font-body-md text-body-md text-on-surface mt-4">
        <input type="checkbox" checked={v.hidePhone} onChange={(e) => patch({ hidePhone: e.target.checked })} className="w-5 h-5 accent-primary" />
        Hide my number until a resident taps to show it
      </label>
      <div className="font-label-md text-label-md font-semibold text-on-surface mt-5 mb-2.5">Societies you serve</div>
      <div className="flex flex-wrap gap-2">
        {SOCIETIES.map((s) => {
          const on = v.served.includes(s.id);
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
    </section>
  );
}
