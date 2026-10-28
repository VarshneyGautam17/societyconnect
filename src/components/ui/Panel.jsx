export default function Panel({ title, children, className = '', id }) {
  return (
    <section id={id} className={`bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-sm ${className}`}>
      {title && <h2 className="font-headline-sm text-headline-sm text-on-surface mb-3">{title}</h2>}
      {children}
    </section>
  );
}
