'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BUSINESSES } from '@/data/businesses';
import { catOf } from '@/data/categories';
import { bizImg, blobOf } from '@/lib/images';
import Chip from '@/components/ui/Chip';
import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';

const TABS = [
  { id: 'all', label: 'All', micon: 'grid_view' },
  { id: 'food', label: 'Food', micon: 'restaurant' },
  { id: 'edu', label: 'Education', micon: 'school' },
  { id: 'beauty', label: 'Beauty', micon: 'content_cut' },
  { id: 'grocery', label: 'Groceries', micon: 'shopping_basket' }
];

/* Rank 1-3 get a medal-coloured badge + a faint gold card outline so the ranking reads at a
   glance instead of needing to notice a small "No. X" label -- that's what made this section
   feel like an undifferentiated list before. */
const RANK_BADGE = {
  1: 'bg-secondary text-on-secondary',
  2: 'bg-outline text-white',
  3: 'bg-on-secondary-fixed-variant text-white'
};

export default function TopPicksPanel() {
  const [pickCat, setPickCat] = useState('all');
  const list = BUSINESSES.filter((b) => pickCat === 'all' || b.cat === pickCat);

  return (
    <section className="py-6 md:py-12 bg-surface" id="picks">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-surface-container-lowest rounded-2xl md:rounded-[2.5rem] p-4 md:p-10 border border-outline-variant/30 shadow-sm">
          <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-2">
            <div>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold">
                <Icon name="workspace_premium" className="text-xs" filled />
                <span>October 2026</span>
              </span>
              <h2 className="font-headline-lg text-headline-md md:text-headline-lg text-on-surface tracking-tight mt-2">Top picks of the month</h2>
              <p className="font-body-sm md:font-body-md text-body-sm md:text-body-md text-on-surface-variant mt-1 max-w-xl">
                20 businesses ranked by profile views, saves and contact attempts over the last 30 days. Ratings are never invented.
              </p>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 overflow-x-auto no-scrollbar pb-1">
              {TABS.map((t) => (
                <Chip key={t.id} label={t.label} iconName={t.micon} pressed={pickCat === t.id} onClick={() => setPickCat(t.id)} />
              ))}
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4 mt-4 md:mt-8">
            {list.map((b, i) => {
              const c = catOf(b.cat);
              return (
                <Reveal key={b.id} delay={(i % 8) * 45} distance={12}>
                  <Link
                    href={`/business/${b.id}`}
                    className="group relative flex items-center gap-3 rounded-2xl p-2.5 md:p-3 border border-outline-variant/30 bg-surface-container transition-all hover:shadow-md hover:-translate-y-0.5"
                  >
                    <div className="relative flex-none">
                      <div className={`w-14 h-14 md:w-16 md:h-16 ${blobOf(b.id)} overflow-hidden bg-surface-container-high border-2 border-surface-container-lowest`}>
                        <img className="w-full h-full object-cover" src={bizImg(b)} alt="" loading="lazy" />
                      </div>
                      <span
                        className={`absolute -top-2 -left-2 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center font-label-sm text-label-sm font-bold shadow-sm ${
                          RANK_BADGE[b.rank] || 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant'
                        }`}
                      >
                        {b.rank}
                      </span>
                    </div>
                    <span className="min-w-0 flex-1">
                      <strong className="block font-headline-sm text-label-lg text-on-surface leading-tight truncate group-hover:text-primary transition-colors">{b.name}</strong>
                      <span className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm mt-0.5 min-w-0">
                        <Icon name={c.micon} className="text-xs flex-none" />
                        <span className="truncate">{c.name}</span>
                      </span>
                    </span>
                    <Icon name="chevron_right" className="hidden sm:block text-outline flex-none opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </Reveal>
              );
            })}
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-4 md:mt-6">Sample picks for this mockup. Real picks appear once enough activity is recorded.</p>
        </div>
      </div>
    </section>
  );
}
