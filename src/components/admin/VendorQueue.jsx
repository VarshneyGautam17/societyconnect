'use client';

import { useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import { approveBusiness, rejectBusiness } from '@/app/admin/actions';
import { socOf } from '@/data/societies';
import { useSocieties } from '@/lib/societies';
import { catOf } from '@/data/categories';
import { uploadImage, cloudinaryUrl } from '@/lib/cloudinary';
import RichText from '@/components/ui/RichText';
import { useToast } from '@/components/ui/Toast';
import Icon from '@/components/ui/Icon';
import { Spinner } from '@/components/ui/Loaders';

const numCls = 'w-full min-h-[40px] rounded-xl border px-3 font-body-sm text-body-sm focus:border-primary focus:outline-none disabled:bg-surface-container disabled:text-on-surface-variant';

function parseCoord(value, min, max) {
  const n = Number(value);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
}

function VendorRow({ business, society }) {
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');

  const coordsSet = Number.isFinite(society?.lat) && Number.isFinite(society?.lng);
  const [lat, setLat] = useState(coordsSet ? String(society.lat) : '');
  const [lng, setLng] = useState(coordsSet ? String(society.lng) : '');
  const [photo, setPhoto] = useState(coordsSet ? society.photo || null : null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef(null);
  const mapsQuery = encodeURIComponent([business.name, society?.street, society?.city, society?.pincode].filter(Boolean).join(', '));

  async function onPhotoChange(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type || !file.type.startsWith('image/')) { toast('Only image files are allowed.'); return; }
    setUploadingPhoto(true);
    try {
      setPhoto(await uploadImage(file));
    } catch (err) {
      toast(err.message || 'Could not upload that photo. Try again.');
    } finally {
      setUploadingPhoto(false);
    }
  }

  function onApprove() {
    let coords;
    if (!coordsSet) {
      const latNum = parseCoord(lat, -90, 90);
      const lngNum = parseCoord(lng, -180, 180);
      if (latNum === null) { toast('Enter a valid latitude (-90 to 90) for this society first.'); return; }
      if (lngNum === null) { toast('Enter a valid longitude (-180 to 180) for this society first.'); return; }
      if (!photo) { toast('Add a cover photo for this society first.'); return; }
      coords = { lat: latNum, lng: lngNum, photo };
    }
    startTransition(async () => {
      try {
        await approveBusiness(business.id, coords);
        toast(`${business.name} approved -- now live.`);
      } catch (err) {
        toast(err.message || 'Could not approve that listing.');
      }
    });
  }

  function onReject() {
    startTransition(async () => {
      try {
        await rejectBusiness(business.id, reason);
        toast(`${business.name} rejected.`);
      } catch (err) {
        toast(err.message || 'Could not reject that listing.');
      }
    });
  }

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/30 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <strong className="font-headline-sm text-headline-sm text-on-surface">{business.name}</strong>
            <span className="font-label-sm text-label-sm font-bold px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant">{catOf(business.cat).name}</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            {business.area}, {socOf(business.society).name} &middot; {business.phone} &middot; submitted {new Date(business.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 max-w-2xl"><RichText text={business.desc} /></p>
        </div>
        <div className="flex items-center gap-2 flex-none">
          <Link href={`/business/${business.id}`} target="_blank" rel="noopener noreferrer" className="font-label-md text-label-md font-semibold text-primary hover:underline">Preview</Link>
          <button type="button" onClick={onApprove} disabled={pending} className="inline-flex items-center px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors disabled:opacity-60">Approve</button>
          <button type="button" onClick={() => setRejecting((r) => !r)} disabled={pending} className="inline-flex items-center px-4 py-2 rounded-full border border-outline-variant text-on-surface font-label-md text-label-md font-semibold hover:border-error hover:text-error transition-colors disabled:opacity-60">Reject</button>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-outline-variant/30">
        {coordsSet ? (
          <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5">
            <Icon name="circleCheck" className="text-base text-emerald-600" />
            {socOf(business.society).name} is already on the map at {society.lat.toFixed(5)}, {society.lng.toFixed(5)}.
          </p>
        ) : (
          <div className="flex flex-wrap items-end gap-2.5">
            <div className="font-body-sm text-body-sm text-on-surface-variant w-full mb-0.5">
              New society -- set {socOf(business.society).name}&apos;s coordinates and cover photo before approving (one-time, saved for every business there after).{' '}
              <a href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold hover:underline">Find it on Google Maps</a>
              , right-click the pin and copy the lat/lng shown.
            </div>
            <label className="flex flex-col gap-1 w-36">
              <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant">Latitude</span>
              <input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="e.g. 12.9352" inputMode="decimal" className={`${numCls} border-outline-variant`} />
            </label>
            <label className="flex flex-col gap-1 w-36">
              <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant">Longitude</span>
              <input value={lng} onChange={(e) => setLng(e.target.value)} placeholder="e.g. 77.6146" inputMode="decimal" className={`${numCls} border-outline-variant`} />
            </label>
            <div className="flex flex-col gap-1">
              <span className="font-label-sm text-label-sm font-semibold text-on-surface-variant">Cover photo</span>
              <div className="flex items-center gap-2">
                {photo && <img src={cloudinaryUrl(photo, { w: 80, h: 80 })} alt="" className="w-10 h-10 rounded-lg object-cover border border-outline-variant" />}
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="inline-flex items-center gap-1.5 h-10 px-3 rounded-xl border border-outline-variant text-on-surface font-label-sm text-label-sm font-semibold hover:border-primary disabled:opacity-60"
                >
                  {uploadingPhoto && <Spinner className="w-3.5 h-3.5" />}
                  {uploadingPhoto ? 'Uploading...' : photo ? 'Change' : 'Add photo'}
                </button>
              </div>
              <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={onPhotoChange} />
            </div>
          </div>
        )}
      </div>
      {rejecting && (
        <div className="mt-3 pt-3 border-t border-outline-variant/30 flex flex-wrap items-center gap-2">
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason (shown to the vendor, optional)"
            maxLength={500}
            className="flex-1 min-w-[220px] min-h-[40px] rounded-xl border border-outline-variant px-3 font-body-sm text-body-sm focus:border-primary focus:outline-none"
          />
          <button type="button" onClick={onReject} disabled={pending} className="inline-flex items-center px-4 py-2 rounded-full bg-error text-white font-label-md text-label-md font-semibold disabled:opacity-60">Confirm reject</button>
        </div>
      )}
    </div>
  );
}

export default function VendorQueue({ businesses, societiesById }) {
  useSocieties(); // re-render once the database society list loads (socOf below reads it)
  if (!businesses.length) {
    return (
      <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-3xl p-10 text-center">
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">Nothing waiting</h3>
        <p className="text-on-surface-variant font-body-md text-body-md">New vendor submissions will show up here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {businesses.map((b) => <VendorRow key={b.id} business={b} society={societiesById?.[b.society]} />)}
    </div>
  );
}
