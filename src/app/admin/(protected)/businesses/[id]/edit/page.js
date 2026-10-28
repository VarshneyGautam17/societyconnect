import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AdminBusinessEditor from '@/components/admin/AdminBusinessEditor';

export default async function AdminBusinessEditPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: row } = await supabase.from('businesses').select('*').eq('id', id).maybeSingle();

  if (!row) notFound();

  return <AdminBusinessEditor row={row} />;
}
