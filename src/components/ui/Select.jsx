'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from '@/components/ui/Icon';

const SEARCH_THRESHOLD = 7;

/** Custom-styled dropdown used in place of a bare native <select> -- the native control can't be
 *  themed (its open panel always renders in the OS/browser's own style, which looks especially
 *  out of place against this app's glass surfaces on mobile), so this renders its own trigger
 *  button + listbox panel instead. Keyboard-accessible (arrow keys, Home/End, Enter, Escape),
 *  closes on an outside click, shows a checkmark on the selected row, and -- past
 *  `SEARCH_THRESHOLD` options -- adds a type-to-filter search box so a long list (e.g. every
 *  society) doesn't turn into a scroll hunt. `options` is `[{ value, label, icon? }]` (`icon` is
 *  an optional Material Symbol name shown before the label, in both the trigger and the row);
 *  `triggerClassName` styles the closed button so each call site can match its own context. */
export default function Select({ value, onChange, options, ariaLabel, triggerClassName = '', panelClassName = '', align = 'left' }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef(null);
  const searchRef = useRef(null);

  const searchable = options.length > SEARCH_THRESHOLD;
  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query, searchable]);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    function onDocPointerDown(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocPointerDown);
    return () => document.removeEventListener('mousedown', onDocPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    const selIndex = options.findIndex((o) => o.value === value);
    setActiveIndex(selIndex >= 0 ? selIndex : 0);
    if (searchable) {
      const t = setTimeout(() => searchRef.current?.focus(), 10);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function commit(opt) {
    if (!opt) return;
    onChange(opt.value);
    setOpen(false);
  }

  function onTriggerKeyDown(e) {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setOpen(true);
    }
  }

  function onPanelKeyDown(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(filtered.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(0, i - 1)); }
    else if (e.key === 'Home') { e.preventDefault(); setActiveIndex(0); }
    else if (e.key === 'End') { e.preventDefault(); setActiveIndex(filtered.length - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); commit(filtered[activeIndex]); }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
    else if (e.key === 'Tab') { setOpen(false); }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        className={triggerClassName}
      >
        <span className="flex items-center gap-1.5 flex-1 min-w-0">
          {selected?.icon && <Icon name={selected.icon} className="text-base text-outline flex-none" />}
          <span className="truncate">{selected?.label}</span>
        </span>
        <Icon name="expand_more" className={`text-base text-outline flex-none transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          onKeyDown={onPanelKeyDown}
          className={`absolute z-50 ${align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left'} top-full mt-2 w-max max-w-[min(90vw,22rem)] min-w-[12rem] glass-strong rounded-2xl shadow-xl p-1.5 animate-select-pop ${panelClassName}`}
        >
          {searchable && (
            <div className="flex items-center gap-2 px-2.5 py-2 mb-1 rounded-xl bg-surface-container-lowest/70 border border-outline-variant/30 focus-within:border-primary transition-colors">
              <Icon name="search" className="text-sm text-outline flex-none" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                aria-label={`Search ${ariaLabel || 'options'}`}
                className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
              />
            </div>
          )}
          <ul role="listbox" aria-label={ariaLabel} tabIndex={-1} className="max-h-64 overflow-auto">
            {filtered.length === 0 && (
              <li className="px-3.5 py-3 text-center font-body-sm text-body-sm text-on-surface-variant">No matches</li>
            )}
            {filtered.map((o, i) => {
              const isSelected = o.value === value;
              return (
                <li
                  key={o.value}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => commit(o)}
                  style={{ animationDelay: `${Math.min(i, 10) * 25}ms` }}
                  className={`animate-fade-up flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-label-md text-label-md font-medium cursor-pointer truncate transition-all hover:translate-x-0.5 ${
                    i === activeIndex ? 'bg-primary-fixed text-on-primary-fixed-variant' : isSelected ? 'text-primary' : 'text-on-surface'
                  }`}
                >
                  {o.icon && <Icon name={o.icon} className="text-base flex-none" />}
                  <span className="truncate flex-1">{o.label}</span>
                  {isSelected && <Icon key={value} name="check" className="text-base flex-none text-primary animate-check-pop" filled />}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
