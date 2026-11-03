'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { approveBusiness, rejectBusiness, setBusinessEnabled, deleteBusinessPermanently } from '@/app/admin/actions';
import { socOf } from '@/data/societies';
import { useSocieties } from '@/lib/societies';
import { catOf } from '@/data/categories';
import { downloadCsv } from '@/lib/exportCsv';
import { stripRichText } from '@/lib/richText';
import { useToast } from '@/components/ui/Toast';
import Icon from '@/components/ui/Icon';
import { Spinner } from '@/components/ui/Loaders';

const STATUS_STYLE = {
  approved: 'bg-emerald-100 text-emerald-800',
  pending: 'bg-amber-100 text-amber-800',
  disabled: 'bg-surface-container-high text-on-surface-variant',
  rejected: 'bg-red-100 text-red-800'
};

const STATUS_LABEL = { approved: 'Live', pending: 'Pending review', disabled: 'Switched off', rejected: 'Rejected' };

const EXPORT_COLUMNS = [
  ['name', 'Name'], ['cat', 'Category'], ['society', 'Society'], ['area', 'Area'],
  ['status', 'Status'], ['views', 'Views'], ['contacts', 'Contact attempts'],
  ['phone', 'Phone'], ['whatsapp', 'WhatsApp'], ['verified', 'Verified'],
  ['desc', 'Description'], ['offer', 'Offer'], ['created_at', 'Created'], ['id', 'ID']
];

function Row({ business }) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const enabled = business.status === 'approved';

  function run(action, done) {
    startTransition(async () => {
      try {
        await action();
        toast(done);
      } catch (err) {
        toast(err.message || 'Could not update that listing.');
      }
    });
  }

  function onToggle() {
    run(() => setBusinessEnabled(business.id, !enabled), enabled ? `${business.name} switched off.` : `${business.name} is live again.`);
  }

  function onApprove() {
    run(async () => {
      try {
        await approveBusiness(business.id);
      } catch (err) {
        /* A brand-new society needs coordinates AND a cover photo set before its first listing
           can go live (see approveBusiness, src/app/admin/actions.js) -- that needs a file
           upload, which this dense table row has no room for, so send the admin to Vendor
           requests, which has the full inline setup form, instead of a window.prompt that can
           only ever collect lat/lng. */
        if (!/latitude|longitude|cover photo/i.test(err.message || '')) throw err;
        throw new Error(`${socOf(business.society).name} needs its map location and a cover photo set first -- do that from Vendor requests, then approve from there.`);
      }
    }, `${business.name} approved and live.`);
  }

  function onReject() {
    const reason = window.prompt(`Reject "${business.name}"? Optionally tell the vendor why:`, '');
    if (reason === null) return;
    run(() => rejectBusiness(business.id, reason.trim().slice(0, 500)), `${business.name} rejected.`);
  }

  function onDelete() {
    if (!window.confirm(`Permanently delete "${business.name}"? This cannot be undone -- their enquiries and view history go with it.`)) return;
    startTransition(async () => {
      try {
        await deleteBusinessPermanently(business.id);
        toast(`${business.name} deleted.`);
      } catch (err) {
        toast(err.message || 'Could not delete that listing.');
      }
    });
  }

  return (
    <tr className="border-t border-outline-variant/20 even:bg-surface-container/40 hover:bg-primary-fixed/25 transition-colors">
      <td className="py-3.5 pr-4 pl-4">
        <strong className="block font-label-lg text-label-lg text-on-surface">{business.name}</strong>
        <span className="font-body-sm text-body-sm text-on-surface-variant">{business.area}, {socOf(business.society).name}</span>
      </td>
      <td className="py-3.5 pr-4 font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap">{catOf(business.cat).name}</td>
      <td className="py-3.5 pr-4">
        <span className={`font-label-sm text-label-sm font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_STYLE[business.status] || ''}`}>{STATUS_LABEL[business.status] || business.status}</span>
        {business.status === 'rejected' && business.rejection_reason && (
          <span className="block mt-1 max-w-[180px] font-body-sm text-body-sm text-on-surface-variant line-clamp-2" title={business.rejection_reason}>{business.rejection_reason}</span>
        )}
      </td>
      <td className="py-3.5 pr-4 font-body-sm text-body-sm text-on-surface whitespace-nowrap tabular-nums">
        <strong className="font-label-md text-label-md text-on-surface">{business.views}</strong> views
        <span className="block text-on-surface-variant">{business.contacts} contacts</span>
      </td>
      <td className="py-3.5 pr-4 font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap tabular-nums">
        {new Date(business.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </td>
      <td className="py-3.5 pr-4">
        <div className="flex items-center gap-2 flex-wrap">
          {/* What an admin can do depends on where the listing is: a new submission gets
              approve/reject, a live one can be switched off and back on, a rejected one can
              still be approved if the decision changes. */}
          {(business.status === 'pending' || business.status === 'rejected') && (
            <button type="button" onClick={onApprove} disabled={pending} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-label-sm text-label-sm font-semibold transition-colors disabled:opacity-50 bg-primary border-primary text-on-primary hover:bg-primary-container">
              {pending && <Spinner className="w-3.5 h-3.5" />}
              Approve
            </button>
          )}
          {business.status === 'pending' && (
            <button type="button" onClick={onReject} disabled={pending} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-label-sm text-label-sm font-semibold transition-colors disabled:opacity-50 border-outline-variant text-on-surface hover:border-error hover:text-error">
              Reject
            </button>
          )}
          {(business.status === 'approved' || business.status === 'disabled') && (
            <button type="button" onClick={onToggle} disabled={pending} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-label-sm text-label-sm font-semibold transition-colors disabled:opacity-50 border-outline-variant text-on-surface hover:border-primary">
              {pending && <Spinner className="w-3.5 h-3.5" />}
              {enabled ? 'Switch off' : 'Switch on'}
            </button>
          )}
          <Link href={`/admin/businesses/${business.id}/edit`} className="inline-flex items-center px-3 py-1.5 rounded-full border border-outline-variant text-on-surface font-label-sm text-label-sm font-semibold hover:border-primary transition-colors">
            Edit
          </Link>
          <button type="button" onClick={onDelete} disabled={pending} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-outline-variant text-error font-label-sm text-label-sm font-semibold hover:bg-error hover:text-white transition-colors disabled:opacity-50">
            {pending && <Spinner className="w-3.5 h-3.5" />}
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function BusinessesTable({ businesses }) {
  useSocieties(); // re-render once the database society list loads (socOf below reads it)
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return businesses.filter((b) => {
      if (status !== 'all' && b.status !== status) return false;
      if (!needle) return true;
      return (b.name + ' ' + b.area).toLowerCase().includes(needle);
    });
  }, [businesses, q, status]);

  function onExport() {
    const rows = filtered.map((b) => ({ ...b, desc: stripRichText(b.desc), verified: b.verified ? 'yes' : 'no' }));
    downloadCsv(`societyspot-businesses-${new Date().toISOString().slice(0, 10)}.csv`, rows, EXPORT_COLUMNS);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name or area"
          className="min-h-[44px] rounded-2xl border border-outline-variant px-4 font-body-md text-body-md focus:border-primary focus:outline-none flex-1 min-w-[220px]"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="min-h-[44px] rounded-2xl border border-outline-variant px-3 font-label-md text-label-md text-on-surface">
          <option value="all">All statuses</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="disabled">Disabled</option>
          <option value="rejected">Rejected</option>
        </select>
        <button type="button" onClick={onExport} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors">
          <Icon name="download" className="text-lg" />
          Export to Excel ({filtered.length})
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="text-left font-label-sm text-label-sm text-on-surface-variant">
              <th className="sticky top-0 z-10 bg-surface-container-lowest py-3 px-4 font-semibold uppercase tracking-wide border-b-2 border-outline-variant/40">Business</th>
              <th className="sticky top-0 z-10 bg-surface-container-lowest py-3 px-4 font-semibold uppercase tracking-wide border-b-2 border-outline-variant/40">Category</th>
              <th className="sticky top-0 z-10 bg-surface-container-lowest py-3 px-4 font-semibold uppercase tracking-wide border-b-2 border-outline-variant/40">Status</th>
              <th className="sticky top-0 z-10 bg-surface-container-lowest py-3 px-4 font-semibold uppercase tracking-wide border-b-2 border-outline-variant/40">Traffic</th>
              <th className="sticky top-0 z-10 bg-surface-container-lowest py-3 px-4 font-semibold uppercase tracking-wide border-b-2 border-outline-variant/40">Created</th>
              <th className="sticky top-0 z-10 bg-surface-container-lowest py-3 px-4 font-semibold uppercase tracking-wide border-b-2 border-outline-variant/40">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => <Row key={b.id} business={b} />)}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-8 text-center font-body-md text-body-md text-on-surface-variant">No businesses match.</p>}
      </div>
    </div>
  );
}
