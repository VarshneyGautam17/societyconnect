'use client';

import { SOCIETIES } from '@/data/societies';
import Icon from '@/components/ui/Icon';
import CountUp from '@/components/ui/CountUp';
import Select from '@/components/ui/Select';
import { useReveal } from '@/lib/useReveal';
import SkeletonImage from '@/components/ui/SkeletonImage';

const SOCIETY_OPTIONS = SOCIETIES.map((s) => ({ value: s.id, label: `${s.name}, ${s.place.split(',')[0]}` }));

export default function Hero({ societyId, onSocietyChange, query, onQueryChange, onSubmit, locateMsg, onLocate, heroSociety, heroCount }) {
  const badgeReveal = useReveal(0);
  const headlineReveal = useReveal(90);
  const subheadReveal = useReveal(160);
  const formReveal = useReveal(230);
  const locateReveal = useReveal(300);
  const trustReveal = useReveal(360);
  const visualReveal = useReveal(200, 24);

  return (
    <section className="relative overflow-hidden pt-5 pb-6 md:pt-14 md:pb-24 border-b border-outline-variant/30">
      {/* Soft colour behind the fold so the glass search bar and badge below have something to
          actually blur -- without this a glass surface over flat ivory page background looks the
          same as a plain translucent one. Slow drift keeps the background feeling alive. */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-primary-fixed/60 rounded-full blur-3xl pointer-events-none animate-blob-drift" />
      <div className="absolute top-1/3 -left-10 w-64 h-64 bg-secondary-fixed/50 rounded-full blur-3xl pointer-events-none animate-blob-drift-slow" />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            <div {...badgeReveal} className="hidden xs:inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass shadow-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
              <span className="font-label-md text-label-md font-semibold text-on-surface">Showing businesses in your society</span>
              <Icon name="verified_user" className="text-primary text-base" filled />
            </div>
            <h1 {...headlineReveal} className="font-display text-headline-lg-mobile md:text-display text-on-surface tracking-tight leading-tight mb-2 md:mb-5">
              Discover trusted <span className="text-primary italic">local businesses</span> in your society
            </h1>
            <p {...subheadReveal} className="hidden xs:block font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-8 leading-relaxed">
              Find the services, products, and offers you need from businesses around your community. Shop local, save time, and support your neighbors.
            </p>
            <form
              {...formReveal}
              onSubmit={onSubmit}
              role="search"
              className="relative z-10 w-full max-w-2xl glass-strong p-2 rounded-2xl md:rounded-full shadow-lg flex flex-col md:flex-row items-center gap-2 mb-4 focus-within:ring-2 focus-within:ring-primary/30"
            >
              <div className="flex items-center gap-2 px-3 py-2 w-full md:w-auto border-b md:border-b-0 md:border-r border-outline-variant/40">
                <Icon name="location_city" className="text-primary" />
                <Select
                  ariaLabel="Society"
                  value={societyId}
                  onChange={onSocietyChange}
                  options={SOCIETY_OPTIONS}
                  triggerClassName="inline-flex items-center gap-1.5 bg-transparent font-label-md text-label-md font-semibold text-on-surface focus:outline-none py-1 max-w-[150px] sm:max-w-[220px]"
                />
              </div>
              <label className="flex items-center gap-2 px-3 py-2 flex-1 w-full">
                <Icon name="search" className="text-outline" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  placeholder="Tiffin, tuition, salon, tailor, bakes..."
                  aria-label="Search businesses"
                  className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none border-none py-1"
                />
              </label>
              <button type="submit" className="w-full md:w-auto px-5 py-2.5 md:px-7 md:py-3 rounded-full bg-primary text-on-primary font-label-md md:font-label-lg text-label-md md:text-label-lg font-semibold hover:bg-primary-container shadow-md transition-all active:scale-95 flex items-center justify-center gap-2">
                <span>Find businesses</span>
                <Icon name="arrow_forward" className="text-sm" />
              </button>
            </form>
            <div {...locateReveal} className="flex flex-wrap items-center gap-3 text-on-surface-variant font-body-sm text-body-sm mb-1 sm:mb-8">
              <button
                type="button"
                onClick={onLocate}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-sm text-label-sm font-semibold transition-colors"
              >
                <Icon name="locate" className="text-xs text-primary" filled />
                <span>Use my location</span>
              </button>
              <span className="text-outline">&bull;</span>
              <span className="text-on-surface-variant/80">{locateMsg}</span>
            </div>
            <div {...trustReveal} className="hidden xs:grid xs:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-outline-variant/30 w-full max-w-lg">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-primary"><Icon name="storefront" className="text-base" filled /></div>
                <span className="font-label-md text-label-md font-semibold text-on-surface">Local businesses</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary"><Icon name="shield" className="text-base" filled /></div>
                <span className="font-label-md text-label-md font-semibold text-on-surface">Verified vendors</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary"><Icon name="chat" className="text-base" filled /></div>
                <span className="font-label-md text-label-md font-semibold text-on-surface">Easy contact</span>
              </div>
            </div>
          </div>

          <div {...visualReveal} className="hidden lg:flex lg:col-span-5 relative items-center justify-center min-h-[380px]">
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-primary-fixed/50 rounded-full blur-3xl pointer-events-none animate-blob-drift" />
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-secondary-fixed/40 rounded-full blur-3xl pointer-events-none animate-blob-drift-slow" />
            <div className="relative w-full max-w-md aspect-[4/4.5] blob-shape-1 p-2 bg-gradient-to-tr from-surface-container via-surface-container-lowest to-primary-fixed/40 shadow-2xl transition-all duration-700 hover:scale-[1.01]">
              <div className="w-full h-full blob-shape-1 overflow-hidden relative">
                <SkeletonImage
                  className="w-full h-full object-cover object-center"
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=70&w=960&h=1080"
                  alt="A residential society"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/30 via-transparent to-transparent" />
              </div>
              <div className="absolute -top-4 -left-3 glass shadow-xl rounded-2xl p-3 flex items-center gap-3 animate-gentle-drift">
                <div className="w-10 h-10 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary"><Icon name="domain" className="text-lg" filled /></div>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface-variant font-medium">Selected society</p>
                  <p className="font-label-md text-label-md font-bold text-on-surface">{heroSociety}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary" />
                    <span className="font-label-sm text-label-sm text-tertiary font-semibold">{heroCount} listed</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-3 glass shadow-xl rounded-full px-4 py-2.5 flex items-center gap-3">
                <div className="flex -space-x-2 overflow-hidden">
                  <span className="inline-block h-7 w-7 rounded-full ring-2 ring-surface-container-lowest bg-primary-fixed flex items-center justify-center text-primary font-bold text-xs">RK</span>
                  <span className="inline-block h-7 w-7 rounded-full ring-2 ring-surface-container-lowest bg-secondary-fixed flex items-center justify-center text-secondary font-bold text-xs">AM</span>
                  <span className="inline-block h-7 w-7 rounded-full ring-2 ring-surface-container-lowest bg-tertiary-fixed flex items-center justify-center text-tertiary font-bold text-xs">PS</span>
                </div>
                <div className="text-left">
                  <span className="font-label-md text-label-md font-bold text-on-surface block leading-tight"><CountUp value={250} suffix="+" /> Neighbors</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">Active this week</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
