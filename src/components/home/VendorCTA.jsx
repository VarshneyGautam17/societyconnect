import Link from 'next/link';
import Icon from '@/components/ui/Icon';

export default function VendorCTA() {
  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="relative bg-inverse-surface text-inverse-on-surface rounded-3xl md:rounded-[3rem] p-8 md:p-16 overflow-hidden shadow-2xl">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-container/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-inverse-on-surface font-label-md text-label-md font-semibold mb-6">
                <Icon name="volunteer_activism" className="text-amber-400 text-sm" filled />
                <span>Resident Merchant Program</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-white font-extrabold tracking-tight mb-4 max-w-2xl">
                Are you running a business in your society?
              </h2>
              <p className="font-body-lg text-body-lg text-inverse-on-surface/80 max-w-xl mb-8 leading-relaxed">
                Reach more local customers and make your business easy to discover. Start with a free introductory period and showcase your skills to hundreds of gated community residents.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/onboarding" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-on-surface font-label-lg text-label-lg font-bold hover:bg-slate-100 shadow-lg active:scale-95 transition-all">
                  <span>List your business</span>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-primary/10 text-primary">Free trial</span>
                </Link>
                <a href="#how-it-works" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-label-lg text-label-lg font-semibold transition-colors">
                  <Icon name="help_outline" className="text-sm" />
                  <span>Learn vendor guidelines</span>
                </a>
              </div>
            </div>
            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <div className="w-56 h-56 rounded-full bg-gradient-to-tr from-primary to-primary-container p-1 shadow-2xl flex items-center justify-center animate-gentle-drift">
                <div className="w-full h-full rounded-full bg-inverse-surface border border-white/20 flex flex-col items-center justify-center text-center p-6">
                  <Icon name="volunteer_activism" className="text-emerald-400 text-3xl mb-2" filled />
                  <span className="font-headline-sm text-headline-sm font-extrabold text-white leading-tight">100% Free</span>
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
