import { AdminPageSkeleton } from '@/components/ui/PageSkeletons';

/* Covers the (protected) layout's own auth/admin check -- nothing of the admin shell exists yet,
   so this is the whole page. Once the shell is up, each page's own loading.js below takes over
   and only the main column shimmers. */
export default function Loading() {
  return <AdminPageSkeleton />;
}
