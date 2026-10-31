'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from '@/components/ui/Icon';

const SEARCH_THRESHOLD = 7;
const VIEWPORT_MARGIN = 8;
const PANEL_GAP = 8;
const PANEL_MAX_WIDTH = 352;

/** Custom-styled dropdown used in place of a bare native <select> -- the native control can't be
 *  themed (its open panel always renders in the OS/browser's own style, which looks especially
 *  out of place against this app's glass surfaces on mobile), so this renders its own trigger
 *  button + listbox panel instead. Keyboard-accessible (arrow keys, Home/End, Enter, Escape),
 *  closes on an outside click, shows a checkmark on the selected row, and -- past
 *  `SEARCH_THRESHOLD` options -- adds a type-to-filter search box so a long list (e.g. every
 *  society) doesn't turn into a scroll hunt. `options` is `[{ value, label, icon? }]` (`icon` is
 *  an optional Material Symbol name shown before the label, in both the trigger and the row);
 *  `triggerClassName` styles the closed button so each call site can match its own context.
 *
 *  The panel is portaled to <body> with position: fixed, placed against the trigger's on-screen
 *  rect. Rendering it in place (position: absolute) got it clipped by any overflow-hidden card and
 *  painted under later glass/animated sections (each of those is its own stacking context, so no
 *  z-index escapes them). Placement flips above the trigger when there's more room there, clamps
 *  horizontally to the viewport, caps height to the space available, and follows scroll/resize. */
export default function Select({ value, onChange, options, ariaLabel, triggerClassName = '', panelClassName = '', align = 'left' }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const searchRef = useRef(null);

  const searchable = options.length > SEARCH_THRESHOLD;
  const filtered = useMemo(() => {
    if (!searchable || !query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query, searchable]);

  const selected = options.find((o) => o.value === value);

  function openPanel() {
    setQuery('');
    const selIndex = options.findIndex((o) => o.value === value);
    setActiveIndex(selIndex >= 0 ? selIndex : 0);
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    function onDocPointerDown(e) {
      if (triggerRef.current?.contains(e.target) || panelRef.current?.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener('pointerdown', onDocPointerDown);
    return () => document.removeEventListener('pointerdown', onDocPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open || !searchable) return;
    const t = setTimeout(() => searchRef.current?.focus(), 10);
    return () => clearTimeout(t);
  }, [open, searchable]);

  /* Writes position straight to the panel's style (no state) so it runs before paint and on every
     scroll frame without re-rendering the list. Re-runs when the filtered list changes height. */
  useLayoutEffect(() => {
    if (!open) return;
    function place() {
      const trigger = triggerRef.current;
      const panel = panelRef.current;
      if (!trigger || !panel) return;
      const r = trigger.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      const vh = window.innerHeight;

      panel.style.maxHeight = '';
      panel.style.minWidth = `${Math.min(Math.max(r.width, 192), vw - VIEWPORT_MARGIN * 2)}px`;
      panel.style.maxWidth = `${Math.min(PANEL_MAX_WIDTH, vw - VIEWPORT_MARGIN * 2)}px`;

      const spaceBelow = vh - r.bottom - PANEL_GAP - VIEWPORT_MARGIN;
      const spaceAbove = r.top - PANEL_GAP - VIEWPORT_MARGIN;
      const flip = panel.offsetHeight > spaceBelow && spaceAbove > spaceBelow;
      const height = Math.min(panel.offsetHeight, flip ? spaceAbove : spaceBelow);
      panel.style.maxHeight = `${Math.max(height, 0)}px`;
      panel.style.top = `${flip ? r.top - PANEL_GAP - height : r.bottom + PANEL_GAP}px`;

      const width = panel.offsetWidth;
      const preferredLeft = align === 'right' ? r.right - width : r.left;
      panel.style.left = `${Math.min(Math.max(preferredLeft, VIEWPORT_MARGIN), vw - VIEWPORT_MARGIN - width)}px`;
      panel.style.transformOrigin = `${flip ? 'bottom' : 'top'} ${align === 'right' ? 'right' : 'left'}`;
    }
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open, align, filtered.length]);

  function commit(opt) {
    if (!opt) return;
    onChange(opt.value);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function onPanelKeyDown(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(filtered.length - 1, i + 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(0, i - 1)); }
    else if (e.key === 'Home') { e.preventDefault(); setActiveIndex(0); }
    else if (e.key === 'End') { e.preventDefault(); setActiveIndex(filtered.length - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); commit(filtered[activeIndex]); }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false); triggerRef.current?.focus(); }
    else if (e.key === 'Tab') { setOpen(false); }
  }

  function onTriggerKeyDown(e) {
    if (open) {
      onPanelKeyDown(e);
    } else if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPanel();
    }
  }

  const panel = open && (
    <div
      ref={panelRef}
      onKeyDown={onPanelKeyDown}
      style={{ position: 'fixed', top: 0, left: 0 }}
      className={`z-[150] flex flex-col w-max glass-strong rounded-2xl shadow-xl p-1.5 animate-select-pop ${panelClassName}`}
    >
      {searchable && (
        <div className="flex-none flex items-center gap-2 px-2.5 py-2 mb-1 rounded-xl bg-surface-container-lowest/70 border border-outline-variant/30 focus-within:border-primary transition-colors">
          <Icon name="search" className="text-sm text-outline flex-none" />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
            placeholder="Search..."
            aria-label={`Search ${ariaLabel || 'options'}`}
            className="w-full bg-transparent font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none"
          />
        </div>
      )}
      <ul role="listbox" aria-label={ariaLabel} tabIndex={-1} className="max-h-64 min-h-0 flex-1 overflow-auto overscroll-contain">
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
  );

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openPanel())}
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
      {panel && createPortal(panel, document.body)}
    </div>
  );
}
