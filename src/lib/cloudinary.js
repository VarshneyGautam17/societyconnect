/* Unsigned uploads go straight from the browser to Cloudinary -- no backend
   involved, no API secret exposed. The upload preset (created as "Unsigned"
   in the Cloudinary dashboard) is what authorizes this, and it's safe to
   ship in client code. */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

/** Uploads a single image file to Cloudinary. Resolves to the Cloudinary
 *  public_id, which is what gets stored (not the full URL -- that way the
 *  delivery URL can be rebuilt at any size/quality from cloudinaryUrl()). */
export async function uploadImage(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.');
  }

  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', UPLOAD_PRESET);
  form.append('folder', 'societyspot');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error?.message || 'Image upload failed.');
  }

  const data = await res.json();
  return data.public_id;
}

/** Builds an optimized delivery URL for a stored public_id. f_auto picks the
 *  best format per browser (WebP/AVIF where supported), q_auto compresses
 *  without a visible quality loss -- together they're the single biggest
 *  lever on Cloudinary bandwidth usage. Pass the same (w, h) pair everywhere
 *  a given spot on the page needs so the CDN cache gets reused instead of
 *  generating a new transformation per call. */
export function cloudinaryUrl(publicId, { w = 400, h = 400, crop = 'fill' } = {}) {
  if (!publicId) return null;
  if (!CLOUD_NAME) return null;
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,c_${crop},w_${w},h_${h}/${publicId}`;
}
