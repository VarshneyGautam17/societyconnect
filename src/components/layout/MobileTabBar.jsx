'use client';

import Link from 'next/link';
import { useSelector } from 'react-redux';
import { useToast } from '@/components/ui/Toast';
import Icon from '@/components/ui/Icon';

function TabItem({ href, active, iconName, label }) {
  return (
    <Link
      href={href}
      className={`flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[44px] font-label-sm text-label-sm ${
        active ? 'text-primary font-bold' : 'text-on-surface-variant font-medium'
      }`}
    >
      <Icon name={iconName} className="text-xl" filled={active} />
      <span>{label}</span>
    </Link>
  );
}

export default function MobileTabBar({ active }) {
  const toast = useToast();
  const vendor = useSelector((state) => state.vendor.current);
  const vendorLink = vendor && vendor.published ? '/dashboard' : '/onboarding';

  function onAccountClick(e) {
    e.preventDefault();
    toast('Demo: login is not connected yet. Browsing never needs it.');
  }

  return (
    <nav
      aria-label="Quick navigation"
      className="md:hidden fixed left-0 right-0 bottom-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant/40 flex justify-around px-1 py-1.5 shadow-[0_-8px_24px_-16px_rgba(15,23,42,0.3)]"
    >
      <TabItem href="/" active={active === 'home'} iconName="home" label="Home" />
      <TabItem href="/directory" active={active === 'directory'} iconName="search" label="Explore" />
      <TabItem href="/directory?saved=1" active={false} iconName="heart" label="Saved" />
      <TabItem href={vendorLink} active={false} iconName={vendor && vendor.published ? 'grid' : 'plus'} label={vendor && vendor.published ? 'Dashboard' : 'List'} />
      <a href="#" onClick={onAccountClick} className="flex-1 flex flex-col items-center justify-center gap-0.5 min-h-[44px] font-label-sm text-label-sm text-on-surface-variant font-medium">
        <Icon name="user" className="text-xl" />
        <span>Account</span>
      </a>
    </nav>
  );
}
