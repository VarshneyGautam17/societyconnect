export const inputCls = 'block w-full mt-2 min-h-[48px] rounded-2xl border px-4 font-body-md text-body-md focus:border-primary focus:outline-none';

export default function Field({ label, error, hint, children }) {
  return (
    <label className="block font-label-md text-label-md font-semibold text-on-surface">
      {label}
      {children}
      {hint && !error && <span className="block mt-1.5 font-body-sm text-body-sm text-on-surface-variant">{hint}</span>}
      {error && <span className="block mt-1.5 font-body-sm text-body-sm text-error">{error}</span>}
    </label>
  );
}
