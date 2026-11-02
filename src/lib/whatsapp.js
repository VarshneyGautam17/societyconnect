import 'server-only';

/* WhatsApp Cloud API -- sends the login code through an "Authentication" category template
   (Meta requires a pre-approved template for any business-initiated message; create one in
   WhatsApp Manager -> Message templates, category Authentication, with a "Copy code" button).
   Docs: https://developers.facebook.com/docs/whatsapp/business-management-api/authentication-templates */

const GRAPH_VERSION = 'v23.0';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set.`);
  return value;
}

/** True once the token/number/template are configured -- lets dev run the login flow
 *  (code printed to the server console) before the template is approved. */
export function whatsappConfigured() {
  const token = process.env.WHATSAPP_ACCESS_TOKEN || '';
  return Boolean(token && !token.includes('dummy') && process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_OTP_TEMPLATE_NAME);
}

/** Sends an approved template message. `to` is a 10-digit Indian mobile number, no country
 *  code. `components` follows the Graph API shape -- see callers below. Throws with the
 *  caller's own message (never the raw Graph error, which can leak account details) on failure. */
async function sendTemplate(to, templateName, templateLang, components, failureMessage) {
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${requireEnv('WHATSAPP_PHONE_NUMBER_ID')}/messages`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${requireEnv('WHATSAPP_ACCESS_TOKEN')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: `91${to}`,
      type: 'template',
      template: { name: templateName, language: { code: templateLang }, components }
    })
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.error('WhatsApp send failed:', res.status, data?.error?.message, data?.error?.code);
    throw new Error(failureMessage);
  }
}

/** phone: 10-digit Indian mobile number, no country code. */
export async function sendOtpMessage(phone, code) {
  await sendTemplate(
    phone,
    requireEnv('WHATSAPP_OTP_TEMPLATE_NAME'),
    process.env.WHATSAPP_OTP_TEMPLATE_LANG || 'en',
    // Authentication templates take the code twice: once for the body text, once for the
    // copy-code button.
    [
      { type: 'body', parameters: [{ type: 'text', text: code }] },
      { type: 'button', sub_type: 'url', index: '0', parameters: [{ type: 'text', text: code }] }
    ],
    'Could not send the code on WhatsApp. Check the number and try again.'
  );
}

/** True once a Utility-category "vendor got some activity" template is configured. Separate
 *  from whatsappConfigured() -- the token/number/OTP template can be set up without this one
 *  existing yet (it needs its own Meta approval, see AGENTS.md-adjacent notes in business/actions.js). */
export function alertTemplateConfigured() {
  return whatsappConfigured() && Boolean(process.env.WHATSAPP_ALERT_TEMPLATE_NAME);
}

/** Notifies a vendor of activity on their listing. `vendorWhatsapp` is the business's own
 *  stored contact number (any of the app's formatted shapes, e.g. "+91 98765 43210") -- the
 *  same number a resident would otherwise message directly. Silently no-ops for a number that
 *  doesn't look like a real Indian mobile, rather than throwing over bad/legacy data. */
export async function sendVendorAlert(vendorWhatsapp, businessName, actionText, visitorLine) {
  const digits = String(vendorWhatsapp || '').replace(/\D/g, '').slice(-10);
  if (!/^[6-9]\d{9}$/.test(digits)) return;
  await sendTemplate(
    digits,
    requireEnv('WHATSAPP_ALERT_TEMPLATE_NAME'),
    process.env.WHATSAPP_ALERT_TEMPLATE_LANG || 'en',
    [{ type: 'body', parameters: [businessName, actionText, visitorLine].map((text) => ({ type: 'text', text: String(text).replace(/\s+/g, ' ').trim() })) }],
    'Could not send the vendor alert on WhatsApp.'
  );
}
