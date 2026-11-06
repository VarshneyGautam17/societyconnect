'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { socLabel } from '@/data/societies';
import { useSocieties } from '@/lib/societies';
import Icon from '@/components/ui/Icon';
import { useHideOnScroll } from '@/lib/useHideOnScroll';
import { useToast } from '@/components/ui/Toast';
import { signOutResident } from '@/app/access/actions';
import { lockAccess } from '@/store/slices/accessSlice';

const NAV = [
  { href: '/', label: 'Home', key: 'home' },
  { href: '/directory', label: 'All businesses', key: 'directory' },
  { href: '/societies', label: 'Explore societies', key: 'societies' }
];

export default function Header({ active, minimal = false }) {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const scrolledDown = useHideOnScroll();
  const hidden = scrolledDown && !open;
  const dispatch = useDispatch();
  const router = useRouter();
  const toast = useToast();
  const vendor = useSelector((state) => state.vendor.current);
  const societyId = useSelector((state) => state.society.selectedId);
  const residentUnlocked = useSelector((state) => state.access.unlocked);
  const vendorLink = vendor && vendor.published ? '/dashboard' : '/onboarding';
  const vendorLabel = vendor && vendor.published ? 'My dashboard' : 'List your business';
  const societies = useSocieties();

  /* Clears the resident session everywhere it lives: the DB row (so a copied cookie can't keep
     working), the httpOnly cookie, and the locally-cached redux/localStorage copy -- so the
     access gate asks for a fresh WhatsApp OTP on the very next visit, same as a brand-new
     visitor. router.refresh() re-runs the current route's data so any already-rendered gated
     content is dropped immediately, not just left on screen until the next navigation. */
  async function handleSignOut() {
    setSigningOut(true);
    await signOutResident().catch(() => {});
    dispatch(lockAccess());
    setSigningOut(false);
    toast('Signed out. Verify your number again to see businesses.');
    router.refresh();
  }

  const brand = (
    <Link href="/" className="flex items-center gap-1.5 md:gap-2 group flex-none">
      {/* eslint-disable-next-line @next/next/no-img-element -- static brand asset, no next/image config needed */}
      <img
        src="/brand/logo-mark.png"
        alt=""
        className="w-8 h-8 md:w-10 md:h-10 rounded-full shadow-sm group-hover:scale-105 transition-transform flex-none"
      />
      <span className="font-headline-sm text-label-lg md:text-headline-sm text-primary tracking-tight whitespace-nowrap">SocietySpot</span>
    </Link>
  );

  if (minimal) {
    return (
      <header className={`glass sticky top-0 z-50 shadow-sm transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="flex flex-wrap justify-between items-center max-w-7xl mx-auto px-4 md:px-8 min-h-14 md:min-h-16 w-full gap-y-1 gap-x-4">
          {brand}
          <nav className="flex items-center gap-3 sm:gap-5">
            <Link href="/" className="hidden xs:inline font-label-lg text-label-lg font-medium text-on-surface-variant hover:text-primary transition-colors">Need help?</Link>
            <Link href="/" className="font-label-md md:font-label-lg text-label-md md:text-label-lg font-semibold text-primary">Back to home</Link>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className={`glass sticky top-0 z-50 shadow-sm transition-transform duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
      <div className="relative flex flex-wrap justify-between items-center max-w-7xl mx-auto px-4 md:px-8 min-h-14 md:min-h-16 w-full gap-y-2 gap-x-4">
        <div className="flex items-center gap-4 min-w-0">
          {brand}
          <Link
            href="/societies"
            title="Change society"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1 bg-surface-container-low border border-outline-variant/40 rounded-full text-on-surface hover:border-primary transition-colors max-w-[220px]"
          >
            <Icon name="pin" className="text-primary text-base flex-none" />
            <span className="font-label-md text-label-md font-semibold truncate">{socLabel(societyId, societies)}</span>
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
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 flex-none">
          {residentUnlocked && (
            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              title="Sign out"
              aria-label="Sign out"
              className="flex items-center justify-center h-9 w-9 md:h-10 md:w-10 rounded-full border border-outline-variant/40 text-on-surface-variant hover:text-primary hover:border-primary transition-colors flex-none disabled:opacity-60"
            >
              <Icon name="logout" className="text-lg" />
            </button>
          )}
          <Link
            href={vendorLink}
            className="hidden xs:inline-flex items-center gap-2 bg-primary text-on-primary font-label-lg text-label-lg font-semibold px-4 xl:px-5 py-2.5 rounded-full shadow-sm hover:shadow-md hover:bg-primary-container active:scale-[0.98] transition-all whitespace-nowrap"
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
