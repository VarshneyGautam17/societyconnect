import Link from 'next/link';
import { BUSINESSES } from '@/data/businesses';
import { catOf } from '@/data/categories';
import MonoTile from '@/components/ui/MonoTile';
import Icon from '@/components/ui/Icon';

export default function PicksRow() {
  const picks = BUSINESSES.slice(0, 10);
  return (
    <section className="py-8 md:py-16 bg-surface-container-low/60 border-y border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4 md:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm font-bold mb-2">
              <Icon name="local_fire_department" className="text-xs" filled />
              <span>Trending in your society</span>
            </div>
            <h2 className="font-headline-lg text-headline-md md:text-headline-lg text-on-surface tracking-tight">Top picks of the month</h2>
            <p className="font-body-sm md:font-body-md text-body-sm md:text-body-md text-on-surface-variant mt-1">October 2026 &middot; ranked by profile views, saves and contact attempts</p>
          </div>
          <Link href="/directory#picks" className="inline-flex items-center gap-1.5 font-label-md md:font-label-lg text-label-md md:text-label-lg font-bold text-primary hover:text-primary-container transition-colors">
            <span>See all 20 picks</span>
            <Icon name="arrow_forward" className="text-sm" />
          </Link>
        </div>
        <div className="flex gap-3 md:gap-5 overflow-x-auto pb-2 no-scrollbar">
          {picks.map((b, i) => {
            const c = catOf(b.cat);
            return (
              <Link key={b.id} href={`/business/${b.id}`} className="flex-none w-36 md:w-48 bg-surface-container-lowest rounded-2xl md:rounded-3xl p-3 md:p-4 border border-outline-variant/40 shadow-sm hover:shadow-md transition-all flex flex-col gap-2.5 md:gap-4">
                <div className="flex items-center justify-between">
                  <MonoTile business={b} className="w-9 h-9 md:w-12 md:h-12 text-base md:text-xl rounded-xl md:rounded-2xl" />
                  <span className="font-label-sm text-label-sm font-bold text-on-secondary-fixed-variant bg-secondary-fixed px-2 py-0.5 md:px-2.5 md:py-1 rounded-full">No. {i + 1}</span>
                </div>
                <div>
                  <strong className="block font-headline-sm text-label-lg md:text-headline-sm text-on-surface leading-tight">{b.name}</strong>
                  <small className="text-on-surface-variant font-body-sm text-body-sm">{c.name}</small>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
