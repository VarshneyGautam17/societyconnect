import Link from 'next/link';
import MonoTile from '@/components/ui/MonoTile';
import Icon from '@/components/ui/Icon';

const LINKS = [
  { href: '/dashboard', label: 'Overview', active: true },
  { href: '/edit', label: 'My business page' },
  { href: '/edit#menu', label: 'Products and services' },
  { href: '/edit#photos', label: 'Photos' },
  { href: '/edit#offers', label: 'Offers' },
  { href: '#leads', label: 'Leads' },
  { href: '#', label: 'Subscription', soon: true },
  { href: '#', label: 'Settings', soon: true }
];

export default function Sidebar({ vendor, live, onSoonClick }) {
  return (
    <aside className="bg-surface-container-lowest border-b lg:border-b-0 lg:border-r border-outline-variant/40 p-4 lg:p-5 flex lg:flex-col items-center lg:items-stretch gap-4 lg:gap-5 overflow-x-auto">
      <Link href="/" className="hidden lg:flex items-center gap-2 px-2">
        <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary"><Icon name="pin" className="text-base" filled /></span>
        <span className="font-headline-sm text-headline-sm text-primary tracking-tight">SocietySpot</span>
      </Link>
      <nav className="flex lg:flex-col gap-1 flex-none" aria-label="Vendor navigation">
        {LINKS.map((l) => (
          <Link
            key={l.label}
            href={l.href}
            onClick={l.soon ? (e) => { e.preventDefault(); onSoonClick(); } : undefined}
            aria-current={l.active ? 'page' : undefined}
            className={
              'flex items-center min-h-[44px] px-3 rounded-2xl whitespace-nowrap ' +
              (l.active ? 'font-label-lg text-label-lg font-semibold bg-primary-fixed text-primary' : 'font-label-md text-label-md font-medium text-on-surface-variant hover:bg-surface-container')
            }
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="hidden lg:flex mt-auto items-center gap-2.5 p-3 rounded-2xl bg-surface-container border border-outline-variant/30">
        <MonoTile business={vendor} className="w-9 h-9 text-base rounded-xl" />
        <span className="min-w-0">
          <strong className="block font-label-md text-label-md text-on-surface truncate">{vendor.name}</strong>
          <small className="font-label-sm text-label-sm text-on-surface-variant">{live ? 'Published' : 'Sample'}</small>
        </span>
      </div>
    </aside>
  );
}
