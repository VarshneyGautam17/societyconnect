/* A tiny, intentionally limited markdown-like syntax for vendor descriptions:
 *   **bold**, ==highlight==, __underline__ (nestable/combinable).
 *
 * This is NOT a general rich-text/HTML system on purpose -- the output is
 * always a list of plain-text runs with boolean style flags, rendered as
 * <span> elements (see RichText.jsx). There is no path from vendor input to
 * raw HTML anywhere, so there's nothing here to sanitize or that can inject
 * markup into the page.
 */

const MARKERS = [
  { token: '**', key: 'bold' },
  { token: '==', key: 'highlight' },
  { token: '__', key: 'underline' }
];

/** Parses `raw` into an array of { text, bold?, highlight?, underline? } runs. */
export function parseRichText(raw) {
  return parseSegment(String(raw || ''), {});
}

function parseSegment(text, activeStyles) {
  let earliest = null;
  for (const m of MARKERS) {
    if (activeStyles[m.key]) continue; // a style can't re-open inside itself
    const idx = text.indexOf(m.token);
    if (idx !== -1 && (!earliest || idx < earliest.idx)) earliest = { idx, marker: m };
  }

  if (!earliest) {
    return text ? [{ text, ...activeStyles }] : [];
  }

  const { idx, marker } = earliest;
  const before = text.slice(0, idx);
  const rest = text.slice(idx + marker.token.length);
  const closeIdx = rest.indexOf(marker.token);

  if (closeIdx === -1) {
    // No matching close marker -- treat the opener as literal text, keep scanning the rest.
    return [
      ...(before ? [{ text: before, ...activeStyles }] : []),
      { text: text.slice(idx, idx + marker.token.length), ...activeStyles },
      ...parseSegment(rest, activeStyles)
    ];
  }

  const inner = rest.slice(0, closeIdx);
  const after = rest.slice(closeIdx + marker.token.length);
  return [
    ...(before ? [{ text: before, ...activeStyles }] : []),
    ...parseSegment(inner, { ...activeStyles, [marker.key]: true }),
    ...parseSegment(after, activeStyles)
  ];
}

/** Strips the markers back out, for places that need the plain text (card
 *  previews, search matching, the <meta> description, etc). */
export function stripRichText(raw) {
  return parseRichText(raw).map((run) => run.text).join('');
}

export function wrapSelection(text, start, end, token) {
  const before = text.slice(0, start);
  const selected = text.slice(start, end);
  const after = text.slice(end);
  return {
    text: `${before}${token}${selected}${token}${after}`,
    selectionStart: start + token.length,
    selectionEnd: end + token.length
  };
}

export const RICH_TEXT_MARKERS = MARKERS;
