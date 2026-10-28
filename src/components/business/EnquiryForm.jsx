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
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    if (!name.trim() || !msg.trim()) {
      setError('Please add your name and a short message.');
      return;
    }
    setError('');
    if (isRemote) {
      const supabase = createClient();
      const { error: insertError } = await supabase.from('enquiries').insert({ business_id: businessId, who: name.trim(), msg: msg.trim() });
      if (insertError) {
        toast('Could not send that enquiry. Try again.');
        return;
      }
      supabase.from('events').insert({ business_id: businessId, type: 'enquiry' });
    } else {
      dispatch(addEnquiry({ biz: businessId, who: name.trim(), msg: msg.trim(), t: Date.now() }));
      dispatch(recordEvent({ type: 'enquiry', id: businessId }));
    }
    setName('');
    setMsg('');
    toast('Enquiry sent. The vendor will see it in their dashboard.');
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3" noValidate>
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
