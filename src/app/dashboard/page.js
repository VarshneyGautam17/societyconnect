'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { updateVendor } from '@/store/slices/vendorSlice';
import { getListingData } from '@/app/onboarding/listing';
import Icon from '@/components/ui/Icon';
import { useToast } from '@/components/ui/Toast';
import Sidebar from '@/components/dashboard/Sidebar';
import StatsGrid from '@/components/dashboard/StatsGrid';
import ActivityChart from '@/components/dashboard/ActivityChart';
import CompletionChecklist from '@/components/dashboard/CompletionChecklist';
import EnquiriesList from '@/components/dashboard/EnquiriesList';

export default function DashboardPage() {
  const toast = useToast();
  const storedVendor = useSelector((state) => state.vendor.current);
  const events = useSelector((state) => state.events.list);
  const enquiries = useSelector((state) => state.enquiries.list);
  const savedIds = useSelector((state) => state.saved.ids);

  const dispatch = useDispatch();
  const live = !!(storedVendor && storedVendor.published);
  const vendor = storedVendor;
  const status = vendor?.remoteId ? vendor.status : 'unsent';
  const [remoteStats, setRemoteStats] = useState(undefined);

  /* The admin's decision and this listing's real views/contacts/enquiries both live in
     Supabase, not this browser -- see getListingData in src/app/onboarding/listing.js. One
     call covers both, instead of two separate round trips for the same listing. */
  useEffect(() => {
    if (!vendor?.remoteId) return;
    let cancelled = false;
    getListingData(vendor.remoteId).then((res) => {
      if (cancelled || !res) return;
      if (res.status && (res.status.status !== vendor.status || res.status.reason !== (vendor.rejectionReason || ''))) {
        dispatch(updateVendor({ status: res.status.status, rejectionReason: res.status.reason }));
      }
      if (res.stats) setRemoteStats(res.stats);
    }).catch(() => {});
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per visit
  }, [vendor?.remoteId]);

  const data = useMemo(() => {
    if (!live) return null;

    if (vendor.remoteId) {
      if (!remoteStats) {
        const bars = [];
        for (let i = 13; i >= 0; i--) {
          const day = new Date();
          day.setHours(0, 0, 0, 0);
          day.setDate(day.getDate() - i);
          bars.push({ day: String(day.getDate()), v: 0, c: 0 });
        }
        return { views: 0, wa: 0, call: 0, enqN: 0, savedN: 0, bars, enquiriesView: [], note: 'Loading your real numbers...' };
      }
      return {
        views: remoteStats.views, wa: remoteStats.wa, call: remoteStats.call, enqN: remoteStats.enqN,
        savedN: savedIds.includes(vendor.remoteId) ? 1 : 0, bars: remoteStats.bars, enquiriesView: remoteStats.enquiriesView,
        note: 'Real views, contact taps and enquiries from residents on your live listing, last 30 days. A contact attempt means a button was tapped, not that a call or message was completed.'
      };
    }

    // Not submitted yet -- nothing in the database, so fall back to this device's local activity.
    const myEvents = events.filter((e) => e.id === 'mine');
    const myEnquiries = enquiries.filter((e) => e.biz === 'mine');
    const n = (type) => myEvents.filter((e) => e.type === type).length;
    const bars = [];
    for (let i = 13; i >= 0; i--) {
      const day = new Date();
      day.setHours(0, 0, 0, 0);
      day.setDate(day.getDate() - i);
      const next = day.getTime() + 86400000;
      const inDay = myEvents.filter((e) => e.t >= day.getTime() && e.t < next);
      bars.push({
        day: String(day.getDate()),
        v: inDay.filter((e) => e.type === 'view').length,
        c: inDay.filter((e) => e.type !== 'view' && e.type !== 'enquiry').length
      });
    }
    return {
      views: n('view'), wa: n('whatsapp'), call: n('call'), enqN: myEnquiries.length,
      savedN: savedIds.includes('mine') ? 1 : 0, bars,
      enquiriesView: myEnquiries.map((e) => ({ who: e.who, msg: e.msg, when: new Date(e.t).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), status: 'New' })),
      note: 'This listing is only saved on this device, so these numbers are this browser\'s own activity. Submit it for review to start collecting real numbers.'
    };
  }, [live, vendor, remoteStats, events, enquiries, savedIds]);

  const trialEnd = useMemo(() => {
    const end = new Date();
    end.setDate(end.getDate() + 45);
    return end.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }, []);

  /* No listing on this device yet: nothing to report, so point to onboarding instead of
     showing made-up numbers. */
  if (!live) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 shadow-sm text-center">
          <div className="w-14 h-14 rounded-full bg-primary-fixed text-primary flex items-center justify-center mx-auto mb-4"><Icon name="storefront" className="text-2xl" /></div>
          <h1 className="font-headline-sm text-headline-sm text-on-surface mb-2">No business listed yet</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">List your business to get your own page, and your views, contacts and enquiries will show up here.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/onboarding" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-semibold hover:bg-primary-container shadow-sm transition-colors">List your business</Link>
            <Link href="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-outline-variant text-on-surface font-label-lg text-label-lg font-semibold hover:border-primary hover:text-primary transition-colors">Back to home</Link>
          </div>
        </div>
      </main>
    );
  }

  const checks = [
    { done: !!vendor.desc, label: 'Description and contact added', href: '/edit' },
    { done: vendor.items.length > 0, label: 'Menu or services added', href: '/edit#menu' },
    { done: (vendor.photos?.length || 0) >= 3, label: 'Add 3 photos', href: '/edit#photos' },
    { done: Array.isArray(vendor.hours) && vendor.hours.some((h) => h.open), label: 'Set opening hours', href: '/edit#hours' },
    { done: !!vendor.offer, label: 'Publish an offer', href: '/edit#offers' }
  ];

  function onSoonClick() {
    toast('Coming soon.');
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] min-h-screen bg-background text-on-surface">
      <Sidebar vendor={vendor} live={live} onSoonClick={onSoonClick} />
      <main className="p-5 md:p-8 flex flex-col gap-6 min-w-0 max-w-[1180px]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-headline-lg text-headline-md text-on-surface tracking-tight">Namaste, {vendor.name}</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              {status === 'approved' ? 'Your business page is live. Here is how it is doing.' : 'Here is where your listing stands.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link href="/business/mine" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-outline-variant text-on-surface font-label-lg text-label-lg font-semibold hover:border-primary hover:text-primary transition-colors">View as resident</Link>
            <Link href="/edit" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-semibold hover:bg-primary-container shadow-sm transition-colors">Edit business page</Link>
          </div>
        </div>

        {status !== 'approved' && (
          <div className={`rounded-2xl px-5 py-4 border ${status === 'rejected' || status === 'disabled' ? 'bg-error-container/40 border-error/30' : 'bg-secondary-fixed/50 border-secondary-fixed'}`}>
            <strong className="block font-label-lg text-label-lg text-on-surface">
              {{ pending: 'Waiting for approval', rejected: 'Your listing was not approved', disabled: 'Your listing is switched off', unsent: 'Not submitted yet' }[status] || 'Waiting for approval'}
            </strong>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {status === 'pending' && 'Our team is reviewing your listing, usually within a day. Residents will see it once it is approved.'}
              {status === 'rejected' && (vendor.rejectionReason ? `Reason: ${vendor.rejectionReason}` : 'Contact us to find out why.')}
              {status === 'disabled' && 'An admin has hidden your listing from residents. Contact us to switch it back on.'}
              {status === 'unsent' && <>This listing is only saved on this device. <Link href="/onboarding" className="font-bold underline">Submit it for review</Link> so residents can find you.</>}
            </span>
          </div>
        )}

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <strong className="block text-emerald-900 font-label-lg text-label-lg">Your business is currently on the free trial.</strong>
            <span className="font-body-sm text-body-sm text-emerald-700">Trial ends on {trialEnd}. Nothing changes until then.</span>
          </div>
          <button type="button" onClick={onSoonClick} className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-600 text-emerald-700 font-label-md text-label-md font-semibold hover:bg-emerald-100 transition-colors">View plans</button>
        </div>

        <StatsGrid views={data.views} contactAttempts={{ total: data.wa + data.call + data.enqN, wa: data.wa, call: data.call, enq: data.enqN }} enquiryCount={data.enqN} savedCount={data.savedN} />
        <p className="font-body-sm text-body-sm text-on-surface-variant -mt-2">{data.note}</p>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 items-start">
          <ActivityChart bars={data.bars} />
          <CompletionChecklist checks={checks} />
        </div>

        <EnquiriesList list={data.enquiriesView} />
      </main>
    </div>
  );
}
