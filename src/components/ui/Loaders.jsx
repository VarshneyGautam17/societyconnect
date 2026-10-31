import Icon from '@/components/ui/Icon';

/** Shared loading-state primitives used across the app. There are three distinct situations
 *  that need a different treatment, not one spinner reused everywhere:
 *   - Spinner        inline, inside a button/chip while an action is in flight.
 *   - Overlay        a specific section/card is refetching but its last content (or layout)
 *                     should stay visible underneath -- a dimmed glass veil over it.
 *   - FullScreenGate  the whole page isn't usable yet (first app boot, auth/account gate
 *                     still resolving) -- nothing underneath is meaningful yet, so we cover it.
 *   - Skeleton*       nothing has ever loaded yet, so show the shape of what's coming instead
 *                     of a spinner -- cards, rows, stat tiles. Whole-page skeletons built from
 *                     these live in PageSkeletons.jsx. */

export function Spinner({ className = 'w-4 h-4', tone = 'currentColor' }) {
  return (
    <svg className={`animate-spinner ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke={tone} strokeWidth="2.5" opacity="0.2" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke={tone} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

/** Covers the full viewport. Use only while nothing on screen is meaningful yet (app boot,
 *  redux rehydration from localStorage, a hard auth gate) -- it should be on screen for a
 *  handful of milliseconds, not seconds. */
export function FullScreenLoader({ label = 'Loading SocietySpot…' }) {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-background animate-loader-fade" role="status" aria-live="polite">
      <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center animate-gentle-drift">
        <Icon name="storefront" className="text-2xl" filled />
      </div>
      <Spinner className="w-6 h-6 text-primary" />
      <span className="font-label-md text-label-md text-on-surface-variant">{label}</span>
    </div>
  );
}

/** Sits on top of a specific, already-positioned (relative) section while it refetches, so the
 *  section's last-known size doesn't jump. Parent must be `relative`. */
export function Overlay({ label, className = '' }) {
  return (
    <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-2.5 rounded-[inherit] glass animate-loader-fade ${className}`} role="status" aria-live="polite">
      <Spinner className="w-6 h-6 text-primary" />
      {label && <span className="font-label-sm text-label-sm text-on-surface-variant">{label}</span>}
    </div>
  );
}

/** Raw shimmer block -- compose into whatever shape is needed. */
export function Skeleton({ className = '' }) {
  return <div className={`animate-shimmer rounded-lg ${className}`} aria-hidden="true" />;
}

/** Placeholder matching PicksRow/BizCard's business-card shape. */
export function CardSkeleton({ className = '' }) {
  return (
    <div className={`rounded-2xl md:rounded-3xl p-2.5 md:p-3.5 border border-outline-variant/40 bg-surface-container-lowest flex flex-col gap-2.5 md:gap-3 ${className}`}>
      <Skeleton className="w-full aspect-square rounded-2xl" />
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-2/5" />
      </div>
    </div>
  );
}

/** A horizontal row of CardSkeletons, matching PicksRow's scroll strip. */
export function CardRowSkeleton({ count = 6 }) {
  return (
    <div className="flex gap-3 md:gap-5 overflow-x-auto pb-2 no-scrollbar" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} className="w-36 md:w-48 flex-none" />
      ))}
    </div>
  );
}

/** Placeholder matching TopPicksPanel/dashboard list rows (image + two lines + chevron). */
export function ListRowSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-2xl p-2.5 md:p-3 border border-outline-variant/30 bg-surface-container">
          <Skeleton className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex-none" />
          <div className="flex-1 min-w-0 flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Small stat-tile placeholder for dashboard-style number grids. */
export function StatTileSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl p-4 border border-outline-variant/30 bg-surface-container-lowest flex flex-col gap-2">
          <Skeleton className="h-3 w-2/5" />
          <Skeleton className="h-7 w-1/2" />
        </div>
      ))}
    </div>
  );
}

/** A table-row placeholder for admin lists. */
export function TableRowSkeleton({ rows = 5, cols = 4 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} aria-hidden="true">
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} className="px-4 py-3"><Skeleton className="h-4 w-full max-w-[140px]" /></td>
          ))}
        </tr>
      ))}
    </>
  );
}
