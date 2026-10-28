export default function StatsGrid({ views, contactAttempts, enquiryCount, savedCount }) {
  const stats = [
    ['Profile views', views, 'Last 30 days'],
    ['Contact attempts', contactAttempts.total, `WhatsApp ${contactAttempts.wa} · Call ${contactAttempts.call} · Enquiry ${contactAttempts.enq}`],
    ['Enquiries received', enquiryCount, enquiryCount ? `${enquiryCount} in your inbox` : 'None yet'],
    ['Saved by residents', savedCount, 'Total saves']
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s[0]} className="bg-surface-container-lowest rounded-2xl p-5 border border-outline-variant/30 shadow-sm">
          <small className="font-label-md text-label-md text-on-surface-variant">{s[0]}</small>
          <strong className="block font-display text-4xl text-on-surface mt-1.5">{s[1]}</strong>
          <em className="block not-italic font-body-sm text-body-sm text-on-surface-variant mt-1">{s[2]}</em>
        </div>
      ))}
    </div>
  );
}
