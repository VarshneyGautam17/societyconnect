import Link from 'next/link';

export default function TopBar({ name, published, dirty, onPreviewClick, onPublish }) {
  return (
    <div className="bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/30 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-wrap items-center gap-4 py-3">
        <Link href="/dashboard" className="font-label-lg text-label-lg font-semibold text-on-surface-variant hover:text-primary transition-colors">&larr; Dashboard</Link>
        <div className="flex-1 min-w-[160px]"><strong className="block font-label-lg text-label-lg text-on-surface">{name}</strong></div>
        <span className={`font-label-sm text-label-sm font-bold px-3 py-1.5 rounded-full ${published ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-container-high text-on-surface-variant'}`}>
          {published ? 'Published' : 'Draft'}
        </span>
        {dirty && <span className="font-label-sm text-label-sm font-bold px-3 py-1.5 rounded-full bg-amber-100 text-amber-800">Unsaved changes</span>}
        <Link href="/business/mine" onClick={onPreviewClick} className="inline-flex items-center px-4 py-2 rounded-full border border-outline-variant text-on-surface font-label-md text-label-md font-semibold hover:border-primary transition-colors">Preview as resident</Link>
        <button type="button" onClick={onPublish} className="inline-flex items-center px-5 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container shadow-sm transition-colors">Publish changes</button>
      </div>
    </div>
  );
}
