import Field, { inputCls } from '@/components/ui/Field';

export default function StepAccount({ draft, patch, errors }) {
  return (
    <>
      <h2 className="font-headline-sm text-headline-sm text-on-surface mb-5">Create your account</h2>
      <div className="flex flex-col gap-5">
        <Field label="Mobile number" error={errors.phone} hint="We will send a one-time code. No long forms.">
          <input
            value={draft.phone}
            onChange={(e) => patch({ phone: e.target.value.replace(/\D/g, '') })}
            inputMode="numeric"
            maxLength={10}
            placeholder="10-digit mobile number"
            className={`${inputCls} ${errors.phone ? 'border-error' : 'border-outline-variant'}`}
          />
        </Field>
        {draft.otpSent && (
          <Field label="One-time code" error={errors.otp} hint="Demo: enter any 4 digits.">
            <input
              name="otp"
              value={draft.otp || ''}
              onChange={(e) => patch({ otp: e.target.value.replace(/\D/g, '') })}
              inputMode="numeric"
              maxLength={4}
              placeholder="4-digit code"
              className={`${inputCls} ${errors.otp ? 'border-error' : 'border-outline-variant'}`}
            />
          </Field>
        )}
      </div>
    </>
  );
}
