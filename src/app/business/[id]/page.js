'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { catOf } from '@/data/categories';
import { socOf, socShort } from '@/data/societies';
import { bizImg, imgUrl, seedOf } from '@/lib/images';
import { selectBusinessById, selectIsSaved } from '@/store/selectors';
import { recordEvent } from '@/store/slices/eventsSlice';
import { toggleSaved } from '@/store/slices/savedSlice';
import { useToast } from '@/components/ui/Toast';
import SiteShell from '@/components/layout/SiteShell';
import Icon from '@/components/ui/Icon';
import MonoTile from '@/components/ui/MonoTile';
import Panel from '@/components/ui/Panel';
import EnquiryForm from '@/components/business/EnquiryForm';

const BLOBS = ['blob-shape-1', 'blob-shape-2', 'blob-shape-3', 'blob-shape-4', 'blob-shape-5', 'blob-shape-1'];

export default function BusinessPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const toast = useToast();
  const business = useSelector((state) => selectBusinessById(state, id));
  const saved = useSelector((state) => (business ? selectIsSaved(state, business.id) : false));
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (business) dispatch(recordEvent({ type: 'view', id: business.id }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business?.id]);

  useEffect(() => {
    if (business) document.title = `${business.name} | SocietyConnect`;
  }, [business]);

  const photoSeed = business ? seedOf(business.id) : 0;
  const photos = useMemo(() => {
    if (!business) return [];
    const c = catOf(business.cat);
    return [0, 1, 2, 3, 4, 5].map((n, i) => ({ blob: BLOBS[i], src: imgUrl(c.images, photoSeed + n * 13, 320, 320) }));
  }, [business, photoSeed]);

  if (!business) {
    return (
      <SiteShell active="business">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-3xl p-10 text-center mt-10">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">We could not find that business</h3>
            <p className="text-on-surface-variant font-body-md text-body-md mb-5">It may have been removed or the link is wrong.</p>
            <Link href="/directory" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-bold">Browse all businesses</Link>
          </div>
        </div>
      </SiteShell>
    );
  }

  const c = catOf(business.cat);
  const s = socOf(business.society);
  const hoursLine = Array.isArray(business.hours)
    ? (() => {
        const open = business.hours.filter((h) => h.open);
        return open.length ? `Open ${open[0].day} to ${open[open.length - 1].day}, ${open[0].from} to ${open[0].to}` : 'Hours not set';
      })()
    : business.hours?.open ? 'Open today, 8 am to 9 pm' : 'Closed today';
  const phone = business.hidePhone === false || revealed ? business.phone : business.phone.replace(/\d+$/, 'XX');

  function onSave() {
    dispatch(toggleSaved(business.id));
    toast(saved ? 'Removed from saved' : 'Saved. Find it under Saved.');
  }
  function onContact(type) {
    dispatch(recordEvent({ type, id: business.id }));
    toast(type === 'whatsapp' ? 'Demo: this would open WhatsApp. Logged as a contact attempt.' : 'Demo: this would start a call. Logged as a contact attempt.');
  }

  return (
    <SiteShell active="business">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
        <nav className="py-5 font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">{socShort(business.society)}</Link>
          <span>/</span>
          <Link href={`/directory?cat=${business.cat}`} className="hover:text-primary transition-colors">{c.name}</Link>
          <span>/</span>
          <span className="text-on-surface font-medium">{business.name}</span>
        </nav>

        <section className="bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden mb-6">
          <div className="relative h-56 md:h-80">
            <img className="w-full h-full object-cover" src={bizImg(business, 1200, 480)} alt="" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/40 via-transparent to-transparent" />
            <div className="absolute -bottom-10 left-6">
              <MonoTile business={business} className="w-20 h-20 text-3xl rounded-2xl border-4 border-surface-container-lowest shadow-lg" />
            </div>
          </div>
          <div className="pt-14 pb-6 px-6 flex flex-wrap gap-5 items-start justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-md text-on-surface">{business.name}</h1>
                {business.verified ? (
                  <span className="inline-flex items-center gap-1 bg-tertiary-fixed text-tertiary font-label-sm text-label-sm font-bold px-2.5 py-1 rounded-full">
                    <Icon name="shield" className="text-xs" filled /><span>Verified</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-bold px-2.5 py-1 rounded-full">Unverified listing</span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-label-md text-label-md text-on-surface-variant">
                <span className="font-semibold" style={{ color: c.fg }}>{c.name}</span>
                <span className="flex items-center gap-1.5"><Icon name="pin" className="text-sm text-outline" />{business.area}, {s.name}, {s.place.split(',')[0]}</span>
                <span className="flex items-center gap-1.5 text-tertiary font-semibold"><Icon name="clock" className="text-sm" />{hoursLine}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button type="button" onClick={() => onContact('whatsapp')} className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-600 text-white font-label-lg text-label-lg font-semibold hover:bg-emerald-700 shadow-sm transition-colors">
                <Icon name="chat" className="text-lg" /><span>WhatsApp</span>
              </button>
              <button type="button" onClick={() => onContact('call')} className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-outline-variant text-on-surface font-label-lg text-label-lg font-semibold hover:border-primary hover:text-primary transition-colors">
                <Icon name="phone" className="text-lg" /><span>Call</span>
              </button>
              <a href="#enquiry" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-semibold hover:bg-primary-container shadow-sm transition-colors">Send enquiry</a>
              <button type="button" onClick={onSave} aria-pressed={saved} className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-outline-variant text-on-surface font-label-lg text-label-lg font-semibold hover:border-primary transition-colors">
                <Icon name="heart" className={`text-lg ${saved ? 'text-error' : 'text-on-surface-variant'}`} filled={saved} /><span>Save</span>
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 pb-16 items-start">
          <div className="flex flex-col gap-6">
            <Panel title="About the business">
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{business.desc}</p>
            </Panel>

            <Panel title="Products, services and prices">
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">Prices are samples for this mockup.</p>
              {business.items.map((r, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-3 border-t border-outline-variant/30">
                  <div>
                    <strong className="block font-label-lg text-label-lg text-on-surface">{r[0]}</strong>
                    {r[1] && <small className="text-on-surface-variant font-body-sm text-body-sm">{r[1]}</small>}
                  </div>
                  <span className="font-label-lg text-label-lg font-bold text-on-surface whitespace-nowrap">{r[2]}</span>
                </div>
              ))}
            </Panel>

            {business.offer && (
              <Panel title="Offers" className="bg-gradient-to-br from-amber-50 to-orange-50/70 border-amber-200/60">
                <strong className="block font-headline-sm text-headline-sm text-amber-900 mb-1">{business.offer}</strong>
                <p className="font-body-sm text-body-sm text-amber-800">{business.offerValid || 'Mention SocietyConnect when you order.'}</p>
              </Panel>
            )}

            <Panel title="Business photos">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map((p, i) => (
                  <div key={i} className={`aspect-square ${p.blob} overflow-hidden bg-surface-container border-2 border-surface-container-lowest hover:scale-105 transition-transform duration-300`}>
                    <img className="w-full h-full object-cover" src={p.src} alt="" loading="lazy" />
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Service availability">
              <div className="flex flex-wrap gap-2">
                <span className="px-3.5 py-2 rounded-full font-label-md text-label-md font-semibold bg-tertiary-fixed text-tertiary">Serves {socShort(business.society)}</span>
                <span className="px-3.5 py-2 rounded-full font-label-md text-label-md font-semibold bg-primary-fixed text-primary">Free delivery inside the society</span>
                <span className="px-3.5 py-2 rounded-full font-label-md text-label-md font-semibold bg-surface-container-high text-on-surface-variant">Contact before 10 am for same-day orders</span>
              </div>
            </Panel>

            {Array.isArray(business.hours) && (
              <Panel title="Opening hours">
                <table className="w-full font-body-sm text-body-sm">
                  <tbody>
                    {business.hours.map((h) => (
                      <tr key={h.day} className="border-t border-outline-variant/30">
                        <td className="py-1.5 text-on-surface">{h.day}</td>
                        <td className="py-1.5 text-right text-on-surface-variant">{h.open ? `${h.from} to ${h.to}` : 'Closed'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Panel>
            )}
          </div>

          <aside className="flex flex-col gap-6">
            <Panel title="Contact information">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between gap-3">
                  <span className="text-on-surface-variant font-body-md text-body-md">Phone</span>
                  <strong className="font-label-lg text-label-lg text-on-surface">{phone}</strong>
                </div>
                {!revealed && (
                  <button type="button" onClick={() => setRevealed(true)} className="inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-primary-fixed text-primary font-label-md text-label-md font-bold hover:bg-primary-fixed-dim transition-colors">
                    Show number
                  </button>
                )}
                <p className="font-body-sm text-body-sm text-on-surface-variant">Numbers stay hidden until you ask. Tapping Call or WhatsApp records a contact attempt, not a completed call.</p>
              </div>
            </Panel>
            <Panel title="Location">
              <div className="h-36 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
                <Icon name="pin" className="text-4xl" />
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-3">{business.area}, {s.name}, {s.place}. Exact flat shared only after you enquire.</p>
            </Panel>
            <Panel title="Send an enquiry" id="enquiry">
              <EnquiryForm businessId={business.id} />
            </Panel>
          </aside>
        </div>
      </div>
    </SiteShell>
  );
}
