import Icon from '@/components/ui/Icon';

const STEPS = ['Create account', 'Business basics', 'Where you serve', 'Photos and offerings', 'Preview and publish'];

export default function Stepper({ step }) {
  return (
    <ol className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/30 shadow-sm flex flex-row lg:flex-col flex-wrap gap-4 lg:gap-5">
      {STEPS.map((label, i) => {
        const isCurrent = i === step;
        const isDone = i < step;
        return (
          <li
            key={label}
            aria-current={isCurrent ? 'step' : undefined}
            className={`flex items-center gap-3 font-label-lg text-label-lg ${isCurrent ? 'text-on-surface font-bold' : 'text-on-surface-variant font-medium'}`}
          >
            <span
              className={
                'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-none ' +
                (isDone ? 'bg-emerald-600 text-white' : isCurrent ? 'bg-primary text-on-primary' : 'border border-outline-variant text-on-surface-variant')
              }
            >
              {isDone ? <Icon name="check" className="text-base" /> : i + 1}
            </span>
            <span className="hidden lg:inline">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
