/* PWA manifest -- not just "add to home screen": a valid manifest is also one of the signals
   Google's mobile-friendliness/installability checks look for, and it's what lets a shared
   SocietySpot link open as a standalone app-like window instead of a bare browser tab on Android.
   Icons/colors reuse the same brand assets wired up in src/app/layout.js and the icon.png/
   apple-icon.png/favicon.ico file-convention icons (see src/app/icon.png etc.). */
export default function manifest() {
  return {
    name: 'SocietySpot -- trusted local businesses in your society',
    short_name: 'SocietySpot',
    description: 'Discover and list trusted local businesses in your residential society. Browse, WhatsApp or call a neighborhood vendor, or list your own business free.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6fafe',
    theme_color: '#1565c0',
    orientation: 'portrait-primary',
    lang: 'en-IN',
    categories: ['business', 'shopping', 'lifestyle'],
    icons: [
      { src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { src: '/icon.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png', purpose: 'any' }
    ]
  };
}
