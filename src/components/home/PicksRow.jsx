import Link from 'next/link';
import { BUSINESSES } from '@/data/businesses';
import { catOf } from '@/data/categories';
import { bizImg, blobOf } from '@/lib/images';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import SkeletonImage from '@/components/ui/SkeletonImage';

/* Rank 1-3 get a medal-coloured badge so the ranking reads at a glance -- same treatment as the
   directory page's top-picks panel, kept visually consistent between the two. */
const RANK_BADGE = {
  1: 'bg-secondary text-on-secondary',
  2: 'bg-outline text-white',
  3: 'bg-on-secondary-fixed-variant text-white'
};

export default function PicksRow() {
  const picks = BUSINESSES.slice(0, 10);
  return (
    <section className="py-8 md:py-16 bg-surface-container-low/60 border-y border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4 md:mb-8">
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
        </Reveal>
        <div className="flex gap-3 md:gap-5 overflow-x-auto pb-2 no-scrollbar">
          {picks.map((b, i) => {
            const c = catOf(b.cat);
            const rank = i + 1;
            return (
              <Reveal key={b.id} delay={(i % 6) * 60} distance={14} className="flex-none">
                <Link
                  href={`/business/${b.id}`}
                  className="group block w-36 md:w-48 rounded-2xl md:rounded-3xl p-2.5 md:p-3.5 border border-outline-variant/40 bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col gap-2.5 md:gap-3"
                >
                  <div className="relative">
                    <div className={`w-full aspect-square ${blobOf(b.id)} overflow-hidden bg-surface-container-high border-2 border-surface-container-lowest`}>
                      <SkeletonImage className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={bizImg(b)} alt="" loading="lazy" />
                    </div>
                    <span
                      className={`absolute -top-2 -left-2 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center font-label-sm text-label-sm font-bold shadow-sm ${
                        RANK_BADGE[rank] || 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant'
                      }`}
                    >
                      {rank}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <strong className="block font-headline-sm text-label-lg md:text-headline-sm text-on-surface leading-tight line-clamp-2">{b.name}</strong>
                    <small className="block truncate text-on-surface-variant font-body-sm text-body-sm">{c.name}</small>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
