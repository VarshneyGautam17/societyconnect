export default function WizardFoot({ nextLabel, hideBack, onBack, onSaveLater, busy = false }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mt-7 pt-5 border-t border-outline-variant/30">
      <button
        type="button"
        onClick={onBack}
        className={
          'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-outline-variant text-on-surface font-label-lg text-label-lg font-semibold hover:border-primary hover:text-primary transition-colors' +
          (hideBack ? ' invisible' : '')
        }
      >
        Back
      </button>
      <div className="flex flex-wrap items-center gap-4">
        <button type="button" onClick={onSaveLater} className="font-label-lg text-label-lg font-semibold text-primary">
          Save and continue later
        </button>
        <button type="submit" disabled={busy} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-semibold hover:bg-primary-container shadow-sm transition-colors disabled:opacity-70 disabled:cursor-wait">
          {busy && <span className="w-4 h-4 rounded-full border-2 border-on-primary border-t-transparent animate-spin" aria-hidden="true" />}
          {nextLabel}
        </button>
      </div>
    </div>
  );
}
