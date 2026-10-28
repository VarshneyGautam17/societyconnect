'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addEnquiry } from '@/store/slices/enquiriesSlice';
import { recordEvent } from '@/store/slices/eventsSlice';
import { sendEnquiryOtp, submitVerifiedEnquiry } from '@/app/business/actions';
import { useToast } from '@/components/ui/Toast';

/** For a real (Supabase-backed) business, an enquiry requires a verified
 *  phone number -- see src/app/business/actions.js. The 20 local demo
 *  businesses skip this (isRemote=false): there's no real vendor on the
 *  other end to protect from spam, so it stays the simple one-step form. */
export default function EnquiryForm({ businessId, isRemote = false }) {
  const dispatch = useDispatch();
  const toast = useToast();
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function resetForm() {
    setName('');
    setMsg('');
    setPhone('');
    setOtp('');
    setOtpSent(false);
  }

  async function onSubmitLocal(e) {
    e.preventDefault();
    if (!name.trim() || !msg.trim()) {
      setError('Please add your name and a short message.');
      return;
    }
    setError('');
    dispatch(addEnquiry({ biz: businessId, who: name.trim(), msg: msg.trim(), t: Date.now() }));
    dispatch(recordEvent({ type: 'enquiry', id: businessId }));
    resetForm();
    toast('Enquiry sent. The vendor will see it in their dashboard.');
  }

  async function onSendCode(e) {
    e.preventDefault();
    if (!name.trim() || !msg.trim()) {
      setError('Please add your name and a short message first.');
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      await sendEnquiryOtp(phone);
      setOtpSent(true);
      toast(`Code sent to ${phone}.`);
    } catch (err) {
      setError(err.message || 'Could not send a code. Try again.');
    } finally {
      setBusy(false);
    }
  }

  async function onVerifyAndSend(e) {
    e.preventDefault();
    if (!/^\d{4,6}$/.test(otp)) {
      setError('Enter the code you received.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      await submitVerifiedEnquiry({ businessId, name, msg, phone, otp });
      resetForm();
      toast('Enquiry sent. The vendor will see it in their dashboard.');
    } catch (err) {
      setError(err.message || 'Could not verify that code.');
    } finally {
      setBusy(false);
    }
  }

  if (!isRemote) {
    return (
      <form onSubmit={onSubmitLocal} className="flex flex-col gap-3" noValidate>
        <label className="block font-label-md text-label-md font-semibold text-on-surface">
          Your name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            className="block w-full mt-2 min-h-[44px] rounded-2xl border border-outline-variant px-4 font-body-md text-body-md focus:border-primary focus:outline-none"
          />
        </label>
        <label className="block font-label-md text-label-md font-semibold text-on-surface">
          Message
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            rows={3}
            placeholder="What would you like to know?"
            className="block w-full mt-2 rounded-2xl border border-outline-variant px-4 py-3 font-body-md text-body-md focus:border-primary focus:outline-none"
          />
        </label>
        {error && <span className="font-body-sm text-body-sm text-error">{error}</span>}
        <button type="submit" className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-semibold hover:bg-primary-container transition-colors">
          Send enquiry
        </button>
        <p className="font-body-sm text-body-sm text-on-surface-variant">Demo: in the live product you would be asked to log in so the vendor can reply.</p>
      </form>
    );
  }

  return (
    <form onSubmit={otpSent ? onVerifyAndSend : onSendCode} className="flex flex-col gap-3" noValidate>
      <label className="block font-label-md text-label-md font-semibold text-on-surface">
        Your name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          disabled={otpSent}
          className="block w-full mt-2 min-h-[44px] rounded-2xl border border-outline-variant px-4 font-body-md text-body-md focus:border-primary focus:outline-none disabled:bg-surface-container-high"
        />
      </label>
      <label className="block font-label-md text-label-md font-semibold text-on-surface">
        Message
        <textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          rows={3}
          placeholder="What would you like to know?"
          disabled={otpSent}
          className="block w-full mt-2 rounded-2xl border border-outline-variant px-4 py-3 font-body-md text-body-md focus:border-primary focus:outline-none disabled:bg-surface-container-high"
        />
      </label>
      <label className="block font-label-md text-label-md font-semibold text-on-surface">
        Mobile number
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
          inputMode="numeric"
          maxLength={10}
          placeholder="10-digit mobile number"
          disabled={otpSent}
          className="block w-full mt-2 min-h-[44px] rounded-2xl border border-outline-variant px-4 font-body-md text-body-md focus:border-primary focus:outline-none disabled:bg-surface-container-high"
        />
      </label>
      {otpSent && (
        <label className="block font-label-md text-label-md font-semibold text-on-surface">
          Verification code
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            inputMode="numeric"
            maxLength={6}
            placeholder="Code sent by SMS"
            className="block w-full mt-2 min-h-[44px] rounded-2xl border border-outline-variant px-4 font-body-md text-body-md focus:border-primary focus:outline-none"
          />
        </label>
      )}
      {error && <span className="font-body-sm text-body-sm text-error">{error}</span>}
      <button type="submit" disabled={busy} className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-semibold hover:bg-primary-container transition-colors disabled:opacity-60">
        {busy ? 'Please wait...' : otpSent ? 'Verify and send' : 'Send verification code'}
      </button>
      <p className="font-body-sm text-body-sm text-on-surface-variant">We verify your number so vendors only hear from real neighbors.</p>
    </form>
  );
}
