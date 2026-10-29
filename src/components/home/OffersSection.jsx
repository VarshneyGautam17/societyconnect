import Link from 'next/link';
import { BUSINESSES, OFFERS_VALID } from '@/data/businesses';
import { catOf } from '@/data/categories';
import { socShort } from '@/data/societies';
import Icon from '@/components/ui/Icon';

const THEMES = [
  { from: 'from-secondary-fixed', to: 'to-surface-container-lowest', border: 'border-secondary-fixed', blob: 'bg-secondary-fixed/50', chip: 'bg-secondary-fixed text-on-secondary-fixed-variant', text: 'text-on-secondary-fixed-variant', sub: 'text-on-secondary-fixed-variant/75', divider: 'border-secondary-fixed/70', btn: 'bg-secondary hover:bg-on-secondary-fixed-variant' },
  { from: 'from-primary-fixed', to: 'to-surface-container-lowest', border: 'border-primary-fixed', blob: 'bg-primary-fixed/50', chip: 'bg-primary-fixed text-on-primary-fixed-variant', text: 'text-on-primary-fixed-variant', sub: 'text-on-primary-fixed-variant/75', divider: 'border-primary-fixed/70', btn: 'bg-primary hover:bg-primary-container' },
  { from: 'from-tertiary-fixed', to: 'to-surface-container-lowest', border: 'border-tertiary-fixed', blob: 'bg-tertiary-fixed/50', chip: 'bg-tertiary-fixed text-on-tertiary-fixed-variant', text: 'text-on-tertiary-fixed-variant', sub: 'text-on-tertiary-fixed-variant/75', divider: 'border-tertiary-fixed/70', btn: 'bg-tertiary hover:bg-tertiary-container' }
];

export default function OffersSection() {
  const offers = BUSINESSES.filter((b) => b.offer).slice(0, 3);
  return (
    <section className="py-8 md:py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="mb-4 md:mb-8 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-secondary font-label-sm text-label-sm font-bold mb-2">
            <Icon name="local_activity" className="text-xs" />
            <span>Exclusive Resident Perks</span>
          </div>
          <h2 className="font-headline-lg text-headline-md md:text-headline-lg text-on-surface tracking-tight">Offers near you</h2>
          <p className="font-body-sm md:font-body-md text-body-sm md:text-body-md text-on-surface-variant mt-1.5 md:mt-2">
            Special neighbor-to-neighbor discounts, introductory sessions, and bundled packages active right now.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
          {offers.map((b, i) => {
            const t = THEMES[i % 3];
            const c = catOf(b.cat);
            return (
              <div key={b.id} className={`bg-gradient-to-br ${t.from} ${t.to} border ${t.border} rounded-2xl md:rounded-3xl p-4 md:p-6 relative overflow-hidden flex flex-col justify-between shadow-sm`}>
                <div className={`absolute -right-6 -bottom-6 w-28 h-28 ${t.blob} rounded-full blur-xl pointer-events-none`} />
                <div>
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <span className={`px-2.5 py-0.5 md:px-3 md:py-1 rounded-full ${t.chip} font-label-sm text-label-sm font-bold`}>{c.short}</span>
                    <span className={`font-label-sm text-label-sm font-semibold flex items-center gap-1 ${t.sub}`}>
                      <Icon name="clock" className="text-xs" />
                      <span>{OFFERS_VALID[i % 3]}</span>
                    </span>
                  </div>
                  <h3 className={`font-headline-md text-label-lg md:text-headline-md ${t.text} font-bold mb-1.5 md:mb-2`}>{b.offer}</h3>
                  <p className={`font-body-sm text-body-sm ${t.sub} mb-4 md:mb-6`}>{b.name} &middot; {b.area}, {socShort(b.society)}</p>
                </div>
                <div className={`pt-3 md:pt-4 border-t ${t.divider} flex items-center justify-between gap-3`}>
                  <span className="font-label-sm md:font-label-md text-label-sm md:text-label-md text-on-surface-variant">{c.name}</span>
                  <Link href={`/business/${b.id}`} className={`px-3.5 py-1.5 md:px-4 md:py-2 rounded-full ${t.btn} text-white font-label-sm md:font-label-md text-label-sm md:text-label-md font-bold transition-colors`}>View deal</Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
