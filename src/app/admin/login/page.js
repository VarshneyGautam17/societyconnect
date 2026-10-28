'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Icon from '@/components/ui/Icon';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin` }
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
      return;
    }
    setSent(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary mb-5">
          <Icon name="shield" className="text-2xl" filled />
        </div>
        <h1 className="font-headline-sm text-headline-sm text-on-surface mb-1">Admin sign in</h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">Only approved admin accounts can access this area.</p>

        {sent ? (
          <p className="font-body-md text-body-md text-on-surface">
            Check <strong>{email}</strong> for a sign-in link. You can close this tab.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="min-h-[48px] rounded-2xl border border-outline-variant px-4 font-body-md text-body-md focus:border-primary focus:outline-none"
            />
            {error && <span className="font-body-sm text-body-sm text-error">{error}</span>}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-semibold hover:bg-primary-container transition-colors disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send sign-in link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
