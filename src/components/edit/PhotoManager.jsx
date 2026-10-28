import { catOf } from '@/data/categories';
import { imgUrl, seedOf } from '@/lib/images';
import { useToast } from '@/components/ui/Toast';

const BLOBS = ['blob-shape-2', 'blob-shape-4', 'blob-shape-5'];

export default function PhotoManager({ v }) {
  const toast = useToast();
  const c = catOf(v.cat);
  const seed = seedOf(v.id || 'mine');

  return (
    <section className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-sm" id="photos">
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-1">Logo, cover and photos</h2>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Clear, bright photos get more views.</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[0, 1, 2].map((n, i) => (
          <div key={n} className={`relative aspect-square ${BLOBS[i]} overflow-hidden bg-surface-container border-2 border-surface-container-lowest`}>
            <img className="w-full h-full object-cover" src={imgUrl(c.images, seed + n * 13, 240, 240)} alt="" loading="lazy" />
            {i === 0 && <span className="absolute bottom-2 left-2 font-label-sm text-label-sm font-bold text-white bg-on-surface/60 px-2.5 py-1 rounded-full">Cover</span>}
          </div>
        ))}
        <button
          type="button"
          onClick={() => toast('Demo: photo upload will connect to file storage later.')}
          className="aspect-square rounded-2xl border-2 border-dashed border-primary/40 text-primary font-label-md text-label-md font-semibold hover:bg-primary-fixed/40 transition-colors"
        >
          Add photo
        </button>
      </div>
    </section>
  );
}
