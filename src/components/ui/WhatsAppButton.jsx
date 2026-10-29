import Icon from '@/components/ui/Icon';

/** WhatsApp action button. Deliberately the real WhatsApp green (#25D366) rather than the app's
 *  own theme color -- it's a brand people recognize instantly, the same way a "Pay with..."
 *  button keeps that provider's own color. `label` renders icon+text, omit it for a compact
 *  round icon button. */
export default function WhatsAppButton({ onClick, label, ariaLabel, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label ? undefined : (ariaLabel || 'WhatsApp')}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white font-semibold shadow-sm hover:bg-[#1ebd58] active:scale-[0.97] transition-all ${className}`}
    >
      <Icon name="chat" className="text-lg" filled />
      {label && <span>{label}</span>}
    </button>
  );
}
