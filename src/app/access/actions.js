'use server';

import { createHash, randomBytes } from 'node:crypto';
import { cookies, headers } from 'next/headers';
import { createServiceRoleClient } from '@/lib/supabase/serviceRole';
import { sendOtp, verifyOtp } from '@/lib/otp';

/* Resident phone login: WhatsApp OTP (send/verify shared with vendor onboarding verification,
   see src/lib/otp.js) -> `residents` row + `resident_sessions` row + an httpOnly cookie, so a
   reload (or a return visit) skips the gate. Tables and why they have no RLS policies: see the
   "Resident phone login" section of supabase/schema.sql.
   Every action returns { error } instead of throwing -- Next replaces thrown messages with a
   generic one in production builds, so the gate couldn't show "wrong code" etc. */

const SESSION_COOKIE = 'ss_session';
const SESSION_TTL_DAYS = 180;

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

export async function sendLoginOtp(phone) {
  return sendOtp(phone, 'login');
}

export async function verifyLoginOtp(phone, code) {
  const verified = await verifyOtp(phone, code);
  if (verified.error) return verified;

  const supabase = createServiceRoleClient();
  /* Checked before the upsert below so a returning number (one that already logged in before,
     any time in the past -- not just "still has a live session") can be told apart from a
     first-ever signup, for the "welcome back" toast. */
  const { data: existing } = await supabase.from('residents').select('id').eq('phone', phone).maybeSingle();
  const returning = !!existing;

  const { data: resident, error: residentError } = await supabase
    .from('residents')
    .upsert({ phone, last_login_at: new Date().toISOString() }, { onConflict: 'phone' })
    .select('id')
    .single();
  if (residentError) return { error: 'Something went wrong. Try again.' };

  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);
  const userAgent = ((await headers()).get('user-agent') || '').slice(0, 300);

  const { error: sessionError } = await supabase.from('resident_sessions').insert({
    resident_id: resident.id,
    token_hash: sha256(token),
    user_agent: userAgent,
    expires_at: expiresAt.toISOString()
  });
  if (sessionError) return { error: 'Something went wrong. Try again.' };

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt
  });

  return { ok: true, phone, returning };
}

/** Signs the current resident out: deletes the session row server-side (not just the cookie,
 *  so a copied/leaked token stops working too) and clears the cookie. A phone number that signs
 *  out is still in `residents` (it's a permanent record of who has ever verified), but with no
 *  live session it has to clear the WhatsApp OTP gate again on its next visit -- this function
 *  never skips that check, it only ever removes access. */
export async function signOutResident() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    const supabase = createServiceRoleClient();
    await supabase.from('resident_sessions').delete().eq('token_hash', sha256(token));
  }
  store.delete(SESSION_COOKIE);
  return { ok: true };
}

/** The signed-in resident's phone, or null. Called on every app load to confirm the
 *  locally cached "unlocked" state against the real session. */
export async function getResidentSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const supabase = createServiceRoleClient();
  const { data: session } = await supabase
    .from('resident_sessions')
    .select('id, expires_at, residents(phone)')
    .eq('token_hash', sha256(token))
    .maybeSingle();

  if (!session || new Date(session.expires_at).getTime() < Date.now()) return null;

  await supabase.from('resident_sessions').update({ last_seen_at: new Date().toISOString() }).eq('id', session.id);
  return { phone: session.residents.phone };
}
