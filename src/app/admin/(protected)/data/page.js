import { createServiceRoleClient } from '@/lib/supabase/serviceRole';
import RawTable from '@/components/admin/RawTable';

/* Raw view of every backend table, in schema order (see supabase/schema.sql) -- what an admin
   would otherwise have to open the Supabase dashboard to see. Uses the service-role key because
   residents/resident_otps/resident_sessions have zero RLS policies for anyone, admin included
   (see schema.sql) -- this route is only reachable by an admin at all because the layout above
   it (src/app/admin/(protected)/layout.js) already redirects everyone else before this renders,
   so that gate -- not a second RLS check here -- is what makes this safe. */
const TABLES = [
  {
    name: 'businesses',
    columns: ['id', 'owner_id', 'name', 'cat', 'society', 'served', 'area', 'desc', 'phone', 'whatsapp', 'hide_phone', 'verified', 'status', 'rejection_reason', 'reviewed_by', 'reviewed_at', 'offer', 'offer_valid', 'items', 'hours', 'banner', 'photos', 'slug', 'created_at', 'updated_at']
  },
  { name: 'societies', columns: ['id', 'name', 'place', 'street', 'city', 'pincode', 'lat', 'lng', 'bg', 'fg', 'created_at'] },
  { name: 'enquiries', columns: ['id', 'business_id', 'who', 'msg', 'status', 'created_at'] },
  { name: 'events', columns: ['id', 'business_id', 'type', 'visitor_phone', 'created_at'] },
  { name: 'admins', columns: ['user_id', 'created_at'] },
  { name: 'residents', columns: ['id', 'phone', 'created_at', 'last_login_at'] },
  { name: 'resident_otps', columns: ['id', 'phone', 'code_hash', 'attempts', 'expires_at', 'consumed_at', 'created_at'] },
  { name: 'resident_sessions', columns: ['id', 'resident_id', 'token_hash', 'user_agent', 'created_at', 'last_seen_at', 'expires_at'] }
];
const ROW_LIMIT = 50;

export default async function AdminDataPage() {
  const supabase = createServiceRoleClient();

  const results = await Promise.all(
    TABLES.map(async ({ name, columns }) => {
      const { data, count, error } = await supabase
        .from(name)
        .select(columns.join(','), { count: 'exact' })
        .order('created_at', { ascending: false })
        .limit(ROW_LIMIT);
      return { name, columns, rows: error ? [] : data, totalCount: error ? 0 : count, error: error?.message };
    })
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline-lg text-headline-md text-on-surface tracking-tight">Raw backend data</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Every table, every column, most recent {ROW_LIMIT} rows each. Hover a truncated value to see it in full.
        </p>
      </div>
      <nav className="flex flex-wrap gap-2" aria-label="Jump to table">
        {TABLES.map((t) => (
          <a key={t.name} href={`#${t.name}`} className="px-3 py-1.5 rounded-full border border-outline-variant text-on-surface-variant font-label-sm text-label-sm font-semibold hover:border-primary hover:text-primary transition-colors">{t.name}</a>
        ))}
      </nav>
      {results.map((r) => (
        r.error
          ? <p key={r.name} className="font-body-sm text-body-sm text-error">Could not load &quot;{r.name}&quot;: {r.error}</p>
          : <RawTable key={r.name} name={r.name} columns={r.columns} rows={r.rows} totalCount={r.totalCount} />
      ))}
    </div>
  );
}
