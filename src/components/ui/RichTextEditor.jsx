'use client';

import { useEffect, useRef, useState } from 'react';
import { wrapSelection } from '@/lib/richText';
import RichText from '@/components/ui/RichText';
import Icon from '@/components/ui/Icon';

const TOOLS = [
  { token: '**', label: 'Bold', icon: 'format_bold' },
  { token: '==', label: 'Highlight', icon: 'format_ink_highlighter' },
  { token: '__', label: 'Underline', icon: 'format_underlined' }
];

/** A plain <textarea> plus a toolbar that wraps the current selection with
 *  the app's rich-text markers, and a live preview underneath. Select some
 *  text, click a tool, done -- no contentEditable, no HTML output. */
export default function RichTextEditor({ value, onChange, rows = 3, placeholder, maxLength, className = '' }) {
  const textareaRef = useRef(null);
  const pendingSelection = useRef(null);

  useEffect(() => {
    if (pendingSelection.current && textareaRef.current) {
      const { selectionStart, selectionEnd } = pendingSelection.current;
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(selectionStart, selectionEnd);
      pendingSelection.current = null;
    }
  }, [value]);

  function applyTool(token) {
    const el = textareaRef.current;
    if (!el) return;
    const { text, selectionStart, selectionEnd } = wrapSelection(value || '', el.selectionStart, el.selectionEnd, token);
    pendingSelection.current = { selectionStart, selectionEnd };
    onChange(text);
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-1.5 mb-1.5">
        {TOOLS.map((t) => (
          <button
            key={t.token}
            type="button"
            onClick={() => applyTool(t.token)}
            aria-label={t.label}
            title={t.label}
            className="w-9 h-9 rounded-xl border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary flex items-center justify-center transition-colors"
          >
            <Icon name={t.icon} className="text-lg" />
          </button>
        ))}
        <span className="font-body-sm text-body-sm text-on-surface-variant ml-1">Select text, then click a style</span>
      </div>
      <textarea
        ref={textareaRef}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        className="block w-full min-h-[44px] rounded-2xl border border-outline-variant px-4 py-3 font-body-md text-body-md focus:border-primary focus:outline-none resize-y"
      />
      {maxLength && <span className="block mt-1 text-right font-body-sm text-body-sm text-on-surface-variant">{(value || '').length}/{maxLength}</span>}
      {value && (
        <div className="mt-2 px-4 py-3 rounded-2xl bg-surface-container-low font-body-sm text-body-sm text-on-surface-variant">
          <span className="block font-label-sm text-label-sm font-bold text-on-surface-variant/70 mb-1 uppercase tracking-wide">Preview</span>
          <RichText text={value} />
        </div>
      )}
    </div>
  );
}
