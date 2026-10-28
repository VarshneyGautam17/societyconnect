import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/* Supabase email magic-link / OTP sign-in lands here with a `code` param --
   this exchanges it for a session cookie, then sends the browser on to
   wherever it was trying to go (defaults to /admin, the only thing that
   currently uses this flow). */
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/admin';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/admin/login?error=auth`);
}
