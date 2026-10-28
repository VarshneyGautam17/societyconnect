import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import Icon from '@/components/ui/Icon';

async function countByStatus(supabase, status) {
  const { count } = await supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('status', status);
  return count || 0;
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const [pending, approved, disabled, rejected, enquiries] = await Promise.all([
    countByStatus(supabase, 'pending'),
    countByStatus(supabase, 'approved'),
    countByStatus(supabase, 'disabled'),
    countByStatus(supabase, 'rejected'),
    supabase.from('enquiries').select('id', { count: 'exact', head: true }).then((r) => r.count || 0)
  ]);

  const stats = [
    ['Pending approval', pending, '/admin/vendors'],
    ['Live businesses', approved, '/admin/businesses'],
    ['Disabled', disabled, '/admin/businesses'],
    ['Rejected', rejected, '/admin/businesses'],
    ['Total enquiries', enquiries, null]
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline-lg text-headline-md text-on-surface tracking-tight">Admin dashboard</h1>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">Approve new vendors and manage every listing on the site.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map(([label, value, href]) => {
          const card = (
            <div className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm h-full">
              <small className="font-label-md text-label-md text-on-surface-variant">{label}</small>
              <strong className="block font-display text-4xl text-on-surface mt-1.5">{value}</strong>
            </div>
          );
          return href ? <Link key={label} href={href}>{card}</Link> : <div key={label}>{card}</div>;
        })}
      </div>

      {pending > 0 && (
        <Link href="/admin/vendors" className="inline-flex items-center gap-2 self-start px-5 py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-semibold hover:bg-primary-container shadow-sm transition-colors">
          <Icon name="check" className="text-lg" />
          {pending} vendor{pending === 1 ? '' : 's'} waiting for review
        </Link>
      )}
    </div>
  );
}
