'use server';

import { createServiceRoleClient } from '@/lib/supabase/serviceRole';
import { sendOtp, verifyOtp } from '@/lib/msg91';

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 3;

function isValidPhone(phone) {
  return /^\d{10}$/.test(phone || '');
}

export async function sendEnquiryOtp(phone) {
  if (!isValidPhone(phone)) throw new Error('Enter a valid 10-digit mobile number.');

  const supabase = createServiceRoleClient();
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const { count } = await supabase
    .from('phone_otp_requests')
    .select('id', { count: 'exact', head: true })
    .eq('phone', phone)
    .eq('purpose', 'enquiry')
    .gte('created_at', since);

  if ((count || 0) >= RATE_LIMIT_MAX) {
    throw new Error('Too many codes requested for this number recently. Try again in an hour.');
  }

  await sendOtp(phone);
  await supabase.from('phone_otp_requests').insert({ phone, purpose: 'enquiry' });
}

export async function submitVerifiedEnquiry({ businessId, name, msg, phone, otp }) {
  if (!isValidPhone(phone)) throw new Error('Enter a valid 10-digit mobile number.');
  if (!name?.trim() || !msg?.trim()) throw new Error('Add your name and a message.');

  const verified = await verifyOtp(phone, otp);
  if (!verified) throw new Error('That code is incorrect or has expired.');

  const supabase = createServiceRoleClient();
  const { data: business } = await supabase.from('businesses').select('id, status').eq('id', businessId).maybeSingle();
  if (!business || business.status !== 'approved') throw new Error('This business is not accepting enquiries right now.');

  const { error } = await supabase.from('enquiries').insert({
    business_id: businessId,
    who: name.trim(),
    msg: msg.trim(),
    phone,
    phone_verified: true
  });
  if (error) throw new Error('Could not send that enquiry. Try again.');

  await supabase.from('events').insert({ business_id: businessId, type: 'enquiry' });
}
