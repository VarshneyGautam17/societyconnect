'use client';

import { useRef, useState } from 'react';
import { catOf } from '@/data/categories';
import { imgUrl, seedOf } from '@/lib/images';
import { uploadImage, cloudinaryUrl } from '@/lib/cloudinary';
import { useToast } from '@/components/ui/Toast';
import Icon from '@/components/ui/Icon';
import { Overlay, Spinner } from '@/components/ui/Loaders';

const BLOBS = ['blob-shape-2', 'blob-shape-4', 'blob-shape-5', 'blob-shape-1'];
const MAX_PHOTOS = 6;

/** Banner + up to 6 gallery photos. Shared by the onboarding wizard (Photos and
 *  offerings step) and the dashboard edit page, so a vendor can add photos either
 *  during signup or later -- same validation, same compression, same UI. Every
 *  upload is image-only, capped at 8MB in, and re-encoded to WebP (<=1.5MB) by
 *  uploadImage() (see lib/imageUpload.js) before it reaches Cloudinary. */
export default function PhotoUploader({ v, patch }) {
  const toast = useToast();
  const bannerInputRef = useRef(null);
  const photoInputRef = useRef(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(0); // photos still uploading
  const c = catOf(v.cat);
  const seed = seedOf(v.id || 'mine');
  const photos = Array.isArray(v.photos) ? v.photos : [];

  function rejectFile(file) {
    if (!file.type || !file.type.startsWith('image/')) {
      toast('Only image files are allowed -- no videos or other files.');
      return true;
    }
    return false;
  }

  async function onBannerChange(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || rejectFile(file)) return;

    setUploadingBanner(true);
    try {
      const publicId = await uploadImage(file);
      patch({ banner: publicId });
      toast('Banner updated.');
    } catch (err) {
      toast(err.message || 'Could not upload that image. Try again.');
    } finally {
      setUploadingBanner(false);
    }
  }

  function removeBanner() {
    patch({ banner: null });
  }

  /* Several photos can be picked at once; anything beyond the remaining slots is skipped with a
     note. Uploads run one after another, and each finished one appears straight away. */
  async function onPhotoChange(e) {
    const picked = Array.from(e.target.files || []);
    e.target.value = '';
    if (!picked.length) return;

    const images = picked.filter((file) => !rejectFile(file));
    const room = MAX_PHOTOS - photos.length;
    const files = images.slice(0, room);
    if (images.length > room) toast(`You can add up to ${MAX_PHOTOS} photos, so only the first ${room} were added.`);
    if (!files.length) return;

    setUploadingPhoto(files.length);
    const added = [];
    for (const file of files) {
      try {
        added.push(await uploadImage(file));
        patch({ photos: [...photos, ...added] });
      } catch (err) {
        toast(err.message || 'Could not upload a photo. Try again.');
      }
      setUploadingPhoto((n) => n - 1);
    }
    setUploadingPhoto(0);
    if (added.length) toast(added.length === 1 ? 'Photo added.' : `${added.length} photos added.`);
  }

  function removePhoto(publicId) {
    patch({ photos: photos.filter((p) => p !== publicId) });
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h3 className="font-label-lg text-label-lg font-bold text-on-surface mb-1">Cover banner</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">The big image at the top of your page. JPG or PNG, up to 8MB -- we&apos;ll optimize it automatically.</p>
        <div className="relative aspect-[21/9] max-w-xl rounded-2xl overflow-hidden bg-surface-container border-2 border-surface-container-lowest">
          <img
            className="w-full h-full object-cover"
            src={v.banner ? cloudinaryUrl(v.banner, { w: 1200, h: 514 }) : imgUrl(c.images, seed, 1200, 514)}
            alt=""
            loading="lazy"
          />
          {uploadingBanner && <Overlay label="Uploading..." />}
          {!v.banner && !uploadingBanner && <span className="absolute bottom-2 left-2 font-label-sm text-label-sm font-bold text-white bg-on-surface/60 px-2.5 py-1 rounded-full">Default cover</span>}
          <div className="absolute top-2 right-2 flex gap-2">
            {v.banner && (
              <button
                type="button"
                onClick={removeBanner}
                aria-label="Remove banner"
                className="w-8 h-8 rounded-full bg-on-surface/60 text-white flex items-center justify-center hover:bg-error transition-colors"
              >
                <Icon name="close" className="text-sm" />
              </button>
            )}
            <button
              type="button"
              onClick={() => bannerInputRef.current?.click()}
              disabled={uploadingBanner}
              className="h-8 px-4 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-semibold hover:bg-primary-container transition-colors disabled:opacity-60"
            >
              {uploadingBanner ? 'Uploading...' : v.banner ? 'Change' : 'Add banner'}
            </button>
          </div>
        </div>
        <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={onBannerChange} />
      </div>

      <div>
        <h3 className="font-label-lg text-label-lg font-bold text-on-surface mb-1">Photos</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
          Add up to {MAX_PHOTOS} photos of your work, shop or kitchen. <span className="font-semibold text-on-surface">{photos.length} of {MAX_PHOTOS}</span> added.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {photos.map((publicId, i) => (
                <div key={publicId} className={`relative aspect-square ${BLOBS[i % BLOBS.length]} overflow-hidden bg-surface-container border-2 border-surface-container-lowest`}>
                  <img className="w-full h-full object-cover" src={cloudinaryUrl(publicId, { w: 240, h: 240 })} alt="" loading="lazy" />
                  <button
                    type="button"
                    onClick={() => removePhoto(publicId)}
                    aria-label="Remove photo"
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-on-surface/60 text-white flex items-center justify-center hover:bg-error transition-colors"
                  >
                    <Icon name="close" className="text-sm" />
                  </button>
                </div>
              ))}
          {photos.length < MAX_PHOTOS && (
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              disabled={uploadingPhoto > 0}
              className="aspect-square rounded-2xl border-2 border-dashed border-primary/40 text-primary font-label-md text-label-md font-semibold hover:bg-primary-fixed/40 transition-colors disabled:opacity-60 disabled:cursor-wait flex flex-col items-center justify-center gap-1.5 px-2 text-center"
            >
              {uploadingPhoto > 0 ? (
                <>
                  <Spinner className="w-5 h-5" />
                  <span className="font-label-sm text-label-sm">Uploading {uploadingPhoto}...</span>
                </>
              ) : (
                <>
                  <Icon name="add_photo_alternate" className="text-2xl" />
                  <span>{photos.length ? 'Add more' : 'Add photos'}</span>
                </>
              )}
            </button>
          )}
        </div>
        <input ref={photoInputRef} type="file" accept="image/*" multiple className="hidden" onChange={onPhotoChange} />
      </div>
    </div>
  );
}
