import { createClient } from '@supabase/supabase-js';
import { catOf } from '@/data/categories';
import { socOf } from '@/data/societies';
import { bizImg } from '@/lib/images';
import { stripRichText } from '@/lib/richText';
import { isUuid } from '@/lib/slugify';

/** Server-only lookup shared by the business page's generateMetadata (title/description) and
 *  its opengraph-image route (the share poster), so both agree on what a given :id resolves to
 *  without duplicating the listing lookup business/[id]/page.js does client-side for the page
 *  itself. Uses the plain anon Supabase client (no cookies/session needed) since this only ever
 *  reads a public, already-approved listing -- RLS (see supabase/schema.sql) enforces that even
 *  if the `status` filter below were ever removed. */
export async function getBusinessForOg(id) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  const supabase = createClient(url, key);
  /* `id` is a uuid column -- comparing it against a non-uuid string (a custom slug) throws a
     Postgres type error rather than just no match, so which column to query has to be decided
     up front instead of OR-ing both into one request. */
  const column = isUuid(id) ? 'id' : 'slug';
  const { data } = await supabase.from('businesses').select('*').eq(column, id).eq('status', 'approved').maybeSingle();
  if (!data) return null;
  /* Societies vendors added live only in the database, not in the seed list socOf() falls back to. */
  const { data: society } = await supabase.from('societies').select('id, name, place, lat, lng, bg, fg').eq('id', data.society).maybeSingle();

  return {
    name: data.name,
    desc: stripRichText(data.desc),
    cat: catOf(data.cat),
    society: society || socOf(data.society),
    area: data.area,
    verified: data.verified,
    imageUrl: bizImg({ id: data.id, cat: data.cat, banner: data.banner, photos: data.photos }, 600, 315)
  };
}
