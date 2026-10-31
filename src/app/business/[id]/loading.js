import { SiteShellSkeleton, BusinessContentSkeleton } from '@/components/ui/PageSkeletons';

/* Shown while the server layout's generateMetadata looks the business up (it hits Supabase), so
   tapping a card swaps straight to the page's shape instead of freezing on the old page. */
export default function Loading() {
  return <SiteShellSkeleton><BusinessContentSkeleton /></SiteShellSkeleton>;
}
