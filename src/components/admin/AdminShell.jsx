'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Icon from '@/components/ui/Icon';

const LINKS = [
  { href: '/admin', label: 'Dashboard', icon: 'grid', exact: true },
  { href: '/admin/vendors', label: 'Vendor requests', icon: 'check' },
  { href: '/admin/businesses', label: 'All businesses', icon: 'storefront' }
];

export default function AdminShell({ email, children }) {
  const pathname = usePathname();
  const router = useRouter();

  async function onSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] min-h-screen bg-background text-on-surface">
      <aside className="bg-surface-container-lowest border-b lg:border-b-0 lg:border-r border-outline-variant/40 p-4 lg:p-5 flex lg:flex-col items-center lg:items-stretch gap-4 lg:gap-5 overflow-x-auto">
        <Link href="/admin" className="hidden lg:flex items-center gap-2 px-2">
          <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary"><Icon name="shield" className="text-base" filled /></span>
          <span className="font-headline-sm text-headline-sm text-primary tracking-tight">Admin</span>
        </Link>
        <nav className="flex lg:flex-col gap-1 flex-none" aria-label="Admin navigation">
          {LINKS.map((l) => {
            const active = l.exact ? pathname === l.href : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? 'page' : undefined}
                className={
                  'flex items-center gap-2 min-h-[44px] px-3 rounded-2xl whitespace-nowrap ' +
                  (active ? 'font-label-lg text-label-lg font-semibold bg-primary-fixed text-primary' : 'font-label-md text-label-md font-medium text-on-surface-variant hover:bg-surface-container')
                }
              >
                <Icon name={l.icon} className="text-lg" />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden lg:flex mt-auto flex-col gap-2 p-3 rounded-2xl bg-surface-container border border-outline-variant/30">
          <span className="font-label-sm text-label-sm text-on-surface-variant truncate">{email}</span>
          <button type="button" onClick={onSignOut} className="text-left font-label-md text-label-md font-semibold text-error">Sign out</button>
        </div>
      </aside>
      <main className="p-5 md:p-8 flex flex-col gap-6 min-w-0">{children}</main>
    </div>
  );
}
