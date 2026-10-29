'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addEnquiry } from '@/store/slices/enquiriesSlice';
import { recordEvent } from '@/store/slices/eventsSlice';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/Toast';

export default function EnquiryForm({ businessId, isRemote = false }) {
  const dispatch = useDispatch();
  const toast = useToast();
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [company, setCompany] = useState(''); // honeypot: real visitors never see or fill this field
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    if (company) {
      // Bot filled the hidden field -- pretend success without sending anything.
      setName('');
      setMsg('');
      toast('Enquiry sent. The vendor will see it in their dashboard.');
      return;
    }
    const trimmedName = name.trim().slice(0, 100);
    const trimmedMsg = msg.trim().slice(0, 1000);
    if (!trimmedName || !trimmedMsg) {
      setError('Please add your name and a short message.');
      return;
    }
    setError('');
    if (isRemote) {
      const supabase = createClient();
      const { error: insertError } = await supabase.from('enquiries').insert({ business_id: businessId, who: trimmedName, msg: trimmedMsg });
      if (insertError) {
        toast('Could not send that enquiry. Try again.');
        return;
      }
      supabase.from('events').insert({ business_id: businessId, type: 'enquiry' });
    } else {
      dispatch(addEnquiry({ biz: businessId, who: trimmedName, msg: trimmedMsg, t: Date.now() }));
      dispatch(recordEvent({ type: 'enquiry', id: businessId }));
    }
    setName('');
    setMsg('');
    toast('Enquiry sent. The vendor will see it in their dashboard.');
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3" noValidate>
      {/* Honeypot: hidden from real visitors (and unlabeled, off-screen) but visible to form-filling bots. */}
      <label className="absolute w-px h-px overflow-hidden opacity-0 pointer-events-none" aria-hidden="true" tabIndex={-1}>
        Company
        <input value={company} onChange={(e) => setCompany(e.target.value)} tabIndex={-1} autoComplete="off" />
      </label>
      <label className="block font-label-md text-label-md font-semibold text-on-surface">
        Your name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          maxLength={100}
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
          maxLength={1000}
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
