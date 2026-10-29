'use client';

import { useReveal } from '@/lib/useReveal';

/** Wrapper-component version of useReveal, for list items where adding a wrapping element is
 *  safe (CSS grid children stretch to fill their cell regardless of the wrapper's own width, so
 *  this is the easy way to stagger a `.map()` of cards -- pass `delay={i * 60}`). For an existing
 *  element whose own sizing matters (e.g. a flex child with no intrinsic width), use useReveal
 *  directly instead so no extra div is introduced. */
export default function Reveal({ children, delay = 0, distance = 18, className = '', as: Tag = 'div' }) {
  const { ref, style } = useReveal(delay, distance);
  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}
