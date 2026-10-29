import Icon from '@/components/ui/Icon';
import Reveal from '@/components/ui/Reveal';

const STEPS = [
  { num: '01', bg: 'bg-primary-fixed', fg: 'text-primary', title: 'Choose your society', body: 'We open the last society you used, or you can detect or pick it from the header selector in one tap.', foot: 'Instant switch anytime', footIcon: 'text-primary' },
  { num: '02', bg: 'bg-tertiary-fixed', fg: 'text-tertiary', title: 'Discover local businesses', body: 'Search or filter by category right on this page. Read descriptions, pricing and apartment tower roots.', foot: 'Zero login required to browse', footIcon: 'text-tertiary' },
  { num: '03', bg: 'bg-secondary-fixed', fg: 'text-secondary', title: 'Contact and connect', body: '100% of payment goes to your neighbor creator.', foot: 'Zero platform fees', footIcon: 'text-secondary' }
];

export default function HowItWorks() {
  return (
    <section className="py-8 md:py-16 bg-surface-container-low/40" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <Reveal className="text-center max-w-xl mx-auto mb-5 md:mb-10">
          <h2 className="font-headline-lg text-headline-md md:text-headline-lg text-on-surface tracking-tight mb-2">How it works</h2>
          <p className="font-body-sm md:font-body-md text-body-sm md:text-body-md text-on-surface-variant">Simple, neighbor-first discovery built around privacy and zero middleman commissions.</p>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8">
          {STEPS.map((s, i) => (
            <Reveal key={s.num} delay={i * 110} className="bg-surface-container-lowest rounded-2xl md:rounded-3xl p-4 md:p-8 border border-outline-variant/30 shadow-sm flex flex-col justify-between">
              <div>
                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${s.bg} ${s.fg} flex items-center justify-center font-display text-lg md:text-2xl font-extrabold mb-3 md:mb-6 shadow-sm`}>{s.num}</div>
                <h3 className="font-headline-sm text-label-lg md:text-headline-sm text-on-surface mb-1.5 md:mb-3">{s.title}</h3>
                <p className="font-body-sm md:font-body-md text-body-sm md:text-body-md text-on-surface-variant leading-relaxed">{s.body}</p>
              </div>
              <div className="mt-3 md:mt-6 pt-3 md:pt-4 border-t border-outline-variant/20 flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm font-semibold">
                <Icon name="check" className={`text-xs ${s.footIcon}`} />
                <span>{s.foot}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
