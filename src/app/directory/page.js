'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { SOCIETIES } from '@/data/societies';
import { CATEGORIES, catOf } from '@/data/categories';
import { selectAllBusinesses, selectIsSaved } from '@/store/selectors';
import SiteShell from '@/components/layout/SiteShell';
import TopPicksPanel from '@/components/directory/TopPicksPanel';
import Chip from '@/components/ui/Chip';
import BizCard from '@/components/ui/BizCard';
import Icon from '@/components/ui/Icon';
import Select from '@/components/ui/Select';
import Reveal from '@/components/ui/Reveal';
import { useReveal } from '@/lib/useReveal';

const PAGE = 12;
const SOCIETY_OPTIONS = [{ value: 'all', label: 'All societies' }, ...SOCIETIES.map((s) => ({ value: s.id, label: s.name }))];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest', icon: 'schedule' },
  { value: 'az', label: 'A to Z', icon: 'sort_by_alpha' },
  { value: 'views', label: 'Most viewed', icon: 'trending_up' }
];

function DirectoryContent() {
  const params = useSearchParams();
  const allBusinesses = useSelector(selectAllBusinesses);
  const savedIds = useSelector((state) => state.saved.ids);

  const [cat, setCat] = useState(params.get('cat') || 'all');
  const [q, setQ] = useState(params.get('q') || '');
  const [soc, setSoc] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [offersOnly, setOffersOnly] = useState(false);
  const [savedOnly, setSavedOnly] = useState(params.get('saved') === '1');
  const [sort, setSort] = useState('newest');
  const [shown, setShown] = useState(PAGE);

  const list = useMemo(() => {
    let result = allBusinesses.filter((b) => {
      if (cat !== 'all' && b.cat !== cat) return false;
      if (soc !== 'all' && b.society !== soc) return false;
      if (verifiedOnly && !b.verified) return false;
      if (offersOnly && !b.offer) return false;
      if (savedOnly && !savedIds.includes(b.id)) return false;
      const needle = q.trim().toLowerCase();
      if (needle && !(b.name + ' ' + b.desc + ' ' + catOf(b.cat).name).toLowerCase().includes(needle)) return false;
      return true;
    });
    if (sort === 'az') result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'views') result = [...result].sort((a, b) => (a.rank || 99) - (b.rank || 99));
    return result;
  }, [allBusinesses, cat, soc, verifiedOnly, offersOnly, savedOnly, q, sort, savedIds]);

  const visible = list.slice(0, shown);
  const chips = [{ id: 'all', name: 'All' }, ...CATEGORIES];

  function clearFilters() {
    setCat('all'); setQ(''); setSoc('all'); setVerifiedOnly(false); setOffersOnly(false); setSavedOnly(false); setShown(PAGE);
  }

  const headingReveal = useReveal(0);
  const formReveal = useReveal(120);

  return (
    <SiteShell active="directory">
      <section className="relative overflow-hidden border-b border-outline-variant/30 py-6 md:py-12">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary-fixed/60 rounded-full blur-3xl pointer-events-none animate-blob-drift" />
        <div className="absolute top-1/2 -right-16 w-64 h-64 bg-secondary-fixed/50 rounded-full blur-3xl pointer-events-none animate-blob-drift-slow" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <h1 {...headingReveal} className="font-headline-lg text-headline-md md:text-headline-lg text-on-surface tracking-tight mb-3 md:mb-6">
            {savedOnly ? 'Saved businesses' : 'All local businesses'}
          </h1>
          <form
            {...formReveal}
            onSubmit={(e) => { e.preventDefault(); setShown(PAGE); }}
            role="search"
            className="w-full max-w-3xl glass-strong p-2 rounded-2xl md:rounded-full shadow-lg flex flex-col md:flex-row items-center gap-2 focus-within:ring-2 focus-within:ring-primary/30"
          >
            <label className="flex items-center gap-2 px-3 py-2 flex-1 w-full border-b md:border-b-0 md:border-r border-outline-variant/40">
              <Icon name="search" className="text-outline" />
              <input
                type="search"
                value={q}
                onChange={(e) => { setQ(e.target.value); setShown(PAGE); }}
                placeholder="Search by business, service or product"
                aria-label="Search businesses"
                className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none border-none py-1"
              />
            </label>
            <div className="flex items-center gap-2 px-3 py-2 w-full md:w-auto">
              <Icon name="location_city" className="text-primary" />
              <Select
                ariaLabel="Society"
                value={soc}
                onChange={(v) => { setSoc(v); setShown(PAGE); }}
                options={SOCIETY_OPTIONS}
                triggerClassName="inline-flex items-center gap-1.5 bg-transparent font-label-md text-label-md font-semibold text-on-surface focus:outline-none py-1 max-w-[150px] sm:max-w-[220px]"
              />
            </div>
            <button type="submit" className="w-full md:w-auto px-5 py-2.5 md:px-7 md:py-3 rounded-full bg-primary text-on-primary font-label-md md:font-label-lg text-label-md md:text-label-lg font-semibold hover:bg-primary-container shadow-md transition-all active:scale-95">Search</button>
          </form>
        </div>
      </section>

      <TopPicksPanel />

      <section className="py-4 md:py-6 bg-surface" id="categories">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <Reveal className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 no-scrollbar">
            {chips.map((c) => (
              <Chip key={c.id} label={c.name} pressed={cat === c.id} onClick={() => { setCat(c.id); setShown(PAGE); }} />
            ))}
          </Reveal>
          <Reveal delay={60} className="flex flex-wrap items-center gap-2 mb-3 md:mb-5">
            <label className="inline-flex items-center gap-1.5 min-h-[36px] md:min-h-[44px] px-3 md:px-4 rounded-full md:rounded-2xl border border-outline-variant/40 bg-surface-container-lowest font-label-sm md:font-label-md text-label-sm md:text-label-md font-medium text-on-surface">
              <input type="checkbox" checked={verifiedOnly} onChange={(e) => { setVerifiedOnly(e.target.checked); setShown(PAGE); }} className="w-3.5 h-3.5 md:w-4 md:h-4 accent-primary" />
              <span>Verified only</span>
            </label>
            <label className="inline-flex items-center gap-1.5 min-h-[36px] md:min-h-[44px] px-3 md:px-4 rounded-full md:rounded-2xl border border-outline-variant/40 bg-surface-container-lowest font-label-sm md:font-label-md text-label-sm md:text-label-md font-medium text-on-surface">
              <input type="checkbox" checked={offersOnly} onChange={(e) => { setOffersOnly(e.target.checked); setShown(PAGE); }} className="w-3.5 h-3.5 md:w-4 md:h-4 accent-primary" />
              <span>Has offers</span>
            </label>
            <label className="inline-flex items-center gap-1.5 min-h-[36px] md:min-h-[44px] px-3 md:px-4 rounded-full md:rounded-2xl border border-outline-variant/40 bg-surface-container-lowest font-label-sm md:font-label-md text-label-sm md:text-label-md font-medium text-on-surface">
              <input type="checkbox" checked={savedOnly} onChange={(e) => { setSavedOnly(e.target.checked); setShown(PAGE); }} className="w-3.5 h-3.5 md:w-4 md:h-4 accent-primary" />
              <span>Saved only</span>
            </label>
            <span className="flex-1" />
            <div className="flex items-center gap-1.5 font-label-sm md:font-label-md text-label-sm md:text-label-md text-on-surface-variant">
              <span>Sort</span>
              <Select
                ariaLabel="Sort"
                value={sort}
                onChange={setSort}
                options={SORT_OPTIONS}
                triggerClassName="inline-flex items-center gap-1.5 min-h-[36px] md:min-h-[44px] rounded-full md:rounded-2xl border border-outline-variant/40 bg-surface-container-lowest px-2.5 md:px-3 font-label-sm md:font-label-md text-label-sm md:text-label-md text-on-surface"
                align="right"
              />
            </div>
          </Reveal>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-3 md:mb-6">Showing {Math.min(shown, list.length)} of {list.length} businesses</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
            {visible.map((b, i) => (
              <Reveal key={b.id} delay={(i % 6) * 60}>
                <BizCard business={b} />
              </Reveal>
            ))}
          </div>
          {list.length === 0 && (
            <Reveal as="div" className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-2xl md:rounded-3xl p-6 md:p-10 text-center">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">No businesses match</h3>
              <p className="text-on-surface-variant font-body-md text-body-md mb-5">Try another category or clear a filter.</p>
              <button type="button" onClick={clearFilters} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-outline-variant hover:border-primary text-on-surface font-label-md md:font-label-lg text-label-md md:text-label-lg font-bold transition-colors">
                Clear filters
              </button>
            </Reveal>
          )}
          {list.length > shown && (
            <div className="mt-6 md:mt-12 flex justify-center">
              <button
                type="button"
                onClick={() => setShown((s) => s + PAGE)}
                className="inline-flex items-center gap-2 px-5 py-2.5 md:px-8 md:py-3.5 rounded-full bg-surface-container-lowest border border-outline-variant hover:border-primary text-on-surface font-label-md md:font-label-lg text-label-md md:text-label-lg font-bold shadow-sm hover:shadow transition-all group"
              >
                <span>Load more businesses</span>
                <Icon name="sync" className="text-sm group-hover:rotate-180 transition-transform duration-300" />
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="py-8 md:py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <Reveal className="bg-primary rounded-2xl md:rounded-3xl p-5 md:p-10 flex flex-wrap items-center justify-between gap-4 md:gap-6">
            <div>
              <h2 className="font-headline-md text-label-lg md:text-headline-md text-white mb-1">Run a business in your society?</h2>
              <p className="font-body-sm md:font-body-md text-body-sm md:text-body-md text-primary-fixed max-w-lg">List it free for the first 1 to 2 months and get found when neighbors search.</p>
            </div>
            <Link href="/onboarding" className="inline-flex items-center gap-2 px-5 py-2.5 md:px-7 md:py-3.5 rounded-full bg-white text-primary font-label-md md:font-label-lg text-label-md md:text-label-lg font-bold hover:bg-surface-container-high shadow-lg active:scale-95 transition-all">
              List your business
            </Link>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}

export default function DirectoryPage() {
  return (
    <Suspense fallback={null}>
      <DirectoryContent />
    </Suspense>
  );
}
