'use client';

import { useEffect, useRef, useState } from 'react';

/** Spreadable {ref, style} pair that fades + lifts an element into place the first time it
 *  scrolls into view (near-instant for anything already on screen at load, e.g. the hero, so it
 *  reads as a page-load entrance). Returns a ref+inline-style pair rather than a wrapper
 *  component so it can be applied directly to an existing element (h1, form, ...) without adding
 *  a wrapping div that could disturb flex/grid sizing. Skips itself for prefers-reduced-motion
 *  and for browsers without IntersectionObserver. See also <Reveal> for the wrapper-component
 *  version, used where wrapping a list item in a div is safe (grid children). */
export function useReveal(delay = 0, distance = 18) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return {
    ref,
    style: {
      opacity: shown ? 1 : 0,
      transform: shown ? 'none' : `translateY(${distance}px)`,
      transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`
    }
  };
}
