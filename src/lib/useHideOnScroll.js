'use client';

import { useEffect, useRef, useState } from 'react';

/** True while the user is actively scrolling down past `threshold` -- flips back to false the
 *  moment they scroll up, or whenever they're near the very top of the page. Used to hide the
 *  sticky header / bottom nav while someone is reading down the page, and bring it straight back
 *  the moment they want to navigate (scroll up) or are already at the top. rAF-throttled so it
 *  doesn't add scroll jank. */
export function useHideOnScroll(threshold = 80) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    let ticking = false;

    function update() {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (y < threshold) setHidden(false);
      else if (delta > 4) setHidden(true);
      else if (delta < -4) setHidden(false);
      lastY.current = y;
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return hidden;
}
