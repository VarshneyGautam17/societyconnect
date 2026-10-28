'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BUSINESSES } from '@/data/businesses';
import { catOf } from '@/data/categories';
import MonoTile from '@/components/ui/MonoTile';

const TABS = [['all', 'All'], ['food', 'Food'], ['edu', 'Education'], ['beauty', 'Beauty'], ['grocery', 'Groceries']];

export default function TopPicksPanel() {
  const [pickCat, setPickCat] = useState('all');
  const list = BUSINESSES.filter((b) => pickCat === 'all' || b.cat === pickCat);

  return (
    <section className="py-12 md:py-16 bg-surface" id="picks">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-surface-container-lowest rounded-3xl md:rounded-[2.5rem] p-6 md:p-10 border border-outline-variant/30 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-label-sm text-label-sm font-bold">October 2026</span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-3">Top picks of the month</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-xl">
                20 businesses ranked by profile views, saves and contact attempts over the last 30 days. Ratings are never invented.
              </p>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              {TABS.map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPickCat(id)}
                  aria-pressed={pickCat === id}
                  className={
                    'flex-none min-h-[40px] px-4 rounded-full font-label-md text-label-md font-semibold whitespace-nowrap transition-colors ' +
                    (pickCat === id ? 'bg-primary text-on-primary' : 'bg-surface-container border border-outline-variant/40 text-on-surface')
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {list.map((b) => (
              <Link key={b.id} href={`/business/${b.id}`} className="bg-surface-container rounded-2xl p-3.5 flex items-center gap-3 hover:shadow-md transition-shadow">
                <MonoTile business={b} className="w-11 h-11 text-lg rounded-xl" />
                <span className="min-w-0 flex-1">
                  <span className="block font-label-sm text-label-sm font-bold text-amber-700">No. {b.rank}</span>
                  <strong className="block font-label-md text-label-md text-on-surface leading-tight truncate">{b.name}</strong>
                  <small className="text-on-surface-variant font-body-sm text-body-sm">{catOf(b.cat).name}</small>
                </span>
              </Link>
            ))}
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-6">Sample picks for this mockup. Real picks appear once enough activity is recorded.</p>
        </div>
      </div>
    </section>
  );
}
