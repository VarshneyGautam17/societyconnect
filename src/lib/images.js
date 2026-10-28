import { catOf, SOCIETY_IMAGES } from '@/data/categories';

/* Dummy photos for the mockup, picked from a hand-curated, visually-checked list of real Unsplash
   photos per category (see CATEGORIES / SOCIETY_IMAGES) — not a live keyword search, so there's
   nothing to go down. A given seed always resolves to the same photo in the pool. */
export function seedOf(id) {
  const s = String(id);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return (h % 1000) + 1;
}

export function imgUrl(pool, seed, w, h) {
  const id = pool[seed % pool.length];
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=${w || 640}&h=${h || 400}`;
}

export function bizImg(b, w, h) {
  return imgUrl(catOf(b.cat).images, seedOf(b.id), w, h);
}

export function socImg(s, w, h) {
  return imgUrl(SOCIETY_IMAGES, seedOf(s.id) + 7, w, h);
}

export function blobOf(id) {
  return 'blob-shape-' + ((seedOf(id) % 5) + 1);
}
