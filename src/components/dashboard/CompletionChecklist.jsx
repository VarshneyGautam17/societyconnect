import Link from 'next/link';
import Icon from '@/components/ui/Icon';

export default function CompletionChecklist({ checks }) {
  const done = checks.filter((c) => c.done).length;
  const pct = Math.round((done / checks.length) * 100);
  return (
    <section className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">Profile completion</h2>
        <strong className="text-primary font-headline-sm text-headline-sm">{pct}%</strong>
      </div>
      <div className="h-2 rounded-full bg-surface-container-high overflow-hidden my-3">
        <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex flex-col gap-2.5 font-body-md text-body-md">
        {checks.map((c) =>
          c.done ? (
            <span key={c.label} className="flex items-center gap-2 text-emerald-700 font-medium"><Icon name="check" className="text-base" />{c.label}</span>
          ) : (
            <Link key={c.label} href={c.href} className="text-primary font-semibold hover:underline">{c.label}</Link>
          )
        )}
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-4 pt-4 border-t border-outline-variant/30">
        <strong className="text-on-surface">Top picks this month:</strong> not featured yet. Complete profiles with photos get seen more. Placement is never guaranteed.
      </p>
    </section>
  );
}
