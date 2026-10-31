'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { socImg, blobOf } from '@/lib/images';
import { selectCountForSociety } from '@/store/selectors';
import { setSociety } from '@/store/slices/societySlice';
import Icon from '@/components/ui/Icon';
import SkeletonImage from '@/components/ui/SkeletonImage';

export default function SocietyCard({ society }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const count = useSelector((state) => selectCountForSociety(state, society.id));

  function explore() {
    dispatch(setSociety(society.id));
    router.push('/#businesses');
  }

  return (
    <article className="group bg-surface-container-lowest rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-outline-variant/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="relative w-full aspect-[4/3] mb-3 sm:mb-5 overflow-hidden">
          <div className={`w-full h-full ${blobOf(society.id)} overflow-hidden bg-surface-container border-2 border-surface-container-lowest`}>
            <SkeletonImage className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src={socImg(society, 640, 440)} alt="" loading="lazy" />
          </div>
          <span className="absolute bottom-2 left-2 glass px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-label-sm font-label-sm font-bold text-tertiary flex items-center gap-1 shadow-sm">
            <Icon name="circleCheck" className="text-xs" filled />
            <span>{count} businesses listed</span>
          </span>
        </div>
        <h3 className="font-headline-sm text-label-lg sm:text-headline-sm text-on-surface group-hover:text-primary transition-colors mb-1 line-clamp-2 min-w-0">{society.name}</h3>
        <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm sm:font-label-md text-label-sm sm:text-label-md mb-2.5 sm:mb-4 min-w-0">
          <Icon name="pin" className="text-sm text-outline flex-none" />
          <span className="truncate">{society.place}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={explore}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 rounded-full bg-primary text-on-primary font-label-sm sm:font-label-md text-label-sm sm:text-label-md font-semibold hover:bg-primary-container shadow-sm transition-colors"
      >
        Explore society
      </button>
    </article>
  );
}
