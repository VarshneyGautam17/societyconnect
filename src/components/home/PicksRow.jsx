import Link from 'next/link';
import { catOf } from '@/data/categories';
import { bizImg, blobOf } from '@/lib/images';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';
import SkeletonImage from '@/components/ui/SkeletonImage';

/** The newest listings, as a scroll strip. Hidden until there's something to show -- no
 *  rankings or "trending" claims, since those would need real view data to back them. */
export default function PicksRow({ businesses }) {
  const picks = businesses.slice(0, 10);
  if (!picks.length) return null;
  return (
    <section className="py-8 md:py-16 bg-surface-container-low/60 border-y border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-4 md:mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed text-primary font-label-sm text-label-sm font-bold mb-2">
              <Icon name="new_releases" className="text-xs" filled />
              <span>Just joined</span>
            </div>
            <h2 className="font-headline-lg text-headline-md md:text-headline-lg text-on-surface tracking-tight">New on SocietySpot</h2>
            <p className="font-body-sm md:font-body-md text-body-sm md:text-body-md text-on-surface-variant mt-1">The latest businesses run by your neighbours</p>
          </div>
          <Link href="/directory" className="inline-flex items-center gap-1.5 font-label-md md:font-label-lg text-label-md md:text-label-lg font-bold text-primary hover:text-primary-container transition-colors">
            <span>See all businesses</span>
            <Icon name="arrow_forward" className="text-sm" />
          </Link>
        </Reveal>
        <div className="flex gap-3 md:gap-5 overflow-x-auto pb-2 no-scrollbar">
          {picks.map((b, i) => {
            const c = catOf(b.cat);
            return (
              <Reveal key={b.id} delay={(i % 6) * 60} distance={14} className="flex-none">
                <Link
                  href={`/business/${b.id}`}
                  className="group block w-36 md:w-48 rounded-2xl md:rounded-3xl p-2.5 md:p-3.5 border border-outline-variant/40 bg-surface-container-lowest shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col gap-2.5 md:gap-3"
                >
                  <div className={`w-full aspect-square ${blobOf(b.id)} overflow-hidden bg-surface-container-high border-2 border-surface-container-lowest`}>
                    <SkeletonImage className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={bizImg(b)} alt="" loading="lazy" />
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
