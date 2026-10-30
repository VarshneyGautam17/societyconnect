import { getBusinessForOg } from '@/lib/ogBusiness';

/* business/[id]/page.js is a client component ('use client') -- metadata/generateMetadata
   exports only work from a Server Component (see the vendored Next docs), so this thin server
   layout is what gives each business page its own title/description for link previews. The
   actual preview *image* comes from the sibling opengraph-image.jsx route, which Next merges
   into the resolved metadata automatically -- it doesn't need to be referenced here. */
export async function generateMetadata({ params }) {
  const { id } = await params;
  const business = await getBusinessForOg(id);

  if (!business) {
    return { title: 'Business | SocietySpot' };
  }

  const title = `${business.name} | SocietySpot`;
  const description = business.desc
    ? business.desc.slice(0, 160)
    : `${business.name} in ${business.society.name} -- contact details, offers and more on SocietySpot.`;

  return {
    title,
    description,
    openGraph: { title: business.name, description, type: 'website' },
    twitter: { card: 'summary_large_image', title: business.name, description }
  };
}

export default function BusinessLayout({ children }) {
  return children;
}
