import { createClient } from '@supabase/supabase-js';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/* Static shell pages + every approved, publicly-visible business listing -- the same
   `status = 'approved'` public-read policy the business page itself relies on (see
   src/lib/ogBusiness.js), so this never lists a pending/rejected/disabled listing a crawler
   couldn't actually see. Societies have no page of their own (/societies is a single list), so
   there's nothing per-society to add. */
export default async function sitemap() {
  const staticRoutes = [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/directory`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/societies`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/onboarding`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 }
  ];

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return staticRoutes;

  const supabase = createClient(url, key);
  const { data } = await supabase
    .from('businesses')
    .select('id, updated_at')
    .eq('status', 'approved')
    .order('updated_at', { ascending: false })
    .limit(45000); // Google's sitemap cap is 50,000 URLs; the 4 static routes above leave this room.

  const businessRoutes = (data || []).map((b) => ({
    url: `${SITE_URL}/business/${b.id}`,
    lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  return [...staticRoutes, ...businessRoutes];
}
