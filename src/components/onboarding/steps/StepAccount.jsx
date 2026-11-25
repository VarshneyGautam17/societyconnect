import Field, { inputCls } from '@/components/ui/Field';

export default function StepAccount({ draft, patch, errors, checking, onResend }) {
  return (
    <>
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-5">Create your account</h2>
      <div className="flex flex-col gap-5">
        <Field label="Mobile number" error={errors.phone} hint="We'll send a 6-digit code on WhatsApp to verify it's really you.">
          <input
            value={draft.phone}
            onChange={(e) => {
              const phone = e.target.value.replace(/\D/g, '').slice(0, 10);
              /* A changed number invalidates any code already sent to the old one. */
              patch(phone === draft.phone ? { phone } : { phone, otpSent: false, otp: '' });
            }}
            inputMode="numeric"
            maxLength={10}
            placeholder="e.g. 9876543210 (10 digits, no +91)"
            className={`${inputCls} ${errors.phone ? 'border-error' : 'border-outline-variant'}`}
          />
        </Field>
        {draft.otpSent && (
          <Field label="One-time code" error={errors.otp} hint="Check WhatsApp on that number for the code.">
            <input
              name="otp"
              value={draft.otp || ''}
              onChange={(e) => patch({ otp: e.target.value.replace(/\D/g, '').slice(0, 6) })}
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit code"
              className={`${inputCls} ${errors.otp ? 'border-error' : 'border-outline-variant'}`}
            />
            <button
              type="button"
              onClick={onResend}
              disabled={checking}
              className="mt-2 font-label-sm text-label-sm font-semibold text-primary hover:underline disabled:opacity-60 disabled:pointer-events-none"
            >
              Resend code
            </button>
          </Field>
        )}
      </div>
    </>
  );
}
