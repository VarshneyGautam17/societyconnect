import Icon from '@/components/ui/Icon';

export default function Chip({ label, iconName, pressed, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={
        'flex-none inline-flex items-center gap-2 px-5 py-2 rounded-full font-label-md text-label-md font-semibold whitespace-nowrap transition-colors ' +
        (pressed ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-lowest border border-outline-variant/40 hover:border-primary text-on-surface')
      }
    >
      {iconName && <Icon name={iconName} className="text-sm" />}
      <span>{label}</span>
    </button>
  );
}
