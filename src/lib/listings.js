'use client';

import { createClient } from '@/lib/supabase/client';
import { dbRowToFormVendor } from '@/lib/businessMapper';
import { listingsFailed, listingsLoaded, listingsLoading } from '@/store/slices/listingsSlice';

/** Fetches every approved listing into the store (RLS only exposes approved rows to the
 *  public anyway -- see supabase/schema.sql). Called once by Providers on boot. */
export async function loadListings(dispatch) {
  dispatch(listingsLoading());
  const { data, error } = await createClient()
    .from('businesses')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });
  if (error) {
    dispatch(listingsFailed());
    return;
  }
  dispatch(listingsLoaded(data.map(dbRowToFormVendor)));
}
