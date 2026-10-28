export default function WizardHead({ step, total }) {
  const pct = Math.round(((step + 1) / total) * 100);
  return (
    <div className="mb-7">
      <div className="flex justify-between items-center mb-2">
        <span className="font-label-md text-label-md font-bold text-primary">Step {step + 1} of {total}</span>
        <span className="font-label-md text-label-md text-on-surface-variant">Saved automatically</span>
      </div>
      <div className="h-1.5 rounded-full bg-surface-container-high overflow-hidden">
        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
