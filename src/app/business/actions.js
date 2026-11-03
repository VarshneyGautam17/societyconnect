'use server';

import { createServiceRoleClient } from '@/lib/supabase/serviceRole';
import { getResidentSession } from '@/app/access/actions';
import { alertTemplateConfigured, sendVendorAlert } from '@/lib/whatsapp';

/* Notifies a vendor on WhatsApp when a resident reveals their number, opens a WhatsApp chat,
   taps Call, or sends an enquiry -- using the resident's own verified phone (from their
   WhatsApp-login session, see src/app/access/actions.js), so the vendor gets a real lead's
   number instead of an anonymous "someone visited" ping. Needs a second, separately-approved
   WhatsApp template beyond the login one (Utility category, 3 body variables: business name,
   what happened, the resident's number) -- see WHATSAPP_ALERT_TEMPLATE_NAME in
   .env.local.example. Until that template exists and is approved, alertTemplateConfigured()
   is false and these functions still record the event but skip the WhatsApp send, so nothing
   breaks while the template is pending review.
   Every function here is fire-and-forget from the caller's point of view: never throws, so a
   WhatsApp outage never blocks a resident's click. */

const ACTION_TEXT = {
  reveal: 'A resident viewed your phone number',
  whatsapp: 'A resident opened a WhatsApp chat with you',
  call: 'A resident tried to call you'
};
const COOLDOWN_MS = 24 * 60 * 60 * 1000;
const ALERT_TYPES = ['reveal', 'whatsapp', 'call', 'enquiry'];

async function recentlyNotified(supabase, businessId, visitorPhone) {
  if (!visitorPhone) return false;
  const { data } = await supabase
    .from('events')
    .select('id')
    .eq('business_id', businessId)
    .in('type', ALERT_TYPES)
    .eq('visitor_phone', visitorPhone)
    .gte('created_at', new Date(Date.now() - COOLDOWN_MS).toISOString())
    .limit(1);
  return Boolean(data?.length);
}


async function recordAndAlert(businessId, type, actionText) {
  const supabase = createServiceRoleClient();
  const session = await getResidentSession();
  const visitorPhone = session?.phone || '';

  const alreadyNotified = await recentlyNotified(supabase, businessId, visitorPhone);
  await supabase.from('events').insert({ business_id: businessId, type, visitor_phone: visitorPhone });
  if (alreadyNotified || !alertTemplateConfigured()) return;

  const { data: business } = await supabase.from('businesses').select('name, whatsapp').eq('id', businessId).eq('status', 'approved').maybeSingle();
  if (!business) return;

  await sendVendorAlert(business.whatsapp, business.name, actionText, visitorPhone ? `+91 ${visitorPhone}` : 'Not shared (visitor not signed in)');
}

export async function recordContact(businessId, type) {
  if (!['reveal', 'whatsapp', 'call'].includes(type)) return;
  try {
    await recordAndAlert(businessId, type, ACTION_TEXT[type]);
  } catch (err) {
    console.error('[business] recordContact failed:', err.message);
  }
}

export async function notifyVendorEnquiry(businessId, who, msg) {
  try {
    // Template parameters can't contain newlines/tabs or runs of spaces (Meta rejects the send).
    const preview = String(msg || '').replace(/\s+/g, ' ').trim().slice(0, 120).replace(/[.\s]+$/, '');
    const name = String(who || '').replace(/\s+/g, ' ').trim().slice(0, 40);
    await recordAndAlert(businessId, 'enquiry', `A resident${name ? ` (${name})` : ''} sent an enquiry: "${preview}"`);
  } catch (err) {
    console.error('[business] notifyVendorEnquiry failed:', err.message);
  }
}
