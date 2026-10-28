import 'server-only';
import { createClient } from '@supabase/supabase-js';

/* Bypasses RLS entirely -- only ever import this from a Server Action or
   Route Handler (the `server-only` import throws a build error if a Client
   Component ever pulls this in by accident). Used for the handful of
   operations that legitimately need to act outside any one user's
   permissions: phone OTP rate-limiting/verification, and inserting an
   enquiry only after that verification succeeds. */
export function createServiceRoleClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
