'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { adminUpdateBusiness } from '@/app/admin/actions';
import { dbRowToFormVendor, formVendorToDbPatch } from '@/lib/businessMapper';
import { useToast } from '@/components/ui/Toast';
import BasicInfoForm from '@/components/edit/BasicInfoForm';
import PhotoManager from '@/components/edit/PhotoManager';
import ItemsEditor from '@/components/edit/ItemsEditor';
import HoursEditor from '@/components/edit/HoursEditor';
import ServedContactPanel from '@/components/edit/ServedContactPanel';
import OffersForm from '@/components/edit/OffersForm';

export default function AdminBusinessEditor({ row }) {
  const toast = useToast();
  const [v, setV] = useState(() => dbRowToFormVendor(row));
  const [pending, startTransition] = useTransition();

  function patch(partial) {
    setV((prev) => ({ ...prev, ...partial }));
  }

  function onSave() {
    if (!v.name.trim()) {
      toast('Business name is required.');
      return;
    }
    startTransition(async () => {
      try {
        await adminUpdateBusiness(row.id, formVendorToDbPatch(v));
        toast('Saved.');
      } catch (err) {
        toast(err.message || 'Could not save those changes.');
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/businesses" className="font-label-md text-label-md font-semibold text-on-surface-variant hover:text-primary transition-colors">&larr; All businesses</Link>
          <h1 className="font-headline-lg text-headline-md text-on-surface tracking-tight mt-1">Editing {row.name}</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Status: <strong>{row.status}</strong>
            {' '}&middot; use &ldquo;All businesses&rdquo; to enable/disable or delete -- this page only edits the listing content.
          </p>
        </div>
        <button
          type="button"
          onClick={onSave}
          disabled={pending}
          className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-semibold hover:bg-primary-container shadow-sm transition-colors disabled:opacity-60"
        >
          {pending ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      <label className="inline-flex items-center gap-2.5 font-body-md text-body-md text-on-surface bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant/30 w-fit">
        <input type="checkbox" checked={v.verified} onChange={(e) => patch({ verified: e.target.checked })} className="w-5 h-5 accent-primary" />
        Verified listing (shows the &ldquo;Verified&rdquo; badge to residents)
      </label>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="flex flex-col gap-6">
          <BasicInfoForm v={v} patch={patch} />
          <PhotoManager v={v} patch={patch} />
          <ItemsEditor items={v.items} onChange={(items) => patch({ items })} />
        </div>
        <div className="flex flex-col gap-6">
          <HoursEditor hours={v.hours} onChange={(hours) => patch({ hours })} />
          <ServedContactPanel v={v} patch={patch} />
          <OffersForm v={v} patch={patch} />
        </div>
      </div>
    </div>
  );
}
