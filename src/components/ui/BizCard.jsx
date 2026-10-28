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

/** The organic business card used on the homepage, directory and onboarding/edit previews. */
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
    <article className="group bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="relative w-full aspect-[4/3] mb-5 overflow-hidden">
          <div className={`w-full h-full ${blobOf(business.id)} overflow-hidden bg-surface-container border-2 border-surface-container-lowest`}>
            <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={bizImg(business)} alt="" loading="lazy" />
          </div>
          <button
            type="button"
            onClick={onSave}
            aria-pressed={saved}
            aria-label={`Save ${business.name}`}
            className="absolute top-2 right-2 h-9 px-3.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm shadow-sm flex items-center justify-center"
          >
            <Icon name="heart" className={`text-lg ${saved ? 'text-error' : 'text-on-surface-variant'}`} filled={saved} />
          </button>
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
      <div className="pt-4 border-t border-outline-variant/30 flex items-center gap-2">
        <Link
          href={`/business/${business.id}`}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container shadow-sm transition-colors"
        >
          View business
        </Link>
        <button
          type="button"
          onClick={() => onContact('whatsapp')}
          aria-label={`WhatsApp ${business.name}`}
          className="h-11 px-5 rounded-full bg-emerald-50 text-emerald-800 hover:bg-emerald-100 flex items-center justify-center transition-colors"
        >
          <Icon name="chat" className="text-lg" />
        </button>
        <button
          type="button"
          onClick={() => onContact('call')}
          aria-label={`Call ${business.name}`}
          className="h-11 px-5 rounded-full border border-outline-variant/40 text-on-surface hover:border-primary hover:text-primary transition-colors flex items-center justify-center"
        >
          <Icon name="phone" className="text-lg" />
        </button>
      </div>
    </article>
  );
}
