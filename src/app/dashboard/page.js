'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { defaultVendor } from '@/data/businesses';
import { useToast } from '@/components/ui/Toast';
import Sidebar from '@/components/dashboard/Sidebar';
import StatsGrid from '@/components/dashboard/StatsGrid';
import ActivityChart from '@/components/dashboard/ActivityChart';
import CompletionChecklist from '@/components/dashboard/CompletionChecklist';
import EnquiriesList from '@/components/dashboard/EnquiriesList';

const SAMPLE_VIEWS = [22, 28, 18, 31, 35, 26, 20, 24, 33, 38, 29, 27, 34, 40];
const SAMPLE_CONTACTS = [4, 6, 3, 7, 8, 5, 4, 5, 7, 9, 6, 5, 8, 10];
const SAMPLE_ENQUIRIES = [
  { who: 'Neha K., Tower A', msg: 'Do you have a Jain thali option for Sundays?', when: 'Today', status: 'New' },
  { who: 'Rohit S., Tower D', msg: 'Interested in the weekly lunch plan for two people.', when: 'Yesterday', status: 'Replied' },
  { who: 'Anita M., Tower B', msg: 'Can you deliver by 12:30 on weekdays?', when: '2 days ago', status: 'New' }
];

export default function DashboardPage() {
  const toast = useToast();
  const storedVendor = useSelector((state) => state.vendor.current);
  const events = useSelector((state) => state.events.list);
  const enquiries = useSelector((state) => state.enquiries.list);
  const savedIds = useSelector((state) => state.saved.ids);

  const live = !!(storedVendor && storedVendor.published);
  const vendor = live ? storedVendor : defaultVendor();

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
    return {
      views: 412, wa: 52, call: 24, enqN: 11, savedN: 29,
      bars: SAMPLE_VIEWS.map((v, i) => ({ day: String(15 + i), v, c: SAMPLE_CONTACTS[i] })),
      enquiriesView: SAMPLE_ENQUIRIES,
      note: 'Sample numbers for this mockup. A contact attempt means a button was tapped, not that a call or message was completed.'
    };
  }, [live, events, enquiries, savedIds]);

  const trialEnd = useMemo(() => {
    const end = new Date();
    end.setDate(end.getDate() + 45);
    return end.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  }, []);

  const checks = [
    { done: !!vendor.desc, label: 'Description and contact added', href: '/edit' },
    { done: vendor.items.length > 0, label: 'Menu or services added', href: '/edit#menu' },
    { done: false, label: 'Add 3 photos', href: '/edit#photos' },
    { done: Array.isArray(vendor.hours) && vendor.hours.some((h) => h.open), label: 'Set opening hours', href: '/edit#hours' },
    { done: !!vendor.offer, label: 'Publish an offer', href: '/edit#offers' }
  ];

  function onSoonClick() {
    toast('Demo: this section is not built yet.');
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] min-h-screen bg-background text-on-surface">
      <Sidebar vendor={vendor} live={live} onSoonClick={onSoonClick} />
      <main className="p-5 md:p-8 flex flex-col gap-6 min-w-0 max-w-[1180px]">
        {!live && (
          <div className="bg-primary-fixed text-primary rounded-2xl px-4 py-3.5 font-body-sm text-body-sm">
            You are viewing sample data. <Link href="/onboarding" className="font-bold underline">List your business</Link> to see your own numbers here.
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-headline-lg text-headline-md text-on-surface tracking-tight">Namaste, {vendor.name.split(' ')[0]}</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Your business page is live. Here is how it is doing.</p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link href={live ? '/business/mine' : '/business/b1'} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-outline-variant text-on-surface font-label-lg text-label-lg font-semibold hover:border-primary hover:text-primary transition-colors">View as resident</Link>
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
