'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { approveBusiness, rejectBusiness } from '@/app/admin/actions';
import { socOf } from '@/data/societies';
import { catOf } from '@/data/categories';
import RichText from '@/components/ui/RichText';
import { useToast } from '@/components/ui/Toast';

function VendorRow({ business }) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');

  function onApprove() {
    startTransition(async () => {
      try {
        await approveBusiness(business.id);
        toast(`${business.name} approved -- now live.`);
      } catch (err) {
        toast(err.message || 'Could not approve that listing.');
      }
    });
  }

  function onReject() {
    startTransition(async () => {
      try {
        await rejectBusiness(business.id, reason);
        toast(`${business.name} rejected.`);
      } catch (err) {
        toast(err.message || 'Could not reject that listing.');
      }
    });
  }

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/30 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <strong className="font-headline-sm text-headline-sm text-on-surface">{business.name}</strong>
            <span className="font-label-sm text-label-sm font-bold px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant">{catOf(business.cat).name}</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            {business.area}, {socOf(business.society).name} &middot; {business.phone} &middot; submitted {new Date(business.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 max-w-2xl"><RichText text={business.desc} /></p>
        </div>
        <div className="flex items-center gap-2 flex-none">
          <Link href={`/business/${business.id}`} target="_blank" className="font-label-md text-label-md font-semibold text-primary hover:underline">Preview</Link>
          <button type="button" onClick={onApprove} disabled={pending} className="inline-flex items-center px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors disabled:opacity-60">Approve</button>
          <button type="button" onClick={() => setRejecting((r) => !r)} disabled={pending} className="inline-flex items-center px-4 py-2 rounded-full border border-outline-variant text-on-surface font-label-md text-label-md font-semibold hover:border-error hover:text-error transition-colors disabled:opacity-60">Reject</button>
        </div>
      </div>
      {rejecting && (
        <div className="mt-3 pt-3 border-t border-outline-variant/30 flex flex-wrap items-center gap-2">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason (shown to the vendor, optional)"
            className="flex-1 min-w-[220px] min-h-[40px] rounded-xl border border-outline-variant px-3 font-body-sm text-body-sm focus:border-primary focus:outline-none"
          />
          <button type="button" onClick={onReject} disabled={pending} className="inline-flex items-center px-4 py-2 rounded-full bg-error text-white font-label-md text-label-md font-semibold disabled:opacity-60">Confirm reject</button>
        </div>
      )}
    </div>
  );
}

export default function VendorQueue({ businesses }) {
  if (!businesses.length) {
    return (
      <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-3xl p-10 text-center">
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Nothing waiting</h3>
        <p className="text-on-surface-variant font-body-md text-body-md">New vendor submissions will show up here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {businesses.map((b) => <VendorRow key={b.id} business={b} />)}
    </div>
  );
}
