'use server';

import { createClient } from '@/lib/supabase/server';

/* Admin sign-in: email + password, checked by Supabase Auth on the server (the password is only
   ever stored there, hashed -- never in this codebase or the browser). A correct password alone
   isn't enough: the account must also be in the `admins` table, otherwise the session is
   dropped straight away. Returns { error } instead of throwing, as production builds hide
   thrown messages. The same message for every failure, so it doesn't reveal which emails exist. */
const DENIED = 'Incorrect email or password.';

export async function adminSignIn(email, password) {
  const cleanEmail = String(email || '').trim().toLowerCase().slice(0, 254);
  const pass = String(password || '').slice(0, 200);
  if (!cleanEmail || !pass) return { error: DENIED };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password: pass });
  if (error || !data.user) return { error: DENIED };

  /* is_admin() (security definer, see supabase/schema.sql) rather than selecting from `admins`
     directly -- that table's own read policy is what the function exists to evaluate safely. */
  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (isAdmin !== true) {
    await supabase.auth.signOut();
    return { error: DENIED };
  }
  return { ok: true };
}
