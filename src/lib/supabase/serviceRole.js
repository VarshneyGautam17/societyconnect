import 'server-only';
import { createClient } from '@supabase/supabase-js';

/** Supabase client with the service-role key -- bypasses RLS entirely. Server-only (the
 *  import above makes any client-side import a build error); used only by the resident
 *  phone-login actions, whose tables have no RLS policies at all. */
export function createServiceRoleClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set.');
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
