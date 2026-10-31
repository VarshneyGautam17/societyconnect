'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminSignIn } from './actions';
import Icon from '@/components/ui/Icon';

const inputCls = 'min-h-[48px] rounded-2xl border border-outline-variant px-4 font-body-md text-body-md focus:border-primary focus:outline-none';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    let res;
    try {
      res = await adminSignIn(email, password);
    } catch {
      res = { error: 'Could not sign in right now. Try again.' };
    }
    if (res.error) {
      setLoading(false);
      setPassword('');
      setError(res.error);
      return;
    }
    router.replace('/admin');
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary mb-5">
          <Icon name="shield" className="text-2xl" filled />
        </div>
        <h1 className="font-headline-sm text-headline-sm text-on-surface mb-1">Admin sign in</h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">Only approved admin accounts can access this area.</p>

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            maxLength={254}
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            aria-label="Email"
            className={inputCls}
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              maxLength={200}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              aria-label="Password"
              className={`${inputCls} w-full pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-outline hover:text-on-surface"
            >
              <Icon name={showPassword ? 'visibility_off' : 'visibility'} className="text-xl" />
            </button>
          </div>
          {error && <span role="alert" className="font-body-sm text-body-sm text-error">{error}</span>}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-semibold hover:bg-primary-container transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
