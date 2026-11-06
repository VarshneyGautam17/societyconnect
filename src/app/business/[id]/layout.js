import { getBusinessForOg } from '@/lib/ogBusiness';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/* business/[id]/page.js is a client component ('use client') -- metadata/generateMetadata
   exports only work from a Server Component (see the vendored Next docs), so this thin server
   layout is what gives each business page its own title/description for link previews. The
   actual preview *image* comes from the sibling opengraph-image.jsx route, which Next merges
   into the resolved metadata automatically -- it doesn't need to be referenced here. */
export async function generateMetadata({ params }) {
  const { id } = await params;
  const business = await getBusinessForOg(id);

  if (!business) {
    return { title: 'Business not found' };
  }

  const title = business.name;
  const description = business.desc
    ? business.desc.slice(0, 160)
    : `${business.name} in ${business.society.name} -- contact details, offers and more on SocietySpot.`;

  return {
    title,
    description,
    /* `url` is one of the four properties the Open Graph spec marks required (og:title,
       og:type, og:image, og:url) -- without it, some crawlers (WhatsApp's among them, by
       observation) render the title/description text but drop the image entirely instead of
       just ignoring the missing field. `alternates.canonical` gets Next to also emit a matching
       <link rel="canonical">, which is the same URL and cheap to add alongside it. */
    alternates: { canonical: `/business/${id}` },
    openGraph: { title: business.name, description, url: `/business/${id}`, siteName: 'SocietySpot', type: 'website' },
    twitter: { card: 'summary_large_image', title: business.name, description }
  };
}

/* LocalBusiness + BreadcrumbList structured data -- `getBusinessForOg` is React-`cache`d (see
   src/lib/ogBusiness.js), so this second call within the same request is a free in-memory hit,
   not a second Supabase round trip. Never invents data the listing doesn't have: no
   aggregateRating/review (this app has no review system), telephone only when the vendor made it
   always-public (see the comment in ogBusiness.js). */
export default async function BusinessLayout({ children, params }) {
  const { id } = await params;
  const business = await getBusinessForOg(id);
  if (!business) return children;

  const url = `${SITE_URL}/business/${id}`;
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: business.name,
      description: business.desc || undefined,
      image: business.imageUrl || undefined,
      url,
      additionalType: business.cat?.name,
      ...(business.telephone ? { telephone: business.telephone } : {}),
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.area || undefined,
        addressLocality: business.society?.name,
        addressRegion: business.society?.place || undefined,
        addressCountry: 'IN'
      },
      ...(business.society?.lat && business.society?.lng
        ? { geo: { '@type': 'GeoCoordinates', latitude: business.society.lat, longitude: business.society.lng } }
        : {})
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: business.society?.name || 'SocietySpot', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: business.cat?.name, item: `${SITE_URL}/directory?cat=${encodeURIComponent(business.cat?.id || '')}` },
        { '@type': 'ListItem', position: 3, name: business.name, item: url }
      ]
    }
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
