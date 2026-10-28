'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { defaultVendor } from '@/data/businesses';
import { publishVendor } from '@/store/slices/vendorSlice';
import { storageGet, storageSet } from '@/lib/storage';
import { useToast } from '@/components/ui/Toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PreviewCard from '@/components/ui/PreviewCard';
import Stepper from '@/components/onboarding/Stepper';
import WizardHead from '@/components/onboarding/WizardHead';
import WizardFoot from '@/components/onboarding/WizardFoot';
import StepAccount from '@/components/onboarding/steps/StepAccount';
import StepBasics from '@/components/onboarding/steps/StepBasics';
import StepServe from '@/components/onboarding/steps/StepServe';
import StepOfferings from '@/components/onboarding/steps/StepOfferings';
import Icon from '@/components/ui/Icon';

const STEP_COUNT = 5;
const EMPTY_DRAFT = { phone: '', otpSent: false, otp: '', name: '', cat: '', desc: '', whatsapp: '', call: '', same: true, served: [], area: '', items: [['', '', '']], offer: '' };

function buildVendor(draft) {
  const vendor = defaultVendor();
  vendor.name = draft.name;
  vendor.cat = draft.cat;
  vendor.desc = draft.desc || 'New local business.';
  vendor.society = draft.served[0] || 'prestige';
  vendor.served = draft.served.slice();
  vendor.area = draft.area || 'In the society';
  const num = draft.same ? draft.whatsapp : draft.call;
  vendor.phone = '+91 ' + num.replace(/^(\d{2})\d{3}(\d{3})(\d{2})$/, '$1XXX XXX$3');
  vendor.whatsapp = vendor.phone;
  vendor.offer = draft.offer;
  vendor.offerValid = draft.offer ? 'Mention SocietySpot when you order.' : '';
  vendor.items = draft.items.filter((r) => r[0].trim()).map((r) => [r[0], r[1] || '', r[2] || 'On request']);
  vendor.published = true;
  return vendor;
}

function validateStep(step, draft) {
  const errors = {};
  if (step === 0) {
    if (!/^\d{10}$/.test(draft.phone)) errors.phone = 'Enter a 10-digit mobile number.';
  } else if (step === 1) {
    if (!draft.name.trim()) errors.name = 'Please enter your business name.';
    if (!draft.cat) errors.cat = 'Please choose a category.';
    if (!/^\d{10}$/.test(draft.whatsapp)) errors.whatsapp = 'Enter a 10-digit WhatsApp number.';
  } else if (step === 2) {
    if (!draft.served.length) errors.served = 'Choose at least one society.';
  } else if (step === 3) {
    if (!draft.items.some((r) => r[0].trim())) errors.items = 'Add at least one item or service.';
  }
  return errors;
}

export default function OnboardingPage() {
  const dispatch = useDispatch();
  const toast = useToast();
  const vendor = useSelector((state) => state.vendor.current);

  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [errors, setErrors] = useState({});
  const [justPublished, setJustPublished] = useState(false);

  useEffect(() => {
    /* localStorage only exists in the browser, so this one-time hydration has to happen post-mount
       (reading it in a lazy useState initializer would run during SSR too and cause a hydration
       mismatch). */
    const saved = storageGet('draft', null);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setDraft({ ...EMPTY_DRAFT, ...saved });
  }, []);

  function patch(partial) {
    const next = { ...draft, ...partial };
    setDraft(next);
    storageSet('draft', next);
  }

  function onBack() {
    setStep((s) => Math.max(0, s - 1));
    setErrors({});
  }
  function onSaveLater() {
    storageSet('draft', draft);
    toast('Saved. You can continue later on this device.');
  }
  function onSubmit(e) {
    e.preventDefault();
    if (step === 0 && draft.otpSent) {
      if (!/^\d{4}$/.test(draft.otp || '')) { setErrors({ otp: 'Enter the 4-digit code.' }); return; }
      setErrors({});
      setStep(1);
      return;
    }
    const nextErrors = validateStep(step, draft);
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); return; }
    if (step === 0) {
      patch({ otpSent: true });
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function onPublish() {
    const built = buildVendor(draft);
    dispatch(publishVendor(built));
    storageSet('draft', null);
    setJustPublished(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const alreadyPublished = vendor && vendor.published && !justPublished;

  return (
    <div className="flex flex-col min-h-screen">
      <Header minimal />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="pt-9 pb-4">
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-md text-on-surface tracking-tight mb-2">List your business</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Go live in about 5 minutes. Free for your first 1 to 2 months.</p>
        </div>

        {alreadyPublished ? (
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant/30 shadow-sm text-center py-10 mb-16">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4"><Icon name="check" className="text-3xl" /></div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">You already have a listing</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">{vendor.name} is live. Manage it from your dashboard.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-semibold hover:bg-primary-container shadow-sm transition-colors">Go to dashboard</Link>
              <button type="button" onClick={() => setJustPublished(true)} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-outline-variant text-on-surface font-label-lg text-label-lg font-semibold hover:border-primary hover:text-primary transition-colors">List another business</button>
            </div>
          </div>
        ) : justPublished ? (
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant/30 shadow-sm text-center py-10 mb-16">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4"><Icon name="check" className="text-3xl" /></div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-2">Your business is live</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">Your free trial has started. Residents of the societies you chose can now find you.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-semibold hover:bg-primary-container shadow-sm transition-colors">Go to dashboard</Link>
              <Link href="/business/mine" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-outline-variant text-on-surface font-label-lg text-label-lg font-semibold hover:border-primary hover:text-primary transition-colors">View my page</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6 items-start pb-16">
            <Stepper step={step} />
            <section className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant/30 shadow-sm" aria-live="polite">
              {step < 4 ? (
                <form onSubmit={onSubmit} noValidate>
                  <WizardHead step={step} total={STEP_COUNT} />
                  {step === 0 && <StepAccount draft={draft} patch={patch} errors={errors} />}
                  {step === 1 && <StepBasics draft={draft} patch={patch} errors={errors} />}
                  {step === 2 && <StepServe draft={draft} patch={patch} errors={errors} />}
                  {step === 3 && <StepOfferings draft={draft} patch={patch} errors={errors} />}
                  <WizardFoot
                    nextLabel={step === 0 ? (draft.otpSent ? 'Verify and continue' : 'Send code') : step === 3 ? 'Preview my page' : 'Continue'}
                    hideBack={step === 0}
                    onBack={onBack}
                    onSaveLater={onSaveLater}
                  />
                </form>
              ) : (
                <>
                  <WizardHead step={step} total={STEP_COUNT} />
                  <h2 className="font-headline-sm text-headline-sm text-on-surface mb-5">Preview your page</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-5">This is how residents will see your listing.</p>
                  <div className="max-w-sm">
                    <PreviewCard business={buildVendor(draft)} />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mt-7 pt-5 border-t border-outline-variant/30">
                    <button type="button" onClick={onBack} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-outline-variant text-on-surface font-label-lg text-label-lg font-semibold hover:border-primary hover:text-primary transition-colors">Back to edit</button>
                    <button type="button" onClick={onPublish} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg font-semibold hover:bg-primary-container shadow-sm transition-colors">Publish my business</button>
                  </div>
                </>
              )}
            </section>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
