import { createClient } from '@/lib/supabase/server';
import BusinessesTable from '@/components/admin/BusinessesTable';

export default async function AdminBusinessesPage() {
  const supabase = await createClient();
  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline-lg text-headline-md text-on-surface tracking-tight">All businesses</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">Every listing on the site, any status. Export, enable/disable, edit or permanently delete.</p>
      </div>
      <BusinessesTable businesses={businesses || []} />
    </div>
  );
}
