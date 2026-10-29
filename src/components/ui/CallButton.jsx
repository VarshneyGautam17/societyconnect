import Icon from '@/components/ui/Icon';

/** Call action button -- deliberately calmer than WhatsAppButton (outlined, no pulse): in most
 *  Indian local-commerce apps chat is the lower-friction first move and call is the fallback, so
 *  the two shouldn't compete visually. `label` renders icon+text, omit it for an icon-only button. */
export default function CallButton({ onClick, label, ariaLabel, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label ? undefined : (ariaLabel || 'Call')}
      className={`inline-flex items-center justify-center gap-2 rounded-full border-2 border-outline-variant/60 text-on-surface font-semibold hover:border-primary hover:text-primary active:scale-[0.97] transition-all ${className}`}
    >
      <Icon name="phone" className="text-lg" />
      {label && <span>{label}</span>}
    </button>
  );
}
