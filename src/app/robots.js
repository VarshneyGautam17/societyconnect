const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/* Every resident-facing page (home, directory, societies, business pages, onboarding) is left
   fully crawlable on purpose -- the whole point of this app is to be found. Only genuinely
   private/functional routes are blocked: signed-in-only screens (dashboard, edit) that show one
   vendor's own data and would otherwise show up as thin duplicate/empty pages to a crawler with
   no session, the admin console, and the resident-login API route (a form target, not content). */
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/edit', '/admin', '/access']
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  };
}
