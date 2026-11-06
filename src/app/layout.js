import './globals.css';
import Providers from './providers';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SITE_NAME = 'SocietySpot';
const TITLE_DEFAULT = 'SocietySpot: trusted local businesses in your society';
const DESCRIPTION = 'Discover and list trusted local businesses in your residential society across India. Browse verified vendors by category, WhatsApp or call them directly, or list your own business free in minutes.';

/* Search-console ownership tags -- only emitted when the matching env var is actually set, so a
   deploy with none configured yet doesn't ship empty/placeholder meta tags. Add
   GOOGLE_SITE_VERIFICATION / BING_SITE_VERIFICATION / YANDEX_SITE_VERIFICATION to .env.local (and
   the host) once each search console gives you a code -- no code change needed after that. */
const verification = {};
if (process.env.GOOGLE_SITE_VERIFICATION) verification.google = process.env.GOOGLE_SITE_VERIFICATION;
if (process.env.YANDEX_SITE_VERIFICATION) verification.yandex = process.env.YANDEX_SITE_VERIFICATION;
if (process.env.BING_SITE_VERIFICATION) verification.other = { 'msvalidate.01': process.env.BING_SITE_VERIFICATION };

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE_DEFAULT, template: `%s | ${SITE_NAME}` },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'SocietySpot', 'local businesses near me', 'society vendors', 'apartment services India',
    'residential society marketplace', 'find local vendors', 'list your business free',
    'neighborhood services', 'gated community businesses', 'local business directory India'
  ],
  category: 'Local business directory',
  referrer: 'origin-when-cross-origin',
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: '/' },
  /* Explicitly maximal, not just the default -- large image previews and unlimited snippet/video
     preview lengths in search results, with nothing held back from any crawler. */
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, noimageindex: false, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 }
  },
  ...(Object.keys(verification).length ? { verification } : {}),
  openGraph: {
    title: TITLE_DEFAULT,
    description: DESCRIPTION,
    url: '/',
    siteName: SITE_NAME,
    locale: 'en_IN',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE_DEFAULT,
    description: DESCRIPTION
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1565c0',
  colorScheme: 'light'
};

/* Site-wide structured data: Organization (so Google can attach the logo/name to the brand
   knowledge panel) + WebSite with a SearchAction (the "sitelinks search box" that can show a
   search field directly in Google results) pointed at the directory's own ?q= search, which
   src/app/directory/page.js already reads on load. Kept here, once, rather than per-page --
   schema.org has no issue with a single Organization/WebSite node declared site-wide. */
const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo-mark.png`,
    description: DESCRIPTION
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/directory?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  }
];

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400..800;1,400..700&family=Manrope:wght@400;500;600;700;800&display=swap" precedence="default" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" precedence="default" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <body className="bg-background text-on-surface antialiased font-body-md text-body-md min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
