import { createClient } from '@/lib/supabase/server';
import VendorQueue from '@/components/admin/VendorQueue';

export default async function AdminVendorsPage() {
  const supabase = await createClient();
  const { data: pending } = await supabase
    .from('businesses')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline-lg text-headline-md text-on-surface tracking-tight">Vendor requests</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">New business submissions, waiting for approval before they go live.</p>
      </div>
      <VendorQueue businesses={pending || []} />
    </div>
  );
}
