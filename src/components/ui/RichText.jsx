import { parseRichText } from '@/lib/richText';

/** Renders the app's small safe rich-text syntax (see src/lib/richText.js) as
 *  styled <span> elements. Always plain text content -- never dangerouslySetInnerHTML. */
export default function RichText({ text, className = '' }) {
  const runs = parseRichText(text);
  return (
    <span className={className}>
      {runs.map((run, i) => (
        <span
          key={i}
          style={{
            fontWeight: run.bold ? 700 : undefined,
            textDecoration: run.underline ? 'underline' : undefined,
            backgroundColor: run.highlight ? '#FEF08A' : undefined,
            borderRadius: run.highlight ? '0.2em' : undefined,
            padding: run.highlight ? '0 0.15em' : undefined
          }}
        >
          {run.text}
        </span>
      ))}
    </span>
  );
}
