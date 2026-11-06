/* directory/page.js is a client component, so (same reasoning as business/[id]/layout.js) this
   thin server layout is what gives the route its own title/description/canonical instead of
   silently falling back to the root layout's home-page metadata. */
export const metadata = {
  title: 'All local businesses',
  description: 'Browse every trusted local business listed on SocietySpot -- food, groceries, home services, tuition, beauty and more. Filter by society, category or offers, verified listings marked, WhatsApp or call directly.',
  alternates: { canonical: '/directory' },
  openGraph: {
    title: 'All local businesses | SocietySpot',
    description: 'Browse every trusted local business listed on SocietySpot, filterable by society, category and offers.',
    url: '/directory'
  },
  twitter: {
    title: 'All local businesses | SocietySpot',
    description: 'Browse every trusted local business listed on SocietySpot, filterable by society, category and offers.'
  }
};

export default function DirectoryLayout({ children }) {
  return children;
}
