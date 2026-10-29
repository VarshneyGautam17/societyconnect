'use client';

import PhotoUploader from '@/components/business/PhotoUploader';

export default function PhotoManager({ v, patch }) {
  return (
    <section className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-sm" id="photos">
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">Logo, cover and photos</h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Clear, bright photos get more views. The banner shows at the top of your page.</p>
      <PhotoUploader v={v} patch={patch} />
    </section>
  );
}
