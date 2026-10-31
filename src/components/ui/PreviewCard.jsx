import { catOf } from '@/data/categories';
import { socShort } from '@/data/societies';
import { bizImg, blobOf } from '@/lib/images';
import Icon from '@/components/ui/Icon';
import RichText from '@/components/ui/RichText';
import SkeletonImage from '@/components/ui/SkeletonImage';

/** Read-only version of BizCard — used for the onboarding/edit-page "preview as resident" views,
 *  where the save heart and contact buttons shouldn't be wired up to real state yet. */
export default function PreviewCard({ business }) {
  const c = catOf(business.cat);
  return (
    <article className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/30 shadow-sm flex flex-col justify-between">
      <div>
        <div className="relative w-full aspect-[4/3] mb-5 overflow-hidden">
          <div className={`w-full h-full ${blobOf(business.id || 'preview')} overflow-hidden bg-surface-container border-2 border-surface-container-lowest`}>
            <SkeletonImage className="w-full h-full object-cover" src={bizImg(business)} alt="" loading="lazy" />
          </div>
          <span className="absolute top-2 left-2 glass px-2.5 py-1 rounded-full text-label-sm font-label-sm font-bold flex items-center gap-1 shadow-sm" style={{ color: c.fg }}>
            <Icon name={c.micon} className="text-xs" />
            <span>{c.short}</span>
          </span>
          {business.verified && (
            <span className="absolute bottom-2 right-2 glass px-2.5 py-1 rounded-full text-label-sm font-label-sm font-bold text-tertiary flex items-center gap-1 shadow-sm">
              <Icon name="shield" className="text-xs" filled /><span>Verified</span>
            </span>
          )}
        </div>
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-1.5">{business.name || 'Your business name'}</h3>
        <div className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md mb-3">
          <Icon name="pin" className="text-sm text-outline" />
          <span>{business.area || 'Your area'}, {socShort(business.society)}</span>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant/90 line-clamp-2 mb-4">
          {business.desc ? <RichText text={business.desc} /> : 'Your one-line description will show here.'}
        </p>
      </div>
      <div className="pt-4 border-t border-outline-variant/30">
        <span className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold">View business</span>
      </div>
    </article>
  );
}
