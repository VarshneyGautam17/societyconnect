'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { unlockAccess } from '@/store/slices/accessSlice';
import Icon from '@/components/ui/Icon';

/** Gates full business details behind a mobile number. Landing/directory pages still render
 *  underneath (basic cards only -- see BizCard), this just sits on top until unlocked, then
 *  self-removes. Bottom sheet on phones, centered dialog at sm:+, matching how Zomato/Swiggy
 *  present this kind of one-field entry step. */
export default function AccessGate() {
  const dispatch = useDispatch();
  const unlocked = useSelector((state) => state.access.unlocked);
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  if (unlocked) return null;

  function onSubmit(e) {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone)) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    dispatch(unlockAccess(phone));
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-on-surface/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="access-gate-title"
    >
      <div className="w-full sm:max-w-sm bg-surface-container-lowest rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl animate-gate-slide-up">
        <div className="w-10 h-10 rounded-xl bg-primary-fixed text-primary flex items-center justify-center mb-3">
          <Icon name="storefront" className="text-xl" filled />
        </div>
        <h2 id="access-gate-title" className="font-headline-sm text-label-lg sm:text-headline-sm text-on-surface mb-1">
          See what&apos;s around you
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
          Enter your mobile number to unlock full details, offers and contact options for businesses in your society.
        </p>
        <form onSubmit={onSubmit} className="flex flex-col gap-2.5">
          <div className={`flex items-center gap-2 min-h-[48px] rounded-2xl border px-4 focus-within:border-primary ${error ? 'border-error' : 'border-outline-variant'}`}>
            <span className="font-label-md text-label-md font-semibold text-on-surface-variant">+91</span>
            <input
              autoFocus
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError(''); }}
              placeholder="10-digit mobile number"
              aria-label="Mobile number"
              className="flex-1 bg-transparent font-body-sm md:font-body-md text-body-sm md:text-body-md text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
            />
          </div>
          {error && <span className="font-body-sm text-body-sm text-error">{error}</span>}
          <button
            type="submit"
            className="w-full min-h-[48px] rounded-full bg-primary text-on-primary font-label-md md:font-label-lg text-label-md md:text-label-lg font-bold shadow-sm hover:bg-primary-container transition-colors active:scale-[0.98]"
          >
            Continue
          </button>
        </form>
        <p className="font-body-sm text-body-sm text-on-surface-variant/80 mt-3 text-center">
          No OTP, no spam calls. Just used to show you relevant local businesses.
        </p>
      </div>
    </div>
  );
}
