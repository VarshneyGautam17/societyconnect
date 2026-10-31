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

/** phone: 10-digit Indian mobile number, no country code. */
export async function sendOtpMessage(phone, code) {
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${requireEnv('WHATSAPP_PHONE_NUMBER_ID')}/messages`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${requireEnv('WHATSAPP_ACCESS_TOKEN')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to: `91${phone}`,
      type: 'template',
      template: {
        name: requireEnv('WHATSAPP_OTP_TEMPLATE_NAME'),
        language: { code: process.env.WHATSAPP_OTP_TEMPLATE_LANG || 'en' },
        // Authentication templates take the code twice: once for the body text, once for the
        // copy-code button.
        components: [
          { type: 'body', parameters: [{ type: 'text', text: code }] },
          { type: 'button', sub_type: 'url', index: '0', parameters: [{ type: 'text', text: code }] }
        ]
      }
    })
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    console.error('WhatsApp send failed:', res.status, data?.error?.message, data?.error?.code);
    throw new Error('Could not send the code on WhatsApp. Check the number and try again.');
  }
}
