import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'SocietySpot: trusted local businesses in your society',
  description: 'Discover and list trusted local businesses in your residential society.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Material Symbols (every <Icon/>) and the Fraunces/Manrope type scale in globals.css
          never get fetched without these — React 19 hoists <link> tags rendered anywhere in the
          tree into the document <head>, so this works the same as putting them in a <head>.
          Stylesheet links specifically need a `precedence` prop or React treats them as a plain
          host element instead of a hoistable resource, and renders them in place (invalid here,
          since these sit outside both <head> and <body>) instead of hoisting them. */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font -- this rule targets the old Pages
          Router (_app.js loads per-page); this is the App Router root layout, the App Router
          equivalent of _document.js, so it's already applied site-wide. */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,400..600&family=Manrope:wght@400;500;600;700;800&display=swap" precedence="default" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" precedence="default" />
      <body className="bg-background text-on-surface antialiased font-body-md text-body-md min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
