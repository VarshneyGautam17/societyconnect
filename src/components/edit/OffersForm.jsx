export default function OffersForm({ v, patch }) {
  return (
    <section className="bg-gradient-to-br from-amber-50 to-orange-50/70 border border-amber-200/60 rounded-3xl p-6 shadow-sm" id="offers">
      <h2 className="font-headline-sm text-headline-sm text-amber-950 mb-4">Offers</h2>
      <div className="flex flex-col gap-4">
        <label className="block font-label-md text-label-md font-semibold text-amber-950">
          Offer title
          <input
            value={v.offer}
            onChange={(e) => patch({ offer: e.target.value })}
            maxLength={200}
            className="block w-full mt-2 min-h-[48px] rounded-2xl border border-amber-300 bg-white/70 px-4 font-body-md text-body-md focus:border-amber-600 focus:outline-none"
          />
        </label>
        <label className="block font-label-md text-label-md font-semibold text-amber-950 max-w-xs">
          Valid till
          <input
            value={v.offerValid || ''}
            onChange={(e) => patch({ offerValid: e.target.value })}
            maxLength={100}
            className="block w-full mt-2 min-h-[48px] rounded-2xl border border-amber-300 bg-white/70 px-4 font-body-md text-body-md focus:border-amber-600 focus:outline-none"
          />
        </label>
      </div>
    </section>
  );
}
