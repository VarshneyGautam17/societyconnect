/* Listings come from Supabase (approved rows of `businesses`, see src/lib/listings.js) plus the
   vendor's own listing on this device (vendorSlice) -- there is no built-in sample data. */

/** A vendor's own listing before they've filled anything in: every content field blank. Hours
 *  start as a common Mon-Sat schedule the vendor edits rather than seven empty rows. */
export function emptyVendor() {
  return {
    id: 'mine', name: '', slug: '', cat: '', society: '', area: '',
    desc: '', verified: false, offer: '', offerValid: '',
    items: [],
    phone: '', whatsapp: '', hidePhone: true,
    hours: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => ({ day: d, open: i < 6, from: '8:00 am', to: '9:00 pm' })),
    served: [], published: false, banner: null, photos: []
  };
}
