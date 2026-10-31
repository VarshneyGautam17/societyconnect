'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
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

  const live = !!(storedVendor && storedVendor.published);
  const vendor = storedVendor;

  const data = useMemo(() => {
    if (live) {
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
        note: 'These numbers come from this browser only. A contact attempt means a button was tapped, not that a call or message was completed.'
      };
    }
    return null;
  }, [live, events, enquiries, savedIds]);

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
            <h1 className="font-headline-lg text-headline-md text-on-surface tracking-tight">Namaste, {vendor.name.split(' ')[0]}</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Your business page is live. Here is how it is doing.</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link href="/business/mine" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-outline-variant text-on-surface font-label-lg text-label-lg font-semibold hover:border-primary hover:text-primary transition-colors">View as resident</Link>
            <Link href="/edit" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-semibold hover:bg-primary-container shadow-sm transition-colors">Edit business page</Link>
          </div>
        </div>

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
