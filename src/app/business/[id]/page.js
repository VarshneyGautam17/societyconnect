'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { catOf } from '@/data/categories';
import { socOf, socShort } from '@/data/societies';
import { bizImg, imgUrl, seedOf } from '@/lib/images';
import { cloudinaryUrl } from '@/lib/cloudinary';
import { selectBusinessById, selectIsSaved } from '@/store/selectors';
import { recordEvent } from '@/store/slices/eventsSlice';
import { toggleSaved } from '@/store/slices/savedSlice';
import { createClient } from '@/lib/supabase/client';
import { dbRowToFormVendor } from '@/lib/businessMapper';
import { useToast } from '@/components/ui/Toast';
import SiteShell from '@/components/layout/SiteShell';
import Icon from '@/components/ui/Icon';
import MonoTile from '@/components/ui/MonoTile';
import Panel from '@/components/ui/Panel';
import RichText from '@/components/ui/RichText';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import CallButton from '@/components/ui/CallButton';
import SaveButton from '@/components/ui/SaveButton';
import EnquiryForm from '@/components/business/EnquiryForm';

const BLOBS = ['blob-shape-1', 'blob-shape-2', 'blob-shape-3', 'blob-shape-4', 'blob-shape-5', 'blob-shape-1'];

export default function BusinessPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const toast = useToast();
  const localBusiness = useSelector((state) => selectBusinessById(state, id));
  /* The 20 demo businesses + "mine" live in Redux/localStorage; a real
     published vendor lives in Supabase and isn't in that store at all, so
     this is the fallback that makes a real listing (and admin previews of
     pending ones) viewable, and is what lets its view/contact events be
     real rows in Supabase instead of this browser's localStorage. */
  const [remoteBusiness, setRemoteBusiness] = useState(null);
  const [remoteChecked, setRemoteChecked] = useState(false);
  const business = localBusiness || remoteBusiness;
  const isRemote = !localBusiness && !!remoteBusiness;
  const saved = useSelector((state) => (business ? selectIsSaved(state, business.id) : false));
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (localBusiness || !id) return;
    let cancelled = false;
    createClient().from('businesses').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      if (cancelled) return;
      if (data) setRemoteBusiness(dbRowToFormVendor(data));
      setRemoteChecked(true);
    });
    return () => { cancelled = true; };
  }, [id, localBusiness]);

  useEffect(() => {
    if (!business) return;
    if (isRemote) {
      createClient().from('events').insert({ business_id: business.id, type: 'view' });
    } else {
      dispatch(recordEvent({ type: 'view', id: business.id }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [business?.id, isRemote]);

  useEffect(() => {
    if (business) document.title = `${business.name} | SocietySpot`;
  }, [business]);

  const photoSeed = business ? seedOf(business.id) : 0;
  const photos = useMemo(() => {
    if (!business) return [];
    if (Array.isArray(business.photos) && business.photos.length) {
      return business.photos.map((publicId, i) => ({ blob: BLOBS[i % BLOBS.length], src: cloudinaryUrl(publicId, { w: 320, h: 320 }) }));
    }
    const c = catOf(business.cat);
    return [0, 1, 2, 3, 4, 5].map((n, i) => ({ blob: BLOBS[i], src: imgUrl(c.images, photoSeed + n * 13, 320, 320) }));
  }, [business, photoSeed]);

  if (!business) {
    if (!remoteChecked) return null;
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
    if (isRemote) {
      createClient().from('events').insert({ business_id: business.id, type });
    } else {
      dispatch(recordEvent({ type, id: business.id }));
    }
    toast(type === 'whatsapp' ? 'Demo: this would open WhatsApp. Logged as a contact attempt.' : 'Demo: this would start a call. Logged as a contact attempt.');
  }

  return (
    <SiteShell active="business">
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full pb-20 md:pb-0">
        <nav className="py-2.5 md:py-5 font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5 flex-wrap" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary transition-colors">{socShort(business.society)}</Link>
          <span>/</span>
          <Link href={`/directory?cat=${business.cat}`} className="hover:text-primary transition-colors">{c.name}</Link>
          <span>/</span>
          <span className="text-on-surface font-medium">{business.name}</span>
        </nav>

        <section className="bg-surface-container-lowest rounded-2xl md:rounded-3xl border border-outline-variant/30 shadow-sm overflow-hidden mb-3 md:mb-6">
          <div className="relative h-36 md:h-80">
            <img className="w-full h-full object-cover" src={bizImg(business, 1200, 480)} alt="" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/40 via-transparent to-transparent" />
            <div className="absolute -bottom-7 md:-bottom-10 left-4 md:left-6">
              <MonoTile business={business} className="w-14 h-14 md:w-20 md:h-20 text-xl md:text-3xl rounded-xl md:rounded-2xl border-4 border-surface-container-lowest shadow-lg" />
            </div>
          </div>
          <div className="pt-9 md:pt-14 pb-4 md:pb-6 px-4 md:px-6 flex flex-wrap gap-3 md:gap-5 items-start justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1.5 md:mb-2">
                <h1 className="font-headline-lg text-headline-sm md:text-headline-md text-on-surface">{business.name}</h1>
                {business.verified ? (
                  <span className="inline-flex items-center gap-1 bg-tertiary-fixed text-tertiary font-label-sm text-label-sm font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-full">
                    <Icon name="shield" className="text-xs" filled /><span>Verified</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded-full">Unverified listing</span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 md:gap-x-5 md:gap-y-2 font-label-sm md:font-label-md text-label-sm md:text-label-md text-on-surface-variant">
                <span className="font-semibold" style={{ color: c.fg }}>{c.name}</span>
                <span className="flex items-center gap-1.5"><Icon name="pin" className="text-sm text-outline" />{business.area}, {s.name}, {s.place.split(',')[0]}</span>
                <span className="flex items-center gap-1.5 text-tertiary font-semibold"><Icon name="clock" className="text-sm" />{hoursLine}</span>
              </div>
            </div>
            {/* WhatsApp/Call/Save are hidden on mobile -- the sticky bottom bar below covers them
                there, so repeating them here would just be duplicate, space-eating buttons. */}
            <div className="hidden md:flex flex-wrap gap-2.5">
              <WhatsAppButton onClick={() => onContact('whatsapp')} label="WhatsApp" className="px-5 py-3 font-label-lg text-label-lg" />
              <CallButton onClick={() => onContact('call')} label="Call" className="px-5 py-3 font-label-lg text-label-lg" />
              <a href="#enquiry" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-semibold hover:bg-primary-container shadow-sm transition-colors">Send enquiry</a>
              <SaveButton saved={saved} onClick={onSave} label="Save" className="px-5 py-3 border border-outline-variant text-on-surface font-label-lg text-label-lg font-semibold hover:border-primary" />
            </div>
            <a href="#enquiry" className="md:hidden inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-semibold">
              <Icon name="mail" className="text-sm" /><span>Enquire</span>
            </a>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-3 md:gap-6 pb-8 md:pb-16 items-start">
          <div className="flex flex-col gap-3 md:gap-6">
            <Panel title="About the business">
              <p className="font-body-sm md:font-body-md text-body-sm md:text-body-md text-on-surface-variant leading-relaxed"><RichText text={business.desc} /></p>
            </Panel>

            <Panel title="Products, services and prices">
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">Prices are samples for this mockup.</p>
              {business.items.map((r, i) => (
                <div key={i} className="flex items-center justify-between gap-4 py-2 md:py-3 border-t border-outline-variant/30">
                  <div>
                    <strong className="block font-label-md md:font-label-lg text-label-md md:text-label-lg text-on-surface">{r[0]}</strong>
                    {r[1] && <small className="text-on-surface-variant font-body-sm text-body-sm">{r[1]}</small>}
                  </div>
                  <span className="font-label-md md:font-label-lg text-label-md md:text-label-lg font-bold text-on-surface whitespace-nowrap">{r[2]}</span>
                </div>
              ))}
            </Panel>

            {business.offer && (
              <Panel title="Offers" className="bg-gradient-to-br from-secondary-fixed to-surface-container-lowest border-secondary-fixed">
                <strong className="block font-headline-sm text-label-lg md:text-headline-sm text-on-secondary-fixed-variant mb-1">{business.offer}</strong>
                <p className="font-body-sm text-body-sm text-on-secondary-fixed-variant/80">{business.offerValid || 'Mention SocietySpot when you order.'}</p>
              </Panel>
            )}

            <Panel title="Business photos">
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {photos.map((p, i) => (
                  <div key={i} className={`aspect-square ${p.blob} overflow-hidden bg-surface-container border-2 border-surface-container-lowest hover:scale-105 transition-transform duration-300`}>
                    <img className="w-full h-full object-cover" src={p.src} alt="" loading="lazy" />
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Service availability">
              <div className="flex flex-wrap gap-1.5 md:gap-2">
                <span className="px-2.5 py-1.5 md:px-3.5 md:py-2 rounded-full font-label-sm md:font-label-md text-label-sm md:text-label-md font-semibold bg-tertiary-fixed text-tertiary">Serves {socShort(business.society)}</span>
                <span className="px-2.5 py-1.5 md:px-3.5 md:py-2 rounded-full font-label-sm md:font-label-md text-label-sm md:text-label-md font-semibold bg-primary-fixed text-primary">Free delivery inside the society</span>
                <span className="px-2.5 py-1.5 md:px-3.5 md:py-2 rounded-full font-label-sm md:font-label-md text-label-sm md:text-label-md font-semibold bg-surface-container-high text-on-surface-variant">Contact before 10 am for same-day orders</span>
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

          <aside className="flex flex-col gap-3 md:gap-6">
            <Panel title="Contact information">
              <div className="flex flex-col gap-2.5 md:gap-3">
                <div className="flex justify-between gap-3">
                  <span className="text-on-surface-variant font-body-sm md:font-body-md text-body-sm md:text-body-md">Phone</span>
                  <strong className="font-label-md md:font-label-lg text-label-md md:text-label-lg text-on-surface">{phone}</strong>
                </div>
                {!revealed && (
                  <button type="button" onClick={() => setRevealed(true)} className="inline-flex items-center justify-center px-4 py-2 md:py-2.5 rounded-full bg-primary-fixed text-primary font-label-sm md:font-label-md text-label-sm md:text-label-md font-bold hover:bg-primary-fixed-dim transition-colors">
                    Show number
                  </button>
                )}
                <p className="font-body-sm text-body-sm text-on-surface-variant">Numbers stay hidden until you ask. Tapping Call or WhatsApp records a contact attempt, not a completed call.</p>
              </div>
            </Panel>
            <Panel title="Location">
              <div className="h-24 md:h-36 rounded-xl md:rounded-2xl bg-primary-fixed flex items-center justify-center text-primary">
                <Icon name="pin" className="text-3xl md:text-4xl" />
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2.5 md:mt-3">{business.area}, {s.name}, {s.place}. Exact flat shared only after you enquire.</p>
            </Panel>
            <Panel title="Send an enquiry" id="enquiry">
              <EnquiryForm businessId={business.id} isRemote={isRemote} />
            </Panel>
          </aside>
        </div>
      </div>

      {/* Mobile-only: the WhatsApp/Call buttons up in the hero scroll out of reach on a long
          page, so they're repeated here, pinned just above the tab bar -- the same "always
          reachable" contact bar pattern Zomato/Swiggy use on their listing pages. */}
      <div className="md:hidden fixed inset-x-0 bottom-14 z-30 bg-surface-container-lowest/95 backdrop-blur-md border-t border-outline-variant/40 px-3 py-2 flex items-center gap-2 shadow-[0_-8px_24px_-16px_rgba(15,23,42,0.3)]">
        <SaveButton saved={saved} onClick={onSave} className="w-11 h-11 flex-none border border-outline-variant/50" />
        <WhatsAppButton onClick={() => onContact('whatsapp')} label="WhatsApp" pulse className="flex-1 h-11 font-label-md text-label-md" />
        <CallButton onClick={() => onContact('call')} label="Call" className="flex-1 h-11 font-label-md text-label-md" />
      </div>
    </SiteShell>
  );
}
