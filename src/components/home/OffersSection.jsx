import Link from 'next/link';
import { BUSINESSES, OFFERS_VALID } from '@/data/businesses';
import { catOf } from '@/data/categories';
import { socShort } from '@/data/societies';
import Icon from '@/components/ui/Icon';

const THEMES = [
  { from: 'from-amber-50', to: 'to-orange-50/70', border: 'border-amber-200/60', blob: 'bg-amber-200/40', chip: 'bg-amber-100 text-amber-900', text: 'text-amber-950', sub: 'text-amber-900/80', divider: 'border-amber-200/50', btn: 'bg-amber-900 hover:bg-amber-950' },
  { from: 'from-indigo-50', to: 'to-purple-50/70', border: 'border-indigo-200/60', blob: 'bg-indigo-200/40', chip: 'bg-indigo-100 text-indigo-900', text: 'text-indigo-950', sub: 'text-indigo-900/80', divider: 'border-indigo-200/50', btn: 'bg-primary hover:bg-primary-container' },
  { from: 'from-emerald-50', to: 'to-teal-50/70', border: 'border-emerald-200/60', blob: 'bg-emerald-200/40', chip: 'bg-emerald-100 text-emerald-900', text: 'text-emerald-950', sub: 'text-emerald-900/80', divider: 'border-emerald-200/50', btn: 'bg-emerald-800 hover:bg-emerald-900' }
];

export default function OffersSection() {
  const offers = BUSINESSES.filter((b) => b.offer).slice(0, 3);
  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-secondary font-label-sm text-label-sm font-bold mb-3">
            <Icon name="local_activity" className="text-xs" />
            <span>Exclusive Resident Perks</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Offers near you</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            Special neighbor-to-neighbor discounts, introductory sessions, and bundled packages active right now.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((b, i) => {
            const t = THEMES[i % 3];
            const c = catOf(b.cat);
            return (
              <div key={b.id} className={`bg-gradient-to-br ${t.from} ${t.to} border ${t.border} rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-sm`}>
                <div className={`absolute -right-6 -bottom-6 w-28 h-28 ${t.blob} rounded-full blur-xl pointer-events-none`} />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full ${t.chip} font-label-sm text-label-sm font-bold`}>{c.short}</span>
                    <span className={`font-label-sm text-label-sm font-semibold flex items-center gap-1 ${t.sub}`}>
                      <Icon name="clock" className="text-xs" />
                      <span>{OFFERS_VALID[i % 3]}</span>
                    </span>
                  </div>
                  <h3 className={`font-headline-md text-headline-md ${t.text} font-bold mb-2`}>{b.offer}</h3>
                  <p className={`font-body-sm text-body-sm ${t.sub} mb-6`}>{b.name} &middot; {b.area}, {socShort(b.society)}</p>
                </div>
                <div className={`pt-4 border-t ${t.divider} flex items-center justify-between gap-3`}>
                  <span className="font-label-md text-label-md text-on-surface-variant">{c.name}</span>
                  <Link href={`/business/${b.id}`} className={`px-4 py-2 rounded-full ${t.btn} text-white font-label-md text-label-md font-bold transition-colors`}>View deal</Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
