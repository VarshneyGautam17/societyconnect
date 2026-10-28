import Link from 'next/link';
import { BUSINESSES } from '@/data/businesses';
import { catOf } from '@/data/categories';
import MonoTile from '@/components/ui/MonoTile';
import Icon from '@/components/ui/Icon';

export default function PicksRow() {
  const picks = BUSINESSES.slice(0, 10);
  return (
    <section className="py-16 md:py-24 bg-surface-container-low/60 border-y border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm font-bold mb-3">
              <Icon name="local_fire_department" className="text-xs" filled />
              <span>Trending in your society</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Top picks of the month</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">October 2026 &middot; ranked by profile views, saves and contact attempts</p>
          </div>
          <Link href="/directory#picks" className="inline-flex items-center gap-1.5 font-label-lg text-label-lg font-bold text-primary hover:text-primary-container transition-colors">
            <span>See all 20 picks</span>
            <Icon name="arrow_forward" className="text-sm" />
          </Link>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-2 no-scrollbar">
          {picks.map((b, i) => {
            const c = catOf(b.cat);
            return (
              <Link key={b.id} href={`/business/${b.id}`} className="flex-none w-48 bg-surface-container-lowest rounded-3xl p-4 border border-outline-variant/40 shadow-sm hover:shadow-md transition-all flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <MonoTile business={b} className="w-12 h-12 text-xl rounded-2xl" />
                  <span className="font-label-sm text-label-sm font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">No. {i + 1}</span>
                </div>
                <div>
                  <strong className="block font-headline-sm text-headline-sm text-on-surface leading-tight">{b.name}</strong>
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
