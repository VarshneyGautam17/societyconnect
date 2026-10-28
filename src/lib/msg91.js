import 'server-only';

/* MSG91's OTP API -- sends and verifies the code on their end, so there's
   no code/expiry to store on our side (see phone_otp_requests, which is
   only a rate-limit log, not an OTP store).
   Docs: https://docs.msg91.com/p/tf9GTextN/e/5c2Np8Uxkk/MSG91 (OTP API).
   NOTE: written from documentation, not yet exercised against a live
   account -- the first real send/verify call may need a small adjustment
   to field names/response shape once real credentials are in place. */

const BASE = 'https://control.msg91.com/api/v5';

function authKey() {
  const key = process.env.MSG91_AUTH_KEY;
  if (!key) throw new Error('MSG91_AUTH_KEY is not set.');
  return key;
}

function templateId() {
  const id = process.env.MSG91_OTP_TEMPLATE_ID;
  if (!id) throw new Error('MSG91_OTP_TEMPLATE_ID is not set.');
  return id;
}

/** phone: 10-digit Indian mobile number, no country code. */
export async function sendOtp(phone) {
  const mobile = `91${phone}`;
  const url = `${BASE}/otp?template_id=${templateId()}&mobile=${mobile}`;
  const res = await fetch(url, { method: 'POST', headers: { authkey: authKey() } });
  const data = await res.json();
  if (data.type !== 'success') {
    throw new Error(data.message || 'Could not send the verification code. Try again.');
  }
}

export async function verifyOtp(phone, otp) {
  const mobile = `91${phone}`;
  const url = `${BASE}/otp/verify?otp=${encodeURIComponent(otp)}&mobile=${mobile}`;
  const res = await fetch(url, { method: 'POST', headers: { authkey: authKey() } });
  const data = await res.json();
  return data.type === 'success';
}
