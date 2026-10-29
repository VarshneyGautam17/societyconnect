export default function Panel({ title, children, className = '', id }) {
  return (
    <section id={id} className={`bg-surface-container-lowest rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-outline-variant/30 shadow-sm ${className}`}>
      {title && <h2 className="font-headline-sm text-label-lg sm:text-headline-sm text-on-surface mb-2 sm:mb-3">{title}</h2>}
      {children}
    </section>
  );
}
