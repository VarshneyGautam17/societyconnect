import Icon from '@/components/ui/Icon';

const STEPS = [
  { num: '01', bg: 'bg-[#EEF2FF]', fg: 'text-primary', title: 'Choose your society', body: 'We open the last society you used, or you can detect or pick it from the header selector in one tap.', foot: 'Instant switch anytime', footIcon: 'text-primary' },
  { num: '02', bg: 'bg-[#ECFDF5]', fg: 'text-emerald-700', title: 'Discover local businesses', body: 'Search or filter by category right on this page. Read descriptions, pricing and apartment tower roots.', foot: 'Zero login required to browse', footIcon: 'text-emerald-600' },
  { num: '03', bg: 'bg-[#FEF3C7]', fg: 'text-amber-700', title: 'Contact and connect', body: '100% of payment goes to your neighbor creator.', foot: 'Zero platform fees', footIcon: 'text-amber-600' }
];

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-surface-container-low/40" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-3">How it works</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Simple, neighbor-first discovery built around privacy and zero middleman commissions.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((s) => (
            <div key={s.num} className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 shadow-sm flex flex-col justify-between">
              <div>
                <div className={`w-14 h-14 rounded-2xl ${s.bg} ${s.fg} flex items-center justify-center font-display text-2xl font-extrabold mb-6 shadow-sm`}>{s.num}</div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-3">{s.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{s.body}</p>
              </div>
              <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm font-semibold">
                <Icon name="check" className={`text-xs ${s.footIcon}`} />
                <span>{s.foot}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
