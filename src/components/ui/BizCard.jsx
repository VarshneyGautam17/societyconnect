'use client';

import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { catOf } from '@/data/categories';
import { socShort } from '@/data/societies';
import { bizImg, blobOf } from '@/lib/images';
import { toggleSaved } from '@/store/slices/savedSlice';
import { recordEvent } from '@/store/slices/eventsSlice';
import { selectIsSaved } from '@/store/selectors';
import { useToast } from '@/components/ui/Toast';
import Icon from '@/components/ui/Icon';
import RichText from '@/components/ui/RichText';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import CallButton from '@/components/ui/CallButton';
import SaveButton from '@/components/ui/SaveButton';

/** The organic business card used on the homepage, directory and onboarding/edit previews.
 *  Two layouts in one component, switched with Tailwind breakpoints: a compact tap-through
 *  row on phones (Zomato/Swiggy-style list density) and the roomier card from before at sm:
 *  and up, where there's screen space to spare. */
export default function BizCard({ business }) {
  const dispatch = useDispatch();
  const toast = useToast();
  const saved = useSelector((state) => selectIsSaved(state, business.id));
  const c = catOf(business.cat);

  function onSave() {
    dispatch(toggleSaved(business.id));
    toast(saved ? 'Removed from saved' : 'Saved. Find it under Saved.');
  }
  function onContact(type) {
    dispatch(recordEvent({ type, id: business.id }));
    toast(type === 'whatsapp' ? 'Demo: this would open WhatsApp. Logged as a contact attempt.' : 'Demo: this would start a call. Logged as a contact attempt.');
  }

  return (
    <article className="group relative bg-surface-container-lowest rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-outline-variant/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:justify-between">
      {/* Stretched-link pattern, phones only: covers the whole card so the entire row is
          tappable (Zomato/Swiggy-style tap-through-to-detail) -- the save button opts back in
          with pointer-events-auto. Scoped to sm:hidden rather than relying on it everywhere:
          at sm:+ the card already has its own explicit "View business" button/link, and
          reasoning about paint order between this and unpositioned sibling content isn't worth
          the risk without a real browser to check it in. */}
      <Link href={`/business/${business.id}`} className="sm:hidden absolute inset-0 z-0 rounded-2xl" aria-label={`View ${business.name}`} />

      {/* Compact horizontal row -- phones only. pointer-events-none on the whole row (not just
          the text column) so tapping the thumbnail image also falls through to the overlay
          link below -- only the save button opts back in with pointer-events-auto. */}
      <div className="relative z-10 flex sm:hidden gap-3 pointer-events-none">
        <div className={`relative w-24 h-24 flex-none overflow-hidden rounded-xl ${blobOf(business.id)} bg-surface-container border-2 border-surface-container-lowest`}>
          <img className="w-full h-full object-cover" src={bizImg(business)} alt="" loading="lazy" />
          {business.verified && (
            <span className="absolute bottom-1 left-1 bg-surface-container-lowest/95 rounded-full p-1 shadow-sm text-tertiary">
              <Icon name="shield" className="text-xs" filled />
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-label-lg text-label-lg font-bold text-on-surface truncate">{business.name}</h3>
            <SaveButton saved={saved} onClick={onSave} ariaLabel={`Save ${business.name}`} className="pointer-events-auto flex-none w-8 h-8 -mt-1 -mr-1" />
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm mt-0.5">
            <span className="font-semibold" style={{ color: c.fg }}>{c.short}</span>
            <span>&middot;</span>
            <span className="truncate">{business.area}, {socShort(business.society)}</span>
          </div>
          {business.offer ? (
            <span className="inline-flex items-center gap-1 mt-1.5 w-fit max-w-full bg-secondary-fixed text-on-secondary-fixed-variant px-2 py-0.5 rounded-full font-label-sm text-label-sm font-bold">
              <Icon name="sell" className="text-xs flex-none" filled />
              <span className="truncate">{business.offer}</span>
            </span>
          ) : (
            <p className="font-body-sm text-body-sm text-on-surface-variant/90 line-clamp-1 mt-1.5"><RichText text={business.desc} /></p>
          )}
        </div>
      </div>

      {/* Full card -- tablet/desktop. */}
      <div className="hidden sm:block">
        <div className="relative w-full aspect-[4/3] mb-5 overflow-hidden">
          <div className={`w-full h-full ${blobOf(business.id)} overflow-hidden bg-surface-container border-2 border-surface-container-lowest`}>
            <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={bizImg(business)} alt="" loading="lazy" />
          </div>
          <SaveButton saved={saved} onClick={onSave} ariaLabel={`Save ${business.name}`} className="absolute z-10 top-2 right-2 h-9 w-9 bg-surface-container-lowest/90 backdrop-blur-sm shadow-sm" />
          <span className="absolute top-2 left-2 bg-surface-container-lowest/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-label-sm font-label-sm font-bold flex items-center gap-1 shadow-sm" style={{ color: c.fg }}>
            <Icon name={c.micon} className="text-xs" />
            <span>{c.short}</span>
          </span>
          {business.verified && (
            <span className="absolute bottom-2 right-2 bg-surface-container-lowest/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-label-sm font-label-sm font-bold text-tertiary flex items-center gap-1 shadow-sm">
              <Icon name="shield" className="text-xs" filled />
              <span>Verified</span>
            </span>
          )}
        </div>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">{business.name}</h3>
        </div>
        <div className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md mb-3">
          <Icon name="pin" className="text-sm text-outline" />
          <span>{business.area}, {socShort(business.society)}</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant/90 line-clamp-2 mb-4"><RichText text={business.desc} /></p>
      </div>
      <div className="hidden sm:flex relative z-10 pt-4 border-t border-outline-variant/30 items-center gap-2">
        <Link
          href={`/business/${business.id}`}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container shadow-sm transition-colors"
        >
          View business
        </Link>
        <WhatsAppButton onClick={() => onContact('whatsapp')} ariaLabel={`WhatsApp ${business.name}`} pulse className="h-11 w-11" />
        <CallButton onClick={() => onContact('call')} ariaLabel={`Call ${business.name}`} className="h-11 w-11" />
      </div>
    </article>
  );
}
