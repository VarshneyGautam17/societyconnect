/* CSP intentionally keeps script-src/style-src permissive ('unsafe-inline') -- Next.js's App
   Router hydration bootstrap and Tailwind both rely on inline script/style, and this app has no
   nonce-per-request middleware wired up to tighten that safely. The rest (frame-ancestors,
   object-src, base-uri, form-action, and explicit img/font/connect allowlists) still blocks
   clickjacking, plugin-based attacks, and exfiltration to unexpected hosts. There is no known
   XSS path in this app (see src/components/ui/RichText.jsx -- output is always React-escaped
   plain text, never dangerouslySetInnerHTML), so this is defense-in-depth, not a patch for one. */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://*.supabase.co https://api.cloudinary.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'"
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: CSP },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* This app is entirely client-rendered (Redux + localStorage state), so the experimental
     Cache Components / Partial Prerendering features (meant for static+dynamic content sites)
     just get in the way here — disabled. */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  }
};

export default nextConfig;
