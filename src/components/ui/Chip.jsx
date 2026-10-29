import Icon from '@/components/ui/Icon';

export default function Chip({ label, iconName, pressed, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={
        'flex-none inline-flex items-center gap-1.5 px-3.5 py-1.5 md:px-5 md:py-2 rounded-full font-label-sm md:font-label-md text-label-sm md:text-label-md font-semibold whitespace-nowrap transition-colors ' +
        (pressed ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-lowest border border-outline-variant/40 hover:border-primary text-on-surface')
      }
    >
      {iconName && <Icon name={iconName} className="text-xs md:text-sm" />}
      <span>{label}</span>
    </button>
  );
}
