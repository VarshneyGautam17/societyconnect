'use client';

import { useEffect, useRef, useState } from 'react';

/** Counts up from 0 to `value` once it scrolls into view. Renders the final number up front
 *  (no layout shift, and it's never actually wrong if JS fails), then animates over it client-side. */
export default function CountUp({ value, suffix = '', duration = 900, className = '' }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || typeof IntersectionObserver === 'undefined') return;

    let frame;
    function animate(start) {
      const t0 = performance.now();
      function tick(now) {
        const p = Math.min((now - t0) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(start + (value - start) * eased));
        if (p < 1) frame = requestAnimationFrame(tick);
      }
      frame = requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDisplay(0);
          animate(0);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(frame); };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}{suffix}
    </span>
  );
}
