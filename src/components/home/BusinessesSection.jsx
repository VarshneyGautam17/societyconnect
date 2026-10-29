import Link from 'next/link';
import { CATEGORIES } from '@/data/categories';
import { socShort } from '@/data/societies';
import Chip from '@/components/ui/Chip';
import BizCard from '@/components/ui/BizCard';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';

const ALL_CHIP = { id: 'all', short: 'All', micon: 'grid_view' };

export default function BusinessesSection({ societyId, list, cat, onCatChange, shown, onLoadMore }) {
  const chips = [ALL_CHIP, ...CATEGORIES.slice(0, 7)];
  const visible = list.slice(0, shown);

  return (
    <section className="py-8 md:py-16 bg-surface" id="businesses">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4 md:mb-8">
          <div>
            <div className="flex items-center gap-2 text-primary font-label-sm md:font-label-md text-label-sm md:text-label-md font-bold uppercase tracking-wider mb-1.5 md:mb-2">
              <Icon name="near_me" className="text-sm" />
              <span>Hyperlocal Network</span>
            </div>
            <h2 className="font-headline-lg text-headline-md md:text-headline-lg text-on-surface tracking-tight">Businesses in {socShort(societyId)}</h2>
            <p className="font-body-sm md:font-body-md text-body-sm md:text-body-md text-on-surface-variant mt-1">
              Showing {Math.min(shown, list.length)} of {list.length} sample listings
            </p>
          </div>
          <Link href="/directory" className="inline-flex items-center gap-1.5 font-label-md md:font-label-lg text-label-md md:text-label-lg font-bold text-primary hover:text-primary-container transition-colors group">
            <span>View all businesses</span>
            <Icon name="arrow_forward" className="text-sm group-hover:translate-x-1 transition-transform" />
          </Link>
        </Reveal>

        <Reveal delay={80} className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 no-scrollbar mb-4 md:mb-8">
          {chips.map((c) => (
            <Chip key={c.id} label={c.short} iconName={c.micon} pressed={cat === c.id} onClick={() => onCatChange(c.id)} />
          ))}
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
          {visible.map((b, i) => (
            <Reveal key={b.id} delay={(i % 6) * 60}>
              <BizCard business={b} />
            </Reveal>
          ))}
        </div>

        {list.length === 0 && (
          <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-2xl md:rounded-3xl p-6 md:p-10 text-center">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">No businesses listed here yet</h3>
            <p className="text-on-surface-variant font-body-md text-body-md mb-5">Know a vendor in your society? Invite them to list their business.</p>
            <Link href="/onboarding" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-outline-variant hover:border-primary text-on-surface font-label-md md:font-label-lg text-label-md md:text-label-lg font-bold transition-colors">
              Invite a vendor
            </Link>
          </div>
        )}

        {list.length > shown && (
          <div className="mt-6 md:mt-12 flex justify-center">
            <button
              type="button"
              onClick={onLoadMore}
              className="inline-flex items-center gap-2 px-5 py-2.5 md:px-8 md:py-3.5 rounded-full bg-surface-container-lowest border border-outline-variant hover:border-primary text-on-surface font-label-md md:font-label-lg text-label-md md:text-label-lg font-bold shadow-sm hover:shadow transition-all group"
            >
              <span>Load more businesses</span>
              <Icon name="sync" className="text-sm group-hover:rotate-180 transition-transform duration-300" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
