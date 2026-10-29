import Link from 'next/link';
import Icon from '@/components/ui/Icon';

export default function VendorCTA() {
  return (
    <section className="py-8 md:py-16 bg-surface">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="relative bg-inverse-surface text-inverse-on-surface rounded-2xl md:rounded-[3rem] p-5 md:p-16 overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-container/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full glass-dark text-inverse-on-surface font-label-sm md:font-label-md text-label-sm md:text-label-md font-semibold mb-3 md:mb-6">
                <Icon name="volunteer_activism" className="text-secondary-fixed-dim text-sm" filled />
                <span>Resident Merchant Program</span>
              </div>
              <h2 className="font-headline-lg text-headline-md md:text-headline-lg text-white font-extrabold tracking-tight mb-2 md:mb-4 max-w-2xl">
                Are you running a business in your society?
              </h2>
              <p className="font-body-sm md:font-body-lg text-body-sm md:text-body-lg text-inverse-on-surface/80 max-w-xl mb-4 md:mb-8 leading-relaxed">
                Reach more local customers and make your business easy to discover. Start with a free introductory period and showcase your skills to hundreds of gated community residents.
              </p>
              <div className="flex flex-wrap items-center gap-3 md:gap-4">
                <Link href="/onboarding" className="inline-flex items-center gap-2 px-5 py-2.5 md:px-8 md:py-3.5 rounded-full bg-white text-on-surface font-label-md md:font-label-lg text-label-md md:text-label-lg font-bold hover:bg-surface-container-high shadow-lg active:scale-95 transition-all">
                  <span>List your business</span>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-primary/10 text-primary">Free trial</span>
                </Link>
                <a href="#how-it-works" className="inline-flex items-center gap-2 px-4 py-2.5 md:px-6 md:py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-label-md md:font-label-lg text-label-md md:text-label-lg font-semibold transition-colors">
                  <Icon name="help_outline" className="text-sm" />
                  <span>Learn vendor guidelines</span>
                </a>
              </div>
            </div>
            <div className="hidden sm:flex lg:col-span-4 justify-center lg:justify-end">
              <div className="w-40 h-40 md:w-56 md:h-56 rounded-full bg-gradient-to-tr from-primary to-primary-container p-1 shadow-2xl flex items-center justify-center animate-gentle-drift">
                <div className="w-full h-full rounded-full glass-dark flex flex-col items-center justify-center text-center p-4 md:p-6">
                  <Icon name="volunteer_activism" className="text-tertiary-fixed-dim text-2xl md:text-3xl mb-1.5 md:mb-2" filled />
                  <span className="font-headline-sm text-label-lg md:text-headline-sm font-extrabold text-white leading-tight">100% Free</span>
                  <span className="font-label-sm text-label-sm text-inverse-on-surface/80 mt-1 uppercase tracking-wider font-semibold">For Individual Resident Creators</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
