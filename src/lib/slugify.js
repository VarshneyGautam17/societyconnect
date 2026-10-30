/** Turns free text into a URL-safe slug: lowercase, ASCII letters/digits only, words joined by
 *  single hyphens, no leading/trailing hyphen. Used for the onboarding "business URL" field, both
 *  to auto-suggest a slug from the business name and to clean up whatever the vendor types. */
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** True if `value` is shaped like a Supabase row id, as opposed to a custom slug -- used to
 *  decide which column a business lookup should query (see ogBusiness.js and business/[id]/page.js),
 *  since comparing a non-uuid string against a uuid column throws a Postgres error rather than
 *  just failing to match. */
export function isUuid(value) {
  return UUID_RE.test(String(value || ''));
}

export function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}
