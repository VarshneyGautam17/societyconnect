'use client';

import { useState } from 'react';
import Icon from '@/components/ui/Icon';

/** Save/heart toggle with a quick "pop" on every tap (not just the first) -- the icon is
 *  remounted with a fresh `key` each click so the CSS animation replays instead of only firing
 *  once. No animation plays on initial mount (clicks starts at 0, the class only applies once
 *  clicks > 0), so a page full of unsaved hearts doesn't all silently pop on load. */
export default function SaveButton({ saved, onClick, label, ariaLabel, className = '' }) {
  const [clicks, setClicks] = useState(0);

  function handleClick() {
    onClick();
    setClicks((n) => n + 1);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={label ? undefined : (ariaLabel || (saved ? 'Remove from saved' : 'Save this business'))}
      className={`inline-flex items-center justify-center gap-2 rounded-full transition-colors ${className}`}
    >
      <Icon
        key={clicks}
        name="heart"
        className={`text-lg ${clicks > 0 ? 'animate-heart-pop' : ''} ${saved ? 'text-error' : 'text-on-surface-variant'}`}
        filled={saved}
      />
      {label && <span>{label}</span>}
    </button>
  );
}
