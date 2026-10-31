'use server';

import { createHash, randomBytes, randomInt } from 'node:crypto';
import { cookies, headers } from 'next/headers';
import { createServiceRoleClient } from '@/lib/supabase/serviceRole';
import { sendOtpMessage, whatsappConfigured } from '@/lib/whatsapp';

/* Resident phone login: WhatsApp OTP -> `residents` row + `resident_sessions` row + an
   httpOnly cookie, so a reload (or a return visit) skips the gate. Tables and why they have
   no RLS policies: see the "Resident phone login" section of supabase/schema.sql.
   Every action returns { error } instead of throwing -- Next replaces thrown messages with a
   generic one in production builds, so the gate couldn't show "wrong code" etc. */

const SESSION_COOKIE = 'ss_session';
const SESSION_TTL_DAYS = 180;
const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const SEND_WINDOW_MS = 60 * 60 * 1000;
const SEND_MAX_PER_WINDOW = 5;
const RESEND_COOLDOWN_MS = 30 * 1000;

function isValidPhone(phone) {
  return /^\d{10}$/.test(phone || '');
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

export async function sendLoginOtp(phone) {
  if (!isValidPhone(phone)) return { error: 'Enter a valid 10-digit mobile number.' };

  const supabase = createServiceRoleClient();
  const { data: recent, error: recentError } = await supabase
    .from('resident_otps')
    .select('created_at')
    .eq('phone', phone)
    .gte('created_at', new Date(Date.now() - SEND_WINDOW_MS).toISOString())
    .order('created_at', { ascending: false });
  if (recentError) return { error: 'Something went wrong. Try again.' };

  if (recent.length >= SEND_MAX_PER_WINDOW) {
    return { error: 'Too many codes requested for this number. Try again in an hour.' };
  }
  if (recent[0] && Date.now() - new Date(recent[0].created_at).getTime() < RESEND_COOLDOWN_MS) {
    return { error: 'Please wait a few seconds before requesting another code.' };
  }

  const code = String(randomInt(0, 1_000_000)).padStart(6, '0');

  const isDev = process.env.NODE_ENV !== 'production';
  if (whatsappConfigured()) {
    try {
      await sendOtpMessage(phone, code);
    } catch (err) {
      if (!isDev) return { error: err.message };
      // Dev only: e.g. template still pending approval, or number not on the test recipient list.
      console.info(`[dev] WhatsApp send failed (see error above) -- login code for ${phone}: ${code}`);
    }
  } else if (!isDev) {
    return { error: 'Login is temporarily unavailable. Try again later.' };
  } else {
    // Dev only: WhatsApp isn't configured yet (dummy token / no approved template).
    console.info(`[dev] WhatsApp not configured -- login code for ${phone}: ${code}`);
  }

  const { error } = await supabase.from('resident_otps').insert({
    phone,
    code_hash: sha256(`${phone}:${code}`),
    expires_at: new Date(Date.now() + OTP_TTL_MS).toISOString()
  });
  if (error) return { error: 'Something went wrong. Try again.' };

  return { ok: true };
}

export async function verifyLoginOtp(phone, code) {
  if (!isValidPhone(phone) || !/^\d{6}$/.test(code || '')) {
    return { error: 'Enter the 6-digit code.' };
  }

  const supabase = createServiceRoleClient();
  const { data: otp } = await supabase
    .from('resident_otps')
    .select('id, code_hash, attempts, expires_at')
    .eq('phone', phone)
    .is('consumed_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!otp || new Date(otp.expires_at).getTime() < Date.now()) {
    return { error: 'That code has expired. Request a new one.' };
  }
  if (otp.attempts >= OTP_MAX_ATTEMPTS) {
    return { error: 'Too many wrong attempts. Request a new code.' };
  }
  if (otp.code_hash !== sha256(`${phone}:${code}`)) {
    await supabase.from('resident_otps').update({ attempts: otp.attempts + 1 }).eq('id', otp.id);
    return { error: 'That code is incorrect.' };
  }

  await supabase.from('resident_otps').update({ consumed_at: new Date().toISOString() }).eq('id', otp.id);

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

  return { ok: true, phone };
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
