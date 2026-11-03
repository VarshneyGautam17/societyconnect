import { createClient } from '@/lib/supabase/server';
import VendorQueue from '@/components/admin/VendorQueue';

export default async function AdminVendorsPage() {
  const supabase = await createClient();
  const { data: pending } = await supabase
    .from('businesses')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  /* Fetched fresh here (not from the client-side society cache) so a just-created society's
     lat/lng are never stale by the time an admin approves its first business. */
  const societyIds = [...new Set((pending || []).map((b) => b.society))];
  const { data: societies } = societyIds.length
    ? await supabase.from('societies').select('id, street, city, pincode, lat, lng, photo').in('id', societyIds)
    : { data: [] };
  const societiesById = Object.fromEntries((societies || []).map((s) => [s.id, s]));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline-lg text-headline-md text-on-surface tracking-tight">Vendor requests</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">New business submissions, waiting for approval before they go live.</p>
      </div>
      <VendorQueue businesses={pending || []} societiesById={societiesById} />
    </div>
  );
}
