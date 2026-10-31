'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unlockAccess } from '@/store/slices/accessSlice';
import { sendLoginOtp, verifyLoginOtp } from '@/app/access/actions';
import Icon from '@/components/ui/Icon';

const RESEND_SECONDS = 30;
/* Off until the WhatsApp login template is approved -- set NEXT_PUBLIC_ACCESS_GATE_ENABLED=true
   (locally and on the host) to turn the gate on. */
const GATE_ENABLED = process.env.NEXT_PUBLIC_ACCESS_GATE_ENABLED === 'true';

/** Gates the resident-facing site behind a WhatsApp-verified mobile number: number -> 6-digit
 *  code sent on WhatsApp -> verified server-side, which sets the session cookie (see
 *  src/app/access/actions.js). Pages still render underneath; this sits on top until unlocked,
 *  then self-removes. Bottom sheet on phones, centered dialog at sm:+, matching how
 *  Zomato/Swiggy present this kind of entry step. */
export default function AccessGate() {
  const dispatch = useDispatch();
  const unlocked = useSelector((state) => state.access.unlocked);
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  if (!GATE_ENABLED || unlocked) return null;

  async function requestCode() {
    setBusy(true);
    setError('');
    const res = await sendLoginOtp(phone).catch(() => ({ error: 'Network error. Try again.' }));
    setBusy(false);
    if (res.error) {
      setError(res.error);
      return false;
    }
    setResendIn(RESEND_SECONDS);
    return true;
  }

  async function onSubmitPhone(e) {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone)) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    if (await requestCode()) {
      setCode('');
      setStep('code');
    }
  }

  async function onSubmitCode(e) {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit code.');
      return;
    }
    setBusy(true);
    setError('');
    const res = await verifyLoginOtp(phone, code).catch(() => ({ error: 'Network error. Try again.' }));
    setBusy(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    dispatch(unlockAccess(res.phone));
  }

  function changeNumber() {
    setStep('phone');
    setCode('');
    setError('');
  }

  const fieldClass = `flex items-center gap-2 min-h-[48px] rounded-2xl border px-4 focus-within:border-primary ${error ? 'border-error' : 'border-outline-variant'}`;
  const inputClass = 'flex-1 bg-transparent font-body-sm md:font-body-md text-body-sm md:text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none';
  const buttonClass = 'w-full min-h-[48px] rounded-full bg-primary text-on-primary font-label-md md:font-label-lg text-label-md md:text-label-lg font-bold shadow-sm hover:bg-primary-container transition-colors active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-on-surface/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="access-gate-title"
    >
      <div className="w-full sm:max-w-sm glass-strong rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl animate-gate-slide-up">
        <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center mb-3">
          <Icon name={step === 'phone' ? 'storefront' : 'sms'} className="text-xl" filled />
        </div>

        {step === 'phone' ? (
          <>
            <h2 id="access-gate-title" className="font-headline-sm text-label-lg sm:text-headline-sm text-on-surface mb-1">
              See what&apos;s around you
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
              Enter your mobile number to unlock full details, offers and contact options for businesses in your society.
            </p>
            <form onSubmit={onSubmitPhone} className="flex flex-col gap-2.5">
              <div className={fieldClass}>
                <span className="font-label-md text-label-md font-semibold text-on-surface-variant">+91</span>
                <input
                  autoFocus
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError(''); }}
                  placeholder="10-digit mobile number"
                  aria-label="Mobile number"
                  className={inputClass}
                />
              </div>
              {error && <span className="font-body-sm text-body-sm text-error">{error}</span>}
              <button type="submit" disabled={busy} className={buttonClass}>
                {busy ? 'Sending code…' : 'Send code on WhatsApp'}
              </button>
            </form>
            <p className="font-body-sm text-body-sm text-on-surface-variant/80 mt-3 text-center">
              We&apos;ll send a one-time code to this number on WhatsApp. No spam calls.
            </p>
          </>
        ) : (
          <>
            <h2 id="access-gate-title" className="font-headline-sm text-label-lg sm:text-headline-sm text-on-surface mb-1">
              Enter the code
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
              We sent a 6-digit code on WhatsApp to <span className="font-semibold text-on-surface">+91 {phone}</span>.{' '}
              <button type="button" onClick={changeNumber} className="text-primary font-semibold hover:underline">
                Change
              </button>
            </p>
            <form onSubmit={onSubmitCode} className="flex flex-col gap-2.5">
              <div className={fieldClass}>
                <input
                  autoFocus
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={code}
                  onChange={(e) => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                  placeholder="••••••"
                  aria-label="6-digit code"
                  className={`${inputClass} text-center tracking-[0.5em] font-semibold`}
                />
              </div>
              {error && <span className="font-body-sm text-body-sm text-error">{error}</span>}
              <button type="submit" disabled={busy} className={buttonClass}>
                {busy ? 'Verifying…' : 'Verify & continue'}
              </button>
            </form>
            <p className="font-body-sm text-body-sm text-on-surface-variant/80 mt-3 text-center">
              {resendIn > 0 ? (
                `Resend code in ${resendIn}s`
              ) : (
                <button type="button" onClick={requestCode} disabled={busy} className="text-primary font-semibold hover:underline disabled:opacity-60">
                  Resend code
                </button>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
