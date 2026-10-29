/* The edit-form components (BasicInfoForm, PhotoManager, ItemsEditor, ...)
   were built against the Redux vendor shape (camelCase: offerValid, hidePhone).
   The Supabase `businesses` row is snake_case. These two functions are the
   only place that translates between them, so the admin editor can reuse
   those components unchanged. */

export function dbRowToFormVendor(row) {
  return {
    id: row.id,
    name: row.name,
    cat: row.cat,
    society: row.society,
    served: row.served || [],
    area: row.area,
    desc: row.desc,
    phone: row.phone,
    whatsapp: row.whatsapp,
    hidePhone: row.hide_phone,
    verified: row.verified,
    offer: row.offer,
    offerValid: row.offer_valid,
    items: row.items || [],
    hours: row.hours || [],
    banner: row.banner || null,
    photos: row.photos || []
  };
}

export function formVendorToDbPatch(v) {
  return {
    name: v.name,
    cat: v.cat,
    society: v.served?.[0] || v.society,
    served: v.served,
    area: v.area,
    desc: v.desc,
    phone: v.phone,
    whatsapp: v.whatsapp,
    hide_phone: v.hidePhone,
    verified: v.verified,
    offer: v.offer,
    offer_valid: v.offerValid,
    items: v.items,
    hours: v.hours,
    banner: v.banner || null,
    photos: v.photos
  };
}
