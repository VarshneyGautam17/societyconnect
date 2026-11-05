import './globals.css';
import Providers from './providers';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'SocietySpot: trusted local businesses in your society',
  description: 'Discover and list trusted local businesses in your residential society.',
  openGraph: {
    title: 'SocietySpot: trusted local businesses in your society',
    description: 'Discover and list trusted local businesses in your residential society.',
    siteName: 'SocietySpot',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SocietySpot: trusted local businesses in your society',
    description: 'Discover and list trusted local businesses in your residential society.'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400..800;1,400..700&family=Manrope:wght@400;500;600;700;800&display=swap" precedence="default" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" precedence="default" />
      <body className="bg-background text-on-surface antialiased font-body-md text-body-md min-h-screen">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
