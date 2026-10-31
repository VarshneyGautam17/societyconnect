import { Skeleton, CardSkeleton, StatTileSkeleton } from '@/components/ui/Loaders';

/* Full-page skeletons, one per route, each mirroring that page's real layout (same container
   widths, paddings and grid columns) so the swap to real content doesn't shift anything. Shown by
   the route `loading.js` files while a page segment loads, and by Providers during first boot
   (see `PageSkeletonForPath`). Section-level skeletons (`*ContentSkeleton`) render inside a shell
   that's already on screen -- e.g. admin pages, where the sidebar stays and only the main area
   loads. Composed from the primitives in Loaders.jsx. */

function SkeletonPanel({ className = '', children }) {
  return (
    <div className={`bg-surface-container-lowest rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-outline-variant/30 shadow-sm flex flex-col gap-2.5 ${className}`}>
      <Skeleton className="h-5 w-2/5 mb-1" />
      {children}
    </div>
  );
}

function Lines({ count = 3 }) {
  const widths = ['w-full', 'w-11/12', 'w-4/5', 'w-3/5', 'w-2/3'];
  return Array.from({ length: count }).map((_, i) => <Skeleton key={i} className={`h-3.5 ${widths[i % widths.length]}`} />);
}

/* ------------------------------------------------------------------ resident site shell */

function HeaderSkeleton({ minimal = false }) {
  return (
    <div className="glass sticky top-0 z-50 shadow-sm">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 md:px-8 min-h-14 md:min-h-16 gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-5 w-28" />
        </div>
        {minimal ? (
          <Skeleton className="h-4 w-24" />
        ) : (
          <>
            <div className="hidden xl:flex items-center gap-5">
              {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-4 w-20" />)}
            </div>
            <Skeleton className="xl:hidden w-9 h-9 rounded-full" />
          </>
        )}
      </div>
    </div>
  );
}

function TabBarSkeleton() {
  return (
    <div className="md:hidden fixed left-0 right-0 bottom-0 z-40 glass-strong flex justify-around px-1 py-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <Skeleton className="w-5 h-5 rounded-md" />
          <Skeleton className="h-2.5 w-10" />
        </div>
      ))}
    </div>
  );
}

/** Mirrors SiteShell: header, content, room for the mobile tab bar. */
export function SiteShellSkeleton({ children }) {
  return (
    <div className="flex flex-col min-h-screen pb-14 md:pb-0" role="status" aria-label="Loading">
      <HeaderSkeleton />
      <div className="flex-1">{children}</div>
      <TabBarSkeleton />
    </div>
  );
}

/** Blob-backed intro band used at the top of Directory/Societies: heading, subline, search bar. */
function SearchHeroSkeleton() {
  return (
    <section className="border-b border-outline-variant/30 py-6 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col gap-3 md:gap-4">
        <Skeleton className="h-8 md:h-11 w-3/4 md:w-1/2" />
        <Skeleton className="h-4 w-2/3 md:w-1/3" />
        <Skeleton className="h-14 md:h-16 w-full max-w-3xl rounded-2xl md:rounded-full mt-1 md:mt-3" />
      </div>
    </section>
  );
}

function CardGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}

export function HomeContentSkeleton() {
  return (
    <>
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 flex flex-col gap-3 md:gap-4">
          <Skeleton className="h-6 w-40 rounded-full" />
          <Skeleton className="h-10 md:h-14 w-full" />
          <Skeleton className="h-10 md:h-14 w-4/5" />
          <Skeleton className="h-4 w-3/4 mt-1" />
          <Skeleton className="h-14 md:h-16 w-full max-w-xl rounded-2xl md:rounded-full mt-2" />
        </div>
        <div className="hidden lg:flex lg:col-span-5 justify-center">
          <Skeleton className="w-full max-w-md aspect-[4/4.5] rounded-[40%]" />
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-10 md:pb-16 flex flex-col gap-4 md:gap-6">
        <div className="flex items-end justify-between gap-4">
          <Skeleton className="h-7 md:h-9 w-56" />
          <Skeleton className="hidden sm:block h-9 w-28 rounded-full" />
        </div>
        <div className="flex gap-2 overflow-hidden">
          {[0, 1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-9 w-24 flex-none rounded-full" />)}
        </div>
        <CardGrid />
      </section>
    </>
  );
}

export function DirectoryContentSkeleton() {
  return (
    <>
      <SearchHeroSkeleton />
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-5 md:py-10 flex flex-col gap-4 md:gap-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-2 overflow-hidden">
            {[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-9 w-24 flex-none rounded-full" />)}
          </div>
          <Skeleton className="h-9 md:h-11 w-28 flex-none rounded-full md:rounded-2xl" />
        </div>
        <CardGrid />
      </section>
    </>
  );
}

export function SocietiesContentSkeleton() {
  return (
    <>
      <SearchHeroSkeleton />
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-5 md:py-12 flex flex-col gap-4 md:gap-8">
        <Skeleton className="h-8 md:h-10 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl md:rounded-3xl p-3 sm:p-4 border border-outline-variant/40 bg-surface-container-lowest flex flex-col gap-3">
              <Skeleton className="w-full aspect-[4/3] rounded-2xl" />
              <Skeleton className="h-5 w-3/5" />
              <Skeleton className="h-3.5 w-2/5" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function ContactCardSkeleton({ className = '' }) {
  return (
    <SkeletonPanel className={className}>
      <div className="flex items-center gap-2.5">
        <Skeleton className="w-9 h-9 md:w-10 md:h-10 rounded-full flex-none" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-11 md:h-12 w-full rounded-full mt-1" />
      <div className="grid grid-cols-2 gap-2">
        <Skeleton className="h-11 rounded-full" />
        <Skeleton className="h-11 rounded-full" />
      </div>
    </SkeletonPanel>
  );
}

/** Mirrors business/[id]/page.js: breadcrumb, hero card, contact card, main panels + aside. */
export function BusinessContentSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 w-full" aria-hidden="true">
      <div className="py-2.5 md:py-5"><Skeleton className="h-4 w-48" /></div>
      <div className="bg-surface-container-lowest rounded-2xl md:rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden mb-3 md:mb-6">
        <div className="relative">
          <Skeleton className="w-full h-36 md:h-80 rounded-none" />
          <Skeleton className="absolute -bottom-7 md:-bottom-10 left-4 md:left-6 w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-2xl border-4 border-surface-container-lowest" />
        </div>
        <div className="pt-9 md:pt-14 pb-4 md:pb-6 px-4 md:px-6 flex items-start justify-between gap-3">
          <div className="flex-1 flex flex-col gap-2.5">
            <Skeleton className="h-6 md:h-8 w-3/5 md:w-2/5" />
            <Skeleton className="h-4 w-4/5 md:w-1/2" />
          </div>
          <Skeleton className="h-9 md:h-11 w-20 md:w-24 rounded-full flex-none" />
        </div>
      </div>
      <ContactCardSkeleton className="lg:hidden mb-3 md:mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-3 md:gap-6 pb-8 md:pb-16 items-start">
        <div className="flex flex-col gap-3 md:gap-6">
          <SkeletonPanel><Lines count={4} /></SkeletonPanel>
          <SkeletonPanel>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4 py-2 border-t border-outline-variant/30">
                <Skeleton className="h-4 w-2/5" />
                <Skeleton className="h-4 w-14" />
              </div>
            ))}
          </SkeletonPanel>
          <SkeletonPanel>
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
            </div>
          </SkeletonPanel>
        </div>
        <div className="flex flex-col gap-3 md:gap-6">
          <ContactCardSkeleton className="hidden lg:flex" />
          <SkeletonPanel><Skeleton className="h-24 md:h-36 rounded-xl md:rounded-2xl" /><Lines count={1} /></SkeletonPanel>
          <SkeletonPanel>
            <Skeleton className="h-11 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-11 w-36 rounded-full" />
          </SkeletonPanel>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ vendor pages */

/** Mirrors dashboard/page.js: sidebar + greeting, trial banner, stat tiles, chart, enquiries. */
export function DashboardPageSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] min-h-screen bg-background" role="status" aria-label="Loading">
      <SidebarSkeleton />
      <main className="p-5 md:p-8 flex flex-col gap-6 min-w-0 max-w-[1180px]">
        <DashboardContentSkeleton />
      </main>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <aside className="bg-surface-container-lowest border-b lg:border-b-0 lg:border-r border-outline-variant/40 p-4 lg:p-5 flex lg:flex-col items-center lg:items-stretch gap-4 lg:gap-5 overflow-hidden">
      <div className="hidden lg:flex items-center gap-2 px-2">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="flex lg:flex-col gap-2 flex-none">
        {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-28 lg:w-full rounded-xl" />)}
      </div>
    </aside>
  );
}

function DashboardContentSkeleton() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </div>
        <div className="flex gap-2.5">
          <Skeleton className="h-11 w-36 rounded-full" />
          <Skeleton className="h-11 w-40 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-16 rounded-2xl" />
      <StatTileSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
        <SkeletonPanel><Skeleton className="h-48 rounded-2xl" /></SkeletonPanel>
        <SkeletonPanel><Lines count={4} /></SkeletonPanel>
      </div>
      <SkeletonPanel><Lines count={3} /></SkeletonPanel>
    </>
  );
}

/** Mirrors edit/page.js: top bar, form panels, sticky preview column. */
export function EditPageSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background" role="status" aria-label="Loading">
      <div className="glass sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 min-h-16 flex items-center justify-between gap-4">
          <Skeleton className="h-5 w-48" />
          <div className="flex gap-2.5">
            <Skeleton className="hidden sm:block h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-28 rounded-full" />
          </div>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 md:px-8 w-full grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6 pt-6 pb-16 items-start">
        <div className="flex flex-col gap-6">
          {[0, 1, 2].map((i) => (
            <SkeletonPanel key={i}>
              <Skeleton className="h-12 rounded-2xl" />
              <Skeleton className="h-12 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
            </SkeletonPanel>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-56" />
          <CardSkeleton />
        </div>
      </main>
    </div>
  );
}

/** Mirrors onboarding/page.js: minimal header, title, stepper column + form card. */
export function OnboardingPageSkeleton() {
  return (
    <div className="flex flex-col min-h-screen" role="status" aria-label="Loading">
      <HeaderSkeleton minimal />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="pt-9 pb-4 flex flex-col gap-2.5">
          <Skeleton className="h-9 md:h-10 w-64" />
          <Skeleton className="h-4 w-80 max-w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-6 items-start pb-16">
          <SkeletonPanel>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full flex-none" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </SkeletonPanel>
          <SkeletonPanel className="p-6 md:p-8">
            <Skeleton className="h-12 rounded-2xl" />
            <Skeleton className="h-12 rounded-2xl" />
            <Skeleton className="h-12 rounded-2xl" />
            <div className="flex justify-end mt-2"><Skeleton className="h-11 w-32 rounded-full" /></div>
          </SkeletonPanel>
        </div>
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ admin */

/** Whole admin page (shell included) -- used while the admin layout's own auth check runs. */
export function AdminPageSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] min-h-screen bg-background" role="status" aria-label="Loading">
      <SidebarSkeleton />
      <main className="p-5 md:p-8 flex flex-col gap-6 min-w-0">
        <AdminDashboardContentSkeleton />
      </main>
    </div>
  );
}

function AdminHeading() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-8 w-60" />
      <Skeleton className="h-4 w-96 max-w-full" />
    </div>
  );
}

export function AdminDashboardContentSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading">
      <AdminHeading />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm flex flex-col gap-2.5">
            <Skeleton className="h-3.5 w-3/5" />
            <Skeleton className="h-9 w-1/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminTableContentSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading">
      <AdminHeading />
      <div className="flex flex-wrap gap-3">
        <Skeleton className="h-11 w-64 rounded-2xl" />
        <Skeleton className="h-11 w-36 rounded-2xl" />
        <Skeleton className="h-11 w-32 rounded-full ml-auto" />
      </div>
      <div className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/30 shadow-sm flex flex-col">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 items-center py-3.5 border-t first:border-t-0 border-outline-variant/30">
            <div className="flex flex-col gap-1.5"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></div>
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-3.5 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminQueueContentSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading">
      <AdminHeading />
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/30 shadow-sm flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1 min-w-[60%] flex flex-col gap-2">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-3.5 w-1/2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminEditContentSkeleton() {
  return (
    <div className="flex flex-col gap-6" role="status" aria-label="Loading">
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-72 max-w-full" />
        <Skeleton className="h-3.5 w-96 max-w-full" />
      </div>
      {[0, 1].map((i) => (
        <SkeletonPanel key={i}>
          <Skeleton className="h-12 rounded-2xl" />
          <Skeleton className="h-12 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </SkeletonPanel>
      ))}
    </div>
  );
}

/** Mirrors admin/login/page.js: one centered card. */
export function AdminLoginPageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4" role="status" aria-label="Loading">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 shadow-sm flex flex-col gap-3">
        <Skeleton className="w-12 h-12 rounded-full mb-2" />
        <Skeleton className="h-6 w-2/5" />
        <Skeleton className="h-3.5 w-4/5" />
        <Skeleton className="h-12 rounded-2xl mt-2" />
        <Skeleton className="h-12 rounded-full" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ route lookup */

/** Picks the full-page skeleton for a pathname -- used by Providers during first boot, when the
 *  route's own loading.js isn't involved (the route has already resolved; only client state is
 *  still hydrating). */
export function PageSkeletonForPath({ pathname = '/' }) {
  if (pathname.startsWith('/admin/login')) return <AdminLoginPageSkeleton />;
  if (pathname.startsWith('/admin')) return <AdminPageSkeleton />;
  if (pathname.startsWith('/dashboard')) return <DashboardPageSkeleton />;
  if (pathname.startsWith('/edit')) return <EditPageSkeleton />;
  if (pathname.startsWith('/onboarding')) return <OnboardingPageSkeleton />;
  if (pathname.startsWith('/business/')) return <SiteShellSkeleton><BusinessContentSkeleton /></SiteShellSkeleton>;
  if (pathname.startsWith('/directory')) return <SiteShellSkeleton><DirectoryContentSkeleton /></SiteShellSkeleton>;
  if (pathname.startsWith('/societies')) return <SiteShellSkeleton><SocietiesContentSkeleton /></SiteShellSkeleton>;
  return <SiteShellSkeleton><HomeContentSkeleton /></SiteShellSkeleton>;
}
