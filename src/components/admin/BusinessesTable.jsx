'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { setBusinessEnabled, deleteBusinessPermanently } from '@/app/admin/actions';
import { socOf } from '@/data/societies';
import { catOf } from '@/data/categories';
import { downloadCsv } from '@/lib/exportCsv';
import { stripRichText } from '@/lib/richText';
import { useToast } from '@/components/ui/Toast';
import Icon from '@/components/ui/Icon';

const STATUS_STYLE = {
  approved: 'bg-emerald-100 text-emerald-800',
  pending: 'bg-amber-100 text-amber-800',
  disabled: 'bg-surface-container-high text-on-surface-variant',
  rejected: 'bg-red-100 text-red-800'
};

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

  function onToggle() {
    startTransition(async () => {
      try {
        await setBusinessEnabled(business.id, !enabled);
        toast(enabled ? `${business.name} disabled.` : `${business.name} enabled.`);
      } catch (err) {
        toast(err.message || 'Could not update that listing.');
      }
    });
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
    <tr className="border-t border-outline-variant/30">
      <td className="py-3 pr-4">
        <strong className="block font-label-lg text-label-lg text-on-surface">{business.name}</strong>
        <span className="font-body-sm text-body-sm text-on-surface-variant">{business.area}, {socOf(business.society).name}</span>
      </td>
      <td className="py-3 pr-4 font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap">{catOf(business.cat).name}</td>
      <td className="py-3 pr-4">
        <span className={`font-label-sm text-label-sm font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_STYLE[business.status] || ''}`}>{business.status}</span>
      </td>
      <td className="py-3 pr-4 font-body-sm text-body-sm text-on-surface whitespace-nowrap">
        <strong className="font-label-md text-label-md text-on-surface">{business.views}</strong> views
        <span className="block text-on-surface-variant">{business.contacts} contacts</span>
      </td>
      <td className="py-3 pr-4 font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap">
        {new Date(business.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </td>
      <td className="py-3 pr-4">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onToggle}
            disabled={pending || business.status === 'pending'}
            title={business.status === 'pending' ? 'Review from Vendor requests first' : undefined}
            className="inline-flex items-center px-3 py-1.5 rounded-full border border-outline-variant text-on-surface font-label-sm text-label-sm font-semibold hover:border-primary transition-colors disabled:opacity-50"
          >
            {enabled ? 'Disable' : 'Enable'}
          </button>
          <Link href={`/admin/businesses/${business.id}/edit`} className="inline-flex items-center px-3 py-1.5 rounded-full border border-outline-variant text-on-surface font-label-sm text-label-sm font-semibold hover:border-primary transition-colors">
            Edit
          </Link>
          <button type="button" onClick={onDelete} disabled={pending} className="inline-flex items-center px-3 py-1.5 rounded-full border border-outline-variant text-error font-label-sm text-label-sm font-semibold hover:bg-error hover:text-white transition-colors disabled:opacity-50">
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function BusinessesTable({ businesses }) {
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
    downloadCsv(`societyconnect-businesses-${new Date().toISOString().slice(0, 10)}.csv`, rows, EXPORT_COLUMNS);
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
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="text-left font-label-sm text-label-sm text-on-surface-variant">
              <th className="py-3 px-4 font-semibold">Business</th>
              <th className="py-3 px-4 font-semibold">Category</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Traffic</th>
              <th className="py-3 px-4 font-semibold">Created</th>
              <th className="py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="px-4">
            {filtered.map((b) => <Row key={b.id} business={b} />)}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-8 text-center font-body-md text-body-md text-on-surface-variant">No businesses match.</p>}
      </div>
    </div>
  );
}
