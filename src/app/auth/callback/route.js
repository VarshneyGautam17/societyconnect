import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/* Supabase email magic-link / OTP sign-in lands here with a `code` param --
   this exchanges it for a session cookie, then sends the browser on to
   wherever it was trying to go (defaults to /admin, the only thing that
   currently uses this flow). */

/** Only ever allow redirecting back into this same app. `next` comes straight off the URL
 *  (an attacker-crafted link), so naively concatenating it into a redirect is an open-redirect
 *  bug: "@evil.com" turns "{origin}{next}" into "https://thisapp.com@evil.com" (parsed as
 *  userinfo + host evil.com), and ".evil.com" turns it into a subdomain of evil.com. Requiring
 *  a single leading "/" (not "//", which is protocol-relative to an external host) closes both. */
function safeNextPath(next) {
  if (typeof next !== 'string') return null;
  if (!next.startsWith('/') || next.startsWith('//')) return null;
  if (next.includes('\\') || next.includes('@')) return null;
  return next;
}

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = safeNextPath(searchParams.get('next')) || '/admin';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/admin/login?error=auth`);
}
