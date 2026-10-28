'use client';

import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { SOCIETIES, socOf } from '@/data/societies';
import SiteShell from '@/components/layout/SiteShell';
import SocietyCard from '@/components/societies/SocietyCard';
import Icon from '@/components/ui/Icon';

export default function SocietiesPage() {
  const [q, setQ] = useState('');
  const [msg, setMsg] = useState('Location blocked? No problem, searching by name works the same way.');
  const recent = useSelector((state) => state.society.recent);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return SOCIETIES;
    return SOCIETIES.filter((s) => (s.name + ' ' + s.place).toLowerCase().includes(needle));
  }, [q]);

  function onSubmit(e) {
    e.preventDefault();
  }
  function onLocate() {
    if (!navigator.geolocation) {
      setMsg('Location is not available here. Search by name instead.');
      return;
    }
    setMsg('Checking your approximate location...');
    navigator.geolocation.getCurrentPosition(
      () => setMsg('Location found. Choose the society closest to you below.'),
      () => setMsg('Location blocked. Use the search box to find your society by name.'),
      { timeout: 8000 }
    );
  }

  return (
    <SiteShell active="societies">
      <section className="bg-surface-container-low/40 border-b border-outline-variant/30 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-3">Find your society</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-8">
            Pick a society to see the businesses run by your neighbors. You can change it any time from the top of any page.
          </p>
          <form onSubmit={onSubmit} role="search" className="w-full max-w-3xl bg-surface-container-lowest p-2 rounded-2xl md:rounded-full border border-outline-variant/50 shadow-lg flex flex-col md:flex-row items-center gap-2 mb-4 focus-within:ring-2 focus-within:ring-primary/30">
            <label className="flex items-center gap-2 px-3 py-2 flex-1 w-full">
              <Icon name="search" className="text-outline" />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by city, locality or society name"
                aria-label="Search societies"
                className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none border-none py-1"
              />
            </label>
            <button type="button" onClick={onLocate} className="w-full md:w-auto px-5 py-3 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg text-label-lg font-semibold transition-colors flex items-center justify-center gap-2">
              <Icon name="locate" className="text-sm text-primary" filled />
              <span>Use my location</span>
            </button>
            <button type="submit" className="w-full md:w-auto px-7 py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-semibold hover:bg-primary-container shadow-md transition-all active:scale-95">Search</button>
          </form>
          <p className="font-body-sm text-body-sm text-on-surface-variant">{msg}</p>
        </div>
      </section>

      {recent.length > 0 && (
        <section className="py-10 md:py-14 bg-surface">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-4">Recently viewed</h2>
            <div className="flex flex-wrap gap-2">
              {recent.map((id) => {
                const s = socOf(id);
                return (
                  <span key={id} className="inline-flex items-center min-h-[44px] px-4 rounded-full bg-surface-container-lowest border border-outline-variant/40 font-label-md text-label-md font-medium text-on-surface">
                    {s.name.replace(' Habitat', '')}, {s.place.split(',')[0]}
                  </span>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="py-10 md:py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Popular societies</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">Sample listings for this mockup</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {list.map((s) => <SocietyCard key={s.id} society={s} />)}
          </div>
          {list.length === 0 && (
            <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-3xl p-10 text-center">
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">No society found</h3>
              <p className="text-on-surface-variant font-body-md text-body-md">Try a different name or locality.</p>
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
