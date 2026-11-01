import 'server-only';

import { createHash, randomInt } from 'node:crypto';
import { createServiceRoleClient } from '@/lib/supabase/serviceRole';
import { sendOtpMessage, whatsappConfigured } from '@/lib/whatsapp';

/* Shared WhatsApp OTP send/verify, backing both resident login (src/app/access/actions.js) and
   vendor phone verification during onboarding (src/app/onboarding/actions.js) -- same approved
   "Authentication" template (WHATSAPP_OTP_TEMPLATE_NAME), same resident_otps table (it's just a
   phone+code store with no foreign key to `residents`, so there's nothing resident-specific
   about reusing it here). Anything resident-specific -- the `residents` row, the session cookie
   -- stays in access/actions.js; this module only ever sends and checks a code. */

const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;
const SEND_WINDOW_MS = 60 * 60 * 1000;
const SEND_MAX_PER_WINDOW = 5;
const RESEND_COOLDOWN_MS = 30 * 1000;

export function isValidPhone(phone) {
  return /^\d{10}$/.test(phone || '');
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

/** Sends a 6-digit WhatsApp code to `phone`. `logLabel` only affects the dev-mode console
 *  fallback line (e.g. "login" vs "onboarding"), so a developer can tell which flow printed a
 *  code when WhatsApp isn't configured or the send fails. */
export async function sendOtp(phone, logLabel = 'otp') {
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
      console.info(`[dev] WhatsApp send failed (see error above) -- ${logLabel} code for ${phone}: ${code}`);
    }
  } else if (!isDev) {
    return { error: 'This is temporarily unavailable. Try again later.' };
  } else {
    // Dev only: WhatsApp isn't configured yet (dummy token / no approved template).
    console.info(`[dev] WhatsApp not configured -- ${logLabel} code for ${phone}: ${code}`);
  }

  const { error } = await supabase.from('resident_otps').insert({
    phone,
    code_hash: sha256(`${phone}:${code}`),
    expires_at: new Date(Date.now() + OTP_TTL_MS).toISOString()
  });
  if (error) return { error: 'Something went wrong. Try again.' };

  return { ok: true };
}

/** Checks a 6-digit code against the most recent unconsumed one for `phone`, consuming it on
 *  success. Doesn't touch `residents` or sessions -- that's the caller's job if it needs one. */
export async function verifyOtp(phone, code) {
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
  return { ok: true };
}
