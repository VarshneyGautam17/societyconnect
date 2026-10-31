'use client';

/* eslint-disable @next/next/no-img-element -- drop-in for the plain <img> tags used across the app
   (Cloudinary/Unsplash URLs already sized per call site), not a next/image migration. */
import { useCallback, useState } from 'react';

/** <img> that shows the app's shimmer skeleton in its own box until the image has actually
 *  loaded, so cards/banners never sit as flat empty tiles on a slow connection. The shimmer is
 *  the img's own background (visible until the first frame paints), so it needs no wrapper and
 *  takes exactly the img's size/shape. A cached image can finish loading before hydration (its
 *  onLoad then never reaches React), so the ref also checks `complete` on mount. */
export default function SkeletonImage({ className = '', onLoad, onError, alt = '', ...props }) {
  const [loaded, setLoaded] = useState(false);

  const ref = useCallback((node) => {
    if (node?.complete && node.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <img
      ref={ref}
      alt={alt}
      {...props}
      onLoad={(e) => { setLoaded(true); onLoad?.(e); }}
      onError={(e) => { setLoaded(true); onError?.(e); }}
      className={`${loaded ? '' : 'animate-shimmer'} ${className}`}
    />
  );
}
