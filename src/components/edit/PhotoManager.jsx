'use client';

import { useRef, useState } from 'react';
import { catOf } from '@/data/categories';
import { imgUrl, seedOf } from '@/lib/images';
import { uploadImage, cloudinaryUrl } from '@/lib/cloudinary';
import { useToast } from '@/components/ui/Toast';
import Icon from '@/components/ui/Icon';

const BLOBS = ['blob-shape-2', 'blob-shape-4', 'blob-shape-5', 'blob-shape-1'];
const MAX_PHOTOS = 6;
const MAX_FILE_MB = 8;

export default function PhotoManager({ v, patch }) {
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const c = catOf(v.cat);
  const seed = seedOf(v.id || 'mine');
  const photos = Array.isArray(v.photos) ? v.photos : [];

  async function onFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast('Please choose an image file.');
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      toast(`Keep photos under ${MAX_FILE_MB}MB.`);
      return;
    }
    if (photos.length >= MAX_PHOTOS) {
      toast(`You can add up to ${MAX_PHOTOS} photos.`);
      return;
    }

    setUploading(true);
    try {
      const publicId = await uploadImage(file);
      patch({ photos: [...photos, publicId] });
      toast('Photo added.');
    } catch (err) {
      toast(err.message || 'Could not upload that photo. Try again.');
    } finally {
      setUploading(false);
    }
  }

  function removePhoto(publicId) {
    patch({ photos: photos.filter((p) => p !== publicId) });
  }

  const showPlaceholders = photos.length === 0;

  return (
    <section className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-sm" id="photos">
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">Logo, cover and photos</h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
        {showPlaceholders ? 'Clear, bright photos get more views. Showing sample photos until you add your own.' : 'Clear, bright photos get more views. First photo is used as the cover.'}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {showPlaceholders
          ? [0, 1, 2].map((n, i) => (
              <div key={n} className={`relative aspect-square ${BLOBS[i]} overflow-hidden bg-surface-container border-2 border-surface-container-lowest`}>
                <img className="w-full h-full object-cover" src={imgUrl(c.images, seed + n * 13, 240, 240)} alt="" loading="lazy" />
                {i === 0 && <span className="absolute bottom-2 left-2 font-label-sm text-label-sm font-bold text-white bg-on-surface/60 px-2.5 py-1 rounded-full">Cover (sample)</span>}
              </div>
            ))
          : photos.map((publicId, i) => (
              <div key={publicId} className={`relative aspect-square ${BLOBS[i % BLOBS.length]} overflow-hidden bg-surface-container border-2 border-surface-container-lowest`}>
                <img className="w-full h-full object-cover" src={cloudinaryUrl(publicId, { w: 240, h: 240 })} alt="" loading="lazy" />
                {i === 0 && <span className="absolute bottom-2 left-2 font-label-sm text-label-sm font-bold text-white bg-on-surface/60 px-2.5 py-1 rounded-full">Cover</span>}
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
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-2xl border-2 border-dashed border-primary/40 text-primary font-label-md text-label-md font-semibold hover:bg-primary-fixed/40 transition-colors disabled:opacity-60"
          >
            {uploading ? 'Uploading...' : 'Add photo'}
          </button>
        )}
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
    </section>
  );
}
