'use server';

import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';

/* Societies only change when an admin adds one (during vendor onboarding) or fills in its
   lat/lng while reviewing that society's first listing (see supabase/schema.sql) -- for every
   visitor this list is effectively static. Previously src/lib/societies.js queried Supabase
   directly from the browser on every single app boot, for every visitor; this caches that read
   on the server instead, so it's one Supabase query per 10 minutes total, not one per visit.
   The admin's own vendor-approval flow (admin/vendors/page.js) reads societies straight from
   Supabase, not through this cache, so a brand-new society's coordinates are never stale for
   the person who has to set them -- this cache is only for the public-facing, read-only list. */
export const getCachedSocieties = unstable_cache(
  async () => {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const { data, error } = await supabase.from('societies').select('id, name, place, lat, lng, bg, fg').order('name');
    if (error) throw error;
    return data;
  },
  ['societies-list'],
  { revalidate: 600 }
);
