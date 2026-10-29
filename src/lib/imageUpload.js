/* Client-side guardrails before anything reaches Cloudinary: images only (no video/PDF/etc,
   whatever the file's extension claims), a hard cap on the original file size, and a WebP
   recompression pass so even a phone-camera photo lands well under the output cap. This keeps
   the free-tier Cloudinary bandwidth/storage quota from being eaten by oversized uploads. */

const MAX_INPUT_MB = 8;
const MAX_OUTPUT_BYTES = 1.5 * 1024 * 1024;
const MAX_DIMENSION = 1920;
const MIN_DIMENSION = 480;

export class ImageValidationError extends Error {}

/** Validates a picked file and returns a same-content File re-encoded as WebP,
 *  resized/quality-reduced as needed to fit under MAX_OUTPUT_BYTES. Throws
 *  ImageValidationError (safe to show its message to the user) for anything
 *  that isn't an image or is too large to begin with. */
export async function prepareImageForUpload(file) {
  if (!file.type || !file.type.startsWith('image/')) {
    throw new ImageValidationError('Only image files are allowed (no videos or other files).');
  }
  if (file.size > MAX_INPUT_MB * 1024 * 1024) {
    throw new ImageValidationError(`Keep photos under ${MAX_INPUT_MB}MB.`);
  }

  const bitmap = await loadBitmap(file);
  try {
    return await compressToWebp(file.name, bitmap);
  } finally {
    if (typeof bitmap.close === 'function') bitmap.close();
  }
}

async function loadBitmap(file) {
  if (typeof window !== 'undefined' && window.createImageBitmap) {
    try {
      return await createImageBitmap(file);
    } catch {
      /* Some browsers can't decode a given format via createImageBitmap -- fall back below. */
    }
  }
  return loadImageElement(file);
}

function loadImageElement(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new ImageValidationError("That file isn't a readable image."));
    };
    img.src = url;
  });
}

async function compressToWebp(name, source) {
  const naturalWidth = source.width || source.naturalWidth;
  const naturalHeight = source.height || source.naturalHeight;
  let width = naturalWidth;
  let height = naturalHeight;
  if (Math.max(width, height) > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  let quality = 0.9;
  let blob = await drawAndEncode(source, width, height, quality);

  while (blob.size > MAX_OUTPUT_BYTES && quality > 0.4) {
    quality -= 0.1;
    blob = await drawAndEncode(source, width, height, quality);
  }

  while (blob.size > MAX_OUTPUT_BYTES && Math.max(width, height) > MIN_DIMENSION) {
    width = Math.round(width * 0.85);
    height = Math.round(height * 0.85);
    blob = await drawAndEncode(source, width, height, Math.max(quality, 0.6));
  }

  const baseName = name.replace(/\.[^./\\]+$/, '') || 'photo';
  return new File([blob], `${baseName}.webp`, { type: 'image/webp' });
}

function drawAndEncode(source, width, height, quality) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(source, 0, 0, width, height);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new ImageValidationError('Could not process that image. Try a different photo.'));
          return;
        }
        resolve(blob);
      },
      'image/webp',
      quality
    );
  });
}
