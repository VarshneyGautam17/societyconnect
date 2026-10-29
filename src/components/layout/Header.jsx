'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { socShort, socOf } from '@/data/societies';
import Icon from '@/components/ui/Icon';

const NAV = [
  { href: '/', label: 'Home', key: 'home' },
  { href: '/directory', label: 'All businesses', key: 'directory' },
  { href: '/societies', label: 'Explore societies', key: 'societies' }
];

export default function Header({ active, minimal = false }) {
  const [open, setOpen] = useState(false);
  const vendor = useSelector((state) => state.vendor.current);
  const societyId = useSelector((state) => state.society.selectedId);
  const vendorLink = vendor && vendor.published ? '/dashboard' : '/onboarding';
  const vendorLabel = vendor && vendor.published ? 'My dashboard' : 'List your business';
  const society = socOf(societyId);

  const brand = (
    <Link href="/" className="flex items-center gap-1.5 md:gap-2 group flex-none">
      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm group-hover:scale-105 transition-transform flex-none">
        <Icon name="pin" className="text-base md:text-xl" filled />
      </div>
      <span className="font-headline-sm text-label-lg md:text-headline-sm text-primary tracking-tight whitespace-nowrap">SocietySpot</span>
    </Link>
  );

  if (minimal) {
    return (
      <header className="bg-surface-container-lowest/90 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-outline-variant/30">
        <div className="flex flex-wrap justify-between items-center max-w-7xl mx-auto px-4 md:px-8 min-h-14 md:min-h-16 w-full gap-y-1 gap-x-4">
          {brand}
          <nav className="flex items-center gap-3 sm:gap-5">
            <Link href="/" className="hidden sm:inline font-label-lg text-label-lg font-medium text-on-surface-variant hover:text-primary transition-colors">Need help?</Link>
            <Link href="/" className="font-label-md md:font-label-lg text-label-md md:text-label-lg font-semibold text-primary">Back to home</Link>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-surface-container-lowest/90 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-outline-variant/30">
      <div className="relative flex flex-wrap justify-between items-center max-w-7xl mx-auto px-4 md:px-8 min-h-14 md:min-h-16 w-full gap-y-2 gap-x-4">
        <div className="flex items-center gap-4 min-w-0">
          {brand}
          <Link
            href="/societies"
            title="Change society"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1 bg-surface-container-low border border-outline-variant/40 rounded-full text-on-surface hover:border-primary transition-colors max-w-[220px]"
          >
            <Icon name="pin" className="text-primary text-base flex-none" />
            <span className="font-label-md text-label-md font-semibold truncate">{socShort(societyId)}, {society.place.split(',')[0]}</span>
          </Link>
        </div>

        <nav
          aria-label="Main"
          className={`${open ? 'flex' : 'hidden'} xl:flex items-center gap-5 xl:static xl:flex-row xl:bg-transparent xl:border-0 xl:p-0 xl:shadow-none absolute left-0 right-0 top-full xl:top-auto flex-col items-start gap-1 p-4 bg-surface-container-lowest border-b border-outline-variant/40 shadow-lg z-50`}
        >
          {NAV.map((item) => {
            const isActive = active === item.key;
            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={
                  (isActive
                    ? 'text-primary font-semibold border-b-2 border-primary pb-1'
                    : 'text-on-surface-variant font-medium hover:text-on-surface transition-colors') +
                  ' font-label-lg text-label-lg whitespace-nowrap'
                }
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href={vendorLink}
            aria-current={active === 'vendor' ? 'page' : undefined}
            className={
              (active === 'vendor'
                ? 'text-primary font-semibold border-b-2 border-primary pb-1'
                : 'text-on-surface-variant font-medium hover:text-on-surface transition-colors') +
              ' font-label-lg text-label-lg whitespace-nowrap'
            }
          >
            For businesses
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 flex-none">
          <Link
            href={vendorLink}
            className="hidden sm:inline-flex items-center gap-2 bg-primary text-on-primary font-label-lg text-label-lg font-semibold px-4 xl:px-5 py-2.5 rounded-full shadow-sm hover:shadow-md hover:bg-primary-container active:scale-[0.98] transition-all whitespace-nowrap"
          >
            <span className="xl:hidden">{vendor && vendor.published ? 'Dashboard' : 'List'}</span>
            <span className="hidden xl:inline">{vendorLabel}</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label="Open menu"
            aria-expanded={open}
            className="xl:hidden flex items-center justify-center h-9 px-3 md:h-10 md:px-4 rounded-full border border-outline-variant/40 text-on-surface flex-none"
          >
            <Icon name={open ? 'close' : 'menu'} className="text-xl" />
          </button>
        </div>
      </div>
    </header>
  );
}
