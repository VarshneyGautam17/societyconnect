import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminShell from '@/components/admin/AdminShell';

/* Gates every /admin/* route. Membership in the `admins` table is the only
   thing that grants access -- see supabase/README.md for how that is granted
   (by hand, via the SQL Editor; there is no self-service path). noindex for the whole /admin
   surface (this route and /admin/login) lives in the parent src/app/admin/layout.js. */
export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/admin/login');

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (isAdmin !== true) redirect('/admin/login?error=not_admin');

  return <AdminShell email={user.email}>{children}</AdminShell>;
}
