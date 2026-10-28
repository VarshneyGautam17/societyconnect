'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

/* Every action here runs with the signed-in admin's session, so Postgres RLS
   (the "admins can ... any business" policies in supabase/schema.sql) is what
   actually enforces "only an admin can do this" -- there is no service-role
   key involved, and none of this works for a non-admin caller no matter what
   the client sends. */

async function requireAdminClient() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not signed in.');
  return { supabase, userId: user.id };
}

export async function approveBusiness(id) {
  const { supabase, userId } = await requireAdminClient();
  const { error } = await supabase
    .from('businesses')
    .update({ status: 'approved', reviewed_by: userId, reviewed_at: new Date().toISOString(), rejection_reason: '' })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/vendors');
  revalidatePath('/admin/businesses');
}

export async function rejectBusiness(id, reason) {
  const { supabase, userId } = await requireAdminClient();
  const { error } = await supabase
    .from('businesses')
    .update({ status: 'rejected', reviewed_by: userId, reviewed_at: new Date().toISOString(), rejection_reason: reason || '' })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/vendors');
  revalidatePath('/admin/businesses');
}

/** Toggles a currently-approved listing off the live site (and back on) without
 *  touching the original approval record -- distinct from reject, which is
 *  for new/unreviewed submissions. */
export async function setBusinessEnabled(id, enabled) {
  const { supabase, userId } = await requireAdminClient();
  const { error } = await supabase
    .from('businesses')
    .update({ status: enabled ? 'approved' : 'disabled', reviewed_by: userId, reviewed_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/businesses');
}

export async function deleteBusinessPermanently(id) {
  const { supabase } = await requireAdminClient();
  const { error } = await supabase.from('businesses').delete().eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/businesses');
  revalidatePath('/admin/vendors');
}

export async function adminUpdateBusiness(id, patch) {
  const { supabase } = await requireAdminClient();
  const { error } = await supabase.from('businesses').update(patch).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/businesses');
  revalidatePath(`/admin/businesses/${id}/edit`);
}
