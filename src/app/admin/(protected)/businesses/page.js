import { createClient } from '@/lib/supabase/server';
import BusinessesTable from '@/components/admin/BusinessesTable';

/* PostgREST has no GROUP BY aggregation over the JS client without a DB
   function/view, and at this scale (dozens of vendors, not millions of
   events) fetching the raw rows and counting in JS is simpler than adding
   one. Revisit with a real aggregate query/view if this table ever gets big. */
function summarizeEvents(events) {
  const byBusiness = new Map();
  for (const e of events) {
    const s = byBusiness.get(e.business_id) || { views: 0, contacts: 0 };
    if (e.type === 'view') s.views += 1;
    else s.contacts += 1; // whatsapp, call, enquiry
    byBusiness.set(e.business_id, s);
  }
  return byBusiness;
}

export default async function AdminBusinessesPage() {
  const supabase = await createClient();
  const [{ data: businesses }, { data: events }] = await Promise.all([
    supabase.from('businesses').select('*').order('created_at', { ascending: false }),
    supabase.from('events').select('business_id, type')
  ]);

  const stats = summarizeEvents(events || []);
  const withStats = (businesses || []).map((b) => ({
    ...b,
    views: stats.get(b.id)?.views || 0,
    contacts: stats.get(b.id)?.contacts || 0
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline-lg text-headline-md text-on-surface tracking-tight">All businesses</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Every listing on the site, any status. Views and contacts are real counts from residents visiting each business page -- share them with a vendor as proof of traffic.
        </p>
      </div>
      <BusinessesTable businesses={withStats} />
    </div>
  );
}
